"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 5 — GENERATIONAL BRIDGE
   ────────────────────────────────────────────────────────────
   A horizontal timeline with four stops — Grandparents → Parents
   → Me → Future. The reader drags the puck through them. Each
   generation shows what it carried.
================================================================ */

const TITLE = "The Bridge";
const HI_SUB = "पुश्त-दर-पुश्त";
const HINT = "Drag through the generations";

interface Generation {
  id: string;
  label: string;
  hi: string;
  practice: string;
  caption: string;
}

const GENS: Generation[] = [
  {
    id: "grand",
    label: "Grandparents",
    hi: "दादा-दादी",
    practice: "language · temple · cooking",
    caption:
      "They held the stories whole. Languages, prayers, recipes — passed through hands that did not need to write them down.",
  },
  {
    id: "parents",
    label: "Parents",
    hi: "माता-पिता",
    practice: "trips back · mother tongue at home",
    caption:
      "They taught us to speak it at the kitchen table. They sent us back across the ocean every summer so the bridge would not collapse.",
  },
  {
    id: "me",
    label: "Me",
    hi: "मैं",
    practice: "choosing what to keep, what to make new",
    caption:
      "Some words I lost. Some rituals I rebuilt. I choose which practices to continue — knowing that I am the one carrying them now.",
  },
  {
    id: "future",
    label: "Future",
    hi: "अगली पीढ़ी",
    practice: "passing forward — softer, smaller, still real",
    caption:
      "What I keep, they will inherit. What I forget, will be harder for them to find. The bridge is mine to hold a little longer.",
  },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE — slider position 0..1
================================================================ */
let _t = 0;
let _touched = false;
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _t = 0;
    _touched = false;
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _setT(v: number) {
  _t = Math.max(0, Math.min(1, v));
  _touched = true;
  _notify();
}
function useBridge() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return { t: _t, touched: _touched };
}

