import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Activity,
  Cpu,
  Clock,
  Layers,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export interface ResearchBulletin {
  id: string;
  badge: string;
  badgeColor: string;
  category: string;
  title: string;
  summary: string;
  details: string;
  metrics: { label: string; value: string; highlight?: boolean }[];
  hardwareSpec?: string;
  timestamp: string;
}

const BULLETINS: ResearchBulletin[] = [
  {
    id: 'lce-polymers',
    badge: 'ACTIVE PROJECT',
    badgeColor: 'bg-red-600 text-white',
    category: 'SYNTHESIS & NEURAL INVERSE DESIGN',
    title: 'In development: advanced LCE polymers via neural-network algorithms & metamaterial lattice synthesis',
    summary: 'Generative inverse design of Liquid Crystal Elastomers (LCE) coupled with physics-informed neural networks (PINN) and nonlinear FEA.',
    details: 'This flagship laboratory initiative couples deep neural network surrogate models with Fortran UMAT subroutines in Abaqus to discover novel liquid crystal elastomer configurations. The algorithms invert traditional constitutive modeling, predicting exact mesogenic orientations required for targeted large-strain morphing and superior energy attenuation.',
    metrics: [
      { label: 'PINN Acceleration', value: '1,200x Faster', highlight: true },
      { label: 'Energy Dissipation', value: '+48.3%', highlight: true },
      { label: 'Strain Reversibility', value: '>99.2%' },
      { label: 'Current Phase', value: 'Experimental Validation' }
    ],
    hardwareSpec: 'Abaqus 2024 Explicit + PyTorch Surrogate + Split-Hopkinson Bar',
    timestamp: 'JUST NOW'
  },
  {
    id: 'antiprism-fea',
    badge: 'BREAKING SIMULATION',
    badgeColor: 'bg-amber-500 text-black',
    category: 'CRUSH DYNAMICS // ABAQUS 2024',
    title: '3D Re-entrant & Antiprism Metamaterials Achieve +42.6% Specific Energy Absorption',
    summary: 'Explicit dynamic crash tests confirm remarkable progressive collapse kinematics with zero catastrophic buckling.',
    details: 'Nonlinear dynamic crushing benchmarks simulated at strain rates exceeding 10^3 s⁻¹. The newly developed chiral antiprism lattice exhibits extraordinary multi-stage plateau stresses, effectively protecting payload compartments against hypervelocity impact loads.',
    metrics: [
      { label: 'SEA Benchmarked', value: '38.4 kJ/kg', highlight: true },
      { label: 'Peak Force Reduction', value: '-31.5%' },
      { label: 'Strain Rate Tested', value: '1.4 × 10³ s⁻¹' },
      { label: 'Cluster Job', value: 'JOB-ANTIPRISM-V2' }
    ],
    hardwareSpec: 'Cluster Node 04 // 64-Core AMD EPYC // Explicit Solver',
    timestamp: '14 MIN AGO'
  },
  {
    id: 'tbi-shielding',
    badge: 'CRITICAL AEROSPACE',
    badgeColor: 'bg-rose-600 text-white',
    category: 'BIOMECHANICS // IMPACT PROTECTION',
    title: 'Next-Gen Helmet Liners Mitigate Severe Astronaut & Pilot Traumatic Brain Injury (TBI)',
    summary: 'Viscoelastic parenchyma brain model demonstrates 34% drop in peak rotational shearing under severe angular impulse.',
    details: 'Employing hyperelastic and viscoelastic strain-rate-dependent brain tissue constitutive equations, our laboratory modeled oblique helmet strikes. The metamaterial liner channels shear stress into harmless rotational cell folding, shielding delicate cerebral cortex tissue.',
    metrics: [
      { label: 'Intracranial Peak Stress', value: '-34.2%', highlight: true },
      { label: 'HIC Criteria', value: 'PASSED (Exceeds Mil-Spec)', highlight: true },
      { label: 'Rotational Accel', value: '-41.0%' },
      { label: 'Impact Velocity', value: '8.8 m/s' }
    ],
    hardwareSpec: 'High-Resolution Human Head Finite Element Model (WHIM-V3)',
    timestamp: '1 HR AGO'
  },
  {
    id: 'bouligand-delam',
    badge: 'NEW PUBLICATION',
    badgeColor: 'bg-emerald-500 text-black',
    category: 'NATURE-INSPIRED COMPOSITES',
    title: 'Helicoidal Bouligand Architecture Suppresses Interlaminar Delamination Under Fatigue',
    summary: 'Bio-inspired biomimetic dactyl club architecture promotes 3D crack twisting and energy-dissipative micro-cracking.',
    details: 'Experimental fracture mechanics study investigating mantis shrimp inspired helicoidal layups. In-situ SEM imaging and cohesive zone modeling reveal that gradual pitch angle rotations force cracks into tortuous non-planar trajectories, doubling fatigue lifespan.',
    metrics: [
      { label: 'Crack Path Deviation', value: '45° Tortuous', highlight: true },
      { label: 'Critical J-Integral', value: '+65.8%', highlight: true },
      { label: 'Fatigue Cycles', value: '>100k Sustained' },
      { label: 'Status', value: 'Under Review' }
    ],
    hardwareSpec: 'Instron ElectroPuls E10000 + Custom In-Situ DIC Camera',
    timestamp: 'TODAY'
  },
  {
    id: 'vumat-cluster',
    badge: 'LAB DISPATCH',
    badgeColor: 'bg-cyan-500 text-black',
    category: 'COMPUTATIONAL MECHANICS',
    title: 'Custom Fortran VUMAT Subroutines Integrated for Multi-Scale Dynamic Plasticity',
    summary: 'High-performance tensor integration code deployed across SWID-SHRK cluster nodes for millisecond shock front analysis.',
    details: 'Our team optimized explicit vectorized user material subroutines (VUMAT) to incorporate dynamic thermal softening and strain gradient plasticity effects, decreasing computational execution times by 4.2x without precision loss.',
    metrics: [
      { label: 'Solver Speedup', value: '4.2x Faster', highlight: true },
      { label: 'Mesh Elements', value: '2.8 Million' },
      { label: 'Precision Level', value: 'Double Precision (DP)' },
      { label: 'VUMAT Version', value: 'v2026.4.1' }
    ],
    hardwareSpec: 'OpenMP Vectorized Fortran 90 // Intel OneAPI MKL',
    timestamp: 'ACTIVE'
  }
];

