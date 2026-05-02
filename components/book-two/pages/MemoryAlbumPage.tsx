"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 2 — THE MEMORY ALBUM
   ────────────────────────────────────────────────────────────
   Primary memory cards on a diagonal trail:

     1. School — opens to a real school photograph
     2. Album / vinyl
     3. Phone wallpaper (replaces former “short clip”)
     4. Birthday card (folded)

   Auxiliary blurred fragments drift behind to suggest more in the album.

   ─ Hover  : card sharpens + halo + extended line
   ─ Click  : memory portal (photo / album / wallpaper / letter)
================================================================ */

const TITLE = "The Memory Album";
const SUB_VN = "Album cũ — kí ức nhỏ";
const NARR_R_BOT_1 = "Some memories hurt softly.";
const NARR_R_BOT_2 = "But they remind me\nthat I have lived through something before.";
const HINT = "Click a memory to open it";

/** Real assets under /public/book-two/ */
const MEMORY_SCHOOL_SRC = "/book-two/memory-school.png";
const MEMORY_WALLPAPER_SRC = "/book-two/memory-wallpaper.png";

/* ════════════════════════════════════════════════════════════
   CARD DEFINITIONS
================================================================ */
type CardKind = "photo-school" | "album" | "wallpaper" | "letter";
type Card = {
  id: string;
  kind: CardKind;
  title: string;
  subtitle: string;
  vn?: string;
  /** position in % of the page */
  x: number;
  y: number;
  /** rotation in degrees */
  rot: number;
  /** which page does this card live on */
  side: "left" | "right";
};

type Aux = {
  id: string;
  kind: "screen" | "blurred";
  x: number;
  y: number;
  rot: number;
  side: "left" | "right";
};

const CARDS: Card[] = [
  {
    id: "school",
    kind: "photo-school",
    title: "Schoolyard, age nine.",
    subtitle: "A place that still smells like rain and uniforms.",
    vn: "Sân trường, năm lớp ba",
    x: 22,
    y: 44,
    rot: -7,
    side: "left",
  },
  {
    id: "album",
    kind: "album",
    title: "An album from twenty years ago.",
    subtitle: "Some songs still return with the same ache.",
    x: 70,
    y: 56,
    rot: 4,
    side: "left",
  },
  {
    id: "wallpaper",
    kind: "wallpaper",
    title: "A wallpaper I kept too long.",
    subtitle: "The lock screen outlasted the year it was meant for.",
    x: 22,
    y: 44,
    rot: 5,
    side: "right",
  },
  {
    id: "card",
    kind: "letter",
    title: "A birthday card, still folded.",
    subtitle: "I kept it longer than I meant to.",
    vn: "Một tấm thiệp, vẫn còn",
    x: 56,
    y: 60,
    rot: -6,
    side: "right",
  },
];

const AUX: Aux[] = [
  { id: "phone",   kind: "screen",  x: 32, y: 78, rot: 8,  side: "left" },
  { id: "blurred", kind: "blurred", x: 38, y: 22, rot: -4, side: "right" },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE — visited cards + currently opened card
================================================================ */
const _visited = new Set<string>();
let _opened: string | null = null;
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _visited.clear();
    _opened = null;
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _markVisited(id: string) {
  if (_visited.has(id)) return;
  _visited.add(id);
  _notify();
}
function _open(id: string | null) { _opened = id; _notify(); }

function useStore() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return {
    visitedCount: _visited.size,
    isVisited: (id: string) => _visited.has(id),
    opened: _opened,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const MemoryAlbumPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <MemoryLeft forwardedRef={ref} />;
    return <MemoryRight forwardedRef={ref} />;
  }
);
MemoryAlbumPage.displayName = "MemoryAlbumPage";
export default MemoryAlbumPage;

/* ════════════════════════════════════════════════════════════
   SHARED PAGE-LEVEL HOOK
================================================================ */
function useSidePage(side: "left" | "right") {
  const store = useStore();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const myCards = CARDS.filter(c => c.side === side);
  const myAux = AUX.filter(a => a.side === side);

  const openedCard = store.opened
    ? CARDS.find(c => c.id === store.opened) ?? null
    : null;
  const isMyModal = openedCard?.side === side;

  const openCard = useCallback((id: string) => {
    _markVisited(id);
    _open(id);
  }, []);

  const close = useCallback(() => _open(null), []);

  return {
    store,
    myCards,
    myAux,
    hoverId,
    setHoverId,
    openedCard,
    isMyModal,
    openCard,
    close,
  };
}

