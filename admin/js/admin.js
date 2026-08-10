"use strict";

const SS = window.SS || {};

SS.csrf = "";

SS.api = function (method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (SS.csrf && method !== "GET") headers["X-CSRF-Token"] = SS.csrf;
  return fetch(path, {
    method: method,
    headers: headers,
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined
  }).then(function (res) {
    const tok = res.headers.get("X-CSRF-Token");
    if (tok) SS.csrf = tok;
    return res.json().then(function (j) {
      if (!j.ok) throw new Error(j.error || ("Request failed (" + res.status + ")"));
      return j;
    });
  });
};

SS.get = function (path) { return SS.api("GET", path); };
SS.post = function (path, body) { return SS.api("POST", path, body); };
SS.patch = function (path, body) { return SS.api("PATCH", path, body); };
SS.del = function (path) { return SS.api("DELETE", path); };

SS.esc = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};

SS.txt = function (s) { return SS.esc(String(s == null ? "" : s)); };

SS.fmt = function (n) {
  return "CHF " + Number(n || 0).toLocaleString("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

SS.date = function (iso) {
  if (!iso) return "—";
  try { return new Date(String(iso).replace(" ", "T")).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
  catch (e) { return iso; }
};

SS.when = function (created) {
  if (!created) return "";
  try { return new Date(String(created).replace(" ", "T")).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return created; }
};

SS.badge = function (status) {
  const s = String(status || "");
  let cls = "good";
  if (/pending|new|soon/.test(s)) cls = "pending";
  else if (/confirmed|paid|handled|completed/.test(s)) cls = "good";
  else if (/cancelled|refunded|closed/.test(s)) cls = "cancelled";
  return '<span class="badge ' + cls + '">' + s.toUpperCase() + '</span>';
};

SS.toast = function (msg, type) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
  const el = document.createElement("div");
  el.className = "toast " + (type || "");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(function () { el.remove(); }, 3200);
};

SS.modal = function (html) {
  const back = document.createElement("div");
  back.className = "modal-backdrop";
  back.innerHTML = '<div class="modal">' + html + '</div>';
  back.addEventListener("click", function (e) { if (e.target === back) back.remove(); });
  document.body.appendChild(back);
  return back;
};

SS.confirm = function (message, cb) {
  const m = SS.modal(
    '<h2>Confirm action</h2><p class="muted">' + message + '</p>' +
    '<div style="display:flex;gap:10px;margin-top:18px;">' +
    '<button class="btn btn-red" id="m-yes">Confirm</button>' +
    '<button class="btn btn-light" id="m-no">Cancel</button></div>'
  );
  m.querySelector("#m-no").onclick = function () { m.remove(); };
  m.querySelector("#m-yes").onclick = function () { cb(); m.remove(); };
};

SS.icon = function (name, size) {
  const s = size || 16;
  const p = { fill: "none", stroke: "currentColor", "stroke-width": "1.7", "stroke-linecap": "round", "stroke-linejoin": "round" };
  const attrs = Object.keys(p).map(function (k) { return k + '="' + p[k] + '"'; }).join(" ");
  const paths = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M8 15h2M14 15h2M8 19h2"/>',
    concierge: '<path d="M12 4a3.5 3.5 0 0 1 3.5 3.5V9"/><rect x="6" y="9" width="12" height="12" rx="2"/><path d="M9 9V8a3 3 0 0 1 6 0v1"/><circle cx="12" cy="14" r="1"/>',
    handshake: '<path d="m12 5 3.5 3.5-2.5 2.5M12 5 8.5 8.5l2.5 2.5"/><path d="m4 13 2-2 3.5 3.5 1.5-1.5 1.5 1.5 3.5-3.5 2 2"/><path d="m3 17 2-1M21 17l-2-1"/>',
    tag: '<path d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
    card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><path d="M6 15h4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M16 12.5h.01"/><path d="M3 9h18"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    video: '<path d="m16 10 5-3v10l-5-3V10Z"/><rect x="2.5" y="6" width="13.5" height="12" rx="2.5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>',
    mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6 9-6"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M12 22s8-3.5 8-10V5.5L12 2 4 5.5V12c0 6.5 8 10 8 10Z"/><path d="m9 11.5 2 2 4-4"/>',
    'shield-check': '<path d="M12 22s8-3.5 8-10V5.5L12 2 4 5.5V12c0 6.5 8 10 8 10Z"/><path d="m8.5 11.5 2.5 2.5 4.5-4.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>'
  };
  return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" ' + attrs + '>' + (paths[name] || paths.file) + '</svg>';
};

SS.menu = [
  { href: "dashboard.html", label: "Dashboard", icon: "dashboard", key: "dashboard" },
  { href: "bookings.html", label: "Bookings", icon: "calendar", key: "bookings" },
  { href: "documents.html", label: "Documents", icon: "doc", key: "documents" },
  { href: "clients.html", label: "Clients", icon: "users", key: "clients" },
  { href: "concierge.html", label: "Life Concierge", icon: "concierge", key: "concierge" },
  { href: "interpreters.html", label: "Interpreters", icon: "handshake", key: "interpreters" },
  { href: "catalog.html", label: "Catalog & Prices", icon: "tag", key: "catalog" },
  { href: "finance.html", label: "Finance", icon: "card", key: "finance" },
  { href: "security.html", label: "Security", icon: "shield", key: "security" }
];

SS.shell = function (active, title, sub) {
  let nav = '<div class="side-brand"><span class="mark">SS</span><span><b>Ssaaxcy</b><small>Admin panel</small></span></div><div class="side-nav">';
  SS.menu.forEach(function (l) {
    nav += '<a href="' + l.href + '" class="' + (active === l.key ? "active" : "") + '">' + SS.icon(l.icon) + '<span>' + l.label + '</span></a>';
  });
  nav += '</div><div class="side-foot">' +
    '<a href="/" target="_blank">' + SS.icon("globe") + '&nbsp;<span>Back to website</span></a>' +
    '<a href="#" id="logout-btn">' + SS.icon("logout") + '&nbsp;<span>Log out</span></a></div>';

  document.body.insertAdjacentHTML("afterbegin",
    '<div class="admin-wrap">' +
    '<aside class="sidebar">' + nav + '</aside>' +
    '<div class="main">' +
    '<header class="topbar"><div><div class="crumb">Ssaaxcy Solutions · ' + SS.txt(sub || "Admin") + '</div><h1>' + SS.txt(title || "") + '</h1></div></header>' +
    '<main class="content" id="content"></main>' +
    '</div></div>'
  );

  document.getElementById("logout-btn").addEventListener("click", function (e) {
    e.preventDefault();
    SS.post("/admin/api/logout", {}).catch(function () {}).then(function () {
      window.location.href = "/admin/login.html";
    });
  });
};

SS.guard = function () {
  return SS.get("/admin/api/me").then(function () { return true; }).catch(function () {
    window.location.href = "/admin/login.html";
    return false;
  });
};