"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   PAGE 4 — ADJUST THE ROOM (the human version)
   ────────────────────────────────────────────────────────────
   The book's coda — quieter than the previous spreads. On the
   left, three small adjustment traces sit lightly in the dark:
     · tune  — find a familiar voice
     · heat  — bring the body back
     · play  — let the rhythm stay
   "minimize" and "set" hover behind them as faint residuals of
   what the book has already done; they do not act as modules.

   On the right, the room reassembles softly: a few Korean
   words, a warm oval light, a faint waveform, a small table
   glow. As each switch is found, the line in the middle brightens
   from a whisper to "enough to stay."

   The room was still the room. Only now we could stay in it.
================================================================ */

const TITLE = "Adjust the Room";
const KO_SUB = "방을 다시 맞추기";
const HINT = "Find each small adjustment";
const FINAL_1 = "The room was still the room.";
const FINAL_2 = "Only now, I could stay in it again.";
const STATE_TEXT = "enough to stay";

type ControlId = "tune" | "heat" | "play";

interface Control {
  id: ControlId;
  label: string;
  hint: string;
  ko: string;
}

const CONTROLS: Control[] = [
  { id: "tune", label: "tune", hint: "find a familiar voice",   ko: "주파수" },
  { id: "heat", label: "heat", hint: "bring the body back",     ko: "온도"   },
  { id: "play", label: "play", hint: "let the rhythm stay",     ko: "재생"   },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE — set of activated controls
================================================================ */
const _on = new Set<ControlId>();
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _on.clear();
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _activate(id: ControlId) {
  if (_on.has(id)) return;
  _on.add(id);
  _notify();
}
function useConsole() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return {
    isOn: (id: ControlId) => _on.has(id),
    count: _on.size,
    allOn: _on.size >= CONTROLS.length,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const HolidayRoomPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <ConsoleLeft forwardedRef={ref} />;
    return <ConsoleRight forwardedRef={ref} />;
  }
);
HolidayRoomPage.displayName = "HolidayRoomPage";
export default HolidayRoomPage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + 3 small adjustments + faint minimize/set
================================================================ */
function ConsoleLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { isOn, count } = useConsole();

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={7}
      style={{ background: "#08071a" }}
    >
      <RoomBackdrop side="left" count={count} />
      <FaintEcho />

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
            fontWeight: 300,
            fontSize: "0.66rem",
            letterSpacing: "0.32em",
            color: "rgba(180,190,225,0.55)",
            marginBottom: "0.7rem",
          }}
        >
          {KO_SUB}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.0, delay: 0.5, ease: "easeOut" }}
          className="page-title-spread"
          style={{
            color: "rgba(225,228,242,0.92)",
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
            background: "rgba(170,190,230,0.5)",
            marginTop: "1rem",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* The 3 small adjustments */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "9%",
          right: "9%",
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {CONTROLS.map(c => (
          <Adjustment
            key={c.id}
            control={c}
            isOn={isOn(c.id)}
            onActivate={() => _activate(c.id)}
          />
        ))}
      </div>

      {/* Faint minimize / set residuals */}
      <Residuals />

      {count < 1 && (
        <InteractionHint
          emphasis
          style={{
            bottom: "1.6rem",
            left: "2.5rem",
            zIndex: 11,
            color: "rgba(220,210,235,0.78)",
          }}
        >
          {HINT}
        </InteractionHint>
      )}
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT — soft composition of room elements + emerging line
================================================================ */
function ConsoleRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { isOn, count, allOn } = useConsole();
  const t = count / CONTROLS.length;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={8}
      style={{ background: "#08071a" }}
    >
      <RoomBackdrop side="right" count={count} />

      {/* Room composition layers */}
      <KoreanWordsAmbient on={isOn("tune")} />
      <WarmOval on={isOn("heat")} />
      <Waveform on={isOn("play")} />
      <TableGlow allOn={allOn} t={t} />

      {/* Slowly-illuminated "enough to stay" — gradient based on count */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "10%",
          right: "10%",
          textAlign: "center",
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{
            opacity: 0.18 + t * 0.78,
            filter: `blur(${(1 - t) * 4}px)`,
            letterSpacing: `${0.18 + t * 0.06}em`,
          }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.96rem",
            color: "rgba(255,225,185,0.96)",
            textShadow: allOn
              ? "0 0 18px rgba(255,180,100,0.55), 0 0 4px rgba(0,0,0,0.85)"
              : "0 0 14px rgba(255,180,100,0.22)",
          }}
        >
          {STATE_TEXT}
        </motion.div>
      </div>

      {/* Final narrative — emerges when all three are on */}
      <AnimatePresence>
        {allOn && (
          <motion.div
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, delay: 1.4 }}
            style={{
              position: "absolute",
              bottom: "5rem",
              right: "2.5rem",
              left: "2.5rem",
              textAlign: "right",
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
                fontSize: "0.86rem",
                lineHeight: 1.7,
                color: "rgba(220,200,170,0.85)",
                textShadow: "0 0 14px rgba(0,0,0,0.85)",
              }}
            >
              {FINAL_1}
            </p>
            <p
              style={{
                margin: "0.4rem 0 0",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "1.0rem",
                lineHeight: 1.6,
                color: "rgba(255,225,185,0.96)",
                textShadow:
                  "0 0 18px rgba(255,180,100,0.45), 0 0 4px rgba(0,0,0,0.85)",
                letterSpacing: "0.01em",
              }}
            >
              {FINAL_2}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOM BACKDROP — cool charcoal, warming as count grows
================================================================ */
function RoomBackdrop({ side, count }: { side: "left" | "right"; count: number }) {
  const t = count / CONTROLS.length;
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at ${
            side === "left" ? "30%" : "55%"
          } 60%, rgba(${50 + t * 100},${30 + t * 60},${20 + t * 30},${0.16 + t * 0.30}) 0%, transparent 70%)`,
          transition: "background 1.0s ease",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #06061a 0%, #08081e 60%, #0a081e 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 95% 95% at 50% 50%, transparent 50%, rgba(2,3,12,0.55) 100%)",
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
   FAINT ECHO — drifting "minimize" / "set" / "tune" words in
   the dark behind the controls. Sets the mood.
================================================================ */
function FaintEcho() {
  const echoes = [
    { text: "minimize", x: 14, y: 26, dur: 24 },
    { text: "set",      x: 78, y: 32, dur: 28 },
    { text: "tune",     x: 22, y: 80, dur: 30 },
  ];
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
    >
      {echoes.map((e, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{
            duration: e.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
          style={{
            position: "absolute",
            left: `${e.x}%`,
            top: `${e.y}%`,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.6rem",
            letterSpacing: "0.32em",
            color: "rgba(220,235,255,0.5)",
            textTransform: "uppercase",
          }}
        >
          {e.text}
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ADJUSTMENT — small interactive trace + label/hint
================================================================ */
function Adjustment({
  control,
  isOn,
  onActivate,
}: {
  control: Control;
  isOn: boolean;
  onActivate: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      data-book-interactive
      disabled={isOn}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      style={{
        width: "100%",
        padding: "10px 6px",
        background: "transparent",
        border: 0,
        borderLeft: isOn
          ? "1px solid rgba(255,180,100,0.55)"
          : hover
            ? "1px solid rgba(220,235,255,0.30)"
            : "1px solid rgba(220,235,255,0.10)",
        cursor: isOn ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 22,
        textAlign: "left",
        transition: "border-color 0.5s ease",
      }}
    >
      <div style={{ width: 80, flexShrink: 0 }}>
        {control.id === "tune" && <TuneTrace isOn={isOn} />}
        {control.id === "heat" && <HeatTrace isOn={isOn} />}
        {control.id === "play" && <PlayTrace isOn={isOn} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "0.9rem",
            letterSpacing: "0.04em",
            color: isOn
              ? "rgba(255,225,200,0.94)"
              : "rgba(220,230,250,0.78)",
            transition: "color 0.5s ease",
          }}
        >
          {control.label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.66rem",
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            color: isOn
              ? "rgba(220,200,170,0.78)"
              : "rgba(180,195,225,0.5)",
            marginTop: 3,
            transition: "color 0.5s ease",
          }}
        >
          {control.hint}
        </div>
      </div>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   TRACES — small, restrained glyphs (smaller than earlier glyphs)
================================================================ */

function TuneTrace({ isOn }: { isOn: boolean }) {
  return (
    <div style={{ position: "relative", width: 80, height: 14 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1,
          transform: "translateY(-50%)",
          background: isOn
            ? "linear-gradient(to right, rgba(180,195,225,0.32) 0%, rgba(255,180,100,0.7) 55%, rgba(180,195,225,0.32) 100%)"
            : "rgba(180,195,225,0.28)",
          transition: "background 0.55s ease",
        }}
      />
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p * 100}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 1,
            height: 4,
            background: "rgba(180,195,225,0.42)",
          }}
        />
      ))}
      <motion.div
        animate={{ left: isOn ? "55%" : "12%" }}
        transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: isOn
            ? "radial-gradient(circle at 35% 30%, rgba(255,225,180,0.96) 0%, rgba(255,150,80,0.95) 70%)"
            : "radial-gradient(circle at 35% 30%, rgba(220,230,250,0.7) 0%, rgba(140,160,200,0.7) 70%)",
          boxShadow: isOn
            ? "0 0 8px rgba(255,180,100,0.7)"
            : "0 0 4px rgba(180,200,230,0.35)",
        }}
      />
    </div>
  );
}

function HeatTrace({ isOn }: { isOn: boolean }) {
  const C = 2 * Math.PI * 9;
  return (
    <div style={{ position: "relative", width: 80, height: 22 }}>
      <div style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)" }}>
        <svg width="22" height="22" viewBox="0 0 22 22">
          <circle
            cx="11"
            cy="11"
            r="9"
            fill="none"
            stroke="rgba(200,210,235,0.20)"
            strokeWidth="1.2"
          />
          <motion.circle
            cx="11"
            cy="11"
            r="9"
            fill="none"
            stroke={isOn ? "rgba(255,140,80,0.92)" : "rgba(180,195,225,0.32)"}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray={C}
            animate={{ strokeDashoffset: isOn ? 0 : C }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            transform="rotate(-90 11 11)"
            style={{
              filter: isOn
                ? "drop-shadow(0 0 4px rgba(255,140,80,0.6))"
                : "none",
            }}
          />
        </svg>
        <motion.div
          animate={{
            opacity: isOn ? 1 : 0.32,
            scale: isOn ? 1 : 0.7,
          }}
          transition={{ duration: 0.6, delay: isOn ? 0.4 : 0 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 4.5,
            height: 6,
            borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
            background: isOn
              ? "radial-gradient(ellipse at 50% 70%, rgba(255,235,180,0.95) 0%, rgba(255,160,70,0.95) 60%, rgba(180,60,30,0.85) 100%)"
              : "rgba(180,195,225,0.32)",
            boxShadow: isOn ? "0 0 6px rgba(255,170,80,0.7)" : "none",
          }}
        />
      </div>
    </div>
  );
}

function PlayTrace({ isOn }: { isOn: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: 80,
        height: 14,
        display: "flex",
        alignItems: "center",
        gap: 1.6,
      }}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          animate={
            isOn
              ? { height: [2, 4 + (i % 3) * 1.5, 2, 7 - (i % 4), 2] }
              : { height: 2 }
          }
          transition={
            isOn
              ? {
                  duration: 1.4 + (i % 3) * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }
              : { duration: 0.4 }
          }
          style={{
            width: 1.4,
            background: isOn
              ? "rgba(255,200,130,0.78)"
              : "rgba(180,195,225,0.35)",
            borderRadius: 0.5,
            transition: "background 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   RESIDUALS — faint "minimize · set" words at the bottom of
   the left page; they are residue from the rest of the book,
   not interactive modules.
================================================================ */
function Residuals() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "9%",
        left: "9%",
        right: "9%",
        zIndex: 5,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <motion.span
        animate={{ opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.55rem",
          letterSpacing: "0.32em",
          color: "rgba(220,230,250,0.7)",
          textTransform: "uppercase",
        }}
      >
        minimize
      </motion.span>
      <span
        style={{
          width: 14,
          height: 1,
          background: "rgba(180,195,225,0.18)",
        }}
      />
      <motion.span
        animate={{ opacity: [0.34, 0.18, 0.34] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.55rem",
          letterSpacing: "0.32em",
          color: "rgba(220,230,250,0.7)",
          textTransform: "uppercase",
        }}
      >
        set
      </motion.span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   RIGHT-PAGE COMPOSITION
================================================================ */

function KoreanWordsAmbient({ on }: { on: boolean }) {
  const ghosts = [
    { text: "괜찮아",   x: 18, y: 22 },
    { text: "맞아",     x: 70, y: 18 },
    { text: "오늘은요", x: 32, y: 30 },
    { text: "여기",     x: 78, y: 32 },
  ];
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}
    >
      <AnimatePresence>
        {on && (
          <motion.div
            key="ghosts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.0 } }}
            style={{ position: "absolute", inset: 0 }}
          >
            {ghosts.map((g, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-6, -28],
                  opacity: [0, 0.55, 0],
                }}
                transition={{
                  duration: 7 + i * 1.1,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 1.6,
                }}
                style={{
                  position: "absolute",
                  left: `${g.x}%`,
                  top: `${g.y}%`,
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: "0.7rem",
                  color: "rgba(220,210,255,0.7)",
                  textShadow: "0 0 8px rgba(140,160,220,0.4)",
                  letterSpacing: "0.04em",
                }}
              >
                {g.text}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WarmOval({ on }: { on: boolean }) {
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key="warm-oval"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.42, 0.62, 0.46, 0.62, 0.5],
            scale: 1,
          }}
          exit={{ opacity: 0, transition: { duration: 1.0 } }}
          transition={{
            opacity: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 1.4, ease: "easeOut" },
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,170,90,0.32) 0%, rgba(255,140,70,0.14) 40%, transparent 70%)",
            filter: "blur(2px)",
            mixBlendMode: "screen",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}
    </AnimatePresence>
  );
}

function Waveform({ on }: { on: boolean }) {
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key="waveform"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          transition={{ duration: 0.9 }}
          style={{
            position: "absolute",
            top: "62%",
            left: "16%",
            right: "16%",
            height: 12,
            display: "flex",
            alignItems: "center",
            gap: 1.6,
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [2, 3 + (i % 4) * 1.2, 2, 6 - (i % 5), 2],
              }}
              transition={{
                duration: 1.6 + (i % 4) * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.04,
              }}
              style={{
                width: 1.4,
                background:
                  i % 2 === 0
                    ? "rgba(220,210,255,0.5)"
                    : "rgba(255,200,150,0.4)",
                borderRadius: 0.5,
                flex: "0 0 auto",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TableGlow({ allOn, t }: { allOn: boolean; t: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "22%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 220,
        height: 56,
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      {/* Always faintly present, brightens with state */}
      <motion.div
        animate={{
          opacity: 0.18 + t * 0.5,
          scale: 0.92 + t * 0.12,
        }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `1px solid rgba(255,180,100,${0.18 + t * 0.32})`,
          background: `radial-gradient(ellipse, rgba(255,180,100,${0.06 + t * 0.18}) 0%, transparent 70%)`,
          boxShadow: `0 0 ${10 + t * 24}px rgba(255,180,100,${0.10 + t * 0.32})`,
        }}
      />
      {/* Place dots — only when all on */}
      <AnimatePresence>
        {allOn &&
          [
            { x: 14, y: 50 },
            { x: 50, y: 18 },
            { x: 86, y: 50 },
            { x: 50, y: 82 },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.92, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.18 }}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
                width: 3.5,
                height: 3.5,
                borderRadius: "50%",
                background: "rgba(255,210,140,0.95)",
                boxShadow: "0 0 5px rgba(255,180,100,0.7)",
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}
