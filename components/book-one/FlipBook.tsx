"use client";

import React, { useRef, useEffect, useState } from "react";
import CoverPage from "./pages/CoverPage";
import CityPage from "./pages/CityPage";
import UndoPage from "./pages/UndoPage";
import HospitalPage from "./pages/HospitalPage";
import StrokePage from "./pages/StrokePage";
import PantryPage from "./pages/PantryPage";
import WarmRoomPage from "./pages/WarmRoomPage";

/**
 * Book dimensions — single-page width × height.
 * The open spread is 2 × WIDTH wide.
 * ─────────────────────────────────────────────
 * Edit WIDTH / HEIGHT to resize the book.
 */
const WIDTH = 480;
const HEIGHT = 660;

/**
 * Page structure (react-pageflip with showCover=true):
 *  [0]        CoverPage
 *  [1] + [2]  City
 *  [3] + [4]  Undo
 *  [5] + [6]  Hospital
 *  [7] + [8]  Pantry
 *  [9] + [10] Stroke (Calligraphy)
 * [11] + [12] Warm Room
 * [13]       BackCover
 *
 * Each spread: even index = left page, odd = right page.
 */
export default function FlipBook() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [FlipBookComp, setFlipBookComp] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("react-pageflip").then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Comp = (mod as any).default ?? mod;
      setFlipBookComp(() => Comp);
    });
  }, []);

  // PageShell dispatches flipbook:next / flipbook:prev (strict by left vs right page).
  useEffect(() => {
    const onNext = () => bookRef.current?.pageFlip().flipNext();
    const onPrev = () => bookRef.current?.pageFlip().flipPrev();
    window.addEventListener("flipbook:next", onNext);
    window.addEventListener("flipbook:prev", onPrev);
    return () => {
      window.removeEventListener("flipbook:next", onNext);
      window.removeEventListener("flipbook:prev", onPrev);
    };
  }, []);

  if (!FlipBookComp) {
    return (
      <div
        style={{
          width: WIDTH * 2,
          height: HEIGHT,
          background: "rgba(255,255,255,0.015)",
          borderRadius: 2,
        }}
      />
    );
  }

  // useMouseEvents: false — disable page-flip’s half-book X click logic (right click was
  // sometimes “prev”). disableFlipByClick: library click-flip only on corners. Nav = PageShell.
  return (
    <FlipBookComp
      ref={bookRef}
      width={WIDTH}
      height={HEIGHT}
      size="fixed"
      minWidth={280}
      maxWidth={WIDTH}
      minHeight={400}
      maxHeight={HEIGHT}
      showCover
      disableFlipByClick
      useMouseEvents={false}
      mobileScrollSupport={false}
      flippingTime={1100}
      usePortrait={false}
      startPage={0}
      drawShadow
      maxShadowOpacity={0.35}
      style={{ margin: "0 auto" }}
      className="stf__parent"
    >
      {/* [0] Front cover */}
      <CoverPage />

      {/* [1] + [2] — City */}
      <CityPage side="left" />
      <CityPage side="right" />

      {/* [3] + [4] — Undo */}
      <UndoPage side="left" />
      <UndoPage side="right" />

      {/* [5] + [6] — Hospital (Out of Focus) */}
      <HospitalPage side="left" />
      <HospitalPage side="right" />

      {/* [7] + [8] — Pantry */}
      <PantryPage side="left" />
      <PantryPage side="right" />

      {/* [9] + [10] — Stroke (Calligraphy) */}
      <StrokePage side="left" />
      <StrokePage side="right" />

      {/* [11] + [12] — Warm Room */}
      <WarmRoomPage side="left" />
      <WarmRoomPage side="right" />

      {/* [13] Back cover */}
      <BackCover />
    </FlipBookComp>
  );
}

/* ─── Back cover ─────────────────────────────────────────── */
const BackCover = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="page page--left"
    style={{ position: "relative", cursor: "pointer" }}
    onClick={() => {
      window.dispatchEvent(new CustomEvent("flipbook:prev"));
    }}
  >
    {/* Faint centred line — mirrors cover's restraint */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1,
        height: "30%",
        background:
          "linear-gradient(to bottom, transparent, rgba(180,130,90,0.18), transparent)",
      }}
    />
    {/* Spine shadow */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: "2rem",
        background: "linear-gradient(to left, rgba(0,0,0,0.05), transparent)",
        pointerEvents: "none",
      }}
    />
  </div>
));
BackCover.displayName = "BackCover";
