import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperAnalysisResult } from '../types';
import { translateAnalysisToPersian } from './persianTranslator';

export type PDFExportLanguage = 'en' | 'fa' | 'bilingual';

/**
 * High-performance vector PDF export for English reports structured into the exact 6 academic sections
 * plus the comprehensive Academic Validation & Replication Appendix placed at the end.
 */
export function exportEnglishVectorPDF(analysis: PaperAnalysisResult): void {
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
    `6-Section Rigorous Academic Decomposition • Model: ${analysis.modelUsed}`,
    margin + 6,
    y + 15
  );
  doc.text(
    `Analysis Date: ${new Date(analysis.analyzedAt).toLocaleDateString()} • Format: ${analysis.sourceType.toUpperCase()} • Citation: ${analysis.paperNameSection?.citation || analysis.paperTitle}`,
    margin + 6,
    y + 20
  );

  y += 30;

  // ==========================================
  // SECTION 1: NAME OF THE CHOSEN PAPERS
  // ==========================================
  checkPageBreak(30);
  doc.setFillColor(14, 165, 233); // Sky Blue
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('01. NAME OF THE CHOSEN PAPERS', margin + 4, y + 5);
  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(analysis.paperTitle, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6 + 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Primary Authors: ${analysis.authors}`, margin, y);
  y += 5;
  doc.text(
    `Publication / Venue: ${analysis.journalOrConference || 'Peer-Reviewed Scientific Literature'} (${analysis.publicationYear || '2025'})`,
    margin,
    y
  );
  y += 5.5;

  if (analysis.paperNameSection?.paperList && analysis.paperNameSection.paperList.length > 1) {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(14, 165, 233);
    doc.text('Included Manuscripts in Comparative Synthesis:', margin, y);
    y += 4.5;

    analysis.paperNameSection.paperList.forEach((p, idx) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      const pLine = `${idx + 1}. "${p.title}" — ${p.authors} (${p.year || '2025'})`;
      const splitP = doc.splitTextToSize(pLine, contentWidth - 4);
      checkPageBreak(splitP.length * 4);
      doc.text(splitP, margin + 2, y);
      y += splitP.length * 4 + 1;
    });
    y += 2;
  }

  // Keywords row
  if (analysis.keywords && analysis.keywords.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`KEYWORDS: ${analysis.keywords.join('  •  ')}`, margin, y);
    y += 7;
  }

  // ==========================================
  // SECTION 2: PURPOSE OF THE PAPERS
  // ==========================================
  checkPageBreak(35);
  doc.setFillColor(37, 99, 235); // Royal Blue
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('02. PURPOSE OF THE PAPERS', margin + 4, y + 5);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const purposeSum = doc.splitTextToSize(
    analysis.purposeSection?.summary || analysis.dimensions.objective.summary,
    contentWidth
  );
  checkPageBreak(purposeSum.length * 4.2);
  doc.text(purposeSum, margin, y);
  y += purposeSum.length * 4.2 + 4;

  if (analysis.purposeSection?.engineeringScope) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235);
    doc.text(`Engineering Scope: `, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const scopeLines = doc.splitTextToSize(analysis.purposeSection.engineeringScope, contentWidth - 32);
    doc.text(scopeLines, margin + 28, y);
    y += scopeLines.length * 4 + 3;
  }

  if (analysis.purposeSection?.hypotheses && analysis.purposeSection.hypotheses.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text('Central Scientific Hypotheses & Targets:', margin, y);
    y += 4;
    analysis.purposeSection.hypotheses.forEach((hyp) => {
      const hLines = doc.splitTextToSize(`• ${hyp}`, contentWidth - 4);
      checkPageBreak(hLines.length * 3.8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(hLines, margin + 2, y);
      y += hLines.length * 3.8 + 1;
    });
    y += 3;
  }

  // ==========================================
  // SECTION 3: RESEARCH GAP & HOW EXTRACTED FROM REFERENCES
  // ==========================================
  checkPageBreak(40);
  doc.setFillColor(234, 88, 12); // Orange / Amber
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('03. RESEARCH GAP AND HOW THE GAP EXTRACTED FROM REFERENCES', margin + 4, y + 5);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const gapSum = doc.splitTextToSize(
    analysis.researchGapSection?.summary || analysis.dimensions.researchGap.summary,
    contentWidth
  );
  checkPageBreak(gapSum.length * 4.2);
  doc.text(gapSum, margin, y);
  y += gapSum.length * 4.2 + 4;

  const refGaps = analysis.researchGapSection?.extractedFromReferences || [];
  if (refGaps.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(194, 65, 12);
    doc.text('Reference-by-Reference Void Deconstruction:', margin, y);
    y += 5;

    refGaps.forEach((item, idx) => {
      checkPageBreak(24);
      doc.setFillColor(255, 247, 237);
      doc.setDrawColor(254, 215, 170);
      doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(154, 52, 18);
      doc.text(`[Ref ${idx + 1}] ${item.reference}`, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Prior Baseline: ${item.priorFindingOrAssumption}`, margin + 3, y + 9.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(180, 83, 9);
      const voidText = doc.splitTextToSize(`Identified Void: ${item.extractedGapOrVoid}`, contentWidth - 6);
      doc.text(voidText, margin + 3, y + 14.5);

      y += 23;
    });
    y += 2;
  }

  // ==========================================
  // SECTION 4: HOW TO ACHIEVE RESULTS (METHODS, INSTRUMENTS, FACILITIES)
  // ==========================================
  checkPageBreak(40);
  doc.setFillColor(124, 58, 237); // Purple
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('04. HOW TO ACHIEVE RESULTS (METHODS, INSTRUMENTS, FACILITIES)', margin + 4, y + 5);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const methodSum = doc.splitTextToSize(
    analysis.methodsAndFacilitiesSection?.summary || analysis.dimensions.methodology.summary,
    contentWidth
  );
  checkPageBreak(methodSum.length * 4.2);
  doc.text(methodSum, margin, y);
  y += methodSum.length * 4.2 + 4;

  const facilities = analysis.methodsAndFacilitiesSection?.facilitiesAndInstruments || [];
  if (facilities.length > 0) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(109, 40, 217);
    doc.text('Experimental Hardware & Laboratory Facilities:', margin, y);
    y += 4.5;

    facilities.forEach((fac) => {
      checkPageBreak(6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(51, 65, 85);
      doc.text(`• ${fac}`, margin + 2, y);
      y += 4;
    });
    y += 2;
  }

  const standards = analysis.methodsAndFacilitiesSection?.testingStandards || [];
  const solvers = analysis.methodsAndFacilitiesSection?.computationalSolvers || [];
  if (standards.length > 0 || solvers.length > 0) {
    checkPageBreak(16);
    if (standards.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Standards: ${standards.join('  |  ')}`, margin, y);
      y += 4.5;
    }
    if (solvers.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Computational Solvers: ${solvers.join('  |  ')}`, margin, y);
      y += 5;
    }
    y += 2;
  }

  // ==========================================
  // SECTION 5: RESULTS
  // ==========================================
  checkPageBreak(35);
  doc.setFillColor(16, 185, 129); // Emerald
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('05. RESULTS', margin + 4, y + 5);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const resSum = doc.splitTextToSize(
    analysis.resultsSection?.summary || analysis.dimensions.findings.summary,
    contentWidth
  );
  checkPageBreak(resSum.length * 4.2);
  doc.text(resSum, margin, y);
  y += resSum.length * 4.2 + 4;

  const quantMetrics = analysis.resultsSection?.quantitativeMetrics || [];
  if (quantMetrics.length > 0) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(4, 120, 87);
    doc.text('Quantitative Metrics & Physical Findings:', margin, y);
    y += 4.5;

    quantMetrics.forEach((m) => {
      const mLines = doc.splitTextToSize(`• ${m}`, contentWidth - 4);
      checkPageBreak(mLines.length * 3.8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(mLines, margin + 2, y);
      y += mLines.length * 3.8 + 1;
    });
    y += 3;
  }

  // ==========================================
  // SECTION 6: PROPOSE FUTURE DIRECTIONS
  // ==========================================
  checkPageBreak(35);
  doc.setFillColor(219, 39, 119); // Pink / Rose
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('06. PROPOSE FUTURE DIRECTIONS', margin + 4, y + 5);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const futureSum = doc.splitTextToSize(
    analysis.futureDirectionsSection?.summary || analysis.dimensions.futureGaps.summary,
    contentWidth
  );
  checkPageBreak(futureSum.length * 4.2);
  doc.text(futureSum, margin, y);
  y += futureSum.length * 4.2 + 4;

  const roadmap = analysis.futureDirectionsSection?.highPriorityRoadmap || [];
  if (roadmap.length > 0) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(190, 24, 93);
    doc.text('High-Priority Research Roadmap:', margin, y);
    y += 4.5;

    roadmap.forEach((r) => {
      const rLines = doc.splitTextToSize(`• ${r}`, contentWidth - 4);
      checkPageBreak(rLines.length * 3.8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(rLines, margin + 2, y);
      y += rLines.length * 3.8 + 1;
    });
    y += 3;
  }

  const unresolved = analysis.futureDirectionsSection?.unresolvedQuestions || [];
  if (unresolved.length > 0) {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(159, 18, 57);
    doc.text('Open Scientific Questions & Boundary Limits:', margin, y);
    y += 4;

    unresolved.forEach((u) => {
      const uLines = doc.splitTextToSize(`? ${u}`, contentWidth - 4);
      checkPageBreak(uLines.length * 3.8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);
      doc.text(uLines, margin + 2, y);
      y += uLines.length * 3.8 + 1;
    });
    y += 3;
  }

  // ==========================================
  // APPENDIX: REPLICATION & VALIDATION BENCHMARK PACKAGE (Placed at end of PDF)
  // ==========================================
  const pkg = analysis.validationPackage;
  if (pkg) {
    doc.addPage();
    y = margin + 4;

    // Header Bar for Validation Appendix
    doc.setFillColor(15, 23, 42); // Dark slate
    doc.rect(margin, y, contentWidth, 16, 'F');
    doc.setFillColor(0, 230, 118); // Emerald accent
    doc.rect(margin, y, 3.5, 16, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 230, 118);
    doc.text('APPENDIX: REPLICATION & VALIDATION BENCHMARK PACKAGE', margin + 6, y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);
    doc.text(
      'Everything required for independent laboratory & numerical replication: Dimensions, Constitutive Models, Boundary Conditions & Code',
      margin + 6,
      y + 12
    );
    y += 22;

    // Summary Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 13, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    const sumLines = doc.splitTextToSize(pkg.summary, contentWidth - 6);
    doc.text(sumLines, margin + 3, y + 5);
    y += 17;

    // 1. Geometrical Dimensions Table
    if (pkg.geometricalDimensions && pkg.geometricalDimensions.length > 0) {
      checkPageBreak(25);
      doc.setFillColor(2, 132, 199); // Blue
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('A.1. SPECIMEN & DOMAIN GEOMETRICAL DIMENSIONS', margin + 3, y + 4.2);
      y += 8;

      pkg.geometricalDimensions.forEach((geo) => {
        checkPageBreak(8);
        doc.setFillColor(240, 249, 255);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(3, 105, 161);
        doc.text(geo.feature, margin + 2, y + 4.2);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(geo.dimension, margin + 80, y + 4.2);

        doc.setTextColor(100, 116, 139);
        doc.text(geo.tolerance ? `(${geo.tolerance})` : '', margin + 115, y + 4.2);
        if (geo.notes) {
          doc.text(geo.notes.slice(0, 38), margin + 135, y + 4.2);
        }
        y += 7;
      });
      y += 3;
    }

    // 2. Material Properties Table
    if (pkg.materialProperties && pkg.materialProperties.length > 0) {
      checkPageBreak(30);
      doc.setFillColor(16, 185, 129); // Emerald
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('A.2. CONSTITUTIVE MATERIAL CONSTANTS & MECHANICAL PROPERTIES', margin + 3, y + 4.2);
      y += 8;

      pkg.materialProperties.forEach((mat) => {
        checkPageBreak(8);
        doc.setFillColor(236, 253, 245);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(4, 120, 87);
        doc.text(`${mat.name} [${mat.symbol}]`, margin + 2, y + 4.2);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(`${mat.value} ${mat.unit}`, margin + 80, y + 4.2);

        doc.setTextColor(71, 85, 105);
        doc.text((mat.description || '').slice(0, 48), margin + 115, y + 4.2);
        y += 7;
      });
      y += 3;
    }

    // 3. Boundary Conditions
    if (pkg.boundaryConditions && pkg.boundaryConditions.length > 0) {
      checkPageBreak(30);
      doc.setFillColor(234, 88, 12); // Amber
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('A.3. BOUNDARY CONDITIONS & LOADING KINEMATICS', margin + 3, y + 4.2);
      y += 8;

      pkg.boundaryConditions.forEach((bc) => {
        checkPageBreak(12);
        doc.setFillColor(255, 247, 237);
        doc.setDrawColor(254, 215, 170);
        doc.roundedRect(margin, y, contentWidth, 10.5, 1, 1, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(154, 52, 18);
        doc.text(`Region: ${bc.region} (${bc.type})`, margin + 2.5, y + 4);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(51, 65, 85);
        doc.text(`Formulation: ${bc.formulation} | DOFs: ${bc.degreesOfFreedom}`, margin + 2.5, y + 8);
        y += 12.5;
      });
      y += 2;
    }

    // 4. Mesh & Solver Discretization Settings
    if (pkg.meshAndDiscretization) {
      checkPageBreak(25);
      doc.setFillColor(124, 58, 237); // Purple
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('A.4. FINITE ELEMENT MESH & COMPUTATIONAL SOLVER SETTINGS', margin + 3, y + 4.2);
      y += 8;

      const m = pkg.meshAndDiscretization;
      doc.setFillColor(245, 243, 255);
      doc.roundedRect(margin, y, contentWidth, 16, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(109, 40, 217);
      doc.text(`Element: ${m.elementType}`, margin + 3, y + 4.5);
      doc.text(`Mesh Size: ${m.characteristicMeshSize}`, margin + 3, y + 9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Formulation: ${m.formulation || 'Standard'} | Step Time: ${m.stepTime || 'Adaptive'}`, margin + 3, y + 13.5);
      y += 19;
    }

    // 5. Validation Acceptance Benchmarks
    if (pkg.validationBenchmarks && pkg.validationBenchmarks.length > 0) {
      checkPageBreak(25);
      doc.setFillColor(5, 150, 105);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('A.5. VALIDATION ACCEPTANCE BENCHMARKS', margin + 3, y + 4.2);
      y += 8;

      pkg.validationBenchmarks.forEach((b) => {
        checkPageBreak(9);
        doc.setFillColor(240, 253, 244);
        doc.rect(margin, y, contentWidth, 7, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(6, 95, 70);
        doc.text(b.targetMetric, margin + 2, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(`Target: ${b.expectedBenchmarkValue} (Tol: ${b.experimentalErrorTolerance})`, margin + 75, y + 4.5);
        doc.setTextColor(100, 116, 139);
        doc.text(b.acceptanceCriterion.slice(0, 36), margin + 130, y + 4.5);
        y += 8;
      });
      y += 2;
    }

    // 6. Executable Verification Script (Code Block)
    if (pkg.executableVerificationScript) {
      checkPageBreak(45);
      doc.setFillColor(24, 24, 27); // Dark zinc
      doc.rect(margin, y, contentWidth, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 255, 65); // Hacker green
      doc.text(`A.6. EXECUTABLE VERIFICATION CODE (${pkg.executableVerificationScript.language.toUpperCase()})`, margin + 3, y + 4.5);
      y += 8;

      const codeLines = doc.splitTextToSize(pkg.executableVerificationScript.code, contentWidth - 8);
      const boxHeight = Math.min(65, codeLines.length * 3.2 + 6);
      checkPageBreak(boxHeight + 4);

      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, boxHeight, 'F');
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(148, 163, 184);

      const renderLines = codeLines.slice(0, 19);
      doc.text(renderLines, margin + 4, y + 4.5);
      y += boxHeight + 4;
    }
  }

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

  doc.save(`${cleanTitle}_swid_validation_brief.pdf`);
}

/**
 * High-definition Persian (Farsi) and Bilingual PDF generator with native RTL font rendering
 * Structuring into the exact 6 academic sections requested by the user, plus the
 * Academic Validation & Replication Appendix placed at the end of the PDF.
 */
export async function exportPersianOrBilingualPDF(
  analysis: PaperAnalysisResult,
  language: 'fa' | 'bilingual'
): Promise<void> {
  const faAnalysis = translateAnalysisToPersian(analysis);
  const isBilingual = language === 'bilingual';
  const val = analysis.validationPackage;
  const valFa = faAnalysis.validationPackage;

  // Create an off-screen HTML document styled with Vazirmatn font
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '820px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Vazirmatn', 'Roboto Mono', system-ui, sans-serif";
  container.style.padding = '36px 40px';
  container.style.boxSizing = 'border-box';
  container.dir = isBilingual ? 'ltr' : 'rtl';

  // Build HTML representation
  container.innerHTML = `
    <div style="border-bottom: 3px solid #00ff41; padding-bottom: 16px; margin-bottom: 24px;">
      <div style="background-color: #050505; color: white; padding: 16px 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 16px; font-weight: 800; color: #00ff41; letter-spacing: 1px;">
            ${isBilingual ? 'SWID-SHRK RESEARCH LAB // گزارش ارزیابی علمی و پیوست اعتبارسنجی' : 'آزمایشگاه تحقیقاتی مکانیک و هوافضا SWID-SHRK'}
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
            ${isBilingual ? '6-Section Decomposition + Validation Appendix • ارزیابی ۶ بخشی و بسته اعتبارسنجی بازتولید' : 'گزارش ارزیابی جامع ۶ بخشی مقالات علمی • تحلیل مراجع، خلأها، تجهیزات و داده‌های اعتبارسنجی'}
          </div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #cbd5e1;">
          <div>${new Date().toLocaleDateString('fa-IR')}</div>
          <div style="color: #00b8ff;">${isBilingual ? 'Bilingual (EN + فارسی)' : 'نسخه فارسی'}</div>
        </div>
      </div>
    </div>

    <!-- SECTION 1: NAME OF THE CHOSEN PAPERS -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 22px; page-break-inside: avoid;">
      <div style="background-color: #0284c7; color: white; padding: 10px 16px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between;">
        <span>۱. نام مقالات انتخاب شده (Name of the Chosen Papers)</span>
        ${isBilingual ? '<span style="font-size: 12px; opacity: 0.9;">Section 01</span>' : ''}
      </div>
      <div style="padding: 16px; background-color: #ffffff;">
        <h1 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; line-height: 1.5; direction: ${isBilingual ? 'ltr' : 'rtl'};">
          ${isBilingual ? `${analysis.paperTitle}<br/><span style="color: #0369a1; font-size: 16px; direction: rtl; display: block; margin-top: 6px;">${faAnalysis.paperNameSection.title}</span>` : faAnalysis.paperNameSection.title}
        </h1>
        <div style="font-size: 13px; color: #475569; margin-bottom: 8px;">
          <strong>${isBilingual ? 'Authors / نویسندگان:' : 'نویسندگان:'}</strong> ${isBilingual ? `${analysis.authors} | ${faAnalysis.paperNameSection.authors}` : faAnalysis.paperNameSection.authors}
        </div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
          <strong>${isBilingual ? 'Target Venue / نشریه:' : 'نشریه یا کنفرانس:'}</strong> ${isBilingual ? `${analysis.journalOrConference || 'Scientific Literature'} (${analysis.publicationYear || '2025'})` : `${faAnalysis.paperNameSection.journalOrConference || 'ادبیات معتبر علمی'} (${faAnalysis.paperNameSection.publicationYear || '۲۰۲۵'})`}
        </div>
        <div style="background-color: #f0f9ff; border-left: 3px solid #0284c7; padding: 8px 12px; font-size: 12px; color: #0369a1; border-radius: 4px;">
          <strong>استناد دانشگاهی / Academic Citation:</strong> ${faAnalysis.paperNameSection.citation}
        </div>
      </div>
    </div>

    <!-- SECTION 2: PURPOSE OF THE PAPERS -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 22px; page-break-inside: avoid;">
      <div style="background-color: #2563eb; color: white; padding: 10px 16px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between;">
        <span>۲. هدف مقالات (Purpose of the Papers)</span>
        ${isBilingual ? '<span style="font-size: 12px; opacity: 0.9;">Section 02</span>' : ''}
      </div>
      <div style="padding: 16px; background-color: #ffffff;">
        <div style="font-size: 13px; color: #1e293b; line-height: 1.8; margin-bottom: 12px; direction: rtl;">
          ${faAnalysis.purposeSection.summary}
        </div>
        ${isBilingual ? `
          <div style="font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 12px; direction: ltr; font-style: italic; background-color: #eff6ff; padding: 8px 12px; border-radius: 6px;">
            ${analysis.purposeSection.summary}
          </div>
        ` : ''}
        <div style="font-size: 12.5px; color: #1d4ed8; font-weight: 700; margin-bottom: 6px;">فرضیه‌های بنیادین و دامنه مهندسی:</div>
        ${faAnalysis.purposeSection.hypotheses.map(hyp => `
          <div style="font-size: 12px; color: #334155; line-height: 1.7; margin-bottom: 4px; direction: rtl;">• ${hyp}</div>
        `).join('')}
      </div>
    </div>

    <!-- SECTION 3: RESEARCH GAP AND HOW EXTRACTED FROM REFERENCES -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 22px; page-break-inside: avoid;">
      <div style="background-color: #ea580c; color: white; padding: 10px 16px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between;">
        <span>۳. شکاف پژوهشی و نحوه استخراج آن از مراجع (Research Gap & Reference Extraction)</span>
        ${isBilingual ? '<span style="font-size: 12px; opacity: 0.9;">Section 03</span>' : ''}
      </div>
      <div style="padding: 16px; background-color: #ffffff;">
        <div style="font-size: 13px; color: #1e293b; line-height: 1.8; margin-bottom: 12px; direction: rtl;">
          ${faAnalysis.researchGapSection.summary}
        </div>
        ${isBilingual ? `
          <div style="font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 12px; direction: ltr; font-style: italic; background-color: #fff7ed; padding: 8px 12px; border-radius: 6px;">
            ${analysis.researchGapSection.summary}
          </div>
        ` : ''}

        <div style="font-size: 12.5px; font-weight: 700; color: #c2410c; margin-bottom: 8px;">واکاوی مرجع به مرجع خلاهای علمی (Reference Void Breakdown):</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
          ${faAnalysis.researchGapSection.extractedFromReferences.map((ref, idx) => `
            <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 10px 14px; direction: rtl;">
              <div style="font-size: 12.5px; font-weight: 700; color: #9a3412;">[مرجع ${idx + 1}] ${ref.reference}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 3px;"><strong>فرضیه پیشین:</strong> ${ref.priorFindingOrAssumption}</div>
              <div style="font-size: 12px; color: #c2410c; font-weight: 600; margin-top: 3px;"><strong>خلأ استخراج شده:</strong> ${ref.extractedGapOrVoid}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- SECTION 4: HOW TO ACHIEVE RESULTS (METHODS, INSTRUMENTS, FACILITIES) -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 22px; page-break-inside: avoid;">
      <div style="background-color: #7c3aed; color: white; padding: 10px 16px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between;">
        <span>۴. نحوه دستیابی به نتایج: روش‌ها، تجهیزات، استانداردها و امکانات آزمایشگاهی</span>
        ${isBilingual ? '<span style="font-size: 12px; opacity: 0.9;">Section 04</span>' : ''}
      </div>
      <div style="padding: 16px; background-color: #ffffff;">
        <div style="font-size: 13px; color: #1e293b; line-height: 1.8; margin-bottom: 12px; direction: rtl;">
          ${faAnalysis.methodsAndFacilitiesSection.summary}
        </div>
        ${isBilingual ? `
          <div style="font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 12px; direction: ltr; font-style: italic; background-color: #f5f3ff; padding: 8px 12px; border-radius: 6px;">
            ${analysis.methodsAndFacilitiesSection.summary}
          </div>
        ` : ''}

        <div style="font-size: 12.5px; font-weight: 700; color: #6d28d9; margin-bottom: 6px;">تجهیزات و ابزارآلات آزمایشگاهی (Instruments & Hardware):</div>
        <div style="margin-bottom: 10px;">
          ${faAnalysis.methodsAndFacilitiesSection.facilitiesAndInstruments.map(fac => `
            <div style="font-size: 12px; color: #334155; line-height: 1.7; margin-bottom: 3px; direction: rtl;">• ${fac}</div>
          `).join('')}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; font-size: 12px; color: #475569;">
          <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 8px 12px;">
            <div style="font-weight: 700; color: #7c3aed; margin-bottom: 4px;">استانداردهای آزمون:</div>
            <div>${faAnalysis.methodsAndFacilitiesSection.testingStandards.join(' • ')}</div>
          </div>
          <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 8px 12px;">
            <div style="font-weight: 700; color: #7c3aed; margin-bottom: 4px;">حل‌کننده‌های محاسباتی:</div>
            <div>${faAnalysis.methodsAndFacilitiesSection.computationalSolvers.join(' • ')}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 5: RESULTS -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 22px; page-break-inside: avoid;">
      <div style="background-color: #059669; color: white; padding: 10px 16px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between;">
        <span>۵. نتایج و یافته‌های کمی (Results & Quantitative Findings)</span>
        ${isBilingual ? '<span style="font-size: 12px; opacity: 0.9;">Section 05</span>' : ''}
      </div>
      <div style="padding: 16px; background-color: #ffffff;">
        <div style="font-size: 13px; color: #1e293b; line-height: 1.8; margin-bottom: 12px; direction: rtl;">
          ${faAnalysis.resultsSection.summary}
        </div>
        ${isBilingual ? `
          <div style="font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 12px; direction: ltr; font-style: italic; background-color: #ecfdf5; padding: 8px 12px; border-radius: 6px;">
            ${analysis.resultsSection.summary}
          </div>
        ` : ''}

        <div style="font-size: 12.5px; font-weight: 700; color: #047857; margin-bottom: 6px;">دستاوردهای کمی و مکانیسم‌های فیزیکی:</div>
        ${faAnalysis.resultsSection.quantitativeMetrics.map(q => `
          <div style="font-size: 12px; color: #064e3b; line-height: 1.7; margin-bottom: 4px; direction: rtl;">• ${q}</div>
        `).join('')}
      </div>
    </div>

    <!-- SECTION 6: PROPOSE FUTURE DIRECTIONS -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 22px; page-break-inside: avoid;">
      <div style="background-color: #db2777; color: white; padding: 10px 16px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between;">
        <span>۶. پیشنهاد مسیرهای پژوهشی آینده (Propose Future Directions)</span>
        ${isBilingual ? '<span style="font-size: 12px; opacity: 0.9;">Section 06</span>' : ''}
      </div>
      <div style="padding: 16px; background-color: #ffffff;">
        <div style="font-size: 13px; color: #1e293b; line-height: 1.8; margin-bottom: 12px; direction: rtl;">
          ${faAnalysis.futureDirectionsSection.summary}
        </div>
        ${isBilingual ? `
          <div style="font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 12px; direction: ltr; font-style: italic; background-color: #fdf2f8; padding: 8px 12px; border-radius: 6px;">
            ${analysis.futureDirectionsSection.summary}
          </div>
        ` : ''}

        <div style="font-size: 12.5px; font-weight: 700; color: #be185d; margin-bottom: 6px;">نقشه راه اولویت‌دار پژوهشی:</div>
        ${faAnalysis.futureDirectionsSection.highPriorityRoadmap.map(r => `
          <div style="font-size: 12px; color: #831843; line-height: 1.7; margin-bottom: 4px; direction: rtl;">• ${r}</div>
        `).join('')}

        <div style="font-size: 12.5px; font-weight: 700; color: #9f1239; margin-top: 10px; margin-bottom: 6px;">پرسش‌های پاسخ‌داده‌نشده و مرزهای تعمیم:</div>
        ${faAnalysis.futureDirectionsSection.unresolvedQuestions.map(u => `
          <div style="font-size: 12px; color: #475569; line-height: 1.7; margin-bottom: 4px; direction: rtl;">? ${u}</div>
        `).join('')}
      </div>
    </div>

    <!-- APPENDIX: REPLICATION & VALIDATION BENCHMARK PACKAGE (Placed at end of PDF) -->
    ${val ? `
      <div style="border: 2px solid #00ff41; border-radius: 8px; overflow: hidden; margin-top: 28px; margin-bottom: 24px; page-break-inside: avoid; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: white; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00ff41;">
          <div>
            <div style="font-weight: 800; font-size: 15px; color: #00ff41; letter-spacing: 0.5px;">
              ${isBilingual ? 'APPENDIX: REPLICATION & VALIDATION BENCHMARK PACKAGE / پیوست اعتبارسنجی' : 'پیوست تخصصی: بسته اعتبارسنجی و بازتولید محاسباتی و تجربی'}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
              ${isBilingual ? 'Specifications for independent validation: Geometry, Materials, Boundary Conditions & Code' : 'کلیه داده‌های مورد نیاز محققان جهت بازتولید و اعتبارسنجی دقیق نتایج مقاله'}
            </div>
          </div>
          <div style="background-color: #00ff41; color: #050505; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px;">
            VALIDATION KIT
          </div>
        </div>

        <div style="padding: 16px;">
          <!-- Summary Box -->
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-bottom: 14px; font-size: 12.5px; color: #334155; line-height: 1.8; direction: ${isBilingual ? 'ltr' : 'rtl'};">
            ${isBilingual ? `<strong>Replication Scope:</strong> ${val.summary}<div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1; direction: rtl;"><strong>دامنه اعتبارسنجی:</strong> ${valFa?.summary || val.summary}</div>` : valFa?.summary || val.summary}
          </div>

          <!-- Geometrical Dimensions Table -->
          <div style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 13px; color: #0284c7; margin-bottom: 6px;">
              ${isBilingual ? 'A.1. Geometrical Dimensions & Tolerances / مشخصات و ابعاد هندسی نمونه:' : 'A.1. مشخصات و ابعاد هندسی نمونه و دامنه حل:'}
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; text-align: ${isBilingual ? 'left' : 'right'};">
              <thead>
                <tr style="background-color: #f0f9ff; color: #0369a1; border-bottom: 1.5px solid #bae6fd;">
                  <th style="padding: 6px 10px;">ویژگی / Feature</th>
                  <th style="padding: 6px 10px;">اندازه / Dimension</th>
                  <th style="padding: 6px 10px;">تلرانس / Tolerance</th>
                  <th style="padding: 6px 10px;">توضیحات / Notes</th>
                </tr>
              </thead>
              <tbody>
                ${val.geometricalDimensions.map((g, i) => `
                  <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                    <td style="padding: 6px 10px; font-weight: 600; color: #0f172a;">${g.feature}</td>
                    <td style="padding: 6px 10px; color: #0284c7; font-weight: 700; font-family: monospace;">${g.dimension}</td>
                    <td style="padding: 6px 10px; color: #64748b;">${g.tolerance || '-'}</td>
                    <td style="padding: 6px 10px; color: #475569;">${g.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Material Properties Table -->
          <div style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 13px; color: #059669; margin-bottom: 6px;">
              ${isBilingual ? 'A.2. Constitutive Material Constants / ثوابت رفتاری و مکانیکی مواد:' : 'A.2. ثوابت رفتاری و مکانیکی مواد:'}
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; text-align: ${isBilingual ? 'left' : 'right'};">
              <thead>
                <tr style="background-color: #ecfdf5; color: #047857; border-bottom: 1.5px solid #a7f3d0;">
                  <th style="padding: 6px 10px;">مشخصه / Parameter</th>
                  <th style="padding: 6px 10px;">نماد / Symbol</th>
                  <th style="padding: 6px 10px;">مقدار و واحد / Value & Unit</th>
                  <th style="padding: 6px 10px;">نقش رفتاری / Role</th>
                </tr>
              </thead>
              <tbody>
                ${val.materialProperties.map((m, i) => `
                  <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                    <td style="padding: 6px 10px; font-weight: 600; color: #0f172a;">${m.name}</td>
                    <td style="padding: 6px 10px; color: #059669; font-weight: 700; font-family: monospace;">${m.symbol}</td>
                    <td style="padding: 6px 10px; color: #0f172a; font-weight: 700; font-family: monospace;">${m.value} ${m.unit}</td>
                    <td style="padding: 6px 10px; color: #475569;">${m.description || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Boundary Conditions Table -->
          <div style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 13px; color: #ea580c; margin-bottom: 6px;">
              ${isBilingual ? 'A.3. Boundary Conditions & Kinematics / شرایط مرزی و سینماتیک بارگذاری:' : 'A.3. شرایط مرزی و سینماتیک بارگذاری:'}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${val.boundaryConditions.map((bc, i) => `
                <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 8px 12px; font-size: 11.5px;">
                  <div style="font-weight: 700; color: #9a3412;">
                    ${i + 1}. ${bc.region} — <span style="color: #c2410c;">${bc.type}</span>
                  </div>
                  <div style="margin-top: 3px; font-family: monospace; color: #334155;">
                    فرمول‌بندی / Formulation: ${bc.formulation}
                  </div>
                  <div style="margin-top: 2px; color: #64748b;">
                    درجات آزادی / DOFs: ${bc.degreesOfFreedom}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Mesh & Solver Discretization -->
          <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-size: 12px;">
            <div style="font-weight: 700; color: #6d28d9; margin-bottom: 4px;">
              ${isBilingual ? 'A.4. Mesh Formulation & Solvers / فرمولاسیون مش و حل‌کننده:' : 'A.4. فرمولاسیون مش و حل‌کننده اجزای محدود:'}
            </div>
            <div style="color: #475569; line-height: 1.7;">
              <strong>المان / Element:</strong> ${val.meshAndDiscretization.elementType} &bull; 
              <strong>اندازه مش / Mesh Size:</strong> ${val.meshAndDiscretization.characteristicMeshSize} &bull; 
              <strong>حل‌کننده / Solver:</strong> ${val.meshAndDiscretization.formulation || 'Standard'}
            </div>
          </div>

          <!-- Validation Benchmarks -->
          <div style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 13px; color: #047857; margin-bottom: 6px;">
              ${isBilingual ? 'A.5. Validation Benchmark Targets / معیارهای پذیرش اعتبارسنجی:' : 'A.5. معیارهای پذیرش اعتبارسنجی:'}
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
              <thead>
                <tr style="background-color: #f0fdf4; color: #065f46; border-bottom: 1.5px solid #bbf7d0;">
                  <th style="padding: 6px 10px;">معیار / Target Metric</th>
                  <th style="padding: 6px 10px;">مقدار شاخص / Benchmark Value</th>
                  <th style="padding: 6px 10px;">تلرانس خطا / Tolerance</th>
                  <th style="padding: 6px 10px;">ضابطه پذیرش / Criterion</th>
                </tr>
              </thead>
              <tbody>
                ${val.validationBenchmarks.map((vb, i) => `
                  <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                    <td style="padding: 6px 10px; font-weight: 600; color: #0f172a;">${vb.targetMetric}</td>
                    <td style="padding: 6px 10px; color: #059669; font-weight: 700; font-family: monospace;">${vb.expectedBenchmarkValue}</td>
                    <td style="padding: 6px 10px; color: #64748b;">${vb.experimentalErrorTolerance}</td>
                    <td style="padding: 6px 10px; color: #334155;">${vb.acceptanceCriterion}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Executable Verification Code Box -->
          ${val.executableVerificationScript ? `
            <div>
              <div style="font-weight: 700; font-size: 12.5px; color: #0f172a; margin-bottom: 6px;">
                ${isBilingual ? `A.6. Executable Verification Script (${val.executableVerificationScript.language.toUpperCase()}) / کد اعتبارسنجی محاسباتی:` : `A.6. اسکریپت محاسباتی اعتبارسنجی (${val.executableVerificationScript.language.toUpperCase()}):`}
              </div>
              <pre style="background-color: #0f172a; color: #00ff41; padding: 12px 16px; border-radius: 6px; font-family: 'Roboto Mono', monospace; font-size: 10.5px; line-height: 1.5; overflow-x: auto; margin: 0; direction: ltr; text-align: left;"><code>${val.executableVerificationScript.code}</code></pre>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; direction: ltr;">
      <span>SWID-SHRK Mechanical & Aerospace Research Lab • umbc.edu</span>
      <span>${isBilingual ? 'Bilingual 6-Section Academic Brief + Validation Appendix' : 'گزارش تحلیل آکادمیک ۶ بخشی همراه با بسته اعتبارسنجی'}</span>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const cleanTitle = (analysis.paperTitle || 'paper_analysis')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 35);

    const suffix = isBilingual ? 'bilingual_validation_brief' : 'persian_validation_brief';
    pdf.save(`${cleanTitle}_swid_${suffix}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Universal export function supporting English, Persian, and Bilingual PDFs
 */
export async function exportPaperAnalysisToPDF(
  analysis: PaperAnalysisResult,
  language: PDFExportLanguage = 'en'
): Promise<void> {
  if (language === 'en') {
    exportEnglishVectorPDF(analysis);
  } else {
    await exportPersianOrBilingualPDF(analysis, language);
  }
}
