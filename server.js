const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const otplib = require("otplib");
const nodemailer = require("nodemailer");const { initDb, q, one, run } = require("./db");

// --------------------------------------------------------------------------
// .env loader (no dependency)
// --------------------------------------------------------------------------
(function () {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    lines.forEach(function (line) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    });
  }
})();

initDb();

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);

const IS_PROD = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 4000;
const ROOT = __dirname;
const SESSION_HOURS = 12;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ssaaxcy-admin";

// --------------------------------------------------------------------------
// GATE 1 — edge hardening: security headers, body caps, rate limits
// --------------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: IS_PROD
  })
);

app.use(express.json({ limit: "100kb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  if (/\.(js|css|html)$/i.test(req.path) || /^\/(api|admin\/api)\//.test(req.path)) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many login attempts. Try again later." }
});

const writeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests. Slow down." }
});

const refRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many lookups. Slow down." }
});

// Origin allow-list for public writes: cross-site scripts cannot submit forms.
app.use(["/api/bookings", "/api/documents", "/api/concierge"], (req, res, next) => {
  const origin = req.headers && req.headers.origin;
  if (origin) {
    try {
      const o = new URL(origin);
      const host = String(req.headers.host || "").toLowerCase();
      if (o.host !== host) {
        secEvent(req, "origin_reject", "Origin " + origin + " rejected");
        return res.status(403).json({ ok: false, error: "Origin not allowed." });
      }
    } catch (e) {
      return res.status(403).json({ ok: false, error: "Origin not allowed." });
    }
  }
  next();
});

// --------------------------------------------------------------------------
// Constants / helpers
// --------------------------------------------------------------------------
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
const LANG_CODES = ["DE", "EN", "TA"];
const PAY_METHODS = ["twint", "bank"];
const MODES = ["video", "on_site"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clientIp(req) {
  const fw = req.headers ? String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() : "";
  return (fw || (req.socket && req.socket.remoteAddress) || "0.0.0.0").slice(0, 64);
}

function secEvent(req, type, detail) {
  try {
    run(
      "INSERT INTO security_events (type, ip, ua, detail) VALUES (?,?,?,?)",
      [String(type || "other").slice(0, 40), clientIp(req), String(req.headers["user-agent"] || "").slice(0, 240), String(detail || "").slice(0, 1000)]
    );
  } catch (e) {}
}

function isBlocked(ip) {
  const r = one("SELECT until FROM ip_blocks WHERE ip = ?", [ip]);
  if (!r) return false;
  const until = new Date(String(r.until).replace(" ", "T") + "Z").getTime();
  if (Date.now() > until) {
    run("DELETE FROM ip_blocks WHERE ip = ?", [ip]);
    return false;
  }
  return true;
}

function blockIp(ip, reason, minutes) {
  const until = new Date(Date.now() + (minutes || 15) * 60000).toISOString().slice(0, 19).replace("T", " ");
  run("INSERT OR REPLACE INTO ip_blocks (ip, reason, until) VALUES (?,?,?)", [ip, String(reason || "rule").slice(0, 200), until]);
}

function unblockIp(ip) {
  run("DELETE FROM ip_blocks WHERE ip = ?", [ip]);
}

function loadSettings() {
  const rows = q("SELECT key, value FROM settings");
  const s = {};
  rows.forEach((r) => (s[r.key] = r.value));
  return s;
}

function loadSetting(key, fallback = "") {
  const r = one("SELECT value FROM settings WHERE key = ?", [key]);
  return r ? r.value : fallback;
}

const SECRET_SETTING_KEYS = new Set(["admin_pw_hash", "admin_2fa_secret"]);

function publicSettings() {
  const s = loadSettings();
  SECRET_SETTING_KEYS.forEach((k) => delete s[k]);
  return s;
}

function NumberSetting(key) {
  const v = Number(loadSetting(key));
  return isNaN(v) ? 0 : v;
}

// --------------------------------------------------------------------------
// Capacity engine — single-interpreter availability
// --------------------------------------------------------------------------
const HOLDING_STATUSES = ["requested", "to_pay", "pending", "confirmed", "paid", "completed"];

function parseHM(s) {
  const m = String(s || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}
function fmtHM(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}
function workDays() {
  return String(loadSetting("work_days", "1,2,3,4,5,6"))
    .split(",")
    .map((d) => Number(d))
    .filter((d) => d >= 0 && d <= 6);
}
function workBounds() {
  return { start: parseHM(loadSetting("work_start", "08:30")) || 510, end: parseHM(loadSetting("work_end", "16:30")) || 990 };
}
function bufferFor(mode) {
  return mode === "on_site" ? NumberSetting("visit_buffer_min") || 60 : NumberSetting("video_buffer_min") || 15;
}
function pauseEnabled() {
  return loadSetting("pause_bookings", "0") === "1";
}
function utcToday() {
  return new Date().toISOString().slice(0, 10);
}
function minBookingDate() {
  const d = new Date(utcToday() + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + (NumberSetting("lead_days") || 2));
  return d.toISOString().slice(0, 10);
}
function dayInfo(dateStr) {
  const day = new Date(dateStr + "T00:00:00Z").getUTCDay();
  const reason = [];
  if (!workDays().includes(day)) reason.push("closed_weekend");
  const ov = one("SELECT reason FROM availability_overrides WHERE date = ?", [dateStr]);
  if (ov) reason.push("override");
  if (pauseEnabled()) reason.push("paused");
  return { closed: reason.length > 0, reasons: reason, day };
}
function activeBookings(dateStr) {
  return q(
    "SELECT date, time, duration, mode, status FROM bookings WHERE date = ? AND status IN ('requested','to_pay','pending','confirmed','paid','completed')",
    [dateStr]
  );
}
function occupiedIntervals(dateStr) {
  return activeBookings(dateStr).map(function (b) {
    const s = parseHM(b.time);
    if (s === null) return null;
    const buf = bufferFor(b.mode);
    return { from: s - buf, to: s + (Number(b.duration) || 60) + buf };
  }).filter(Boolean);
}
function isBusy(dateStr, startMin, durMins) {
  const iv = occupiedIntervals(dateStr);
  const a = startMin, b = startMin + durMins;
  for (const x of iv) {
    if (a < x.to && b > x.from) return true;
  }
  return false;
}
function freeSlots(dateStr, mode, durMins) {
  const info = dayInfo(dateStr);
  if (info.closed) return [];
  if (dateStr < minBookingDate()) return [];
  const w = workBounds();
  const dur = Number(durMins) || 60;
  const out = [];
  for (let t = w.start; t + dur <= w.end; t += 30) {
    if (!isBusy(dateStr, t, dur)) out.push(fmtHM(t));
  }
  return out;
}
function nextFree(mode, durMins) {
  const from = minBookingDate();
  const d = new Date(from + "T00:00:00Z");
  for (let i = 0; i < 21; i++) {
    const ds = d.toISOString().slice(0, 10);
    const slots = freeSlots(ds, mode, durMins);
    if (slots.length) return { date: ds, time: slots[0] };
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return { date: null, time: null };
}
function bookingBlock(dateStr, timeStr, mode, durMins) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return { ok: false, status: 400, error: "Invalid date." };
  if (pauseEnabled()) return { ok: false, status: 409, error: "We are not taking new appointments right now.", nextFree: nextFree(mode, durMins) };
  const info = dayInfo(dateStr);
  if (info.closed) {
    if (info.reasons.includes("override")) return { ok: false, status: 409, error: "This day is no longer available.", nextFree: nextFree(mode, durMins) };
    return { ok: false, status: 400, error: "This day is not a working day." };
  }
  if (dateStr < minBookingDate()) return { ok: false, status: 400, error: "Appointments must be requested at least " + (NumberSetting("lead_days") || 2) + " days in advance." };
  const t = parseHM(timeStr);
  if (t === null) return { ok: false, status: 400, error: "Invalid time." };
  const dur = Number(durMins) || 60;
  const w = workBounds();
  if (t < w.start || t + dur > w.end) return { ok: false, status: 400, error: "This time is outside working hours." };
  if (isBusy(dateStr, t, dur)) {
    return { ok: false, status: 409, error: "This time was just taken by someone else.", nextFree: nextFree(mode, dur) };
  }
  return { ok: true };
}

function genRef(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 3; attempt++) {
    let out = "";
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    const ref = (prefix || "SSX") + "-" + out;
    const dup = one("SELECT ref FROM bookings WHERE ref = ? UNION ALL SELECT ref FROM document_requests WHERE ref = ? UNION ALL SELECT ref FROM concierge WHERE ref = ?", [ref, ref, ref]);
    if (!dup) return ref;
  }
  return (prefix || "SSX") + "-" + Date.now().toString(36).toUpperCase().slice(-6);
}

function parseFilters(table, query, allowed) {
  const where = [];
  const params = [];
  allowed.forEach((k) => {
    if (query[k] && query[k] !== "") {
      where.push(k + " = ?");
      params.push(query[k]);
    }
  });
  return { sql: where.length ? " WHERE " + where.join(" AND ") : "", params };
}

function langName(code) {
  const r = one("SELECT name FROM languages WHERE code = ?", [code]);
  return r ? r.name : "";
}

// --------------------------------------------------------------------------
// GATE 2 — identity: admin sessions (hashed in DB), bcrypt, CSRF, 2FA
// --------------------------------------------------------------------------
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function requestFingerprint(req) {
  const ua = String(req.headers["user-agent"] || "").slice(0, 240);
  const ip = clientIp(req);
  return { ua: crypto.createHash("sha256").update(ua).digest("hex").slice(0, 32), ip };
}

function adminAuthorized(req) {
  const token = (req.cookies && req.cookies.ssx_session) || (req.headers.authorization ? String(req.headers.authorization).replace(/^Bearer /, "") : "");
  if (!token) return null;
  const hash = hashToken(token);
  const s = one("SELECT * FROM sessions WHERE token_hash = ?", [hash]);
  if (!s) return null;
  const exp = new Date(String(s.expires_at).replace(" ", "T")).getTime();
  if (Date.now() > exp) {
    run("DELETE FROM sessions WHERE token_hash = ?", [hash]);
    return null;
  }
  const fp = requestFingerprint(req);
  if (s.ua_hash && s.ua_hash !== fp.ua) {
    secEvent(req, "session_mismatch", "Session user-agent mismatch; rejected");
    return null;
  }
  if (s.ip && s.ip !== fp.ip) {
    secEvent(req, "session_ip_shift", "Session IP changed from " + s.ip + " to " + fp.ip);
  }
  run("UPDATE sessions SET last_seen = ? WHERE token_hash = ?", [now(), hash]);
  return s;
}

function issueSession(req, res) {
  const token = crypto.randomBytes(32).toString("hex");
  const csrf = crypto.randomBytes(18).toString("base64url");
  const fp = requestFingerprint(req);
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600000).toISOString().slice(0, 19).replace("T", " ");
  run("INSERT INTO sessions (token_hash, created_at, expires_at, last_seen, csrf_token, ua_hash, ip, kind) VALUES (?,?,?,?,?,?,?,?)",
    [hashToken(token), now(), expiresAt, now(), csrf, fp.ua, fp.ip, "admin"]);
  res.cookie("ssx_session", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    maxAge: SESSION_HOURS * 3600000
  });
  return { csrf };
}

