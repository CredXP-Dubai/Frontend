"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CinematicManifest } from "@/lib/cinematic/manifest";
import { fetchManifest } from "@/lib/cinematic/manifest";
import {
  CINEMATIC_SCROLL_HEIGHT_VH,
  CINEMATIC_SCROLL_HEIGHT_VH_MOBILE,
  CTA_REVEAL_PROGRESS,
  PRELOAD_INITIAL_COUNT,
} from "@/lib/cinematic/constants";
import { FrameSequenceLoader } from "@/lib/cinematic/frameLoader";
import { useReducedMotion } from "@/lib/hero/hooks/useReducedMotion";
import { LoadingScreen } from "./LoadingScreen";
import { CinematicSequence } from "./CinematicSequence";
import { CinematicCTA } from "./CinematicCTA";

type HeroStatus = "loading" | "ready" | "error";

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<HeroStatus>("loading");
  const [manifest, setManifest] = useState<CinematicManifest | null>(null);
  const [loader, setLoader] = useState<FrameSequenceLoader | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showHero, setShowHero] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const reducedMotion = useReducedMotion();

  const scrollHeightVh = isMobile
    ? CINEMATIC_SCROLL_HEIGHT_VH_MOBILE
    : CINEMATIC_SCROLL_HEIGHT_VH;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setStatus("loading");
      setLoadProgress(0);
      setLoadError(null);

      const { manifest: validManifest, error } = await fetchManifest();

      if (cancelled) return;

      if (!validManifest || error) {
        setLoadError(error ?? "Unable to load cinematic frames.");
        setStatus("error");
        return;
      }

      setManifest(validManifest);
      setLoadProgress(10);

      if (process.env.NODE_ENV === "development") {
        const mid = Math.floor(validManifest.totalFrames / 2);
        console.info("[CinematicHero] using uploaded frames:", {
          totalFrames: validManifest.totalFrames,
          first: validManifest.frames[0],
          middle: validManifest.frames[mid],
          last: validManifest.frames[validManifest.totalFrames - 1],
        });
      }

      const frameLoader = new FrameSequenceLoader(validManifest);

      try {
        await frameLoader.preloadInitial(PRELOAD_INITIAL_COUNT, (loaded, total) => {
          if (cancelled) return;
          const framePct = Math.round((loaded / total) * 80);
          setLoadProgress(10 + framePct);
        });
      } catch {
        if (!cancelled) {
          setLoadError("Failed to preload cinematic frames.");
          setStatus("error");
        }
        return;
      }

      if (cancelled) return;

      setLoader(frameLoader);
      setLoadProgress(100);
      setStatus("ready");

      requestAnimationFrame(() => {
        setShowHero(true);
        setTimeout(() => setLoadingVisible(false), 100);
      });
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleScrollProgress = useCallback((progress: number) => {
    const show = progress >= CTA_REVEAL_PROGRESS;
    setCtaVisible((prev) => (prev !== show ? show : prev));
  }, []);

  useEffect(() => {
    document.body.style.overflow = status === "loading" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [status]);

  const ctaVisibleFinal = ctaVisible || reducedMotion;
  const isReady = status === "ready" && manifest !== null && loader !== null;

  return (
    <>
      <LoadingScreen
        visible={loadingVisible || status === "loading" || status === "error"}
        progress={loadProgress}
        error={loadError}
      />

      <section
        ref={sectionRef}
        className="cinematic-hero"
        style={{ height: `${scrollHeightVh}vh` }}
        aria-label="Dubai luxury properties cinematic film"
      >
        <div ref={pinRef} className="cinematic-hero__pin">
          <div
            className="cinematic-hero__stage"
            style={{
              opacity: showHero && isReady ? 1 : 0,
              transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {isReady && (
              <>
                <CinematicSequence
                  manifest={manifest}
                  loader={loader}
                  pinRef={pinRef}
                  sectionRef={sectionRef}
                  onProgress={handleScrollProgress}
                  reducedMotion={reducedMotion}
                />
                <CinematicCTA visible={ctaVisibleFinal} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
