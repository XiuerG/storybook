"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";
import resetBowlSoup from "../assets/reset-bowl-soup.png";

/* ════════════════════════════════════════════════════════════
   PAGE 3 — THE RESET BOWL
   ────────────────────────────────────────────────────────────
   Cold, quiet spread: a simplified bowl, dim brown-orange soup,
   four faint body-words on the right. Four clicks add heat stepwise — soup
   warms, steam rises, the ring fills, words release one by one.
   At full heat, closing lines emerge on the right.
================================================================ */

const TITLE = "The Reset Bowl";
const KO_SUB = "다시 데우는 것";
const NARR_TOP_1 = "After too many days of food that did not settle,";
const NARR_TOP_2 = "the body asked for rice, soup, and heat.";
const FINAL_1 = "It was not hunger alone.";
const FINAL_2 = "It was the body asking to feel familiar again.";
const HINT = "Click to add heat";

const MAX_HEAT = 4;

/* One word vanishes per click: 1 → TIRED, 2 → BLOATED, 3 → HEAVY, 4 → DRAINED */
const STATE_WORDS = [
  { id: "tired", label: "TIRED", fadeAt: 1 },
  { id: "bloated", label: "BLOATED", fadeAt: 2 },
  { id: "heavy", label: "HEAVY", fadeAt: 3 },
  { id: "drained", label: "DRAINED", fadeAt: 4 },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE
================================================================ */
let _heat = 0;
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _heat = 0;
    _subs.forEach(fn => fn());
  });
}
function _notify() {
  _subs.forEach(fn => fn());
}
function _addHeat() {
  if (_heat >= MAX_HEAT) return;
  _heat += 1;
  _notify();
}
function useHeat() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => {
      _subs.delete(cb);
    };
  }, []);
  return _heat;
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps {
  side?: "left" | "right";
}

const ResetBowlPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <ResetLeft forwardedRef={ref} />;
    return <ResetRight forwardedRef={ref} />;
  }
);
ResetBowlPage.displayName = "ResetBowlPage";
export default ResetBowlPage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + bowl + hint
================================================================ */
function ResetLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const heat = useHeat();
  const t = heat / MAX_HEAT;

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={5}
      style={{ background: "#070812" }}
    >
      <RoomBackdrop side="left" heat={heat} t={t} />

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
            color: "rgba(150,165,195,0.45)",
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
            color: "rgba(200,205,220,0.88)",
            textShadow: "0 0 22px rgba(0,0,0,0.75)",
            margin: 0,
          }}
        >
          {TITLE}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.35, scaleX: 1 }}
          transition={{ duration: 1.3, delay: 1.2 }}
          style={{
            width: "2rem",
            height: 1,
            background: "rgba(120,130,160,0.45)",
            marginTop: "1rem",
            transformOrigin: "left center",
          }}
        />
      </div>

      <Bowl heat={heat} onClick={_addHeat} />

      {heat < 1 && (
        <InteractionHint
          emphasis
          style={{
            bottom: "2rem",
            left: "2.5rem",
            zIndex: 11,
            color: "rgba(175,185,210,0.72)",
          }}
        >
          {HINT}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT — narrative + closing lines at full heat
================================================================ */
function ResetRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const heat = useHeat();
  const t = heat / MAX_HEAT;
  const full = heat >= MAX_HEAT;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={6}
      style={{ background: "#070812" }}
    >
      <RoomBackdrop side="right" heat={heat} t={t} />

      <div
        style={{
          position: "absolute",
          top: "2.8rem",
          right: "2.5rem",
          left: "2.5rem",
          textAlign: "right",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: full ? 0.35 : 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.5 }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: full ? "rgba(160,175,200,0.5)" : "rgba(210,215,228,0.88)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {NARR_TOP_1}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: full ? 0.28 : 1 }}
          transition={{ duration: 1.6, delay: 1.0 }}
          style={{
            margin: "0.5rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            lineHeight: 1.7,
            color: full ? "rgba(140,155,185,0.45)" : "rgba(175,185,205,0.72)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {NARR_TOP_2}
        </motion.p>
      </div>

      <StateWordsLayer heat={heat} />

      <AnimatePresence>
        {full && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, delay: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "5rem",
              right: "2.5rem",
              left: "2.5rem",
              textAlign: "right",
              zIndex: 14,
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.9rem",
                lineHeight: 1.75,
                color: "rgba(225,210,190,0.9)",
                textShadow: "0 0 18px rgba(0,0,0,0.88)",
              }}
            >
              {FINAL_1}
            </p>
            <p
              style={{
                margin: "0.55rem 0 0",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "0.98rem",
                lineHeight: 1.65,
                color: "rgba(255,228,195,0.95)",
                textShadow:
                  "0 0 20px rgba(255,150,95,0.35), 0 0 8px rgba(0,0,0,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              {FINAL_2}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOM — cold / still at 0; warm pool from click 3 onward
================================================================ */
function RoomBackdrop({
  side,
  heat,
  t,
}: {
  side: "left" | "right";
  heat: number;
  t: number;
}) {
  const cx = side === "left" ? "52%" : "48%";
  const cy = "54%";

  const coolA = 0.06 + heat * 0.02;
  const warmBoost = heat >= 3 ? (heat - 2) * 0.12 : 0;
  const r = 38 + t * 95 + warmBoost * 40;
  const g = 42 + t * 55 + warmBoost * 35;
  const b = 72 + t * 40 - warmBoost * 25;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 82% 72% at ${cx} ${cy}, rgba(${Math.round(r)},${Math.round(g)},${Math.round(
            b
          )},${0.08 + t * 0.28 + warmBoost * 0.15}) 0%, transparent 68%)`,
          transition: "background 1.1s ease",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(195deg, #05060d 0%, #080a14 55%, #0c0816 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 96% 96% at 50% 52%, transparent 42%, rgba(3,2,8,0.82) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   BOWL — ring + bowl + steam
================================================================ */
const BOWL_BASE = 240;
const BOWL_SCALE = 1.75;
const BOWL_SIZE = Math.round(BOWL_BASE * BOWL_SCALE);
const BOWL_RING_R = (110 / BOWL_BASE) * BOWL_SIZE;
const BOWL_TICK_R1 = (102 / BOWL_BASE) * BOWL_SIZE;
const BOWL_TICK_R2 = (118 / BOWL_BASE) * BOWL_SIZE;
const BOWL_INNER = Math.round((150 / BOWL_BASE) * BOWL_SIZE);
const BOWL_HALO_INSET = Math.round((-40 / BOWL_BASE) * BOWL_SIZE);
const BOWL_STEAM_H = Math.round((90 / BOWL_BASE) * BOWL_SIZE);

function Bowl({ heat, onClick }: { heat: number; onClick: () => void }) {
  const t = heat / MAX_HEAT;
  const SIZE = BOWL_SIZE;
  const C = 2 * Math.PI * BOWL_RING_R;
  const dash = C * t;

  const ringDim = heat === 0;
  const trackOpacity = ringDim ? 0.06 : 0.14 + t * 0.12;
  const haloOpacity = ringDim ? 0.04 : 0.12 + t * 0.5;

  return (
    <div
      data-book-interactive
      role="button"
      tabIndex={0}
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: SIZE,
        height: SIZE,
        cursor: heat >= MAX_HEAT ? "default" : "pointer",
        zIndex: 6,
      }}
    >
      <motion.div
        animate={{
          opacity: haloOpacity,
          scale: 0.92 + t * 0.22,
        }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: BOWL_HALO_INSET,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,${120 - t * 25},${70 - t * 35},${0.22 + t * 0.38}) 0%, rgba(255,130,85,${0.06 + t * 0.22}) 45%, transparent 72%)`,
          mixBlendMode: "screen",
          transition: "background 0.8s ease",
          pointerEvents: "none",
        }}
      />

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={BOWL_RING_R}
          fill="none"
          stroke={`rgba(130,138,168,${trackOpacity})`}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.8s ease" }}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={BOWL_RING_R}
          fill="none"
          stroke={`rgba(255,${155 - t * 45},${95 - t * 45},${heat === 0 ? 0 : 0.45 + t * 0.45})`}
          strokeWidth={heat >= 3 ? 3 : 2.2}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{
            transition:
              "stroke-dasharray 0.95s cubic-bezier(0.22,0.61,0.36,1), stroke 0.65s ease, stroke-width 0.5s ease",
            filter:
              heat > 0
                ? `drop-shadow(0 0 ${3 + t * 10}px rgba(255,130,85,${0.2 + t * 0.55}))`
                : "none",
          }}
        />
        {Array.from({ length: MAX_HEAT }).map((_, i) => {
          const angle = (i / MAX_HEAT) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = SIZE / 2 + Math.cos(rad) * BOWL_TICK_R1;
          const y1 = SIZE / 2 + Math.sin(rad) * BOWL_TICK_R1;
          const x2 = SIZE / 2 + Math.cos(rad) * BOWL_TICK_R2;
          const y2 = SIZE / 2 + Math.sin(rad) * BOWL_TICK_R2;
          const lit = i < heat;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={
                lit
                  ? "rgba(255,175,105,0.9)"
                  : `rgba(110,118,145,${ringDim ? 0.12 : 0.28})`
              }
              strokeWidth="1"
              style={{ transition: "stroke 0.65s ease" }}
            />
          );
        })}
      </svg>

      <BowlBody heat={heat} t={t} diameter={BOWL_INNER} />

      {heat >= 1 && <Steam heat={heat} t={t} innerW={BOWL_INNER} steamH={BOWL_STEAM_H} />}
    </div>
  );
}

