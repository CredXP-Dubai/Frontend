#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const specUrl =
  process.env.OPENAPI_URL ?? "https://backend-cumg.onrender.com/docs.json";
const specPath = path.join(ROOT, "openapi.json");
const outPath = path.join(ROOT, "src/types/openapi.generated.ts");

const spec = await fetch(specUrl).then((r) => {
  if (!r.ok) throw new Error(`Failed to fetch OpenAPI spec: ${r.status}`);
  return r.text();
});
fs.writeFileSync(specPath, spec);
execSync(`npx openapi-typescript "${specPath}" -o "${outPath}"`, {
  cwd: ROOT,
  stdio: "inherit",
});
console.log(`Generated ${outPath}`);
