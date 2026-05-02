"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import PageShell from "./PageShell";
import { InteractionHint } from "./InteractionHint";

/* ════════════════════════════════════════════════════════════
   CONTENT
════════════════════════════════════════════════════════════ */
const TITLE = "A Stroke That Stays";
const LINE_A = "The hand moves once.";
const LINE_B = "The ink spreads.";
const LINE_C = "We follow it.";

/* Rice-paper body copy — warm brown ink, strong contrast, still soft */
const TEXT_ON_PAPER = "rgba(42, 32, 26, 0.94)";

/* ════════════════════════════════════════════════════════════
   INK CONSTANTS
════════════════════════════════════════════════════════════ */
const INK_COLOR = "rgba(28, 18, 8, 0.58)";
const DOT_BASE = 11;
const DOT_BLUR = 3.5;
const SPREAD_GROW = 1.12;
const MIN_DIST = 4;

/* left-page animated character: 心 */
const YONG_STROKES = [
  {
    key: "dot",
    d: "M 150 60 C 158 50, 172 50, 180 60 C 172 68, 160 70, 150 60 Z",
    delay: "0.4s",
    duration: "0.4s",
  },
  {
    key: "heng",
    d: "M 110 110 C 150 100, 210 100, 250 110 C 245 118, 220 120, 180 118 C 140 116, 120 116, 110 110 Z",
    delay: "0.7s",
    duration: "0.5s",
  },
  {
    key: "shu",
    d: `
      M 180 110
      C 188 140, 190 180, 188 230
      C 186 280, 180 320, 170 350
      C 164 360, 156 368, 145 374
      C 142 366, 146 358, 152 350
      C 165 330, 170 290, 172 240
      C 174 190, 174 150, 180 110 Z
    `.replace(/\s+/g, " "),
    delay: "1.1s",
    duration: "1.0s",
  },
  {
    key: "left-heng",
    d: "M 170 180 C 154 176, 136 176, 118 182 C 122 188, 140 190, 170 184 Z",
    delay: "1.75s",
    duration: "0.4s",
  },
  {
    key: "pie",
    d: `
      M 170 190
      C 150 220, 120 250, 90 280
      C 70 300, 50 320, 30 340
      C 28 330, 32 320, 42 310
      C 70 285, 100 255, 130 220
      C 150 200, 165 192, 170 190 Z
    `.replace(/\s+/g, " "),
    delay: "2.0s",
    duration: "0.8s",
  },
  {
    key: "ti",
    d: "M 170 182 C 188 174, 214 170, 242 174 C 240 180, 224 186, 198 188 C 184 188, 174 186, 170 182 Z",
    delay: "2.3s",
    duration: "0.45s",
  },
  {
    key: "na",
    d: `
      M 182 192
      C 204 204, 232 224, 262 252
      C 286 274, 306 294, 322 314
      C 318 318, 310 318, 298 314
      C 266 298, 236 274, 202 238
      C 190 226, 184 208, 182 192 Z
    `.replace(/\s+/g, " "),
    delay: "2.7s",
    duration: "1.0s",
  },
];
const CHARACTER_TOTAL_END = 3.9;
/* ════════════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════════════ */
interface PageProps {
  side?: "left" | "right";
}

const StrokePage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "right" }, ref) => {
    if (side === "left") {
      return <StrokePageLeft forwardedRef={ref} />;
    }
    return <StrokePageRight forwardedRef={ref} />;
  }
);

StrokePage.displayName = "StrokePage";
export default StrokePage;

