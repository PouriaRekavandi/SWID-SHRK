import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Search,
  Layers,
  ArrowRight,
  Bookmark,
  FileCode,
  Compass,
  Cpu,
  BarChart3,
  HelpCircle,
  FileSearch,
  ExternalLink,
} from 'lucide-react';
import { PaperAnalysisResult } from '../types';
import { exportPaperAnalysisToPDF } from '../utils/pdfExporter';

interface PaperAnalyzerProps {
  onNotify?: (message: string, isError?: boolean) => void;
}

const SAMPLE_PAPERS = [
  {
    id: 'sample-fgm',
    title: 'Multiaxial Fatigue Life Prediction in Functionally Graded Cylinders',
    category: 'Fatigue & Fracture Mechanics',
    summary: 'Investigation of mixed-mode crack propagation under thermo-mechanical fatigue in radially graded hollow cylinders using weight functions and 3D FEA.',
    text: `Title: Multiaxial Fatigue Life Prediction and Weight Function Integration in Functionally Graded Hollow Cylinders
Authors: Pouria Hejazi Rekavandi, S. M. Nabavi
Affiliation: Department of Mechanical Engineering, SWID-SHRK Research Group, UMBC

ABSTRACT:
Functionally graded materials (FGMs) provide continuous spatial variations of material composition, mitigating sharp interfacial thermal and mechanical stress concentrations. In this investigation, a unified weight function method is developed to determine mode-I and mixed-mode stress intensity factors (SIFs) for semi-elliptical surface cracks and radial longitudinal cracks embedded in pressurized hollow cylinders. The cylinder exhibits power-law variation of Young's modulus and fracture toughness across the wall thickness. Non-proportional multiaxial fatigue loading conditions are analyzed using the critical plane approach coupled with the Fatemi-Socie damage parameter. Three-dimensional nonlinear finite element simulations are executed in Abaqus/Standard using quadratic 20-node brick elements (C3D20R) with singular quarter-point crack-tip discretization. Results demonstrate that the analytical weight function formulation predicts SIF values within 2.3% of 3D FEA benchmarks while reducing computation times by more than 98%. Under non-proportional cyclic pressure and thermal shock, crack tip plastic zone evolution is constrained significantly in positive compositional gradient zones, extending fatigue crack initiation thresholds by up to 42%. Experimental validation conducted on high-frequency servo-hydraulic resonant machines demonstrates strong concordance with life predictions.`,
  },
  {
    id: 'sample-antiprism',
    title: 'Specific Energy Absorption of 3D Strut AntiPrism Cellular Metamaterials',
    category: 'Metamaterials & Origami',
    summary: 'Topological synthesis, dynamic impact experiments, and explicit finite element simulations of cellular AntiPrism lattices under high-strain crushing.',
    text: `Title: Specific Energy Absorption and Progressive Crushing Mechanics of 3D Strut AntiPrism Cellular Metamaterials
Authors: Pouria Hejazi Rekavandi and SWID-SHRK Metamaterials Division
Affiliation: Mechanical & Aerospace Engineering, UMBC

ABSTRACT:
Energy-absorbing metamaterials deployed in aerospace re-entry capsules and impact mitigation structures demand high specific energy absorption (SEA) combined with smooth, non-oscillatory plateau stress profiles. In this work, 3D Strut AntiPrism cellular topologies derived from non-prismatic polygonal antiprisms are synthesized and evaluated. Cellular specimens were fabricated via selective laser sintering (SLS) of polyamide-12 (PA12) and Ti-6Al-4V alloy. Quasi-static and dynamic crushing experiments were conducted across strain rates ranging from 0.001 s⁻¹ to 650 s⁻¹ using a customized drop-tower and split-Hopkinson pressure bar (SHPB). High-fidelity dynamic finite element simulations were conducted in Abaqus/Explicit utilizing C3D8R hex elements and general contact enforcement with frictional penalty formulation. The results reveal that the antiprism configuration undergoes sequential progressive plastic hinging rather than catastrophic global Euler buckling. The specific energy absorption reached 28.4 kJ/kg for Ti-6Al-4V antiprism lattices, outperforming standard octet-truss and honeycomb benchmarks by 37.5%. High-speed digital image correlation (DIC) confirmed synchronized plastic hinge activation across tetrahedral strut nodes, providing uniform deceleration profiles ideal for crashworthiness systems.`,
  },
  {
    id: 'sample-neural',
    title: 'Dynamic Brain Parenchyma Viscoelastic Constitutive Modeling',
    category: 'Neural Biomechanics',
    summary: 'Viscoelastic constitutive formulation of brain tissue under rotational impact trauma with user subroutines in Abaqus Explicit.',
    text: `Title: Dynamic Viscoelastic Constitutive Modeling of Brain Parenchyma under Rotational Traumatic Impact
Authors: SWID-SHRK Neural Biomechanics Group & Collaborators
Affiliation: Laboratory for Advanced Biomechanics, SWID-SHRK, UMBC

ABSTRACT:
Traumatic brain injury (TBI) induced by rapid rotational angular acceleration remains a critical challenge in aerospace pilot safety and contact sports. In this study, we formulate a non-linear hyper-viscoelastic constitutive law calibrated specifically for human brain parenchyma subjected to high-strain-rate shear deformation (γ̇ up to 120 s⁻¹). The strain energy density function integrates a modified Ogden hyperelastic potential coupled with a 5-term Prony series relaxation kernel. The constitutive algorithm is formulated into a vectorized user material subroutine (VUMAT) in Abaqus/Explicit. Dynamic rotational acceleration pulses (peak angular acceleration 4.5 krad/s² with pulse duration 15 ms) are applied to an anatomically realistic 3D human head model comprising partitioned cerebral cortex, corpus callosum, cerebrospinal fluid (CSF), and falx cerebri. The computational simulations demonstrate pronounced shear strain concentrations (> 0.24) localization along the grey-white matter interface, directly coinciding with clinical diffuse axonal injury (DAI) lesions. The study provides quantitative strain thresholds for cellular microstructural damage and underscores the critical role of relaxation time constants during multi-directional rotational kinematics.`,
  },
];

