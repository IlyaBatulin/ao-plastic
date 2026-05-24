import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES_DIR = ROOT / "public" / "files"

def extract_text(docx_path: Path) -> str:
    with zipfile.ZipFile(docx_path) as z:
        xml = z.read("word/document.xml").decode("utf-8", errors="ignore")
    text = re.sub(r"</w:p>", "\n", xml)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def main():
    for docx in sorted(FILES_DIR.glob("*.docx")):
        text = extract_text(docx)
        out = FILES_DIR / (docx.stem + ".txt")
        out.write_text(text, encoding="utf-8")
        domains = sorted(
            set(
                re.findall(
                    r"(?:https?://)?(?:www\.)?([a-z0-9.-]+\.(?:ru|com|org|рф))",
                    text,
                    re.I,
                )
            )
        )
        urls = sorted(set(re.findall(r"https?://[^\s\"']+", text, re.I)))
        print(docx.name)
        print("  domains:", domains)
        print("  urls:", urls[:20])
        print("  chars:", len(text))
        print()

if __name__ == "__main__":
    main()
