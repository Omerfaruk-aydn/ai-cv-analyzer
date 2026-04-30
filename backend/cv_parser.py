import fitz  # PyMuPDF
import io

def parse_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.
    """
    text = ""
    try:
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            text += page.get_text()
        return text.strip()
    except Exception as e:
        raise Exception(f"Error parsing PDF: {str(e)}")
