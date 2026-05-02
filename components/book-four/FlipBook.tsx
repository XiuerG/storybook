"use client";

import React, { useRef, useEffect, useState } from "react";
import BookFourCoverPage from "./pages/BookFourCoverPage";
import WhatConnectsYouPage from "./pages/WhatConnectsYouPage";
import CulturalMapPage from "./pages/CulturalMapPage";
import MemoryCardsPage from "./pages/MemoryCardsPage";
import HealingRitualPage from "./pages/HealingRitualPage";
import GenerationalBridgePage from "./pages/GenerationalBridgePage";
import CommunityWallPage from "./pages/CommunityWallPage";
import BookFourBackCover from "./pages/BookFourBackCover";

const WIDTH = 480;
const HEIGHT = 660;

/**
 * Book IV — The Cultural Bridge
 *
 *  [0]          Cover (solo right)
 *  [1] + [2]    Scene 1 — What Connects You
 *  [3] + [4]    Scene 2 — Cultural Map
 *  [5] + [6]    Scene 3 — Memory Cards
 *  [7] + [8]    Scene 4 — Healing Ritual
 *  [9] + [10]   Scene 5 — Generational Bridge
 *  [11] + [12]  Scene 6 — Community Wall
 *  [13]         Back cover (solo left)
 */
export default function BookFourFlipBook() {
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
      <BookFourCoverPage />

      <WhatConnectsYouPage side="left" />
      <WhatConnectsYouPage side="right" />

      <CulturalMapPage side="left" />
      <CulturalMapPage side="right" />

      <MemoryCardsPage side="left" />
      <MemoryCardsPage side="right" />

      <HealingRitualPage side="left" />
      <HealingRitualPage side="right" />

      <GenerationalBridgePage side="left" />
      <GenerationalBridgePage side="right" />

      <CommunityWallPage side="left" />
      <CommunityWallPage side="right" />

      <BookFourBackCover />
    </FlipBookComp>
  );
}
