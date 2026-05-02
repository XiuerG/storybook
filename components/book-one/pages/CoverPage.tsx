"use client";

import React from "react";
import { motion } from "framer-motion";
import PageShell from "./PageShell";

/* ════════════════════════════════════════════════════════════
   BOOK I COVER — Our Secret Haven
   ────────────────────────────────────────────────────────────
   Full-bleed artwork + title block that eases in like Book II / III.
════════════════════════════════════════════════════════════ */

const TITLE = "Our Secret Haven";
const SUB = "Chinese rituals of food, memory, and home";
const TAGLINE = "Where the door still knows your hand.";
/** Cover art transparency (0–1). Lower = more fade into base layer. */
const COVER_PHOTO_OPACITY = 0.88;

const CoverPage = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <PageShell ref={ref} side="right">
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {`Our Secret Haven — an interactive storybook. ${TAGLINE}`}
      </h1>

      {/* Base tone — shows through when cover art is semi-transparent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-3rem -2.5rem -3rem -3rem",
          backgroundColor: "#1e1b18",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-3rem -2.5rem -3rem -3rem",
          backgroundImage: "url(/cover-background.png?v=4)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: COVER_PHOTO_OPACITY,
        }}
      />

      {/* Readability scrim — photo stays dominant */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(12,8,6,0.72) 0%, rgba(12,8,6,0.35) 28%, transparent 52%)",
          pointerEvents: "none",
        }}
      />

      {/* Soft amber/violet mist — fills visual void above title without fighting the photo */}
      <CoverUpperGlow />

      {/* Upper star dust — dense + larger dots so it reads on small flipbook pages */}
      <CoverStarDust />

      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "2.4rem",
          right: "2.4rem",
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "0.68rem",
            letterSpacing: "0.38em",
            color: "rgba(235,210,185,0.78)",
            marginBottom: "1.05rem",
            textShadow: "0 2px 14px rgba(0,0,0,0.55)",
          }}
        >
          栖身之所
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.2, delay: 0.7, ease: "easeOut" }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
            lineHeight: 1.18,
            letterSpacing: "0.005em",
            color: "rgba(252,238,220,0.96)",
            textShadow:
              "0 0 28px rgba(0,0,0,0.85), 0 2px 24px rgba(0,0,0,0.5), 0 0 48px rgba(200,120,60,0.15)",
          }}
        >
          {TITLE}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.55, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.6, ease: "easeOut" }}
          style={{
            width: "2.5rem",
            height: 1,
            background: "rgba(220,170,120,0.55)",
            margin: "1.05rem 0",
            transformOrigin: "left center",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 2.0, ease: "easeOut" }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.82rem",
            lineHeight: 1.6,
            letterSpacing: "0.04em",
            color: "rgba(215,195,175,0.88)",
            textShadow: "0 2px 16px rgba(0,0,0,0.65)",
          }}
        >
          {SUB}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 2.35, ease: "easeOut" }}
          style={{
            margin: "0.75rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.66rem",
            lineHeight: 1.55,
            letterSpacing: "0.035em",
            color: "rgba(190,175,155,0.72)",
            textShadow: "0 2px 12px rgba(0,0,0,0.55)",
          }}
        >
          {TAGLINE}
        </motion.p>
      </div>
    </PageShell>
  );
});

CoverPage.displayName = "CoverPage";
export default CoverPage;

type Mote = { x: number; y: number; s: number; warm: boolean };

/* ─── Warm haze in upper field — reduces empty black band ─────── */
function CoverUpperGlow() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 92% 58% at 50% 18%, rgba(255,195,130,0.16) 0%, transparent 58%)," +
          "radial-gradient(ellipse 55% 42% at 22% 28%, rgba(255,210,170,0.09) 0%, transparent 52%)," +
          "radial-gradient(ellipse 48% 38% at 78% 22%, rgba(190,175,230,0.07) 0%, transparent 48%)",
      }}
    />
  );
}

