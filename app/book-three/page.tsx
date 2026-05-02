import Link from "next/link";
import BookThreeFlipBook from "@/components/book-three/FlipBook";

export default function BookThreePage() {
  return (
    <main className="book-wrapper">
      <BookThreeFlipBook />
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
