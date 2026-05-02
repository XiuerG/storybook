"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "./PageShell";
import { InteractionHint } from "./InteractionHint";

/* ════════════════════════════════════════════════════════════
   COPY
════════════════════════════════════════════════════════════ */
const ENTRY_1 = "After all the words I could not enter,";
const ENTRY_2 = "I found a label I did not need to translate.";
const HOVER_1 = "I know this color.";
const HOVER_2 = "This tastes right.";
const HINT    = "click to brighten the aisle";
const CORNER_A = "The world was still foreign.";
const CORNER_B = "But something here still knew me.";

type FoodItem = { zh: string };

const LEFT_ITEMS: FoodItem[] = [
  { zh: "东北大米" },
  { zh: "菊花茶" },
];

const RIGHT_ITEMS: FoodItem[] = [
  { zh: "辣椒酱" },
  { zh: "红烧牛肉面" },
  { zh: "猪肉白菜水饺" },
  { zh: "香辣豆干" },
];

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════════════ */
interface PageProps { side?: "left" | "right" }

const PantryPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "right" }, ref) => {
    if (side === "left") return <PantryPageLeft forwardedRef={ref} />;
    return <PantryPageRight forwardedRef={ref} />;
  }
);
PantryPage.displayName = "PantryPage";
export default PantryPage;

/* ════════════════════════════════════════════════════════════
   BACKDROP — dim version (heavily filtered)
════════════════════════════════════════════════════════════ */
function PantryBackdrop({ side }: { side: "left" | "right" }) {
  return (
    <>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/pantry_real.webp)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "200% auto",
        backgroundPosition: side === "left" ? "left center" : "right center",
        filter: "saturate(0.10) brightness(0.42) blur(2.8px)",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg,rgba(10,16,38,0.55)0%,rgba(6,10,26,0.65)100%)",
        mixBlendMode: "multiply",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 110% 95% at 50% 55%,transparent 34%,rgba(1,3,10,0.78)100%)",
      }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   FULL-PAGE REVEAL — same image, no filter, fades in on click
