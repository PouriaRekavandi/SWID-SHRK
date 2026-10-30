import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PUBLICATIONS } from '../data/initialData';
import { Publication } from '../types';
import {
  Search,
  Calendar,
  Tag,
  ExternalLink,
  Copy,
  Check,
  X,
  Filter,
  ArrowUpDown,
  FileText,
  RotateCcw,
  BookOpen,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Download,
  LayoutGrid,
  List,
  Quote,
  ChevronDown,
  ChevronUp,
  FileCode,
  TrendingUp,
  Activity,
  BarChart3,
} from 'lucide-react';
import { BibTeXCitationGenerator } from './BibTeXCitationGenerator';

interface PublicationsSectionProps {
  onNotify?: (msg: string, isError?: boolean) => void;
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ onNotify }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedKeyword, setSelectedKeyword] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'title-asc' | 'journal-asc'>('year-desc');
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');
  const [showCitationDetails, setShowCitationDetails] = useState<boolean>(false);
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});
  const [expandedBibtex, setExpandedBibtex] = useState<Record<string, boolean>>({});
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [allBibtexCopied, setAllBibtexCopied] = useState(false);
  const [chartMetric, setChartMetric] = useState<'annual' | 'cumulative' | 'combined'>('annual');
  const [isChartVisible, setIsChartVisible] = useState<boolean>(true);
  const [generatorModalOpen, setGeneratorModalOpen] = useState<boolean>(false);
  const [generatorSelectedPaperId, setGeneratorSelectedPaperId] = useState<string | undefined>(undefined);
  const [isEmbeddedGeneratorOpen, setIsEmbeddedGeneratorOpen] = useState<boolean>(false);

  // Extract all unique years present in publications, sorted newest to oldest
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(PUBLICATIONS.map((p) => p.year))).sort((a, b) => b - a);
    return years;
  }, []);

  // Extract all unique topics/categories
  const availableTopics = useMemo(() => {
    const topics = Array.from(new Set(PUBLICATIONS.map((p) => p.category)));
    return topics.sort();
  }, []);

  // Count publications per year
  const countPerYear = useMemo(() => {
    const map: Record<number, number> = {};
    PUBLICATIONS.forEach((p) => {
      map[p.year] = (map[p.year] || 0) + 1;
    });
    return map;
  }, []);

  // Count publications per topic
  const countPerTopic = useMemo(() => {
    const map: Record<string, number> = {};
    PUBLICATIONS.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, []);

  // Extract top keywords with counts across all publications
  const popularKeywords = useMemo(() => {
    const kwMap = new Map<string, number>();
    PUBLICATIONS.forEach((p) => {
      p.keywords?.forEach((k) => {
        kwMap.set(k, (kwMap.get(k) || 0) + 1);
      });
    });
    return Array.from(kwMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([k, count]) => ({ keyword: k, count }));
  }, []);

  // Summary Widget Statistics
  const totalPapersCount = PUBLICATIONS.length;
  const totalTopicsCount = availableTopics.length;
  const yearSpan = useMemo(() => {
    if (availableYears.length === 0) return '—';
    const min = Math.min(...availableYears);
    const max = Math.max(...availableYears);
    return `${min} – ${max}`;
  }, [availableYears]);
  const totalKeywordsCount = popularKeywords.length;
  const uniqueJournalsCount = useMemo(() => {
    return new Set(PUBLICATIONS.map((p) => p.journal)).size;
  }, []);

  // Yearly publications trend data for recharts
  const yearlyTrendData = useMemo(() => {
    const sortedYears = Array.from(new Set(PUBLICATIONS.map((p) => p.year))).sort((a, b) => a - b);
    if (sortedYears.length === 0) return [];

    const minYear = sortedYears[0];
    const maxYear = sortedYears[sortedYears.length - 1];
    const data = [];
    let runningTotal = 0;

    for (let y = minYear; y <= maxYear; y++) {
      const papers = PUBLICATIONS.filter((p) => p.year === y);
      const volume = papers.length;
      runningTotal += volume;
      data.push({
        year: y,
        yearLabel: String(y),
        papersCount: volume,
        cumulativeVolume: runningTotal,
        papersList: papers.map((p) => ({ title: p.title, category: p.category, journal: p.journal })),
      });
    }
    return data;
  }, []);

  const peakYearInfo = useMemo(() => {
    if (yearlyTrendData.length === 0) return { count: 0, years: [] as number[] };
    let max = 0;
    yearlyTrendData.forEach((d) => {
      if (d.papersCount > max) max = d.papersCount;
    });
    const peakYears = yearlyTrendData.filter((d) => d.papersCount === max).map((d) => d.year);
    return { count: max, years: peakYears };
  }, [yearlyTrendData]);

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    return PUBLICATIONS.filter((pub) => {
      // Keyword/query search in title, authors, journal, abstract, DOI, or keyword tags
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        pub.title.toLowerCase().includes(query) ||
        pub.authors.toLowerCase().includes(query) ||
        pub.journal.toLowerCase().includes(query) ||
        String(pub.year).includes(query) ||
        pub.category.toLowerCase().includes(query) ||
        (pub.doi && pub.doi.toLowerCase().includes(query)) ||
        (pub.abstract && pub.abstract.toLowerCase().includes(query)) ||
        (pub.keywords && pub.keywords.some((k) => k.toLowerCase().includes(query)));

      // Year filter
      const matchesYear = selectedYear === 'all' || pub.year === Number(selectedYear);

      // Topic / Category filter
      const matchesTopic = selectedTopic === 'all' || pub.category === selectedTopic;

      // Specific tag keyword filter
      const matchesKeyword =
        selectedKeyword === 'all' ||
        (pub.keywords && pub.keywords.includes(selectedKeyword));

      return matchesQuery && matchesYear && matchesTopic && matchesKeyword;
    }).sort((a, b) => {
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'year-asc') return a.year - b.year;
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'journal-asc') return a.journal.localeCompare(b.journal);
      return 0;
    });
  }, [searchQuery, selectedYear, selectedTopic, selectedKeyword, sortBy]);

  const handleCopyBibtex = (pub: Publication) => {
    if (pub.bibtex) {
      navigator.clipboard.writeText(pub.bibtex);
      setCopiedId(pub.id);
      if (onNotify) onNotify(`BibTeX citation copied for: "${pub.title.slice(0, 45)}..."`);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleCopyAllBibtex = () => {
    const combined = filteredPublications
      .filter((p) => p.bibtex)
      .map((p) => p.bibtex)
      .join('\n\n');
    if (combined) {
      navigator.clipboard.writeText(combined);
      setAllBibtexCopied(true);
      if (onNotify) {
        onNotify(`Copied ${filteredPublications.length} BibTeX citations to clipboard.`);
      }
      setTimeout(() => setAllBibtexCopied(false), 2500);
    }
  };

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePaperCitation = (id: string) => {
    setExpandedCitations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePaperBibtex = (id: string) => {
    setExpandedBibtex((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getFormattedCitation = (pub: Publication) => {
    return `${pub.authors} (${pub.year}). "${pub.title}". ${pub.journal}${pub.doi ? `, DOI: ${pub.doi}` : ''}.`;
  };

  const handleCopyFormattedCitation = (pub: Publication) => {
    const citation = getFormattedCitation(pub);
    navigator.clipboard.writeText(citation);
    setCopiedCitationId(pub.id);
    if (onNotify) onNotify(`Formatted citation copied for: "${pub.title.slice(0, 45)}..."`);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedTopic('all');
    setSelectedKeyword('all');
    setSortBy('year-desc');
    if (onNotify) onNotify('All publication search & filters reset.');
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedYear !== 'all' ||
    selectedTopic !== 'all' ||
    selectedKeyword !== 'all';

  // Highlight helper
  const highlightMatch = (text: string): React.ReactNode => {
    const query = searchQuery.trim();
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          className="dark:bg-[#00ff41]/25 bg-amber-200 dark:text-[#00ff41] text-amber-950 font-semibold px-0.5 rounded transition-colors"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isSelected = selectedYear === String(data.year);
      return (
        <div className="p-3 sm:p-3.5 rounded-xl dark:bg-[#080d14]/95 bg-slate-900 border dark:border-[#00ff41]/50 border-sky-400 shadow-2xl font-mono text-xs max-w-xs pointer-events-none backdrop-blur-md z-50">
          <div className="flex items-center justify-between gap-2 border-b dark:border-zinc-800 border-slate-700 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
              <span className="font-bold text-white font-orbitron">{data.year} Research Output</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold dark:bg-[#00ff41]/20 dark:text-[#00ff41] bg-emerald-500/20 text-emerald-300">
              {data.papersCount} {data.papersCount === 1 ? 'Paper' : 'Papers'}
            </span>
          </div>

          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-[11px] text-zinc-300">
              <span className="text-zinc-400">Annual Volume:</span>
              <span className="font-bold text-[#00ff41]">{data.papersCount} published</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-300">
              <span className="text-zinc-400">Cumulative Total:</span>
              <span className="font-bold text-[#00b8ff]">{data.cumulativeVolume} total works</span>
            </div>
          </div>

          {data.papersList && data.papersList.length > 0 && (
            <div className="border-t dark:border-zinc-800 border-slate-700/80 pt-1.5 space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                Published in {data.year}:
              </div>
              {data.papersList.map((p: any, idx: number) => (
                <div key={idx} className="text-[10px] text-zinc-300 leading-snug truncate" title={p.title}>
                  • {p.title}
                </div>
              ))}
            </div>
          )}

          <div className="mt-2.5 pt-1.5 border-t dark:border-zinc-800 border-slate-700 text-[9px] text-center font-bold">
            {isSelected ? (
              <span className="text-amber-400">Filter applied (Click point to reset)</span>
            ) : (
              <span className="dark:text-[#00ff41] text-sky-400">Click point to filter by {data.year}</span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 dark:border-[#00b8ff] border-sky-600 pb-4">
        <div>
          <div className="inline-block pb-1">
            <h2 className="font-section-title text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider dark:text-white text-slate-900 flex items-center">
              <span className="dark:text-[#00ff41] text-emerald-600 font-mono mr-2 select-none">//</span>
              <span>Peer-Reviewed Publications &amp; Papers</span>
            </h2>
          </div>
          <p className="dark:text-zinc-400 text-slate-600 font-mono text-xs sm:text-sm max-w-2xl leading-relaxed mt-1">
            Multiaxial fatigue, dynamic fracture mechanics, neural viscoelasticity, and architected metamaterials authored by Dr. Pouria Hejazi Rekavandi and research associates.
          </p>
        </div>

        {/* Header Action Tools: BibTeX Generator Studio & Quick Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setGeneratorSelectedPaperId(filteredPublications[0]?.id || PUBLICATIONS[0]?.id);
              setGeneratorModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold dark:bg-[#00ff41]/15 bg-emerald-100 dark:text-[#00ff41] text-emerald-800 border dark:border-[#00ff41]/50 border-emerald-400 hover:bg-[#00ff41]/25 dark:hover:bg-[#00ff41]/25 transition-all cursor-pointer shadow-sm hover:scale-102"
            title="Open interactive BibTeX & multi-format academic citation generator modal"
          >
            <FileCode className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>BibTeX Generator Studio</span>
            <Sparkles className="w-3 h-3 text-[#00b8ff] animate-pulse" />
          </button>

          <button
            onClick={() => setIsEmbeddedGeneratorOpen(!isEmbeddedGeneratorOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer shadow-xs ${
              isEmbeddedGeneratorOpen
                ? 'dark:bg-[#00b8ff]/20 dark:border-[#00b8ff] dark:text-[#00b8ff] bg-sky-100 border-sky-400 text-sky-800'
                : 'dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 border dark:border-zinc-700 border-slate-300 hover:border-sky-500'
            }`}
            title="Toggle in-page Citation Generator workstation"
          >
            <Quote className="w-3.5 h-3.5 text-[#00b8ff]" />
            <span>{isEmbeddedGeneratorOpen ? 'Close Station' : 'In-Page Station'}</span>
          </button>

          <button
            onClick={handleCopyAllBibtex}
            disabled={filteredPublications.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold dark:bg-zinc-900 bg-white dark:text-zinc-200 text-slate-700 border dark:border-zinc-700 border-slate-300 hover:border-sky-500 dark:hover:border-[#00b8ff] transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy BibTeX citations for all currently filtered papers"
          >
            {allBibtexCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00ff41]" />
                <span className="dark:text-[#00ff41] text-emerald-600">Copied {filteredPublications.length} BibTeX</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#00b8ff]" />
                <span>Export BibTeX ({filteredPublications.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Embedded In-Page BibTeX Citation Generator Workstation */}
      {isEmbeddedGeneratorOpen && (
        <div className="animate-fadeIn">
          <BibTeXCitationGenerator
            publications={PUBLICATIONS}
            initialSelectedId={generatorSelectedPaperId || filteredPublications[0]?.id}
            mode="embedded"
            onNotify={onNotify}
          />
        </div>
      )}

      {/* Publications Summary Widget */}
      <div className="rounded-2xl dark:bg-[#0c1015]/90 bg-white border dark:border-zinc-800 border-slate-200 p-4 sm:p-5 shadow-sm font-mono space-y-4">
        {/* Terminal Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b dark:border-zinc-800/80 border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider dark:text-zinc-200 text-slate-800">
              Lab Research Metrics &amp; Archive Statistics
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] dark:text-zinc-400 text-slate-500">
            <span className="px-2 py-0.5 rounded dark:bg-zinc-900 bg-slate-100 border dark:border-zinc-800 border-slate-200">
              {uniqueJournalsCount} International Journals
            </span>
            <span className="px-2 py-0.5 rounded dark:bg-[#00ff41]/10 dark:text-[#00ff41] bg-emerald-50 text-emerald-800 border dark:border-[#00ff41]/30 border-emerald-200 font-bold">
              100% Peer-Reviewed
            </span>
          </div>
        </div>

        {/* 4-Stat Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Stat 1: Total Papers */}
          <button
            onClick={() => handleResetFilters()}
            className="text-left p-3.5 sm:p-4 rounded-xl dark:bg-zinc-900/50 bg-slate-50 border dark:border-zinc-800/90 border-slate-200 hover:border-emerald-500 dark:hover:border-[#00ff41] transition-all group cursor-pointer"
            title="Click to view all archived publications"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500">
                Total Papers Published
              </span>
              <BookOpen className="w-4 h-4 text-[#00ff41] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold dark:text-white text-slate-900 font-orbitron flex items-baseline gap-1.5">
              <span>{totalPapersCount}</span>
              <span className="text-[10px] font-mono dark:text-zinc-400 text-slate-500 font-normal">
                Published
              </span>
            </div>
            <div className="text-[11px] dark:text-zinc-500 text-slate-500 mt-1 truncate">
              {hasActiveFilters ? (
                <span className="text-[#00ff41] font-bold">
                  ({filteredPublications.length} currently matching)
                </span>
              ) : (
                'Archived & DOI Indexed'
              )}
            </div>
          </button>

          {/* Stat 2: Topics Covered */}
          <button
            onClick={() => setSelectedTopic('all')}
            className="text-left p-3.5 sm:p-4 rounded-xl dark:bg-zinc-900/50 bg-slate-50 border dark:border-zinc-800/90 border-slate-200 hover:border-amber-500 dark:hover:border-amber-400 transition-all group cursor-pointer"
            title="Click to view all research topics"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500">
                Research Topics Covered
              </span>
              <Layers className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold dark:text-white text-slate-900 font-orbitron flex items-baseline gap-1.5">
              <span>{totalTopicsCount}</span>
              <span className="text-[10px] font-mono dark:text-zinc-400 text-slate-500 font-normal">
                Domains
              </span>
            </div>
            <div className="text-[11px] dark:text-zinc-500 text-slate-500 mt-1 truncate">
              Metamaterials, Fracture, TBI...
            </div>
          </button>

          {/* Stat 3: Year Span */}
          <button
            onClick={() => setSelectedYear('all')}
            className="text-left p-3.5 sm:p-4 rounded-xl dark:bg-zinc-900/50 bg-slate-50 border dark:border-zinc-800/90 border-slate-200 hover:border-sky-500 dark:hover:border-[#00b8ff] transition-all group cursor-pointer"
            title="Click to view full timeline"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500">
                Timeline Span
              </span>
              <Calendar className="w-4 h-4 text-[#00b8ff] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold dark:text-white text-slate-900 font-orbitron flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl">{yearSpan}</span>
            </div>
            <div className="text-[11px] dark:text-zinc-500 text-slate-500 mt-1 truncate">
              {availableYears.length} Production Years
            </div>
          </button>

          {/* Stat 4: Keywords & Methodology */}
          <button
            onClick={() => setSelectedKeyword('all')}
            className="text-left p-3.5 sm:p-4 rounded-xl dark:bg-zinc-900/50 bg-slate-50 border dark:border-zinc-800/90 border-slate-200 hover:border-purple-500 dark:hover:border-purple-400 transition-all group cursor-pointer"
            title="Click to view all technical keywords"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500">
                Keywords &amp; Tools
              </span>
              <Tag className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold dark:text-white text-slate-900 font-orbitron flex items-baseline gap-1.5">
              <span>{totalKeywordsCount}</span>
              <span className="text-[10px] font-mono dark:text-zinc-400 text-slate-500 font-normal">
                Tags
              </span>
            </div>
            <div className="text-[11px] dark:text-zinc-500 text-slate-500 mt-1 truncate">
              UMAT, VUMAT, DIC, PINN...
            </div>
          </button>
        </div>

        {/* Topic Breakdown Mini Distribution Strip */}
        <div className="pt-2 border-t dark:border-zinc-800/60 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500">
              Research Focus Distribution:
            </span>
            <span className="text-[10px] font-mono dark:text-zinc-500 text-slate-400">
              Click any topic to isolate papers
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {availableTopics.map((topic) => {
              const count = countPerTopic[topic] || 0;
              const percent = Math.round((count / totalPapersCount) * 100);
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(isSelected ? 'all' : topic)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'dark:bg-[#00ff41]/20 dark:border-[#00ff41] dark:text-[#00ff41] bg-emerald-100 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                      : 'dark:bg-zinc-900/60 dark:text-zinc-300 text-slate-600 dark:border-zinc-800 border-slate-200 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                  title={`Filter by ${topic} (${count} papers, ${percent}%)`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{topic}</span>
                  <span className="font-mono text-[9px] opacity-75">
                    {count} ({percent}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Trendline Chart (Recharts) */}
        <div className="pt-3 border-t dark:border-zinc-800/80 border-slate-200 space-y-3">
          {/* Chart Header with Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00ff41]" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider dark:text-zinc-200 text-slate-800">
                  Research Publication Volume Trendline
                </span>
                <span className="hidden sm:inline text-[11px] dark:text-zinc-500 text-slate-500 ml-2">
                  (2021 – 2026 Temporal Trajectory)
                </span>
              </div>
            </div>

            {/* Chart Toolbar: Metric Switcher & Collapse */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Metric Toggle: Annual vs Cumulative vs Both */}
              <div className="flex items-center rounded-lg border dark:border-zinc-700 border-slate-300 p-0.5 dark:bg-[#03060a] bg-slate-50 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setChartMetric('annual')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    chartMetric === 'annual'
                      ? 'dark:bg-[#00ff41]/20 dark:text-[#00ff41] bg-emerald-100 text-emerald-800 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Annual Volume
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('cumulative')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    chartMetric === 'cumulative'
                      ? 'dark:bg-[#00b8ff]/20 dark:text-[#00b8ff] bg-sky-100 text-sky-800 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Cumulative Output
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('combined')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    chartMetric === 'combined'
                      ? 'dark:bg-purple-950/40 dark:text-purple-300 bg-purple-100 text-purple-800 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Dual View
                </button>
              </div>

              {/* Toggle Chart Visibility */}
              <button
                type="button"
                onClick={() => setIsChartVisible(!isChartVisible)}
                className="px-2 py-1 rounded-lg border dark:border-zinc-700 border-slate-300 text-[10px] font-bold dark:text-zinc-400 text-slate-600 hover:text-white dark:hover:bg-zinc-800 bg-white transition-colors cursor-pointer flex items-center gap-1"
                title={isChartVisible ? 'Collapse trend chart' : 'Expand trend chart'}
              >
                <span>{isChartVisible ? 'Hide Chart' : 'Show Chart'}</span>
                {isChartVisible ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Quick Telemetry Chips */}
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="px-2 py-0.5 rounded dark:bg-zinc-900 bg-slate-100 dark:text-zinc-400 text-slate-600 border dark:border-zinc-800 border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
              <span>Peak Annual Velocity: <strong className="dark:text-white text-slate-800">{peakYearInfo.count} Papers/Yr</strong> ({peakYearInfo.years.join(', ')})</span>
            </span>
            <span className="px-2 py-0.5 rounded dark:bg-zinc-900 bg-slate-100 dark:text-zinc-400 text-slate-600 border dark:border-zinc-800 border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b8ff]" />
              <span>Total Indexed Output: <strong className="dark:text-white text-slate-800">{totalPapersCount} Works</strong></span>
            </span>
            {selectedYear !== 'all' && (
              <span className="px-2 py-0.5 rounded dark:bg-[#00b8ff]/15 dark:text-[#00b8ff] bg-sky-50 text-sky-800 border dark:border-[#00b8ff]/40 border-sky-300 font-bold flex items-center gap-1">
                <span>Filtering year: {selectedYear}</span>
                <button onClick={() => setSelectedYear('all')} className="hover:text-red-400 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Recharts Chart Canvas */}
          {isChartVisible && (
            <div className="rounded-xl p-3 sm:p-4 dark:bg-[#06090e] bg-slate-50 border dark:border-zinc-800/90 border-slate-200">
              <div className="h-56 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={yearlyTrendData}
                    margin={{ top: 12, right: 18, left: -16, bottom: 4 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload.length > 0) {
                        const clickedYear = String(e.activePayload[0].payload.year);
                        const next = selectedYear === clickedYear ? 'all' : clickedYear;
                        setSelectedYear(next);
                        if (onNotify) {
                          onNotify(
                            next === 'all'
                              ? 'Cleared year filter (showing all papers)'
                              : `Filtered papers published in ${next}`
                          );
                        }
                      }
                    }}
                  >
                    <defs>
                      <linearGradient id="annualVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff41" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#00ff41" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="cumulativeVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00b8ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00b8ff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#27272a"
                      opacity={0.35}
                      vertical={false}
                    />

                    <XAxis
                      dataKey="yearLabel"
                      stroke="#71717a"
                      tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                      tickLine={{ stroke: '#3f3f46' }}
                      axisLine={{ stroke: '#3f3f46' }}
                    />

                    <YAxis
                      stroke="#71717a"
                      allowDecimals={false}
                      domain={[0, (dataMax: number) => Math.max(dataMax + 1, chartMetric === 'cumulative' || chartMetric === 'combined' ? 9 : 3)]}
                      tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                      tickLine={{ stroke: '#3f3f46' }}
                      axisLine={{ stroke: '#3f3f46' }}
                    />

                    <Tooltip content={<CustomTrendTooltip />} />

                    {(chartMetric === 'annual' || chartMetric === 'combined') && (
                      <Area
                        type="monotone"
                        dataKey="papersCount"
                        name="Annual Volume"
                        stroke="#00ff41"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#annualVolumeGrad)"
                        activeDot={{ r: 6, fill: '#00ff41', stroke: '#ffffff', strokeWidth: 2 }}
                        dot={(props: any) => {
                          const isSelected = selectedYear === String(props.payload.year);
                          return (
                            <circle
                              key={props.key || props.index}
                              cx={props.cx}
                              cy={props.cy}
                              r={isSelected ? 6 : 4}
                              fill={isSelected ? '#00ff41' : '#00b8ff'}
                              stroke={isSelected ? '#ffffff' : '#0c1015'}
                              strokeWidth={isSelected ? 2.5 : 1.5}
                              className="cursor-pointer transition-transform hover:scale-125"
                            />
                          );
                        }}
                      />
                    )}

                    {(chartMetric === 'cumulative' || chartMetric === 'combined') && (
                      <Line
                        type="monotone"
                        dataKey="cumulativeVolume"
                        name="Cumulative Output"
                        stroke="#00b8ff"
                        strokeWidth={2}
                        strokeDasharray={chartMetric === 'combined' ? '4 4' : undefined}
                        dot={chartMetric === 'cumulative' ? { r: 4, fill: '#00b8ff' } : false}
                        activeDot={{ r: 6, fill: '#00b8ff', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Footer Hint */}
              <div className="flex items-center justify-between text-[10px] dark:text-zinc-500 text-slate-500 pt-2 border-t dark:border-zinc-800/60 border-slate-200">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#00ff41]" />
                  <span>Interactive Curve: Click any data point to filter publication registry by that year</span>
                </span>
                <span className="font-mono hidden sm:inline">Recharts Visual Analytics</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Search & Filter Control Station */}
      <div className="p-4 sm:p-6 rounded-2xl dark:bg-[#090d12]/95 bg-white border dark:border-zinc-800 border-slate-200 shadow-sm space-y-4 font-mono transition-all">
        {/* Row 1: Search Bar & Primary Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Real-time Keyword / Title / Author Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers by keyword, topic, title, author, journal, or DOI..."
              className="w-full pl-10 pr-9 py-2.5 dark:bg-[#03060a] bg-slate-50 border dark:border-zinc-700 border-slate-300 focus:border-sky-600 dark:focus:border-[#00ff41] rounded-xl text-xs sm:text-sm dark:text-white text-slate-900 placeholder:text-zinc-500 focus:outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-400 p-0.5 cursor-pointer transition-colors"
                title="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter by Topic Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="relative">
              <Layers className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 dark:bg-[#03060a] bg-slate-50 border dark:border-zinc-700 border-slate-300 focus:border-sky-600 dark:focus:border-[#00b8ff] rounded-xl text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none cursor-pointer appearance-none shadow-xs"
              >
                <option value="all">All Topics ({PUBLICATIONS.length})</option>
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic} ({countPerTopic[topic] || 0})
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter by Year Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#00b8ff] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 dark:bg-[#03060a] bg-slate-50 border dark:border-zinc-700 border-slate-300 focus:border-sky-600 dark:focus:border-[#00b8ff] rounded-xl text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none cursor-pointer appearance-none shadow-xs"
              >
                <option value="all">All Years ({PUBLICATIONS.length})</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Year: {year} ({countPerYear[year] || 0} papers)
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Quick Topic Filter Buttons (Segmented Chips) */}
        <div className="pt-2 border-t dark:border-zinc-800/80 border-slate-200">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              Topic:
            </span>
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                selectedTopic === 'all'
                  ? 'dark:bg-[#00ff41]/20 dark:border-[#00ff41] dark:text-[#00ff41] bg-emerald-100 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                  : 'dark:bg-zinc-900/60 dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white border dark:border-zinc-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>All Topics</span>
              <span className="text-[10px] opacity-75">({PUBLICATIONS.length})</span>
            </button>
            {availableTopics.map((topic) => {
              const active = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(active ? 'all' : topic)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    active
                      ? 'dark:bg-amber-950/40 dark:border-amber-500 dark:text-amber-300 bg-amber-100 border-amber-500 text-amber-900 font-bold shadow-xs'
                      : 'dark:bg-zinc-900/60 dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white border dark:border-zinc-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{topic}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active
                      ? 'dark:bg-amber-500/20 bg-amber-200 text-amber-900 dark:text-amber-300'
                      : 'dark:bg-zinc-800 bg-slate-100 text-slate-500 dark:text-zinc-500'
                  }`}>
                    {countPerTopic[topic]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Quick Year Pill Selector */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t dark:border-zinc-800/80 border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#00b8ff]" />
            Year:
          </span>
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
              selectedYear === 'all'
                ? 'dark:bg-[#00b8ff] dark:text-black bg-sky-600 text-white font-bold border-sky-600 dark:border-[#00b8ff] shadow-xs'
                : 'dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 bg-slate-100 text-slate-700 hover:bg-slate-200 border dark:border-zinc-800 border-slate-200'
            }`}
          >
            All Years ({PUBLICATIONS.length})
          </button>
          {availableYears.map((year) => {
            const active = selectedYear === String(year);
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(active ? 'all' : String(year))}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                  active
                    ? 'dark:bg-[#00b8ff] dark:text-black bg-sky-600 text-white font-bold border-sky-600 dark:border-[#00b8ff] shadow-xs'
                    : 'dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 bg-slate-100 text-slate-700 hover:bg-slate-200 border dark:border-zinc-800 border-slate-200'
                }`}
              >
                {year} <span className="opacity-70 text-[10px]">({countPerYear[year]})</span>
              </button>
            );
          })}
        </div>

        {/* Row 4: Popular Keywords Selector */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t dark:border-zinc-800/80 border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#00ff41]" />
            Keywords:
          </span>
          <button
            onClick={() => setSelectedKeyword('all')}
            className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
              selectedKeyword === 'all'
                ? 'dark:bg-[#00ff41] dark:text-black bg-emerald-600 text-white font-bold shadow-xs'
                : 'dark:bg-zinc-900 dark:text-zinc-400 bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:text-white border dark:border-zinc-800 border-slate-200'
            }`}
          >
            All Tags
          </button>
          {popularKeywords.slice(0, 10).map(({ keyword, count }) => {
            const active = selectedKeyword === keyword;
            return (
              <button
                key={keyword}
                onClick={() => setSelectedKeyword(active ? 'all' : keyword)}
                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer flex items-center gap-1 border ${
                  active
                    ? 'dark:bg-[#00ff41] dark:text-black dark:border-[#00ff41] bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                    : 'dark:bg-zinc-900 dark:text-zinc-400 bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:text-white border dark:border-zinc-800 border-slate-200 hover:border-emerald-500'
                }`}
              >
                <span>#{keyword}</span>
                {count > 1 && (
                  <span className={`text-[9px] px-1 rounded-full ${
                    active ? 'bg-black/20 text-black dark:text-black' : 'dark:bg-zinc-800 bg-slate-200 text-zinc-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Row 5: Active Filter Badges, Sort & View Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t dark:border-zinc-800/80 border-slate-200 text-xs">
          {/* Active filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="dark:text-zinc-300 text-slate-700 font-bold mr-1">
              Showing {filteredPublications.length} of {PUBLICATIONS.length} papers
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] dark:bg-emerald-950/60 bg-emerald-100 dark:text-emerald-300 text-emerald-800 border dark:border-emerald-800 border-emerald-300">
                Query: &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-400 cursor-pointer p-0.5"
                  title="Remove query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedTopic !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] dark:bg-amber-950/60 bg-amber-100 dark:text-amber-300 text-amber-800 border dark:border-amber-800 border-amber-300">
                Topic: {selectedTopic}
                <button
                  onClick={() => setSelectedTopic('all')}
                  className="hover:text-red-400 cursor-pointer p-0.5"
                  title="Remove topic filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedYear !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] dark:bg-sky-950/60 bg-sky-100 dark:text-sky-300 text-sky-800 border dark:border-sky-800 border-sky-300">
                Year: {selectedYear}
                <button
                  onClick={() => setSelectedYear('all')}
                  className="hover:text-red-400 cursor-pointer p-0.5"
                  title="Remove year filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedKeyword !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] dark:bg-purple-950/60 bg-purple-100 dark:text-purple-300 text-purple-800 border dark:border-purple-800 border-purple-300">
                Tag: #{selectedKeyword}
                <button
                  onClick={() => setSelectedKeyword('all')}
                  className="hover:text-red-400 cursor-pointer p-0.5"
                  title="Remove keyword filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors cursor-pointer ml-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            )}
          </div>

          {/* Right Controls: Citation Details Toggle, Sort Order & View Switcher */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            {/* Toggle Switch: Show/Hide Full Citation Details */}
            <div
              onClick={() => {
                const next = !showCitationDetails;
                setShowCitationDetails(next);
                if (onNotify) {
                  onNotify(
                    next
                      ? 'Full citation details shown for each paper'
                      : 'Full citation details hidden (clutter reduced)'
                  );
                }
              }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer select-none ${
                showCitationDetails
                  ? 'dark:bg-[#00ff41]/10 bg-emerald-50 dark:border-[#00ff41]/60 border-emerald-400 shadow-xs'
                  : 'dark:bg-[#03060a] bg-slate-50 dark:border-zinc-700 border-slate-300 hover:border-slate-400 dark:hover:border-zinc-600'
              }`}
              title="Toggle to show or hide full citation details, references, and BibTeX to reduce clutter"
            >
              <Quote className={`w-3.5 h-3.5 transition-colors ${showCitationDetails ? 'text-[#00ff41]' : 'text-zinc-400'}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider dark:text-zinc-200 text-slate-700 whitespace-nowrap">
                <span className="hidden md:inline">Full Citation Details:</span>
                <span className="md:hidden">Citations:</span>
              </span>

              {/* Accessible Switch Knob */}
              <button
                type="button"
                role="switch"
                aria-checked={showCitationDetails}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !showCitationDetails;
                  setShowCitationDetails(next);
                  if (onNotify) {
                    onNotify(
                      next
                        ? 'Full citation details shown for each paper'
                        : 'Full citation details hidden (clutter reduced)'
                    );
                  }
                }}
                className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showCitationDetails
                    ? 'dark:bg-[#00ff41] bg-emerald-600'
                    : 'dark:bg-zinc-700 bg-slate-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showCitationDetails ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </button>

              <span className={`text-[10px] font-mono font-bold min-w-[24px] ${showCitationDetails ? 'text-[#00ff41]' : 'text-zinc-400'}`}>
                {showCitationDetails ? 'ON' : 'OFF'}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] dark:text-zinc-500 text-slate-500 uppercase tracking-wider hidden lg:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 dark:bg-[#03060a] bg-slate-50 border dark:border-zinc-700 border-slate-300 focus:border-sky-600 dark:focus:border-[#00b8ff] rounded-lg text-xs dark:text-white text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="year-desc">Newest First</option>
                <option value="year-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="journal-asc">Journal (A-Z)</option>
              </select>
            </div>

            {/* View Mode Toggle: Cards vs Compact List */}
            <div className="flex items-center rounded-lg border dark:border-zinc-700 border-slate-300 p-0.5 dark:bg-[#03060a] bg-slate-50">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded text-xs cursor-pointer transition-colors ${
                  viewMode === 'cards'
                    ? 'dark:bg-zinc-800 bg-white text-sky-600 dark:text-[#00ff41] shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }`}
                title="Detailed Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded text-xs cursor-pointer transition-colors ${
                  viewMode === 'compact'
                    ? 'dark:bg-zinc-800 bg-white text-sky-600 dark:text-[#00ff41] shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }`}
                title="Compact Table List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Publications List Display */}
      {filteredPublications.length > 0 ? (
        viewMode === 'cards' ? (
          /* Cards View */
          <div className="space-y-5">
            {filteredPublications.map((pub) => {
              const isCopied = copiedId === pub.id;
              const isCitationCopied = copiedCitationId === pub.id;
              const isAbstractExpanded = Boolean(expandedAbstracts[pub.id]);
              const isCitationExpanded = showCitationDetails || Boolean(expandedCitations[pub.id]);
              const isBibtexOpen = Boolean(expandedBibtex[pub.id]);
              const formattedCitation = getFormattedCitation(pub);

              return (
                <article
                  key={pub.id}
                  className="group relative dark:bg-[#0c1015] bg-white border dark:border-[#22272e] border-slate-200 border-l-4 dark:border-l-[#00ff41] border-l-emerald-600 hover:border-l-sky-600 dark:hover:bg-[#111720] hover:bg-slate-50 p-5 sm:p-6 rounded-r-2xl transition-all duration-300 dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] shadow-md hover:-translate-y-0.5 font-mono"
                >
                  {/* Header: Title and Year Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                    <h3 className="text-base sm:text-lg font-bold dark:text-[#00ff41] text-emerald-800 dark:group-hover:text-white group-hover:text-sky-900 transition-colors leading-snug">
                      {highlightMatch(pub.title)}
                    </h3>
                    <div className="flex items-center gap-2 self-start flex-none">
                      <button
                        onClick={() => setSelectedYear(String(pub.year))}
                        className={`font-orbitron text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                          selectedYear === String(pub.year)
                            ? 'dark:bg-[#00b8ff] dark:text-black bg-sky-600 text-white'
                            : 'dark:text-[#00b8ff] text-sky-700 dark:bg-[#00b8ff]/15 bg-sky-50 dark:border dark:border-[#00b8ff]/40 border border-sky-300 hover:scale-105'
                        }`}
                        title={`Filter papers published in ${pub.year}`}
                      >
                        {pub.year}
                      </button>
                    </div>
                  </div>

                  {/* Authors and Journal */}
                  <div className="dark:text-zinc-300 text-slate-700 text-xs sm:text-sm font-semibold mb-1">
                    {highlightMatch(pub.authors)}
                  </div>

                  <div className="dark:text-[#00b8ff] text-sky-700 text-xs sm:text-sm italic mb-3 flex flex-wrap items-center gap-2">
                    <span>{highlightMatch(pub.journal)}</span>
                    {pub.doi && (
                      <span className="not-italic text-[11px] dark:text-zinc-400 text-slate-500 font-mono">
                        · DOI: <span className="hover:underline">{pub.doi}</span>
                      </span>
                    )}
                  </div>

                  {/* Full Citation Details Section (Show/Hide via Toggle or Individual Expander) */}
                  {isCitationExpanded && (
                    <div className="space-y-3.5 my-3.5 pt-3.5 border-t dark:border-zinc-800/80 border-slate-200 animate-fadeIn">
                      {/* Formatted Academic Citation Reference Box */}
                      <div className="p-3.5 rounded-xl dark:bg-[#05070a] bg-slate-50 border dark:border-zinc-800 border-slate-200 shadow-inner">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <Quote className="w-3.5 h-3.5 text-[#00ff41]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider dark:text-[#00ff41] text-emerald-700">
                              Full Academic Reference
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {pub.doi && (
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] dark:text-[#00b8ff] text-sky-600 hover:underline flex items-center gap-1"
                                title="Open publication through DOI resolver"
                              >
                                <span>doi.org/{pub.doi}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handleCopyFormattedCitation(pub)}
                              className="text-[10px] font-bold px-2.5 py-1 rounded dark:bg-zinc-800 bg-white border dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-700 hover:text-sky-600 dark:hover:text-[#00ff41] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Copy standard academic formatted reference text"
                            >
                              {isCitationCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-[#00ff41]" />
                                  <span className="text-[#00ff41]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Ref</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed dark:text-zinc-200 text-slate-800 font-mono select-all">
                          {formattedCitation}
                        </p>

                        {/* BibTeX Source Code Box */}
                        {pub.bibtex && (
                          <div className="mt-2.5 pt-2 border-t dark:border-zinc-800/60 border-slate-200/80">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => togglePaperBibtex(pub.id)}
                                className="text-[10px] font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 hover:text-sky-600 dark:hover:text-[#00b8ff] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <FileCode className="w-3 h-3" />
                                <span>BibTeX Source</span>
                                {isBibtexOpen ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleCopyBibtex(pub)}
                                className="text-[10px] text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center gap-1"
                                title="Copy raw BibTeX entry"
                              >
                                <Copy className="w-2.5 h-2.5" />
                                <span>{isCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            {isBibtexOpen && (
                              <pre className="mt-2 p-2.5 rounded-lg dark:bg-black/70 bg-slate-900 text-[10px] dark:text-zinc-300 text-slate-200 font-mono overflow-x-auto border dark:border-zinc-800 border-slate-800 leading-snug select-all animate-fadeIn">
                                {pub.bibtex}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Keyword Tags (Clickable to filter!) */}
                      {pub.keywords && pub.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider dark:text-zinc-500 text-slate-500 mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-[#00ff41]" />
                            Keywords:
                          </span>
                          {pub.keywords.map((kw) => {
                            const active = selectedKeyword === kw;
                            return (
                              <button
                                key={kw}
                                onClick={() => setSelectedKeyword(active ? 'all' : kw)}
                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer border ${
                                  active
                                    ? 'dark:bg-[#00ff41] dark:text-black dark:border-[#00ff41] bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 bg-slate-100 text-slate-600 hover:text-sky-700 border dark:border-zinc-800 border-slate-200'
                                }`}
                                title={`Filter by keyword #${kw}`}
                              >
                                #{kw}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Abstract Accordion */}
                      {pub.abstract && (
                        <div className="pt-1">
                          {isAbstractExpanded ? (
                            <div className="p-3.5 rounded-xl dark:bg-black/50 bg-slate-100 text-xs leading-relaxed dark:text-zinc-300 text-slate-700 border dark:border-zinc-800 border-slate-200 animate-fadeIn mb-1.5">
                              <div className="font-bold uppercase tracking-wider text-[10px] dark:text-[#00ff41] text-emerald-700 mb-1.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Research Abstract:
                              </div>
                              <p>{highlightMatch(pub.abstract)}</p>
                            </div>
                          ) : null}

                          <button
                            onClick={() => toggleAbstract(pub.id)}
                            className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <FileText className="w-3 h-3" />
                            {isAbstractExpanded ? 'Collapse Abstract' : 'Read Abstract...'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons: Category Badge, Individual Citation Details Expander, Copy BibTeX, Paper Link */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t dark:border-zinc-800/80 border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedTopic(pub.category)}
                        className="text-[10px] px-2.5 py-0.5 rounded-full dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-600 uppercase font-bold border dark:border-zinc-800 border-slate-200 hover:border-amber-500 cursor-pointer transition-colors"
                        title={`Filter by topic ${pub.category}`}
                      >
                        {pub.category}
                      </button>

                      {/* Individual Citation Details Button */}
                      <button
                        onClick={() => togglePaperCitation(pub.id)}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 font-bold ${
                          isCitationExpanded
                            ? 'dark:bg-[#00ff41]/15 dark:border-[#00ff41]/50 dark:text-[#00ff41] bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-400 text-slate-600 border-slate-300 dark:border-zinc-800 hover:border-sky-500'
                        }`}
                        title={isCitationExpanded ? 'Hide citation details for this paper' : 'Show full citation details for this paper'}
                      >
                        <Quote className="w-2.5 h-2.5" />
                        <span>{isCitationExpanded ? 'Hide Details' : 'Citation Details'}</span>
                        {isCitationExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setGeneratorSelectedPaperId(pub.id);
                          setGeneratorModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 dark:bg-[#00ff41]/10 bg-emerald-50 hover:bg-emerald-100 dark:hover:bg-[#00ff41]/20 dark:border-[#00ff41]/40 border-emerald-300 dark:text-[#00ff41] text-emerald-800 font-mono text-xs rounded-lg transition-colors cursor-pointer border shadow-xs"
                        title="Open interactive BibTeX and citation generator for this paper"
                      >
                        <FileCode className="w-3.5 h-3.5 text-[#00ff41]" />
                        <span>Cite / Generator</span>
                      </button>

                      <button
                        onClick={() => handleCopyBibtex(pub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 dark:bg-zinc-900 bg-slate-100 hover:bg-slate-200 dark:border-zinc-700 border-slate-300 dark:text-zinc-300 text-slate-700 font-mono text-xs rounded-lg transition-colors cursor-pointer border shadow-xs"
                        title="Copy BibTeX format citation"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00ff41]" />
                            <span className="text-emerald-700 dark:text-[#00ff41] font-bold">
                              BibTeX Copied!
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                            <span>Copy BibTeX</span>
                          </>
                        )}
                      </button>

                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 dark:bg-[#00ff41] dark:hover:bg-[#00b8ff] dark:text-[#050505] bg-emerald-600 hover:bg-sky-600 text-white font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
                      >
                        <span>View Paper</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Compact Table List View */
          <div className="rounded-2xl border dark:border-zinc-800 border-slate-200 overflow-hidden font-mono dark:bg-[#090d12] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b dark:border-zinc-800 border-slate-200 dark:bg-zinc-900/80 bg-slate-100 dark:text-zinc-300 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Title &amp; Authors</th>
                    <th className="py-3 px-4">Topic / Journal</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800/80 divide-slate-200">
                  {filteredPublications.map((pub) => {
                    const isCopied = copiedId === pub.id;
                    return (
                      <tr
                        key={pub.id}
                        className="dark:hover:bg-zinc-900/50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <button
                            onClick={() => setSelectedYear(String(pub.year))}
                            className="font-orbitron font-bold dark:text-[#00b8ff] text-sky-700 hover:underline cursor-pointer"
                          >
                            {pub.year}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold dark:text-white text-slate-900 text-sm mb-1 leading-snug">
                            {highlightMatch(pub.title)}
                          </div>
                          <div className="dark:text-zinc-400 text-slate-600 text-[11px] mb-1.5">
                            {highlightMatch(pub.authors)}
                          </div>
                          {showCitationDetails && (
                            <div className="mt-2 p-2 rounded-lg dark:bg-black/40 bg-slate-100 border dark:border-zinc-800 border-slate-200 text-[11px] font-mono leading-relaxed select-all">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold uppercase text-[9px] dark:text-[#00ff41] text-emerald-700 flex items-center gap-1">
                                  <Quote className="w-2.5 h-2.5" />
                                  Full Citation:
                                </span>
                                <button
                                  onClick={() => handleCopyFormattedCitation(pub)}
                                  className="text-[10px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-0.5"
                                >
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>{copiedCitationId === pub.id ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <p className="dark:text-zinc-300 text-slate-700">{getFormattedCitation(pub)}</p>
                            </div>
                          )}
                          {showCitationDetails && pub.keywords && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {pub.keywords.slice(0, 4).map((kw) => (
                                <button
                                  key={kw}
                                  onClick={() => setSelectedKeyword(kw)}
                                  className="text-[9px] px-1.5 py-0.2 rounded dark:bg-zinc-800 bg-slate-100 dark:text-zinc-400 text-slate-500 hover:text-sky-600"
                                >
                                  #{kw}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <div className="font-semibold dark:text-zinc-300 text-slate-700">
                            {pub.category}
                          </div>
                          <div className="text-[11px] italic dark:text-zinc-400 text-slate-500 max-w-xs truncate">
                            {pub.journal}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => {
                              setGeneratorSelectedPaperId(pub.id);
                              setGeneratorModalOpen(true);
                            }}
                            className="p-1.5 rounded dark:bg-emerald-950/60 bg-emerald-50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 dark:text-[#00ff41] text-emerald-700 border dark:border-emerald-800 border-emerald-300 cursor-pointer inline-block"
                            title="Open BibTeX Citation Generator for this paper"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyBibtex(pub)}
                            className="p-1.5 rounded dark:bg-zinc-800 bg-slate-100 hover:bg-slate-200 dark:text-zinc-300 text-slate-600 border dark:border-zinc-700 border-slate-300 cursor-pointer inline-block"
                            title="Copy BibTeX"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded dark:bg-[#00ff41] bg-emerald-600 text-white dark:text-black inline-block hover:opacity-90 cursor-pointer"
                            title="View paper"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty Filter State */
        <div className="py-16 px-4 text-center dark:bg-[#0c1015] bg-white border border-dashed dark:border-zinc-800 border-slate-300 rounded-2xl space-y-4 font-mono shadow-sm">
          <BookOpen className="w-10 h-10 mx-auto text-zinc-400 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-base font-bold dark:text-white text-slate-800">
              No matching research papers found
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              No publications matched your filter criteria. Try clearing some filters or searching for alternative engineering topics.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl dark:bg-[#00ff41] dark:text-black bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm hover:opacity-90"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* BibTeX Citation Generator Modal Dialog */}
      <BibTeXCitationGenerator
        publications={PUBLICATIONS}
        initialSelectedId={generatorSelectedPaperId}
        isOpen={generatorModalOpen}
        onClose={() => setGeneratorModalOpen(false)}
        mode="modal"
        onNotify={onNotify}
      />
    </div>
  );
};
