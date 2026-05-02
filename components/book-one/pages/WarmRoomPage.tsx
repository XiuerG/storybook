"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "./PageShell";

/* ════════════════════════════════════════════════════════════
   THREE HEALING OBJECTS
   Each represents a thread from the book.
════════════════════════════════════════════════════════════ */
type Relic = {
  id: string;
  symbol: string;
  labelZh: string;
  labelEn: string;
  captionZh: string;
  captionEn: string;
  x: number;
  y: number;
};

const LEFT_RELICS: Relic[] = [
  {
    id: "food",
    symbol: "食",
    labelZh: "食物",
    labelEn: "Food",
    captionZh: "一口米饭，一碗茶。\n味觉是最短的回家路。",
    captionEn: "A bowl of rice, a cup of tea.\nTaste is the shortest road home.",
    x: 28,
    y: 52,
  },
  {
    id: "brush",
    symbol: "笔",
    labelZh: "书法",
    labelEn: "Calligraphy",
    captionZh: "一横一竖，一撇一捺。\n语言可以失落，笔意不会。",
    captionEn: "Each stroke holds what words forget.\nThe hand remembers when the voice is lost.",
    x: 70,
    y: 46,
  },
];

/* ════════════════════════════════════════════════════════════
   ROOM BACKDROP — pure CSS warm room atmosphere
════════════════════════════════════════════════════════════ */
function RoomBackdrop({ warmth }: { warmth: number }) {
  // warmth: 0 → 1, controls ambient glow intensity
  const r = Math.round(38 + warmth * 30);
  const g = Math.round(22 + warmth * 14);
  const b = Math.round(12 + warmth * 4);
  const bg = `rgb(${r},${g},${b})`;

  return (
    <>
      {/* Wall */}
      <div style={{ position: "absolute", inset: 0, background: bg, transition: "background 1.2s ease" }} />

      {/* Warm ceiling glow — like a lamp above */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,${180 + Math.round(warmth * 40)},80,${0.12 + warmth * 0.22}) 0%, transparent 70%)`,
        transition: "background 1.2s ease",
      }} />

      {/* Floor line */}
      <div style={{
        position: "absolute", bottom: "22%", left: 0, right: 0,
        height: 1,
        background: `rgba(${120 + Math.round(warmth * 60)},${80 + Math.round(warmth * 40)},${40 + Math.round(warmth * 20)},0.28)`,
        transition: "background 1.2s ease",
      }} />

      {/* Floor */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "22%",
        background: `linear-gradient(180deg, rgba(${60 + Math.round(warmth * 30)},${35 + Math.round(warmth * 18)},${16 + warmth * 8},0.9) 0%, rgba(28,14,6,1) 100%)`,
        transition: "background 1.2s ease",
      }} />

      {/* Subtle wood texture on floor */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", pointerEvents: "none",
        background: "repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(0,0,0,0.06) 48px, rgba(0,0,0,0.06) 49px)",
      }} />

      {/* Vignette edges */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.62) 100%)",
      }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   LAMP — hangs from ceiling, flickers softly
════════════════════════════════════════════════════════════ */
function Lamp({ warmth }: { warmth: number }) {
  return (
    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 3, pointerEvents: "none" }}>
      {/* Cord */}
      <div style={{
        width: 1,
        height: 52,
        background: "rgba(160,120,70,0.5)",
        margin: "0 auto",
      }} />
      {/* Shade */}
      <motion.div
        animate={{ opacity: [0.85, 1, 0.9, 1, 0.88, 1], y: [0, 0.6, 0, -0.4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 40,
          height: 26,
          borderRadius: "0 0 50% 50%",
          background: `rgba(${200 + Math.round(warmth * 35)},${140 + Math.round(warmth * 40)},${60 + Math.round(warmth * 20)},0.92)`,
          boxShadow: `0 4px ${24 + warmth * 30}px ${warmth * 16}px rgba(255,${170 + Math.round(warmth * 50)},80,${0.25 + warmth * 0.35})`,
          margin: "0 auto",
          transition: "background 1.2s, box-shadow 1.2s",
        }}
      />
      {/* Cone of light on wall */}
      <div style={{
        position: "absolute",
        top: 78,
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "80px solid transparent",
        borderRight: "80px solid transparent",
        borderTop: `120px solid rgba(255,${200 + Math.round(warmth * 40)},100,${0.06 + warmth * 0.10})`,
        transition: "border-top 1.2s ease",
      }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FOOD RELIC — framed photo of the pantry food items
════════════════════════════════════════════════════════════ */
function FoodRelic({ lit, onLight }: { lit: boolean; onLight: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      data-book-interactive
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={() => { if (!lit) onLight(); }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: "22%", top: "30%",
        transform: "translate(-50%, -50%)",
        cursor: lit ? "default" : "pointer",
        zIndex: 5,
      }}
    >
      {/* Warm halo */}
      <motion.div
        animate={lit ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.12, 1] } : { opacity: hover ? 0.25 : 0 }}
        transition={lit ? { duration: 3.5, repeat: Infinity } : { duration: 0.3 }}
        style={{
          position: "absolute", inset: -20, borderRadius: 8,
          background: "radial-gradient(ellipse, rgba(255,210,110,0.38) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
      {/* Picture frame */}
      <motion.div
        animate={{ boxShadow: lit
          ? "0 0 0 2px rgba(200,160,70,0.8), 0 4px 24px rgba(255,190,80,0.45), 0 0 48px rgba(255,170,60,0.22)"
          : hover
            ? "0 0 0 1.5px rgba(180,140,60,0.55), 0 4px 14px rgba(0,0,0,0.5)"
            : "0 0 0 1.5px rgba(130,95,40,0.35), 0 4px 12px rgba(0,0,0,0.6)",
        }}
        transition={{ duration: 0.5 }}
        style={{
          width: 88, height: 66,
          borderRadius: 4,
          overflow: "hidden",
          background: "#1a0d04",
        }}
      >
        <div style={{
          width: "100%", height: "100%",
          backgroundImage: "url(/pantry_real.png)",
          backgroundSize: "220% auto",
          backgroundPosition: "30% 60%",
          filter: lit ? "none" : "saturate(0.15) brightness(0.45)",
          transition: "filter 1.2s ease",
        }} />
      </motion.div>
      {/* Label */}
      <motion.div
        animate={{ opacity: lit ? 0.75 : hover ? 0.45 : 0.2 }}
        transition={{ duration: 0.4 }}
        style={{
          marginTop: "0.45rem", textAlign: "center",
          fontFamily: '"Songti SC","Noto Serif SC",serif',
          fontSize: "0.56rem", letterSpacing: "0.22em",
          color: "rgba(230,200,145,0.9)",
        }}
      >食物 · Food</motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   BRUSH RELIC — SVG calligraphy brush
════════════════════════════════════════════════════════════ */
function BrushRelic({ lit, onLight }: { lit: boolean; onLight: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      data-book-interactive
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={() => { if (!lit) onLight(); }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: "72%", top: "28%",
        transform: "translate(-50%, -50%)",
        cursor: lit ? "default" : "pointer",
        zIndex: 5,
        textAlign: "center",
      }}
    >
      {/* Warm halo */}
      <motion.div
        animate={lit ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.12, 1] } : { opacity: hover ? 0.22 : 0 }}
        transition={lit ? { duration: 3.8, repeat: Infinity } : { duration: 0.3 }}
        style={{
          position: "absolute", inset: -18, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,210,110,0.35) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
      {/* SVG brush */}
      <svg width="28" height="96" viewBox="0 0 28 96" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", margin: "0 auto", filter: lit ? "drop-shadow(0 0 8px rgba(255,200,90,0.6))" : "none", transition: "filter 0.5s" }}
      >
        {/* Cap top */}
        <rect x="10" y="0" width="8" height="6" rx="4"
          fill={lit ? "rgba(210,165,75,0.95)" : hover ? "rgba(170,130,60,0.7)" : "rgba(120,88,38,0.5)"} />
        {/* Handle */}
        <rect x="11" y="5" width="6" height="48" rx="3"
          fill={lit ? "rgba(185,135,55,0.92)" : hover ? "rgba(150,110,48,0.68)" : "rgba(105,75,32,0.48)"} />
        {/* Ferrule ring */}
        <rect x="9" y="51" width="10" height="7" rx="2"
          fill={lit ? "rgba(220,185,90,0.95)" : hover ? "rgba(180,148,72,0.7)" : "rgba(130,100,42,0.5)"} />
        {/* Bristle body */}
        <ellipse cx="14" cy="72" rx="5.5" ry="14"
          fill={lit ? "rgba(28,16,6,0.96)" : hover ? "rgba(22,12,4,0.78)" : "rgba(18,10,3,0.55)"} />
        {/* Bristle tip */}
        <path d="M14 86 Q12 90 14 96 Q16 90 14 86Z"
          fill={lit ? "rgba(20,10,2,0.95)" : hover ? "rgba(16,8,2,0.75)" : "rgba(14,7,2,0.5)"} />
        {/* Ink highlight on tip */}
        {lit && <ellipse cx="14" cy="91" rx="1.5" ry="3" fill="rgba(60,30,8,0.6)" />}
      </svg>
      {/* Label */}
      <motion.div
        animate={{ opacity: lit ? 0.75 : hover ? 0.45 : 0.2 }}
        transition={{ duration: 0.4 }}
        style={{
          marginTop: "0.45rem",
          fontFamily: '"Songti SC","Noto Serif SC",serif',
          fontSize: "0.56rem", letterSpacing: "0.22em",
          color: "rgba(230,200,145,0.9)",
        }}
      >书法 · Calligraphy</motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   WINDOW — right page, glows open when all relics are lit
════════════════════════════════════════════════════════════ */
function Window({ open }: { open: boolean }) {
  return (
    <div style={{
      position: "absolute",
      top: "14%",
      left: "50%",
      transform: "translateX(-50%)",
      width: 160,
      height: 200,
      zIndex: 4,
    }}>
      {/* Frame */}
      <div style={{
        position: "absolute", inset: 0,
        border: "2px solid rgba(160,115,60,0.45)",
        borderRadius: 4,
      }} />
      {/* Cross bar */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0,
        height: 1, background: "rgba(160,115,60,0.35)",
      }} />
      <div style={{
        position: "absolute", left: "50%", top: 0, bottom: 0,
        width: 1, background: "rgba(160,115,60,0.35)",
      }} />

      {/* Glass — dark → warm glow when open */}
      <motion.div
        animate={{
          background: open
            ? "linear-gradient(160deg, rgba(255,220,130,0.22) 0%, rgba(255,190,90,0.14) 60%, rgba(200,140,60,0.08) 100%)"
            : "rgba(20,14,8,0.55)",
          boxShadow: open
            ? "inset 0 0 40px rgba(255,200,100,0.18), 0 0 60px rgba(255,180,70,0.30)"
            : "none",
        }}
        transition={{ duration: 1.8, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 4,
          borderRadius: 2,
        }}
      />

      {/* Stars / outside scene — visible when closed */}
      {!open && (
        <>
          {[{ x: 25, y: 20 }, { x: 70, y: 35 }, { x: 45, y: 65 }, { x: 80, y: 70 }, { x: 15, y: 80 }].map((s, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.5 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              style={{
                position: "absolute",
                left: `${s.x}%`, top: `${s.y}%`,
                width: 2, height: 2,
                borderRadius: "50%",
                background: "rgba(200,210,255,0.7)",
                pointerEvents: "none",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STAR NETWORK — constellation of people, connects on reveal
════════════════════════════════════════════════════════════ */
type StarNode = { id: number; x: number; y: number; delay: number; r: number };
type StarEdge = { a: number; b: number; delay: number };

// Deterministic node layout (no Math.random so it's stable across renders)
const NODES: StarNode[] = [
  { id:0,  x:50,  y:38,  delay:0,    r:4.5 }, // centre — community hub
  { id:1,  x:18,  y:22,  delay:0.3,  r:2.5 },
  { id:2,  x:78,  y:18,  delay:0.5,  r:2.8 },
  { id:3,  x:14,  y:58,  delay:0.4,  r:2.2 },
  { id:4,  x:82,  y:55,  delay:0.6,  r:2.6 },
  { id:5,  x:32,  y:72,  delay:0.7,  r:2.0 },
  { id:6,  x:68,  y:75,  delay:0.8,  r:2.3 },
  { id:7,  x:50,  y:14,  delay:0.35, r:1.8 },
  { id:8,  x:26,  y:44,  delay:0.55, r:2.0 },
  { id:9,  x:74,  y:38,  delay:0.65, r:1.9 },
  { id:10, x:42,  y:60,  delay:0.75, r:1.7 },
  { id:11, x:60,  y:58,  delay:0.85, r:1.8 },
  { id:12, x:88,  y:32,  delay:0.9,  r:1.6 },
  { id:13, x:10,  y:38,  delay:0.95, r:1.5 },
];

// Edges connecting nearby nodes
const EDGES: StarEdge[] = [
  { a:0, b:1,  delay:0.9  },
  { a:0, b:2,  delay:1.0  },
  { a:0, b:3,  delay:1.05 },
  { a:0, b:4,  delay:1.1  },
  { a:0, b:8,  delay:1.15 },
  { a:0, b:9,  delay:1.2  },
  { a:0, b:10, delay:1.25 },
  { a:0, b:11, delay:1.3  },
  { a:1, b:7,  delay:1.35 },
  { a:1, b:8,  delay:1.4  },
  { a:1, b:13, delay:1.45 },
  { a:2, b:7,  delay:1.5  },
  { a:2, b:9,  delay:1.55 },
  { a:2, b:12, delay:1.6  },
  { a:3, b:8,  delay:1.65 },
  { a:3, b:13, delay:1.7  },
  { a:4, b:9,  delay:1.75 },
  { a:4, b:12, delay:1.8  },
  { a:5, b:10, delay:1.85 },
  { a:6, b:11, delay:1.9  },
  { a:5, b:6,  delay:1.95 },
];

function StarNetwork({ visible }: { visible: boolean }) {
  const W = 480, H = 660;
  const px = (pct: number) => (pct / 100) * W;
  const py = (pct: number) => (pct / 100) * H;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none" }}
        >
          <svg
            width={W} height={H}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Edges */}
            {EDGES.map((e) => {
              const na = NODES[e.a], nb = NODES[e.b];
              return (
                <motion.line
                  key={`${e.a}-${e.b}`}
                  x1={px(na.x)} y1={py(na.y)}
                  x2={px(nb.x)} y2={py(nb.y)}
                  stroke="rgba(255,215,130,0.28)"
                  strokeWidth={0.8}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: e.delay, ease: "easeOut" }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((n) => (
              <motion.circle
                key={n.id}
                cx={px(n.x)} cy={py(n.y)} r={n.r}
                fill={n.id === 0 ? "rgba(255,220,130,0.95)" : "rgba(255,210,120,0.65)"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: n.delay, ease: "backOut" }}
              />
            ))}

            {/* Pulse on centre node */}
            <motion.circle
              cx={px(50)} cy={py(38)} r={4.5}
              fill="none"
              stroke="rgba(255,215,110,0.5)"
              strokeWidth={1.2}
              animate={{ r: [4.5, 22, 4.5], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2.2 }}
            />
          </svg>

          {/* Text + link — centred on the hub node */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 2.0, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: `${(50 / 100) * W}px`,
              top: `${(38 / 100) * H + 24}px`,
              transform: "translateX(-50%)",
              textAlign: "center",
              pointerEvents: "all",
              width: 200,
            }}
          >
            {/* Chinese heading */}
            <div style={{
              fontFamily: '"Songti SC","Noto Serif SC","STSong",serif',
              fontSize: "1.0rem",
              letterSpacing: "0.18em",
              color: "rgba(255,235,190,0.96)",
              textShadow: "0 0 18px rgba(255,200,90,0.55)",
              marginBottom: "0.18rem",
            }}>你不是一个人</div>
            {/* English heading */}
            <div style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.64rem",
              letterSpacing: "0.04em",
              color: "rgba(235,215,175,0.72)",
              marginBottom: "0.6rem",
            }}>You are not alone.</div>
            {/* Bilingual subtitle */}
            <div style={{
              fontFamily: '"Songti SC","Noto Serif SC",serif',
              fontSize: "0.56rem",
              letterSpacing: "0.06em",
              color: "rgba(215,192,148,0.58)",
              lineHeight: 1.9,
              marginBottom: "0.3rem",
            }}>还有人走过同一条货架</div>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.55rem",
              letterSpacing: "0.03em",
              color: "rgba(200,178,135,0.52)",
              lineHeight: 1.7,
              marginBottom: "0.2rem",
            }}>
              others who walk the same aisle,<br />remember the same taste.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════
   CAPTION OVERLAY — bilingual, shown when a relic is lit
════════════════════════════════════════════════════════════ */
function RelicCaption({ relic }: { relic: Relic | null }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "26%",
      left: "2.2rem",
      right: "2.2rem",
      zIndex: 8,
      pointerEvents: "none",
      textAlign: "center",
    }}>
      <AnimatePresence mode="wait">
        {relic && (
          <motion.div
            key={relic.id}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Chinese lines */}
            {relic.captionZh.split("\n").map((line, i) => (
              <div key={`zh-${i}`} style={{
                fontFamily: '"Songti SC","Noto Serif SC","STSong",serif',
                fontSize: "0.72rem",
                lineHeight: 2.0,
                letterSpacing: "0.12em",
                color: "rgba(248,228,188,0.88)",
                textShadow: "0 0 12px rgba(0,0,0,0.9)",
              }}>{line}</div>
            ))}
            {/* Divider */}
            <div style={{
              width: "1.6rem", height: 1,
              background: "rgba(200,165,85,0.35)",
              margin: "0.5rem auto",
            }} />
            {/* English lines */}
            {relic.captionEn.split("\n").map((line, i) => (
              <div key={`en-${i}`} style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.6rem",
                lineHeight: 1.85,
                letterSpacing: "0.03em",
                color: "rgba(225,205,165,0.65)",
                textShadow: "0 0 10px rgba(0,0,0,0.9)",
              }}>{line}</div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MODULE-LEVEL STORE — syncs lit count across both page halves
════════════════════════════════════════════════════════════ */
let _litIds: Set<string> = new Set();
const _listeners: Set<() => void> = new Set();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _litIds = new Set();
    _listeners.forEach(fn => fn());
  });
}

function notifyStore() { _listeners.forEach(fn => fn()); }

function markLit(id: string) {
  _litIds = new Set([..._litIds, id]);
  notifyStore();
}

function getLitIds() { return _litIds; }

function useWarmRoomStore() {
  const [litIds, setLitIds] = React.useState(() => getLitIds());
  React.useEffect(() => {
    const cb = () => setLitIds(new Set(getLitIds()));
    _listeners.add(cb);
    return () => { _listeners.delete(cb); };
  }, []);
  return litIds;
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════════════ */
interface PageProps { side?: "left" | "right" }

const WarmRoomPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "right" }, ref) => {
    if (side === "left") return <WarmRoomLeft forwardedRef={ref} />;
    return <WarmRoomRight forwardedRef={ref} />;
  }
);
WarmRoomPage.displayName = "WarmRoomPage";
export default WarmRoomPage;

/* ─── LEFT PAGE ─────────────────────────────────────────── */
function WarmRoomLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const litIds = useWarmRoomStore();
  const [lastLit, setLastLit] = useState<Relic | null>(null);
  const litCount = LEFT_RELICS.filter(r => litIds.has(r.id)).length;
  const warmth = litCount / LEFT_RELICS.length;

  const handleLight = (relic: Relic) => {
    markLit(relic.id);
    setLastLit(relic);
  };

  return (
    <PageShell ref={forwardedRef} side="left" pageNumber={11} style={{ background: "#26140a" }}>
      <RoomBackdrop warmth={warmth} />
      <Lamp warmth={warmth} />

      <FoodRelic lit={litIds.has("food")} onLight={() => handleLight(LEFT_RELICS[0])} />
      <BrushRelic lit={litIds.has("brush")} onLight={() => handleLight(LEFT_RELICS[1])} />

      <RelicCaption relic={lastLit} />

      {/* Title — top left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.4 }}
        style={{
          position: "absolute",
          top: "3rem",
          left: "2.6rem",
          right: "auto",
          maxWidth: "min(52%, 16rem)",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <div style={{
          fontFamily: '"Songti SC","Noto Serif SC","STSong",serif',
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          color: "rgba(200,165,95,0.55)",
          marginBottom: "0.7rem",
        }}>归处 · A Place to Return</div>
        <h2 className="page-title-spread" style={{
          color: "rgba(245,225,190,0.88)",
          textShadow: "0 0 18px rgba(0,0,0,0.7)",
          letterSpacing: "0.01em",
        }}>A Room of One's Own</h2>
        <div style={{
          width: "2rem", height: 1,
          background: "rgba(190,155,80,0.4)",
          marginTop: "0.9rem",
        }} />
      </motion.div>

      {/* Opening lines — top right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.55 }}
        style={{
          position: "absolute",
          top: "3rem",
          right: "2.5rem",
          left: "auto",
          maxWidth: "min(48%, 15rem)",
          textAlign: "right",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <p style={{
          margin: 0,
          fontFamily: '"Songti SC","Noto Serif SC","STSong",serif',
          fontSize: "0.66rem",
          lineHeight: 2.0,
          letterSpacing: "0.1em",
          color: "rgba(225,205,168,0.72)",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
        }}>
          点亮记忆里的物件<br />让这间小屋暖起来
        </p>
        <p style={{
          marginTop: "0.35rem",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.6rem",
          lineHeight: 1.7,
          color: "rgba(200,180,140,0.52)",
          letterSpacing: "0.02em",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
        }}>
          Light the objects from memory.<br />Let this small room grow warm.
        </p>
      </motion.div>

    </PageShell>
  );
}

/* ─── RIGHT PAGE ────────────────────────────────────────── */
function WarmRoomRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const litIds = useWarmRoomStore();
  const allLit = LEFT_RELICS.every(r => litIds.has(r.id));
  const [windowOpen, setWindowOpen] = useState(false);
  const warmth = allLit ? 1 : litIds.size / LEFT_RELICS.length;

  React.useEffect(() => {
    if (allLit && !windowOpen) {
      const t = setTimeout(() => setWindowOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, [allLit, windowOpen]);

  return (
    <PageShell ref={forwardedRef} side="right" pageNumber={12} style={{ background: "#26140a" }}>
      <RoomBackdrop warmth={warmth} />
      <Lamp warmth={warmth} />
      <Window open={windowOpen} />
      <StarNetwork visible={windowOpen} />

      {/* Closing poem */}
      {!windowOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 2, delay: 1 }}
          style={{
            position: "absolute",
            bottom: "8%",
            right: "2.6rem",
            textAlign: "right",
            pointerEvents: "none",
            zIndex: 8,
          }}
        >
          {[
            { zh: "这间小屋是你的，",   en: "This room is yours," },
            { zh: "也可以是我们的。",   en: "and ours, if you'll let it be." },
          ].map(({ zh, en }, i) => (
            <div key={i}>
              <div style={{
                fontFamily: '"Songti SC","Noto Serif SC","STSong",serif',
                fontSize: "0.68rem",
                lineHeight: 2.0,
                letterSpacing: "0.14em",
                color: "rgba(215,185,120,0.8)",
                textShadow: "0 0 10px rgba(0,0,0,0.9)",
              }}>{zh}</div>
              <div style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.55rem",
                lineHeight: 1.6,
                letterSpacing: "0.03em",
                color: "rgba(190,162,105,0.52)",
                textShadow: "0 0 8px rgba(0,0,0,0.9)",
                marginBottom: "0.3rem",
              }}>{en}</div>
            </div>
          ))}
        </motion.div>
      )}
    </PageShell>
  );
}
