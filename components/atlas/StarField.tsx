"use client";

import React, { useMemo } from "react";

/* ════════════════════════════════════════════════════════════
   STARFIELD — twinkling stars that flow / drift across the sky
   (oscillating translations + distant drifting motes).
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
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `atlas-star-flow ${s.flowDur}s ease-in-out infinite alternate`,
            animationDelay: `${s.delay * 0.08}s`,
            ...({
              "--fx": `${s.flowDx}px`,
              "--fy": `${s.flowDy}px`,
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
              animation: `atlas-twinkle ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
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
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size * 1.6,
            height: d.size * 1.6,
            borderRadius: "50%",
            background:
              d.hue === "warm"
                ? "rgba(255,200,140,0.55)"
                : "rgba(180,200,235,0.55)",
            filter: "blur(0.5px)",
            animation: `atlas-drift ${d.duration * 1.15 + 4.5}s linear infinite`,
            animationDelay: `${d.delay * 1.2}s`,
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
          animation: "atlas-lines-pan 14s ease-in-out infinite",
        }}
      >
        <line x1="12%" y1="22%" x2="28%" y2="14%" stroke="rgba(180,200,235,0.7)" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="78%" y1="38%" x2="86%" y2="22%" stroke="rgba(180,200,235,0.7)" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="68%" y1="78%" x2="84%" y2="84%" stroke="rgba(255,200,140,0.6)" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="20%" y1="80%" x2="36%" y2="86%" stroke="rgba(180,200,235,0.6)" strokeWidth="0.4" strokeDasharray="2 4" />
      </svg>

      <style jsx global>{`
        @keyframes atlas-twinkle {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.05);
          }
        }
        @keyframes atlas-star-flow {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--fx), var(--fy));
          }
        }
        @keyframes atlas-drift {
          0% {
            transform: translate(-50%, -50%) translate(-22%, 18%);
            opacity: 0;
          }
          10% {
            opacity: 0.72;
          }
          90% {
            opacity: 0.48;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--mx), var(--my));
            opacity: 0;
          }
        }
        @keyframes atlas-lines-pan {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-3.2%, 2.2%);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}
