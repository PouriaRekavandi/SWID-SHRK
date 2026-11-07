import React, { useState, useEffect, useMemo } from 'react';
import {
  Newspaper,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  Check,
  X,
  BookOpen,
  Calendar,
  Layers,
  Cpu,
  ArrowRight,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { LabNewsItem, NewsCategory, TabKey } from '../types';
import { INITIAL_LAB_NEWS } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';

interface LaboratoryNewsSectionProps {
  onNotify?: (message: string, isError?: boolean) => void;
  onSelectTab?: (tab: TabKey) => void;
}

export const LaboratoryNewsSection: React.FC<LaboratoryNewsSectionProps> = ({
  onNotify,
  onSelectTab,
}) => {
  const { language, t, isRTL } = useLanguage();
  const [news, setNews] = useState<LabNewsItem[]>(INITIAL_LAB_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [selectedArticle, setSelectedArticle] = useState<LabNewsItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch news from API with fallback to initial curated news
  const fetchNews = async (showNotification = false) => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/laboratory-news?refresh=true');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          setNews(data.items);
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastUpdated(timeStr);
          if (showNotification && onNotify) {
            onNotify(t.news.feedUpdated[language]);
          }
        }
      }
    } catch (err) {
      // In static deployment or offline environment, use curated news
      console.warn('News API fetch fallback to static dataset:', err);
      if (showNotification && onNotify) {
        onNotify(t.news.feedUpdated[language]);
      }
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  useEffect(() => {
    // Initial fetch to ensure synchronization
    fetchNews(false);
  }, []);

  // Filtered and searched news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const localizedTitle = (language === 'fa' && item.titleFa) ? item.titleFa : item.title;
      const localizedSummary = (language === 'fa' && item.summaryFa) ? item.summaryFa : item.summary;

      const matchesSearch =
        !q ||
        localizedTitle.toLowerCase().includes(q) ||
        localizedSummary.toLowerCase().includes(q) ||
        item.authors.toLowerCase().includes(q) ||
        item.journal.toLowerCase().includes(q) ||
        item.doi.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery, language]);

  const handleCopyDoi = (item: LabNewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.doi || item.url);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === item.id ? null : curr));
    }, 2500);

    const msg = language === 'fa' ? `شناسه DOI کپی شد: ${item.doi}` : `Copied DOI: ${item.doi}`;
    if (onNotify) {
      onNotify(msg);
    }
  };

  const categoryLabels: Record<NewsCategory, string> = {
    all: t.news.filterAll[language],
    fracture: t.news.filterFracture[language],
    metamaterials: t.news.filterMetamaterials[language],
    fatigue: t.news.filterFatigue[language],
    biomechanics: t.news.filterBiomechanics[language],
  };

  const getCategoryDisplay = (cat: string) => {
    switch (cat) {
      case 'fracture':
        return t.news.filterFracture[language];
      case 'metamaterials':
        return t.news.filterMetamaterials[language];
      case 'fatigue':
        return t.news.filterFatigue[language];
      case 'biomechanics':
        return t.news.filterBiomechanics[language];
      default:
        return cat;
    }
  };

  return (
    <section
      id="lab-news"
      aria-label="Laboratory News & Research Feed"
      className="space-y-8 scroll-mt-20"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b dark:border-zinc-800 border-slate-200 pb-5">
        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider dark:text-[#00ff41] text-emerald-700 mb-1.5 flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            <span>{t.news.badge[language]}</span>
          </div>
          <h2 className="font-section-title text-2xl sm:text-3xl font-bold uppercase tracking-wide dark:text-white text-slate-900">
            {t.news.title[language]}
          </h2>
          <p className="dark:text-zinc-400 text-slate-600 font-mono text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            {t.news.subtitle[language]}
          </p>
        </div>

        {/* Live Refresh Trigger & Counter */}
        <div className="flex items-center gap-3">
          <div className="text-right font-mono text-[11px] dark:text-zinc-400 text-slate-500 hidden sm:block">
            <span className="block font-bold dark:text-zinc-300 text-slate-700">
              {filteredNews.length} {t.news.itemsCount[language]}
            </span>
            <span className="text-[10px]">Updated: {lastUpdated}</span>
          </div>

          <button
            type="button"
            onClick={() => fetchNews(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold dark:bg-zinc-900 bg-white border dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-800 dark:hover:border-[#00ff41] hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-[#00ff41] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title={t.news.fetchLatestBtn[language]}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#00ff41]' : ''}`} />
            <span>{isRefreshing ? t.news.fetching[language] : t.news.fetchLatestBtn[language]}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Category Buttons (Functional controls per constitution) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl dark:bg-[#0c1015] bg-slate-100 border dark:border-zinc-800 border-slate-200">
            {(['all', 'fracture', 'metamaterials', 'fatigue', 'biomechanics'] as NewsCategory[]).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'dark:bg-zinc-800 bg-white dark:text-[#00ff41] text-emerald-800 font-bold shadow-xs border dark:border-zinc-700 border-slate-300'
                      : 'dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className={`w-4 h-4 text-zinc-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.news.searchPlaceholder[language]}
              className={`w-full ${isRTL ? 'pr-9 pl-8' : 'pl-9 pr-8'} py-1.5 text-xs font-mono dark:bg-[#0c1015] bg-white border dark:border-zinc-800 border-slate-300 rounded-lg dark:text-zinc-200 text-slate-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#00b8ff] dark:focus:border-[#00ff41] transition-colors`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-zinc-400 hover:text-slate-900 dark:hover:text-white p-0.5 cursor-pointer`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* News Feed Grid */}
      {filteredNews.length === 0 ? (
        <div className="p-8 text-center rounded-xl dark:bg-[#0c1015] bg-white border dark:border-zinc-800 border-slate-200 font-mono">
          <BookOpen className="w-8 h-8 mx-auto text-zinc-500 mb-2 opacity-60" />
          <h3 className="text-sm font-bold dark:text-zinc-200 text-slate-800">
            {t.news.noResultsTitle[language]}
          </h3>
          <p className="text-xs dark:text-zinc-400 text-slate-500 mt-1 max-w-sm mx-auto">
            {t.news.noResultsDesc[language]}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-bold rounded-lg dark:bg-zinc-800 bg-slate-100 dark:hover:bg-zinc-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {t.news.resetFilters[language]}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((item) => {
            const title = (language === 'fa' && item.titleFa) ? item.titleFa : item.title;
            const summary = (language === 'fa' && item.summaryFa) ? item.summaryFa : item.summary;
            const findings = (language === 'fa' && item.keyFindingsFa) ? item.keyFindingsFa : item.keyFindings;
            const isCopied = copiedId === item.id;

            return (
              <article
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className={`group flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 dark:bg-[#0a0e14] bg-white cursor-pointer ${
                  item.isPinned
                    ? 'dark:border-[#00ff41]/40 border-emerald-300 dark:hover:border-[#00ff41] hover:border-emerald-500 shadow-xs'
                    : 'dark:border-zinc-800/90 border-slate-200 dark:hover:border-zinc-700 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata line per Zero-Pill Constitution */}
                  <div className="flex items-center gap-2 text-[11px] font-mono dark:text-zinc-400 text-slate-500">
                    <span className="font-bold dark:text-[#00ff41] text-emerald-700 uppercase tracking-wider">
                      {getCategoryDisplay(item.category)}
                    </span>
                    <span aria-hidden="true" className="dark:text-zinc-600 text-slate-300">·</span>
                    <span>{item.date}</span>
                    <span aria-hidden="true" className="dark:text-zinc-600 text-slate-300">·</span>
                    <span>{item.readTime}</span>
                    {item.isPinned && (
                      <>
                        <span aria-hidden="true" className="dark:text-zinc-600 text-slate-300">·</span>
                        <span className="dark:text-amber-300 text-amber-700 font-bold">
                          ★ {t.news.pinnedBadge[language]}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Article Title */}
                  <h3 className="font-section-title text-base sm:text-lg font-bold dark:text-white text-slate-900 group-hover:text-sky-700 dark:group-hover:text-[#00b8ff] transition-colors leading-snug">
                    {title}
                  </h3>

                  {/* Authors & Journal */}
                  <div className="text-xs font-mono dark:text-zinc-400 text-slate-600">
                    <span className="font-medium">{item.authors}</span>
                    <span className="block text-[11px] italic dark:text-zinc-500 text-slate-500 mt-0.5">
                      {item.journal}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs font-mono dark:text-zinc-300 text-slate-700 leading-relaxed line-clamp-3">
                    {summary}
                  </p>

                  {/* Key Finding Preview (1 highlight) */}
                  {findings && findings[0] && (
                    <div className="pt-2 border-t dark:border-zinc-800/60 border-slate-100 text-[11px] font-mono dark:text-zinc-400 text-slate-600 flex items-start gap-2">
                      <span className="dark:text-[#00ff41] text-emerald-600 font-bold flex-none mt-0.5">▸</span>
                      <span className="line-clamp-2">{findings[0]}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t dark:border-zinc-800/80 border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="dark:text-[#00b8ff] text-sky-700 font-bold flex items-center gap-1 group-hover:underline">
                    <span>{t.news.readAbstract[language]}</span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleCopyDoi(item, e)}
                      className="p-1.5 rounded dark:hover:bg-zinc-800 hover:bg-slate-100 dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title={t.news.copyDoi[language]}
                      aria-label={t.news.copyDoi[language]}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded dark:hover:bg-zinc-800 hover:bg-slate-100 dark:text-zinc-400 text-slate-600 hover:text-sky-700 dark:hover:text-[#00b8ff] transition-colors"
                      title={t.news.viewArticle[language]}
                      aria-label={t.news.viewArticle[language]}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Detailed Research Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto dark:bg-[#0c1016] bg-white border dark:border-zinc-700 border-slate-300 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 transition-colors font-mono"
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-1.5 rounded-lg dark:text-zinc-400 text-slate-500 hover:text-slate-900 dark:hover:text-white dark:hover:bg-zinc-800 hover:bg-slate-100 transition-colors cursor-pointer`}
              aria-label={t.common.close[language]}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Unboxed Header Metadata */}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-bold dark:text-[#00ff41] text-emerald-700 uppercase">
                {getCategoryDisplay(selectedArticle.category)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedArticle.date}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedArticle.journal}</span>
            </div>

            {/* Title */}
            <h3 className="font-section-title text-xl sm:text-2xl font-bold dark:text-white text-slate-900 leading-snug">
              {(language === 'fa' && selectedArticle.titleFa) ? selectedArticle.titleFa : selectedArticle.title}
            </h3>

            {/* Authors */}
            <div className="text-xs dark:text-zinc-400 text-slate-600">
              <strong>Authors:</strong> {selectedArticle.authors}
            </div>

            {/* Abstract */}
            <div className="space-y-2 pt-2 border-t dark:border-zinc-800 border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider dark:text-[#00b8ff] text-sky-700">
                {t.news.readAbstract[language]}
              </h4>
              <p className="text-xs sm:text-sm dark:text-zinc-300 text-slate-700 leading-relaxed">
                {(language === 'fa' && selectedArticle.summaryFa) ? selectedArticle.summaryFa : selectedArticle.summary}
              </p>
            </div>

            {/* Key Findings */}
            <div className="space-y-2 pt-2 border-t dark:border-zinc-800 border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider dark:text-[#00ff41] text-emerald-700">
                {t.news.keyFindingsTitle[language]}
              </h4>
              <ul className="space-y-1.5 text-xs dark:text-zinc-300 text-slate-700">
                {((language === 'fa' && selectedArticle.keyFindingsFa) ? selectedArticle.keyFindingsFa : selectedArticle.keyFindings).map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="dark:text-[#00ff41] text-emerald-600 font-bold mt-0.5">▸</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experimental & Numerical Methodology */}
            <div className="space-y-1.5 pt-2 border-t dark:border-zinc-800 border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider dark:text-amber-400 text-amber-700">
                {t.news.methodologyTitle[language]}
              </h4>
              <p className="text-xs dark:text-zinc-400 text-slate-600 leading-relaxed">
                {(language === 'fa' && selectedArticle.methodologyFa) ? selectedArticle.methodologyFa : selectedArticle.methodology}
              </p>
            </div>

            {/* Citation & DOI Box */}
            <div className="p-3.5 rounded-lg dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold dark:text-zinc-400 text-slate-600">DOI Reference:</span>
                <button
                  onClick={(e) => handleCopyDoi(selectedArticle, e)}
                  className="flex items-center gap-1 text-[11px] font-bold dark:text-[#00ff41] text-emerald-700 hover:underline cursor-pointer"
                >
                  {copiedId === selectedArticle.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>{t.common.copied[language]}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t.news.copyDoi[language]}</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] dark:text-zinc-500 text-slate-500 font-mono select-all">
                {selectedArticle.doi}
              </p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t dark:border-zinc-800 border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg dark:bg-zinc-800 bg-slate-200 dark:hover:bg-zinc-700 hover:bg-slate-300 dark:text-zinc-200 text-slate-800 transition-colors cursor-pointer"
              >
                {t.common.close[language]}
              </button>

              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-black bg-[#00ff41] hover:bg-[#10b981] transition-all cursor-pointer shadow-xs"
              >
                <span>{t.news.viewArticle[language]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
