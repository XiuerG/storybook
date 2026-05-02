"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import CarouselCoverAmbient from "./CarouselCoverAmbient";

/* ════════════════════════════════════════════════════════════
   BOOK CAROUSEL — 4 books arranged on a cylindrical arc.
   Each card shows the same cover artwork + glaze + ambient motion
   (non-title layers from each opened cover) at thumbnail scale.
================================================================ */

export interface BookEntry {
  id: string;
  romanNumeral: string;
  title: string;
  group: string;
  /** background tint for the book card */
  baseFrom: string;
  baseTo: string;
  /** glow colour over the cover */
  glow: string;
}

/** Same artwork + opacity + glaze as each book’s opened cover (thumbnail scale). */
const ATLAS_CAROUSEL_COVERS: Record<
  string,
  { base: string; image: string; photoOpacity: number; glaze: string }
> = {
  "book-one": {
    base: "#1e1b18",
    image: "/cover-background.png?v=4",
    photoOpacity: 0.88,
    glaze:
      "linear-gradient(to top, rgba(12,8,6,0.72) 0%, rgba(12,8,6,0.35) 28%, transparent 52%)",
  },
  "book-two": {
    base: "#151015",
    image: "/book-two-cover-bg.png?v=1",
    photoOpacity: 0.56,
    glaze:
      "radial-gradient(ellipse 90% 60% at 50% 75%, rgba(60,28,18,0.4) 0%, transparent 72%)," +
      "radial-gradient(ellipse 70% 80% at 50% 18%, rgba(110,72,42,0.18) 0%, transparent 68%)," +
      "linear-gradient(180deg, rgba(10,6,14,0.42) 0%, rgba(8,5,12,0.34) 58%, rgba(14,9,18,0.44) 100%)",
  },
  "book-three": {
    base: "#0f0d16",
    image: "/book-three-cover-bg.png?v=1",
    photoOpacity: 0.54,
    glaze:
      "radial-gradient(ellipse 90% 50% at 50% 82%, rgba(70,30,28,0.34) 0%, transparent 72%)," +
      "radial-gradient(ellipse 70% 70% at 50% 20%, rgba(60,55,110,0.2) 0%, transparent 65%)," +
      "linear-gradient(180deg, rgba(8,7,15,0.46) 0%, rgba(10,8,18,0.38) 58%, rgba(14,12,22,0.42) 100%)",
  },
  "book-four": {
    base: "#0d0a18",
    image: "/book-four-cover-bg.png?v=1",
    photoOpacity: 0.54,
    glaze:
      "radial-gradient(ellipse 90% 50% at 50% 78%, rgba(255,120,50,0.28) 0%, transparent 72%)," +
      "radial-gradient(ellipse 80% 70% at 50% 24%, rgba(120,40,70,0.14) 0%, transparent 68%)," +
      "linear-gradient(180deg, rgba(8,5,22,0.48) 0%, rgba(10,8,28,0.38) 58%, rgba(16,10,32,0.42) 100%)",
  },
};

const RADIUS = 220; // depth of the cylinder
const CARD_W = 130;
const CARD_H = 184;
/** Page block + boards — visible when the carousel turns side-on */
const BOOK_DEPTH = 50;

