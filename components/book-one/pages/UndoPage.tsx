"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import PageShell from "./PageShell";
import { InteractionHint } from "./InteractionHint";

// ════════════════════════════════════════════════════════════
//  MODULE-LEVEL SHARED STATE
// ════════════════════════════════════════════════════════════
let _count = 0;
const _subs = new Set<() => void>();
const _notify = () => _subs.forEach(fn => fn());
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _count = 0;
    _notify();
  });
}

function _useCount(): number {
  const [c, setC] = useState(_count);
  useEffect(() => {
    const sync = () => setC(_count);
    _subs.add(sync);
    return () => { _subs.delete(sync); };
  }, []);
  return c;
}

// ════════════════════════════════════════════════════════════
//  COPY
// ════════════════════════════════════════════════════════════
const LINE_A     = "Some things can be undone.";
const LINE_B     = "Most things cannot.";
const MAX_CLICKS = 8;   // caps here, never resets

// ════════════════════════════════════════════════════════════
//  GEOMETRY
// ════════════════════════════════════════════════════════════
const PAGE_W    = 480;
const SPREAD_W  = PAGE_W * 2;
const KB_PAD    = 20;
const KEY_H     = 46;
const KEY_GAP   = 4;
const ROW_GAP   = 4;

// ════════════════════════════════════════════════════════════
//  INSTABILITY SCALARS
// ════════════════════════════════════════════════════════════
const BLUR_MAX   = 2.4;
const JITTER_MAX = 7;
const DISP_MAX   = 14;

// ════════════════════════════════════════════════════════════
//  COLOURS
// ════════════════════════════════════════════════════════════
const C = {
  bg:      "#111419",
  key:     "#e8eaee",
  keyMod:  "#d5d8e0",
  keyFn:   "#c2c5ce",
  kTxt:    "#1a1c24",
  kTxtMod: "#2c2f40",
  kTxtFn:  "#5c6070",
  gold:    "#d4a820",
  goldTxt: "#9e7010",
  text:    "#9eb0c6",
  poem:    "#c8d4e0",
};

// ════════════════════════════════════════════════════════════
//  THREE WORD POOLS
//  Phase 1 (t < 0.35)  — tech: familiar, detached
//  Phase 2 (0.35–0.70) — life: the reader realises this is not code
//  Phase 3 (t ≥ 0.70)  — body/time: heavy, few, final
// ════════════════════════════════════════════════════════════
const TECH_WORDS = [
  "error", "undefined", "NaN", "0xDEAD", "new Error()",
  "null", "void", "false", "???", "abort",
];
const LIFE_WORDS = [
  "deadline", "review pending", "delayed",
  "no response", "missed call", "bill due",
  "pain", "waiting", "cannot reschedule", "ignored",
  "overdue", "no reply",
];
const BODY_WORDS = [
  "injury", "scar", "time", "body",
  "silence", "no undo", "gone", "lost",
];

function wordForPhase(t: number, seed: number): string {
  const pool = t >= 0.70 ? BODY_WORDS
             : t >= 0.35 ? LIFE_WORDS
             : TECH_WORDS;
  return pool[Math.abs(Math.floor(seed * 137)) % pool.length];
}

// ════════════════════════════════════════════════════════════
//  KEYBOARD LAYOUT
// ════════════════════════════════════════════════════════════
interface KeyDef {
  label: string;
  flex: number;
  mod?: boolean;
  fn?: boolean;
  space?: boolean;
  undo?: boolean;
}

