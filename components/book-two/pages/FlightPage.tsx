"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 1 — THE FLIGHT BETWEEN TWO HOMES
   ────────────────────────────────────────────────────────────
   Each page is one airplane window in the same cabin.

     LEFT WINDOW  — approaching home. Warm city lights below
                    the wing, lit cloud bank, the suggestion of
                    a coastline. Words bloom near the puck:
                    home · family · Tết · kitchen light · old songs.

     RIGHT WINDOW — returning to the U.S. A cold grid of
                    city lights, a runway line, an airport-feel
                    of distance. Words bloom near the puck:
                    luggage · silence · return ticket · apartment
                    · back again.

   A faint dashed flight arc rises across the spread between
   the two windows. As both pucks are pulled toward the spine,
   "convergence" rises and a final reveal line appears.
════════════════════════════════════════════════════════════ */

const NARR_TOP = "Every flight changed\nthe room inside me.";
const TRIGGER_L = "Going home felt light.";
const TRIGGER_R = "Leaving again\nmade even joy feel heavy.";
const REVEAL_L = "Home was not one place anymore.";
const REVEAL_R = "It lived somewhere\nbetween arrival and return.";
const HINT = "Drag the light between two homes";

// ─── Memory fragments — left (warm / home) ──────────────────
const WARM_FRAGS = [
  { text: "home",          x: 50, y: 26 },
  { text: "family",        x: 26, y: 42 },
  { text: "Tết",           x: 70, y: 44 },
  { text: "kitchen light", x: 36, y: 70 },
  { text: "old songs",     x: 64, y: 72 },
];

// ─── Distance fragments — right (cold / away) ───────────────
const COLD_FRAGS = [
  { text: "luggage",       x: 30, y: 26 },
  { text: "return ticket", x: 64, y: 30 },
  { text: "apartment",     x: 30, y: 56 },
  { text: "silence",       x: 66, y: 60 },
  { text: "back again",    x: 50, y: 78 },
];

/* ════════════════════════════════════════════════════════════
   SHARED STATE — both pucks live in the same module store so
   either page can react to the other side's drag.
════════════════════════════════════════════════════════════ */
type Puck = { x: number; y: number; touched: boolean };
let _left: Puck = { x: 0.32, y: 0.5, touched: false };
let _right: Puck = { x: 0.62, y: 0.5, touched: false };
const _subs = new Set<() => void>();
function _notify() { _subs.forEach(fn => fn()); }
function _setLeft(next: Puck) { _left = next; _notify(); }
function _setRight(next: Puck) { _right = next; _notify(); }
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _left = { x: 0.32, y: 0.5, touched: false };
    _right = { x: 0.62, y: 0.5, touched: false };
    _notify();
  });
}

function useFlight() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return { left: _left, right: _right };
}

// Convergence: 0..1, rises as both pucks are pulled toward the spine.
// Left puck "toward spine" means x → 1 (right edge of left window).
// Right puck "toward spine" means x → 0 (left edge of right window).
function getConvergence(left: Puck, right: Puck) {
  if (!left.touched || !right.touched) return 0;
  const lScore = Math.max(0, (left.x - 0.5) * 2);   // 0 at centre, 1 at spine
  const rScore = Math.max(0, (0.5 - right.x) * 2);
  return Math.min(1, lScore * rScore * 1.4);
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════════════ */
interface PageProps { side?: "left" | "right" }

const FlightPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <FlightLeft forwardedRef={ref} />;
    return <FlightRight forwardedRef={ref} />;
  }
);
FlightPage.displayName = "FlightPage";
export default FlightPage;

