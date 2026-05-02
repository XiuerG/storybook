"use client";

import React from "react";

/**
 * Aside-style hint near interactive zones — small, low-contrast, serif italic;
 * not a system button or CTA.
 */
export function InteractionHint({
  children,
  style,
  className,
  /** Slightly larger type + higher opacity + soft glow — still serif aside, not a button. */
  emphasis = false,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <p
      className={className}
      style={{
        position: "absolute",
        margin: 0,
        fontFamily: "var(--font-serif)",
        fontWeight: 300,
        fontStyle: "italic",
        fontSize: "0.55rem",
        letterSpacing: "0.12em",
        lineHeight: 1.45,
        opacity: 0.19,
        pointerEvents: "none",
        userSelect: "none",
        maxWidth: "22ch",
        ...(emphasis
          ? {
              fontSize: "0.78rem",
              letterSpacing: "0.05em",
              lineHeight: 1.4,
              opacity: 0.62,
              textShadow:
                "0 0 22px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.45)",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </p>
  );
}
