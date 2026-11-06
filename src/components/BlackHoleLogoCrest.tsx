import React, { useState, useEffect } from 'react';
import { TabKey, CelestialBodyKey } from '../types';
import { CELESTIAL_ORDER } from '../utils/celestialBodies';
import { useCelestial } from '../context/CelestialContext';
import { CelestialPlanetView } from './CelestialPlanetView';
import logoTransparent from '../assets/logo_transparent.png';
import logoFallback from '../assets/logo.jpg';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Layers,
  Atom,
} from 'lucide-react';

interface BlackHoleLogoCrestProps {
  className?: string;
  externalGenesisKey?: number;
  onMaterializingChange?: (materializing: boolean) => void;
  showEmbeddedChip?: boolean;
  onSelectTab?: (tab: TabKey) => void;
}

export const BlackHoleLogoCrest: React.FC<BlackHoleLogoCrestProps> = ({
  className = '',
  externalGenesisKey,
  onMaterializingChange,
  onSelectTab,
}) => {
  const {
    activeBodyKey,
    activeInfo,
    isTransitioning,
    flareActive,
    notification,
    genesisCount,
    setCelestialBody,
    advanceToNextBody,
    stepToPrevBody,
    triggerSingularityGenesis,
    handleEarthClick,
    executeCapability,
  } = useCelestial();

  const [isHovered, setIsHovered] = useState(false);
  const [isMaterializing, setIsMaterializing] = useState(true);

  // Sync external genesis trigger
  useEffect(() => {
    if (externalGenesisKey !== undefined && externalGenesisKey > 0) {
      triggerSingularityGenesis();
    }
  }, [externalGenesisKey, triggerSingularityGenesis]);

  // Trigger initial black hole emergence sequence
  useEffect(() => {
    if (activeBodyKey === 'blackhole') {
      setIsMaterializing(true);
      onMaterializingChange?.(true);
      const timer = setTimeout(() => {
        setIsMaterializing(false);
        onMaterializingChange?.(false);
      }, 3400);
      return () => clearTimeout(timer);
    } else {
      setIsMaterializing(false);
      onMaterializingChange?.(false);
    }
  }, [genesisCount, activeBodyKey, onMaterializingChange]);

  /**
   * Primary click on the central sphere / emblem:
   * - When Black Hole is active: transforms into the Sun and begins the Solar System tour.
   * - When Earth is active: programmatically triggers handleSelectTab('analyzer') and opens that view in a new browser tab.
   * - When other planets are active: executes that planet's specific engineering capability.
   */
  const handleCentralSphereClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (activeBodyKey === 'blackhole') {
      advanceToNextBody();
    } else if (activeBodyKey === 'earth') {
      // Programmatically triggers handleSelectTab('analyzer') and opens that view in a new browser tab
      handleEarthClick(onSelectTab);
    } else {
      executeCapability(onSelectTab);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Toast Notification Banner from State Management */}
      {notification && (
        <div className="absolute -top-12 z-50 pointer-events-none px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide dark:bg-black/95 bg-slate-900/95 text-[#00ff41] border border-[#00ff41]/50 shadow-[0_0_20px_rgba(0,255,65,0.4)] animate-in fade-in slide-in-from-top-2 duration-300">
          {notification}
        </div>
      )}

      {/* Outer Viewport-Safe Wrapper */}
      <div
        onClick={handleCentralSphereClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-8 cursor-pointer group"
        title={
          activeBodyKey === 'earth'
            ? 'Earth Active — Click Earth to open Paper Analyzer in a new tab!'
            : activeBodyKey === 'blackhole'
            ? 'Black Hole Singularity — Click to transform into the Sun and Solar System orbit!'
            : `${activeInfo.name} — Click to activate ${activeInfo.capability.title}`
        }
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCentralSphereClick(e as any);
          }
        }}
        aria-label={`${activeInfo.name} Celestial Body`}
      >
        {/* Central Celestial Sphere Anchor */}
        <div
          className={`relative w-[180px] xs:w-[210px] sm:w-[260px] md:w-[290px] aspect-square rounded-full flex items-center justify-center transition-all duration-500 ${
            isTransitioning ? 'scale-90 opacity-70 blur-sm' : 'scale-100 opacity-100'
          }`}
        >
          {/* ========================================================================= */}
          {/* CONDITIONAL RENDER: BLACK HOLE SINGULARITY OR SOLAR SYSTEM PLANET/STAR   */}
          {/* ========================================================================= */}

          {activeBodyKey === 'blackhole' ? (
            <>
              {/* 1. Outermost Gravitational Wave Pulses */}
              <div
                aria-hidden="true"
                className="hidden sm:block absolute -inset-10 sm:-inset-16 rounded-full pointer-events-none opacity-30 animate-[ping_6s_cubic-bezier(0,0,0.2,1)_infinite]"
                style={{
                  border: '1px solid rgba(255, 193, 7, 0.35)',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />
              <div
                aria-hidden="true"
                className="hidden sm:block absolute -inset-6 sm:-inset-10 rounded-full pointer-events-none opacity-40 animate-[ping_6s_cubic-bezier(0,0,0.2,1)_infinite_2s]"
                style={{
                  border: '1px solid rgba(245, 124, 0, 0.3)',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />

              {/* 2. Deep Relativistic Accretion Halo Glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-8 sm:-inset-14 rounded-full pointer-events-none opacity-60 blur-xl"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(255, 200, 70, 0.3) 0%, rgba(245, 124, 0, 0.2) 45%, rgba(216, 67, 21, 0.1) 65%, transparent 80%)',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />

              {/* 3. Upper Gravitational Lensing Arc */}
              <div
                aria-hidden="true"
                className={`absolute -top-7 xs:-top-9 sm:-top-12 md:-top-14 left-1/2 -translate-x-1/2 w-[120%] sm:w-[124%] h-[68%] rounded-t-full pointer-events-none transition-all duration-700 blur-[1px] ${
                  isHovered ? 'scale-105 opacity-100' : 'opacity-90'
                }`}
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 100%, transparent 60%, rgba(216, 67, 21, 0.4) 66%, rgba(255, 152, 0, 0.75) 74%, rgba(255, 224, 130, 0.95) 86%, rgba(255, 255, 255, 0.98) 92%, rgba(255, 179, 0, 0.6) 96%, transparent 100%)',
                  filter: 'drop-shadow(0 -4px 16px rgba(255, 180, 50, 0.8))',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />

              {/* Inner Upper Lensing Filament */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 xs:-top-5 sm:-top-7 md:-top-8 left-1/2 -translate-x-1/2 w-[108%] sm:w-[112%] h-[52%] rounded-t-full pointer-events-none blur-[0.5px] opacity-95"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 100%, transparent 68%, rgba(255, 215, 64, 0.85) 76%, rgba(255, 255, 255, 1) 88%, rgba(255, 183, 77, 0.8) 94%, transparent 100%)',
                  filter: 'drop-shadow(0 -2px 8px rgba(255, 240, 180, 0.8))',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />

              {/* 4. Lower Gravitational Lensing Arc */}
              <div
                aria-hidden="true"
                className={`absolute -bottom-7 xs:-bottom-9 sm:-bottom-12 md:-bottom-14 left-1/2 -translate-x-1/2 w-[120%] sm:w-[124%] h-[68%] rounded-b-full pointer-events-none transition-all duration-700 blur-[1px] ${
                  isHovered ? 'scale-105 opacity-100' : 'opacity-85'
                }`}
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(216, 67, 21, 0.35) 66%, rgba(255, 152, 0, 0.7) 74%, rgba(255, 224, 130, 0.9) 86%, rgba(255, 255, 255, 0.95) 92%, rgba(255, 179, 0, 0.5) 96%, transparent 100%)',
                  filter: 'drop-shadow(0 4px 16px rgba(255, 180, 50, 0.75))',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />

              {/* Inner Lower Lensing Filament */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3.5 xs:-bottom-5 sm:-bottom-7 md:-bottom-8 left-1/2 -translate-x-1/2 w-[108%] sm:w-[112%] h-[52%] rounded-b-full pointer-events-none blur-[0.5px] opacity-90"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, transparent 68%, rgba(255, 215, 64, 0.8) 76%, rgba(255, 255, 255, 0.95) 88%, rgba(255, 183, 77, 0.7) 94%, transparent 100%)',
                  filter: 'drop-shadow(0 2px 8px rgba(255, 240, 180, 0.75))',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />

              {/* Accretion Disk Midplane */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] sm:w-[172%] h-[40%] pointer-events-none z-10"
                style={{
                  transform: 'translate(-50%, -50%) rotate(-16deg)',
                }}
              >
                <div
                  className="w-full h-full rounded-[50%]"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 44%, rgba(216, 67, 21, 0.5) 52%, rgba(255, 152, 0, 0.9) 62%, rgba(255, 240, 180, 0.98) 72%, rgba(255, 215, 64, 0.85) 82%, transparent 92%)',
                    filter: 'drop-shadow(0 0 20px rgba(255, 170, 40, 0.95))',
                    transform: 'scaleY(0.40)',
                  }}
                />
              </div>

              {/* The Singularity Point Flare */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 z-25 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white transition-all duration-300 ${
                    isMaterializing ? 'scale-150' : 'scale-100'
                  }`}
                  style={{
                    animation: 'singularityPulse 2.8s infinite ease-in-out',
                  }}
                />
              </div>

              {/* SWID-SHRK Master Crest Logo inside Black Hole */}
              <div className="relative z-20 w-full h-full flex items-center justify-center p-2.5 sm:p-3.5 rounded-full overflow-hidden">
                <img
                  key={`crest-genesis-${genesisCount}`}
                  src={logoTransparent}
                  alt="SWID-SHRK Research Group Crest Logo"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = logoFallback;
                  }}
                  className={`w-full h-full object-contain select-none rounded-full [clip-path:circle(49%_at_50%_50%)] transition-all duration-500 filter ${
                    isMaterializing
                      ? 'animate-[crestAfterSwallow_3.4s_cubic-bezier(0.16,1,0.3,1)_forwards]'
                      : isHovered
                      ? 'scale-105 brightness-110 drop-shadow-[0_0_24px_rgba(255,210,90,0.95)]'
                      : 'scale-100 drop-shadow-[0_0_20px_rgba(255,190,60,0.85)]'
                  }`}
                />
              </div>
            </>
          ) : (
            /* ===================================================================== */
            /* SOLAR SYSTEM BODY: Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune */
            /* ===================================================================== */
            <>
              <CelestialPlanetView
                bodyKey={activeBodyKey}
                isHovered={isHovered}
                flareActive={flareActive}
              />

              {/* Solar Flare Shockwave Blast Ring Animation */}
              {flareActive && (
                <div className="absolute inset-0 rounded-full pointer-events-none animate-[solarFlareBlast_1.8s_ease-out_forwards]" />
              )}
            </>
          )}

          {/* Interactive Click Prompt Badge Floating on Top of Sphere */}
          <div
            className={`absolute -bottom-3 z-30 pointer-events-none transition-all duration-300 ${
              isHovered ? 'scale-105 -translate-y-1' : 'scale-95'
            }`}
          >
            {activeBodyKey === 'earth' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500 text-black border border-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.85)] animate-pulse">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Click Earth: Selects Analyzer &amp; Opens New Tab ↗</span>
              </div>
            ) : activeBodyKey === 'blackhole' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/90 text-black border border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.7)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Click Black Hole: Enter Solar Orbit ☉</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-black/80 dark:bg-zinc-900/90 text-[#00ff41] border border-[#00ff41]/50 shadow-[0_0_14px_rgba(0,255,65,0.4)]">
                <Atom className="w-3.5 h-3.5" />
                <span>Click Planet to Activate Capability</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SOLAR SYSTEM ORBIT STEPPER & TIMELINE BAR                                 */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-xl mx-auto mt-2 px-2 flex flex-col items-center gap-3">
        {/* Step Navigation Controls: Prev Planet | Orbit Strip | Next Planet */}
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-3 py-1 px-2 rounded-2xl bg-black/50 dark:bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md shadow-lg">
          {/* Previous Body Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              stepToPrevBody();
            }}
            className="flex-none p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors cursor-pointer"
            title="Step to previous celestial body"
            aria-label="Previous Celestial Body"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Orbit Timeline Rail: All 10 Celestial Bodies */}
          <div className="flex-1 flex items-center justify-around gap-1 overflow-x-auto no-scrollbar py-1">
            {CELESTIAL_ORDER.map((key) => {
              const isActive = key === activeBodyKey;
              return (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCelestialBody(key);
                  }}
                  className={`group relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 scale-110 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                  title={`${key} — Click to align orbit`}
                >
                  <span className="text-base sm:text-lg leading-none">
                    {key === 'blackhole'
                      ? '🕳️'
                      : key === 'sun'
                      ? '☉'
                      : key === 'mercury'
                      ? '☿'
                      : key === 'venus'
                      ? '♀'
                      : key === 'earth'
                      ? '♁'
                      : key === 'mars'
                      ? '♂'
                      : key === 'jupiter'
                      ? '♃'
                      : key === 'saturn'
                      ? '♄'
                      : key === 'uranus'
                      ? '♅'
                      : '♆'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-tighter opacity-80 uppercase mt-0.5">
                    {key === 'blackhole' ? 'Hole' : key.slice(0, 3)}
                  </span>

                  {/* Active Indicator Pip */}
                  {isActive && (
                    <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Body Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              advanceToNextBody();
            }}
            className="flex-none p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors cursor-pointer"
            title="Step to next celestial body"
            aria-label="Next Celestial Body"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PLANETARY CAPABILITY HUD CARD                                             */}
        {/* ========================================================================= */}
        <div className="w-full rounded-2xl bg-gradient-to-b from-black/80 via-zinc-950/90 to-black/80 border dark:border-zinc-800/90 border-slate-300 p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-3">
          {/* Header Row: Symbol, Name, Classification */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b dark:border-zinc-800 border-slate-200 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl leading-none">
                {activeInfo.astronomicalSymbol}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold font-orbitron tracking-wide text-white">
                    {activeInfo.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Orbit {activeInfo.orderIndex}/9
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  {activeInfo.classification}
                </p>
              </div>
            </div>

            {/* Orbit Navigation Shortcut */}
            <button
              onClick={advanceToNextBody}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors border border-zinc-700/60 cursor-pointer"
              title="Next planet in orbit"
            >
              <span>Next Planet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Astronomical Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
              <span className="block text-zinc-400 text-[10px] uppercase">Distance</span>
              <span className="font-semibold text-zinc-200 truncate block">
                {activeInfo.distanceFromSun}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
              <span className="block text-zinc-400 text-[10px] uppercase">Surface Temp</span>
              <span className="font-semibold text-zinc-200 truncate block">
                {activeInfo.surfaceTemp}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
              <span className="block text-zinc-400 text-[10px] uppercase">Orbital Period</span>
              <span className="font-semibold text-zinc-200 truncate block">
                {activeInfo.orbitalPeriod}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
              <span className="block text-zinc-400 text-[10px] uppercase">Diameter</span>
              <span className="font-semibold text-zinc-200 truncate block">
                {activeInfo.diameter}
              </span>
            </div>
          </div>

          {/* Engineering Research Domain Linkage */}
          <div className="text-xs text-zinc-300 font-mono flex items-start gap-2 pt-1">
            <Layers className="w-4 h-4 text-[#00ff41] flex-none mt-0.5" />
            <div>
              <span className="text-zinc-400">Lab Research Domain: </span>
              <span className="text-white font-semibold">{activeInfo.labDomain}</span>
            </div>
          </div>

          {/* Capability Narrative & Action Trigger Button */}
          <div className="pt-2 border-t dark:border-zinc-800/90 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-zinc-300 font-mono leading-relaxed max-w-md">
              <span className="text-amber-300 font-bold block mb-0.5">
                ⚡ {activeInfo.capability.title}
              </span>
              <span>{activeInfo.capability.description}</span>
            </div>

            {/* Capability Trigger Button */}
            {activeBodyKey === 'earth' ? (
              /* EARTH: Programmatically triggers handleSelectTab('analyzer') AND opens that view in a new browser tab */
              <button
                onClick={() => handleEarthClick(onSelectTab)}
                className="flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 hover:to-sky-200 shadow-[0_0_22px_rgba(6,182,212,0.7)] hover:shadow-[0_0_30px_rgba(6,182,212,0.95)] transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                title="Selects Analyzer view and opens in a new browser tab"
              >
                <span>{activeInfo.capability.buttonText}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            ) : (
              /* OTHER BODIES: Execute Capability */
              <button
                onClick={() => executeCapability(onSelectTab)}
                className="flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-[#00ff41] hover:bg-[#10b981] shadow-[0_0_20px_rgba(0,255,65,0.45)] hover:shadow-[0_0_28px_rgba(0,255,65,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                title={`Execute ${activeInfo.capability.title}`}
              >
                <span>{activeInfo.capability.buttonText}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
