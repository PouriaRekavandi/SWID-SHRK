import { jsPDF } from 'jspdf';
import { PaperAnalysisResult } from '../types';

export function exportPaperAnalysisToPDF(analysis: PaperAnalysisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 22) {
      doc.addPage();
      y = margin + 8;
    }
  };

  // Header Bar (Page 1)
  doc.setFillColor(8, 12, 22);
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Accent edge line
  doc.setFillColor(0, 230, 118);
  doc.rect(margin, y, 3, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 230, 118);
  doc.text('SWID-SHRK RESEARCH LAB // ACADEMIC PAPER EVALUATION', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 210, 230);
  doc.text(
    `5-Dimension Academic Rigor Assessment • Powered by Google Gemini (${analysis.modelUsed})`,
    margin + 6,
    y + 15
  );
  doc.text(
    `Analysis Date: ${new Date(analysis.analyzedAt).toLocaleDateString()} • Format: ${analysis.sourceType.toUpperCase()}`,
    margin + 6,
    y + 20
  );

  y += 30;

  // Paper Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(analysis.paperTitle, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6.5 + 2;

  // Authors & Venue
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const metaLines = doc.splitTextToSize(
    `Authors: ${analysis.authors} | Target/Venue: ${analysis.journalOrConference || 'Scientific Literature'} (${analysis.publicationYear || '2025'})`,
    contentWidth
  );
  doc.text(metaLines, margin, y);
  y += metaLines.length * 4.8 + 4;

  // Keywords pills text
  if (analysis.keywords && analysis.keywords.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(2, 132, 199);
    doc.text(`KEYWORDS: ${analysis.keywords.join('  •  ')}`, margin, y);
    y += 7;
  }

  // Executive Summary Box
  checkPageBreak(35);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('EXECUTIVE RESEARCH SUMMARY', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const execLines = doc.splitTextToSize(analysis.executiveSummary, contentWidth - 8);
  doc.text(execLines, margin + 4, y + 12);
  y += Math.max(26, execLines.length * 4.2 + 10) + 4;

  // Critical Takeaway Banner
  checkPageBreak(22);
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87);
  doc.text('CRITICAL TAKEAWAY:', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(6, 78, 59);
  const takeawayLines = doc.splitTextToSize(analysis.criticalTakeaway, contentWidth - 8);
  doc.text(takeawayLines, margin + 4, y + 10.5);
  y += Math.max(16, takeawayLines.length * 4.2 + 8) + 6;

  // 5 CORE DIMENSIONS DEFINITIONS
  const dimensionsList = [
    {
      key: 'objective',
      num: '1',
      badge: 'DIMENSION 1: OBJECTIVE & RESEARCH SCOPE',
      data: analysis.dimensions.objective,
      color: [14, 165, 233], // Sky blue
    },
    {
      key: 'researchGap',
      num: '2',
      badge: 'DIMENSION 2: RESEARCH GAP & NOVELTY',
      data: analysis.dimensions.researchGap,
      color: [249, 115, 22], // Orange
    },
    {
      key: 'methodology',
      num: '3',
      badge: 'DIMENSION 3: METHODOLOGY & EXPERIMENTAL FRAMEWORK',
      data: analysis.dimensions.methodology,
      color: [139, 92, 246], // Purple
    },
    {
      key: 'findings',
      num: '4',
      badge: 'DIMENSION 4: KEY FINDINGS & QUANTITATIVE DISCOVERIES',
      data: analysis.dimensions.findings,
      color: [16, 185, 129], // Emerald
    },
    {
      key: 'futureGaps',
      num: '5',
      badge: 'DIMENSION 5: FUTURE GAPS & OPEN DIRECTIONS',
      data: analysis.dimensions.futureGaps,
      color: [236, 72, 153], // Pink/Rose
    },
  ];

  dimensionsList.forEach((dim) => {
    checkPageBreak(30);

    // Dimension Header
    doc.setFillColor(dim.color[0], dim.color[1], dim.color[2]);
    doc.rect(margin, y, contentWidth, 7.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(dim.badge, margin + 4, y + 5.2);
    y += 11;

    // Dimension Title & Summary
    if (dim.data?.title && dim.data.title !== dim.badge) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(dim.data.title, margin, y);
      y += 5.5;
    }

    if (dim.data?.summary) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const sumLines = doc.splitTextToSize(dim.data.summary, contentWidth);
      checkPageBreak(sumLines.length * 4.2 + 4);
      doc.text(sumLines, margin, y);
      y += sumLines.length * 4.2 + 3.5;
    }

    // Bullet points
    if (dim.data?.bulletPoints && dim.data.bulletPoints.length > 0) {
      dim.data.bulletPoints.forEach((point) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);

        const pointLines = doc.splitTextToSize(point, contentWidth - 7);
        checkPageBreak(pointLines.length * 4 + 2);

        // Custom square bullet
        doc.setFillColor(dim.color[0], dim.color[1], dim.color[2]);
        doc.rect(margin + 1, y + 1.2, 1.8, 1.8, 'F');

        doc.text(pointLines, margin + 5.5, y + 2.8);
        y += pointLines.length * 4 + 2;
      });
      y += 2;
    }

    // Subsections
    if (dim.data?.subsections && dim.data.subsections.length > 0) {
      dim.data.subsections.forEach((sub) => {
        checkPageBreak(16);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(dim.color[0], dim.color[1], dim.color[2]);
        doc.text(`• ${sub.subtitle}`, margin + 2, y + 2);
        y += 5;

        sub.content.forEach((item) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          const itemLines = doc.splitTextToSize(item, contentWidth - 8);
          checkPageBreak(itemLines.length * 4 + 1.5);
          doc.text(itemLines, margin + 6, y + 1);
          y += itemLines.length * 4 + 2;
        });
      });
      y += 2;
    }

    y += 5;
  });

  // Stamp Footers and Page Numbers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'SWID-SHRK Mechanical & Aerospace Research Lab • umbc.edu • Academic Paper Analyzer',
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 22, pageHeight - 7);
  }

  // Generate safe filename and trigger download
  const cleanTitle = (analysis.paperTitle || 'academic_paper_analysis')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 40);

  doc.save(`${cleanTitle}_swid_analysis.pdf`);
}