function destroySession(req, res) {
  const token = (req.cookies && req.cookies.ssx_session) || "";
  if (token) run("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
  res.clearCookie("ssx_session", { path: "/" });
  res.clearCookie("ssx_2fa_token", { path: "/admin" });
}

function sessionCsrf(req) {
  const token = (req.cookies && req.cookies.ssx_session) || "";
  if (!token) return "";
  const s = one("SELECT csrf_token FROM sessions WHERE token_hash = ?", [hashToken(token)]);
  return s ? String(s.csrf_token || "") : "";
}

function attachCsrf(res) {
  const token = (res.req && res.req.cookies && res.req.cookies.ssx_session) || "";
  const s = token ? one("SELECT csrf_token FROM sessions WHERE token_hash = ?", [hashToken(token)]) : null;
  res.setHeader("X-CSRF-Token", s ? s.csrf_token : "");
}

function requireAdmin(req, res, next) {
  const s = adminAuthorized(req);
  if (!s) {
    secEvent(req, "unauth_api", "Rejected " + req.method + " " + req.originalUrl.slice(0, 200));
    return res.status(401).json({ ok: false, error: "Unauthorized. Please log in." });
  }
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    const sent = req.headers["x-csrf-token"] || "";
    if (sent !== String(s.csrf_token || "")) {
      secEvent(req, "csrf_fail", "CSRF token mismatch on " + req.method + " " + req.originalUrl.slice(0, 200));
      return res.status(403).json({ ok: false, error: "CSRF check failed." });
    }
  }
  next();
}

function admin2faEnabled() {
  return loadSetting("admin_2fa", "0") === "1";
}

function ensureAdminSeed() {
  if (IS_PROD && !process.env.ADMIN_PASSWORD) {
    console.error("[security] Refusing to start: set ADMIN_PASSWORD in .env for production.");
    process.exit(1);
  }
  const existing = loadSetting("admin_pw_hash", "");
  if (!existing) {
    run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["admin_pw_hash", bcrypt.hashSync(ADMIN_PASSWORD, 12)]);
  }
}

function verifyPassword(pw) {
  const hash = loadSetting("admin_pw_hash", "");
  if (!hash) return false;
  try {
    return bcrypt.compareSync(String(pw || ""), hash);
  } catch (e) {
    return false;
  }
}

