"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 4 — HEALING RITUAL
   ────────────────────────────────────────────────────────────
   The reader picks three things and drops them into a central
   diya: a song, a food, a language phrase, a place, a person,
   a festival. After three are chosen the page generates a
   personal reflection.
================================================================ */

const TITLE = "Build Your Ritual";
const HI_SUB = "अपना अनुष्ठान";
const HINT = "Choose three to bring into the flame";
const FINAL_LEAD = "Your healing ritual is built through";
const MAX = 3;

type IngredientId =
  | "song"
  | "food"
  | "language"
  | "place"
  | "person"
  | "festival";

interface Ingredient {
  id: IngredientId;
  label: string;
  hi: string;
  /** word that goes into the reflection sentence */
  word: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: "song",     label: "a song",            hi: "एक गीत",       word: "music"    },
  { id: "food",     label: "a food",            hi: "एक भोजन",      word: "food"     },
  { id: "language", label: "a language phrase", hi: "एक वाक्यांश",   word: "language" },
  { id: "place",    label: "a place",           hi: "एक जगह",       word: "place"    },
  { id: "person",   label: "a person",          hi: "एक व्यक्ति",     word: "family"   },
  { id: "festival", label: "a festival",        hi: "एक त्योहार",   word: "festival" },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE — up to MAX selected ingredients in order
