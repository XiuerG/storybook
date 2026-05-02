"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import PageShell from "./PageShell";

// ════════════════════════════════════════════════════════════
//  TEXT CONTENT
// ════════════════════════════════════════════════════════════

// Left page — the opening narrative sentence
const NARRATIVE = "We came to a place where everything runs on wheels.";
// Right page — the poetic line
const BODY = "Everyone is close.\nNo one is near.";

// ════════════════════════════════════════════════════════════
//  COLOR PALETTE
//  Edit here to shift the emotional tone of the whole spread.
//  Cooler blues → colder, more isolated.
//  Warmer grays → grittier, more oppressive.
// ════════════════════════════════════════════════════════════

const C = {
  pageBg:    "#111419",                          // page background
  skyTop:    "#090b10",                          // near-black upper sky
  skyBottom: "#182034",                          // blue-gray horizon
  bld: [
    "#0c0f14",                                   // shade 0 — darkest
    "#131924",                                   // shade 1 — mid
    "#1a2232",                                   // shade 2 — lighter
  ] as const,
  road:      "#07090c",                          // road surface
  divider:   "#191f2c",                          // lane dividers
  headlight: "rgba(255, 248, 205, 0.72)",        // warm front lights
  taillight: "rgba(210, 48, 38, 0.60)",          // red rear lights
  fog:       "rgba(110, 148, 205, 0.040)",       // atmospheric haze
  narrative: "rgba(205, 210, 228, 0.82)",        // left-page sentence
  body:      "rgba(155, 166, 195, 0.72)",        // right-page poetic line
} as const;

// ════════════════════════════════════════════════════════════
//  HORIZON — % from top where sky meets road
//  Raise to show more sky; lower to show more road.
// ════════════════════════════════════════════════════════════

const HORIZON = 58;

// ════════════════════════════════════════════════════════════
//  BRIDGE GEOMETRY
//  The bridge spans BOTH pages as a panorama:
//    Left page  — left tower (x=115) + anchor + span exits right edge
//    Right page — span enters left edge + right tower (x=362) + anchor
//  Both towers sit at BRIDGE_TOWER_TOP and the cable exits/enters
//  both pages at BRIDGE_EDGE_Y, creating seamless visual continuity.
//
//  BRIDGE_TOWER_H  — raise to make towers taller
//  BRIDGE_SAG      — increase for droopier cables
// ════════════════════════════════════════════════════════════

const PAGE_W        = 480;
const PAGE_H        = 660;
const BRIDGE_DECK_Y = Math.round(PAGE_H * HORIZON / 100) - 4; // ≈ 379 px
const BRIDGE_TOWER_H  = 148;
const BRIDGE_TOWER_TOP = BRIDGE_DECK_Y - BRIDGE_TOWER_H;      // ≈ 231 px
const BRIDGE_SAG      = 60;   // max cable sag below tower top at midspan
const BRIDGE_EDGE_Y   = BRIDGE_TOWER_TOP + BRIDGE_SAG;        // ≈ 291 px
const BRIDGE_FILL     = "#131d2e";  // silhouette colour — edit to change bridge shade
const BRIDGE_CABLE    = "#1b2a40";  // cable colour

// ════════════════════════════════════════════════════════════
//  TRAFFIC LANES (right page only)
//
//  speed  — seconds to cross the page (lower = faster cars)
//  count  — simultaneous car-shapes per lane
//  blur   — motion-blur radius px (higher = more ghostly)
// ════════════════════════════════════════════════════════════

const LANES = [
  { yPct: 61, h: 13, dir: "right" as const, speed: 8,  count: 3, blur: 1.8 },
  { yPct: 65, h: 10, dir: "left"  as const, speed: 13, count: 2, blur: 3.6 },
  { yPct: 69, h: 9,  dir: "right" as const, speed: 6,  count: 4, blur: 1.4 },
  { yPct: 73, h: 8,  dir: "left"  as const, speed: 11, count: 2, blur: 3.0 },
];

// ════════════════════════════════════════════════════════════
//  BUILDING SILHOUETTES
//
//  Each entry: [x% from left, width px, height px, shade 0|1|2]
//  Left page uses sparser, lower buildings — more open sky.
//  Right page uses denser, taller buildings — urban pressure.
//  Shade 0 = darkest, 2 = slightly lighter (depth illusion).
// ════════════════════════════════════════════════════════════

