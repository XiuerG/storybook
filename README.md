# Our Secret Haven — Interactive Flipbook

A web-based interactive digital storybook about immigrant cultural healing.
Built with Next.js 14 (App Router), TypeScript, react-pageflip, and framer-motion.

## Getting started

> Node.js 18+ is required. Download from https://nodejs.org if not installed.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Where to edit things

| What to change | Where to look |
|---|---|
| Page text / titles | Top constants in each `components/book-one/pages/*.tsx` file |
| Book size | `WIDTH` / `HEIGHT` in `components/book-one/FlipBook.tsx` |
| Page colors, fonts | CSS variables at the top of `app/globals.css` |
| Background color | `--screen-bg` in `app/globals.css` |
| Animation speed (flip) | `flippingTime` prop in `components/book-one/FlipBook.tsx` |
| CoverPage breathing speed | `duration` in the `motion.div` animate in `CoverPage.tsx` (under `book-one/pages/`) |
| UndoPage click limit | `MAX_CLICKS` constant in `UndoPage.tsx` |
| Page order | Children order in `components/book-one/FlipBook.tsx` |

---

## Project structure

```
app/
  layout.tsx          Google Fonts + metadata
  page.tsx            Book I (/) — dark screen + centered flipbook
  book-two/page.tsx  Book II (/book-two)
  globals.css         Global styles, CSS variables, typography

components/
  book-one/
    FlipBook.tsx        react-pageflip wrapper, assembles Book I pages
    pages/
      PageShell.tsx     Reusable paper-textured page wrapper (shared by Book II)
      CoverPage.tsx     Breathing title animation
      CityPage.tsx      Mouse parallax background
      UndoPage.tsx      Click instability interaction
      HospitalPage.tsx  Hospital / out-of-focus scene
      PantryPage.tsx    Pantry shelf reveal + names
      StrokePage.tsx    Calligraphy spread
      WarmRoomPage.tsx  Closing warm room
      InteractionHint.tsx
  book-two/
    FlipBook.tsx        Second book (route `/book-two`)
    pages/              Book II–only pages
  effects/
    Steam.tsx         Staggered blurry rising ellipses
    RibbonTrail.tsx   Mouse-tracking dot trail (unused if no ritual page)
    SoftLight.tsx     Togglable radial glow overlay
```

---

## Adding a new page

1. Create `components/book-one/pages/MyPage.tsx` following the pattern of any existing page.
2. Import it in `components/book-one/FlipBook.tsx`.
3. Add `<MyPage />` as a child of the flipbook component in the desired position.

react-pageflip treats children in order: index 0 = front cover (right), index 1 = inside cover (left), and so on alternating right/left.
