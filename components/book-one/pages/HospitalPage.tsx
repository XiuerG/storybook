"use client";

import React, {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "./PageShell";
import { InteractionHint } from "./InteractionHint";

/* ════════════════════════════════════════════════════════════
   CONTENT — title + closing line
════════════════════════════════════════════════════════════ */
const TITLE = "Out of Focus";
const NARRATIVE =
  "I came with a body that needed help.\n\nThe system answered with forms, waitlists, referrals,\nand words I could almost understand.\n\nEvery sentence became a door.\nEvery door required another key.";
const CLOSING_A = "All these words.";
const CLOSING_B = "None of them mine.";

/* ════════════════════════════════════════════════════════════
   COLOR PALETTE
════════════════════════════════════════════════════════════ */
const C = {
  textBright:  "rgba(220, 230, 245, 0.72)",
  textMid:     "rgba(190, 205, 225, 0.46)",
  textFaint:   "rgba(170, 188, 210, 0.26)",
  textGhost:   "rgba(150, 170, 200, 0.14)",
  narrative:   "rgba(220, 228, 240, 0.86)",
  closing:     "rgba(210, 220, 235, 0.78)",
} as const;

/* ════════════════════════════════════════════════════════════
   INTERACTION TUNING
   Edit these to change how the page feels.

   The arc:
     • Initially clear (BASE_BLUR_SCALE keeps text readable)
     • Each click PERMANENTLY adds a layer of blur (BLUR_STEP_PER_CLICK)
     • Mouse hover adds a small extra blur on top (MOUSE_BLUR_GAIN)
     • Click count is clamped to MAX_BLUR_LEVEL — past that the
       page can't get any worse, but it never recovers either.
════════════════════════════════════════════════════════════ */
const BASE_BLUR_SCALE     = 0.45;  // initial multiplier on every fragment's base blur
const BLUR_STEP_PER_CLICK = 0.9;   // additive per-click factor; level 5 ≈ 1+0.9×5 = 5.5×
const MAX_BLUR_LEVEL      = 5;     // clicks past this don't increase blur further
const LETTER_FLOW_START   = 2;     // blur level at which scattered letters begin appearing
const LETTER_COUNT        = 42;    // letters drifting per page at peak intensity
const FOCUS_RADIUS        = 0.30;  // 0–1 fraction of page where the cursor reaches
const MOUSE_BLUR_GAIN     = 0.5;   // small extra blur near cursor (≤ 1.5× at cursor centre)
const PARALLAX_X          = 9;
const PARALLAX_Y          = 5;
const RIPPLE_DURATION     = 1.5;   // s — click ripple visual

/* ════════════════════════════════════════════════════════════
   FLOATING FRAGMENTS
════════════════════════════════════════════════════════════ */
type Frag = {
  text: string;
  xPct: number;
  yPct: number;
  size: number;
  blur: number;
  opacity: number;
  italic?: boolean;
  weight?: 200 | 300 | 400;
  uppercase?: boolean;
  letterSpacing?: string;
  rotate?: number;
  drift: number;
  duration: number;
  delay: number;
  color?: string;
  align?: "left" | "right" | "center";
  maxWidth?: number;
};

const FRAGS_L: Frag[] = [
  { text: "← Check-in\nPlease have your ID and\ninsurance ready.", xPct: 5, yPct: 10, size: 0.62, blur: 1.2, opacity: 0.55, weight: 300, drift: 5, duration: 14, delay: 0, color: C.textMid, align: "left", maxWidth: 150 },
  { text: "Reschedule\nNo slots available.", xPct: 4, yPct: 36, size: 0.6, blur: 2.0, opacity: 0.45, weight: 300, drift: 4, duration: 16, delay: 1.4, color: C.textFaint, align: "left", maxWidth: 130 },
  { text: "Out of Network", xPct: 6, yPct: 56, size: 0.78, blur: 0.9, opacity: 0.62, weight: 400, uppercase: true, letterSpacing: "0.08em", drift: 6, duration: 12, delay: 0.6, color: C.textBright, align: "left" },
  { text: "Your plan is out of network.\nHigher copay may apply.\nWould you like to continue?", xPct: 4, yPct: 62, size: 0.58, blur: 1.6, opacity: 0.48, weight: 300, drift: 5, duration: 18, delay: 2.0, color: C.textMid, align: "left", maxWidth: 170 },
  { text: "Please call back", xPct: 8, yPct: 80, size: 0.62, blur: 2.4, opacity: 0.40, italic: true, weight: 300, drift: 4, duration: 15, delay: 3.0, color: C.textFaint, align: "left" },
  { text: "Our offices are\ncurrently closed.", xPct: 6, yPct: 84, size: 0.5, blur: 2.0, opacity: 0.32, weight: 300, drift: 3, duration: 17, delay: 3.6, color: C.textGhost, align: "left", maxWidth: 130 },
  { text: "Next available appointment\n> 6 weeks", xPct: 36, yPct: 8, size: 0.65, blur: 1.4, opacity: 0.50, weight: 300, drift: 5, duration: 13, delay: 0.8, color: C.textMid, align: "left", maxWidth: 200, rotate: -1 },
  { text: "Would you like to schedule?", xPct: 38, yPct: 16, size: 0.55, blur: 1.8, opacity: 0.34, italic: true, weight: 300, drift: 4, duration: 14, delay: 1.6, color: C.textFaint, align: "left" },
  { text: "Interpreter unavailable.", xPct: 30, yPct: 88, size: 0.66, blur: 1.0, opacity: 0.60, italic: true, weight: 300, drift: 5, duration: 14, delay: 2.6, color: C.textBright, align: "left", letterSpacing: "0.02em" },
  { text: "We're sorry.\nNo interpreter available\nat this time.", xPct: 32, yPct: 92, size: 0.5, blur: 1.6, opacity: 0.38, weight: 300, drift: 3, duration: 16, delay: 3.4, color: C.textGhost, align: "left", maxWidth: 170 },
];

const FRAGS_R: Frag[] = [
  { text: "Please describe your symptoms", xPct: 8, yPct: 6, size: 0.74, blur: 1.0, opacity: 0.62, weight: 300, letterSpacing: "0.02em", drift: 5, duration: 13, delay: 0.2, color: C.textBright, align: "left", maxWidth: 280 },
  { text: "in as much detail as possible.", xPct: 9, yPct: 11, size: 0.55, blur: 1.6, opacity: 0.36, italic: true, weight: 300, drift: 4, duration: 17, delay: 1.2, color: C.textFaint, align: "left" },
  { text: "Severity of symptoms", xPct: 4, yPct: 19, size: 0.52, blur: 2.4, opacity: 0.30, weight: 300, drift: 3, duration: 18, delay: 2.4, color: C.textGhost, align: "left" },
  { text: "How long have you had this issue?", xPct: 26, yPct: 23, size: 0.58, blur: 1.4, opacity: 0.46, italic: true, weight: 300, drift: 4, duration: 15, delay: 0.7, color: C.textMid, align: "left", maxWidth: 210, rotate: -1 },
  { text: "Rate your pain", xPct: 28, yPct: 30, size: 0.66, blur: 0.9, opacity: 0.62, weight: 400, uppercase: true, letterSpacing: "0.10em", drift: 4, duration: 12, delay: 1.4, color: C.textBright, align: "left" },
  { text: "1   2   3   4   5   6   7   8   9   10", xPct: 28, yPct: 35, size: 0.55, blur: 1.6, opacity: 0.40, weight: 300, drift: 3, duration: 16, delay: 2.0, color: C.textFaint, align: "left", letterSpacing: "0.02em" },
  { text: "Authorization Required", xPct: 60, yPct: 8, size: 0.78, blur: 0.8, opacity: 0.66, weight: 400, letterSpacing: "0.04em", drift: 5, duration: 11, delay: 0.4, color: C.textBright, align: "left", rotate: 1 },
  { text: "This service requires\nprior authorization.", xPct: 60, yPct: 14, size: 0.55, blur: 1.4, opacity: 0.42, italic: true, weight: 300, drift: 4, duration: 15, delay: 1.4, color: C.textMid, align: "left", maxWidth: 180 },
  { text: "Co-pay", xPct: 78, yPct: 24, size: 0.85, blur: 1.0, opacity: 0.62, weight: 400, letterSpacing: "0.04em", drift: 5, duration: 13, delay: 0.9, color: C.textBright, align: "left" },
  { text: "$450.00", xPct: 78, yPct: 30, size: 1.0, blur: 0.6, opacity: 0.74, weight: 300, letterSpacing: "0.02em", drift: 6, duration: 11, delay: 1.6, color: C.textBright, align: "left" },
  { text: "Payment is due\nat time of service.", xPct: 78, yPct: 35, size: 0.5, blur: 1.8, opacity: 0.34, italic: true, weight: 300, drift: 3, duration: 16, delay: 2.4, color: C.textFaint, align: "left", maxWidth: 150 },
  { text: "Insurance ID", xPct: 72, yPct: 47, size: 0.7, blur: 1.0, opacity: 0.56, weight: 400, drift: 5, duration: 14, delay: 0.6, color: C.textBright, align: "left" },
  { text: "Please update\nyour information.", xPct: 72, yPct: 51, size: 0.5, blur: 1.6, opacity: 0.38, italic: true, weight: 300, drift: 4, duration: 15, delay: 1.8, color: C.textMid, align: "left", maxWidth: 150 },
  { text: "Coverage limitations", xPct: 60, yPct: 60, size: 0.7, blur: 1.0, opacity: 0.54, weight: 400, letterSpacing: "0.03em", drift: 5, duration: 13, delay: 1.0, color: C.textBright, align: "left" },
  { text: "Some services may\nnot be covered.", xPct: 60, yPct: 65, size: 0.5, blur: 1.6, opacity: 0.38, italic: true, weight: 300, drift: 3, duration: 17, delay: 2.2, color: C.textFaint, align: "left", maxWidth: 160 },
  { text: "Confidential", xPct: 4, yPct: 90, size: 0.6, blur: 1.2, opacity: 0.50, weight: 300, italic: true, letterSpacing: "0.04em", drift: 4, duration: 14, delay: 0.8, color: C.textMid, align: "left" },
  { text: "Patient ID:", xPct: 4, yPct: 95, size: 0.55, blur: 1.4, opacity: 0.40, weight: 300, letterSpacing: "0.04em", drift: 3, duration: 16, delay: 2.0, color: C.textFaint, align: "left" },
  { text: "Estimated wait time\n~ 37 min", xPct: 36, yPct: 76, size: 0.58, blur: 1.6, opacity: 0.44, italic: true, weight: 300, drift: 4, duration: 14, delay: 1.6, color: C.textMid, align: "left", maxWidth: 170, rotate: -1 },
  { text: "Exam Room", xPct: 84, yPct: 12, size: 0.6, blur: 1.4, opacity: 0.46, weight: 300, letterSpacing: "0.04em", drift: 5, duration: 12, delay: 2.6, color: C.textFaint, align: "left" },
  { text: "3", xPct: 92, yPct: 14, size: 1.6, blur: 1.0, opacity: 0.52, weight: 300, drift: 4, duration: 13, delay: 3.0, color: C.textBright, align: "left" },
  { text: "Please wait\nto be called.", xPct: 82, yPct: 80, size: 0.5, blur: 1.8, opacity: 0.34, italic: true, weight: 300, drift: 3, duration: 15, delay: 3.4, color: C.textGhost, align: "left", maxWidth: 130 },
  { text: "...", xPct: 50, yPct: 50, size: 0.7, blur: 0.8, opacity: 0.44, weight: 300, letterSpacing: "0.4em", drift: 6, duration: 10, delay: 4.0, color: C.textBright, align: "left" },
];

/* ════════════════════════════════════════════════════════════
   LETTER POOL — particles for the LetterFlow swarm
   Built from the actual bureaucratic phrases so the eye briefly
   recognises fragments of them as they drift away.
════════════════════════════════════════════════════════════ */

type Particle = {
  char: string;
  yPct: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
  bob: number;
  rotate: number;
};

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildLetterPool(): string[] {
  const allText = [...FRAGS_L, ...FRAGS_R].map((f) => f.text).join(" ");
  // individual letters & digits
  const chars = allText.split("").filter((c) => /[A-Za-z0-9$?]/.test(c));
  // short words (≤ 4 chars) sampled twice for weight
  const words = allText
    .split(/[\s\n.,;:!?()/\\—-]+/)
    .filter((w) => w.length > 0 && w.length <= 4 && /[A-Za-z]/.test(w));
  return [
    ...chars,
    ...chars,
    ...words,
    ...words,
    "$45", "ID", "Rx", "PT", "→", "•",
  ];
}

const LETTER_POOL = buildLetterPool();

function buildLetterParticles(side: "left" | "right", count: number): Particle[] {
  const seedBase = side === "left" ? 41 : 73;
  return Array.from({ length: count }, (_, i) => {
    const r = (k: number) => pseudoRandom(seedBase + i * 17 + k);
    return {
      char: LETTER_POOL[Math.floor(r(1) * LETTER_POOL.length)] ?? "·",
      yPct: 4 + r(2) * 92,
      duration: 16 + r(3) * 28,
      delay: r(4) * 36,
      size: 0.7 + r(5) * 0.85,
      opacity: 0.42 + r(6) * 0.45,
      bob: 8 + r(7) * 22,
      rotate: -10 + r(8) * 20,
    };
  });
}

const PARTICLES_L = buildLetterParticles("left", LETTER_COUNT);
const PARTICLES_R = buildLetterParticles("right", LETTER_COUNT);

/* ════════════════════════════════════════════════════════════
   GLOBAL CLICK STORE
   Both pages share a single click counter so each click on either
   side accumulates blur on the entire spread.
════════════════════════════════════════════════════════════ */
const clickStore = (() => {
  let snapshot = { total: 0 };
  const listeners = new Set<() => void>();

  if (typeof window !== "undefined") {
    window.addEventListener("storybook:reset", () => {
      snapshot = { total: 0 };
      listeners.forEach((fn) => fn());
    });
  }

  return {
    getSnapshot: () => snapshot,
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    register: () => {
      snapshot = { total: snapshot.total + 1 };
      listeners.forEach((fn) => fn());
    },
  };
})();

function useHospitalClicks() {
  return useSyncExternalStore(
    clickStore.subscribe,
    clickStore.getSnapshot,
    clickStore.getSnapshot,
  );
}

/* ════════════════════════════════════════════════════════════
   PER-PAGE INTERACTION HOOK
   Cursor position, click pulse decay, ripple effects.
════════════════════════════════════════════════════════════ */

type Mouse = { x: number; y: number; active: boolean };
type Ripple = { id: number; x: number; y: number };

function useHospitalInteraction() {
  const [mouse, setMouse] = useState<Mouse>({ x: 0.5, y: 0.5, active: false });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const rafRef = useRef<number | null>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMouse({ x, y, active: true });
      });
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    setMouse((m) => ({ ...m, active: false }));
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);

    // Increment global click counter — drives accumulated blur and reveal
    clickStore.register();
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    mouse,
    ripples,
    handlePointerMove,
    handlePointerLeave,
    handleClick,
    removeRipple,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════════════ */
