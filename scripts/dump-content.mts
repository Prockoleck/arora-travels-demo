/* Bundle-and-run helper: writes defaultContent() as pretty site.json. */
import { writeFileSync } from "node:fs";
import { defaultContent } from "../src/lib/content";

writeFileSync(
  new URL("./site.json", import.meta.url),
  JSON.stringify(defaultContent(), null, 2) + "\n",
  "utf8",
);
console.log("wrote scripts/site.json");
