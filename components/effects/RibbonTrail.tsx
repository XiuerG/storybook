"use client";

import { useEffect, useRef, useCallback } from "react";

interface RibbonTrailProps {
  maxPoints?: number;
  color?: string;
  dotSize?: number;
}

/**
 * RibbonTrail — canvas-based cursor trail.
 * Avoids DOM mutation errors by drawing entirely on a <canvas> element.
 * Each trail dot fades out over ~1.2 s.
 */
export default function RibbonTrail({
  maxPoints = 22,
  color = "rgba(180, 130, 90, 0.45)",
  dotSize = 11,
}: RibbonTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<
    { x: number; y: number; born: number; r: number }[]
  >([]);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = performance.now();
    const LIFESPAN = 1200; // ms

    // Remove expired points
    pointsRef.current = pointsRef.current.filter(
      (p) => now - p.born < LIFESPAN
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pointsRef.current) {
      const age = (now - p.born) / LIFESPAN; // 0 (new) → 1 (dead)
      const alpha = (1 - age) * 0.55;
      const r = p.r * (0.7 + (1 - age) * 0.3);

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      // Parse base color, override alpha
      ctx.fillStyle = color.replace(
        /rgba?\(([^)]+)\)/,
        `rgba($1)`.replace(/,\s*[\d.]+\)$/, `, ${alpha})`)
      );
      ctx.filter = "blur(3px)";
      ctx.fill();
      ctx.filter = "none";
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [color]);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ro = new ResizeObserver(() => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    });
    ro.observe(container);
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointsRef.current.push({
      x,
      y,
      born: performance.now(),
      r: dotSize / 2,
    });

    // Trim to maxPoints
    if (pointsRef.current.length > maxPoints) {
      pointsRef.current = pointsRef.current.slice(-maxPoints);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
