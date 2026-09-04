/* SEO page renderer.
 * Turns one (topic, lang) from ./pages into a complete, crawlable HTML page.
 * Generated pages share the exact shell (header/footer, icons, i18n, main)
 * with the rest of the site, so the UX after JS boot is identical — while the
 * static HTML is fully indexable in all four languages (DE/FR/EN/IT).
 */

const { LANGS, SSAXCY, TOPICS, urlFor, ctaFor } = require("./pages");

const GA_ID = "G-38CYZNNLXK";

// ---------------------------------------------------------------------------
// Per-language UI chrome (renderer-level labels, not page content)
// ---------------------------------------------------------------------------
const UI = {
  de: {
    langLabel: "Deutsch",
    home: "Startseite",
    eyeInterp: "Live-Dolmetschen",
    eyeDoc: "Dokumentübersetzung",
    eyeVideo: "Video-Dolmetschen",
    eyeSite: "Dolmetscher vor Ort",
    eyeHub: "Dolmetscher in Zürich",
    benefitsTitle: "Warum Ssaaxcy Solutions",
    faqTitle: "Häufige Fragen",
    ctaTitleBook: "Bereit zu buchen?",
    ctaBodyBook: "Wählen Sie Sprache, Datum und Zeit — Bestätigung innerhalb eines Arbeitstags.",
    ctaTitleDoc: "Bereit für die Übersetzung?",
    ctaBodyDoc: "Laden Sie Ihr Dokument hoch — Angebot und fertige Übersetzung kommen per E-Mail.",
    concierge: "Concierge kontaktieren",
    relatedTitle: "Weitere Dienste in Zürich & der Schweiz",
    allServices: "Alle Dienstleistungen anzeigen",
    docServices: "Zur Dokumentübersetzung"
  },
  fr: {
    langLabel: "Français",
    home: "Accueil",
    eyeInterp: "Interprétation en direct",
    eyeDoc: "Traduction de documents",
    eyeVideo: "Interprétation en visio",
    eyeSite: "Interprète sur place",
    eyeHub: "Interprète à Zurich",
    benefitsTitle: "Pourquoi Ssaaxcy Solutions",
    faqTitle: "Questions fréquentes",
    ctaTitleBook: "Prêt à réserver ?",
    ctaBodyBook: "Choisissez langue, date et heure — confirmation sous un jour ouvrable.",
    ctaTitleDoc: "Prêt pour la traduction ?",
    ctaBodyDoc: "Téléversez votre document — offre et traduction finale par e-mail.",
    concierge: "Contacter le concierge",
    relatedTitle: "Autres services à Zurich et en Suisse",
    allServices: "Voir tous les services",
    docServices: "Aller à la traduction de documents"
  },
  en: {
    langLabel: "English",
    home: "Home",
    eyeInterp: "Live interpreting",
    eyeDoc: "Document translation",
    eyeVideo: "Video interpreting",
    eyeSite: "On-site interpreting",
    eyeHub: "Interpreter in Zurich",
    benefitsTitle: "Why Ssaaxcy Solutions",
    faqTitle: "Frequently asked questions",
    ctaTitleBook: "Ready to book?",
    ctaBodyBook: "Choose your language, date and time — confirmation within one working day.",
    ctaTitleDoc: "Ready for your translation?",
    ctaBodyDoc: "Upload your document — quote and finished translation arrive by email.",
    concierge: "Talk to the concierge",
    relatedTitle: "More services in Zurich & Switzerland",
    allServices: "View all services",
    docServices: "Go to document translation"
  },
  it: {
    langLabel: "Italiano",
    home: "Home",
    eyeInterp: "Interpretariato dal vivo",
    eyeDoc: "Traduzione di documenti",
    eyeVideo: "Interpretariato in video",
    eyeSite: "Interprete dal vivo",
    eyeHub: "Interprete a Zurigo",
    benefitsTitle: "Perché Ssaaxcy Solutions",
    faqTitle: "Domande frequenti",
    ctaTitleBook: "Pronto a prenotare?",
    ctaBodyBook: "Scelga lingua, data e ora — conferma entro un giorno lavorativo.",
    ctaTitleDoc: "Pronto per la traduzione?",
    ctaBodyDoc: "Carichi il suo documento — preventivo e traduzione finale via e-mail.",
    concierge: "Contatta la concierge",
    relatedTitle: "Altri servizi a Zurigo e in Svizzera",
    allServices: "Vedi tutti i servizi",
    docServices: "Vai alla traduzione di documenti"
  }
};

const OG_LOCALE = { de: "de_CH", fr: "fr_CH", en: "en_CH", it: "it_CH" };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function eyebrowFor(topic, ui) {
  if (topic.kind === "doc") return ui.eyeDoc;
  if (topic.kind === "mode" && topic.service === "video") return ui.eyeVideo;
  if (topic.kind === "mode") return ui.eyeSite;
  if (topic.kind === "hub") return ui.eyeHub;
  return ui.eyeInterp;
}