interface PageProps {
  side?: "left" | "right";
}

const HospitalPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "right" }, ref) => {
    if (side === "left") return <HospitalPageLeft forwardedRef={ref} />;
    return <HospitalPageRight forwardedRef={ref} />;
  },
);
HospitalPage.displayName = "HospitalPage";
export default HospitalPage;

/* ════════════════════════════════════════════════════════════
   SHARED LAYERS
════════════════════════════════════════════════════════════ */

function HospitalBackdrop({ side }: { side: "left" | "right" }) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/hospital_bg.webp)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "200% 100%",
          backgroundPosition: side === "left" ? "left center" : "right center",
          filter: "brightness(0.55) saturate(0.7) blur(1.4px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(8,12,22,0.55) 0%, rgba(14,22,38,0.40) 50%, rgba(6,10,18,0.70) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 38%, rgba(2,4,10,0.78) 100%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.55, 0.78, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(140,180,220,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/**
 * LetterFlow — a swarm of individual letters & short tokens (built
 * from the bureaucratic phrases) drifts across the spread, warped by
 * a softer turbulence filter so they wiggle as if they're being
 * carried along inside the smoke.
 *
 * Visible only when blur level reaches LETTER_FLOW_START; intensity
 * grows linearly to 1 at MAX_BLUR_LEVEL.
 */
