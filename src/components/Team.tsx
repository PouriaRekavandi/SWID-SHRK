import React, { useState, useMemo } from 'react';
import { TeamMember, TeamRoleCategory, TabKey } from '../types';
import { INITIAL_TEAM_MEMBERS, PUBLICATIONS } from '../data/initialData';
import profilePhoto from '../assets/profile.png';
import profileFallback from '../assets/profile.jpg';
import { useLanguage } from '../context/LanguageContext';
import {
  Users,
  Search,
  ExternalLink,
  Mail,
  Copy,
  Check,
  GraduationCap,
  Sparkles,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
  Layers,
  Award,
  ArrowUpRight,
} from 'lucide-react';

interface TeamProps {
  onNotify?: (msg: string, isError?: boolean) => void;
  onSelectTab?: (tab: TabKey) => void;
}

export const Team: React.FC<TeamProps> = ({ onNotify, onSelectTab }) => {
  const { language, isRTL, t } = useLanguage();
  const [members] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [selectedCategory, setSelectedCategory] = useState<TeamRoleCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Localized helper to retrieve member content
  const getLocalizedMember = (member: TeamMember) => {
    const memData = (t.team.members as Record<string, any>)[member.id];
    if (!memData) {
      return {
        name: member.name,
        role: member.role,
        affiliation: member.affiliation,
        bio: member.bio,
        researchFocus: member.researchFocus,
      };
    }
    return {
      name: memData.name[language] || member.name,
      role: memData.role[language] || member.role,
      affiliation: memData.affiliation[language] || member.affiliation,
      bio: memData.bio[language] || member.bio,
      researchFocus: Array.isArray(memData.researchFocus)
        ? memData.researchFocus.map((rf: any) => rf[language] || rf.en)
        : member.researchFocus,
    };
  };

  const categories: { key: TeamRoleCategory; label: string; count: number }[] = useMemo(() => [
    { key: 'all', label: t.team.categories.all[language], count: members.length },
    { key: 'pi', label: t.team.categories.pi[language], count: members.filter((m) => m.category === 'pi').length },
    { key: 'postdoc', label: t.team.categories.postdoc[language], count: members.filter((m) => m.category === 'postdoc').length },
    { key: 'phd', label: t.team.categories.phd[language], count: members.filter((m) => m.category === 'phd').length },
    { key: 'msc', label: t.team.categories.msc[language], count: members.filter((m) => m.category === 'msc').length },
    { key: 'alumni', label: t.team.categories.alumni[language], count: members.filter((m) => m.category === 'alumni').length },
  ], [members, language, t]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const loc = getLocalizedMember(m);
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        loc.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        loc.role.toLowerCase().includes(q) ||
        m.affiliation.toLowerCase().includes(q) ||
        loc.affiliation.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        loc.bio.toLowerCase().includes(q) ||
        m.researchFocus.some((f) => f.toLowerCase().includes(q)) ||
        loc.researchFocus.some((f: string) => f.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [members, selectedCategory, searchQuery, language]);

  const handleCopyEmail = (email: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    if (onNotify) {
      const msg = t.team.copiedEmailSuccess[language]
        .replace('{name}', name)
        .replace('{email}', email);
      onNotify(msg);
    }
    setTimeout(() => {
      setCopiedEmail((prev) => (prev === email ? null : prev));
    }, 2500);
  };

  const getCategoryBadgeClass = (category: TeamMember['category']) => {
    switch (category) {
      case 'pi':
        return 'dark:bg-[#00ff41]/10 dark:text-[#00ff41] dark:border-[#00ff41]/40 bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'postdoc':
        return 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60 bg-purple-50 text-purple-800 border-purple-200';
      case 'phd':
        return 'dark:bg-[#00b8ff]/10 dark:text-[#00b8ff] dark:border-[#00b8ff]/40 bg-sky-50 text-sky-800 border-sky-300';
      case 'msc':
        return 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 bg-amber-50 text-amber-800 border-amber-200';
      case 'alumni':
        return 'dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700 bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryBadgeLabel = (category: TeamMember['category']) => {
    switch (category) {
      case 'pi':
        return t.team.categories.pi[language];
      case 'postdoc':
        return t.team.categories.postdoc[language];
      case 'phd':
        return t.team.categories.phd[language];
      case 'msc':
        return t.team.categories.msc[language];
      case 'alumni':
        return t.team.categories.alumni[language];
      default:
        return category;
    }
  };

  const getInitials = (name: string) => {
    const clean = name.replace(/^Dr\.\s+/i, '').replace(/^دکتر\s+/i, '');
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Co-authored publications for dossier
  const relatedPublications = useMemo(() => {
    if (!selectedMember) return [];
    const searchLastName = selectedMember.name.split(' ').pop()?.toLowerCase() || '';
    return PUBLICATIONS.filter((p) => p.authors.toLowerCase().includes(searchLastName));
  }, [selectedMember]);

  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className="space-y-8 font-mono">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b dark:border-zinc-800 border-slate-200 pb-5">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full dark:bg-[#00b8ff]/10 bg-sky-100 border dark:border-[#00b8ff]/30 border-sky-300 dark:text-[#00b8ff] text-sky-800 text-xs font-bold mb-3 tracking-wide">
              <Users className="w-3.5 h-3.5" />
              <span>{t.team.groupBadge[language]}</span>
            </div>
            <h2 className="font-section-title text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider dark:text-white text-slate-900 flex items-center">
              <span className="dark:text-[#00ff41] text-sky-600 font-mono mr-2 ml-1 select-none">//</span>
              <span>{t.team.title[language]}</span>
            </h2>
            <p className="dark:text-zinc-400 text-slate-600 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed font-sans">
              {t.team.subtitle[language]}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <div className="px-3.5 py-2 rounded-xl dark:bg-zinc-900/90 bg-white border dark:border-zinc-800 border-slate-200 shadow-xs flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className="text-[10px] dark:text-zinc-500 text-slate-500 uppercase tracking-wider">
                  {t.team.metricActiveGroup[language]}
                </div>
                <div className="text-sm font-bold dark:text-white text-slate-900 font-orbitron">
                  {t.team.metricMembersCount[language].replace('{count}', members.length.toString())}
                </div>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl dark:bg-zinc-900/90 bg-white border dark:border-zinc-800 border-slate-200 shadow-xs flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#00b8ff]" />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className="text-[10px] dark:text-zinc-500 text-slate-500 uppercase tracking-wider">
                  {t.team.metricGradPostdoc[language]}
                </div>
                <div className="text-sm font-bold dark:text-white text-slate-900 font-orbitron">
                  {t.team.metricScholarsCount[language].replace(
                    '{count}',
                    members.filter((m) => m.category === 'phd' || m.category === 'postdoc' || m.category === 'msc').length.toString()
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
                    active
                      ? 'dark:bg-[#00ff41]/15 dark:text-[#00ff41] dark:border-[#00ff41] bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'dark:bg-zinc-900/60 dark:text-zinc-400 dark:border-zinc-800 bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      active
                        ? 'dark:bg-[#00ff41]/30 dark:text-[#00ff41] bg-sky-700 text-white'
                        : 'dark:bg-zinc-800 dark:text-zinc-500 bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:min-w-[300px]">
            <Search className={`w-4 h-4 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 dark:text-zinc-500 text-slate-400 pointer-events-none`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.team.searchPlaceholder[language]}
              className={`w-full ${isRTL ? 'pr-9 pl-8' : 'pl-9 pr-8'} py-2 text-xs rounded-xl dark:bg-zinc-900/90 bg-white border dark:border-zinc-800 border-slate-200 dark:text-white text-slate-900 placeholder:text-zinc-500 dark:focus:border-[#00b8ff] focus:border-sky-500 focus:outline-none transition-colors`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white`}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 px-4 dark:bg-zinc-900/40 bg-white border dark:border-zinc-800 border-slate-200 rounded-2xl space-y-3">
          <Users className="w-10 h-10 mx-auto dark:text-zinc-600 text-slate-400 animate-pulse" />
          <h3 className="text-base font-bold dark:text-white text-slate-800">{t.team.noMembersFound[language]}</h3>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-bold rounded-lg dark:bg-zinc-800 bg-slate-100 dark:text-[#00ff41] text-sky-700 hover:underline cursor-pointer"
          >
            {t.team.resetFilters[language]}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredMembers.map((member) => {
            const isPI = member.category === 'pi';
            const loc = getLocalizedMember(member);
            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 cursor-pointer group border ${
                  isPI
                    ? 'dark:bg-gradient-to-b dark:from-[#131b17] dark:to-[#0a0f0d] bg-gradient-to-b from-emerald-50/40 to-white dark:border-[#00ff41]/50 border-emerald-400/80 dark:shadow-[0_4px_30px_rgba(0,255,65,0.12)] shadow-md hover:shadow-xl dark:hover:border-[#00ff41]'
                    : 'dark:bg-[#111111]/90 bg-white dark:border-zinc-800/90 border-slate-200 dark:hover:border-[#00b8ff]/70 hover:border-sky-500 shadow-xs hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,184,255,0.1)]'
                } hover:-translate-y-1`}
              >
                {/* Background Scanline Pattern on Hover */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300 dark:bg-[radial-gradient(#00ff41_1px,transparent_1px)] bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Card Top: Avatar + Badges */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    {/* Avatar Portrait */}
                    <div className="relative">
                      {isPI ? (
                        <div className="relative w-16 h-16 rounded-full border-2 dark:border-[#00ff41] border-emerald-600 overflow-hidden dark:bg-black bg-slate-900 shadow-md group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={profilePhoto}
                            alt={loc.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-top select-none"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = profileFallback;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-orbitron font-bold text-lg dark:bg-zinc-900 bg-slate-100 border dark:border-zinc-700 border-slate-300 dark:text-[#00b8ff] text-sky-700 shadow-sm group-hover:border-[#00b8ff] group-hover:scale-105 transition-all duration-300">
                          {getInitials(loc.name)}
                        </div>
                      )}

                      {/* Status indicator badge */}
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 dark:border-[#111] border-white flex items-center justify-center ${
                          member.status === 'Active' ? 'bg-[#00ff41]' : 'bg-zinc-400'
                        }`}
                        title={member.status === 'Active' ? t.team.statusActive[language] : t.team.statusAlumni[language]}
                      />
                    </div>

                    {/* Role Tag & Status */}
                    <div className={`flex flex-col ${isRTL ? 'items-start text-left' : 'items-end text-right'} gap-1.5`}>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${getCategoryBadgeClass(
                          member.category
                        )}`}
                      >
                        {getCategoryBadgeLabel(member.category)}
                      </span>
                      {member.joinedYear && (
                        <span className="text-[10px] dark:text-zinc-500 text-slate-500 font-mono">
                          {t.team.joinedYearLabel[language].replace('{year}', member.joinedYear)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-base sm:text-lg font-bold font-orbitron dark:text-white text-slate-900 group-hover:text-sky-600 dark:group-hover:text-[#00ff41] transition-colors flex items-center gap-1.5">
                      <span>{loc.name}</span>
                      {isPI && <ShieldCheck className="w-4 h-4 text-[#00ff41] flex-none" />}
                    </h3>
                    <p className="text-xs font-semibold dark:text-zinc-300 text-slate-700 mt-0.5">{loc.role}</p>
                    <p className="text-[11px] dark:text-zinc-500 text-slate-500 mt-0.5 line-clamp-1 font-sans">
                      {loc.affiliation}
                    </p>
                  </div>

                  {/* Highlight callout if present */}
                  {member.highlight && (
                    <div className="px-2.5 py-1.5 rounded-lg text-[11px] dark:bg-zinc-900/70 bg-slate-50 border dark:border-zinc-800 border-slate-200 dark:text-zinc-300 text-slate-600 flex items-start gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 flex-none mt-0.5" />
                      <span className="line-clamp-2">{member.highlight}</span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className={`text-xs dark:text-zinc-400 text-slate-600 leading-relaxed line-clamp-3 font-sans ${isRTL ? 'text-right' : 'text-left'}`}>
                    {loc.bio}
                  </p>

                  {/* Research Focus Pills */}
                  <div className={`space-y-1.5 pt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="text-[10px] uppercase font-bold tracking-wider dark:text-zinc-500 text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#00b8ff]" />
                      <span>{t.team.researchFocusTitle[language]}:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {loc.researchFocus.map((focus: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 border dark:border-zinc-800 border-slate-200 hover:border-[#00b8ff]/60 transition-colors"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Action Links & Academic Profiles */}
                <div className="mt-5 pt-4 border-t dark:border-zinc-800/80 border-slate-200 space-y-3 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    {/* Academic Links: Google Scholar, ResearchGate, ORCID, etc. */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {member.googleScholar && (
                        <a
                          href={member.googleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`${loc.name} on Google Scholar`}
                          className="p-1.5 rounded-lg border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 dark:hover:border-[#00b8ff] hover:border-sky-500 dark:hover:text-[#00b8ff] hover:text-sky-600 transition-colors flex items-center gap-1 text-[11px] font-bold"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                          </svg>
                          <span className="hidden sm:inline">Scholar</span>
                        </a>
                      )}

                      {member.researchGate && (
                        <a
                          href={member.researchGate}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`${loc.name} on ResearchGate`}
                          className="p-1.5 rounded-lg border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 dark:hover:border-[#00ff41] hover:border-emerald-500 dark:hover:text-[#00ff41] hover:text-emerald-600 transition-colors flex items-center gap-1 text-[11px] font-bold"
                        >
                          <span className="font-bold text-xs tracking-tighter">RG</span>
                        </a>
                      )}

                      {member.orcid && (
                        <a
                          href={member.orcid}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`${loc.name} ORCID Record`}
                          className="p-1.5 rounded-lg border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:text-emerald-400 text-emerald-700 dark:hover:border-emerald-400 hover:border-emerald-600 transition-colors flex items-center gap-1 text-[11px] font-bold"
                        >
                          <span className="text-[10px] font-mono font-bold tracking-tight">iD</span>
                        </a>
                      )}

                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`${loc.name} on LinkedIn`}
                          className="p-1.5 rounded-lg border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 dark:hover:border-[#00b8ff] hover:border-sky-500 dark:hover:text-[#00b8ff] hover:text-sky-600 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.28a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                          </svg>
                        </a>
                      )}

                      {/* Copy Email Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyEmail(member.email, loc.name, e)}
                        title={`${t.team.copyEmail[language]} (${member.email})`}
                        className="p-1.5 rounded-lg border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {copiedEmail === member.email ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* View Dossier Pill */}
                    <button
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold dark:text-zinc-400 text-slate-600 group-hover:text-sky-600 dark:group-hover:text-[#00ff41] transition-colors cursor-pointer"
                    >
                      <span>{t.team.viewDossier[language]}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Member Extended Dossier Modal */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedMember(null)}
        >
          {(() => {
            const loc = getLocalizedMember(selectedMember);
            return (
              <div
                dir={isRTL ? 'rtl' : 'ltr'}
                className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#0c0c0c] bg-white border dark:border-zinc-700 border-slate-300 shadow-2xl p-6 sm:p-8 space-y-6 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b dark:border-zinc-800 border-slate-200 pb-4">
                  <div className="flex items-center gap-4">
                    {selectedMember.category === 'pi' ? (
                      <div className="w-16 h-16 rounded-full border-2 dark:border-[#00ff41] border-emerald-600 overflow-hidden dark:bg-black bg-slate-900 shadow-md flex-none">
                        <img
                          src={profilePhoto}
                          alt={loc.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = profileFallback;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-orbitron font-bold text-xl dark:bg-zinc-900 bg-slate-100 border dark:border-zinc-700 border-slate-300 dark:text-[#00b8ff] text-sky-700 flex-none shadow-sm">
                        {getInitials(loc.name)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${getCategoryBadgeClass(
                            selectedMember.category
                          )}`}
                        >
                          {getCategoryBadgeLabel(selectedMember.category)}
                        </span>
                        <span className="text-xs dark:text-zinc-500 text-slate-500 font-mono">
                          {selectedMember.status === 'Active' ? t.team.statusActive[language] : t.team.statusAlumni[language]}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-orbitron dark:text-white text-slate-900 mt-1">
                        {loc.name}
                      </h3>
                      <p className="text-xs dark:text-zinc-400 text-slate-600 font-sans">{loc.affiliation}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="p-1.5 rounded-lg dark:text-zinc-400 text-slate-500 hover:dark:text-white hover:text-black dark:hover:bg-zinc-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={t.common.close[language]}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-5 text-xs sm:text-sm">
                  {/* Highlight Banner */}
                  {selectedMember.highlight && (
                    <div className="p-3 rounded-xl dark:bg-zinc-900 bg-amber-50/60 border dark:border-zinc-800 border-amber-200 flex items-center gap-2 dark:text-zinc-300 text-amber-950 font-medium">
                      <Award className="w-4 h-4 text-amber-500 flex-none" />
                      <span>{selectedMember.highlight}</span>
                    </div>
                  )}

                  {/* Bio */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#00ff41]" />
                      <span>{t.team.dossierModal.bioSection[language]}</span>
                    </h4>
                    <p className="dark:text-zinc-300 text-slate-700 leading-relaxed dark:bg-zinc-900/50 bg-slate-50 p-4 rounded-xl border dark:border-zinc-800 border-slate-200 font-sans">
                      {loc.bio}
                    </p>
                  </div>

                  {/* Research Focus Areas */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#00b8ff]" />
                      <span>{t.team.researchFocusTitle[language]}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {loc.researchFocus.map((f: string, i: number) => (
                        <div
                          key={i}
                          className="px-3 py-2 rounded-lg dark:bg-zinc-900 bg-slate-50 border dark:border-zinc-800 border-slate-200 dark:text-zinc-200 text-slate-800 text-xs font-mono flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Co-Authored Publications in Lab */}
                  {relatedPublications.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>{t.team.dossierModal.coauthoredPubs[language]} ({relatedPublications.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {relatedPublications.map((pub) => (
                          <div
                            key={pub.id}
                            className="p-3 rounded-lg dark:bg-zinc-900/60 bg-white border dark:border-zinc-800 border-slate-200 space-y-1"
                          >
                            <div className="font-semibold dark:text-white text-slate-900 text-xs">{pub.title}</div>
                            <div className="text-[11px] dark:text-zinc-400 text-slate-600 font-mono">
                              {pub.journal} ({pub.year}) · {pub.doi}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academic Profiles & Contact Links */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-400 text-slate-500 mb-2">
                      {t.team.dossierModal.contactDirect[language]}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {selectedMember.googleScholar && (
                        <a
                          href={selectedMember.googleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:hover:border-[#00b8ff] hover:border-sky-500 transition-colors flex items-center gap-2 dark:text-zinc-200 text-slate-800 font-bold text-xs"
                        >
                          <svg className="w-4 h-4 fill-current text-[#00b8ff]" viewBox="0 0 24 24">
                            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                          </svg>
                          <span>Google Scholar</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                        </a>
                      )}

                      {selectedMember.researchGate && (
                        <a
                          href={selectedMember.researchGate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:hover:border-[#00ff41] hover:border-emerald-500 transition-colors flex items-center gap-2 dark:text-zinc-200 text-slate-800 font-bold text-xs"
                        >
                          <span className="font-bold text-sm text-[#00ff41] tracking-tighter">RG</span>
                          <span>ResearchGate</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                        </a>
                      )}

                      {selectedMember.orcid && (
                        <a
                          href={selectedMember.orcid}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:hover:border-emerald-400 hover:border-emerald-500 transition-colors flex items-center gap-2 dark:text-zinc-200 text-slate-800 font-bold text-xs"
                        >
                          <span className="text-xs font-mono font-bold text-emerald-500">iD</span>
                          <span>ORCID Profile</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                        </a>
                      )}

                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white dark:hover:border-[#00b8ff] hover:border-sky-500 transition-colors flex items-center gap-2 dark:text-zinc-200 text-slate-800 font-bold text-xs"
                        >
                          <svg className="w-4 h-4 fill-current text-sky-600" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.28a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                          </svg>
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleCopyEmail(selectedMember.email, loc.name, e)}
                        className="p-2.5 rounded-xl border dark:border-zinc-800 border-slate-300 dark:bg-zinc-900 bg-white hover:border-emerald-500 transition-colors flex items-center gap-2 dark:text-zinc-200 text-slate-800 font-bold text-xs cursor-pointer text-left"
                      >
                        {copiedEmail === selectedMember.email ? (
                          <Check className="w-4 h-4 text-emerald-500 flex-none" />
                        ) : (
                          <Copy className="w-4 h-4 text-emerald-500 flex-none" />
                        )}
                        <span className="truncate">{copiedEmail === selectedMember.email ? t.common.copied[language] : t.team.copyEmail[language]}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t dark:border-zinc-800 border-slate-200 flex items-center justify-between gap-4">
                  <span className="text-[11px] dark:text-zinc-500 text-slate-500">
                    {t.footer.labTitle[language]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold dark:bg-zinc-800 bg-slate-200 dark:text-white text-slate-800 hover:brightness-110 cursor-pointer"
                  >
                    {t.common.close[language]}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
};

export const TeamSection = Team;
