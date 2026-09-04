var SSX = window.SSX || {};

// Interpreter service catalog — names/descriptions come from i18n keys
// ("svc.<id>.name" / "svc.<id>.desc"), icons are premium SVG names.
SSX.services = [
  { id: "doctor", icon: "activity", price: 45, cat: "medical" },
  { id: "hospital", icon: "heart", price: 55, cat: "medical" },
  { id: "police", icon: "shield", price: 55, cat: "official" },
  { id: "immigration", icon: "id-card", price: 40, cat: "official" },
  { id: "gemeinde", icon: "landmark", price: 40, cat: "official" },
  { id: "school", icon: "school", price: 40, cat: "family" },
  { id: "bank", icon: "building", price: 35, cat: "finance" },
  { id: "insurance", icon: "umbrella", price: 50, cat: "finance" },
  { id: "interview", icon: "briefcase", price: 45, cat: "work" },
  { id: "government", icon: "government", price: 50, cat: "official" },
  { id: "custom", icon: "sparkles", price: 40, cat: "other" }
];

// Service names & categories are read via SSX.t() each time so they
// re-render on language switch.
SSX.categoryLabel = function (cat) {
  return SSX.t("services.cat." + cat);
};

// Exactly three languages: German, English, Tamil
SSX.languages = [
  { code: "DE", name: "German", native: "Deutsch", label: "Deutsch" },
  { code: "EN", name: "English", native: "English", label: "English" },
  { code: "TA", name: "Tamil", native: "தமிழ்", label: "தமிழ்" }
];

SSX.durations = [
  { mins: 30, label: "30 min", noteKey: "dur.short", factor: 0.5 },
  { mins: 60, label: "60 min", noteKey: "dur.standard", factor: 1 },
  { mins: 90, label: "90 min", noteKey: "dur.clinical", factor: 1.4 },
  { mins: 120, label: "120 min", noteKey: "dur.long", factor: 1.8 }
];

SSX.timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

SSX.settings = {
  travelFee: 25,
  currency: "CHF",
  brandName: "Ssaaxcy Solutions",
  supportEmail: "support@ssaaxcy.ch",
  supportPhone: "+41 76 253 12 92",
  whatsapp: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  tiktok: "",
  flagStyle: "drift",
  heroImage: "",
  cantonSurcharge: 0,
  payTwintRef: "",
  payIban: "",
  payBankName: "",
  docPlainWord: 0.15,
  docCertWord: 0.2,
  docUrgentPct: 50,
  videoPrice: 60,
  docFlat: 125,
  docFlatTax: 120,
  docLastMinute: 25,
  docUrgentFlat: 15,
  workStart: "08:30",
  workEnd: "16:30",
  workDays: [1, 2, 3, 4, 5, 6],
  leadDays: 2,
  minDate: "",
  paused: false
};

SSX.applySettings = function (s) {
  if (!s) return;
  var map = {
    brand_name: "brandName", support_email: "supportEmail", support_phone: "supportPhone",
    travel_fee: "travelFee", hero_image_url: "heroImage", flag_style: "flagStyle",
    pay_twint_ref: "payTwintRef", pay_iban: "payIban", pay_bank_name: "payBankName",
    canton_surcharge: "cantonSurcharge", doc_plain_word: "docPlainWord",
    doc_cert_word: "docCertWord", doc_urgent_pct: "docUrgentPct", video_price: "videoPrice",
    doc_flat: "docFlat", doc_flat_tax: "docFlatTax", doc_last_minute: "docLastMinute",
    doc_urgent_flat: "docUrgentFlat", work_start: "workStart", work_end: "workEnd"
  };
  Object.keys(map).forEach(function (k) { if (s[k] !== undefined && s[k] !== null) SSX.settings[map[k]] = s[k]; });
  ["whatsapp", "instagram", "facebook", "linkedin", "tiktok", "currency"].forEach(function (k) {
    if (s[k] !== undefined && s[k] !== null) SSX.settings[k] = s[k];
  });
};

SSX.capacity = { paused: false, minDate: "", leadDays: 2 };

