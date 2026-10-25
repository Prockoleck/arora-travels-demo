/* Local end-to-end test of api/publish.mjs — runs the real handler with a
   mock res, using the gh CLI token. Creates public/content/site.json in
   the repo (validating the whole GitHub commit flow before deploy). */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import handler from "../api/publish.mjs";

const token = spawnSync("gh", ["auth", "token"], { encoding: "utf8" }).stdout.trim();
if (token.length < 20) throw new Error("no gh token");

process.env.GH_TOKEN = token;
process.env.PUBLISH_KEY = "arora-console-7f3c9a21e85b4d16";
delete process.env.GH_REPO;
delete process.env.GH_BRANCH;

const content = JSON.parse(readFileSync(new URL("./site.json", import.meta.url), "utf8"));

const req = {
  method: "POST",
  headers: { "x-publish-key": process.env.PUBLISH_KEY, "content-type": "application/json" },
  body: { content, images: [] },
};

let code = 0;
const res = {
  status(c) {
    code = c;
    return this;
  },
  json(obj) {
    console.log(`HTTP ${code}:`, JSON.stringify(obj));
    if (obj && obj.ok) writeFileSync(new URL("./last-publish.json", import.meta.url), JSON.stringify(obj, null, 2));
    process.exit(obj && obj.ok ? 0 : 1);
  },
  end() {
    process.exit(0);
  },
};

await handler(req, res);
console.log("handler returned without response");
process.exit(1);
