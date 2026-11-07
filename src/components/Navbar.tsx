import React, { useState } from 'react';
import { TabKey } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useCelestial } from '../context/CelestialContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu,
  X,
  Layers,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Mail,
  Home,
  MessageSquare,
  Users,
  Globe,
} from 'lucide-react';
import logoTransparent from '../assets/logo.jpg';
import logoFallback from '../assets/logo.jpg';

interface NavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeBodyKey, activeInfo, advanceToNextBody, handleEarthClick } = useCelestial();
  const { language, toggleLanguage, t } = useLanguage();

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: t.nav.home[language], icon: <Home className="w-4 h-4" /> },
    { key: 'qa', label: t.nav.qa[language], icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'team', label: t.nav.team[language], icon: <Users className="w-4 h-4" /> },
    { key: 'research', label: t.nav.research[language], icon: <Layers className="w-4 h-4" /> },
    { key: 'publications', label: t.nav.publications[language], icon: <BookOpen className="w-4 h-4" /> },
    { key: 'students', label: t.nav.students[language], icon: <GraduationCap className="w-4 h-4" /> },
    { key: 'abaqus', label: t.nav.abaqus[language], icon: <PlayCircle className="w-4 h-4" /> },
    { key: 'contact', label: t.nav.contact[language], icon: <Mail className="w-4 h-4" /> },
  ];

  const handleNavClick = (key: TabKey) => {
    onSelectTab(key);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 dark:bg-[#050505]/95 bg-white/95 backdrop-blur-md border-b dark:border-[#333333] border-slate-200 transition-colors duration-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between min-h-[58px] gap-2">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none flex-none"
        >
          <div className="w-8 h-8 flex items-center justify-center flex-none transition-transform duration-300 group-hover:scale-110">
            <img
              src={logoTransparent}
              alt="SWID-SHRK Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,184,255,0.45)] dark:drop-shadow-[0_0_10px_rgba(0,184,255,0.7)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = logoFallback;
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-bold text-sm tracking-wider dark:text-white text-slate-900 dark:group-hover:text-[#00ff41] group-hover:text-sky-600 transition-colors">
              {t.nav.labName[language]}
            </span>
            <span className="text-[10px] dark:text-zinc-400 text-slate-500 font-mono tracking-widest uppercase">
              {t.nav.labSubtitle[language]}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`relative px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'dark:text-[#00ff41] text-sky-700 dark:glow-green'
                    : 'dark:text-zinc-300 text-slate-600 hover:text-sky-600 dark:hover:text-[#00ff41]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] dark:bg-[#00ff41] bg-sky-600 dark:shadow-[0_0_8px_#00ff41]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Actions: Celestial Indicator, Language Toggle, Theme Switcher & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Celestial Orbit Indicator Button */}
          <button
            onClick={() => {
              if (activeBodyKey === 'earth') {
                handleEarthClick(onSelectTab);
              } else {
                advanceToNextBody();
              }
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
              activeBodyKey === 'earth'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse'
                : activeBodyKey === 'blackhole'
                ? 'dark:bg-amber-950/40 bg-amber-50 dark:text-amber-300 text-amber-700 border-amber-500/40 hover:border-amber-400'
                : 'dark:bg-zinc-900 bg-slate-100 dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-800 hover:border-[#00ff41]'
            }`}
            title={
              activeBodyKey === 'earth'
                ? t.nav.earthActiveTooltip[language]
                : t.nav.celestialTooltip[language].replace('{name}', activeInfo.name)
            }
          >
            <span className="text-sm select-none">{activeInfo.astronomicalSymbol}</span>
            <span className="hidden sm:inline font-orbitron text-[11px]">{activeInfo.name}</span>
            {activeBodyKey === 'earth' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400 text-black font-extrabold hidden md:inline shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                RESEARCH ↗
              </span>
            )}
          </button>

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer dark:bg-zinc-900 bg-slate-100 dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-800 hover:border-[#00ff41] hover:text-[#00ff41] shadow-xs"
            title={t.common.switchLanguage[language]}
            aria-label={t.common.switchLanguage[language]}
          >
            <Globe className="w-3.5 h-3.5 text-[#00b8ff]" />
            <span className="font-bold">{language === 'en' ? 'فا' : 'EN'}</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">
              {language === 'en' ? 'فارسی' : 'English'}
            </span>
          </button>

          {/* Theme Switcher Toggle */}
          <ThemeSwitcher />

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 dark:text-zinc-300 text-slate-700 hover:text-sky-600 dark:hover:text-white border dark:border-[#333333] border-slate-300 rounded hover:border-sky-500 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-sky-600 dark:text-[#00ff41]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b dark:border-[#333333] border-slate-200 dark:bg-[#090d12] bg-white px-4 py-3 space-y-1 animate-fadeIn shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left transition-all ${
                  isActive
                    ? 'dark:bg-[#00ff41]/10 bg-sky-50 dark:text-[#00ff41] text-sky-700 border-l-2 dark:border-[#00ff41] border-sky-600 font-bold'
                    : 'dark:text-zinc-300 text-slate-600 hover:text-sky-600 dark:hover:text-[#00ff41]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t dark:border-zinc-800 border-slate-200 flex items-center justify-between px-3 py-2">
            <span className="text-xs font-mono uppercase tracking-wider dark:text-zinc-400 text-slate-500 font-semibold">
              {t.common.language[language]}
            </span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border dark:bg-zinc-900 bg-slate-100 dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-800"
            >
              <Globe className="w-3.5 h-3.5 text-[#00b8ff]" />
              <span>{language === 'en' ? 'فارسی (FA)' : 'English (EN)'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