const ROWS: KeyDef[][] = [
  [
    { label:"esc",  flex:1.5, mod:true  },
    { label:"F1",   flex:1,   fn:true   },
    { label:"F2",   flex:1,   fn:true   },
    { label:"F3",   flex:1,   fn:true   },
    { label:"F4",   flex:1,   fn:true   },
    { label:"F5",   flex:1,   fn:true   },
    { label:"F6",   flex:1,   fn:true   },
    { label:"F7",   flex:1,   fn:true   },
    { label:"F8",   flex:1,   fn:true   },
    { label:"F9",   flex:1,   fn:true   },
    { label:"F10",  flex:1,   fn:true   },
    { label:"F11",  flex:1,   fn:true   },
    { label:"F12",  flex:1.5, fn:true   },
  ],
  [
    { label:"~",flex:1 },{ label:"1",flex:1 },{ label:"2",flex:1 },
    { label:"3",flex:1 },{ label:"4",flex:1 },{ label:"5",flex:1 },
    { label:"6",flex:1 },{ label:"7",flex:1 },{ label:"8",flex:1 },
    { label:"9",flex:1 },{ label:"0",flex:1 },{ label:"−",flex:1 },
    { label:"=",flex:1 },{ label:"⌫",flex:2, mod:true },
  ],
  [
    { label:"⇥",  flex:1.5, mod:true },
    { label:"Q",flex:1 },{ label:"W",flex:1 },{ label:"E",flex:1 },
    { label:"R",flex:1 },{ label:"T",flex:1 },{ label:"Y",flex:1 },
    { label:"U",flex:1 },{ label:"I",flex:1 },{ label:"O",flex:1 },
    { label:"P",flex:1 },{ label:"[",flex:1 },{ label:"]",flex:1 },
    { label:"\\",flex:1.5 },
  ],
  [
    { label:"⇪",  flex:1.75, mod:true },
    { label:"A",flex:1 },{ label:"S",flex:1 },{ label:"D",flex:1 },
    { label:"F",flex:1 },{ label:"G",flex:1 },{ label:"H",flex:1 },
    { label:"J",flex:1 },{ label:"K",flex:1 },{ label:"L",flex:1 },
    { label:";",flex:1 },{ label:"'",flex:1 },
    { label:"↵",  flex:2.25, mod:true },
  ],
  [
    { label:"⇧",  flex:2.25, mod:true },
    { label:"Z",flex:1 },{ label:"X",flex:1 },{ label:"C",flex:1 },
    { label:"V",flex:1 },{ label:"B",flex:1 },{ label:"N",flex:1 },
    { label:"M",flex:1 },{ label:",",flex:1 },{ label:".",flex:1 },
    { label:"/",flex:1 },
    { label:"⇧",  flex:2.75, mod:true },
  ],
  [
    { label:"ctrl",flex:1,   mod:true },
    { label:"fn",  flex:1,   fn:true  },
    { label:"undo", flex:1.5, undo:true },
    { label:"alt", flex:1.5, mod:true },
    { label:"",    flex:6,   space:true },
    { label:"alt", flex:1.5, mod:true },
    { label:"⌘",  flex:1.5, mod:true },
    { label:"ctrl",flex:1,   mod:true },
  ],
];

// ════════════════════════════════════════════════════════════
//  FLOATING FRAGMENTS — three phases, different colours/speeds
// ════════════════════════════════════════════════════════════
type Frag = {
  text: string; x: number; y: number;
  speed: number; delay: number; color: string; phase: number;
};

const FRAGS: Frag[] = [
  // Phase 1: tech (visible from 1st click)
  { text:"error",         x: 8,  y:18, speed:26, delay: 0.0, color:"#ff5544", phase:1 },
  { text:"undefined",     x:76,  y:28, speed:31, delay: 3.5, color:"#44ee22", phase:1 },
  { text:"NaN",           x:46,  y:12, speed:20, delay: 8.0, color:"#ff9922", phase:1 },
  { text:"new Error()",   x:90,  y:10, speed:22, delay:16.0, color:"#ff5544", phase:1 },
  { text:"0xDEAD",        x:14,  y:55, speed:27, delay: 1.5, color:"#00e0e0", phase:1 },
  { text:"null",          x:32,  y:78, speed:35, delay: 2.0, color:"#44ee22", phase:1 },
  { text:"undefined",     x:58,  y:62, speed:18, delay: 9.5, color:"#4499ff", phase:1 },
  { text:"ctrl+z",        x: 6,  y:40, speed:24, delay: 0.0, color:"#00e0e0", phase:1 },
  { text:"abort",         x:68,  y:85, speed:23, delay: 5.0, color:"#ff5544", phase:1 },
  { text:"NaN",           x:38,  y:50, speed:30, delay:12.0, color:"#cc44ff", phase:1 },
  // Phase 2: life (visible from ~3rd click)
  { text:"deadline",       x:55, y:22, speed:28, delay: 4.0, color:"#e8a040", phase:2 },
  { text:"no response",    x:18, y:76, speed:36, delay: 2.5, color:"#c88030", phase:2 },
  { text:"missed call",    x:72, y:36, speed:26, delay: 7.0, color:"#d09040", phase:2 },
  { text:"bill due",       x:28, y:88, speed:32, delay: 6.5, color:"#c07028", phase:2 },
  { text:"delayed",        x:84, y:58, speed:25, delay:10.0, color:"#e8a040", phase:2 },
  { text:"pain",           x:44, y:70, speed:38, delay: 8.5, color:"#d06030", phase:2 },
  { text:"waiting...",     x: 3, y:35, speed:34, delay:14.0, color:"#b86028", phase:2 },
  { text:"cannot reschedule", x:60, y:48, speed:29, delay:11.0, color:"#c07030", phase:2 },
  { text:"review pending", x:20, y:20, speed:33, delay: 1.0, color:"#d09040", phase:2 },
  { text:"ignored",        x:88, y:80, speed:27, delay: 3.0, color:"#c06028", phase:2 },
  // Phase 3: body (visible from ~6th click)
  { text:"injury",  x:35, y:30, speed:55, delay:0.0, color:"rgba(200,190,175,0.7)",  phase:3 },
  { text:"scar",    x:70, y:65, speed:62, delay:4.0, color:"rgba(190,180,165,0.6)",  phase:3 },
  { text:"time",    x:12, y:60, speed:70, delay:2.0, color:"rgba(205,195,180,0.65)", phase:3 },
  { text:"body",    x:80, y:25, speed:58, delay:6.0, color:"rgba(185,175,160,0.55)", phase:3 },
  { text:"silence", x:50, y:80, speed:80, delay:1.0, color:"rgba(200,190,175,0.5)",  phase:3 },
  { text:"no undo", x:25, y:45, speed:90, delay:8.0, color:"rgba(195,185,170,0.6)",  phase:3 },
];

