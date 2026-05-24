"""
Подготовка юридических документов: замена домена и конвертация DOCX → PDF.
Требуется Microsoft Word (Windows) для docx2pdf.
"""
from __future__ import annotations

import re
import shutil
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "public" / "files"
OUT_DIR = ROOT / "public" / "docs" / "legal"

SITE_URL = "https://www.aoplastic.com"
SITE_HOST = "www.aoplastic.com"
CONTACT_EMAIL = "info@oaplastic.ru"
CONTACT_PHONE = "+7 (495) 201-03-33"

MAPPING = [
    (
        "Proekt_Politika_o_konfidentsialnosti_AO_PLASTIK.docx",
        "politika-konfidentsialnosti.pdf",
    ),
    (
        "Proekt_Polzovatelskoe_soglashenie.docx",
        "polzovatelskoe-soglashenie.pdf",
    ),
    (
        "Proekt_Soglasie_na_obrabotku_personalnykh_dannykh.docx",
        "soglasie-na-obrabotku-personalnykh-dannykh.pdf",
    ),
]

REPLACEMENTS = [
    ("https://oaoplastic.ru/", SITE_URL + "/"),
    ("https://oaoplastic.ru", SITE_URL),
    ("http://oaoplastic.ru/", SITE_URL + "/"),
    ("http://oaoplastic.ru", SITE_URL),
    ("oaoplastic.ru", SITE_HOST),
    ("электронную почту _____________", f"электронную почту {CONTACT_EMAIL}"),
    ("эл. почта _____________", f"эл. почта {CONTACT_EMAIL}"),
    ("тел. _____________", f"тел. {CONTACT_PHONE}"),
]


def patch_docx_xml(xml: str) -> str:
    for old, new in REPLACEMENTS:
        xml = xml.replace(old, new)
    # HYPERLINK artifacts from Word export
    xml = re.sub(
        r'HYPERLINK\s+"https://www\.aoplastic\.com/?"\s*',
        "",
        xml,
        flags=re.I,
    )
    return xml


def prepare_docx(src: Path, dst_docx: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        with zipfile.ZipFile(src, "r") as zin:
            zin.extractall(tmp_path)

        for rel_path in ["word/document.xml", "word/header1.xml", "word/footer1.xml"]:
            file_path = tmp_path / rel_path
            if not file_path.exists():
                continue
            content = file_path.read_text(encoding="utf-8")
            file_path.write_text(patch_docx_xml(content), encoding="utf-8")

        dst_docx.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(dst_docx, "w", zipfile.ZIP_DEFLATED) as zout:
            for file_path in sorted(tmp_path.rglob("*")):
                if file_path.is_file():
                    zout.write(file_path, file_path.relative_to(tmp_path).as_posix())


def convert_to_pdf(docx_path: Path, pdf_path: Path) -> None:
    from docx2pdf import convert

    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    convert(str(docx_path), str(pdf_path))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)

        for src_name, pdf_name in MAPPING:
            src = SRC_DIR / src_name
            if not src.exists():
                print(f"SKIP missing: {src_name}")
                continue

            patched = tmp_dir / src_name
            prepare_docx(src, patched)
            pdf_out = OUT_DIR / pdf_name
            print(f"Converting {src_name} -> {pdf_name}...")
            convert_to_pdf(patched, pdf_out)
            print(f"  OK {pdf_out.stat().st_size // 1024} KB")

    print("Done:", OUT_DIR)


if __name__ == "__main__":
    main()
