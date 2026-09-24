"""Build the downloadable Russian website terms from the same JSON as the page."""

from html import escape
import json
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "lib/legal-content/terms.json"
OUTPUT = ROOT / "public/docs/legal/polzovatelskoe-soglashenie.pdf"


def draw_page(canvas, document):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(colors.HexColor("#dbe3f0"))
    canvas.line(19 * mm, 274 * mm, width - 19 * mm, 274 * mm)
    canvas.setFont("Arial", 8)
    canvas.setFillColor(colors.HexColor("#61728c"))
    canvas.drawString(20 * mm, 279 * mm, "АО «Пластик»  |  aoplastic.com")
    canvas.drawCentredString(width / 2, 15 * mm, f"Страница {document.page}")
    canvas.restoreState()


def main():
    pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
    pdfmetrics.registerFont(TTFont("ArialBold", "C:/Windows/Fonts/arialbd.ttf"))
    paragraphs = json.loads(SOURCE.read_text(encoding="utf-8"))
    title = ParagraphStyle(
        "title", fontName="ArialBold", fontSize=18, leading=23,
        alignment=TA_CENTER, textColor=colors.HexColor("#173b88"),
        spaceAfter=8 * mm,
    )
    section = ParagraphStyle(
        "section", fontName="ArialBold", fontSize=11, leading=16,
        alignment=TA_LEFT, textColor=colors.HexColor("#173b88"),
        spaceBefore=5 * mm, spaceAfter=2 * mm,
    )
    body = ParagraphStyle(
        "body", fontName="Arial", fontSize=9, leading=13.2,
        alignment=TA_LEFT, textColor=colors.HexColor("#212b3d"),
        spaceAfter=2 * mm,
    )
    story = []
    for index, item in enumerate(paragraphs):
        text = escape(item.replace("\u00a0", " "))
        style = title if index == 0 else section if re.match(r"^[1-9]\. [^0-9]", item) else body
        story.append(Paragraph(text, style))
        if index == 0:
            story.append(Spacer(1, 3 * mm))

    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4, leftMargin=20 * mm,
        rightMargin=20 * mm, topMargin=30 * mm, bottomMargin=22 * mm,
        title="Пользовательское соглашение АО «Пластик»",
        author="АО «Пластик»", subject="Условия использования сайта",
    )
    document.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    print(f"Generated {OUTPUT} from {SOURCE}")


if __name__ == "__main__":
    main()