// ════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ════════════════════════════════════════════════════════════
interface PageProps { side?: "left" | "right" }

const UndoPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "right" }, ref) => {
    const count  = _useCount();
    const jitter = useAnimation();
    const t      = count / MAX_CLICKS;
    const maxed  = count >= MAX_CLICKS;

    const handleUndo = () => {
      if (maxed) return;
      const next = _count + 1;
      const j = (next / MAX_CLICKS) * JITTER_MAX;
      jitter.start({
        x: [0, -j, j*0.72, -j*0.36, j*0.14, 0],
        transition: { duration: 0.28, ease: "easeOut" },
      });
      _count = next;
      _notify();
    };

    return (
      <PageShell
        ref={ref}
        side={side}
        pageNumber={side === "left" ? 3 : 4}
        style={{ color: C.text }}
      >
        <div style={{ position:"absolute", inset:0, background:C.bg, zIndex:0 }} />

        <FloatingFragments t={t} density={side === "left" ? 0.5 : 1} />

        <motion.div
          animate={side === "left" ? jitter : undefined}
          style={{ position:"absolute", inset:0, zIndex:1 }}
        >
          {/* Poem + phase — left page, top-left */}
          {side === "left" && (
            <div style={{
              position:"absolute", top:"2rem", left:"2.5rem", right:"2.5rem", zIndex:3,
              filter:`blur(${t * BLUR_MAX * 0.4}px)`,
              transition:"filter 0.8s ease",
            }}>
              <div style={{ maxWidth:"32ch", pointerEvents:"none" }}>
                {[
                  "When I am used to undoing everything,",
                  "mistakes begin to feel temporary.",
                  "",
                  "But the body does not roll back.",
                  "Time does not reload.",
                  "Pain does not disappear on command.",
                ].map((line, i) => (
                  <p key={i} style={{
                    fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:300,
                    fontSize:"0.80rem", lineHeight: line === "" ? 0.8 : 1.95,
                    color: C.poem,
                    letterSpacing:"0.02em", margin:0,
                    textAlign:"left",
                  }}>{line}</p>
                ))}
              </div>
              <PhaseLabel t={t} />
            </div>
          )}

          {/* Bottom poem — right page */}
          {side === "right" && (
            <div style={{
              position:"absolute", bottom:"3.5rem", right:"2.5rem",
              textAlign:"right", zIndex:3,
              filter:`blur(${t * BLUR_MAX * 0.4}px)`,
              transition:"filter 0.8s ease",
            }}>
              {[LINE_A, LINE_B].map((line, i) => (
                <p key={i} style={{
                  fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:300,
                  fontSize:"0.78rem", lineHeight:2, color:C.poem, letterSpacing:"0.09em",
                  margin:0,
                }}>{line}</p>
              ))}
              {maxed && (
                <motion.p
                  initial={{ opacity:0, y:6, filter:"blur(4px)" }}
                  animate={{ opacity:1, y:0, filter:"blur(0px)" }}
                  transition={{ duration:1.6, ease:"easeOut", delay:0.3 }}
                  style={{
                    fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:300,
                    fontSize:"0.78rem", lineHeight:2, letterSpacing:"0.09em",
                    color:"rgba(200,120,90,0.85)", marginTop:"0.6rem",
                  }}
                >
                  There is no undo for this.
                </motion.p>
              )}
            </div>
          )}

          {/* Full-spread keyboard — opts out of book nav (gaps between keys) */}
          <div
            data-book-interactive
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: side === "left" ? 0 : -PAGE_W,
              width: SPREAD_W,
              padding: `0 ${KB_PAD}px`,
              filter: `blur(${t * BLUR_MAX * 0.7}px)`,
              transition: "filter 0.8s ease",
              zIndex: 2,
            }}
          >
            <KeyboardGrid t={t} maxed={maxed} onUndoClick={side === "left" ? handleUndo : undefined} />
          </div>

        {side === "left" && (
          <InteractionHint
            emphasis
            style={{
              bottom: "3.48rem",
              left: "2.4rem",
              zIndex: 6,
              color: "rgba(195, 215, 238, 0.95)",
            }}
          >
            Click the undo key
          </InteractionHint>
        )}
        </motion.div>
      </PageShell>
    );
  }
);
UndoPage.displayName = "UndoPage";
export default UndoPage;