function LetterFlow({
  side,
  particles,
  intensity,
}: {
  side: "left" | "right";
  particles: Particle[];
  intensity: number;
}) {
  const filterId = `hospital-letter-warp-${side}`;
  if (intensity <= 0) {
    // Skip rendering entirely when off — saves the SVG filter cost
    return null;
  }
  return (
    <>
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: "absolute", overflow: "hidden" }}
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.020"
              numOctaves="2"
              seed={side === "left" ? 23 : 29}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="22s"
                values="0.016;0.026;0.016"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="9"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,
          opacity: intensity,
          transition: "opacity 1.6s ease",
          filter: `url(#${filterId})`,
        }}
      >
        {particles.map((p, i) => {
          const PAGE_W = 480;
          const PAGE_H = 660;
          const startX = -60;
          const endX = PAGE_W + 60;
          const baseY = (p.yPct / 100) * PAGE_H;
          const midX = (startX + endX) / 2;
          const midY = baseY - p.bob;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                ["--start-x" as string]: `${startX}px`,
                ["--mid-x" as string]: `${midX}px`,
                ["--end-x" as string]: `${endX}px`,
                ["--start-y" as string]: `${baseY}px`,
                ["--mid-y" as string]: `${midY}px`,
                ["--end-y" as string]: `${baseY + p.bob * 0.4}px`,
                ["--peak-op" as string]: `${p.opacity}`,
                animation: `hospitalLetterDrift ${p.duration}s linear infinite`,
                animationDelay: `${-p.delay}s`,
                willChange: "transform, opacity",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `rotate(${p.rotate}deg)`,
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: `${p.size}rem`,
                  color: "rgba(225, 238, 252, 0.95)",
                  textShadow:
                    "0 0 10px rgba(180, 210, 240, 0.7), 0 0 26px rgba(150, 185, 225, 0.45)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.04em",
                  filter: "blur(0.45px)",
                }}
              >
                {p.char}
              </span>
            </span>
          );
        })}
      </div>
    </>
  );
}

