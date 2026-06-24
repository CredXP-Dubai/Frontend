import { CINEMATIC_MANIFEST_PATH } from "./constants";

/** Raw manifest shape — supports both `frames[]` and legacy prefix format */
export interface CinematicManifestRaw {
  totalFrames?: number;
  frames?: string[];
  width?: number;
  height?: number;
  format?: string;
  prefix?: string;
  padding?: number;
  extension?: string;
  scenes?: Record<string, number[]>;
}

/** Validated manifest used by the player */
export interface CinematicManifest {
  totalFrames: number;
  frames: string[];
  width: number;
  height: number;
}

export interface ManifestLoadResult {
  manifest: CinematicManifest | null;
  error: string | null;
}

function buildFramesFromLegacy(raw: CinematicManifestRaw): string[] {
  const total = raw.totalFrames ?? 0;
  const prefix = raw.prefix ?? "frame_";
  const padding = raw.padding ?? 4;
  const extension = raw.extension ?? ".webp";
  // Normalise .jpeg → .jpg in legacy-built paths
  const normalExt = extension === ".jpeg" ? ".jpg" : extension;

  if (total < 1) return [];

  return Array.from({ length: total }, (_, i) => {
    const num = String(i + 1).padStart(padding, "0");
    return `/cinematic/${prefix}${num}${normalExt}`;
  });
}

export function validateManifest(raw: unknown): CinematicManifest | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as CinematicManifestRaw;
  let frames: string[] = [];

  if (Array.isArray(data.frames) && data.frames.length > 0) {
    frames = data.frames.filter((f): f is string => typeof f === "string" && f.length > 0);
  } else {
    frames = buildFramesFromLegacy(data);
  }

  if (frames.length === 0) return null;

  const totalFrames =
    typeof data.totalFrames === "number" && data.totalFrames > 0
      ? Math.min(data.totalFrames, frames.length)
      : frames.length;

  return {
    totalFrames,
    frames: frames.slice(0, totalFrames),
    width: typeof data.width === "number" && data.width > 0 ? data.width : 1920,
    height: typeof data.height === "number" && data.height > 0 ? data.height : 1080,
  };
}

export async function fetchManifest(): Promise<ManifestLoadResult> {
  try {
    const res = await fetch(CINEMATIC_MANIFEST_PATH, { cache: "no-store" });

    if (!res.ok) {
      return {
        manifest: null,
        error: `Manifest not found (${res.status}). Run npm run sync:manifest`,
      };
    }

    const raw: unknown = await res.json();
    const manifest = validateManifest(raw);

    if (!manifest) {
      return {
        manifest: null,
        error: "Manifest is malformed. Expected totalFrames and frames array.",
      };
    }

    return { manifest, error: null };
  } catch {
    return {
      manifest: null,
      error: "Failed to load cinematic manifest.",
    };
  }
}

export function progressToFrameIndex(progress: number, totalFrames: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.floor(clamped * (totalFrames - 1));
}
