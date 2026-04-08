import { PDFDocument } from 'pdf-lib'

// PDF 파일의 페이지 수만 빠르게 추출 (실제 렌더링 없이 메타데이터만 읽음)
export async function getPdfPageCount(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  return pdfDoc.getPageCount()
}
