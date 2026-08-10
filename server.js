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
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

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

// --------------------------------------------------------------------------
// Constants / helpers
// --------------------------------------------------------------------------
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
const LANG_CODES = ["DE", "EN", "TA"];
const PAY_METHODS = ["card", "twint", "invoice"];
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

function genRef(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return (prefix || "SSX") + "-" + out;
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

function adminAuthorized(req) {
  const token = (req.cookies && req.cookies.ssx_session) || (req.headers.authorization ? String(req.headers.authorization).replace(/^Bearer /, "") : "");
  if (!token) return false;
  const s = one("SELECT * FROM sessions WHERE token_hash = ?", [hashToken(token)]);
  if (!s) return false;
  const exp = new Date(String(s.expires_at).replace(" ", "T")).getTime();
  if (Date.now() > exp) {
    run("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
    return false;
  }
  run("UPDATE sessions SET last_seen = ? WHERE token_hash = ?", [now(), hashToken(token)]);
  return true;
}

function issueSession(res) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600000).toISOString().slice(0, 19).replace("T", " ");
  run("INSERT INTO sessions (token_hash, created_at, expires_at, last_seen) VALUES (?,?,?,?)", [hashToken(token), now(), expiresAt, now()]);
  res.cookie("ssx_session", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    maxAge: SESSION_HOURS * 3600000
  });
}

function destroySession(req, res) {
  const token = (req.cookies && req.cookies.ssx_session) || "";
  if (token) run("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
  res.clearCookie("ssx_session", { path: "/" });
  res.clearCookie("ssx_2fa_token", { path: "/admin" });
}

// per-boot CSRF token (double-submit style: page must echo it back)
const CSRF_TOKEN = crypto.randomBytes(18).toString("base64url");

function attachCsrf(res) {
  res.setHeader("X-CSRF-Token", CSRF_TOKEN);
}

function requireAdmin(req, res, next) {
  if (!adminAuthorized(req)) {
    secEvent(req, "unauth_api", "Rejected " + req.method + " " + req.originalUrl.slice(0, 200));
    return res.status(401).json({ ok: false, error: "Unauthorized. Please log in." });
  }
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    const sent = req.headers["x-csrf-token"] || "";
    if (sent !== CSRF_TOKEN) {
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
  res.clearCookie("ssx_2fa_token", { path: "/admin" });
  if (admin2faEnabled()) {
    const preToken = crypto.randomBytes(24).toString("hex");
    run("INSERT INTO sessions (token_hash, created_at, expires_at, last_seen) VALUES (?,?,?,?)", [hashToken(preToken), now(), new Date(Date.now() + 10 * 60000).toISOString().slice(0, 19).replace("T", " "), now()]);
    res.cookie("ssx_2fa_token", preToken, { path: "/admin", httpOnly: true, sameSite: "lax", secure: IS_PROD, maxAge: 10 * 60000 });
    return res.json({ ok: true, need2fa: true });
  }
  issueSession(res);
  res.json({ ok: true, csrf: CSRF_TOKEN, expires: SESSION_HOURS });
});

app.post("/admin/api/login2fa", loginRateLimit, (req, res) => {
  const pre = (req.cookies && req.cookies.ssx_2fa_token) || "";
  if (!pre) return res.status(401).json({ ok: false, error: "2FA session expired. Sign in again." });
  const secret = loadSetting("admin_2fa_secret", "");
  if (!secret) return res.status(401).json({ ok: false, error: "2FA not configured." });
  const code = String(req.body && req.body.code || "").trim();
  const valid = totpCheck(code, secret);
  if (!valid) {
    logLogin(clientIp(req), false);
    return res.status(401).json({ ok: false, error: "Invalid code." });
  }
  run("DELETE FROM sessions WHERE token_hash = ?", [hashToken(pre)]);
  res.clearCookie("ssx_2fa_token", { path: "/admin" });
  issueSession(res);
  res.json({ ok: true, csrf: CSRF_TOKEN, expires: SESSION_HOURS });
});

app.post("/admin/api/logout", (req, res) => {
  destroySession(req, res);
  res.json({ ok: true });
});

app.get("/admin/api/me", requireAdmin, (req, res) => {
  attachCsrf(res);
  res.json({ ok: true, user: { role: "admin", twofa: admin2faEnabled() }, settings: publicSettings() });
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
    }
  });
});

app.post("/api/documents", writeRateLimit, (req, res) => {
  const b = req.body || {};
  const docType = one("SELECT * FROM doc_types WHERE id = ? AND active = 1", [String(b.doc_type || "").slice(0, 40)]);
  if (!docType) return res.status(400).json({ ok: false, error: "Unknown document type." });
  if (!EMAIL_RE.test(String(b.email || ""))) return res.status(400).json({ ok: false, error: "Valid email required." });
  if (!LANG_CODES.includes(b.from_lang) || !LANG_CODES.includes(b.to_lang)) return res.status(400).json({ ok: false, error: "Invalid language pair." });
  const mode = ["translate", "fill", "both"].includes(b.mode) ? b.mode : "translate";
  const fields = b.fields && typeof b.fields === "object" ? JSON.stringify(b.fields).slice(0, 4000) : "{}";
  const ref = genRef("SSXD");
  run(
    `INSERT INTO document_requests
     (ref, doc_type, doc_type_name, from_lang, to_lang, mode, fields, notes, customer, email, phone, ip, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'received')`,
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
    ["Next step", "Our team completes your document and emails it back to you."]
  ]));
  res.json({ ok: true, ref });
});

