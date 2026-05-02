import Link from "next/link";
import BookFourFlipBook from "@/components/book-four/FlipBook";

export default function BookFourPage() {
  return (
    <main className="book-wrapper">
      <BookFourFlipBook />
      <nav
        aria-label="Book navigation"
        style={{
          marginTop: "1.25rem",
          textAlign: "center",
          fontFamily: "var(--font-serif)",
          fontSize: "0.82rem",
        }}
      >
        <Link
          href="/"
          style={{
            color: "rgba(200, 195, 220, 0.65)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(200,195,220,0.25)",
          }}
        >
          ← Atlas
        </Link>
      </nav>
    </main>
  );
}
