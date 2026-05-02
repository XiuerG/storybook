"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookOneFlipBook from "@/components/book-one/FlipBook";
import BookTwoFlipBook from "@/components/book-two/FlipBook";
import BookThreeFlipBook from "@/components/book-three/FlipBook";
import BookFourFlipBook from "@/components/book-four/FlipBook";

/* ════════════════════════════════════════════════════════════
   BOOK OVERLAY — full-screen modal that hosts a FlipBook.
   Pressing Esc or clicking the close button (×) calls onClose.
================================================================ */

interface Props {
  bookId: string | null;
  onClose: () => void;
}

export default function BookOverlay({ bookId, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!bookId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookId, onClose]);

  return (
    <AnimatePresence>
      {bookId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background:
              "radial-gradient(ellipse 90% 90% at 50% 50%, rgba(8,5,18,0.92) 0%, rgba(2,2,8,0.98) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close book"
            style={{
              position: "absolute",
              top: "1.4rem",
              right: "1.6rem",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(220,210,235,0.32)",
              background: "rgba(20,16,32,0.72)",
              color: "rgba(245,232,212,0.92)",
              cursor: "pointer",
              fontFamily: "var(--font-serif)",
              fontSize: "1.2rem",
              lineHeight: 1,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.55)",
              transition: "border 0.3s ease, background 0.3s ease",
              zIndex: 101,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,210,170,0.55)";
              e.currentTarget.style.background = "rgba(40,28,52,0.82)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "1px solid rgba(220,210,235,0.32)";
              e.currentTarget.style.background = "rgba(20,16,32,0.72)";
            }}
          >
            ×
          </button>

          {/* Tiny escape hint */}
          <div
            style={{
              position: "absolute",
              top: "1.6rem",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "0.6rem",
              letterSpacing: "0.32em",
              color: "rgba(220,210,235,0.42)",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            press esc to close
          </div>

          {/* The book itself */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
          >
            <BookSwitch id={bookId} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BookSwitch({ id }: { id: string }) {
  if (id === "book-one")   return <BookOneFlipBook />;
  if (id === "book-two")   return <BookTwoFlipBook />;
  if (id === "book-three") return <BookThreeFlipBook />;
  if (id === "book-four")  return <BookFourFlipBook />;
  return null;
}
