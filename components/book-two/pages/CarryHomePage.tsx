"use client";

import React, { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   CLOSING — WHAT WE CARRY HOME
   ────────────────────────────────────────────────────────────
   Small fragments — a song, a meal, a photo, a prayer, a friend,
   a word for hope — drift on the left page. The reader clicks
   each one to gather it. Each gathered fragment moves to a
   shared pool of warm light on the right page. When all are
   gathered, the final emphasis line emerges.
════════════════════════════════════════════════════════════ */

const TITLE = "What We Carry Home";
const VN_SUB = "Những gì ta mang theo";

const NARR_TOP = "We could not carry the whole country with us.";
const NARR_MID = "So we carried smaller things.";
const NARR_FINAL_1 = "Home did not disappear.";
const NARR_FINAL_2 = "It became something we learned to gather.";

const EMPHASIS_1 = "Not the same as home.";
const EMPHASIS_2 = "But enough to begin again.";

const HINT = "Click to gather the fragments";

/* ════════════════════════════════════════════════════════════
   FRAGMENT DEFINITIONS
   id, label (English), vn (Vietnamese), x, y on the left page
════════════════════════════════════════════════════════════ */
type Fragment = {
  id: string;
  label: string;
  vn: string;
  x: number;
  y: number;
};

const FRAGMENTS: Fragment[] = [
  { id: "song",   label: "A song",   vn: "Một bài hát", x: 22, y: 28 },
  { id: "meal",   label: "A meal",   vn: "Một bữa cơm", x: 68, y: 22 },
  { id: "photo",  label: "A photo",  vn: "Một tấm ảnh", x: 46, y: 42 },
  { id: "prayer", label: "A prayer", vn: "Một lời khấn", x: 28, y: 62 },
  { id: "friend", label: "A friend", vn: "Một người bạn", x: 72, y: 60 },
  { id: "hope",   label: "A word for hope", vn: "Hy vọng", x: 50, y: 78 },
];

/* ════════════════════════════════════════════════════════════
   MODULE-LEVEL STORE
════════════════════════════════════════════════════════════ */
const _gathered = new Set<string>();
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _gathered.clear();
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _gather(id: string) {
  if (_gathered.has(id)) return;
  _gathered.add(id);
  _notify();
}
function useGathered() {
  const [n, setN] = useState(_gathered.size);
  useEffect(() => {
    const cb = () => setN(_gathered.size);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return { count: n, has: (id: string) => _gathered.has(id) };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════════════ */
interface PageProps { side?: "left" | "right" }

const CarryHomePage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <CarryLeft forwardedRef={ref} />;
    return <CarryRight forwardedRef={ref} />;
  }
);
CarryHomePage.displayName = "CarryHomePage";
export default CarryHomePage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + floating fragments
════════════════════════════════════════════════════════════ */
function CarryLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { count, has } = useGathered();

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={7}
      style={{ background: "#0b0810" }}
    >
      <ClosingBackdrop side="left" warmth={count / FRAGMENTS.length} />

      {/* Title */}
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
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.6rem",
            letterSpacing: "0.32em",
            color: "rgba(220,170,110,0.6)",
            textTransform: "uppercase",
            marginBottom: "0.7rem",
          }}
        >
          {VN_SUB}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.0, delay: 0.5, ease: "easeOut" }}
          className="page-title-spread"
          style={{
            color: "rgba(245,225,195,0.92)",
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
            background: "rgba(220,170,100,0.55)",
            marginTop: "1rem",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Floating fragments */}
      {FRAGMENTS.map(f => (
        <FragmentLight
          key={f.id}
          f={f}
          gathered={has(f.id)}
          onClick={() => _gather(f.id)}
        />
      ))}

      {count < 1 && (
        <InteractionHint
          emphasis
          style={{
            bottom: "2rem",
            left: "2.5rem",
            zIndex: 11,
            color: "rgba(232,200,170,0.85)",
          }}
        >
          {HINT}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT — gathering pool + closing poem
════════════════════════════════════════════════════════════ */
function CarryRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { count, has } = useGathered();
  const allGathered = count >= FRAGMENTS.length;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={8}
      style={{ background: "#0b0810" }}
    >
      <ClosingBackdrop side="right" warmth={count / FRAGMENTS.length} />

      {/* Top narrative — fades through phases */}
      <div
        style={{
          position: "absolute",
          top: "3rem",
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
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: "rgba(245,225,195,0.92)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {NARR_TOP}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.2 }}
          style={{
            margin: "0.6rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            lineHeight: 1.8,
            color: "rgba(220,200,170,0.78)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {NARR_MID}
        </motion.p>
      </div>

      {/* The pool — central warm circle that fills with gathered fragments */}
      <Pool gatheredIds={FRAGMENTS.filter(f => has(f.id)).map(f => f.id)} />

      {/* Bottom — final emphasis when all gathered */}
      <AnimatePresence>
        {allGathered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, delay: 1.0, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "4.5rem",
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
                fontWeight: 300,
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "rgba(220,200,170,0.78)",
                textShadow: "0 0 14px rgba(0,0,0,0.85)",
              }}
            >
              {NARR_FINAL_1}
              <br />
              {NARR_FINAL_2}
            </p>
            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 2.0, delay: 2.0 }}
              style={{
                margin: "1.6rem 0 0",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "1.05rem",
                lineHeight: 1.55,
                color: "rgba(255,225,185,0.96)",
                textShadow:
                  "0 0 18px rgba(255,180,100,0.45), 0 0 4px rgba(0,0,0,0.85)",
                letterSpacing: "0.01em",
              }}
            >
              {EMPHASIS_1}
              <br />
              <strong style={{ fontWeight: 400 }}>{EMPHASIS_2}</strong>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   CLOSING BACKDROP — deep night with gentle warmth that grows
════════════════════════════════════════════════════════════ */
function ClosingBackdrop({
  side,
  warmth,
}: {
  side: "left" | "right";
  warmth: number;
}) {
  const cx = side === "left" ? "30%" : "50%";
  const cy = side === "left" ? "55%" : "55%";
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at ${cx} ${cy}, rgba(${
            70 + warmth * 80
          },${30 + warmth * 50},${10 + warmth * 20},${0.18 + warmth * 0.4}) 0%, transparent 70%)`,
          transition: "background 1.0s ease",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(2,1,4,0.85) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   FRAGMENT LIGHT — a warm glowing word; click to gather
   Each id carries a small motif (record ring, bowl glow, frame, smoke, …).
════════════════════════════════════════════════════════════ */
function FragmentLight({
  f,
  gathered,
  onClick,
}: {
  f: Fragment;
  gathered: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const haloOpacity = f.id === "hope" ? [0.35, 0.75, 0.35] : [0.22, 0.5, 0.22];
  const haloHover = f.id === "hope" ? [0.55, 0.95, 0.55] : [0.45, 0.85, 0.45];

  return (
    <motion.div
      data-book-interactive
      role="button"
      tabIndex={0}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); if (!gathered) onClick(); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!gathered) onClick();
        }
      }}
      animate={{
        opacity: gathered ? 0 : 1,
        scale: gathered ? 0.4 : 1,
        y: gathered ? -20 : 0,
      }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "absolute",
        left: `${f.x}%`,
        top: `${f.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: gathered ? "default" : "pointer",
        zIndex: 6,
        textAlign: "center",
        pointerEvents: gathered ? "none" : "auto",
      }}
    >
      <div style={{ position: "relative", width: 100, margin: "0 auto", minHeight: 88 }}>
        {/* Motif layer — behind glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 96,
            height: 88,
            marginLeft: -48,
            marginTop: -44,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <FragmentMotif id={f.id} active={hover} />
        </div>

        {/* Halo */}
        <motion.div
          animate={{
            opacity: hover ? haloHover : haloOpacity,
          }}
          transition={{ duration: f.id === "hope" ? 2.0 : 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: f.id === "hope" ? 92 : 80,
            height: f.id === "hope" ? 92 : 80,
            marginLeft: f.id === "hope" ? -46 : -40,
            marginTop: f.id === "hope" ? -46 : -40,
            borderRadius: "50%",
            background:
              f.id === "hope"
                ? "radial-gradient(circle, rgba(255,230,180,0.55) 0%, rgba(255,195,110,0.28) 38%, transparent 72%)"
                : "radial-gradient(circle, rgba(255,210,140,0.5) 0%, rgba(255,170,90,0.18) 40%, transparent 70%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Centre light(s) */}
        <div style={{ position: "relative", zIndex: 2, paddingTop: 2 }}>
          <FragmentCore id={f.id} hover={hover} />
        </div>

        {/* Label */}
        <div
          style={{
            marginTop: "0.45rem",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.72rem",
            letterSpacing: "0.04em",
            color: "rgba(245,220,180,0.92)",
            textShadow: "0 0 10px rgba(0,0,0,0.85)",
            whiteSpace: "nowrap",
            position: "relative",
            zIndex: 2,
          }}
        >
          {f.label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.55rem",
            letterSpacing: "0.04em",
            color: "rgba(220,190,160,0.65)",
            textShadow: "0 0 8px rgba(0,0,0,0.85)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {f.vn}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Small motif behind each fragment glow ───────────────── */
function FragmentMotif({ id, active }: { id: string; active: boolean }) {
  const uid = useId().replace(/:/g, "");
  const blurId = `smoke-${uid}`;

  if (id === "song") {
    return (
      <motion.div
        aria-hidden
        animate={{ rotate: active ? 8 : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 54,
          height: 54,
          marginLeft: -27,
          marginTop: -27,
          opacity: 0.55,
        }}
      >
        <svg width="54" height="54" viewBox="0 0 54 54">
          <circle cx="27" cy="27" r="23" fill="none" stroke="rgba(255,200,130,0.28)" strokeWidth="1" />
          <circle cx="27" cy="27" r="17.5" fill="none" stroke="rgba(255,215,150,0.22)" strokeWidth="0.75" />
          <circle cx="27" cy="27" r="12" fill="none" stroke="rgba(255,225,170,0.18)" strokeWidth="0.6" />
          <circle cx="27" cy="27" r="4" fill="rgba(255,210,140,0.12)" />
        </svg>
      </motion.div>
    );
  }

  if (id === "meal") {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "54%",
          transform: "translate(-50%, -50%)",
          width: 64,
          height: 40,
          opacity: 0.85,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "10% 8% 0",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255,190,110,0.35) 0%, rgba(255,150,70,0.12) 45%, transparent 75%)",
            filter: "blur(1px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 2,
            transform: "translateX(-50%)",
            width: 48,
            height: 20,
            borderRadius: "50% 50% 45% 45% / 35% 35% 65% 65%",
            border: "1px solid rgba(255,205,150,0.22)",
            boxShadow:
              "0 10px 22px rgba(255,140,60,0.12), inset 0 -8px 14px rgba(255,120,50,0.08)",
            background: "linear-gradient(180deg, rgba(60,40,30,0.15) 0%, rgba(255,200,140,0.06) 100%)",
          }}
        />
      </div>
    );
  }

  if (id === "photo") {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 42,
          height: 50,
          marginLeft: -21,
          marginTop: -25,
          borderRadius: 2,
          border: "1px solid rgba(255,215,170,0.38)",
          boxShadow:
            "0 0 0 2px rgba(18,12,10,0.55) inset, 0 0 14px rgba(255,180,90,0.12)",
          opacity: 0.7,
          background: "linear-gradient(145deg, rgba(40,32,28,0.25) 0%, rgba(20,16,14,0.35) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 6,
            border: "1px solid rgba(255,220,190,0.12)",
            borderRadius: 1,
            background: "rgba(8,6,8,0.15)",
          }}
        />
      </div>
    );
  }

  if (id === "prayer") {
    return (
      <motion.svg
        aria-hidden
        width="44"
        height="64"
        viewBox="0 0 44 64"
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          marginLeft: -22,
          marginTop: -28,
          overflow: "visible",
          opacity: 0.75,
        }}
      >
        <defs>
          <filter id={blurId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
        </defs>
        <motion.path
          d="M 22 56 Q 14 40 20 30 Q 26 20 22 10 Q 18 22 24 32 Q 30 44 22 56"
          fill="none"
          stroke="rgba(210,220,235,0.45)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter={`url(#${blurId})`}
          initial={{ pathLength: 0.92, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: [0.32, 0.55, 0.32] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 26 54 Q 32 38 28 26"
          fill="none"
          stroke="rgba(230,235,245,0.28)"
          strokeWidth="1.2"
          strokeLinecap="round"
          filter={`url(#${blurId})`}
          animate={{ opacity: [0.2, 0.42, 0.2] }}
          transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </motion.svg>
    );
  }

  if (id === "friend") {
    return null;
  }

  if (id === "hope") {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: "translate(-50%, -50%)",
          width: 36,
          height: 28,
          opacity: 0.5,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            width: 22,
            height: 10,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,220,150,0.25) 0%, transparent 70%)",
          }}
        />
      </div>
    );
  }

  return null;
}

