# Restructure Paper Analyzer: 6-Part Rigor Schema & Multi-Paper Synthesis

Restructure the Paper Analyzer engine and UI to output the exact 6 academic dimensions specified by the user (Name, Purpose, Research Gap extracted from References, Methods & Facilities, Results, and Future Directions), while adding multi-paper comparative synthesis and updating all PDF export formats.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed in Phase 1:
> 1. **6-Part Output Schema**: Directly reorganize the analyzer into the exact 6 sections requested by the user:
>    - **1. Name of the Chosen Paper(s)**
>    - **2. Purpose of the Paper(s)**
>    - **3. Research Gap & Extraction from Prior References**
>    - **4. How to Achieve the Results (Methods, Instruments & Facilities)**
>    - **5. Results (Measured Findings & Empirical Discoveries)**
>    - **6. Proposed Future Directions & Research Roadmap**
> 2. **Multi-Paper Comparative Synthesis**: Support analyzing individual uploaded/cloud manuscripts, as well as selecting 2+ papers for cross-manuscript comparative synthesis.
> 3. **Universal Export Alignment**: Synchronize English (Vector jsPDF), Persian (`Vazirmatn` RTL), and Bilingual (Dual Language) PDF generators with this exact 6-part schema.

---

## 1. Overview & Core Concept

### What It Delivers
A major architectural enhancement to the **SWID-SHRK Paper Analyzer** that shifts from a generic 5-dimension rubric to a rigorous, publication-grade 6-part research decomposition engine:
- **Manuscript Identification**: Clear paper metadata with author affiliations, citation formatting, and DOI/venue indexing. In multi-paper mode, displays a comparative catalog.
- **Dedicated Literature Reference Gap Extraction**: Specifically analyzes *how* the research gap was derived from prior publications (e.g., citing prior works by Rice, Paris, Ashby, Ogden, etc., highlighting their theoretical assumptions, experimental boundaries, and what void remained unfilled).
- **Comprehensive Experimental & Computational Inventory**: Systematically catalogues testing facilities, machines (e.g., high-frequency resonant servo-hydraulic rigs, split-Hopkinson pressure bar, drop tower), ASTM/ISO standards, optical diagnostic tools (e.g., high-speed DIC at 10,000 fps), and computational solvers (Abaqus/Standard, Abaqus/Explicit, VUMAT user subroutines, element types C3D8R, C3D20R).
- **Empirical Results & Benchmarks**: Quantitative values (SIFs, fatigue thresholds, specific energy absorption in kJ/kg, strain concentrations).
- **Forward-Looking Doctoral Roadmap**: High-impact proposals for future experimental and theoretical exploration.

### Target Audience
Aerospace, mechanical, biomedical, and materials engineering researchers, doctoral candidates, laboratory PIs, and peer reviewers.

---

## 2. User Experience & Visual Design

### Asymmetric Console & Multi-Paper Workspace
Following the **Science, Space & Biotech** design standard (`references/8_science_space_biotech.md`), the layout uses high-contrast lab obsidian (`#07090e` / `#0c0c0e`) with crisp hairline borders (`border-zinc-800`), `#00ff41` laser phosphor, and `#00b8ff` telemetry cyan accents:

```
+---------------------------------------------------------------------------------------------------------+
| SWID-SHRK // 6-PART ACADEMIC PAPER DECOMPOSITION ENGINE                                                 |
| Modes: [ Single Manuscript Analysis ]  |  [ Multi-Paper Comparative Synthesis (2+ Papers) ]              |
+---------------------------------------------------------------------------------------------------------+
| INPUT CONSOLE (Left, 45%)                     | QUICK SAMPLES & MULTI-SELECT CATALOG (Right, 55%)      |
| • Upload PDF / Cloud Sync (Drive, OneDrive)   | [✓] Paper 1: Multiaxial Fatigue in FGM Cylinders        |
| • Paste Manuscript Text                       | [✓] Paper 2: 3D Strut AntiPrism Cellular Metamaterials  |
| • Analytical Domain Focus Selector            | [ ] Paper 3: Dynamic Brain Parenchyma Viscoelasticity   |
| [ ▶ Run 6-Part Decomposition ]                | [ Batch Load Selected Papers (2 Active) ]               |
+---------------------------------------------------------------------------------------------------------+
| RESULTS STAGE:                                                                                          |
| Language View: [ 🇬🇧 English ] [ 🇮🇷 فارسی ] [ 🌐 Bilingual ]                                             |
| Export Actions: [ 🇬🇧 English PDF ] [ 🇮🇷 فارسی PDF ] [ 🌐 Bilingual PDF ] [ Copy Markdown ]             |
+---------------------------------------------------------------------------------------------------------+
| 01. NAME OF CHOSEN PAPERS            | Title, authors, venue, citation tag, multi-paper index           |
| 02. PURPOSE OF THE PAPERS             | Core research problem, hypotheses, physical systems examined    |
| 03. RESEARCH GAP FROM REFERENCES      | Prior limitations cited, citation-by-citation void derivation   |
| 04. HOW TO ACHIEVE RESULTS            | Test rigs, ASTM standards, Abaqus solvers, VUMAT, specimens     |
| 05. RESULTS & DISCOVERIES             | Quantitative metrics, SEA values, SIF thresholds, failure modes |
| 06. PROPOSE FUTURE DIRECTIONS         | High-priority roadmap, PINNs, scaling & environmental durability|
+---------------------------------------------------------------------------------------------------------+
```

