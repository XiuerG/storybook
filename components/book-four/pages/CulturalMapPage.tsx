"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/book-one/pages/PageShell";
import { InteractionHint } from "@/components/book-one/pages/InteractionHint";

/* ════════════════════════════════════════════════════════════
   SCENE 2 — CULTURAL MAP
   ────────────────────────────────────────────────────────────
   A stylised India sits on the left page with four warm pins.
   Tap a region and a card slides into the right page showing
   that region's food, music, language, and festival.
================================================================ */

const TITLE = "Cultural Map";
const HI_SUB = "अपनी जगह खोजो";
const HINT = "Tap a region";

type RegionId = "gujarat" | "punjab" | "odisha" | "south";

interface Region {
  id: RegionId;
  name: string;
  hi: string;
  food: string;
  music: string;
  greeting: string;
  greetingLang: string;
  festival: string;
  /** pin position on the SVG map (viewBox 0..400 × 0..500) */
  pinX: number;
  pinY: number;
}

const REGIONS: Region[] = [
  {
    id: "gujarat",
    name: "Gujarat",
    hi: "गुजरात",
    food: "Dhokla — light, steamed, shared on plates",
    music: "Garba — the round-dance of Navratri nights",
    greeting: "Kem cho?",
    greetingLang: "Gujarati",
    festival: "Navratri — nine nights of dance",
    pinX: 110,
    pinY: 200,
  },
  {
    id: "punjab",
    name: "Punjab",
    hi: "पंजाब",
    food: "Sarson da saag, makki di roti — winter food",
    music: "Bhangra and the dhol's heartbeat",
    greeting: "Sat Sri Akal",
    greetingLang: "Punjabi",
    festival: "Lohri — bonfires for the longest night",
    pinX: 175,
    pinY: 110,
  },
  {
    id: "odisha",
    name: "Odisha",
    hi: "ओडिशा",
    food: "Pithas — rice cakes for new beginnings",
    music: "Odissi — temple music of slow geometry",
    greeting: "Namaskar",
    greetingLang: "Odia",
    festival: "Rath Yatra — chariots through the streets",
    pinX: 268,
    pinY: 270,
  },
  {
    id: "south",
    name: "South India",
    hi: "दक्षिण भारत",
    food: "Idli, dosa, sambar — breakfast as ritual",
    music: "Carnatic — voice and rhythm in dialogue",
    greeting: "Vanakkam",
    greetingLang: "Tamil",
    festival: "Pongal — the harvest greeting",
    pinX: 200,
    pinY: 410,
  },
];

/* ════════════════════════════════════════════════════════════
   MODULE STORE
================================================================ */
let _selected: RegionId | null = null;
const _visited = new Set<RegionId>();
const _subs = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("storybook:reset", () => {
    _selected = null;
    _visited.clear();
    _subs.forEach(fn => fn());
  });
}
function _notify() { _subs.forEach(fn => fn()); }
function _select(id: RegionId) {
  _selected = id;
  _visited.add(id);
  _notify();
}
function useMap() {
  const [, setN] = useState(0);
  useEffect(() => {
    const cb = () => setN(n => n + 1);
    _subs.add(cb);
    return () => { _subs.delete(cb); };
  }, []);
  return {
    selected: _selected,
    isVisited: (id: RegionId) => _visited.has(id),
    visitedCount: _visited.size,
  };
}

/* ════════════════════════════════════════════════════════════
   PAGE COMPONENT
================================================================ */
interface PageProps { side?: "left" | "right" }

const CulturalMapPage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ side = "left" }, ref) => {
    if (side === "left") return <MapLeft forwardedRef={ref} />;
    return <MapRight forwardedRef={ref} />;
  }
);
CulturalMapPage.displayName = "CulturalMapPage";
export default CulturalMapPage;