/* ─── Core light: default dot, paired dots (friend), sprout + bright seed (hope) ─ */
function FragmentCore({ id, hover }: { id: string; hover: boolean }) {
  if (id === "friend") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 7,
          margin: "0 auto",
          height: 12,
        }}
      >
        <motion.div
          animate={{ opacity: hover ? 1 : 0.82, scale: hover ? 1.08 : 1 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,218,165,0.98)",
            boxShadow: "0 0 10px rgba(255,175,85,0.85), 0 0 18px rgba(255,160,70,0.35)",
          }}
        />
        <motion.div
          animate={{ opacity: hover ? 0.95 : 0.72, scale: hover ? 1.05 : 0.98 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(255,200,130,0.95)",
            boxShadow: "0 0 8px rgba(255,165,80,0.7)",
          }}
        />
      </div>
    );
  }

  if (id === "hope") {
    return (
      <div style={{ position: "relative", margin: "0 auto", width: 32, height: 26 }}>
        <motion.svg
          width="22"
          height="14"
          viewBox="0 0 22 14"
          style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: -4 }}
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M11 13 Q7 8 9 5 Q11 2 13 5 Q15 8 11 13"
            fill="rgba(100,185,120,0.42)"
            stroke="rgba(190,235,175,0.55)"
            strokeWidth="0.6"
          />
          <path d="M11 13 L11 6" stroke="rgba(140,200,130,0.45)" strokeWidth="0.9" strokeLinecap="round" />
        </motion.svg>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            margin: "10px auto 0",
            background: "rgba(255,240,210,1)",
            boxShadow:
              "0 0 14px rgba(255,215,130,1), 0 0 26px rgba(255,185,90,0.55), 0 0 40px rgba(255,170,70,0.25)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "rgba(255,210,140,0.95)",
        boxShadow: "0 0 12px rgba(255,180,90,0.7)",
        margin: "0 auto",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   POOL — gathered fragments coalesce into a soft warm circle
