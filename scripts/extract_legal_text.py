"""
Извлечение полного текста юридических DOCX → JSON (lib/legal-content).
Запуск: python scripts/extract_legal_text.py
"""
from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "public" / "files"
OUT_DIR = ROOT / "lib" / "legal-content"

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

SITE_URL = "https://www.aoplastic.com"
SITE_HOST = "www.aoplastic.com"
CONTACT_EMAIL = "info@oaplastic.ru"
CONTACT_PHONE = "+7 (495) 201-03-33"

REPLACEMENTS = [
    ("https://oaoplastic.ru/", f"{SITE_URL}/"),
    ("https://oaoplastic.ru", SITE_URL),
    ("http://oaoplastic.ru/", f"{SITE_URL}/"),
    ("http://oaoplastic.ru", SITE_URL),
    ("oaoplastic.ru", SITE_HOST),
    ("на электронную почту _____________", f"на электронную почту {CONTACT_EMAIL}"),
    ("электронную почту _____________", f"электронную почту {CONTACT_EMAIL}"),
    ("эл. почта _____________", f"эл. почта {CONTACT_EMAIL}"),
    ("тел. _____________", f"тел. {CONTACT_PHONE}"),
]

MAPPING = {
    "privacy-policy": "Proekt_Politika_o_konfidentsialnosti_AO_PLASTIK.docx",
    "terms": "Proekt_Polzovatelskoe_soglashenie.docx",
    "personal-data-consent": "Proekt_Soglasie_na_obrabotku_personalnykh_dannykh.docx",
}


def patch_text(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = re.sub(
        r'HYPERLINK\s+"https://www\.aoplastic\.com/?"\s*',
        "",
        text,
        flags=re.I,
    )
    return text


def extract_paragraphs(docx_path: Path) -> list[str]:
    with zipfile.ZipFile(docx_path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    for old, new in REPLACEMENTS:
        xml = xml.replace(old, new)

    root = ET.fromstring(xml)
    paragraphs: list[str] = []
    for p in root.iter(W + "p"):
        parts: list[str] = []
        for t in p.iter(W + "t"):
            if t.text:
                parts.append(t.text)
            if t.tail:
                parts.append(t.tail)
        line = patch_text("".join(parts).strip())
        if line:
            paragraphs.append(line)
    return paragraphs


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for key, filename in MAPPING.items():
        src = SRC_DIR / filename
        if not src.exists():
            print(f"SKIP missing: {filename}")
            continue
        paras = extract_paragraphs(src)
        out = OUT_DIR / f"{key}.json"
        out.write_text(json.dumps(paras, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{key}: {len(paras)} paragraphs -> {out}")


if __name__ == "__main__":
    main()
