const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const fs = require("node:fs");

const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "ssaaxcy.db");

let db = null;

const SEED_SERVICES = [
  { id: "doctor", name: "Doctor appointment", icon: "🩺", price: 45, type: "Medical", desc: "Consultations, symptoms, referrals and prescriptions explained clearly." },
  { id: "hospital", name: "Hospital visit", icon: "🏥", price: 55, type: "Medical", desc: "Emergency room, ward rounds, procedures and discharge briefing." },
  { id: "police", name: "Police appointment", icon: "🚓", price: 55, type: "Official", desc: "Reports, statements, identity and legal matters." },
  { id: "immigration", name: "Immigration office", icon: "🛂", price: 40, type: "Official", desc: "Permits, residence, asylum and citizenship procedures." },
  { id: "gemeinde", name: "Gemeinde appointment", icon: "🏛️", price: 40, type: "Official", desc: "Registration, civil matters, family office and administrative steps." },
  { id: "school", name: "Kindergarten & school meeting", icon: "🎒", price: 40, type: "Family", desc: "Parent-teacher talks, schooling and childcare discussions." },
  { id: "bank", name: "Bank meeting", icon: "🏦", price: 35, type: "Finance", desc: "Accounts, mortgages, remittance and advisory sessions." },
  { id: "insurance", name: "Insurance meeting", icon: "📄", price: 50, type: "Finance", desc: "Health, accident, liability and claims discussions." },
  { id: "interview", name: "Job interview", icon: "💼", price: 45, type: "Work", desc: "Applications, interviews and apprenticeship meetings." },
  { id: "government", name: "Government office", icon: "🏢", price: 50, type: "Official", desc: "Tax, social services, AHV and cantonal authorities." },
  { id: "custom", name: "Another appointment", icon: "✨", price: 40, type: "Other", desc: "Any other important conversation — just tell us about it." }
];

const SEED_LANGUAGES = [
  { code: "DE", name: "German", native: "Deutsch" },
  { code: "EN", name: "English", native: "English" },
  { code: "TA", name: "Tamil", native: "தமிழ்" }
];

const SEED_DURATIONS = [
  { mins: 30, label: "30 min", note: "Short meeting", factor: 0.5 },
  { mins: 60, label: "60 min", note: "Standard", factor: 1 },
  { mins: 90, label: "90 min", note: "Clinical / official", factor: 1.4 },
  { mins: 120, label: "2 hours", note: "Long haul", factor: 1.8 }
];

const SEED_SETTINGS = [
  ["brand_name", "Ssaaxcy Solutions"],
  ["support_email", "hello@ssaaxcy.ch"],
  ["support_phone", "+41 44 000 00 00"],
  ["whatsapp", "+41 44 000 00 00"],
  ["instagram", "https://instagram.com/ssaaxcy"],
  ["facebook", "https://facebook.com/ssaaxcy"],
  ["linkedin", "https://linkedin.com/company/ssaaxcy"],
  ["hero_image_url", ""],
  ["flag_style", "drift"],
  ["travel_fee", "25"],
  ["currency", "CHF"],
  ["ref_prefix", "SSX"],
  ["admin_2fa", "0"]
];

