#!/usr/bin/env node
// Ssaaxcy Solutions — shared-hosting friendly launcher.
// node:sqlite needs Node >= 22.5.0; on Node 22.5x the module is still gated
// behind --experimental-sqlite, so if the probe fails we re-spawn with the flag.
"use strict";

const { spawnSync } = require("node:child_process");

const major = Number(process.versions.node.split(".")[0]);
const minor = Number(process.versions.node.split(".")[1]);

if (major < 22 || (major === 22 && minor < 5)) {
  console.error("");
  console.error("  This app needs Node.js 22.5 or newer (it uses the built-in node:sqlite).");
  console.error("  Your host is running Node " + process.versions.node + ".");
  console.error("  In your hosting panel, select a newer Node.js version (22.5+ or 24 LTS).");
  console.error("");
  process.exit(1);
}

let sqliteOk = true;
try {
  require("node:sqlite");
} catch (e) {
  sqliteOk = false;
}

if (sqliteOk) {
  require("./server.js");
  return;
}

// Node 22.5x-23.x without the flag — re-run with --experimental-sqlite.
const res = spawnSync(process.execPath, ["--experimental-sqlite", "server.js"], {
  stdio: "inherit"
});
if (res.error) throw res.error;
process.exit(res.status || 0);