// Left page — sparse skyline, lots of open sky for the text
const BLDS_L: [number, number, number, 0 | 1 | 2][] = [
  [2,  16, 72, 0], [8,  22, 108,0], [15, 13, 54, 1],
  [24, 18, 88, 0], [32, 12, 48, 2], [40, 20, 96, 0],
  [50, 14, 62, 1], [58, 24,114,0],  [67, 15, 74, 2],
  [75, 20, 90, 0], [84, 16, 58, 1], [91, 22,102,0],
];

// Right page — dense, taller skyline
const BLDS_R: [number, number, number, 0 | 1 | 2][] = [
  [1,  26,138,0], [5,  16, 82,1], [8,  20,176,0], [12,14,106,1],
  [15, 30,208,0], [22, 17,134,2], [26, 13, 76,1], [29, 24,160,0],
  [35, 15,118,1], [38, 22,194,0], [43, 13, 96,2], [47, 19,152,0],
  [51, 27,168,1], [58, 15,110,0], [62, 21,142,2], [66, 13, 90,1],
  [69, 29,178,0], [76, 19,132,1], [80, 15, 98,0], [84, 22,160,2],
  [90, 18,120,1], [94, 13, 80,0],
];

// ════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ════════════════════════════════════════════════════════════

interface PageProps { side?: "left" | "right" }

const CityPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "right" }, ref) => {
    if (side === "left")  return <CityPageLeft  forwardedRef={ref} />;
    if (side === "right") return <CityPageRight forwardedRef={ref} />;
    return null;
  }
);

CityPage.displayName = "CityPage";
export default CityPage;

// ════════════════════════════════════════════════════════════
//  LEFT PAGE — open sky, sparse city, narrative sentence
// ════════════════════════════════════════════════════════════

function CityPageLeft({
  forwardedRef,
}: {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left  - r.width  / 2) / (r.width  / 2),
        y: (e.clientY - r.top   - r.height / 2) / (r.height / 2),
      });
    },
    []
  );

  const px = (depth: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    transform: `translate(${mouse.x * -depth}px, ${mouse.y * -depth * 0.4}px)`,
    transition: "transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    willChange: "transform",
  });

  return (
    <PageShell ref={forwardedRef} side="left" pageNumber={1}
      style={{ background: C.pageBg }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        {/* Sky */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: `${HORIZON}%`,
          background: `linear-gradient(to bottom, ${C.skyTop} 0%, ${C.skyBottom} 100%)`,
        }} />

        {/* Road */}
        <div style={{
          position: "absolute",
          top: `${HORIZON}%`, left: 0, right: 0, bottom: 0,
          background: C.road,
        }} />

        {/* Bridge — behind buildings, deeper parallax */}
        <div style={px(5)}>
          <Bridge side="left" />
        </div>

        {/* Sparse buildings — deeper parallax */}
        <div style={px(7)}>
          <Buildings blds={BLDS_L} />
        </div>

        {/* Road markings — medium parallax */}
        <div style={px(4)}>
          <RoadMarkings />
        </div>

        {/* Traffic — shallow parallax */}
        <div style={px(2)}>
          {LANES.map((lane, i) => (
            <TrafficLane key={i} {...lane} />
          ))}
        </div>

        {/* Atmosphere */}
        <AtmosphereLayer />

        {/* Narrative sentence — centred in the open sky */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${HORIZON}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 3rem 3rem 2.5rem",
          pointerEvents: "none",
        }}>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 1.7vw, 1.28rem)",
              lineHeight: 1.95,
              color: C.narrative,
              maxWidth: "22ch",
              letterSpacing: "0.01em",
              textAlign: "left",
            }}
          >
            {NARRATIVE}
          </motion.p>
        </div>

      </div>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════
//  RIGHT PAGE — dense city, traffic, poetic line
// ════════════════════════════════════════════════════════════

