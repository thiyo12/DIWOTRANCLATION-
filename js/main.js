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
  supportEmail: "hello@ssaaxcy.ch",
  supportPhone: "+41 44 000 00 00",
  whatsapp: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  flagStyle: "drift",
  heroImage: ""
};

SSX.applySettings = function (s) {
  if (!s) return;
  var map = {
    brand_name: "brandName", support_email: "supportEmail", support_phone: "supportPhone",
    travel_fee: "travelFee", hero_image_url: "heroImage", flag_style: "flagStyle"
  };
  Object.keys(map).forEach(function (k) { if (s[k] !== undefined && s[k] !== null) SSX.settings[map[k]] = s[k]; });
  ["whatsapp", "instagram", "facebook", "linkedin", "currency"].forEach(function (k) {
    if (s[k] !== undefined && s[k] !== null) SSX.settings[k] = s[k];
  });
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

// true when served over http(s) (fetch available), false when opened from disk
SSX.http = typeof fetch === "function";

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
          '<li><a href="services.html" data-i18n="nav.services"></a></li>' +
          '<li><a href="translation.html" data-i18n="nav.translation"></a></li>' +
          '<li><a href="fillform.html" data-i18n="nav.fillForm"></a></li>' +
          '<li><a href="booking.html" data-i18n="nav.booking"></a></li>' +
        "</ul></div>" +
      '<div class="footer-col"><h4>' + SSX.t("nav.concierge") + '</h4><ul>' +
        '<li><a href="concierge.html" data-i18n="nav.concierge"></a></li>' +
        "</ul></div>" +
      '<div class="footer-col"><h4>' + SSX.t("nav.contact") + '</h4><ul>' +
        '<li><a href="mailto:' + SSX.settings.supportEmail + '">' + SSX.settings.supportEmail + "</a></li>" +
        '<li><a href="tel:' + SSX.settings.supportPhone.replace(/\s/g, "") + '">' + SSX.settings.supportPhone + "</a></li>" +
      "</ul></div>" +
    "</div>" +
    '<div class="container footer-bottom"><span>© <span class="year"></span> ' + SSX.settings.brandName + ", Zürich, Switzerland. <span data-i18n=\"footer.rights\"></span></span>" +
    '<span class="footer-pay">' + SSX.icon("lock") + " Secure payment · Visa · Mastercard · TWINT · Invoice</span>" +
    "</div>"
  );
};

document.addEventListener("DOMContentLoaded", function () {
  SSX.boot();
});

SSX.boot = function () {
  fetch("/api/catalog")
    .then(function (r) { return r.json(); })
    .then(function (j) { SSX.applySettings(j && j.settings); })
    .catch(function () {})
    .then(SSX.renderShell);
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
    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = SSX.settings.whatsapp;
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "WhatsApp");
    wa.innerHTML = SSX.icon("whatsapp", 22);
    document.body.appendChild(wa);
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