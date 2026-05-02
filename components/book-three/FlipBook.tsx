"use client";

import React, { useRef, useEffect, useState } from "react";
import BookThreeCoverPage from "./pages/BookThreeCoverPage";
import UnfinishedProblemPage from "./pages/UnfinishedProblemPage";
import NoTranslationPage from "./pages/NoTranslationPage";
import ResetBowlPage from "./pages/ResetBowlPage";
import HolidayRoomPage from "./pages/HolidayRoomPage";
import BookThreeBackCover from "./pages/BookThreeBackCover";

const WIDTH = 480;
const HEIGHT = 660;

/**
 * Book III — What We Return To
 *
 *  [0]         Cover (solo right)
 *  [1] + [2]   Page 1 — The Unfinished Problem  (minimize windows)
 *  [3] + [4]   Page 2 — No Translation Needed   (drag to tune the room)
 *  [5] + [6]   Page 3 — The Reset Bowl          (click to add heat)
 *  [7] + [8]   Page 4 — Holiday in a Small Room (set the holiday table)
 *  [9]         Back cover (solo left)
 */
export default function BookThreeFlipBook() {
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
      <BookThreeCoverPage />

      {/* [1] + [2] — The Unfinished Problem */}
      <UnfinishedProblemPage side="left" />
      <UnfinishedProblemPage side="right" />

      {/* [3] + [4] — No Translation Needed */}
      <NoTranslationPage side="left" />
      <NoTranslationPage side="right" />

      {/* [5] + [6] — The Reset Bowl */}
      <ResetBowlPage side="left" />
      <ResetBowlPage side="right" />

      {/* [7] + [8] — Holiday in a Small Room */}
      <HolidayRoomPage side="left" />
      <HolidayRoomPage side="right" />

      <BookThreeBackCover />
    </FlipBookComp>
  );
}
