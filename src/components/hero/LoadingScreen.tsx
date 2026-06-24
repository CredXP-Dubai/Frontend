"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HERO_COPY } from "@/lib/cinematic/constants";

interface LoadingScreenProps {
  visible: boolean;
  progress: number;
  error?: string | null;
}

export function LoadingScreen({ visible, progress, error }: LoadingScreenProps) {
  const pct = Math.round(Math.max(0, Math.min(100, progress)));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
          aria-live="polite"
          aria-busy={!error}
        >
          <div className="loading-screen__inner">
            <motion.div
              className="loading-screen__logo"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5E6C8" />
                    <stop offset="45%" stopColor="#C9A962" />
                    <stop offset="100%" stopColor="#8B7340" />
                  </linearGradient>
                </defs>
                <path
                  d="M60 8 L108 36 V84 L60 112 L12 84 V36 Z"
                  stroke="url(#goldGrad)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M60 28 L88 46 V74 L60 92 L32 74 V46 Z"
                  stroke="url(#goldGrad)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.7"
                />
                <circle cx="60" cy="60" r="6" fill="url(#goldGrad)" />
              </svg>
            </motion.div>

            <p className="loading-screen__tagline">{HERO_COPY.loadingTagline}</p>

            {error ? (
              <p className="loading-screen__error">{error}</p>
            ) : (
              <>
                <p className="loading-screen__percent">{pct}%</p>
                <div className="loading-screen__bar-track">
                  <motion.div
                    className="loading-screen__bar-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: pct / 100 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
