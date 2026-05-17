from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
EXTS = {".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".mjs", ".cjs", ".css", ".scss"}
SKIP = {".git", "node_modules", ".next"}
PATTERN = re.compile(r"/(?:images|videos|docs)/[^\"'`\s)<>]+")


def main() -> None:
    refs = set()
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP for part in path.parts):
            continue
        if path.suffix.lower() not in EXTS:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue
        refs.update(PATTERN.findall(text))

    missing = sorted(ref for ref in refs if not (PUBLIC / ref.lstrip("/")).exists())
    print(f"refs_total={len(refs)}")
    print(f"missing_total={len(missing)}")
    for ref in missing:
        print(ref)


if __name__ == "__main__":
    main()
