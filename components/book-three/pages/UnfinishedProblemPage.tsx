"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";
import deskScene from "../assets/desk-scene.png";

/* ════════════════════════════════════════════════════════════
   PAGE 1 — THE UNFINISHED PROBLEM
   ────────────────────────────────────────────────────────────
   A late-night desk: a small lantern glowing warm on the left
   page, an open laptop on the right page. Inside the laptop's
   screen sits a list of pending tabs.

     1. Click an item in the laptop list → that window pops out
        and floats above the desk at its target position.
     2. Click the red close button on a floating window → it
        minimizes into a chip in the bottom tab bar.

   Each item has a headline plus body copy; the laptop list order
   is publication → dissertation → appointment → insurance →
   job market → internship → visa.

   The problems didn't disappear — they only moved to the
   background.
================================================================ */

const TITLE = "The Unfinished Problem";
const KO_SUB = "끝나지 않은 일들";
const NARR_TOP_1 = "Some problems did not disappear.";
const NARR_TOP_2 = "They only moved to the background.";
const NARR_BOT = "Tomorrow, they would still be there.";
const HINT_OPEN = "Click an item on the screen to open it";
const HINT_CLOSE = "Click the red button to minimize the noise";

const SCENE_SRC = deskScene.src;

/* ════════════════════════════════════════════════════════════
   WINDOWS
================================================================ */
type WinSize = "sm" | "md" | "lg";
type WinState = "list" | "opened" | "minimized";
type StressWin = {
  id: string;
  /** Caps label in list, title bar, and body header */
  headline: string;
  /** Center copy; use \\n for line breaks */
  body: string;
  size: WinSize;
  /** x/y in % of its target page, where the popped window lands */
  x: number;
  y: number;
  rot: number;
  z: number;
  side: "left" | "right";
};

/** Laptop list order matches 1–7 below */
const WINDOWS: StressWin[] = [
  {
    id: "publication",
    headline: "PUBLICATION",
    body: "Waiting for revision again.",
    size: "lg",
    x: 48,
    y: 30,
    rot: -1.6,
    z: 4,
    side: "left",
  },
  {
    id: "dissertation",
    headline: "DISSERTATION",
    body: "Still unfinished.",
    size: "md",
    x: 22,
    y: 24,
    rot: 2.4,
    z: 3,
    side: "left",
  },
  {
    id: "appointment",
    headline: "APPOINTMENT",
    body: "Next week,\nanother hospital.",
    size: "md",
    x: 24,
    y: 24,
    rot: 1.6,
    z: 4,
    side: "right",
  },
  {
    id: "insurance",
    headline: "INSURANCE",
    body: "Covered, but never certain.",
    size: "lg",
    x: 46,
    y: 24,
    rot: -1.2,
    z: 3,
    side: "right",
  },
  {
    id: "job-market",
    headline: "JOB MARKET",
    body: "So many openings.\nSo few ways in.",
    size: "md",
    x: 58,
    y: 38,
    rot: 1.4,
    z: 2,
    side: "right",
  },
  {
    id: "internship",
    headline: "INTERNSHIP",
    body: "Unpaid, and\nuncertain.",
    size: "md",
    x: 58,
    y: 52,
    rot: -2.2,
    z: 2,
    side: "left",
  },
  {
    id: "visa",
    headline: "VISA",
    body: "Valid, but never settled.",
    size: "sm",
    x: 34,
    y: 50,
    rot: -0.8,
    z: 1,
    side: "right",
  },
];

const SIZE_PX: Record<WinSize, { w: number; h: number; font: number }> = {
  sm: { w: 122, h: 138, font: 0.56 },
  md: { w: 152, h: 152, font: 0.6 },
  lg: { w: 172, h: 168, font: 0.64 },
};

/* ════════════════════════════════════════════════════════════
   MODULE STORE — every window has one of three states:
     "list"      — still inside the laptop list
     "opened"    — popped out, floating on the page
     "minimized" — collapsed into the bottom tab bar
================================================================ */
const _states = new Map<string, WinState>();
WINDOWS.forEach(w => _states.set(w.id, "list"));

