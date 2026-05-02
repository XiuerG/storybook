"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface PageShellProps {
  children: React.ReactNode;
  side?: "left" | "right";
  pageNumber?: number;
  style?: React.CSSProperties;
  className?: string;
  /** When floating layers (e.g. cards) must not clip at the page edge */
  contentOverflow?: "hidden" | "visible";
}

/** Clicks inside these nodes do not trigger book navigation (add data-book-interactive on custom hit targets). */
const BOOK_NAV_EXCLUDE =
  'button, a[href], textarea, input, select, option, label, [role="button"], [role="link"], [role="slider"], [data-book-interactive]';

/**
 * PageShell — strict spread navigation by **which page** was clicked (`side`), not by
 * pointer X inside the book (page-flip’s half-width rule). FlipBook sets
 * `useMouseEvents={false}` so the library does not steal clicks.
 *
 * Mousedown is still stopped at `.page` so page-flip does not start drag/click-flip
 * if settings change. Book nav uses a **native** `click` listener on `.page` (bubble)
 * so it runs before React’s root delegation and does not race child handlers (e.g. Undo).
 */
const PageShell = React.forwardRef<HTMLDivElement, PageShellProps>(
  (
    {
      children,
      side = "right",
      pageNumber,
      style,
      className,
      contentOverflow = "hidden",
    },
    ref
  ) => {
    const [footerHov, setFooterHov] = useState(false);

    const ownRef = useRef<HTMLDivElement | null>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        ownRef.current = node;
        if (!ref) return;
        if (typeof ref === "function") ref(node);
        else (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    useEffect(() => {
      const el = ownRef.current;
      if (!el) return;
      const blocker = (e: MouseEvent | TouchEvent) => e.stopPropagation();
      el.addEventListener("mousedown", blocker as EventListener);
      el.addEventListener("touchstart", blocker as EventListener, { passive: true });
      return () => {
        el.removeEventListener("mousedown", blocker as EventListener);
        el.removeEventListener("touchstart", blocker as EventListener);
      };
    }, []);

    const dispatchNav = useCallback(() => {
      window.dispatchEvent(
        new CustomEvent(side === "right" ? "flipbook:next" : "flipbook:prev")
      );
    }, [side]);

    useEffect(() => {
      const page = ownRef.current;
      if (!page) return;

      const onClickNative = (e: MouseEvent) => {
        if (e.defaultPrevented) return;
        const t = e.target;
        if (!(t instanceof Node) || !page.contains(t)) return;
        const el = t instanceof Element ? t : t.parentElement;
        if (!el || el.closest(BOOK_NAV_EXCLUDE)) return;
        e.stopPropagation();
        dispatchNav();
      };

      page.addEventListener("click", onClickNative, false);
      return () => page.removeEventListener("click", onClickNative, false);
    }, [dispatchNav]);

    return (
      <div
        ref={mergedRef}
        className={`page${side === "left" ? " page--left" : ""}${
          className ? ` ${className}` : ""
        }`}
        style={{ cursor: "pointer", ...style }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding:
              side === "left"
                ? "3rem 3rem 3rem 2.5rem"
                : "3rem 2.5rem 3rem 3rem",
            display: "flex",
            flexDirection: "column",
            overflow: contentOverflow,
          }}
        >
          {children}
        </div>

        <div
          className="book-footer-nav"
          aria-hidden={pageNumber === undefined ? true : undefined}
          onMouseEnter={() => setFooterHov(true)}
          onMouseLeave={() => setFooterHov(false)}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: side === "right" ? "flex-end" : "flex-start",
            padding: "0 2.5rem",
            gap: "0.3rem",
            zIndex: 10,
          }}
        >
          {pageNumber !== undefined && (
            <>
              {side === "left" && (
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.75rem",
                    color: "inherit",
                    opacity: footerHov ? 0.55 : 0.18,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  ‹
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.25em",
                  color: "inherit",
                  opacity: footerHov ? 0.65 : 0.35,
                  transition: "opacity 0.2s ease",
                }}
              >
                {pageNumber}
              </span>
              {side === "right" && (
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.75rem",
                    color: "inherit",
                    opacity: footerHov ? 0.55 : 0.18,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  ›
                </span>
              )}
            </>
          )}
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "2rem",
            pointerEvents: "none",
            ...(side === "left"
              ? {
                  right: 0,
                  background:
                    "linear-gradient(to left, rgba(0,0,0,0.06) 0%, transparent 100%)",
                }
              : {
                  left: 0,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent 100%)",
                }),
          }}
        />
      </div>
    );
  }
);

PageShell.displayName = "PageShell";
export default PageShell;
