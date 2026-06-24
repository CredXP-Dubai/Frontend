import type { CinematicManifest } from "./manifest";
import { PRELOAD_RADIUS } from "./constants";

export class FrameSequenceLoader {
  private cache = new Map<number, HTMLImageElement>();
  private loading = new Map<number, Promise<HTMLImageElement>>();
  private manifest: CinematicManifest;

  constructor(manifest: CinematicManifest) {
    this.manifest = manifest;
  }

  get totalFrames(): number {
    return this.manifest.totalFrames;
  }

  getFrameUrl(index: number): string {
    const clamped = Math.max(0, Math.min(this.manifest.totalFrames - 1, index));
    return this.manifest.frames[clamped] ?? "";
  }

  getFrame(index: number): HTMLImageElement | undefined {
    return this.cache.get(index);
  }

  isLoaded(index: number): boolean {
    const img = this.cache.get(index);
    return Boolean(img?.complete && img.naturalWidth > 0);
  }

  loadedCount(): number {
    let count = 0;
    for (let i = 0; i < this.manifest.totalFrames; i++) {
      if (this.isLoaded(i)) count++;
    }
    return count;
  }

  loadFrame(index: number): Promise<HTMLImageElement> {
    const clamped = Math.max(0, Math.min(this.manifest.totalFrames - 1, index));
    const url = this.manifest.frames[clamped];

    if (!url) {
      return Promise.reject(new Error(`No URL for frame ${clamped}`));
    }

    const cached = this.cache.get(clamped);
    if (cached?.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }

    const pending = this.loading.get(clamped);
    if (pending) return pending;

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        this.cache.set(clamped, img);
        this.loading.delete(clamped);
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(clamped);
        reject(new Error(`Failed to load frame ${clamped}: ${url}`));
      };
      img.src = url;
    });

    this.loading.set(clamped, promise);
    return promise;
  }

  preloadRange(center: number, radius = PRELOAD_RADIUS): void {
    const start = Math.max(0, center - radius);
    const end = Math.min(this.manifest.totalFrames - 1, center + radius);

    for (let i = start; i <= end; i++) {
      if (!this.isLoaded(i) && !this.loading.has(i)) {
        this.loadFrame(i).catch(() => undefined);
      }
    }
  }

  async preloadInitial(
    count: number,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    const total = Math.min(count, this.manifest.totalFrames);
    let loaded = 0;

    const tasks = Array.from({ length: total }, async (_, i) => {
      try {
        await this.loadFrame(i);
      } catch {
        /* individual frame failure is non-fatal */
      } finally {
        loaded++;
        onProgress?.(loaded, total);
      }
    });

    await Promise.all(tasks);
  }

  evictOutside(center: number, keepRadius: number): void {
    for (const key of this.cache.keys()) {
      if (Math.abs(key - center) > keepRadius * 2) {
        this.cache.delete(key);
      }
    }
  }
}
