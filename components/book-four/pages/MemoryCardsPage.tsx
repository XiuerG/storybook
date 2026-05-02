"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 3 — MEMORY CARDS
   ────────────────────────────────────────────────────────────
   Five memory cards drift on a quiet field. The reader clicks
   one and it flips open: short headline on the front, a longer
   participant quote inside.
================================================================ */

const TITLE = "Memory Cards";
const HI_SUB = "स्मृतियाँ";
const HINT = "Tap a card to open it";

type CardId = "food" | "music" | "language" | "temple" | "place";

interface MemCard {
  id: CardId;
  theme: string;
  hi: string;
  headline: string;
  inside: string;
  /** position in % within its page */
  x: number;
  y: number;
  rot: number;
  side: "left" | "right";
}

const CARDS: MemCard[] = [
  {
    id: "food",
    theme: "Food Memory",
    hi: "भोजन",
    headline: "Cooking is care.",
    inside:
      "I helped my mother in the kitchen from the time I was six or seven. I learned that feeding people is its own quiet language.",
    x: 30, y: 40, rot: -6,
    side: "left",
  },
  {
    id: "music",
    theme: "Music Memory",
    hi: "संगीत",
    headline: "Music carries family across distance.",
    inside:
      "Bhajans, Bollywood songs, Carnatic singing, the piano, the guitar — different sounds, same room. We sing across the years.",
    x: 70, y: 60, rot: 5,
    side: "left",
  },
  {
    id: "language",
    theme: "Language Memory",
    hi: "भाषा",
    headline: "The mother tongue keeps the bridge alive.",
    inside:
      "When I speak Gujarati at home, the bridge between here and there does not collapse. Even one phrase a day is enough.",
    x: 28, y: 38, rot: 5,
    side: "right",
  },
  {
    id: "temple",
    theme: "Temple Memory",
    hi: "मंदिर",
    headline: "The temple kept the door open to the past.",
    inside:
      "Diyas. Bells. Slippers left at the door. I crossed an ocean and found the same gestures waiting on the other side.",
    x: 64, y: 38, rot: -4,
    side: "right",
  },
  {
    id: "place",
    theme: "Place Memory",
    hi: "स्थान",
    headline: "Some streets remember me before I remember them.",
    inside:
      "Going back to India after years away — a road, a smell, a particular light at a particular hour, and suddenly the body knew the way.",
    x: 50, y: 70, rot: 7,
    side: "right",
  },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE
================================================================ */
let _opened: CardId | null = null;
const _visited = new Set<CardId>();
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _opened = null;
    _visited.clear();
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _open(id: CardId) {
  _opened = id;
  _visited.add(id);
  _notify();
}
function _close() {
  _opened = null;
  _notify();
}
function useStore() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return {
    opened: _opened,
    isVisited: (id: CardId) => _visited.has(id),
    visitedCount: _visited.size,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const MemoryCardsPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <MemoryLeft forwardedRef={ref} />;
    return <MemoryRight forwardedRef={ref} />;
  }
);
MemoryCardsPage.displayName = "MemoryCardsPage";
export default MemoryCardsPage;

