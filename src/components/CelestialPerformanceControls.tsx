import React, { useState } from 'react';
import { useCelestial } from '../context/CelestialContext';
import {
  Sliders,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  CircleDot,
  Gauge,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface CelestialPerformanceControlsProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const CelestialPerformanceControls: React.FC<CelestialPerformanceControlsProps> = ({
  className = '',
  defaultExpanded = false,
}) => {
  const {
    orbitTrailsVisible,
    fadingTrailsVisible,
    moonsVisible,
    starfieldVisible,
    lensingVisible,
    graphicsMode,
    orbitAnimationSpeed,
    trailLengthMultiplier,
    focusedOrbitOnly,
    toggleOrbitTrails,
    setOrbitTrailsVisible,
    toggleFadingTrails,
    setFadingTrailsVisible,
    toggleMoons,
    setMoonsVisible,
    toggleStarfield,
    setStarfieldVisible,
    toggleLensing,
    setLensingVisible,
    setGraphicsMode,
    setOrbitAnimationSpeed,
    setTrailLengthMultiplier,
    toggleFocusedOrbitOnly,
  } = useCelestial();

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Count active graphics features (0 to 5)
  const activeCount =
    (orbitTrailsVisible ? 1 : 0) +
    (fadingTrailsVisible ? 1 : 0) +
    (moonsVisible ? 1 : 0) +
    (starfieldVisible ? 1 : 0) +
    (lensingVisible ? 1 : 0);

  const isUltra = activeCount >= 4;

  return (
    <div
      className={`relative z-30 select-none font-mono transition-all duration-300 ${className}`}
      aria-label="Celestial Graphics & Performance Controls"
    >
      {/* ========================================================================= */}
      {/* 1. DOCKED COMPACT LAUNCHER (Far Left / Right Viewport Bar)               */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 shadow-2xl backdrop-blur-xl bg-black/85 dark:bg-zinc-950/90 border border-zinc-700/80 hover:border-[#00ff41]/60 rounded-full px-2.5 sm:px-3 py-1.5 transition-all duration-200">
        {/* Master Performance Mode Pill / Toggle */}
        <button
          onClick={() => {
            if (activeCount === 0) {
              setGraphicsMode('high');
            } else if (graphicsMode === 'high' && activeCount === 5) {
              setGraphicsMode('eco');
            } else {
              setGraphicsMode(graphicsMode === 'high' ? 'eco' : 'high');
            }
          }}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
            isUltra
              ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50 shadow-[0_0_10px_rgba(0,255,65,0.4)]'
              : activeCount > 0
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }`}
          title="Toggle Master Graphics Mode (High / Eco)"
        >
          <Cpu className="w-3 h-3" />
          <span>{activeCount === 0 ? 'FX: OFF' : isUltra ? 'FX: HIGH' : `FX: ${activeCount}/5`}</span>
        </button>

        {/* Quick ON / OFF toggle indicators */}
        <div className="hidden sm:flex items-center gap-1 px-1 border-x border-zinc-800 text-[10px]">
          {/* Orbits */}
          <button
            onClick={toggleOrbitTrails}
            className={`p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer ${
              orbitTrailsVisible ? 'text-amber-400' : 'text-zinc-600'
            }`}
            title={`Planetary Orbits: ${orbitTrailsVisible ? 'ON' : 'OFF'}`}
          >
            <Eye className="w-3 h-3" />
          </button>

          {/* Fading Trails */}
          <button
            onClick={toggleFadingTrails}
            className={`p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer ${
              fadingTrailsVisible ? 'text-cyan-400' : 'text-zinc-600'
            }`}
            title={`Fading Motion Trails: ${fadingTrailsVisible ? 'ON' : 'OFF'}`}
          >
            <Sparkles className="w-3 h-3" />
          </button>

          {/* Moons */}
          <button
            onClick={toggleMoons}
            className={`p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer ${
              moonsVisible ? 'text-[#00ff41]' : 'text-zinc-600'
            }`}
            title={`Dynamic Moons: ${moonsVisible ? 'ON' : 'OFF'}`}
          >
            <CircleDot className="w-3 h-3" />
          </button>

          {/* Starfield */}
          <button
            onClick={toggleStarfield}
            className={`p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer ${
              starfieldVisible ? 'text-sky-300' : 'text-zinc-600'
            }`}
            title={`Starfield Canvas: ${starfieldVisible ? 'ON' : 'OFF'}`}
          >
            <Layers className="w-3 h-3" />
          </button>
        </div>

        {/* Expand / Collapse Control Drawer Button */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 cursor-pointer transition-colors"
          title={isExpanded ? 'Collapse Graphics Panel' : 'Expand Graphics & Performance Switches'}
          aria-expanded={isExpanded}
        >
          <Sliders className="w-2.5 h-2.5 text-[#00b8ff]" />
          <span className="hidden xs:inline">Controls</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. SLIDING CYBER CONTROL DECK (Comprehensive Switches & Sliders)         */}
      {/* ========================================================================= */}
      {isExpanded && (
        <div className="absolute top-12 left-0 w-[310px] sm:w-[360px] p-4 rounded-2xl bg-black/95 dark:bg-zinc-950/95 border border-zinc-700/90 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Deck Header: Title & Master Presets */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[#00ff41]" />
              <span className="text-xs font-bold font-orbitron tracking-wide text-white">
                GRAPHICS CONTROLS
              </span>
            </div>

            {/* Quick Bulk Presets */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setGraphicsMode('high')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                  isUltra
                    ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
                title="Enable all graphics features (Max visual fidelity)"
              >
                ULTRA
              </button>
              <button
                onClick={() => setGraphicsMode('eco')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                  activeCount === 0
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
                title="Disable heavy graphics features (Max FPS / Low Battery)"
              >
                ECO (60 FPS)
              </button>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
            Toggle features on or off to optimize rendering performance for your hardware.
          </p>

          {/* Individual Feature Switches List with clear ON/OFF state */}
          <div className="space-y-2 text-xs">
            {/* SWITCH 1: Planetary Orbits */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                  Planetary Orbit Paths
                </span>
                <span className="text-[10px] text-zinc-400 font-sans">
                  Persistent glowing Keplerian ellipses
                </span>
              </div>
              <button
                onClick={toggleOrbitTrails}
                className={`flex items-center justify-between w-16 px-1.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  orbitTrailsVisible
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                aria-pressed={orbitTrailsVisible}
              >
                <span className={orbitTrailsVisible ? 'font-bold pl-1' : 'opacity-0'}>ON</span>
                <span
                  className={`w-4 h-4 rounded-full transition-transform ${
                    orbitTrailsVisible ? 'bg-amber-400' : 'bg-zinc-600'
                  }`}
                />
                <span className={!orbitTrailsVisible ? 'font-bold pr-1' : 'opacity-0'}>OFF</span>
              </button>
            </div>

            {/* SWITCH 2: Fading Motion Trails */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Motion Wakes (Trails)
                </span>
                <span className="text-[10px] text-zinc-400 font-sans">
                  Fading SVG arcs trailing behind planets
                </span>
              </div>
              <button
                onClick={toggleFadingTrails}
                className={`flex items-center justify-between w-16 px-1.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  fadingTrailsVisible
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                aria-pressed={fadingTrailsVisible}
              >
                <span className={fadingTrailsVisible ? 'font-bold pl-1' : 'opacity-0'}>ON</span>
                <span
                  className={`w-4 h-4 rounded-full transition-transform ${
                    fadingTrailsVisible ? 'bg-cyan-400' : 'bg-zinc-600'
                  }`}
                />
                <span className={!fadingTrailsVisible ? 'font-bold pr-1' : 'opacity-0'}>OFF</span>
              </button>
            </div>

            {/* SWITCH 3: Orbiting Moons & Satellites */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                  <CircleDot className="w-3 h-3 text-[#00ff41]" />
                  Dynamic Moons
                </span>
                <span className="text-[10px] text-zinc-400 font-sans">
                  Revolving satellites (Luna, Phobos, Titan)
                </span>
              </div>
              <button
                onClick={toggleMoons}
                className={`flex items-center justify-between w-16 px-1.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  moonsVisible
                    ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.3)]'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                aria-pressed={moonsVisible}
              >
                <span className={moonsVisible ? 'font-bold pl-1' : 'opacity-0'}>ON</span>
                <span
                  className={`w-4 h-4 rounded-full transition-transform ${
                    moonsVisible ? 'bg-[#00ff41]' : 'bg-zinc-600'
                  }`}
                />
                <span className={!moonsVisible ? 'font-bold pr-1' : 'opacity-0'}>OFF</span>
              </button>
            </div>

            {/* SWITCH 4: Starfield Canvas Particle System */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-sky-400" />
                  Starfield Canvas
                </span>
                <span className="text-[10px] text-zinc-400 font-sans">
                  240+ twinkling stars &amp; shooting stars
                </span>
              </div>
              <button
                onClick={toggleStarfield}
                className={`flex items-center justify-between w-16 px-1.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  starfieldVisible
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                aria-pressed={starfieldVisible}
              >
                <span className={starfieldVisible ? 'font-bold pl-1' : 'opacity-0'}>ON</span>
                <span
                  className={`w-4 h-4 rounded-full transition-transform ${
                    starfieldVisible ? 'bg-sky-400' : 'bg-zinc-600'
                  }`}
                />
                <span className={!starfieldVisible ? 'font-bold pr-1' : 'opacity-0'}>OFF</span>
              </button>
            </div>

            {/* SWITCH 5: Gravitational Lensing Distortion Filter */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                  <span className="text-xs">🌀</span>
                  Gravitational Lensing
                </span>
                <span className="text-[10px] text-zinc-400 font-sans">
                  Relativistic spacetime distortion shader
                </span>
              </div>
              <button
                onClick={toggleLensing}
                className={`flex items-center justify-between w-16 px-1.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  lensingVisible
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                aria-pressed={lensingVisible}
              >
                <span className={lensingVisible ? 'font-bold pl-1' : 'opacity-0'}>ON</span>
                <span
                  className={`w-4 h-4 rounded-full transition-transform ${
                    lensingVisible ? 'bg-purple-400' : 'bg-zinc-600'
                  }`}
                />
                <span className={!lensingVisible ? 'font-bold pr-1' : 'opacity-0'}>OFF</span>
              </button>
            </div>
          </div>

          {/* Secondary Telemetry: Orbit Speed & Trail Tuning */}
          <div className="pt-2 border-t border-zinc-800/90 space-y-2">
            {/* Speed Selector */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Orbital Velocity:
              </span>
              <div className="flex items-center gap-1">
                {[0.5, 1.0, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrbitAnimationSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer border ${
                      orbitAnimationSpeed === s
                        ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Trail Length */}
            {fadingTrailsVisible && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Trail Arc Length:
                </span>
                <div className="flex items-center gap-1">
                  {[0.6, 1.0, 1.5, 2.0].map((len) => (
                    <button
                      key={len}
                      onClick={() => setTrailLengthMultiplier(len)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer border ${
                        trailLengthMultiplier === len
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {len}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Orbits Scope */}
            {orbitTrailsVisible && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Orbit Scope:</span>
                <button
                  onClick={toggleFocusedOrbitOnly}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer border ${
                    focusedOrbitOnly
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  {focusedOrbitOnly ? 'Active Body Only' : 'All 10 Solar Orbits'}
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-1 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
            <span>Docked: Far-Left Hero Deck</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
