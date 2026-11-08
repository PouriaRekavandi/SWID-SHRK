/**
 * Centralized Static Localization Map for SWID-SHRK Application
 * Provides 100% full English and scholarly Persian (Farsi) coverage
 * for all static text labels across the platform.
 */

export type AppLanguage = 'en' | 'fa';

export interface LocalizedString {
  en: string;
  fa: string;
}

export const LOCALIZATION = {
  // Common / General UI
  common: {
    language: {
      en: 'Language',
      fa: 'زبان',
    },
    english: {
      en: 'English (EN)',
      fa: 'انگلیسی (EN)',
    },
    persian: {
      en: 'Persian (FA)',
      fa: 'فارسی (FA)',
    },
    switchLanguage: {
      en: 'Switch to Persian',
      fa: 'تغییر به زبان انگلیسی',
    },
    copy: {
      en: 'Copy',
      fa: 'کپی',
    },
    copied: {
      en: 'Copied!',
      fa: 'کپی شد!',
    },
    close: {
      en: 'Close',
      fa: 'بستن',
    },
    search: {
      en: 'Search',
      fa: 'جستجو',
    },
    active: {
      en: 'Active',
      fa: 'فعال',
    },
    viewAll: {
      en: 'View All',
      fa: 'مشاهده همه',
    },
    backToTop: {
      en: 'Top',
      fa: 'بالا',
    },
    skipToMain: {
      en: 'Skip to main content',
      fa: 'پرش به محتوای اصلی',
    },
    askLabAI: {
      en: 'Ask Lab AI',
      fa: 'هوش مصنوعی آزمایشگاه',
    },
  },

  // Navbar & Branding
  nav: {
    home: {
      en: 'Home',
      fa: 'صفحه اصلی',
    },
    qa: {
      en: 'Engineering Q&A',
      fa: 'پرسش و پاسخ مهندسی',
    },
    team: {
      en: 'Team',
      fa: 'تیم پژوهشی',
    },
    research: {
      en: 'Research',
      fa: 'پژوهش‌ها',
    },
    publications: {
      en: 'Publications',
      fa: 'انتشارات و مقالات',
    },
    students: {
      en: 'Theses',
      fa: 'پایان‌نامه‌ها',
    },
    abaqus: {
      en: 'Abaqus_Sims',
      fa: 'شبیه‌سازی‌های آباکوس',
    },
    gear: {
      en: 'Lab Gear',
      fa: 'تجهیزات آزمایشگاه',
    },
    mail: {
      en: 'Lab Mail (Gmail)',
      fa: 'مکاتبات (Gmail)',
    },
    contact: {
      en: 'Connect',
      fa: 'ارتباط با ما',
    },
    labName: {
      en: 'SWID-SHRK',
      fa: 'SWID-SHRK',
    },
    labSubtitle: {
      en: 'Aerospace & Mechanics Lab',
      fa: 'آزمایشگاه هوافضا و مکانیک',
    },
    earthActiveTooltip: {
      en: 'Earth Active — Click to explore Research Hub in a new tab!',
      fa: 'سیاره زمین فعال است — کلیک کنید تا بخش پژوهش‌ها در تب جدید باز شود!',
    },
    celestialTooltip: {
      en: 'Active Celestial Body: {name} — Click to step to next orbit',
      fa: 'جرم آسمانی فعال: {name} — برای انتقال به مدار بعدی کلیک کنید',
    },
  },

  // Project Banner
  banner: {
    badge: {
      en: 'Active Project',
      fa: 'پروژه فعال',
    },
    title: {
      en: 'In development: advanced LCE polymers via neural-network algorithms',
      fa: 'در دست پژوهش: توسعه پلیمرهای الاستومر کریستال مایع (LCE) با هوش مصنوعی',
    },
    detailsBtn: {
      en: 'Details',
      fa: 'جزئیات',
    },
    modalSub: {
      en: 'Active Laboratory Research Initiative',
      fa: 'طرح پژوهشی فعال آزمایشگاه',
    },
    modalTitle: {
      en: 'Advanced Liquid Crystal Elastomers (LCE) via Neural-Network Inverse Design',
      fa: 'طراحی معکوس الاستومرهای کریستال مایع (LCE) با شبکه‌های عصبی',
    },
    modalDesc: {
      en: 'This project focuses on the generative inverse design and structural optimization of Liquid Crystal Elastomers (LCE) and metamaterial lattice configurations. By combining physics-informed machine learning (PINN) architectures with nonlinear finite element analysis (FEA) in Abaqus, we simulate large-deformation morphing behavior and dynamic shock attenuation.',
      fa: 'این طرح بر طراحی معکوس مولد و بهینه‌سازی ساختاری الاستومرهای پیشرفته کریستال مایع (LCE) و شبکه‌های متامتریال متمرکز است. با تلفیق یادگیری عمیق فیزیک‌آگاه (PINN) با شبیه‌سازی غیرخطی المان محدود در آباکوس (Abaqus FEA)، رفتار تغییرشکل‌های بزرگ و جذب شوک‌های دینامیکی مدل‌سازی می‌شود.',
    },
    coreTitle: {
      en: 'Computational Core',
      fa: 'هسته محاسباتی',
    },
    coreDesc: {
      en: 'Custom Abaqus Fortran UMAT subroutines coupled with PyTorch surrogate models for millisecond inference of viscoelastic response.',
      fa: 'زیربرنامه‌های سفارشی فرترن UMAT در آباکوس متصل به مدل‌های جانشین پای‌تورچ جهت استنتاج آنی پاسخ ویسکوالاستیک.',
    },
    synthesisTitle: {
      en: 'Metamaterial Synthesis',
      fa: 'سنتز و ساخت متامتریال',
    },
    synthesisDesc: {
      en: 'High-resolution additive manufacturing and multi-rate mechanical impact testing for validation against dynamic Hopkinson pressure bar benchmarks.',
      fa: 'ساخت افزایشی سه‌بعدی با دقت میکرونی و آزمون‌های ضربه مکانیکی چندنرخه جهت اعتبارسنجی با میله فشار هاپکینسون تفکیک‌شده.',
    },
    openSimulator: {
      en: 'Open Dark Matter Sim',
      fa: 'شبیه‌ساز ماده تاریک',
    },
    viewVideoTutorials: {
      en: 'Video Tutorials',
      fa: 'آموزش‌های ویدیویی',
    },
  },

  // Hero Section
  hero: {
    mainTitle: {
      en: 'Something Weird is Discovering…!',
      fa: 'چیزی شگفت‌انگیز در حال کشف شدن است…!',
    },
    subtitle: {
      en: 'Mechanical & aerospace engineering research',
      fa: 'پژوهش‌های پیشرفته مهندسی مکانیک و هوافضا',
    },
    aiAssistantBtn: {
      en: 'AI Lab Assistant',
      fa: 'دستیار هوش مصنوعی آزمایشگاه',
    },
    researchModulesBtn: {
      en: 'Research Modules',
      fa: 'ماژول‌های پژوهشی',
    },
    thesisRegistryBtn: {
      en: 'Thesis Registry',
      fa: 'سامانه پایان‌نامه‌ها',
    },
    abaqusSimsBtn: {
      en: 'Abaqus Sims',
      fa: 'شبیه‌سازی‌های آباکوس',
    },
  },

  // Profile Section / Research Lab Overview
  profile: {
    piBadge: {
      en: 'PI / Lead',
      fa: 'سرپرست و پژوهشگر ارشد',
    },
    tags: [
      {
        en: 'Fatigue & Fracture',
        fa: 'خستگی و مکانیک شکست',
      },
      {
        en: 'Biomechanics',
        fa: 'بیومکانیک',
      },
      {
        en: 'Metamaterials',
        fa: 'متامتریال‌ها و فرامواد',
      },
      {
        en: 'Abaqus / FEA',
        fa: 'آباکوس و المان محدود',
      },
    ],
    bioLead: {
      en: 'I am an interdisciplinary engineering researcher specializing in mechanical and aerospace engineering, embodying the continuous evolution of a childhood curiosity that has shaped my entire 40-year journey.',
      fa: 'من پژوهشگر میان‌رشته‌ای مهندسی با تمرکز ویژه بر مهندسی مکانیک و هوافضا هستم؛ تداوم و تکامل کنجکاوی کودکانه‌ای که تمام مسیر ۴۰ ساله زندگی و حرفه‌ام را رقم زده است.',
    },
    verse: {
      en: [
        'Listen to the whispers of your dreaming soul,',
        'Speak only truth to keep your spirit whole.',
        'Fix your steady gaze upon a single star,',
        'Work with burning fire to reach for what you are.',
        'And let no passing shadow dim your inner light,',
        'For nothing can eclipse a purpose shining bright.',
      ],
      fa: [
        'به نجوای روان رویاپردازت گوش فرا ده،',
        'تنها حقیقت را بر زبان آور تا روحت یکپارچه ماند.',
        'دیدگان استوارت را بر تک‌ستاره‌ای بدوز،',
        'با آتشی سوزان در پی آنچه شایسته آنی بکوش.',
        'و مگذار هیچ سایه گذرایی فروغ درونت را کدر سازد،',
        'چرا که هیچ خورشیدگرفتگی هدفی تابناک را خاموش نتواند کرد.',
      ],
    },
    roleTitle: {
      en: 'Principal Investigator',
      fa: 'پژوهشگر ارشد و سرپرست آزمایشگاه',
    },
    signatureLead: {
      en: 'With sincere dedication',
      fa: 'با ارادت و احترام صمیمانه',
    },
    signatureName: {
      en: 'Pouria 🌻',
      fa: 'پوریا 🌻',
    },
  },

  // Team Section & Profiles
  team: {
    groupBadge: {
      en: 'SWID-SHRK RESEARCH GROUP',
      fa: 'گروه پژوهشی SWID-SHRK',
    },
    title: {
      en: 'Lab Research Team',
      fa: 'تیم پژوهشی آزمایشگاه',
    },
    subtitle: {
      en: 'Interdisciplinary investigators, doctoral candidates, and research engineers driving breakthroughs in aerospace fracture mechanics, neural viscoelasticity, and architected metamaterials.',
      fa: 'پژوهشگران میان‌رشته‌ای، پژوهشگران دکتری و مهندسان محقق در مسیر دستیابی به دستاوردهای نوین در مکانیک شکست هوافضا، ویسکوالاستیسیته بافت عصبی و متامتریال‌های سازه‌ای.',
    },
    metricActiveGroup: {
      en: 'Active Group',
      fa: 'گروه فعال',
    },
    metricMembersCount: {
      en: '{count} Members',
      fa: '{count} عضو پژوهشی',
    },
    metricGradPostdoc: {
      en: 'Grad & Postdoc',
      fa: 'دانشجویان و پسادکتری',
    },
    metricScholarsCount: {
      en: '{count} Scholars',
      fa: '{count} پژوهشگر',
    },
    categories: {
      all: {
        en: 'All Members',
        fa: 'همه اعضا',
      },
      pi: {
        en: 'PI & Director',
        fa: 'سرپرست و مدیر آزمایشگاه',
      },
      postdoc: {
        en: 'Postdoc Fellows',
        fa: 'پژوهشگران پسادکتری',
      },
      phd: {
        en: 'PhD Researchers',
        fa: 'پژوهشگران دکتری',
      },
      msc: {
        en: "Master's Fellows",
        fa: 'پژوهشگران کارشناسی ارشد',
      },
      alumni: {
        en: 'Alumni & Affiliates',
        fa: 'دانش‌آموختگان و همکاران',
      },
    },
    searchPlaceholder: {
      en: 'Search team by name, focus, or affiliation...',
      fa: 'جستجوی اعضا با نام، زمینه پژوهشی یا دانشگاه...',
    },
    noMembersFound: {
      en: 'No research team members match your criteria.',
      fa: 'عضوی مطابق با معیارهای جستجوی شما یافت نشد.',
    },
    resetFilters: {
      en: 'Reset Filters',
      fa: 'بازنشانی فیلترها',
    },
    copyEmail: {
      en: 'Copy Email',
      fa: 'کپی ایمیل',
    },
    copiedEmailSuccess: {
      en: "Copied {name}'s email ({email}) to clipboard",
      fa: 'ایمیل {name} ({email}) در حافظه کپی شد',
    },
    viewDossier: {
      en: 'View Academic Dossier',
      fa: 'مشاهده پرونده علمی',
    },
    researchFocusTitle: {
      en: 'Key Research Focus',
      fa: 'محورهای اصلی پژوهش',
    },
    joinedYearLabel: {
      en: 'Joined: {year}',
      fa: 'عضویت: {year}',
    },
    statusActive: {
      en: 'Active',
      fa: 'فعال',
    },
    statusAlumni: {
      en: 'Alumni',
      fa: 'دانش‌آموخته',
    },
    statusVisiting: {
      en: 'Visiting',
      fa: 'پژوهشگر مهمان',
    },
    dossierModal: {
      title: {
        en: 'Academic Dossier',
        fa: 'پرونده و سوابق علمی',
      },
      bioSection: {
        en: 'Research Profile & Scientific Focus',
        fa: 'پروفایل پژوهشی و محورهای علمی',
      },
      currentProjects: {
        en: 'Current Research Thrusts',
        fa: 'پروژه‌ها و اهداف پژوهشی جاری',
      },
      coauthoredPubs: {
        en: 'Co-Authored Laboratory Publications',
        fa: 'انتشارات و مقالات مشترک در آزمایشگاه',
      },
      noPubsListed: {
        en: 'Independent archival publications linked to active lab thrusts.',
        fa: 'انتشارات مستقل مرتبط با پروژه‌های جاری آزمایشگاه.',
      },
      contactDirect: {
        en: 'Direct Correspondence',
        fa: 'مکاتبه مستقیم علمی',
      },
      closeDossier: {
        en: 'Close Dossier',
        fa: 'بستن پرونده',
      },
    },

    // Member-Specific Persian Overrides
    members: {
      'pi-pouria': {
        name: {
          en: 'Dr. Pouria Hejazi Rekavandi',
          fa: 'دکتر پوریا حجازی ریکاوندی',
        },
        role: {
          en: 'Principal Investigator & Lab Director',
          fa: 'پژوهشگر ارشد و مدیر آزمایشگاه',
        },
        affiliation: {
          en: 'University of Maryland, Baltimore County (UMBC)',
          fa: 'دانشگاه مریلند، بالتیمور کانتی (UMBC)',
        },
        researchFocus: [
          { en: 'Multiaxial Fatigue', fa: 'خستگی چندمحوره' },
          { en: 'Fracture Mechanics', fa: 'مکانیک شکست' },
          { en: 'Neural Biomechanics', fa: 'بیومکانیک سیستم عصبی' },
          { en: 'AntiPrism Metamaterials', fa: 'متامتریال‌های آنتی‌پریسم' },
          { en: 'Abaqus CAE', fa: 'شبیه‌سازی آباکوس' },
        ],
        bio: {
          en: 'Directing the SWID-SHRK Aerospace and Mechanics Laboratory. Pioneering research in multiaxial thermo-mechanical fatigue, brain trauma viscoelastic constitutive formulations, and energy-absorbing cellular metamaterials.',
          fa: 'مدیریت آزمایشگاه هوافضا و مکانیک SWID-SHRK. پیشگام در پژوهش‌های خستگی ترمومکانیکی چندمحوره، مدل‌سازی رفتاری ویسکوالاستیک ترومای بافت مغز و متامتریال‌های سلولی جاذب انرژی.',
        },
      },
      'phd-alireza': {
        name: {
          en: 'Alireza Karimi',
          fa: 'علیرضا کریمی',
        },
        role: {
          en: 'Doctoral Researcher',
          fa: 'پژوهشگر دکتری',
        },
        affiliation: {
          en: 'UMBC Mechanical Engineering',
          fa: 'دانشکده مهندسی مکانیک UMBC',
        },
        researchFocus: [
          { en: 'Neural Biomechanics', fa: 'بیومکانیک بافت عصبی' },
          { en: 'Traumatic Brain Injury', fa: 'آسیب تروماتیک مغزی' },
          { en: 'High-Rate Viscoelasticity', fa: 'ویسکوالاستیسیته در نرخ کرنش بالا' },
          { en: 'VUMAT Subroutines', fa: 'زیربرنامه‌نویسی VUMAT' },
        ],
        bio: {
          en: 'Investigating multiscale strain concentrations across brain parenchyma and grey-white matter interfaces under rotational kinematics.',
          fa: 'بررسی تمرکز کرنش چندمقیاسی در پارانشیم بافت مغز و فصل مشترک ماده خاکستری-سفید تحت شتاب‌های سینماتیکی چرخشی.',
        },
      },
      'phd-elena': {
        name: {
          en: 'Elena Rostami',
          fa: 'النا رستمی',
        },
        role: {
          en: 'Doctoral Researcher',
          fa: 'پژوهشگر دکتری',
        },
        affiliation: {
          en: 'UMBC Mechanical Engineering',
          fa: 'دانشکده مهندسی مکانیک UMBC',
        },
        researchFocus: [
          { en: '3D AntiPrism Metamaterials', fa: 'متامتریال‌های سه‌بعدی آنتی‌پریسم' },
          { en: 'Shock Wave Dissipation', fa: 'میرایی امواج ضربه‌ای' },
          { en: 'Additive Manufacturing', fa: 'ساخت افزایشی (پرینت سه‌بعدی)' },
          { en: 'Explicit Dynamic Crush', fa: 'له‌شدگی دینامیکی صریح' },
        ],
        bio: {
          en: 'Developing lightweight energy-absorbing cellular topologies and non-linear crushing formulations for aerospace impact protection.',
          fa: 'توسعه توپولوژی‌های سلولی سبک جاذب انرژی و فرمول‌بندی‌های غیرخطی له‌شدگی برای محافظت ضربه‌ای در سامانه‌های هوافضایی.',
        },
      },
      'msc-marcus': {
        name: {
          en: 'Marcus Vance',
          fa: 'مارکوس ونس',
        },
        role: {
          en: 'Research Associate & Alumni',
          fa: 'پژوهشگر همکار و دانش‌آموخته',
        },
        affiliation: {
          en: 'Johns Hopkins Applied Physics Laboratory',
          fa: 'آزمایشگاه فیزیک کاربردی جانز هاپکینز (APL)',
        },
        researchFocus: [
          { en: 'Digital Image Correlation', fa: 'همبستگی تصاویر دیجیتال (DIC)' },
          { en: 'Fracture in Cementitious Materials', fa: 'مکانیک شکست در مواد سیمانی' },
          { en: 'Cohesive Zone Modeling', fa: 'مدل‌سازی ناحیه چسبنده (CZM)' },
        ],
        bio: {
          en: 'Focused on high-speed stereo DIC and mixed-mode fracture characterization in fiber-reinforced composite systems.',
          fa: 'متمرکز بر سامانه‌های تصویربرداری سه‌بعدی سرعت بالا (DIC) و شناسایی مشخصات شکست مود ترکیبی در کامپوزیت‌های تقویت‌شده با الیاف.',
        },
      },
    },
  },

  // Research Section
  research: {
    badge: {
      en: 'LABORATORY RESEARCH THRUSTS',
      fa: 'محورهای پژوهشی آزمایشگاه',
    },
    title: {
      en: 'Research Modules & Focus Areas',
      fa: 'ماژول‌های پژوهشی و حوزه‌های تمرکز',
    },
    subtitle: {
      en: 'Explorations in multiaxial fatigue, brain tissue dynamics, 3D energy-absorbing metamaterials, and cementitious fracture mechanics.',
      fa: 'پژوهش‌ها در زمینه‌های خستگی چندمحوره، دینامیک بافت مغز، متامتریال‌های سه‌بعدی جاذب انرژی و مکانیک شکست مواد سیمانی.',
    },
    searchPlaceholder: {
      en: 'Filter research modules or search keywords...',
      fa: 'فیلتر ماژول‌ها یا جستجوی کلمات کلیدی...',
    },
    tagsAll: {
      en: 'All',
      fa: 'همه',
    },
    copyCitation: {
      en: 'Copy Module Link',
      fa: 'کپی پیوند ماژول',
    },
    playVideo: {
      en: 'Watch Video Tutorial',
      fa: 'مشاهده آموزش ویدیویی',
    },
    downloadTutorial: {
      en: 'Download MP4 Tutorial',
      fa: 'دانلود فایل آموزش MP4',
    },
  },

  // Laboratory News Section
  news: {
    badge: {
      en: 'RESEARCH DEVELOPMENTS & PREPRINTS',
      fa: 'تازه‌های پژوهش و دستاوردهای علمی',
    },
    title: {
      en: 'Laboratory News',
      fa: 'اخبار آزمایشگاه',
    },
    subtitle: {
      en: 'Latest developments, breakthrough preprints, and experimental findings in fracture mechanics, cellular metamaterials, and dynamic impact mitigation.',
      fa: 'تازه‌ترین دستاوردها، مقالات پیش‌چاپ و یافته‌های تجربی در مکانیک شکست، متامتریال‌های سلولی و کاهش اثر ضربه‌های دینامیکی.',
    },
    filterAll: {
      en: 'All Topics',
      fa: 'همه موضوعات',
    },
    filterFracture: {
      en: 'Fracture Mechanics',
      fa: 'مکانیک شکست',
    },
    filterMetamaterials: {
      en: 'Metamaterials',
      fa: 'متامتریال‌ها',
    },
    filterFatigue: {
      en: 'Multiaxial Fatigue & FEA',
      fa: 'خستگی چندمحوره و اجزای محدود',
    },
    filterBiomechanics: {
      en: 'Biomechanics',
      fa: 'بیومکانیک',
    },
    searchPlaceholder: {
      en: 'Filter developments by keyword, author, or method...',
      fa: 'جستجو در اخبار با کلمه کلیدی، نویسنده یا روش...',
    },
    fetchLatestBtn: {
      en: 'Fetch Latest Updates',
      fa: 'دریافت تازه‌ترین اخبار',
    },
    fetching: {
      en: 'Updating Feed...',
      fa: 'در حال به‌روزرسانی...',
    },
    feedUpdated: {
      en: 'Feed Synchronized',
      fa: 'اطلاعات همگام‌سازی شد',
    },
    readAbstract: {
      en: 'Read Abstract & Findings',
      fa: 'مشاهده چکیده و یافته‌ها',
    },
    viewArticle: {
      en: 'Access Article / DOI',
      fa: 'مشاهده مقاله در مرجع / DOI',
    },
    copyDoi: {
      en: 'Copy DOI',
      fa: 'کپی DOI',
    },
    copyCitation: {
      en: 'Copy Citation',
      fa: 'کپی استناد',
    },
    keyFindingsTitle: {
      en: 'Key Experimental & Theoretical Findings',
      fa: 'یافته‌های کلیدی آزمایشگاهی و نظری',
    },
    methodologyTitle: {
      en: 'Instrumentation & Numerical Methodology',
      fa: 'تجهیزات آزمایشگاهی و روش‌شناسی عددی',
    },
    itemsCount: {
      en: 'research articles published',
      fa: 'مقاله پژوهشی ثبت‌شده',
    },
    noResultsTitle: {
      en: 'No news articles found',
      fa: 'مقاله‌ای یافت نشد',
    },
    noResultsDesc: {
      en: 'Try clearing the search query or selecting a different research category.',
      fa: 'جستجوی دیگری انجام دهید یا دسته پژوهشی متفاوتی را انتخاب کنید.',
    },
    resetFilters: {
      en: 'Reset Filters',
      fa: 'بازنشانی فیلترها',
    },
    pinnedBadge: {
      en: 'Featured Advance',
      fa: 'دستاورد برجسته',
    },
  },

  // Gmail & Laboratory Mail Hub
  gmail: {
    badge: {
      en: 'GOOGLE WORKSPACE & GMAIL INTEGRATION',
      fa: 'یکپارچه‌سازی جیمیل و محیط کاری گوگل',
    },
    title: {
      en: 'Laboratory Gmail Hub',
      fa: 'مرکز مکاتبات جیمیل آزمایشگاه',
    },
    subtitle: {
      en: 'Read, search, and send academic research correspondence and laboratory inquiries directly via your authenticated Google account.',
      fa: 'مشاهده، جستجو و ارسال نامه‌های پژوهشی و مکاتبات دانشگاهی از طریق حساب کاربری تأییدشده گوگل.',
    },
    signInWithGoogle: {
      en: 'Sign in with Google',
      fa: 'ورود با حساب گوگل',
    },
    signOut: {
      en: 'Sign Out',
      fa: 'خروج از حساب',
    },
    connectedAs: {
      en: 'Connected as',
      fa: 'متصل با حساب',
    },
    notConnectedTitle: {
      en: 'Connect Your Google Account',
      fa: 'اتصال به حساب کاربری گوگل',
    },
    notConnectedDesc: {
      en: 'Sign in with Google to read your research correspondence, send inquiries with official templates, and securely log sent drafts to your Firestore database.',
      fa: 'برای دسترسی به نامه‌های پژوهشی، ارسال پیام با الگوهای آماده آزمایشگاه و ثبت امن رونوشت‌ها در پایگاه داده فایربیس، وارد حساب گوگل خود شوید.',
    },
    inboxTab: {
      en: 'Inbox Messages',
      fa: 'صندوق نامه‌ها',
    },
    composeTab: {
      en: 'Compose Email',
      fa: 'نگارش نامه جدید',
    },
    historyTab: {
      en: 'Firestore Log',
      fa: 'تاریخچه فایربیس',
    },
    refreshInbox: {
      en: 'Refresh Messages',
      fa: 'به‌روزرسانی نامه‌ها',
    },
    loadingMessages: {
      en: 'Loading Gmail messages...',
      fa: 'در حال بارگذاری نامه‌های جیمیل...',
    },
    noMessages: {
      en: 'No messages found in your Gmail inbox.',
      fa: 'هیچ نامه‌ای در صندوق ورودی جیمیل یافت نشد.',
    },
    searchPlaceholder: {
      en: 'Search messages by subject, sender, or keyword...',
      fa: 'جستجوی نامه‌ها با موضوع، فرستنده یا کلمه کلیدی...',
    },
    toField: {
      en: 'To (Recipient Email)',
      fa: 'گیرنده (نشانی رایانامه)',
    },
    subjectField: {
      en: 'Subject',
      fa: 'موضوع نامه',
    },
    bodyField: {
      en: 'Message Content',
      fa: 'متن نامه',
    },
    sendBtn: {
      en: 'Send Email via Gmail',
      fa: 'ارسال با حساب جیمیل',
    },
    sending: {
      en: 'Sending message...',
      fa: 'در حال ارسال نامه...',
    },
    templatesTitle: {
      en: 'Academic Templates',
      fa: 'الگوهای نگارش دانشگاهی',
    },
    useTemplate: {
      en: 'Use Template',
      fa: 'استفاده از الگو',
    },
    savedToFirestore: {
      en: 'Synced to Firestore',
      fa: 'همگام در فایربیس',
    },
    sentSuccess: {
      en: 'Email dispatched successfully via Gmail REST API!',
      fa: 'نامه با موفقیت از طریق رابط جیمیل ارسال شد!',
    },
  },

  // Footer
  footer: {
    labTitle: {
      en: 'SWID-SHRK / RKV MATERIALS',
      fa: 'آزمایشگاه SWID-SHRK / مواد RKV',
    },
    affiliation: {
      en: 'Mechanical & Aerospace Research Laboratory · University of Maryland, Baltimore County',
      fa: 'آزمایشگاه تحقیقاتی مکانیک و هوافضا · دانشگاه مریلند، بالتیمور کانتی (UMBC)',
    },
    secureSystem: {
      en: 'System Secure. Encrypted HTTPS Transmission.',
      fa: 'سامانه ایمن. تبادل رمزنگاری‌شده بر بستر HTTPS.',
    },
    researchChannels: {
      en: 'Research Channels',
      fa: 'درگاه‌های علمی و پژوهشی',
    },
    rights: {
      en: 'Mechanical & Aerospace Research Lab. All rights reserved.',
      fa: 'آزمایشگاه تحقیقاتی مکانیک و هوافضا SWID-SHRK. کلیه حقوق محفوظ است.',
    },
  },
} as const;
