"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import CarouselCoverAmbient from "./CarouselCoverAmbient";

/* ════════════════════════════════════════════════════════════
   BOOK CAROUSEL — flat horizontal strip; drag to change book.
   Pointer capture only when starting outside the book shell.
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
    image: "/cover-background.webp?v=4",
    photoOpacity: 0.88,
    glaze:
      "linear-gradient(to top, rgba(12,8,6,0.72) 0%, rgba(12,8,6,0.35) 28%, transparent 52%)",
  },
  "book-two": {
    base: "#151015",
    image: "/book-two-cover-bg.webp?v=1",
    photoOpacity: 0.56,
    glaze:
      "radial-gradient(ellipse 90% 60% at 50% 75%, rgba(60,28,18,0.4) 0%, transparent 72%)," +
      "radial-gradient(ellipse 70% 80% at 50% 18%, rgba(110,72,42,0.18) 0%, transparent 68%)," +
      "linear-gradient(180deg, rgba(10,6,14,0.42) 0%, rgba(8,5,12,0.34) 58%, rgba(14,9,18,0.44) 100%)",
  },
  "book-three": {
    base: "#0f0d16",
    image: "/book-three-cover-bg.webp?v=1",
    photoOpacity: 0.54,
    glaze:
      "radial-gradient(ellipse 90% 50% at 50% 82%, rgba(70,30,28,0.34) 0%, transparent 72%)," +
      "radial-gradient(ellipse 70% 70% at 50% 20%, rgba(60,55,110,0.2) 0%, transparent 65%)," +
      "linear-gradient(180deg, rgba(8,7,15,0.46) 0%, rgba(10,8,18,0.38) 58%, rgba(14,12,22,0.42) 100%)",
  },
  "book-four": {
    base: "#0d0a18",
    image: "/book-four-cover-bg.webp?v=1",
    photoOpacity: 0.54,
    glaze:
      "radial-gradient(ellipse 90% 50% at 50% 78%, rgba(255,120,50,0.28) 0%, transparent 72%)," +
      "radial-gradient(ellipse 80% 70% at 50% 24%, rgba(120,40,70,0.14) 0%, transparent 68%)," +
      "linear-gradient(180deg, rgba(8,5,22,0.48) 0%, rgba(10,8,28,0.38) 58%, rgba(16,10,32,0.42) 100%)",
  },
};

const CARD_W = 168;
const CARD_H = Math.round((184 / 130) * CARD_W);
const GAP = 36;
const SPACING = CARD_W + GAP;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

interface Props {
  books: BookEntry[];
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function BookCarousel({ books, onSelect, onHover }: Props) {
  const [focus, setFocus] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cw, setCw] = useState(400);
  const [dragging, setDragging] = useState(false);

  const dragStateRef = useRef<{
    startX: number;
    startFocus: number;
    moved: number;
    tapBookId: string | null;
    hoverCleared?: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const lastSelectRef = useRef(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCw(el.clientWidth || 400));
    ro.observe(el);
    setCw(el.clientWidth || 400);
    return () => ro.disconnect();
  }, []);

  const openBook = useCallback((id: string) => {
    const now = Date.now();
    if (now - lastSelectRef.current < 120) return;
    lastSelectRef.current = now;
    onSelect(id);
  }, [onSelect]);

  const n = books.length;
  const frontIndex = mod(Math.round(focus), n);
  const frontBook = books[frontIndex] ?? books[0];

  const panPx = cw / 2 - CARD_W / 2 - focus * SPACING;

  const onDragPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.target;
      const bookShell =
        target instanceof Element
          ? target.closest<HTMLElement>("[data-atlas-book-id]")
          : null;
      const root = e.currentTarget as HTMLElement;
      if (!bookShell) {
        root.setPointerCapture(e.pointerId);
      }
      setDragging(true);
      dragStateRef.current = {
        startX: e.clientX,
        startFocus: focus,
        moved: 0,
        tapBookId: bookShell?.dataset.atlasBookId ?? null,
      };
    },
    [focus],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const s = dragStateRef.current;
      if (s) {
        const dx = e.clientX - s.startX;
        s.moved = Math.max(s.moved, Math.abs(dx));
        if (s.moved > 6 && !s.hoverCleared) {
          s.hoverCleared = true;
          onHover(null);
        }
        const raw = s.startFocus - dx / SPACING;
        const clamped = Math.max(-0.35, Math.min(n - 1 + 0.35, raw));
        setFocus(clamped);
        return;
      }
    },
    [n, onHover],
  );

  const onDragPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const s = dragStateRef.current;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      if (s) {
        if (s.moved > 6) {
          suppressClickRef.current = true;
          window.setTimeout(() => {
            suppressClickRef.current = false;
          }, 120);
        } else {
          const rect = e.currentTarget.getBoundingClientRect();
          const localX = e.clientX - rect.left;
          const localY = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const hitW = CARD_W * 1.35;
          const hitH = CARD_H * 1.35;
          const tappedFrontBook =
            Math.abs(localX - centerX) <= hitW / 2 &&
            Math.abs(localY - centerY) <= hitH / 2;

          if (tappedFrontBook) {
            openBook(s.tapBookId ?? frontBook.id);
          }
        }
        setFocus((f) => Math.max(0, Math.min(n - 1, Math.round(f))));
      }
      dragStateRef.current = null;
      setDragging(false);
    },
    [frontBook.id, n, openBook],
  );

  const onCardClick = useCallback(
    (id: string) => {
      if (suppressClickRef.current) return;
      openBook(id);
    },
    [openBook],
  );

  return (
    <div
      ref={containerRef}
      onPointerDown={onDragPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onDragPointerUp}
      onPointerCancel={onDragPointerUp}
      onPointerLeave={() => {
        onHover(null);
      }}
      style={{
        position: "relative",
        width: "100%",
        height: 380,
        userSelect: "none",
        touchAction: "none",
        cursor: "grab",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: GAP,
          height: CARD_H,
          marginTop: -CARD_H / 2,
          willChange: "transform",
          transform: `translate3d(${panPx}px,0,0)`,
          transition: dragging
            ? "none"
            : "transform 0.38s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        {books.map((book, i) => {
          const wrappedDist = Math.min(
            Math.abs(i - focus),
            Math.abs(i - focus + n),
            Math.abs(i - focus - n),
          );
          const visibility = Math.max(
            0,
            Math.cos((Math.min(wrappedDist, n / 2) / (n / 2)) * (Math.PI / 2)),
          );
          const isFront = i === frontIndex;

          return (
            <div
              key={book.id}
              style={{
                position: "relative",
                width: CARD_W,
                height: CARD_H,
                flexShrink: 0,
                pointerEvents: isFront ? "auto" : "none",
                zIndex: isFront ? 2 : 1,
              }}
            >
              <BookCard
                book={book}
                visibility={visibility}
                isFront={isFront}
                interactive={isFront}
                onHover={() => onHover(book.id)}
                onLeave={() => onHover(null)}
                onClick={() => onCardClick(book.id)}
              />
            </div>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8%",
          transform: "translateX(-50%)",
          width: 440,
          height: 28,
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
   BOOK CARD — flat cover.
================================================================ */
function BookCard({
  book,
  visibility,
  isFront,
  interactive = true,
  onHover,
  onLeave,
  onClick,
}: {
  book: BookEntry;
  visibility: number;
  isFront: boolean;
  interactive?: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const lastOpenRef = React.useRef(0);

  const tryOpen = React.useCallback(() => {
    const t = Date.now();
    if (t - lastOpenRef.current < 90) return;
    lastOpenRef.current = t;
    onClick();
  }, [onClick]);

  React.useEffect(() => {
    if (!isFront && hover) {
      setHover(false);
      onLeave();
    }
  }, [hover, isFront, onLeave]);

  const art = ATLAS_CAROUSEL_COVERS[book.id] ?? ATLAS_CAROUSEL_COVERS["book-one"];
  const W = CARD_W;
  const H = CARD_H;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.35 + visibility * 0.65,
        transition: "opacity 0.35s ease",
        pointerEvents: interactive && isFront ? "auto" : "none",
      }}
    >
      <div
        data-atlas-book-shell
        data-atlas-book-id={interactive ? book.id : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive && isFront ? 0 : -1}
        onPointerEnter={interactive ? () => { setHover(true); onHover(); } : undefined}
        onPointerLeave={interactive ? () => { setHover(false); onLeave(); } : undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (!interactive) return;
          tryOpen();
        }}
        onKeyDown={(e) => {
          if (!interactive) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            tryOpen();
          }
        }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transform: hover ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.35s cubic-bezier(0.22,0.61,0.36,1)",
          pointerEvents: interactive && isFront ? "auto" : "none",
          cursor: interactive && isFront ? "pointer" : "default",
          outline: "none",
          touchAction: "manipulation",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: H,
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: art.base,
            border: `1px solid ${hover ? "rgba(255,210,170,0.5)" : "rgba(220,210,235,0.22)"}`,
            boxShadow: isFront
              ? `0 14px 34px rgba(0,0,0,0.45), 0 0 ${hover ? 26 : 16}px ${book.glow}`
              : "0 10px 22px rgba(0,0,0,0.4)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
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
              inset: 0,
              zIndex: 1,
              background: art.glaze,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 5,
              overflow: "hidden",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <CarouselCoverAmbient bookId={book.id} />
          </div>

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
                fontSize: "0.6rem",
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
                fontSize: "0.55rem",
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
        </div>
      </div>
    </div>
  );
}
