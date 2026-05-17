from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def patch_file(rel_path: str, replacements: dict[str, str]) -> bool:
    path = ROOT / rel_path
    original = path.read_text(encoding="utf-8")
    updated = original
    for old, new in replacements.items():
        updated = updated.replace(old, new)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def patch_products_json() -> bool:
    path = ROOT / "data/products.json"
    original = path.read_text(encoding="utf-8")
    updated = re.sub(r'"/images/products/[^"\n]+"', '"/placeholder.jpg"', original)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed: list[str] = []

    if patch_file("app/layout.tsx", {"/images/logo-plastic.svg": "/images/logo123.png"}):
        changed.append("app/layout.tsx")
    if patch_file(
        "components/seo/site-json-ld.tsx",
        {"/images/logo-plastic.svg": "/images/logo123.png"},
    ):
        changed.append("components/seo/site-json-ld.tsx")
    if patch_file(
        "sections/scroll-video-showcase.tsx",
        {
            "/videos/factory-scroll.mp4": "/videos/frontpage4.mp4",
            "/images/factory-poster.jpg": "/images/factory-1.jpg",
        },
    ):
        changed.append("sections/scroll-video-showcase.tsx")
    if patch_file(
        "app/admin/products/[id]/product-edit-client.tsx",
        {"/images/product.jpg": "/placeholder.jpg"},
    ):
        changed.append("app/admin/products/[id]/product-edit-client.tsx")
    if patch_file(
        "app/admin/categories/[id]/category-edit-client.tsx",
        {"/images/category.jpg": "/placeholder.jpg"},
    ):
        changed.append("app/admin/categories/[id]/category-edit-client.tsx")
    if patch_products_json():
        changed.append("data/products.json")

    print(f"files_changed={len(changed)}")
    for file_path in changed:
        print(file_path)


if __name__ == "__main__":
    main()
