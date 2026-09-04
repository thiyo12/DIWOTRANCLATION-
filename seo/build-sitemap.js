/* Regenerates sitemap.xml with every site page + every SEO landing page
 * (23 topics × 4 languages = 92) including xhtml:link hreflang alternates.
 * Run: node seo/build-sitemap.js
 */

const path = require("node:path");
const fs = require("node:fs");
const { LANGS, SSAXCY, TOPICS, urlFor } = require("./pages");

const MAIN = [
  { loc: "/", pri: "1.0", freq: "weekly" },
  { loc: "/services.html", pri: "0.9", freq: "weekly" },
  { loc: "/translation.html", pri: "0.8", freq: "monthly" },
  { loc: "/concierge.html", pri: "0.8", freq: "monthly" },
  { loc: "/booking.html", pri: "0.7", freq: "monthly" },
  { loc: "/fillform.html", pri: "0.6", freq: "monthly" }
];

const LAST = "2026-09-05";

function hreflangFor(topic) {
  const tag = function (l) {
    const url = SSAXCY.url + urlFor(topic.id, l);
    return '      <xhtml:link rel="alternate" hreflang="' + l + '" href="' + url + '"/>';
  };
  const lines = LANGS.map(tag);
  lines.push('      <xhtml:link rel="alternate" hreflang="x-default" href="' + SSAXCY.url + urlFor(topic.id, "de") + '"/>');
  return lines.join("\n");
}

function urlXml(loc, pri, freq, extra) {
  let out = "  <url>\n";
  out += "    <loc>" + SSAXCY.url + loc + "</loc>\n";
  out += "    <lastmod>" + LAST + "</lastmod>\n";
  out += "    <changefreq>" + freq + "</changefreq>\n";
  out += "    <priority>" + pri + "</priority>\n";
  if (extra) out += extra + "\n";
  out += "  </url>";
  return out;
}

const parts = MAIN.map(function (m) { return urlXml(m.loc, m.pri, m.freq, null); });

TOPICS.forEach(function (t) {
  const pri = t.kind === "mode" ? "0.8" : "0.9";
  const freq = t.kind === "doc" ? "monthly" : "weekly";
  LANGS.forEach(function (lang) {
    parts.push(urlXml(urlFor(t.id, lang), pri, freq, hreflangFor(t)));
  });
});

const xml =
'<?xml version="1.0" encoding="UTF-8"?>\n' +
'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
parts.join("\n") +
"\n</urlset>\n";

const out = path.join(__dirname, "..", "sitemap.xml");
fs.writeFileSync(out, xml, "utf8");
console.log("Wrote " + out + " with " + (parts.length) + " <url> entries.");