"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Non-title ambient motion layers mirrored from each book’s opened cover,
 * scaled for the atlas carousel thumbnails (no staged title-line animations).
 */
export default function CarouselCoverAmbient({ bookId }: { bookId: string }) {
  switch (bookId) {
    case "book-one":
      return <FxBookOne />;
    case "book-two":
      return <FxBookTwo />;
    case "book-three":
      return <FxBookThree />;
    case "book-four":
      return <FxBookFour />;
    default:
      return null;
  }
}

/* ─── Book I — upper mist + twinkling star dust (subset of CoverPage) ─ */
function FxBookOne() {
  const dots = React.useMemo(
    () =>
      [
        { x: 12, y: 8, s: 0.65, warm: true },
        { x: 26, y: 14, s: 0.55, warm: false },
        { x: 44, y: 6, s: 0.85, warm: true },
        { x: 58, y: 18, s: 0.45, warm: true },
        { x: 72, y: 10, s: 0.7, warm: true },
        { x: 88, y: 16, s: 0.5, warm: false },
        { x: 18, y: 28, s: 0.52, warm: true },
        { x: 50, y: 22, s: 0.95, warm: true },
        { x: 82, y: 26, s: 0.48, warm: true },
        { x: 34, y: 38, s: 0.42, warm: false },
        { x: 66, y: 34, s: 0.78, warm: true },
        { x: 50, y: 42, s: 0.88, warm: true },
        { x: 22, y: 48, s: 0.36, warm: true },
        { x: 76, y: 44, s: 0.62, warm: false },
        { x: 48, y: 52, s: 0.4, warm: true },
        { x: 50, y: 30, s: 0.28, warm: false },
        { x: 42, y: 24, s: 0.22, warm: true },
        { x: 58, y: 36, s: 0.24, warm: true },
      ],
    [],
  );

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 92% 58% at 50% 18%, rgba(255,195,130,0.16) 0%, transparent 58%)," +
            "radial-gradient(ellipse 55% 42% at 22% 28%, rgba(255,210,170,0.09) 0%, transparent 52%)," +
            "radial-gradient(ellipse 48% 38% at 78% 22%, rgba(190,175,230,0.07) 0%, transparent 48%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "76%",
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {dots.map((d, i) => {
          const px = Math.max(2.2, 2 + d.s * 1.2);
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
                  ? "0 0 8px rgba(255,215,150,0.85), 0 0 18px rgba(255,175,95,0.45)"
                  : "0 0 8px rgba(215,225,255,0.75), 0 0 16px rgba(185,200,255,0.4)",
              }}
            />
          );
        })}
      </div>
    </>
  );
}

/* ─── Book II — stars, lantern sway/glow, rising embers, horizon ───── */
function FxBookTwo() {
  const stars = [
    { x: 12, y: 14, s: 1 },
    { x: 28, y: 8, s: 1 },
    { x: 84, y: 12, s: 1 },
    { x: 70, y: 22, s: 0.5 },
    { x: 18, y: 34, s: 0.5 },
    { x: 56, y: 14, s: 0.5 },
  ];
  const embers = [
    { x: 32, y: 42, d: 6.5, delay: 0 },
    { x: 52, y: 58, d: 8, delay: 1.4 },
    { x: 70, y: 40, d: 7, delay: 2.9 },
    { x: 24, y: 52, d: 9, delay: 0.6 },
    { x: 62, y: 46, d: 8, delay: 3.8 },
  ];

  return (
    <>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
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
              width: 1.2 + s.s,
              height: 1.2 + s.s,
              borderRadius: "50%",
              background: "rgba(220,210,235,0.7)",
            }}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -4,
          left: "50%",
          transform: "translateX(-50%) scale(0.36)",
          transformOrigin: "top center",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 1,
            height: 88,
            background: "linear-gradient(to bottom, transparent, rgba(180,130,80,0.45))",
            margin: "0 auto",
          }}
        />
        <motion.div
          animate={{
            opacity: [0.92, 1, 0.94, 1, 0.9, 1],
            y: [0, 0.6, 0, -0.4, 0],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", width: 38, height: 50, margin: "0 auto" }}
        >
          <div
            style={{
              position: "absolute",
              inset: -36,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,180,90,0.32) 0%, rgba(255,140,60,0.14) 38%, transparent 72%)",
              filter: "blur(2px)",
            }}
          />
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
                "0 0 18px rgba(255,170,80,0.45), inset 0 0 8px rgba(255,220,150,0.55)",
              border: "0.5px solid rgba(180,110,55,0.7)",
            }}
          />
        </motion.div>
      </div>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        {embers.map((p, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -72, opacity: [0, 0.85, 0.35, 0] }}
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
              boxShadow: "0 0 5px rgba(255,180,90,0.65)",
            }}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          bottom: "26%",
          height: 1,
          zIndex: 1,
          background:
            "linear-gradient(to right, transparent, rgba(220,160,90,0.42) 50%, transparent)",
          filter: "blur(0.4px)",
        }}
      />
    </>
  );
}