function lockCheck(ip) {
  const max = NumberSetting("lockout_max") || 5;
  const r = one("SELECT COUNT(*) c FROM login_attempts WHERE ip = ? AND ok = 0 AND created_at >= datetime('now','-15 minutes')", [ip]);
  if (r && r.c >= max) {
    blockIp(ip, max + " failed logins in 15 minutes", NumberSetting("lockout_minutes") || 15);
    return true;
  }
  return false;
}

function logLogin(ip, ok) {
  run("INSERT INTO login_attempts (ip, ok) VALUES (?,?)", [ip, ok ? 1 : 0]);
}

// --------------------------------------------------------------------------
// Email helper (auto-reply generation) — graceful offline fallback
// --------------------------------------------------------------------------
function confirmationHtml(title, lines) {
  const rows = (lines || [])
    .map(([k, v]) => "<tr><td style='padding:6px 0;color:#6d7484;min-width:150px;'>" + k + "</td><td style='padding:6px 0;font-weight:600;'>" + v + "</td></tr>")
    .join("");
  return (
    '<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#16181d;">' +
    '<div style="background:#16181d;color:#fff;padding:22px 26px;border-radius:14px 14px 0 0;">' +
    '<span style="font-weight:800;letter-spacing:0.05em;">Ssaaxcy Solutions</span>' +
    '<span style="float:right;color:#e4c77e;font-size:12px;">Confirmation</span></div>' +
    '<div style="border:1px solid #e5e0d6;padding:26px;border-radius:0 0 14px 14px;">' +
    "<h2 style='margin:0 0 14px;'>" + title + "</h2>" +
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">' + rows + "</table>" +
    '<p style="margin-top:22px;color:#6d7484;font-size:13px;">Questions? Reply to this email or call us — we are happy to help.</p>' +
    "</div></div>"
  );
}

function sendMail(to, subject, html) {
  return new Promise((resolve) => {
    const host = loadSetting("smtp_host", "");
    if (!to || !host) {
      const why = !to ? "no recipient" : "smtp not configured";
      console.log("[mail-deferred] " + why + " :: " + subject + " → " + to);
      return resolve({ sent: false });
    }
    try {
      const transport = nodemailer.createTransport({
        host,
        port: Number(loadSetting("smtp_port", "587")),
        secure: loadSetting("smtp_secure", "0") === "1",
        auth: { user: loadSetting("smtp_user", ""), pass: loadSetting("smtp_pass", "") }
      });
      transport.sendMail(
        {
          from: loadSetting("smtp_from", "") || ('Ssaaxcy Solutions <' + loadSetting("support_email", "hello@ssaaxcy.ch") + ">"),
          to,
          subject,
          html
        },
        (err) => {
          if (err) {
            console.error("[mail-error] " + err.message);
            return resolve({ sent: false });
          }
          console.log("[mail-sent] " + to + " :: " + subject);
          resolve({ sent: true });
        }
      );
    } catch (e) {
      console.error("[mail-error] " + e.message);
      resolve({ sent: false });
    }
  });
}

// --------------------------------------------------------------------------
// GATE 3 — deception & auto-fences
// --------------------------------------------------------------------------
app.use("/api", (req, res, next) => {
  if (isBlocked(clientIp(req))) return res.status(403).json({ ok: false, error: "Access restricted." });
  next();
});

// honeypot: bots fill hidden fields humans never see -> silent discard + log
app.use(["/api/bookings", "/api/concierge", "/api/documents"], (req, res, next) => {
  const hp = req.body ? String(req.body.website || req.body.company_website || "").trim() : "";
  if (hp) {
    secEvent(req, "honeypot", "Honeypot field populated; request discarded");
    return res.json({ ok: true, simulated: true });
  }
  next();
});

// trap paths that scanners probe — log them, answer nothing
app.use(["/wp-admin", "/wp-login.php", "/config.php", "/.env", "/.git", "/phpmyadmin", "/api/console", "/admin/config", "/shell"], (req, res) => {
  secEvent(req, "trap_hit", "Trap path accessed: " + req.originalUrl.slice(0, 300));
  res.status(404).send("Not found");
});

// ============================================================== Admin auth routes
app.post("/admin/api/login", loginRateLimit, (req, res) => {
  const ip = clientIp(req);
  if (isBlocked(ip)) return res.status(403).json({ ok: false, error: "Access restricted." });
  const ok = verifyPassword(req.body && req.body.password);
  logLogin(ip, ok);
  if (!ok) {
    const blocked = lockCheck(ip);
    if (blocked) secEvent(req, "brute_lockout", "IP auto-blocked after repeated login failures");
    return res.status(401).json({ ok: false, error: "Invalid password." });
  }
  if (IS_PROD && !admin2faEnabled()) {
    return res.status(403).json({ ok: false, error: "Two-step verification must be enabled before signing in." });
  }
  res.clearCookie("ssx_2fa_token", { path: "/admin" });
  if (admin2faEnabled()) {
    const preToken = crypto.randomBytes(24).toString("hex");
    run("INSERT INTO sessions (token_hash, created_at, expires_at, last_seen, csrf_token, ua_hash, ip, kind) VALUES (?,?,?,?,?,?,?,?)",
      [hashToken(preToken), now(), new Date(Date.now() + 10 * 60000).toISOString().slice(0, 19).replace("T", " "), now(), "", "", "", "pre2fa"]);
    res.cookie("ssx_2fa_token", preToken, { path: "/admin", httpOnly: true, sameSite: "lax", secure: IS_PROD, maxAge: 10 * 60000 });
    return res.json({ ok: true, need2fa: true });
  }
  const s = issueSession(req, res);
  res.json({ ok: true, csrf: s.csrf, expires: SESSION_HOURS, mustChange: loadSetting("admin_pw_changed", "0") !== "1" });
});

app.post("/admin/api/login2fa", loginRateLimit, (req, res) => {
  const pre = (req.cookies && req.cookies.ssx_2fa_token) || "";
  if (!pre) return res.status(401).json({ ok: false, error: "2FA session expired. Sign in again." });
  const preHash = hashToken(pre);
  const preS = one("SELECT * FROM sessions WHERE token_hash = ?", [preHash]);
  if (!preS || preS.kind !== "pre2fa") return res.status(401).json({ ok: false, error: "2FA session expired. Sign in again." });
  const secret = loadSetting("admin_2fa_secret", "");
  if (!secret) return res.status(401).json({ ok: false, error: "2FA not configured." });
  const code = String(req.body && req.body.code || "").trim();
  const valid = totpCheck(code, secret);
  if (!valid) {
    logLogin(clientIp(req), false);
    return res.status(401).json({ ok: false, error: "Invalid code." });
  }
  run("DELETE FROM sessions WHERE token_hash = ?", [preHash]);
  res.clearCookie("ssx_2fa_token", { path: "/admin" });
  const s = issueSession(req, res);
  res.json({ ok: true, csrf: s.csrf, expires: SESSION_HOURS, mustChange: loadSetting("admin_pw_changed", "0") !== "1" });
});