function CityPageRight({
  forwardedRef,
}: {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left  - r.width  / 2) / (r.width  / 2),
        y: (e.clientY - r.top   - r.height / 2) / (r.height / 2),
      });
    },
    []
  );

  const px = (depth: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    transform: `translate(${mouse.x * -depth}px, ${mouse.y * -depth * 0.4}px)`,
    transition: "transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    willChange: "transform",
  });

  return (
    <PageShell ref={forwardedRef} side="right" pageNumber={2}
      style={{ background: C.pageBg }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        {/* Sky */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: `${HORIZON}%`,
          background: `linear-gradient(to bottom, ${C.skyTop} 0%, ${C.skyBottom} 100%)`,
        }} />

        {/* Road */}
        <div style={{
          position: "absolute",
          top: `${HORIZON}%`, left: 0, right: 0, bottom: 0,
          background: C.road,
        }} />

        {/* Bridge — behind buildings, farther depth */}
        <div style={px(6)}>
          <Bridge side="right" />
        </div>

        {/* Dense buildings — depth 9 parallax */}
        <div style={px(9)}>
          <Buildings blds={BLDS_R} />
        </div>

        {/* Road markings — depth 4 */}
        <div style={px(4)}>
          <RoadMarkings />
        </div>

        {/* Traffic — depth 2 */}
        <div style={px(2)}>
          {LANES.map((lane, i) => (
            <TrafficLane key={i} {...lane} />
          ))}
        </div>

        {/* Atmosphere */}
        <AtmosphereLayer />

        {/* Poetic line — right side of page */}
        <div style={{
          position: "absolute",
          top: "3rem",
          right: "2.5rem",
          pointerEvents: "none",
          textAlign: "right",
        }}>
          <p style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
            lineHeight: 2.2,
            color: C.body,
            whiteSpace: "pre-line",
            maxWidth: "28ch",
            letterSpacing: "0.01em",
          }}>
            {BODY}
          </p>
        </div>

      </div>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════
//  SHARED LAYER COMPONENTS
// ════════════════════════════════════════════════════════════

