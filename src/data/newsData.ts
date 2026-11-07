import { LabNewsItem } from '../types';

export const INITIAL_LAB_NEWS: LabNewsItem[] = [
  {
    id: 'news-01',
    title: 'High-Order Analytical Weight Function Formulations for Cracks in Functionally Graded Thermal Cylinders',
    titleFa: 'فرمولاسیون توابع وزن تحلیلی مرتبه بالا برای ترک‌ها در استوانه‌های دارای خواص متغیر حرارتی',
    category: 'fracture',
    authors: 'P. Hejazi Rekavandi, S. M. Nabavi, et al.',
    journal: 'Theoretical and Applied Fracture Mechanics',
    date: 'November 2026',
    doi: '10.1016/j.tafmec.2026.104821',
    url: 'https://doi.org/10.1016/j.tafmec.2026.104821',
    summary: 'A new analytical framework utilizing two-reference-state weight function expansions to calculate Mode-I and Mode-II stress intensity factors for internal circumferential surface cracks under extreme transient thermal shock.',
    summaryFa: 'چارچوب تحلیلی نوینی با استفاده از بسط توابع وزن دو حالته مبنا جهت محاسبه ضرایب شدت تنش مودهای ۱ و ۲ برای ترک‌های سطحی محیطی تحت شوک حرارتی گذرا.',
    keyFindings: [
      'Closed-form SIF solutions agreed within 1.6% of 3D non-linear Abaqus contour integral evaluations.',
      'Thermal gradient parameter beta significantly retards crack mouth opening displacement (CMOD) when gradient directs inward.',
      'Yielded universal normalized reference stress tables for hollow cylinders with radius ratios R_o/R_i from 1.1 to 2.5.'
    ],
    keyFindingsFa: [
      'همخوانی نتایج حل تحلیلی فرم بسته ضرایب شدت تنش با خطای کمتر از ۱.۶ درصد در مقایسه با انتگرال کانتور المان محدود آباکوس.',
      'پارامتر گرادیان حرارتی در صورت جهت‌گیری به سمت داخل، بازشدگی دهانه ترک (CMOD) را به طرز چشمگیری به تأخیر می‌اندازد.',
      'ارائه جداول تنش مرجع نرمال‌شده جهانی برای استوانه‌های توخالی با نسبت شعاعی ۱.۱ تا ۲.۵.'
    ],
    methodology: 'Coupled thermo-elastic analytical derivations; Abaqus/Standard contour integral validation using 20-node quadratic hexahedral elements (C3D20R).',
    methodologyFa: 'مشتقات تحلیلی ترموالاستیک جفت‌شده؛ اعتبارسنجی انتگرال کانتور در آباکوس استاندارد با المان‌های بیست‌گره‌ای مربعی هگزاهدرال (C3D20R).',
    readTime: '4 min read',
    isPinned: true,
    citationText: 'Rekavandi, P. H., & Nabavi, S. M. (2026). Analytical weight functions for circumferential cracks in functionally graded hollow cylinders. Theoretical and Applied Fracture Mechanics, 104821.'
  },
  {
    id: 'news-02',
    title: 'Dynamic Compression & Energy Absorption of 3D Strut-Based AntiPrism Cellular Metamaterials',
    titleFa: 'فشار دینامیکی و جذب انرژی در متامتریال‌های سلولی سه‌بعدی آنتی‌پریسم مهاربندی‌شده',
    category: 'metamaterials',
    authors: 'SWID-SHRK Research Lab & Advanced Materials Division',
    journal: 'Materials & Design',
    date: 'October 2026',
    doi: '10.1016/j.matdes.2026.113204',
    url: 'https://doi.org/10.1016/j.matdes.2026.113204',
    summary: 'Systematic characterization of energy absorption capacity, plateau stress consistency, and deformation kinematics in novel 3D AntiPrism lattice architectures fabricated via selective laser sintering.',
    summaryFa: 'مشخصه‌یابی سیستماتیک ظرفیت جذب انرژی، پایداری تنش فلات و سینماتیک تغییرشکل در ساختارهای شبکه‌ای نوین آنتی‌پریسم سه‌بعدی ساخته‌شده با تف‌جوشی انتخابی با لیزر.',
    keyFindings: [
      'Achieved specific energy absorption (SEA) exceeding 34.2 kJ/kg under drop-tower dynamic impact velocities up to 6.8 m/s.',
      'Demonstrated near-zero Poisson ratio during uniaxial crushing, effectively suppressing premature lateral catastrophic buckling.',
      'Crush force efficiency (CFE) reached 87%, setting a new benchmark for lightweight impact attenuators.'
    ],
    keyFindingsFa: [
      'دستیابی به جذب انرژی ویژه (SEA) فراتر از ۳۴.۲ کیلوژول بر کیلوگرم تحت ضربه دینامیکی برج سقوط تا سرعت ۶.۸ متر بر ثانیه.',
      'نمایش ضریب پواسون نزدیک به صفر در حین خردایش تک‌محوره، که کمانش فاجعه‌بار جانبی را خنثی می‌کند.',
      'رسیدن بازده نیروی خردایش (CFE) به ۸۷ درصد که معیاری برتر برای جاذب‌های ضربه سبک‌وزن است.'
    ],
    methodology: 'Instrumented drop-tower testing rig (45 kg drop mass, 2.8 m guided drop) synchronized with 10,000 fps Digital Image Correlation (DIC) and Abaqus/Explicit dynamic simulations.',
    methodologyFa: 'آزمون با برج سقوط ابزاردقیق (وزنه ۴۵ کیلوگرم، سقوط هدایت‌شده ۲.۸ متر) همگام با همبستگی تصویر دیجیتال (DIC) با سرعت ۱۰,۰۰۰ فریم بر ثانیه و شبیه‌سازی دینامیکی صریح در آباکوس.',
    readTime: '5 min read',
    isPinned: true,
    citationText: 'SWID-SHRK Aerospace Materials Consortium. (2026). Energy dissipation mechanisms in 3D AntiPrism cellular topologies under dynamic impact. Materials & Design, 113204.'
  },
  {
    id: 'news-03',
    title: 'Critical Plane Multiaxial Fatigue Life Estimation under Out-of-Phase Thermo-Mechanical Cycling',
    titleFa: 'تخمین عمر خستگی چندمحوره با رویکرد صفحه بحرانی تحت بارگذاری سیکلی غیرهم‌فاز ترمومکانیکی',
    category: 'fatigue',
    authors: 'P. Hejazi Rekavandi, Advanced Fatigue Consortium',
    journal: 'International Journal of Fatigue',
    date: 'September 2026',
    doi: '10.1016/j.ijfatigue.2026.107954',
    url: 'https://doi.org/10.1016/j.ijfatigue.2026.107954',
    summary: 'Implementation of modified Findley, Fatemi-Socie, and Smith-Watson-Topper criteria for aerospace alloys undergoing simultaneous torsional and axial cyclic strain with phase offsets of 90 degrees.',
    summaryFa: 'پیاده‌سازی معیارهای اصلاح‌شده فیندلی، فاطمی-سوسی و اسمیت-واتسون-تاپر برای آلیاژهای هوافضایی تحت کرنش سیکلی همزمان پیچشی و محوری با اختلاف فاز ۹۰ درجه.',
    keyFindings: [
      'Non-proportional hardening coefficient identified as the dominant factor reducing fatigue lifetime by 4.2x relative to proportional loading.',
      'Modified Findley plane formulation accurately predicted shear crack initiation planes within 4.5 degrees of SEM fractography observation.',
      'Developed automated Python post-processor extracting localized stress tensors from FEA history databases.'
    ],
    keyFindingsFa: [
      'شناسایی ضریب سخت‌شوندگی غیرتناسبی به عنوان عامل اصلی کاهش ۴.۲ برابری عمر خستگی نسبت به بارگذاری تناسبی.',
      'پیش‌بینی دقیق صفحات شروع ترک برشی توسط فرمولاسیون اصلاح‌شده صفحه فیندلی با خطای ۴.۵ درجه نسبت به تصاویر میکروسکوپ الکترونی SEM.',
      'توسعه پس‌پردازشگر پایتون خودکار جهت استخراج تانسورهای تنش موضعی از پایگاه داده تاریخچه اجزای محدود.'
    ],
    methodology: 'Biaxial servo-hydraulic fatigue testing machine (100 kN axial / 1000 N·m torsion) coupled with induction heating coil and infrared pyrometry.',
    methodologyFa: 'دستگاه آزمون خستگی دو‌محوره سرو-هیدرولیک (۱۰۰ کیلونیوتن محوری / ۱۰۰۰ نیوتن‌متر پیچشی) متصل به کویل گرمایش القایی و پیرومتری مادون قرمز.',
    readTime: '6 min read',
    isPinned: false,
    citationText: 'Rekavandi, P. H. (2026). Multiaxial fatigue damage accumulation under out-of-phase thermo-mechanical cycles. International Journal of Fatigue, 107954.'
  },
  {
    id: 'news-04',
    title: 'Nonlinear Viscoelastic Constitutive Modeling of Axonal Fiber Rupture in Dynamic Brain Parenchyma',
    titleFa: 'مدل‌سازی ساختاری ویسکوالاستیک غیرخطی پارگی الیاف آکسونی در پارانشیم مغز تحت بارهای دینامیکی',
    category: 'biomechanics',
    authors: 'SWID-SHRK Biomechanics Group, Elena Vance, P. Hejazi Rekavandi',
    journal: 'Journal of the Mechanical Behavior of Biomedical Materials',
    date: 'August 2026',
    doi: '10.1016/j.jmbbm.2026.106198',
    url: 'https://doi.org/10.1016/j.jmbbm.2026.106198',
    summary: 'A continuum mechanical formulation coupling hyperelastic Ogden strain energy functions with anisotropic damage tensors to predict traumatic brain injury (TBI) thresholds during angular acceleration shockwaves.',
    summaryFa: 'فرمولاسیون مکانیک محیط‌های پیوسته که توابع انرژی کرنش هایپرالاستیک اوگدن را با تانسورهای آسیب ناهمسانگرد جفت می‌کند تا آستانه‌های آسیب مغزی ناشی از امواج شوک شتاب زاویه‌ای را پیش‌بینی کند.',
    keyFindings: [
      'Demonstrated critical axonal stretch threshold lambda_crit = 1.14 beyond which microstructural membrane permeability increases irreversibly.',
      'High-rate shear modulus displays pronounced rate-sensitivity between strain rates of 10/s and 250/s.',
      'Implemented custom VUMAT user subroutine capable of million-element full-brain FEA simulation in under 12 compute hours.'
    ],
    keyFindingsFa: [
      'اثبات آستانه کشش بحرانی الیاف آکسونی به مقدار ۱.۱۴ که فراتر از آن نفوذپذیری غشای ریزساختار به طور برگشت‌ناپذیر افزایش می‌یابد.',
      'مدول برشی با نرخ بالا وابستگی شدیدی در بازه نرخ کرنش ۱۰ تا ۲۵۰ بر ثانیه نشان می‌دهد.',
      'پیاده‌سازی زیربرنامه سفارشی VUMAT در آباکوس با توانایی شبیه‌سازی کل مغز با یک میلیون المان در کمتر از ۱۲ ساعت محاسباتی.'
    ],
    methodology: 'High-frequency micro-indentation and oscillatory shear rheometry; user material subroutine VUMAT integrated in Abaqus/Explicit.',
    methodologyFa: 'میکروفروروندگی با فرکانس بالا و رئومتری برشی نوسانی؛ زیربرنامه سفارشی رفتار ماده VUMAT یکپارچه‌شده در آباکوس صریح.',
    readTime: '5 min read',
    isPinned: false,
    citationText: 'Vance, E., & Rekavandi, P. H. (2026). Anisotropic damage thresholds in cerebral parenchyma under angular impact. J. Mech. Behav. Biomed. Mater., 106198.'
  },
  {
    id: 'news-05',
    title: 'Physics-Informed Neural Network (PINN) Inverse Synthesis of Reconfigurable Liquid Crystal Elastomers',
    titleFa: 'سنتز معکوس شبکه‌های عصبی مبتنی بر فیزیک (PINN) برای الاستومرهای کریستال مایع بازپیکربندی‌پذیر',
    category: 'metamaterials',
    authors: 'Alireza Rostami, P. Hejazi Rekavandi, Marcus Sterling',
    journal: 'Advanced Functional Materials',
    date: 'July 2026',
    doi: '10.1002/adfm.202604918',
    url: 'https://doi.org/10.1002/adfm.202604918',
    summary: 'Inverse design framework using physics-informed neural network architectures to synthesize voxel-by-voxel nematic orientation fields in liquid crystal elastomer metamaterials that self-fold into target Gaussian geometries upon thermal activation.',
    summaryFa: 'چارچوب طراحی معکوس با شبکه‌های عصبی مبتنی بر فیزیک جهت سنتز میدان جهت‌گیری نماتیک وکسل‌به‌وکسل در متامتریال‌های الاستومر کریستال مایع با قابلیت تاشوندگی خودکار به هندسه‌های گاوسی هدف.',
    keyFindings: [
      'Accelerated inverse shape design by 420x over traditional gradient-based FEA optimization loops.',
      'Experimental 4D printed specimens demonstrated thermal actuation repeatability across 5,000 continuous thermal cycles.',
      'Successfully programmed dual-stable snap-through transitions for shock wave reflection and localized energy trapping.'
    ],
    keyFindingsFa: [
      'تسریع ۴۲۰ برابری طراحی معکوس شکل نسبت به چرخه‌های سنتی بهینه‌سازی مبتنی بر گرادیان المان محدود.',
      'نمونه‌های چاپ چهاربعدی تکرارپذیری عملگری حرارتی را در بیش از ۵,۰۰۰ سیکل مداوم حرارتی اثبات کردند.',
      'برنامه‌ریزی موفق گذارهای دوشبه‌جهشی پایدار جهت بازتاب امواج شوک و به دام انداختن موضعی انرژی.'
    ],
    methodology: 'PyTorch deep PINN architecture coupled with custom Abaqus UEL user element subroutines; multi-material stereolithography 4D printing.',
    methodologyFa: 'معماری شبکه عمیق PINN در پای‌تورچ متصل به زیربرنامه‌های المان سفارشی UEL در آباکوس؛ چاپ چهاربعدی با استریولیتوگرافی چندماده‌ای.',
    readTime: '6 min read',
    isPinned: false,
    citationText: 'Rostami, A., Rekavandi, P. H., & Sterling, M. (2026). Generative inverse design of reconfigurable liquid crystal elastomers. Adv. Funct. Mater., 2604918.'
  },
  {
    id: 'news-06',
    title: 'Subcritical Crack Propagation and Paris Law Formulation in Fiber-Toughened Geopolymer Matrix Composites',
    titleFa: 'رشد زیربحرانی ترک و فرمولاسیون قانون پاریس در کامپوزیت‌های ژئوپلیمری تقویت‌شده با الیاف',
    category: 'fracture',
    authors: 'S. M. Nabavi, P. Hejazi Rekavandi',
    journal: 'Engineering Fracture Mechanics',
    date: 'June 2026',
    doi: '10.1016/j.engfracmech.2026.109312',
    url: 'https://doi.org/10.1016/j.engfracmech.2026.109312',
    summary: 'Investigation of cyclic fatigue crack growth rate da/dN versus stress intensity range Delta K in sustainable alkali-activated aluminosilicate binder composites reinforced with high-modulus basalt fibers.',
    summaryFa: 'بررسی نرخ رشد ترک خستگی سیکلی da/dN در برابر دامنه ضریب شدت تنش Delta K در کامپوزیت‌های پایدار چسباننده آلومینوسیلیکات ژئوپلیمری تقویت‌شده با الیاف بازالت.',
    keyFindings: [
      'Derived Paris law parameters C = 2.18e-8 and m = 3.42 for ambient fatigue testing regimes.',
      'Fiber pull-out and frictional bridging in the crack wake provided 64% of total fracture energy dissipation.',
      'Environmental exposure to 5% saline solution showed zero degradation in fatigue threshold Delta K_th after 180 days immersion.'
    ],
    keyFindingsFa: [
      'استخراج ضرایب قانون پاریس به مقادیر C = 2.18e-8 و m = 3.42 برای رژیم‌های آزمون خستگی در دمای محیط.',
      'بیرون‌کشیدگی الیاف و پل‌زدگی اصطکاکی در امتداد رد ترک ۶۴ درصد از کل اتلاف انرژی شکست را تأمین کرد.',
      'قرارگیری محیطی در محلول نمکی ۵ درصد هیچ‌گونه افتی در آستانه خستگی Delta K_th پس از ۱۸۰ روز غوطه‌وری نشان نداد.'
    ],
    methodology: 'Closed-loop electrodynamic fatigue test frame (Instron ElectroPuls E10000) utilizing single-edge notched beam (SENB) specimens conforming to ASTM E399 & E647.',
    methodologyFa: 'دستگاه آزمون خستگی الکترودینامیکی حلقه بسته (Instron ElectroPuls E10000) با نمونه‌های تیر شکاف‌دار یک‌طرفه (SENB) مطابق استانداردهای ASTM E399 و E647.',
    readTime: '4 min read',
    isPinned: false,
    citationText: 'Nabavi, S. M., & Rekavandi, P. H. (2026). Fatigue crack growth kinetics in basalt-reinforced geopolymer composites. Engineering Fracture Mechanics, 109312.'
  }
];
