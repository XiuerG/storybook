"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "./StarField";
import BookCarousel, { BookEntry } from "./BookCarousel";
import BookOverlay from "./BookOverlay";

/* ════════════════════════════════════════════════════════════
   HOME — An Atlas of Crossings
   ────────────────────────────────────────────────────────────
   Four storybooks float on a slow cylindrical arc above a
   starfield. The reader drags to rotate, hovers to read each
   book's title and immigrant-group, clicks to open, and on
   close every book's interaction state is reset via a
   "storybook:reset" window event.
================================================================ */

const ATLAS_TITLE = "An Atlas of Crossings";
const ATLAS_SUB = "Four interactive storybooks of memory, return, and home.";
const ATLAS_HINT = "Drag to rotate · click to open";

const BOOKS: BookEntry[] = [
  {
    id: "book-one",
    romanNumeral: "Book I",
    title: "Our Secret Haven",
    group: "Chinese diaspora",
    baseFrom: "rgba(28,32,44,0.95)",
    baseTo: "rgba(12,14,22,0.95)",
    glow: "rgba(180,130,90,0.30)",
  },
  {
    id: "book-two",
    romanNumeral: "Book II",
    title: "Between Leaving and Returning",
    group: "Vietnamese diaspora",
    baseFrom: "rgba(34,18,28,0.95)",
    baseTo: "rgba(14,7,16,0.95)",
    glow: "rgba(255,170,80,0.32)",
  },
  {
    id: "book-three",
    romanNumeral: "Book III",
    title: "What We Return To",
    group: "Korean diaspora",
    baseFrom: "rgba(26,22,40,0.95)",
    baseTo: "rgba(10,9,22,0.95)",
    glow: "rgba(180,150,220,0.30)",
  },
  {
    id: "book-four",
    romanNumeral: "Book IV",
    title: "The Cultural Bridge",
    group: "Indian diaspora",
    baseFrom: "rgba(40,20,32,0.95)",
    baseTo: "rgba(14,8,22,0.95)",
    glow: "rgba(255,180,100,0.32)",
  },
];

export default function HomePage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const handleClose = () => {
    // Reset every book's interaction state
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("storybook:reset"));
    }
    setOpenId(null);
  };

  const hoveredBook = hoverId ? BOOKS.find(b => b.id === hoverId) ?? null : null;

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#05041a",
        color: "rgba(245,230,210,0.92)",
      }}
    >
      <StarField />

      {/* Atlas title */}
      <div
        style={{
          position: "absolute",
          top: "9%",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "clamp(0.62rem, 1.05vw, 0.74rem)",
            letterSpacing: "0.14em",
            color: "rgba(232,226,248,0.88)",
            marginBottom: "0.9rem",
            maxWidth: "min(92vw, 34rem)",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.45,
            textShadow: "0 1px 14px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.9)",
          }}
        >
          Stories of cultural healing across Asian diasporas
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.0, delay: 0.6, ease: "easeOut" }}
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)",
            lineHeight: 1.15,
            letterSpacing: "0.005em",
            color: "rgba(248,232,210,0.96)",
            textShadow:
              "0 0 28px rgba(0,0,0,0.85), 0 0 56px rgba(220,140,100,0.18)",
          }}
        >
          {ATLAS_TITLE}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.55, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.4 }}
          style={{
            width: "3rem",
            height: 1,
            margin: "1.2rem auto 0",
            background: "rgba(220,170,120,0.55)",
            transformOrigin: "center",
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.7 }}
          style={{
            margin: "1.0rem 0 0",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            color: "rgba(225,215,195,0.88)",
            textShadow: "0 1px 10px rgba(0,0,0,0.55)",
          }}
        >
          {ATLAS_SUB}
        </motion.p>
      </div>

      {/* Carousel — vertically centered band */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          transform: "translateY(-50%)",
          left: 0,
          right: 0,
          zIndex: 4,
        }}
      >
        <BookCarousel
          books={BOOKS}
          onSelect={setOpenId}
          onHover={setHoverId}
        />
      </div>

      {/* Hover info — below the carousel */}
      <div
        style={{
          position: "absolute",
          bottom: "16%",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
          pointerEvents: "none",
          height: "5rem",
        }}
      >
        <AnimatePresence mode="wait">
          {hoveredBook ? (
            <motion.div
              key={hoveredBook.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "1.05rem",
                  lineHeight: 1.4,
                  color: "rgba(255,225,185,0.96)",
                  textShadow:
                    "0 0 18px rgba(255,180,100,0.45), 0 0 4px rgba(0,0,0,0.85)",
                  letterSpacing: "0.005em",
                }}
              >
                {hoveredBook.title}
              </div>
              <div
                style={{
                  marginTop: "0.45rem",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: "0.6rem",
                  letterSpacing: "0.32em",
                  color: "rgba(225,218,245,0.82)",
                  textTransform: "uppercase",
                  textShadow: "0 1px 10px rgba(0,0,0,0.7)",
                }}
              >
                {hoveredBook.group}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.68rem",
                letterSpacing: "0.28em",
                color: "rgba(220,228,248,0.94)",
                textTransform: "uppercase",
                textShadow:
                  "0 1px 16px rgba(0,0,0,0.85), 0 0 12px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.95)",
              }}
            >
              {ATLAS_HINT}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer link */}
      <div
        style={{
          position: "absolute",
          bottom: "3%",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(0.52rem, 0.95vw, 0.62rem)",
          letterSpacing: "0.16em",
          color: "rgba(205,215,242,0.82)",
          pointerEvents: "none",
          padding: "0 1rem",
          lineHeight: 1.45,
          textShadow:
            "0 1px 18px rgba(0,0,0,0.75), 0 0 14px rgba(0,0,0,0.45), 0 0 1px rgba(0,0,0,0.9)",
        }}
      >
        Four Cultural Threads · One Atlas of Healing
      </div>

      {/* Book overlay */}
      <BookOverlay bookId={openId} onClose={handleClose} />
    </main>
  );
}