════════════════════════════════════════════════════════════ */
function Pool({ gatheredIds }: { gatheredIds: string[] }) {
  const total = FRAGMENTS.length;
  const filled = gatheredIds.length;
  const fill = filled / total;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "44%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 220,
        height: 220,
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      {/* Outer halo grows with fill */}
      <motion.div
        animate={{
          opacity: 0.2 + fill * 0.6,
          scale: 0.85 + fill * 0.25,
        }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,200,130,0.42) 0%, rgba(255,160,80,0.18) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Gathered fragment dots arranged in a small ring */}
      {gatheredIds.map((id, i) => {
        const idx = FRAGMENTS.findIndex(f => f.id === id);
        const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
        const r = 48;
        const x = 110 + Math.cos(angle) * r;
        const y = 110 + Math.sin(angle) * r;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "backOut" }}
            style={{
              position: "absolute",
              left: x - 4,
              top: y - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(255,215,150,0.95)",
              boxShadow:
                "0 0 14px rgba(255,180,100,0.75), 0 0 28px rgba(255,160,80,0.4)",
            }}
          />
        );
      })}

      {/* Centre word — shows as fill grows */}
      {fill > 0 && (
        <motion.div
          animate={{ opacity: 0.4 + fill * 0.6 }}
          transition={{ duration: 0.7 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.66rem",
            letterSpacing: "0.18em",
            color: "rgba(255,235,200,0.92)",
            textTransform: "uppercase",
            textShadow:
              "0 0 14px rgba(255,200,120,0.65), 0 0 4px rgba(0,0,0,0.85)",
            whiteSpace: "nowrap",
          }}
        >
          {filled}/{total}
        </motion.div>
      )}
    </div>
  );
}