/* ════════════════════════════════════════════════════════════
   LEFT — title + map
================================================================ */
function MapLeft({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { selected, isVisited, visitedCount } = useMap();

  return (
    <PageShell
      ref={forwardedRef}
      side="left"
      pageNumber={3}
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

      {/* Map */}
      <IndiaMap selected={selected} isVisited={isVisited} onSelect={_select} />

      {visitedCount < 1 && (
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
   RIGHT — region detail card
================================================================ */
function MapRight({ forwardedRef }: { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const { selected } = useMap();
  const region = selected ? REGIONS.find(r => r.id === selected) : null;

  return (
    <PageShell
      ref={forwardedRef}
      side="right"
      pageNumber={4}
      style={{ background: "#0a0820" }}
    >
      <RoomBackdrop side="right" />

      {/* Detail card */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          right: "8%",
          bottom: "10%",
          zIndex: 6,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="wait">
          {region ? (
            <RegionCard key={region.id} region={region} />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "rgba(195,205,230,0.55)",
              }}
            >
              Choose a region<br />
              to see what waits there.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

/* ════════════════════════════════════════════════════════════
   BACKDROP
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
            (side === "left" ? "50%" : "50%") +
            " 55%, rgba(110,55,40,0.25) 0%, transparent 70%)," +
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
   INDIA MAP — stylised silhouette + warm pins
================================================================ */
function IndiaMap({
  selected,
  isVisited,
  onSelect,
}: {
  selected: RegionId | null;
  isVisited: (id: RegionId) => boolean;
  onSelect: (id: RegionId) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "22%",
        bottom: "10%",
        left: "10%",
        right: "10%",
        zIndex: 5,
      }}
    >
      <svg
        viewBox="0 0 400 500"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="bf-india-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(60,42,72,0.55)" />
            <stop offset="100%" stopColor="rgba(40,28,52,0.85)" />
          </linearGradient>
        </defs>

        {/* Stylised India outline — not topologically exact, evocative */}
        <path
          d="
            M 180 28
            Q 200 22 232 36
            Q 272 36 305 76
            Q 320 102 318 132
            Q 332 156 348 192
            Q 352 232 332 274
            Q 312 322 280 360
            Q 246 412 208 456
            Q 196 472 188 480
            Q 178 472 168 458
            Q 142 422 124 380
            Q 102 332 86 280
            Q 78 230 88 188
            Q 100 152 110 122
            Q 92 96 116 80
            Q 142 64 168 52
            Q 174 38 180 28 Z
          "
          fill="url(#bf-india-fill)"
          stroke="rgba(255,180,100,0.42)"
          strokeWidth="1.4"
        />

        {/* Sri Lanka — small island */}
        <ellipse
          cx="220"
          cy="478"
          rx="14"
          ry="22"
          fill="rgba(40,28,52,0.7)"
          stroke="rgba(255,180,100,0.32)"
          strokeWidth="1"
        />

        {/* Faint inner texture lines */}
        <path
          d="M 160 110 Q 200 130 240 120 M 130 220 Q 200 240 270 230 M 140 320 Q 200 340 260 330"
          stroke="rgba(255,200,140,0.10)"
          strokeWidth="0.6"
          fill="none"
        />

        {/* Pins */}
        {REGIONS.map(r => (
          <Pin
            key={r.id}
            region={r}
            selected={selected === r.id}
            visited={isVisited(r.id)}
            onClick={() => onSelect(r.id)}
          />
        ))}
      </svg>
    </div>
  );
}

function Pin({
  region,
  selected,
  visited,
  onClick,
}: {
  region: Region;
  selected: boolean;
  visited: boolean;
  onClick: () => void;
}) {
  return (
    <g style={{ cursor: "pointer" }}>
      {/* Pulsing halo if not selected/visited */}
      {!selected && !visited && (
        <motion.circle
          cx={region.pinX}
          cy={region.pinY}
          animate={{ r: [10, 22, 10], opacity: [0.65, 0, 0.65] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          fill="none"
          stroke="rgba(255,180,100,0.7)"
          strokeWidth="1"
        />
      )}

      {/* Selected halo */}
      {selected && (
        <motion.circle
          cx={region.pinX}
          cy={region.pinY}
          animate={{ r: [12, 22, 12], opacity: [0.55, 0.2, 0.55] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          fill="rgba(255,180,100,0.20)"
          stroke="rgba(255,200,130,0.65)"
          strokeWidth="1"
        />
      )}

      {/* Click target — larger invisible circle */}
      <circle
        cx={region.pinX}
        cy={region.pinY}
        r="20"
        fill="transparent"
        data-book-interactive
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={{ cursor: "pointer", pointerEvents: "all" }}
      />

      {/* Pin core */}
      <circle
        cx={region.pinX}
        cy={region.pinY}
        r={selected ? 5 : 4}
        fill={
          selected
            ? "rgba(255,210,140,0.96)"
            : visited
              ? "rgba(255,180,100,0.78)"
              : "rgba(255,180,100,0.6)"
        }
        style={{
          filter: selected
            ? "drop-shadow(0 0 6px rgba(255,180,100,0.85))"
            : "drop-shadow(0 0 4px rgba(255,180,100,0.5))",
          transition: "fill 0.4s ease, r 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Region name label */}
      <text
        x={region.pinX}
        y={region.pinY + 18}
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontStyle="italic"
        fontSize="11"
        fontWeight="300"
        letterSpacing="2"
        fill={
          selected
            ? "rgba(255,225,185,0.96)"
            : "rgba(220,210,235,0.65)"
        }
        style={{
          textShadow: "0 0 6px rgba(0,0,0,0.85)",
          pointerEvents: "none",
          textTransform: "uppercase",
          transition: "fill 0.4s ease",
        }}
      >
        {region.name}
      </text>
    </g>
  );
}

/* ════════════════════════════════════════════════════════════
   REGION CARD
================================================================ */
function RegionCard({ region }: { region: Region }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "relative",
        height: "100%",
        background:
          "linear-gradient(160deg, rgba(255,170,80,0.08) 0%, rgba(40,28,52,0.42) 100%)",
        border: "1px solid rgba(255,180,100,0.32)",
        borderRadius: 8,
        padding: "1.4rem",
        backdropFilter: "blur(6px)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Region header */}
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.7rem",
          letterSpacing: "0.32em",
          color: "rgba(255,200,140,0.78)",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        Region
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.4rem",
          color: "rgba(255,228,200,0.96)",
          lineHeight: 1.2,
          marginBottom: 4,
        }}
      >
        {region.name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.86rem",
          letterSpacing: "0.04em",
          color: "rgba(255,200,140,0.7)",
        }}
      >
        {region.hi}
      </div>

      <div
        style={{
          width: "1.6rem",
          height: 1,
          background: "rgba(255,180,100,0.55)",
          margin: "1.2rem 0",
        }}
      />

      {/* Detail rows */}
      <DetailRow label="Food"     value={region.food}     delay={0.15} />
      <DetailRow label="Music"    value={region.music}    delay={0.30} />
      <DetailRow
        label="Greeting"
        value={`"${region.greeting}" — ${region.greetingLang}`}
        delay={0.45}
      />
      <DetailRow label="Festival" value={region.festival} delay={0.60} />
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{ marginBottom: "0.85rem" }}
    >
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "0.55rem",
          letterSpacing: "0.32em",
          color: "rgba(255,180,100,0.65)",
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.78rem",
          lineHeight: 1.55,
          color: "rgba(245,228,205,0.92)",
          letterSpacing: "0.01em",
        }}
      >
        {value}
      </div>
    </motion.div>
  );
}