const SEED_DOC_TYPES = [
  { id: "residence", icon: "id-card", name_de: "Aufenthaltsbewilligung & Anmeldung", name_en: "Residence permit & registration", name_ta: "குடியிருப்பு அனுமதி", sort: 1 },
  { id: "visa", icon: "file-text", name_de: "Visaantrag", name_en: "Visa application", name_ta: "விசா விண்ணப்பம்", sort: 2 },
  { id: "tax", icon: "calculator", name_de: "Steuererklärung", name_en: "Tax declaration (Steuererklärung)", name_ta: "வரி படிவம்", sort: 3 },
  { id: "ahv", icon: "gov", name_de: "AHV / Sozialhilfe", name_en: "AHV / social benefits", name_ta: "AHV / சமூக உதவி", sort: 4 },
  { id: "insurance", icon: "umbrella", name_de: "Versicherungsformular", name_en: "Insurance form", name_ta: "காப்பீட்டு படிவம்", sort: 5 },
  { id: "bank", icon: "banknote", name_de: "Bankformular", name_en: "Bank form", name_ta: "வங்கி படிவம்", sort: 6 },
  { id: "school", icon: "school", name_de: "Schulformular", name_en: "School form", name_ta: "பள்ளி படிவம்", sort: 7 },
  { id: "work", icon: "briefcase", name_de: "Arbeitsdokument", name_en: "Employment document", name_ta: "வேலை ஆவணம்", sort: 8 },
  { id: "other", icon: "sparkles", name_de: "Andere Dokumente", name_en: "Other documents", name_ta: "வேறு ஆவணங்கள்", sort: 9 }
];

