"use client";

import React, { useMemo } from "react";

/* ════════════════════════════════════════════════════════════
   STARFIELD — twinkling stars that flow / drift across the sky
   (oscillating translations + distant drifting motes).
   Keyframes live in globals.css; inline styles use fixed strings
   + longhand animation props so SSR/CSR markup matches (hydration).
================================================================ */

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  hue: "cool" | "warm";
  flowDx: number;
  flowDy: number;
  flowDur: number;
};

function generateStars(count: number, seed = 1): Star[] {
  const stars: Star[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 28 + rand() * 92;
    stars.push({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 0.6 + rand() * 1.6,
      duration: 1.6 + rand() * 2.8,
      delay: rand() * 6,
      hue: rand() > 0.78 ? "warm" : "cool",
      flowDx: Math.cos(angle) * dist,
      flowDy: Math.sin(angle) * dist,
      flowDur: 6 + rand() * 11,
    });
  }
  return stars;
}

/** Stable string formatting for identical server/client style attributes */
function pct4(n: number): string {
  return `${n.toFixed(4)}%`;
}
function px3(n: number): string {
  return `${n.toFixed(3)}px`;
}

export default function StarField() {
  const stars = useMemo(() => generateStars(140, 7), []);
  const drift = useMemo(() => generateStars(28, 99), []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Deep base gradient — slight nebula */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 30% 25%, rgba(80,60,140,0.18) 0%, transparent 60%)," +
            "radial-gradient(ellipse 70% 50% at 70% 80%, rgba(140,70,90,0.14) 0%, transparent 65%)," +
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(60,80,140,0.10) 0%, transparent 65%)," +
            "linear-gradient(180deg, #06051a 0%, #08071e 60%, #050414 100%)",
        }}
      />

      {/* Twinkling stars — outer wrapper flows, inner core twinkles */}
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: pct4(s.x),
            top: pct4(s.y),
            width: px3(s.size),
            height: px3(s.size),
            animationName: "atlas-star-flow",
            animationDuration: `${s.flowDur.toFixed(4)}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationFillMode: "none",
            animationPlayState: "running",
            animationDelay: `${(s.delay * 0.08).toFixed(4)}s`,
            ...({
              "--fx": px3(s.flowDx),
              "--fy": px3(s.flowDy),
            } as React.CSSProperties),
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background:
                s.hue === "warm"
                  ? "rgba(255,210,160,0.85)"
                  : "rgba(220,225,250,0.85)",
              boxShadow:
                s.hue === "warm"
                  ? "0 0 4px rgba(255,180,110,0.6)"
                  : "0 0 3px rgba(200,210,240,0.5)",
              animationName: "atlas-twinkle",
              animationDuration: `${s.duration.toFixed(4)}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationFillMode: "none",
              animationPlayState: "running",
              animationDelay: `${s.delay.toFixed(4)}s`,
            }}
          />
        </div>
      ))}

      {/* Larger flowing motes — cross farther */}
      {drift.map(d => (
        <div
          key={`drift-${d.id}`}
          style={{
            position: "absolute",
            left: pct4(d.x),
            top: pct4(d.y),
            width: px3(d.size * 1.6),
            height: px3(d.size * 1.6),
            borderRadius: "50%",
            background:
              d.hue === "warm"
                ? "rgba(255,200,140,0.55)"
                : "rgba(180,200,235,0.55)",
            filter: "blur(0.5px)",
            animationName: "atlas-drift",
            animationDuration: `${(d.duration * 1.15 + 4.5).toFixed(4)}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationFillMode: "none",
            animationPlayState: "running",
            animationDelay: `${(d.delay * 1.2).toFixed(4)}s`,
            ...({
              "--mx": `${52 + (d.id % 11) * 34}px`,
              "--my": `${-(48 + (d.id % 9) * 38)}px`,
            } as React.CSSProperties),
          }}
        />
      ))}

      {/* Faint constellation lines — slow crawl */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          animationName: "atlas-lines-pan",
          animationDuration: "14s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationFillMode: "none",
          animationPlayState: "running",
        }}
      >
        <line x1="12%" y1="22%" x2="28%" y2="14%" stroke="rgba(180,200,235,0.7)" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="78%" y1="38%" x2="86%" y2="22%" stroke="rgba(180,200,235,0.7)" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="68%" y1="78%" x2="84%" y2="84%" stroke="rgba(255,200,140,0.6)" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="20%" y1="80%" x2="36%" y2="86%" stroke="rgba(180,200,235,0.6)" strokeWidth="0.4" strokeDasharray="2 4" />
      </svg>
    </div>
  );
}
