const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");

const dbPath = path.join(os.tmpdir(), "ssaaxcy-test-" + process.pid + "-" + Date.now() + ".db");
process.env.NODE_ENV = "test";
process.env.ADMIN_PASSWORD = "TestOnly-Admin-Password-12345";
process.env.DB_PATH = dbPath;
process.env.BASE_URL = "http://127.0.0.1";

const app = require("../server");
const { run } = require("../db");

let server;
let base = "";

test.before(async () => {
  server = await new Promise((resolve, reject) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
    s.once("error", reject);
  });
  base = "http://127.0.0.1:" + server.address().port;
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  try { fs.rmSync(dbPath, { force: true }); } catch (e) {}
  try { fs.rmSync(dbPath + "-wal", { force: true }); } catch (e) {}
  try { fs.rmSync(dbPath + "-shm", { force: true }); } catch (e) {}
});

async function json(pathname, options) {
  const res = await fetch(base + pathname, options);
  let body = {};
  try { body = await res.json(); } catch (e) {}
  return { res, body };
}

function futureWorkday() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 4);
  while (d.getUTCDay() === 0) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

test("public catalog never exposes SMTP/admin secrets", async () => {
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["smtp_pass", "unit-test-secret"]);
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["smtp_user", "private-user@example.invalid"]);
  run("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)", ["admin_2fa_secret", "TOPSECRET"]);

  const { res, body } = await json("/api/catalog");
  assert.equal(res.status, 200);
  const serialized = JSON.stringify(body);
  assert.equal(serialized.includes("unit-test-secret"), false);
  assert.equal(serialized.includes("private-user@example.invalid"), false);
  assert.equal(serialized.includes("TOPSECRET"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(body.settings || {}, "smtp_pass"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(body.settings || {}, "smtp_user"), false);
});

test("booking lookup and private access require a customer token", async () => {
  const email = "customer@example.com";
  const create = await json("/api/bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      language_code: "DE",
      service_id: "doctor",
      date: futureWorkday(),
      time: "10:00",
      duration: 60,
      mode: "video",
      customer: "Test Customer",
      email,
      phone: "+41000000000",
      notes: "",
      method: "twint",
      files: "",
      consent: true
    })
  });

  assert.equal(create.res.status, 200);
  assert.equal(create.body.ok, true);
  assert.ok(create.body.ref);
  assert.ok(create.body.access_token);
  const ref = create.body.ref;
  const token = create.body.access_token;

  const noToken = await json("/api/bookings/" + encodeURIComponent(ref));
  assert.equal(noToken.res.status, 401);

  const wrong = await json("/api/bookings/" + encodeURIComponent(ref) + "?token=wrong");
  assert.equal(wrong.res.status, 401);

  const good = await json("/api/bookings/" + encodeURIComponent(ref) + "?token=" + encodeURIComponent(token));
  assert.equal(good.res.status, 200);
  assert.equal(good.body.booking.ref, ref);

  const recover = await json("/api/access", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ref, email })
  });
  assert.equal(recover.res.status, 200);
  assert.ok(recover.body.token);
  assert.notEqual(recover.body.token, token);

  const oldToken = await json("/api/bookings/" + encodeURIComponent(ref) + "?token=" + encodeURIComponent(token));
  assert.equal(oldToken.res.status, 401);

  const newToken = await json("/api/bookings/" + encodeURIComponent(ref) + "?token=" + encodeURIComponent(recover.body.token));
  assert.equal(newToken.res.status, 200);
});

test("reference recovery rejects the wrong email", async () => {
  const bad = await json("/api/access", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ref: "SSX-NOTREAL", email: "wrong@example.com" })
  });
  assert.equal(bad.res.status, 404);
});