/* ════════════════════════════════════════════════════════════
   LEFT PAGE
================================================================ */
function MemoryLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { store, myCards, myAux, hoverId, setHoverId, openedCard, isMyModal, openCard, close } = useSidePage("left");

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={3}
      style={{ background: "#0c0a18" }}
    >
      <NostalgiaBackdrop side="left" />
      <Trail side="left" />

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
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.6rem",
            letterSpacing: "0.32em",
            color: "rgba(220,180,150,0.55)",
            textTransform: "uppercase",
            marginBottom: "0.7rem",
          }}
        >
          {SUB_VN}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.0, delay: 0.5, ease: "easeOut" }}
          className="page-title-spread"
          style={{
            color: "rgba(245,225,200,0.92)",
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
            background: "rgba(220,170,120,0.55)",
            marginTop: "1rem",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Auxiliary fragments — small, faded, behind everything */}
      <AuxLayer items={myAux} />

      {/* Primary cards */}
      <CardsLayer
        cards={myCards}
        hoverId={hoverId}
        setHoverId={setHoverId}
        isVisited={store.isVisited}
        onOpen={openCard}
      />

      {/* Hover subtitle line — at the bottom-right of the left page */}
      <HoverLine card={hoverId ? CARDS.find(c => c.id === hoverId) ?? null : null} side="left" />

      {/* Memory Portal modal */}
      <MemoryPortal card={isMyModal ? openedCard : null} onClose={close} />

      {store.visitedCount < 1 && !openedCard && (
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
   RIGHT PAGE
================================================================ */
function MemoryRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { store, myCards, myAux, hoverId, setHoverId, openedCard, isMyModal, openCard, close } = useSidePage("right");
  const enough = store.visitedCount >= 3;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={4}
      style={{ background: "#0c0a18" }}
    >
      <NostalgiaBackdrop side="right" />
      <Trail side="right" />

      {/* Auxiliary fragments */}
      <AuxLayer items={myAux} />

      {/* Primary cards */}
      <CardsLayer
        cards={myCards}
        hoverId={hoverId}
        setHoverId={setHoverId}
        isVisited={store.isVisited}
        onOpen={openCard}
      />

      {/* Hover subtitle line */}
      <HoverLine card={hoverId ? CARDS.find(c => c.id === hoverId) ?? null : null} side="right" />

      {/* Memory Portal modal */}
      <MemoryPortal card={isMyModal ? openedCard : null} onClose={close} />

      {/* Bottom narrative — fades in once 3+ visited */}
      <motion.div
        animate={{ opacity: enough ? 1 : 0.25 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: "4.5rem",
          right: "2.5rem",
          left: "2.5rem",
          textAlign: "right",
          zIndex: 9,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.94rem",
            lineHeight: 1.7,
            color: "rgba(245,225,200,0.92)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
            letterSpacing: "0.02em",
          }}
        >
          {NARR_R_BOT_1}
        </p>
        <p
          style={{
            margin: "0.7rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            lineHeight: 1.7,
            color: "rgba(220,200,180,0.78)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
            letterSpacing: "0.02em",
            whiteSpace: "pre-line",
          }}
        >
          {NARR_R_BOT_2}
        </p>
      </motion.div>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   NOSTALGIA BACKDROP
================================================================ */
function NostalgiaBackdrop({ side }: { side: "left" | "right" }) {
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
            " 55%, rgba(80,55,90,0.34) 0%, transparent 70%)," +
            "linear-gradient(180deg, #0a0716 0%, #0e0b1c 60%, #110d20 100%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,210,180,0.04) 0px, transparent 1px)," +
            "radial-gradient(circle at 70% 60%, rgba(180,200,255,0.04) 0px, transparent 1px)," +
            "radial-gradient(circle at 50% 80%, rgba(220,180,210,0.04) 0px, transparent 1px)",
          backgroundSize: "180px 180px, 240px 240px, 160px 160px",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 38%, rgba(2,4,12,0.78) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   TRAIL — faint dashed bezier curve linking the cards
   The trail is split between the two pages and meets at the
   spine: left page exits at (480, ~440), right page enters
   at (0, ~440).
================================================================ */
function Trail({ side }: { side: "left" | "right" }) {
  const path =
    side === "left"
      ? "M 60 320 Q 220 360 480 440"
      : "M 0 440 Q 220 540 440 540";
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox="0 0 480 660"
      style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
    >
      <path
        d={path}
        stroke="rgba(220,180,140,0.18)"
        strokeWidth="0.7"
        strokeDasharray="2 5"
        fill="none"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   AUX LAYER — small, faded, behind primary cards
================================================================ */
function AuxLayer({ items }: { items: Aux[] }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
      {items.map(it => (
        <div
          key={it.id}
          style={{
            position: "absolute",
            left: `${it.x}%`,
            top: `${it.y}%`,
            transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
            opacity: 0.32,
            filter: "blur(2px)",
          }}
        >
          {it.kind === "screen" ? (
            <PhoneAuxArt />
          ) : (
            <BlurredPhotoAuxArt />
          )}
        </div>
      ))}
    </div>
  );
}

function PhoneAuxArt() {
  return (
    <div
      style={{
        width: 38,
        height: 70,
        borderRadius: 8,
        background:
          "linear-gradient(170deg, rgba(40,28,40,0.9) 0%, rgba(15,10,18,0.95) 100%)",
        border: "1px solid rgba(180,150,110,0.25)",
      }}
    />
  );
}

function BlurredPhotoAuxArt() {
  return (
    <div
      style={{
        width: 60,
        height: 76,
        background: "rgba(20,14,16,0.92)",
        padding: 4,
        paddingBottom: 12,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(140deg, rgba(180,140,90,0.4) 0%, rgba(80,60,55,0.5) 60%, rgba(40,28,22,0.6) 100%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PRIMARY CARDS LAYER
================================================================ */
function CardsLayer({
  cards,
  hoverId,
  setHoverId,
  isVisited,
  onOpen,
}: {
  cards: Card[];
  hoverId: string | null;
  setHoverId: (id: string | null) => void;
  isVisited: (id: string) => boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
      {cards.map(card => (
        <MemoryCard
          key={card.id}
          card={card}
          hover={hoverId === card.id}
          visited={isVisited(card.id)}
          onEnter={() => setHoverId(card.id)}
          onLeave={() => setHoverId(null)}
          onClick={() => onOpen(card.id)}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MEMORY CARD — small, sharpens on hover, opens on click
================================================================ */
function MemoryCard({
  card,
  hover,
  visited,
  onEnter,
  onLeave,
  onClick,
}: {
  card: Card;
  hover: boolean;
  visited: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const lit = hover || visited;

  return (
    <motion.div
      data-book-interactive
      role="button"
      tabIndex={0}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4 }}
      style={{
        position: "absolute",
        left: `${card.x}%`,
        top: `${card.y}%`,
        transform: `translate(-50%, -50%) rotate(${card.rot}deg) scale(${hover ? 1.06 : 1})`,
        transformOrigin: "center",
        cursor: "pointer",
        transition: "transform 0.55s cubic-bezier(0.22,0.61,0.36,1)",
        zIndex: hover ? 8 : 5,
      }}
    >
      {/* Halo */}
      <motion.div
        animate={{ opacity: hover ? 0.55 : visited ? 0.18 : 0 }}
        transition={{ duration: 0.45 }}
        style={{
          position: "absolute",
          inset: -22,
          borderRadius: 14,
          background:
            "radial-gradient(ellipse, rgba(255,205,150,0.45) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <CardArt kind={card.kind} lit={lit} />

      {/* Tiny title under card */}
      <motion.div
        animate={{ opacity: lit ? 0.9 : 0.42 }}
        transition={{ duration: 0.4 }}
        style={{
          marginTop: "0.55rem",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.6rem",
          letterSpacing: "0.04em",
          color: "rgba(232,210,180,0.94)",
          textShadow: "0 0 10px rgba(0,0,0,0.85)",
          textAlign: "center",
          maxWidth: 150,
          lineHeight: 1.4,
        }}
      >
        {card.title}
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   CARD ART — thumbnail per card kind
================================================================ */
function CardArt({ kind, lit }: { kind: CardKind; lit: boolean }) {
  const baseFilter = lit
    ? "saturate(0.95) brightness(0.95)"
    : "saturate(0.4) brightness(0.55) blur(1.4px)";
  const transition = "filter 0.6s ease, box-shadow 0.5s ease";

  if (kind === "photo-school") {
    return (
      <div
        style={{
          width: 86,
          height: 100,
          background: "rgba(225,210,180,0.92)",
          padding: 4,
          paddingBottom: 14,
          boxShadow: lit
            ? "0 8px 22px rgba(0,0,0,0.7), 0 0 0 1px rgba(220,180,140,0.45)"
            : "0 6px 18px rgba(0,0,0,0.6)",
          transition,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            filter: baseFilter,
            transition,
          }}
        >
          <img
            src={MEMORY_SCHOOL_SRC}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 42%",
              display: "block",
            }}
          />
          {/* light streak */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              width: "40%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(255,220,180,0.45), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    );
  }

  if (kind === "album") {
    return (
      <div
        style={{
          width: 90,
          height: 90,
          background:
            "radial-gradient(circle at 35% 30%, rgba(220,180,160,0.4) 0%, rgba(20,12,18,0.95) 70%)",
          borderRadius: "50%",
          position: "relative",
          boxShadow: lit
            ? "0 10px 26px rgba(0,0,0,0.7), 0 0 0 1px rgba(220,180,140,0.35), 0 0 22px rgba(255,180,90,0.25)"
            : "0 6px 18px rgba(0,0,0,0.6)",
          filter: baseFilter,
          transition,
        }}
      >
        {[0.86, 0.72, 0.58, 0.44].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${50 - r * 50}%`,
              left: `${50 - r * 50}%`,
              width: `${r * 100}%`,
              height: `${r * 100}%`,
              borderRadius: "50%",
              border: "0.5px solid rgba(255,225,200,0.10)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "rgba(220,170,110,0.55)",
            boxShadow: "0 0 6px rgba(0,0,0,0.6)",
          }}
        />
      </div>
    );
  }

  if (kind === "wallpaper") {
    return (
      <div
        style={{
          width: 72,
          height: 118,
          padding: 5,
          borderRadius: 14,
          background:
            "linear-gradient(160deg, rgba(28,22,32,0.98) 0%, rgba(12,8,16,0.98) 100%)",
          border: "1px solid rgba(200,170,130,0.35)",
          boxShadow: lit
            ? "0 10px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(220,180,140,0.4)"
            : "0 6px 18px rgba(0,0,0,0.6)",
          transition,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 9,
            overflow: "hidden",
            position: "relative",
            filter: baseFilter,
            transition,
          }}
        >
          <img
            src={MEMORY_WALLPAPER_SRC}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
            }}
          />
        </div>
      </div>
    );
  }

  if (kind === "letter") {
    return (
      <div
        style={{
          width: 92,
          height: 64,
          background:
            "linear-gradient(140deg, rgba(220,200,170,0.92) 0%, rgba(180,150,110,0.85) 100%)",
          position: "relative",
          boxShadow: lit
            ? "0 10px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(220,180,140,0.45)"
            : "0 6px 18px rgba(0,0,0,0.6)",
          filter: baseFilter,
          transition,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 1,
            background: "rgba(80,60,40,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "rgba(160,40,30,0.85)",
            boxShadow: "0 0 6px rgba(255,150,100,0.6)",
          }}
        />
      </div>
    );
  }

  return null;
}

/* ════════════════════════════════════════════════════════════
   HOVER LINE — extended subtitle near the bottom of the page
================================================================ */
function HoverLine({
  card,
  side,
}: {
  card: Card | null;
  side: "left" | "right";
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "1.7rem",
        [side === "left" ? "right" : "left"]: "2.5rem",
        textAlign: side === "left" ? "right" : "left",
        zIndex: 11,
        pointerEvents: "none",
        maxWidth: "26ch",
        height: "3.4rem",
      }}
    >
      <AnimatePresence mode="wait">
        {card && (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "0.74rem",
                lineHeight: 1.5,
                color: "rgba(245,222,188,0.96)",
                textShadow: "0 0 12px rgba(0,0,0,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                marginTop: "0.25rem",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.66rem",
                lineHeight: 1.55,
                color: "rgba(220,200,170,0.78)",
                textShadow: "0 0 12px rgba(0,0,0,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              {card.subtitle}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MEMORY PORTAL — modal expanded view of one memory
================================================================ */
function MemoryPortal({
  card,
  onClose,
}: {
  card: Card | null;
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
          transition={{ duration: 0.55, ease: "easeOut" }}
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
          {/* Stop propagation on inner content so clicks inside don't close */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "default",
            }}
          >
            <PortalContent card={card} />

            {/* Close X */}
            <button
              type="button"
              data-book-interactive
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close memory"
              style={{
                position: "absolute",
                top: "1.6rem",
                right: "1.6rem",
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: "1px solid rgba(220,190,160,0.4)",
                background: "rgba(20,14,22,0.6)",
                color: "rgba(232,210,180,0.92)",
                fontFamily: "var(--font-serif)",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                paddingBottom: 2,
              }}
            >
              ×
            </button>

            {/* Tiny close hint */}
            <div
              style={{
                position: "absolute",
                bottom: "1.6rem",
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PortalContent({ card }: { card: Card }) {
  if (card.kind === "photo-school") return <SchoolyardPortal card={card} />;
  if (card.kind === "album") return <AlbumPortal card={card} />;
  if (card.kind === "wallpaper") return <WallpaperPortal card={card} />;
  return <LetterPortal card={card} />;
}

/* ─── Schoolyard portal ─────────────────────────────────── */
function SchoolyardPortal({ card }: { card: Card }) {
  type Region = "gate" | "corridor" | "yard";
  const [region, setRegion] = useState<Region | null>(null);

  const captions: Record<Region, string> = {
    gate: "We thought the future would wait for us.",
    corridor: "Some promises stayed there.",
    yard: "A place that still smells like rain and uniforms.",
  };

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "relative",
        width: "78%",
        maxWidth: 360,
      }}
    >
      <PortalHeader card={card} />

      <div
        style={{
          background: "rgba(225,210,180,0.92)",
          padding: 6,
          paddingBottom: 18,
          boxShadow: "0 22px 50px rgba(0,0,0,0.7)",
          marginTop: "1rem",
        }}
      >
        {/* Photo body */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            overflow: "hidden",
            background: "rgba(20, 14, 10, 0.95)",
          }}
        >
          <img
            src={MEMORY_SCHOOL_SRC}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 45%)",
              pointerEvents: "none",
            }}
          />

          {/* Hot regions — over the real photo */}
          <button
            data-book-interactive
            type="button"
            aria-label="Gate"
            onPointerEnter={() => setRegion("gate")}
            onPointerLeave={() => setRegion(null)}
            style={{
              position: "absolute",
              left: "26%",
              top: "26%",
              width: "44%",
              height: "32%",
              background: region === "gate" ? "rgba(255,210,140,0.12)" : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background 0.4s",
            }}
          />
          <button
            data-book-interactive
            type="button"
            aria-label="Corridor"
            onPointerEnter={() => setRegion("corridor")}
            onPointerLeave={() => setRegion(null)}
            style={{
              position: "absolute",
              right: "0",
              top: "40%",
              width: "35%",
              height: "60%",
              background: region === "corridor" ? "rgba(255,210,140,0.12)" : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background 0.4s",
            }}
          />
          <button
            data-book-interactive
            type="button"
            aria-label="Yard"
            onPointerEnter={() => setRegion("yard")}
            onPointerLeave={() => setRegion(null)}
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "65%",
              height: "45%",
              background: region === "yard" ? "rgba(255,210,140,0.1)" : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background 0.4s",
            }}
          />
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          marginTop: "1.2rem",
          textAlign: "center",
          minHeight: "2.6rem",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={region ?? "default"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.55 }}
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.78rem",
              lineHeight: 1.6,
              color: region ? "rgba(255,225,180,0.96)" : "rgba(220,200,170,0.78)",
              textShadow: "0 0 12px rgba(0,0,0,0.85)",
              letterSpacing: "0.02em",
              padding: "0 1.5rem",
            }}
          >
            {region ? captions[region] : "Hover over the photo."}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Album portal ─────────────────────────────────────── */
function AlbumPortal({ card }: { card: Card }) {
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);

  // Auto rotation when not dragging
  useEffect(() => {
    if (dragging || !autoSpin) return;
    let raf: number;
    const tick = () => {
      setAngle(a => (a + 0.18) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging, autoSpin]);

  const moods = ["gratitude", "homesick", "melancholy", "younger self"];
  const moodIdx = Math.floor(((angle % 360) / 360) * moods.length) % moods.length;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    setAutoSpin(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setAngle(a => (a + e.movementX * 0.6 + e.movementY * 0.6 + 360) % 360);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "relative",
        width: "82%",
        maxWidth: 380,
        textAlign: "center",
      }}
    >
      <PortalHeader card={card} />

      <div
        style={{
          marginTop: "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem 0",
        }}
      >
        <div
          data-book-interactive
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(220,180,160,0.42) 0%, rgba(20,12,18,0.96) 70%)",
            position: "relative",
            cursor: dragging ? "grabbing" : "grab",
            transform: `rotate(${angle}deg)`,
            transition: dragging ? "none" : "transform 0.05s linear",
            boxShadow:
              "0 18px 40px rgba(0,0,0,0.7), 0 0 26px rgba(255,180,90,0.32), 0 0 0 1px rgba(220,180,140,0.35)",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          {/* Grooves */}
          {[0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.44].map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${50 - r * 50}%`,
                left: `${50 - r * 50}%`,
                width: `${r * 100}%`,
                height: `${r * 100}%`,
                borderRadius: "50%",
                border: "0.5px solid rgba(255,225,200,0.10)",
              }}
            />
          ))}
          {/* Sparkle highlight */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "30%",
              width: "20%",
              height: "10%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,235,200,0.35) 0%, transparent 70%)",
              filter: "blur(2px)",
            }}
          />
          {/* Centre label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(220,170,110,0.85) 0%, rgba(150,90,40,0.85) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.55rem",
                color: "rgba(255,235,200,0.95)",
                letterSpacing: "0.08em",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              2003
            </div>
          </div>
          {/* Spindle hole */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.85)",
            }}
          />
        </div>
      </div>

      {/* Mood indicator */}
      <div style={{ marginTop: "1rem", minHeight: "2rem" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={moods[moodIdx]}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.85rem",
              letterSpacing: "0.16em",
              color: "rgba(255,225,180,0.96)",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(255,180,90,0.5)",
            }}
          >
            {moods[moodIdx]}
          </motion.div>
        </AnimatePresence>
        <div
          style={{
            marginTop: "0.5rem",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.7rem",
            lineHeight: 1.6,
            color: "rgba(220,200,170,0.78)",
            letterSpacing: "0.02em",
          }}
        >
          A song I return to when I miss who I was.
        </div>
        <div
          style={{
            marginTop: "0.6rem",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.55rem",
            letterSpacing: "0.16em",
            color: "rgba(220,200,170,0.55)",
            textTransform: "uppercase",
          }}
        >
          drag to spin
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Phone wallpaper portal (replaces short clip) ─────── */
function WallpaperPortal({ card }: { card: Card }) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "relative",
        width: "78%",
        maxWidth: 360,
        textAlign: "center",
      }}
    >
      <PortalHeader card={card} />

      <div
        style={{
          marginTop: "1.2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(72%, 220px)",
            aspectRatio: "9 / 19",
            borderRadius: 28,
            padding: 10,
            background:
              "linear-gradient(145deg, rgba(36,32,44,0.98) 0%, rgba(12,10,18,0.99) 100%)",
            border: "1px solid rgba(200,170,130,0.35)",
            boxShadow:
              "0 24px 48px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: "32%",
              height: 22,
              borderRadius: 12,
              background: "rgba(8,6,12,0.95)",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 14,
              right: 14,
              bottom: 14,
              borderRadius: 16,
              overflow: "hidden",
              background: "#0a0810",
            }}
          >
            <img
              src={MEMORY_WALLPAPER_SRC}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 80% 55% at 50% 35%, transparent 40%, rgba(0,0,0,0.12) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "1.1rem",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.75rem",
          lineHeight: 1.65,
          color: "rgba(245,222,188,0.9)",
          letterSpacing: "0.02em",
          padding: "0 0.5rem",
        }}
      >
        The lock screen outlasted the year it was meant for.
        <br />
        I never changed the wallpaper.
      </div>
    </motion.div>
  );
}

/* ─── Letter / birthday card portal ────────────────────── */
function LetterPortal({ card }: { card: Card }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "relative",
        width: "82%",
        maxWidth: 380,
        textAlign: "center",
      }}
    >
      <PortalHeader card={card} />

      {/* Card */}
      <div
        style={{
          position: "relative",
          marginTop: "1.4rem",
          width: "100%",
          aspectRatio: "5 / 4",
          perspective: "900px",
        }}
      >
        {/* Inside (revealed when open) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(245,228,200,0.96) 0%, rgba(220,200,170,0.95) 100%)",
            border: "1px solid rgba(180,140,90,0.45)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.4rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.66rem",
              letterSpacing: "0.32em",
              color: "rgba(120,80,40,0.6)",
              textTransform: "uppercase",
              marginBottom: "0.7rem",
            }}
          >
            Sinh nhật
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "1.2rem",
              lineHeight: 1.35,
              color: "rgba(80,50,30,0.95)",
              maxWidth: "16ch",
            }}
          >
            Chúc mừng sinh nhật
          </div>
          <div
            style={{
              width: "2rem",
              height: 1,
              background: "rgba(160,90,40,0.45)",
              margin: "1.0rem 0",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.7rem",
              lineHeight: 1.7,
              color: "rgba(110,75,45,0.85)",
              maxWidth: "22ch",
            }}
          >
            Mong em luôn bình yên
            <br />
            dù ở rất xa nhà.
          </div>
          {/* Faint signature */}
          <div
            style={{
              marginTop: "1rem",
              fontFamily: "cursive, var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.78rem",
              color: "rgba(120,75,45,0.55)",
              letterSpacing: "0.06em",
              opacity: 0.7,
            }}
          >
            — anh ấy
          </div>
        </div>

        {/* Front cover — folds open */}
        <motion.div
          data-book-interactive
          onClick={() => setOpen(o => !o)}
          animate={{
            rotateY: open ? -160 : 0,
          }}
          transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(140deg, rgba(220,200,170,0.92) 0%, rgba(180,150,110,0.88) 100%)",
            border: "1px solid rgba(140,100,60,0.55)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.65)",
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Wax seal */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "10%",
              transform: "translate(50%,-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(200,60,50,0.95) 0%, rgba(120,30,20,0.95) 75%)",
              boxShadow: "0 0 10px rgba(255,150,100,0.5)",
            }}
          />
          {/* Subtle fold line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              background: "rgba(80,60,40,0.18)",
            }}
          />
        </motion.div>
      </div>

      <div
        style={{
          marginTop: "1.0rem",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.7rem",
          lineHeight: 1.6,
          color: "rgba(220,200,170,0.78)",
          letterSpacing: "0.02em",
        }}
      >
        A birthday card, still folded.
        <br />
        I kept it longer than I meant to.
      </div>
      <div
        style={{
          marginTop: "0.6rem",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.55rem",
          letterSpacing: "0.16em",
          color: "rgba(220,200,170,0.55)",
          textTransform: "uppercase",
        }}
      >
        {open ? "click the card to fold" : "click the card to open"}
      </div>
    </motion.div>
  );
}

/* ─── Portal header — title + Vietnamese subhead ────────── */
function PortalHeader({ card }: { card: Card }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "0 1rem",
      }}
    >
      {card.vn && (
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.55rem",
            letterSpacing: "0.32em",
            color: "rgba(220,180,150,0.55)",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          {card.vn}
        </div>
      )}
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: 1.4,
          color: "rgba(245,225,200,0.96)",
          letterSpacing: "0.01em",
        }}
      >
        {card.title}
      </div>
    </div>
  );
}
