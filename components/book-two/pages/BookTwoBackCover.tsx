"use client";

import React from "react";

/* Back cover — solo left page. Echoes the warm restraint of the cover. */
const BookTwoBackCover = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="page page--left"
    style={{ position: "relative", cursor: "pointer", background: "#080610" }}
    onClick={() => {
      window.dispatchEvent(new CustomEvent("flipbook:prev"));
    }}
  >
    {/* Faint warm halo at the centre — small lantern light, far away */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 35% 28% at 50% 50%, rgba(255,170,90,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    {/* Centred thread of warm light */}
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
          "linear-gradient(to bottom, transparent, rgba(220,170,100,0.32), transparent)",
      }}
    />

    {/* Spine shadow on the right edge */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: "2rem",
        background: "linear-gradient(to left, rgba(0,0,0,0.06), transparent)",
        pointerEvents: "none",
      }}
    />
  </div>
));

BookTwoBackCover.displayName = "BookTwoBackCover";
export default BookTwoBackCover;