SSX.applyCapacity = function (c) {
  if (!c) return;
  if (c.workStart) SSX.settings.workStart = c.workStart;
  if (c.workEnd) SSX.settings.workEnd = c.workEnd;
  if (Array.isArray(c.workDays)) SSX.settings.workDays = c.workDays;
  if (c.leadDays !== undefined) SSX.settings.leadDays = Number(c.leadDays);
  if (c.minDate) SSX.settings.minDate = c.minDate;
  if (c.paused !== undefined) SSX.settings.paused = !!c.paused;
};

SSX.catalogKey = null;

SSX.catalogSignature = function (j) {
  return JSON.stringify([
    j && j.settings,
    j && j.services ? j.services.map(function (s) { return [s.id, s.price]; }) : null
  ]);
};

SSX.syncServices = function (list) {
  if (!list || !list.length) return;
  var byId = {};
  SSX.services.forEach(function (s) { byId[s.id] = s; });
  list.forEach(function (sv) {
    if (byId[sv.id] && sv.price !== undefined && sv.price !== null) byId[sv.id].price = Number(sv.price);
  });
};

SSX.applyCatalog = function (j) {
  if (!j) return;
  if (j.settings) SSX.applySettings(j.settings);
  if (j.capacity) SSX.applyCapacity(j.capacity);
  if (j.services) SSX.syncServices(j.services);
  SSX.catalogKey = SSX.catalogSignature(j);
};

SSX.cantonOptions = function (selected) {
  const cantons = ["Zurich", "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt", "Bern", "Fribourg", "Geneva", "Glarus", "Graubünden", "Jura", "Lucerne", "Neuchâtel", "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau", "Ticino", "Uri", "Valais", "Vaud", "Zug"];
  return cantons.map(function (c) {
    return '<option value="' + c + '"' + (c === (selected || "Zurich") ? " selected" : "") + ">" + c + "</option>";
  }).join("");
};

SSX.fmt = function (n) {
  return "CHF " + Number(n || 0).toLocaleString("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

SSX.helpers = {
  fmt: SSX.fmt,
  esc: function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  },
  dateLabel: function (iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
};

SSX.ref = function (prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return (prefix || "SSX") + "-" + out;
};

SSX.request = function (method, path, body) {
  return fetch(path, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  }).then(function (r) {
    return r.json().then(function (j) {
      if (!r.ok) throw new Error(j.error || ("Request failed (" + r.status + ")"));
      return j;
    });
  });
};

// Upload files (FormData) — returns the stored file names
SSX.upload = function (files) {
  var fd = new FormData();
  Array.prototype.forEach.call(files || [], function (f) { fd.append("files", f); });
  return fetch("/api/upload", { method: "POST", body: fd }).then(function (r) {
    return r.json().then(function (j) {
      if (!r.ok) throw new Error(j.error || ("Upload failed (" + r.status + ")"));
      return j;
    });
  });
};

// Presentable name for a stored upload (hex.pdf -> sensible label)
SSX.fileLabel = function (name) {
  var s = String(name || "");
  if (s.indexOf(".") < 0) return s;
  var ext = s.split(".").pop().toUpperCase();
  var byExt = { PDF: "PDF", DOC: "Word", DOCX: "Word", JPG: "Photo", JPEG: "Photo", PNG: "Image", HEIC: "Photo", HEIF: "Photo", TXT: "Text" };
  return (byExt[ext] || ext) + " file";
};

// true when served over http(s) (fetch available), false when opened from disk
SSX.http = typeof fetch === "function";

// WhatsApp link: accepts a full URL or a phone number -> https://wa.me/<digits>
SSX.waMe = function (v) {
  if (!v) return "";
  if (/^https?:\/\//i.test(String(v))) return String(v);
  const digits = String(v).replace(/[^\d]/g, "");
  return digits ? "https://wa.me/" + digits : "";
};

// ---------------------------------------------------------------- toast
SSX.toast = function (msg, type) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast " + (type || "");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(function () { el.classList.add("out"); setTimeout(function () { el.remove(); }, 260); }, 3400);
};

SSX.openModal = function (html) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = '<div class="modal">' + html + "</div>";
  backdrop.addEventListener("click", function (e) { if (e.target === backdrop) backdrop.remove(); });
  document.body.appendChild(backdrop);
  return backdrop;
};

SSX.saveLocal = function (key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
};
SSX.loadLocal = function (key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; }
};
SSX.bookingsLocal = function () {
  return SSX.loadLocal("ssx.bookings") || [];
};