/* ════════════════════════════════════════════════════════════
   LEFT PAGE
════════════════════════════════════════════════════════════ */
function StrokePageLeft({
  forwardedRef,
}: {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  const [showNarrative, setShowNarrative] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowNarrative(true),
      YONG_STROKES.reduce((acc, stroke) => acc + parseFloat(stroke.duration), 0) * 1000 + 350
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={9}
      className="page--calligraphy"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "1rem",
          position: "relative",
          zIndex: 4,
        }}
      >
        <h2
          className="page-title-spread"
          style={{
            opacity: 0,
            animation: "titleFadeUp 1.1s ease forwards",
          }}
        >
          {TITLE}
        </h2>

        <div
          className="page-rule"
          style={{
            opacity: 0,
            animation: "softFadeIn 1s ease forwards",
            animationDelay: "0.35s",
          }}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "11.5%",
          top: "17%",
          width: 290,
          height: 430,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 280 360"
          style={{
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <defs>
            <filter id="inkTextureLeft" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.88"
                numOctaves="2"
                seed="7"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="0.95"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <filter id="softBlurLeft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.2" />
            </filter>

            <filter id="inkFeatherLeft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.15" />
            </filter>
          </defs>

          <ellipse
            cx="138"
            cy="184"
            rx="116"
            ry="138"
            fill="rgba(160,110,80,0.055)"
            filter="url(#softBlurLeft)"
            opacity={0}
            style={{
              animation: "softFadeIn 1.6s ease forwards",
              animationDelay: "0.25s",
            }}
          />

          {YONG_STROKES.map((stroke, i) => (
            <g key={stroke.key}>
              <path
                d={stroke.d}
                fill="rgba(28,18,8,0.12)"
                filter="url(#softBlurLeft)"
                opacity={0}
                style={{
                  transformOrigin: "center",
                  animation: `brushBleed ${stroke.duration} ease forwards`,
                  animationDelay: stroke.delay,
                }}
              />

              <path
                d={stroke.d}
                fill="rgba(28,18,8,0.42)"
                filter="url(#inkFeatherLeft)"
                opacity={0}
                style={{
                  transformOrigin: "center",
                  animation: `brushReveal ${stroke.duration} cubic-bezier(0.66, 0.02, 0.24, 0.98) forwards`,
                  animationDelay: stroke.delay,
                }}
              />

              <path
                d={stroke.d}
                fill="rgba(28,18,8,0.72)"
                filter="url(#inkTextureLeft)"
                opacity={0}
                style={{
                  transformOrigin: "center",
                  animation: `brushReveal ${stroke.duration} cubic-bezier(0.66, 0.02, 0.24, 0.98) forwards, coreSettle 0.9s ease forwards`,
                  animationDelay: `${parseFloat(stroke.delay) + 0.04}s, ${parseFloat(stroke.delay) + 0.28}s`,
                }}
              />

              {(i === 0 || i === 1 || i === 3) && (
                <circle
                  cx={i === 0 ? 104 : i === 1 ? 168 : 135}
                  cy={i === 0 ? 82 : i === 1 ? 101 : 109}
                  r={i === 3 ? 10 : 8}
                  fill="rgba(28,18,8,0.11)"
                  filter="url(#softBlurLeft)"
                  opacity={0}
                  style={{
                    animation: `bloomFade 1.3s ease forwards`,
                    animationDelay: `${parseFloat(stroke.delay) + 0.12}s`,
                  }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: "16.5%",
          top: "78%",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            letterSpacing: "0.04em",
            lineHeight: 1.8,
            color: TEXT_ON_PAPER,
            opacity: showNarrative ? 0.92 : 0,
            transform: showNarrative ? "translateY(0)" : "translateY(8px)",
            filter: showNarrative ? "blur(0)" : "blur(2px)",
            transition: "opacity 1.2s ease, transform 1.2s ease, filter 1.2s ease",
            margin: 0,
          }}
        >
          A mark becomes a heart,
          <br />
          and the heart learns to stay.
        </p>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 72% 62% at 52% 58%, rgba(160,110,80,0.08) 0%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <style jsx>{`
        @keyframes brushReveal {
          0% {
            opacity: 0;
            clip-path: inset(0 0 100% 0);
            transform: translateY(-3px) scale(0.98);
          }
          35% {
            opacity: 0.92;
          }
          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes brushBleed {
          0% {
            opacity: 0;
            transform: scale(0.94);
          }
          100% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @keyframes coreSettle {
          0% {
            opacity: 0.62;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes bloomFade {
          0% {
            opacity: 0;
            transform: scale(0.62);
          }
          40% {
            opacity: 1;
          }
          100% {
            opacity: 0.68;
            transform: scale(1.32);
          }
        }

        @keyframes titleFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes softFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT PAGE
════════════════════════════════════════════════════════════ */
function StrokePageRight({
  forwardedRef,
}: {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={10}
      className="page--calligraphy"
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 82% 66% at 48% 52%, rgba(160,110,80,0.07) 0%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <InkCanvas />

      <InteractionHint
        emphasis
        style={{
          bottom: "3.45rem",
          left: "2.35rem",
          zIndex: 3,
          color: "rgba(48, 34, 26, 0.92)",
        }}
      >
        Draw your first stroke
      </InteractionHint>

      <div
        style={{
          position: "absolute",
          bottom: "3.5rem",
          right: "2.5rem",
          textAlign: "right",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {[LINE_A, LINE_B, LINE_C].map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.72rem",
              lineHeight: 2.1,
              letterSpacing: "0.07em",
              color: TEXT_ON_PAPER,
              opacity: 1,
              margin: 0,
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   INK CANVAS
════════════════════════════════════════════════════════════ */
function InkCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const placeBrushStamp = useCallback(
    (
      x: number,
      y: number,
      speed: number,
      angle: number,
      isStart = false
    ) => {
      const container = containerRef.current;
      if (!container) return;

      const speedFactor = Math.max(0.68, 1 - speed * 0.0045);

      const major = DOT_BASE * 1.55 * speedFactor;
      const minor = DOT_BASE * 0.72 * speedFactor;

      const finalMajor = major * SPREAD_GROW;
      const finalMinor = minor * 1.08;

      const stamp = document.createElement("div");
      stamp.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${major}px;
        height: ${minor}px;
        transform: translate(-50%, -50%) rotate(${angle}rad);
        pointer-events: none;
        opacity: 0.96;
        z-index: 1;
      `;

      const bleed = document.createElement("div");
      bleed.style.cssText = `
        position: absolute;
        width: ${major * 1.42}px;
        height: ${minor * 1.55}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 55% 45% 52% 48% / 58% 42% 56% 44%;
        background: rgba(28, 18, 8, 0.12);
        filter: blur(4.8px);
      `;

      const body = document.createElement("div");
      body.style.cssText = `
        position: absolute;
        width: ${major}px;
        height: ${minor}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 58% 42% 60% 40% / 52% 48% 54% 46%;
        background: rgba(28, 18, 8, 0.42);
        filter: blur(0.9px);
      `;

      const core = document.createElement("div");
      core.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: ${major * 0.78}px;
        height: ${minor * 0.58}px;
        transform: translate(-50%, -50%);
        border-radius: 62% 38% 60% 40% / 50% 50% 56% 44%;
        background: rgba(28, 18, 8, 0.72);
        filter: blur(0.45px);
      `;

      stamp.appendChild(bleed);
      stamp.appendChild(body);
      stamp.appendChild(core);

      if (isStart) {
        const bloom = document.createElement("div");
        bloom.style.cssText = `
          position: absolute;
          left: 50%;
          top: 50%;
          width: ${major * 1.18}px;
          height: ${major * 1.18}px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: rgba(28, 18, 8, 0.10);
          filter: blur(6px);
          opacity: 0.8;
        `;
        stamp.appendChild(bloom);
      }

      container.appendChild(stamp);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stamp.style.width = `${finalMajor}px`;
          stamp.style.height = `${finalMinor}px`;
          stamp.style.opacity = "0.98";
        });
      });
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDrawingRef.current = true;
      containerRef.current?.setPointerCapture(e.pointerId);

      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      lastPosRef.current = { x, y };

      placeBrushStamp(x, y, 0, Math.PI / 2, true);
      placeBrushStamp(x + 1.5, y + 1.5, 0, Math.PI / 2, false);
    },
    [placeBrushStamp]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDrawingRef.current) return;

      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const last = lastPosRef.current;

      if (!last) {
        lastPosRef.current = { x, y };
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MIN_DIST) return;

      const speed = dist;
      const angle = Math.atan2(dy, dx);
      const steps = Math.floor(dist / MIN_DIST);

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const px = last.x + dx * t;
        const py = last.y + dy * t;
        placeBrushStamp(px, py, speed, angle, false);
      }

      lastPosRef.current = { x, y };
    },
    [placeBrushStamp]
  );

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      data-book-interactive
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
      style={{
        position: "absolute",
        inset: 0,
        cursor: "crosshair",
        overflow: "hidden",
        zIndex: 1,
        background:
          "linear-gradient(to bottom, transparent 49.6%, rgba(160,110,80,0.02) 50%, transparent 50.4%)",
      }}
    />
  );
}