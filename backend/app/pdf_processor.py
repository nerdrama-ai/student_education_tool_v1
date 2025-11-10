# backend/app/pdf_processor.py
import fitz  # PyMuPDF
from pdf2image import convert_from_bytes
import pytesseract
from io import BytesIO
from typing import List, Dict
from PIL import Image
import re

def extract_text_and_images(pdf_bytes: bytes, max_pages: int = 20) -> List[Dict]:
    """
    Returns list of {'page': int, 'text': str, 'images': [PIL.Image]}
    We limit pages processed to max_pages for token cost control; but default allows 20.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    out = []
    total_pages = doc.page_count
    pages_to_process = min(total_pages, max_pages)
    for pno in range(pages_to_process):
        page = doc.load_page(pno)
        text = page.get_text("text")
        # Basic cleanup: remove header/footers heuristically
        text = _cleanup_text(text)
        images = []
        # Extract images from page
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            im = Image.open(BytesIO(image_bytes)).convert("RGB")
            images.append(im)
        # If page text is empty / images present, run OCR on rasterized page as fallback
        if not text.strip() and total_pages:
            pil_pages = convert_from_bytes(pdf_bytes, first_page=pno+1, last_page=pno+1, size=1200)
            if pil_pages:
                ocr_text = pytesseract.image_to_string(pil_pages[0])
                ocr_text = _cleanup_text(ocr_text)
                text = ocr_text
        out.append({"page": pno+1, "text": text, "images": images})
    return out

def _cleanup_text(s: str) -> str:
    # Remove multiple blank lines, likely header/footer lines by pattern
    s = re.sub(r'\n\s*\n+', '\n\n', s)
    # Remove lines like "Page 1 of 10" heuristically
    s = re.sub(r'Page \d+ of \d+', '', s, flags=re.IGNORECASE)
    s = s.strip()
    return s

def chunks_from_pages(pages: List[Dict], max_chars: int = 2000) -> List[Dict]:
    """
    Create chunks suitable for LLM prompting: combine page text but keep under max_chars.
    Each chunk: {'page': primary_page_int_or_null, 'text': '...'}
    """
    chunks = []
    cur_text = ""
    cur_pages = []
    for p in pages:
        t = p.get("text","").strip()
        if not t:
            continue
        if len(cur_text) + len(t) > max_chars:
            if cur_text:
                chunks.append({"page": cur_pages[0] if cur_pages else None, "text": cur_text})
            cur_text = t
            cur_pages = [p["page"]]
        else:
            if cur_text:
                cur_text += "\n\n" + t
            else:
                cur_text = t
            cur_pages.append(p["page"])
    if cur_text:
        chunks.append({"page": cur_pages[0] if cur_pages else None, "text": cur_text})
    return chunks