// ════════════════════════════════════════════════════════════
//  PhaseLabel — under the top-left poem on the left page (after first undo)
// ════════════════════════════════════════════════════════════
function PhaseLabel({ t }: { t: number }) {
  if (t <= 0) return null;
  const lines =
    t >= 0.70 ? ["this is not code anymore.", "this is what is left."] :
    t >= 0.35 ? ["the system has stopped", "recognising what you meant."] :
                ["something failed.", "trying to recover."];
  return (
    <motion.div
      key={Math.floor(t / 0.35)}
      initial={{ opacity:0, y:4 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.9, ease:"easeOut" }}
      style={{ marginTop:"1.2rem" }}
    >
      {lines.map((l, i) => (
        <p key={i} style={{
          fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:300,
          fontSize:"0.68rem", lineHeight:1.85,
          color:"rgba(158,176,198,0.62)", letterSpacing:"0.04em", margin:0,
        }}>{l}</p>
      ))}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
//  KeyboardGrid
// ════════════════════════════════════════════════════════════
function KeyboardGrid({ t, maxed, onUndoClick }: {
  t: number; maxed: boolean; onUndoClick?: () => void;
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:ROW_GAP }}>
      {ROWS.map((row, ri) => (
        <div key={ri} style={{ display:"flex", gap:KEY_GAP }}>
          {row.map((key, ki) => {
            if (key.undo) return (
              <UndoKeyBtn key={ki} flex={key.flex} onClick={onUndoClick} maxed={maxed} />
            );
            const seed       = ri * 17 + ki * 31;
            const resistance = (Math.abs(Math.sin(seed * 0.61)) * 0.5 +
                                Math.abs(Math.cos(seed * 0.83)) * 0.5);
            const corrupted  = t > 0 && t > resistance * 1.05;
            const fadeSeed   = Math.abs(Math.cos(seed * 1.27));
            const faded      = fadeSeed < t * 0.75;
            const opacity    = faded ? Math.max(0.04, 1 - t * 1.6) : 1;
            const dx = Math.sin(seed * 0.71) * DISP_MAX * t;
            const dy = Math.cos(seed * 1.33) * DISP_MAX * 0.5 * t;
            const dr = Math.sin(seed * 2.17) * 3.2 * t;
            const corruptedLabel = corrupted ? wordForPhase(t, seed) : key.label;
            return (
              <KeyBtn
                key={ki} def={key}
                label={corruptedLabel}
                corrupted={corrupted} opacity={opacity}
                dx={dx} dy={dy} dr={dr} t={t}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  UndoKeyBtn
// ════════════════════════════════════════════════════════════
function UndoKeyBtn({ flex, onClick, maxed }: {
  flex: number; onClick?: () => void; maxed: boolean;
}) {
  return (
    <div
      data-book-interactive
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick?.();
        }
      }}
      style={{
        flex, height:KEY_H, minWidth:0,
        background: maxed ? "rgba(60,20,20,0.9)" : C.key,
        border:`2px solid ${maxed ? "rgba(180,60,40,0.7)" : C.gold}`,
        borderRadius:4,
        display:"flex", alignItems:"center", justifyContent:"center",
        cursor: maxed ? "not-allowed" : "pointer",
        fontSize: maxed ? "0.38rem" : "0.5rem",
        fontFamily:"var(--font-serif)", fontStyle:"italic",
        letterSpacing: maxed ? "0.04em" : "0.07em",
        color: maxed ? "rgba(200,80,60,0.8)" : C.goldTxt,
        userSelect:"none",
        animation: maxed ? "none" : "undoKeyPulse 2s ease-in-out infinite",
        transition:"all 0.8s ease",
      }}
    >
      {maxed ? "no undo" : "undo"}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  KeyBtn — regular key, may be corrupted
// ════════════════════════════════════════════════════════════
function KeyBtn({ def, label, corrupted, opacity, dx, dy, dr, t }: {
  def: KeyDef; label: string; corrupted: boolean;
  opacity: number; dx: number; dy: number; dr: number; t: number;
}) {
  const bg = def.fn ? C.keyFn : def.mod || def.space ? C.keyMod : C.key;
  const fs = def.fn ? "0.38rem" : def.mod ? "0.44rem" : "0.5rem";
  const color = corrupted
    ? t >= 0.70 ? "rgba(160,140,120,0.72)"
    : t >= 0.35 ? "rgba(200,120,40,0.80)"
    :             "rgba(220,60,50,0.78)"
    : def.fn ? C.kTxtFn : def.mod ? C.kTxtMod : C.kTxt;
  const fontFamily = corrupted && t >= 0.35 ? "var(--font-serif)" : "monospace";
  const fontSize   = corrupted && t >= 0.35 ? "0.36rem" : fs;

  return (
    <div style={{
      flex:def.flex, height:KEY_H, minWidth:0,
      background:bg,
      border:"1px solid rgba(0,0,0,0.13)",
      borderRadius:4,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize, fontFamily,
      letterSpacing: corrupted ? "0.02em" : "0.04em",
      color, opacity,
      userSelect:"none",
      transform:`translate(${dx}px,${dy}px) rotate(${dr}deg)`,
      transition:"transform 0.65s ease, opacity 1.2s ease, color 0.8s ease",
      boxShadow:"0 2px 4px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.45)",
      overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", padding:"0 2px",
    }}>
      {label}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  FloatingFragments — three phases
// ════════════════════════════════════════════════════════════
function FloatingFragments({ t, density = 1 }: { t: number; density?: number }) {
  const phaseVis = (phase: number) =>
    phase === 1 ? t > 0 : phase === 2 ? t >= 0.35 : t >= 0.70;

  const visible = FRAGS.filter((f, i) => {
    if (!phaseVis(f.phase)) return false;
    if (density < 1 && i % 2 === 1) return false;
    return true;
  });

  return (
    <div style={{
      position:"absolute", inset:0,
      overflow:"hidden", pointerEvents:"none", zIndex:0,
    }}>
      {visible.map((frag, i) => {
        const speedMult = frag.phase === 3 ? 1.0 : frag.phase === 2 ? 1.2 : (1 + t * 0.8);
        const dur = frag.speed / speedMult;
        const op  = frag.phase === 3 ? 0.55 + t * 0.25
                  : frag.phase === 2 ? 0.42 + t * 0.30
                  : 0.40 + t * 0.35;
        return (
          <div key={i} style={{
            position:"absolute",
            left:`${frag.x}%`, top:`${frag.y}%`,
            color:frag.color, opacity:op,
            fontSize:  frag.phase === 3 ? "0.55rem" : frag.phase === 2 ? "0.46rem" : "0.44rem",
            fontFamily:frag.phase >= 2 ? "var(--font-serif)" : "monospace",
            fontStyle: frag.phase >= 2 ? "italic" : "normal",
            fontWeight:frag.phase === 3 ? 300 : "normal",
            letterSpacing:frag.phase === 3 ? "0.12em" : "0.06em",
            whiteSpace:"nowrap",
            animation:`undoCodeFloat ${dur}s ${frag.delay}s linear infinite`,
            textShadow:frag.phase < 3 ? `0 0 8px ${frag.color}` : "none",
            transition:"opacity 1.2s ease",
          }}>
            {frag.text}
          </div>
        );
      })}
    </div>
  );
}
