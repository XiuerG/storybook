"use client";

// This thin wrapper re-exports react-pageflip as a proper ESM default,
// which allows Next.js dynamic() to resolve it correctly with Turbopack.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export { default } from "react-pageflip";