const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    WINDOWS.forEach(w => _states.set(w.id, "list"));
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _open(id: string) {
  if (_states.get(id) === "opened") return;
  _states.set(id, "opened");
  _notify();
}
function _minimize(id: string) {
  if (_states.get(id) === "minimized") return;
  _states.set(id, "minimized");
  _notify();
}

function useStates() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  const stateOf = (id: string): WinState => _states.get(id) ?? "list";
  return {
    stateOf,
    counts: {
      list:      WINDOWS.filter(w => stateOf(w.id) === "list").length,
      opened:    WINDOWS.filter(w => stateOf(w.id) === "opened").length,
      minimized: WINDOWS.filter(w => stateOf(w.id) === "minimized").length,
    },
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const UnfinishedProblemPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <UnfinishedLeft forwardedRef={ref} />;
    return <UnfinishedRight forwardedRef={ref} />;
  }
);
UnfinishedProblemPage.displayName = "UnfinishedProblemPage";
export default UnfinishedProblemPage;

/* ════════════════════════════════════════════════════════════
   LEFT
================================================================ */
function UnfinishedLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { stateOf, counts } = useStates();
  const myWins = WINDOWS.filter(w => w.side === "left");

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={1}
      contentOverflow="visible"
      style={{ background: "#070612" }}
    >
      <RoomBackdrop side="left" />
      <Lantern />

      {/* Title block */}
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
            fontWeight: 300,
            fontSize: "0.66rem",
            letterSpacing: "0.32em",
            color: "rgba(180,190,225,0.55)",
            marginBottom: "0.7rem",
          }}
        >
          {KO_SUB}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.0, delay: 0.5, ease: "easeOut" }}
          className="page-title-spread"
          style={{
            color: "rgba(225,228,242,0.92)",
            textShadow: "0 0 22px rgba(0,0,0,0.85)",
            margin: 0,
          }}
        >
          {TITLE}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.55, scaleX: 1 }}
          transition={{ duration: 1.3, delay: 1.2 }}
          style={{
            width: "2rem",
            height: 1,
            background: "rgba(170,190,230,0.5)",
            marginTop: "1rem",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Windows */}
      <WindowField wins={myWins} stateOf={stateOf} />

      {/* Tab bar */}
      <TabBar wins={myWins} stateOf={stateOf} side="left" />

      {/* Hint — close hint on the left page (after at least one opened) */}
      {counts.opened > 0 && counts.minimized < counts.opened && (
        <InteractionHint
          emphasis
          style={{
            bottom: "1.8rem",
            left: "2.5rem",
            zIndex: 11,
            color: "rgba(245,210,160,0.85)",
          }}
        >
          {HINT_CLOSE}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT
================================================================ */
function UnfinishedRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { stateOf, counts } = useStates();
  const myWins = WINDOWS.filter(w => w.side === "right");
  const allMinimized = counts.minimized === WINDOWS.length;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={2}
      contentOverflow="visible"
      style={{ background: "#070612" }}
    >
      <RoomBackdrop side="right" />
      <Laptop stateOf={stateOf} />

      {/* Top narrative */}
      <div
        style={{
          position: "absolute",
          top: "2.8rem",
          right: "2.5rem",
          left: "2.5rem",
          textAlign: "right",
          zIndex: 9,
          pointerEvents: "none",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.5 }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.94rem",
            lineHeight: 1.7,
            color: "rgba(225,228,242,0.92)",
            textShadow: "0 0 14px rgba(0,0,0,0.95)",
            letterSpacing: "0.01em",
          }}
        >
          {NARR_TOP_1}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.0 }}
          style={{
            margin: "0.5rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            lineHeight: 1.7,
            color: "rgba(195,205,230,0.78)",
            textShadow: "0 0 14px rgba(0,0,0,0.95)",
          }}
        >
          {NARR_TOP_2}
        </motion.p>
      </div>

      {/* Windows */}
      <WindowField wins={myWins} stateOf={stateOf} />

      {/* Bottom narrative — emphasis after all minimized */}
      <AnimatePresence>
        {allMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.8 }}
            style={{
              position: "absolute",
              bottom: "5.4rem",
              right: "2.5rem",
              left: "2.5rem",
              textAlign: "right",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "0.96rem",
                lineHeight: 1.55,
                color: "rgba(245,225,200,0.94)",
                textShadow:
                  "0 0 18px rgba(255,180,100,0.35), 0 0 4px rgba(0,0,0,0.95)",
                letterSpacing: "0.01em",
              }}
            >
              {NARR_BOT}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab bar */}
      <TabBar wins={myWins} stateOf={stateOf} side="right" />

      {/* Hint — open hint on the right page (until any item is opened) */}
      {counts.opened === 0 && counts.list > 0 && (
        <InteractionHint
          emphasis
          style={{
            bottom: "1.8rem",
            right: "2.5rem",
            zIndex: 11,
            color: "rgba(245,210,160,0.85)",
            textAlign: "right",
          }}
        >
          {HINT_OPEN}
        </InteractionHint>
      )}
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
          backgroundImage: `url(${SCENE_SRC})`,
          backgroundSize: "200% auto",
          backgroundPosition: side === "left" ? "left center" : "right center",
          backgroundRepeat: "no-repeat",
          opacity: 0.68,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 60% at " +
            (side === "left" ? "18% 88%" : "78% 80%") +
            ", " +
            (side === "left"
              ? "rgba(255,160,80,0.18)"
              : "rgba(120,150,210,0.13)") +
            " 0%, transparent 65%)," +
            "radial-gradient(ellipse 90% 70% at " +
            (side === "left" ? "60%" : "40%") +
            " 40%, rgba(40,50,90,0.18) 0%, transparent 70%)," +
            "linear-gradient(180deg, #050610 0%, #07081a 60%, #060814 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "22%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(40,28,18,0.45) 30%, rgba(20,14,10,0.85) 100%)," +
            "repeating-linear-gradient(95deg, rgba(0,0,0,0) 0 22px, rgba(0,0,0,0.06) 22px 24px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 95% 95% at 50% 50%, transparent 50%, rgba(2,3,10,0.62) 100%)",
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
              ? "linear-gradient(to right, transparent, rgba(6,5,15,0.35))"
              : "linear-gradient(to left, transparent, rgba(6,5,15,0.35))",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   LANTERN — left page, lower-left, with flickering candle
