import React, { useState, useEffect } from 'react';
import logoTransparent from '../assets/logo_transparent.png';
import logoFallback from '../assets/logo.jpg';
import { Sparkles, RefreshCw } from 'lucide-react';

interface BlackHoleLogoCrestProps {
  className?: string;
  externalGenesisKey?: number;
  onMaterializingChange?: (materializing: boolean) => void;
  showEmbeddedChip?: boolean;
}

export const BlackHoleLogoCrest: React.FC<BlackHoleLogoCrestProps> = ({
  className = '',
  externalGenesisKey,
  onMaterializingChange,
  showEmbeddedChip = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMaterializing, setIsMaterializing] = useState(true);
  const [internalGenesisKey, setInternalGenesisKey] = useState(0);

  // Sync external genesis trigger
  useEffect(() => {
    if (externalGenesisKey !== undefined && externalGenesisKey > 0) {
      setInternalGenesisKey(externalGenesisKey);
    }
  }, [externalGenesisKey]);

  // Trigger star spaghettification & black hole swallowing sequence on initial mount or key change
  useEffect(() => {
    setIsMaterializing(true);
    onMaterializingChange?.(true);
    const timer = setTimeout(() => {
      setIsMaterializing(false);
      onMaterializingChange?.(false);
    }, 3400); // 3.4 seconds for complete star spaghettification & crest emergence
    return () => clearTimeout(timer);
  }, [internalGenesisKey, onMaterializingChange]);

  // Allows user to click and re-forge the logo from the black hole singularity
  const handleTriggerSingularity = () => {
    setInternalGenesisKey((prev) => prev + 1);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Outer Viewport-Safe Wrapper with internal padding to prevent any cropping of upper/lower lensing arcs */}
      <div
        onClick={handleTriggerSingularity}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center pt-8 sm:pt-10 pb-6 sm:pb-8 px-6 sm:px-12 cursor-pointer group"
        title="Black Hole Singularity Core — Click to re-forge crest from singularity"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTriggerSingularity();
          }
        }}
        aria-label="Black Hole Singularity — Click to re-synthesize emblem from singularity"
      >
        {/* Central Event Horizon Void Sphere (Reference Anchor) */}
        <div className="relative w-[170px] xs:w-[200px] sm:w-[250px] md:w-[280px] aspect-square rounded-full flex items-center justify-center">
          {/* 1. Outermost Gravitational Wave Pulses (Expanding Ripples in Spacetime) */}
          {/* 1. Outermost Gravitational Wave Pulses (Expanding Ripples in Spacetime - hidden on mobile) */}
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

          {/* 2. Deep Relativistic Accretion Halo Glow (Warm Amber & Molten Gold) */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 sm:-inset-14 rounded-full pointer-events-none opacity-60 blur-xl"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255, 200, 70, 0.3) 0%, rgba(245, 124, 0, 0.2) 45%, rgba(216, 67, 21, 0.1) 65%, transparent 80%)',
              transform: 'translate3d(0, 0, 0)',
            }}
          />

          {/* 3. Upper Gravitational Lensing Arc (Bending over the top of the Event Horizon) */}
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

          {/* Inner Razor-Bright Upper Lensing Filament */}
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

          {/* 4. Lower Gravitational Lensing Arc (Bending under the bottom of the Event Horizon) */}
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

          {/* 5. Tilted Equatorial Accretion Disk (Broad Relativistic Plane) */}
          <div
            aria-hidden="true"
            className={`absolute -inset-x-12 sm:-inset-x-20 -inset-y-3 sm:-inset-y-6 rounded-full pointer-events-none transition-transform duration-700 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            style={{
              transform: 'rotate(-16deg) scaleY(0.36) translate3d(0, 0, 0)',
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(255, 245, 200, 0.95) 48%, rgba(255, 215, 64, 0.9) 56%, rgba(255, 140, 20, 0.85) 66%, rgba(230, 81, 0, 0.75) 76%, rgba(183, 28, 28, 0.4) 86%, transparent 95%)',
              filter: 'drop-shadow(0 0 20px rgba(255, 190, 60, 0.8))',
            }}
          />

          {/* Striated Concentric Keplerian Gas Bands */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-10 sm:-inset-x-18 -inset-y-2.5 sm:-inset-y-5 rounded-full pointer-events-none opacity-85"
            style={{
              transform: 'rotate(-16deg) scaleY(0.36)',
              background:
                'repeating-radial-gradient(ellipse at center, transparent 0, transparent 6px, rgba(255, 255, 255, 0.35) 7px, rgba(255, 180, 50, 0.6) 9px, transparent 12px, rgba(245, 124, 0, 0.4) 14px, transparent 18px)',
            }}
          />

          {/* Rotating Relativistic Swirling Plasma Streamers */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-12 sm:-inset-x-20 -inset-y-3 sm:-inset-y-6 rounded-full pointer-events-none animate-[spin_24s_linear_infinite]"
            style={{
              transform: 'rotate(-16deg) scaleY(0.36)',
              background:
                'conic-gradient(from 30deg, transparent 0deg, rgba(255, 152, 0, 0.75) 60deg, rgba(255, 255, 255, 1) 120deg, rgba(255, 215, 64, 0.95) 170deg, rgba(230, 81, 0, 0.8) 220deg, transparent 270deg, rgba(255, 193, 7, 0.5) 320deg, transparent 360deg)',
              filter: 'blur(3px)',
              opacity: 0.9,
            }}
          />

          {/* Counter-Rotating Inner Ultra-Hot Gas Filament */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 sm:-inset-x-10 -inset-y-1.5 sm:-inset-y-3 rounded-full pointer-events-none animate-[spin_12s_linear_infinite_reverse]"
            style={{
              transform: 'rotate(-16deg) scaleY(0.38)',
              background:
                'conic-gradient(from 190deg, transparent 0deg, rgba(255, 183, 77, 0.85) 80deg, rgba(255, 255, 255, 1) 140deg, rgba(255, 215, 64, 0.95) 200deg, transparent 280deg)',
              filter: 'blur(2px)',
              opacity: 0.92,
            }}
          />

          {/* Doppler Relativistic Flare */}
          <div
            aria-hidden="true"
            className="absolute right-[2%] sm:right-[4%] top-[42%] w-20 sm:w-28 h-8 sm:h-12 rounded-full pointer-events-none blur-[4px] opacity-90"
            style={{
              transform: 'rotate(-16deg)',
              background:
                'radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(255, 230, 140, 0.9) 35%, rgba(255, 160, 20, 0.6) 65%, transparent 85%)',
              filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.95))',
            }}
          />

          {/* Orbiting Miller's Planet Silhouette */}
          <div
            aria-hidden="true"
            className="absolute left-[13%] xs:left-[15%] sm:left-[17%] top-[39%] w-3 xs:w-3.5 sm:w-4 aspect-square rounded-full bg-[#000000] z-20 pointer-events-none shadow-[-2px_-1px_6px_1px_rgba(255,225,130,0.9),0_0_8px_rgba(0,0,0,0.95)]"
            title="Orbiting Planet Silhouette"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                borderTop: '1px solid rgba(255, 245, 200, 0.95)',
                borderLeft: '1px solid rgba(255, 215, 64, 0.85)',
              }}
            />
          </div>

          {/* 6. Primary White-Hot Photon Sphere / Einstein Ring */}
          <div
            aria-hidden="true"
            className="absolute -inset-2 sm:-inset-3 rounded-full pointer-events-none z-10"
            style={{
              border: '1.5px solid rgba(255, 215, 64, 0.75)',
              boxShadow:
                '0 0 18px 5px rgba(255, 200, 70, 0.8), 0 0 40px 10px rgba(245, 124, 0, 0.6), inset 0 0 14px 4px rgba(255, 180, 50, 0.4)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -inset-1 sm:-inset-1.5 rounded-full pointer-events-none z-10 animate-pulse"
            style={{
              border: '2.5px solid #ffffff',
              boxShadow:
                '0 0 12px 3px rgba(255, 255, 255, 1), 0 0 24px 7px rgba(255, 215, 64, 0.95), 0 0 42px 12px rgba(245, 124, 0, 0.7), inset 0 0 16px 5px rgba(255, 235, 150, 0.7)',
            }}
          />

          {/* 7. The Event Horizon Void (Pitch-Black Cosmic Core Shadow Behind Logo) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#000000] z-0 pointer-events-none"
            style={{
              boxShadow:
                'inset 0 0 50px 20px rgba(0, 0, 0, 1), 0 0 35px 12px rgba(0, 0, 0, 0.98), 0 0 60px 20px rgba(255, 140, 20, 0.35)',
            }}
          />

          {/* 8. The Gravitational Singularity Core & Emergence Chamber */}
          {/* 8. Tidal Disruption Event (TDE): Star Spaghettification & Singularity Swallowing Sequence */}
          {isMaterializing && (
            <div
              key={`spaghettification-stream-${internalGenesisKey}`}
              aria-hidden="true"
              className="absolute inset-0 z-30 pointer-events-none overflow-visible flex items-center justify-center"
            >
              {/* Curved Geodesic Gravitational Infall Plasma Streamers (SVG) */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                viewBox="0 0 300 300"
              >
                <defs>
                  <linearGradient id="spaghettiTidalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0, 184, 255, 0)" />
                    <stop offset="20%" stopColor="rgba(0, 184, 255, 0.7)" />
                    <stop offset="55%" stopColor="rgba(255, 220, 80, 0.95)" />
                    <stop offset="85%" stopColor="rgba(255, 140, 20, 1)" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <filter id="spaghettiGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer Infalling Tidal Debris Stream */}
                <path
                  d="M -160 -120 C -70 20, 20 80, 150 150"
                  fill="none"
                  stroke="url(#spaghettiTidalGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  filter="url(#spaghettiGlow)"
                  className="animate-[spaghettifiedTrail_3.4s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
                />
                {/* Razor Core Hot Starlight Spaghetti Filament */}
                <path
                  d="M -150 -110 C -55 30, 40 95, 150 150"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  className="animate-[spaghettifiedTrail_3.4s_cubic-bezier(0.2,0.8,0.2,1)_0.08s_forwards]"
                />
                {/* Secondary Orbiting Stripped Plasma Tendril */}
                <path
                  d="M -130 -140 C -40 10, 50 40, 150 150"
                  fill="none"
                  stroke="rgba(0, 184, 255, 0.65)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  className="animate-[spaghettifiedTrail_3.4s_cubic-bezier(0.2,0.8,0.2,1)_0.16s_forwards]"
                />
              </svg>

              {/* The Infalling Stellar Body (Stretching into Spaghetti & Swallowed into Black Hole) */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-[spaghettifiedStarApproach_3.4s_cubic-bezier(0.2,0.8,0.2,1)_forwards] will-change-transform"
              >
                {/* Stellar Photosphere & Solar Flare Corona */}
                <div
                  className="absolute inset-0 rounded-full blur-[1px]"
                  style={{
                    background:
                      'radial-gradient(circle, #ffffff 0%, rgba(255, 240, 160, 0.95) 28%, rgba(255, 160, 20, 0.85) 55%, rgba(0, 184, 255, 0.45) 80%, transparent 100%)',
                  }}
                />

                {/* Trailing Spaghettified Tail Ribbon Behind Star Head */}
                <div
                  className="absolute -left-12 sm:-left-16 w-24 sm:w-32 h-3.5 sm:h-4.5 rounded-full blur-[1px] -rotate-12"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(0, 184, 255, 0.7) 25%, rgba(255, 215, 64, 0.95) 65%, #ffffff 100%)',
                  }}
                />

                {/* Luminous Core with Embedded Proto-Crest Emblem */}
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white shadow-[0_0_18px_#ffffff]">
                  <img
                    src={logoTransparent}
                    alt="Infalling Star Proto-Crest"
                    className="w-full h-full object-cover rounded-full brightness-150 contrast-125"
                  />
                </div>

                {/* High-Energy Quantum Sparks Ejected During Tidal Disruption */}
                <div className="absolute -top-3 -left-6 w-2 h-2 rounded-full bg-cyan-300 animate-ping opacity-85" />
                <div className="absolute -bottom-2 -left-10 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse opacity-90" />
                <div className="absolute top-4 -left-14 w-1.5 h-1.5 rounded-full bg-white opacity-95" />
              </div>
            </div>
          )}

          {/* Expanding Singularity Shockwave Blast Rings when Star is Swallowed */}
          {isMaterializing && (
            <div
              key={`shockwaves-${internalGenesisKey}`}
              aria-hidden="true"
              className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-visible"
            >
              {/* Shockwave Ring 1 — Bursts right as star matter collapses into center (~2.4s) */}
              <div
                className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-amber-300 animate-[singularityShockwave_1.1s_cubic-bezier(0.1,0.8,0.2,1)_2.4s_forwards]"
                style={{
                  boxShadow: '0 0 30px 10px rgba(255, 235, 150, 0.9)',
                }}
              />
              {/* Shockwave Ring 2 */}
              <div
                className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-orange-400 animate-[singularityShockwave_1.3s_cubic-bezier(0.1,0.8,0.2,1)_2.6s_forwards]"
                style={{
                  boxShadow: '0 0 40px 14px rgba(255, 160, 20, 0.8)',
                }}
              />
              {/* Shockwave Ring 3 */}
              <div
                className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-white animate-[singularityShockwave_1.5s_cubic-bezier(0.1,0.8,0.2,1)_2.8s_forwards]"
                style={{
                  boxShadow: '0 0 50px 18px rgba(255, 255, 255, 0.95)',
                }}
              />
            </div>
          )}

          {/* The Gravitational Singularity Point (Dead Center) */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-25 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            {/* Singularity Core Flare Point */}
            <div
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white transition-all duration-300 ${
                isMaterializing ? 'scale-175' : 'scale-100'
              }`}
              style={{
                animation: 'singularityPulse 2.8s infinite ease-in-out',
              }}
            />

            {/* 4-Point Relativistic Lens Flare Diffraction Spikes */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-40 h-28 sm:h-40 pointer-events-none"
              style={{
                animation: 'singularityRays 28s linear infinite',
              }}
            >
              {/* Horizontal Flare Ray */}
              <div
                className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,200,60,0.3) 25%, #ffffff 50%, rgba(255,200,60,0.3) 75%, transparent 100%)',
                  filter: 'drop-shadow(0 0 6px #fff)',
                }}
              />
              {/* Vertical Flare Ray */}
              <div
                className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(255,200,60,0.3) 25%, #ffffff 50%, rgba(255,200,60,0.3) 75%, transparent 100%)',
                  filter: 'drop-shadow(0 0 6px #fff)',
                }}
              />
              {/* Diagonal Quantum Flux Ray 1 */}
              <div
                className="absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2 rotate-45 rounded-full opacity-60"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,160,20,0.2) 30%, #ffffff 50%, rgba(255,160,20,0.2) 70%, transparent 100%)',
                }}
              />
              {/* Diagonal Quantum Flux Ray 2 */}
              <div
                className="absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2 -rotate-45 rounded-full opacity-60"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,160,20,0.2) 30%, #ffffff 50%, rgba(255,160,20,0.2) 70%, transparent 100%)',
                }}
              />
            </div>
          </div>

          {/* 9. The SWID-SHRK Master Crest Logo — Manifested from the Singularity at Designated Place */}
          <div className="relative z-20 w-full h-full flex items-center justify-center p-2.5 sm:p-3.5 rounded-full overflow-hidden">
            <img
              key={`crest-genesis-${internalGenesisKey}`}
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
                  ? 'scale-105 brightness-110 drop-shadow-[0_0_24px_rgba(255,210,90,0.95)] drop-shadow-[0_0_46px_rgba(245,124,0,0.65)]'
                  : 'scale-100 drop-shadow-[0_0_20px_rgba(255,190,60,0.85)] drop-shadow-[0_0_38px_rgba(245,124,0,0.55)]'
              }`}
            />

            {/* Central SHSK Monogram Warm Gold Glow Bloom */}
            <div
              aria-hidden="true"
              className="absolute top-[30%] left-[20%] right-[20%] bottom-[33%] rounded-full pointer-events-none mix-blend-screen animate-shsk-glow"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255,225,130,0.7) 0%, rgba(255,152,0,0.4) 48%, transparent 75%)',
              }}
            />

            {/* Twinkling Gravitational Sparks on Crest Edge */}
            <span
              className="absolute w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-30 shadow-[0_0_6px_3px_#fff,0_0_12px_4px_rgba(255,220,120,0.95),0_0_20px_6px_rgba(255,140,20,0.75)] animate-[twinkle_2.2s_infinite_ease-in-out_0.2s]"
              style={{ top: '16%', left: '49%' }}
            />
            <span
              className="absolute w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-30 shadow-[0_0_6px_3px_#fff,0_0_12px_4px_rgba(255,220,120,0.95),0_0_20px_6px_rgba(255,140,20,0.75)] animate-[twinkle_3.2s_infinite_ease-in-out_0.5s]"
              style={{ top: '45%', left: '16%' }}
            />
            <span
              className="absolute w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-30 shadow-[0_0_6px_3px_#fff,0_0_12px_4px_rgba(255,220,120,0.95),0_0_20px_6px_rgba(255,140,20,0.75)] animate-[twinkle_2.6s_infinite_ease-in-out_0.8s]"
              style={{ top: '38%', left: '83%' }}
            />
            <span
              className="absolute w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-30 shadow-[0_0_6px_3px_#fff,0_0_12px_4px_rgba(255,220,120,0.95),0_0_20px_6px_rgba(255,140,20,0.75)] animate-[twinkle_3.8s_infinite_ease-in-out_1.1s]"
              style={{ top: '72%', left: '22%' }}
            />
            <span
              className="absolute w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-30 shadow-[0_0_6px_3px_#fff,0_0_12px_4px_rgba(255,220,120,0.95),0_0_20px_6px_rgba(255,140,20,0.75)] animate-[twinkle_2.4s_infinite_ease-in-out_1.4s]"
              style={{ top: '82%', left: '52%' }}
            />
          </div>
        </div>
      </div>

      {/* 10. Singularity Genesis Interactive Status Chip (Only shown if requested, now placed in corner by default) */}
      {showEmbeddedChip && (
        <div className="relative z-30 -mt-2 flex items-center justify-center">
          <button
            onClick={handleTriggerSingularity}
            className="group/btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all duration-200 bg-black/60 hover:bg-black/85 border border-amber-500/40 hover:border-amber-400 text-amber-200/90 hover:text-white shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_22px_rgba(245,158,11,0.45)] cursor-pointer backdrop-blur-md"
            title="Click to trigger black hole singularity creation cycle"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-0.5" />
            <Sparkles className="w-3 h-3 text-amber-300 group-hover/btn:rotate-45 transition-transform" />
            <span>{isMaterializing ? 'Forging from Singularity…' : 'Singularity Genesis'}</span>
            <RefreshCw
              className={`w-2.5 h-2.5 text-amber-400/70 group-hover/btn:text-amber-300 ${
                isMaterializing ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};