function open() {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

function migrate() {
  const d = open();
  d.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, icon TEXT, price REAL NOT NULL,
      type TEXT, desc TEXT, active INTEGER DEFAULT 1, sort INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS languages (
      code TEXT PRIMARY KEY, name TEXT NOT NULL, native TEXT
    );
    CREATE TABLE IF NOT EXISTS durations (
      mins INTEGER PRIMARY KEY, label TEXT, note TEXT, factor REAL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT
    );
    CREATE TABLE IF NOT EXISTS interpreters (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT,
      languages TEXT, zones TEXT, rating REAL DEFAULT 0, assignments INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT, ref TEXT UNIQUE NOT NULL,
      language_code TEXT, language_name TEXT, service_id TEXT, service_name TEXT,
      date TEXT, time TEXT, duration INTEGER, mode TEXT, address TEXT,
      customer TEXT, email TEXT, phone TEXT, notes TEXT,
      base_price REAL DEFAULT 0, duration_price REAL DEFAULT 0, fee REAL DEFAULT 0, total REAL DEFAULT 0,
      method TEXT, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, ref TEXT, method TEXT, amount REAL,
      status TEXT DEFAULT 'paid', created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS concierge (
      id INTEGER PRIMARY KEY AUTOINCREMENT, ref TEXT UNIQUE NOT NULL,
      service TEXT, title TEXT, language_code TEXT, language_name TEXT, detail TEXT,
      customer TEXT, email TEXT, phone TEXT,
      files TEXT DEFAULT '', status TEXT DEFAULT 'new', created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS doc_types (
      id TEXT PRIMARY KEY, icon TEXT, name_en TEXT NOT NULL, name_de TEXT,
      name_ta TEXT, active INTEGER DEFAULT 1, sort INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS document_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref TEXT UNIQUE NOT NULL, doc_type TEXT, doc_type_name TEXT,
      from_lang TEXT, to_lang TEXT, mode TEXT DEFAULT 'translate',
      fields TEXT DEFAULT '{}', attachment TEXT DEFAULT '', notes TEXT,
      customer TEXT, email TEXT, phone TEXT, ip TEXT,
      status TEXT DEFAULT 'received', created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS security_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, ip TEXT, ua TEXT,
      detail TEXT, created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT, ok INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, created_at TEXT,
      expires_at TEXT, last_seen TEXT
    );
    CREATE TABLE IF NOT EXISTS ip_blocks (
      ip TEXT PRIMARY KEY, reason TEXT, until TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

const SEED_INTERPRETERS = [
  { name: "Amara N.", phone: "+41 79 111 22 33", languages: "TA,DE,EN", zones: "Zurich, Winterthur", rating: 4.9, assignments: 1120, active: 1 },
  { name: "Elena S.", phone: "+41 79 222 33 44", languages: "DE,EN", zones: "Bern, Basel", rating: 4.8, assignments: 830, active: 1 },
  { name: "Priya R.", phone: "+41 79 333 44 55", languages: "TA,EN", zones: "Lugano, Bellinzona", rating: 5.0, assignments: 640, active: 1 },
  { name: "Daniel W.", phone: "+41 76 444 55 66", languages: "DE,EN", zones: "Geneva, Lausanne", rating: 4.7, assignments: 510, active: 1 },
  { name: "Tharangini M.", phone: "+41 79 555 66 77", languages: "TA,DE", zones: "Zurich, Chur", rating: 4.9, assignments: 420, active: 1 },
  { name: "Sara M.", phone: "+41 78 666 77 88", languages: "EN,DE", zones: "Geneva, Bern", rating: 4.8, assignments: 385, active: 1 },
  { name: "Julia K.", phone: "+41 79 777 88 99", languages: "DE,EN,TA", zones: "Basel, Zurich", rating: 4.6, assignments: 300, active: 1 },
  { name: "Kavya H.", phone: "+41 76 888 99 00", languages: "TA,EN", zones: "Zurich, Winterthur", rating: 4.9, assignments: 250, active: 0 }
];

function seed(force) {
  const d = open();
  const count = d.prepare("SELECT COUNT(*) AS c FROM services").get().c;
  if (count > 0 && !force) return;

  const insSvc = d.prepare("INSERT OR REPLACE INTO services (id,name,icon,price,type,desc,active,sort) VALUES (?,?,?,?,?,?,1,?)");
  SEED_SERVICES.forEach((s, i) => insSvc.run(s.id, s.name, s.icon, s.price, s.type, s.desc, i));

  const insLang = d.prepare("INSERT OR REPLACE INTO languages (code,name,native) VALUES (?,?,?)");
  SEED_LANGUAGES.forEach((l) => insLang.run(l.code, l.name, l.native));
  // Keep only the supported languages (German, English, Tamil)
  const keep = SEED_LANGUAGES.map((l) => l.code);
  const remove = keep.map(() => "?").join(",");
  d.prepare(`DELETE FROM languages WHERE code NOT IN (${remove})`).run(...keep);

  const insDur = d.prepare("INSERT OR REPLACE INTO durations (mins,label,note,factor) VALUES (?,?,?,?)");
  SEED_DURATIONS.forEach((x) => insDur.run(x.mins, x.label, x.note, x.factor));

  const insSet = d.prepare("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)");
  SEED_SETTINGS.forEach(([k, v]) => insSet.run(k, v));

  const insI = d.prepare("INSERT OR REPLACE INTO interpreters (name,phone,languages,zones,rating,assignments,active) VALUES (?,?,?,?,?,?,?)");
  SEED_INTERPRETERS.forEach((i) => insI.run(i.name, i.phone, i.languages, i.zones, i.rating, i.assignments, i.active));

  const insDoc = d.prepare("INSERT OR REPLACE INTO doc_types (id,icon,name_en,name_de,name_ta,active,sort) VALUES (?,?,?,?,?,1,?)");
  SEED_DOC_TYPES.forEach((x) => insDoc.run(x.id, x.icon, x.name_en, x.name_de, x.name_ta, x.sort));

  d.prepare("DELETE FROM doc_types WHERE id NOT IN (" + SEED_DOC_TYPES.map(() => "?").join(",") + ")").run(...SEED_DOC_TYPES.map((x) => x.id));
}

function initDb(force) {
  migrate();
  seed(force);
  return open();
}

function q(sql, params = []) {
  const d = open();
  return d.prepare(sql).all(...params);
}

function one(sql, params = []) {
  const d = open();
  return d.prepare(sql).get(...params);
}

function run(sql, params = []) {
  const d = open();
  const r = d.prepare(sql).run(...params);
  return r;
}

module.exports = { initDb, open, q, one, run, DB_PATH, SEED_SERVICES, SEED_LANGUAGES, SEED_DURATIONS, SEED_DOC_TYPES };