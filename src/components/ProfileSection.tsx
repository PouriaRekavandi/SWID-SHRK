import React from 'react';
import { ShieldCheck } from 'lucide-react';
import profilePhoto from '../assets/profile.jpg';
import { useLanguage } from '../context/LanguageContext';

export const ProfileSection: React.FC = () => {
  const { language, isRTL, t } = useLanguage();

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`relative overflow-hidden dark:bg-[#141414]/70 bg-white border dark:border-[#333333] border-slate-200 dark:hover:border-[#00b8ff] hover:border-sky-500 rounded-2xl p-6 sm:p-8 md:p-10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.55)] shadow-md transition-all duration-300 group ${
        isRTL ? 'text-right' : 'text-left'
      }`}
    >
      {/* Scanline subtle overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:bg-[linear-gradient(to_bottom,transparent_calc(100%-14px),rgba(0,255,65,0.25)_calc(100%-3px),#00ff41_100%)] bg-[linear-gradient(to_bottom,transparent_calc(100%-14px),rgba(2,132,199,0.2)_calc(100%-3px),#0284c7_100%)] animate-[scanline_6s_infinite_linear]" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-8">
        {/* Avatar / Portrait */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group/avatar">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 dark:border-[#00b8ff] border-sky-600 dark:shadow-[0_0_25px_rgba(0,184,255,0.45)] shadow-md dark:bg-gradient-to-b dark:from-[#102538] dark:to-[#050b11] bg-gradient-to-b from-sky-50 to-slate-100 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
              <img
                src={profilePhoto}
                alt="Pouria Hejazi Rekavandi"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-orbitron font-bold text-3xl sm:text-4xl dark:text-[#00b8ff] text-sky-700 select-none">
                PHR
              </span>
            </div>
            <div className="absolute -bottom-2 px-3 py-0.5 rounded-full dark:bg-[#050505] bg-white border dark:border-[#00ff41] border-emerald-600 dark:text-[#00ff41] text-emerald-700 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3" /> {t.profile.piBadge[language]}
            </div>
          </div>
        </div>

        {/* Bio Content */}
        <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Tags */}
          <ul className={`flex flex-wrap gap-2 list-none p-0 m-0 ${isRTL ? 'justify-start flex-row-reverse' : ''}`}>
            {t.profile.tags.map((tag) => (
              <li
                key={tag.en}
                className="px-3 py-1 border dark:border-[#00b8ff]/40 border-sky-300 rounded-full dark:text-[#00b8ff] text-sky-800 text-xs font-mono uppercase tracking-wider dark:bg-[#00b8ff]/5 bg-sky-50"
              >
                {tag[language]}
              </li>
            ))}
          </ul>

          <p className="dark:text-zinc-200 text-slate-800 text-sm sm:text-base leading-relaxed font-sans">
            {t.profile.bioLead[language]}
          </p>

          {/* Personal Verse */}
          <blockquote
            className={`my-4 py-3.5 px-4 sm:px-6 dark:bg-[#00b8ff]/[0.04] bg-sky-50/80 rounded-lg ${
              isRTL
                ? 'border-r-3 border-l-0 dark:border-[#00b8ff] border-sky-600 text-right'
                : 'border-l-3 border-r-0 dark:border-[#00b8ff] border-sky-600 text-left'
            }`}
          >
            <div className="my-1 dark:text-[#d8f6ff] text-slate-800 text-sm sm:text-base italic leading-relaxed space-y-1">
              {t.profile.verse[language].map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </blockquote>

          {/* Signature */}
          <div className="pt-2 font-mono text-sm space-y-0.5">
            <p className="text-xs uppercase tracking-wider dark:text-zinc-400 text-slate-500 font-bold">
              {t.profile.roleTitle[language]}
            </p>
            <p className="dark:text-zinc-300 text-slate-700">
              {t.profile.signatureLead[language]}
              <br />
              <strong className="text-base dark:text-white text-slate-900 font-semibold">
                {t.profile.signatureName[language]}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
