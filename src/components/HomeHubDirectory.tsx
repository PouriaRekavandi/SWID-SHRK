import React from 'react';
import { TabKey } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Bot,
  Newspaper,
  Users,
  MessageSquare,
  Cpu,
  Mail,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Shield,
  Activity,
} from 'lucide-react';

interface HomeHubDirectoryProps {
  onSelectTab: (tab: TabKey) => void;
}

interface DomainPortalCard {
  tab: TabKey;
  titleEn: string;
  titleFa: string;
  badgeEn: string;
  badgeFa: string;
  descEn: string;
  descFa: string;
  icon: React.ReactNode;
  accentColor: string; // Tailwind border / glow color
  buttonColor: string;
  metricsEn: string;
  metricsFa: string;
}

export const HomeHubDirectory: React.FC<HomeHubDirectoryProps> = ({ onSelectTab }) => {
  const { language, isRTL } = useLanguage();

  const portals: DomainPortalCard[] = [
    {
      tab: 'research',
      titleEn: 'Biomechanics & Metamaterials Research',
      titleFa: 'پژوهش‌های بیومکانیک و فرامواد',
      badgeEn: '4 Specialized Domains',
      badgeFa: '۴ حوزه تخصصی پژوهشی',
      descEn:
        'Multiaxial fatigue, neural biomechanics, auxetic & chiral metamaterials, and dynamic crash energy absorption.',
      descFa:
        'خستگی چندمحوره، بیومکانیک بافت‌های عصبی، فرامواد آگزتیک و جذب انرژی در برخوردهای دینامیکی.',
      icon: <Layers className="w-5 h-5 text-[#00b8ff]" />,
      accentColor: 'border-[#00b8ff]/40 hover:border-[#00b8ff] hover:shadow-[0_0_24px_rgba(0,184,255,0.35)]',
      buttonColor: 'bg-[#00b8ff]/10 hover:bg-[#00b8ff] text-[#00b8ff] hover:text-black border-[#00b8ff]/50',
      metricsEn: 'Finite Element Formulations • 4 Video Masterclasses',
      metricsFa: 'فرمولاسیون المان محدود • ۴ ویدئوی آموزشی',
    },
    {
      tab: 'publications',
      titleEn: 'Peer-Reviewed Publications & Citations',
      titleFa: 'انتشارات، مقالات و ارجاعات علمی',
      badgeEn: '48+ Indexed Papers',
      badgeFa: 'بیش از ۴۸ مقاله نمایه‌شده',
      descEn:
        'Archive of Q1 international journal papers, conference proceedings, BibTeX generation, and DOI citations.',
      descFa:
        'مجموعه مقالات بین‌المللی Q1، مقالات کنفرانسی، استخراج BibTeX و ارجاعات معتبر DOI.',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      accentColor: 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(52,211,153,0.35)]',
      buttonColor: 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border-emerald-500/50',
      metricsEn: 'Journal Articles • BibTeX Generator • Full DOIs',
      metricsFa: 'مقالات ژورنال • تولید خودکار BibTeX • ارجاعات کامل',
    },
    {
      tab: 'students',
      titleEn: 'Supervised Theses & Student Projects',
      titleFa: 'پایان‌نامه‌ها و پروژه‌های دانشجویی',
      badgeEn: '40+ Graduate Theses',
      badgeFa: 'بیش از ۴۰ پایان‌نامه',
      descEn:
        'Full registry of supervised BSc, MSc, and PhD dissertations, defense milestones, research topics, and tracking.',
      descFa:
        'سامانه جامع ثبت و پیگیری پایان‌نامه‌های کارشناسی، کارشناسی ارشد و دکتری با وضعیت دفاع و پیشرفت.',
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      accentColor: 'border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_24px_rgba(251,191,36,0.35)]',
      buttonColor: 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border-amber-500/50',
      metricsEn: 'BSc, MSc, PhD Records • Milestone Tracking',
      metricsFa: 'سوابق کارشناسی، ارشد و دکتری • بررسی مراحل',
    },
    {
      tab: 'abaqus',
      titleEn: 'Abaqus FEA Simulations & Gallery',
      titleFa: 'گالری و شبیه‌سازی‌های المان محدود آباکوس',
      badgeEn: 'Dynamic Explicit Solvers',
      badgeFa: 'حلگرهای صریح و دینامیکی',
      descEn:
        'Dynamic explicit stress/strain contour plots, non-linear deformation simulations, and interactive telemetry.',
      descFa:
        'کانتورهای تنش و کرنش دینامیکی، شبیه‌سازی‌های تغییرشکل غیرخطی و تحلیل‌های المان محدود صریح.',
      icon: <PlayCircle className="w-5 h-5 text-cyan-400" />,
      accentColor: 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(6,182,212,0.35)]',
      buttonColor: 'bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black border-cyan-500/50',
      metricsEn: 'VUMAT Subroutines • Explicit Mesh Formulations',
      metricsFa: 'زیربرنامه‌های VUMAT • مش‌بندی‌های پیشرفته',
    },
    {
      tab: 'chat',
      titleEn: 'AI Research Assistant (SWID-Bot)',
      titleFa: 'دستیار هوش مصنوعی آزمایشگاه (SWID-Bot)',
      badgeEn: 'Interactive Engineering AI',
      badgeFa: 'هوش مصنوعی تعاملی مهندسی',
      descEn:
        'Instant answers on laboratory methodologies, paper summaries, Abaqus script generation, and mechanical formulas.',
      descFa:
        'پاسخگویی آنی به سوالات متدولوژی، خلاصه مقالات آزمایشگاه، تولید کدهای پایتون آباکوس و روابط مکانیک.',
      icon: <Bot className="w-5 h-5 text-[#00ff41]" />,
      accentColor: 'border-[#00ff41]/40 hover:border-[#00ff41] hover:shadow-[0_0_24px_rgba(0,255,65,0.35)]',
      buttonColor: 'bg-[#00ff41]/10 hover:bg-[#00ff41] text-[#00ff41] hover:text-black border-[#00ff41]/50',
      metricsEn: 'Real-Time Synthesis • Contextual Prompt Chips',
      metricsFa: 'پاسخ‌های هوشمند • گزینه‌های آماده پرسش',
    },
    {
      tab: 'news',
      titleEn: 'Laboratory Dispatches & News Feed',
      titleFa: 'اطلاعیه‌ها و اخبار دستاوردهای آزمایشگاه',
      badgeEn: 'Latest Announcements',
      badgeFa: 'آخرین اخبار و رویدادها',
      descEn:
        'Recent paper acceptances, student defense milestones, conference keynote speeches, and experimental grants.',
      descFa:
        'پذیرش مقالات جدید، دفاع پایان‌نامه‌ها، سخنرانی‌های کلیدی در همایش‌های بین‌المللی و رویدادهای آزمایشگاه.',
      icon: <Newspaper className="w-5 h-5 text-rose-400" />,
      accentColor: 'border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_24px_rgba(244,63,94,0.35)]',
      buttonColor: 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border-rose-500/50',
      metricsEn: 'Categorized Dispatches • Full Article Modal',
      metricsFa: 'دسته‌بندی موضوعی • مطالعه متن کامل اخبار',
    },
    {
      tab: 'team',
      titleEn: 'Research Team & Academic Dossier',
      titleFa: 'اعضای تیم پژوهشی و سوابق علمی',
      badgeEn: 'Faculty, Fellows & Alumni',
      badgeFa: 'اساتید، پژوهشگران و دانش‌آموختگان',
      descEn:
        'Principal investigator profile, postdoctoral associates, doctoral scholars, active projects, and alumni network.',
      descFa:
        'رزومه و سوابق سرپرست آزمایشگاه، پژوهشگران پسادکتری، دانشجویان دکتری، پروژه‌های فعال و شبکه فارغ‌التحصیلان.',
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      accentColor: 'border-indigo-500/40 hover:border-indigo-400 hover:shadow-[0_0_24px_rgba(129,140,248,0.35)]',
      buttonColor: 'bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-black border-indigo-500/50',
      metricsEn: 'Full Researcher Dossiers • Academic Profiles',
      metricsFa: 'پروفایل کامل محققان • لینک‌های پژوهشی',
    },
    {
      tab: 'qa',
      titleEn: 'Engineering Q&A Forum',
      titleFa: 'تالار پرسش و پاسخ تخصصی مهندسی',
      badgeEn: 'Technical Discussions',
      badgeFa: 'بحث‌های فنی و تحلیلی',
      descEn:
        'Open technical exchange on numerical simulations, metamaterial additive manufacturing, and biomechanical testing.',
      descFa:
        'پرسش و تبادل نظر فنی پیرامون شبیه‌سازی‌های عددی، ساخت افزایشی فرامواد و روش‌های تست بیومکانیکی.',
      icon: <MessageSquare className="w-5 h-5 text-violet-400" />,
      accentColor: 'border-violet-500/40 hover:border-violet-400 hover:shadow-[0_0_24px_rgba(167,139,250,0.35)]',
      buttonColor: 'bg-violet-500/10 hover:bg-violet-500 text-violet-400 hover:text-black border-violet-500/50',
      metricsEn: 'Community Forum • Verified Technical Answers',
      metricsFa: 'تالار گفتگو • پاسخ‌های تخصصی اعضای آزمایشگاه',
    },
    {
      tab: 'gear',
      titleEn: 'Testing Facilities & Laboratory Gear',
      titleFa: 'تجهیزات آزمایشگاهی و امکانات تجربی',
      badgeEn: 'Hardware & Instrumentation',
      badgeFa: 'تجهیزات و ابزار دقیق',
      descEn:
        'Split-Hopkinson pressure bar (SHPB), high-velocity drop tower, servo-hydraulic testing frames, and sensors.',
      descFa:
        'میله هاپکینسون، برجک تست سقوط پرسرعت، دستگاه‌های تست سرووهیدرولیک و سنسورهای داده‌برداری.',
      icon: <Cpu className="w-5 h-5 text-teal-400" />,
      accentColor: 'border-teal-500/40 hover:border-teal-400 hover:shadow-[0_0_24px_rgba(45,212,191,0.35)]',
      buttonColor: 'bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-black border-teal-500/50',
      metricsEn: 'Dynamic Impact Sensors • Calibration Rig',
      metricsFa: 'سنسورهای ضربه دینامیکی • استانداردهای کالیبراسیون',
    },
    {
      tab: 'contact',
      titleEn: 'Direct Inquiries & Laboratory Contact',
      titleFa: 'ارتباط مستقیم و ثبت درخواست‌ها',
      badgeEn: 'Academic & Industry',
      badgeFa: 'همکاری‌های دانشگاهی و صنعتی',
      descEn:
        'Academic partnerships, industrial testing contracts, student supervision requests, and institutional visits.',
      descFa:
        'همکاری‌های تحقیقاتی دانشگاهی، قراردادهای آزمون صنعتی، پذیرش دانشجویان تحصیلات تکمیلی و بازدیدها.',
      icon: <Mail className="w-5 h-5 text-sky-400" />,
      accentColor: 'border-sky-500/40 hover:border-sky-400 hover:shadow-[0_0_24px_rgba(56,189,248,0.35)]',
      buttonColor: 'bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-black border-sky-500/50',
      metricsEn: 'Official Inquiries • Verification Form',
      metricsFa: 'فرم رسمی ارتباط • پاسخگویی در اسرع وقت',
    },
  ];

  const handleOpenInNewTab = (e: React.MouseEvent, tab: TabKey) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}${window.location.pathname}?tab=${tab}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      onSelectTab(tab);
    }
  };

  return (
    <section className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#00ff41] uppercase mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>
              {language === 'fa'
                ? '// درگاه‌های سازمان‌یافته آزمایشگاه //'
                : '// ORGANIZED LABORATORY WORKSPACES //'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-orbitron tracking-wide text-white">
            {language === 'fa'
              ? 'ماتریس حوزه‌ها و سامانه‌های تخصصی'
              : 'Interactive Research Matrix & Portals'}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1 max-w-2xl leading-relaxed">
            {language === 'fa'
              ? 'کلیه بخش‌های علمی، شبیه‌سازی‌ها، مقالات و پایان‌نامه‌ها در تب‌های مستقل سازماندهی شده‌اند. برای ورود مستقیم یا باز کردن در تب جدید مرورگر روی هر بخش کلیک کنید.'
              : 'All research modules, publications, simulations, and records are organized into dedicated tabs. Click any portal to navigate directly or use the ↗ button to open in a new browser tab.'}
          </p>
        </div>

        {/* Total Tabs Count Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-xs font-mono font-bold text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-[#00b8ff]" />
          <span>
            {language === 'fa' ? '۱۰ درگاه تخصصی آماده بازدید' : '10 Specialized Workspaces'}
          </span>
        </div>
      </div>

      {/* Grid of Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {portals.map((portal) => {
          const title = language === 'fa' ? portal.titleFa : portal.titleEn;
          const badge = language === 'fa' ? portal.badgeFa : portal.badgeEn;
          const desc = language === 'fa' ? portal.descFa : portal.descEn;
          const metrics = language === 'fa' ? portal.metricsFa : portal.metricsEn;

          return (
            <div
              key={portal.tab}
              onClick={() => onSelectTab(portal.tab)}
              className={`group relative p-5 sm:p-6 rounded-2xl bg-zinc-950/70 border backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between ${portal.accentColor}`}
            >
              <div>
                {/* Top Badge & Open in New Tab Button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 border border-zinc-800 text-zinc-300">
                    {portal.icon}
                    <span>{badge}</span>
                  </div>

                  {/* Open in New Browser Tab Button */}
                  <button
                    onClick={(e) => handleOpenInNewTab(e, portal.tab)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
                    title={
                      language === 'fa'
                        ? 'باز کردن این بخش در تب جدید مرورگر ↗'
                        : 'Open this workspace in a new browser tab ↗'
                    }
                    aria-label={`Open ${title} in a new tab`}
                  >
                    <span className="hidden sm:inline">
                      {language === 'fa' ? 'تب جدید' : 'New Tab'}
                    </span>
                    <ExternalLink className="w-3 h-3 text-[#00b8ff]" />
                  </button>
                </div>

                {/* Card Title */}
                <h3 className="text-lg sm:text-xl font-bold font-orbitron text-white group-hover:text-[#00ff41] transition-colors mb-2">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed mb-4">
                  {desc}
                </p>
              </div>

              {/* Footer Info & Action Bar */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-zinc-500 text-[11px] truncate">{metrics}</span>

                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold uppercase tracking-wider text-[11px] transition-all duration-200 ${portal.buttonColor}`}
                >
                  <span>{language === 'fa' ? 'ورود به بخش' : 'Open Workspace'}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 ${
                      isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