// All four language alternates + x-default (which points at the German page)
function hreflangBlock(topic) {
  const lines = LANGS.map(function (l) {
    return '      <link rel="alternate" hreflang="' + l + '" href="' + SSAXCY.url + urlFor(topic.id, l) + '">';
  });
  lines.push('      <link rel="alternate" hreflang="x-default" href="' + SSAXCY.url + urlFor(topic.id, "de") + '">');
  return lines.join("\n");
}

function jsonLd(obj) {
  return '<script type="application/ld+json">\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, "\n  ") + "\n  </script>";
}

function serviceJson(topic, lang, url) {
  const isDoc = topic.kind === "doc";
  const langs = ["German", "English", "Tamil"];
  const label = { de: "Deutsch", fr: "Français", en: "English", it: "Italiano" }[lang];
  if (langs.indexOf(label) === -1) langs.push(label);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: isDoc ? "TranslationService" : "InterpretingService",
    name: topic[lang].title,
    description: topic[lang].meta,
    url: url,
    provider: {
      "@type": "LocalBusiness",
      name: SSAXCY.org,
      url: SSAXCY.url,
      telephone: SSAXCY.phone,
      email: SSAXCY.email
    },
    areaServed: ["Zürich", "Switzerland"],
    availableLanguage: langs
  };
}

function breadcrumbJson(topic, lang, url) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, name: UI[lang].home, item: SSAXCY.url },
      { "@type": "ListItem", "position": 2, name: topic[lang].title, item: url }
    ]
  };
}

function faqJson(topic, lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": topic[lang].faq.map(function (qa) {
      return {
        "@type": "Question",
        name: qa[0],
        acceptedAnswer: { "@type": "Answer", text: qa[1] }
      };
    })
  };
}

