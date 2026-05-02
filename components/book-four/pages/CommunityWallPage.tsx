"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 6 — COMMUNITY WALL
   ────────────────────────────────────────────────────────────
   A wall of small words drifts across the spread. The reader
   taps the ones that feel like theirs; each one lights up.
   When at least three are gathered, the final line emerges:

     "You do not have to be fully American or fully Indian.
      You can be both."
================================================================ */

const TITLE = "Community Wall";
const HI_SUB = "हम सब साथ";
const HINT = "Add the words that feel like yours";
const FINAL_LEAD = "You do not have to be fully American";
const FINAL_MID = "or fully Indian.";
const FINAL_EMPH = "You can be both.";

interface WordEntry {
  id: string;
  text: string;
  /** position % within its page */
  x: number;
  y: number;
  size: number;
  rot: number;
  side: "left" | "right";
}

const WORDS: WordEntry[] = [
  { id: "connection", text: "connection", x: 30, y: 32, size: 1.0, rot: -2, side: "left" },
  { id: "belonging",  text: "belonging",  x: 70, y: 22, size: 0.95, rot: 1, side: "left" },
  { id: "home",       text: "home",       x: 24, y: 56, size: 1.15, rot: 1, side: "left" },
  { id: "thread",     text: "thread",     x: 72, y: 50, size: 0.85, rot: -1, side: "left" },
  { id: "diya",       text: "diya",       x: 50, y: 72, size: 0.78, rot: 2, side: "left" },
  { id: "warmth",     text: "warmth",     x: 30, y: 80, size: 0.78, rot: -1, side: "left" },

  { id: "bridge",     text: "bridge",     x: 35, y: 26, size: 1.15, rot: 1, side: "right" },
  { id: "language",   text: "language",   x: 70, y: 38, size: 0.95, rot: -2, side: "right" },
  { id: "music",      text: "music",      x: 28, y: 50, size: 0.85, rot: -1, side: "right" },
  { id: "memory",     text: "memory",     x: 60, y: 60, size: 0.85, rot: 2, side: "right" },
  { id: "family",     text: "family",     x: 25, y: 76, size: 0.95, rot: 1, side: "right" },
  { id: "both",       text: "both",       x: 70, y: 80, size: 1.20, rot: -1, side: "right" },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE
================================================================ */
const _picked = new Set<string>();
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _picked.clear();
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _toggle(id: string) {
  if (_picked.has(id)) _picked.delete(id);
  else _picked.add(id);
  _notify();
}
function useWall() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return {
    isPicked: (id: string) => _picked.has(id),
    count: _picked.size,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const CommunityWallPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <WallLeft forwardedRef={ref} />;
    return <WallRight forwardedRef={ref} />;
  }
);
CommunityWallPage.displayName = "CommunityWallPage";
export default CommunityWallPage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + half the wall
================================================================ */
function WallLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { isPicked, count } = useWall();
  const myWords = WORDS.filter(w => w.side === "left");

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={11}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="left" count={count} />

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

      {/* Words */}
      <WordField words={myWords} isPicked={isPicked} onToggle={_toggle} />

      {/* Connections — faint lines between picked words on this page */}
      <Connections words={myWords} isPicked={isPicked} />

      {count < 1 && (
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
   RIGHT — other half + final emphasis
================================================================ */
function WallRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { isPicked, count } = useWall();
  const myWords = WORDS.filter(w => w.side === "right");
  const enough = count >= 3;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={12}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="right" count={count} />

      <WordField words={myWords} isPicked={isPicked} onToggle={_toggle} />
      <Connections words={myWords} isPicked={isPicked} />

      {/* Final lines */}
      <AnimatePresence>
        {enough && (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.6 }}
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              bottom: "8%",
              textAlign: "center",
              zIndex: 12,
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.78rem",
                lineHeight: 1.6,
                color: "rgba(220,210,235,0.78)",
                textShadow: "0 0 14px rgba(0,0,0,0.85)",
              }}
            >
              {FINAL_LEAD}
              <br />
              {FINAL_MID}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 1.4 }}
              style={{
                margin: "0.85rem 0 0",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "1.1rem",
                lineHeight: 1.4,
                color: "rgba(255,225,185,0.96)",
                textShadow:
                  "0 0 20px rgba(255,180,100,0.55), 0 0 4px rgba(0,0,0,0.85)",
                letterSpacing: "0.01em",
              }}
            >
              {FINAL_EMPH}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOM BACKDROP — warms with count
================================================================ */
function RoomBackdrop({ side, count }: { side: "left" | "right"; count: number }) {
  const t = Math.min(1, count / 6);
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at ${
            side === "left" ? "60%" : "40%"
          } 55%, rgba(${110 + t * 80},${50 + t * 50},${40 + t * 30},${0.18 + t * 0.32}) 0%, transparent 70%)`,
          transition: "background 1.0s ease",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #07061a 0%, #0a0820 60%, #0c0820 100%)",
          mixBlendMode: "multiply",
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
   WORD FIELD
================================================================ */
function WordField({
  words,
  isPicked,
  onToggle,
}: {
  words: WordEntry[];
  isPicked: (id: string) => boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}
    >
      {words.map(w => (
        <Word
          key={w.id}
          w={w}
          on={isPicked(w.id)}
          onToggle={() => onToggle(w.id)}
        />
      ))}
    </div>
  );
}

function Word({
  w,
  on,
  onToggle,
}: {
  w: WordEntry;
  on: boolean;
  onToggle: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      data-book-interactive
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{
        position: "absolute",
        left: `${w.x}%`,
        top: `${w.y}%`,
        transform: `translate(-50%, -50%) rotate(${w.rot}deg) scale(${hover ? 1.08 : 1})`,
        background: "transparent",
        border: 0,
        padding: "6px 10px",
        cursor: "pointer",
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontWeight: on ? 400 : 300,
        fontSize: `${w.size * 0.95}rem`,
        letterSpacing: "0.04em",
        color: on
          ? "rgba(255,225,185,0.96)"
          : hover
            ? "rgba(245,235,220,0.85)"
            : "rgba(195,205,230,0.55)",
        textShadow: on
          ? "0 0 16px rgba(255,180,100,0.65), 0 0 4px rgba(0,0,0,0.85)"
          : "0 0 10px rgba(0,0,0,0.7)",
        transition:
          "color 0.45s ease, text-shadow 0.45s ease, transform 0.4s cubic-bezier(0.22,0.61,0.36,1), font-weight 0.45s ease",
        pointerEvents: "all",
      }}
    >
      {w.text}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   CONNECTIONS — faint lines between picked words on the same page
================================================================ */
function Connections({
  words,
  isPicked,
}: {
  words: WordEntry[];
  isPicked: (id: string) => boolean;
}) {
  const picked = words.filter(w => isPicked(w.id));
  if (picked.length < 2) return null;

  // Pair up adjacent picked words (in selection-stable order — by id)
  const pairs: Array<[WordEntry, WordEntry]> = [];
  for (let i = 0; i < picked.length - 1; i++) {
    pairs.push([picked[i], picked[i + 1]]);
  }

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      {pairs.map(([a, b], i) => (
        <motion.line
          key={`${a.id}-${b.id}`}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="rgba(255,200,140,0.42)"
          strokeWidth="0.25"
          strokeDasharray="0.5 1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}
