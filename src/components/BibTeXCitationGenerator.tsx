import React, { useState, useMemo, useEffect } from 'react';
import { Publication } from '../types';
import {
  CitationStyle,
  CitationKeyStyle,
  formatPublication,
  formatMultiplePublications,
  downloadCitationFile,
} from '../utils/citationFormatter';
import {
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Quote,
  Layers,
  Sparkles,
  X,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  Sliders,
  CheckSquare,
  Square,
  BookOpen,
} from 'lucide-react';

interface BibTeXCitationGeneratorProps {
  publications: Publication[];
  initialSelectedId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onNotify?: (msg: string, isError?: boolean) => void;
  mode?: 'modal' | 'embedded';
}

const STYLE_OPTIONS: { id: CitationStyle; label: string; ext: string; badge: string; description: string }[] = [
  { id: 'bibtex', label: 'BibTeX', ext: 'bib', badge: 'LaTeX / Overleaf', description: 'Standard format for LaTeX, Overleaf, and computational manuscripts' },
  { id: 'apa', label: 'APA 7th', ext: 'txt', badge: 'Social / Physical', description: 'American Psychological Association 7th edition' },
  { id: 'ieee', label: 'IEEE', ext: 'txt', badge: 'Engineering', description: 'Institute of Electrical and Electronics Engineers format' },
  { id: 'chicago', label: 'Chicago', ext: 'txt', badge: 'Author-Date', description: 'Chicago Manual of Style author-date system' },
  { id: 'harvard', label: 'Harvard', ext: 'txt', badge: 'International', description: 'Standard Harvard referencing style' },
  { id: 'mla', label: 'MLA 9th', ext: 'txt', badge: 'Humanities', description: 'Modern Language Association 9th edition' },
  { id: 'ris', label: 'RIS', ext: 'ris', badge: 'Zotero / Mendeley', description: 'Direct import format for Zotero, Mendeley, and EndNote' },
];

