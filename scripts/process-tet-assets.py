#!/usr/bin/env python3
"""Remove solid navy borders from Tết sticker PNGs via edge flood-fill.

Reads PNGs from Cursor assets folder (override with TET_ASSET_DIR), writes to
public/book-two/ with tet-*.png names. Requires Pillow + scipy."""

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
    ("pho-e33da9c6-a8ad-42f0-ae54-350b9401b48c.png", "tet-pho.png"),
    ("smoke-d91315b3-d994-4037-853b-44291155670a.png", "tet-incense.png"),
    ("orange-936d202b-6eca-487b-a28e-3177d2f59d68.png", "tet-kumquats.png"),
    ("flower-55ebfb45-412b-408b-a213-bc27a3cb47d6.png", "tet-flower.png"),
    ("dish-1c4c34d8-51ab-462b-9c07-9411b7e691f3.png", "tet-banh-chung.png"),
    ("rice-2debb916-8dd1-4b3a-a6d7-4e7692d824fb.png", "tet-rice-bowls.png"),
    ("chopstick-a6606c5b-2427-4c9d-8cf4-499178021985.png", "tet-chopsticks.png"),
]


def remove_bg_flood(rgb: np.ndarray) -> np.ndarray:
    """Return alpha uint8 (h,w): 0 = removed background."""
    R, G, B = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    ref = np.array(
        [rgb[0, 0], rgb[0, -1], rgb[-1, 0], rgb[-1, -1]], dtype=np.float32
    ).mean(axis=0)
    dist = np.linalg.norm(rgb.astype(np.float32) - ref[None, None, :], axis=2)
    navyish = (B > R + 3) | (dist < 6)
    mask = (dist < 52) & navyish
    h, w = dist.shape
    seed = np.zeros((h, w), dtype=bool)
    seed[0, :] = mask[0, :]
    seed[-1, :] = mask[-1, :]
    seed[:, 0] = mask[:, 0]
    seed[:, -1] = mask[:, -1]
    struct = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], dtype=bool)
    bg = ndimage.binary_propagation(seed, structure=struct, mask=mask)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    return alpha


def main() -> None:
    src_root = Path(os.environ.get("TET_ASSET_DIR", DEFAULT_SRC)).expanduser()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for src_name, dst_name in MAPPING:
        src = src_root / src_name
        if not src.is_file():
            raise SystemExit(f"Missing source: {src}")
        im = Image.open(src).convert("RGBA")
        arr = np.array(im)
        rgb = arr[:, :, :3].astype(np.float32)
        alpha = remove_bg_flood(rgb)
        out = arr.copy()
        out[:, :, 3] = np.minimum(out[:, :, 3], alpha)
        Image.fromarray(out, "RGBA").save(OUT_DIR / dst_name, optimize=True)
        print("wrote", OUT_DIR / dst_name)


if __name__ == "__main__":
    main()