function activeGen(t: number): { gen: Generation; index: number } {
  // Snap to nearest of 4 stops
  const idx = Math.max(0, Math.min(GENS.length - 1, Math.round(t * (GENS.length - 1))));
  return { gen: GENS[idx], index: idx };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const GenerationalBridgePage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <BridgeLeft forwardedRef={ref} />;
    return <BridgeRight forwardedRef={ref} />;
  }
);
GenerationalBridgePage.displayName = "GenerationalBridgePage";
export default GenerationalBridgePage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + slider + caption
================================================================ */
function BridgeLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { t, touched } = useBridge();
  const { gen, index } = activeGen(t);

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={9}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="left" />

      <div
        style={{
          position: "absolute",
          top: "2.6rem",
          left: "2.5rem",
          right: "2.5rem",
          zIndex: 9,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "0.78rem",
            letterSpacing: "0.18em",
            color: "rgba(255,200,140,0.7)",
            marginBottom: "0.7rem",
          }}
        >
          {HI_SUB}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.0, delay: 0.5, ease: "easeOut" }}
          className="page-title-spread"
          style={{
            color: "rgba(245,228,205,0.94)",
            textShadow: "0 0 22px rgba(0,0,0,0.7)",
            margin: 0,
          }}
        >
          {TITLE}
        </motion.h2>
      </div>

      {/* Generation header */}
      <div
        style={{
          position: "absolute",
          top: "26%",
          left: "8%",
          right: "8%",
          textAlign: "center",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={gen.id}
            initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "0.95rem",
                letterSpacing: "0.16em",
                color: "rgba(255,225,185,0.96)",
                textTransform: "uppercase",
                textShadow:
                  "0 0 14px rgba(255,180,100,0.45), 0 0 4px rgba(0,0,0,0.85)",
                marginBottom: 6,
              }}
            >
              {gen.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                color: "rgba(255,200,140,0.7)",
              }}
            >
              {gen.hi}
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
                color: "rgba(220,210,235,0.7)",
                textTransform: "lowercase",
              }}
            >
              {gen.practice}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          right: "10%",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={gen.id + "-caption"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.78rem",
              lineHeight: 1.7,
              color: "rgba(245,228,205,0.88)",
              textShadow: "0 0 14px rgba(0,0,0,0.85)",
              letterSpacing: "0.02em",
            }}
          >
            {gen.caption}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Slider */}
      <Slider />

      {!touched && (
        <InteractionHint
          emphasis
          style={{
            bottom: "1.6rem",
            left: "2.5rem",
            zIndex: 11,
            color: "rgba(255,210,160,0.85)",
          }}
        >
          {HINT}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT — visual bridge: 4 pillars connected by a thread
================================================================ */
function BridgeRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { t } = useBridge();
  const { index } = activeGen(t);

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={10}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="right" />

      <BridgeVisual activeIndex={index} />
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOM BACKDROP
================================================================ */
function RoomBackdrop({ side }: { side: "left" | "right" }) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at " +
            (side === "left" ? "30%" : "55%") +
            " 55%, rgba(110,55,40,0.22) 0%, transparent 70%)," +
            "linear-gradient(180deg, #07061a 0%, #0a0820 60%, #0c0820 100%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 95% 95% at 50% 50%, transparent 50%, rgba(2,2,12,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [side === "left" ? "right" : "left"]: 0,
          width: "8%",
          background:
            side === "left"
              ? "linear-gradient(to right, transparent, rgba(6,5,15,0.32))"
              : "linear-gradient(to left, transparent, rgba(6,5,15,0.32))",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   SLIDER
================================================================ */
function Slider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const setFromEvent = useCallback((cx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    _setT(t);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setActive(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setFromEvent(e.clientX);
    },
    [setFromEvent]
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!active) return;
      setFromEvent(e.clientX);
    },
    [active, setFromEvent]
  );
  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setActive(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  const { t } = useBridge();
  const handleT = Math.round(t * (GENS.length - 1)) / (GENS.length - 1);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "5rem",
        left: "2.5rem",
        right: "2.5rem",
        zIndex: 8,
      }}
    >
      {/* Tick labels */}
      <div style={{ position: "relative", height: 16, marginBottom: 10 }}>
        {GENS.map((g, i) => {
          const tt = i / (GENS.length - 1);
          const isActive = Math.abs(handleT - tt) < 0.01;
          return (
            <div
              key={g.id}
              style={{
                position: "absolute",
                left: `${tt * 100}%`,
                bottom: 0,
                transform: "translateX(-50%)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.5rem",
                letterSpacing: "0.16em",
                color: isActive ? "rgba(255,225,180,0.95)" : "rgba(180,180,210,0.42)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                textShadow: isActive ? "0 0 8px rgba(255,180,100,0.55)" : "none",
                transition: "color 0.3s ease, text-shadow 0.3s ease",
              }}
            >
              {g.label}
            </div>
          );
        })}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        data-book-interactive
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "relative",
          width: "100%",
          height: 22,
          cursor: active ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            transform: "translateY(-50%)",
            background:
              "linear-gradient(to right, rgba(140,160,210,0.2) 0%, rgba(255,180,100,0.5) 50%, rgba(140,160,210,0.2) 100%)",
          }}
        />
        {GENS.map((g, i) => (
          <div
            key={g.id}
            style={{
              position: "absolute",
              top: "50%",
              left: `${(i / (GENS.length - 1)) * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 1,
              height: 8,
              background: "rgba(180,180,210,0.45)",
            }}
          />
        ))}
        <motion.div
          animate={{ left: `${handleT * 100}%` }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,225,200,0.96) 0%, rgba(255,180,100,0.95) 70%)",
            boxShadow:
              "0 0 14px rgba(255,180,100,0.7), 0 0 28px rgba(255,160,80,0.32)",
            border: "1px solid rgba(255,210,170,0.85)",
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   BRIDGE VISUAL — 4 pillars connected by a thread
================================================================ */
function BridgeVisual({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        bottom: "10%",
        left: "10%",
        right: "10%",
        zIndex: 5,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 360 480"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="bf-bridge-thread" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,200,140,0.18)" />
            <stop offset="50%" stopColor="rgba(255,180,100,0.62)" />
            <stop offset="100%" stopColor="rgba(255,200,140,0.18)" />
          </linearGradient>
        </defs>

        {/* Vertical thread — connects all 4 markers */}
        <line
          x1="180"
          y1="40"
          x2="180"
          y2="440"
          stroke="url(#bf-bridge-thread)"
          strokeWidth="1.4"
          strokeDasharray="2 4"
        />

        {/* 4 generations as horizontal bands */}
        {GENS.map((g, i) => {
          const y = 60 + i * 120;
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <g key={g.id}>
              {/* Marker pulse */}
              {isActive && (
                <motion.circle
                  cx="180"
                  cy={y}
                  animate={{ r: [10, 26, 10], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                  fill="none"
                  stroke="rgba(255,180,100,0.65)"
                  strokeWidth="1"
                />
              )}

              {/* Marker dot */}
              <circle
                cx="180"
                cy={y}
                r={isActive ? 7 : isPast ? 5 : 4}
                fill={
                  isActive
                    ? "rgba(255,225,180,0.96)"
                    : isPast
                      ? "rgba(255,180,100,0.7)"
                      : "rgba(180,195,225,0.42)"
                }
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 8px rgba(255,180,100,0.85))"
                    : isPast
                      ? "drop-shadow(0 0 4px rgba(255,180,100,0.5))"
                      : "none",
                  transition: "fill 0.5s ease, r 0.5s ease",
                }}
              />

              {/* Horizontal hand-off line — connects this gen to next */}
              {i < GENS.length - 1 && (
                <motion.line
                  x1="180"
                  y1={y + 7}
                  x2="180"
                  y2={y + 113}
                  stroke="rgba(255,180,100,0.42)"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: i < activeIndex ? 1 : 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}

              {/* Generation label */}
              <text
                x="180"
                y={y + 30}
                textAnchor="middle"
                fontFamily="var(--font-serif)"
                fontStyle="italic"
                fontSize="11"
                fontWeight="400"
                letterSpacing="3"
                fill={
                  isActive
                    ? "rgba(255,225,185,0.96)"
                    : "rgba(220,210,235,0.55)"
                }
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.85)",
                  textTransform: "uppercase",
                  transition: "fill 0.5s ease",
                }}
              >
                {g.label}
              </text>

              {/* Hindi sublabel */}
              <text
                x="180"
                y={y + 46}
                textAnchor="middle"
                fontFamily="var(--font-serif)"
                fontSize="10"
                fontWeight="400"
                letterSpacing="1"
                fill={isActive ? "rgba(255,200,140,0.78)" : "rgba(180,195,225,0.4)"}
                style={{
                  transition: "fill 0.5s ease",
                }}
              >
                {g.hi}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
