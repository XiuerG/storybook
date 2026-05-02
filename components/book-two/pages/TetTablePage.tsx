"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 3 — THE TẾT TABLE
   ────────────────────────────────────────────────────────────
   The base scene is a single warm-painted Tết room (a round
   wooden table, lantern, peach blossoms, kumquat tree, family
   silhouettes). It is split horizontally between the two pages
   so the spread reads as one continuous space.

   Each click position sits on the table surface and reveals a
   dish or offering.    Stickers are transparent WebPs under /public/book-two/
   (checker / bright neutral keyed out at build time).

   ─ Dish artwork (see scripts/process-tet-meal-dishes.py) ─
     tet-dish-nem-xoi.webp   nem rán + xôi gấc
     tet-dish-chicken.webp   whole chicken
     tet-dish-bitter-melon.webp  canh khổ qua
     tet-dish-banh.webp      bánh chưng / bánh tét
     tet-dish-pickles.webp   dưa món
     tet-dish-cha-lua.webp   chả lụa
     tet-incense.webp        incense burner (scripts/process-tet-assets.py)
================================================================ */

const TITLE = "The Tết Table";
const VN_SUB = "Mâm cơm — Tết về";
const NARR_TOP = "The meal was never just food.";
const NARR_BOT_1 = "It was the people around it.";
const NARR_BOT_2 = "The floor we sat on.\nThe year beginning again.";
const HINT = "Click to set the table";

/* Asset paths */
const SCENE_SRC = "/book-two/tet-scene.webp";

const DISH_NEM_XOI = "/book-two/tet-dish-nem-xoi.webp";
const DISH_CHICKEN = "/book-two/tet-dish-chicken.webp";
const DISH_BITTER_MELON = "/book-two/tet-dish-bitter-melon.webp";
const DISH_BANH = "/book-two/tet-dish-banh.webp";
const DISH_PICKLES = "/book-two/tet-dish-pickles.webp";
const DISH_CHA_LUA = "/book-two/tet-dish-cha-lua.webp";
const DISH_INCENSE = "/book-two/tet-incense.webp";

const TOTAL_DISHES = 7;

/* ════════════════════════════════════════════════════════════
   ITEM TYPES & POSITIONS
   Layout: left page — nem + xôi, chicken, bitter-melon soup; right page —
   bánh, pickles, chả lụa; incense near the spine between the chicken (left
   page, toward gutter) and chả lụa (right page, toward gutter).
================================================================ */
type ItemKind =
  | "nem-xoi"
  | "chicken"
  | "bitter-melon"
  | "banh-bundle"
  | "pickles"
  | "cha-lua"
  | "incense";

const DISH_SRC: Record<ItemKind, string> = {
  "nem-xoi": DISH_NEM_XOI,
  chicken: DISH_CHICKEN,
  "bitter-melon": DISH_BITTER_MELON,
  "banh-bundle": DISH_BANH,
  pickles: DISH_PICKLES,
  "cha-lua": DISH_CHA_LUA,
  incense: DISH_INCENSE,
};

type Spot = {
  id: string;
  kind: ItemKind;
  caption: string;
  /** position in % of the page */
  x: number;
  y: number;
  /** size hint — used by image-based items */
  size?: number;
  /** optional CSS transform on placed art when PNG transparent bbox is off-center */
  artNudge?: string;
  /** tall burner: nudge art so base sits on the wood */
  anchorBottom?: boolean;
};

/* The round table straddles the spine. Keep every hotspot inside the painted
   wood disk (rough safe band: left page x≈66–90%, y≈46–59%; right x≈12–36%, same y).
   Hit boxes stay tight so circles + art do not spill onto the dark surround. */
const LEFT_SPOTS: Spot[] = [
  {
    id: "L-nem-xoi",
    kind: "nem-xoi",
    caption:
      "Symbols of wealth & luck: the gold of nem rán suggests prosperity; the red of xôi gấc, good fortune.",
    x: 67,
    y: 46,
    size: 92,
  },
  {
    id: "L-chicken",
    kind: "chicken",
    caption:
      "A pure & bright beginning: offered whole to ancestors, it stands for good fortune and integrity.",
    x: 84,
    y: 51,
    size: 96,
    artNudge: "translate(-5%, -4%)",
  },
  {
    id: "L-bitter-melon",
    kind: "bitter-melon",
    caption:
      "Letting go of hardships: bitter-melon soup carries the hope that last year’s troubles will fade away.",
    x: 72,
    y: 58,
    size: 88,
  },
];