/* ════════════════════════════════════════════════════════════
   LEFT
================================================================ */
function MemoryLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { opened, isVisited, visitedCount } = useStore();
  const myCards = CARDS.filter(c => c.side === "left");
  const myOpenedCard = opened ? CARDS.find(c => c.id === opened && c.side === "left") : null;

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={5}
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

      <CardField cards={myCards} isVisited={isVisited} onOpen={_open} />

      <CardModal card={myOpenedCard ?? null} onClose={_close} />

      {visitedCount < 1 && !opened && (
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
   RIGHT
================================================================ */
function MemoryRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { opened, isVisited } = useStore();
  const myCards = CARDS.filter(c => c.side === "right");
  const myOpenedCard = opened ? CARDS.find(c => c.id === opened && c.side === "right") : null;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={6}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="right" />

      <CardField cards={myCards} isVisited={isVisited} onOpen={_open} />

      <CardModal card={myOpenedCard ?? null} onClose={_close} />
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
            (side === "left" ? "30%" : "70%") +
            " 55%, rgba(110,55,40,0.20) 0%, transparent 70%)," +
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
   CARD FIELD — drifting closed cards
================================================================ */
function CardField({
  cards,
  isVisited,
  onOpen,
}: {
  cards: MemCard[];
  isVisited: (id: CardId) => boolean;
  onOpen: (id: CardId) => void;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
      {cards.map(card => (
        <MemoryCardItem
          key={card.id}
          card={card}
          visited={isVisited(card.id)}
          onClick={() => onOpen(card.id)}
        />
      ))}
    </div>
  );
}

function MemoryCardItem({
  card,
  visited,
  onClick,
}: {
  card: MemCard;
  visited: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      type="button"
      data-book-interactive
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 0.4 }}
      style={{
        position: "absolute",
        left: `${card.x}%`,
        top: `${card.y}%`,
        transform: `translate(-50%, -50%) rotate(${card.rot}deg) scale(${hover ? 1.05 : 1})`,
        width: 130,
        height: 100,
        padding: "12px 14px",
        background:
          "linear-gradient(160deg, rgba(245,228,205,0.92) 0%, rgba(220,200,170,0.92) 100%)",
        border: hover
          ? "1px solid rgba(255,180,100,0.85)"
          : "1px solid rgba(180,140,90,0.55)",
        borderRadius: 4,
        boxShadow: hover
          ? "0 14px 30px rgba(0,0,0,0.6), 0 0 22px rgba(255,180,100,0.30)"
          : "0 8px 22px rgba(0,0,0,0.45)",
        cursor: "pointer",
        textAlign: "left",
        transition:
          "transform 0.5s cubic-bezier(0.22,0.61,0.36,1), border 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* Halo */}
      {visited && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: 6,
            background:
              "radial-gradient(ellipse, rgba(255,180,100,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.5rem",
          letterSpacing: "0.32em",
          color: "rgba(110,70,40,0.78)",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {card.theme}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.7rem",
          letterSpacing: "0.04em",
          color: "rgba(140,90,40,0.78)",
        }}
      >
        {card.hi}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "0.72rem",
          lineHeight: 1.5,
          color: "rgba(60,38,22,0.95)",
          marginTop: 8,
          letterSpacing: "0.01em",
        }}
      >
        {card.headline}
      </div>

      {/* Corner ornament */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 10,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "0.55rem",
          color: "rgba(140,90,40,0.6)",
        }}
      >
        ›
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════
   CARD MODAL — opened card showing the full quote
================================================================ */
function CardModal({
  card,
  onClose,
}: {
  card: MemCard | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {card && (
        <motion.div
          key={card.id}
          data-book-interactive
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            background:
              "radial-gradient(ellipse 90% 90% at 50% 50%, rgba(20,12,28,0.85) 0%, rgba(6,4,12,0.97) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 60 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              position: "relative",
              width: "78%",
              maxWidth: 320,
              padding: "1.6rem 1.4rem 1.4rem",
              background:
                "linear-gradient(160deg, rgba(248,232,210,0.96) 0%, rgba(220,200,170,0.96) 100%)",
              border: "1px solid rgba(180,140,90,0.55)",
              borderRadius: 4,
              boxShadow: "0 22px 50px rgba(0,0,0,0.7)",
              cursor: "default",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "0.55rem",
                letterSpacing: "0.32em",
                color: "rgba(110,70,40,0.78)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {card.theme}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "0.74rem",
                letterSpacing: "0.04em",
                color: "rgba(140,90,40,0.78)",
                marginBottom: 12,
              }}
            >
              {card.hi}
            </div>
            <div
              style={{
                width: "1.6rem",
                height: 1,
                background: "rgba(140,90,40,0.5)",
                marginBottom: 14,
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "0.95rem",
                lineHeight: 1.45,
                color: "rgba(50,30,18,0.95)",
                marginBottom: 14,
                letterSpacing: "0.005em",
              }}
            >
              {card.headline}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "rgba(70,45,28,0.92)",
                letterSpacing: "0.01em",
              }}
            >
              {card.inside}
            </div>

            {/* Close indicator */}
            <button
              type="button"
              data-book-interactive
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 8,
                right: 10,
                width: 22,
                height: 22,
                background: "transparent",
                border: 0,
                cursor: "pointer",
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                color: "rgba(110,70,40,0.65)",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </motion.div>

          {/* Tiny outside-to-close hint */}
          <div
            style={{
              position: "absolute",
              bottom: "1.4rem",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.55rem",
              letterSpacing: "0.16em",
              color: "rgba(220,200,170,0.45)",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            click outside to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