app.post("/admin/api/password", requireAdmin, (req, res) => {
  const cur = String((req.body && req.body.current) || "");
  const next = String((req.body && req.body.next) || "");
  if (!verifyPassword(cur)) return res.status(401).json({ ok: false, error: "Current password is wrong." });
  if (next.length < 12) return res.status(400).json({ ok: false, error: "New password must be at least 12 characters." });
  if (!/[A-Za-z]/.test(next) || !/[0-9]/.test(next)) return res.status(400).json({ ok: false, error: "New password must contain letters and digits." });
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["admin_pw_hash", bcrypt.hashSync(next, 12)]);
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["admin_pw_changed", "1"]);
  run("DELETE FROM sessions");
  secEvent(req, "password_change", "Admin password changed; all sessions revoked");
  res.json({ ok: true, relogin: true });
});

app.post("/admin/api/logout", (req, res) => {
  destroySession(req, res);
  res.json({ ok: true });
});

app.get("/admin/api/me", requireAdmin, (req, res) => {
  attachCsrf(res);
  res.json({ ok: true, user: { role: "admin", twofa: admin2faEnabled() }, mustChange: loadSetting("admin_pw_changed", "0") !== "1", settings: publicSettings() });
});

function totpCheck(code, secret) {
  try {
    return !!otplib.verifySync({ secret: String(secret), token: String(code).trim() }).valid;
  } catch (e) {
    return false;
  }
}

// 2FA management
app.get("/admin/api/2fa/setup", requireAdmin, (req, res) => {
  let secret = loadSetting("admin_2fa_secret", "");
  if (!secret) {
    secret = otplib.generateSecret();
    run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["admin_2fa_secret", secret]);
  }
  const url = otplib.generateURI({ issuer: "Ssaaxcy Solutions", label: "admin", secret });
  res.json({ ok: true, secret, otpauth: url });
});

app.post("/admin/api/2fa/enable", requireAdmin, (req, res) => {
  const secret = loadSetting("admin_2fa_secret", "");
  if (!totpCheck(req.body && req.body.code, secret)) return res.status(400).json({ ok: false, error: "Wrong 6-digit code." });
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["admin_2fa", "1"]);
  res.json({ ok: true });
});

app.post("/admin/api/2fa/disable", requireAdmin, (req, res) => {
  const secret = loadSetting("admin_2fa_secret", "");
  if (!totpCheck(req.body && req.body.code, secret)) return res.status(400).json({ ok: false, error: "Wrong 6-digit code." });
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["admin_2fa", "0"]);
  res.json({ ok: true });
});

// Protect anything under /admin except the login page + login APIs
app.use("/admin", (req, res, next) => {
  if (req.path === "/login.html" || req.path === "/login" || req.path === "/login2fa" || req.path.startsWith("/css/") || req.path.startsWith("/js/")) {
    return next();
  }
  if (adminAuthorized(req)) return next();
  res.redirect("/admin/login.html");
});

app.get("/admin", (req, res) => res.redirect(adminAuthorized(req) ? "/admin/dashboard.html" : "/admin/login.html"));

// ============================================================== Public API
const SVC_FIELDS = "id, name, icon, price, type, desc, active, sort";
const LANG_FIELDS = "code, name, native";

app.get("/api/catalog", (req, res) => {
  res.json({
    ok: true,
    settings: publicSettings(),
    services: q("SELECT " + SVC_FIELDS + " FROM services WHERE active = 1 ORDER BY sort", []),
    languages: q("SELECT " + LANG_FIELDS + " FROM languages ORDER BY name", []),
    durations: q("SELECT mins, label, note, factor FROM durations ORDER BY mins", []),
    docTypes: q("SELECT id, icon, name_en, name_de, name_ta FROM doc_types WHERE active = 1 ORDER BY sort", []),
    contact: {
      whatsapp: loadSetting("whatsapp", ""),
      email: loadSetting("support_email", ""),
      phone: loadSetting("support_phone", ""),
      instagram: loadSetting("instagram", ""),
      facebook: loadSetting("facebook", ""),
      linkedin: loadSetting("linkedin", "")
    },
    capacity: {
      workStart: loadSetting("work_start", "08:30"),
      workEnd: loadSetting("work_end", "16:30"),
      workDays: String(loadSetting("work_days", "1,2,3,4,5,6")).split(",").map(Number),
      leadDays: NumberSetting("lead_days") || 2,
      minDate: minBookingDate(),
      paused: pauseEnabled()
    }
  });
});

// Public availability — a date's free slots, plus the next free moment
app.get("/api/availability", (req, res) => {
  const date = String(req.query.date || "");
  const mode = MODES.includes(req.query.mode) ? req.query.mode : "video";
  const dur = Number(req.query.duration) || 60;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ ok: false, error: "date required (YYYY-MM-DD)." });
  const info = dayInfo(date);
  const min = minBookingDate();
  const slots = freeSlots(date, mode, dur);
  res.json({
    ok: true,
    date,
    mode,
    duration: dur,
    closed: info.closed || date < min,
    reasons: info.reasons,
    beforeLead: date < min,
    leadDays: NumberSetting("lead_days") || 2,
    slots,
    nextFree: nextFree(mode, dur)
  });
});

app.get("/api/availability/range", (req, res) => {
  const from = String(req.query.from || utcToday());
  const days = Math.min(Number(req.query.days) || 14, 60);
  const mode = MODES.includes(req.query.mode) ? req.query.mode : "video";
  const dur = Number(req.query.duration) || 60;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) return res.status(400).json({ ok: false, error: "from required (YYYY-MM-DD)." });
  const d = new Date(from + "T00:00:00Z");
  const out = [];
  for (let i = 0; i < days; i++) {
    const ds = d.toISOString().slice(0, 10);
    const info = dayInfo(ds);
    out.push({ date: ds, closed: info.closed, reasons: info.reasons, slots: freeSlots(ds, mode, dur) });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  res.json({ ok: true, mode, duration: dur, days: out, nextFree: nextFree(mode, dur) });
});

app.post("/api/documents", writeRateLimit, (req, res) => {
  const b = req.body || {};
  const docType = one("SELECT * FROM doc_types WHERE id = ? AND active = 1", [String(b.doc_type || "").slice(0, 40)]);
  if (!docType) return res.status(400).json({ ok: false, error: "Unknown document type." });
  if (!EMAIL_RE.test(String(b.email || ""))) return res.status(400).json({ ok: false, error: "Valid email required." });
  if (!LANG_CODES.includes(b.from_lang) || !LANG_CODES.includes(b.to_lang)) return res.status(400).json({ ok: false, error: "Invalid language pair." });
  if (b.consent !== true && b.consent !== "1" && b.consent !== 1) return res.status(400).json({ ok: false, error: "Privacy consent is required." });
  const mode = ["translate", "fill", "both"].includes(b.mode) ? b.mode : "translate";
  const fields = JSON.stringify({
    text: String(b.fields || "").slice(0, 4000),
    last_minute: b.last_minute ? "Yes" : "No",
    urgent: b.urgent ? "Yes" : "No"
  });
  const ref = genRef("SSXD");
  run(
    `INSERT INTO document_requests
     (ref, doc_type, doc_type_name, from_lang, to_lang, mode, fields, notes, customer, email, phone, ip, status, consent)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'received',1)`,
    [
      ref, docType.id, docType.name_en, b.from_lang, b.to_lang, mode, fields,
      String(b.notes || "").slice(0, 2000),
      String(b.customer || "").slice(0, 120),
      String(b.email || "").slice(0, 160),
      String(b.phone || "").slice(0, 40),
      clientIp(req)
    ]
  );
  sendMail(b.email, "Ssaaxcy Solutions — document request " + ref, confirmationHtml("We received your document request", [
    ["Reference", ref],
    ["Document", docType.name_en],
    ["Language", b.from_lang + " → " + b.to_lang],
    ["Next step", "Our team completes your document within 2 working days and emails it back to you."]
  ]));
  res.json({ ok: true, ref });
});