function buildDenseMotes(seed: number, count: number): Mote[] {
  let state = seed >>> 0;
  const rnd = () => {
    state = Math.imul(state, 1664525) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
  const out: Mote[] = [];
  for (let i = 0; i < count; i++) {
    const gauss = (rnd() + rnd() + rnd()) / 3;
    const x = 14 + gauss * 72;
    const y = 2 + rnd() * 62;
    out.push({
      x,
      y,
      s: 0.15 + rnd() * 1.15,
      warm: rnd() > 0.42,
    });
  }
  return out;
}

const DENSE_MOTES = buildDenseMotes(0x5ec4ef15, 64);

/* ─── Soft twinkling dots — upper half only (denser + brighter) ─ */
function CoverStarDust() {
  const staticDots: Mote[] = [
    { x: 7, y: 5, s: 0.55, warm: true },
    { x: 14, y: 12, s: 0.75, warm: false },
    { x: 22, y: 6, s: 0.5, warm: true },
    { x: 30, y: 15, s: 0.9, warm: true },
    { x: 38, y: 7, s: 0.48, warm: true },
    { x: 46, y: 18, s: 0.65, warm: false },
    { x: 52, y: 9, s: 1.05, warm: true },
    { x: 58, y: 20, s: 0.52, warm: true },
    { x: 66, y: 5, s: 0.42, warm: true },
    { x: 74, y: 14, s: 0.8, warm: false },
    { x: 82, y: 8, s: 0.58, warm: true },
    { x: 90, y: 16, s: 0.72, warm: true },
    { x: 96, y: 6, s: 0.45, warm: true },
    { x: 11, y: 22, s: 0.62, warm: false },
    { x: 25, y: 26, s: 0.55, warm: true },
    { x: 36, y: 23, s: 0.95, warm: true },
    { x: 48, y: 28, s: 0.5, warm: true },
    { x: 62, y: 25, s: 0.88, warm: false },
    { x: 76, y: 22, s: 0.6, warm: true },
    { x: 88, y: 27, s: 0.52, warm: true },
    { x: 18, y: 34, s: 0.48, warm: true },
    { x: 42, y: 36, s: 0.7, warm: true },
    { x: 54, y: 33, s: 0.45, warm: false },
    { x: 70, y: 38, s: 1, warm: true },
    { x: 84, y: 35, s: 0.55, warm: true },
    { x: 6, y: 40, s: 0.4, warm: false },
    { x: 32, y: 42, s: 0.58, warm: true },
    { x: 94, y: 41, s: 0.46, warm: true },
    { x: 50, y: 46, s: 0.82, warm: true },
    { x: 20, y: 44, s: 0.44, warm: true },
    { x: 78, y: 45, s: 0.64, warm: false },
    /* —— center cluster: fills the empty middle band —— */
    { x: 50, y: 12, s: 0.72, warm: true },
    { x: 44, y: 16, s: 0.52, warm: false },
    { x: 56, y: 15, s: 0.58, warm: true },
    { x: 50, y: 19, s: 0.88, warm: true },
    { x: 41, y: 22, s: 0.46, warm: true },
    { x: 59, y: 21, s: 0.5, warm: false },
    { x: 47, y: 25, s: 0.62, warm: true },
    { x: 53, y: 24, s: 0.48, warm: true },
    { x: 50, y: 28, s: 0.98, warm: true },
    { x: 43, y: 30, s: 0.42, warm: false },
    { x: 57, y: 29, s: 0.54, warm: true },
    { x: 50, y: 32, s: 0.56, warm: true },
    { x: 46, y: 35, s: 0.44, warm: true },
    { x: 54, y: 34, s: 0.58, warm: false },
    { x: 50, y: 38, s: 0.76, warm: true },
    { x: 42, y: 39, s: 0.38, warm: true },
    { x: 58, y: 40, s: 0.42, warm: true },
    /* tiny pin-pricks in core (smaller s = subtler) */
    { x: 49, y: 14, s: 0.22, warm: true },
    { x: 51, y: 17, s: 0.25, warm: false },
    { x: 48, y: 21, s: 0.2, warm: true },
    { x: 52, y: 26, s: 0.24, warm: true },
    { x: 50, y: 30, s: 0.2, warm: false },
    { x: 45, y: 27, s: 0.22, warm: true },
    { x: 55, y: 32, s: 0.2, warm: true },
  ];

  const dots = [...staticDots, ...DENSE_MOTES];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "76%",
        zIndex: 3,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {dots.map((d, i) => {
        const px = Math.max(2.6, 2.3 + d.s * 1.35);
        const faint = d.s < 0.38;
        return (
          <motion.div
            key={i}
            animate={{
              opacity: faint
                ? [0.22, 0.72, 0.28, 0.68, 0.24]
                : [0.32, 0.98, 0.38, 0.94, 0.34],
              scale: faint ? [1, 1.12, 1, 1.1, 1] : [1, 1.26, 1, 1.22, 1],
            }}
            transition={{
              duration: 2.4 + (i % 7) * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 41) * 0.09,
            }}
            style={{
              position: "absolute",
              left: `${d.x}%`,
              top: `${d.y}%`,
              transform: "translate(-50%, -50%)",
              width: px,
              height: px,
              borderRadius: "50%",
              background: d.warm
                ? "rgba(255,238,215,0.98)"
                : "rgba(248,250,255,0.94)",
              boxShadow: d.warm
                ? "0 0 10px rgba(255,215,150,0.85), 0 0 24px rgba(255,175,95,0.55), 0 0 40px rgba(255,145,70,0.22)"
                : "0 0 10px rgba(215,225,255,0.75), 0 0 22px rgba(185,200,255,0.45)",
            }}
          />
        );
      })}
    </div>
  );
}
