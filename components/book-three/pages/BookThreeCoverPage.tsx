"use client";

import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";

/* ════════════════════════════════════════════════════════════
   BOOK III COVER — What We Return To (final)
   ────────────────────────────────────────────────────────────
   Softened horizon illustration + night glaze; screen/window UI,
   traces, dust, return line; title block below.
================================================================ */

const TITLE = "What We Return To";
const SUB = "Korean rituals of comfort, media, and reset";
const TAGLINE = "The same soft landing, even when the hour isn’t.";
/** Illustration opacity — lower = softer / more “淡化” */
const COVER_PHOTO_OPACITY = 0.54;

const BookThreeCoverPage = React.forwardRef<HTMLDivElement>((_, ref) => (
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
      {`What We Return To — an interactive storybook. ${TAGLINE}`}
    </h1>

    {/* Base tone — shows through translucent illustration */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundColor: "#0f0d16",
      }}
    />

    {/* Night horizon illustration — softened */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "-3rem -2.5rem -3rem -3rem",
        zIndex: 0,
        backgroundImage: "url(/book-three-cover-bg.webp?v=1)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: COVER_PHOTO_OPACITY,
      }}
    />

    {/* Night glaze — ties painting to UI screen / stars */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 90% 50% at 50% 82%, rgba(70,30,28,0.34) 0%, transparent 72%)," +
          "radial-gradient(ellipse 70% 70% at 50% 20%, rgba(60,55,110,0.2) 0%, transparent 65%)," +
          "linear-gradient(180deg, rgba(8,7,15,0.46) 0%, rgba(10,8,18,0.38) 58%, rgba(14,12,22,0.42) 100%)",
      }}
    />

    {/* Screen / window opening */}
    <Screen />

    {/* Whisper traces: waveform, KR fragments, warm dot, subtitle line */}
    <ScreenFloatTraces />

    {/* Teasers for sections ahead — barely legible */}
    <ScreenTeaserHints />

    {/* Stars / pixel dust — fewer, subtler */}
    <DustField />

    {/* Bridge: faint horizontal “return” light linking screen ↔ title zone */}
    <ReturnBridgeLine />

    {/* Three lights drifting inward toward the title */}
    <ReturningLights />

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
          fontWeight: 300,
          fontSize: "0.72rem",
          letterSpacing: "0.38em",
          color: "rgba(228,218,240,0.78)",
          marginBottom: "1.05rem",
          textShadow: "0 0 24px rgba(40,30,60,0.5)",
        }}
      >
        돌아가는 것들
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
          color: "rgba(245,230,210,0.96)",
          textShadow: "0 0 28px rgba(0,0,0,0.85), 0 0 56px rgba(220,140,100,0.18)",
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
          color: "rgba(205,195,175,0.82)",
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
          margin: "0.75rem 0 0",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.66rem",
          lineHeight: 1.55,
          letterSpacing: "0.035em",
          color: "rgba(175,168,152,0.58)",
          textShadow: "0 0 14px rgba(0,0,0,0.82)",
        }}
      >
        {TAGLINE}
      </motion.p>
    </div>
  </PageShell>
));

BookThreeCoverPage.displayName = "BookThreeCoverPage";
export default BookThreeCoverPage;