================================================================ */
function Lantern() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "16%",
        bottom: "14%",
        zIndex: 3,
        pointerEvents: "none",
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
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,170,80,0.32) 0%, rgba(255,140,60,0.12) 35%, transparent 70%)",
          filter: "blur(2px)",
          mixBlendMode: "screen",
        }}
      />
      <div style={{ position: "relative", width: 38, height: 60 }}>
        <div
          style={{
            position: "absolute",
            top: -3,
            left: -3,
            right: -3,
            height: 4,
            background: "rgba(70,55,40,0.95)",
            borderRadius: "2px 2px 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1.5px solid rgba(80,65,45,0.95)",
            background:
              "linear-gradient(180deg, rgba(255,180,90,0.22) 0%, rgba(255,140,60,0.16) 100%)",
            boxShadow: "inset 0 0 12px rgba(255,150,80,0.35)",
          }}
        />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "rgba(80,65,45,0.6)", transform: "translateX(-50%)" }} />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 4,
            height: 14,
            background: "rgba(245,225,205,0.85)",
            borderRadius: 1,
          }}
        />
        <motion.div
          animate={{
            opacity: [0.85, 1, 0.9, 1, 0.88],
            scaleY: [1, 1.08, 0.95, 1.06, 1],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: 22,
            left: "50%",
            transform: "translateX(-50%)",
            transformOrigin: "bottom center",
            width: 4,
            height: 8,
            borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
            background:
              "radial-gradient(ellipse at 50% 70%, rgba(255,235,180,0.95) 0%, rgba(255,160,70,0.95) 60%, rgba(180,60,30,0.85) 100%)",
            boxShadow: "0 0 12px rgba(255,170,80,0.85), 0 0 24px rgba(255,140,60,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -6,
            left: -5,
            right: -5,
            height: 6,
            background: "rgba(70,55,40,0.95)",
            borderRadius: "0 0 2px 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -14,
            left: -16,
            right: -16,
            height: 8,
            background:
              "linear-gradient(180deg, rgba(60,40,25,0.95) 0%, rgba(30,18,10,0.95) 100%)",
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LAPTOP — right page; larger, centered; SVG + list overlay
================================================================ */
const LAPTOP_W = 288;
const LAPTOP_H = 216;

function Laptop({ stateOf }: { stateOf: (id: string) => WinState }) {
  const listed = WINDOWS.filter(w => stateOf(w.id) === "list");

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "6.5%",
        transform: "translateX(-50%)",
        width: LAPTOP_W,
        height: LAPTOP_H,
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      {/* Soft cool glow behind the screen */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.55, 0.78, 0.6, 0.82, 0.58] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "22%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 248,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(170,200,240,0.22) 0%, rgba(140,170,220,0.10) 50%, transparent 80%)",
          filter: "blur(3px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      <svg
        aria-hidden="true"
        width={LAPTOP_W}
        height={LAPTOP_H}
        viewBox="0 0 240 180"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="laptop-screen-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(180,200,240,0.20)" />
            <stop offset="60%" stopColor="rgba(120,150,210,0.10)" />
            <stop offset="100%" stopColor="rgba(40,50,80,0.20)" />
          </linearGradient>
          <linearGradient id="laptop-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(48,52,66,0.95)" />
            <stop offset="100%" stopColor="rgba(28,32,42,0.95)" />
          </linearGradient>
          <linearGradient id="laptop-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(58,62,76,0.95)" />
            <stop offset="100%" stopColor="rgba(34,38,48,0.95)" />
          </linearGradient>
        </defs>

        {/* Lid (slight perspective trapezoid) */}
        <path
          d="M 22 6 L 218 6 L 228 128 L 12 128 Z"
          fill="url(#laptop-bezel)"
          stroke="rgba(110,124,148,0.55)"
          strokeWidth="0.8"
        />
        {/* Screen interior */}
        <path
          d="M 32 14 L 208 14 L 216 120 L 24 120 Z"
          fill="url(#laptop-screen-glow)"
        />
        {/* Camera dot */}
        <circle cx="120" cy="10.5" r="1.2" fill="rgba(80,90,110,0.95)" />
        {/* Top sheen */}
        <path
          d="M 36 18 L 204 18 L 206 30 L 38 30 Z"
          fill="rgba(220,235,255,0.06)"
        />
        {/* Hinge */}
        <rect
          x="10"
          y="128"
          width="220"
          height="3"
          fill="rgba(40,44,56,0.95)"
        />
        {/* Base */}
        <path
          d="M 6 131 L 234 131 L 240 158 L 0 158 Z"
          fill="url(#laptop-base)"
          stroke="rgba(110,124,148,0.45)"
          strokeWidth="0.8"
        />
        {/* Front edge highlight */}
        <path
          d="M 0 158 L 240 158 L 238 161 L 2 161 Z"
          fill="rgba(140,156,180,0.4)"
        />
        {/* Trackpad hint */}
        <rect
          x="86"
          y="140"
          width="68"
          height="6"
          rx="1"
          fill="rgba(80,86,100,0.7)"
        />
        {/* Faux key rows */}
        {[134, 138].map((y, i) => (
          <g key={i} opacity={0.4}>
            {Array.from({ length: 14 }).map((_, k) => (
              <rect
                key={k}
                x={20 + k * 14}
                y={y}
                width="9"
                height="2.4"
                rx="0.5"
                fill="rgba(95,102,116,0.6)"
              />
            ))}
          </g>
        ))}
      </svg>

      {/* HTML list overlay — same ratios as 240×180 screen interior */}
      <div
        data-book-interactive
        style={{
          position: "absolute",
          left: "13.33%",
          top: "7.78%",
          width: "76.67%",
          height: "58.89%",
          padding: "10px 10px 8px",
          pointerEvents: "auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 4,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.96)",
              textTransform: "uppercase",
            }}
          >
            Pending
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.54rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {listed.length} / {WINDOWS.length}
          </span>
        </div>

        {/* List items */}
        <AnimatePresence>
          {listed.map(w => (
            <ListItem key={w.id} w={w} onOpen={() => _open(w.id)} />
          ))}
        </AnimatePresence>

        {listed.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.58rem",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.55)",
              textTransform: "uppercase",
            }}
          >
            inbox cleared
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   List item inside the laptop screen
──────────────────────────────────────────────────────────── */
function ListItem({ w, onOpen }: { w: StressWin; onOpen: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      type="button"
      data-book-interactive
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, transition: { duration: 0.35 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        width: "100%",
        padding: "2px 6px",
        background: hover ? "rgba(255,255,255,0.12)" : "transparent",
        border: 0,
        borderRadius: 3,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: "0.58rem",
        letterSpacing: "0.12em",
        color: hover ? "#ffffff" : "rgba(255,255,255,0.94)",
        textTransform: "uppercase",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: hover
            ? "rgba(255,210,160,0.95)"
            : "rgba(255,255,255,0.85)",
          boxShadow: hover ? "0 0 4px rgba(255,200,160,0.75)" : "none",
          flexShrink: 0,
          transition: "background 0.25s ease, box-shadow 0.25s ease",
        }}
      />
      <span style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", color: "inherit" }}>
        {w.headline}
      </span>
      <span
        style={{
          color: hover ? "#ffffff" : "rgba(255,255,255,0.65)",
          fontSize: "0.82rem",
          lineHeight: 1,
          transform: hover ? "translateX(1px)" : "none",
          transition: "color 0.25s ease, transform 0.25s ease",
        }}
      >
        ›
      </span>
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════
   WINDOW FIELD — renders only windows whose state === "opened"
================================================================ */
function WindowField({
  wins,
  stateOf,
}: {
  wins: StressWin[];
  stateOf: (id: string) => WinState;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        /* Let clicks reach the laptop list; only opened windows re-enable hits */
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {wins
          .filter(w => stateOf(w.id) === "opened")
          .map(w => (
            <Window key={w.id} w={w} onMinimize={() => _minimize(w.id)} />
          ))}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STRESS WINDOW — translucent glass card with macOS-style
   traffic lights. Red = close (minimize) is the click target.
================================================================ */
function Window({ w, onMinimize }: { w: StressWin; onMinimize: () => void }) {
  const [hover, setHover] = useState(false);
  const [redHover, setRedHover] = useState(false);
  const { w: WW, h: HH, font } = SIZE_PX[w.size];
  const bob = Math.sin(w.x * 0.3 + w.y * 0.2) * 1.5;

  return (
    <motion.div
      data-book-interactive
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.4, y: 30, filter: "blur(6px)" }}
      animate={{
        opacity: 1,
        scale: hover ? 1.03 : 1,
        y: bob,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: 110,
        scale: 0.16,
        filter: "blur(8px)",
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={{
        position: "absolute",
        left: `${w.x}%`,
        top: `${w.y}%`,
        transform: `translate(-50%, -50%) rotate(${w.rot}deg)`,
        width: WW,
        height: HH,
        zIndex: w.z,
        pointerEvents: "auto",
      }}
    >
      {/* Glass card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 10,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 60%, rgba(220,235,255,0.05) 100%)",
          border: hover
            ? "1px solid rgba(220,235,255,0.45)"
            : "1px solid rgba(220,235,255,0.22)",
          boxShadow: hover
            ? "0 0 28px rgba(180,210,250,0.18), 0 6px 18px rgba(0,0,0,0.55), inset 0 0 18px rgba(255,255,255,0.04)"
            : "0 0 22px rgba(120,150,200,0.10), 0 6px 14px rgba(0,0,0,0.45), inset 0 0 14px rgba(255,255,255,0.03)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition:
            "border 0.35s ease, box-shadow 0.35s ease, background 0.35s ease",
        }}
      />

      {/* Title bar — traffic lights pinned left; full title centered in bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 20,
          borderBottom: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 5,
            zIndex: 2,
          }}
        >
          <button
            type="button"
            data-book-interactive
            onPointerEnter={() => setRedHover(true)}
            onPointerLeave={() => setRedHover(false)}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            aria-label={`Close ${w.headline}`}
            style={{
              width: 9,
              height: 9,
              padding: 0,
              border: "0.5px solid rgba(160,30,30,0.85)",
              borderRadius: "50%",
              background: redHover
                ? "radial-gradient(circle at 35% 30%, rgba(255,150,150,1) 0%, rgba(220,40,40,1) 70%)"
                : "radial-gradient(circle at 35% 30%, rgba(255,120,120,0.95) 0%, rgba(225,55,55,0.95) 70%)",
              boxShadow: redHover
                ? "0 0 10px rgba(255,80,80,0.85), inset 0 0 1px rgba(255,255,255,0.5)"
                : "0 0 4px rgba(220,40,40,0.6), inset 0 0 1px rgba(255,255,255,0.45)",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              transition: "background 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontFamily: "var(--font-serif)",
                fontWeight: 600,
                fontSize: "0.58rem",
                color: "rgba(80,8,8,0.95)",
                opacity: redHover ? 1 : 0,
                transition: "opacity 0.25s ease",
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              ×
            </span>
          </button>
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,210,120,0.95) 0%, rgba(220,170,60,0.95) 70%)",
              border: "0.5px solid rgba(160,110,20,0.7)",
              boxShadow: "inset 0 0 1px rgba(255,255,255,0.4)",
              opacity: 0.85,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(160,225,160,0.95) 0%, rgba(80,180,100,0.95) 70%)",
              border: "0.5px solid rgba(20,110,40,0.7)",
              boxShadow: "inset 0 0 1px rgba(255,255,255,0.4)",
              opacity: 0.85,
              flexShrink: 0,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 52,
            paddingRight: 8,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.56rem",
              letterSpacing: "0.08em",
              color: hover
                ? "#ffffff"
                : "rgba(255,255,255,0.9)",
              textTransform: "uppercase",
              textShadow: "0 0 6px rgba(0,0,0,0.5)",
              transition: "color 0.35s ease",
              textAlign: "center",
              lineHeight: 1.15,
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            {w.headline}
          </span>
        </div>
      </div>

      {/* Top sheen */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 1,
          left: "8%",
          right: "8%",
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.30), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Body — headline + copy, centered */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px 8px",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: `${Math.min(0.62, font + 0.08).toFixed(2)}rem`,
            letterSpacing: "0.12em",
            lineHeight: 1.25,
            color: hover
              ? "#ffffff"
              : "rgba(255,255,255,0.96)",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,0,0,0.65)",
            transition: "color 0.35s ease",
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {w.headline}
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: `${Math.max(0.5, font - 0.06).toFixed(2)}rem`,
            letterSpacing: "0.03em",
            lineHeight: 1.45,
            color: hover
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.88)",
            textShadow: "0 0 8px rgba(0,0,0,0.55)",
            transition: "color 0.35s ease",
            maxWidth: "100%",
            whiteSpace: "pre-line",
          }}
        >
          {w.body}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB BAR — renders only windows whose state === "minimized"
================================================================ */
function TabBar({
  wins,
  stateOf,
  side,
}: {
  wins: StressWin[];
  stateOf: (id: string) => WinState;
  side: "left" | "right";
}) {
  const minWins = wins.filter(w => stateOf(w.id) === "minimized");
  return (
    <div
      style={{
        position: "absolute",
        bottom: "3.6rem",
        left: "2.5rem",
        right: "2.5rem",
        zIndex: 7,
        pointerEvents: "none",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.4rem",
        justifyContent: side === "right" ? "flex-end" : "flex-start",
        opacity: minWins.length > 0 ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <AnimatePresence>
        {minWins.map(w => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 14, scale: 0.4 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.18,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 6,
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
              border: "1px solid rgba(220,235,255,0.18)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.64rem",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.92)",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,150,150,0.95) 0%, rgba(220,55,55,0.95) 70%)",
                boxShadow: "0 0 4px rgba(220,55,55,0.55)",
              }}
            />
            {w.headline}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