/** Photo fades in with heat; base layer stays schematic dark soup. */
function photoBlend(heat: number) {
  if (heat <= 0) return 0;
  if (heat === 1) return 0.18;
  if (heat === 2) return 0.42;
  if (heat === 3) return 0.72;
  return 1;
}

function BowlBody({ heat, t, diameter }: { heat: number; t: number; diameter: number }) {
  const blend = photoBlend(heat);
  const soupLift = 0.08 + t * 0.22;
  const centerGlow = 0.04 + t * 0.38;
  const rimGlow = heat >= 2 ? 8 + heat * 4 : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: diameter,
        height: diameter,
        zIndex: 4,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: `0 16px 36px rgba(0,0,0,0.78), inset 0 0 0 1px rgba(55,48,44,0.6), 0 0 ${rimGlow}px rgba(255,140,90,${heat >= 2 ? 0.22 + t * 0.2 : 0})`,
          transition: "box-shadow 0.85s ease",
        }}
      >
        {/* Simplified bowl + dim soup (always) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `
              radial-gradient(circle at 50% 42%, rgba(72,48,38,0.95) 0%, rgba(42,28,22,0.98) 45%, rgba(22,14,12,1) 100%)
            `,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 45%, rgba(95,58,42,${0.55 + soupLift}) 0%, rgba(62,38,28,${0.75 + soupLift * 0.15}) 55%, rgba(28,16,14,0.96) 100%)`,
            boxShadow: `inset 0 0 28px rgba(0,0,0,0.65), inset 0 -6px 20px rgba(20,8,6,0.5)`,
            transition: "background 0.85s ease, box-shadow 0.85s ease",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 48%, rgba(255,150,95,${centerGlow}) 0%, transparent 55%)`,
            mixBlendMode: "screen",
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
          }}
        />

        {/* Reference photo — builds in with heat */}
        {blend > 0.01 && (
          /* eslint-disable-next-line @next/next/no-img-element -- bundled art */
          <img
            src={resetBowlSoup.src}
            alt=""
            width={diameter}
            height={diameter}
            draggable={false}
            style={{
              position: "absolute",
              inset: "4%",
              width: "92%",
              height: "92%",
              objectFit: "cover",
              objectPosition: "50% 50%",
              borderRadius: "50%",
              opacity: blend,
              filter: `brightness(${0.88 + t * 0.2}) saturate(${0.85 + t * 0.2})`,
              transition: "opacity 0.85s ease, filter 0.85s ease",
            }}
          />
        )}

        {/* Cool veil lifts with heat */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "8%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(8,10,18,0.55) 0%, rgba(4,5,10,0.75) 100%)",
            opacity: Math.max(0, 0.72 - t * 0.72),
            mixBlendMode: "multiply",
            pointerEvents: "none",
            transition: "opacity 0.9s ease",
          }}
        />

        {/* Click 1: faint expanding ring on surface */}
        {heat >= 1 && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0.35, scale: 0.82 }}
            animate={{ opacity: [0.25, 0.12, 0.25], scale: [0.88, 1.06, 0.88] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: "14%",
              borderRadius: "50%",
              border: "1px solid rgba(255,170,110,0.22)",
              boxShadow: "0 0 12px rgba(255,140,90,0.15)",
              pointerEvents: "none",
            }}
          />
        )}

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow: `inset 0 0 ${Math.round((10 + t * 26) * (diameter / 150))}px rgba(255,${130 - t * 28},${65 - t * 28},${0.12 + t * 0.42})`,
            transition: "box-shadow 0.85s ease",
            pointerEvents: "none",
          }}
        />

        <motion.div
          key={`pulse-${heat}`}
          animate={{ opacity: [0, 0.32, 0], scale: [0.86, 1.05, 1.15] }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,200,140,0.42) 0%, transparent 70%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function Steam({
  heat,
  t,
  innerW,
  steamH,
}: {
  heat: number;
  t: number;
  innerW: number;
  steamH: number;
}) {
  const count = Math.max(1, Math.min(5, heat + 1));
  const rise = Math.round((52 + heat * 14) * (innerW / 150));
  const wispW = Math.round(28 * (innerW / 150));
  const wispH = Math.round(12 * (innerW / 150));
  const baseOpacity = 0.08 + heat * 0.1 + t * 0.28;

  return (
    <div
      style={{
        position: "absolute",
        top: "18%",
        left: "50%",
        transform: "translateX(-50%)",
        width: innerW,
        height: steamH,
        zIndex: 5,
        pointerEvents: "none",
        opacity: baseOpacity,
        transition: "opacity 0.75s ease",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -rise],
            opacity: [0, 0.35 + heat * 0.12, 0],
            scaleX: [0.75, 1.35 + heat * 0.08, 1.65],
          }}
          transition={{
            duration: 4.2 + (i % 3) * 0.45,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.55,
          }}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${28 + (i / Math.max(1, count - 1 || 1)) * 44}%`,
            width: wispW,
            height: wispH,
            background:
              "radial-gradient(ellipse, rgba(235,220,200,0.55) 0%, transparent 72%)",
            filter: "blur(3px)",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STATE WORDS — right column, above narrative stack; high contrast
================================================================ */
function StateWordsLayer({ heat }: { heat: number }) {
  const full = heat >= MAX_HEAT;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        right: "1.75rem",
        transform: "translateY(-50%)",
        zIndex: 12,
        pointerEvents: "none",
        padding: "1.1rem 1rem 1.15rem 1.35rem",
        borderRadius: 2,
        background: "linear-gradient(270deg, rgba(12,14,26,0.72) 0%, rgba(12,14,26,0.35) 100%)",
        borderRight: "1px solid rgba(160,175,210,0.22)",
        boxShadow: "-12px 0 32px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "1.15rem",
      }}
    >
      {STATE_WORDS.map(w => {
        const faded = heat >= w.fadeAt;
        const ghost = full;
        return (
          <motion.div
            key={w.id}
            animate={{
              opacity: ghost ? 0.08 : faded ? 0 : 0.92,
              filter: ghost ? "blur(4px)" : faded ? "blur(6px)" : "blur(0px)",
              x: faded || ghost ? 10 : 0,
            }}
            transition={{ duration: faded || ghost ? 0.85 : 0.45, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "0.82rem",
              letterSpacing: "0.28em",
              color: "rgba(195,208,235,0.95)",
              textTransform: "uppercase",
              textShadow:
                "0 0 1px rgba(0,0,0,1), 0 1px 12px rgba(0,0,0,0.95), 0 0 18px rgba(120,140,190,0.35)",
              textAlign: "right",
              whiteSpace: "nowrap",
            }}
          >
            {w.label}
          </motion.div>
        );
      })}
    </div>
  );
}
