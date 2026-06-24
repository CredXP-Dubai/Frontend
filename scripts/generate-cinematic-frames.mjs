#!/usr/bin/env node
/**
 * Generates cinematic scroll frames by interpolating source keyframes.
 * Run: npm run generate:frames
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public/images");
const OUT = path.join(ROOT, "public/cinematic");

const TOTAL_FRAMES = 120;
const OUT_W = 1920;
const OUT_H = 1080;
const WEBP_QUALITY = 82;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function framePath(n) {
  return path.join(OUT, `frame_${String(n).padStart(4, "0")}.webp`);
}

async function loadNormalized(file) {
  return sharp(path.join(SRC, file))
    .resize(OUT_W, OUT_H, { fit: "cover", position: "centre" })
    .toBuffer();
}

/** Simulate dolly-in by cropping toward focal point */
async function dolly(source, progress, focusX = 0.5, focusY = 0.46) {
  const meta = await sharp(source).metadata();
  const w = meta.width;
  const h = meta.height;
  const scale = 1 + ease(progress) * 0.85;
  const cropW = Math.round(w / scale);
  const cropH = Math.round(h / scale);
  const left = clamp(Math.round(focusX * w - cropW / 2), 0, w - cropW);
  const top = clamp(Math.round(focusY * h - cropH / 2), 0, h - cropH);

  return sharp(source)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(OUT_W, OUT_H, { fit: "fill" })
    .toBuffer();
}

/** Dolly with upward shift for final tower reveal */
async function dollyTilt(source, progress, focusX = 0.5, focusY = 0.38) {
  const meta = await sharp(source).metadata();
  const w = meta.width;
  const h = meta.height;
  const scale = 1 + ease(progress) * 1.15;
  const cropW = Math.round(w / scale);
  const cropH = Math.round(h / scale);
  const yShift = progress * 0.06;
  const left = clamp(Math.round(focusX * w - cropW / 2), 0, w - cropW);
  const top = clamp(Math.round((focusY - yShift) * h - cropH / 2), 0, h - cropH);

  return sharp(source)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(OUT_W, OUT_H, { fit: "fill" })
    .toBuffer();
}

