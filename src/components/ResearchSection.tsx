import React, { useState, useMemo, useEffect } from 'react';
import {
  ANTIPRISM_VIDEOS,
  PLATE_ANTIPRISM_VIDEOS,
  STRUT_ANTIPRISM_VIDEOS,
  ANTIPRISM_TUTORIAL_SERIES,
  GOOGLE_DRIVE_PLATE_FOLDER,
  GOOGLE_DRIVE_STRUT_FOLDER
} from '../data/initialData';
import { VideoTutorial } from '../types';
import {
  ChevronDown,
  Play,
  Download,
  ExternalLink,
  FolderOpen,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Search,
  X,
  Share2,
  Check,
  BookOpen,
  Sparkles,
  Tag,
  Film,
  MonitorPlay,
  Terminal,
  FileCode,
  HardDrive,
  Maximize2,
  ChevronRight,
  Shield,
  Crosshair,
  TrendingUp,
  Gauge,
  Zap,
  Boxes,
  Link2,
  GraduationCap
} from 'lucide-react';
import { StrutAntiprismTutorialPage } from './StrutAntiprismTutorialPage';
import { TutorialVideoPlayer } from './TutorialVideoPlayer';

interface ResearchItem {
  id: string;
  category: 'module' | 'focus';
  numeral?: string;
  title: string;
  shortTitle: string;
  desc: string;
  tags: string[];
  highlight?: string;
  order: number;
}

const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: 'mod-1',
    category: 'module',
    numeral: 'I',
    title: 'Fatigue and Fracture Mechanics',
    shortTitle: 'Fatigue & Fracture',
    desc: 'Overview and educational materials on fatigue failure, crack initiation, stress-intensity factor formulations (KI, KII, KIII), and Paris law subcritical crack growth.',
    tags: ['Fracture', 'FEA'],
    highlight: 'Multiaxial life models & Findley critical planes',
    order: 1,
  },
  {
    id: 'mod-2',
    category: 'module',
    numeral: 'II',
    title: 'Neural Biomechanics & Traumatic Injury',
    shortTitle: 'Neural Biomechanics',
    desc: 'Research materials focusing on computational neuroscience, brain-tissue modeling, and axonal strain under dynamic impact rates and blast overpressures.',
    tags: ['Biomechanics', 'FEA'],
    highlight: 'Nonlinear Ogden & Mooney-Rivlin viscoelasticity',
    order: 2,
  },
  {
    id: 'mod-3',
    category: 'module',
    numeral: 'III',
    title: 'Energy Absorption & Metamaterials (Interactive Tutorials)',
    shortTitle: 'Energy Absorption & Metamaterials',
    desc: 'Investigation into mechanical energy dissipation, cellular metamaterials, AntiPrism unit cells, and dynamic impact mitigation.',
    tags: ['Metamaterials', 'FEA'],
    highlight: 'Strut & Origami AntiPrism Video Tutorials (3-Part Strut + 2-Part Origami)',
    order: 3,
  },
  {
    id: 'mod-4',
    category: 'module',
    numeral: 'IV',
    title: 'Fracture in Cementitious Materials',
    shortTitle: 'Cementitious Fracture',
    desc: 'Studies on cementitious-matrix toughness, quasi-brittle fracture, and microstructural analysis in fiber-reinforced composite systems.',
    tags: ['Fracture', 'Composites'],
    highlight: 'Digital Image Correlation & bilinear softening laws',
    order: 4,
  },
  {
    id: 'focus-1',
    category: 'focus',
    title: 'Composite Sandwich Panels',
    shortTitle: 'Composite Sandwich Panels',
    desc: 'Study and optimization of composite sandwich panels featuring various cores, specifically focusing on honeycomb configurations under uniform external compressive load.',
    tags: ['Metamaterials', 'Composites'],
    highlight: 'Uniform compressive load & core cell topology',
    order: 5,
  },
  {
    id: 'focus-2',
    category: 'focus',
    title: 'Bio-inspired Composites',
    shortTitle: 'Bio-inspired Composites',
    desc: 'Design, data extraction, and structural analysis of bio-inspired helicoidal composite structures to significantly enhance impact resistance and load-bearing capacity.',
    tags: ['Biomechanics', 'Metamaterials', 'Composites'],
    highlight: 'Bouligand architectures & crack twisting mechanisms',
    order: 6,
  },
  {
    id: 'focus-3',
    category: 'focus',
    title: 'Computational Modeling & FEA',
    shortTitle: 'Computational FEA',
    desc: 'Development and debugging of computational codes in MATLAB and Python, alongside utilizing finite element methods (Abaqus UMAT/VUMAT) for precise simulation of complex mechanical behaviors.',
    tags: ['FEA', 'Fracture', 'Biomechanics'],
    highlight: 'Explicit solvers & nonlinear constitutive routines',
    order: 7,
  },
];

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'tags-count';
export type CategoryFilter = 'all' | 'module' | 'focus';

const POPULAR_SEARCH_TOPICS = [
  'Metamaterials',
  'AntiPrism',
  'Viscoelastic',
  'Bouligand',
  'Honeycomb',
  'FEA',
  'Fracture',
  'DIC'
];

const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;
  try {
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    if (parts.length <= 1) return <>{text}</>;
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="dark:bg-[#00ff41]/25 dark:text-[#00ff41] bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-bold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
};