// language switch parses the switcher into the header (if present)
SSX.injectLangSwitcher = function (root) {
  const host = (root || document).querySelector("[data-lang-switcher]");
  if (host && !host.querySelector(".lang-switch")) {
    host.innerHTML = SSX.langSwitcher();
  }
};

// ---------------------------------------------------------------- shared shell
// Renders the site header + footer into any <header data-slot="header"> / <footer data-slot="footer">.
function currentPage() {
  const p = (location.pathname || "/").split("/").pop() || "index.html";
  return p;
}

SSX.shellHeader = function () {
  const here = currentPage();
  const is = (page) => here === page ? " class=\"active\"" : "";
  return (
    '<a class="brand" href="index.html">' +
      '<img class="brand-logo" src="assets/brand/logo-head.png" alt="Ssaaxcy Solutions" width="67" height="54">' +
      '<span class="brand-name">Ssaaxcy Solutions<small data-i18n="brand.tag">' + SSX.t("brand.tag") + "</small></span>" +
    "</a>" +
    '<nav class="main-nav" aria-label="Main">' +
      '<a href="index.html" data-i18n="nav.home"' + is("index.html") + ">" + SSX.t("nav.home") + "</a>" +
      '<a href="services.html" data-i18n="nav.services"' + is("services.html") + ">" + SSX.t("nav.services") + "</a>" +
      '<a href="translation.html" data-i18n="nav.translation"' + is("translation.html") + ">" + SSX.t("nav.translation") + "</a>" +
      '<a href="fillform.html" data-i18n="nav.fillForm"' + is("fillform.html") + ">" + SSX.t("nav.fillForm") + "</a>" +
      '<a href="concierge.html" data-i18n="nav.concierge"' + is("concierge.html") + ">" + SSX.t("nav.concierge") + "</a>" +
      '<a href="track.html" data-i18n="track.nav"' + is("track.html") + ">" + SSX.t("track.nav") + "</a>" +
      '<a href="booking.html" class="btn btn-primary nav-cta" data-i18n="nav.bookNow">' + SSX.t("nav.bookNow") + "</a>" +
    "</nav>" +
    '<span class="header-right">' +
      '<span data-lang-switcher></span>' +
      '<button class="nav-burger" data-aria="nav.menu" aria-label="Menu">' + SSX.icon("menu") + "</button>" +
    "</span>"
  );
};

SSX.socialLinks = function () {
  var items = [
    ["whatsapp", SSX.settings.whatsapp],
    ["instagram", SSX.settings.instagram],
    ["tiktok", SSX.settings.tiktok],
    ["facebook", SSX.settings.facebook],
    ["linkedin", SSX.settings.linkedin]
  ];
  var html = "";
  items.forEach(function (i) {
    if (i[1]) html += '<a class="social-link" href="' + SSX.helpers.esc(i[1]) + '" target="_blank" rel="noopener" aria-label="' + i[0] + '">' + SSX.icon(i[0]) + "</a>";
  });
  return html ? '<div class="footer-social">' + html + "</div>" : "";
};