const RIGHT_SPOTS: Spot[] = [
  {
    id: "R-banh",
    kind: "banh-bundle",
    caption:
      "Gratitude for the earth: sticky rice cakes thank the soil and the hands that feed us.",
    x: 28,
    y: 55,
    size: 90,
  },
  {
    id: "R-pickles",
    kind: "pickles",
    caption:
      "Cleansing & balance: eaten beside rich dishes, pickles clear the palate and the old year’s weight.",
    x: 34,
    y: 45,
    size: 86,
  },
  {
    id: "R-cha-lua",
    kind: "cha-lua",
    caption:
      "Harmony & wholeness: a smooth round slice hopes for a complete, peaceful year.",
    x: 12,
    y: 58,
    size: 88,
  },
  {
    id: "R-incense",
    kind: "incense",
    caption: "Smoke for those who came before.",
    x: 15,
    y: 50,
    size: 68,
    anchorBottom: true,
  },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE — placed item ids shared across both pages
================================================================ */
const _placed = new Set<string>();
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _placed.clear();
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _place(id: string) {
  if (_placed.has(id)) return;
  _placed.add(id);
  _notify();
}
function usePlaced() {
  const [n, setN] = useState(_placed.size);
  useEffect(() => {
    const cb = () => setN(_placed.size);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return { count: n, isPlaced: (id: string) => _placed.has(id) };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const TetTablePage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <TetLeft forwardedRef={ref} />;
    return <TetRight forwardedRef={ref} />;
  }
);
TetTablePage.displayName = "TetTablePage";
export default TetTablePage;

/* ════════════════════════════════════════════════════════════
   LEFT
================================================================ */
function TetLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { count, isPlaced } = usePlaced();
  const [lastCaption, setLastCaption] = useState<string | null>(null);
  const warmth = Math.min(1, count / TOTAL_DISHES);

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={5}
      style={{ background: "#0d0710" }}
    >
      <SceneBackdrop side="left" warmth={warmth} />
      <LanternFlicker side="left" warmth={warmth} />

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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.6 }}
          style={{
            margin: "1rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.86rem",
            lineHeight: 1.7,
            color: "rgba(232,210,180,0.85)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {NARR_TOP}
        </motion.p>
      </div>

      {/* Click spots */}
      {LEFT_SPOTS.map(spot => (
        <SpotMarker
          key={spot.id}
          spot={spot}
          placed={isPlaced(spot.id)}
          onPlace={() => {
            _place(spot.id);
            setLastCaption(spot.caption);
          }}
        />
      ))}

      <CaptionLine caption={lastCaption} side="left" />

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
   RIGHT
================================================================ */
function TetRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { count, isPlaced } = usePlaced();
  const [lastCaption, setLastCaption] = useState<string | null>(null);
  const warmth = Math.min(1, count / TOTAL_DISHES);

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={6}
      style={{ background: "#0d0710" }}
    >
      <SceneBackdrop side="right" warmth={warmth} />

      {/* Click spots */}
      {RIGHT_SPOTS.map(spot => (
        <SpotMarker
          key={spot.id}
          spot={spot}
          placed={isPlaced(spot.id)}
          onPlace={() => {
            _place(spot.id);
            setLastCaption(spot.caption);
          }}
        />
      ))}

      <CaptionLine caption={lastCaption} side="right" />

      {/* Bottom narrative — fades in once warmth is enough */}
      <motion.div
        animate={{ opacity: warmth > 0.3 ? 1 : 0.25 }}
        transition={{ duration: 1.6 }}
        style={{
          position: "absolute",
          bottom: "4.5rem",
          left: "2.5rem",
          right: "2.5rem",
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
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: "rgba(245,225,195,0.92)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
          }}
        >
          {NARR_BOT_1}
        </p>
        <p
          style={{
            margin: "0.5rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            lineHeight: 1.7,
            color: "rgba(220,200,170,0.78)",
            textShadow: "0 0 14px rgba(0,0,0,0.85)",
            whiteSpace: "pre-line",
          }}
        >
          {NARR_BOT_2}
        </p>
      </motion.div>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   SCENE BACKDROP — half of the painted Tết room, with a warmth
   pool that brightens as more items are placed.

   Non-table areas: a blurred, darkened copy reads as depth. The
   round table stays sharp via a radial mask aligned with the spine.
================================================================ */
function SceneBackdrop({ side, warmth }: { side: "left" | "right"; warmth: number }) {
  const cx = side === "left" ? "82%" : "18%";
  const cy = "64%";
  const bgCommon = {
    position: "absolute" as const,
    inset: 0,
    backgroundImage: `url(${SCENE_SRC})`,
    backgroundSize: "200% auto",
    backgroundPosition: side === "left" ? ("left center" as const) : ("right center" as const),
    backgroundRepeat: "no-repeat" as const,
  };
  const sharpFilter = `brightness(${0.78 + warmth * 0.22}) saturate(${0.88 + warmth * 0.18})`;
  const tableMask = `radial-gradient(ellipse 46% 24% at ${cx} ${cy}, #000 0%, #000 32%, rgba(0,0,0,0.55) 50%, transparent 72%)`;

  return (
    <>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* Receded room — blur + dim everything */}
        <div
          style={{
            ...bgCommon,
            transform: "scale(1.07)",
            filter: `blur(9px) brightness(${0.38 + warmth * 0.1}) saturate(0.62)`,
            transition: "filter 1.0s ease, transform 1.0s ease",
          }}
        />
        {/* Table only — sharp, same framing as underlay */}
        <div
          style={{
            ...bgCommon,
            filter: sharpFilter,
            transition: "filter 1.0s ease",
            maskImage: tableMask,
            WebkitMaskImage: tableMask,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      </div>

      {/* Warm pool over the round table — follows spine-centered ellipse */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 58% 36% at ${cx} ${cy}, rgba(255,${170 + warmth * 30},${80 + warmth * 30},${0.1 + warmth * 0.26}) 0%, transparent 72%)`,
          mixBlendMode: "screen",
          transition: "background 1.0s ease",
        }}
      />

      {/* Soft edge vignette — slightly stronger so walls / lantern stay subdued */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 92% 88% at 50% 48%, transparent 42%, rgba(2,1,6,0.62) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   LANTERN FLICKER — left page only. The painted lantern sits
   in the upper-left of the scene; this overlay adds a gentle
   pulsing warmth that brings it to life.
================================================================ */
function LanternFlicker({
  side,
  warmth,
}: {
  side: "left" | "right";
  warmth: number;
}) {
  if (side !== "left") return null;
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: [0.55, 0.85, 0.65, 0.9, 0.6] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: "5%",
        left: "16%",
        width: 160,
        height: 160,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,170,80,0.32) 0%, rgba(255,140,60,0.12) 35%, transparent 70%)",
        filter: "blur(2px)",
        mixBlendMode: "screen",
        pointerEvents: "none",
        transform: `scale(${0.85 + warmth * 0.25})`,
        transition: "transform 1.0s ease",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   SPOT MARKER — empty glowing dot, becomes an item when clicked
================================================================ */
function SpotMarker({
  spot,
  placed,
  onPlace,
}: {
  spot: Spot;
  placed: boolean;
  onPlace: () => void;
}) {
  const [hover, setHover] = useState(false);
  const s = spot.size ?? 92;
  /* Tight hit slop so the dashed ring + dish stay on the wood, not the black surround */
  const hit = Math.min(s + 16, Math.round(s * 1.06));
  return (
    <div
      data-book-interactive
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); if (!placed) onPlace(); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!placed) onPlace();
        }
      }}
      style={{
        position: "absolute",
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        transform: "translate(-50%, -50%)",
        width: hit,
        height: hit,
        cursor: placed ? "default" : "pointer",
        zIndex: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!placed && (
        <motion.div
          animate={{ opacity: hover ? [0.5, 0.9, 0.5] : [0.28, 0.55, 0.28] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1px dashed rgba(255,200,140,0.6)",
            background:
              "radial-gradient(circle, rgba(255,200,120,0.22) 0%, transparent 70%)",
          }}
        />
      )}

      <AnimatePresence>
        {placed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ItemArt
              kind={spot.kind}
              size={spot.size}
              artNudge={spot.artNudge}
              anchorBottom={spot.anchorBottom}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ITEM ART — symbolic Tết meal stickers
================================================================ */
function ItemArt({
  kind,
  size,
  artNudge,
  anchorBottom,
}: {
  kind: ItemKind;
  size?: number;
  artNudge?: string;
  anchorBottom?: boolean;
}) {
  return (
    <DishSticker
      src={DISH_SRC[kind]}
      size={size ?? 92}
      artNudge={artNudge}
      anchorBottom={anchorBottom}
    />
  );
}

/* ─── Dish PNG — transparent, soft halo + shadow ─────────── */
function DishSticker({
  src,
  size,
  artNudge,
  anchorBottom,
}: {
  src: string;
  size: number;
  artNudge?: string;
  anchorBottom?: boolean;
}) {
  const innerTransform = [anchorBottom ? "translateY(-10%)" : "", artNudge ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: innerTransform || undefined,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,200,120,0.2) 0%, transparent 70%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.55))",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CAPTION LINE — small caption near bottom when an item placed
================================================================ */
function CaptionLine({
  caption,
  side,
}: {
  caption: string | null;
  side: "left" | "right";
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "1.35rem",
        [side === "left" ? "right" : "left"]: "1.5rem",
        textAlign: side === "left" ? "right" : "left",
        zIndex: 11,
        pointerEvents: "none",
        maxWidth: "min(46ch, calc(100% - 3rem))",
        minHeight: "2.2rem",
      }}
    >
      <motion.div
        key={caption ?? "none"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: caption ? 1 : 0, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.64rem",
          lineHeight: 1.5,
          color: "rgba(238,212,178,0.92)",
          textShadow: "0 0 12px rgba(0,0,0,0.85)",
          letterSpacing: "0.02em",
          whiteSpace: "normal",
        }}
      >
        {caption ?? ""}
      </motion.div>
    </div>
  );
}