/* ─── Screen as “opened” window: bright core, cold top, warm bottom ─ */
function Screen() {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: [0.88, 1, 0.92, 1, 0.88] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: "17%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "64%",
        height: "31%",
        borderRadius: 5,
        pointerEvents: "none",
        filter: "blur(0.85px)",
        zIndex: 2,
      }}
    >
      {/* Base glass */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 5,
          background:
            "linear-gradient(180deg, rgba(90,120,200,0.11) 0%, rgba(55,65,130,0.07) 38%, rgba(35,28,55,0.06) 100%)",
          boxShadow:
            "0 0 60px rgba(100,130,220,0.11), inset 0 -28px 44px rgba(180,70,40,0.12), inset 0 18px 38px rgba(80,120,200,0.10)",
        }}
      />
      {/* Brighter center — “depth into” the opening */}
      <div
        style={{
          position: "absolute",
          left: "18%",
          right: "18%",
          top: "22%",
          bottom: "28%",
          borderRadius: 4,
          background:
            "radial-gradient(ellipse 100% 90% at 50% 45%, rgba(200,210,245,0.22) 0%, rgba(120,140,200,0.08) 45%, transparent 75%)",
          filter: "blur(2px)",
        }}
      />
      {/* Cool upper rim */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "28%",
          borderRadius: "5px 5px 0 0",
          background:
            "linear-gradient(180deg, rgba(130,160,230,0.20) 0%, rgba(80,100,160,0.05) 100%)",
          opacity: 0.85,
        }}
      />
      {/* Warm lower rim / sill */}
      <div
        style={{
          position: "absolute",
          left: "-2%",
          right: "-2%",
          bottom: "-4%",
          height: "22%",
          background:
            "radial-gradient(ellipse 80% 120% at 50% 100%, rgba(255,120,70,0.28) 0%, rgba(200,80,50,0.12) 40%, transparent 70%)",
          filter: "blur(6px)",
          opacity: 0.95,
        }}
      />
    </motion.div>
  );
}

/* ─── 4–5 faint traces around the screen (ambient, not decorative spam) ─ */
function ScreenFloatTraces() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "14%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "72%",
        height: "36%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {/* Tiny waveform */}
      <motion.svg
        width="48"
        height="14"
        viewBox="0 0 48 14"
        style={{ position: "absolute", left: "8%", top: "62%", opacity: 0.22 }}
        animate={{ opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <path
          d="M0 7 Q6 2 12 7 T24 7 T36 7 T48 7"
          fill="none"
          stroke="rgba(200,190,230,0.9)"
          strokeWidth="0.8"
        />
      </motion.svg>

      <motion.span
        animate={{ opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
        style={{
          position: "absolute",
          right: "14%",
          top: "22%",
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          color: "rgba(210,200,230,0.5)",
          fontFamily: "var(--font-serif)",
        }}
      >
        멈춤
      </motion.span>

      <motion.span
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1.2 }}
        style={{
          position: "absolute",
          left: "20%",
          top: "18%",
          fontSize: "0.52rem",
          letterSpacing: "0.25em",
          color: "rgba(195,188,220,0.45)",
          fontFamily: "var(--font-serif)",
        }}
      >
        다시
      </motion.span>

      <motion.span
        animate={{ opacity: [0.11, 0.21, 0.11] }}
        transition={{ duration: 5.5, repeat: Infinity, delay: 0.3 }}
        style={{
          position: "absolute",
          right: "26%",
          bottom: "12%",
          fontSize: "0.5rem",
          color: "rgba(180,175,205,0.4)",
          fontFamily: "var(--font-serif)",
        }}
      >
        한 번
      </motion.span>

      {/* Warm micro-dot */}
      <motion.div
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.15, 1] }}
        transition={{ duration: 4.2, repeat: Infinity }}
        style={{
          position: "absolute",
          left: "44%",
          top: "8%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "rgba(255,190,130,0.55)",
          boxShadow: "0 0 12px rgba(255,160,90,0.35)",
        }}
      />

      {/* Subtitle-like hairline */}
      <motion.div
        animate={{ opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: "absolute",
          left: "32%",
          bottom: "6%",
          width: "36%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(200,190,220,0.35), transparent)",
        }}
      />
    </div>
  );
}

