"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 1 — WHAT CONNECTS YOU
   ────────────────────────────────────────────────────────────
   The reader chooses one or more "threads" — Music, Food,
   Language, Festival, Place, Family Memory. Each tap lights a
   small glyph and adds it to the thread on the left page.
================================================================ */

const TITLE = "What Connects You";
const HI_SUB = "जो तुम्हें जोड़ता है";
const QUESTION = "What makes you feel connected?";
const HINT = "Choose what brings you home";

type ThreadId = "music" | "food" | "language" | "festival" | "place" | "memory";

interface Thread {
  id: ThreadId;
  label: string;
  hi: string;
}

const THREADS: Thread[] = [
  { id: "music",    label: "Music",         hi: "संगीत"   },
  { id: "food",     label: "Food",          hi: "भोजन"    },
  { id: "language", label: "Language",      hi: "भाषा"    },
  { id: "festival", label: "Festival",      hi: "त्योहार"  },
  { id: "place",    label: "Place",         hi: "स्थान"   },
  { id: "memory",   label: "Family Memory", hi: "स्मृति"   },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE
================================================================ */
const _selected = new Set<ThreadId>();
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _selected.clear();
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _toggle(id: ThreadId) {
  if (_selected.has(id)) _selected.delete(id);
  else _selected.add(id);
  _notify();
}
function useThreads() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return {
    isSelected: (id: ThreadId) => _selected.has(id),
    selected: THREADS.filter(t => _selected.has(t.id)),
    count: _selected.size,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const WhatConnectsYouPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <ConnectLeft forwardedRef={ref} />;
    return <ConnectRight forwardedRef={ref} />;
  }
);
WhatConnectsYouPage.displayName = "WhatConnectsYouPage";
export default WhatConnectsYouPage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + question + selected threads readout
================================================================ */
function ConnectLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { selected, count } = useThreads();

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={1}
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
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.55, scaleX: 1 }}
          transition={{ duration: 1.3, delay: 1.2 }}
          style={{
            width: "2rem",
            height: 1,
            background: "rgba(255,180,100,0.55)",
            marginTop: "1rem",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* The question */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "10%",
          right: "10%",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.8 }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.96rem",
            lineHeight: 1.6,
            color: "rgba(245,228,205,0.92)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {QUESTION}
        </motion.p>
      </div>

      {/* Your thread readout */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "10%",
          right: "10%",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <ThreadReadout selected={selected} />
      </div>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT — 6 thread options
================================================================ */
function ConnectRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { isSelected, count } = useThreads();

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={2}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="right" count={count} />

      {/* 2x3 grid of options */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          bottom: "12%",
          left: "8%",
          right: "8%",
          zIndex: 6,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {THREADS.map(t => (
          <ThreadOption
            key={t.id}
            thread={t}
            on={isSelected(t.id)}
            onToggle={() => _toggle(t.id)}
          />
        ))}
      </div>

      {count < 1 && (
        <InteractionHint
          emphasis
          style={{
            bottom: "1.6rem",
            right: "2.5rem",
            zIndex: 11,
            color: "rgba(255,210,160,0.85)",
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
   ROOM BACKDROP — midnight + warm glow growing with count
================================================================ */
function RoomBackdrop({ side, count }: { side: "left" | "right"; count: number }) {
  const t = Math.min(1, count / 4);
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at ${
            side === "left" ? "30%" : "70%"
          } 55%, rgba(${110 + t * 80},${50 + t * 50},${40 + t * 30},${0.18 + t * 0.30}) 0%, transparent 70%)`,
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
   THREAD OPTION — clickable card with glyph + label
================================================================ */
function ThreadOption({
  thread,
  on,
  onToggle,
}: {
  thread: Thread;
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
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        position: "relative",
        background: on
          ? "linear-gradient(160deg, rgba(255,170,80,0.10) 0%, rgba(255,150,70,0.04) 100%)"
          : hover
            ? "rgba(255,235,210,0.04)"
            : "rgba(255,235,210,0.02)",
        border: on
          ? "1px solid rgba(255,180,100,0.55)"
          : hover
            ? "1px solid rgba(255,210,170,0.32)"
            : "1px solid rgba(220,210,235,0.16)",
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 8px",
        boxShadow: on
          ? "0 0 22px rgba(255,180,100,0.22), 0 6px 14px rgba(0,0,0,0.45)"
          : "0 4px 10px rgba(0,0,0,0.35)",
        transition: "all 0.45s ease",
      }}
    >
      <div style={{ height: 36, display: "flex", alignItems: "center" }}>
        <ThreadGlyph id={thread.id} on={on} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          color: on ? "rgba(255,225,185,0.96)" : "rgba(220,225,245,0.78)",
          textTransform: "uppercase",
          transition: "color 0.45s ease",
        }}
      >
        {thread.label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.6rem",
          letterSpacing: "0.04em",
          color: on ? "rgba(255,200,140,0.78)" : "rgba(180,195,225,0.5)",
          transition: "color 0.45s ease",
        }}
      >
        {thread.hi}
      </div>
    </button>
  );
}

function ThreadGlyph({ id, on }: { id: ThreadId; on: boolean }) {
  const c = on ? "rgba(255,200,130,0.95)" : "rgba(180,195,225,0.55)";
  const glow = on ? "drop-shadow(0 0 5px rgba(255,180,90,0.6))" : "none";

  if (id === "music") {
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" style={{ filter: glow }}>
        <path d="M 9 5 L 18 4 L 18 18" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="7" cy="18" rx="3.5" ry="2.5" fill={c} />
        <ellipse cx="16" cy="18.5" rx="3.5" ry="2.5" fill={c} />
      </svg>
    );
  }
  if (id === "food") {
    return (
      <svg width="28" height="22" viewBox="0 0 28 22" style={{ filter: glow }}>
        {/* Bowl */}
        <path d="M 4 8 Q 14 22 24 8 Z" fill={c} opacity="0.85" />
        {/* Steam */}
        <path d="M 11 5 Q 13 3 11 1" stroke={c} strokeWidth="0.8" fill="none" />
        <path d="M 17 5 Q 19 3 17 1" stroke={c} strokeWidth="0.8" fill="none" />
      </svg>
    );
  }
  if (id === "language") {
    return (
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.2rem",
          color: c,
          filter: glow,
          letterSpacing: "0.04em",
          fontWeight: 400,
        }}
      >
        अ ब क
      </div>
    );
  }
  if (id === "festival") {
    return (
      <svg width="22" height="28" viewBox="0 0 22 28" style={{ filter: glow }}>
        {/* Flame */}
        <path d="M 11 4 Q 7 8 9 14 Q 11 11 13 14 Q 15 8 11 4 Z" fill={c} />
        {/* Diya bowl */}
        <path d="M 3 18 Q 11 28 19 18 Z" fill={c} opacity="0.85" />
      </svg>
    );
  }
  if (id === "place") {
    return (
      <svg width="22" height="28" viewBox="0 0 22 28" style={{ filter: glow }}>
        <path d="M 11 2 C 16 2 19 5 19 10 C 19 16 11 26 11 26 C 11 26 3 16 3 10 C 3 5 6 2 11 2 Z"
          fill={c} opacity="0.9" />
        <circle cx="11" cy="10" r="3" fill="rgba(10,8,32,0.95)" />
      </svg>
    );
  }
  // memory
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" style={{ filter: glow }}>
      <rect x="3" y="3" width="22" height="18" rx="1.5" fill="none" stroke={c} strokeWidth="1.4" />
      <rect x="6" y="6" width="16" height="12" fill={c} opacity="0.4" />
      <circle cx="11" cy="11" r="1.6" fill={c} />
      <path d="M 7 17 L 11 13 L 14 16 L 18 11 L 22 17 Z" fill={c} opacity="0.8" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   THREAD READOUT — visual representation of selected threads
================================================================ */
function ThreadReadout({ selected }: { selected: Thread[] }) {
  if (selected.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.7rem",
          lineHeight: 1.7,
          color: "rgba(195,210,235,0.5)",
          textShadow: "0 0 14px rgba(0,0,0,0.85)",
          letterSpacing: "0.04em",
        }}
      >
        Tap a thread on the right.
      </motion.p>
    );
  }

  const list =
    selected.length === 1
      ? selected[0].label
      : selected.length === 2
        ? `${selected[0].label} and ${selected[1].label}`
        : selected.slice(0, -1).map(s => s.label).join(", ") +
          ", and " +
          selected[selected.length - 1].label;

  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.74rem",
          lineHeight: 1.65,
          color: "rgba(220,210,235,0.78)",
          textShadow: "0 0 12px rgba(0,0,0,0.85)",
          letterSpacing: "0.02em",
        }}
      >
        Your thread begins with
      </motion.p>
      <motion.p
        key={list}
        initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        style={{
          margin: "0.6rem 0 0",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "0.94rem",
          lineHeight: 1.55,
          color: "rgba(255,225,185,0.96)",
          textShadow:
            "0 0 18px rgba(255,180,100,0.45), 0 0 4px rgba(0,0,0,0.85)",
          letterSpacing: "0.01em",
        }}
      >
        {list}.
      </motion.p>

      {/* Selected glyphs row */}
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: "1.4rem",
          alignItems: "center",
        }}
      >
        <AnimatePresence>
          {selected.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <ThreadGlyph id={s.id} on={true} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