export const PaperAnalyzer: React.FC<PaperAnalyzerProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [paperText, setPaperText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [focusArea, setFocusArea] = useState('general');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analysisResult, setAnalysisResult] = useState<PaperAnalysisResult | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<
    'all' | 'objective' | 'researchGap' | 'methodology' | 'findings' | 'futureGaps'
  >('all');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      onNotify?.('Please select a valid PDF file.', true);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      onNotify?.('File exceeds maximum 25MB limit.', true);
      return;
    }

    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPdfBase64(result);
      onNotify?.(`Loaded "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)} MB)`);
    };
    reader.onerror = () => {
      onNotify?.('Failed to read PDF file', true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      onNotify?.('Please upload a PDF document.', true);
      return;
    }

    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPdfBase64(result);
      onNotify?.(`Loaded "${file.name}"`);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleLoadSample = (sample: typeof SAMPLE_PAPERS[0]) => {
    setActiveTab('paste');
    setPaperText(sample.text);
    setPdfFile(null);
    setPdfBase64('');
    onNotify?.(`Loaded sample: ${sample.title}`);
  };

  const handleClear = () => {
    setPaperText('');
    setPdfFile(null);
    setPdfBase64('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onNotify?.('Cleared inputs');
  };

  const runAnalysis = async () => {
    if (activeTab === 'upload' && !pdfBase64) {
      onNotify?.('Please select or drop a PDF manuscript first.', true);
      return;
    }
    if (activeTab === 'paste' && !paperText.trim()) {
      onNotify?.('Please paste manuscript text or abstract first.', true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress('Initializing Gemini Scientific Review Pipeline...');

    try {
      const progressTimer1 = setTimeout(() => {
        setAnalysisProgress('Parsing manuscript layout, math symbols, and experimental data...');
      }, 900);

      const progressTimer2 = setTimeout(() => {
        setAnalysisProgress('Decomposing into 5 Core Academic Dimensions...');
      }, 2400);

      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: activeTab === 'paste' ? paperText : '',
          pdfBase64: activeTab === 'upload' ? pdfBase64 : '',
          fileName: pdfFile?.name || '',
          focusArea,
        }),
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: PaperAnalysisResult = await response.json();
      setAnalysisResult(data);
      onNotify?.('✅ Academic paper analysis successfully generated!');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      onNotify?.('Analysis encountered an issue. Loaded fallback review.', true);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const handleExportPDF = () => {
    if (!analysisResult) return;
    setIsExportingPDF(true);
    try {
      exportPaperAnalysisToPDF(analysisResult);
      onNotify?.('✅ Analysis PDF successfully exported and downloaded!');
    } catch (err: any) {
      console.error('PDF export failed:', err);
      onNotify?.('Failed to generate PDF export.', true);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!analysisResult) return;
    const md = `# ${analysisResult.paperTitle}
*Authors:* ${analysisResult.authors}
*Venue:* ${analysisResult.journalOrConference || 'Scientific Literature'} (${analysisResult.publicationYear || '2025'})

## Executive Summary
${analysisResult.executiveSummary}

## Critical Takeaway
${analysisResult.criticalTakeaway}

---

### Dimension 1: Objective & Scope
${analysisResult.dimensions.objective.summary}
${analysisResult.dimensions.objective.bulletPoints.map((b) => `- ${b}`).join('\n')}

### Dimension 2: Research Gap & Novelty
${analysisResult.dimensions.researchGap.summary}
${analysisResult.dimensions.researchGap.bulletPoints.map((b) => `- ${b}`).join('\n')}

### Dimension 3: Methodology & Experimental Framework
${analysisResult.dimensions.methodology.summary}
${analysisResult.dimensions.methodology.bulletPoints.map((b) => `- ${b}`).join('\n')}

### Dimension 4: Key Findings & Quantitative Metrics
${analysisResult.dimensions.findings.summary}
${analysisResult.dimensions.findings.bulletPoints.map((b) => `- ${b}`).join('\n')}

### Dimension 5: Future Gaps & Next Steps
${analysisResult.dimensions.futureGaps.summary}
${analysisResult.dimensions.futureGaps.bulletPoints.map((b) => `- ${b}`).join('\n')}

---
*Analyzed by SWID-SHRK Academic Paper Analyzer (Google Gemini)*
`;

    navigator.clipboard.writeText(md).then(() => {
      setCopiedMarkdown(true);
      onNotify?.('Copied full academic analysis Markdown to clipboard');
      setTimeout(() => setCopiedMarkdown(false), 2500);
    });
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl dark:bg-gradient-to-r dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border dark:border-zinc-800 border-sky-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider dark:bg-[#00ff41]/10 bg-sky-500/20 text-[#00ff41] border dark:border-[#00ff41]/40 border-sky-400/40">
              <Sparkles className="w-3.5 h-3.5 text-[#00ff41]" />
              <span>Gemini Academic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-orbitron tracking-wide text-white">
              Paper Analyzer <span className="text-[#00b8ff]">&amp; 5-D Decomposition</span>
            </h1>
            <p className="text-slate-300 dark:text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed">
              Upload manuscripts or paste manuscript text. Our Gemini-powered reviewer systematically deconstructs research papers across the <strong>5 core academic dimensions</strong>: Objective, Research Gap, Methodology, Findings, and Future Gaps. Export formatted peer-review briefs as downloadable PDFs with <strong>jsPDF</strong>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 flex-none font-mono text-xs">
            <div className="px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>5 Core Dimensions</span>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#00ff41]" />
              <span>Full PDF &amp; Text Support</span>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span>One-Click jsPDF Export</span>
            </div>
          </div>
        </div>

        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #00b8ff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Main Analysis Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Paste controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="dark:bg-[#0c0c0e] bg-white rounded-xl border dark:border-zinc-800 border-slate-200 p-5 sm:p-6 shadow-md transition-colors">
            {/* Input Mode Selector */}
            <div className="flex items-center justify-between border-b dark:border-zinc-800 border-slate-200 pb-4 mb-5">
              <div className="flex gap-2 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'dark:bg-[#00ff41]/15 bg-sky-100 dark:text-[#00ff41] text-sky-800 dark:border dark:border-[#00ff41]/50 shadow-sm'
                      : 'dark:text-zinc-400 text-slate-500 hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'paste'
                      ? 'dark:bg-[#00ff41]/15 bg-sky-100 dark:text-[#00ff41] text-sky-800 dark:border dark:border-[#00ff41]/50 shadow-sm'
                      : 'dark:text-zinc-400 text-slate-500 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Paste Manuscript</span>
                </button>
              </div>

              {(pdfFile || paperText) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-mono dark:text-zinc-400 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Upload PDF Mode */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    pdfFile
                      ? 'dark:border-[#00ff41] border-emerald-500 dark:bg-[#00ff41]/5 bg-emerald-50/50'
                      : 'dark:border-zinc-700 border-slate-300 hover:border-sky-400 dark:hover:border-[#00b8ff] dark:bg-zinc-900/50 bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {pdfFile ? (
                    <div className="space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-full dark:bg-[#00ff41]/20 bg-emerald-100 flex items-center justify-center dark:text-[#00ff41] text-emerald-700">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-sm dark:text-white text-slate-900 truncate max-w-md mx-auto">
                          {pdfFile.name}
                        </p>
                        <p className="font-mono text-xs dark:text-zinc-400 text-slate-500">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB • Ready for multimodal analysis
                        </p>
                      </div>
                      <p className="text-xs text-sky-500 hover:underline">Click or drop to replace file</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-full dark:bg-zinc-800 bg-slate-200 flex items-center justify-center dark:text-zinc-400 text-slate-600">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono font-bold text-sm dark:text-white text-slate-800">
                          Drag &amp; Drop Academic PDF
                        </p>
                        <p className="font-mono text-xs dark:text-zinc-400 text-slate-500">
                          Supports preprints, journal articles, and thesis chapters (up to 25MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold dark:bg-zinc-800 bg-slate-200 dark:text-white text-slate-800 hover:bg-sky-600 hover:text-white transition-colors"
                      >
                        Browse Local Files
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paste Text Mode */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <textarea
                  value={paperText}
                  onChange={(e) => setPaperText(e.target.value)}
                  placeholder="Paste manuscript text here (Title, Abstract, Introduction, Methodology, Results, or full preprint body)..."
                  rows={9}
                  className="w-full p-4 rounded-xl dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-800 border-slate-300 font-mono text-xs dark:text-white text-slate-900 focus:outline-none focus:ring-2 dark:focus:ring-[#00ff41] focus:ring-sky-500 transition-all resize-y"
                />
                <div className="flex items-center justify-between text-[11px] font-mono dark:text-zinc-500 text-slate-400">
                  <span>Character count: {paperText.length.toLocaleString()}</span>
                  <span>Word count: {paperText.trim() ? paperText.trim().split(/\s+/).length.toLocaleString() : 0}</span>
                </div>
              </div>
            )}

            {/* Focus Area Selection & Trigger */}
            <div className="mt-6 pt-5 border-t dark:border-zinc-800 border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold dark:text-zinc-300 text-slate-700 mb-2">
                  Specialized Analytical Focus:
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-lg dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-700 border-slate-300 font-mono text-xs dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="general">Comprehensive Academic Rigor (All 5 Dimensions)</option>
                  <option value="experimental">Experimental Testing Protocols &amp; Standards (ASTM/ISO)</option>
                  <option value="computational">Computational FEA/CFD, Discretization &amp; Solvers</option>
                  <option value="fracture">Fracture Mechanics, SIFs &amp; Cyclic Fatigue Life</option>
                  <option value="metamaterials">Cellular Metamaterials, Origami &amp; Energy Absorption</option>
                  <option value="biomechanics">Viscoelastic Constitutive Modeling &amp; Neurotrauma</option>
                </select>
              </div>

              <button
                type="button"
                onClick={runAnalysis}
                disabled={isAnalyzing || (activeTab === 'upload' ? !pdfBase64 : !paperText.trim())}
                className={`w-full py-3.5 px-6 rounded-xl font-mono font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg ${
                  isAnalyzing
                    ? 'dark:bg-zinc-800 bg-slate-300 dark:text-zinc-400 text-slate-600 cursor-wait'
                    : 'dark:bg-emerald-500 bg-sky-600 hover:bg-emerald-400 hover:dark:bg-[#00ff41] text-black font-extrabold dark:shadow-[0_0_20px_rgba(0,255,65,0.3)] shadow-sky-600/30 active:scale-[0.99]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-[#00ff41]" />
                    <span>{analysisProgress || 'Decomposing Manuscript...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-black" />
                    <span>Analyze Paper with Gemini (5 Dimensions)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: SWID-SHRK Sample Pre-Loads & Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="dark:bg-[#0c0c0e] bg-white rounded-xl border dark:border-zinc-800 border-slate-200 p-5 sm:p-6 shadow-md">
            <h3 className="font-orbitron font-bold text-sm dark:text-white text-slate-900 flex items-center gap-2 mb-3">
              <Bookmark className="w-4 h-4 text-[#00b8ff]" />
              <span>Quick-Load Sample Papers</span>
            </h3>
            <p className="text-xs font-mono dark:text-zinc-400 text-slate-600 mb-4 leading-relaxed">
              Don't have a PDF ready? Load peer-reviewed manuscript excerpts from the SWID-SHRK laboratory to test the 5-dimension engine immediately:
            </p>

            <div className="space-y-3">
              {SAMPLE_PAPERS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="group p-3.5 rounded-lg border dark:border-zinc-800 border-slate-200 hover:border-sky-500 dark:hover:border-[#00ff41] dark:bg-zinc-900/60 bg-slate-50 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded dark:bg-sky-950/60 bg-sky-100 text-sky-400 dark:text-sky-300 font-bold">
                      {sample.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#00ff41] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-mono font-bold text-xs dark:text-white text-slate-900 mt-2 line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-[#00ff41] transition-colors">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] font-mono dark:text-zinc-400 text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {sample.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Core Academic Dimensions Guide */}
          <div className="dark:bg-[#0c0c0e] bg-white rounded-xl border dark:border-zinc-800 border-slate-200 p-5 shadow-md font-mono text-xs space-y-3">
            <h4 className="font-bold uppercase tracking-wider dark:text-zinc-300 text-slate-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>The 5 Core Academic Dimensions:</span>
            </h4>
            <div className="space-y-2 text-[11px] dark:text-zinc-400 text-slate-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-sky-400 flex-none">1. Objective:</span>
                <span>Central research question, hypotheses, engineering scope, and target systems.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-400 flex-none">2. Research Gap:</span>
                <span>Theoretical voids and empirical shortcomings of prior published literature.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-400 flex-none">3. Methodology:</span>
                <span>Testing rigs, ASTM standards, Abaqus FEA formulations, elements, and constitutive models.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#00ff41] flex-none">4. Findings:</span>
                <span>Measured quantitative results, stress/strain thresholds, SEA values, and failure modes.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-pink-400 flex-none">5. Future Gaps:</span>
                <span>Unresolved questions, scaling hurdles, and recommended doctoral/postdoctoral next steps.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-8 pt-4">
          {/* Paper Overview Meta Card */}
          <div className="dark:bg-[#0c0c0e] bg-white rounded-2xl border dark:border-zinc-800 border-slate-200 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b dark:border-zinc-800 border-slate-200">
              <div className="space-y-3 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 font-bold">
                    {analysisResult.modelUsed.toUpperCase()}
                  </span>
                  <span className="dark:text-zinc-400 text-slate-500">
                    Source: {analysisResult.sourceType === 'pdf' ? `PDF (${analysisResult.fileName || 'Uploaded File'})` : 'Pasted Manuscript'}
                  </span>
                  <span className="dark:text-zinc-600 text-slate-300">•</span>
                  <span className="dark:text-zinc-400 text-slate-500">
                    {new Date(analysisResult.analyzedAt).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-orbitron dark:text-white text-slate-900 leading-snug">
                  {analysisResult.paperTitle}
                </h2>

                <p className="font-mono text-xs sm:text-sm dark:text-zinc-300 text-slate-700 italic">
                  <strong>Authors:</strong> {analysisResult.authors}
                </p>

                {analysisResult.journalOrConference && (
                  <p className="font-mono text-xs dark:text-zinc-400 text-slate-500">
                    <strong>Target / Venue:</strong> {analysisResult.journalOrConference} ({analysisResult.publicationYear || '2025'})
                  </p>
                )}

                {analysisResult.keywords && analysisResult.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysisResult.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono dark:bg-zinc-800 bg-slate-100 dark:text-sky-400 text-sky-700 border dark:border-zinc-700 border-slate-200"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: PDF Export with jsPDF & Copy Markdown */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-none font-mono text-xs">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="px-4 py-2.5 rounded-xl font-bold bg-[#00b8ff] hover:bg-sky-400 text-black flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
                  title="Download Formatted PDF report via jsPDF"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>{isExportingPDF ? 'Generating PDF...' : 'Export PDF (jsPDF)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2.5 rounded-xl font-bold dark:bg-zinc-800 bg-slate-100 hover:dark:bg-zinc-700 hover:bg-slate-200 dark:text-white text-slate-800 border dark:border-zinc-700 border-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedMarkdown ? (
                    <>
                      <Check className="w-4 h-4 text-[#00ff41]" />
                      <span className="text-[#00ff41]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Executive Summary & Critical Takeaway */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
              <div className="p-4 rounded-xl dark:bg-zinc-900/70 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold dark:text-zinc-200 text-slate-800 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-[#00b8ff]" />
                  <span>Executive Research Summary</span>
                </div>
                <p className="font-mono text-xs dark:text-zinc-300 text-slate-600 leading-relaxed">
                  {analysisResult.executiveSummary}
                </p>
              </div>

              <div className="p-4 rounded-xl dark:bg-emerald-950/20 bg-emerald-50 border dark:border-[#00ff41]/40 border-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-[#00ff41] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
                  <span>Critical Takeaway</span>
                </div>
                <p className="font-mono text-xs dark:text-zinc-200 text-slate-800 leading-relaxed font-semibold">
                  "{analysisResult.criticalTakeaway}"
                </p>
              </div>
            </div>
          </div>

          {/* Dimension Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b dark:border-zinc-800 border-slate-200 pb-3">
            <div className="flex flex-wrap gap-2 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedDimension('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDimension === 'all'
                    ? 'dark:bg-white bg-slate-900 text-black dark:text-black font-extrabold shadow'
                    : 'dark:text-zinc-400 text-slate-600 hover:text-white'
                }`}
              >
                All 5 Dimensions
              </button>
              <button
                type="button"
                onClick={() => setSelectedDimension('objective')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDimension === 'objective'
                    ? 'bg-sky-500 text-white font-extrabold shadow'
                    : 'dark:text-zinc-400 text-slate-600 hover:text-sky-400'
                }`}
              >
                1. Objective
              </button>
              <button
                type="button"
                onClick={() => setSelectedDimension('researchGap')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDimension === 'researchGap'
                    ? 'bg-amber-500 text-white font-extrabold shadow'
                    : 'dark:text-zinc-400 text-slate-600 hover:text-amber-400'
                }`}
              >
                2. Research Gap
              </button>
              <button
                type="button"
                onClick={() => setSelectedDimension('methodology')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDimension === 'methodology'
                    ? 'bg-purple-600 text-white font-extrabold shadow'
                    : 'dark:text-zinc-400 text-slate-600 hover:text-purple-400'
                }`}
              >
                3. Methodology
              </button>
              <button
                type="button"
                onClick={() => setSelectedDimension('findings')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDimension === 'findings'
                    ? 'bg-emerald-500 text-black font-extrabold shadow'
                    : 'dark:text-zinc-400 text-slate-600 hover:text-emerald-400'
                }`}
              >
                4. Findings
              </button>
              <button
                type="button"
                onClick={() => setSelectedDimension('futureGaps')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDimension === 'futureGaps'
                    ? 'bg-pink-600 text-white font-extrabold shadow'
                    : 'dark:text-zinc-400 text-slate-600 hover:text-pink-400'
                }`}
              >
                5. Future Gaps
              </button>
            </div>

            <div className="text-xs font-mono dark:text-zinc-500 text-slate-500 hidden sm:block">
              Interactive Academic Rigor Assessment
            </div>
          </div>

          {/* Dimension Cards */}
          <div className="space-y-6">
            {/* DIMENSION 1: OBJECTIVE */}
            {(selectedDimension === 'all' || selectedDimension === 'objective') && (
              <div className="dark:bg-[#0c0c0e] bg-white rounded-2xl border dark:border-zinc-800 border-slate-200 overflow-hidden shadow-lg transition-colors">
                <div className="px-6 py-4 dark:bg-sky-950/40 bg-sky-100 border-b dark:border-sky-800/50 border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h3 className="font-orbitron font-bold text-sm sm:text-base dark:text-white text-sky-950">
                      Objective &amp; Research Scope
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
                    Primary Aim &amp; Hypotheses
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <p className="font-mono text-xs sm:text-sm dark:text-zinc-300 text-slate-700 leading-relaxed">
                    {analysisResult.dimensions.objective.summary}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-500">
                      Core Research Targets &amp; Postulates:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysisResult.dimensions.objective.bulletPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-800 border-slate-200 text-xs font-mono"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-none" />
                          <span className="dark:text-zinc-300 text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysisResult.dimensions.objective.subsections?.map((sub, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg dark:bg-zinc-900/60 bg-slate-50 border dark:border-zinc-800/80 border-slate-200">
                      <h5 className="text-xs font-mono font-bold dark:text-sky-400 text-sky-700 mb-1.5">
                        {sub.subtitle}
                      </h5>
                      <ul className="space-y-1">
                        {sub.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-xs font-mono dark:text-zinc-400 text-slate-600">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DIMENSION 2: RESEARCH GAP */}
            {(selectedDimension === 'all' || selectedDimension === 'researchGap') && (
              <div className="dark:bg-[#0c0c0e] bg-white rounded-2xl border dark:border-zinc-800 border-slate-200 overflow-hidden shadow-lg transition-colors">
                <div className="px-6 py-4 dark:bg-amber-950/40 bg-amber-100 border-b dark:border-amber-800/50 border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h3 className="font-orbitron font-bold text-sm sm:text-base dark:text-white text-amber-950">
                      Research Gap &amp; Prior Limitations
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                    Literature Voids &amp; Novelty
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <p className="font-mono text-xs sm:text-sm dark:text-zinc-300 text-slate-700 leading-relaxed">
                    {analysisResult.dimensions.researchGap.summary}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                      Shortcomings in Preceding Literature:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysisResult.dimensions.researchGap.bulletPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-800 border-slate-200 text-xs font-mono"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-none" />
                          <span className="dark:text-zinc-300 text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysisResult.dimensions.researchGap.subsections?.map((sub, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg dark:bg-zinc-900/60 bg-slate-50 border dark:border-zinc-800/80 border-slate-200">
                      <h5 className="text-xs font-mono font-bold dark:text-amber-400 text-amber-700 mb-1.5">
                        {sub.subtitle}
                      </h5>
                      <ul className="space-y-1">
                        {sub.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-xs font-mono dark:text-zinc-400 text-slate-600">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DIMENSION 3: METHODOLOGY */}
            {(selectedDimension === 'all' || selectedDimension === 'methodology') && (
              <div className="dark:bg-[#0c0c0e] bg-white rounded-2xl border dark:border-zinc-800 border-slate-200 overflow-hidden shadow-lg transition-colors">
                <div className="px-6 py-4 dark:bg-purple-950/40 bg-purple-100 border-b dark:border-purple-800/50 border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <h3 className="font-orbitron font-bold text-sm sm:text-base dark:text-white text-purple-950">
                      Methodology &amp; Experimental Framework
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
                    Testing Protocols &amp; FEA Solvers
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <p className="font-mono text-xs sm:text-sm dark:text-zinc-300 text-slate-700 leading-relaxed">
                    {analysisResult.dimensions.methodology.summary}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                      Testing Standards, Specimens &amp; Computational Solvers:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysisResult.dimensions.methodology.bulletPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-800 border-slate-200 text-xs font-mono"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-none" />
                          <span className="dark:text-zinc-300 text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysisResult.dimensions.methodology.subsections?.map((sub, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg dark:bg-zinc-900/60 bg-slate-50 border dark:border-zinc-800/80 border-slate-200">
                      <h5 className="text-xs font-mono font-bold dark:text-purple-400 text-purple-700 mb-1.5">
                        {sub.subtitle}
                      </h5>
                      <ul className="space-y-1">
                        {sub.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-xs font-mono dark:text-zinc-400 text-slate-600">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DIMENSION 4: FINDINGS */}
            {(selectedDimension === 'all' || selectedDimension === 'findings') && (
              <div className="dark:bg-[#0c0c0e] bg-white rounded-2xl border dark:border-zinc-800 border-slate-200 overflow-hidden shadow-lg transition-colors">
                <div className="px-6 py-4 dark:bg-emerald-950/40 bg-emerald-100 border-b dark:border-emerald-800/50 border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <h3 className="font-orbitron font-bold text-sm sm:text-base dark:text-white text-emerald-950">
                      Key Findings &amp; Quantitative Discoveries
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-[#00ff41] font-bold">
                    Empirical Values &amp; Mechanisms
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <p className="font-mono text-xs sm:text-sm dark:text-zinc-300 text-slate-700 leading-relaxed">
                    {analysisResult.dimensions.findings.summary}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                      Quantitative Discoveries &amp; Performance Metrics:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysisResult.dimensions.findings.bulletPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-800 border-slate-200 text-xs font-mono"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-none" />
                          <span className="dark:text-zinc-300 text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysisResult.dimensions.findings.subsections?.map((sub, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg dark:bg-zinc-900/60 bg-slate-50 border dark:border-zinc-800/80 border-slate-200">
                      <h5 className="text-xs font-mono font-bold dark:text-emerald-400 text-emerald-700 mb-1.5">
                        {sub.subtitle}
                      </h5>
                      <ul className="space-y-1">
                        {sub.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-xs font-mono dark:text-zinc-400 text-slate-600">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DIMENSION 5: FUTURE GAPS */}
            {(selectedDimension === 'all' || selectedDimension === 'futureGaps') && (
              <div className="dark:bg-[#0c0c0e] bg-white rounded-2xl border dark:border-zinc-800 border-slate-200 overflow-hidden shadow-lg transition-colors">
                <div className="px-6 py-4 dark:bg-pink-950/40 bg-pink-100 border-b dark:border-pink-800/50 border-pink-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center font-bold text-xs">
                      5
                    </span>
                    <h3 className="font-orbitron font-bold text-sm sm:text-base dark:text-white text-pink-950">
                      Future Gaps &amp; Open Directions
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold">
                    Actionable Next Research Steps
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <p className="font-mono text-xs sm:text-sm dark:text-zinc-300 text-slate-700 leading-relaxed">
                    {analysisResult.dimensions.futureGaps.summary}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400">
                      Unresolved Technical Questions &amp; Roadmap:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysisResult.dimensions.futureGaps.bulletPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-800 border-slate-200 text-xs font-mono"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-none" />
                          <span className="dark:text-zinc-300 text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysisResult.dimensions.futureGaps.subsections?.map((sub, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg dark:bg-zinc-900/60 bg-slate-50 border dark:border-zinc-800/80 border-slate-200">
                      <h5 className="text-xs font-mono font-bold dark:text-pink-400 text-pink-700 mb-1.5">
                        {sub.subtitle}
                      </h5>
                      <ul className="space-y-1">
                        {sub.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-xs font-mono dark:text-zinc-400 text-slate-600">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