// Sibling topics for the internal-linking block (same language)
function relatedLinks(topic, lang) {
  const list = topic.kind === "hub"
    ? TOPICS.filter(function (t) { return t.kind === "book"; })
    : TOPICS.filter(function (t) { return t.id !== topic.id && t.kind === topic.kind; });
  const others = TOPICS.filter(function (t) { return t.id !== topic.id && t.kind !== topic.kind; });
  const chosen = list.concat(others).slice(0, 6);
  return chosen.map(function (t) {
    const p = t[lang];
    return '<a class="card card-hover service-card" href="' + urlFor(t.id, lang) + '">' +
      '<h3>' + esc(p.title) + "</h3>" +
      "<p>" + esc(p.intro.slice(0, 120)) + "</p>" +
      '<span class="card-link">' + UI[lang].langLabel + " →</span></a>";
  }).join("");
}

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------
function renderPage(topic, lang) {
  const ui = UI[lang] || UI.de;
  const p = topic[lang];
  if (!p) return null;

  const url = SSAXCY.url + urlFor(topic.id, lang);
  const cta = ctaFor(topic, lang);
  const canonicalAlt = hreflangBlock(topic);
  const isDoc = topic.kind === "doc";
  const homeCrumb = '<a href="' + SSAXCY.url + '/">' + esc(ui.home) + "</a>";

  const benefits = p.points.map(function (pt) {
    return '<li><span class="check">✓</span><div><b>' + esc(pt[0]) + "</b><span>" + esc(pt[1]) + "</span></div></li>";
  }).join("\n          ");

  const faq = p.faq.map(function (qa) {
    return '<div class="faq-item">\n          <button class="faq-q">' + esc(qa[0]) + '</button> <span class="chev">▾</span>\n          <div class="faq-a"><p>' + esc(qa[1]) + "</p></div>\n        </div>";
  }).join("\n        ");

  const related = relatedLinks(topic, lang);

  return (
"<!DOCTYPE html>\n" +
'<html lang="' + lang + '">\n' +
"<head>\n" +
'  <!-- Google tag (gtag.js) -->\n' +
'  <script async src="https://www.googletagmanager.com/gtag/js?id=' + GA_ID + '"></script>\n' +
"  <script>\n" +
"    window.dataLayer = window.dataLayer || [];\n" +
"    function gtag(){dataLayer.push(arguments);}\n" +
"    gtag('js', new Date());\n" +
"    gtag('config', '" + GA_ID + "');\n" +
"  </script>\n" +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
"  <title>" + esc(p.title) + "</title>\n" +
'  <meta name="description" content="' + esc(p.meta) + '">\n' +
'  <link rel="canonical" href="' + url + '">\n' +
"  <meta property=\"og:type\" content=\"website\">\n" +
'  <meta property="og:title" content="' + esc(p.title) + '">\n' +
'  <meta property="og:description" content="' + esc(p.meta) + '">\n' +
'  <meta property="og:url" content="' + url + '">\n' +
'  <meta property="og:image" content="' + SSAXCY.url + '/assets/brand/logo-head.png">\n' +
'  <meta property="og:locale" content="' + OG_LOCALE[lang] + '">\n' +
'  <link rel="icon" href="/assets/brand/favicon.png" type="image/png">\n' +
'  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
'  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet">\n' +
'  <link rel="stylesheet" href="/css/style.css">\n' +
canonicalAlt + "\n" +
jsonLd(serviceJson(topic, lang, url)) + "\n" +
jsonLd(breadcrumbJson(topic, lang, url)) + "\n" +
jsonLd(faqJson(topic, lang)) + "\n" +
"</head>\n" +
"<body>\n" +
"\n" +
'  <header class="site-header" data-slot="header">\n' +
'    <div class="container header-inner"></div>\n' +
"  </header>\n" +
"\n" +
'  <section class="page-hero">\n' +
'    <div class="container">\n' +
'      <div class="breadcrumb">' + homeCrumb + " → <span>" + esc(eyebrowFor(topic, ui)) + "</span></div>\n" +
'      <span class="eyebrow">' + esc(eyebrowFor(topic, ui)) + "</span>\n" +
"      <h1>" + esc(p.h1) + "</h1>\n" +
"      <p>" + esc(p.intro) + "</p>\n" +
'      <div class="hero-actions" style="margin-top:24px;">\n' +
'        <a class="btn btn-light btn-lg" href="' + esc(cta.href) + '">' + esc(cta.label) + "</a>\n" +
'        <a class="btn btn-lg" style="background:transparent;border-color:rgba(255,255,255,0.45);color:#fff;" href="/concierge.html">' + esc(ui.concierge) + "</a>\n" +
"      </div>\n" +
"    </div>\n" +
"  </section>\n" +
"\n" +
'  <section class="section">\n' +
'    <div class="container" style="max-width:820px;">\n' +
'      <div class="section-head center">\n' +
'        <span class="eyebrow">' + esc(ui.home) + "</span>\n" +
'        <h2 class="section-title">' + esc(ui.benefitsTitle) + "</h2>\n" +
"      </div>\n" +
'      <ul class="check-list" style="margin-top:6px;">\n' +
"        " + benefits + "\n" +
"      </ul>\n" +
"    </div>\n" +
"  </section>\n" +
"\n" +
'  <section class="section" style="padding-top:0;">\n' +
'    <div class="container">\n' +
'      <div class="band band-red">\n' +
"        <div>\n" +
"          <h2>" + esc(isDoc ? ui.ctaTitleDoc : ui.ctaTitleBook) + "</h2>\n" +
"          <p>" + esc(isDoc ? ui.ctaBodyDoc : ui.ctaBodyBook) + "</p>\n" +
"        </div>\n" +
'        <a class="btn btn-light btn-lg" href="' + esc(cta.href) + '">' + esc(cta.label) + "</a>\n" +
"      </div>\n" +
"    </div>\n" +
"  </section>\n" +
"\n" +
'  <section class="section-tight" style="padding-top:0;background:var(--white);border-block:1px solid var(--line);">\n' +
'    <div class="container" style="max-width:820px;">\n' +
'      <div class="section-head center">\n' +
'        <span class="eyebrow">' + esc(ui.langLabel) + "</span>\n" +
'        <h2 class="section-title">' + esc(ui.faqTitle) + "</h2>\n" +
"      </div>\n" +
"      <div>\n" +
"        " + faq + "\n" +
"      </div>\n" +
"    </div>\n" +
"  </section>\n" +
"\n" +
'  <section class="section">\n' +
'    <div class="container">\n' +
'      <div class="section-head">\n' +
'        <span class="eyebrow">Ssaaxcy Solutions</span>\n' +
'        <h2 class="section-title">' + esc(ui.relatedTitle) + "</h2>\n" +
"      </div>\n" +
'      <div class="service-grid">\n' +
"        " + related + "\n" +
"      </div>\n" +
'      <div style="text-align:center;margin-top:30px;">\n' +
'        <a href="/services.html" class="btn btn-dark">' + esc(ui.allServices) + "</a>\n" +
"      </div>\n" +
"    </div>\n" +
"  </section>\n" +
"\n" +
'  <footer class="site-footer" data-slot="footer"></footer>\n' +
"\n" +
'  <script src="/js/icons.js"></script>\n' +
'  <script src="/js/i18n.js"></script>\n' +
'  <script src="/js/main.js"></script>\n' +
"  <script>SSX.injectLangSwitcher(document);</script>\n" +
"</body>\n" +
"</html>\n"
  );
}

module.exports = { renderPage, esc };