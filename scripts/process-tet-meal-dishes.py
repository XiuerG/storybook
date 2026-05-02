#!/usr/bin/env python3
"""Remove checkerboard / near-white neutral backgrounds from Tết meal dish PNGs.

Edge flood-fill through pixels that are bright and low-chroma (plate/checker),
so colored food is preserved. Writes to public/book-two/tet-dish-*.png."""

from __future__ import annotations

import os
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

REPO = Path(__file__).resolve().parents[1]
OUT_DIR = REPO / "public" / "book-two"
DEFAULT_SRC = Path.home() / ".cursor/projects/Users-maddieg-Desktop-storybook/assets"

MAPPING = [
    ("food6-5f23ab1a-16f0-45d0-84cc-232c3d9e821f.png", "tet-dish-nem-xoi.png"),
    ("food1-56d7f8f6-7cb5-46d5-875a-5ef40b5607ea.png", "tet-dish-chicken.png"),
    ("food2-495c4be7-2f38-4959-8464-117890a0eddb.png", "tet-dish-bitter-melon.png"),
    ("food3-8b61122d-42af-4b9b-8ed5-203b9dec9285.png", "tet-dish-banh.png"),
    ("food4-c7746895-5233-4337-b8ac-2561ac51e4b2.png", "tet-dish-pickles.png"),
    ("food5-7761528e-5bf2-4b30-af15-50f98d355c46.png", "tet-dish-cha-lua.png"),
]


def neutral_bright_mask(rgb: np.ndarray, lmin: float = 208, spread_max: float = 24) -> np.ndarray:
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    lu = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    return (lu >= lmin) & ((mx - mn) <= spread_max)


def process_to_rgba(path: Path) -> Image.Image:
    arr = np.array(Image.open(path).convert("RGBA"))
    rgb = arr[:, :, :3].astype(float)
    mask = neutral_bright_mask(rgb)
    h, w = mask.shape
    seed = np.zeros((h, w), dtype=bool)
    seed[0, :] = mask[0, :]
    seed[-1, :] = mask[-1, :]
    seed[:, 0] = mask[:, 0]
    seed[:, -1] = mask[:, -1]
    struct = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], dtype=bool)
    bg = ndimage.binary_propagation(seed, structure=struct, mask=mask)
    out = arr.copy()
    out[:, :, 3] = np.where(bg, 0, out[:, :, 3])
    return Image.fromarray(out, "RGBA")


def main() -> None:
    src_root = Path(os.environ.get("TET_MEAL_ASSET_DIR", DEFAULT_SRC)).expanduser()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for src_name, dst_name in MAPPING:
        src = src_root / src_name
        if not src.is_file():
            raise SystemExit(f"Missing source: {src}")
        process_to_rgba(src).save(OUT_DIR / dst_name, optimize=True)
        print("wrote", OUT_DIR / dst_name)


if __name__ == "__main__":
    main()
