import { Publication } from '../types';

export type CitationStyle = 'bibtex' | 'apa' | 'ieee' | 'chicago' | 'harvard' | 'mla' | 'ris';
export type CitationKeyStyle = 'authorYear' | 'authorYearTitle' | 'authorYearJournal';

interface ParsedBibtexFields {
  type: string;
  key: string;
  title?: string;
  author?: string;
  journal?: string;
  volume?: string;
  number?: string;
  pages?: string;
  year?: string;
  publisher?: string;
  doi?: string;
  url?: string;
}

export function parseBibtex(raw?: string): ParsedBibtexFields {
  if (!raw) return { type: 'article', key: 'citation' };

  const typeMatch = raw.match(/@(\w+)\s*\{\s*([^,]+),/);
  const type = typeMatch ? typeMatch[1].toLowerCase() : 'article';
  const key = typeMatch ? typeMatch[2].trim() : 'citation';

  const extractField = (name: string): string | undefined => {
    const regex = new RegExp(`${name}\\s*=\\s*[{"]([^}"]+)[}"]`, 'i');
    const m = raw.match(regex);
    return m ? m[1].trim() : undefined;
  };

  return {
    type,
    key,
    title: extractField('title'),
    author: extractField('author'),
    journal: extractField('journal') || extractField('booktitle'),
    volume: extractField('volume'),
    number: extractField('number'),
    pages: extractField('pages'),
    year: extractField('year'),
    publisher: extractField('publisher'),
    doi: extractField('doi'),
    url: extractField('url'),
  };
}

export function generateCitationKey(pub: Publication, style: CitationKeyStyle = 'authorYear', customKey?: string): string {
  if (customKey && customKey.trim()) {
    return customKey.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  }

  // Extract first author surname
  const firstAuthor = pub.authors.split(',')[0].trim().split(' ').pop() || 'author';
  const cleanSurname = firstAuthor.toLowerCase().replace(/[^a-z0-9]/g, '');
  const year = pub.year;

  if (style === 'authorYearJournal') {
    const journalKey = pub.journal.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${cleanSurname}${year}${journalKey}`;
  }

  if (style === 'authorYearTitle') {
    const firstWord = pub.title.split(/\s+/).find((w) => w.length > 3)?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'work';
    return `${cleanSurname}${year}${firstWord}`;
  }

  // Default: authorYear with title keyword if multiple
  const titleSlug = pub.title.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanSurname}${year}${titleSlug}`;
}

export function formatBibTeX(pub: Publication, keyStyle: CitationKeyStyle = 'authorYear', customKey?: string): string {
  const parsed = parseBibtex(pub.bibtex);
  const key = generateCitationKey(pub, keyStyle, customKey);

  const title = parsed.title || pub.title;
  const author = parsed.author || pub.authors.replace(/\bet al\.?/i, 'and others');
  const journal = parsed.journal || pub.journal;
  const year = parsed.year || String(pub.year);
  const doi = pub.doi || parsed.doi;
  const url = pub.url;

  const lines = [
    `@article{${key},`,
    `  title={${title}},`,
    `  author={${author}},`,
    `  journal={${journal}},`,
  ];

  if (parsed.volume) lines.push(`  volume={${parsed.volume}},`);
  if (parsed.number) lines.push(`  number={${parsed.number}},`);
  if (parsed.pages) lines.push(`  pages={${parsed.pages}},`);
  lines.push(`  year={${year}},`);
  if (doi) lines.push(`  doi={${doi}},`);
  if (url && url !== 'https://swid-shrk.umbc.edu/') lines.push(`  url={${url}},`);
  if (parsed.publisher) lines.push(`  publisher={${parsed.publisher}}`);
  else lines.push(`  publisher={SWID-SHRK Lab}`);

  return lines.join('\n') + '\n}';
}

export function formatAPA(pub: Publication): string {
  const parsed = parseBibtex(pub.bibtex);
  const volPart = parsed.volume ? `, ${parsed.volume}` : '';
  const numPart = parsed.number ? `(${parsed.number})` : '';
  const pagesPart = parsed.pages ? `, ${parsed.pages.replace('--', '–')}` : '';
  const doiPart = pub.doi ? ` https://doi.org/${pub.doi}` : '';

  return `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}${volPart}${numPart}${pagesPart}.${doiPart}`;
}

export function formatIEEE(pub: Publication, index: number = 1): string {
  const parsed = parseBibtex(pub.bibtex);
  const volPart = parsed.volume ? `, vol. ${parsed.volume}` : '';
  const numPart = parsed.number ? `, no. ${parsed.number}` : '';
  const pagesPart = parsed.pages ? `, pp. ${parsed.pages.replace('--', '–')}` : '';
  const doiPart = pub.doi ? `, doi: ${pub.doi}` : '';

  return `[${index}] ${pub.authors}, "${pub.title}," ${pub.journal}${volPart}${numPart}${pagesPart}, ${pub.year}${doiPart}.`;
}

export function formatChicago(pub: Publication): string {
  const parsed = parseBibtex(pub.bibtex);
  const volPart = parsed.volume ? ` ${parsed.volume}` : '';
  const numPart = parsed.number ? `, no. ${parsed.number}` : '';
  const pagesPart = parsed.pages ? `: ${parsed.pages.replace('--', '–')}` : '';
  const doiPart = pub.doi ? ` https://doi.org/${pub.doi}.` : '';

  return `${pub.authors}. ${pub.year}. "${pub.title}." ${pub.journal}${volPart}${numPart}${pagesPart}.${doiPart}`;
}

export function formatHarvard(pub: Publication): string {
  const parsed = parseBibtex(pub.bibtex);
  const volPart = parsed.volume ? `, ${parsed.volume}` : '';
  const numPart = parsed.number ? `(${parsed.number})` : '';
  const pagesPart = parsed.pages ? `, pp.${parsed.pages.replace('--', '–')}` : '';
  const doiPart = pub.doi ? ` Available at: https://doi.org/${pub.doi}.` : '';

  return `${pub.authors}, ${pub.year}. '${pub.title}', ${pub.journal}${volPart}${numPart}${pagesPart}.${doiPart}`;
}

export function formatMLA(pub: Publication): string {
  const parsed = parseBibtex(pub.bibtex);
  const volPart = parsed.volume ? `, vol. ${parsed.volume}` : '';
  const numPart = parsed.number ? `, no. ${parsed.number}` : '';
  const pagesPart = parsed.pages ? `, pp. ${parsed.pages.replace('--', '–')}` : '';
  const doiPart = pub.doi ? `, doi:${pub.doi}` : '';

  return `${pub.authors}. "${pub.title}." ${pub.journal}${volPart}${numPart}, ${pub.year}${pagesPart}${doiPart}.`;
}

export function formatRIS(pub: Publication): string {
  const parsed = parseBibtex(pub.bibtex);
  const lines: string[] = [
    'TY  - JOUR',
    `TI  - ${pub.title}`,
  ];

  // Authors
  pub.authors.split(',').forEach((author) => {
    const trimmed = author.trim().replace(/\bet al\.?/i, '');
    if (trimmed) lines.push(`AU  - ${trimmed}`);
  });

  lines.push(`JO  - ${pub.journal}`);
  lines.push(`PY  - ${pub.year}`);

  if (parsed.volume) lines.push(`VL  - ${parsed.volume}`);
  if (parsed.number) lines.push(`IS  - ${parsed.number}`);
  if (parsed.pages) {
    const [sp, ep] = parsed.pages.split(/[-–—]+/);
    if (sp) lines.push(`SP  - ${sp.trim()}`);
    if (ep) lines.push(`EP  - ${ep.trim()}`);
  }
  if (pub.doi) lines.push(`DO  - ${pub.doi}`);
  if (pub.url) lines.push(`UR  - ${pub.url}`);
  if (pub.abstract) lines.push(`AB  - ${pub.abstract}`);
  if (pub.keywords && pub.keywords.length > 0) {
    pub.keywords.forEach((kw) => lines.push(`KW  - ${kw}`));
  }
  lines.push('ER  -');

  return lines.join('\n');
}

export function formatPublication(
  pub: Publication,
  style: CitationStyle,
  index: number = 1,
  keyStyle: CitationKeyStyle = 'authorYear',
  customKey?: string
): string {
  switch (style) {
    case 'bibtex':
      return formatBibTeX(pub, keyStyle, customKey);
    case 'apa':
      return formatAPA(pub);
    case 'ieee':
      return formatIEEE(pub, index);
    case 'chicago':
      return formatChicago(pub);
    case 'harvard':
      return formatHarvard(pub);
    case 'mla':
      return formatMLA(pub);
    case 'ris':
      return formatRIS(pub);
    default:
      return formatAPA(pub);
  }
}

export function formatMultiplePublications(
  pubs: Publication[],
  style: CitationStyle,
  keyStyle: CitationKeyStyle = 'authorYear'
): string {
  if (pubs.length === 0) return '';

  if (style === 'bibtex') {
    return pubs.map((p) => formatBibTeX(p, keyStyle)).join('\n\n');
  }

  if (style === 'ris') {
    return pubs.map((p) => formatRIS(p)).join('\n\n');
  }

  // Text citations
  return pubs.map((p, idx) => formatPublication(p, style, idx + 1, keyStyle)).join('\n\n');
}

export function downloadCitationFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