/**
 * DarknessOverlay — a dim navy wash whose opacity grows as the user
 * accumulates clicks. Reads as the room slowly closing in.
 */
function DarknessOverlay({ darkness }: { darkness: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        background:
          "radial-gradient(ellipse 110% 90% at 50% 65%, rgba(2,6,14,0.0) 0%, rgba(2,4,12,0.85) 95%)",
        opacity: darkness * 0.78,
        transition: "opacity 1.2s ease",
        mixBlendMode: "multiply",
      }}
    />
  );
}

function CursorSpotlight({ mouse }: { mouse: Mouse }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: mouse.active ? 1 : 0,
        transition: "opacity 0.6s ease",
        background: `radial-gradient(circle 200px at ${mouse.x * 100}% ${
          mouse.y * 100
        }%, rgba(210, 224, 245, 0.10), rgba(180, 200, 230, 0.04) 40%, transparent 70%)`,
        mixBlendMode: "screen",
      }}
    />
  );
}

function ClickRipples({
  ripples,
  onDone,
}: {
  ripples: Ripple[];
  onDone: (id: number) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            initial={{ scale: 0.1, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: RIPPLE_DURATION, ease: "easeOut" }}
            onAnimationComplete={() => onDone(r.id)}
            style={{
              position: "absolute",
              left: `${r.x * 100}%`,
              top: `${r.y * 100}%`,
              width: 120,
              height: 120,
              marginLeft: -60,
              marginTop: -60,
              borderRadius: "50%",
              border: "1px solid rgba(220, 232, 250, 0.55)",
              boxShadow:
                "0 0 24px rgba(220, 232, 250, 0.18), inset 0 0 18px rgba(220, 232, 250, 0.18)",
              mixBlendMode: "screen",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * One floating English fragment.
 *
 *  • Initial state — `accumulatedBlur` ≈ BASE_BLUR_SCALE → mostly readable.
 *  • Each click — `accumulatedBlur` grows by BLUR_STEP_PER_CLICK (capped).
 *  • Cursor-proximity — adds a small extra MOUSE_BLUR_GAIN on top.
 */
function FloatingFragment({
  frag,
  mouse,
  accumulatedBlur,
}: {
  frag: Frag;
  mouse: Mouse;
  accumulatedBlur: number;
}) {
  const fx = frag.xPct / 100;
  const fy = frag.yPct / 100;
  const dx = mouse.active ? fx - mouse.x : 999;
  const dy = mouse.active ? fy - mouse.y : 999;
  const d = Math.sqrt(dx * dx + dy * dy);
  const proximity = mouse.active ? Math.max(0, 1 - d / FOCUS_RADIUS) : 0;
  const proximityEased = proximity * proximity;

  const mouseFactor = 1 + proximityEased * MOUSE_BLUR_GAIN;
  const dynamicBlur = frag.blur * accumulatedBlur * mouseFactor;

  return (
    <div
      style={{
        position: "absolute",
        left: `${frag.xPct}%`,
        top: `${frag.yPct}%`,
        maxWidth: frag.maxWidth ?? 240,
        transform: `rotate(${frag.rotate ?? 0}deg)`,
        filter: `blur(${dynamicBlur}px)`,
        transition: "filter 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          ["--frag-drift" as string]: `${frag.drift}px`,
          animation: `hospitalBreathe ${frag.duration}s ease-in-out infinite`,
          animationDelay: `${-frag.delay}s`,
          willChange: "transform, opacity",

          whiteSpace: "pre-line",
          fontFamily: "var(--font-serif)",
          fontWeight: frag.weight ?? 300,
          fontStyle: frag.italic ? "italic" : "normal",
          fontSize: `${frag.size}rem`,
          lineHeight: 1.45,
          letterSpacing: frag.letterSpacing ?? "0.01em",
          color: frag.color ?? C.textMid,
          textAlign: frag.align ?? "left",
          textTransform: frag.uppercase ? "uppercase" : "none",
          textShadow: "0 0 18px rgba(0,0,0,0.6)",
          opacity: frag.opacity,
        }}
      >
        {frag.text}
      </div>
    </div>
  );
}

function InteractionLayer(props: ReturnType<typeof useHospitalInteraction>) {
  const {
    handlePointerMove,
    handlePointerLeave,
    handleClick,
    mouse,
    ripples,
    removeRipple,
  } = props;
  return (
    <>
      <div
        data-book-interactive
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          // Reserve PageShell's footer flip strip
          bottom: "3rem",
        }}
      />
      <CursorSpotlight mouse={mouse} />
      <ClickRipples ripples={ripples} onDone={removeRipple} />
    </>
  );
}

/**
 * useHospitalState — derives visual state from the global click total:
 *   • blurLevel           — clicks clamped to MAX_BLUR_LEVEL (0..MAX)
 *   • accumulatedBlur     — multiplier to apply to each fragment's base blur
 *   • darkness            — 0..1 — how dark to tint the page (rises with blurLevel)
 *   • letterFlowIntensity — 0..1 — how visible the drifting letters are
 *                           (stays 0 until blurLevel passes LETTER_FLOW_START)
 */
function useHospitalState() {
  const { total } = useHospitalClicks();
  const blurLevel = Math.min(total, MAX_BLUR_LEVEL);
  const accumulatedBlur =
    BASE_BLUR_SCALE * (1 + blurLevel * BLUR_STEP_PER_CLICK);
  const darkness = blurLevel / MAX_BLUR_LEVEL;
  const denom = Math.max(1, MAX_BLUR_LEVEL - LETTER_FLOW_START);
  const letterFlowIntensity = Math.max(
    0,
    Math.min(1, (blurLevel - LETTER_FLOW_START) / denom),
  );
  return { blurLevel, accumulatedBlur, darkness, letterFlowIntensity };
}

/* ════════════════════════════════════════════════════════════
   LEFT PAGE
════════════════════════════════════════════════════════════ */
function HospitalPageLeft({
  forwardedRef,
}: {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  const interaction = useHospitalInteraction();
  const { mouse } = interaction;
  const { accumulatedBlur, darkness, letterFlowIntensity } = useHospitalState();

  const parallaxX = (mouse.x - 0.5) * -PARALLAX_X;
  const parallaxY = (mouse.y - 0.5) * -PARALLAX_Y;

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={5}
      style={{ background: "#070a12" }}
    >
      <HospitalBackdrop side="left" />
      <DarknessOverlay darkness={darkness} />

      <InteractionLayer {...interaction} />

      <InteractionHint
        emphasis
        style={{
          bottom: "3.55rem",
          left: "2.4rem",
          zIndex: 6,
          color: "rgba(205, 218, 238, 0.93)",
        }}
      >
        Click anywhere
      </InteractionHint>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
          transition: mouse.active
            ? "transform 0.35s ease"
            : "transform 0.9s ease",
        }}
      >
        {FRAGS_L.map((f, i) => (
          <FloatingFragment
            key={i}
            frag={f}
            mouse={mouse}
            accumulatedBlur={accumulatedBlur}
          />
        ))}
      </div>

      <LetterFlow
        side="left"
        particles={PARTICLES_L}
        intensity={letterFlowIntensity}
      />

      {/* Title block */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "8%",
          right: "8%",
          transform: "translateY(-50%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.4, ease: "easeOut", delay: 0.4 }}
          className="page-title-spread"
          style={{
            color: "rgba(225, 232, 245, 0.92)",
            textShadow: "0 0 24px rgba(0,0,0,0.6)",
            letterSpacing: "0.01em",
          }}
        >
          {TITLE}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 1.2 }}
          style={{
            width: "2.5rem",
            height: 1,
            background: "rgba(200, 215, 235, 0.5)",
            marginTop: "1.4rem",
            transformOrigin: "left center",
          }}
        />

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.5, 0] }}
          transition={{
            duration: 9,
            times: [0, 0.25, 0.75, 1],
            delay: 3.6,
            ease: "easeInOut",
          }}
          style={{
            display: "block",
            marginTop: "2.2rem",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            color: "rgba(200, 215, 235, 0.55)",
            textTransform: "uppercase",
          }}
        >
          move · click · everything blurs
        </motion.span>
      </div>

      <FragmentBreatheKeyframes />
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT PAGE
════════════════════════════════════════════════════════════ */
function HospitalPageRight({
  forwardedRef,
}: {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  const interaction = useHospitalInteraction();
  const { mouse } = interaction;
  const { accumulatedBlur, darkness, letterFlowIntensity } = useHospitalState();

  const parallaxX = (mouse.x - 0.5) * -PARALLAX_X;
  const parallaxY = (mouse.y - 0.5) * -PARALLAX_Y;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={6}
      style={{ background: "#070a12" }}
    >
      <HospitalBackdrop side="right" />
      <DarknessOverlay darkness={darkness} />

      <InteractionLayer {...interaction} />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
          transition: mouse.active
            ? "transform 0.35s ease"
            : "transform 0.9s ease",
        }}
      >
        {FRAGS_R.map((f, i) => (
          <FloatingFragment
            key={i}
            frag={f}
            mouse={mouse}
            accumulatedBlur={accumulatedBlur}
          />
        ))}
      </div>

      <LetterFlow
        side="right"
        particles={PARTICLES_R}
        intensity={letterFlowIntensity}
      />

      <div
        style={{
          position: "absolute",
          bottom: "3.5rem",
          right: "2.5rem",
          textAlign: "right",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.4, ease: "easeOut", delay: 1.8 }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "0.82rem",
            lineHeight: 2.0,
            letterSpacing: "0.03em",
            color: C.closing,
            margin: 0,
            whiteSpace: "pre-line",
            textShadow: "0 0 18px rgba(0,0,0,0.7)",
          }}
        >
          {NARRATIVE}
        </motion.p>
      </div>

      <FragmentBreatheKeyframes />
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   CSS KEYFRAMES — slow drift + opacity breath, runs in CSS only.
════════════════════════════════════════════════════════════ */
function FragmentBreatheKeyframes() {
  return (
    <style jsx global>{`
      @keyframes hospitalBreathe {
        0% {
          transform: translateY(0);
          opacity: 0.55;
        }
        50% {
          transform: translateY(calc(-1 * var(--frag-drift, 5px)));
          opacity: 1;
        }
        100% {
          transform: translateY(0);
          opacity: 0.55;
        }
      }

      @keyframes hospitalLetterDrift {
        0% {
          transform: translate(var(--start-x), var(--start-y));
          opacity: 0;
        }
        12% {
          opacity: var(--peak-op, 0.7);
        }
        50% {
          transform: translate(var(--mid-x), var(--mid-y));
        }
        88% {
          opacity: var(--peak-op, 0.7);
        }
        100% {
          transform: translate(var(--end-x), var(--end-y));
          opacity: 0;
        }
      }
    `}</style>
  );
}
