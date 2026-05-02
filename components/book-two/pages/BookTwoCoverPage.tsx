"use client";

import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";

/* ════════════════════════════════════════════════════════════
   BOOK II COVER — Between Leaving and Returning
   ────────────────────────────────────────────────────────────
   Traditional night illustration (soft opacity) + night glaze,
   stars, hanging lantern, embers, horizon line — title below.
════════════════════════════════════════════════════════════ */

const TITLE = "Between Leaving\nand Returning";
const SUB = "Small memories that carry us home";
const TAGLINE = "Vietnamese rituals of memory, comfort, and return";
/** Illustration opacity — lower = more faded / “淡化” into base tone */
const COVER_PHOTO_OPACITY = 0.56;

const BookTwoCoverPage = React.forwardRef<HTMLDivElement>((_, ref) => (
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
      {`Between Leaving and Returning — an interactive storybook. ${TAGLINE}`}
    </h1>

    {/* Base tone — blends with translucent illustration */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundColor: "#151015",
      }}
    />

    {/* Traditional village night illustration — softened */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "-3rem -2.5rem -3rem -3rem",
        zIndex: 0,
        backgroundImage: "url(/book-two-cover-bg.webp?v=1)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: COVER_PHOTO_OPACITY,
      }}
    />

    {/* Night glaze — ties painting to lantern/stars palette */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 90% 60% at 50% 75%, rgba(60,28,18,0.4) 0%, transparent 72%)," +
          "radial-gradient(ellipse 70% 80% at 50% 18%, rgba(110,72,42,0.18) 0%, transparent 68%)," +
          "linear-gradient(180deg, rgba(10,6,14,0.42) 0%, rgba(8,5,12,0.34) 58%, rgba(14,9,18,0.44) 100%)",
      }}
    />

    {/* Faint stars */}
    <Stars />

    {/* Hanging lantern with soft halo */}
    <Lantern />

    {/* Drifting embers */}
    <Embers />

    {/* Faint horizon line — a country far below */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "10%",
        right: "10%",
        bottom: "26%",
        height: 1,
        zIndex: 2,
        background:
          "linear-gradient(to right, transparent, rgba(220,160,90,0.42) 50%, transparent)",
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
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      {/* Vietnamese subhead — small, warm */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.62rem",
          letterSpacing: "0.32em",
          color: "rgba(225,170,110,0.62)",
          marginBottom: "1.1rem",
          textTransform: "uppercase",
        }}
      >
        Giữa đi và về
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
          color: "rgba(245,225,195,0.94)",
          textShadow: "0 0 28px rgba(0,0,0,0.85), 0 0 56px rgba(220,140,70,0.18)",
          whiteSpace: "pre-line",
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
          background: "rgba(220,170,100,0.55)",
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
          color: "rgba(205,180,150,0.72)",
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
          color: "rgba(185,165,140,0.58)",
          textShadow: "0 0 14px rgba(0,0,0,0.82)",
        }}
      >
        {TAGLINE}
      </motion.p>
    </div>
  </PageShell>
));

BookTwoCoverPage.displayName = "BookTwoCoverPage";
export default BookTwoCoverPage;

/* ─── Hanging lantern ───────────────────────────────────── */
function Lantern() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      {/* Cord */}
      <div
        style={{
          width: 1,
          height: 110,
          background:
            "linear-gradient(to bottom, transparent, rgba(180,130,80,0.4))",
          margin: "0 auto",
        }}
      />

      {/* Lantern body */}
      <motion.div
        animate={{
          opacity: [0.92, 1, 0.94, 1, 0.9, 1],
          y: [0, 0.6, 0, -0.4, 0],
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "relative",
          width: 38,
          height: 50,
          margin: "0 auto",
        }}
      >
        {/* Halo glow */}
        <div
          style={{
            position: "absolute",
            inset: -60,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,180,90,0.32) 0%, rgba(255,140,60,0.14) 38%, transparent 72%)",
            filter: "blur(2px)",
          }}
        />
        {/* Top cap */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 22,
            height: 4,
            background: "rgba(120,80,40,0.85)",
            borderRadius: "1px 1px 0 0",
          }}
        />
        {/* Body */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: 36,
            height: 40,
            borderRadius: "50% 50% 45% 45% / 36% 36% 60% 60%",
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(255,210,130,0.92) 0%, rgba(225,140,55,0.82) 55%, rgba(150,70,30,0.85) 100%)",
            boxShadow:
              "0 0 24px rgba(255,170,80,0.45), 0 0 60px rgba(255,150,70,0.22), inset 0 0 10px rgba(255,220,150,0.6)",
            border: "0.5px solid rgba(180,110,55,0.7)",
          }}
        />
        {/* Vertical seam */}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: "50%",
            width: 1,
            height: 36,
            background: "rgba(120,70,30,0.4)",
            transform: "translateX(-50%)",
          }}
        />
        {/* Tassel */}
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: 10,
            background: "rgba(180,120,60,0.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(220,140,70,0.7)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Embers ────────────────────────────────────────────── */
function Embers() {
  const dots = [
    { x: 32, y: 40, d: 7,  delay: 0 },
    { x: 52, y: 60, d: 9,  delay: 1.6 },
    { x: 70, y: 38, d: 8,  delay: 3.2 },
    { x: 22, y: 55, d: 11, delay: 0.7 },
    { x: 78, y: 62, d: 10, delay: 2.4 },
    { x: 46, y: 30, d: 7,  delay: 4.0 },
    { x: 60, y: 48, d: 9,  delay: 5.5 },
  ];
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}
    >
      {dots.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -160, opacity: [0, 0.8, 0.4, 0] }}
          transition={{
            duration: p.d,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "rgba(255,200,120,0.85)",
            boxShadow: "0 0 6px rgba(255,180,90,0.7)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Stars ─────────────────────────────────────────────── */
function Stars() {
  const stars = [
    { x: 12, y: 14, s: 1 },
    { x: 28, y: 8,  s: 1 },
    { x: 84, y: 12, s: 1 },
    { x: 70, y: 22, s: 0.5 },
    { x: 18, y: 34, s: 0.5 },
    { x: 88, y: 30, s: 1 },
    { x: 38, y: 6,  s: 0.5 },
    { x: 56, y: 14, s: 0.5 },
    { x: 92, y: 48, s: 0.5 },
  ];
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2 }}>
      {stars.map((s, i) => (
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
            background: "rgba(220,210,235,0.7)",
          }}
        />
      ))}
    </div>
  );
}