/* ─── Book III — pulsing screen glass, dust, bridge, lights, non-text traces */
function FxBookThree() {
  const dust = [
    { x: 22, y: 12, s: 0.7 },
    { x: 78, y: 16, s: 0.6 },
    { x: 12, y: 44, s: 0.5 },
    { x: 52, y: 10, s: 0.45 },
    { x: 34, y: 28, s: 0.5 },
  ];
  const lights = [
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
    <>
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
          filter: "blur(0.6px)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 5,
            background:
              "linear-gradient(180deg, rgba(90,120,200,0.11) 0%, rgba(55,65,130,0.07) 38%, rgba(35,28,55,0.06) 100%)",
            boxShadow:
              "0 0 28px rgba(100,130,220,0.12), inset 0 -18px 28px rgba(180,70,40,0.12), inset 0 12px 28px rgba(80,120,200,0.10)",
          }}
        />
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
      </motion.div>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
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
              width: 1 + s.s,
              height: 1 + s.s,
              borderRadius: "50%",
              background: "rgba(210,200,225,0.55)",
            }}
          />
        ))}
      </div>

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
          zIndex: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(140,160,210,0.15) 20%, rgba(220,170,130,0.18) 50%, rgba(140,160,210,0.14) 80%, transparent 100%)",
          filter: "blur(0.45px)",
        }}
      />

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        {lights.map((d, i) => (
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
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: d.color,
              boxShadow: `0 0 10px ${d.color}, 0 0 22px ${d.color}`,
            }}
          />
        ))}
      </div>

      {/* Waveform + micro-dot + hairline only (no floating text) */}
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
          zIndex: 1,
        }}
      >
        <motion.svg
          width="40"
          height="12"
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
        <motion.div
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.15, 1] }}
          transition={{ duration: 4.2, repeat: Infinity }}
          style={{
            position: "absolute",
            left: "44%",
            top: "8%",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(255,190,130,0.55)",
            boxShadow: "0 0 10px rgba(255,160,90,0.35)",
          }}
        />
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{
            position: "absolute",
            left: "32%",
            bottom: "6%",
            width: "36%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(200,190,220,0.35), transparent)",
          }}
        />
      </div>
    </>
  );
}

/* ─── Book IV — filigree, dust, flickering diya (scaled), horizon ──── */
function FxBookFour() {
  const dust = [
    { x: 14, y: 18, s: 1 },
    { x: 28, y: 10, s: 0.6 },
    { x: 86, y: 14, s: 1 },
    { x: 70, y: 22, s: 0.5 },
    { x: 38, y: 8, s: 0.5 },
    { x: 56, y: 14, s: 0.5 },
  ];

  return (
    <>
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        viewBox="0 0 480 660"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.28,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient id="carousel-bf-thread" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,180,100,0)" />
            <stop offset="50%" stopColor="rgba(255,180,100,0.65)" />
            <stop offset="100%" stopColor="rgba(255,180,100,0)" />
          </linearGradient>
        </defs>
        <path
          d="M -20 120 Q 100 80 220 120 T 460 120 T 700 100"
          stroke="url(#carousel-bf-thread)"
          strokeWidth="0.7"
          fill="none"
        />
        <path
          d="M -20 200 Q 140 240 280 200 T 500 220"
          stroke="url(#carousel-bf-thread)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M -20 280 Q 120 250 250 290 T 480 280"
          stroke="url(#carousel-bf-thread)"
          strokeWidth="0.6"
          fill="none"
        />
      </svg>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
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
              width: 1.2 + s.s,
              height: 1.2 + s.s,
              borderRadius: "50%",
              background: "rgba(255,220,180,0.6)",
            }}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "30%",
          left: "50%",
          transform: "translateX(-50%) scale(0.42)",
          transformOrigin: "bottom center",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ opacity: [0.55, 0.85, 0.62, 0.92, 0.6] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "50%",
            transform: "translate(-50%, 50%)",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,170,80,0.35) 0%, rgba(255,140,60,0.14) 35%, transparent 70%)",
            filter: "blur(2px)",
            mixBlendMode: "screen",
          }}
        />
        <div style={{ position: "relative", width: 60, height: 36 }}>
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
              boxShadow: "0 0 12px rgba(255,170,80,0.85), 0 0 22px rgba(255,140,60,0.55)",
            }}
          />
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
              boxShadow: "0 3px 10px rgba(0,0,0,0.65), inset 0 0 5px rgba(0,0,0,0.35)",
            }}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          bottom: "26%",
          height: 1,
          zIndex: 1,
          background:
            "linear-gradient(to right, transparent, rgba(255,180,100,0.42) 50%, transparent)",
          filter: "blur(0.4px)",
        }}
      />
    </>
  );
}