// Public document lookup — only non-personal fields
app.get("/api/documents/:ref", refRateLimit, (req, res) => {
  const d = one("SELECT ref, doc_type, doc_type_name, from_lang, to_lang, mode, status FROM document_requests WHERE ref = ? AND status != 'blocked'", [req.params.ref]);
  if (!d) return res.status(404).json({ ok: false, error: "Not found." });
  res.json({ ok: true, request: d });
});

app.post("/api/bookings", writeRateLimit, (req, res) => {
  const b = req.body || {};
  if (!LANG_CODES.includes(b.language_code) || !b.service_id || !b.date || !b.time || !MODES.includes(b.mode)) {
    return res.status(400).json({ ok: false, error: "language, service, date, time and mode are required." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || !/^\d{2}:\d{2}$/.test(b.time)) {
    return res.status(400).json({ ok: false, error: "Invalid date or time." });
  }
  if (!EMAIL_RE.test(String(b.email || ""))) return res.status(400).json({ ok: false, error: "Valid email required." });
  if (b.consent !== true && b.consent !== "1" && b.consent !== 1) return res.status(400).json({ ok: false, error: "Privacy consent is required." });
  const service = one("SELECT * FROM services WHERE id = ? AND active = 1", [b.service_id]);
  const lang = one("SELECT * FROM languages WHERE code = ?", [b.language_code]);
  const dur = one("SELECT * FROM durations WHERE mins = ?", [Number(b.duration) || 60]);
  if (!service || !lang) return res.status(400).json({ ok: false, error: "Invalid service or language." });

  const block = bookingBlock(b.date, b.time, b.mode, dur ? dur.mins : 60);
  if (!block.ok) {
    return res.status(block.status).json({ ok: false, error: block.error, nextFree: block.nextFree });
  }

  const travelFee = NumberSetting("travel_fee");
  const canton = String(b.canton || "").trim();
  const cantonSurcharge = NumberSetting("canton_surcharge");
  const base = Number(service.price) || 0;
  const durationPrice = Math.round(base * (dur ? dur.factor : 1) * 100) / 100;
  const surcharge = canton && canton !== "Zurich"
    ? Math.round(100 * (durationPrice * (cantonSurcharge / 100))) / 100
    : 0;
  const fee = (b.mode === "on_site" ? travelFee : 0) + surcharge;
  const total = Math.round(100 * (durationPrice + fee)) / 100;

  const ref = genRef(loadSetting("ref_prefix", "SSX"));
  const method = PAY_METHODS.includes(b.method) ? b.method : "twint";

  run(
    `INSERT INTO bookings
     (ref, language_code, language_name, service_id, service_name, date, time, duration,
      mode, address, customer, email, phone, notes, base_price, duration_price, fee, total, method, status, canton, consent)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
    [
      ref, lang.code, lang.name, service.id, service.name, b.date, b.time, dur.mins,
      b.mode, String(b.address || "").slice(0, 240), String(b.customer || "").slice(0, 120),
      String(b.email || "").slice(0, 160), String(b.phone || "").slice(0, 40), String(b.notes || "").slice(0, 2000),
      base, durationPrice, fee, total, method, "requested", canton.slice(0, 60)
    ]
  );
  run("INSERT INTO payments (ref, method, amount, status) VALUES (?,?,?,?)", [ref, method, total, "unpaid"]);
  sendMail(b.email, "Ssaaxcy Solutions — appointment request " + ref, confirmationHtml("We received your appointment request", [
    ["Reference", ref],
    ["Service", service.name],
    ["Language", lang.name],
    ["When", b.date + " at " + b.time],
    ["Mode", b.mode === "on_site" ? "On-site" : "Video"],
    ["Estimated total", "CHF " + total.toFixed(2)],
    ["Next step", "We will call you shortly to confirm your appointment."]
  ]));
  res.json({
    ok: true, ref, language: lang.name, service: service.name, date: b.date, time: b.time,
    mode: b.mode, duration: dur ? dur.mins : 60, base_price: base, duration_price: durationPrice,
    fee, surcharge, canton, total, method, status: "requested"
  });
});

// Public booking lookup — returns only what the confirmation page needs (no contact PII)
app.get("/api/bookings/:ref", refRateLimit, (req, res) => {
  const b = one(
    "SELECT ref, language_code, language_name, service_id, service_name, date, time, duration, mode, address, total, method, status, cancel_reason FROM bookings WHERE ref = ?",
    [req.params.ref]
  );
  if (!b) return res.status(404).json({ ok: false, error: "Booking not found." });
  const p = one("SELECT status pay_status FROM payments WHERE ref = ? ORDER BY id DESC LIMIT 1", [req.params.ref]);
  res.json({ ok: true, booking: Object.assign({}, b, { pay_status: p ? p.pay_status : (b.status === "paid" ? "paid" : "unpaid") }) });
});

app.post("/api/concierge", writeRateLimit, (req, res) => {
  const c = req.body || {};
  if (!c.service || !c.detail || !LANG_CODES.includes(c.language_code || "")) {
    return res.status(400).json({ ok: false, error: "service, language and detail are required." });
  }
  if (c.consent !== true && c.consent !== "1" && c.consent !== 1) {
    return res.status(400).json({ ok: false, error: "Privacy consent is required." });
  }
  const ref = genRef("SSX");
  run(
    `INSERT INTO concierge (ref, service, title, language_code, language_name, detail, customer, email, phone, files, status, consent)
     VALUES (?,?,?,?,?,?,?,?,?,?,'new',1)`,
    [ref, String(c.service).slice(0, 30), String(c.title || "").slice(0, 200), c.language_code, langName(c.language_code),
      String(c.detail).slice(0, 4000), String(c.customer || "").slice(0, 120), String(c.email || "").slice(0, 160),
      String(c.phone || "").slice(0, 40), String(c.files || "").slice(0, 500)]
  );
  sendMail(c.email, "Ssaaxcy Solutions — concierge request (" + ref + ")", confirmationHtml("We received your concierge request", [
    ["Reference", ref],
    ["Service", c.service],
    ["Language", c.language_code],
    ["Next step", "Our team contacts you within one working day."]
  ]));
  res.json({ ok: true, ref });
});

// ============================================================== Admin data API
const allowedStatuses = ["requested", "to_pay", "pending", "confirmed", "paid", "completed", "cancelled", "refunded"];

// ---- Admin availability calendar ----
app.get("/admin/api/availability", requireAdmin, (req, res) => {
  const from = String(req.query.from || utcToday());
  const days = Math.min(Number(req.query.days) || 35, 93);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) return res.status(400).json({ ok: false, error: "from required (YYYY-MM-DD)." });
  const overrides = q("SELECT date, reason FROM availability_overrides WHERE date >= ?", [from]);
  const ovMap = {};
  overrides.forEach((o) => { ovMap[o.date] = o.reason; });
  const bookings = q(
    "SELECT date, time, duration, mode, status, ref FROM bookings WHERE date >= ? AND date < date(?, '+' || ? || ' days') AND status IN ('requested','to_pay','pending','confirmed','paid','completed') ORDER BY date, time",
    [from, from, String(days)]
  );
  const byDate = {};
  bookings.forEach((b) => {
    (byDate[b.date] = byDate[b.date] || []).push(b);
  });
  const d = new Date(from + "T00:00:00Z");
  const out = [];
  for (let i = 0; i < days; i++) {
    const ds = d.toISOString().slice(0, 10);
    const info = dayInfo(ds);
    out.push({ date: ds, closed: info.closed, reasons: info.reasons, overrideReason: ovMap[ds] || "", bookings: byDate[ds] || [] });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  res.json({ ok: true, from, days: out, settings: { workStart: loadSetting("work_start", "08:30"), workEnd: loadSetting("work_end", "16:30"), workDays: workDays(), leadDays: NumberSetting("lead_days") || 2, visitBuffer: NumberSetting("visit_buffer_min") || 60, videoBuffer: NumberSetting("video_buffer_min") || 15, paused: pauseEnabled() } });
});

app.post("/admin/api/availability/override", requireAdmin, (req, res) => {
  const date = String((req.body && req.body.date) || "");
  const reason = String((req.body && req.body.reason) || "Blocked by admin").slice(0, 200);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ ok: false, error: "date required (YYYY-MM-DD)." });
  run("INSERT OR REPLACE INTO availability_overrides (date, reason) VALUES (?,?)", [date, reason]);
  secEvent(req, "availability_override", "Day blocked: " + date);
  res.json({ ok: true });
});

app.delete("/admin/api/availability/override/:date", requireAdmin, (req, res) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) return res.status(400).json({ ok: false, error: "Invalid date." });
  run("DELETE FROM availability_overrides WHERE date = ?", [req.params.date]);
  secEvent(req, "availability_unoverride", "Day unblocked: " + req.params.date);
  res.json({ ok: true });
});

app.patch("/admin/api/availability/pause", requireAdmin, (req, res) => {
  const v = req.body && req.body.paused ? "1" : "0";
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["pause_bookings", v]);
  secEvent(req, "availability_pause", v === "1" ? "New bookings paused" : "New bookings reopened");
  res.json({ ok: true, paused: v === "1" });
});

app.get("/admin/api/dashboard", requireAdmin, (req, res) => {
  const s = {
    bookings: one("SELECT COUNT(*) c FROM bookings").c,
    pending: one("SELECT COUNT(*) c FROM bookings WHERE status='pending'").c,
    confirmed: one("SELECT COUNT(*) c FROM bookings WHERE status='confirmed'").c,
    revenue: one("SELECT COALESCE(SUM(total),0) t FROM bookings WHERE status IN ('confirmed','pending')").t || 0,
    concierge: one("SELECT COUNT(*) c FROM concierge WHERE status='new'").c,
    interpreters: one("SELECT COUNT(*) c FROM interpreters WHERE active=1").c,
    documents: one("SELECT COUNT(*) c FROM document_requests WHERE status='received'").c
  };
  const topServices = q(`SELECT service_name, COUNT(*) c FROM bookings GROUP BY service_name ORDER BY c DESC LIMIT 6`);
  const topLanguages = q(`SELECT language_name, COUNT(*) c FROM bookings GROUP BY language_name ORDER BY c DESC LIMIT 6`);
  const upcoming = q(`SELECT * FROM bookings WHERE status IN ('pending','confirmed') AND date >= date('now') ORDER BY date ASC, time ASC LIMIT 6`);
  const byWeek = q(`SELECT substr(created_at,1,10) d, COUNT(*) c, COALESCE(SUM(total),0) total FROM bookings GROUP BY d ORDER BY d DESC LIMIT 10`);
  res.json({ ok: true, s, topServices, topLanguages, upcoming, byWeek });
});

app.get("/admin/api/bookings", requireAdmin, (req, res) => {
  const f = parseFilters("bookings", req.query, ["status", "mode"]);
  const rows = q("SELECT * FROM bookings" + f.sql + " ORDER BY date DESC, id DESC", f.params);
  res.json({ ok: true, bookings: rows });
});

app.patch("/admin/api/bookings/:id", requireAdmin, (req, res) => {
  const b = req.body || {};
  const set = [];
  const params = [];
  ["status", "mode", "date", "time", "duration", "address", "customer", "email", "phone", "notes", "method", "cancel_reason"].forEach((k) => {
    if (b[k] !== undefined) { set.push(k + " = ?"); params.push(String(b[k])); }
  });
  if (!set.length) return res.status(400).json({ ok: false, error: "Nothing to update." });
  params.push(req.params.id);
  run("UPDATE bookings SET " + set.join(", ") + " WHERE id = ?", params);
  const booking = one("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
  if (booking && b.status) {
    const st = String(b.status);
    if (!allowedStatuses.includes(st)) return res.status(400).json({ ok: false, error: "Invalid status." });
    if (["paid", "refunded", "cancelled", "pending", "to_pay", "completed", "confirmed"].includes(st)) {
      run("UPDATE payments SET status = ? WHERE ref = ?", [st, booking.ref]);
    }
    secEvent(req, "booking_status", booking.ref + " → " + st);
  }
  res.json({ ok: true });
});

app.delete("/admin/api/bookings/:id", requireAdmin, (req, res) => {
  const booking = one("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
  run("DELETE FROM payments WHERE ref = ?", [booking ? booking.ref : req.params.id]);
  run("DELETE FROM bookings WHERE id = ?", [req.params.id]);
  if (booking) secEvent(req, "booking_erased", booking.ref + " (GDPR erasure)");
  res.json({ ok: true });
});

app.get("/admin/api/concierge", requireAdmin, (req, res) => {
  const f = parseFilters("concierge", req.query, ["status", "service"]);
  const rows = q("SELECT * FROM concierge" + f.sql + " ORDER BY id DESC", f.params);
  res.json({ ok: true, items: rows });
});

app.patch("/admin/api/concierge/:id", requireAdmin, (req, res) => {
  const s = req.body && req.body.status;
  if (!s || !["new", "handled", "closed"].includes(s)) return res.status(400).json({ ok: false, error: "status required" });
  run("UPDATE concierge SET status = ? WHERE id = ?", [s, req.params.id]);
  res.json({ ok: true });
});

app.delete("/admin/api/concierge/:id", requireAdmin, (req, res) => {
  run("DELETE FROM concierge WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/admin/api/interpreters", requireAdmin, (req, res) => {
  res.json({ ok: true, items: q("SELECT * FROM interpreters ORDER BY assignments DESC") });
});

app.post("/admin/api/interpreters", requireAdmin, (req, res) => {
  const b = req.body || {};
  run(`INSERT INTO interpreters (name, phone, languages, zones, rating, assignments, active) VALUES (?,?,?,?,?,?,?)`,
    [String(b.name || "").slice(0, 120), String(b.phone || "").slice(0, 40), String(b.languages || "").slice(0, 60),
      String(b.zones || "").slice(0, 120), Number(b.rating) || 0, Number(b.assignments) || 0, b.active ? 1 : 0]);
  res.json({ ok: true });
});

app.patch("/admin/api/interpreters/:id", requireAdmin, (req, res) => {
  const b = req.body || {};
  run(`UPDATE interpreters SET name=?, phone=?, languages=?, rating=?, assignments=?, active=? WHERE id=?`,
    [String(b.name || "").slice(0, 120), String(b.phone || "").slice(0, 40), String(b.languages || "").slice(0, 60),
      Number(b.rating) || 0, Number(b.assignments) || 0, b.active ? 1 : 0, req.params.id]);
  res.json({ ok: true });
});

app.delete("/admin/api/interpreters/:id", requireAdmin, (req, res) => {
  run("DELETE FROM interpreters WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/admin/api/catalog", requireAdmin, (req, res) => {
  attachCsrf(res);
  res.json({
    ok: true,
    settings: publicSettings(),
    services: q("SELECT * FROM services ORDER BY sort"),
    languages: q("SELECT * FROM languages ORDER BY code"),
    durations: q("SELECT * FROM durations ORDER BY mins"),
    docTypes: q("SELECT * FROM doc_types ORDER BY sort")
  });
});

app.patch("/admin/api/services/:id", requireAdmin, (req, res) => {
  const b = req.body || {};
  run("UPDATE services SET name=?, price=?, type=?, desc=?, active=? WHERE id=?", [
    String(b.name || "").slice(0, 200), Number(b.price) || 0, String(b.type || "").slice(0, 60),
    String(b.desc || "").slice(0, 400), b.active ? 1 : 0, req.params.id]);
  res.json({ ok: true });
});

app.post("/admin/api/services", requireAdmin, (req, res) => {
  const b = req.body || {};
  const id = b.id || "svc_" + Date.now().toString(36);
  run("INSERT INTO services (id,name,icon,price,type,desc,active,sort) VALUES (?,?,?,?,?,?,?,?)",
    [id, String(b.name || "New service").slice(0, 150), String(b.icon || "✱").slice(0, 40),
      Number(b.price) || 40, String(b.type || "Other").slice(0, 60), String(b.desc || "").slice(0, 400), 1, 99]);
  res.json({ ok: true, id });
});

app.delete("/admin/api/services/:id", requireAdmin, (req, res) => {
  run("DELETE FROM services WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.post("/admin/api/languages", requireAdmin, (req, res) => {
  const b = req.body || {};
  const code = String(b.code || "").toUpperCase().slice(0, 3);
  if (!code || code.length !== 2 || !/^[A-Z]{2}$/.test(code)) return res.status(400).json({ ok: false, error: "Invalid code." });
  run("INSERT OR REPLACE INTO languages (code,name,native) VALUES (?,?,?)", [code, String(b.name || code).slice(0, 80), String(b.native || b.name || code).slice(0, 80)]);
  res.json({ ok: true });
});

// document types (manageable in admin)
app.get("/api/doc-types", (req, res) => {
  res.json({ ok: true, items: q("SELECT id, icon, name_en, name_de, name_ta FROM doc_types WHERE active = 1 ORDER BY sort") });
});

app.post("/admin/api/doc-types", requireAdmin, (req, res) => {
  const b = req.body || {};
  const id = b.id || "doc_" + Date.now().toString(36);
  run("INSERT INTO doc_types (id, icon, name_en, name_de, name_ta, active, sort) VALUES (?,?,?,?,?,?,?)", [
    id, String(b.icon || "file-text").slice(0, 40), String(b.name_en || "").slice(0, 150),
    String(b.name_de || "").slice(0, 150), String(b.name_ta || "").slice(0, 150), 1, Number(b.sort) || 0]);
  res.json({ ok: true, id });
});

app.patch("/admin/api/doc-types/:id", requireAdmin, (req, res) => {
  const b = req.body || {};
  run("UPDATE doc_types SET icon=?, name_en=?, name_de=?, name_ta=?, active=?, sort=? WHERE id=?", [
    String(b.icon || "file-text").slice(0, 40), String(b.name_en || "").slice(0, 150),
    String(b.name_de || "").slice(0, 150), String(b.name_ta || "").slice(0, 150),
    b.active === undefined ? 1 : b.active ? 1 : 0, Number(b.sort) || 0, req.params.id]);
  res.json({ ok: true });
});

app.delete("/admin/api/doc-types/:id", requireAdmin, (req, res) => {
  run("DELETE FROM doc_types WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.patch("/admin/api/settings", requireAdmin, (req, res) => {
  const b = req.body || {};
  Object.keys(b).forEach((k) => {
    if (["brand_name", "support_email", "support_phone", "whatsapp", "instagram", "facebook", "linkedin", "tiktok",
         "hero_image_url", "flag_style", "travel_fee", "currency", "ref_prefix", "smtp_host", "smtp_port",
         "smtp_user", "smtp_pass", "smtp_from", "smtp_secure", "lockout_max", "lockout_minutes",
         "canton_surcharge", "doc_plain_word", "doc_cert_word", "doc_urgent_pct", "video_price",
         "pay_twint_ref", "pay_iban", "pay_bank_name",
         "work_start", "work_end", "work_days", "lead_days", "visit_buffer_min", "video_buffer_min",
         "doc_flat", "doc_flat_tax", "doc_last_minute", "doc_urgent_flat", "retention_months"].includes(k)) {
      run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", [k, String(b[k]).slice(0, 400)]);
    }
  });
  secEvent(req, "settings_change", "Settings updated: " + Object.keys(b).slice(0, 8).join(", "));
  res.json({ ok: true });
});

app.get("/admin/api/documents", requireAdmin, (req, res) => {
  const f = parseFilters("document_requests", req.query, ["status", "doc_type"]);
  const rows = q("SELECT * FROM document_requests" + f.sql + " ORDER BY id DESC", f.params);
  res.json({ ok: true, items: rows });
});

app.patch("/admin/api/documents/:id", requireAdmin, (req, res) => {
  const s = req.body && req.body.status;
  if (!["received", "in_progress", "done", "cancelled"].includes(s)) return res.status(400).json({ ok: false, error: "Invalid status." });
  run("UPDATE document_requests SET status = ? WHERE id = ?", [s, req.params.id]);
  secEvent(req, "doc_status", "Document #" + req.params.id + " → " + s);
  res.json({ ok: true });
});

app.delete("/admin/api/documents/:id", requireAdmin, (req, res) => {
  const d = one("SELECT ref FROM document_requests WHERE id = ?", [req.params.id]);
  run("DELETE FROM document_requests WHERE id = ?", [req.params.id]);
  if (d) secEvent(req, "doc_erased", d.ref + " (GDPR erasure)");
  res.json({ ok: true });
});

// clients: unified contact history by name / email / phone / ref
app.get("/admin/api/clients", requireAdmin, (req, res) => {
  const term = String(req.query.q || "").trim().slice(0, 80);
  if (!term) return res.json({ ok: true, bookings: [], documents: [], concierge: [] });
  const like = "%" + term + "%";
  const bookings = q("SELECT * FROM bookings WHERE customer LIKE ? OR email LIKE ? OR phone LIKE ? OR ref LIKE ? ORDER BY date DESC LIMIT 100", [like, like, like, like]);
  const documents = q("SELECT * FROM document_requests WHERE customer LIKE ? OR email LIKE ? OR phone LIKE ? OR ref LIKE ? ORDER BY id DESC LIMIT 100", [like, like, like, like]);
  const concierge = q("SELECT * FROM concierge WHERE customer LIKE ? OR email LIKE ? OR phone LIKE ? OR ref LIKE ? ORDER BY id DESC LIMIT 100", [like, like, like, like]);
  res.json({ ok: true, bookings, documents, concierge });
});

app.get("/admin/api/security", requireAdmin, (req, res) => {
  const events = q("SELECT * FROM security_events ORDER BY id DESC LIMIT 100");
  const blocks = q("SELECT * FROM ip_blocks ORDER BY until DESC");
  const fails24h = q("SELECT COUNT(*) c, COALESCE(SUM(ok),0) ok FROM login_attempts WHERE created_at >= datetime('now','-24 hours')");
  res.json({ ok: true, events, blocks, fails24h: fails24h[0] || { c: 0, ok: 0 } });
});

app.post("/admin/api/security/unblock", requireAdmin, (req, res) => {
  unblockIp(String(req.body && req.body.ip || "").slice(0, 64));
  res.json({ ok: true });
});

app.post("/admin/api/security/block", requireAdmin, (req, res) => {
  const ip = String(req.body && req.body.ip || "").trim().slice(0, 64);
  if (!ip) return res.status(400).json({ ok: false, error: "ip required" });
  blockIp(ip, String(req.body.reason || "manual").slice(0, 200), 60);
  res.json({ ok: true });
});

app.get("/admin/api/payments", requireAdmin, (req, res) => {
  res.json({ ok: true, items: q("SELECT * FROM payments ORDER BY id DESC LIMIT 200") });
});

app.patch("/admin/api/payments/:id", requireAdmin, (req, res) => {
  const st = String(req.body && req.body.status || "paid").slice(0, 20);
  run("UPDATE payments SET status = ? WHERE id = ?", [st, req.params.id]);
  res.json({ ok: true });
});

// ============================================================== Site pages & static
app.use("/js", express.static(path.join(ROOT, "js")));
app.get("/healthz", (req, res) => res.set("Cache-Control", "no-store").send("ok"));
app.use("/css", express.static(path.join(ROOT, "css")));
app.use("/assets", express.static(path.join(ROOT, "assets")));
app.use("/admin", express.static(path.join(ROOT, "admin")));
app.use("/admin/js", express.static(path.join(ROOT, "admin", "js")));
app.use("/admin/css", express.static(path.join(ROOT, "admin", "css")));
app.get("/", (req, res) => res.sendFile(path.join(ROOT, "index.html")));
app.get("/index.html", (req, res) => res.sendFile(path.join(ROOT, "index.html")));
app.get("/fillform.html", (req, res) => res.sendFile(path.join(ROOT, "fillform.html")));
app.get("/services.html", (req, res) => res.sendFile(path.join(ROOT, "services.html")));
app.get("/translation.html", (req, res) => res.sendFile(path.join(ROOT, "translation.html")));
app.get("/booking.html", (req, res) => res.sendFile(path.join(ROOT, "booking.html")));
app.get("/concierge.html", (req, res) => res.sendFile(path.join(ROOT, "concierge.html")));
app.get("/confirmation.html", (req, res) => res.sendFile(path.join(ROOT, "confirmation.html")));
app.get("/privacy.html", (req, res) => res.sendFile(path.join(ROOT, "privacy.html")));

// error-cleanup to keep server from crashing
app.use((err, req, res, next) => {
  if (err && (err.statusCode === 404 || err.statusCode === 400)) {
    res.status(err.statusCode).send("Not found."); return;
  }
  if (err && err.code === "ENOENT") { res.status(404).send("Not found."); return; }
  console.error(err);
  res.status(500).json({ ok: false, error: "Server error." });
});

ensureAdminSeed();

// --------------------------------------------------------------------------
// Maintenance — retention & housekeeping
// --------------------------------------------------------------------------
function runCleanup() {
  try {
    run("DELETE FROM sessions WHERE expires_at < datetime('now')");
    run("DELETE FROM login_attempts WHERE created_at < datetime('now','-7 days')");
    run("DELETE FROM security_events WHERE created_at < datetime('now','-90 days')");
    run("DELETE FROM ip_blocks WHERE until < datetime('now')");
    const rm = Math.max(1, NumberSetting("retention_months") || 24);
    const cutoff = new Date(Date.now() - rm * 30.44 * 86400000).toISOString().slice(0, 19).replace("T", " ");
    run("DELETE FROM bookings WHERE created_at < ? AND status IN ('completed','cancelled','refunded')", [cutoff]);
    run("DELETE FROM payments WHERE ref NOT IN (SELECT ref FROM bookings)");
    run("DELETE FROM document_requests WHERE created_at < ? AND status IN ('done','cancelled')", [cutoff]);
    console.log("[cleanup] retention run complete (" + rm + " months)");
  } catch (e) {
    console.error("[cleanup] failed: " + e.message);
  }
}

if (require.main === module) {
  runCleanup();
  setInterval(runCleanup, 12 * 3600000);
  app.listen(PORT, process.env.HOST || (IS_PROD ? "127.0.0.1" : undefined), () => {
    console.log("");
    console.log("  Ssaaxcy Solutions — Swiss digital concierge");
    console.log("  Site    → http://localhost:" + PORT + "/");
    console.log("  Admin   → http://localhost:" + PORT + "/admin/login.html");
    console.log("");
  });
}

module.exports = app;