async function blend(bufA, bufB, t) {
  const a = await sharp(bufA).resize(OUT_W, OUT_H).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(bufB).resize(OUT_W, OUT_H).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data: dataA, info } = a;
  const { data: dataB } = b;
  const out = Buffer.alloc(dataA.length);
  const alpha = ease(t);

  for (let i = 0; i < dataA.length; i += 4) {
    out[i] = Math.round(dataA[i] * (1 - alpha) + dataB[i] * alpha);
    out[i + 1] = Math.round(dataA[i + 1] * (1 - alpha) + dataB[i + 1] * alpha);
    out[i + 2] = Math.round(dataA[i + 2] * (1 - alpha) + dataB[i + 2] * alpha);
    out[i + 3] = 255;
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

function glassSvg(intensity) {
  const glare = (0.08 + intensity * 0.18).toFixed(3);
  const streak = (0.04 + intensity * 0.1).toFixed(3);
  return Buffer.from(`<svg width="${OUT_W}" height="${OUT_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="white" stop-opacity="0"/>
        <stop offset="42%" stop-color="white" stop-opacity="${streak}"/>
        <stop offset="50%" stop-color="white" stop-opacity="${glare}"/>
        <stop offset="58%" stop-color="white" stop-opacity="${streak}"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="g2" cx="52%" cy="44%" r="55%">
        <stop offset="0%" stop-color="rgb(255,248,230)" stop-opacity="${(intensity * 0.2).toFixed(3)}"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g1)"/>
    <rect width="100%" height="100%" fill="url(#g2)"/>
    <rect width="100%" height="100%" fill="rgba(180,210,255,${(intensity * 0.06).toFixed(3)})"/>
  </svg>`);
}

async function applyGlass(buffer, intensity) {
  if (intensity <= 0.001) return buffer;
  const overlay = await sharp(glassSvg(intensity)).resize(OUT_W, OUT_H).ensureAlpha().toBuffer();
  return sharp(buffer).composite([{ input: overlay, blend: "over" }]).toBuffer();
}

async function toWebp(buffer, frameNum) {
  await sharp(buffer).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(framePath(frameNum));
}

/** Scene boundaries (1-indexed inclusive) */
const SCENES = {
  stationary: [1, 12],
  dolly: [13, 38],
  glass: [39, 50],
  transition: [51, 66],
  drone: [67, 94],
  morph: [95, 110],
  final: [111, 120],
};

function sceneProgress(frame, [start, end]) {
  return clamp((frame - start) / (end - start), 0, 1);
}

async function generateFrame(frame, corridor, mid, close) {
  const breathe = 1 + Math.sin((frame / TOTAL_FRAMES) * Math.PI * 4) * 0.004;

  if (frame <= SCENES.stationary[1]) {
    let buf = await dolly(corridor, 0);
    if (breathe !== 1) {
      const meta = await sharp(buf).metadata();
      const w = meta.width;
      const h = meta.height;
      const cropW = Math.round(w / breathe);
      const cropH = Math.round(h / breathe);
      const left = Math.round((w - cropW) / 2);
      const top = Math.round((h - cropH) / 2);
      buf = await sharp(buf)
        .extract({ left, top, width: cropW, height: cropH })
        .resize(OUT_W, OUT_H)
        .toBuffer();
    }
    return buf;
  }

  if (frame <= SCENES.dolly[1]) {
    const t = sceneProgress(frame, SCENES.dolly);
    return dolly(corridor, t);
  }

  if (frame <= SCENES.glass[1]) {
    const t = sceneProgress(frame, SCENES.glass);
    const dollyP = 1;
    let buf = await dolly(corridor, dollyP);
    const glassIntensity = t < 0.55 ? ease(t / 0.55) : ease(1 - (t - 0.55) / 0.45) * 0.6 + 0.4;
    buf = await applyGlass(buf, glassIntensity);
    return buf;
  }

  if (frame <= SCENES.transition[1]) {
    const t = sceneProgress(frame, SCENES.transition);
    const corridorBuf = await dolly(corridor, 1);
    const midBuf = await dolly(mid, t * 0.08);
    let buf = await blend(corridorBuf, midBuf, ease(t));
    const glassFade = 1 - ease(t);
    if (glassFade > 0.01) buf = await applyGlass(buf, glassFade * 0.5);
    return buf;
  }

  if (frame <= SCENES.drone[1]) {
    const t = sceneProgress(frame, SCENES.drone);
    return dolly(mid, ease(t) * 0.72);
  }

  if (frame <= SCENES.morph[1]) {
    const t = sceneProgress(frame, SCENES.morph);
    const midBuf = await dolly(mid, 0.72);
    const closeBuf = await dolly(close, t * 0.35);
    return blend(midBuf, closeBuf, ease(t));
  }

  const t = sceneProgress(frame, SCENES.final);
  return dollyTilt(close, 0.35 + ease(t) * 0.65);
}

async function main() {
  console.log("Loading source images...");
  const [corridor, mid, close] = await Promise.all([
    loadNormalized("corridor.png"),
    loadNormalized("burj-mid.png"),
    loadNormalized("burj-close.png"),
  ]);

  fs.mkdirSync(OUT, { recursive: true });

  console.log(`Generating ${TOTAL_FRAMES} frames → ${OUT}`);

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const buf = await generateFrame(i, corridor, mid, close);
    await toWebp(buf, i);
    if (i % 10 === 0 || i === TOTAL_FRAMES) {
      console.log(`  frame ${i}/${TOTAL_FRAMES}`);
    }
  }

  const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    const num = String(i + 1).padStart(4, "0");
    return `/cinematic/frame_${num}.webp`;
  });

  const manifest = {
    totalFrames: TOTAL_FRAMES,
    frames,
    width: OUT_W,
    height: OUT_H,
    format: "webp",
    prefix: "frame_",
    padding: 4,
    extension: ".webp",
    scenes: SCENES,
  };

  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
