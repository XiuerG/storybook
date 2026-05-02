"use client";

import React from "react";

/* Back cover — solo left page. Midnight blue with a single warm pinpoint. */
const BookFourBackCover = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="page page--left"
    style={{ position: "relative", cursor: "pointer", background: "#08051a" }}
    onClick={() => {
      window.dispatchEvent(new CustomEvent("flipbook:prev"));
    }}
  >
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 35% 28% at 50% 50%, rgba(255,170,80,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />
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
          "linear-gradient(to bottom, transparent, rgba(255,180,100,0.36), transparent)",
      }}
    />
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

BookFourBackCover.displayName = "BookFourBackCover";
export default BookFourBackCover;