/** Building silhouettes anchored at the horizon. Accepts any BLDS array. */
function Buildings({ blds }: { blds: [number, number, number, 0 | 1 | 2][] }) {
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      height: `${HORIZON}%`,
      overflow: "hidden",
      pointerEvents: "none",
    }}>
      {blds.map(([xPct, w, h, shade], i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${xPct}%`,
          bottom: 0,
          width: w,
          height: h,
          background: C.bld[shade],
        }} />
      ))}

      {/* Horizon smear — softens roofline into the sky haze */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 22,
        background: `linear-gradient(to top, ${C.skyBottom}99, transparent)`,
        pointerEvents: "none",
      }} />
    </div>
  );
}

/** Dashed lane dividers on the road surface */
function RoadMarkings() {
  const roadH = 100 - HORIZON;
  return (
    <div style={{
      position: "absolute",
      top: `${HORIZON}%`,
      left: 0, right: 0, bottom: 0,
      pointerEvents: "none",
    }}>
      {[62, 67, 71].map((yPct) => {
        const relPct = ((yPct - HORIZON) / roadH) * 100;
        return (
          <div key={yPct} style={{
            position: "absolute",
            top: `${relPct}%`,
            left: 0, right: 0,
            height: 1,
            background: `repeating-linear-gradient(
              to right,
              transparent 0px, transparent 10px,
              ${C.divider} 10px, ${C.divider} 24px
            )`,
            opacity: 0.38,
          }} />
        );
      })}
    </div>
  );
}

/** One horizontal lane of moving car-light shapes */
function TrafficLane({
  yPct, h, dir, speed, count, blur,
}: (typeof LANES)[number]) {
  return (
    <div style={{
      position: "absolute",
      top: `${yPct}%`,
      left: 0, right: 0,
      height: h,
      overflow: "hidden",
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const carW    = 46 + Math.round(Math.sin(i * 1.8 + yPct * 0.1) * 11);
        const carBlur = Math.max(0.5, blur + Math.sin(i * 0.8) * 0.6);
        const carOpa  = Math.min(0.88, Math.max(0.25, 0.54 + Math.sin(i * 2.3) * 0.22));
        return (
          <MovingCar
            key={i}
            dir={dir}
            speed={speed}
            width={carW}
            blur={carBlur}
            opacity={carOpa}
            delay={-(i / count) * speed}
          />
        );
      })}
    </div>
  );
}

/** A single blurred car-light streak moving horizontally */
function MovingCar({
  dir, speed, width, blur, opacity, delay,
}: {
  dir: "left" | "right";
  speed: number;
  width: number;
  blur: number;
  opacity: number;
  delay: number;
}) {
  const SWEEP   = 560;
  const isRight = dir === "right";

  const gradient = isRight
    ? `linear-gradient(to right,
        transparent 0%,
        ${C.taillight} 16%,
        ${C.headlight} 70%,
        rgba(255, 255, 255, 0.28) 100%)`
    : `linear-gradient(to left,
        transparent 0%,
        ${C.taillight} 22%,
        ${C.taillight} 62%,
        rgba(255, 240, 180, 0.18) 100%)`;

  return (
    <motion.div
      initial={{ x: isRight ? -width : SWEEP }}
      animate={{ x: isRight ? SWEEP   : -width }}
      transition={{
        duration: speed,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay,
      }}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width,
        height: "100%",
        background: gradient,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
}

// ─── Bezier helpers ───────────────────────────────────────
function bY(t: number, y0: number, y1: number, y2: number) {
  return (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
}
function bX(t: number, x0: number, x1: number, x2: number) {
  return (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
}

/**
 * Bridge — SVG suspension-bridge silhouette.
 *
 * Left page : left tower (x ≈ 115) + anchor cable + span exiting right edge.
 * Right page: span entering left edge + right tower (x ≈ 362) + anchor cable.
 *
 * The two halves align at BRIDGE_EDGE_Y where cables cross the page boundary,
 * giving the impression of a single bridge spanning the full spread.
 */
function Bridge({ side }: { side: "left" | "right" }) {
  const tW    = 17;  // tower width px
  const tBarH = 6;   // crossbeam height
  const tBarOff = 38; // crossbeam offset below tower top
  const dH    = 7;   // deck height

  if (side === "left") {
    const tx = 115; // left tower x

    // Anchor cable control point (from left edge to tower top)
    const ancCx = tx * 0.42;
    const ancCy = BRIDGE_DECK_Y - 22;

    // Main-span cable control point (from tower top to right edge)
    // Cable exits at BRIDGE_EDGE_Y — must match right page entry
    const spanCx = 300;
    const spanCy = BRIDGE_EDGE_Y;

    // Hanger t-parameters along the main-span bezier
    const spanTs = [0.10, 0.24, 0.38, 0.52, 0.67, 0.81, 0.93];
    // Hanger t-parameters along the anchor bezier
    const ancTs  = [0.28, 0.55, 0.80];

    return (
      <svg viewBox={`0 0 ${PAGE_W} ${PAGE_H}`} width="100%" height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        aria-hidden="true">
        <g opacity="0.84">
          {/* Deck */}
          <rect x="0" y={BRIDGE_DECK_Y - dH} width={PAGE_W} height={dH}
            fill={BRIDGE_FILL} />

          {/* Tower */}
          <rect x={tx - tW / 2} y={BRIDGE_TOWER_TOP} width={tW}
            height={BRIDGE_TOWER_H} fill={BRIDGE_FILL} />
          {/* Crossbeam */}
          <rect x={tx - tW * 1.35} y={BRIDGE_TOWER_TOP + tBarOff}
            width={tW * 2.7} height={tBarH} fill={BRIDGE_FILL} />

          {/* Anchor cable */}
          <path d={`M 0 ${BRIDGE_DECK_Y - 52}
                    Q ${ancCx} ${ancCy}
                      ${tx} ${BRIDGE_TOWER_TOP}`}
            stroke={BRIDGE_CABLE} strokeWidth="2.1" fill="none" opacity="0.88" />

          {/* Main-span cable (exits right edge) */}
          <path d={`M ${tx} ${BRIDGE_TOWER_TOP}
                    Q ${spanCx} ${spanCy}
                      ${PAGE_W} ${BRIDGE_EDGE_Y}`}
            stroke={BRIDGE_CABLE} strokeWidth="2.5" fill="none" opacity="0.92" />

          {/* Hangers — main span */}
          {spanTs.map((t, i) => {
            const cx = bX(t, tx, spanCx, PAGE_W);
            const cy = bY(t, BRIDGE_TOWER_TOP, spanCy, BRIDGE_EDGE_Y);
            return <line key={i} x1={cx} y1={cy} x2={cx} y2={BRIDGE_DECK_Y - dH}
              stroke={BRIDGE_CABLE} strokeWidth="0.9" opacity="0.50" />;
          })}

          {/* Hangers — anchor side */}
          {ancTs.map((t, i) => {
            const cx = bX(t, 0, ancCx, tx);
            const cy = bY(t, BRIDGE_DECK_Y - 52, ancCy, BRIDGE_TOWER_TOP);
            return <line key={i} x1={cx} y1={cy} x2={cx} y2={BRIDGE_DECK_Y - dH}
              stroke={BRIDGE_CABLE} strokeWidth="0.8" opacity="0.42" />;
          })}
        </g>
      </svg>
    );
  }

  /* ── Right page ──────────────────────────────────────── */
  const tx = 362; // right tower x

  // Main-span cable enters from left edge at BRIDGE_EDGE_Y
  const spanCx = 180;
  const spanCy = BRIDGE_EDGE_Y;

  // Anchor cable (from tower top to right edge)
  const ancCx = tx + (PAGE_W - tx) * 0.58;
  const ancCy = BRIDGE_DECK_Y - 22;

  const spanTs = [0.08, 0.22, 0.36, 0.50, 0.65, 0.80];
  const ancTs  = [0.28, 0.55, 0.80];

  return (
    <svg viewBox={`0 0 ${PAGE_W} ${PAGE_H}`} width="100%" height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true">
      <g opacity="0.84">
        {/* Deck */}
        <rect x="0" y={BRIDGE_DECK_Y - dH} width={PAGE_W} height={dH}
          fill={BRIDGE_FILL} />

        {/* Tower */}
        <rect x={tx - tW / 2} y={BRIDGE_TOWER_TOP} width={tW}
          height={BRIDGE_TOWER_H} fill={BRIDGE_FILL} />
        {/* Crossbeam */}
        <rect x={tx - tW * 1.35} y={BRIDGE_TOWER_TOP + tBarOff}
          width={tW * 2.7} height={tBarH} fill={BRIDGE_FILL} />

        {/* Main-span cable (enters from left edge) */}
        <path d={`M 0 ${BRIDGE_EDGE_Y}
                  Q ${spanCx} ${spanCy}
                    ${tx} ${BRIDGE_TOWER_TOP}`}
          stroke={BRIDGE_CABLE} strokeWidth="2.5" fill="none" opacity="0.92" />

        {/* Anchor cable */}
        <path d={`M ${tx} ${BRIDGE_TOWER_TOP}
                  Q ${ancCx} ${ancCy}
                    ${PAGE_W} ${BRIDGE_DECK_Y - 52}`}
          stroke={BRIDGE_CABLE} strokeWidth="2.1" fill="none" opacity="0.88" />

        {/* Hangers — main span */}
        {spanTs.map((t, i) => {
          const cx = bX(t, 0, spanCx, tx);
          const cy = bY(t, BRIDGE_EDGE_Y, spanCy, BRIDGE_TOWER_TOP);
          return <line key={i} x1={cx} y1={cy} x2={cx} y2={BRIDGE_DECK_Y - dH}
            stroke={BRIDGE_CABLE} strokeWidth="0.9" opacity="0.50" />;
        })}

        {/* Hangers — anchor side */}
        {ancTs.map((t, i) => {
          const cx = bX(t, tx, ancCx, PAGE_W);
          const cy = bY(t, BRIDGE_TOWER_TOP, ancCy, BRIDGE_DECK_Y - 52);
          return <line key={i} x1={cx} y1={cy} x2={cx} y2={BRIDGE_DECK_Y - dH}
            stroke={BRIDGE_CABLE} strokeWidth="0.8" opacity="0.42" />;
        })}
      </g>
    </svg>
  );
}

/**
 * AtmosphereLayer — shared cinematic overlays used on both pages.
 * 1. Drifting cold fog in the road zone.
 * 2. Edge vignette for cinema-lens depth.
 * 3. Cold blue tint at sky top.
 * 4. Faint horizon bloom.
 */
function AtmosphereLayer() {
  return (
    <>
      {/* 1. Drifting fog */}
      <motion.div
        aria-hidden="true"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: "-6%",
          background: `
            radial-gradient(ellipse 100% 22% at 38% 74%, ${C.fog} 0%, transparent 72%),
            radial-gradient(ellipse  80% 18% at 80% 80%, ${C.fog} 0%, transparent 65%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* 2. Edge vignette */}
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 40%, rgba(3, 4, 8, 0.78) 100%)",
        pointerEvents: "none",
      }} />

      {/* 3. Cold sky tint */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "30%",
        background: "linear-gradient(to bottom, rgba(12, 24, 52, 0.30), transparent)",
        pointerEvents: "none",
      }} />

      {/* 4. Horizon bloom */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: `${HORIZON - 10}%`,
        left: 0, right: 0,
        height: "18%",
        background: `linear-gradient(to bottom,
          transparent,
          rgba(28, 52, 90, 0.11) 50%,
          transparent
        )`,
        pointerEvents: "none",
      }} />
    </>
  );
}
