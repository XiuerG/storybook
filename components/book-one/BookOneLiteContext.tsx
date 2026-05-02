"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

/**
 * Touch / tablet–first “lite” mode for Book I: fewer animated nodes,
 * no SVG displacement filters on smoke, less blur on moving layers.
 * Detected via pointer / hover capabilities and prefers-reduced-motion.
 */
function computeBookOneLite(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }
  if (window.matchMedia("(pointer: coarse)").matches) {
    return true;
  }
  if (
    window.matchMedia("(hover: none)").matches &&
    window.navigator.maxTouchPoints > 0
  ) {
    return true;
  }
  return false;
}

function subscribe(onChange: () => void) {
  const queries = [
    "(prefers-reduced-motion: reduce)",
    "(pointer: coarse)",
    "(hover: none)",
  ];
  const mqs = queries.map((q) => window.matchMedia(q));
  const handler = () => onChange();
  mqs.forEach((mq) => mq.addEventListener("change", handler));
  window.addEventListener("orientationchange", handler);
  return () => {
    mqs.forEach((mq) => mq.removeEventListener("change", handler));
    window.removeEventListener("orientationchange", handler);
  };
}

const BookOneLiteContext = createContext(false);

export function BookOneLiteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lite = useSyncExternalStore(
    subscribe,
    computeBookOneLite,
    () => false
  );
  return (
    <BookOneLiteContext.Provider value={lite}>
      {children}
    </BookOneLiteContext.Provider>
  );
}

export function useBookOneLiteMode(): boolean {
  return useContext(BookOneLiteContext);
}
