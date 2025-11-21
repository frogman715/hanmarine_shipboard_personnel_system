import pdfplumber
import sys
import os

# Set UTF-8 encoding for output
sys.stdout.reconfigure(encoding='utf-8')

def extract_pdf_text(pdf_path):
    """Extract text from PDF file"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for i, page in enumerate(pdf.pages, 1):
                page_text = page.extract_text()
                if page_text:
                    text += f"\n{'='*80}\n"
                    text += f"PAGE {i}\n"
                    text += f"{'='*80}\n"
                    text += page_text + "\n"
            return text
    except Exception as e:
        return f"Error reading {pdf_path}: {str(e)}"

# PDF files to process
pdf_files = [
    r"C:\Users\askal\Desktop\hanmarine_apps\hanmarine_shipboard_personnel_system\docs\HGQS MAIN MANUAL (REV).pdf",
    r"C:\Users\askal\Desktop\hanmarine_apps\hanmarine_shipboard_personnel_system\docs\HGQS PROCEDURES MANUAL (Rev).pdf",
    r"C:\Users\askal\Desktop\hanmarine_apps\hanmarine_shipboard_personnel_system\docs\flow peneriman crew.pdf"
]

for pdf_file in pdf_files:
    print(f"\n\n{'#'*100}")
    print(f"# DOCUMENT: {os.path.basename(pdf_file)}")
    print(f"{'#'*100}\n")
    
    if os.path.exists(pdf_file):
        text = extract_pdf_text(pdf_file)
        print(text)
    else:
        print(f"File not found: {pdf_file}")
