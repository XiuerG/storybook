"use client";

import { motion } from "framer-motion";

interface SoftLightProps {
  /** Whether the glow is visible */
  visible: boolean;
  /** Glow colour — use rgba for transparency */
  color?: string;
  /** Glow radius in percent of the container width */
  radius?: number;
  /** Offset from centre as a fraction of container size [-1, 1] */
  offsetX?: number;
  offsetY?: number;
}

/**
 * SoftLight — a radial-gradient glow that fades in/out.
 * Place it as an absolute child inside a position:relative container.
 * Toggle `visible` on hover/interaction.
 */
export default function SoftLight({
  visible,
  color = "rgba(255, 210, 160, 0.18)",
  radius = 70,
  offsetX = 0,
  offsetY = 0,
}: SoftLightProps) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse ${radius}% ${radius}% at ${50 + offsetX * 50}% ${50 + offsetY * 50}%, ${color} 0%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />
  );
}