SSX.shellFooter = function () {
  return (
    '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
        '<a class="brand" href="index.html"><span class="brand-plate"><img class="brand-logo brand-logo--dark" src="assets/brand/logo-head.png" alt="Ssaaxcy Solutions" width="67" height="54"></span><span class="brand-name brand-name--light">Ssaaxcy Solutions<small data-i18n="brand.tag">' + SSX.t("brand.tag") + "</small></span></a>" +
        '<p data-i18n="footer.tagline">' + SSX.t("footer.tagline") + "</p>" +
        SSX.socialLinks() +
        '<div class="cert-seal">' +
          '<span class="cert-badge">' + SSX.icon("shield-check", 22) + "</span>" +
          '<span class="cert-text"><b data-i18n="footer.certTitle">' + SSX.t("footer.certTitle") + "</b><small data-i18n=\"footer.certSub\">" + SSX.t("footer.certSub") + "</small></span>" +
        "</div>" +
      "</div>" +
      '<div class="footer-col" data-i18n-wrap>' +
        "<h4>" + SSX.t("nav.services") + "</h4><ul>" +
          '<li><a href="booking.html" data-i18n="nav.booking">' + SSX.t("nav.booking") + "</a></li>" +
          '<li><a href="booking.html">' + SSX.t("svc.videoTitle") + "</a></li>" +
          '<li><a href="fillform.html">' + SSX.t("svc.docTitle") + "</a></li>" +
          '<li><a href="translation.html" data-i18n="nav.translation">' + SSX.t("nav.translation") + "</a></li>" +
          '<li><a href="concierge.html" data-i18n="nav.concierge">' + SSX.t("nav.concierge") + "</a></li>" +
        "</ul></div>" +
      '<div class="footer-col"><h4>' + SSX.t("footer.quickLinks") + '</h4><ul>' +
        '<li><a href="index.html" data-i18n="nav.home">' + SSX.t("nav.home") + "</a></li>" +
        '<li><a href="services.html" data-i18n="nav.services">' + SSX.t("nav.services") + "</a></li>" +
        '<li><a href="translation.html" data-i18n="nav.translation">' + SSX.t("nav.translation") + "</a></li>" +
        '<li><a href="booking.html" data-i18n="nav.bookNow">' + SSX.t("nav.bookNow") + "</a></li>" +
        '<li><a href="fillform.html" data-i18n="nav.fillForm">' + SSX.t("nav.fillForm") + "</a></li>" +
      "</ul></div>" +
      '<div class="footer-col"><h4>' + SSX.t("nav.contact") + '</h4><ul>' +
        '<li><a href="mailto:' + SSX.helpers.esc(SSX.settings.supportEmail) + '">' + SSX.helpers.esc(SSX.settings.supportEmail) + "</a></li>" +
        '<li><a href="tel:' + SSX.helpers.esc(String(SSX.settings.supportPhone).replace(/\s/g, "")) + '">' + SSX.helpers.esc(SSX.settings.supportPhone) + "</a></li>" +
        '<li>' + (SSX.settings.whatsapp ? '<a href="' + SSX.helpers.esc(SSX.waMe(SSX.settings.whatsapp)) + '" target="_blank" rel="noopener">WhatsApp</a>' : "") + "</li>" +
        '<li><a href="track.html">' + SSX.t("track.nav") + "</a></li>" +
        '<li><a href="privacy.html">' + SSX.t("privacy.link") + "</a></li>" +
        '<li class="footer-addr">' + SSX.icon("map-pin", 13) + " " + SSX.t("footer.addr") + "</li>" +
      "</ul></div>" +
    "</div>" +
    '<div class="container footer-bottom"><span>© <span class="year"></span> ' + SSX.helpers.esc(SSX.settings.brandName) + ", Zürich, Switzerland. <span data-i18n=\"footer.rights\"></span></span>" +
    '<a class="footer-credit" href="https://maintainex.lk" target="_blank" rel="noopener">Maintainex.lk</a>' +
    '<span class="footer-pay">' + SSX.icon("lock", 13) + " Secure payment · Visa · Mastercard · TWINT · Invoice</span>" +
    "</div>"
  );
};

document.addEventListener("DOMContentLoaded", function () {
  SSX.boot();
});

SSX.boot = function () {
  SSX.request("GET", "/api/catalog")
    .then(function (j) {
      SSX.applyCatalog(j);
      document.dispatchEvent(new CustomEvent("ssx:settings", { detail: j }));
    })
    .catch(function () {})
    .then(SSX.renderShell);
  SSX.pollCatalog();
};

SSX.pollCatalog = function () {
  if (!SSX.http) return;
  setInterval(function () {
    SSX.request("GET", "/api/catalog").then(function (j) {
      var key = SSX.catalogSignature(j);
      if (key === SSX.catalogKey) return;
      SSX.applyCatalog(j);
      SSX.renderShell();
      document.dispatchEvent(new CustomEvent("ssx:settings", { detail: j }));
    }).catch(function () {});
  }, 8000);
};