interface Props {
  books: BookEntry[];
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function BookCarousel({ books, onSelect, onHover }: Props) {
  const [rotation, setRotation] = useState(0); // degrees, accumulated
  const dragStateRef = useRef<{
    startX: number;
    startRot: number;
    moved: number;
  } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStateRef.current = {
      startX: e.clientX,
      startRot: rotation,
      moved: 0,
    };
  }, [rotation]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    if (!s) return;
    const dx = e.clientX - s.startX;
    s.moved = Math.max(s.moved, Math.abs(dx));
    // 1 px ≈ 0.4 deg
    setRotation(s.startRot + dx * 0.4);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    if (s) {
      // If we barely moved, treat as a click on no card — do nothing here;
      // individual cards have their own click handlers. Snap to nearest face.
      const step = 360 / books.length;
      const snapped = Math.round(rotation / step) * step;
      setRotation(snapped);
    }
    dragStateRef.current = null;
  }, [rotation, books.length]);

  const onCardClick = useCallback((id: string) => {
    const s = dragStateRef.current;
    // Suppress click if user dragged
    if (s && s.moved > 6) return;
    onSelect(id);
  }, [onSelect]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 320,
        perspective: 900,
        perspectiveOrigin: "50% 50%",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* The drag surface is a generous invisible band beneath the cylinder */}
      <div
        data-atlas-drag
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => onHover(null)}
        style={{
          position: "absolute",
          inset: 0,
          cursor: dragStateRef.current ? "grabbing" : "grab",
        }}
      />

      <motion.div
        animate={{ rotateY: rotation }}
        transition={{ type: "spring", stiffness: 180, damping: 26 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transformStyle: "preserve-3d",
          transformOrigin: "0 0",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        {books.map((book, i) => {
          const angle = (i / books.length) * 360;
          // Effective face angle (deg) when this card is showing toward the viewer
          const effective = ((angle + rotation) % 360 + 360) % 360;
          const distFromFront = Math.min(effective, 360 - effective); // 0..180
          // Visibility: front-most ~1, back ~0
          const visibility = Math.max(0, Math.cos((distFromFront / 180) * Math.PI / 2));

          return (
            <motion.div
              key={book.id}
              animate={{
                marginTop: [0, -3.5, 0, -2.5, 0],
              }}
              transition={{
                duration: 9.5 + (i % 4) * 0.75,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.28,
              }}
              style={{
                position: "absolute",
                left: -CARD_W / 2,
                top: -CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
                pointerEvents: distFromFront < 80 ? "all" : "none",
              }}
            >
              <BookCard
                book={book}
                visibility={visibility}
                isFront={distFromFront < 30}
                onHover={() => onHover(book.id)}
                onLeave={() => onHover(null)}
                onClick={() => onCardClick(book.id)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Soft floor reflection beneath the cylinder */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8%",
          transform: "translateX(-50%)",
          width: 360,
          height: 24,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(140,160,210,0.18) 0%, transparent 70%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   BOOK CARD — shallow box (front / spine / fore-edge / back) so
   side-on views read as thickness, not a paper-thin plane.
================================================================ */
function BookCard({
  book,
  visibility,
  isFront,
  onHover,
  onLeave,
  onClick,
}: {
  book: BookEntry;
  visibility: number;
  isFront: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const art = ATLAS_CAROUSEL_COVERS[book.id] ?? ATLAS_CAROUSEL_COVERS["book-one"];
  const D = BOOK_DEPTH;
  const W = CARD_W;
  const H = CARD_H;
  const dz = D / 2;
  const wx = W / 2;

  const spineStyle: React.CSSProperties = {
    background:
      "linear-gradient(90deg," +
      "rgba(4,3,2,1) 0%," +
      "rgba(28,22,18,0.98) 18%," +
      "rgba(48,38,32,0.95) 45%," +
      "rgba(58,46,38,0.92) 62%," +
      "rgba(42,34,28,0.94) 100%" +
      ")," +
      "repeating-linear-gradient(180deg, transparent 0px, transparent 10px, rgba(0,0,0,0.18) 10px, rgba(0,0,0,0.18) 11px)",
    boxShadow:
      "inset -6px 0 14px rgba(0,0,0,0.65)," +
      "inset 2px 0 0 rgba(255,220,185,0.12)," +
      "1px 0 0 rgba(0,0,0,0.4)",
  };

  const foreEdgeStyle: React.CSSProperties = {
    background:
      "repeating-linear-gradient(" +
      "180deg," +
      "rgba(255,252,245,0.55) 0px," +
      "rgba(255,252,245,0.55) 1px," +
      "rgba(225,205,175,0.45) 1px," +
      "rgba(225,205,175,0.45) 2.5px," +
      "rgba(245,230,210,0.35) 2.5px," +
      "rgba(245,230,210,0.35) 4px" +
      ")",
    boxShadow:
      "inset 3px 0 8px rgba(0,0,0,0.45)," +
      "inset -2px 0 4px rgba(255,255,255,0.14)",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.35 + visibility * 0.65,
        transition: "opacity 0.35s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: hover ? "scale3d(1.04, 1.04, 1.04)" : "scale3d(1, 1, 1)",
            transition: "transform 0.4s cubic-bezier(0.22,0.61,0.36,1)",
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onPointerEnter={() => { setHover(true); onHover(); }}
            onPointerLeave={() => { setHover(false); onLeave(); }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: W,
              height: H,
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {/* Top / bottom — page stack slivers (read as thickness from above) */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: -D,
                width: W,
                height: D,
                transformOrigin: "bottom center",
                transform: "rotateX(90deg)",
                background:
                  "repeating-linear-gradient(" +
                  "90deg," +
                  "rgba(252,248,238,0.55) 0px," +
                  "rgba(252,248,238,0.55) 2px," +
                  "rgba(200,180,155,0.4) 2px," +
                  "rgba(200,180,155,0.4) 4px" +
                  ")",
                boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                bottom: -D,
                width: W,
                height: D,
                transformOrigin: "top center",
                transform: "rotateX(-90deg)",
                background:
                  "linear-gradient(180deg, rgba(28,22,18,0.9), rgba(18,14,12,0.95))",
                boxShadow: "0 -2px 8px rgba(0,0,0,0.45)",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: W,
                height: H,
                transform: `rotateY(180deg) translateZ(${dz}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                borderRadius: 4,
                background: `linear-gradient(165deg, ${book.baseTo} 0%, ${book.baseFrom} 100%)`,
                boxShadow: "inset 0 0 24px rgba(0,0,0,0.65)",
              }}
            />

            {/* Spine — left */}
            <div
              aria-hidden="true"
              style={{
                ...spineStyle,
                position: "absolute",
                left: 0,
                top: 0,
                width: D,
                height: H,
                transformOrigin: "left center",
                transform: `rotateY(-90deg) translateZ(${wx}px)`,
                borderRadius: "3px 0 0 3px",
              }}
            />

            {/* Fore-edge — page block */}
            <div
              aria-hidden="true"
              style={{
                ...foreEdgeStyle,
                position: "absolute",
                right: 0,
                top: 0,
                width: D,
                height: H,
                transformOrigin: "right center",
                transform: `rotateY(90deg) translateZ(${wx}px)`,
                borderRadius: "0 3px 3px 0",
              }}
            />

            {/* Front cover */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: W,
                height: H,
                transform: `translateZ(${dz}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: art.base,
                border: `1px solid ${hover ? "rgba(255,210,170,0.55)" : "rgba(220,210,235,0.22)"}`,
                boxShadow: isFront
                  ? `0 22px 50px rgba(0,0,0,0.7), 0 0 ${hover ? 30 : 18}px ${book.glow}, inset 0 0 22px rgba(0,0,0,0.45)`
                  : "0 14px 30px rgba(0,0,0,0.55), inset 0 0 14px rgba(0,0,0,0.4)",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-10px -9px -10px -10px",
                  zIndex: 0,
                  backgroundImage: `url(${art.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  opacity: art.photoOpacity,
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-10px -9px -10px -10px",
                  zIndex: 1,
                  background: art.glaze,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 4,
                  overflow: "hidden",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <CarouselCoverAmbient bookId={book.id} />
              </div>

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: 3,
                  zIndex: 4,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.6), transparent)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 4,
                  bottom: 4,
                  right: 1,
                  width: 1,
                  zIndex: 4,
                  background:
                    "linear-gradient(180deg, transparent, rgba(245,232,212,0.4) 50%, transparent)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "8%",
                  right: "8%",
                  bottom: "7%",
                  zIndex: 5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "0.52rem",
                    letterSpacing: "0.28em",
                    color: "rgba(245,232,212,0.82)",
                    textTransform: "uppercase",
                    textShadow: "0 1px 10px rgba(0,0,0,0.75)",
                  }}
                >
                  {book.romanNumeral}
                </div>

                <div style={{ flex: 1 }} />

                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "0.48rem",
                    lineHeight: 1.3,
                    letterSpacing: "0.05em",
                    color: "rgba(245,232,212,0.92)",
                    textShadow: "0 0 10px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.9)",
                    textTransform: "uppercase",
                  }}
                >
                  {book.title}
                </div>
              </div>

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  zIndex: 6,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), transparent)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Ground contact shadow — elliptical pool under the book */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: H + 5,
              width: W * 1.28,
              height: 14,
              marginLeft: -(W * 1.28) / 2,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 52%, transparent 74%)",
              filter: "blur(6px)",
              opacity: isFront ? 0.52 : 0.34,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