/* ════════════════════════════════════════════════════════════
   PER-PAGE DRAG HOOK — writes to the shared store
════════════════════════════════════════════════════════════ */
function useLightDrag(side: "left" | "right") {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const writer = side === "left" ? _setLeft : _setRight;
  const initial = side === "left" ? _left : _right;

  const setFromEvent = useCallback((cx: number, cy: number) => {
    const el = areaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    const y = Math.max(0, Math.min(1, (cy - r.top) / r.height));
    writer({ x, y, touched: true });
  }, [writer]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setActive(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromEvent(e.clientX, e.clientY);
  }, [setFromEvent]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!active) return;
    setFromEvent(e.clientX, e.clientY);
  }, [active, setFromEvent]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setActive(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  return { areaRef, initial, onPointerDown, onPointerMove, onPointerUp };
}

/* ════════════════════════════════════════════════════════════
   LEFT — APPROACHING HOME
════════════════════════════════════════════════════════════ */
function FlightLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { left, right } = useFlight();
  const drag = useLightDrag("left");
  const conv = getConvergence(left, right);

  // Warmth grows as the left puck is pulled toward the spine (x → 1)
  const warmth = left.touched ? 0.4 + left.x * 0.6 : 0.2;

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={1}
      style={{ background: "#070611" }}
    >
      <CabinBackdrop side="left" />
      <FlightArc side="left" left={left} right={right} />

      {/* Outside view — warm city + lit clouds */}
      <HomeView warmth={warmth} />

      {/* Top narrative */}
      <div
        style={{
          position: "absolute",
          top: "2.6rem",
          left: "2.5rem",
          right: "2.5rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 0.3, ease: "easeOut" }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
            lineHeight: 1.7,
            color: "rgba(240,220,190,0.92)",
            whiteSpace: "pre-line",
            textShadow: "0 0 18px rgba(0,0,0,0.85)",
            letterSpacing: "0.01em",
            maxWidth: "22ch",
          }}
        >
          {NARR_TOP}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.55, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
          style={{
            width: "2rem",
            height: 1,
            marginTop: "1rem",
            background: "rgba(220,170,100,0.55)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Window — drag area */}
      <Window
        side="left"
        areaRef={drag.areaRef}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        warmth={warmth}
      >
        {/* Inside the window: warm city silhouette + memory words */}
        <InsideWindowHome warmth={warmth} />
        <Fragments
          frags={WARM_FRAGS}
          light={left}
          touched={left.touched}
          color="rgba(255,210,140,0.94)"
          glow="rgba(255,170,80,0.6)"
        />
        <LightPuck x={left.x} y={left.y} warm />
      </Window>

      {/* Bottom narrative — trigger / reveal */}
      <BottomLine
        side="left"
        triggerVisible={left.touched && conv < 0.4}
        revealVisible={conv >= 0.4}
        triggerText={TRIGGER_L}
        revealText={REVEAL_L}
      />

      {!left.touched && (
        <InteractionHint
          emphasis
          style={{
            bottom: "2rem",
            left: "2.5rem",
            zIndex: 11,
            color: "rgba(245,210,160,0.85)",
          }}
        >
          {HINT}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT — RETURNING AWAY
════════════════════════════════════════════════════════════ */
function FlightRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { left, right } = useFlight();
  const drag = useLightDrag("right");
  const conv = getConvergence(left, right);

  // Coolness grows as the right puck is pulled toward the spine (x → 0)
  const coolness = right.touched ? 0.4 + (1 - right.x) * 0.6 : 0.2;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={2}
      style={{ background: "#070611" }}
    >
      <CabinBackdrop side="right" />
      <FlightArc side="right" left={left} right={right} />

      {/* Outside view — cold city grid + airport runway hint */}
      <AwayView coolness={coolness} />

      {/* Window — drag area */}
      <Window
        side="right"
        areaRef={drag.areaRef}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        warmth={0}
      >
        <InsideWindowAway coolness={coolness} />
        <Fragments
          frags={COLD_FRAGS}
          light={right}
          touched={right.touched}
          color="rgba(195,215,242,0.88)"
          glow="rgba(120,165,225,0.55)"
        />
        <LightPuck x={right.x} y={right.y} warm={false} />
      </Window>

      {/* Bottom narrative — trigger / reveal */}
      <BottomLine
        side="right"
        triggerVisible={right.touched && conv < 0.4}
        revealVisible={conv >= 0.4}
        triggerText={TRIGGER_R}
        revealText={REVEAL_R}
      />

      {!right.touched && (
        <InteractionHint
          emphasis
          style={{
            bottom: "2rem",
            right: "2.5rem",
            zIndex: 11,
            color: "rgba(200,215,240,0.82)",
            textAlign: "right",
          }}
        >
          {HINT}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   CABIN BACKDROP — the inside of the plane
   A subtle dark-navy gradient + a faint cabin wall arc that
   sells the page as the inside of an airplane.
════════════════════════════════════════════════════════════ */
function CabinBackdrop({ side }: { side: "left" | "right" }) {
  const fromSpine = side === "left" ? "100%" : "0%";
  return (
    <>
      {/* Cabin gradient — slightly lighter near the spine where overhead light spills */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 110% at ${fromSpine} 40%, #131019 0%, #07060d 70%)`,
        }}
      />
      {/* Cabin ceiling shadow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,8,16,0.85) 0%, transparent 16%, transparent 84%, rgba(10,8,16,0.78) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Tray-table / seat back hint near spine on each page */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          [side === "left" ? "right" : "left"]: 0,
          top: "60%",
          width: "40%",
          height: "40%",
          background:
            side === "left"
              ? "radial-gradient(ellipse 100% 60% at 100% 0%, rgba(20,18,28,0.6) 0%, transparent 60%)"
              : "radial-gradient(ellipse 100% 60% at 0% 0%, rgba(20,18,28,0.6) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   FLIGHT ARC — a faint dashed arc arching across the spread
   between the two windows. Each page renders its half so
   they meet at the spine.
════════════════════════════════════════════════════════════ */
function FlightArc({
  side,
  left,
  right,
}: {
  side: "left" | "right";
  left: Puck;
  right: Puck;
}) {
  // Convergence shifts a tiny glow point along the arc.
  const conv = getConvergence(left, right);
  const progress =
    side === "left"
      ? left.touched ? left.x * 0.5 : 0
      : right.touched ? 0.5 + (1 - right.x) * 0.5 : 0.5;

  // Coordinates inside this 480 × 660 page
  // Left page arc: from outer edge (x=24, y=520) up to spine top (x=480, y=120)
  // Right page arc: continues from spine top (x=0, y=120) down to outer edge (x=456, y=520)
  const path =
    side === "left"
      ? "M 24 520 Q 200 220 480 120"
      : "M 0 120 Q 280 220 456 520";

  // Endpoint of the local glow position along the path (rough lerp via bezier)
  const t = side === "left" ? progress * 2 : (progress - 0.5) * 2; // 0..1 within this page
  const tt = Math.max(0, Math.min(1, t));
  const p =
    side === "left"
      ? bezier(tt, [24, 520], [200, 220], [480, 120])
      : bezier(tt, [0, 120], [280, 220], [456, 520]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 480 660"
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {/* Dashed arc */}
      <path
        d={path}
        fill="none"
        stroke="rgba(220,200,170,0.22)"
        strokeWidth="0.8"
        strokeDasharray="2 5"
      />
      {/* Brighter glow segment at convergence */}
      {conv > 0 && (
        <path
          d={path}
          fill="none"
          stroke="rgba(255,210,140,0.55)"
          strokeWidth="0.9"
          strokeDasharray="2 5"
          opacity={0.15 + conv * 0.7}
        />
      )}
      {/* Travelling light dot */}
      <circle
        cx={p[0]}
        cy={p[1]}
        r="2.4"
        fill="rgba(255,210,140,0.92)"
        style={{
          filter: "drop-shadow(0 0 6px rgba(255,180,90,0.7))",
          opacity: progress > 0 ? 0.8 : 0.3,
        }}
      />
    </svg>
  );
}

function bezier(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
): [number, number] {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

/* ════════════════════════════════════════════════════════════
   HOME VIEW — outside-the-cabin atmospherics, behind the window
   Warm city horizon + lit cloud bank. Gentle and dim until
   the user drags the light.
════════════════════════════════════════════════════════════ */
function HomeView({ warmth }: { warmth: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.55 + warmth * 0.45,
        transition: "opacity 0.7s ease",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 60% 70%, rgba(${
            190 + warmth * 35
          },${100 + warmth * 50},${40 + warmth * 30},${0.18 + warmth * 0.45}) 0%, transparent 70%)`,
          transition: "background 0.6s ease",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   AWAY VIEW — outside the cabin: cold horizon + airport feel
════════════════════════════════════════════════════════════ */
function AwayView({ coolness }: { coolness: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.55 + coolness * 0.45,
        transition: "opacity 0.7s ease",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 40% 70%, rgba(${
            70 + coolness * 30
          },${100 + coolness * 30},${170 + coolness * 30},${0.16 + coolness * 0.42}) 0%, transparent 70%)`,
          transition: "background 0.6s ease",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   INSIDE WINDOW — HOME
   What's actually visible through the glass on the warm side:
   a warm coastline, scattered amber kitchen-window dots, a lit
   cloud bank above the horizon.
════════════════════════════════════════════════════════════ */
function InsideWindowHome({ warmth }: { warmth: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 320"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.65 + warmth * 0.35,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
      }}
    >
      {/* Lit cloud bank above */}
      <ellipse
        cx="120"
        cy="170"
        rx="160"
        ry="22"
        fill={`rgba(${200 + warmth * 30},${130 + warmth * 30},${70 + warmth * 25},${0.14 + warmth * 0.18})`}
      />
      <ellipse
        cx="80"
        cy="178"
        rx="80"
        ry="14"
        fill={`rgba(${230 + warmth * 20},${160 + warmth * 25},${90 + warmth * 20},${0.12 + warmth * 0.18})`}
      />
      {/* Horizon glow */}
      <rect
        x="0"
        y="200"
        width="240"
        height="14"
        fill={`url(#horizonGlow)`}
      />
      <defs>
        <linearGradient id="horizonGlow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${230 + warmth * 20},${150 + warmth * 30},${70 + warmth * 20},0)`} />
          <stop offset="100%" stopColor={`rgba(${230 + warmth * 20},${130 + warmth * 30},${50 + warmth * 20},${0.5 + warmth * 0.3})`} />
        </linearGradient>
      </defs>
      {/* Coastline silhouette */}
      <path
        d="M -10 230 Q 30 226 60 232 T 130 234 T 200 230 T 250 234 L 250 320 L -10 320 Z"
        fill={`rgba(${110 + warmth * 30},${60 + warmth * 20},${30 + warmth * 10},${0.55 + warmth * 0.2})`}
      />
      {/* Kitchen-window dots — scattered amber lights */}
      {[
        [40, 246],
        [62, 250],
        [82, 244],
        [110, 252],
        [138, 246],
        [168, 250],
        [192, 244],
        [62, 262],
        [104, 268],
        [148, 264],
        [186, 268],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="0.9"
          fill={`rgba(255,${190 - i * 4},${120 - i * 6},${0.7 + warmth * 0.25})`}
          style={{
            filter: "drop-shadow(0 0 2px rgba(255,180,90,0.7))",
          }}
        />
      ))}
      {/* River reflection — soft warm streak */}
      <path
        d="M 30 280 Q 90 270 150 288 T 240 286"
        stroke={`rgba(255,180,100,${0.18 + warmth * 0.18})`}
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   INSIDE WINDOW — AWAY
   Cold city grid as seen from the air on approach to a US city.
   A faint runway approach line cuts diagonally.
════════════════════════════════════════════════════════════ */
function InsideWindowAway({ coolness }: { coolness: number }) {
  // Cold grid of city block lights
  const ROWS = [
    { y: 220, count: 8 },
    { y: 234, count: 9 },
    { y: 248, count: 7 },
    { y: 262, count: 8 },
    { y: 276, count: 6 },
    { y: 290, count: 7 },
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 320"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.7 + coolness * 0.3,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
      }}
    >
      {/* Cold horizon haze */}
      <rect
        x="0"
        y="200"
        width="240"
        height="20"
        fill="url(#coldHorizon)"
      />
      <defs>
        <linearGradient id="coldHorizon" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={`rgba(80,110,160,${0.06 + coolness * 0.10})`} />
          <stop offset="100%" stopColor={`rgba(120,160,210,${0.20 + coolness * 0.18})`} />
        </linearGradient>
      </defs>
      {/* City grid */}
      {ROWS.map((row, r) =>
        Array.from({ length: row.count }).map((_, i) => {
          const x = 18 + i * (210 / row.count) + (r % 2) * 8;
          const op = 0.45 + ((r * 7 + i * 13) % 4) * 0.1;
          return (
            <circle
              key={`${r}-${i}`}
              cx={x}
              cy={row.y}
              r={0.85}
              fill={`rgba(180,210,240,${op * (0.55 + coolness * 0.45)})`}
            />
          );
        })
      )}
      {/* Runway approach lights — diagonal line of brighter blue dots */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle
          key={`r-${i}`}
          cx={70 + i * 16}
          cy={304 - i * 4}
          r={1.2}
          fill={`rgba(220,235,255,${0.55 + coolness * 0.35})`}
          style={{ filter: "drop-shadow(0 0 2px rgba(180,215,255,0.7))" }}
        />
      ))}
      {/* Highway streak — faint cold line */}
      <path
        d="M 0 290 Q 80 282 170 296 T 240 292"
        stroke={`rgba(180,210,240,${0.12 + coolness * 0.16})`}
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   WINDOW — the airplane window. More clearly aviation-shaped:
   a rounded rectangle (taller than wide), nested frame rings,
   a small "shade ridge" at the bottom, and a soft cabin curve
   below the window indicating the wall.
════════════════════════════════════════════════════════════ */
function Window({
  side,
  areaRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  warmth,
  children,
}: {
  side: "left" | "right";
  areaRef: React.MutableRefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  warmth: number;
  children?: React.ReactNode;
}) {
  const WIN_W = 240;
  const WIN_H = 340;
  // Rounded rectangle with very generous corner rounding — feels aviation
  const RADIUS = "100px / 130px";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        [side === "left" ? "right" : "left"]: "1.6rem",
        transform: "translateY(-48%)",
        width: WIN_W,
        height: WIN_H,
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      {/* Cabin wall plate — outer frame ring (the structural panel) */}
      <div
        style={{
          position: "absolute",
          inset: -16,
          borderRadius: "112px / 142px",
          background:
            "radial-gradient(ellipse, rgba(56,50,46,0.55) 0%, rgba(20,16,14,0.92) 80%)",
          boxShadow:
            "0 22px 50px rgba(0,0,0,0.72), inset 0 0 30px rgba(0,0,0,0.7)",
        }}
      />

      {/* Outer frame — light edge highlight */}
      <div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: "104px / 134px",
          border: "1px solid rgba(120,108,98,0.55)",
        }}
      />

      {/* Inner gasket — darker ring just outside the glass */}
      <div
        style={{
          position: "absolute",
          inset: 4,
          borderRadius: RADIUS,
          background: "rgba(8,8,12,0.8)",
        }}
      />

      {/* Glass / drag area */}
      <div
        ref={areaRef}
        data-book-interactive
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "absolute",
          inset: 8,
          borderRadius: RADIUS,
          background: `radial-gradient(ellipse, rgba(${10 + warmth * 28},${10 + warmth * 22},${20 + warmth * 14},0.42) 0%, rgba(4,4,10,0.94) 78%)`,
          overflow: "hidden",
          cursor: "grab",
          pointerEvents: "all",
          touchAction: "none",
          transition: "background 0.5s ease",
        }}
      >
        {children}

        {/* Glass reflection — a long top highlight */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "10%",
            right: "10%",
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(255,235,210,0.16), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Two small rivets near top corners */}
      {[12, WIN_W - 12].map((x, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 4,
            left: x - 2,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "rgba(140,130,118,0.7)",
            boxShadow: "inset 0 0 2px rgba(0,0,0,0.6)",
          }}
        />
      ))}

      {/* Shade lever at the bottom — a small horizontal nub */}
      <div
        style={{
          position: "absolute",
          bottom: -2,
          left: "50%",
          transform: "translateX(-50%)",
          width: 28,
          height: 4,
          borderRadius: 2,
          background: "rgba(80,72,64,0.8)",
          boxShadow: "0 1px 0 rgba(20,16,12,0.9)",
        }}
      />

      {/* Cabin wall arc below the window — the inside wall curving away */}
      <div
        style={{
          position: "absolute",
          left: -22,
          right: -22,
          bottom: -64,
          height: 70,
          background:
            side === "left"
              ? "radial-gradient(ellipse 100% 100% at 60% 0%, rgba(36,30,28,0.7) 0%, transparent 70%)"
              : "radial-gradient(ellipse 100% 100% at 40% 0%, rgba(36,30,28,0.7) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LIGHT PUCK — the draggable light point
════════════════════════════════════════════════════════════ */
function LightPuck({ x, y, warm }: { x: number; y: number; warm: boolean }) {
  const color = warm ? "rgba(255,200,120,0.95)" : "rgba(190,220,255,0.95)";
  const glow = warm ? "rgba(255,170,80,0.6)" : "rgba(150,190,235,0.55)";
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 6,
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 18px ${glow}, 0 0 38px ${glow}`,
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FRAGMENTS — words bloom near the light's glow
════════════════════════════════════════════════════════════ */
function Fragments({
  frags,
  light,
  touched,
  color,
  glow,
}: {
  frags: { text: string; x: number; y: number }[];
  light: { x: number; y: number };
  touched: boolean;
  color: string;
  glow: string;
}) {
  return (
    <>
      {frags.map((f, i) => {
        const dx = f.x / 100 - light.x;
        const dy = f.y / 100 - light.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const R = 0.34;
        const proximity = touched ? Math.max(0, 1 - d / R) : 0;
        const opacity = proximity * 0.96;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.78rem",
              letterSpacing: "0.05em",
              color,
              textShadow: `0 0 14px ${glow}, 0 0 4px rgba(0,0,0,0.85)`,
              opacity,
              filter: `blur(${(1 - proximity) * 2}px)`,
              transition: "opacity 0.35s ease, filter 0.35s ease",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {f.text}
          </div>
        );
      })}
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   BOTTOM LINE — page footer text. Shows trigger when the
   reader has touched their own puck; replaced by the
   convergence reveal once both pucks are pulled spine-ward.
════════════════════════════════════════════════════════════ */
function BottomLine({
  side,
  triggerVisible,
  revealVisible,
  triggerText,
  revealText,
}: {
  side: "left" | "right";
  triggerVisible: boolean;
  revealVisible: boolean;
  triggerText: string;
  revealText: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "5rem",
        left: "2.5rem",
        right: "2.5rem",
        textAlign: side === "left" ? "left" : "right",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="wait">
        {revealVisible ? (
          <motion.p
            key="reveal"
            initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.94rem",
              lineHeight: 1.6,
              color: "rgba(255,225,185,0.96)",
              textShadow:
                "0 0 18px rgba(255,180,100,0.45), 0 0 6px rgba(0,0,0,0.85)",
              whiteSpace: "pre-line",
              letterSpacing: "0.01em",
            }}
          >
            {revealText}
          </motion.p>
        ) : triggerVisible ? (
          <motion.p
            key="trigger"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.86rem",
              lineHeight: 1.7,
              color:
                side === "left"
                  ? "rgba(245,220,180,0.88)"
                  : "rgba(210,220,240,0.86)",
              textShadow: "0 0 14px rgba(0,0,0,0.85)",
              letterSpacing: "0.02em",
              whiteSpace: "pre-line",
            }}
          >
            {triggerText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
