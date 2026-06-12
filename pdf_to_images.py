"""
PDF를 페이지별 이미지(PNG)로 변환하는 스크립트

사용법:
  python pdf_to_images.py <PDF폴더경로>
  python pdf_to_images.py <PDF폴더경로> --dpi 300
  python pdf_to_images.py <PDF폴더경로> --output <출력폴더>

예시:
  python pdf_to_images.py 통계학개론/강의록
  python pdf_to_images.py 대학기초수학/강의록 --dpi 300
"""
import os
import sys
import argparse
import fitz  # PyMuPDF


def convert_pdf_to_images(pdf_path, output_folder, dpi=200):
    """PDF 파일을 페이지별 PNG 이미지로 변환"""
    doc = fitz.open(pdf_path)
    pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]

    pdf_output = os.path.join(output_folder, pdf_name)
    os.makedirs(pdf_output, exist_ok=True)

    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)

    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=matrix)

        output_path = os.path.join(pdf_output, f"page_{page_num + 1:03d}.png")
        pix.save(output_path)
        print(f"  [{page_num + 1}/{len(doc)}] {output_path}")

    page_count = len(doc)
    doc.close()
    return page_count


def main():
    parser = argparse.ArgumentParser(description="PDF to PNG converter")
    parser.add_argument("pdf_dir", help="PDF files folder path")
    parser.add_argument("--output", "-o", default=None, help="Output folder (default: <pdf_dir>_images)")
    parser.add_argument("--dpi", type=int, default=200, help="Resolution (default: 200)")
    args = parser.parse_args()

    pdf_dir = os.path.abspath(args.pdf_dir)
    output_dir = args.output or (pdf_dir.rstrip("/\\") + "_images")

    if not os.path.exists(pdf_dir):
        print(f"Error: folder not found: {pdf_dir}")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    pdf_files = sorted([f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")])

    if not pdf_files:
        print(f"Error: no PDF files in {pdf_dir}")
        sys.exit(1)

    print(f"=== PDF -> PNG ===")
    print(f"Input:  {pdf_dir}")
    print(f"Output: {output_dir}")
    print(f"DPI:    {args.dpi}")
    print(f"Files:  {len(pdf_files)}\n")

    total_pages = 0
    for pdf_file in pdf_files:
        pdf_name = os.path.splitext(pdf_file)[0]
        pdf_output = os.path.join(output_dir, pdf_name)
        if os.path.exists(pdf_output) and os.listdir(pdf_output):
            print(f"[skip] {pdf_file} (already converted)")
            continue
        pdf_path = os.path.join(pdf_dir, pdf_file)
        print(f"[convert] {pdf_file}")
        pages = convert_pdf_to_images(pdf_path, output_dir, args.dpi)
        total_pages += pages
        print()

    print(f"[done] {total_pages} pages converted")
    print(f"[path] {output_dir}")


if __name__ == "__main__":
    main()
