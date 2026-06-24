#!/usr/bin/env node
/**
 * Scans public/cinematic/ and writes manifest.json from files on disk.
 * Supports .webp, .jpg, .jpeg, .png — no frame generation.
 * Run: npm run sync:manifest
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CINEMATIC_DIR = path.join(__dirname, "../public/cinematic");
const MANIFEST_PATH = path.join(CINEMATIC_DIR, "manifest.json");

const IMAGE_RE = /^frame_(\d+)\.(webp|jpe?g|png)$/i;

function scanFrames() {
  if (!fs.existsSync(CINEMATIC_DIR)) {
    console.error(`Directory not found: ${CINEMATIC_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(CINEMATIC_DIR)
    .filter((f) => IMAGE_RE.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(IMAGE_RE)[1], 10);
      const nb = parseInt(b.match(IMAGE_RE)[1], 10);
      return na - nb;
    });

  if (files.length === 0) {
    console.error("No frame_* image files found in public/cinematic/");
    process.exit(1);
  }

  const frames = files.map((f) => `/cinematic/${f}`);
  const first = files[0].match(IMAGE_RE);
  const ext = `.${first[2].toLowerCase().replace("jpeg", "jpg")}`;

  const manifest = {
    totalFrames: frames.length,
    frames,
    width: 1920,
    height: 1080,
    format: ext.replace(".", ""),
    prefix: "frame_",
    padding: 4,
    extension: ext === ".jpeg" ? ".jpg" : ext,
    generatedAt: new Date().toISOString(),
    source: "public/cinematic (disk scan)",
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  const mid = frames[Math.floor(frames.length / 2)];
  const last = frames[frames.length - 1];

  console.log("Manifest written:", MANIFEST_PATH);
  console.log("  totalFrames:", frames.length);
  console.log("  first:", frames[0]);
  console.log("  middle:", mid);
  console.log("  last:", last);
  console.log("  extension:", manifest.extension);
}

scanFrames();