SSX.renderShell = function () {
  const hdr = document.querySelector('header[data-slot="header"]');
  if (hdr) {
    const slot = hdr.querySelector(".header-inner") || hdr;
    slot.innerHTML = SSX.shellHeader();
    SSX.injectLangSwitcher(slot);
  }
  const ftr = document.querySelector('footer[data-slot="footer"]');
  if (ftr) {
    ftr.innerHTML = SSX.shellFooter();
    const year = ftr.querySelectorAll(".year");
    year.forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  if (SSX.settings.whatsapp) {
    if (!document.querySelector(".wa-float")) {
      const wa = document.createElement("a");
      wa.className = "wa-float";
      wa.href = SSX.waMe(SSX.settings.whatsapp);
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.setAttribute("aria-label", "WhatsApp");
      wa.innerHTML = SSX.icon("whatsapp", 22);
      document.body.appendChild(wa);
    }
  } else {
    const wa = document.querySelector(".wa-float");
    if (wa) wa.remove();
  }

  if (!document.querySelector(".bg-fx")) {
    const fx = document.createElement("div");
    fx.className = "bg-fx";
    fx.setAttribute("aria-hidden", "true");
    document.body.appendChild(fx);
  }

  document.querySelectorAll("[data-flag]").forEach(function (el) {
    el.classList.add("flag-" + (SSX.settings.flagStyle || "drift"));
  });

  if (SSX.settings.heroImage) {
    const hv = document.querySelector(".hero-visual");
    if (hv) hv.innerHTML = '<img class="hero-photo" src="' + SSX.helpers.esc(SSX.settings.heroImage) + '" alt="Ssaaxcy Solutions">';
  }

  SSX.renderFeatured();
  SSX.fillFees();
  if (SSX.translateAll) SSX.translateAll();

  const burger = document.querySelector(".nav-burger");
  const nav = document.querySelector(".main-nav");
  if (burger && nav) {
    burger.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      const item = q.parentElement;
      const open = item.classList.toggle("open");
      const a = item.querySelector(".faq-a");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  });
  document.querySelectorAll(".year").forEach(function (el) { el.textContent = new Date().getFullYear(); });
};

SSX.renderFeatured = function () {
  const el = document.getElementById("home-featured");
  if (!el) return;
  const sur = Number(SSX.settings.cantonSurcharge) || 0;
  const note = SSX.t("svc.cantonNote").replace("X%", sur + "%");
  const fmt = SSX.helpers.fmt;
  el.innerHTML =
    '<a class="feature-card" href="booking.html">' +
      '<span class="feature-icon feature-icon--red">' + SSX.icon("video", 26) + "</span>" +
      "<div><h3>" + SSX.t("svc.videoTitle") + "</h3>" +
      "<p>" + SSX.t("svc.videoDesc") + "</p></div>" +
      '<div class="feature-price">' + fmt(SSX.settings.videoPrice) + "<small>" + SSX.t("svc.videoUnit") + "</small></div>" +
      '<span class="feature-note">' + note + "</span>" +
      '<span class="feature-cta">' + SSX.t("svc.videoCta") + " →</span>" +
    "</a>" +
    '<a class="feature-card feature-card--gold" href="fillform.html">' +
      '<span class="feature-icon feature-icon--gold">' + SSX.icon("file", 26) + "</span>" +
      "<div><h3>" + SSX.t("svc.docTitle") + "</h3>" +
      "<p>" + SSX.t("svc.docDesc") + "</p></div>" +
      '<div class="feature-price">' + SSX.t("svc.docFrom") + " " + SSX.helpers.fmt(SSX.settings.docFlat) + "</div>" +
      '<span class="feature-note">' + note + "</span>" +
      '<span class="feature-cta">' + SSX.t("svc.docCta") + " →</span>" +
    "</a>";
};

SSX.fillFees = function () {
  var plain = document.getElementById("fee-plain");
  if (!plain) return;
  var cert = document.getElementById("fee-cert");
  var urgent = document.getElementById("fee-urgent");
  var lastmin = document.getElementById("fee-lastmin");
  plain.innerHTML = SSX.helpers.fmt(SSX.settings.docFlat) + " <small data-i18n=\"fee.perDoc\">" + SSX.t("fee.perDoc") + "</small>";
  if (cert) cert.innerHTML = SSX.helpers.fmt(SSX.settings.docFlatTax) + " <small data-i18n=\"fee.perDoc\">" + SSX.t("fee.perDoc") + "</small>";
  if (urgent) urgent.innerHTML = "+ " + (Number(SSX.settings.docUrgentFlat) || 15) + "<small>" + SSX.t("fee.urShort") + "</small>";
  if (lastmin) lastmin.innerHTML = "+ " + (Number(SSX.settings.docLastMinute) || 25) + "<small>" + SSX.t("fee.lastMinShort") + "</small>";
};