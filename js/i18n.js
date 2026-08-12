window.SSX = window.SSX || {};

// ---------------------------------------------------------------------------
// Ssaaxcy Solutions — trilingual i18n (English / Deutsch / தமிழ்)
// Usage:
//   SSX.lang               current language code ("de" | "en" | "ta")
//   SSX.t(key)             translated string
//   SSX.setLang(code)      switch language, persist, re-render (fires "ssx:lang")
//   data-i18n="key"        translates element text / input placeholder
// ---------------------------------------------------------------------------

(function () {
  var LANG_KEY = "ssx_lang";
  var CODES = ["en", "de", "ta"];

  var DICT = {
    // ---------------- nav ----------------
    "nav.home": { en: "Home", de: "Startseite", ta: "முகப்பு" },
    "nav.services": { en: "Services", de: "Dienstleistungen", ta: "சேவைகள்" },
    "nav.translation": { en: "Translation", de: "Übersetzung", ta: "மொழிபெயர்ப்பு" },
    "nav.fillForm": { en: "Fill a form", de: "Formular ausfüllen", ta: "படிவம் நிரப்பு" },
    "nav.booking": { en: "Book", de: "Buchen", ta: "பதிவு" },
    "nav.concierge": { en: "Concierge", de: "Concierge", ta: "கன்சியர்ஜ்" },
    "nav.contact": { en: "Contact", de: "Kontakt", ta: "தொடர்பு" },
    "nav.bookNow": { en: "Book now", de: "Jetzt buchen", ta: "இப்போது பதிவு" },
    "nav.menu": { en: "Menu", de: "Menü", ta: "பட்டியல்" },
    "lang.switch": { en: "Language", de: "Sprache", ta: "மொழி" },

    // ---------------- shared ----------------
    "brand.name": { en: "Ssaaxcy Solutions", de: "Ssaaxcy Solutions", ta: "Ssaaxcy Solutions" },
    "tagline.short": { en: "Interpreting · Translating · Concierge", de: "Dolmetschen · Übersetzen · Concierge", ta: "பொழிப்பு · மொழிபெயர்ப்பு · கன்சியர்ஜ்" },
    "common.and": { en: "and", de: "und", ta: "மற்றும்" },
    "common.continue": { en: "Continue", de: "Weiter", ta: "தொடரவும்" },
    "common.back": { en: "Back", de: "Zurück", ta: "பின்செல்" },
    "common.select": { en: "Select…", de: "Auswählen…", ta: "தேர்ந்தெடு…" },
    "common.loading": { en: "Loading…", de: "Lädt…", ta: "ஏற்றுகிறது…" },
    "common.required": { en: "Required", de: "Pflichtfeld", ta: "கட்டாயம்" },
    "common.optional": { en: "Optional", de: "Optional", ta: "விருப்பம்" },
    "common.inPerson": { en: "In person", de: "Vor Ort", ta: "நேரில்" },
    "common.video": { en: "Video call", de: "Videoanruf", ta: "வீடியோ அழைப்பு" },
    "common.videoShort": { en: "Video", de: "Video", ta: "வீடியோ" },
    "common.from": { en: "from", de: "aus", ta: "இருந்து" },
    "common.to": { en: "to", de: "nach", ta: "வரை" },
    "common.preferred": { en: "Preferred interpreter", de: "Bevorzugte: Dolmetscher:in", ta: "விருப்பமான மொழியாளர்" },

    // ---------------- home ----------------
    "home.eyebrow": { en: "Swiss digital concierge", de: "Schweizer digitaler Concierge", ta: "சுவிஸ் டிஜிட்டல் கன்சியர்ஜ்" },
    "home.heroTitle": { en: "Switzerland, in your language.", de: "Die Schweiz, in Ihrer Sprache.", ta: "சுவிட்சர்லாந்து, உங்கள் மொழியில்." },
    "home.heroSub": { en: "Professional interpreters, document translations and a personal concierge for every official appointment — in German, English and Tamil.", de: "Professionelle Dolmetscher, Übersetzungen und ein persönlicher Concierge für jeden offiziellen Termin — auf Deutsch, Englisch und Tamil.", ta: "ஜெர்மன், ஆங்கிலம் மற்றும் தமிழில் ஒவ்வொரு அதிகாரப்பூர்வ நியமனத்திற்கும் தொழில்முறை மொழிபெயர்ப்பாளர்கள், ஆவண மொழிபெயர்ப்பு மற்றும் தனிப்பட்ட கன்சியர்ஜ்." },
    "home.heroCta": { en: "Book an interpreter", de: "Dolmetscher buchen", ta: "மொழிபெயர்ப்பாளரை பதிவு" },
    "home.heroCtaConcierge": { en: "Talk to the concierge", de: "Concierge kontaktieren", ta: "கன்சியர்ஜை தொடர்புகொள்ள" },
    "home.heroLanguages": { en: "German · English · Tamil", de: "Deutsch · Englisch · Tamil", ta: "ஜெர்மன் · ஆங்கிலம் · தமிழ்" },
    "home.trusted.who": { en: "Languages supported", de: "Sprachen", ta: "மொழிகள்" },
    "home.trusted.whoSub": { en: "Assignments / year", de: "Einsätze / Jahr", ta: "ஆண்டு நியமனம்" },
    "home.trust.who": { en: "For everyone in Switzerland", de: "Für alle in der Schweiz", ta: "சுவிட்சர்லாந்தில் உள்ள அனைவருக்கும்" },
    "home.trust.whoSub": { en: "Newcomers, families, professionals and businesses — anyone who needs official conversations or documents handled right.", de: "Neuzuzüger:innen, Familien, Fachkräfte und Unternehmen — für alle, die offizielle Gespräche oder Dokumente richtig erledigt brauchen.", ta: "புதியவர்கள், குடும்பங்கள், தொழில் வல்லுநர்கள் மற்றும் வணிகங்கள் — உத்தியோகபூர்வ உரையாடல்களையும் ஆவணங்களையும் சரியாக முடிக்க தேவைப்படுபவர்கள்." },
    "home.sectionConcierge": { en: "Your Swiss Life Assistant", de: "Ihr Swiss Life Assistent", ta: "உங்கள் சுவிஸ் வாழ்க்கை உதவியாளர்" },
    "home.sectionConciergeSub": { en: "Letters, phone calls, appointments — one trusted inbox for your Swiss admin.", de: "Briefe, Anrufe, Termine — Ihr vertrauter Anlaufpunkt für die Schweizer Administration.", ta: "கடிதங்கள், தொலைபேசி அழைப்புகள், நியமனம் — உங்கள் சுவிஸ் நிர்வாகத்திற்கு ஒரே நம்பிக்கை தளம்." },
    "home.sectionServices": { en: "Interpreters for your appointments", de: "Dolmetscher für Ihre Termine", ta: "உங்கள் நிகழங்களுக்கு மொழிபெயர்ப்பாளர்கள்" },
    "home.sectionServicesSub": { en: "Every official, medical, family, financial and work conversation — interpreted clearly, respecting confidentiality.", de: "Jedes offizielle, medizinische, familiäre, finanzielle und berufliche Gespräch — klar gedolmetscht und vertraulich.", ta: "ஒவ்வொரு அதிகாரப்பூர்வ, மருத்துவ, குடும்ப, நிதி மற்றும் வேலை உரையாடலும் — தெளிவாகவும் ரகசியமாகவும்." },
    "home.btnViewServices": { en: "View all services", de: "Alle Dienstleistungen", ta: "அனைத்து சேவைகளை" },
    "home.btnBookNow": { en: "Book this service", de: "Diese Leistung buchen", ta: "இந்த சேவை பதிவு" },
    "home.sectionHow": { en: "How it works", de: "So funktioniert es", ta: "அது எப்படி இயங்கும்" },
    "home.how1Title": { en: "Tell us the occasion", de: "Teilen Sie uns den Termin mit", ta: "நிகழ்வை சொல்லுங்கள்" },
    "home.how1Body": { en: "Choose your language, our service, and the date.", de: "Wählen Sie Sprache, Dienstleistung und Datum.", ta: "மொழி, சேவை மற்றும் தேதியை தேர்ந்தெடு." },
    "home.how2Title": { en: "We match an interpreter", de: "Wir vermitteln passende Dolmetsch", ta: "பொருத்தமானவர் தேர்வு" },
    "home.how2Body": { en: "A qualified interpreter with the right context for your appointment.", de: "Eine qualifizierte Dolmetscher:in mit passendem Fachwissen für Ihren Termin.", ta: "உங்கள் நிகழங்களுக்கு தகுதியான மொழிபெயர்ப்பாளர்." },
    "home.how3Title": { en: "We come along", de: "Wir begleiten Sie", ta: "நாங்கள் உடன் வருவோம்" },
    "home.how3Body": { en: "Jointly by video or in person — with full confidentiality.", de: "Gemeinsam per Video oder vor Ort — vertraulich.", ta: "வீடியோ வழியாகவோ அல்லது நேரில் — முழு வர்தனையுடன்." },
    "home.btnHowNow": { en: "Book now", de: "Jetzt buchen", ta: "இப்போது பதிவு" },

    // homepage trust bar
    "trust.vetted": { en: "Vetted & trained interpreters", de: "Geprüfte & geschulte Dolmetschende", ta: "சரிபார்க்கப்பட்ட மொழிபெயர்ப்பாளர்கள்" },
    "trust.week": { en: "Available every day", de: "Täglich verfügbar", ta: "ஒவ்வொரு நாளும்" },
    "trust.cantons": { en: "All 26 cantons", de: "Alle 26 Kantone", ta: "அனைத்து 26 கன்டோன்களும்" },
    "trust.confidential": { en: "Confidential & impartial", de: "Vertraulich & unparteiisch", ta: "ரகசியம் & நடுநிலை" },
    "trust.cancel": { en: "Free cancellation up to 24 h", de: "Kostenlose Stornierung bis 24 h", ta: "24 மணி வரை இலவச ரத்து" },

    // live demo labels
    "live.tag": { en: "Live", de: "Live", ta: "நேரடி" },
    "live.secure": { en: "Secure", de: "Sicher", ta: "பாதுகாப்பு" },
    "tag.videoLive": { en: "Video call · Live interpreting", de: "Videoanruf · Live-Dolmetschen", ta: "வீடியோ · நேரடி மொழிபெயர்ப்பு" },
    "demo.people": { en: "Her family & Hafun", de: "Ihre Familie & Hafun", ta: "குடும்பம் & ஹாஃபுன்" },
    "demo.appt": { en: "Doctor consultation · Zürich", de: "Arztgespräch · Zürich", ta: "மருத்துவ ஆலோசனை · சூரிக்" },
    "demo.bubble1": { en: "Guten Tag — I understand the diagnosis, but not all the details about the medicines.", de: "Guten Tag — ich verstehe die Diagnose, aber nicht alle Angaben zu den Medikamenten.", ta: "வணக்கம் — நோய் கண்டறிதல் புரிகிறது, ஆனால் மருந்துப் பட்டியல் அல்ல." },
    "demo.bubble2": { en: "I will now translate the doctor's instructions for you, step by step.", de: "Ich übersetze Ihnen jetzt die Anweisungen des Arztes Schritt für Schritt.", ta: "மருத்துவர் படிப்படியாக — நான் மொழிபெயர்க்கிறேன்." },
    "hero.floatTitle": { en: "Payment secured", de: "Gesicherte Zahlung", ta: "பாதுகாக்கப்பட்ட பணம்" },
    "hero.floatSub": { en: "SSL · TLS · Swiss data protection", de: "SSL · TLS · Schweizer Datenschutz", ta: "SSL · TLS · சுவிஸ் தரவு பாதுகாப்பு" },

    // services section label + steps eyebrow
    "svc.eyebrow": { en: "Live interpreting", de: "Live-Dolmetschen", ta: "நேரடி மொழிபெயர்ப்பு" },
    "steps.eyebrow": { en: "How it works", de: "So funktioniert es", ta: "இது எப்படி இயங்கும்" },

    // why section
    "why.title": { en: "Interpreting that fits around your life", de: "Dolmetschen, das zu Ihrem Leben passt", ta: "உங்கள் வாழ்க்கையில் பொருந்தும் மொழிபெயர்ப்பு" },
    "why.lead": { en: "Our interpreters are professionally trained, impartial and experienced in Swiss medical, administrative and legal settings.", de: "Unsere Dolmetschenden sind geschult, unabhängig und erfahren in medizinischen, administrativen und rechtlichen Bereichen.", ta: "எங்கள் மொழிபெயர்ப்பாளர்கள் பயிற்சியுடன், நடுநிலையான, சுவிஸ் மருத்துவ/சட்ட அனுபவம் உள்ளவர்கள்." },
    "why.video.t": { en: "Video interpreting included", de: "Videodolmetschen inklusive", ta: "வீடியோ மொழிபெயர்ப்பு சேர்க்கப்பட்டு" },
    "why.video.d": { en: "Join from your phone securely — no app install needed.", de: "Sicher vom Handy — ganz ohne App.", ta: "உங்கள் ஃபோனிலிருந்து பயன்பாடு இல்லாமலே." },
    "why.site.t": { en: "On-site in your canton", de: "Vor Ort in Ihrem Kanton", ta: "உங்கள் கன்டோனில் நேரில்" },
    "why.site.d": { en: "Physical interpreters travel to your office, school, clinic or home.", de: "Dolmetschende kommen zu Ihnen, auch in Schule oder Home.", ta: "மொழிபெயர்ப்பாளர்கள் உங்கள் இடத்திற்கு வருவார்கள்." },
    "why.human.t": { en: "A real person, always", de: "Immer ein Mensch", ta: "எப்போதும் ஒரு உண்மையான நபர்" },
    "why.human.d": { en: "A trained human interpreter — never a machine translation.", de: "Ein geschulter Mensch — niemals Maschinenübersetzung.", ta: "ஒரு பயிற்சி பெற்றவர் — இயந்திர மொழிபெயர்ப்பு அல்ல." },
    "why.visTitle": { en: "The Swiss system, clearly explained", de: "Das Schweizer System, klar erklärt", ta: "சுவிஸ் அமைப்பு, தெளிவாக" },
    "why.visBody": { en: "Health insurance, taxes, AHV, Kita & school registration, permits and Gemeinde services.", de: "Krankenkasse, Steuern, AHV, Kita- und Schulanmeldung, Bewilligungen und Gemeinde.", ta: "சுகாதார காப்பீடு, வரி, AHV, பள்ளி பதிவு, அனைத்தும்." },
    "why.vis1.t": { en: "Registered interpreters", de: "Qualifizierte Dolmetschende", ta: "பதிவு மொழிபெயர்ப்பாளர்கள்" },
    "why.vis1.d": { en: "Trained community & certified networks", de: "Ausgebildete Community & zertifizierte Netze", ta: "சான்றிதழ் வலையமைப்புகள்" },
    "why.vis2.t": { en: "Confidentiality assured", de: "Vertraulichkeit garantiert", ta: "ரகசியத்துவம் உறுதி" },
    "why.vis2.d": { en: "Nothing you say ever leaves the conversation", de: "Ihr Vertrauen bleibt geschützt", ta: "நீங்கள் சொல்வது வெளியேறாது" },
    "why.vis3.t": { en: "Document support", de: "Dokumente, erklärt", ta: "ஆவண உதவி" },
    "why.vis3.d": { en: "Letters & forms explained by the concierge", de: "Briefe und Formulare vom Concierge erklärt", ta: "கடிதங்கள் விளக்கம்" },

    // concierge home band
    "con.home.title": { en: "The Swiss Life Concierge", de: "Der Swiss Life Concierge", ta: "சுவிஸ் வாழ்க்கை Concierge" },
    "con.home.body": { en: "Don't stop at interpreting. Our concierge reads official letters, handles paperwork, makes calls and books appointments — in your language.", de: "Nicht nur dolmetschen. Unser Concierge liest Briefe, erledigt Formulare, ruft an und bucht — in Ihrer Sprache.", ta: "கடிதங்கள், அலுவலக வேலை, அழைப்பு — உங்கள் மொழியில்." },

    // FAQ
    "faq.eyebrow": { en: "FAQ", de: "FAQ", ta: "FAQ" },
    "faq.title": { en: "Questions, answered", de: "Fragen, beantwortet", ta: "கேள்விகள், பதில்" },
    "faq1.q": { en: "How do I book and pay?", de: "Wie buche ich und zahle?", ta: "எப்படி பதிவு?" },
    "faq1.a": { en: "Pick your language and service, choose date, time and video or on-site, and confirm. Payment after the appointment.", de: "Sprache & Dienstleistung wählen, Datum, Zeit, Video oder vor Ort — und bestätigen. Zahlung nach dem Termin.", ta: "மொழி, சேவை, தேதி, நேரம், வீடியோ/நேரில் — பின்னர் பதிவு." },
    "faq2.q": { en: "What if I need to cancel?", de: "Kann ich stornieren?", ta: "ரத்து செய்யலாமா?" },
    "faq2.a": { en: "Free cancellation up to 24 h before the appointment. Within 24 h, 50% is charged; no-shows pay the full rate.", de: "Bis 24h kostenlos. Danach 50%, bei No-Show der volle Preis.", ta: "24 மணி வரை இலவச ரத்து. பின்னர் 50%." },
    "faq3.q": { en: "Are your interpreters qualified?", de: "Sind Ihre Dolmetscher qualifiziert?", ta: "மொழிபெயர்ப்பாளர்கள் தகுதியா?" },
    "faq3.a": { en: "Yes — vetted, trained and impartial, with experience in Swiss medical and legal settings.", de: "Ja — geprüft, geschult und unabhängig.", ta: "ஆம் — தகுதியுடன்." },
    "faq4.q": { en: "Which regions do you cover?", de: "Welche Regionen?", ta: "எந்த பகுதிகள்?" },
    "faq4.a": { en: "All 26 cantons — highest availability around Zurich, Bern, Basel, Lausanne and Geneva.", de: "Alle 26 Kantone — vor allem Zürich, Bern, Basel, Genf.", ta: "அனைத்து 26 கன்டோன்கள்." },

    // ---------------- services page ----------------
    "services.eyebrow": { en: "Interpreting", de: "Dolmetschen", ta: "மொழிபெயர்ப்பு" },
    "services.title": { en: "Every conversation, covered.", de: "Jedes Gespräch, abgedeckt.", ta: "ஒவ்வொரு உரையாடலும், உறுதி." },
    "services.subtitle": { en: "From the doctor's office to the bank and the job interview — professional interpret with you, at your side.", de: "Vom Arzt bis zur Bank bis zum Vorstellungsgespräch — professionelle Dolmetschende an Ihrer Seite.", ta: "மருத்துவ அலுவலகம் முதல் வங்கி, வேலை நேர்காணல் வரை — நிலையானவர்கள் உங்கள் அருகில்." },
    "svc.feature.eyebrow": { en: "Online services", de: "Online-Dienste", ta: "ஆன்லைன் சேவைகள்" },
    "svc.videoTitle": { en: "Video translation", de: "Videoübersetzung", ta: "வீடியோ மொழிபெயர்ப்பு" },
    "svc.videoDesc": { en: "Live translation by video call — no travel, works from your phone, secure link by email.", de: "Live-Übersetzung per Videoanruf — ohne Anreise, vom Handy, sicherer Link per E-Mail.", ta: "வீடியோ அழைப்பில் நேரடி மொழிபெயர்ப்பு — பயணம் இல்லை, தொலைபேசியில், பாதுகாப்பான இணைப்பு." },
    "svc.videoCta": { en: "Book video translation", de: "Videoübersetzung buchen", ta: "வீடியோ மொழிபெயர்ப்பை பதிவு" },
    "svc.videoUnit": { en: "/ hour", de: "/ Stunde", ta: "/ மணி" },
    "svc.docTitle": { en: "Online document translation", de: "Online-Dokumentübersetzung", ta: "ஆன்லைன் ஆவண மொழிபெயர்ப்பு" },
    "svc.docDesc": { en: "Upload or describe your document — certified & plain translation delivered by email.", de: "Dokument hochladen oder beschreiben — beglaubigt & einfach per E-Mail.", ta: "ஆவணத்தை பதிவேற்றவும் அல்லது விவரிக்கவும் — சான்றளிக்கப்பட்ட மொழிபெயர்ப்பு." },
    "svc.docCta": { en: "Translate a document", de: "Dokument übersetzen", ta: "ஆவணத்தை மொழிபெயர்" },
    "svc.docFrom": { en: "from CHF", de: "ab CHF", ta: "CHF இலிருந்து" },
    "svc.cantonNote": { en: "Zürich price · +X% outside Zürich", de: "Preis Zürich · +X% ausserhalb Zürich", ta: "சூரிச் விலை · சூரிச் வெளியே +X%" },
    "booking.canton": { en: "Your canton", de: "Ihr Kanton", ta: "உங்கள் கன்டன்" },
    "booking.cantonHint": { en: "Prices are valid in Zürich. Outside Zürich a surcharge applies.", de: "Preise gelten in Zürich. Ausserhalb Zürich fällt ein Zuschlag an.", ta: "சூரிச்சில் விலைகள் உள்ளன. சூரிச் வெளியே கூடுதல் கட்டணம்." },
    "summary.cantonFee": { en: "Canton surcharge", de: "Kantonszuschlag", ta: "கண்டன் கூடுதல்" },
    "fill.canton": { en: "Your canton", de: "Ihr Kanton", ta: "உங்கள் கன்டன்" },
    "fill.ratesNote": { en: "Flat CHF 125 per document (certified CHF 120) — exact quote by email.", de: "Pauschal CHF 125 pro Dokument (beglaubigt CHF 120) — Angebot per E-Mail.", ta: "ஒவ்வொரு ஆவணத்திற்கும் CHF 125 (சான்று CHF 120) — இறுதி விலை மின்னஞ்சலில்." },
    "fill.options": { en: "Options", de: "Optionen", ta: "விருப்பங்கள்" },
    "fill.urgent": { en: "Urgent (24 h)", de: "Eilauftrag (24 h)", ta: "அவசரம் (24 மணி)" },
    "fill.lastMinute": { en: "Last-minute (within 48 h)", de: "Kurzfristig (innerhalb 48 h)", ta: "கடைசி நிமிடம் (48 மணி)" },
    "fill.feeEstimate": { en: "Fee estimate", de: "Preisschätzung", ta: "கட்டண மதிப்பீடு" },
    "services.all": { en: "All appointments", de: "Alle Termine", ta: "அனைத்து நிகழ்வுகள்" },
    "services.cat.medical": { en: "Medical", de: "Medizinisch", ta: "மருத்துவ" },
    "services.cat.official": { en: "Official & legal", de: "Amtlich & rechtlich", ta: "அதிகாரப்பூர்வ" },
    "services.cat.family": { en: "Family", de: "Familie", ta: "குடும்ப" },
    "services.cat.finance": { en: "Finance", de: "Finanzen", ta: "நிதி" },
    "services.cat.work": { en: "Work", de: "Arbeit", ta: "வேலை" },
    "services.cat.other": { en: "Other", de: "Sonstiges", ta: "மற்ற" },

    // services page: pricing
    "pricing.title": { en: "How the price is calculated", de: "So berechnet sich der Preis", ta: "விலை எப்படி கணக்கிடப்படுகிறது" },
    "pricing.sub": { en: "The rate depends on the situation. Choose a duration and video (included) or on-site (small travel fee).", de: "Der Tarif hängt von der Situation ab. Wählen Sie die Dauer sowie Video (inklusive) oder vor Ort (kleine Anreisegebühr).", ta: "சூழ்நிலைக்கு ஏற்ப கட்டணம். நேரம், வீடியோ (இலவசம்) அல்லது நேரில்." },
    "pricing.hSituation": { en: "Situation", de: "Situation", ta: "சூழ்நிலை" },
    "pricing.hHour": { en: "Per hour", de: "Pro Stunde", ta: "ஒரு மணி" },
    "pricing.h30": { en: "30 min", de: "30 Min", ta: "30 நிமி" },
    "pricing.h90": { en: "90 min", de: "90 Min", ta: "90 நிமி" },
    "pricing.h120": { en: "2 hours", de: "2 Stunden", ta: "2 மணி" },
    "pricing.travelNote": { en: "Travel fee for on-site interpreters: <b>CHF 25</b> flat per assignment. Distance surcharges beyond 30 km are agreed before confirming. Prices in <b>CHF</b>.", de: "Anreisegebühr für Dolmetschende vor Ort: <b>CHF 25</b> pauschal pro Einsatz. Zuschläge über 30 km werden vor der Bestätigung vereinbart. Preise in <b>CHF</b>.", ta: "நேரில் செல்லும் மொழிபெயர்ப்பாளர்களுக்கு பயணக் கட்டணம்: <b>CHF 25</b>. 30 கிமீக்கு மேல் கூடுதல். விலை <b>CHF</b>." },
    "pricing.ctaTitle": { en: "Ready to book?", de: "Bereit zu buchen?", ta: "பதிவு செய்ய தயாரா?" },
    "pricing.ctaBody": { en: "Choose your language, date and time — we confirm within one working day.", de: "Wählen Sie Sprache, Datum und Zeit — Bestätigung innerhalb eines Arbeitstags.", ta: "மொழி, தேதி, நேரம் — ஒரு வேலை நாளில் உறுதி." },

    // ---------------- translation page ----------------
    "trans.eyebrow": { en: "Documents", de: "Dokumente", ta: "ஆவணங்கள்" },
    "trans.title": { en: "Official translation, done properly.", de: "Offizielle Übersetzung, korrekt.", ta: "அதிகாரப்பூர்வ மொழிபெயர்ப்பு, உரியமாக." },
    "trans.subtitle": { en: "Certified, notarised and plain document translation in German, English and Tamil — accepted by Swiss authorities and employers.", de: "Begegentigte und juristische Übersetzung auf Deutsch, Englisch und Tamil — anerkannt von Schweizer Behörden und Arbeitgebern.", ta: "சுவிஸ் அதிகாரிகளும் முதலாளிகளும் ஏற்றுக் கொள்ளும், சண்டிக்கிற மொழிபெயர்ப்பு." },
    "trans.order": { en: "Order a translation", de: "Übersetzung bestellen", ta: "மொழிபெயர்ப்பு அனுப்பு" },
    "trans.orderSub": { en: "Email us your documents and we confirm price and deadline within one working day.", de: "Senden Sie Ihre Dokumente, wir bestätigen den Preis per E-Mail.", ta: "உங்கள் ஆவணங்களை அனுப்பி, ஒரு வேலை நாளில் விலை உறுதி." },

    // ---------------- booking ----------------
    "booking.eyebrow": { en: "Book", de: "Buchen", ta: "பதிவு" },
    "booking.title": { en: "Book your appointment", de: "Termin buchen", ta: "நியமனம் பதிவு" },
    "booking.subtitle": { en: "Four short steps and our team confirms by email within one working day.", de: "Vier kurze Schritte, per E-Mail innerhalb eines Arbeitstags.", ta: "நான்கு படிகள் — ஒரு வேலை நாளில் மின்னஞ்சல் உறுதி." },
    "booking.step1": { en: "Language", de: "Sprache", ta: "மொழி" },
    "booking.step2": { en: "Situation", de: "Situation", ta: "சூழ்நிலை" },
    "booking.step3": { en: "Date & time", de: "Datum & Zeit", ta: "தேதி & நேரம்" },
    "booking.step4": { en: "Details", de: "Details", ta: "விவரங்கள்" },
    "booking.step1Hint": { en: "Which language does the appointment need?", de: "In welcher Sprache soll der Termin stattfinden?", ta: "எந்த மொழி தேவை?" },
    "booking.step2Hint": { en: "What is the meeting about?", de: "Worum geht es beim Termin?", ta: "நிகழ்வு எதைப் பற்றியது?" },
    "booking.step3Hint": { en: "Pick a day, a time slot and a duration.", de: "Wählen Sie Tag, Zeit und Dauer.", ta: "நாள், நேரம், காலத்தை தேர்வு." },
    "booking.step4Hint": { en: "Video or on-site, your details and how you'll pay.", de: "Video oder vor Ort, Ihre Angaben und die Zahlung.", ta: "வீடியோ/நேரில், உங்கள் விவரங்கள், கட்டணம்." },
    "booking.confirm": { en: "Confirm booking", de: "Buchung bestätigen", ta: "பதிவு உறுதி" },
    "booking.languageLabel": { en: "I need help in", de: "Ich brauche Hilfe in", ta: "எனக்கு உதவி தேவை" },
    "booking.serviceLabel": { en: "Situation / service", de: "Situation / Leistung", ta: "சேவை" },
    "booking.dateLabel": { en: "Preferred date", de: "Wunschdatum", ta: "விருப்ப தேதி" },
    "booking.timeLabel": { en: "Time", de: "Zeit", ta: "நேரம்" },
    "booking.durationLabel": { en: "Duration", de: "Dauer", ta: "காலம்" },
    "booking.modeLabel": { en: "Video or in person?", de: "Video oder vor Ort?", ta: "வீடியோ அல்லது நேரில்?" },
    "booking.contact": { en: "Your details", de: "Ihre Angaben", ta: "உங்கள் விவரங்கள்" },
    "booking.firstName": { en: "Full name", de: "Vollständiger Name", ta: "முழு பெயர்" },
    "booking.lastName": { en: "Last name", de: "Nachname", ta: "கடைசி பெயர்" },
    "booking.email": { en: "Email", de: "E-Mail", ta: "மின்னஞ்சல்" },
    "booking.phone": { en: "Phone (optional)", de: "Telefon (optional)", ta: "தொலைபேசி (விருப்பம்)" },
    "booking.note": { en: "Anything we should know?", de: "Gibt es etwas, das wir wissen sollten?", ta: "எங்களுக்குத் தெரிவிக்க முடியாதா?" },
    "booking.notePh": { en: "e.g. calm interpreter preferred, medical terms, first appointment…", de: "z.B. ruhige Dolmetscherin, medizinische Begriffe…", ta: "எ.கா. மென்மையானவர், மருத்துவச் சொற்கள்…" },
    "booking.payLabel": { en: "Payment method", de: "Zahlungsmethode", ta: "கட்டண முறை" },
    "booking.simulated": { en: "In this preview, payment is simulated — card details are never stored.", de: "In dieser Vorschau simuliert — Karten nie gespeichert.", ta: "இங்கு கட்டணம் சிமுலேட் — அட்டை விவரங்கள் சேமிக்கப்படாது." },
    "booking.chooseDateFirst": { en: "Please choose a date first.", de: "Bitte zuerst ein Datum wählen.", ta: "முதலில் தேதி தேர்வு." },
    "booking.leadNote": { en: "Please book at least X working days in advance.", de: "Bitte mindestens X Werktage im Voraus buchen.", ta: "X வேலை நாட்களுக்கு முன்பே பதிவு செய்யவும்." },
    "booking.pausedNote": { en: "We are currently not accepting new appointments — please check back soon.", de: "Wir nehmen aktuell keine neuen Termine an — bitte schauen Sie später wieder vorbei.", ta: "தற்போது புதிய நியமனங்கள் இல்லை — பின்னர் வரவும்." },
    "booking.noSlots": { en: "No free time slots on this day — please choose another date.", de: "Keine freien Zeiten an diesem Tag — bitte anderen Tag wählen.", ta: "இந்த நாளில் காலி நேரம் இல்லை — வேறு தேதி தேர்வு." },
    "booking.slotTaken": { en: "This time was just taken by someone else. Next free slot:", de: "Dieses Zeitfenster wurde soeben belegt. Nächster freier Termin:", ta: "நேரம் எடுக்கப்பட்டது. அடுத்த காலி நேரம்:" },
    "booking.total": { en: "Total", de: "Gesamt", ta: "மொத்தம்" },
    "booking.travel": { en: "Travel fee", de: "Anreise", ta: "பயணக் கட்டணம்" },
    "booking.interpreterLabel": { en: "Interpreter team", de: "Dolmetschteam", ta: "மொழிபெயர்ப்பாளர்" },
    "booking.any": { en: "Any available interpreter", de: "Jede verfügbare Dolmetscher:in", ta: "ஏதேனும் ஒருவர்" },
    "booking.summary": { en: "Summary", de: "Zusammenfassung", ta: "சுருக்கம்" },
    "summary.empty": { en: "Choose a service, language, date and mode to see the summary.", de: "Wählen Sie Leistung, Sprache, Datum und Art — dann sehen Sie die Übersicht.", ta: "சேவை, மொழி, தேதி தேர்வு — சுருக்கத்தை காண." },
    "interpreting.rate": { en: "Interpreting", de: "Dolmetschen", ta: "மொழிபெயர்ப்பு" },
    "processing": { en: "Processing…", de: "Verarbeitung…", ta: "செயலாக்கம்…" },

    // confirmation page
    "confirm.eyebrow": { en: "Request received", de: "Anfrage eingegangen", ta: "கோரிக்கை பெறப்பட்டது" },
    "confirm.title": { en: "Your appointment is booked", de: "Ihr Termin ist gebucht", ta: "உங்கள் நியமனம் பதிவு செய்யப்பட்டது" },
    "confirm.subtitle": { en: "A confirmation is on its way to your email. Keep your reference number.", de: "Eine Bestätigung ist unterwegs. Bewahren Sie die Referenznummer auf.", ta: "உறுதிப்படுத்தல் மின்னஞ்சலில் வரும். குறிப்பு எண்ணை வைத்திருங்கள்." },
    "confirm.notFound": { en: "Booking not found — please contact support with your reference.", de: "Buchung nicht gefunden — kontaktieren Sie uns mit Ihrer Referenz.", ta: "பதிவு கிடைக்கவில்லை — உங்கள் குறிப்புடன் தொடர்பு கொள்ளுங்கள்." },
    "confirm.ref": { en: "Reference", de: "Referenz", ta: "குறிப்பு" },
    "confirm.status": { en: "Status", de: "Status", ta: "நிலை" },
    "confirm.statusConfirmed": { en: "Confirmed", de: "Bestätigt", ta: "உறுதி செய்யப்பட்டது" },
    "confirm.statusPending": { en: "Pending confirmation", de: "Bestätigung ausstehend", ta: "உறுதி நிலுவையில்" },
    "confirm.videoNote": { en: "A secure video link is sent to your email before the appointment. Arrive 5 minutes early.", de: "Der Videolink folgt per E-Mail. Bitte 5 Minuten früher bereit sein.", ta: "வீடியோ இணைப்பு மின்னஞ்சலில் வரும். 5 நிமிடம் முன்பே தயாராக இருங்கள்." },
    "confirm.siteNote": { en: "Need help too? The Life Concierge reads letters, makes calls and books appointments for you.", de: "Auch Hilfe nötig? Der Concierge liest Briefe, telefoniert und bucht Termine.", ta: "உதவி வேண்டுமா? கடிதங்கள், அழைப்புகள், சந்திப்புகள்." },
    "confirm.bookAnother": { en: "Book another appointment", de: "Weiteren Termin buchen", ta: "மேலும் ஒரு நியமனம்" },

    // payment terms
    "pay.twintBody": { en: "Pay by TWINT in seconds with your reference.", de: "In Sekunden per TWINT mit Referenz zahlen.", ta: "குறிப்புடன் நொடிகளில் TWINT மூலம்" },
    "pay.bank": { en: "Bank transfer", de: "Banküberweisung", ta: "வங்கி மாற்றம்" },
    "pay.bankBody": { en: "Pay by bank transfer with your booking reference — no card needed.", de: "Per Banküberweisung mit Referenz — keine Karte nötig.", ta: "குறிப்புடன் வங்கி மாற்றம் — அட்டை தேவையில்லை." },
    "booking.payRef": { en: "Pay using your reference — we confirm the booking once payment arrives.", de: "Bezahlen Sie mit Ihrer Referenz — wir bestätigen, sobald die Zahlung eintrifft.", ta: "குறிப்பு எண்ணுடன் செலுத்துங்கள் — பணம் வந்ததும் உறுதி." },
    "booking.methodLabel": { en: "Payment method", de: "Zahlungsart", ta: "கட்டண முறை" },
    "pay.received": { en: "Payment received — your appointment is confirmed.", de: "Zahlung eingegangen — Ihr Termin ist bestätigt.", ta: "பணம் பெறப்பட்டது — உறுதி செய்யப்பட்டது." },
    "confirm.payTitle": { en: "How to pay — booking confirmed after payment", de: "So zahlen Sie — Termin nach Zahlung bestätigt", ta: "எவ்வாறு செலுத்துவது — பணம் செலுத்திய பின் உறுதி" },
    "confirm.payTo": { en: "Pay to", de: "Zahlen an", ta: "செலுத்த வேண்டியவர்" },
    "confirm.payIban": { en: "IBAN (bank transfer)", de: "IBAN (Banküberweisung)", ta: "IBAN (வங்கி மாற்றம்)" },
    "confirm.payBenef": { en: "Beneficiary", de: "Begünstigter", ta: "பயனாளி" },
    "confirm.payAmount": { en: "Amount", de: "Betrag", ta: "தொகை" },
    "confirm.payUseRef": { en: "Use this reference", de: "Referenz verwenden", ta: "இந்த குறிப்பை பயன்படுத்தவும்" },
    "confirm.payWaiting": { en: "Waiting for payment", de: "Warte auf Zahlung", ta: "கட்டணத்திற்காக காத்திருப்பு" },
    "confirm.statusPaid": { en: "Paid — booking confirmed", de: "Bezahlt — Termin bestätigt", ta: "செலுத்தப்பட்டது — உறுதி" },
    "confirm.statusRefunded": { en: "Refunded / cancelled", de: "Erstattet / storniert", ta: "பணம் திரும்பியது / ரத்து" },
    "confirm.statusCancelled": { en: "Cancelled", de: "Storniert", ta: "ரத்து செய்யப்பட்டது" },
    "confirm.statusToPay": { en: "Approved — payment pending", de: "Bestätigt — Zahlung ausstehend", ta: "ஒப்புதல் — கட்டணம் நிலுவை" },
    "confirm.statusRequested": { en: "Awaiting approval", de: "Freigabe ausstehend", ta: "ஒப்புதல் நிலுவையில்" },
    "confirm.requestedTitle": { en: "Your request has been received", de: "Ihre Anfrage ist eingegangen", ta: "உங்கள் கோரிக்கை பெறப்பட்டது" },
    "confirm.requestedNote": { en: "We check your request and confirm within one working day. Payment details appear here as soon as the appointment is approved.", de: "Wir prüfen Ihre Anfrage und bestätigen innerhalb eines Werktags. Zahlungsdetails erscheinen hier nach der Freigabe.", ta: "ஒரு வேலை நாளுக்குள் உறுதி செய்வோம். ஒப்புதல் அளித்ததும் கட்டண விவரங்கள் இங்கே தோன்றும்." },
    "confirm.payAfterApproval": { en: "The appointment is finally confirmed after payment arrives.", de: "Der Termin wird nach Zahlungseingang endgültig bestätigt.", ta: "கட்டணம் வந்ததும் நியமனம் உறுதி செய்யப்படும்." },
    "confirm.cancelReason": { en: "Reason", de: "Grund", ta: "காரணம்" },

    // booking address
    "field.address": { en: "Meeting address", de: "Treffadresse", ta: "சந்திப்பு முகவரி" },
    "field.addressPh": { en: "e.g. Limmatstrasse 12, 8005 Zürich", de: "z.B. Limmatstrasse 12, 8005 Zürich", ta: "எ.கா. Limmatstrasse 12, 8005 Zürich" },

    // booking validation
    "err.language": { en: "Please choose a language.", de: "Bitte Sprache wählen.", ta: "மொழியைத் தேர்வு செய்யவும்." },
    "err.service": { en: "Please choose a situation / service.", de: "Bitte Situation / Leistung wählen.", ta: "சேவையைத் தேர்ந்தெடுக்கவும்." },
    "err.date": { en: "Please choose a date.", de: "Bitte Datum wählen.", ta: "தேதியைத் தேர்ந்தெடுக்கவும்." },
    "err.time": { en: "Please choose an available time slot.", de: "Bitte verfügbares Zeitfenster wählen.", ta: "நேரத்தைத் தேர்ந்தெடுக்கவும்." },
    "err.mode": { en: "Please choose video or in person.", de: "Bitte Video oder vor Ort wählen.", ta: "வீடியோ/நேரில் தேர்ந்தெடுக்கவும்." },
    "err.name": { en: "Please enter your full name.", de: "Bitte vollständigen Namen eingeben.", ta: "முழு பெயரை உள்ளிடவும்." },
    "err.email": { en: "Please enter a valid email address.", de: "Bitte gültige E-Mail eingeben.", ta: "சரியான மின்னஞ்சலை உள்ளிடவும்." },
    "err.address": { en: "Please enter the meeting address.", de: "Bitte Treffadresse eingeben.", ta: "முகவரியை உள்ளிடவும்." },
    "err.sunday": { en: "Sundays are not available for bookings.", de: "Sonntags nicht verfügbar.", ta: "ஞாயிற்றுக்கிழமை கிடைக்காது." },
    "err.cardName": { en: "Please enter the name on the card.", de: "Bitte Kartenname eingeben.", ta: "அட்டை பெயரை உள்ளிடவும்." },
    "err.cardNumber": { en: "Please enter a valid card number.", de: "Bitte gültige Kartennummer.", ta: "சரியான அட்டை எண்." },
    "err.cardExp": { en: "Expiry must be in MM/YY format.", de: "Gültig im Format MM/JJ.", ta: "MM/YY வடிவமாக." },
    "err.cvc": { en: "Please enter the CVC.", de: "Bitte CVC eingeben.", ta: "CVC உள்ளிடவும்." },
    "err.general": { en: "Something went wrong. Please try again.", de: "Etwas ist schiefgelaufen. Bitte erneut versuchen.", ta: "ஏதோ தவறு — மீண்டும் முயற்சி." },

    // mode cards body
    "mode.videoBody": { en: "Secure link, works on any phone or computer.", de: "Sicherer Link, auf jedem Gerät.", ta: "பாதுகாப்பு இணைப்பு, எந்த சாதனத்திலும்." },
    "mode.videoFree": { en: "No extra fee", de: "Keine Extragebühr", ta: "கூடுதல் இல்லை" },
    "mode.siteBody": { en: "A professional interpreter comes to your appointment.", de: "Eine Dolmetscherin kommt zu Ihrem Termin.", ta: "ஒரு மொழிபெயர்ப்பாளர் உங்கள் இடத்திற்கு." },
    "mode.siteFee": { en: "travel fee", de: "Anreisegebühr", ta: "பயணக் கட்டணம்" },

    // ---------------- document filling ----------------
    "fill.eyebrow": { en: "Online document filling", de: "Formulare online ausfüllen", ta: "ஆன்லைன் படிவம் நிரப்புதல்" },
    "fill.title": { en: "Fill in any Swiss form online", de: "Jedes Schweizer Formular online ausfüllen", ta: "எந்த சுவிஸ் படிவத்தையும் ஆன்லைனில் நிரப்ப" },
    "fill.subtitle": { en: "Pick the form or document, tell us your language — we translate it, fill it correctly and email the finished file back to you.", de: "Formular wählen, Sprache angeben — wir übersetzen, füllen korrekt aus und senden Ihnen das fertige Dokument per E-Mail.", ta: "படிவத்தைத் தேர்ந்தெடு, மொழி சொல் — நாங்கள் மொழிபெயர்த்து, சரியாக நிரப்பி, முடிந்த ஆவணத்தை மின்னஞ்சலில் அனுப்புவோம்." },
    "fill.step1": { en: "Document", de: "Dokument", ta: "ஆவணம்" },
    "fill.step2": { en: "Language & mode", de: "Sprache & Modus", ta: "மொழி & முறை" },
    "fill.step3": { en: "Your details", de: "Ihre Angaben", ta: "உங்கள் விவரங்கள்" },
    "fill.step1Hint": { en: "Which document or official form do you need help with?", de: "Bei welchem Dokument oder offiziellen Formular brauchen Sie Hilfe?", ta: "எந்த ஆவணம் / அதிகாரப் படிவத்திற்கு உதவி தேவை?" },
    "fill.step2Hint": { en: "From which language to which? And what should we do with it?", de: "Von welcher in welche Sprache? Und was sollen wir damit tun?", ta: "எந்த மொழியில் இருந்து? எதைச் செய்ய வேண்டும்?" },
    "fill.step3Hint": { en: "Where should the finished document be sent?", de: "Wohin soll das fertige Dokument gesendet werden?", ta: "முடிந்த ஆவணம் எங்கே அனுப்பப்பட வேண்டும்?" },
    "fill.docTypeLabel": { en: "Document type", de: "Dokumenttyp", ta: "ஆவண வகை" },
    "fill.langFromLabel": { en: "From language", de: "Von Sprache", ta: "மொழியிலிருந்து" },
    "fill.langToLabel": { en: "To language", de: "In Sprache", ta: "மொழிக்கு" },
    "fill.sameLang": { en: "Source and target must be different.", de: "Ausgangs- und Zielsprache müssen verschieden sein.", ta: "மொழிகள் வெவ்வேறாக இருக்க வேண்டும்." },
    "fill.modeLabel": { en: "What we should do", de: "Was wir tun sollen", ta: "நாங்கள் செய்ய வேண்டியது" },
    "fill.modeTranslate": { en: "Translate only", de: "Nur übersetzen", ta: "மொழிபெயர்க்க மட்டும்" },
    "fill.modeTranslateBody": { en: "We translate your document and email the translation back.", de: "Wir übersetzen Ihr Dokument und senden es per E-Mail.", ta: "உங்கள் ஆவணத்தை மொழிபெயர்த்து மின்னஞ்சலில் அனுப்புவோம்." },
    "fill.modeFill": { en: "Fill the form for me", de: "Formular für mich ausfüllen", ta: "படிவத்தை நிரப்ப" },
    "fill.modeFillBody": { en: "We complete the official form correctly with your information.", de: "Wir füllen das offizielle Formular korrekt mit Ihren Angaben aus.", ta: "உங்கள் தகவல்களுடன் படிவத்தை சரியாக நிரப்புவோம்." },
    "fill.modeBoth": { en: "Translate & fill", de: "Übersetzen & ausfüllen", ta: "மொழிபெயர்த்து நிரப்பு" },
    "fill.modeBothBody": { en: "We translate the form and fill it in for you in one go.", de: "Wir übersetzen und füllen das Formular in einem Durchgang aus.", ta: "படிவத்தை மொழிபெயர்த்து ஒரே நேரத்தில் நிரப்புவோம்." },
    "fill.contact": { en: "Where should we send it?", de: "Wohin senden wir das Dokument?", ta: "எங்கே அனுப்ப வேண்டும்?" },
    "fill.note": { en: "Anything we should know?", de: "Gibt es etwas, das wir wissen sollten?", ta: "எங்களுக்குத் தெரிவிக்க வேண்டுமா?" },
    "fill.notePh": { en: "e.g. canton of residence, office, deadline, special instructions…", de: "z.B. Wohnkanton, Amt, Frist, besondere Hinweise…", ta: "எ.கா. கன்டோன், அலுவலகம், காலக்கெடு…" },
    "fill.confirm": { en: "Submit document request", de: "Dokumentanfrage senden", ta: "ஆவண கோரிக்கை அனுப்பு" },
    "fill.summaryTitle": { en: "Request summary", de: "Anfrageübersicht", ta: "கோரிக்கை சுருக்கம்" },
    "fill.summaryEmpty": { en: "Choose a document, languages and mode to see the summary.", de: "Dokument, Sprache und Modus wählen — dann sehen Sie die Übersicht.", ta: "ஆவணம், மொழி, முறை தேர்வு — சுருக்கத்தைக் காண." },
    "fill.mode": { en: "We will", de: "Wir werden", ta: "நாங்கள்" },
    "fill.emailNote": { en: "A confirmation email goes to the address you give us — the finished document follows in the same thread.", de: "Eine Bestätigungs-E-Mail geht an Ihre Adresse — das fertige Dokument folgt im selben Verlauf.", ta: "உறுதி மின்னஞ்சல் உங்கள் முகவரிக்கு — முடிந்த ஆவணம் அதே இணைப்பில்." },

    // uploads
    "upload.label": { en: "Attach documents (optional)", de: "Dokumente anhängen (optional)", ta: "ஆவணங்களை இணைக்கவும் (விருப்பம்)" },
    "upload.labelReq": { en: "Attach the document to translate", de: "Dokument zum Übersetzen anhängen", ta: "மொழிபெயர்க்க ஆவணத்தை இணைக்கவும்" },
    "upload.hint": { en: "PDF, Word, JPG, PNG, HEIC, TXT — max 25 MB each, up to 5 files.", de: "PDF, Word, JPG, PNG, HEIC, TXT — max. je 25 MB, bis 5 Dateien.", ta: "PDF, Word, JPG, PNG, HEIC, TXT — ஒவ்வொன்றும் 25 MB, அதிகபட்சம் 5 கோப்புகள்." },
    "upload.choose": { en: "Choose files", de: "Dateien wählen", ta: "கோப்புகளைத் தேர்ந்தெடுக்கவும்" },
    "upload.added": { en: "attached", de: "angehängt", ta: "இணைக்கப்பட்டது" },
    "upload.remove": { en: "Remove", de: "Entfernen", ta: "நீக்கு" },
    "upload.err": { en: "Upload failed. Check the file type and size.", de: "Upload fehlgeschlagen. Prüfen Sie Typ und Grösse.", ta: "பதிவேற்றம் தோல்வி. கோப்பு வகை/அளவைச் சரிபார்க்கவும்." },

    // tracking page
    "track.nav": { en: "Track your request", de: "Anfrage verfolgen", ta: "கோரிக்கையைக் கண்காணிக்கவும்" },
    "track.title": { en: "Track your request", de: "Anfrage verfolgen", ta: "உங்கள் கோரிக்கையைக் கண்காணிக்கவும்" },
    "track.subtitle": { en: "Enter your reference number to check the status and download your finished documents.", de: "Geben Sie Ihre Referenznummer ein, um den Status zu prüfen und fertige Dokumente herunterzuladen.", ta: "நிலையைப் பார்க்கவும் முடிந்த ஆவணங்களைப் பதிவிறக்கவும் உங்கள் குறிப்பு எண்ணை உள்ளிடவும்." },
    "track.inputPh": { en: "e.g. SSX-AB12CD or SSXD-AB12CD", de: "z.B. SSX-AB12CD oder SSXD-AB12CD", ta: "எ.கா. SSX-AB12CD அல்லது SSXD-AB12CD" },
    "track.lookup": { en: "Check status", de: "Status prüfen", ta: "நிலையைச் சரிபார்க்கவும்" },
    "track.refLabel": { en: "Reference number", de: "Referenznummer", ta: "குறிப்பு எண்" },
    "track.notFound": { en: "No request found with this reference.", de: "Keine Anfrage mit dieser Referenz gefunden.", ta: "இந்த குறிப்புடன் எந்த கோரிக்கையும் இல்லை." },
    "track.stNew": { en: "New", de: "Neu", ta: "புதியது" },
    "track.stReceived": { en: "Received", de: "Eingegangen", ta: "பெறப்பட்டது" },
    "track.stInProgress": { en: "In progress", de: "In Bearbeitung", ta: "நடைபெறுகிறது" },
    "track.stDone": { en: "Done", de: "Fertig", ta: "முடிந்தது" },
    "track.stCancelled": { en: "Cancelled", de: "Storniert", ta: "ரத்து செய்யப்பட்டது" },
    "track.stRequested": { en: "Request received — we will confirm shortly.", de: "Anfrage erhalten — wir bestätigen in Kürze.", ta: "கோரிக்கை பெறப்பட்டது — விரைவில் உறுதி." },
    "track.download": { en: "Download finished document", de: "Fertiges Dokument herunterladen", ta: "முடிந்த ஆவணத்தைப் பதிவிறக்கவும்" },
    "track.yourFiles": { en: "Your uploads", de: "Ihre Uploads", ta: "உங்கள் பதிவேற்றங்கள்" },
    "track.theirFiles": { en: "File", de: "Datei", ta: "கோப்பு" },
    "track.contactTitle": { en: "Questions? We are happy to help:", de: "Fragen? Wir helfen gerne:", ta: "கேள்விகள்? எங்களைத் தொடர்புகொள்ளுங்கள்:" },
    "track.emailUs": { en: "Email us", de: "E-Mail an uns", ta: "மின்னஞ்சல்" },
    "track.whatsapp": { en: "WhatsApp", de: "WhatsApp", ta: "வாட்ஸ்அப்" },
    "track.keepRef": { en: "Quote your reference number so we can find you quickly.", de: "Nennen Sie Ihre Referenznummer — so finden wir Sie schnell.", ta: "உங்கள் குறிப்பு எண்ணைச் சொல்லுங்கள் — விரைவாக உங்களைக் கண்டறிவோம்." },
    "track.bookingWhen": { en: "Date & time", de: "Datum & Zeit", ta: "தேதி & நேரம்" },
    "track.bookingMode": { en: "Mode", de: "Modus", ta: "முறை" },
    "track.bookingService": { en: "Service", de: "Leistung", ta: "சேவை" },

    // privacy
    "privacy.link": { en: "Privacy policy", de: "Datenschutzerklärung", ta: "தனியுரிமைக் கொள்கை" },
    "privacy.consent": { en: "I agree to the processing of my data for this request (GDPR).", de: "Ich stimme der Verarbeitung meiner Daten für diese Anfrage zu (DSGVO).", ta: "இந்த கோரிக்கைக்காக எனது தரவு செயலாக்கத்திற்கு ஒப்புக்கொள்கிறேன் (GDPR)." },
    "privacy.consentRequired": { en: "Please confirm the privacy consent.", de: "Bitte bestätigen Sie die Datenschutzerklärung.", ta: "தனியுரிமை ஒப்புதலை உறுதிப்படுத்தவும்." },
    "privacy.pageTitle": { en: "Privacy policy", de: "Datenschutzerklärung", ta: "தனியுரிமைக் கொள்கை" },
    "privacy.lastUpdated": { en: "Last updated", de: "Zuletzt aktualisiert", ta: "கடைசியாக புதுப்பிக்கப்பட்டது" },
    "privacy.s1Title": { en: "1. Who we are", de: "1. Wer wir sind", ta: "1. நாங்கள் யார்" },
    "privacy.s1Body": { en: "Ssaaxcy Solutions, Zurich, Switzerland operates this website and the Ssaaxcy app as the data controller for your personal data.", de: "Ssaaxcy Solutions, Zürich, Schweiz, betreibt diese Website und die Ssaaxcy-App als Verantwortlicher für Ihre personenbezogenen Daten.", ta: "Ssaaxcy Solutions, சூரிச், சுவிட்சர்லாந்து — உங்கள் தரவுகளுக்கு பொறுப்பாளர்." },
    "privacy.s2Title": { en: "2. What we collect", de: "2. Was wir erheben", ta: "2. என்ன சேகரிக்கிறோம்" },
    "privacy.s2Body": { en: "When you book an appointment or request a translation we collect your name, email address, phone (optional), the details of your request and your IP address (for abuse protection).", de: "Bei Buchungen und Übersetzungsanfragen erheben wir Name, E-Mail, Telefon (optional), Angaben zur Anfrage sowie Ihre IP-Adresse (Missbrauchsschutz).", ta: "நியமனம்/மொழிபெயர்ப்புக்கு உங்கள் பெயர், மின்னஞ்சல், தொலைபேசி (விருப்பம்), கோரிக்கை விவரங்கள், IP முகவரி." },
    "privacy.s3Title": { en: "3. Why we process data", de: "3. Zweck der Verarbeitung", ta: "3. ஏன் செயலாக்குகிறோம்" },
    "privacy.s3Body": { en: "We use your data only to provide the booked service: to prepare and hold appointments, to complete translation orders and to invoice you. Legal basis: contract (Art. 6(1)(b) GDPR).", de: "Wir verwenden Ihre Daten ausschliesslich zur Erbringung der gebuchten Leistung: Terminvorbereitung, Übersetzungsaufträge, Rechnungsstellung. Rechtsgrundlage: Vertrag (Art. 6 Abs. 1 lit. b DSGVO).", ta: "பதிவு செய்யப்பட்ட சேவைக்காக மட்டுமே: சந்திப்புகள், மொழிபெயர்ப்பு, விலைப்பட்டியல்." },
    "privacy.s4Title": { en: "4. Who we share with", de: "4. Weitergabe", ta: "4. பகிர்வு" },
    "privacy.s4Body": { en: "We never sell your data. Payment information is processed by our payment provider; interpreters only receive what is needed for your appointment. Switzerland is recognised as providing an adequate level of data protection by the EU.", de: "Wir verkaufen keine Daten. Zahlungen laufen über unseren Zahlungsdienstleister; Dolmetscher:innen erhalten nur, was für den Termin nötig ist. Die Schweiz gilt als angemessenes Schutzniveau.", ta: "தரவு விற்பனை இல்லை. கட்டண சேவையாளர்; மொழிபெயர்ப்பாளர்களுக்கு தேவையானது மட்டும்." },
    "privacy.s5Title": { en: "5. How long we keep data", de: "5. Speicherdauer", ta: "5. சேமிப்பு காலம்" },
    "privacy.s5Body": { en: "Booking and request data is deleted after 24 months. Financial records are kept as required by Swiss law.", de: "Buchungs- und Anfragedaten werden nach 24 Monaten gelöscht. Finanzunterlagen gemäss Schweizer Gesetz.", ta: "24 மாதங்களுக்குப் பிறகு நீக்கப்படும். நிதி பதிவுகள் சட்டப்படி." },
    "privacy.s6Title": { en: "6. Your rights", de: "6. Ihre Rechte", ta: "6. உங்கள் உரிமைகள்" },
    "privacy.s6Body": { en: "You may request access, correction or deletion of your data at any time. The easiest way: reply to your booking email or contact us with your reference number.", de: "Sie können jederzeit Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen — am einfachsten per Antwort auf Ihre Buchungs-E-Mail oder mit Ihrer Referenznummer.", ta: "அணுகல், திருத்தம், நீக்கம் — உங்கள் குறிப்பு எண்ணுடன் தொடர்பு கொள்ளவும்." },
    "privacy.s7Title": { en: "7. Security", de: "7. Sicherheit", ta: "7. பாதுகாப்பு" },
    "privacy.s7Body": { en: "All traffic is encrypted (HTTPS). Access to your data is protected by two-factor authentication and is only possible from Switzerland.", de: "Der gesamte Verkehr ist verschlüsselt (HTTPS). Der Zugriff auf Ihre Daten ist durch Zwei-Faktor-Authentifizierung geschützt.", ta: "அனைத்தும் HTTPS குறியாக்கம். இருமுறை அங்கீகாரம்." },
    "privacy.contactTitle": { en: "Contact", de: "Kontakt", ta: "தொடர்பு" },
    "privacy.contactBody": { en: "Questions about this policy? Write to us and we will respond within 14 days.", de: "Fragen zur Erklärung? Schreiben Sie uns — Antwort innerhalb von 14 Tagen.", ta: "கேள்விகள்? 14 நாட்களுக்குள் பதில்." },
    "fill.errDoc": { en: "Please choose a document type.", de: "Bitte Dokumenttyp wählen.", ta: "ஆவண வகையைத் தேர்வு." },
    "fill.errLang": { en: "Please choose both languages.", de: "Bitte beide Sprachen wählen.", ta: "இரண்டு மொழிகளையும் தேர்வு." },
    "fill.errMode": { en: "Please choose what we should do.", de: "Bitte wählen, was wir tun sollen.", ta: "எதைச் செய்ய வேண்டும் எனத் தேர்வு." },
    "fill.fields": { en: "Your information (helps us fill the form)", de: "Ihre Angaben (für das Formular)", ta: "உங்கள் தகவல்கள் (படிவத்திற்கு)" },
    "fill.fieldPh": { en: "Full name · date of birth · address · AHV number — whatever the form needs", de: "Name · Geburtsdatum · Adresse · AHV-Nummer — je nach Formular", ta: "பெயர் · பிறந்த தேதி · முகவரி · AHV எண் — படிவத்திற்கு ஏற்ப" },
    "fill.fieldLabel": { en: "Form details", de: "Formularangaben", ta: "படிவ விவரங்கள்" },

    // ---------------- concierge ----------------
    "concierge.eyebrow": { en: "Premium", de: "Premium", ta: "சிறப்பு" },
    "concierge.title": { en: "Swiss Life Assistant", de: "Swiss Life Assistent", ta: "சுவிஸ் வாழ்க்கை உதவியாளர்" },
    "concierge.subtitle": { en: "I tasks for you — letters, calls, appointments, permits, forms and admin handled from A to Z.", de: "Wir erledigen für Sie — Briefe, Anrufe, Termine, Bewilligungen, Übersetzungen und Verwaltung von A bis Z.", ta: "உங்களுக்காக நாங்கள் — கடிதங்கள், அழைப்புகள், நியமனங்கள், அனுமதிகள், மொழிபயர் மற்றும் நிர்வாகம்." },
    "concierge.loc": { en: "No appointment needed — we're with you on every step.", de: "Kein Termin nötig — wir sind bei jedem Schritt dabei.", ta: "நியமனம் தேவையில்லை — ஒவ்வொரு அடியிலும் உடன்." },
    "concierge.select": { en: "What can we do for you?", de: "Was können wir für Sie tun?", ta: "உங்களுக்காக என்ன செய்வோம்?" },
    "concierge.request": { en: "Request help", de: "Hilfe anfragen", ta: "உதவி கோர்" },
    "concierge.response": { en: "Our concierge team replies on the email you used.", de: "Unser Concierge-Team antwortet für Sie in E-Mail.", ta: "எங்கள் குழு உங்கள் மின்னஞ்சலில் பதில் அளிக்கும்." },
    // new concierge service types
    "con.type.visa": { en: "Visa & immigration", de: "Visa & Einwanderung", ta: "விசா & குடியேற்றம்" },
    "con.type.forms": { en: "Official forms", de: "Offizielle Formulare", ta: "அதிகாரப் படிவங்கள்" },
    "con.type.travel": { en: "Travel arrangements", de: "Reiseplanung", ta: "பயண தயாரிப்பு" },
    "con.type.business": { en: "Business services", de: "Geschäftsdienste", ta: "வணிக சேவைகள்" },
    "con.type.letters": { en: "Letters & documents", de: "Briefe & Dokumente", ta: "கடிதங்கள் & ஆவணங்கள்" },
    "con.type.calls": { en: "Phone calls for you", de: "Telefonate für Sie", ta: "அழைப்புகள்" },
    "con.type.appointments": { en: "Appointments & bookings", de: "Termine & Buchungen", ta: "நியமனங்கள்" },

    // ---------------- confirmation ----------------
    "confirm.total": { en: "Total estimate", de: "Preisschätzung", ta: "மொத்த மதிப்பீடு" },
    "confirm.backHome": { en: "Back to home", de: "Zur Startseite", ta: "முகப்பு" },

    // ---------------- footer ----------------
    "footer.tagline": { en: "Interpreters, translations and a concierge for your Swiss life.", de: "Dolmetschen, Übersetzungen und Concierge für Ihr Schweizer Leben.", ta: "உங்கள் சுவிஸ் வாழ்க்கைக்கு மொழிபெயர்ப்பு." },
    "footer.rights": { en: "All rights reserved.", de: "Alle Rechte vorbehalten.", ta: "அனைத்து உரிமையும்." },
    "footer.certTitle": { en: "Certified translators", de: "Zertifizierte Übersetzer", ta: "சான்றளிக்கப்பட்ட மொழிபெயர்ப்பாளர்கள்" },
    "footer.certSub": { en: "Approved for official & notarised documents", de: "Zugelassen für offizielle & notarielle Dokumente", ta: "அதிகாரப்பூர்வ & நோட்டரி ஆவணங்களுக்கு அங்கீகரிக்கப்பட்டவை" },
    "footer.quickLinks": { en: "Quick links", de: "Schnellzugriff", ta: "விரைவு இணைப்புகள்" },
    "footer.addr": { en: "Zürich, Switzerland", de: "Zürich, Schweiz", ta: "சூரிக், சுவிட்சர்லாந்து" },
    "brand.tag": { en: "Certified Translators", de: "Zertifizierte Übersetzer", ta: "சான்றளிக்கப்பட்ட மொழிபெயர்ப்பாளர்கள்" },

    // ---------------- booking / misc pressures ----------------
    "price.per30": { en: "per 30 minutes", de: "pro 30 Minuten", ta: "30 நிமிட" },

    // ---------------- service names & descriptions ----------------
    "svc.doctor.name": { en: "Doctor appointment", de: "Arzttermin", ta: "மருத்துவ சந்திப்பு" },
    "svc.doctor.desc": { en: "Consultations, symptoms, referrals and prescriptions explained clearly.", de: "Konsultationen, Symptome, Überweisungen und Rezepte klar erklärt.", ta: "ஆலோசனைகள், அறிகுறிகள், பரிந்துரைகள் மற்றும் மருந்துகள் தெளிவாக." },
    "svc.hospital.name": { en: "Hospital visit", de: "Spitalbesuch", ta: "மருத்துவமனை வருகை" },
    "svc.hospital.desc": { en: "Emergency room, ward rounds, procedures and discharge briefing.", de: "Notfall, Visiten, Eingriffe und Entlassungsgespräch.", ta: "அவசர அறை, வார்டு சுற்றுகள், சிகிச்சைகள்." },
    "svc.police.name": { en: "Police appointment", de: "Polizeitermin", ta: "காவல்துறை நியமனம்" },
    "svc.police.desc": { en: "Reports, statements, identity and legal matters.", de: "Meldungen, Aussagen, Identität und rechtliche Angelegenheiten.", ta: "அறிக்கைகள், அறிக்கைகள், அடையாளம்." },
    "svc.immigration.name": { en: "Immigration office", de: "Migrationsamt", ta: "குடியேற்ற அலுவலகம்" },
    "svc.immigration.desc": { en: "Permits, residence, asylum and citizenship procedures.", de: "Bewilligungen, Aufenthalt, Asyl und Einbürgerung.", ta: "அனுமதிகள், குடியிருப்பு, குடியுரிமை." },
    "svc.gemeinde.name": { en: "Gemeinde appointment", de: "Gemeindetermin", ta: "நகராட்சி நியமனம்" },
    "svc.gemeinde.desc": { en: "Registration, civil matters, family office and administrative steps.", de: "Anmeldung, Zivilstand, Familienbüro und Verwaltungsschritte.", ta: "பதிவு, சிவில் விவகாரங்கள், குடும்ப அலுவலகம்." },
    "svc.school.name": { en: "Kindergarten & school meeting", de: "Kindergarten & Schulgsprach", ta: "பள்ளி சந்திப்பு" },
    "svc.school.desc": { en: "Parent-teacher talks, schooling and childcare discussions.", de: "Elterngespräche, Schulung und Betreuung.", ta: "பெற்றோர்-ஆசிரியர் உரையாடல்கள்." },
    "svc.bank.name": { en: "Bank meeting", de: "Banktermin", ta: "வங்கி சந்திப்பு" },
    "svc.bank.desc": { en: "Accounts, mortgages, remittance and advisory sessions.", de: "Konten, Hypotheken, Zahlungen und Beratung.", ta: "கணக்குகள், அடமானங்கள், ஆலோசனை." },
    "svc.insurance.name": { en: "Insurance meeting", de: "Versicherungstermin", ta: "காப்பீட்டு சந்திப்பு" },
    "svc.insurance.desc": { en: "Health, accident, liability and claims discussions.", de: "Kranken-, Unfall-, Haftpflicht- und Leistungsgespräche.", ta: "சுகாதாரம், விபத்து, பொறுப்பு." },
    "svc.interview.name": { en: "Job interview", de: "Vorstellungsgespräch", ta: "வேலை நேர்காணல்" },
    "svc.interview.desc": { en: "Applications, interviews and apprenticeship meetings.", de: "Bewerbungen, Interviews und Lehre.", ta: "விண்ணப்பங்கள், நேர்காணல்கள்." },
    "svc.government.name": { en: "Government office", de: "Amtlicher Termin", ta: "அரசு அலுவலகம்" },
    "svc.government.desc": { en: "Tax, social services, AHV and cantonal authorities.", de: "Steuern, Soziales, AHV und Kanton.", ta: "வரி, சமூக சேவைகள், AHV." },
    "svc.custom.name": { en: "Another appointment", de: "Anderer Termin", ta: "மற்றொரு நியமனம்" },
    "svc.custom.desc": { en: "Any other important conversation — just tell us about it.", de: "Jedes andere wichtige Gespräch — erzählen Sie uns davon.", ta: "மற்ற முக்கிய உரையாடல்கள்." },

    // ---------------- durations ----------------
    "dur.short": { en: "Short meeting", de: "Kurzes Treffen", ta: "குறுகிய சந்திப்பு" },
    "dur.standard": { en: "Standard", de: "Standard", ta: "தரநிலை" },
    "dur.clinical": { en: "Clinical / official", de: "Klinisch / offiziell", ta: "மருத்துவ/அலுவலக" },
    "dur.long": { en: "Long appointment", de: "Langer Termin", ta: "நீண்ட நியமனம்" },

    // ---------------- language picker labels ----------------
    "lang.DE": { en: "German", de: "Deutsch", ta: "ஜெர்மன்" },
    "lang.EN": { en: "English", de: "Englisch", ta: "ஆங்கிலம்" },
    "lang.TA": { en: "Tamil", de: "Tamil", ta: "தமிழ்" },

        "ph.email": { en: "you@example.ch", de: "sie@beispiel.ch", ta: "you@example.ch" },
    "ph.phone": { en: "+41 79 000 00 00", de: "+41 79 000 00 00", ta: "+41 79 000 00 00" },

    // ---------------- concierge service type descriptions ----------------
    "con.type.letters.desc": { en: "We explain what the letter means and what you must do.", de: "Wir erklären, was der Brief bedeutet und was zu tun ist.", ta: "கடிதத்தின் அர்த்தத்தை விளக்குகிறோம்." },
    "con.type.calls.desc": { en: "We make the phone calls for you and keep you informed.", de: "Wir telefonieren für Sie und halten Sie auf dem Laufenden.", ta: "நாங்கள் உங்களுக்காக அழைக்கிறோம்." },
    "con.type.appointments.desc": { en: "We book the right appointment with the right office.", de: "Wir buchen den richtigen Termin beim richtigen Amt.", ta: "சரியான நியமனத்தை பதிவு செய்கிறோம்." },
    "con.type.visa.desc": { en: "Permits, residence, family reunification and applications.", de: "Bewilligungen, Aufenthalt, Familienzusammenführung.", ta: "அனுமதிகள், குடியிருப்பு, விண்ணப்பங்கள்." },
    "con.type.forms.desc": { en: "Residence, registration, government, insurance, bank and employment forms.", de: "Formulare für Aufenthalt, Anmeldung, Ämter, Versicherungen, Banken und Arbeit.", ta: "படிவங்கள் — குடியிருப்பு, பதிவு, அரசு, காப்பீடு, வங்கி, வேலை." },
    "con.type.travel.desc": { en: "Flights, hotels, travel insurance and itineraries.", de: "Flüge, Hotels, Reiseversicherung und Routen.", ta: "விமானங்கள், ஹோட்டல்கள், பயண காப்பீடு." },
    "con.type.business.desc": { en: "Company documents, registration and administrative paperwork.", de: "Firmendokumente, Registrierung und Verwaltung.", ta: "நிறுவன ஆவணங்கள், பதிவு, நிர்வாகம்." },
    "con.type.translation.desc": { en: "Certified and plain document translation in DE · EN · TA.", de: "Beglaubigte und einfache Übersetzung auf DE · EN · TA.", ta: "சான்றளிக்கப்பட்ட மொழிபெயர்ப்பு." },

    // concierge request form
    "cf.type": { en: "Which service do you need?", de: "Welche Leistung brauchen Sie?", ta: "எந்த சேவை தேவை?" },
    "cf.title": { en: "Short title", de: "Kurzer Titel", ta: "சிறு தலைப்பு" },
    "cf.titlePh": { en: "e.g. Letter from the insurance company", de: "z.B. Brief der Krankenkasse", ta: "எ.கா. காப்பீட்டு கடிதம்" },
    "cf.message": { en: "Describe your request", de: "Beschreiben Sie Ihre Anfrage", ta: "உங்கள் கோரிக்கையை விவரி" },
    "cf.messagePh": { en: "What happened? What do you need? What should happen next?", de: "Was ist passiert? Was brauchen Sie? Was soll als Nächstes passieren?", ta: "என்ன நடந்தது? என்ன வேண்டும்?" },
    "cf.fullName": { en: "Full name", de: "Vollständiger Name", ta: "முழு பெயர்" },
    "cf.email": { en: "Email", de: "E-Mail", ta: "மின்னஞ்சல்" },
    "cf.phone": { en: "Phone (optional)", de: "Telefon (optional)", ta: "தொலைபேசி (விருப்பம்)" },
    "cf.send": { en: "Send request", de: "Anfrage senden", ta: "கோரிக்கை அனுப்பு" },
    "cf.sending": { en: "Sending…", de: "Senden…", ta: "அனுப்புகிறது…" },
    "cf.noPay": { en: "No payment now — we reply first with a quote and timing.", de: "Keine Zahlung jetzt — wir antworten zuerst mit Preis und Zeitrahmen.", ta: "இப்போது கட்டணம் இல்லை — முதலில் மேற்கோள்." },
    "cf.sentTitle": { en: "Request received", de: "Anfrage eingegangen", ta: "கோரிக்கை பெறப்பட்டது" },
    "cf.ref": { en: "Reference", de: "Referenz", ta: "குறிப்பு" },
    "cf.sentBody": { en: "We have your request and will be in touch at", de: "Wir haben Ihre Anfrage und melden uns bei", ta: "உங்கள் கோரிக்கை பெற்றோம் — தொடர்பு" },
    "err.detail": { en: "Please describe your request.", de: "Bitte beschreiben Sie Ihre Anfrage.", ta: "உங்கள் கோரிக்கையை விவரிக்கவும்." },
    "common.ok": { en: "Got it", de: "Alles klar", ta: "சரி" },

    // membership
    "member.eyebrow": { en: "Monthly membership", de: "Monatsmitgliedschaft", ta: "மாத உறுப்பினர்" },
    "member.title": { en: "Ssaaxcy One — the always-there concierge", de: "Ssaaxcy One — Ihr Concierge, immer da", ta: "Ssaaxcy One — எப்போதும் உதவி" },
    "member.body": { en: "Priority replies, a dedicated case manager, 3 assisted calls or letter explanations per month and 10% off every interpreter booking.", de: "Priorisierte Antworten, fester Ansprechpartner, 3 Anrufe oder Briefe pro Monat und 10% auf jede Buchung.", ta: "முன்னுரிமை பதில்கள், 3 அழைப்புகள், 10% தள்ளுபடி." },
    "member.per": { en: "Cancel anytime · No setup fee", de: "Jederzeit kündbar · Keine Einrichtung", ta: "எப்போது வேண்டுமானாலும் · கட்டணம் இல்லை" },
    "member.cta": { en: "Become a member", de: "Mitglied werden", ta: "உறுப்பினராக" },
    "member.priority": { en: "Members get priority response in under 30 minutes during business hours.", de: "Mitglieder erhalten Antworten in unter 30 Minuten während Geschäftszeiten.", ta: "உறுப்பினர்களுக்கு 30 நிமிடங்களில் பதில்." },
    "member.mostLoved": { en: "Most loved", de: "Beliebt", ta: "மிகவும் பிடித்த" },
    "field.languagePair": { en: "Language", de: "Sprache", ta: "மொழி" },

    // ---------------- document types (translation page) ----------------
    "trans.docs": { en: "Documents", de: "Dokumente", ta: "ஆவணங்கள்" },
    "trans.docsTitle": { en: "What we translate", de: "Was wir übersetzen", ta: "நாங்கள் மொழிபெயர்ப்பது" },
    "trans.docsSub": { en: "Everything official, in German, English or Tamil — correctly translated, exactly where it has to be accepted.", de: "Alles Offizielle auf Deutsch, Englisch oder Tamil — richtig übersetzt und anerkannt.", ta: "ஜெர்மன், ஆங்கிலம், தமிழில் — அங்கீகரிக்கப்படும் விதமாக." },
    "doc.residence": { en: "Residence permits & registration", de: "Aufenthaltsbewilligungen & Anmeldung", ta: "குடியிருப்பு அனுமதிகள்" },
    "doc.residenceDesc": { en: "Permit renewals, registration, Anmeldung and family documents.", de: "Verlängerungen, Anmeldungen und Familiendokumente.", ta: "அனுமதி புதுப்பிப்பு, பதிவு." },
    "doc.visa": { en: "Visa applications", de: "Visaanträge", ta: "விசா விண்ணப்பங்கள்" },
    "doc.visaDesc": { en: "Schengen and national visa documents, invitations and letters.", de: "Schengen- und Nationalvisa, Einladungen und Briefe.", ta: "Schengen விசா ஆவணங்கள்." },
    "doc.gov": { en: "Government applications", de: "Amtliche Gesuche", ta: "அரசு விண்ணப்பங்கள்" },
    "doc.govDesc": { en: "Tax, AHV, social services and cantonal applications.", de: "Steuer-, AHV-, Sozial- und Kantonsgesuche.", ta: "வரி, AHV விண்ணப்பங்கள்." },
    "doc.insurance": { en: "Insurance policies & claims", de: "Versicherungen & Leistungen", ta: "காப்பீட்டு ஆவணங்கள்" },
    "doc.insuranceDesc": { en: "Krankenkasse, accident and liability policies and claims.", de: "Kranken-, Unfall- und Haftpflichtpolicen.", ta: "சுகாதார காப்பீடு ஆவணங்கள்." },
    "doc.bank": { en: "Bank documents", de: "Bankdokumente", ta: "வங்கி ஆவணங்கள்" },
    "doc.bankDesc": { en: "Contracts, statements, mortgage and remittance documents.", de: "Verträge, Kontoauszüge, Hypotheken.", ta: "ஒப்பந்தங்கள், அறிக்கைகள்." },
    "doc.work": { en: "Employment documents", de: "Arbeitsdokumente", ta: "வேலை ஆவணங்கள்" },
    "doc.workDesc": { en: "Contracts, certificates, references and resignation letters.", de: "Verträge, Zeugnisse, Referenzen und Kündigungen.", ta: "ஒப்பந்தங்கள், சான்றிதழ்கள்." },
    "doc.edu": { en: "School & education records", de: "Schul- & Bildungsunterlagen", ta: "பள்ளி ஆவணங்கள்" },
    "doc.eduDesc": { en: "Diplomas, transcripts and certificates from abroad.", de: "Diplome, Zeugnisse und Abschlüsse aus dem Ausland.", ta: "டிப்ளோமா, சான்றிதழ்கள்." },
    "doc.other": { en: "Anything else", de: "Etwas anderes", ta: "வேறு ஏதும்" },
    "doc.otherDesc": { en: "Not sure? Send it anyway — we confirm what is possible.", de: "Nicht sicher? Senden Sie es — wir prüfen alles.", ta: "உறுதியில்லையா? அனுப்புங்கள்." },
    "trans.fees": { en: "Fees", de: "Preise", ta: "கட்டணங்கள்" },
    "trans.feesTitle": { en: "Translation fees", de: "Übersetzungspreise", ta: "மொழிபெயர்ப்பு கட்டணங்கள்" },
    "fee.perWord": { en: "per word", de: "pro Wort", ta: "ஒரு வார்த்தைக்கு" },
    "fee.urShort": { en: "· 24 h", de: "· 24 h", ta: "· 24 மணி" },
    "fee.lastMin": { en: "Last-minute", de: "Kurzfristig", ta: "கடைசி நிமிடம்" },
    "fee.lastMinNote": { en: "48 h turnaround — flat CHF 25 surcharge", de: "48 h Lieferung — Aufschlag CHF 25", ta: "48 மணி விநியோகம் — CHF 25 கூடுதல்" },
    "fee.lastMinShort": { en: "· 48 h", de: "· 48 h", ta: "· 48 மணி" },
    "fee.perDoc": { en: "per document", de: "pro Dokument", ta: "ஒரு ஆவணத்திற்கு" },
    "fee.minNote": { en: "Flat rate per document, from CHF 125 (certified CHF 120). Exact quote within one working day.", de: "Pauschal pro Dokument, ab CHF 125 (beglaubigt CHF 120). Angebot innerhalb eines Arbeitstags.", ta: "ஒவ்வொரு ஆவணத்திற்கும் பிளாட் CHF 125 (சான்று CHF 120)." },
    "trans.fromLang": { en: "From language", de: "Von Sprache", ta: "மொழியிலிருந்து" },
    "trans.toLang": { en: "To language", de: "In Sprache", ta: "மொழிக்கு" },
    "trans.docType": { en: "Document type", de: "Dokumentart", ta: "ஆவண வகை" },
    "trans.detailPh": { en: "Describe the document, number of pages and deadline…", de: "Beschreiben Sie Dokument, Seitenzahl und Termin…", ta: "ஆவணம், பக்கங்கள், காலக்கெடு…" },
    "trans.orderCta": { en: "Request a quote", de: "Angebot anfragen", ta: "மேற்கோள் கோர" },

    // ---------------- fee table (translation page) ----------------
    "fee.plain": { en: "Plain translation", de: "Einfache Übersetzung", ta: "எளிய மொழிபெயர்ப்பு" },
    "fee.plainNote": { en: "Non-official documents, everyday texts", de: "Nicht-offizielle Dokumente, Alltagstexte", ta: "அன்றாட ஆவணங்கள்" },
    "fee.cert": { en: "Certified translation", de: "Beglaubigte Übersetzung", ta: "சான்றளிக்கப்பட்ட" },
    "fee.certNote": { en: "For authorities — with interpreter's certification", de: "Für Behörden — mit Beglaubigung", ta: "அதிகாரங்களுக்கு" },
    "fee.ur": { en: "Urgent (24h)", de: "Eilauftrag (24h)", ta: "அவசரம் (24 மணி)" },
    "fee.urNote": { en: "Certified documents within 24 hours", de: "Beglaubigte Dokumente innerhalb 24h", ta: "24 மணியில்" },
    "fee.perPage": { en: "per page", de: "pro Seite", ta: "ஒரு பக்கத்திற்கு" }
  };

  SSX.langCodes = CODES;

  function savedOrAuto() {
    var saved;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved && CODES.indexOf(saved) > -1) return saved;
    var nav = ((navigator.language || "de") + "").toLowerCase().split("-")[0];
    var code = nav === "ta" ? "ta" : nav === "de" ? "de" : "en";
    try { localStorage.setItem(LANG_KEY, code); } catch (e) {}
    return code;
  }
  SSX.lang = savedOrAuto();

  function setTextOf(el, val) {
    if (!el) return;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
      el.setAttribute("placeholder", val);
    } else if (el.tagName === "TITLE") {
      document.title = val;
    } else {
      el.textContent = val;
    }
  }

  function translateAll() {
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      setTextOf(el, t(el.getAttribute("data-i18n")));
    }
    var placeholders = document.querySelectorAll("[data-ph]");
    for (var j = 0; j < placeholders.length; j++) {
      placeholders[j].setAttribute("placeholder", t(placeholders[j].getAttribute("data-ph")));
    }
    var titles = document.querySelectorAll("[data-title]");
    for (var k = 0; k < titles.length; k++) {
      titles[k].setAttribute("title", t(titles[k].getAttribute("data-title")));
    }
    var aria = document.querySelectorAll("[data-aria]");
    for (var m = 0; m < aria.length; m++) {
      aria[m].setAttribute("aria-label", t(aria[m].getAttribute("data-aria")));
    }
    var raanced = document.querySelectorAll("[data-html]");
    for (var n = 0; n < raanced.length; n++) {
      raanced[n].innerHTML = t(raanced[n].getAttribute("data-html"));
    }
    document.documentElement.setAttribute("lang", SSX.lang);
  }

  function t(key) {
    var table = DICT[key] || { en: key };
    var v = table[SSX.lang];
    if (v === undefined) v = table.en;
    return v === undefined ? key : v;
  }

  SSX.t = function (key) { return t(key); };
  SSX.translateAll = translateAll;
  SSX.setLang = function (code, persist) {
    if (CODES.indexOf(code) === -1) code = "en";
    SSX.lang = code;
    if (persist !== false) {
      try { localStorage.setItem(LANG_KEY, code); } catch (e) {}
    }
    translateAll();
    window.dispatchEvent(new CustomEvent("ssx:lang", { detail: { lang: code } }));
  };

  // UI switcher builder: returns ready-to-insert markup
  SSX.langSwitcher = function () {
    var opts = { en: "EN", de: "DE", ta: "தமிழ்" };
    var out = '<div class="lang-switch">';
    for (var i = 0; i < CODES.length; i++) {
      var c = CODES[i];
      out += '<button type="button" class="lang-btn' + (c === SSX.lang ? " is-active" : "") + '" data-lang-switch="' + c + '" data-aria="lang.' + c + '" aria-pressed="' + (c === SSX.lang ? "true" : "false") + '">' + opts[c] + "</button>";
    }
    return out + "</div>";
  };

  // Wire the generated / static switcher buttons (listen once)
  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest("[data-lang-switch]") : null;
    if (!btn) return;
    var code = btn.getAttribute("data-lang-switch");
    SSX.setLang(code);
    var all = document.querySelectorAll("[data-lang-switch]");
    for (var i = 0; i < all.length; i++) {
      var b = all[i];
      var on = b.getAttribute("data-lang-switch") === SSX.lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", translateAll);
  } else {
    translateAll();
  }
})();