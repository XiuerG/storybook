"use client";

import { motion } from "framer-motion";

interface SteamProps {
  /** Horizontal centre of the steam column, relative to its container */
  x?: number | string;
  /** How tall the steam rises in px */
  riseHeight?: number;
  /** Colour of the blurred shapes */
  color?: string;
}

const WISPS = [
  { delay: 0, offsetX: 0, scale: 1 },
  { delay: 1.2, offsetX: -8, scale: 0.75 },
  { delay: 2.4, offsetX: 10, scale: 0.85 },
];

/**
 * Steam — three staggered blurry ellipses that rise slowly upward.
 * Drop this anywhere above a "bowl" or warm surface.
 */
export default function Steam({
  x = "50%",
  riseHeight = 70,
  color = "rgba(180, 160, 130, 0.35)",
}: SteamProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x,
        transform: "translateX(-50%)",
        width: 60,
        height: riseHeight + 20,
        pointerEvents: "none",
      }}
    >
      {WISPS.map((w, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -riseHeight],
            opacity: [0, 0.7, 0],
            scaleX: [0.6 * w.scale, 1.2 * w.scale, 0.4 * w.scale],
          }}
          transition={{
            duration: 3.2,
            delay: w.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            translateX: "-50%",
            marginLeft: w.offsetX,
            width: 22 * w.scale,
            height: 36 * w.scale,
            borderRadius: "50%",
            background: color,
            filter: "blur(8px)",
          }}
        />
      ))}
    </div>
  );
}
