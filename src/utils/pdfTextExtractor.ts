import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pako from 'pako';

export interface ExtractedPDFResult {
  fullText: string;
  pageCount: number;
  metaTitle: string;
  metaAuthor: string;
  metaSubject: string;
  pages: { pageNumber: number; text: string }[];
  detectedTitle?: string;
  detectedAbstract?: string;
}

/**
 * Configure PDF.js worker safely for both browser and SSR / Node environments
 */
function setupWorker() {
  try {
    if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        // Use CDN worker matching pdfjs-dist version as fallback or empty string
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      }
    }
  } catch (e) {
    console.warn('PDF.js worker setup note:', e);
  }
}

setupWorker();

/**
 * Robust extraction of text from any PDF ArrayBuffer or Uint8Array
 * Handles modern PDF formats (CID fonts, ToUnicode CMaps, Object streams, multiple pages)
 */
export async function extractTextFromPDFData(
  data: Uint8Array | ArrayBuffer
): Promise<ExtractedPDFResult> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);

  let fullText = '';
  let metaTitle = '';
  let metaAuthor = '';
  let metaSubject = '';
  const pages: { pageNumber: number; text: string }[] = [];

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: bytes,
      useWorkerFetch: false,
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;

    // Try reading metadata
    try {
      const metadata = await pdfDoc.getMetadata();
      const info = (metadata?.info || {}) as any;
      if (info?.Title && typeof info.Title === 'string' && info.Title.trim().length > 3) {
        metaTitle = info.Title.trim();
      }
      if (info?.Author && typeof info.Author === 'string' && info.Author.trim().length > 2) {
        metaAuthor = info.Author.trim();
      }
      if (info?.Subject && typeof info.Subject === 'string' && info.Subject.trim().length > 3) {
        metaSubject = info.Subject.trim();
      }
    } catch (metaErr) {
      console.warn('Could not read PDF metadata info:', metaErr);
    }

    // Extract text page by page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageStrings: string[] = [];

        for (const item of textContent.items) {
          if ('str' in item && typeof item.str === 'string') {
            const str = item.str;
            if (str && str.trim()) {
              pageStrings.push(str);
            } else if (str === ' ') {
              pageStrings.push(' ');
            }
          }
        }

        const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim();
        pages.push({ pageNumber: pageNum, text: pageText });
        if (pageText) {
          fullText += (fullText ? '\n\n' : '') + `--- Page ${pageNum} ---\n` + pageText;
        }
      } catch (pageErr) {
        console.warn(`Error extracting page ${pageNum}:`, pageErr);
      }
    }

    if (fullText.trim().length > 50) {
      return {
        fullText: fullText.trim(),
        pageCount,
        metaTitle,
        metaAuthor,
        metaSubject,
        pages,
      };
    }
  } catch (pdfjsErr) {
    console.warn('PDF.js extraction failed, falling back to stream decomp: ', pdfjsErr);
  }

  // Fallback to stream decompression if PDF.js encountered an issue
  return fallbackDecompressPDF(bytes, metaTitle, metaAuthor, metaSubject);
}

/**
 * Fallback decompression using pako for raw flate streams
 */
function fallbackDecompressPDF(
  bytes: Uint8Array,
  existingTitle: string = '',
  existingAuthor: string = '',
  existingSubject: string = ''
): ExtractedPDFResult {
  let binary = '';
  const chunkSize = 16384;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }

  let metaTitle = existingTitle;
  let metaAuthor = existingAuthor;
  let metaSubject = existingSubject;

  if (!metaTitle) {
    const titleMatch = binary.match(/\/Title\s*\(([^()]+)\)/i);
    if (titleMatch && titleMatch[1]) metaTitle = titleMatch[1].trim();
  }
  if (!metaAuthor) {
    const authorMatch = binary.match(/\/Author\s*\(([^()]+)\)/i);
    if (authorMatch && authorMatch[1]) metaAuthor = authorMatch[1].trim();
  }

  const pieces: string[] = [];
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let m: RegExpExecArray | null;

  while ((m = streamRegex.exec(binary)) !== null) {
    const raw = m[1];
    const rawBytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) rawBytes[i] = raw.charCodeAt(i);

    let decomp = '';
    try {
      decomp = pako.inflate(rawBytes, { to: 'string' });
    } catch {
      try {
        decomp = pako.inflateRaw(rawBytes, { to: 'string' });
      } catch {
        decomp = raw;
      }
    }

    if (decomp) {
      const tjMatches = decomp.match(/\(([^()]*)\)\s*Tj/g);
      if (tjMatches) {
        for (const tj of tjMatches) {
          const t = tj.replace(/^.*\(/, '').replace(/\)\s*Tj$/, '').trim();
          if (t && t.length > 1 && !t.includes('\x00')) {
            pieces.push(t);
          }
        }
      }
      const tjArrayMatches = decomp.match(/\[([\s\S]*?)\]\s*TJ/g);
      if (tjArrayMatches) {
        for (const arr of tjArrayMatches) {
          const inMatches = arr.match(/\(([^()]*)\)/g);
          if (inMatches) {
            for (const im of inMatches) {
              const clean = im.slice(1, -1).trim();
              if (clean.length > 0 && !clean.includes('\x00')) {
                pieces.push(clean);
              }
            }
          }
        }
      }
    }
  }

  const fallbackText = pieces.join(' ').replace(/\s+/g, ' ').trim();
  return {
    fullText: fallbackText,
    pageCount: Math.max(1, Math.round(fallbackText.length / 2500)),
    metaTitle,
    metaAuthor,
    metaSubject,
    pages: [{ pageNumber: 1, text: fallbackText }],
  };
}

/**
 * Extracts text from Base64 string (browser or server)
 */
export async function extractTextFromPDFBase64Async(
  base64String: string
): Promise<ExtractedPDFResult> {
  const cleanBase64 = base64String.replace(/^data:application\/pdf;base64,/, '').replace(/\s+/g, '');
  let binaryStr = '';
  if (typeof atob === 'function') {
    binaryStr = atob(cleanBase64);
  } else if (typeof globalThis !== 'undefined' && (globalThis as any).Buffer) {
    binaryStr = (globalThis as any).Buffer.from(cleanBase64, 'base64').toString('binary');
  }

  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return extractTextFromPDFData(bytes);
}

/**
 * Extracts text directly from a browser File object
 */
export async function extractTextFromPDFFile(file: File): Promise<ExtractedPDFResult> {
  const arrayBuffer = await file.arrayBuffer();
  return extractTextFromPDFData(arrayBuffer);
}