export interface ResearchSectionProps {
  onNotify?: (message: string, isError?: boolean) => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ onNotify }) => {
  const [activeViewMode, setActiveViewMode] = useState<'overview' | 'plate-tutorial' | 'strut-tutorial'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<{ title: string; link: string } | null>(null);

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'mod-1': false,
    'mod-2': false,
    'mod-3': true, // Expanded by default to highlight video player
    'mod-4': false,
  });

  const [selectedSeriesId, setSelectedSeriesId] = useState<'plate' | 'strut'>('plate');
  const activeSeries = useMemo(() => {
    return ANTIPRISM_TUTORIAL_SERIES.find((s) => s.id === selectedSeriesId) || ANTIPRISM_TUTORIAL_SERIES[0];
  }, [selectedSeriesId]);

  const [currentVideo, setCurrentVideo] = useState<VideoTutorial>(PLATE_ANTIPRISM_VIDEOS[0]);

  const handleSelectSeries = (seriesId: 'plate' | 'strut', videoIndex = 0) => {
    setSelectedSeriesId(seriesId);
    const series = ANTIPRISM_TUTORIAL_SERIES.find((s) => s.id === seriesId) || ANTIPRISM_TUTORIAL_SERIES[0];
    const target = series.videos[videoIndex] || series.videos[0];
    setCurrentVideo(target);
  };

  const handleCopySublink = (hashName: string, label: string) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#${hashName}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
      }
      if (onNotify) {
        onNotify(`Copied direct sublink for ${label} (#${hashName})`);
      }
    } catch {
      // ignore
    }
  };

  // Handle deep-link hashes (e.g. #plate-antiprism-modeling, #strut-antiprism-modeling, #mod-3, etc.)
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash) {
        if (
          rawHash === 'plate-antiprism-modeling' ||
          rawHash === 'plate-antiprism' ||
          rawHash === 'plate-tutorial' ||
          rawHash === 'origami-antiprism'
        ) {
          setActiveViewMode('plate-tutorial');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (
          rawHash === 'strut-antiprism-modeling' ||
          rawHash === 'strut-antiprism' ||
          rawHash === 'strut-tutorial' ||
          rawHash === 'strut-antiprism-page' ||
          rawHash === 'strut-workshop'
        ) {
          setActiveViewMode('strut-tutorial');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (['mod-1', 'mod-2', 'mod-3', 'mod-4'].includes(rawHash)) {
          setActiveViewMode('overview');
          setOpenAccordions((prev) => ({ ...prev, [rawHash]: true }));
        }
        if (rawHash === 'strut-antiprism') {
          setActiveViewMode('overview');
          setOpenAccordions((prev) => ({ ...prev, 'mod-3': true }));
          setSelectedSeriesId('strut');
          setCurrentVideo(STRUT_ANTIPRISM_VIDEOS[0]);
        } else if (rawHash === 'plate-antiprism') {
          setActiveViewMode('overview');
          setOpenAccordions((prev) => ({ ...prev, 'mod-3': true }));
          setSelectedSeriesId('plate');
          setCurrentVideo(PLATE_ANTIPRISM_VIDEOS[0]);
        }

        setTimeout(() => {
          const el = document.getElementById(rawHash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [onNotify]);

  // Automatically expand matching module accordions when user enters a search query
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      const matchedModuleIds: Record<string, boolean> = {};
      RESEARCH_ITEMS.filter((i) => i.category === 'module').forEach((item) => {
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.shortTitle.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          (item.highlight && item.highlight.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q));
        if (matches) {
          matchedModuleIds[item.id] = true;
        }
      });
      if (Object.keys(matchedModuleIds).length > 0) {
        setOpenAccordions((prev) => ({ ...prev, ...matchedModuleIds }));
      }
    }
  }, [searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    setOpenAccordions({
      'mod-1': true,
      'mod-2': true,
      'mod-3': true,
      'mod-4': true,
    });
  };

  const collapseAll = () => {
    setOpenAccordions({
      'mod-1': false,
      'mod-2': false,
      'mod-3': false,
      'mod-4': false,
    });
  };

  const handleShare = async (item: ResearchItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const shareUrl = `${origin}${pathname}#${item.id}`;

    let success = false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        success = true;
      } catch {
        success = false;
      }
    }

    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === item.id ? null : curr));
    }, 2500);

    const notifyText = `Project link copied to clipboard: ${item.shortTitle || item.title}`;
    if (onNotify) {
      onNotify(notifyText);
    } else {
      setToastNotification({
        title: item.title,
        link: shareUrl,
      });
      setTimeout(() => {
        setToastNotification((curr) => (curr?.title === item.title ? null : curr));
      }, 4000);
    }
  };

  const allTags = ['All', 'Biomechanics', 'Metamaterials', 'Fracture', 'FEA', 'Composites'];

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: RESEARCH_ITEMS.length,
      module: RESEARCH_ITEMS.filter((item) => item.category === 'module').length,
      focus: RESEARCH_ITEMS.filter((item) => item.category === 'focus').length,
    };
  }, []);

  // Tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { All: RESEARCH_ITEMS.length };
    allTags.slice(1).forEach((tag) => {
      counts[tag] = RESEARCH_ITEMS.filter((item) => item.tags.includes(tag)).length;
    });
    return counts;
  }, []);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let result = RESEARCH_ITEMS.filter((item) => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Tag filter
      const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);

      // Search keyword filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.shortTitle.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        (item.highlight && item.highlight.toLowerCase().includes(query)) ||
        (item.numeral && `module ${item.numeral}`.toLowerCase().includes(query)) ||
        (item.numeral && item.numeral.toLowerCase() === query) ||
        item.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesTag && matchesSearch;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'tags-count') {
        return b.tags.length - a.tags.length;
      }
      return a.order - b.order;
    });

    return result;
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  const modules = filteredItems.filter((i) => i.category === 'module');
  const focusAreas = filteredItems.filter((i) => i.category === 'focus');

  const handleTagClick = (tag: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTag(tag);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('All');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="space-y-10 relative">
      {/* Research Main View Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl dark:bg-[#070c14]/90 bg-white border dark:border-zinc-800 border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setActiveViewMode('overview');
              window.history.replaceState(null, '', '#mod-3');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeViewMode === 'overview'
                ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-md'
                : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:text-white border dark:border-zinc-800 border-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Research Overview &amp; Curriculum</span>
          </button>

          {/* Plate Antiprism Modeling Sublink Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveViewMode('plate-tutorial');
              window.history.replaceState(null, '', '#plate-antiprism-modeling');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeViewMode === 'plate-tutorial'
                ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-md'
                : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:text-white border dark:border-zinc-800 border-slate-300'
            }`}
          >
            <Boxes className="w-4 h-4 text-emerald-400" />
            <span>Plate Antiprism Modeling</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
              activeViewMode === 'plate-tutorial' ? 'bg-black/20 text-black font-bold' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              2 Parts (492 MB)
            </span>
          </button>

          {/* Strut Antiprism Modeling Sublink Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveViewMode('strut-tutorial');
              window.history.replaceState(null, '', '#strut-antiprism-modeling');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeViewMode === 'strut-tutorial'
                ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-md'
                : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:text-white border dark:border-zinc-800 border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Strut Antiprism Modeling</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
              activeViewMode === 'strut-tutorial' ? 'bg-black/20 text-black font-bold' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
            }`}>
              4 Parts (1080p)
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-2 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-ping" />
          <span>Abaqus 2024 CAE Studio</span>
        </div>
      </div>

      {activeViewMode !== 'overview' ? (
        <StrutAntiprismTutorialPage
          initialCategory={activeViewMode === 'plate-tutorial' ? 'plate' : 'strut'}
          onBack={() => {
            setActiveViewMode('overview');
            window.history.replaceState(null, '', '#mod-3');
          }}
          onNotify={onNotify}
        />
      ) : (
        <>
          {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b dark:border-amber-500/20 border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider dark:bg-amber-500/15 bg-amber-100 dark:text-amber-300 text-amber-800 border dark:border-amber-500/30 border-amber-300">
              02. Research Catalog
            </span>
            <span className="dark:text-zinc-500 text-slate-400 text-xs font-mono">•</span>
            <span className="dark:text-zinc-400 text-slate-600 text-xs font-mono tracking-wide">
              Continuum Mechanics &amp; Aerospace
            </span>
          </div>
          <h2 className="font-rajdhani text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight dark:text-white text-slate-900">
            Research Modules &amp; Domains
          </h2>
          <p className="dark:text-zinc-400 text-slate-600 font-mono text-xs sm:text-sm max-w-3xl leading-relaxed mt-1">
            Fundamental investigations across continuum mechanics, bio-inspired architectures, nonlinear material deformation, and dynamic crashworthiness.
          </p>
        </div>

        {/* Live Filtered Count Badge */}
        <div className="flex-none self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold dark:bg-amber-500/10 bg-amber-50 border dark:border-amber-500/30 border-amber-300 dark:text-amber-300 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{filteredItems.length} of {RESEARCH_ITEMS.length} Modules</span>
          </span>
        </div>
      </div>

      {/* Streamlined 2-Tier Command Toolbar */}
      <div className="dark:bg-[#0c1017]/90 bg-white border dark:border-amber-500/25 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Tier 1: Search Input & View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
              placeholder="Search projects, materials, subroutines (e.g. Viscoelastic, VUMAT)..."
              aria-label="Search research projects and topics"
              className="w-full pl-10 pr-28 sm:pr-32 py-2.5 dark:bg-[#05070a] bg-slate-50 border dark:border-zinc-800 border-slate-300 focus:border-amber-500 dark:focus:border-amber-400 rounded-xl text-xs sm:text-sm dark:text-white text-slate-900 font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  title="Clear search (ESC)"
                  aria-label="Clear search query"
                  className="p-1 rounded text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="hidden sm:inline-block text-[10px] font-mono dark:text-zinc-500 text-slate-400 border dark:border-zinc-800 border-slate-200 px-1.5 py-0.5 rounded">
                  ESC
                </span>
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold dark:bg-amber-500/15 bg-amber-100 dark:text-amber-300 text-amber-800 border dark:border-amber-500/30 border-amber-300">
                {filteredItems.length} found
              </span>
            </div>
          </div>

          {/* Quick Actions: Sort + Expand All */}
          <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end flex-none">
            <div className="flex items-center gap-1.5 dark:bg-[#05070a] bg-slate-50 border dark:border-zinc-800 border-slate-300 px-3 py-2 rounded-xl text-xs font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 flex-none" />
              <label htmlFor="sort-select" className="text-zinc-400 sr-only">Sort by</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent dark:text-zinc-200 text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="default">Default Order</option>
                <option value="name-asc">Title (A &rarr; Z)</option>
                <option value="name-desc">Title (Z &rarr; A)</option>
                <option value="tags-count">Most Related Tags</option>
              </select>
            </div>

            {selectedCategory !== 'focus' && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-2.5 py-2 text-[11px] font-mono dark:bg-zinc-900 bg-slate-100 border dark:border-zinc-800 border-slate-200 dark:hover:bg-zinc-800 hover:bg-slate-200 dark:text-zinc-300 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Expand all accordion modules"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-2.5 py-2 text-[11px] font-mono dark:bg-zinc-900 bg-slate-100 border dark:border-zinc-800 border-slate-200 dark:hover:bg-zinc-800 hover:bg-slate-200 dark:text-zinc-300 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Collapse all accordion modules"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tier 2: Unified Categories & Topic Filter Strip */}
        <div className="pt-3 border-t dark:border-zinc-800/80 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Category Tabs */}
          <div className="inline-flex rounded-xl p-1 dark:bg-[#05070a] bg-slate-100 border dark:border-zinc-800 border-slate-200 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 border-amber-300 bg-amber-100 text-amber-900 font-bold border'
                  : 'dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Projects</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold dark:bg-black/40 bg-white/60">
                {categoryCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('module')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === 'module'
                  ? 'dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 border-amber-300 bg-amber-100 text-amber-900 font-bold border'
                  : 'dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold dark:bg-black/40 bg-white/60">
                {categoryCounts.module}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('focus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === 'focus'
                  ? 'dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 border-amber-300 bg-amber-100 text-amber-900 font-bold border'
                  : 'dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Focus Areas</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold dark:bg-black/40 bg-white/60">
                {categoryCounts.focus}
              </span>
            </button>
          </div>

          {/* Clean Topic Tag Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider dark:text-zinc-500 text-slate-400 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3 text-amber-400" />
              Tag:
            </span>

            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              const count = tagCounts[tag] ?? 0;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'dark:bg-amber-400 dark:text-black bg-amber-600 text-white font-bold shadow-xs'
                      : 'dark:bg-[#05070a] bg-slate-100 dark:text-zinc-300 text-slate-700 dark:border-zinc-800 border-slate-200 border hover:border-amber-400/60 hover:text-amber-400'
                  }`}
                >
                  <span>{tag}</span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'dark:bg-black/30 bg-amber-900/40 text-white'
                        : 'dark:bg-zinc-800 bg-slate-200 dark:text-zinc-400 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Clear Bar (Shown only when active filters exist) */}
        {(selectedCategory !== 'all' || selectedTag !== 'All' || searchQuery.trim()) && (
          <div className="pt-3 border-t dark:border-zinc-800/80 border-slate-200 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[11px] uppercase tracking-wider dark:text-zinc-400 text-slate-500">
              Active:
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full dark:bg-amber-500/15 bg-amber-50 dark:border-amber-500/40 border-amber-300 border dark:text-amber-300 text-amber-800 text-xs font-bold">
                <span>Category: {selectedCategory === 'module' ? 'Curriculum' : 'Focus Areas'}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-red-400 cursor-pointer"
                  title="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedTag !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full dark:bg-amber-500/15 bg-amber-50 dark:border-amber-500/40 border-amber-300 border dark:text-amber-300 text-amber-800 text-xs font-bold">
                <span>Tag: #{selectedTag}</span>
                <button
                  onClick={() => setSelectedTag('All')}
                  className="hover:text-red-400 cursor-pointer"
                  title="Remove topic filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full dark:bg-amber-500/15 bg-amber-50 dark:border-amber-500/40 border-amber-300 border dark:text-amber-300 text-amber-800 text-xs font-bold">
                <span>Query: &ldquo;{searchQuery.trim()}&rdquo;</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-400 cursor-pointer"
                  title="Remove search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="ml-auto text-xs font-mono dark:text-zinc-400 text-slate-500 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Active filter count status */}
      <div className="flex items-center justify-between text-xs font-mono dark:text-zinc-400 text-slate-500 px-1">
        <span>
          Showing <strong className="dark:text-amber-400 text-amber-700">{filteredItems.length}</strong> of {RESEARCH_ITEMS.length} research projects
          {selectedCategory !== 'all' && (
            <span> in <strong className="dark:text-white text-slate-800">{selectedCategory === 'module' ? 'Curriculum' : 'Focus Areas'}</strong></span>
          )}
          {selectedTag !== 'All' && <span> under <strong className="dark:text-white text-slate-800">#{selectedTag}</strong></span>}
          {searchQuery.trim() && <span> matching &ldquo;<strong className="dark:text-amber-300 text-amber-700">{searchQuery.trim()}</strong>&rdquo;</span>}
        </span>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-12 text-center dark:bg-[#10141b] bg-white border border-dashed dark:border-zinc-800 border-slate-300 rounded-xl space-y-3">
          <Filter className="w-8 h-8 text-zinc-500 mx-auto" />
          <h4 className="font-orbitron font-bold dark:text-white text-slate-900 text-base">No Matching Research Projects</h4>
          <p className="font-mono text-xs dark:text-zinc-400 text-slate-600 max-w-md mx-auto">
            No research projects matched your current search &ldquo;{searchQuery}&rdquo; and category/tag criteria.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 rounded dark:bg-zinc-800 bg-slate-200 dark:hover:bg-zinc-700 hover:bg-slate-300 dark:text-white text-slate-800 font-mono text-xs font-bold cursor-pointer transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={resetFilters}
              className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold cursor-pointer transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Research Modules (Accordions) */}
          {modules.length > 0 && (
            <div className="space-y-4">
              {/* Executive Curriculum Header & Scope Card */}
              <div className="rounded-2xl p-5 sm:p-6 border transition-all duration-300 dark:bg-gradient-to-r dark:from-[#060c14] dark:via-[#0a1626] dark:to-[#060c14] bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 dark:border-sky-500/30 border-sky-200 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b dark:border-zinc-800/80 border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                        GRADUATE CURRICULUM // MECH-AERO
                      </span>
                      <span className="text-xs font-mono font-semibold dark:text-zinc-400 text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        {modules.length} {modules.length === 1 ? 'Core Module' : 'Core Modules'} (I &ndash; IV)
                      </span>
                    </div>
                    <h3 className="font-section-title text-xl sm:text-2xl font-bold uppercase tracking-wide dark:text-white text-slate-900 flex items-center gap-2">
                      <span className="text-emerald-500 dark:text-[#00ff41] font-mono select-none">//</span>
                      <span>Core Curriculum &amp; Research Modules (I &ndash; IV)</span>
                    </h3>
                  </div>

                  {/* Header Actions: Expand/Collapse All + Video Quick Badge */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={expandAll}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold dark:bg-zinc-900/90 bg-white border dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-[#00b8ff] transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Expand All
                    </button>
                    <button
                      type="button"
                      onClick={collapseAll}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold dark:bg-zinc-900/90 bg-white border dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-[#00b8ff] transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                {/* Scope Description & Simulation Environment Telemetry */}
                <div className="pt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                  <p className="dark:text-zinc-300 text-slate-700 leading-relaxed max-w-3xl">
                    <span className="font-bold text-sky-600 dark:text-[#00b8ff] uppercase tracking-wider">Research Scope: </span>
                    Investigation into mechanical energy dissipation, cellular metamaterials, AntiPrism unit cells, and dynamic impact mitigation.
                  </p>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Plate Antiprism Modeling Sublink */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveViewMode('plate-tutorial');
                        window.history.replaceState(null, '', '#plate-antiprism-modeling');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold dark:bg-emerald-950/70 bg-emerald-100/80 border dark:border-[#00ff41]/50 border-emerald-500/60 dark:text-[#00ff41] text-emerald-800 hover:scale-105 transition-all shadow-xs cursor-pointer"
                      title="Open dedicated Plate Antiprism Modeling Tutorial (2 Parts)"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      Plate Antiprism Modeling (2 Parts)
                    </button>

                    {/* Strut Antiprism Modeling Sublink */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveViewMode('strut-tutorial');
                        window.history.replaceState(null, '', '#strut-antiprism-modeling');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold dark:bg-sky-950/70 bg-sky-100/80 border dark:border-sky-500/50 border-sky-400 dark:text-sky-300 text-sky-800 hover:scale-105 transition-all shadow-xs cursor-pointer"
                      title="Open dedicated Strut Antiprism Modeling Tutorial (4 Parts)"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Strut Antiprism Modeling (4 Parts)
                    </button>
                  </div>
                </div>
              </div>

              {/* Module Accordions */}
              {modules.map((item) => {
                const isOpen = openAccordions[item.id] ?? false;
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    id={item.id}
                    className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                      isOpen
                        ? 'dark:bg-[#070c14]/95 bg-white dark:border-[#00ff41]/75 border-sky-600 shadow-[0_8px_30px_rgba(0,0,0,0.45),0_0_16px_rgba(0,255,65,0.1)] ring-1 dark:ring-[#00ff41]/20 ring-sky-500/20'
                        : 'dark:bg-[#0c1017]/80 bg-white dark:border-zinc-800 border-slate-200 hover:border-sky-500/70 hover:shadow-md'
                    }`}
                  >
                    <h3>
                      <div
                        onClick={() => toggleAccordion(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleAccordion(item.id);
                          }
                        }}
                        aria-expanded={isOpen}
                        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer group select-none transition-colors"
                      >
                        <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap flex-1 mr-3">
                          {/* Geometric Roman Numeral Badge */}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs shrink-0 transition-all duration-300 ${
                              isOpen
                                ? 'dark:bg-[#00ff41]/20 bg-emerald-100 dark:text-[#00ff41] text-emerald-800 border dark:border-[#00ff41] border-emerald-500 shadow-[0_0_12px_rgba(0,255,65,0.35)]'
                                : 'dark:bg-zinc-900 bg-slate-100 dark:text-[#00b8ff] text-sky-700 border dark:border-zinc-800 border-slate-300 group-hover:border-sky-500'
                            }`}
                          >
                            {item.numeral}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-bold text-sm sm:text-base dark:text-white text-slate-900 group-hover:text-sky-600 dark:group-hover:text-[#00ff41] transition-colors">
                                <HighlightText text={item.title} query={searchQuery} />
                              </span>
                              {item.id === 'mod-3' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border border-emerald-500/40 text-emerald-400 dark:text-[#00ff41] shadow-[0_0_12px_rgba(0,255,65,0.2)]">
                                  <MonitorPlay className="w-3 h-3 text-[#00ff41]" />
                                  Interactive CAE Video Lab (492 MB)
                                </span>
                              )}
                            </div>
                            {item.highlight && (
                              <p className="text-xs font-mono dark:text-zinc-400 text-slate-500 mt-0.5 line-clamp-1">
                                {item.highlight}
                              </p>
                            )}
                          </div>

                          {/* Item Tags */}
                          <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                onClick={(e) => handleTagClick(t, e)}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors ${
                                  selectedTag === t
                                    ? 'dark:bg-[#00ff41]/20 dark:border-[#00ff41] border-emerald-600 dark:text-[#00ff41] text-emerald-800 font-bold'
                                    : 'dark:bg-black/40 bg-slate-100 dark:border-zinc-800 border-slate-200 dark:text-zinc-400 text-slate-600 hover:border-sky-500'
                                }`}
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-none">
                          {/* Share Button for Module */}
                          <button
                            type="button"
                            onClick={(e) => handleShare(item, e)}
                            title={`Copy project link for ${item.title}`}
                            aria-label={`Share ${item.title}`}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                              isCopied
                                ? 'dark:bg-[#00ff41]/20 bg-emerald-100 dark:text-[#00ff41] text-emerald-800 border dark:border-[#00ff41] border-emerald-500 font-bold shadow-xs'
                                : 'dark:bg-zinc-900/80 bg-slate-100 dark:hover:bg-zinc-800 hover:bg-slate-200 dark:text-zinc-300 text-slate-700 dark:border-zinc-700 border-slate-300 hover:border-sky-500 dark:hover:text-[#00b8ff] hover:text-sky-700 border'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 dark:text-[#00ff41] text-emerald-700" />
                                <span className="hidden sm:inline">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Share</span>
                              </>
                            )}
                          </button>

                          <div className={`p-1 rounded-lg transition-transform duration-300 ${isOpen ? 'rotate-180 bg-sky-500/10' : ''}`}>
                            <ChevronDown className="w-5 h-5 dark:text-[#00ff41] text-sky-700" />
                          </div>
                        </div>
                      </div>
                    </h3>

                    {isOpen && (
                      <div className="px-5 pb-6 pt-2 text-sm dark:text-zinc-300 text-slate-700 font-mono leading-relaxed border-t dark:border-zinc-800/80 border-slate-200 space-y-5">
                        <p className="dark:text-zinc-200 text-slate-800 leading-relaxed text-xs sm:text-sm">
                          <HighlightText text={item.desc} query={searchQuery} />
                        </p>

                        {/* Module I Specific Content */}
                        {item.id === 'mod-1' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="p-4 dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 rounded-xl space-y-1.5 shadow-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold dark:text-[#00b8ff] text-sky-700 uppercase tracking-wider">
                                  Multiaxial Life Models
                                </span>
                                <span className="text-[10px] font-mono dark:text-zinc-500 text-slate-400">Findley &amp; Brown-Miller</span>
                              </div>
                              <p className="text-xs dark:text-zinc-400 text-slate-600">
                                Critical plane formulations combined with stress-intensity factors (<span className="text-sky-400">K<sub>I</sub>, K<sub>II</sub>, K<sub>III</sub></span>) and Paris law for non-proportional cycle counting.
                              </p>
                              <div className="text-[11px] font-mono text-emerald-500 dark:text-[#00ff41] pt-1">
                                &tau;<sub>n</sub> + k &sigma;<sub>n</sub> &le; &sigma;<sub>f</sub> &bull; Cumulative Damage Accumulation
                              </div>
                            </div>
                            <div className="p-4 dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 rounded-xl space-y-1.5 shadow-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold dark:text-[#00ff41] text-emerald-700 uppercase tracking-wider">
                                  Abaqus Subroutines
                                </span>
                                <span className="text-[10px] font-mono dark:text-zinc-500 text-slate-400">UMAT / VUMAT</span>
                              </div>
                              <p className="text-xs dark:text-zinc-400 text-slate-600">
                                Implementation of custom cyclic damage accumulation subroutines and cohesive element degradation under multiaxial loading paths.
                              </p>
                              <div className="text-[11px] font-mono text-sky-400 pt-1">
                                Fortran 90 Core &bull; Cohesive Zone Degradation
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Module II Specific Content */}
                        {item.id === 'mod-2' && (
                          <div className="p-4 dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 rounded-xl space-y-2 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold dark:text-[#00ff41] text-emerald-700 uppercase tracking-wider">
                                High-Rate Viscoelasticity &amp; Traumatic Brain Injury
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                                d&epsilon;/dt &gt; 50 s<sup>-1</sup>
                              </span>
                            </div>
                            <p className="text-xs dark:text-zinc-400 text-slate-600">
                              Nonlinear Ogden and Mooney-Rivlin hyperelastic formulations coupled with Prony series relaxation spectra to quantify localized cellular shear strains and axonal stretch under blast overpressures.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                              <span className="text-sky-400">&bull; Ogden Strain Energy Potential</span>
                              <span className="text-zinc-500">|</span>
                              <span className="text-amber-400">&bull; Prony Viscoelastic Relaxation</span>
                              <span className="text-zinc-500">|</span>
                              <span className="text-emerald-400">&bull; Axonal Injury Strain Metric</span>
                            </div>
                          </div>
                        )}

                        {/* Module III: Research Environment: AntiPrism Structures (Cinema Simulation Console) */}
                        {item.id === 'mod-3' && (
                          <div
                            id="strut-antiprism"
                            className="rounded-2xl dark:bg-gradient-to-b dark:from-[#050a12] dark:via-[#08101a] dark:to-[#04070c] bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-50 border dark:border-sky-500/35 border-sky-300 p-4 sm:p-6 space-y-5 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(0,184,255,0.12)] scroll-mt-24"
                          >
                            {/* Simulation Console Top Header Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-zinc-800/90 border-slate-200">
                              <div className="flex items-start sm:items-center gap-3">
                                <span className="relative flex h-3 w-3 mt-1 sm:mt-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <div>
                                  <h4 className="font-section-title font-bold text-base sm:text-lg dark:text-[#00b8ff] text-sky-700 flex items-center uppercase tracking-wide">
                                    <span className="dark:text-[#00ff41] text-emerald-600 font-mono mr-2 select-none">//</span>
                                    <span>Research Environment: AntiPrism Metamaterial Studio</span>
                                  </h4>
                                  <p className="text-xs dark:text-zinc-400 text-slate-500 font-mono mt-0.5">
                                    Select tutorial series &amp; part below &bull; Abaqus 2024 Dynamic Explicit Workbench
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md dark:bg-black/60 bg-white border dark:border-zinc-800 border-slate-200 text-zinc-400 dark:text-zinc-300 flex items-center gap-1.5 shadow-xs">
                                  <Terminal className="w-3 h-3 text-sky-400" />
                                  Python 3.10 Scripted
                                </span>
                                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md dark:bg-emerald-950/40 bg-emerald-50 border dark:border-emerald-500/30 border-emerald-300 text-emerald-600 dark:text-[#00ff41] font-semibold flex items-center gap-1 shadow-xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Abaqus 2024
                                </span>
                              </div>
                            </div>

                            {/* Tutorial Series Sublink / Track Selector Bar */}
                            <div className="p-2 sm:p-2.5 rounded-xl dark:bg-black/70 bg-white/90 border dark:border-zinc-800/90 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-mono uppercase tracking-wider dark:text-zinc-400 text-slate-500 font-bold px-1.5">
                                  Tutorial Track:
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {ANTIPRISM_TUTORIAL_SERIES.map((series) => {
                                    const isSelected = selectedSeriesId === series.id;
                                    return (
                                      <button
                                        key={series.id}
                                        type="button"
                                        onClick={() => handleSelectSeries(series.id as 'plate' | 'strut')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                          isSelected
                                            ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-[0_0_15px_rgba(0,255,65,0.35)]'
                                            : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:dark:text-white hover:text-black border dark:border-zinc-800 border-slate-300'
                                        }`}
                                      >
                                        {series.id === 'strut' ? (
                                          <Layers className="w-3.5 h-3.5" />
                                        ) : (
                                          <Boxes className="w-3.5 h-3.5" />
                                        )}
                                        <span>{series.title}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                                          isSelected ? 'bg-black/20 text-black font-semibold' : 'dark:bg-zinc-800 bg-slate-200 text-zinc-400'
                                        }`}>
                                          {series.id === 'strut' ? '4 Parts' : '2 Parts'}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Direct Sublink Quick Action & Open Full Tutorial Page */}
                              <div className="flex items-center gap-2 self-start md:self-auto px-1 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleCopySublink(
                                    selectedSeriesId === 'strut' ? 'strut-antiprism-modeling' : 'plate-antiprism-modeling',
                                    activeSeries.title
                                  )}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono dark:text-sky-400 text-sky-700 hover:dark:text-sky-300 hover:text-sky-900 border dark:border-sky-500/30 border-sky-300/60 dark:bg-sky-950/30 bg-sky-50/60 transition-all cursor-pointer"
                                  title="Copy direct sublink to this tutorial track"
                                >
                                  <Link2 className="w-3 h-3" />
                                  <span>Sublink: #{selectedSeriesId === 'strut' ? 'strut-antiprism-modeling' : 'plate-antiprism-modeling'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveViewMode(selectedSeriesId === 'strut' ? 'strut-tutorial' : 'plate-tutorial');
                                    window.history.replaceState(
                                      null,
                                      '',
                                      selectedSeriesId === 'strut' ? '#strut-antiprism-modeling' : '#plate-antiprism-modeling'
                                    );
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold dark:bg-emerald-950/60 bg-emerald-50 dark:text-[#00ff41] text-emerald-800 border dark:border-emerald-500/50 border-emerald-400 hover:scale-105 transition-all cursor-pointer shadow-xs"
                                  title={`Open full ${selectedSeriesId === 'strut' ? 'Strut' : 'Plate'} Antiprism Tutorial page`}
                                >
                                  <GraduationCap className="w-3.5 h-3.5" />
                                  <span>Open Full {selectedSeriesId === 'strut' ? 'Strut' : 'Plate'} Tutorial Page &rarr;</span>
                                </button>
                              </div>
                            </div>

                            {/* Main Stage: Left 8-Cols Video Viewport, Right 4-Cols Interactive Playlist */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                              {/* Left Video Stage */}
                              <div className="lg:col-span-8 bg-black border dark:border-zinc-800 border-slate-800 rounded-xl p-3.5 space-y-3.5 shadow-2xl">
                                {/* Video Top Action HUD */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                                      <Play className="w-3.5 h-3.5 text-[#00ff41] fill-[#00ff41]" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-2">
                                        <span>{currentVideo.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        {currentVideo.duration && (
                                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-semibold">
                                            {currentVideo.duration}
                                          </span>
                                        )}
                                        <span className="text-[10px] font-mono text-zinc-400 hidden xs:inline">
                                          1080p 60fps &bull; High-Res Stream
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Quick Action Buttons: Drive View & Download */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <a
                                      href={currentVideo.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-200 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,184,255,0.2)]"
                                      title="Open original video file in Google Drive"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                                      <span>Drive View</span>
                                    </a>
                                    <a
                                      href={currentVideo.downloadUrl || currentVideo.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,255,65,0.25)]"
                                      title="Download video file directly"
                                    >
                                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Download</span>
                                    </a>
                                  </div>
                                </div>

                                {/* Video Viewport with 5-Second Fade-In Transition */}
                                <TutorialVideoPlayer
                                  video={currentVideo}
                                  trackLabel={selectedSeriesId === 'strut' ? 'Strut Antiprism' : 'Plate Antiprism'}
                                  onNotify={onNotify}
                                />

                                {/* Video Metadata & Folder Source Link */}
                                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                  <div className="flex items-start gap-2 flex-1">
                                    <FileCode className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                                    <p className="text-zinc-300 leading-relaxed">
                                      <span className="font-bold text-white">Module Session: </span>
                                      {currentVideo.description}
                                    </p>
                                  </div>
                                  <a
                                    href={activeSeries.folderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-mono transition-all shrink-0 shadow-xs"
                                    title={`Open ${activeSeries.title} Google Drive folder`}
                                  >
                                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{activeSeries.shortTitle} Folder</span>
                                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                                  </a>
                                </div>
                              </div>

                              {/* Right Interactive Playlist & Technical Specifications Rack */}
                              <div className="lg:col-span-4 dark:bg-[#090e15] bg-slate-50 border dark:border-zinc-800/90 border-slate-200 rounded-xl p-4 space-y-4 flex flex-col justify-between shadow-lg">
                                <div>
                                  {/* Playlist Header */}
                                  <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
                                    <h5 className="font-section-title font-bold text-xs uppercase tracking-wider dark:text-[#00ff41] text-emerald-700 flex items-center gap-1.5">
                                      <Film className="w-3.5 h-3.5 text-sky-400" />
                                      <span>{activeSeries.shortTitle} Playlist</span>
                                    </h5>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 font-semibold">
                                      {activeSeries.badge}
                                    </span>
                                  </div>

                                  {/* Playlist Items */}
                                  <div className="space-y-2.5 mt-3">
                                    {activeSeries.videos.map((video) => {
                                      const isSelected = currentVideo.id === video.id;
                                      return (
                                        <button
                                          key={video.id}
                                          type="button"
                                          onClick={() => setCurrentVideo(video)}
                                          className={`w-full p-3 rounded-xl text-left transition-all text-xs font-mono flex items-start gap-3 border cursor-pointer ${
                                            isSelected
                                              ? 'dark:bg-emerald-950/40 bg-emerald-50 dark:border-[#00ff41] border-emerald-500 dark:text-white text-emerald-950 font-bold shadow-[0_0_15px_rgba(0,255,65,0.18)] ring-1 ring-emerald-500/30'
                                              : 'dark:bg-zinc-900/70 bg-white dark:border-zinc-800 border-slate-200 dark:text-zinc-300 text-slate-700 hover:border-sky-500/80 hover:bg-sky-50/50'
                                          }`}
                                        >
                                          {/* Geometric Part Number Badge */}
                                          <div
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-orbitron text-xs shrink-0 font-bold ${
                                              isSelected
                                                ? 'bg-[#00ff41] text-black shadow-[0_0_10px_rgba(0,255,65,0.6)]'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                          >
                                            0{video.part}
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="truncate font-semibold">Part {video.part}</span>
                                              {isSelected && (
                                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#00ff41] uppercase tracking-wider shrink-0 flex items-center gap-1">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-ping" />
                                                  Playing
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-[11px] font-mono text-amber-500 dark:text-amber-400 mt-0.5">
                                              {video.duration}
                                            </div>
                                            <div className="text-[10px] dark:text-zinc-400 text-slate-500 font-normal line-clamp-2 mt-1">
                                              {video.description}
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Bottom Controls & Technical Specs Console */}
                                <div className="space-y-3 pt-3 border-t dark:border-zinc-800 border-slate-200">
                                  {/* Browse Active Series Drive Folder Button */}
                                  <a
                                    href={activeSeries.folderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700 hover:border-amber-400 text-zinc-100 flex items-center justify-between text-xs font-mono transition-all shadow-md group cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FolderOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                      <span className="font-semibold truncate">Browse {activeSeries.shortTitle} Folder</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform shrink-0" />
                                  </a>

                                  {/* Simulation Notes & Hardware Specifications Rack */}
                                  <div className="p-3.5 dark:bg-black/70 bg-white border dark:border-zinc-800/90 border-slate-200 rounded-xl text-xs font-mono space-y-2 shadow-inner">
                                    <div className="flex items-center justify-between text-[11px] font-bold dark:text-zinc-200 text-slate-800 uppercase tracking-wider pb-1.5 border-b dark:border-zinc-800/80 border-slate-200">
                                      <span className="flex items-center gap-1.5 text-sky-400">
                                        <Terminal className="w-3.5 h-3.5" />
                                        Simulation Notes
                                      </span>
                                      <span className="text-[10px] font-normal text-zinc-500">{activeSeries.shortTitle}</span>
                                    </div>

                                    <div className="space-y-1.5 text-[11px] dark:text-zinc-400 text-slate-600">
                                      {selectedSeriesId === 'strut' ? (
                                        <>
                                          <div className="flex items-start gap-1.5">
                                            <span className="text-sky-400">&bull;</span>
                                            <span>Strut truss framework &amp; lattice cross-section definition</span>
                                          </div>
                                          <div className="flex items-start gap-1.5">
                                            <span className="text-[#00ff41]">&bull;</span>
                                            <span>General contact penalty at inter-strut plastic collapse hinges</span>
                                          </div>
                                          <div className="flex items-start gap-1.5">
                                            <span className="text-amber-400">&bull;</span>
                                            <span>Dynamic explicit SEA &amp; plateau crushing force extraction</span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex items-start gap-1.5">
                                            <span className="text-sky-400">&bull;</span>
                                            <span>Explicit dynamic analysis via Abaqus 2024</span>
                                          </div>
                                          <div className="flex items-start gap-1.5">
                                            <span className="text-[#00ff41]">&bull;</span>
                                            <span>Automated python scripting for unit cell parametrization</span>
                                          </div>
                                          <div className="flex items-start gap-1.5">
                                            <span className="text-amber-400">&bull;</span>
                                            <span>Folding facet-to-facet contact &amp; plastic dissipation balance</span>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    <div className="mt-2.5 pt-2 border-t dark:border-zinc-800 border-slate-200 flex items-center justify-between text-[11px]">
                                      <span className="text-[#00ff41] flex items-center gap-1.5 font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff41]" />
                                        High-res streaming enabled
                                      </span>
                                      <span className="text-[10px] text-zinc-400 font-mono">1080p Verified</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Module IV Specific Content */}
                        {item.id === 'mod-4' && (
                          <div className="p-4 dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 rounded-xl space-y-2 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold dark:text-[#00b8ff] text-sky-700 uppercase tracking-wider">
                                Crack Bridging &amp; Cohesive Softening Laws
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                                DIC Synchronized
                              </span>
                            </div>
                            <p className="text-xs dark:text-zinc-400 text-slate-600">
                              Experimental Digital Image Correlation (DIC) synchronized with bilinear softening traction-separation laws to capture progressive fiber pull-out, crack tortuosity, and cementitious matrix microcracking.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                              <span className="text-sky-400">&bull; Bilinear Traction-Separation (T<sub>n</sub>, T<sub>s</sub>)</span>
                              <span className="text-zinc-500">|</span>
                              <span className="text-emerald-400">&bull; Full-Field Strain Gradients</span>
                              <span className="text-zinc-500">|</span>
                              <span className="text-amber-400">&bull; Fiber Reinforcement Energy Dissipation</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Primary Research Focus Cards */}
          {focusAreas.length > 0 && (
            <div className={modules.length > 0 ? "pt-10 border-t dark:border-zinc-800/80 border-slate-200" : ""}>
              {/* Strategic Research Thrusts Header Banner */}
              <div className="rounded-2xl p-5 sm:p-6 mb-6 border transition-all duration-300 dark:bg-gradient-to-r dark:from-[#060c14] dark:via-[#091624] dark:to-[#060c14] bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 dark:border-sky-500/30 border-sky-200 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-zinc-800/80 border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-600 dark:text-[#00b8ff] shadow-[0_0_10px_rgba(0,184,255,0.2)]">
                        STRATEGIC LAB PILLARS // CONTINUUM &amp; COMPUTATIONAL MECHANICS
                      </span>
                      <span className="text-xs font-mono font-semibold dark:text-zinc-400 text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {focusAreas.length} Core Focus Thrusts
                      </span>
                    </div>
                    <h3 className="font-section-title text-xl sm:text-2xl font-bold uppercase tracking-wide dark:text-white text-slate-900 flex items-center gap-2">
                      <span className="text-sky-500 dark:text-[#00b8ff] font-mono select-none">//</span>
                      <span>Primary Research Focus Areas</span>
                    </h3>
                  </div>
                  <span className="text-xs font-mono dark:text-zinc-400 text-slate-500">
                    Aero-Structures &bull; Metamaterials &bull; FEA Solvers
                  </span>
                </div>
                <p className="pt-3 text-xs sm:text-sm font-mono dark:text-zinc-300 text-slate-700 leading-relaxed max-w-4xl">
                  Targeted experimental and numerical investigations spanning lightweight aerospace sandwich structures, biomimetic impact-resistant armor architectures, and high-performance constitutive FEA user subroutines.
                </p>
              </div>

              {/* 3 Focus Area Cards Grid with Visual Schematics & Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {focusAreas.map((area, idx) => {
                  const isCopied = copiedId === area.id;

                  // High-tech domain configuration with technical schematics & benchmarks
                  const domainConfig = [
                    {
                      thrustId: 'THRUST // 01',
                      sub: 'AEROSPACE CRASHWORTHINESS',
                      color: 'text-sky-400',
                      borderHover: 'hover:border-sky-400 dark:hover:border-sky-400/90',
                      glow: 'dark:hover:shadow-[0_12px_35px_rgba(0,184,255,0.25)]',
                      accentBar: 'bg-gradient-to-r from-sky-500 via-sky-400 to-transparent',
                      accentGlow: 'bg-sky-500/10 border-sky-400/30 text-sky-400',
                      badge: 'CRASHWORTHINESS',
                      kpis: [
                        { label: 'Core Topology', val: 'Honeycomb & Auxetic' },
                        { label: 'Energy Abs.', val: '+42% SEA Gain' },
                        { label: 'Load Regime', val: 'Uniform Compressive' },
                      ],
                      renderSchematic: () => (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#040810] border border-sky-500/30 p-2 flex flex-col justify-between shadow-inner group-hover:border-sky-400/60 transition-colors">
                          <div className="flex items-center justify-between text-[9px] font-mono text-sky-400/80 px-1">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                              SANDWICH CORE SCHEMATIC
                            </span>
                            <span className="font-bold text-sky-300">F_z ↓ 100 kN</span>
                          </div>
                          {/* Stylized Sandwich Panel SVG */}
                          <svg className="w-full h-16" viewBox="0 0 280 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Compressive Load Vector Arrows */}
                            <path d="M70 4 L70 12 M70 12 L67 9 M70 12 L73 9" stroke="#38bdf8" strokeWidth="1.5" />
                            <path d="M140 4 L140 12 M140 12 L137 9 M140 12 L143 9" stroke="#38bdf8" strokeWidth="1.5" />
                            <path d="M210 4 L210 12 M210 12 L207 9 M210 12 L213 9" stroke="#38bdf8" strokeWidth="1.5" />
                            {/* Top Face Sheet */}
                            <rect x="20" y="13" width="240" height="5" rx="1.5" fill="#0284c7" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />
                            {/* Honeycomb Core Cells */}
                            <path d="M30 18 L40 26 L40 38 L30 46 L20 38 L20 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M50 18 L60 26 L60 38 L50 46 L40 38 L40 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M70 18 L80 26 L80 38 L70 46 L60 38 L60 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M90 18 L100 26 L100 38 L90 46 L80 38 L80 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M110 18 L120 26 L120 38 L110 46 L100 38 L100 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M130 18 L140 26 L140 38 L130 46 L120 38 L120 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M150 18 L160 26 L160 38 L150 46 L140 38 L140 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M170 18 L180 26 L180 38 L170 46 L160 38 L160 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M190 18 L200 26 L200 38 L190 46 L180 38 L180 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M210 18 L220 26 L220 38 L210 46 L200 38 L200 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M230 18 L240 26 L240 38 L230 46 L220 38 L220 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            <path d="M250 18 L260 26 L260 38 L250 46 L240 38 L240 26 Z" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" fill="#0369a1" fillOpacity="0.25" />
                            {/* Bottom Face Sheet */}
                            <rect x="20" y="47" width="240" height="5" rx="1.5" fill="#0284c7" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />
                            {/* Reaction Pins */}
                            <path d="M40 54 L36 60 L44 60 Z" fill="#38bdf8" opacity="0.7" />
                            <path d="M140 54 L136 60 L144 60 Z" fill="#38bdf8" opacity="0.7" />
                            <path d="M240 54 L236 60 L240 60 Z" fill="#38bdf8" opacity="0.7" />
                          </svg>
                          <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 px-1 border-t border-sky-500/20 pt-1">
                            <span>FACE: CFRP 1.2mm</span>
                            <span className="text-sky-300">CORE: Al-5052 Hex-Core</span>
                            <span>SEA: 5.2 kJ/kg</span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      thrustId: 'THRUST // 02',
                      sub: 'BIOMIMETIC ARMOR & IMPACT',
                      color: 'text-emerald-400 dark:text-[#00ff41]',
                      borderHover: 'hover:border-emerald-500 dark:hover:border-[#00ff41]/90',
                      glow: 'dark:hover:shadow-[0_12px_35px_rgba(0,255,65,0.25)]',
                      accentBar: 'bg-gradient-to-r from-[#00ff41] via-emerald-400 to-transparent',
                      accentGlow: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-400',
                      badge: 'BIOMECHANICS',
                      kpis: [
                        { label: 'Bio Archetype', val: 'Stomatopod Dactyl Club' },
                        { label: 'Pitch Angles', val: '15° / 30° / 45° Helicoid' },
                        { label: 'Toughness', val: '3.8x Crack Extension' },
                      ],
                      renderSchematic: () => (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#041008] border border-emerald-500/30 p-2 flex flex-col justify-between shadow-inner group-hover:border-emerald-400/60 transition-colors">
                          <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400/90 px-1">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                              BOULIGAND HELICOIDAL ARCHITECTURE
                            </span>
                            <span className="font-bold text-[#00ff41]">&theta; = 15&deg; Pitch</span>
                          </div>
                          {/* Stylized Helicoidal Bouligand SVG */}
                          <svg className="w-full h-16" viewBox="0 0 280 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Layer 0: 0 deg */}
                            <rect x="25" y="8" width="230" height="7" rx="1.5" fill="#047857" fillOpacity="0.4" stroke="#10b981" strokeWidth="1" />
                            <line x1="30" y1="11.5" x2="250" y2="11.5" stroke="#34d399" strokeWidth="1" strokeDasharray="4 3" />
                            {/* Layer 1: 15 deg */}
                            <rect x="25" y="18" width="230" height="7" rx="1.5" fill="#059669" fillOpacity="0.5" stroke="#00ff41" strokeWidth="1" />
                            <line x1="30" y1="23" x2="250" y2="20" stroke="#00ff41" strokeWidth="1.2" strokeDasharray="6 3" />
                            {/* Layer 2: 30 deg */}
                            <rect x="25" y="28" width="230" height="7" rx="1.5" fill="#10b981" fillOpacity="0.5" stroke="#34d399" strokeWidth="1" />
                            <line x1="30" y1="34" x2="250" y2="28" stroke="#6ee7b7" strokeWidth="1.2" strokeDasharray="6 3" />
                            {/* Layer 3: 45 deg */}
                            <rect x="25" y="38" width="230" height="7" rx="1.5" fill="#047857" fillOpacity="0.6" stroke="#10b981" strokeWidth="1" />
                            <line x1="30" y1="46" x2="250" y2="37" stroke="#a7f3d0" strokeWidth="1.2" strokeDasharray="6 3" />
                            {/* Tortuous Crack Path Twisting Vector */}
                            <path d="M45 4 L48 11 L43 21 L53 32 L46 42 L58 48" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="58" cy="48" r="2.5" fill="#ef4444" />
                            {/* Crack deflection indicator */}
                            <path d="M54 30 L66 26 M66 26 L63 24 M66 26 L64 29" stroke="#f59e0b" strokeWidth="1.5" />
                            <text x="70" y="28" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">Crack Twisting</text>
                          </svg>
                          <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 px-1 border-t border-emerald-500/20 pt-1">
                            <span>FIBER: Carbon-Chitin</span>
                            <span className="text-[#00ff41]">INTERFACIAL DELAMINATION DISSIPATION</span>
                            <span>&Delta;K: +64%</span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      thrustId: 'THRUST // 03',
                      sub: 'NUMERICAL SOLVERS & SUBROUTINES',
                      color: 'text-amber-400',
                      borderHover: 'hover:border-amber-500 dark:hover:border-amber-400/90',
                      glow: 'dark:hover:shadow-[0_12px_35px_rgba(255,193,7,0.25)]',
                      accentBar: 'bg-gradient-to-r from-amber-400 via-orange-400 to-transparent',
                      accentGlow: 'bg-amber-500/10 border-amber-400/30 text-amber-400',
                      badge: 'FEA & SOLVERS',
                      kpis: [
                        { label: 'Subroutines', val: 'Fortran 90 VUMAT/UMAT' },
                        { label: 'Strain Rates', val: 'd&epsilon;/dt &gt; 10&sup3; s&macr;&sup1;' },
                        { label: 'Accelerators', val: 'Python CAE & MATLAB' },
                      ],
                      renderSchematic: () => (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#100b04] border border-amber-500/30 p-2 flex flex-col justify-between shadow-inner group-hover:border-amber-400/60 transition-colors">
                          <div className="flex items-center justify-between text-[9px] font-mono text-amber-400/90 px-1">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              EXPLICIT FEA MESH &amp; STRESS TENSOR
                            </span>
                            <span className="font-bold text-amber-300">VUMAT &bull; Ogden Visco</span>
                          </div>
                          {/* Stylized FEA Contour Mesh SVG */}
                          <svg className="w-full h-16" viewBox="0 0 280 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Element Mesh Quadrilaterals with Rainbow Von Mises Contour */}
                            <polygon points="20,10 65,12 60,34 18,32" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
                            <polygon points="65,12 110,14 105,36 60,34" fill="#059669" stroke="#34d399" strokeWidth="0.8" />
                            <polygon points="110,14 155,15 150,38 105,36" fill="#eab308" stroke="#fef08a" strokeWidth="0.8" />
                            <polygon points="155,15 200,16 195,40 150,38" fill="#f97316" stroke="#fdba74" strokeWidth="0.8" />
                            <polygon points="200,16 245,17 240,42 195,40" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.8" />

                            <polygon points="18,32 60,34 55,54 15,52" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
                            <polygon points="60,34 105,36 100,56 55,54" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
                            <polygon points="105,36 150,38 145,58 100,56" fill="#ca8a04" stroke="#fef08a" strokeWidth="0.8" />
                            <polygon points="150,38 195,40 190,60 145,58" fill="#ea580c" stroke="#fdba74" strokeWidth="0.8" />
                            <polygon points="195,40 240,42 235,62 190,60" fill="#dc2626" stroke="#fca5a5" strokeWidth="0.8" />

                            {/* Gauss Integration Points */}
                            <circle cx="39" cy="22" r="1.5" fill="#ffffff" />
                            <circle cx="85" cy="24" r="1.5" fill="#ffffff" />
                            <circle cx="130" cy="26" r="1.5" fill="#ffffff" />
                            <circle cx="175" cy="28" r="1.5" fill="#ffffff" />
                            <circle cx="220" cy="29" r="1.5" fill="#ffffff" />

                            {/* Constitutive Tensor Annotation */}
                            <rect x="180" y="8" width="90" height="15" rx="3" fill="#000000" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="1" />
                            <text x="185" y="19" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">&sigma;_(n+1) = VUMAT(&Delta;&epsilon;)</text>
                          </svg>
                          <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 px-1 border-t border-amber-500/20 pt-1">
                            <span>SOLVER: Abaqus 2024</span>
                            <span className="text-amber-300">C3D8R 8-Node Solid Elements</span>
                            <span>CPU/GPU Parallel</span>
                          </div>
                        </div>
                      ),
                    },
                  ][idx % 3];

                  return (
                    <div
                      key={area.id}
                      id={area.id}
                      className={`relative overflow-hidden dark:bg-gradient-to-b dark:from-[#090f19] dark:via-[#070b13] dark:to-[#04060b] bg-white border dark:border-zinc-800 border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 space-y-4 flex flex-col justify-between group ${domainConfig.borderHover} ${domainConfig.glow}`}
                    >
                      {/* Top Accent Gradient Line */}
                      <div className={`absolute top-0 left-0 right-0 h-[2px] ${domainConfig.accentBar} opacity-80 group-hover:opacity-100 transition-opacity`} />

                      {/* HUD Corner Tech Brackets */}
                      <div className="absolute top-2 left-2 text-[9px] font-mono text-zinc-600 dark:text-zinc-600 group-hover:text-sky-400 select-none transition-colors">
                        [+
                      </div>
                      <div className="absolute top-2 right-2 text-[9px] font-mono text-zinc-600 dark:text-zinc-600 group-hover:text-sky-400 select-none transition-colors">
                        +]
                      </div>

                      <div className="space-y-4">
                        {/* Thrust Identifier & Domain Header */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2.5 rounded-xl dark:bg-black/60 bg-sky-50/80 border dark:border-zinc-800 border-sky-100 shadow-inner group-hover:scale-105 transition-transform">
                              {area.title.includes('Sandwich') && <Layers className="w-5 h-5 text-sky-500 dark:text-[#00b8ff]" />}
                              {area.title.includes('Bio-inspired') && <Activity className="w-5 h-5 text-emerald-500 dark:text-[#00ff41]" />}
                              {area.title.includes('Computational') && <Cpu className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
                            </div>
                            <div>
                              <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                                {domainConfig.thrustId}
                              </div>
                              <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${domainConfig.color}`}>
                                {domainConfig.sub}
                              </span>
                            </div>
                          </div>

                          {/* Quick Category Badge */}
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${domainConfig.accentGlow}`}>
                            {domainConfig.badge}
                          </span>
                        </div>

                        {/* Interactive Laboratory Schematic Visualizer */}
                        {domainConfig.renderSchematic()}

                        {/* Focus Area Title */}
                        <div>
                          <h4 className="font-orbitron font-bold text-base sm:text-lg dark:text-white text-slate-900 group-hover:text-sky-600 dark:group-hover:text-white transition-colors">
                            <HighlightText text={area.title} query={searchQuery} />
                          </h4>

                          <p className="text-xs sm:text-sm dark:text-zinc-300 text-slate-600 font-mono leading-relaxed mt-2">
                            <HighlightText text={area.desc} query={searchQuery} />
                          </p>
                        </div>

                        {/* Quantitative Benchmark KPI Matrix */}
                        <div className="grid grid-cols-3 gap-2 pt-1 border-t dark:border-zinc-800/80 border-slate-100">
                          {domainConfig.kpis.map((kpi, kIdx) => (
                            <div key={kIdx} className="p-2 rounded-lg dark:bg-black/50 bg-slate-50 border dark:border-zinc-800/80 border-slate-200 text-center">
                              <span className="block text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                                {kpi.label}
                              </span>
                              <span className="block text-[11px] font-mono font-bold dark:text-white text-slate-800 truncate mt-0.5">
                                <span dangerouslySetInnerHTML={{ __html: kpi.val }} />
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Tags List */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {area.tags.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedTag(t)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border cursor-pointer transition-colors ${
                                selectedTag === t
                                  ? 'dark:bg-[#00ff41]/20 dark:border-[#00ff41] border-emerald-600 dark:text-[#00ff41] text-emerald-800 font-bold'
                                  : 'dark:bg-black/40 bg-slate-100 dark:border-zinc-800 border-slate-200 dark:text-zinc-400 text-slate-600 hover:border-sky-500'
                              }`}
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Footer Highlight & Share Button */}
                      <div className="pt-3.5 border-t dark:border-zinc-800/80 border-slate-100 flex items-center justify-between gap-3 mt-auto">
                        {area.highlight ? (
                          <div className="flex items-center gap-1.5 text-[11px] dark:text-[#00ff41] text-emerald-700 font-semibold line-clamp-1 flex-1">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-none" />
                            <span className="truncate">
                              <HighlightText text={area.highlight} query={searchQuery} />
                            </span>
                          </div>
                        ) : (
                          <div className="flex-1" />
                        )}

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={(e) => handleShare(area, e)}
                          title={`Copy project link for ${area.title}`}
                          aria-label={`Share ${area.title}`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all duration-200 cursor-pointer flex-none ${
                            isCopied
                              ? 'dark:bg-[#00ff41]/20 bg-emerald-100 dark:text-[#00ff41] text-emerald-800 border dark:border-[#00ff41] border-emerald-500 font-bold shadow-xs'
                              : 'dark:bg-black/50 bg-slate-100 dark:hover:bg-zinc-800 hover:bg-slate-200 dark:text-zinc-300 text-slate-700 dark:border-zinc-700 border-slate-300 hover:border-sky-500 dark:hover:text-[#00b8ff] hover:text-sky-700 border'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 dark:text-[#00ff41] text-emerald-700" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )}

      {/* Standalone / Fallback Toast Notification */}
      {toastNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-xl font-mono text-xs shadow-2xl transition-all duration-300 max-w-md dark:bg-[#0c131c] bg-white border dark:border-[#00ff41] border-emerald-500 text-slate-900 dark:text-white dark:shadow-[0_0_25px_rgba(0,255,65,0.3)] shadow-lg"
        >
          <div className="p-1 rounded-full dark:bg-[#00ff41]/20 bg-emerald-100 dark:text-[#00ff41] text-emerald-700 flex-none mt-0.5">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-bold font-orbitron dark:text-[#00ff41] text-emerald-700 text-xs tracking-wide">
              PROJECT LINK COPIED
            </div>
            <p className="dark:text-zinc-200 text-slate-700 text-[11px] font-medium line-clamp-1">
              {toastNotification.title}
            </p>
            <p className="dark:text-zinc-500 text-slate-400 text-[10px] truncate max-w-xs">
              {toastNotification.link}
            </p>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="dark:text-zinc-400 text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