export const ProjectBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeModalBulletin, setActiveModalBulletin] = useState<ResearchBulletin>(BULLETINS[0]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [utcTime, setUtcTime] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle sci-fi teletype blip when news item changes if audio enabled
  const playChyronSound = (type: 'beep' | 'alert') => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.setValueAtTime(780, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      }
    } catch {
      // Audio not permitted or failed
    }
  };

  // Live simulation / UTC clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bulletin automatic rotation with progress bar
  useEffect(() => {
    if (isPaused || isOpen) return;
    const intervalTime = 6500;
    const stepTime = 100;
    const increment = (stepTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => {
            const next = (curr + 1) % BULLETINS.length;
            playChyronSound('beep');
            return next;
          });
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [isPaused, isOpen, audioEnabled]);

  const goToNext = () => {
    setCurrentIndex((curr) => (curr + 1) % BULLETINS.length);
    setProgress(0);
    playChyronSound('beep');
  };

  const goToPrev = () => {
    setCurrentIndex((curr) => (curr - 1 + BULLETINS.length) % BULLETINS.length);
    setProgress(0);
    playChyronSound('beep');
  };

  const handleOpenModal = (bulletin: ResearchBulletin) => {
    setActiveModalBulletin(bulletin);
    setIsOpen(true);
    playChyronSound('alert');
  };

  const currentItem = BULLETINS[currentIndex];

  // Concatenate bulletins for continuous bottom crawler
  const tickerString = BULLETINS.map(
    (b) => `[${b.badge}] ${b.title.toUpperCase()} // ${b.metrics[0].label}: ${b.metrics[0].value}`
  ).join('   ✦✦   ');

  return (
    <>
      {/* ======================================================== */}
      {/* TV NEWS CHYRON / BREAKING RESEARCH TICKER (FOX/CNN STYLE) */}
      {/* ======================================================== */}
      <aside
        aria-label="Breaking Lab Research & Active Projects Broadcast Ticker"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative z-40 w-full bg-[#070b12] text-white border-b-2 border-red-600 shadow-[0_8px_30px_rgba(220,38,38,0.25)] select-none overflow-hidden font-mono"
      >
        {/* Top Warning Hazard Accent Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-amber-400 to-cyan-400" />

        {/* Specular Light Sheen Animation across chyron */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-news-sheen z-20"
        />

        {/* ================= MAIN CHYRON BAR ================= */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between min-h-[46px] border-b border-zinc-800/80">
          {/* Left Block: Breaking News / Active Project Anchor Badge */}
          <div className="flex items-center flex-none">
            {/* Pulsing Live Alert Tab */}
            <div className="relative flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white font-extrabold tracking-widest text-xs uppercase shadow-lg clip-chyron-badge z-10 border-r border-red-500">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="hidden sm:inline-block">LIVE LAB</span>
              <span>DISPATCH</span>
              <Radio className="w-3.5 h-3.5 text-yellow-300 animate-pulse hidden md:inline-block" />
            </div>

            {/* Sub-label: Active Project / Lab Alert Category */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#0d141e] text-zinc-300 text-[11px] font-bold border-r border-zinc-800 tracking-wider">
              <span className="text-yellow-400 font-extrabold">CH-01</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300 uppercase truncate max-w-[130px]">{currentItem.badge}</span>
            </div>
          </div>

          {/* Middle: Active Research Bulletin Flash */}
          <div className="flex-1 flex items-center px-3 sm:px-4 py-1.5 min-w-0 bg-[#090d16] hover:bg-[#0c121e] transition-colors relative">
            <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-2">
              {/* Category & Title */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-400 bg-amber-950/80 border border-amber-600/40 px-2 py-0.5 rounded uppercase flex-none">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {currentItem.category}
                </span>

                <button
                  onClick={() => handleOpenModal(currentItem)}
                  className="text-left font-bold text-xs sm:text-sm text-zinc-100 hover:text-cyan-300 transition-colors truncate flex items-center gap-1.5 cursor-pointer group"
                  title="Click to view detailed laboratory report"
                >
                  <span className="text-red-500 font-bold">&gt;&gt;</span>
                  <span className="tracking-wide text-white group-hover:underline">
                    {currentItem.title}
                  </span>
                </button>
              </div>

              {/* Key Metric Snapshot */}
              {currentItem.metrics[0] && (
                <div className="hidden xl:flex items-center gap-2 flex-none px-2.5 py-0.5 bg-black/50 border border-zinc-800 rounded text-[11px]">
                  <span className="text-zinc-400">{currentItem.metrics[0].label}:</span>
                  <span className="text-[#00ff41] font-bold">{currentItem.metrics[0].value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Telemetry Clock, Audio Toggle, Arrows, Details Button */}
          <div className="flex items-center justify-between lg:justify-end gap-1.5 px-3 py-1 bg-[#0a0f18] border-t lg:border-t-0 lg:border-l border-zinc-800 flex-none text-xs">
            {/* Live UTC Clock */}
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px] pr-2 border-r border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-zinc-200">{utcTime || 'UTC --:--:--'}</span>
            </div>

            {/* Audio Toggle (Fox/CNN broadcast teletype) */}
            <button
              onClick={() => {
                const next = !audioEnabled;
                setAudioEnabled(next);
                if (next) playChyronSound('beep');
              }}
              className={`p-1.5 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer ${
                audioEnabled ? 'bg-red-950/80 text-yellow-300 border border-red-700/60' : 'hover:bg-zinc-800'
              }`}
              title={audioEnabled ? 'Audio FX Enabled (Click to Mute)' : 'Enable Broadcast Audio Blips'}
              aria-label={audioEnabled ? 'Mute broadcast sound effects' : 'Enable broadcast sound effects'}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Pause / Play */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isPaused ? 'Resume Ticker Rotation' : 'Pause Ticker Rotation'}
              aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Previous Bulletin */}
            <button
              onClick={goToPrev}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Previous alert"
              title="Previous alert"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Counter */}
            <span className="text-[11px] text-zinc-400 font-bold px-1">
              {currentIndex + 1}/{BULLETINS.length}
            </span>

            {/* Next Bulletin */}
            <button
              onClick={goToNext}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Next alert"
              title="Next alert"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* High-Voltage DETAILS / INTEL Action Button */}
            <button
              onClick={() => handleOpenModal(currentItem)}
              className="ml-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-[11px] uppercase tracking-wider rounded transition-all duration-150 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-pointer flex items-center gap-1"
            >
              <span>INTEL</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar of Current Bulletin Timer */}
        <div className="w-full h-[2px] bg-zinc-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-[#00ff41] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ================= SECONDARY CRAWLER TAPE (TV NEWS LOWER-THIRD STREAM) ================= */}
        <div className="flex items-center bg-[#05080f] border-t border-zinc-900 py-1 text-[11px] text-zinc-300 overflow-hidden relative">
          {/* Ticker Tag Box */}
          <div className="flex-none px-2.5 py-0.5 bg-zinc-900 text-yellow-400 font-bold uppercase text-[10px] tracking-widest border-r border-zinc-800 z-10 flex items-center gap-1.5 shadow-md">
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="hidden sm:inline">LIVE WIRE</span>
          </div>

          {/* Marquee Content */}
          <div className="overflow-hidden whitespace-nowrap flex-1 flex">
            <div className="animate-ticker-marquee flex items-center gap-10 text-zinc-300 font-mono text-[11px]">
              <span>{tickerString}</span>
              <span>✦✦</span>
              <span>{tickerString}</span>
            </div>
          </div>

          {/* Right Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-0.5 bg-zinc-950 text-zinc-400 text-[10px] uppercase font-bold border-l border-zinc-800 z-10 flex-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-ping" />
            <span>FEA CLUSTER: 100% ONLINE</span>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* DETAILED PROJECT INTEL & RESEARCH DISPATCH MODAL */}
      {/* ======================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#080d14] border-2 border-red-600/70 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.35)] overflow-hidden text-left font-mono transition-all"
          >
            {/* Modal Header Bar with TV News Banner styling */}
            <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-900 text-white px-5 py-3 flex items-center justify-between border-b border-red-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black/60 text-yellow-300 font-black text-xs uppercase tracking-widest rounded">
                  {activeModalBulletin.badge}
                </span>
                <span className="text-xs uppercase tracking-wider text-red-100 font-bold hidden sm:inline">
                  // {activeModalBulletin.category}
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-yellow-300 p-1 rounded-lg hover:bg-black/30 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-zinc-200">
              {/* Title & Badge */}
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  CONFIDENTIAL LAB DISPATCH • TIMESTAMP: {activeModalBulletin.timestamp}
                </div>
                <h3 className="font-section-title text-xl sm:text-2xl text-white font-extrabold uppercase tracking-wide leading-tight">
                  {activeModalBulletin.title}
                </h3>
              </div>

              {/* Summary Lead */}
              <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r text-sm text-zinc-100 leading-relaxed font-sans font-medium">
                {activeModalBulletin.summary}
              </div>

              {/* Technical Description */}
              <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Technical Scope & Physics Formulation
                </h4>
                <p>{activeModalBulletin.details}</p>
              </div>

              {/* Engineering Metrics Grid */}
              <div>
                <h4 className="text-xs font-bold text-[#00ff41] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Key Benchmark Metrics & Experimental Verification
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeModalBulletin.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        m.highlight
                          ? 'bg-red-950/30 border-red-600/50 text-white'
                          : 'bg-[#04070c] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1 truncate">
                        {m.label}
                      </div>
                      <div className={`text-base font-extrabold ${m.highlight ? 'text-yellow-300' : 'text-white'}`}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware & Cluster Environment */}
              {activeModalBulletin.hardwareSpec && (
                <div className="p-3 bg-[#03060a] border border-zinc-800 rounded-lg flex items-center gap-3 text-xs text-zinc-400">
                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-bold uppercase text-[10px]">
                    SIMULATION RUNTIME
                  </span>
                  <span className="text-zinc-200 font-mono truncate">{activeModalBulletin.hardwareSpec}</span>
                </div>
              )}

              {/* Quick Navigation between all bulletins */}
              <div className="pt-2 border-t border-zinc-800">
                <div className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider mb-2">
                  Browse Other Active Dispatches:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BULLETINS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setActiveModalBulletin(b)}
                      className={`text-left p-2.5 rounded border text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        activeModalBulletin.id === b.id
                          ? 'bg-red-950/40 border-red-500 text-yellow-300'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span className="truncate font-bold">{b.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-zinc-300 flex-none">
                        {b.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#05080e] border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span>SWID-SHRK Aerospace & Mechanics Laboratory • Live Feed</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded transition-colors cursor-pointer"
                >
                  Close Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
