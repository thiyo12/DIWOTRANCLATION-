/* SEO landing pages for every booking option.
 * Each topic = a searchable job. Every topic is written in DE (root),
 * FR (/fr/), EN (/en/), IT (/it/).
 * kind:
 *   "book"  -> CTA to booking.html?service=<id>  (live interpreting)
 *   "doc"   -> CTA to fillform.html?type=<id>     (document translation)
 *   "mode"  -> CTA to booking.html + mode prenote (video / on-site)
 *   "hub"   -> high-intent keyword page (best / official translator)
 */

const LANGS = ["de", "fr", "en", "it"];

const SSAXCY = {
  url: "https://ssaaxcy.ch",
  phone: "+41 76 253 12 92",
  email: "support@ssaaxcy.ch",
  org: "Ssaaxcy Solutions"
};

// ---------------------------------------------------------------------------
// Topic definitions
// ---------------------------------------------------------------------------
const TOPICS = [
  // ---------------------------------------------------------------- Medical
  {
    id: "doctor",
    kind: "book",
    service: "doctor",
    de: {
      slug: "dolmetscher-arzt",
      title: "Dolmetscher beim Arzt in Zürich – Dolmetschen Deutsch–Tamil",
      meta: "Professioneller Dolmetscher für Arzttermine in Zürich & der Schweiz: Deutsch, Englisch, Tamil. Klare Übersetzung von Symptomen, Diagnosen & Rezepten. Jetzt buchen.",
      h1: "Dolmetscher beim Arzt in Zürich und der ganzen Schweiz",
      intro: "Verstehen Sie Ihren Arzt — und lassen Sie sich verstehen. Wir begleiten Sie zu Arztterminen und übersetzen Gespräche, Symptome, Diagnosen und Rezepte klar und zuverlässig in Deutsch, Englisch oder Tamil.",
      points: [
        ["Medizinische Begleitung", "Wir begleiten Sie zu Konsultationen, Überweisungen und Rezeptbesprechungen — ohne Missverständnisse."],
        ["Vertraulich & diskret", "Alle medizinischen Gespräche behandeln wir absolut vertraulich."],
        ["Deutsch · Englisch · Tamil", "Live-Dolmetschen vor Ort oder per Video, je nach Termin."]
      ],
      faq: [
        ["Was kostet ein Dolmetscher beim Arzt?", "Eine halbe Stunde Dolmetschen beim Arzt kostet ab CHF 45 in Zürich. Die genaue Offerte erhalten Sie vor dem Termin per E-Mail."],
        ["Kann der Dolmetscher auch per Video am Termin teilnehmen?", "Ja. Video-Dolmetschen ist inklusive und funktioniert vom Handy oder Computer — kein Anfahrtsweg nötig."],
        ["Sprachen Sie für Arzttermine?", "Wir dolmetschen insbesondere Deutsch, Englisch und Tamil für Arzttermine in Zürich und schweizweit."]
      ]
    },
    fr: {
      slug: "traducteur-chez-medecin",
      title: "Traducteur chez le médecin à Zurich – Interprète médical DE–FR–EN–Tamil",
      meta: "Interprète professionnel pour vos rendez-vous médicaux à Zurich et en Suisse : allemand, français, anglais, tamoul. Compréhension claire des symptômes, diagnostics et ordonnances.",
      h1: "Traducteur chez le médecin à Zurich et dans toute la Suisse",
      intro: "Comprenez votre médecin — et faites-vous comprendre. Nous vous accompagnons à vos rendez-vous médicaux et traduisons clairement consultations, symptômes, diagnostics et ordonnances en allemand, français, anglais ou tamoul.",
      points: [
        ["Accompagnement médical", "Nous vous suivons aux consultations, références et ordonnances — sans malentendus."],
        ["Confidentiel et discret", "Toutes les conversations médicales sont traitées avec une confidentialité absolue."],
        ["Allemand · Français · Anglais · Tamoul", "Interprétation sur place ou en visio, selon votre rendez-vous."]
      ],
      faq: [
        ["Combien coûte un interprète chez le médecin ?", "Une demi-heure d'interprétation chez le médecin coûte dès CHF 45 à Zurich. L'offre exacte est envoyée par e-mail avant le rendez-vous."],
        ["Peut-on participer à distance par visio ?", "Oui. L'interprétation en visio est incluse et fonctionne depuis un téléphone ou un ordinateur — aucun déplacement."],
        ["Quelles langues proposez-vous ?", "Nous interprétons notamment l'allemand, le français, l'anglais et le tamoul pour les rendez-vous médicaux à Zurich et en Suisse."]
      ]
    },
    en: {
      slug: "translator-doctor-appointment",
      title: "Medical Interpreter for Doctor Appointments in Zurich | Ssaaxcy",
      meta: "Professional interpreter for doctor appointments in Zurich & Switzerland: German, English, Tamil. Clear translation of symptoms, diagnoses and prescriptions. Book today.",
      h1: "Medical Interpreter for Doctor Appointments in Zurich and Switzerland",
      intro: "Understand your doctor — and be understood. We accompany you to medical appointments and interpret symptoms, diagnoses and prescriptions clearly and reliably in German, English or Tamil.",
      points: [
        ["Medical accompaniment", "We join you for consultations, referrals and prescription discussions — with no misunderstandings."],
        ["Confidential & discreet", "All medical conversations are handled with complete confidentiality."],
        ["German · English · Tamil", "Live interpreting in person or by video, depending on the appointment."]
      ],
      faq: [
        ["What does an interpreter at the doctor cost?", "30 minutes of interpreting at the doctor costs from CHF 45 in Zurich. You receive the exact quote by email before the appointment."],
        ["Can the interpreter join by video?", "Yes. Video interpreting is included and works from your phone or computer — no travel needed."],
        ["Which languages do you offer?", "We interpret mainly German, English and Tamil for medical appointments in Zurich and across Switzerland."]
      ]
    },
    it: {
      slug: "traduttore-visita-medica",
      title: "Interprete medico per visite mediche a Zurigo | Traduttore DE–EN–Tamil",
      meta: "Interprete professionale per visite mediche a Zurigo e in Svizzera: tedesco, inglese, tamil. Traduzione chiara di sintomi, diagnosi e ricette. Prenota ora.",
      h1: "Interprete per visite mediche a Zurigo e in tutta la Svizzera",
      intro: "Capisca il suo medico — e si faccia capire. L'accompagniamo alle visite mediche e traduciamo chiaramente sintomi, diagnosi e ricette in tedesco, inglese o tamil.",
      points: [
        ["Accompagnamento medico", "La accompagniamo a consulti, rinvii e discussioni sulle ricette — senza malintesi."],
        ["Riservato e discreto", "Tutte le conversazioni mediche sono trattate con la massima riservatezza."],
        ["Tedesco · Inglese · Tamil", "Interpretariato dal vivo o in video, a seconda della visita."]
      ],
      faq: [
        ["Quanto costa un interprete dal medico?", "Mezz'ora di interpretariato dal medico costa da CHF 45 a Zurigo. L'offerta esatta arriva via e-mail prima della visita."],
        ["Si può partecipare in video?", "Sì. L'interpretariato in video è incluso e funziona da telefono o computer — nessun spostamento."],
        ["Quali lingue offrite?", "Interpretiamo soprattutto tedesco, inglese e tamil per le visite mediche a Zurigo e in Svizzera."]
      ]
    }
  },
  {
    id: "hospital",
    kind: "book",
    service: "hospital",
    de: {
      slug: "dolmetscher-spital",
      title: "Dolmetscher im Spital – Spitalbesuch & Notaufnahme (DE–EN–Tamil)",
      meta: "Dolmetscher im Spital: Notfall, Visiten, Eingriffe und Entlassungsgespräche. Deutsch, Englisch, Tamil — in Zürich & der Schweiz. Jetzt Dolmetscher buchen.",
      h1: "Dolmetscher im Spital und in der Notaufnahme",
      intro: "Im Spital zählt jedes Wort. Wir dolmetschen bei Visiten, Eingriffen, Entlassungsgesprächen und im Notfall — klar, ruhig und erfahren in Deutsch, Englisch oder Tamil.",
      points: [
        ["Notfall & Visiten", "Von der Notaufnahme bis zur täglichen Visite: wir sind an Ihrer Seite."],
        ["Eingriffe & Entlassung", "Vor- und Nachgespräche zu Eingriffen sowie das Entlassungsgespräch werden verständlich übersetzt."],
        ["Prima und Urgent Care", "Bereitschaft auch kurzfristig möglich — fragen Sie uns."]
      ],
      faq: [
        ["Können Sie auch in der Notaufnahme dolmetschen?", "Ja. Für Notfälle planen wir zügig einen Dolmetscher (vor Ort oder per Video) ein."],
        ["Was kostet ein Spitaldolmetscher?", "Eine halbe Stunde kostet ab CHF 55; die Offerte kommt vorher per E-Mail."],
        ["Übersetzen Sie auch Entlassungsbriefe?", "Ja, wir geben den Inhalt mündlich verständlich wieder und können die wichtigsten Punkte auf Englisch oder Tamil schriftlich fassen."]
      ]
    },
    fr: {
      slug: "traducteur-hopital",
      title: "Interprète à l'hôpital – Urgences, visites et sortie (FR–EN–Tamil)",
      meta: "Interprète à l'hôpital : urgences, visites, interventions et entretiens de sortie. Allemand, français, anglais, tamoul — à Zurich et en Suisse. Réservez.",
      h1: "Interprète à l'hôpital et aux urgences",
      intro: "À l'hôpital, chaque mot compte. Nous interprétons lors des visites, interventions, entretiens de sortie et en urgence — clairement et calmement, en allemand, français, anglais ou tamoul.",
      points: [
        ["Urgences et visites", "Des urgences aux visites quotidiennes : nous sommes à vos côtés."],
        ["Interventions et sortie", "Les entretiens avant/après intervention et le bilan de sortie sont traduits clairement."],
        ["Disponible rapidement", "Une disponibilité à court terme est possible — demandez-nous."]
      ],
      faq: [
        ["Interprétez-vous aux urgences ?", "Oui. Pour les urgences, nous planifions rapidement un interprète (sur place ou en visio)."],
        ["Combien coûte un interprète à l'hôpital ?", "Une demi-heure coûte dès CHF 55 ; l'offre arrive par e-mail avant."],
        ["Traduisez-vous les lettres de sortie ?", "Oui, nous restituons clairement le contenu et résumons les points essentiels par écrit en anglais ou en tamoul."]
      ]
    },
    en: {
      slug: "interpreter-hospital",
      title: "Hospital Interpreter in Zurich – Emergency Room & Ward Visits",
      meta: "Professional hospital interpreter: emergency room, ward rounds, procedures and discharge briefings. German, English, Tamil — Zurich & Switzerland. Book now.",
      h1: "Hospital Interpreter in Zurich and the Emergency Room",
      intro: "In hospital, every word counts. We interpret for ward rounds, procedures, discharge briefings and emergencies — calmly and clearly, in German, English or Tamil.",
      points: [
        ["Emergency & ward rounds", "From the emergency room to daily ward visits: we're at your side."],
        ["Procedures & discharge", "Pre- and post-procedure talks and the discharge briefing are translated clearly."],
        ["Short-notice cover", "Rapid availability is possible — just ask."]
      ],
      faq: [
        ["Can you interpret in the emergency room?", "Yes. For emergencies we quickly arrange an interpreter (in person or by video)."],
        ["What does a hospital interpreter cost?", "Half an hour starts at CHF 55; the quote arrives by email beforehand."],
        ["Do you translate discharge letters?", "Yes, we convey the content clearly and can summarise key points in writing in English or Tamil."]
      ]
    },
    it: {
      slug: "traduttore-ospedale",
      title: "Interprete in ospedale a Zurigo – Pronto soccorso e visite",
      meta: "Interprete professionale in ospedale: pronto soccorso, giri di corsia, interventi e dimissioni. Tedesco, inglese, tamil — Zurigo & Svizzera. Prenota ora.",
      h1: "Interprete in ospedale e al pronto soccorso",
      intro: "In ospedale ogni parola conta. Interpretiamo durante i giri di corsia, gli interventi, le dimissioni e nelle emergenze — in modo chiaro e calmo, in tedesco, inglese o tamil.",
      points: [
        ["Pronto soccorso e corsia", "Dal pronto soccorso alle visite quotidiane: siamo al suo fianco."],
        ["Interventi e dimissioni", "I colloqui prima/dopo gli interventi e la dimissione sono tradotti chiaramente."],
        ["Disponibilità rapida", "Reperibilità anche a breve termine — ci contatti."]
      ],
      faq: [
        ["Interpretate anche al pronto soccorso?", "Sì. Per le emergenze organizziamo rapidamente un interprete (dal vivo o in video)."],
        ["Quanto costa un interprete in ospedale?", "Mezz'ora costa da CHF 55; l'offerta arriva via e-mail prima."],
        ["Traducete anche le lettere di dimissione?", "Sì, restituiamo chiaramente il contenuto e riassumiamo per iscritto i punti chiave in inglese o tamil."]
      ]
    }
  },

  // ---------------------------------------------------------------- Official
  {
    id: "police",
    kind: "book",
    service: "police",
    de: {
      slug: "dolmetscher-polizei",
      title: "Dolmetscher bei der Polizei – Aussagen & Meldungen (DE–EN–Tamil)",
      meta: "Dolmetscher für Polizeitermine: Meldungen, Aussagen, Identität und rechtliche Angelegenheiten. Deutsch, Englisch, Tamil — in Zürich & der Schweiz.",
      h1: "Dolmetscher bei der Polizei in Zürich und der Schweiz",
      intro: "Bei der Polizei muss alles korrekt verstanden werden. Wir dolmetschen bei Meldungen, Aussagen, Identitätsfeststellungen und rechtlichen Fragen — neutral, präzise und vertraulich.",
      points: [
        ["Aussagen & Meldungen", "Wir übersetzen Ihre Aussage exakt, ohne Interpretation oder Auslassung."],
        ["Rechtliche Sicherheit", "Sie wissen immer genau, was gesagt und gefragt wird."],
        ["Neutral & diskret", "Wir sind unparteiisch und unterliegen voller Vertraulichkeit."]
      ],
      faq: [
        ["Was kostet ein Polizeidolmetscher?", "Eine halbe Stunde ab CHF 51; die Offerte kommt vorher per E-Mail."],
        ["Kann der Dolmetscher per Video eingesetzt werden?", "Ja, Video-Dolmetschen ist möglich und inklusive."],
        ["Übersetzen Sie bei offiziellen Strafanzeigen?", "Die Polizei entscheidet über den Einsatz; wir dolmetschen mündlich neutral für beide Seiten."]
      ]
    },
    fr: {
      slug: "traducteur-police",
      title: "Interprète à la police – Déclarations et signalements (FR–EN–Tamil)",
      meta: "Interprète pour les rendez-vous à la police : signalements, déclarations, identité et affaires juridiques. Allemand, français, anglais, tamoul — Zurich & Suisse.",
      h1: "Interprète à la police à Zurich et en Suisse",
      intro: "Auprès de la police, tout doit être compris correctement. Nous interprétons lors des signalements, déclarations, vérifications d'identité et questions juridiques — neutre, précis et confidentiel.",
      points: [
        ["Déclarations et signalements", "Nous traduisons votre déclaration exactement, sans interprétation ni omission."],
        ["Sécurité juridique", "Vous savez toujours exactement ce qui est dit et demandé."],
        ["Neutre et discret", "Nous sommes impartiaux et tenus à la plus stricte confidentialité."]
      ],
      faq: [
        ["Combien coûte un interprète à la police ?", "Une demi-heure dès CHF 51 ; l'offre arrive par e-mail avant."],
        ["L'interprétation en visio est-elle possible ?", "Oui, l'interprétation en visio est possible et incluse."],
        ["Interprétez-vous lors de dénonciations officielles ?", "La police décide de l'engagement ; nous interprétons oralement et de manière neutre pour les deux parties."]
      ]
    },
    en: {
      slug: "interpreter-police",
      title: "Police Interpreter in Zurich – Statements & Reports",
      meta: "Interpreter for police appointments: reports, statements, identity and legal matters. German, English, Tamil — Zurich & Switzerland. Book today.",
      h1: "Police Interpreter in Zurich and Switzerland",
      intro: "At the police, everything must be understood correctly. We interpret for reports, statements, identity checks and legal matters — neutral, precise and confidential.",
      points: [
        ["Statements & reports", "We translate your statement exactly, without interpretation or omission."],
        ["Legal certainty", "You always know exactly what is said and asked."],
        ["Neutral & discreet", "We are impartial and bound by full confidentiality."]
      ],
      faq: [
        ["What does a police interpreter cost?", "Half an hour from CHF 51; the quote arrives by email beforehand."],
        ["Can the interpreter join by video?", "Yes, video interpreting is available and included."],
        ["Do you interpret at official reports?", "The police decides on the assignment; we interpret neutrally for both sides."]
      ]
    },
    it: {
      slug: "traduttore-polizia",
      title: "Interprete in polizia a Zurigo – Dichiarazioni e denunce",
      meta: "Interprete per appuntamenti in polizia: denunce, dichiarazioni, identità e questioni legali. Tedesco, inglese, tamil — Zurigo & Svizzera.",
      h1: "Interprete in polizia a Zurigo e in Svizzera",
      intro: "In polizia tutto deve essere compreso correttamente. Interpretiamo durante denunce, dichiarazioni, accertamenti d'identità e questioni legali — in modo neutrale, preciso e riservato.",
      points: [
        ["Dichiarazioni e denunce", "Traduciamo la sua dichiarazione in modo esatto, senza interpretazioni né omissioni."],
        ["Sicurezza giuridica", "Sa sempre esattamente cosa viene detto e chiesto."],
        ["Neutro e riservato", "Siamo imparziali e vincolati alla massima riservatezza."]
      ],
      faq: [
        ["Quanto costa un interprete in polizia?", "Mezz'ora da CHF 51; l'offerta arriva via e-mail prima."],
        ["È possibile l'interpretariato in video?", "Sì, è possibile e incluso."],
        ["Interpretate anche nelle denunce ufficiali?", "Spetta alla polizia decidere; interpretiamo oralmente in modo neutrale per entrambe le parti."]
      ]
    }
  },
  {
    id: "immigration",
    kind: "book",
    service: "immigration",
    de: {
      slug: "dolmetscher-migrationsamt",
      title: "Dolmetscher beim Migrationsamt – Aufenthalt, Asyl, B- / C-Bewilligung",
      meta: "Dolmetscher für das Migrationsamt: Bewilligungen, Aufenthalt, Asyl und Einbürgerung. Deutsch, Englisch, Tamil — Zürich & die Schweiz. Jetzt buchen.",
      h1: "Dolmetscher beim Migrationsamt in Zürich und der Schweiz",
      intro: "Die Migrationsgespräche entscheiden viel. Wir dolmetschen bei Aufenthaltsbewilligungen, Asylverfahren, Einbürgerungen und Familienzusammenführungen — verständlich und präzise.",
      points: [
        ["Bewilligungen & Aufenthalt", "B- und C-Bewilligungen, Visumsverlängerungen und Arbeitsbewilligungen sicher übersetzt."],
        ["Asyl & Einbürgerung", "Wir begleiten Sie auch durch anspruchsvolle Anhörungen und Verfahren."],
        ["Amtlich gesichert", "Getragen von zertifizierten Dolmetschern für offizielle Gespräche."]
      ],
      faq: [
        ["Kann ich ohne Sprachkenntnisse zum Migrationsamt?", "Ja — wir dolmetschen für Sie, damit Ihre Anliegen vollständig übermittelt werden."],
        ["Was kostet das Dolmetschen beim Migrationsamt?", "Eine halbe Stunde ab CHF 40; Offerte vorher per E-Mail."],
        ["Kennen Sie die Begriffe der Bewilligungen?", "Ja, wir sind vertraut mit B-/C-/L-Bewilligungen, Fristen und typischen Migrationsfragen."]
      ]
    },
    fr: {
      slug: "traducteur-service-migrations",
      title: "Interprète au service des migrations – Permis de séjour, asile (FR–EN–Tamil)",
      meta: "Interprète pour le service des migrations : permis, séjour, asile et naturalisation. Allemand, français, anglais, tamoul — Zurich & Suisse.",
      h1: "Interprète au service des migrations à Zurich et en Suisse",
      intro: "Les entretiens au service des migrations comptent beaucoup. Nous interprétons lors des permis de séjour, procédures d'asile, naturalisations et regroupements familiaux — avec clarté et précision.",
      points: [
        ["Permis et séjour", "Permis B et C, prolongations de visa et permis de travail traduits en toute sécurité."],
        ["Asile et naturalisation", "Nous vous accompagnons aussi dans les auditions exigeantes."],
        ["Confiance institutionnelle", "Interprètes certifiés pour les entretiens officiels."]
      ],
      faq: [
        ["Puis-je aller au service des migrations sans la langue ?", "Oui — nous interprétons pour vous afin que vos demandes soient transmises entièrement."],
        ["Combien coûte l'interprétation au service des migrations ?", "Une demi-heure dès CHF 40 ; offre par e-mail avant."],
        ["Connaissez-vous la terminologie des permis ?", "Oui, nous connaissons les permis B/C/L, les délais et les questions migratoires typiques."]
      ]
    },
    en: {
      slug: "interpreter-immigration",
      title: "Immigration Interpreter – Residence Permits, Asylum, B/C Permits",
      meta: "Interpreter for the immigration office: permits, residence, asylum and citizenship. German, English, Tamil — Zurich & Switzerland. Book an interpreter.",
      h1: "Immigration Interpreter in Zurich and Switzerland",
      intro: "Immigration interviews matter. We interpret for residence permits, asylum procedures, naturalisation and family reunification — clearly and precisely.",
      points: [
        ["Permits & residence", "B and C permits, visa extensions and work permits translated reliably."],
        ["Asylum & naturalisation", "We also accompany you through demanding hearings."],
        ["Institutionally trusted", "Supported by certified interpreters for official meetings."]
      ],
      faq: [
        ["Can I attend the immigration office without the language?", "Yes — we interpret for you so your requests are fully conveyed."],
        ["What does immigration interpreting cost?", "Half an hour from CHF 40; quote by email beforehand."],
        ["Do you know the permit terminology?", "Yes, we are familiar with B/C/L permits, deadlines and typical immigration questions."]
      ]
    },
    it: {
      slug: "traduttore-uffizio-migrazione",
      title: "Interprete per l'ufficio migrazione – Permessi di soggiorno, asilo",
      meta: "Interprete per l'ufficio migrazione: permessi, soggiorno, asilo e cittadinanza. Tedesco, inglese, tamil — Zurigo & Svizzera.",
      h1: "Interprete presso l'ufficio migrazione a Zurigo e in Svizzera",
      intro: "I colloqui in migrazione contano molto. Interpretiamo durante permessi di soggiorno, procedure d'asilo, naturalizzazioni e ricongiungimenti familiari — in modo chiaro e preciso.",
      points: [
        ["Permessi e soggiorno", "Permessi B e C, rinnovi di visto e permessi di lavoro tradotti in modo sicuro."],
        ["Asilo e cittadinanza", "La accompagniamo anche nelle audizioni più delicate."],
        ["Fiducia istituzionale", "Interprete certificato per i colloqui ufficiali."]
      ],
      faq: [
        ["Posso andare all'ufficio migrazione senza conoscere la lingua?", "Sì — interpretiamo per lei affinché le sue richieste siano trasmesse completamente."],
        ["Quanto costa l'interpretariato all'ufficio migrazione?", "Mezz'ora da CHF 40; offerta via e-mail prima."],
        ["Conoscete la terminologia dei permessi?", "Sì, conosciamo i permessi B/C/L, le scadenze e le tipiche questioni migratorie."]
      ]
    }
  },
  {
    id: "gemeinde",
    kind: "book",
    service: "gemeinde",
    de: {
      slug: "dolmetscher-gemeinde",
      title: "Dolmetscher in der Gemeinde – Anmeldung, Zivilstand & Verwaltung",
      meta: "Dolmetscher beim Gemeindetermin: Anmeldung, Zivilstand, Familienbüro und Verwaltungsschritte. Deutsch, Englisch, Tamil — in Zürich & der Schweiz.",
      h1: "Dolmetscher für Gemeindeanlässe in Zürich und der Schweiz",
      intro: "Anmelden, ummelden, Zivilstand, Familienbüro — die Gemeinde verlangt viele Punkte. Wir dolmetschen für Sie verständlich und sicher, damit kein Schritt fehlt.",
      points: [
        ["Anmeldungen & Ummeldungen", "Wir begleiten Sie bei An-, Um- und Abmeldungen."],
        ["Zivilstand & Familie", "Heirat, Geburt, Namens- und Familienfragen — klar übersetzt."],
        ["Verwaltungsschritte", "Formulare und Abläufe werden für Sie verständlich erklärt."]
      ],
      faq: [
        ["Was kostet ein Dolmetscher für den Gemeindetermin?", "Eine halbe Stunde ab CHF 40; Offerte vorher per E-Mail."],
        ["Helfen Sie nur mit der Sprache?", "Wir dolmetschen und erklären Abläufe — Sie bleiben der Entscheider."],
        ["Auch kurzfristig?", "Kurzfristige Termine sind oft möglich; fragen Sie einfach an."]
      ]
    },
    fr: {
      slug: "traducteur-mairie",
      title: "Interprète à la commune – Inscription, état civil & administration",
      meta: "Interprète pour les rendez-vous communaux : inscription, état civil, bureau de famille et démarches administratives. Allemand, français, anglais, tamoul.",
      h1: "Interprète pour les rendez-vous communaux à Zurich et en Suisse",
      intro: "S'inscrire, changer d'adresse, état civil, bureau de la famille — la commune exige beaucoup. Nous interprétons de manière claire et sûre pour vous.",
      points: [
        ["Inscriptions et changements", "Nous vous accompagnons lors des inscriptions et changements d'adresse."],
        ["État civil et famille", "Mariage, naissance, nom et questions familiales — traduits avec clarté."],
        ["Démarches administratives", "Les formulaires et procédures vous sont expliqués simplement."]
      ],
      faq: [
        ["Combien coûte un interprète pour la commune ?", "Une demi-heure dès CHF 40 ; offre avant par e-mail."],
        ["Aidez-vous uniquement avec la langue ?", "Nous interprétons et expliquons les démarches — vous gardez la décision."],
        ["À court terme possible ?", "Souvent oui ; demandez simplement."]
      ]
    },
    en: {
      slug: "interpreter-gemeinde",
      title: "Interpreter for Gemeinde (Municipality) Appointments in Zurich",
      meta: "Interpreter for municipality appointments: registration, civil matters, family office and admin steps. German, English, Tamil — Zurich & Switzerland.",
      h1: "Interpreter for Municipality (Gemeinde) Appointments in Zurich",
      intro: "Register, move, civil status, family office — the Gemeinde requires a lot. We interpret clearly and reliably so no step is missed.",
      points: [
        ["Registration & moves", "We accompany you through registrations and address changes."],
        ["Civil & family matters", "Marriage, birth, names and family questions — clearly translated."],
        ["Admin steps", "Forms and processes are explained clearly to you."]
      ],
      faq: [
        ["What does Gemeinde interpreting cost?", "Half an hour from CHF 40; quote by email beforehand."],
        ["Do you only help with language?", "We interpret and explain processes — you stay the decision-maker."],
        ["Can it be short-notice?", "Often yes; just ask."]
      ]
    },
    it: {
      slug: "traduttore-comune",
      title: "Interprete per il comune a Zurigo – Registrazione e stato civile",
      meta: "Interprete per appuntamenti comunali: registrazione, stato civile, ufficio famiglia e pratiche amministrative. Tedesco, inglese, tamil.",
      h1: "Interprete per gli appuntamenti comunali a Zurigo e in Svizzera",
      intro: "Registrarsi, cambiare indirizzo, stato civile, ufficio famiglia — il comune richiede molto. Interpretiamo in modo chiaro e sicuro per lei.",
      points: [
        ["Registrazioni e cambi", "La accompagniamo durante le registrazioni e i cambi di indirizzo."],
        ["Stato civile e famiglia", "Matrimonio, nascita, nomi e questioni familiari — tradotti chiaramente."],
        ["Pratiche amministrative", "Moduli e procedure spiegati in modo semplice."]
      ],
      faq: [
        ["Quanto costa un interprete per il comune?", "Mezz'ora da CHF 40; offerta via e-mail prima."],
        ["Aiutate solo con la lingua?", "Interpretiamo e spieghiamo le pratiche — lei resta il decisore."],
        ["È possibile a breve termine?", "Spesso sì; basta chiedere."]
      ]
    }
  },
  {
    id: "school",
    kind: "book",
    service: "school",
    de: {
      slug: "dolmetscher-elterngespraech",
      title: "Dolmetscher für Elterngespräche & Kindergarten – Schule (DE–EN–Tamil)",
      meta: "Dolmetscher für Kindergarten und Schule: Elterngespräche, Schulung und Betreuung. Deutsch, Englisch, Tamil — in Zürich & der Schweiz. Jetzt buchen.",
      h1: "Dolmetscher für Elterngespräche, Kindergarten und Schule",
      intro: "Ihr Kind verdient, dass Sie verstehen, was in der Schule passiert. Wir dolmetschen bei Elterngesprächen, Standortgesprächen und schulischen Fragen — verlässlich und kindgerecht.",
      points: [
        ["Elterngespräche & Standortgespräche", "Sie gehen gut vorbereitet und verstehen alles."],
        ["Kindergarten & Betreuung", "Übergänge und Betreuungsfragen klar besprochen."],
        ["Lehrpersonen & Schulleitung", "Auch anspruchsvolle Gespräche mit der Schule werden sicher übersetzt."]
      ],
      faq: [
        ["Was kostet ein Dolmetscher für das Elterngespräch?", "Eine halbe Stunde ab CHF 40; Offerte vorher per E-Mail."],
        ["Kann das Gespräch per Video stattfinden?", "Ja, Video-Dolmetschen ist inklusive."],
        ["Kennt der Dolmetscher Schulsysteme?", "Ja, wir sind mit dem Schweizer Schulsystem und Fachbegriffen vertraut."]
      ]
    },
    fr: {
      slug: "traducteur-reunion-parents",
      title: "Interprète pour entretiens parents-école et maternelle (FR–EN–Tamil)",
      meta: "Interprète pour école et maternelle : entretiens parents, scolarité et garde. Allemand, français, anglais, tamoul — Zurich & Suisse.",
      h1: "Interprète pour les entretiens parents, la maternelle et l'école",
      intro: "Votre enfant mérite que vous compreniez ce qui se passe à l'école. Nous interprétons lors des entretiens parents, des bilans et des questions scolaires — fiable et adapté aux enfants.",
      points: [
        ["Entretiens parents & bilans", "Vous êtes bien préparé et comprenez tout."],
        ["Maternelle & garde", "Transitions et questions de garde discutées clairement."],
        ["Enseignants & direction", "Même les entretiens exigeants sont traduits en toute sécurité."]
      ],
      faq: [
        ["Combien coûte un interprète pour l'entretien parents ?", "Une demi-heure dès CHF 40 ; offre par e-mail avant."],
        ["L'entretien peut-il avoir lieu en visio ?", "Oui, l'interprétation en visio est incluse."],
        ["Connaissez-vous le système scolaire ?", "Oui, nous connaissons le système scolaire suisse et son vocabulaire."]
      ]
    },
    en: {
      slug: "interpreter-parent-teacher",
      title: "Parent-Teacher Meeting Interpreter – School & Kindergarten in Zurich",
      meta: "Interpreter for kindergarten and school: parent-teacher meetings, schooling and childcare. German, English, Tamil — Zurich & Switzerland.",
      h1: "Interpreter for Parent-Teacher Meetings, School and Kindergarten",
      intro: "Your child deserves that you understand what happens at school. We interpret at parent-teacher meetings, progress talks and school questions — reliably and family-friendly.",
      points: [
        ["Parent-teacher talks", "You attend well-prepared and understand everything."],
        ["Kindergarten & childcare", "Transitions and care questions discussed clearly."],
        ["Teachers & leadership", "Even demanding school talks are interpreted safely."]
      ],
      faq: [
        ["What does a parent-teacher interpreter cost?", "Half an hour from CHF 40; quote by email beforehand."],
        ["Can the meeting happen by video?", "Yes, video interpreting is included."],
        ["Do you know the school system?", "Yes, we are familiar with the Swiss school system and its terms."]
      ]
    },
    it: {
      slug: "traduttore-colloquio-genitori",
      title: "Interprete per colloqui genitori-insegnanti a Zurigo – Scuola",
      meta: "Interprete per scuola e asilo: colloqui genitori, istruzione e cura. Tedesco, inglese, tamil — Zurigo & Svizzera.",
      h1: "Interprete per i colloqui genitori, la scuola e l'asilo",
      intro: "Suo figlio merita che lei capisca cosa succede a scuola. Interpretiamo durante i colloqui genitori, le valutazioni e le questioni scolastiche — in modo affidabile e adatto ai bambini.",
      points: [
        ["Colloqui genitori e valutazioni", "Lei è ben preparato e comprende tutto."],
        ["Asilo e custodia", "Transizioni e questioni di custodia discusse chiaramente."],
        ["Insegnanti e direzione", "Anche i colloqui più impegnativi sono tradotti in sicurezza."]
      ],
      faq: [
        ["Quanto costa un interprete per il colloquio genitori?", "Mezz'ora da CHF 40; offerta via e-mail prima."],
        ["Si può fare in video?", "Sì, l'interpretariato in video è incluso."],
        ["Conoscete il sistema scolastico?", "Sì, conosciamo il sistema scolastico svizzero e i suoi termini."]
      ]
    }
  },

  // ---------------------------------------------------------------- Finance
  {
    id: "bank",
    kind: "book",
    service: "bank",
    de: {
      slug: "dolmetscher-bank",
      title: "Dolmetscher für den Banktermin – Konto, Hypothek & Beratung",
      meta: "Dolmetscher beim Banktermin: Konten, Hypotheken, Zahlungen und Beratung. Deutsch, Englisch, Tamil — in Zürich & der Schweiz. Jetzt buchen.",
      h1: "Dolmetscher für Banktermine in Zürich und der Schweiz",
      intro: "Bankgespräche brauchen Klarheit. Wir dolmetschen bei Kontoeröffnungen, Hypotheken, Überweisungen und Beratungsgesprächen — präzise, damit keine finanzielle Entscheidung auf Missverständnissen beruht.",
      points: [
        ["Konto & Hypothek", "Vom Kontoeröffnungsgespräch bis zum Hypothekenvertrag."],
        ["Zahlungen & Überweisungen", "Remittances und Zahlungsfragen eindeutig geklärt."],
        ["Finanzielle Sicherheit", "Sie verstehen Konditionen, Gebühren und Verträge vollständig."]
      ],
      faq: [
        ["Was kostet ein Bankdolmetscher?", "Eine halbe Stunde ab CHF 35; Offerte vorher per E-Mail."],
        ["Kann der Dolmetscher per Video dabei sein?", "Ja, Video-Teilnahme ist inklusive."],
        ["Übersetzt der Dolmetscher auch Verträge?", "Mündlich bei Bedarf; schriftliche Vertragsübersetzung bieten wir ebenfalls an."]
      ]
    },
    fr: {
      slug: "traducteur-banque",
      title: "Interprète pour rendez-vous bancaire – Compte, hypothèque, conseil",
      meta: "Interprète en banque : comptes, hypothèques, paiements et conseils. Allemand, français, anglais, tamoul — Zurich & Suisse.",
      h1: "Interprète pour les rendez-vous bancaires à Zurich et en Suisse",
      intro: "Les discussions bancaires exigent de la clarté. Nous interprétons lors de l'ouverture de comptes, d'hypothèques, de virements et de conseils — avec précision.",
      points: [
        ["Compte et hypothèque", "De l'ouverture de compte au contrat hypothécaire."],
        ["Paiements et virements", "Transferts et questions de paiement clarifiés sans ambiguïté."],
        ["Sécurité financière", "Vous comprenez conditions, frais et contrats entièrement."]
      ],
      faq: [
        ["Combien coûte un interprète en banque ?", "Une demi-heure dès CHF 35 ; offre par e-mail avant."],
        ["L'interprète peut-il être en visio ?", "Oui, la participation en visio est incluse."],
        ["Traduit-il aussi les contrats ?", "Oralement si besoin ; la traduction écrite de contrats est aussi proposée."]
      ]
    },
    en: {
      slug: "interpreter-bank-meeting",
      title: "Bank Meeting Interpreter in Zurich – Accounts, Mortgages, Advice",
      meta: "Interpreter for bank meetings: accounts, mortgages, remittance and advisory sessions. German, English, Tamil — Zurich & Switzerland.",
      h1: "Interpreter for Bank Meetings in Zurich and Switzerland",
      intro: "Bank talks need clarity. We interpret at account openings, mortgages, transfers and advisory sessions — precisely, so no financial decision rests on a misunderstanding.",
      points: [
        ["Accounts & mortgages", "From the account-opening talk to the mortgage contract."],
        ["Payments & remittance", "Transfers and payment questions resolved unambiguously."],
        ["Financial safety", "You fully understand terms, fees and contracts."]
      ],
      faq: [
        ["What does a bank interpreter cost?", "Half an hour from CHF 35; quote by email beforehand."],
        ["Can the interpreter join by video?", "Yes, video participation is included."],
        ["Does the interpreter translate contracts too?", "Orally when needed; written contract translation is also offered."]
      ]
    },
    it: {
      slug: "traduttore-incontro-banca",
      title: "Interprete per appuntamenti in banca – Conti, mutui, consulenza",
      meta: "Interprete in banca: conti, mutui, trasferimenti e consulenza. Tedesco, inglese, tamil — Zurigo & Svizzera.",
      h1: "Interprete per gli appuntamenti bancari a Zurigo e in Svizzera",
      intro: "I colloqui in banca richiedono chiarezza. Interpretiamo durante l'apertura di conti, i mutui, i trasferimenti e le consulenze — con precisione.",
      points: [
        ["Conti e mutui", "Dall'apertura del conto al contratto di mutuo."],
        ["Pagamenti e trasferimenti", "Bonifici e questioni di pagamento chiariti senza ambiguità."],
        ["Sicurezza finanziaria", "Comprende pienamente condizioni, spese e contratti."]
      ],
      faq: [
        ["Quanto costa un interprete in banca?", "Mezz'ora da CHF 35; offerta via e-mail prima."],
        ["L'interprete può partecipare in video?", "Sì, la partecipazione in video è inclusa."],
        ["Traduce anche i contratti?", "Oralmente se necessario; offriamo anche la traduzione scritta dei contratti."]
      ]
    }
  },
  {
    id: "insurance",
    kind: "book",
    service: "insurance",
    de: {
      slug: "dolmetscher-versicherung",
      title: "Dolmetscher beim Versicherungstermin – Kranken-, Unfall- & Haftpflicht",
      meta: "Dolmetscher bei Versicherungen: Kranken-, Unfall- und Haftpflichtgespräche sowie Leistungen. Deutsch, Englisch, Tamil — in Zürich & der Schweiz.",
      h1: "Dolmetscher für Versicherungsgespräche in Zürich und der Schweiz",
      intro: "Versicherungsdokumente und -gespräche sind komplex. Wir dolmetschen bei Kranken-, Unfall-, Haftpflicht- und Leistungsgesprächen — damit Sie wissen, was Ihnen zusteht.",
      points: [
        ["Kranken- & Unfallversicherung", "Leistungen, Deckung und Ansprüche klar erklärt."],
        ["Haftpflicht & Schadensfälle", "Schadensmeldungen und Rückfragen sicher übersetzt."],
        ["Ihre Rechte", "Sie verstehen, wofür Sie zahlen und was abgedeckt ist."]
      ],
      faq: [
        ["Was kostet ein Versicherungsdolmetscher?", "Eine halbe Stunde ab CHF 50; Offerte vorher per E-Mail."],
        ["Kann ich Leistungen klären lassen?", "Ja, wir dolmetschen beim Klären von Leistungen und Ansprüchen."],
        ["Auch per Video?", "Ja, Video-Dolmetschen ist inklusive."]
      ]
    },
    fr: {
      slug: "traducteur-assurance",
      title: "Interprète pour assurance – Maladie, accident, responsabilité civile",
      meta: "Interprète en assurance : santé, accident, responsabilité civile et prestations. Allemand, français, anglais, tamoul — Zurich & Suisse.",
      h1: "Interprète pour les conversations d'assurance à Zurich et en Suisse",
      intro: "Les documents et conversations d'assurance sont complexes. Nous interprétons lors des discussions sur la santé, l'accident, la responsabilité civile et les prestations.",
      points: [
        ["Maladie et accident", "Prestations, couverture et droits expliqués clairement."],
        ["Responsabilité et sinistres", "Déclarations de sinistre et questions décodées."],
        ["Vos droits", "Vous comprenez ce que vous payez et ce qui est couvert."]
      ],
      faq: [
        ["Combien coûte un interprète d'assurance ?", "Une demi-heure dès CHF 50 ; offre par e-mail avant."],
        ["Peut-on clarifier les prestations ?", "Oui, nous interprétons lors de la clarification des prestations."],
        ["Aussi en visio ?", "Oui, l'interprétation en visio est incluse."]
      ]
    },
    en: {
      slug: "interpreter-insurance-meeting",
      title: "Insurance Meeting Interpreter – Health, Accident, Liability (Zurich)",
      meta: "Interpreter for insurance meetings: health, accident, liability and claims discussions. German, English, Tamil — Zurich & Switzerland.",
      h1: "Interpreter for Insurance Meetings in Zurich and Switzerland",
      intro: "Insurance documents and talks are complex. We interpret at health, accident, liability and claims meetings — so you know what you are entitled to.",
      points: [
        ["Health & accident", "Benefits, coverage and entitlements explained clearly."],
        ["Liability & claims", "Claims reports and follow-up questions interpreted safely."],
        ["Your rights", "You understand what you pay for and what is covered."]
      ],
      faq: [
        ["What does an insurance interpreter cost?", "Half an hour from CHF 50; quote by email beforehand."],
        ["Can you help clarify benefits?", "Yes, we interpret while you clarify benefits and entitlements."],
        ["Also by video?", "Yes, video interpreting is included."]
      ]
    },
    it: {
      slug: "traduttore-incontro-assicurazione",
      title: "Interprete per appuntamenti assicurativi – Salute, infortunio, RC",
      meta: "Interprete in assicurazione: salute, infortunio, responsabilità civile e prestazioni. Tedesco, inglese, tamil — Zurigo & Svizzera.",
      h1: "Interprete per i colloqui assicurativi a Zurigo e in Svizzera",
      intro: "I documenti e i colloqui assicurativi sono complessi. Interpretiamo durante le discussioni su salute, infortunio, responsabilità civile e prestazioni — così sa a cosa ha diritto.",
      points: [
        ["Salute e infortunio", "Prestazioni, copertura e diritti spiegati chiaramente."],
        ["Responsabilità e sinistri", "Denunce di sinistro e domande tradotte in modo sicuro."],
        ["I suoi diritti", "Capisce per cosa paga e cosa è coperto."]
      ],
      faq: [
        ["Quanto costa un interprete assicurativo?", "Mezz'ora da CHF 50; offerta via e-mail prima."],
        ["Potete aiutare a chiarire le prestazioni?", "Sì, interpretiamo mentre lei chiarisce prestazioni e diritti."],
        ["Anche in video?", "Sì, l'interpretariato in video è incluso."]
      ]
    }
  },
  {
    id: "interview",
    kind: "book",
    service: "interview",
    de: {
      slug: "dolmetscher-vorstellungsgespraech",
      title: "Dolmetscher für Vorstellungsgespräche – Bewerbung & Lehre",
      meta: "Dolmetscher beim Vorstellungsgespräch: Bewerbungen, Interviews und Lehrstellen. Deutsch, Englisch, Tamil — in Zürich & der Schweiz. Jetzt buchen.",
      h1: "Dolmetscher für Vorstellungsgespräche in Zürich und der Schweiz",
      intro: "Ihr Vorstellungsgespräch soll glänzen. Wir dolmetschen bei Bewerbungs-, Vorstellungs- und Lehrstellengesprächen — neutral, damit Ihre Antworten vollständig ankommen.",
      points: [
        ["Bewerbungsgespräche", "Sie präsentieren sich in jeder Sprache optimal."],
        ["Interviews & Fragen", "Fragen und Antworten werden ohne Verlust übersetzt."],
        ["Lehre & Praktikum", "Auch für Lehrstellen und Praktika im Einsatz."]
      ],
      faq: [
        ["Was kostet ein Dolmetscher beim Vorstellungsgespräch?", "Eine halbe Stunde ab CHF 45; Offerte vorher per E-Mail."],
        ["Ist der Dolmetscher neutral?", "Ja, wir übersetzen sachlich und geben keine Antworten vor."],
        ["Auch per Video möglich?", "Ja, Video-Dolmetschen ist inklusive."]
      ]
    },
    fr: {
      slug: "traducteur-entretien-embauche",
      title: "Interprète pour entretien d'embauche – Candidature et apprentissage",
      meta: "Interprète pour entretien d'embauche : candidatures, entretiens et places d'apprentissage. Allemand, français, anglais, tamoul — Zurich & Suisse.",
      h1: "Interprète pour les entretiens d'embauche à Zurich et en Suisse",
      intro: "Votre entretien d'embauche doit briller. Nous interprétons lors des candidatures, entretiens et places d'apprentissage — de manière neutre.",
      points: [
        ["Entretiens d'embauche", "Vous vous présentez au mieux dans chaque langue."],
        ["Questions et réponses", "Questions et réponses traduites sans perte."],
        ["Apprentissage & stage", "Aussi pour places d'apprentissage et stages."]
      ],
      faq: [
        ["Combien coûte un interprète pour l'entretien ?", "Une demi-heure dès CHF 45 ; offre par e-mail avant."],
        ["L'interprète est-il neutre ?", "Oui, nous traduisons objectivement sans donner de réponses."],
        ["En visio aussi ?", "Oui, l'interprétation en visio est incluse."]
      ]
    },
    en: {
      slug: "interpreter-job-interview",
      title: "Job Interview Interpreter in Zurich – Applications & Apprenticeships",
      meta: "Interpreter for job interviews: applications, interviews and apprenticeship meetings. German, English, Tamil — Zurich & Switzerland.",
      h1: "Interpreter for Job Interviews in Zurich and Switzerland",
      intro: "Your job interview should shine. We interpret at application, interview and apprenticeship meetings — neutrally, so your answers come across completely.",
      points: [
        ["Job interviews", "You present yourself at your best in any language."],
        ["Questions & answers", "Questions and answers translated without loss."],
        ["Apprenticeships & internships", "Also available for apprenticeships and internships."]
      ],
      faq: [
        ["What does a job interview interpreter cost?", "Half an hour from CHF 45; quote by email beforehand."],
        ["Is the interpreter neutral?", "Yes, we translate objectively and do not give answers for you."],
        ["Also by video?", "Yes, video interpreting is included."]
      ]
    },
    it: {
      slug: "traduttore-colloquio-lavoro",
      title: "Interprete per colloqui di lavoro a Zurigo – Candidature e apprendistato",
      meta: "Interprete per colloqui di lavoro: candidature, colloqui e apprendistato. Tedesco, inglese, tamil — Zurigo & Svizzera.",
      h1: "Interprete per i colloqui di lavoro a Zurigo e in Svizzera",
      intro: "Il suo colloquio di lavoro deve brillare. Interpretiamo durante candidature, colloqui e apprendistato — in modo neutrale, affinché le sue risposte arrivino complete.",
      points: [
        ["Colloqui di lavoro", "Si presenta al meglio in ogni lingua."],
        ["Domande e risposte", "Domande e risposte tradotte senza perdite."],
        ["Apprendistato e stage", "Disponibili anche per apprendistato e tirocini."]
      ],
      faq: [
        ["Quanto costa un interprete per il colloquio di lavoro?", "Mezz'ora da CHF 45; offerta via e-mail prima."],
        ["L'interprete è neutrale?", "Sì, traduciamo in modo oggettivo senza dare risposte al posto suo."],
        ["Anche in video?", "Sì, l'interpretariato in video è incluso."]
      ]
    }
  },
  {
    id: "government",
    kind: "book",
    service: "government",
    de: {
      slug: "dolmetscher-amt",
      title: "Dolmetscher beim Amt – Steuern, AHV, Soziales & Kanton",
      meta: "Dolmetscher beim Amt: Steuern, Soziales, AHV und kantonale Behörden. Deutsch, Englisch, Tamil — in Zürich & der Schweiz. Jetzt buchen.",
      h1: "Dolmetscher für Amtsbesuche in Zürich und der Schweiz",
      intro: "Ämter verlangen Präzision. Wir dolmetschen bei Steuer-, Sozial-, AHV- und Kantonsbehörden — sowie bei allen offiziellen Angelegenheiten in Deutsch, Englisch oder Tamil.",
      points: [
        ["Steuer & Soziales", "Steuererklärungen, Sozialhilfe und Ergänzungsleistungen."],
        ["AHV & IV", "Renten- und IV-Fragen klar verständlich übersetzt."],
        ["Kantonale Behörden", "Wir kennen Abläufe und Behördensprache."]
      ],
      faq: [
        ["Was kostet ein Dolmetscher beim Amt?", "Eine halbe Stunde ab CHF 50; Offerte vorher per E-Mail."],
        ["Was ist der Unterschied zu Gemeindeterminen?", "Amtsbesuche betreffen oft kantonale, steuer- oder sozialrechtliche Stellen."],
        ["Auch per Video?", "Ja, Video-Dolmetschen ist inklusive."]
      ]
    },
    fr: {
      slug: "traducteur-administration",
      title: "Interprète auprès des autorités – Impôts, AVS, social et canton",
      meta: "Interprète auprès des autorités : impôts, social, AVS et autorités cantonales. Allemand, français, anglais, tamoul — Zurich & Suisse.",
      h1: "Interprète pour les rendez-vous auprès des autorités",
      intro: "Les autorités exigent de la précision. Nous interprétons auprès des autorités fiscales, sociales, AVS et cantonales — ainsi que pour toutes les affaires officielles.",
      points: [
        ["Impôts et social", "Déclarations d'impôts, aide sociale et prestations complémentaires."],
        ["AVS & AI", "Questions de rentes et AI traduites clairement."],
        ["Autorités cantonales", "Nous connaissons les procédures et le langage administratif."]
      ],
      faq: [
        ["Combien coûte un interprète auprès des autorités ?", "Une demi-heure dès CHF 50 ; offre par e-mail avant."],
        ["Différence avec la commune ?", "Les visites officielles concernent souvent le fiscal, le social ou le canton."],
        ["En visio aussi ?", "Oui, l'interprétation en visio est incluse."]
      ]
    },
    en: {
      slug: "interpreter-government-office",
      title: "Government Office Interpreter – Taxes, AHV, Social Services",
      meta: "Interpreter for government offices: tax, social services, AHV and cantonal authorities. German, English, Tamil — Zurich & Switzerland.",
      h1: "Interpreter for Government Office Visits in Zurich and Switzerland",
      intro: "Government offices require precision. We interpret at tax, social, AHV and cantonal authorities — and for all official matters in German, English or Tamil.",
      points: [
        ["Tax & social services", "Tax returns, social assistance and supplementary benefits."],
        ["AHV & IV", "Pension and disability questions translated clearly."],
        ["Cantonal authorities", "We know the processes and official language."]
      ],
      faq: [
        ["What does a government interpreter cost?", "Half an hour from CHF 50; quote by email beforehand."],
        ["Difference from Gemeinde appointments?", "Official visits often involve tax, social or cantonal offices."],
        ["Also by video?", "Yes, video interpreting is included."]
      ]
    },
    it: {
      slug: "traduttore-ufficio-governativo",
      title: "Interprete per uffici ufficiali – Imposte, AVS, servizi sociali",
      meta: "Interprete per uffici governativi: imposte, servizi sociali, AVS e autorità cantonali. Tedesco, inglese, tamil — Zurigo & Svizzera.",
      h1: "Interprete per le visite agli uffici ufficiali a Zurigo e in Svizzera",
      intro: "Gli uffici richiedono precisione. Interpretiamo presso autorità fiscali, sociali, AVS e cantonali — e per tutte le questioni ufficiali in tedesco, inglese o tamil.",
      points: [
        ["Imposte e sociale", "Dichiarazioni fiscali, assistenza sociale e prestazioni complementari."],
        ["AVS e AI", "Questioni di rendita e invalidità tradotte chiaramente."],
        ["Autorità cantonali", "Conosciamo le procedure e il linguaggio ufficiale."]
      ],
      faq: [
        ["Quanto costa un interprete presso un ufficio?", "Mezz'ora da CHF 50; offerta via e-mail prima."],
        ["Differenza con il comune?", "Le visite ufficiali riguardano spesso fisco, sociale o cantone."],
        ["Anche in video?", "Sì, l'interpretariato in video è incluso."]
      ]
    }
  },

  // ------------------------------------------------------------------ Other
  {
    id: "custom",
    kind: "book",
    service: "custom",
    de: {
      slug: "dolmetscher-buchen",
      title: "Dolmetscher & Übersetzer buchen in Zürich – Deutsch, Englisch, Tamil",
      meta: "Dolmetscher und Übersetzer buchen in Zürich & der Schweiz: Deutsch, Englisch, Tamil. Live, vor Ort oder per Video. Schnell & zuverlässig — jetzt buchen.",
      h1: "Dolmetscher und Übersetzer einfach online buchen",
      intro: "Egal welches Gespräch wichtig ist — Arztermin, Behörde, Firma oder Privates: Buchen Sie einen professionellen Dolmetscher in Zürich oder der ganzen Schweiz in wenigen Minuten, vor Ort oder per Video.",
      points: [
        ["Jede Situation", "Vom Arzt bis zur Geschäftsverhandlung — wir sind vorbereitet."],
        ["Vor Ort oder per Video", "Wählen Sie die für Sie passende Art der Teilnahme."],
        ["Feste Preise", "Transparente Preise ohne Überraschungen, Offerte vorher per E-Mail."]
      ],
      faq: [
        ["Wie schnell kann ich einen Termin haben?", "Oft innerhalb weniger Tage; Eiltermine sind möglich."],
        ["Wo dolmetscht ihr?", "In Zürich und der ganzen Schweiz, vor Ort oder per Video."],
        ["Was kostet das?", "Je nach Situation ab CHF 35 pro halbe Stunde; Offerte vorher."]
      ]
    },
    fr: {
      slug: "reserver-interprete",
      title: "Réserver un interprète ou traducteur à Zurich – DE, EN, Tamil",
      meta: "Réservez un interprète ou traducteur à Zurich et en Suisse : allemand, anglais, tamoul. En présentiel ou en visio. Rapide et fiable — réservez.",
      h1: "Réservez facilement un interprète ou traducteur en ligne",
      intro: "Quelle que soit l'importance de la conversation — médecin, autorités, entreprise ou personnel : réservez un interprète professionnel à Zurich ou en Suisse en quelques minutes, sur place ou en visio.",
      points: [
        ["Toute situation", "Du médecin à la négociation d'affaires — nous sommes prêts."],
        ["Sur place ou en visio", "Choisissez le mode de participation qui vous convient."],
        ["Prix fixes", "Prix transparents, offre par e-mail avant."]
      ],
      faq: [
        ["Dans quel délai puis-je avoir un rendez-vous ?", "Souvent en quelques jours ; urgences possibles."],
        ["Où intervenez-vous ?", "À Zurich et dans toute la Suisse, sur place ou en visio."],
        ["Combien ça coûte ?", "Selon la situation dès CHF 35 la demi-heure ; offre avant."]
      ]
    },
    en: {
      slug: "book-interpreter",
      title: "Book an Interpreter or Translator in Zurich – DE, EN, Tamil",
      meta: "Book an interpreter or translator in Zurich & Switzerland: German, English, Tamil. In person or by video. Fast & reliable — book now.",
      h1: "Book an Interpreter or Translator Online in Minutes",
      intro: "Whatever conversation matters — doctor, authorities, business or private: book a professional interpreter in Zurich or across Switzerland in minutes, in person or by video.",
      points: [
        ["Any situation", "From the doctor to business negotiations — we come prepared."],
        ["In person or by video", "Choose the participation mode that suits you."],
        ["Fixed prices", "Transparent pricing, quote by email beforehand."]
      ],
      faq: [
        ["How fast can I get an appointment?", "Often within a few days; urgent slots are possible."],
        ["Where do you work?", "In Zurich and across Switzerland, in person or by video."],
        ["How much does it cost?", "Depending on the situation from CHF 35 per half hour; quote first."]
      ]
    },
    it: {
      slug: "prenota-interprete",
      title: "Prenota un interprete o traduttore a Zurigo – TED, EN, Tamil",
      meta: "Prenota un interprete o traduttore a Zurigo e in Svizzera: tedesco, inglese, tamil. Dal vivo o in video. Veloce e affidabile — prenota ora.",
      h1: "Prenota online un interprete o traduttore in pochi minuti",
      intro: "Qualunque conversazione sia importante — medico, autorità, azienda o privato: prenoti un interprete professionale a Zurigo o in tutta la Svizzera in pochi minuti, dal vivo o in video.",
      points: [
        ["Ogni situazione", "Dal medico alla trattativa d'affari — arriviamo preparati."],
        ["Dal vivo o in video", "Scelga la modalità di partecipazione ideale."],
        ["Prezzi fissi", "Prezzi trasparenti, offerta via e-mail prima."]
      ],
      faq: [
        ["In quanto tempo posso avere un appuntamento?", "Spesso entro pochi giorni; possibili slot urgenti."],
        ["Dove operate?", "A Zurigo e in tutta la Svizzera, dal vivo o in video."],
        ["Quanto costa?", "A seconda della situazione da CHF 35 a mezz'ora; prima l'offerta."]
      ]
    }
  },

  // ------------------------------------------------------ Document types (9)
  {
    id: "doc-residence",
    kind: "doc",
    service: "residence",
    de: {
      slug: "uebersetzung-aufenthaltsbewilligung",
      title: "Übersetzung Aufenthaltsbewilligung – Deutsch–Englisch–Tamil (beglaubigt)",
      meta: "Übersetzung Ihrer Aufenthaltsbewilligung und Anmeldung: Deutsch, Englisch, Tamil, auch beglaubigt. Schnell, sicher, zum Festpreis. Jetzt hochladen.",
      h1: "Übersetzung von Aufenthaltsbewilligung & Anmeldung",
      intro: "Ihre Aufenthaltsbewilligung, Anmeldung oder Familiendokumente — professionell übersetzt und anerkannt. Sie laden hoch, wir übersetzen und senden das Dokument per E-Mail zurück.",
      points: [
        ["Beglaubigt oder einfach", "Standard- oder beglaubigte Übersetzung, je nach Zweck."],
        ["Schnelle Lieferung", "In der Regel innerhalb weniger Arbeitstage."],
        ["Fester Preis", "Klare Pauschale pro Dokument, Offerte vorab per E-Mail."]
      ],
      faq: [
        ["Ist die Übersetzung offiziell anerkannt?", "Beglaubigte Übersetzungen sind für Behörden und Ämter anerkannt; einfach für Private."],
        ["Was kostet die Übersetzung?", "Ab CHF 120 (beglaubigt) bzw. CHF 125 (einfach) pro Dokument."],
        ["Welche Formate kann ich senden?", "PDF, JPG, PNG, HEIC, DOC und mehr — bis zu 3 Dateien pro Auftrag."]
      ]
    },
    fr: {
      slug: "traduction-autorisation-sejour",
      title: "Traduction autorisation de séjour – DE–FR–EN–Tamil (légalisée)",
      meta: "Traduction de votre autorisation de séjour et inscription : allemand, français, anglais, tamoul, aussi légalisée. Rapide, sûr, tarif fixe.",
      h1: "Traduction d'autorisation de séjour et d'inscription",
      intro: "Votre autorisation de séjour, inscription ou documents familiaux — traduits professionnellement et reconnus. Vous téléversez, nous traduisons et renvoyons par e-mail.",
      points: [
        ["Légalisée ou simple", "Traduction standard ou légalisée selon l'objectif."],
        ["Livraison rapide", "En général sous quelques jours ouvrables."],
        ["Prix fixe", "Forfait clair par document, offre par e-mail avant."]
      ],
      faq: [
        ["La traduction est-elle officiellement reconnue ?", "Les traductions légalisées sont reconnues par les autorités ; les simples conviennent aux particuliers."],
        ["Combien coûte la traduction ?", "Dès CHF 120 (légalisée) ou CHF 125 (simple) par document."],
        ["Quels formats puis-je envoyer ?", "PDF, JPG, PNG, HEIC, DOC et plus — jusqu'à 3 fichiers."]
      ]
    },
    en: {
      slug: "translation-residence-permit",
      title: "Residence Permit Translation – German·English·Tamil (Certified)",
      meta: "Translation of your residence permit and registration: German, English, Tamil, also certified. Fast, secure, fixed price. Upload now.",
      h1: "Residence Permit & Registration Translation",
      intro: "Your residence permit, registration or family documents — professionally translated and recognised. You upload, we translate and send the document back by email.",
      points: [
        ["Certified or plain", "Standard or certified translation, depending on the purpose."],
        ["Fast delivery", "Usually within a few business days."],
        ["Fixed price", "Clear flat rate per document, quote by email beforehand."]
      ],
      faq: [
        ["Is the translation officially recognised?", "Certified translations are accepted by authorities; plain ones suit private use."],
        ["What does the translation cost?", "From CHF 120 (certified) or CHF 125 (plain) per document."],
        ["Which formats can I send?", "PDF, JPG, PNG, HEIC, DOC and more — up to 3 files per order."]
      ]
    },
    it: {
      slug: "traduzione-permesso-soggiorno",
      title: "Traduzione permesso di soggiorno – TED·ING·Tamil (giurata)",
      meta: "Traduzione del suo permesso di soggiorno e registrazione: tedesco, inglese, tamil, anche giurata. Veloce, sicura, prezzo fisso.",
      h1: "Traduzione di permesso di soggiorno e registrazione",
      intro: "Il suo permesso di soggiorno, la registrazione o i documenti familiari — tradotti professionalmente e riconosciuti. Lei carica, noi traduciamo e inviamo il documento via e-mail.",
      points: [
        ["Giurata o semplice", "Traduzione standard o giurata, a seconda dello scopo."],
        ["Consegna rapida", "Di solito entro pochi giorni lavorativi."],
        ["Prezzo fisso", "Tariffa chiara per documento, offerta via e-mail prima."]
      ],
      faq: [
        ["La traduzione è riconosciuta ufficialmente?", "Le traduzioni giurate sono riconosciute dalle autorità; quelle semplici vanno bene per uso privato."],
        ["Quanto costa la traduzione?", "Da CHF 120 (giurata) o CHF 125 (semplice) per documento."],
        ["Quali formati posso inviare?", "PDF, JPG, PNG, HEIC, DOC e altri — fino a 3 file."]
      ]
    }
  },
  {
    id: "doc-visa",
    kind: "doc",
    service: "visa",
    de: {
      slug: "uebersetzung-visum",
      title: "Übersetzung Visumantrag & Visumunterlagen – DE–EN–Tamil (beglaubigt)",
      meta: "Übersetzung Ihres Visumantrags, Einladungen und Begleitschreiben: Deutsch, Englisch, Tamil, auch beglaubigt. Schnell und sicher — jetzt hochladen.",
      h1: "Übersetzung von Visumanträgen und Visumunterlagen",
      intro: "Schengen-, Nationalvisum, Einladungsschreiben und Referenzbriefe: Wir übersetzen Ihre Visumunterlagen zuverlässig und anerkannt für die Schweizer Behörden.",
      points: [
        ["Schengen & Nationalvisa", "Alle Begleitdokumente für Ihre Visumsbeantragung."],
        ["Beglaubigt anerkannt", "Geeignet für Botschaften und Konsulate."],
        ["Komplett inklusive", "Einfach hochladen, fertige Übersetzung per E-Mail."]
      ],
      faq: [
        ["Kann ich Einladungen übersetzen lassen?", "Ja, Einladungsschreiben werden häufig übersetzt und beglaubigt."],
        ["Wie schnell geht es?", "In der Regel innerhalb weniger Arbeitstage."],
        ["An wen richte ich mich bei Fragen?", "Einfach per E-Mail oder WhatsApp — wir antworten schnell."]
      ]
    },
    fr: {
      slug: "traduction-visa",
      title: "Traduction demande de visa – DE–FR–EN–Tamil (légalisée)",
      meta: "Traduction de votre demande de visa, invitations et lettres : allemand, français, anglais, tamoul, aussi légalisée. Rapide et sûr.",
      h1: "Traduction de demandes de visa et documents de visa",
      intro: "Schengen, visa national, lettre d'invitation et lettres de référence : nous traduisons vos documents de visa de manière fiable pour les autorités suisses.",
      points: [
        ["Schengen et visas nationaux", "Tous les documents pour votre demande de visa."],
        ["Reconnaissance légale", "Convient aux ambassades et consulats."],
        ["Tout compris", "Téléversez simplement, traduction par e-mail."]
      ],
      faq: [
        ["Peut-on traduire des invitations ?", "Oui, les lettres d'invitation sont souvent traduites et légalisées."],
        ["Combien de temps ?", "En général sous quelques jours ouvrables."],
        ["Qui contacter en cas de question ?", "Par e-mail ou WhatsApp — réponse rapide."]
      ]
    },
    en: {
      slug: "translation-visa-application",
      title: "Visa Application Translation – German·English·Tamil (Certified)",
      meta: "Translation of your visa application, invitations and cover letters: German, English, Tamil, also certified. Fast and secure — upload now.",
      h1: "Visa Application & Visa Documents Translation",
      intro: "Schengen, national visa, invitation letters and reference letters: we translate your visa documents reliably and acceptably for Swiss authorities.",
      points: [
        ["Schengen & national visas", "All supporting documents for your visa application."],
        ["Officially acceptable", "Suitable for embassies and consulates."],
        ["All-inclusive", "Simply upload, finished translation by email."]
      ],
      faq: [
        ["Can you translate invitation letters?", "Yes, invitation letters are commonly translated and certified."],
        ["How fast is it?", "Usually within a few business days."],
        ["Who do I contact with questions?", "Just email or WhatsApp — we reply quickly."]
      ]
    },
    it: {
      slug: "traduzione-domanda-visto",
      title: "Traduzione domanda di visto – TED·ING·Tamil (giurata)",
      meta: "Traduzione della sua domanda di visto, inviti e lettere: tedesco, inglese, tamil, anche giurata. Veloce e sicura.",
      h1: "Traduzione di domande di visto e documenti",
      intro: "Schengen, visto nazionale, lettere di invito e referenze: traduciamo i suoi documenti in modo affidabile per le autorità svizzere.",
      points: [
        ["Schengen e visti nazionali", "Tutti i documenti per la sua domanda di visto."],
        ["Riconoscimento ufficiale", "Adatta ad ambasciate e consolati."],
        ["Tutto incluso", "Carichi e riceve la traduzione via e-mail."]
      ],
      faq: [
        ["Traducete lettere di invito?", "Sì, le lettere di invito sono spesso tradotte e giurate."],
        ["Quanto tempo serve?", "Di solito entro pochi giorni lavorativi."],
        ["Chi contattare per domande?", "Via e-mail o WhatsApp — rispondiamo rapidamente."]
      ]
    }
  },
  {
    id: "doc-tax",
    kind: "doc",
    service: "tax",
    de: {
      slug: "uebersetzung-steuererklaerung",
      title: "Übersetzung Steuererklärung & Steuerdokumente – DE–EN–Tamil",
      meta: "Übersetzung Ihrer Steuererklärung und Steuerdokumente: Deutsch, Englisch, Tamil, auch beglaubigt. Sicher & zum Festpreis. Jetzt hochladen.",
      h1: "Übersetzung der Steuererklärung und Steuerunterlagen",
      intro: "Steuererklärungen, Nachweise und Belege für das Steueramt: Wir übersetzen Ihre Steuerdokumente verständlich und anerkannt — für die Schweiz und das Ausland.",
      points: [
        ["Fürs Steueramt", "Lohnausweise, Bescheide und Belege klar übersetzt."],
        ["Ausland vs. Schweiz", "Übersetzungen für ausländische wie schweizerische Steuerbehörden."],
        ["Diskret", "Ihre Finanzdaten behandeln wir streng vertraulich."]
      ],
      faq: [
        ["Übersetzt ihr Lohnausweise?", "Ja, Lohnausweise und Einkommensnachweise sind ein häufiger Auftrag."],
        ["Ist das beglaubigt möglich?", "Ja, auf Wunsch beglaubigt für Behörden."],
        ["Wie lege ich die Dokumente vor?", "Einfach hochladen (PDF/Bild), drei Dateien pro Auftrag."]
      ]
    },
    fr: {
      slug: "traduction-declaration-impots",
      title: "Traduction déclaration d'impôts – DE–FR–EN–Tamil",
      meta: "Traduction de votre déclaration d'impôts et documents fiscaux : allemand, français, anglais, tamoul, aussi légalisée. Sûr et à prix fixe.",
      h1: "Traduction de la déclaration d'impôts et des documents fiscaux",
      intro: "Déclarations, justificatifs et pièces pour le fisc : nous traduisons vos documents fiscaux clairement — pour la Suisse et l'étranger.",
      points: [
        ["Pour le fisc", "Certificats de salaire, avis et justificatifs traduits."],
        ["Étranger vs. Suisse", "Traductions pour autorités fiscales suisses et étrangères."],
        ["Discret", "Vos données financières restent strictement confidentielles."]
      ],
      faq: [
        ["Traduisez-vous les certificats de salaire ?", "Oui, c'est un mandat fréquent."],
        ["Possible en légalisé ?", "Oui, sur demande pour les autorités."],
        ["Comment fournir les documents ?", "Téléversez simplement (PDF/image), trois fichiers par commande."]
      ]
    },
    en: {
      slug: "translation-tax-declaration",
      title: "Tax Declaration & Tax Documents Translation – DE·EN·Tamil",
      meta: "Translation of your tax declaration and tax documents: German, English, Tamil, also certified. Secure and fixed-price. Upload now.",
      h1: "Tax Declaration & Tax Documents Translation",
      intro: "Tax declarations, certificates and evidence for the tax office: we translate your tax documents clearly — for Switzerland and abroad.",
      points: [
        ["For the tax office", "Salary certificates, assessments and proofs translated clearly."],
        ["Abroad vs. Switzerland", "Translations for foreign and Swiss tax authorities."],
        ["Discreet", "Your financial data stays strictly confidential."]
      ],
      faq: [
        ["Do you translate salary certificates?", "Yes, salary certificates and income proofs are a common request."],
        ["Can it be certified?", "Yes, on request for authorities."],
        ["How do I submit documents?", "Simply upload (PDF/image), three files per order."]
      ]
    },
    it: {
      slug: "traduzione-dichiarazione-fiscale",
      title: "Traduzione dichiarazione dei redditi – TED·ING·Tamil",
      meta: "Traduzione della sua dichiarazione dei redditi e documenti fiscali: tedesco, inglese, tamil, anche giurata. Sicura e a prezzo fisso.",
      h1: "Traduzione della dichiarazione dei redditi e dei documenti fiscali",
      intro: "Dichiarazioni, certificati e giustificativi per il fisco: traduciamo i suoi documenti fiscali in modo chiaro — per la Svizzera e l'estero.",
      points: [
        ["Per il fisco", "Certificati di salario, avvisi e giustificativi tradotti."],
        ["Estero vs. Svizzera", "Traduzioni per autorità fiscali svizzere ed estere."],
        ["Riservato", "I suoi dati finanziari restano strettamente confidenziali."]
      ],
      faq: [
        ["Traducete certificati di salario?", "Sì, è un incarico frequente."],
        ["È possibile la versione giurata?", "Sì, su richiesta per le autorità."],
        ["Come presento i documenti?", "Caricando semplicemente (PDF/immagine), tre file per ordine."]
      ]
    }
  },
  {
    id: "doc-ahv",
    kind: "doc",
    service: "ahv",
    de: {
      slug: "uebersetzung-ahv-sozialhilfe",
      title: "Übersetzung AHV & Sozialhilfe-Dokumente – DE–EN–Tamil (beglaubigt)",
      meta: "Übersetzung von AHV- und Sozialhilfe-Dokumenten: Deutsch, Englisch, Tamil, auch beglaubigt. Schnell, sicher, anerkannt. Jetzt hochladen.",
      h1: "Übersetzung von AHV- und Sozialhilfedokumenten",
      intro: "AHV-Auszüge, Rentenbescheide und Sozialhilfedokumente: Wir übersetzen zuverlässig und behördenkonform — damit Sie wissen, was drin steht.",
      points: [
        ["Rente & AHV", "Auszüge und Bescheide klar auf Deutsch, Englisch, Tamil."],
        ["Sozialhilfe & EL", "Anträge und Bescheide verständlich übersetzt."],
        ["Vertraulich", "Ihre persönlichen Daten bleiben geschützt."]
      ],
      faq: [
        ["Was kostet die Übersetzung von AHV-Dokumenten?", "Ab CHF 120 (beglaubigt) pro Dokument; Offerte vorab."],
        ["Kann ich die Rentenbescheide übersetzen lassen?", "Ja, das ist ein häufiger Auftrag."],
        ["Wie sende ich die Dokumente?", "Hochladen als PDF oder Bild, bis zu 3 Dateien."]
      ]
    },
    fr: {
      slug: "traduction-avs-aide-sociale",
      title: "Traduction documents AVS & aide sociale – DE–FR–EN–Tamil",
      meta: "Traduction de documents AVS et d'aide sociale : allemand, français, anglais, tamoul, aussi légalisée. Rapide, sûr, reconnu.",
      h1: "Traduction de documents AVS et d'aide sociale",
      intro: "Relevés AVS, décisions de rente et documents d'aide sociale : nous traduisons de manière fiable et conforme.",
      points: [
        ["Rente & AVS", "Relevés et décisions clairs en allemand, français, anglais, tamoul."],
        ["Aide sociale & PC", "Demandes et décisions traduites clairement."],
        ["Confidentiel", "Vos données personnelles restent protégées."]
      ],
      faq: [
        ["Combien coûte la traduction de documents AVS ?", "Dès CHF 120 (légalisée) par document ; offre avant."],
        ["Peut-on traduire les décisions de rente ?", "Oui, c'est un mandat fréquent."],
        ["Comment envoyer les documents ?", "Téléversez en PDF ou image, jusqu'à 3 fichiers."]
      ]
    },
    en: {
      slug: "translation-ahv-social",
      title: "AHV & Social Security Documents Translation – DE·EN·Tamil",
      meta: "Translation of AHV and social assistance documents: German, English, Tamil, also certified. Fast, secure, recognised. Upload now.",
      h1: "AHV & Social Assistance Documents Translation",
      intro: "AHV statements, pension decisions and social assistance documents: we translate reliably and to official standards — so you know exactly what they say.",
      points: [
        ["Pension & AHV", "Statements and decisions clear in German, English, Tamil."],
        ["Social assistance & EFZ", "Applications and decisions translated clearly."],
        ["Confidential", "Your personal data stays protected."]
      ],
      faq: [
        ["What does translating AHV documents cost?", "From CHF 120 (certified) per document; quote beforehand."],
        ["Can you translate pension decisions?", "Yes, that's a common request."],
        ["How do I send documents?", "Upload as PDF or image, up to 3 files."]
      ]
    },
    it: {
      slug: "traduzione-avs-assistenza-sociale",
      title: "Traduzione documenti AVS e assistenza sociale – TED·ING·Tamil",
      meta: "Traduzione di documenti AVS e assistenza sociale: tedesco, inglese, tamil, anche giurata. Veloce, sicura, riconosciuta.",
      h1: "Traduzione di documenti AVS e assistenza sociale",
      intro: "Estratti AVS, decisioni di rendita e documenti di assistenza sociale: traduciamo in modo affidabile e conforme.",
      points: [
        ["Rendita e AVS", "Estratti e decisioni chiari in tedesco, inglese, tamil."],
        ["Assistenza sociale e PC", "Domande e decisioni tradotte chiaramente."],
        ["Riservato", "I suoi dati personali restano protetti."]
      ],
      faq: [
        ["Quanto costa la traduzione di documenti AVS?", "Da CHF 120 (giurata) per documento; offerta prima."],
        ["Traducete le decisioni di rendita?", "Sì, è un incarico frequente."],
        ["Come invio i documenti?", "Caricando in PDF o immagine, fino a 3 file."]
      ]
    }
  },
  {
    id: "doc-insurance",
    kind: "doc",
    service: "insurance",
    de: {
      slug: "uebersetzung-versicherungsformular",
      title: "Übersetzung Versicherungsformular & Policen – DE–EN–Tamil",
      meta: "Übersetzung von Versicherungsformularen und Policen: Deutsch, Englisch, Tamil, auch beglaubigt. Verständlich & korrekt — jetzt hochladen.",
      h1: "Übersetzung von Versicherungsformularen und Policen",
      intro: "Kranken-, Unfall- und Haftpflichtpolicen korrekt übersetzt: Sie verstehen Deckung, Leistungen und Bedingungen Ihrer Versicherung vollständig.",
      points: [
        ["Alle Versicherungen", "Kranken-, Unfall-, Haftpflicht- und Lebensversicherung."],
        ["Leistungen verstehen", "Deckung, Ausschlüsse und Bedingungen klar erklärt."],
        ["Beglaubigt möglich", "Für Behörden auf Wunsch beglaubigt."]
      ],
      faq: [
        ["Übersetzt ihr ganze Policen?", "Ja, wir übersetzen Policen und Bedingungen verständlich."],
        ["Was kostet das?", "Ab CHF 125 pro Dokument; Offerte vorab per E-Mail."],
        ["Kann ich einzelne Klauseln übersetzen lassen?", "Ja, auch Auszüge oder summarische Erklärungen."]
      ]
    },
    fr: {
      slug: "traduction-formulaire-assurance",
      title: "Traduction formule d'assurance & polices – DE–FR–EN–Tamil",
      meta: "Traduction de formulaires d'assurance et polices : allemand, français, anglais, tamoul, aussi légalisée. Compréhensible et exacte.",
      h1: "Traduction de formulaires d'assurance et de polices",
      intro: "Polices maladie, accident et responsabilité civile traduites correctement : vous comprenez pleinement couverture, prestations et conditions.",
      points: [
        ["Toutes assurances", "Maladie, accident, responsabilité civile et vie."],
        ["Comprendre les prestations", "Couverture, exclusions et conditions expliquées."],
        ["Légalisé possible", "Sur demande pour les autorités."]
      ],
      faq: [
        ["Traduisez-vous des polices entières ?", "Oui, nous traduisons polices et conditions clairement."],
        ["Combien ça coûte ?", "Dès CHF 125 par document ; offre avant par e-mail."],
        ["Peut-on traduire des clauses seules ?", "Oui, aussi des extraits ou des explications résumées."]
      ]
    },
    en: {
      slug: "translation-insurance-form",
      title: "Insurance Form & Policy Translation – DE·EN·Tamil",
      meta: "Translation of insurance forms and policies: German, English, Tamil, also certified. Clear and accurate — upload now.",
      h1: "Insurance Form & Policy Translation",
      intro: "Health, accident and liability policies translated correctly: you fully understand your coverage, benefits and conditions."
      ,
      points: [
        ["All insurances", "Health, accident, liability and life insurance."],
        ["Understand benefits", "Coverage, exclusions and conditions explained."],
        ["Certified option", "On request for authorities."]
      ],
      faq: [
        ["Do you translate whole policies?", "Yes, we translate policies and conditions clearly."],
        ["How much does it cost?", "From CHF 125 per document; quote by email beforehand."],
        ["Can I translate single clauses?", "Yes, extracts or summarised explanations too."]
      ]
    },
    it: {
      slug: "traduzione-modulo-assicurativo",
      title: "Traduzione moduli assicurativi e polizze – TED·ING·Tamil",
      meta: "Traduzione di moduli assicurativi e polizze: tedesco, inglese, tamil, anche giurata. Chiara e accurata.",
      h1: "Traduzione di moduli assicurativi e polizze",
      intro: "Polizze sanitarie, infortuni e responsabilità civile tradotte correttamente: comprende pienamente copertura, prestazioni e condizioni.",
      points: [
        ["Tutte le assicurazioni", "Salute, infortuni, RC e vita."],
        ["Capire le prestazioni", "Copertura, esclusioni e condizioni spiegate."],
        ["Possibile giurata", "Su richiesta per le autorità."]
      ],
      faq: [
        ["Traducete intere polizze?", "Sì, traduciamo polizze e condizioni in modo chiaro."],
        ["Quanto costa?", "Da CHF 125 per documento; offerta via e-mail prima."],
        ["Si possono tradurre solo alcune clausole?", "Sì, anche estratti o spiegazioni riassuntive."]
      ]
    }
  },
  {
    id: "doc-bank",
    kind: "doc",
    service: "bank",
    de: {
      slug: "uebersetzung-bankformular",
      title: "Übersetzung Bankformular & Kontoauszug – DE–EN–Tamil",
      meta: "Übersetzung von Bankformularen, Kontoauszügen und Hypotheken: Deutsch, Englisch, Tamil, auch beglaubigt. Sicher & diskret. Jetzt hochladen.",
      h1: "Übersetzung von Bankformularen und Kontoauszügen",
      intro: "Bankformulare, Kontoauszüge und Hypothekendokumente korrekt übersetzt — für Banken, Behörden und private Zwecke. Diskret und pünktlich.",
      points: [
        ["Kontoauszüge & Formulare", "Präzise Übertragung ohne Interpretationsspielraum."],
        ["Hypotheken & Verträge", "Wichtige Vertragsbestandteile klar übersetzt."],
        ["Diskretion", "Finanzielle Daten streng vertraulich behandelt."]
      ],
      faq: [
        ["Übersetzt ihr Kontoauszüge?", "Ja, für Behörden, Banken und Einbürgerung."],
        ["Was kostet die Übersetzung?", "Ab CHF 125 pro Dokument; Offerte vorab."],
        ["Für einbürgerungsunterlagen geeignet?", "Ja, Kontoauszüge werden oft für Einbürgerung verlangt."]
      ]
    },
    fr: {
      slug: "traduction-formulaire-banque",
      title: "Traduction formulaire bancaire & relevé de compte – DE–FR–EN",
      meta: "Traduction de formulaires bancaires, relevés de compte et hypothèques : allemand, français, anglais, tamoul, aussi légalisée.",
      h1: "Traduction de formulaires bancaires et relevés de compte",
      intro: "Formulaires bancaires, relevés et documents hypothécaires traduits correctement — pour banques, autorités et usage privé. Discret et ponctuel.",
      points: [
        ["Relevés & formulaires", "Reproduction précise sans interprétation."],
        ["Hypothèques & contrats", "Points contractuels importants traduits."],
        ["Discrétion", "Données financières strictement confidentielles."]
      ],
      faq: [
        ["Traduisez-vous les relevés de compte ?", "Oui, pour les autorités, banques et naturalisation."],
        ["Combien coûte la traduction ?", "Dès CHF 125 par document ; offre avant."],
        ["Convient pour la naturalisation ?", "Oui, les relevés sont souvent exigés."]
      ]
    },
    en: {
      slug: "translation-bank-form",
      title: "Bank Form & Bank Statement Translation – DE·EN·Tamil",
      meta: "Translation of bank forms, statements and mortgages: German, English, Tamil, also certified. Secure & discreet. Upload now.",
      h1: "Bank Form & Bank Statement Translation",
      intro: "Bank forms, statements and mortgage documents translated correctly — for banks, authorities and private use. Discreet and on time."
      ,
      points: [
        ["Statements & forms", "Precise reproduction without interpretation."],
        ["Mortgages & contracts", "Key contract points translated clearly."],
        ["Discretion", "Financial data kept strictly confidential."]
      ],
      faq: [
        ["Do you translate bank statements?", "Yes, for authorities, banks and naturalisation."],
        ["How much does translation cost?", "From CHF 125 per document; quote beforehand."],
        ["Suitable for naturalisation files?", "Yes, statements are often required."]
      ]
    },
    it: {
      slug: "traduzione-modulo-bancario",
      title: "Traduzione moduli bancari ed estratti conto – TED·ING·Tamil",
      meta: "Traduzione di moduli bancari, estratti conto e mutui: tedesco, inglese, tamil, anche giurata. Sicura e riservata.",
      h1: "Traduzione di moduli bancari ed estratti conto",
      intro: "Moduli bancari, estratti conto e documenti di mutuo tradotti correttamente — per banche, autorità e uso privato. Discreto e puntuale.",
      points: [
        ["Estratti e moduli", "Riproduzione precisa senza interpretazioni."],
        ["Mutui e contratti", "Punti contrattuali chiave tradotti chiaramente."],
        ["Riservatezza", "Dati finanziari trattati in modo strettamente confidenziale."]
      ],
      faq: [
        ["Traducete estratti conto?", "Sì, per autorità, banche e naturalizzazione."],
        ["Quanto costa la traduzione?", "Da CHF 125 per documento; offerta prima."],
        ["Adatta per la naturalizzazione?", "Sì, gli estratti sono spesso richiesti."]
      ]
    }
  },
  {
    id: "doc-school",
    kind: "doc",
    service: "school",
    de: {
      slug: "uebersetzung-schulunterlagen",
      title: "Übersetzung Schuldokumente, Diplome & Zeugnisse – DE–EN–Tamil",
      meta: "Übersetzung von Schul- und Bildungsunterlagen: Diplome, Zeugnisse und Abschlüsse. Deutsch, Englisch, Tamil, auch beglaubigt. Jetzt hochladen.",
      h1: "Übersetzung von Schul- und Bildungsunterlagen",
      intro: "Diplome, Zeugnisse und Abschlüsse aus dem Ausland: Wir übersetzen Ihre Schulunterlagen anerkannt und präzise — seit langem ein Kernauftrag für Behörden und Arbeitgeber.",
      points: [
        ["Diplome & Zeugnisse", "Präzise Übersetzung für Anerkennung & Bewerbung."],
        ["Behördlich anerkannt", "Beglaubigte Übersetzung auf Wunsch."],
        ["Weltweit einsetzbar", "Für Schweizer und internationale Stellen."]
      ],
      faq: [
        ["Übersetzt ihr Diplome beglaubigt?", "Ja, beglaubigte Übersetzungen für Anerkennungsstellen."],
        ["Was kostet die Übersetzung eines Zeugnisses?", "Ab CHF 125 pro Dokument; Offerte vorab."],
        ["Wie lange dauert es?", "Meist wenige Arbeitstage."]
      ]
    },
    fr: {
      slug: "traduction-diplomes",
      title: "Traduction documents scolaires, diplômes & certificats – DE–FR",
      meta: "Traduction de documents scolaires : diplômes, certificats et titres. Allemand, français, anglais, tamoul, aussi légalisée.",
      h1: "Traduction de documents scolaires et universitaires",
      intro: "Diplômes, certificats et titres étrangers : nous traduisons vos documents scolaires de manière reconnue et précise.",
      points: [
        ["Diplômes & certificats", "Traduction précise pour reconnaissance et candidature."],
        ["Reconnaissance officielle", "Traduction légalisée sur demande."],
        ["Utilisable partout", "Pour autorités suisses et internationales."]
      ],
      faq: [
        ["Traduisez-vous les diplômes en légalisé ?", "Oui, pour les offices de reconnaissance."],
        ["Combien coûte un certificat ?", "Dès CHF 125 par document ; offre avant."],
        ["Combien de temps ?", "Souvent quelques jours ouvrables."]
      ]
    },
    en: {
      slug: "translation-school-documents",
      title: "School Documents, Diploma & Transcript Translation – DE·EN·Tamil",
      meta: "Translation of school and education documents: diplomas, transcripts and degrees. German, English, Tamil, also certified. Upload now.",
      h1: "School & Education Documents Translation",
      intro: "Foreign diplomas, transcripts and degrees: we translate your school documents precisely and to recognised standards — a core request for authorities and employers."
      ,
      points: [
        ["Diplomas & transcripts", "Accurate translation for recognition & applications."],
        ["Officially recognised", "Certified translation on request."],
        ["Usable worldwide", "For Swiss and international bodies."]
      ],
      faq: [
        ["Do you translate diplomas certified?", "Yes, certified translations for recognition offices."],
        ["What does a transcript translation cost?", "From CHF 125 per document; quote beforehand."],
        ["How long does it take?", "Usually a few business days."]
      ]
    },
    it: {
      slug: "traduzione-documenti-scolastici",
      title: "Traduzione documenti scolastici, diplomi & certificati – TED·ING",
      meta: "Traduzione di documenti scolastici: diplomi, certificati e titoli. Tedesco, inglese, tamil, anche giurata.",
      h1: "Traduzione di documenti scolastici e di istruzione",
      intro: "Diplomi, certificati e titoli esteri: traduciamo i suoi documenti scolastici in modo riconosciuto e preciso.",
      points: [
        ["Diplomi e certificati", "Traduzione accurata per riconoscimento e candidature."],
        ["Riconoscimento ufficiale", "Traduzione giurata su richiesta."],
        ["Utilizzabile ovunque", "Per enti svizzeri e internazionali."]
      ],
      faq: [
        ["Traducete diplomi giurati?", "Sì, per gli uffici di riconoscimento."],
        ["Quanto costa un certificato?", "Da CHF 125 per documento; offerta prima."],
        ["Quanto tempo serve?", "Di solito pochi giorni lavorativi."]
      ]
    }
  },
  {
    id: "doc-work",
    kind: "doc",
    service: "work",
    de: {
      slug: "uebersetzung-arbeitsdokument",
      title: "Übersetzung Arbeitsvertrag, Zeugnis & Referenzen – DE–EN–Tamil",
      meta: "Übersetzung von Arbeitsdokumenten: Verträge, Zeugnisse, Referenzen und Kündigungen. Deutsch, Englisch, Tamil, auch beglaubigt. Jetzt hochladen.",
      h1: "Übersetzung von Arbeitsdokumenten",
      intro: "Arbeitsverträge, Arbeitszeugnisse, Referenzen und Kündigungen korrekt übersetzt — für Bewerbungen, Arbeitgeber und Behörden in der Schweiz.",
      points: [
        ["Verträge & Zeugnisse", "Präzise Übersetzung für neue Chancen."],
        ["Für Arbeitgeber & Behörden", "Anerkannt und behördenkonform."],
        ["Rapid & diskret", "Pünktliche Lieferung, vertrauliche Behandlung."]
      ],
      faq: [
        ["Übersetzt ihr Arbeitszeugnisse?", "Ja, für Bewerbungen und Referenzen."],
        ["Was kostet die Übersetzung?", "Ab CHF 125 pro Dokument; Offerte vorab."],
        ["Werden Kündigungen übersetzt?", "Ja, auch Arbeitsverträge und Kündigungen."]
      ]
    },
    fr: {
      slug: "traduction-document-travail",
      title: "Traduction contrat, certificat de travail & références – DE–FR",
      meta: "Traduction de documents de travail : contrats, certificats, références et démissions. Allemand, français, anglais, tamoul.",
      h1: "Traduction de documents de travail",
      intro: "Contrats, certificats de travail, références et démissions traduits correctement — pour candidatures, employeurs et autorités en Suisse.",
      points: [
        ["Contrats & certificats", "Traduction précise pour de nouvelles opportunités."],
        ["Employeurs & autorités", "Reconnu et conforme."],
        ["Rapide et discret", "Livraison ponctuelle, traitement confidentiel."]
      ],
      faq: [
        ["Traduisez-vous les certificats de travail ?", "Oui, pour candidatures et références."],
        ["Combien coûte la traduction ?", "Dès CHF 125 par document ; offre avant."],
        ["Les démissions sont-elles traduites ?", "Oui, ainsi que les contrats et démissions."]
      ]
    },
    en: {
      slug: "translation-employment-document",
      title: "Employment Contract, Letter & Reference Translation – DE·EN",
      meta: "Translation of employment documents: contracts, references, references and notice letters. German, English, Tamil, also certified.",
      h1: "Employment Documents Translation",
      intro: "Employment contracts, work references and notice letters translated correctly — for applications, employers and authorities in Switzerland."
      ,
      points: [
        ["Contracts & references", "Accurate translation for new opportunities."],
        ["Employers & authorities", "Recognised and compliant."],
        ["Fast & discreet", "On-time delivery, confidential handling."]
      ],
      faq: [
        ["Do you translate work references?", "Yes, for applications and references."],
        ["How much does translation cost?", "From CHF 125 per document; quote beforehand."],
        ["Are notice letters translated?", "Yes, including contracts and resignations."]
      ]
    },
    it: {
      slug: "traduzione-documenti-lavoro",
      title: "Traduzione contratto di lavoro, certificato e referenze – TED·ING",
      meta: "Traduzione di documenti di lavoro: contratti, certificati, referenze e dimissioni. Tedesco, inglese, tamil, anche giurata.",
      h1: "Traduzione di documenti di lavoro",
      intro: "Contratti di lavoro, certificati e lettere di dimissione tradotti correttamente — per candidature, datori di lavoro e autorità in Svizzera.",
      points: [
        ["Contratti e certificati", "Traduzione accurata per nuove opportunità."],
        ["Datori e autorità", "Riconosciuta e conforme."],
        ["Veloce e riservata", "Consegna puntuale, trattamento confidenziale."]
      ],
      faq: [
        ["Traducete certificati di lavoro?", "Sì, per candidature e referenze."],
        ["Quanto costa la traduzione?", "Da CHF 125 per documento; offerta prima."],
        ["Traducete le dimissioni?", "Sì, anche contratti e lettere di dimissione."]
      ]
    }
  },
  {
    id: "doc-other",
    kind: "doc",
    service: "other",
    de: {
      slug: "dokument-uebersetzen",
      title: "Dokument übersetzen – Jedes Dokument online übersetzen (DE–EN–Tamil)",
      meta: "Ihr Dokument professionell übersetzen lassen: Deutsch, Englisch, Tamil, auch beglaubigt. Schnell, sicher & zum Festpreis. Jetzt hochladen.",
      h1: "Ihr Dokument einfach online übersetzen lassen",
      intro: "Nicht sicher, zu welcher Kategorie Ihr Dokument gehört? Senden Sie es uns — wir prüfen es und liefern eine professionelle Übersetzung in Deutsch, Englisch oder Tamil, anerkannt wo nötig.",
      points: [
        ["Alle Dokumente", "Verträge, Briefe, Urkunden, Ausweise und mehr."],
        ["Gratis Angebot", "Sie erhalten vorab eine kostenlose Offerte per E-Mail."],
        ["Bis zu 3 Dateien", "Mehrere Dateien in einem Auftrag übersetzen."]
      ],
      faq: [
        ["Was kostet die Übersetzung?", "Ab CHF 125 pro Dokument; Offerte vorab kostenlos."],
        ["Ist das beglaubigt möglich?", "Ja, auf Wunsch für Behörden."],
        ["Wie sende ich das Dokument?", "Upload als PDF oder Bild — die fertige Übersetzung kommt per E-Mail."]
      ]
    },
    fr: {
      slug: "traduire-document",
      title: "Traduire un document en ligne – Chaque document (DE–FR–EN–Tamil)",
      meta: "Faites traduire votre document professionnellement : allemand, français, anglais, tamoul, aussi légalisé. Rapide, sûr et à prix fixe.",
      h1: "Faites traduire votre document facilement en ligne",
      intro: "Vous ne savez pas à quelle catégorie votre document appartient ? Envoyez-le — nous vérifions et fournissons une traduction professionnelle en allemand, français, anglais ou tamoul.",
      points: [
        ["Tous documents", "Contrats, lettres, actes, pièces d'identité et plus."],
        ["Offre gratuite", "Une offre gratuite vous parvient par e-mail avant."],
        ["Jusqu'à 3 fichiers", "Plusieurs fichiers en une commande."]
      ],
      faq: [
        ["Combien coûte la traduction ?", "Dès CHF 125 par document ; offre avant gratuite."],
        ["Légalisé possible ?", "Oui, sur demande pour les autorités."],
        ["Comment envoyer le document ?", "Téléversement en PDF ou image — traduction par e-mail."]
      ]
    },
    en: {
      slug: "translate-document",
      title: "Translate a Document Online – Any Document (DE·EN·Tamil)",
      meta: "Get your document professionally translated: German, English, Tamil, also certified. Fast, secure & fixed-price. Upload now."
      ,
      h1: "Translate Your Document Easily Online",
      intro: "Not sure which category your document belongs to? Send it to us — we check it and deliver a professional translation in German, English or Tamil, recognised where needed.",
      points: [
        ["All documents", "Contracts, letters, certificates, IDs and more."],
        ["Free quote", "You receive a free quote by email beforehand."],
        ["Up to 3 files", "Translate several files in one order."]
      ],
      faq: [
        ["How much does translation cost?", "From CHF 125 per document; free quote beforehand."],
        ["Can it be certified?", "Yes, on request for authorities."],
        ["How do I send the document?", "Upload as PDF or image — the finished translation arrives by email."]
      ]
    },
    it: {
      slug: "traduci-documento",
      title: "Traduci un documento online – Qualsiasi documento (TED·ING·Tamil)",
      meta: "Fai tradurre il tuo documento professionalmente: tedesco, inglese, tamil, anche giurata. Veloce, sicura e a prezzo fisso.",
      h1: "Traduci facilmente il tuo documento online",
      intro: "Non sai a quale categoria appartiene il tuo documento? Invialo — lo verifichiamo e forniamo una traduzione professionale in tedesco, inglese o tamil.",
      points: [
        ["Tutti i documenti", "Contratti, lettere, attestati, documenti d'identità e altro."],
        ["Offerta gratuita", "Ricevi un preventivo gratuito via e-mail prima."],
        ["Fino a 3 file", "Traduci più file in un unico ordine."]
      ],
      faq: [
        ["Quanto costa la traduzione?", "Da CHF 125 per documento; offerta gratuita prima."],
        ["È possibile la versione giurata?", "Sì, su richiesta per le autorità."],
        ["Come invio il documento?", "Caricando in PDF o immagine — la traduzione arriva via e-mail."]
      ]
    }
  },

  // ------------------------------------------------------------------ Modes
  {
    id: "mode-video",
    kind: "mode",
    service: "video",
    de: {
      slug: "video-dolmetschen",
      title: "Video-Dolmetschen online – Dolmetscher per Videoanruf (DE–EN–Tamil)",
      meta: "Video-Dolmetschen: Dolmetscher per Videoanruf, ohne Anfahrt, vom Handy. Deutsch, Englisch, Tamil. Sicherer Link per E-Mail. Jetzt buchen.",
      h1: "Video-Dolmetschen — Dolmetscher online ohne Anreise",
      intro: "Brauchen Sie schnell einen Dolmetscher, aber keine Anreise? Per Videoanruf sind wir live dabei — für Arzttermine, Behörden, Firmen oder private Gespräche. Einfach, sicher und flexibel.",
      points: [
        ["Keine Anfahrt", "Video-Dolmetschen funktioniert von überall in der Schweiz."],
        ["Sicherer Link", "Sie erhalten einen geschützten Einwahllink per E-Mail."],
        ["Sofort einsatzbereit", "Auch kurzfristig buchbar, inklusive aller Sprachen."]
      ],
      faq: [
        ["Wie funktioniert Video-Dolmetschen?", "Sie buchen einen Termin, erhalten einen geschützten Link und der Dolmetscher ist zum Termin live dabei."],
        ["Was brauche ich dafür?", "Nur ein Handy oder Computer mit Kamera — keine Installation."],
        ["Was kostet Video-Dolmetschen?", "Der normale Stundentarif gilt; Video ist ohne Anfahrtspauschale."]
      ]
    },
    fr: {
      slug: "interpretation-video",
      title: "Interprétation en visio – Interprète par appel vidéo (FR–EN–Tamil)",
      meta: "Interprétation en visio : interprète par appel vidéo, sans déplacement, depuis son téléphone. Allemand, français, anglais, tamoul.",
      h1: "Interprétation en visio — des interprètes en ligne sans déplacement",
      intro: "Besoin d'un interprète rapidement, sans déplacement ? Par appel vidéo, nous sommes là — pour médecins, autorités, entreprises ou conversations privées.",
      points: [
        ["Sans déplacement", "L'interprétation en visio fonctionne partout en Suisse."],
        ["Lien sécurisé", "Vous recevez un lien protégé par e-mail."],
        ["Disponible vite", "Réservable à court terme, toutes langues."]
      ],
      faq: [
        ["Comment fonctionne l'interprétation en visio ?", "Vous réservez, recevez un lien sécurisé et l'interprète est là en direct."],
        ["De quoi ai-je besoin ?", "Un téléphone ou ordinateur avec caméra — aucune installation."],
        ["Combien ça coûte ?", "Le tarif horaire normal s'applique ; la visio est sans frais de déplacement."]
      ]
    },
    en: {
      slug: "video-interpreting",
      title: "Video Interpreting Online – Interpreter by Video Call (DE·EN·Tamil)",
      meta: "Video interpreting: interpreters by video call, no travel, from your phone. German, English, Tamil. Secure link by email. Book now.",
      h1: "Video Interpreting — Online Interpreters Without Travel",
      intro: "Need an interpreter fast, without travelling? By video call we join live — for doctor appointments, authorities, companies or private talks. Simple, secure and flexible.",
      points: [
        ["No travel", "Video interpreting works from anywhere in Switzerland."],
        ["Secure link", "You receive a protected link by email."],
        ["Ready quickly", "Bookable at short notice, all languages."]
      ],
      faq: [
        ["How does video interpreting work?", "You book, receive a secure link, and the interpreter joins live."],
        ["What do I need?", "Just a phone or computer with camera — no installation."],
        ["What does it cost?", "The normal hourly rate applies; video has no travel fee."]
      ]
    },
    it: {
      slug: "interpretariato-video",
      title: "Interpretariato in video – Interprete da videochiamata (TED·ING·Tamil)",
      meta: "Interpretariato in video: interprete da videochiamata, senza spostamenti, dal telefono. Tedesco, inglese, tamil. Link sicuro via e-mail.",
      h1: "Interpretariato in video — interprete online senza spostamenti",
      intro: "Serve un interprete subito, senza spostarsi? Con la videochiamata siamo presenti — per medici, autorità, aziende o colloqui privati. Semplice, sicuro e flessibile.",
      points: [
        ["Nessuno spostamento", "L'interpretariato in video funziona ovunque in Svizzera."],
        ["Link sicuro", "Riceve un link protetto via e-mail."],
        ["Pronto in fretta", "Prenotabile a breve termine, tutte le lingue."]
      ],
      faq: [
        ["Come funziona l'interpretariato in video?", "Prenota, riceve un link sicuro e l'interprete partecipa in diretta."],
        ["Cosa mi serve?", "Solo un telefono o computer con telecamera — nessuna installazione."],
        ["Quanto costa?", "Si applica la tariffa oraria normale; il video è senza spese di trasferta."]
      ]
    }
  },
  {
    id: "mode-onsite",
    kind: "mode",
    service: "onsite",
    de: {
      slug: "dolmetscher-vor-ort",
      title: "Dolmetscher vor Ort in Zürich – Live-Dolmetschen persönlich",
      meta: "Dolmetscher vor Ort in Zürich & der Schweiz: persönlich bei Arzt, Behörde, Bank oder Versicherung. Deutsch, Englisch, Tamil. Jetzt buchen.",
      h1: "Dolmetscher vor Ort — persönlich in Zürich und der Schweiz",
      intro: "Manche Gespräche brauchen Präsenz. Wir kommen zu Ihnen in Zürich oder in der ganzen Schweiz — zum Arzt, zur Behörde, an den Arbeitsplatz oder zu Ihrem Termin.",
      points: [
        ["Persönliche Begleitung", "Ein erfahrener Dolmetscher ist direkt bei Ihnen."],
        ["Ganze Schweiz", "Vor-Ort-Einsätze in Zürich und allen Kantonen."],
        ["Kleine Anreisegebühr", "Transparente CHF 25 Pauschale ausserhalb Zürichs."]
      ],
      faq: [
        ["Wo gibt es Vor-Ort-Dolmetscher?", "In Zürich und der ganzen Schweiz; Anreisezeiten planen wir mit."],
        ["Was kostet ein Vor-Ort-Einsatz?", "Stundentarif plus Anreisegebühr; Offerte vorab per E-Mail."],
        ["Kann ich den Ort frei wählen?", "Ja, Arztpraxis, Behörde, Firma oder ein anderer Ort Ihrer Wahl."]
      ]
    },
    fr: {
      slug: "interprete-sur-place",
      title: "Interprète sur place à Zurich – Interprétation en présentiel",
      meta: "Interprète sur place à Zurich et en Suisse : médecin, autorités, banque ou assurance. Allemand, français, anglais, tamoul. Réservez.",
      h1: "Interprètes sur place — en présentiel à Zurich et en Suisse",
      intro: "Certaines conversations exigent de la présence. Nous nous déplaçons chez vous à Zurich ou toute la Suisse — médecin, autorités, entreprise ou autre rendez-vous.",
      points: [
        ["Accompagnement personnel", "Un interprète expérimenté est directement auprès de vous."],
        ["Toute la Suisse", "Interventions dans tous les cantons."],
        ["Petit frais de déplacement", "Forfait transparent de CHF 25 hors Zurich."]
      ],
      faq: [
        ["Où interviennent les interprètes ?", "À Zurich et toute la Suisse ; nous planifions le trajet."],
        ["Combien coûte une intervention ?", "Tarif horaire plus frais de déplacement ; offre avant par e-mail."],
        ["Le lieu est-il libre ?", "Oui : cabinet médical, autorité, entreprise ou autre lieu de votre choix."]
      ]
    },
    en: {
      slug: "on-site-interpreter",
      title: "On-Site Interpreter in Zurich – In-Person Interpreting",
      meta: "On-site interpreter in Zurich & Switzerland: in person at the doctor, authorities, bank or insurance. German, English, Tamil. Book now.",
      h1: "On-Site Interpreters — In Person in Zurich and Switzerland",
      intro: "Some conversations need presence. We come to you in Zurich or across Switzerland — to the doctor, the authorities, the workplace or your appointment.",
      points: [
        ["Personal accompaniment", "An experienced interpreter is right beside you."],
        ["All of Switzerland", "On-site assignments in Zurich and all cantons."],
        ["Small travel fee", "Transparent CHF 25 flat fee outside Zurich."]
      ],
      faq: [
        ["Where do on-site interpreters work?", "In Zurich and across Switzerland; we plan travel time."],
        ["What does an on-site assignment cost?", "Hourly rate plus travel fee; quote by email beforehand."],
        ["Can I choose the location?", "Yes: clinic, authority, company or any place you choose."]
      ]
    },
    it: {
      slug: "interprete-dal-vivo",
      title: "Interprete dal vivo a Zurigo – Interpretariato in presenza",
      meta: "Interprete dal vivo a Zurigo e in Svizzera: dal vivo da medico, autorità, banca o assicurazione. Tedesco, inglese, tamil. Prenota ora.",
      h1: "Interprete dal vivo — in presenza a Zurigo e in Svizzera",
      intro: "Alcuni colloqui richiedono presenza. Veniamo da lei a Zurigo o in tutta la Svizzera — dal medico, alle autorità, al posto di lavoro o al suo appuntamento.",
      points: [
        ["Accompagnamento personale", "Un interprete esperto è direttamente accanto a lei."],
        ["Tutta la Svizzera", "Servizi dal vivo a Zurigo e in tutti i cantoni."],
        ["Piccola spesa di trasferta", "Tariffa fissa trasparente di CHF 25 fuori Zurigo."]
      ],
      faq: [
        ["Dove operano gli interpreti dal vivo?", "A Zurigo e in tutta la Svizzera; pianifichiamo il viaggio."],
        ["Quanto costa un servizio dal vivo?", "Tariffa oraria più spese di trasferta; offerta via e-mail prima."],
        ["Posso scegliere il luogo?", "Sì: studio medico, autorità, azienda o qualsiasi altro luogo."]
      ]
    }
  },

  // --------------------------------------------------------------- Hubs
  {
    id: "hub-best",
    kind: "hub",
    hub: { de: "dolmetscher-zuerich", fr: "meilleur-interprete-zurich", en: "best-translator-zurich", it: "miglior-interprete-zurigo" },
    de: {
      slug: "dolmetscher-zuerich",
      title: "Dolmetscher Zürich – Beste Dolmetscher & Übersetzer in Zürich",
      meta: "Dolmetscher in Zürich finden: professionelle Dolmetscher & Übersetzer für Arzt, Behörden, Unternehmen und mehr. Deutsch, Englisch, Tamil. Jetzt buchen.",
      h1: "Dolmetscher & Übersetzer in Zürich — die beste Wahl",
      intro: "Sie suchen einen zuverlässigen Dolmetscher in Zürich? Für Arzttermine, Behörden, Banken oder Geschäftsgespräche — wir sind schnell, professionell und schweizweit im Einsatz.",
      points: [
        ["Lokal in Zürich", "Schnell vor Ort oder per Video verfügbar."],
        ["Alle wichtigen Sprachen", "Deutsch, Englisch, Tamil und weitere Sprachkombinationen."],
        ["Bewertet & empfohlen", "Klare Preise, pünktlich, vertraulich."]
      ],
      faq: [
        ["Wie finde ich den besten Dolmetscher in Zürich?", "Achten Sie auf Erfahrung, Sprachen, Zertifizierung und klare Preise — genau dafür stehen wir ein."],
        ["Was kostet ein Dolmetscher in Zürich?", "Je nach Einsatz ab CHF 35 pro halbe Stunde; Offerte vorab."],
        ["Wie schnell ist ein Termin möglich?", "Oft innerhalb weniger Tage, Eiltermine auf Anfrage."]
      ]
    },
    fr: {
      slug: "meilleur-interprete-zurich",
      title: "Meilleur interprète à Zurich – Interprètes & traducteurs à Zurich",
      meta: "Trouvez un interprète à Zurich : interprètes & traducteurs professionnels pour médecin, autorités, entreprises et plus. DE, FR, EN, Tamil. Réservez.",
      h1: "Interprètes & traducteurs à Zurich — le meilleur choix",
      intro: "Vous cherchez un interprète fiable à Zurich ? Pour médecins, autorités, banques ou affaires — nous sommes rapides, professionnels et actifs dans toute la Suisse.",
      points: [
        ["Local à Zurich", "Disponible rapidement sur place ou en visio."],
        ["Langues clés", "Allemand, français, anglais, tamoul et plus."],
        ["Noté et recommandé", "Prix clairs, ponctualité, confidentialité."]
      ],
      faq: [
        ["Comment trouver le meilleur interprète à Zurich ?", "Regardez l'expérience, les langues, la certification et des prix clairs — c'est notre engagement."],
        ["Combien coûte un interprète à Zurich ?", "Selon la mission dès CHF 35 la demi-heure ; offre avant."],
        ["Quel délai pour un rendez-vous ?", "Souvent quelques jours ; urgences sur demande."]
      ]
    },
    en: {
      slug: "best-translator-zurich",
      title: "Best Translator & Interpreter in Zurich – Top-Rated Services",
      meta: "Find the best translator & interpreter in Zurich for medical, official, business and legal needs. German, English, Tamil. Book today.",
      h1: "Best Translator & Interpreter in Zurich",
      intro: "Looking for a reliable official translator or interpreter in Zurich? For doctor appointments, authorities, banks or business — we are fast, professional and nationwide.",
      points: [
        ["Local in Zurich", "Quickly available on site or by video."],
        ["Key languages", "German, English, Tamil and more."],
        ["Trusted & recommended", "Clear prices, punctual, confidential."]
      ],
      faq: [
        ["How do I find the best interpreter in Zurich?", "Look for experience, languages, certification and clear pricing — that is our promise."],
        ["What does an interpreter in Zurich cost?", "Depending on the job from CHF 35 per half hour; quote first."],
        ["How fast can I get an appointment?", "Often within a few days; urgent slots on request."]
      ]
    },
    it: {
      slug: "miglior-interprete-zurigo",
      title: "Miglior interprete a Zurigo – Interprete e traduttore professionale",
      meta: "Trova il miglior interprete a Zurigo per esigenze mediche, ufficiali, aziendali e legali. Tedesco, inglese, tamil. Prenota oggi.",
      h1: "Miglior interprete e traduttore a Zurigo",
      intro: "Cerca un interprete o traduttore ufficiale affidabile a Zurigo? Per visite mediche, autorità, banche o affari — siamo veloci, professionali e operativi in tutta la Svizzera.",
      points: [
        ["Locale a Zurigo", "Disponibile rapidamente sul posto o in video."],
        ["Lingue chiave", "Tedesco, inglese, tamil e altre."],
        ["Fiducia e raccomandazioni", "Prezzi chiari, puntualità, riservatezza."]
      ],
      faq: [
        ["Come trovare il miglior interprete a Zurigo?", "Guardi esperienza, lingue, certificazione e prezzi chiari — è la nostra promessa."],
        ["Quanto costa un interprete a Zurigo?", "A seconda dell'incarico da CHF 35 a mezz'ora; prima l'offerta."],
        ["In quanto tempo ho un appuntamento?", "Spesso entro pochi giorni; slot urgenti su richiesta."]
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------
function slugFor(topicId, lang) {
  const t = TOPICS.find(x => x.id === topicId);
  if (!t) return null;
  if (t.kind === "hub" && t.hub && t.hub[lang]) return t.hub[lang];
  return t[lang].slug;
}

function urlFor(topicId, lang) {
  const t = TOPICS.find(x => x.id === topicId);
  if (!t) return null;
  const slug = slugFor(topicId, lang);
  if (!slug) return null;
  if (lang === "de") return "/" + slug + ".html";
  return "/" + lang + "/" + slug + ".html";
}

function buildIndex() {
  const bySlug = {};
  TOPICS.forEach(function (t) {
    LANGS.forEach(function (lang) {
      const slug = slugFor(t.id, lang);
      if (!slug) return;
      bySlug[slug] = { topic: t, lang: lang };
    });
  });
  return bySlug;
}

// Map of CTA targets (used by the renderer) — labels per language
const CTA_LABELS = {
  de: { book: "Jetzt Dolmetscher buchen", doc: "Jetzt übersetzen lassen", video: "Video-Dolmetschen buchen", hub: "Jetzt Dolmetscher buchen" },
  fr: { book: "Réserver un interprète", doc: "Faire traduire maintenant", video: "Réserver en visio", hub: "Réserver un interprète" },
  en: { book: "Book an interpreter", doc: "Get a translation now", video: "Book video interpreting", hub: "Book an interpreter" },
  it: { book: "Prenota un interprete", doc: "Fai tradurre ora", video: "Prenota in video", hub: "Prenota un interprete" }
};

function ctaFor(topic, lang) {
  const L = CTA_LABELS[lang] || CTA_LABELS.de;
  if (topic.kind === "doc") return { href: "/fillform.html?type=" + encodeURIComponent(topic.service), label: L.doc };
  if (topic.kind === "mode" && topic.service === "video") return { href: "/booking.html", label: L.video };
  if (topic.kind === "hub" || !topic.service) return { href: "/booking.html", label: L.hub };
  return { href: "/booking.html?service=" + encodeURIComponent(topic.service), label: L.book };
}

module.exports = { LANGS, SSAXCY, TOPICS, slugFor, urlFor, buildIndex, ctaFor };