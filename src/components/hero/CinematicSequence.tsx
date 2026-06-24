"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CinematicManifest } from "@/lib/cinematic/manifest";
import { progressToFrameIndex } from "@/lib/cinematic/manifest";
import { FrameSequenceLoader } from "@/lib/cinematic/frameLoader";

gsap.registerPlugin(ScrollTrigger);

interface CinematicSequenceProps {
  manifest: CinematicManifest;
  loader: FrameSequenceLoader;
  pinRef: React.RefObject<HTMLDivElement | null>;
  sectionRef: React.RefObject<HTMLElement | null>;
  onProgress?: (progress: number) => void;
  reducedMotion?: boolean;
}

export function CinematicSequence({
  manifest,
  loader,
  pinRef,
  sectionRef,
  onProgress,
  reducedMotion = false,
}: CinematicSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const dprRef = useRef(1);
  const lastLoggedPathRef = useRef("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const pin = pinRef.current;
    const section = sectionRef.current;
    if (!canvas || !pin || !section) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const img = loader.getFrame(index);
      if (!img?.complete || img.naturalWidth === 0) return;

      const dpr = dprRef.current;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      let dw = cw;
      let dh = ch;
      let dx = 0;
      let dy = 0;

      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
      } else {
        dw = cw;
        dh = cw / ir;
        dy = (ch - dh) / 2;
      }

      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const logFrame = (index: number) => {
      const url = loader.getFrameUrl(index);
      if (url && url !== lastLoggedPathRef.current) {
        lastLoggedPathRef.current = url;
        console.info(
          `[CinematicSequence] displaying frame ${index + 1}/${manifest.totalFrames} → ${url}`,
        );
      }
    };

    const applyFrame = (index: number) => {
      const clamped = Math.max(0, Math.min(manifest.totalFrames - 1, index));
      if (clamped === frameRef.current && loader.isLoaded(clamped)) {
        drawFrame(clamped);
        return;
      }

      frameRef.current = clamped;
      logFrame(clamped);

      if (loader.isLoaded(clamped)) {
        drawFrame(clamped);
      } else {
        loader
          .loadFrame(clamped)
          .then(() => drawFrame(clamped))
          .catch(() => undefined);
      }

      loader.preloadRange(clamped);
      loader.evictOutside(clamped, 24);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (frameRef.current >= 0) drawFrame(frameRef.current);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const renderLoop = () => {
      const index = progressToFrameIndex(progressRef.current, manifest.totalFrames);
      if (index !== frameRef.current || !loader.isLoaded(index)) {
        applyFrame(index);
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    if (reducedMotion) {
      progressRef.current = 1;
      applyFrame(manifest.totalFrames - 1);
      onProgress?.(1);
      return () => {
        cancelAnimationFrame(rafRef.current);
        ro.disconnect();
      };
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: pin,
      pinSpacing: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const index = progressToFrameIndex(self.progress, manifest.totalFrames);
        loader.preloadRange(index);
        onProgress?.(self.progress);
      },
    });

    applyFrame(0);

    if (process.env.NODE_ENV === "development") {
      const mid = Math.floor(manifest.totalFrames / 2);
      console.info("[CinematicSequence] manifest frames:", {
        totalFrames: manifest.totalFrames,
        first: manifest.frames[0],
        middle: manifest.frames[mid],
        last: manifest.frames[manifest.totalFrames - 1],
      });
    }

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      trigger.kill();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [manifest, loader, pinRef, sectionRef, onProgress, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="cinematic-sequence"
      aria-hidden="true"
    />
  );
}
