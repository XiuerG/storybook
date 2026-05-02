"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import CarouselCoverAmbient from "./CarouselCoverAmbient";

/* ════════════════════════════════════════════════════════════
   BOOK CAROUSEL — books on a cylindrical arc (3D rotateY ring).
   Drag to spin; front card is interactive. Pointer capture only
   when starting outside the book shell so hover still works.
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

const CARD_W = 130;
const CARD_H = 184;
const RADIUS = 220;
/** 书口厚度（3D 窄面），正面时能看到两侧书的侧面 */
const BOOK_THICK = 14;

/** 封面左右两侧的书口窄面（与封面共面铰接，随圆柱旋转可见） */
function BookThicknessEdges({ book }: { book: BookEntry }) {
  const art = ATLAS_CAROUSEL_COVERS[book.id] ?? ATLAS_CAROUSEL_COVERS["book-one"];
  const T = BOOK_THICK;
  const spineL =
    `linear-gradient(270deg, rgba(0,0,0,0.58) 0%, rgba(42,36,32,0.98) 32%, ${art.base} 52%, rgba(12,10,9,0.99) 100%)`;
  const spineR =
    `linear-gradient(90deg, rgba(0,0,0,0.58) 0%, rgba(42,36,32,0.98) 32%, ${art.base} 52%, rgba(12,10,9,0.99) 100%)`;
  const stripBase = {
    position: "absolute" as const,
    top: 0,
    width: T,
    height: CARD_H,
    pointerEvents: "none" as const,
    zIndex: 0,
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
  };

  return (
    <>
      <div
        aria-hidden
        style={{
          ...stripBase,
          left: -T,
          transformOrigin: "100% 50%",
          transform: "rotateY(-90deg)",
          background: spineL,
        }}
      />
      <div
        aria-hidden
        style={{
          ...stripBase,
          left: CARD_W,
          transformOrigin: "0 50%",
          transform: "rotateY(90deg)",
          background: spineR,
        }}
      />
    </>
  );
}

