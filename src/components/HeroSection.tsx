import React from 'react';
import { TabKey } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ArrowRight, GraduationCap, PlayCircle, Bot, Sparkles } from 'lucide-react';
import { BlackHoleLogoCrest } from './BlackHoleLogoCrest';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onSelectTab: (tab: TabKey) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab }) => {
  const { language, isRTL, t } = useLanguage();

  return (
    <header className="relative isolate flex flex-col items-center justify-center min-h-[580px] sm:min-h-[660px] py-16 px-4 overflow-hidden bg-[#02040a] border-b-2 border-[#00ff41]/40 shadow-2xl transition-colors duration-200">
      {/* Persistent Theme Toggle in Header */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <ThemeSwitcher variant="hero" />
      </div>

      {/* Deep Space Cosmic Canvas with Distant Stars and Nebula Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#02040a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(15,23,42,0.9),rgba(2,4,10,1))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(14,165,233,0.14)_0%,rgba(99,102,241,0.08)_40%,transparent_70%)]" />
        {/* Subtle procedural starfield specks */}
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:56px_56px]" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:84px_84px]" />
      </div>

      {/* Central Black Hole Crest & Interactive Solar Orbit Engine */}
      <div className="relative z-10 flex flex-col items-center mb-6 w-full max-w-3xl">
        <BlackHoleLogoCrest onSelectTab={onSelectTab} />
      </div>

      {/* Main Titles */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-2" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1
          className={`text-4xl sm:text-5xl md:text-7xl text-white font-normal leading-tight tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] mb-3 ${
            isRTL ? 'font-serif' : 'font-allura'
          }`}
        >
          {t.hero.mainTitle[language]}
        </h1>
        <p className="text-zinc-300 font-mono text-xs sm:text-sm md:text-base tracking-[0.15em] uppercase mb-4 drop-shadow-xs">
          {t.hero.subtitle[language]}
        </p>

        {/* MIGA Badge */}
        <div className="inline-flex items-baseline px-4 py-1 border border-zinc-700/80 rounded-full font-orbitron font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-8 bg-black/70 shadow-sm">
          <span className="text-[#ff3131] drop-shadow-[0_0_6px_rgba(255,49,49,0.7)]">M</span>
          <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">IG</span>
          <span className="text-[#00e676] drop-shadow-[0_0_6px_rgba(0,230,118,0.7)]">A</span>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onSelectTab('chat')}
            className="flex items-center gap-2 px-5 py-2.5 rounded dark:bg-gradient-to-r dark:from-[#00ff41] dark:to-[#00b8ff] dark:hover:from-[#00ff41]/90 dark:hover:to-[#00b8ff]/90 dark:text-black bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md dark:shadow-[0_0_20px_rgba(0,184,255,0.4)] cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>{t.hero.aiAssistantBtn[language]}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelectTab('research')}
            className="flex items-center gap-2 px-5 py-2.5 rounded dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-[#00ff41] dark:text-zinc-200 dark:hover:text-[#00ff41] bg-white border-slate-300 hover:border-sky-600 text-slate-700 hover:text-sky-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
          >
            <span>{t.hero.researchModulesBtn[language]}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => onSelectTab('students')}
            className="flex items-center gap-2 px-5 py-2.5 rounded border dark:border-[#00b8ff] dark:text-[#00b8ff] dark:hover:bg-[#00b8ff] dark:hover:text-[#050505] border-sky-600 text-sky-700 hover:bg-sky-600 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 dark:hover:shadow-[0_0_16px_rgba(0,184,255,0.5)] hover:shadow-md cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t.hero.thesisRegistryBtn[language]}</span>
          </button>

          <button
            onClick={() => onSelectTab('abaqus')}
            className="flex items-center gap-2 px-5 py-2.5 rounded dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-[#00ff41] dark:text-zinc-200 dark:hover:text-[#00ff41] bg-white border-slate-300 hover:border-sky-600 text-slate-700 hover:text-sky-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{t.hero.abaqusSimsBtn[language]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