### Visual Polish & Anti-AI Slop Rules
- **No static pill chips**: Metadata presented with typographic separators (`Authors · Year · Venue · Citation`).
- **Clean Section Badges**: Numbered editorial index (`01.`, `02.`, `03.`, `04.`, `05.`, `06.`) with functional color accents.
- **RTL Persian Typography**: Native right-to-left layout with `font-family: 'Vazirmatn'` for Persian and Bilingual view modes.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Transition from 5 Dimensions to 6 Exact Sections
- **Chosen Approach**: Replace the previous 5 dimensions directly with the user's 6 specific sections in the TypeScript types, UI tabs, Gemini prompts, client-side fallback generator, and PDF exporters.
- **Why**: Perfectly aligns with the user's exact specification while elevating Section 3 (Literature Gap Extraction) and Section 4 (Facilities & Instruments) into first-class academic pillars.

### Decision 2: Multi-Paper Comparative Synthesis
- **Chosen Approach**: Add multi-paper selection checkboxes to the sample papers and cloud sync list, allowing users to combine 2 or more papers into a unified comparative review matrix.
- **Why**: Allows researchers to compare differing methodologies (e.g. analytical weight functions vs. explicit dynamic crushing) and synthesized findings side-by-side.

### Decision 3: PDF Generation Pipeline
- **Chosen Approach**:
  - English PDF: High-speed vector `jsPDF` formatted to the 6 sections with precise page-break budgeting.
  - Persian & Bilingual PDFs: `html2canvas` + `jsPDF` with `dir="rtl"` and embedded Google Font `Vazirmatn` for publication-quality ligature rendering.

---

## 4. Technical Architecture & Data Strategy

### Component & Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                            │
│  PaperAnalyzer.tsx                                                     │
│  ├── Mode Switcher: Single Paper vs Multi-Paper Synthesis              │
│  ├── Input Panels: Upload PDF, Google Drive Sync, OneDrive, Paste      │
│  ├── Multi-Select Sample Paper Catalog                                 │
│  ├── Language View Toggle: [ EN | FA | Bilingual ]                     │
│  └── 6-Section Academic Rigor Display                                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
      ┌───────────────────────────┐   ┌───────────────────────────┐
      │  Server API Route         │   │ Client-Side Analyzer      │
      │  server.ts                │   │ clientPaperAnalyzer.ts    │
      │  POST /api/analyze-paper  │   │ Offline/GitHub Pages      │
      │  Gemini 3.8 Flash SDK     │   │ Zero-Failure Engine       │
      │  Structured 6-Part Schema │   │ Regex + Domain Extractor  │
      └─────────────┬─────────────┘   └─────────────┬─────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Data Transformation                             │
│  src/types/index.ts -> PaperAnalysisResult (6-Section Schema)          │
│  src/utils/persianTranslator.ts -> translateAnalysisToPersian()        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Export Engines                                  │
│  src/utils/pdfExporter.ts                                              │
│  ├── exportEnglishVectorPDF() -> 6-Section Vector PDF (jsPDF)          │
│  ├── exportPersianOrBilingualPDF() -> RTL Vazirmatn PDF (html2canvas)  │
│  └── exportPaperAnalysisToPDF(analysis, 'en' | 'fa' | 'bilingual')     │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Changes (`src/types/index.ts`)
Update `PaperAnalysisResult` and related interfaces to structure the 6 sections:
1. `name`: `paperTitle`, `authors`, `journalOrConference`, `publicationYear`, `isMultiPaper`, `paperList?: string[]`
2. `purpose`: `summary`, `hypotheses`, `targetSystems`, `engineeringScope`
3. `researchGap`: `summary`, `extractedFromReferences: { reference: string; shortcoming: string; theoreticalVoid: string }[]`, `bulletPoints`
4. `methodsAndFacilities`: `summary`, `facilitiesAndInstruments: string[]`, `testingStandards: string[]`, `computationalSolvers: string[]`, `specimensAndMaterials: string[]`
5. `results`: `summary`, `quantitativeMetrics: string[]`, `mechanismsAndDiscoveries: string[]`, `bulletPoints`
6. `futureDirections`: `summary`, `highPriorityRoadmap: string[]`, `unresolvedQuestions: string[]`, `bulletPoints`

---

## 5. Verification & Test Plan

1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to ensure TypeScript compliance with zero errors.
2. **Analysis Execution Verification**:
   - Single paper test (e.g., FGM Cylinder, AntiPrism Metamaterial, or Brain Biomechanics).
   - Multi-paper comparative synthesis test (selecting 2+ papers simultaneously).
   - Offline fallback test (ensures 100% functionality on static GitHub Pages).
3. **Language & Translation Verification**:
   - On-screen English view, Persian RTL view, and Bilingual side-by-side view.
4. **PDF Export Verification**:
   - Verify English Vector PDF downloads cleanly.
   - Verify Persian PDF downloads with connected RTL Vazirmatn script.
   - Verify Bilingual PDF formats both languages with dual columns.
5. **Production Build**: Execute `npm run build` to update the `docs/` folder for GitHub Pages deployment.