================================================================ */
const _picked: IngredientId[] = [];
const _subs = new Set<() => void>();
function _notify() { _subs.forEach(fn => fn()); }
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _picked.length = 0;
    _notify();
  });
}
function _toggle(id: IngredientId) {
  const i = _picked.indexOf(id);
  if (i >= 0) {
    _picked.splice(i, 1);
  } else if (_picked.length < MAX) {
    _picked.push(id);
  }
  _notify();
}
function useRitual() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return {
    picked: [..._picked],
    isPicked: (id: IngredientId) => _picked.includes(id),
    pickIndex: (id: IngredientId) => _picked.indexOf(id),
    count: _picked.length,
    full: _picked.length >= MAX,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const HealingRitualPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <RitualLeft forwardedRef={ref} />;
    return <RitualRight forwardedRef={ref} />;
  }
);
HealingRitualPage.displayName = "HealingRitualPage";
export default HealingRitualPage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + ingredient list
================================================================ */
function RitualLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { isPicked, pickIndex, count } = useRitual();

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={7}
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

      {/* Ingredient list */}
      <div
        style={{
          position: "absolute",
          top: "26%",
          left: "8%",
          right: "8%",
          bottom: "12%",
          zIndex: 6,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {INGREDIENTS.map(ing => (
          <IngredientButton
            key={ing.id}
            ing={ing}
            picked={isPicked(ing.id)}
            order={pickIndex(ing.id)}
            onToggle={() => _toggle(ing.id)}
          />
        ))}
      </div>

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
   RIGHT — central diya + reflection
================================================================ */
function RitualRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { picked, count, full } = useRitual();

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={8}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="right" count={count} />

      {/* The diya bowl */}
      <Diya count={count} full={full} picked={picked} />

      {/* Reflection — emerges when 3 are chosen */}
      <AnimatePresence>
        {full && (
          <motion.div
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.7 }}
            style={{
              position: "absolute",
              bottom: "8%",
              right: "2.5rem",
              left: "2.5rem",
              textAlign: "center",
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
                fontSize: "0.74rem",
                lineHeight: 1.6,
                color: "rgba(220,210,235,0.78)",
                textShadow: "0 0 14px rgba(0,0,0,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              {FINAL_LEAD}
            </p>
            <p
              style={{
                margin: "0.55rem 0 0",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "0.96rem",
                lineHeight: 1.55,
                color: "rgba(255,225,185,0.96)",
                textShadow:
                  "0 0 18px rgba(255,180,100,0.45), 0 0 4px rgba(0,0,0,0.85)",
                letterSpacing: "0.01em",
              }}
            >
              {composeReflection(picked)}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function composeReflection(picked: IngredientId[]) {
  const words = picked.map(id => INGREDIENTS.find(i => i.id === id)?.word ?? id);
  if (words.length === 1) return words[0];
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  return `${words.slice(0, -1).join(", ")}, and ${words[words.length - 1]}`;
}

/* ════════════════════════════════════════════════════════════
   ROOM BACKDROP
================================================================ */
function RoomBackdrop({ side, count }: { side: "left" | "right"; count: number }) {
  const t = count / MAX;
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at ${
            side === "left" ? "30%" : "55%"
          } 60%, rgba(${130 + t * 60},${50 + t * 40},${30 + t * 20},${0.18 + t * 0.30}) 0%, transparent 70%)`,
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
   INGREDIENT BUTTON
================================================================ */
function IngredientButton({
  ing,
  picked,
  order,
  onToggle,
}: {
  ing: Ingredient;
  picked: boolean;
  order: number;
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
        position: "relative",
        background: picked
          ? "linear-gradient(160deg, rgba(255,170,80,0.10) 0%, rgba(255,150,70,0.04) 100%)"
          : hover
            ? "rgba(255,235,210,0.04)"
            : "rgba(255,235,210,0.02)",
        border: picked
          ? "1px solid rgba(255,180,100,0.55)"
          : hover
            ? "1px solid rgba(255,210,170,0.32)"
            : "1px solid rgba(220,210,235,0.16)",
        borderRadius: 6,
        cursor: "pointer",
        padding: "10px 12px",
        textAlign: "left",
        boxShadow: picked
          ? "0 0 18px rgba(255,180,100,0.18)"
          : "0 4px 10px rgba(0,0,0,0.32)",
        transition: "all 0.45s ease",
      }}
    >
      {/* Order badge */}
      {picked && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,225,180,0.96), rgba(255,150,80,0.95))",
            color: "rgba(80,30,10,0.95)",
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            fontSize: "0.55rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 6px rgba(255,180,100,0.6)",
          }}
        >
          {order + 1}
        </div>
      )}

      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "0.78rem",
          letterSpacing: "0.04em",
          color: picked ? "rgba(255,225,185,0.96)" : "rgba(245,235,220,0.85)",
          transition: "color 0.45s ease",
        }}
      >
        {ing.label}
      </div>
      <div
        style={{
          marginTop: 3,
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.62rem",
          letterSpacing: "0.04em",
          color: picked ? "rgba(255,200,140,0.78)" : "rgba(180,195,225,0.55)",
          transition: "color 0.45s ease",
        }}
      >
        {ing.hi}
      </div>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   DIYA — central bowl with flame, fills as items are picked
================================================================ */
function Diya({
  count,
  full,
  picked,
}: {
  count: number;
  full: boolean;
  picked: IngredientId[];
}) {
  const t = count / MAX;
  return (
    <div
      style={{
        position: "absolute",
        top: "32%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 220,
        height: 220,
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      {/* Outer halo */}
      <motion.div
        animate={{
          opacity: 0.32 + t * 0.55,
          scale: 0.92 + t * 0.18,
        }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: -32,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,${
            150 - t * 30
          },${80 - t * 30},${0.32 + t * 0.32}) 0%, rgba(255,140,80,${0.10 + t * 0.18}) 35%, transparent 70%)`,
          filter: "blur(2px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Flame — grows with count */}
      <motion.div
        animate={{
          opacity: count > 0 ? [0.85, 1, 0.92, 1, 0.88] : 0.3,
          scaleY: count > 0 ? [1, 1.08, 0.96, 1.06, 1] : 1,
        }}
        transition={{
          opacity: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "bottom center",
          width: 14 + t * 6,
          height: 28 + t * 16,
          borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
          background:
            "radial-gradient(ellipse at 50% 70%, rgba(255,235,180,0.95) 0%, rgba(255,160,70,0.95) 60%, rgba(180,60,30,0.85) 100%)",
          boxShadow: `0 0 ${20 + t * 24}px rgba(255,170,80,${0.6 + t * 0.3}), 0 0 ${40 + t * 32}px rgba(255,140,60,${0.4 + t * 0.3})`,
        }}
      />

      {/* Wick */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 12,
          background: "rgba(80,40,20,0.95)",
        }}
      />

      {/* Bowl */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 150,
          height: 56,
          borderRadius: "0 0 50% 50% / 0 0 100% 100%",
          background:
            "linear-gradient(180deg, rgba(180,90,50,0.95) 0%, rgba(110,55,30,0.95) 60%, rgba(60,28,18,0.95) 100%)",
          boxShadow: "0 8px 22px rgba(0,0,0,0.7), inset 0 0 8px rgba(0,0,0,0.4)",
        }}
      />

      {/* Bowl rim */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: "50%",
          transform: "translateX(-50%)",
          width: 110,
          height: 12,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(40,18,10,0.95) 0%, rgba(255,170,80,0.4) 100%)",
          border: "1px solid rgba(220,140,80,0.55)",
        }}
      />

      {/* Picked-item dots floating around the flame */}
      {picked.map((id, i) => {
        const angle = (i / MAX) * Math.PI * 2 - Math.PI / 2;
        const r = 56;
        const x = 110 + Math.cos(angle) * r;
        const y = 80 + Math.sin(angle) * r * 0.7;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.3, x, y: y + 30 }}
            animate={{ opacity: 1, scale: 1, x, y }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              marginLeft: -4,
              marginTop: -4,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,225,180,0.96), rgba(255,150,80,0.95))",
              boxShadow:
                "0 0 10px rgba(255,180,100,0.75), 0 0 20px rgba(255,160,80,0.4)",
            }}
          />
        );
      })}

      {/* Counter at top */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "0.6rem",
          letterSpacing: "0.32em",
          color: full
            ? "rgba(255,225,180,0.96)"
            : "rgba(220,210,235,0.55)",
          textTransform: "uppercase",
          textShadow: "0 0 10px rgba(0,0,0,0.85)",
          transition: "color 0.5s ease",
        }}
      >
        {count} / {MAX}
      </div>
    </div>
  );
}