export const BibTeXCitationGenerator: React.FC<BibTeXCitationGeneratorProps> = ({
  publications,
  initialSelectedId,
  isOpen = true,
  onClose,
  onNotify,
  mode = 'modal',
}) => {
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('bibtex');
  const [keyStyle, setKeyStyle] = useState<CitationKeyStyle>('authorYear');
  const [customKey, setCustomKey] = useState<string>('');
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>(() => {
    if (initialSelectedId) return [initialSelectedId];
    return publications.length > 0 ? [publications[0].id] : [];
  });
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Sync initialSelectedId when prop changes
  useEffect(() => {
    if (initialSelectedId) {
      setSelectedPaperIds([initialSelectedId]);
      setIsBatchMode(false);
    }
  }, [initialSelectedId]);

  // Handle escape key to close modal
  useEffect(() => {
    if (mode === 'modal' && isOpen && onClose) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [mode, isOpen, onClose]);

  // Selected publications list
  const selectedPubs = useMemo(() => {
    return publications.filter((p) => selectedPaperIds.includes(p.id));
  }, [publications, selectedPaperIds]);

  const activeSinglePub = useMemo(() => {
    if (selectedPubs.length > 0) return selectedPubs[0];
    return publications[0] || null;
  }, [selectedPubs, publications]);

  // Generated citation text
  const generatedContent = useMemo(() => {
    if (isBatchMode) {
      return formatMultiplePublications(selectedPubs, selectedStyle, keyStyle);
    }
    if (!activeSinglePub) return '// No publication selected.';
    return formatPublication(activeSinglePub, selectedStyle, 1, keyStyle, customKey);
  }, [isBatchMode, selectedPubs, activeSinglePub, selectedStyle, keyStyle, customKey]);

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    const count = isBatchMode ? selectedPubs.length : 1;
    if (onNotify) {
      onNotify(`Copied ${count} ${selectedStyle.toUpperCase()} citation${count > 1 ? 's' : ''} to clipboard.`);
    }
    setTimeout(() => setIsCopied(false), 2400);
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    const styleDef = STYLE_OPTIONS.find((s) => s.id === selectedStyle) || STYLE_OPTIONS[0];
    const isSingle = !isBatchMode && activeSinglePub;
    const baseSlug = isSingle
      ? `${activeSinglePub.authors.split(',')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}_${activeSinglePub.year}`
      : 'swid_shrk_citations';
    const filename = `${baseSlug}.${styleDef.ext}`;
    const mime = selectedStyle === 'bibtex' ? 'application/x-bibtex' : selectedStyle === 'ris' ? 'application/x-research-info-systems' : 'text/plain';

    downloadCitationFile(generatedContent, filename, mime);
    if (onNotify) {
      onNotify(`Downloaded ${filename}`);
    }
  };

  const toggleSelectPaper = (id: string) => {
    if (!isBatchMode) {
      setSelectedPaperIds([id]);
      return;
    }
    setSelectedPaperIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedPaperIds(publications.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    if (publications.length > 0) {
      setSelectedPaperIds([publications[0].id]);
    } else {
      setSelectedPaperIds([]);
    }
  };

  if (mode === 'modal' && !isOpen) return null;

  const contentJsx = (
    <div className="font-mono text-xs dark:text-zinc-200 text-slate-800 space-y-4">
      {/* Top Header & Context Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-zinc-800 border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg dark:bg-[#00ff41]/15 bg-emerald-100 flex items-center justify-center text-[#00ff41] dark:text-[#00ff41] text-emerald-700">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-sm sm:text-base dark:text-white text-slate-900 tracking-wide">
                BibTeX &amp; Citation Generator Studio
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-[#00ff41]/10 bg-emerald-50 text-emerald-800 dark:text-[#00ff41] border dark:border-[#00ff41]/30 border-emerald-300 font-bold">
                LaTeX · Zotero · EndNote
              </span>
            </div>
            <p className="dark:text-zinc-400 text-slate-500 text-[11px] mt-0.5">
              Generate, customize citation keys, and copy formatted bibliographic references in 7 international styles.
            </p>
          </div>
        </div>

        {mode === 'modal' && onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-auto p-1.5 rounded-lg dark:hover:bg-zinc-800 hover:bg-slate-100 dark:text-zinc-400 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close Citation Generator"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Control Station: Mode Switcher (Single vs Batch) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:bg-[#05070a] bg-slate-50 p-3 rounded-xl border dark:border-zinc-800/80 border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-600">
            Target:
          </span>
          <div className="inline-flex rounded-lg border dark:border-zinc-700 border-slate-300 p-0.5 dark:bg-black bg-white">
            <button
              onClick={() => {
                setIsBatchMode(false);
                if (selectedPaperIds.length === 0 && publications.length > 0) {
                  setSelectedPaperIds([publications[0].id]);
                } else if (selectedPaperIds.length > 1) {
                  setSelectedPaperIds([selectedPaperIds[0]]);
                }
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                !isBatchMode
                  ? 'dark:bg-[#00ff41] bg-emerald-600 dark:text-black text-white shadow-xs'
                  : 'dark:text-zinc-400 text-slate-600 hover:text-white'
              }`}
            >
              Single Paper
            </button>
            <button
              onClick={() => {
                setIsBatchMode(true);
                if (selectedPaperIds.length <= 1) {
                  handleSelectAll();
                }
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                isBatchMode
                  ? 'dark:bg-[#00b8ff] bg-sky-600 text-white font-bold shadow-xs'
                  : 'dark:text-zinc-400 text-slate-600 hover:text-white'
              }`}
            >
              Batch Bibliography ({selectedPubs.length}/{publications.length})
            </button>
          </div>
        </div>

        {/* Paper Selector Dropdown / Quick Selector */}
        {!isBatchMode ? (
          <div className="flex-1 max-w-md relative">
            <select
              value={activeSinglePub?.id || ''}
              onChange={(e) => setSelectedPaperIds([e.target.value])}
              className="w-full pl-3 pr-8 py-1.5 rounded-lg dark:bg-zinc-900 bg-white border dark:border-zinc-700 border-slate-300 text-[11px] dark:text-zinc-200 text-slate-800 focus:outline-none focus:border-sky-500 dark:focus:border-[#00ff41] cursor-pointer truncate shadow-xs"
            >
              {publications.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.year}] {p.title.length > 55 ? `${p.title.slice(0, 55)}...` : p.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-[10px] font-bold px-2 py-1 rounded dark:bg-zinc-800 bg-white border dark:border-zinc-700 border-slate-300 dark:text-zinc-300 text-slate-700 hover:border-sky-500 cursor-pointer"
            >
              Select All ({publications.length})
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-[10px] font-bold px-2 py-1 rounded dark:bg-zinc-800 bg-white border dark:border-zinc-700 border-slate-300 dark:text-zinc-300 text-slate-700 hover:border-red-400 cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Batch Paper Multi-select Checkboxes (Only shown in Batch Mode) */}
      {isBatchMode && (
        <div className="p-3 rounded-xl dark:bg-[#070b10] bg-slate-50 border dark:border-zinc-800 border-slate-200 max-h-36 overflow-y-auto space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mb-1 flex items-center justify-between">
            <span>Choose Publications to Include:</span>
            <span className="text-[#00b8ff] font-bold">{selectedPaperIds.length} of {publications.length} papers included</span>
          </div>
          {publications.map((pub) => {
            const isChecked = selectedPaperIds.includes(pub.id);
            return (
              <label
                key={pub.id}
                className="flex items-center gap-2 text-[11px] p-1.5 rounded-lg dark:hover:bg-zinc-900 hover:bg-slate-200/60 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelectPaper(pub.id)}
                  className="rounded dark:bg-zinc-800 border-zinc-600 text-sky-500 focus:ring-0 cursor-pointer"
                />
                <span className="font-bold text-[10px] px-1.5 py-0.2 rounded dark:bg-zinc-800 bg-slate-200 dark:text-zinc-300 text-slate-700 flex-none">
                  {pub.year}
                </span>
                <span className="truncate flex-1 font-medium dark:text-zinc-200 text-slate-800" title={pub.title}>
                  {pub.title}
                </span>
                <span className="text-[10px] text-zinc-500 truncate flex-none hidden md:inline">
                  {pub.journal}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Format Selector Tabs */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-600 flex items-center gap-1">
            <Quote className="w-3 h-3 text-[#00ff41]" />
            Citation Style / Output Standard:
          </span>
          <span className="text-[10px] dark:text-zinc-500 text-slate-500">
            {STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.description}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'dark:bg-[#00ff41]/15 bg-emerald-50 dark:border-[#00ff41] border-emerald-500 dark:text-[#00ff41] text-emerald-900 font-bold shadow-xs'
                    : 'dark:bg-zinc-900/50 bg-white border-slate-200 dark:border-zinc-800 dark:text-zinc-400 text-slate-700 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs">{style.label}</span>
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded dark:bg-zinc-800 bg-slate-100 opacity-80">
                    .{style.ext}
                  </span>
                </div>
                <div className="text-[9px] opacity-75 truncate">{style.badge}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* BibTeX Customization Sub-Bar (When BibTeX style is active) */}
      {selectedStyle === 'bibtex' && (
        <div className="p-3 rounded-xl dark:bg-[#070b10] bg-slate-100 border dark:border-zinc-800/90 border-slate-200 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider dark:text-zinc-300 text-slate-700">
              <Sliders className="w-3 h-3 text-[#00b8ff]" />
              <span>BibTeX Key Convention:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setKeyStyle('authorYear');
                  setCustomKey('');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                  keyStyle === 'authorYear' && !customKey
                    ? 'dark:bg-[#00b8ff]/20 dark:text-[#00b8ff] dark:border-[#00b8ff] bg-sky-100 text-sky-800 border-sky-400'
                    : 'dark:bg-zinc-900 bg-white dark:text-zinc-400 text-slate-600 border dark:border-zinc-700 border-slate-300'
                }`}
                title="Example: rekavandi2024neural"
              >
                author:year:title
              </button>
              <button
                type="button"
                onClick={() => {
                  setKeyStyle('authorYearJournal');
                  setCustomKey('');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                  keyStyle === 'authorYearJournal' && !customKey
                    ? 'dark:bg-[#00b8ff]/20 dark:text-[#00b8ff] dark:border-[#00b8ff] bg-sky-100 text-sky-800 border-sky-400'
                    : 'dark:bg-zinc-900 bg-white dark:text-zinc-400 text-slate-600 border dark:border-zinc-700 border-slate-300'
                }`}
                title="Example: rekavandi2024jmbbm"
              >
                author:year:journal
              </button>
            </div>
          </div>

          {!isBatchMode && (
            <div className="flex items-center gap-2 pt-1 border-t dark:border-zinc-800/60 border-slate-200 text-[11px]">
              <span className="text-zinc-500 dark:text-zinc-400 flex-none text-[10px]">Custom Key:</span>
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="e.g. Hejazi2024_Viscoelasticity"
                className="flex-1 px-2 py-1 rounded dark:bg-black bg-white border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 text-[11px] focus:outline-none focus:border-[#00b8ff]"
              />
              {customKey && (
                <button
                  type="button"
                  onClick={() => setCustomKey('')}
                  className="text-zinc-400 hover:text-red-400 text-[10px] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Live Preview Box with Syntax Aesthetics */}
      <div className="relative rounded-2xl dark:bg-[#020408] bg-slate-900 border dark:border-zinc-800 border-slate-800 shadow-xl overflow-hidden font-mono">
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b dark:border-zinc-800/80 border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="text-[11px] text-zinc-400 ml-2 font-bold flex items-center gap-1.5">
              <span>{isBatchMode ? `swid_shrk_bibliography.${STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.ext}` : `${activeSinglePub ? activeSinglePub.id : 'citation'}.${STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.ext}`}</span>
              <span className="text-[10px] text-zinc-500">
                ({isBatchMode ? `${selectedPubs.length} entries` : '1 entry'} · {generatedContent.length} chars)
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeSinglePub?.doi && !isBatchMode && (
              <a
                href={`https://doi.org/${activeSinglePub.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 mr-1"
                title="Verify publication on publisher DOI server"
              >
                <span>doi.org</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {selectedStyle}
            </span>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="p-4 overflow-x-auto max-h-72 text-zinc-200 text-[11px] leading-relaxed select-all">
          <pre className="whitespace-pre font-mono selection:bg-[#00ff41]/30 selection:text-white">
            {generatedContent}
          </pre>
        </div>

        {/* Action Toolbar Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-black/60 border-t dark:border-zinc-800/80 border-slate-800">
          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
            <span>Ready for LaTeX manuscripts, Overleaf, Word, or reference managers</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Download File Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all cursor-pointer hover:border-sky-400"
              title={`Download .${STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.ext} file`}
            >
              <Download className="w-3.5 h-3.5 text-[#00b8ff]" />
              <span>Download .{STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.ext}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                isCopied
                  ? 'bg-[#00ff41] text-black shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Copy formatted citation to system clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === 'embedded') {
    return (
      <div className="rounded-2xl dark:bg-[#0a0f15]/95 bg-white border dark:border-zinc-800 border-slate-200 p-4 sm:p-6 shadow-sm">
        {contentJsx}
      </div>
    );
  }

  // Modal Presentation
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl dark:bg-[#0c1017] bg-white border dark:border-zinc-700 border-slate-300 p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {contentJsx}
      </div>
    </div>
  );
};