interface Props {
  books: BookEntry[];
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function BookCarousel({ books, onSelect, onHover }: Props) {
  const [rotation, setRotation] = useState(0);
  const dragStateRef = useRef<{
    startX: number;
    startRot: number;
    moved: number;
    tapBookId: string | null;
    hoverCleared?: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const lastSelectRef = useRef(0);
  /** 3D 命中测试不可靠时，用射线结果驱动 HomePage 悬停文案 */
  const [rayHitBookId, setRayHitBookId] = useState<string | null>(null);
  const lastEmittedHoverRef = useRef<string | null>(null);

  const openBook = useCallback((id: string) => {
    const now = Date.now();
    if (now - lastSelectRef.current < 120) return;
    lastSelectRef.current = now;
    onSelect(id);
  }, [onSelect]);

  const frontBook =
    books.reduce<{ book: BookEntry; dist: number } | null>((front, book, i) => {
      const angle = (i / books.length) * 360;
      const effective = ((angle + rotation) % 360 + 360) % 360;
      const dist = Math.min(effective, 360 - effective);
      if (!front || dist < front.dist) return { book, dist };
      return front;
    }, null)?.book ?? books[0];

  const onHoverRef = React.useRef(onHover);
  onHoverRef.current = onHover;

  React.useEffect(() => {
    setRayHitBookId(null);
    lastEmittedHoverRef.current = null;
    onHoverRef.current(null);
  }, [frontBook.id]);

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
      dragStateRef.current = {
        startX: e.clientX,
        startRot: rotation,
        moved: 0,
        tapBookId: bookShell?.dataset.atlasBookId ?? null,
      };
    },
    [rotation],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const s = dragStateRef.current;
      if (s) {
        const dx = e.clientX - s.startX;
        s.moved = Math.max(s.moved, Math.abs(dx));
        if (s.moved > 6 && !s.hoverCleared) {
          s.hoverCleared = true;
          lastEmittedHoverRef.current = null;
          onHover(null);
          setRayHitBookId(null);
        }
        setRotation(s.startRot + dx * 0.4);
        return;
      }

      const stack = document.elementsFromPoint(e.clientX, e.clientY);
      let hitId: string | null = null;
      for (let i = 0; i < Math.min(24, stack.length); i++) {
        const el = stack[i];
        if (!(el instanceof Element)) continue;
        const shell = el.closest("[data-atlas-book-id]");
        if (shell instanceof HTMLElement && shell.dataset.atlasBookId) {
          hitId = shell.dataset.atlasBookId;
          break;
        }
      }
      const resolved = hitId === frontBook.id ? hitId : null;
      setRayHitBookId(resolved);
      if (resolved !== lastEmittedHoverRef.current) {
        lastEmittedHoverRef.current = resolved;
        if (resolved) onHover(resolved);
        else onHover(null);
      }
    },
    [frontBook.id, onHover],
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
        const step = 360 / books.length;
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
        setRotation((r) => Math.round(r / step) * step);
      }
      dragStateRef.current = null;
    },
    [books.length, frontBook.id, openBook],
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
      onPointerDown={onDragPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onDragPointerUp}
      onPointerCancel={onDragPointerUp}
      onPointerLeave={() => {
        lastEmittedHoverRef.current = null;
        setRayHitBookId(null);
        onHover(null);
      }}
      style={{
        position: "relative",
        width: "100%",
        height: 320,
        perspective: 900,
        perspectiveOrigin: "50% 50%",
        userSelect: "none",
        touchAction: "none",
        cursor: "grab",
        overflow: "visible",
      }}
    >
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
          pointerEvents: "auto",
          zIndex: 1,
        }}
      >
        {books.map((book, i) => {
          const angle = (i / books.length) * 360;
          const effective = ((angle + rotation) % 360 + 360) % 360;
          const distFromFront = Math.min(effective, 360 - effective);
          const visibility = Math.max(0, Math.cos((distFromFront / 180) * (Math.PI / 2)));
          const isFront = frontBook.id === book.id;
          const stackZ = Math.max(1, Math.round(1000 - distFromFront * 5));

          return (
            <div
              key={book.id}
              style={{
                position: "absolute",
                left: -CARD_W / 2,
                top: -CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                transform: `rotateY(${angle}deg) translateZ(${RADIUS + (isFront ? 10 : 0)}px)`,
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
                pointerEvents: isFront ? "auto" : "none",
                zIndex: stackZ,
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
                <BookThicknessEdges book={book} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translateZ(${BOOK_THICK / 2}px)`,
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    zIndex: 2,
                  }}
                >
                  <BookCard
                    book={book}
                    visibility={visibility}
                    isFront={isFront}
                    interactive={isFront}
                    rayHit={rayHitBookId === book.id}
                    faceDegrees={effective}
                    distFromFrontDeg={distFromFront}
                    onHover={() => onHover(book.id)}
                    onLeave={() => onHover(null)}
                    onClick={() => onCardClick(book.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

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
   BOOK CARD — flat cover on the cylinder.
================================================================ */
function BookCard({
  book,
  visibility,
  isFront,
  interactive = true,
  rayHit = false,
  faceDegrees = 0,
  distFromFrontDeg = 0,
  onHover,
  onLeave,
  onClick,
}: {
  book: BookEntry;
  visibility: number;
  isFront: boolean;
  interactive?: boolean;
  /** 父级用 elementsFromPoint 命中（圆柱 3D 时 DOM 的 pointerenter 不可靠） */
  rayHit?: boolean;
  /** 封面朝向相对观察者的角度（0 = 正对） */
  faceDegrees?: number;
  /** 与正面的夹角（0–180），用于侧面影强度 */
  distFromFrontDeg?: number;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const lastOpenRef = React.useRef(0);
  const lit = hover || rayHit;

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

  const sideT = isFront ? 0 : Math.min(1, distFromFrontDeg / 92);
  const sinFace = Math.sin((faceDegrees * Math.PI) / 180);
  const castX = sinFace * (4 + sideT * 22);
  const castY = 10 + sideT * 14;
  const castBlur = 14 + sideT * 26;
  const castAlpha = 0.32 + sideT * 0.34;
  const sideCoverShadow = !isFront
    ? `0 ${castY}px ${castBlur}px rgba(0,0,0,${castAlpha * 0.92}),
       ${castX}px ${castY + 4}px ${castBlur * 0.85}px rgba(0,0,0,${castAlpha * 0.72}),
       ${castX * 0.5}px ${castY + 2}px ${castBlur * 0.55}px rgba(30,24,40,${0.12 + sideT * 0.2}),
       inset 0 0 ${12 + sideT * 14}px rgba(0,0,0,${0.12 + sideT * 0.28})`
    : "";

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
      {!isFront && sideT > 0.08 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: H - 2,
            width: W * (1.02 + sideT * 0.28),
            height: 12 + sideT * 10,
            marginLeft: (-W * (1.02 + sideT * 0.28)) / 2 + sinFace * 14 * sideT,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.22) 48%, transparent 72%)",
            filter: "blur(5px)",
            opacity: (0.42 + sideT * 0.38) * Math.min(1, visibility * 1.15),
            pointerEvents: "none",
            zIndex: 0,
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        />
      )}
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
          zIndex: 1,
          transform: lit ? "scale(1.03)" : "scale(1)",
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
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: art.base,
            border: `1px solid ${lit ? "rgba(255,210,170,0.5)" : "rgba(220,210,235,0.22)"}`,
            boxShadow: isFront
              ? `0 12px 28px rgba(0,0,0,0.45), 0 0 ${lit ? 22 : 14}px ${book.glow}`
              : sideCoverShadow || "0 8px 18px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.45s ease",
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
              borderRadius: 4,
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
        </div>
      </div>
    </div>
  );
}
