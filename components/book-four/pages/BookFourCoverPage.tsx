"use client";

import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";

/* ════════════════════════════════════════════════════════════
   BOOK IV COVER — The Cultural Bridge
   ────────────────────────────────────────────────────────────
   Warm palace-night illustration (soft opacity) + glaze; filigree,
   dust, diya, horizon; title below.
================================================================ */

const TITLE = "The Cultural Bridge";
const SUB = "Threads that carry us between worlds";
const TAGLINE = "Find your thread.";
/** Illustration opacity — lower = softer / more “淡化” */
const COVER_PHOTO_OPACITY = 0.54;

const BookFourCoverPage = React.forwardRef<HTMLDivElement>((_, ref) => (
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
      {`The Cultural Bridge — an interactive storybook. ${TAGLINE}`}
    </h1>

    {/* Base tone — shows through translucent illustration */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundColor: "#0d0a18",
      }}
    />

    {/* Palace night illustration — softened */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "-3rem -2.5rem -3rem -3rem",
        zIndex: 0,
        backgroundImage: "url(/book-four-cover-bg.webp?v=1)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: COVER_PHOTO_OPACITY,
      }}
    />

    {/* Warm glaze — blends painting with diya / gold threads */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 90% 50% at 50% 78%, rgba(255,120,50,0.28) 0%, transparent 72%)," +
          "radial-gradient(ellipse 80% 70% at 50% 24%, rgba(120,40,70,0.14) 0%, transparent 68%)," +
          "linear-gradient(180deg, rgba(8,5,22,0.48) 0%, rgba(10,8,28,0.38) 58%, rgba(16,10,32,0.42) 100%)",
      }}
    />

    {/* Filigree threads */}
    <Filigree />

    {/* Stars / dust */}
    <DustField />

    {/* Diya — warm flame in the lower middle */}
    <Diya />

    {/* Faint horizon line */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "12%",
        right: "12%",
        bottom: "26%",
        height: 1,
        zIndex: 2,
        background:
          "linear-gradient(to right, transparent, rgba(255,180,100,0.42) 50%, transparent)",
        filter: "blur(0.4px)",
      }}
    />

    {/* Title block */}
    <div
      style={{
        position: "absolute",
        bottom: "8%",
        left: "2.4rem",
        right: "2.4rem",
        zIndex: 6,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.78rem",
          letterSpacing: "0.22em",
          color: "rgba(255,200,140,0.78)",
          marginBottom: "1.1rem",
        }}
      >
        संस्कृति का पुल
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
          color: "rgba(248,232,210,0.96)",
          textShadow: "0 0 28px rgba(0,0,0,0.85), 0 0 56px rgba(255,150,80,0.20)",
        }}
      >
        {TITLE}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.6, scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1.6, ease: "easeOut" }}
        style={{
          width: "2.5rem",
          height: 1,
          background: "rgba(255,180,100,0.6)",
          margin: "1.1rem 0",
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
          color: "rgba(220,200,180,0.78)",
          textShadow: "0 0 18px rgba(0,0,0,0.85)",
        }}
      >
        {SUB}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 2.35, ease: "easeOut" }}
        style={{
          margin: "0.7rem 0 0",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.66rem",
          lineHeight: 1.55,
          letterSpacing: "0.03em",
          color: "rgba(195,180,160,0.6)",
          textShadow: "0 0 14px rgba(0,0,0,0.82)",
        }}
      >
        {TAGLINE}
      </motion.p>
    </div>
  </PageShell>
));

BookFourCoverPage.displayName = "BookFourCoverPage";
export default BookFourCoverPage;

/* ─── Diya — clay lamp with flickering flame ─────────────── */
function Diya() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "32%",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {/* Halo */}
      <motion.div
        animate={{ opacity: [0.55, 0.85, 0.62, 0.92, 0.6] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "50%",
          transform: "translate(-50%, 50%)",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,170,80,0.35) 0%, rgba(255,140,60,0.14) 35%, transparent 70%)",
          filter: "blur(2px)",
          mixBlendMode: "screen",
        }}
      />
      <div style={{ position: "relative", width: 60, height: 36 }}>
        {/* Flame */}
        <motion.div
          animate={{
            opacity: [0.85, 1, 0.92, 1, 0.88],
            scaleY: [1, 1.08, 0.96, 1.06, 1],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: -16,
            left: "50%",
            transform: "translateX(-50%)",
            transformOrigin: "bottom center",
            width: 6,
            height: 14,
            borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
            background:
              "radial-gradient(ellipse at 50% 70%, rgba(255,235,180,0.95) 0%, rgba(255,160,70,0.95) 60%, rgba(180,60,30,0.85) 100%)",
            boxShadow:
              "0 0 14px rgba(255,170,80,0.9), 0 0 28px rgba(255,140,60,0.6)",
          }}
        />
        {/* Wick */}
        <div
          style={{
            position: "absolute",
            top: -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1.5,
            height: 5,
            background: "rgba(80,40,20,0.95)",
          }}
        />
        {/* Lamp body — clay bowl */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 18,
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            background:
              "linear-gradient(180deg, rgba(180,90,50,0.95) 0%, rgba(110,55,30,0.95) 60%, rgba(60,28,18,0.95) 100%)",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.7), inset 0 0 6px rgba(0,0,0,0.4)",
          }}
        />
        {/* Bowl rim highlight */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 44,
            height: 5,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(40,18,10,0.95) 0%, rgba(255,170,80,0.4) 100%)",
            border: "1px solid rgba(220,140,80,0.55)",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Filigree threads — gold filigree weaving across the dark ─ */
function Filigree() {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox="0 0 480 660"
      style={{ position: "absolute", inset: 0, opacity: 0.32, pointerEvents: "none", zIndex: 2 }}
    >
      <defs>
        <linearGradient id="bf-thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,180,100,0)" />
          <stop offset="50%" stopColor="rgba(255,180,100,0.65)" />
          <stop offset="100%" stopColor="rgba(255,180,100,0)" />
        </linearGradient>
      </defs>
      {/* Looping threads */}
      <path
        d="M -20 120 Q 100 80 220 120 T 460 120 T 700 100"
        stroke="url(#bf-thread)"
        strokeWidth="0.7"
        fill="none"
      />
      <path
        d="M -20 200 Q 140 240 280 200 T 500 220"
        stroke="url(#bf-thread)"
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d="M -20 280 Q 120 250 250 290 T 480 280"
        stroke="url(#bf-thread)"
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  );
}

/* ─── Dust field — faint pixel dots ──────────────────────── */
function DustField() {
  const dust = [
    { x: 14, y: 18, s: 1 },
    { x: 28, y: 10, s: 0.6 },
    { x: 86, y: 14, s: 1 },
    { x: 70, y: 22, s: 0.5 },
    { x: 18, y: 36, s: 0.5 },
    { x: 88, y: 32, s: 1 },
    { x: 38, y: 8, s: 0.5 },
    { x: 56, y: 14, s: 0.5 },
    { x: 92, y: 50, s: 0.5 },
    { x: 8, y: 50, s: 0.6 },
  ];
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2 }}>
      {dust.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.55, 0.2] }}
          transition={{
            duration: 3 + (i % 3) * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: 1.4 + s.s,
            height: 1.4 + s.s,
            borderRadius: "50%",
            background: "rgba(255,220,180,0.6)",
          }}
        />
      ))}
    </div>
  );
}