app.get("/api/documents/:ref", (req, res) => {
  const d = one("SELECT * FROM document_requests WHERE ref = ? AND status != 'blocked'", [req.params.ref]);
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
  if (b.email && !EMAIL_RE.test(String(b.email))) return res.status(400).json({ ok: false, error: "Valid email required." });
  const service = one("SELECT * FROM services WHERE id = ? AND active = 1", [b.service_id]);
  const lang = one("SELECT * FROM languages WHERE code = ?", [b.language_code]);
  const dur = one("SELECT * FROM durations WHERE mins = ?", [Number(b.duration) || 60]);
  if (!service || !lang) return res.status(400).json({ ok: false, error: "Invalid service or language." });

  const travelFee = NumberSetting("travel_fee");
  const canton = String(b.canton || "").trim();
  const cantonSurcharge = NumberSetting("canton_surcharge");
  const base = b.service_price != null ? Number(b.service_price) : service.price;
  const durationPrice = Math.round(base * (dur ? dur.factor : 1) * 100) / 100;
  const surcharge = canton && canton !== "Zurich"
    ? Math.round(100 * (durationPrice * (cantonSurcharge / 100))) / 100
    : 0;
  const fee = (b.mode === "on_site" ? travelFee : 0) + surcharge;
  const total = Math.round(100 * (durationPrice + fee)) / 100;

  const ref = genRef(loadSetting("ref_prefix", "SSX"));
  const method = PAY_METHODS.includes(b.method) ? b.method : "card";

  run(
    `INSERT INTO bookings
     (ref, language_code, language_name, service_id, service_name, date, time, duration,
      mode, address, customer, email, phone, notes, base_price, duration_price, fee, total, method, status, canton)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      ref, lang.code, lang.name, service.id, service.name, b.date, b.time, dur.mins,
      b.mode, String(b.address || "").slice(0, 240), String(b.customer || "").slice(0, 120),
      String(b.email || "").slice(0, 160), String(b.phone || "").slice(0, 40), String(b.notes || "").slice(0, 2000),
      base, durationPrice, fee, total, method, "pending", canton.slice(0, 60)
    ]
  );
  run("INSERT INTO payments (ref, method, amount, status) VALUES (?,?,?,?)", [ref, method, total, "paid"]);
  sendMail(b.email, "Ssaaxcy Solutions — appointment request " + ref, confirmationHtml("We received your booking request", [
    ["Reference", ref],
    ["Service", service.name],
    ["Language", lang.name],
    ["When", b.date + " at " + b.time],
    ["Mode", b.mode === "on_site" ? "On-site" : "Video"],
    ["Total", "CHF " + total.toFixed(2)]
  ]));
  res.json({
    ok: true, ref, language: lang.name, service: service.name, date: b.date, time: b.time,
    mode: b.mode, duration: dur ? dur.mins : 60, base_price: base, duration_price: durationPrice,
    fee, surcharge, canton, total, method, status: "pending"
  });
});

app.get("/api/bookings/:ref", (req, res) => {
  const b = one("SELECT * FROM bookings WHERE ref = ?", [req.params.ref]);
  if (!b) return res.status(404).json({ ok: false, error: "Booking not found." });
  res.json({ ok: true, booking: b });
});

app.post("/api/concierge", writeRateLimit, (req, res) => {
  const c = req.body || {};
  if (!c.service || !c.detail || !LANG_CODES.includes(c.language_code || "")) {
    return res.status(400).json({ ok: false, error: "service, language and detail are required." });
  }
  const ref = genRef("SSX");
  run(
    `INSERT INTO concierge (ref, service, title, language_code, language_name, detail, customer, email, phone, files, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,'new')`,
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
const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

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
  ["status", "mode", "date", "time", "duration", "address", "customer", "email", "phone", "notes", "method"].forEach((k) => {
    if (b[k] !== undefined) { set.push(k + " = ?"); params.push(String(b[k])); }
  });
  if (!set.length) return res.status(400).json({ ok: false, error: "Nothing to update." });
  params.push(req.params.id);
  run("UPDATE bookings SET " + set.join(", ") + " WHERE id = ?", params);
  res.json({ ok: true });
});

app.delete("/admin/api/bookings/:id", requireAdmin, (req, res) => {
  run("DELETE FROM bookings WHERE id = ?", [req.params.id]);
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
    if (["brand_name", "support_email", "support_phone", "whatsapp", "instagram", "facebook", "linkedin",
         "hero_image_url", "flag_style", "travel_fee", "currency", "ref_prefix", "smtp_host", "smtp_port",
         "smtp_user", "smtp_pass", "smtp_from", "smtp_secure", "lockout_max", "lockout_minutes",
         "canton_surcharge", "doc_plain_word", "doc_cert_word", "doc_urgent_pct", "video_price"].includes(k)) {
      run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", [k, String(b[k]).slice(0, 400)]);
    }
  });
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
  res.json({ ok: true });
});

app.delete("/admin/api/documents/:id", requireAdmin, (req, res) => {
  run("DELETE FROM document_requests WHERE id = ?", [req.params.id]);
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("");
    console.log("  Ssaaxcy Solutions — Swiss digital concierge");
    console.log("  Site    → http://localhost:" + PORT + "/");
    console.log("  Admin   → http://localhost:" + PORT + "/admin/login.html");
    console.log("");
  });
}

module.exports = app;