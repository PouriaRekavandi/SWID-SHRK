import React from 'react';
import { CelestialBodyKey } from '../types';
import logoTransparent from '../assets/logo.jpg';
import logoFallback from '../assets/logo.jpg';

interface CelestialPlanetViewProps {
  bodyKey: CelestialBodyKey;
  isHovered?: boolean;
  flareActive?: boolean;
  rotationSpeed?: number;
  revolutionSpeed?: number;
  isWarping?: boolean;
}

/**
 * CelestialPlanetView
 * Renders physically-accurate 3D planetary surfaces with the SWID-SHRK crest logo
 * harmoniously and visibly embedded into each celestial body (Sun and all planets):
 * - Preserves atmospheric depth, storm vortices, convective cells, continents, and 3D limb darkening.
 * - Embeds the iconic crest with tailored, high-contrast holographic and spherical blend modes.
 */
export const CelestialPlanetView: React.FC<CelestialPlanetViewProps> = ({
  bodyKey,
  isHovered = false,
  flareActive = false,
  rotationSpeed,
  revolutionSpeed,
  isWarping = false,
}) => {
  const speed = Math.max(0.5, revolutionSpeed || rotationSpeed || 1.0);
  const spinDuration = `${Math.max(0.45, 24 / speed)}s`;
  const fastSpinDuration = `${Math.max(0.25, 12 / speed)}s`;
  const moonOrbitDuration = `${Math.max(0.3, 11 / speed)}s`;

  // Hyperspace warp effect overlay
  const warpOverlay = isWarping ? (
    <div
      aria-hidden="true"
      className="absolute -inset-8 rounded-full pointer-events-none z-40 animate-warp-burst flex items-center justify-center"
    >
      <div className="w-full h-full rounded-full border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(0,229,255,0.9)] opacity-90" />
      <div className="absolute inset-2 rounded-full border border-amber-300/60 shadow-[0_0_25px_rgba(255,215,64,0.8)]" />
    </div>
  ) : null;

  switch (bodyKey) {
    case 'sun':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* 1. Deep Volumetric Solar Corona */}
          <div
            className={`absolute -inset-10 sm:-inset-16 rounded-full pointer-events-none transition-all duration-700 blur-2xl ${
              isHovered || flareActive ? 'opacity-95 scale-110' : 'opacity-85 scale-100'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(255, 235, 59, 0.95) 0%, rgba(255, 152, 0, 0.8) 42%, rgba(244, 67, 54, 0.45) 70%, transparent 85%)',
            }}
          />

          {/* 2. Coronal Plasma Prominence Loops */}
          <div className="absolute inset-[-15%] rounded-full pointer-events-none">
            <div
              className="absolute top-0 right-6 w-16 h-16 rounded-full border-2 border-amber-300 opacity-80 blur-[1px]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 0)',
                filter: 'drop-shadow(0 0 12px #ff9800)',
              }}
            />
            <div
              className="absolute bottom-1 left-4 w-20 h-20 rounded-full border-2 border-orange-400 opacity-75 blur-[1px]"
              style={{
                clipPath: 'polygon(0 50%, 100% 100%, 0 100%)',
                filter: 'drop-shadow(0 0 14px #ff5722)',
              }}
            />
          </div>

          {/* 3. Solar Photosphere Body (3D Convective Surface) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_55px_rgba(255,180,0,0.95),inset_0_0_40px_rgba(255,255,255,0.9)] border-2 border-amber-200"
            style={{
              background:
                'radial-gradient(circle at 40% 35%, #ffffff 0%, #fff9c4 16%, #fbc02d 38%, #f57f17 65%, #d84315 88%, #bf360c 100%)',
            }}
          >
            {/* Boiling Convective Granulation Cells */}
            <div
              className="absolute inset-0 opacity-70 mix-blend-overlay"
              style={{
                background: `radial-gradient(circle at 30% 25%, transparent 20%, rgba(191, 54, 12, 0.7) 70%),
                  radial-gradient(circle at 70% 65%, transparent 20%, rgba(216, 67, 21, 0.7) 65%),
                  radial-gradient(circle at 50% 50%, rgba(255, 235, 59, 0.4) 0%, transparent 50%)`,
                animation: `celestial-spin-y ${fastSpinDuration} linear infinite`,
              }}
            />

            {/* Sunspot Groups */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <div className="absolute top-[38%] left-[28%] w-5 h-3.5 rounded-[50%] bg-[#450a0a] border border-[#d84315] shadow-[0_0_6px_#ff5722] flex items-center justify-center">
                <div className="w-2.5 h-1.5 rounded-[50%] bg-[#1a0505]" />
              </div>
              <div className="absolute top-[48%] left-[58%] w-4 h-3 rounded-[50%] bg-[#450a0a] border border-[#d84315] shadow-[0_0_5px_#ff5722]">
                <div className="w-2 h-1 rounded-[50%] bg-[#1a0505]" />
              </div>
            </div>

            {/* EMBEDDED SWID-SHRK GOLDEN CREST IN SUN */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 z-14 opacity-90 mix-blend-screen pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Solar Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_16px_#ffeb3b] drop-shadow-[0_0_30px_#ff9800]"
              />
            </div>

            {/* 3D Solar Limb Darkening */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none z-18"
              style={{
                boxShadow:
                  'inset 0 0 35px 8px rgba(183, 28, 28, 0.85), inset 0 0 70px rgba(127, 29, 29, 0.5)',
              }}
            />
          </div>
        </div>
      );

    case 'mercury':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* Faint Solar Backlight */}
          <div
            className="absolute -inset-4 rounded-full pointer-events-none opacity-40 blur-lg"
            style={{
              background:
                'radial-gradient(circle at 25% 25%, rgba(255, 235, 150, 0.5) 0%, transparent 60%)',
            }}
          />

          {/* Mercury 3D Rocky Cratered Surface */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_25px_rgba(180,180,195,0.4),inset_-22px_-22px_45px_rgba(0,0,0,0.95)] border border-slate-500/60"
            style={{
              background:
                'radial-gradient(circle at 30% 28%, #f1f5f9 0%, #cbd5e1 22%, #94a3b8 48%, #64748b 72%, #334155 88%, #0f172a 100%)',
            }}
          >
            {/* Cratered Hermian Terrain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              {/* Caloris Basin */}
              <div
                className="absolute top-[26%] left-[22%] w-16 h-16 rounded-full border border-slate-300/50"
                style={{
                  boxShadow:
                    'inset 0 0 12px rgba(15, 23, 42, 0.85), 0 0 8px rgba(255, 255, 255, 0.35)',
                }}
              >
                <div className="absolute inset-2.5 rounded-full border border-slate-400/40 bg-slate-800/30" />
                <div className="absolute inset-5 rounded-full bg-slate-900/50 border border-slate-500/30" />
              </div>

              {/* Impact Craters */}
              <div className="absolute top-[62%] left-[36%] w-9 h-9 rounded-full border border-slate-300/40 shadow-[inset_0_0_8px_#0f172a] bg-slate-800/40" />
              <div className="absolute top-[20%] right-[26%] w-7 h-7 rounded-full border border-slate-300/40 shadow-[inset_0_0_6px_#0f172a] bg-slate-800/35" />
              <div className="absolute bottom-[20%] right-[32%] w-11 h-11 rounded-full border border-slate-400/40 shadow-[inset_0_0_10px_#0f172a] bg-slate-800/40" />
            </div>

            {/* EMBEDDED SWID-SHRK CREST IN MERCURY */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3.5 z-14 opacity-80 mix-blend-overlay pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Mercury Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[78%] h-[78%] object-contain rounded-full filter drop-shadow-[0_0_12px_#cbd5e1]"
              />
            </div>

            {/* Deep Photorealistic Day/Night Terminator Line */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background:
                  'linear-gradient(125deg, transparent 38%, rgba(15, 23, 42, 0.6) 62%, rgba(2, 6, 23, 0.98) 88%)',
              }}
            />
          </div>
        </div>
      );

    case 'venus':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* Supercritical Atmospheric Glow */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-70 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 213, 79, 0.5) 0%, rgba(255, 160, 0, 0.3) 50%, transparent 75%)',
            }}
          />

          {/* Venus 3D Sulfuric Acid Cloud Canopy */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(255,193,7,0.65),inset_-20px_-20px_45px_rgba(62,39,35,0.98)] border border-amber-300/50"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #fffde7 0%, #fff59d 18%, #ffe082 40%, #ffb74d 68%, #f57c00 88%, #5d4037 100%)',
            }}
          >
            {/* Swirling Atmospheric Chevron Cloud Bands */}
            <div
              className="absolute inset-0 opacity-75"
              style={{
                background: `repeating-linear-gradient(
                  -18deg,
                  rgba(255, 238, 88, 0.35) 0px,
                  rgba(255, 238, 88, 0.35) 16px,
                  rgba(245, 124, 0, 0.25) 16px,
                  rgba(245, 124, 0, 0.25) 32px
                )`,
                animation: `celestial-spin-y-reverse ${spinDuration} linear infinite`,
              }}
            />

            {/* EMBEDDED SWID-SHRK CREST IN VENUS */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3.5 z-14 opacity-80 mix-blend-color-dodge pointer-events-none"
              style={{
                animation: `celestial-spin-y-reverse ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Venus Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[80%] h-[80%] object-contain rounded-full filter drop-shadow-[0_0_14px_#ffe082]"
              />
            </div>

            {/* Thick Atmospheric Volumetric Shade */}
            <div
              className="absolute inset-0 pointer-events-none z-18"
              style={{
                background:
                  'linear-gradient(130deg, transparent 40%, rgba(93, 64, 55, 0.5) 65%, rgba(62, 39, 35, 0.95) 90%)',
              }}
            />
          </div>
        </div>
      );

    case 'earth':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* Luminous Rayleigh Atmospheric Scattering Horizon (Cyan Corona) */}
          <div
            className={`absolute -inset-7 sm:-inset-10 rounded-full pointer-events-none transition-all duration-500 blur-xl ${
              isHovered ? 'opacity-95 scale-110' : 'opacity-85 scale-100'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(0, 229, 255, 0.5) 0%, rgba(33, 150, 243, 0.38) 45%, rgba(0, 255, 65, 0.18) 65%, transparent 80%)',
            }}
          />

          {/* 3D Orbiting Moon (Luna) with Craters */}
          <div
            className="absolute inset-[-20%] pointer-events-none rounded-full flex items-center justify-center"
            style={{
              animation: `celestial-revolve ${moonOrbitDuration} linear infinite`,
            }}
          >
            <div
              className="absolute w-5 h-5 rounded-full bg-slate-200 border border-white shadow-[0_0_12px_#ffffff]"
              style={{ transform: 'translateX(clamp(65px, 20vw, 85px))' }}
            >
              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-400/70" />
            </div>
          </div>

          {/* Earth Body (3D Blue Marble Surface) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_45px_rgba(0,184,255,0.85),inset_-20px_-20px_42px_rgba(3,10,30,0.98)] border-2 border-cyan-300/70"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #38bdf8 0%, #0284c7 28%, #0369a1 55%, #075985 75%, #0c4a6e 90%, #022c43 100%)',
            }}
          >
            {/* North & South Polar Ice Caps */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 rounded-b-full bg-white/95 shadow-[0_0_8px_#ffffff] z-12" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-t-full bg-white/90 shadow-[0_0_8px_#ffffff] z-12" />

            {/* Realistic Continents Layer */}
            <div
              className="absolute inset-0 flex w-[200%] h-full pointer-events-none opacity-85 z-10"
              style={{
                animation: `surface-drift-x ${spinDuration} linear infinite`,
              }}
            >
              <div className="w-1/2 h-full relative flex-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Africa & Eurasia */}
                  <path
                    d="M 42,32 Q 52,30 56,38 Q 60,52 52,65 Q 46,72 40,60 Q 36,46 42,32 Z"
                    fill="#15803d"
                    opacity="0.9"
                  />
                  <path d="M 43,33 Q 54,32 55,42 Q 47,45 42,39 Z" fill="#d97706" opacity="0.9" />
                  <path
                    d="M 40,16 Q 48,12 55,18 Q 50,26 42,28 Q 36,24 40,16 Z"
                    fill="#16a34a"
                    opacity="0.9"
                  />
                  <path
                    d="M 54,16 Q 74,12 82,24 Q 85,40 76,46 Q 66,50 62,38 Q 55,30 54,16 Z"
                    fill="#16a34a"
                    opacity="0.9"
                  />
                  {/* Americas */}
                  <path
                    d="M 10,18 Q 24,14 26,26 Q 24,36 18,44 Q 10,38 8,26 Z"
                    fill="#15803d"
                    opacity="0.9"
                  />
                  <path
                    d="M 18,46 Q 26,48 24,62 Q 22,78 16,82 Q 12,70 14,56 Z"
                    fill="#16a34a"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <div className="w-1/2 h-full relative flex-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 42,32 Q 52,30 56,38 Q 60,52 52,65 Q 46,72 40,60 Q 36,46 42,32 Z"
                    fill="#15803d"
                    opacity="0.9"
                  />
                  <path d="M 43,33 Q 54,32 55,42 Q 47,45 42,39 Z" fill="#d97706" opacity="0.9" />
                  <path
                    d="M 40,16 Q 48,12 55,18 Q 50,26 42,28 Q 36,24 40,16 Z"
                    fill="#16a34a"
                    opacity="0.9"
                  />
                  <path
                    d="M 54,16 Q 74,12 82,24 Q 85,40 76,46 Q 66,50 62,38 Q 55,30 54,16 Z"
                    fill="#16a34a"
                    opacity="0.9"
                  />
                  <path
                    d="M 10,18 Q 24,14 26,26 Q 24,36 18,44 Q 10,38 8,26 Z"
                    fill="#15803d"
                    opacity="0.9"
                  />
                  <path
                    d="M 18,46 Q 26,48 24,62 Q 22,78 16,82 Q 12,70 14,56 Z"
                    fill="#16a34a"
                    opacity="0.9"
                  />
                </svg>
              </div>
            </div>

            {/* Dynamic Swirling Clouds Layer */}
            <div
              className="absolute inset-0 flex w-[200%] h-full pointer-events-none opacity-65 z-13"
              style={{
                animation: `surface-drift-x ${fastSpinDuration} linear infinite`,
              }}
            >
              <div
                className="w-1/2 h-full"
                style={{
                  background: `radial-gradient(ellipse at 42% 38%, rgba(255, 255, 255, 0.85) 0%, transparent 35%),
                    radial-gradient(ellipse at 72% 62%, rgba(255, 255, 255, 0.8) 0%, transparent 30%),
                    radial-gradient(ellipse at 22% 72%, rgba(255, 255, 255, 0.85) 0%, transparent 28%)`,
                }}
              />
              <div
                className="w-1/2 h-full"
                style={{
                  background: `radial-gradient(ellipse at 42% 38%, rgba(255, 255, 255, 0.85) 0%, transparent 35%),
                    radial-gradient(ellipse at 72% 62%, rgba(255, 255, 255, 0.8) 0%, transparent 30%),
                    radial-gradient(ellipse at 22% 72%, rgba(255, 255, 255, 0.85) 0%, transparent 28%)`,
                }}
              />
            </div>

            {/* EMBEDDED SWID-SHRK CREST IN EARTH (The Blue Marble Research Hub) */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 z-16 opacity-85 mix-blend-screen pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Earth Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[84%] h-[84%] object-contain rounded-full filter drop-shadow-[0_0_16px_#00e5ff]"
              />
            </div>

            {/* Day/Night Terminator Line */}
            <div
              className="absolute inset-0 pointer-events-none z-18"
              style={{
                background:
                  'linear-gradient(130deg, transparent 44%, rgba(2, 6, 23, 0.5) 66%, rgba(2, 6, 23, 0.95) 90%)',
              }}
            />

            {/* Atmospheric Blue Limb Sheen */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none z-20"
              style={{
                boxShadow:
                  'inset 0 0 24px 6px rgba(0, 229, 255, 0.85), inset 0 0 50px rgba(255, 255, 255, 0.4)',
              }}
            />
          </div>
        </div>
      );

    case 'mars':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* Red Atmospheric Limb Haze */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-65 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(239, 68, 68, 0.55) 0%, rgba(185, 28, 28, 0.35) 50%, transparent 75%)',
            }}
          />

          {/* Mars 3D Red Planet Surface */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(239,68,68,0.7),inset_-20px_-20px_42px_rgba(30,5,5,0.98)] border border-red-500/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #fca5a5 0%, #f87171 22%, #ef4444 45%, #dc2626 68%, #991b1b 88%, #450a0a 100%)',
            }}
          >
            {/* North & South Polar Ice Caps */}
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-b-full bg-white shadow-[0_0_10px_#ffffff] z-12" />
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-t-full bg-white/90 shadow-[0_0_8px_#ffffff] z-12" />

            {/* Martian Topography (Valles Marineris & Olympus Mons) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <div
                className="absolute top-[40%] left-[22%] w-24 h-12 rounded-full bg-[#450a0a]/80 blur-[1.5px] -rotate-12"
              />
              <div
                className="absolute top-[48%] left-[30%] w-32 h-2.5 bg-[#260505] rounded-full -rotate-6 blur-[0.4px]"
              />
              <div className="absolute top-[32%] right-[32%] w-8 h-8 rounded-full border-2 border-amber-300/60 bg-[#7f1d1d] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#450a0a]" />
              </div>
            </div>

            {/* EMBEDDED SWID-SHRK CREST IN MARS */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3.5 z-14 opacity-80 mix-blend-color-dodge pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Mars Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[80%] h-[80%] object-contain rounded-full filter drop-shadow-[0_0_12px_#fca5a5]"
              />
            </div>

            {/* Day/Night Terminator Line */}
            <div
              className="absolute inset-0 pointer-events-none z-18"
              style={{
                background:
                  'linear-gradient(130deg, transparent 40%, rgba(40, 5, 5, 0.6) 65%, rgba(15, 2, 2, 0.95) 90%)',
              }}
            />
          </div>
        </div>
      );

    case 'jupiter':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* Jovian Auroral UV Glow */}
          <div
            className="absolute -inset-8 rounded-full pointer-events-none opacity-60 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(217, 119, 6, 0.45) 0%, rgba(180, 83, 9, 0.3) 50%, rgba(124, 58, 237, 0.2) 75%, transparent 85%)',
            }}
          />

          {/* Jupiter Banded Gas Giant Sphere */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_40px_rgba(217,119,6,0.7),inset_-20px_-20px_45px_rgba(20,10,5,0.98)] border border-amber-500/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #fef3c7 0%, #fde68a 25%, #d97706 60%, #92400e 85%, #451a03 100%)',
            }}
          >
            {/* Alternating Equatorial & Temperate Cloud Belts */}
            <div
              className="absolute inset-0 pointer-events-none opacity-85"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  rgba(120, 53, 15, 0.9) 0px,
                  rgba(120, 53, 15, 0.9) 11px,
                  rgba(254, 243, 199, 0.8) 11px,
                  rgba(254, 243, 199, 0.8) 22px,
                  rgba(180, 83, 9, 0.9) 22px,
                  rgba(180, 83, 9, 0.9) 33px,
                  rgba(253, 230, 138, 0.8) 33px,
                  rgba(253, 230, 138, 0.8) 44px
                )`,
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            />

            {/* The Great Red Spot */}
            <div
              className="absolute bottom-[28%] left-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{
                animation: `celestial-spin-y ${fastSpinDuration} linear infinite`,
              }}
            >
              <div
                className="w-13 h-8.5 rounded-[50%] bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 border-2 border-red-300 shadow-[0_0_16px_#dc2626] flex items-center justify-center"
                style={{ transform: 'translateX(35px)' }}
              >
                <div className="w-5.5 h-3.5 rounded-[50%] bg-amber-200/95" />
              </div>
            </div>

            {/* EMBEDDED SWID-SHRK CREST IN JUPITER */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 z-14 opacity-80 mix-blend-screen pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Jupiter Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_14px_#fde68a]"
              />
            </div>

            {/* 3D Oblate Limb Darkening */}
            <div
              className="absolute inset-0 pointer-events-none z-18"
              style={{
                background:
                  'linear-gradient(130deg, transparent 40%, rgba(69, 26, 3, 0.5) 65%, rgba(20, 8, 2, 0.95) 90%)',
              }}
            />
          </div>
        </div>
      );

    case 'saturn':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* 3D Tilted Ring System Behind Planet (Back Half) */}
          <div
            className="absolute w-[190%] sm:w-[215%] h-[56%] pointer-events-none z-0"
            style={{
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, 
                transparent 52%, 
                rgba(217, 180, 120, 0.6) 53%, 
                rgba(245, 222, 179, 0.95) 64%, 
                rgba(15, 10, 5, 0.95) 65%, 
                rgba(15, 10, 5, 0.95) 67%, 
                rgba(235, 205, 150, 0.95) 68%, 
                rgba(210, 175, 120, 0.75) 80%, 
                transparent 84%)`,
              boxShadow: '0 0 25px rgba(245, 222, 179, 0.45)',
            }}
          />

          {/* Saturn 3D Gas Giant Sphere */}
          <div
            className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(234,179,8,0.6),inset_-18px_-18px_38px_rgba(40,25,5,0.95)] border border-amber-200/50"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #fef08a 0%, #fde047 30%, #eab308 60%, #ca8a04 82%, #713f12 100%)',
            }}
          >
            {/* Butterscotch Latitudinal Cloud Belts */}
            <div
              className="absolute inset-0 pointer-events-none opacity-65"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  rgba(161, 98, 7, 0.5) 0px,
                  rgba(161, 98, 7, 0.5) 8px,
                  rgba(254, 240, 138, 0.4) 8px,
                  rgba(254, 240, 138, 0.4) 16px
                )`,
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            />

            {/* EMBEDDED SWID-SHRK CREST IN SATURN */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3.5 z-14 opacity-80 mix-blend-color-dodge pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Saturn Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[80%] h-[80%] object-contain rounded-full filter drop-shadow-[0_0_14px_#fef08a]"
              />
            </div>

            {/* Ring Shadow cast across Saturn's surface */}
            <div
              className="absolute top-[48%] left-0 right-0 h-4 bg-black/60 blur-[1px] -rotate-1 pointer-events-none z-15"
            />

            {/* 3D Atmospheric Limb Darkening */}
            <div
              className="absolute inset-0 pointer-events-none z-18"
              style={{
                background:
                  'linear-gradient(130deg, transparent 40%, rgba(113, 63, 18, 0.5) 65%, rgba(30, 15, 3, 0.95) 90%)',
              }}
            />
          </div>

          {/* 3D Tilted Ring System in Front of Planet (Front Half) */}
          <div
            className="absolute w-[190%] sm:w-[215%] h-[56%] pointer-events-none z-20"
            style={{
              borderRadius: '50%',
              clipPath: 'polygon(0% 48%, 100% 48%, 100% 100%, 0% 100%)',
              background: `radial-gradient(ellipse at center, 
                transparent 52%, 
                rgba(217, 180, 120, 0.6) 53%, 
                rgba(245, 222, 179, 0.95) 64%, 
                rgba(15, 10, 5, 0.95) 65%, 
                rgba(15, 10, 5, 0.95) 67%, 
                rgba(235, 205, 150, 0.95) 68%, 
                rgba(210, 175, 120, 0.75) 80%, 
                transparent 84%)`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
            }}
          />
        </div>
      );

    case 'uranus':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* Methane Cyan Atmospheric Glow */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-65 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(103, 232, 249, 0.5) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 75%)',
            }}
          />

          {/* Uranus 3D Tilted Ice Giant Body */}
          <div
            className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.7),inset_-18px_-18px_38px_rgba(8,51,68,0.98)] border border-cyan-200/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #cffafe 0%, #a5f3fc 28%, #22d3ee 55%, #0891b2 80%, #155e75 100%)',
            }}
          >
            {/* Faint Methane Cloud Belts */}
            <div
              className="absolute inset-0 pointer-events-none opacity-45"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.45) 0px,
                  rgba(255, 255, 255, 0.45) 14px,
                  transparent 14px,
                  transparent 28px
                )`,
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            />

            {/* EMBEDDED SWID-SHRK CREST IN URANUS */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 z-14 opacity-80 mix-blend-screen pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Uranus Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_14px_#67e8f9]"
              />
            </div>

            {/* 3D Atmospheric Depth */}
            <div
              className="absolute inset-0 pointer-events-none z-18"
              style={{
                background:
                  'linear-gradient(130deg, transparent 42%, rgba(21, 94, 117, 0.5) 65%, rgba(8, 51, 68, 0.95) 90%)',
              }}
            />
          </div>
        </div>
      );

    case 'neptune':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000 }}
        >
          {warpOverlay}

          {/* Deep Cobalt Azure Glow */}
          <div
            className="absolute -inset-7 rounded-full pointer-events-none opacity-75 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(29, 78, 216, 0.4) 50%, rgba(30, 27, 75, 0.2) 75%, transparent 85%)',
            }}
          />

          {/* Neptune 3D Supersonic Atmospheric Surface */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.85),inset_-18px_-18px_40px_rgba(15,23,42,0.98)] border border-blue-400/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #93c5fd 0%, #60a5fa 25%, #3b82f6 50%, #1d4ed8 75%, #1e40af 88%, #172554 100%)',
            }}
          >
            {/* Supersonic High-Altitude White Cirrus Cloud Streaks ("Scooter") */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${fastSpinDuration} linear infinite`,
              }}
            >
              <div className="absolute top-[30%] left-[16%] w-22 h-2.5 rounded-full bg-white/95 blur-[0.6px] shadow-[0_0_10px_#ffffff]" />
              <div className="absolute top-[65%] right-[20%] w-18 h-2 rounded-full bg-cyan-200/90 blur-[0.6px] shadow-[0_0_8px_#67e8f9]" />
            </div>

            {/* Great Dark Spot */}
            <div className="absolute top-[42%] right-[26%] w-12 h-8 rounded-full bg-[#020617] border border-blue-300/50 shadow-[inset_0_0_10px_#0f172a] flex items-center justify-center">
              <div className="w-6 h-3 rounded-full bg-[#0f172a] opacity-80" />
            </div>

            {/* EMBEDDED SWID-SHRK CREST IN NEPTUNE */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 z-14 opacity-85 mix-blend-screen pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Neptune Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_16px_#3b82f6]"
              />
            </div>

            {/* 3D Atmospheric Limb Volumetric Shade */}
            <div
              className="absolute inset-0 pointer-events-none z-18"
              style={{
                background:
                  'linear-gradient(130deg, transparent 40%, rgba(30, 64, 175, 0.5) 65%, rgba(15, 23, 42, 0.98) 90%)',
              }}
            />
          </div>
        </div>
      );

    case 'blackhole':
    default:
      return null;
  }
};