/* ─── Hints for chapters ahead — ultra-light; readability optional ─ */
function ScreenTeaserHints() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "16%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "78%",
        height: "34%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {/* variety — ㅋㅋㅋ whisper */}
      <motion.span
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 5.5, repeat: Infinity }}
        style={{
          position: "absolute",
          left: "6%",
          top: "38%",
          fontSize: "0.75rem",
          fontWeight: 300,
          color: "rgba(210,200,230,0.35)",
          transform: "rotate(-6deg)",
          filter: "blur(0.5px)",
        }}
      >
        ㅋㅋㅋ
      </motion.span>

      {/* YouTube intro cadence */}
      <motion.span
        animate={{ opacity: [0.07, 0.15, 0.07] }}
        transition={{ duration: 6.2, repeat: Infinity, delay: 0.8 }}
        style={{
          position: "absolute",
          right: "10%",
          top: "28%",
          fontSize: "0.52rem",
          letterSpacing: "0.06em",
          color: "rgba(190,185,215,0.4)",
          fontFamily: "var(--font-serif)",
        }}
      >
        오늘은요
      </motion.span>

      {/* drama / longing */}
      <motion.span
        animate={{ opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, delay: 0.2 }}
        style={{
          position: "absolute",
          left: "22%",
          bottom: "18%",
          fontSize: "0.5rem",
          letterSpacing: "0.04em",
          color: "rgba(200,185,210,0.38)",
          fontFamily: "var(--font-serif)",
        }}
      >
        보고 싶다
      </motion.span>

      {/* podcast waveform snippet */}
      <motion.svg
        width="36"
        height="12"
        viewBox="0 0 36 12"
        style={{ position: "absolute", right: "22%", bottom: "22%", opacity: 0.18 }}
        animate={{ opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      >
        <path
          d="M0 6 L4 3 L8 9 L12 2 L16 10 L20 4 L24 8 L28 1 L32 7 L36 5"
          fill="none"
          stroke="rgba(180,200,240,0.8)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* K-pop pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.45, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: "30%",
          top: "48%",
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: "1px solid rgba(255,150,180,0.25)",
          boxShadow: "0 0 14px rgba(255,130,160,0.15)",
        }}
      />
    </div>
  );
}

/* ─── Dust — fewer points, feels like depth not wallpaper ─ */
function DustField() {
  const dust = [
    { x: 22, y: 12, s: 0.7 },
    { x: 78, y: 16, s: 0.6 },
    { x: 12, y: 44, s: 0.5 },
    { x: 88, y: 38, s: 0.6 },
    { x: 52, y: 10, s: 0.45 },
    { x: 34, y: 28, s: 0.5 },
  ];
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2 }}>
      {dust.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.12, 0.38, 0.12] }}
          transition={{
            duration: 3.5 + (i % 3) * 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35,
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: 1.1 + s.s,
            height: 1.1 + s.s,
            borderRadius: "50%",
            background: "rgba(210,200,225,0.55)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Faint horizontal bridge (screen → title) ─ */
function ReturnBridgeLine() {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: [0.14, 0.24, 0.14] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        left: "10%",
        right: "10%",
        top: "48%",
        height: 1,
        pointerEvents: "none",
        zIndex: 2,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(140,160,210,0.15) 20%, rgba(220,170,130,0.18) 50%, rgba(140,160,210,0.14) 80%, transparent 100%)",
        filter: "blur(0.45px)",
      }}
    />
  );
}

/* ─── Three lights: drift inward toward title (bottom-center), loop ─ */
function ReturningLights() {
  const dots = [
    {
      left: ["26%", "33%", "29%", "26%"],
      top: ["69%", "76%", "72%", "69%"],
      color: "rgba(255,180,90,0.78)",
    },
    {
      left: ["50%", "48%", "51%", "50%"],
      top: ["66%", "74%", "69%", "66%"],
      color: "rgba(255,140,110,0.78)",
    },
    {
      left: ["74%", "67%", "71%", "74%"],
      top: ["70%", "77%", "73%", "70%"],
      color: "rgba(255,210,140,0.78)",
    },
  ];
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.45, 0.88, 0.45],
            scale: [0.95, 1.07, 0.95],
            left: d.left,
            top: d.top,
          }}
          transition={{
            duration: 8 + i * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.45,
          }}
          style={{
            position: "absolute",
            left: d.left[0],
            top: d.top[0],
            transform: "translate(-50%, -50%)",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: d.color,
            boxShadow: `0 0 14px ${d.color}, 0 0 32px ${d.color}`,
          }}
        />
      ))}
    </div>
  );
}