════════════════════════════════════════════════════════════ */
function FullReveal({ side, visible }: { side: "left" | "right"; visible: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/pantry_real.webp)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "200% auto",
        backgroundPosition: side === "left" ? "left center" : "right center",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   GLOW ORB — follows mouse, always visible (subtle)
════════════════════════════════════════════════════════════ */
function GlowOrb({ x, y }: { x: number; y: number }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", left: x, top: y,
      width: 0, height: 0,
      pointerEvents: "none", zIndex: 7,
    }}>
      <div style={{
        position: "absolute",
        transform: "translate(-50%,-50%)",
        width: 120, height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle,rgba(255,232,155,0.18)0%,rgba(255,205,110,0.06)45%,transparent 72%)",
        mixBlendMode: "screen",
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CLICKABLE NAME TAGS — appear after reveal, one per food item
════════════════════════════════════════════════════════════ */
function NameTags({ items, activeZh, onHover, revealed }: {
  items: FoodItem[];
  activeZh: string | null;
  onHover: (item: FoodItem | null) => void;
  revealed: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
      onPointerLeave={() => onHover(null)}
      style={{
        position: "absolute",
        bottom: "4.2rem",
        left: "2rem",
        right: "2rem",
        zIndex: 9,
        display: "flex",
        flexWrap: "wrap",
        gap: "0.55rem",
        pointerEvents: revealed ? "all" : "none",
      }}
    >
      {items.map(item => (
        <button
          key={item.zh}
          type="button"
          onPointerEnter={() => onHover(item)}
          style={{
            fontFamily: '"Songti SC","Noto Serif SC","STSong","FangSong",serif',
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            color: activeZh === item.zh
              ? "rgba(255,235,180,1)"
              : "rgba(230,210,175,0.65)",
            background: "transparent",
            border: "none",
            padding: "0.1rem 0",
            cursor: "default",
            textShadow: activeZh === item.zh
              ? "0 0 18px rgba(255,210,120,0.7)"
              : "0 0 8px rgba(0,0,0,0.8)",
            transition: "color 0.3s ease, text-shadow 0.3s ease",
          }}
        >
          {item.zh}
        </button>
      ))}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   HOVER SUBTITLE — fixed lines + Chinese name
════════════════════════════════════════════════════════════ */
function HoverSubtitle({ item }: { item: FoodItem | null }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "2.0rem",
      left: "2rem",
      right: "2rem",
      zIndex: 9,
      pointerEvents: "none",
    }}>
      <AnimatePresence mode="wait">
        {item && (
          <motion.div
            key={item.zh}
            initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -3, filter: "blur(3px)" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.72rem",
              lineHeight: 1.85,
              letterSpacing: "0.03em",
              color: "rgba(245,228,205,0.92)",
              textShadow: "0 0 10px rgba(0,0,0,0.9)",
            }}>
              {HOVER_1}<br />{HOVER_2}
            </p>
            <p style={{
              margin: "0.55rem 0 0",
              fontFamily: '"Songti SC","Noto Serif SC","STSong","FangSong",serif',
              fontSize: "1.05rem",
              letterSpacing: "0.14em",
              color: "rgba(255,238,200,0.95)",
              textShadow: "0 0 14px rgba(0,0,0,0.85)",
            }}>
              {item.zh}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LEFT PAGE
════════════════════════════════════════════════════════════ */
function PantryPageLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState<FoodItem | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    const cx = e.clientX, cy = e.clientY;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      setMouse({ x: cx - r.left, y: cy - r.top });
    });
  }, []);

  return (
    <PageShell ref={forwardedRef} side="left" pageNumber={7} style={{ background: "#06080e" }}>
      <PantryBackdrop side="left" />
      <FullReveal side="left" visible={revealed} />

      <InteractionHint
        emphasis
        style={{
          bottom: "3.48rem",
          left: "2.4rem",
          zIndex: 6,
          color: "rgba(248, 232, 205, 0.94)",
        }}
      >
        Click what feels familiar
      </InteractionHint>

      {/* Click-anywhere zone */}
      <div
        data-book-interactive
        onMouseMove={onMove}
        onMouseLeave={() => setMouse(null)}
        onClick={() => setRevealed(true)}
        style={{
          position: "absolute", inset: 0,
          zIndex: 5, cursor: revealed ? "default" : "pointer",
          pointerEvents: "all",
        }}
      />

      {mouse && <GlowOrb x={mouse.x} y={mouse.y} />}

      <NameTags items={LEFT_ITEMS} activeZh={active?.zh ?? null} onHover={setActive} revealed={revealed} />
      <HoverSubtitle item={active} />

      {/* Opening lines (replaces former title + subtitle) */}
      <div style={{ position: "absolute", top: "2.8rem", left: "2.6rem", right: "2.6rem", zIndex: 9, pointerEvents: "none" }}>
        <motion.p
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
            lineHeight: 1.75,
            color: "rgba(248,232,208,0.94)",
            textShadow: "0 0 18px rgba(0,0,0,0.8)",
            letterSpacing: "0.02em",
            maxWidth: "32ch",
          }}
        >{ENTRY_1}</motion.p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.55 }}
          style={{
            margin: "0.35rem 0 0",
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
            lineHeight: 1.75,
            color: "rgba(248,232,208,0.94)",
            textShadow: "0 0 18px rgba(0,0,0,0.8)",
            letterSpacing: "0.02em",
            maxWidth: "32ch",
          }}
        >{ENTRY_2}</motion.p>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.0 }}
          style={{ width: "2.5rem", height: 1, background: "rgba(220,195,160,0.55)", marginTop: "1.1rem", transformOrigin: "left center" }}
        />
      </div>

      {/* Hint */}
      {!revealed && (
        <motion.span aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0.55, 0] }}
          transition={{ duration: 9, times: [0, 0.18, 0.78, 1], delay: 2.4, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "1.8rem", left: "2.6rem", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(232,210,180,0.7)", textShadow: "0 0 8px rgba(0,0,0,0.9)", zIndex: 9, pointerEvents: "none" }}
        >{HINT}</motion.span>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT PAGE
════════════════════════════════════════════════════════════ */
function PantryPageRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState<FoodItem | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    const cx = e.clientX, cy = e.clientY;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      setMouse({ x: cx - r.left, y: cy - r.top });
    });
  }, []);

  return (
    <PageShell ref={forwardedRef} side="right" pageNumber={8} style={{ background: "#06080e" }}>
      <PantryBackdrop side="right" />
      <FullReveal side="right" visible={revealed} />

      {/* Click-anywhere zone */}
      <div
        data-book-interactive
        onMouseMove={onMove}
        onMouseLeave={() => setMouse(null)}
        onClick={() => setRevealed(true)}
        style={{
          position: "absolute", inset: 0,
          zIndex: 5, cursor: revealed ? "default" : "pointer",
          pointerEvents: "all",
        }}
      />

      {mouse && <GlowOrb x={mouse.x} y={mouse.y} />}

      <NameTags items={RIGHT_ITEMS} activeZh={active?.zh ?? null} onHover={setActive} revealed={revealed} />
      <HoverSubtitle item={active} />

      {/* Bottom-right closing */}
      <motion.div
        animate={{ opacity: active ? 0.2 : 1 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute",
          bottom: "2.2rem",
          right: "2.6rem",
          textAlign: "right",
          pointerEvents: "none",
          zIndex: 9,
          maxWidth: "28ch",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 1.2 }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "0.84rem",
            lineHeight: 1.7,
            letterSpacing: "0.04em",
            color: "rgba(245,228,200,0.85)",
            textShadow: "0 0 12px rgba(0,0,0,0.9)",
          }}
        >
          {CORNER_A}
          <br />
          {CORNER_B}
        </motion.p>
      </motion.div>
    </PageShell>
  );
}
