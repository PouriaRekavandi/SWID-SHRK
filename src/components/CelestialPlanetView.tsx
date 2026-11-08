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
 * Visualizes celestial bodies with strict 3D spin rotation around the VERTICAL Y-AXIS:
 * - X-axis: horizontal (left to right)
 * - Y-axis: vertical (up to down, the axis of spin rotation)
 * - Surface features and cloud bands drift horizontally along X around the vertical Y-axis.
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
  // Dynamic duration calculations based on rotational & orbital acceleration
  const spinDuration = `${Math.max(0.45, 24 / speed)}s`;
  const counterSpinDuration = `${Math.max(0.45, 28 / speed)}s`;
  const fastSpinDuration = `${Math.max(0.25, 12 / speed)}s`;
  const moonOrbitDuration = `${Math.max(0.3, 10 / speed)}s`;

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

  // Vertical Y-Axis Spin Pole Marker (Up-to-Down Axis of Rotation)
  const verticalYAxisMarker = (
    <div
      aria-hidden="true"
      className="absolute -top-5 -bottom-5 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber-400 via-amber-300/30 to-amber-400 pointer-events-none z-30 flex flex-col justify-between items-center"
      title="Vertical Y-Axis of Spin Rotation (Up-to-Down, rotateY)"
    >
      {/* Top North Pole (-Y in screen coords) */}
      <div className="relative flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] ring-1 ring-amber-100" />
        <span className="text-[7px] font-mono font-black text-amber-200 tracking-tighter bg-black/90 px-1 rounded -mt-0.5 border border-amber-400/50 shadow-sm whitespace-nowrap">
          -Y
        </span>
      </div>

      {/* Central 3D rotateY spin rotation glyph */}
      <div className="text-[9px] text-amber-300/90 font-bold leading-none animate-pulse bg-black/70 px-0.5 rounded shadow">
        ⟲
      </div>

      {/* Bottom South Pole (+Y in screen coords) */}
      <div className="relative flex flex-col items-center">
        <span className="text-[7px] font-mono font-black text-amber-200 tracking-tighter bg-black/90 px-1 rounded -mb-0.5 border border-amber-400/50 shadow-sm whitespace-nowrap">
          +Y
        </span>
        <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] ring-1 ring-amber-100" />
      </div>
    </div>
  );

  switch (bodyKey) {
    case 'sun':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Intense Solar Corona Halo Glow */}
          <div
            className={`absolute -inset-10 sm:-inset-16 rounded-full pointer-events-none transition-all duration-700 blur-2xl ${
              isHovered || flareActive || isWarping ? 'opacity-95 scale-110' : 'opacity-80 scale-100'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(255, 235, 59, 0.9) 0%, rgba(255, 152, 0, 0.75) 45%, rgba(244, 67, 54, 0.4) 70%, transparent 85%)',
            }}
          />

          {/* Coronal Mass Prominence Loops aligned on vertical Y poles */}
          <div className="absolute inset-[-14%] rounded-full pointer-events-none">
            <div
              className="absolute top-1 right-5 w-16 h-16 rounded-full border-2 border-amber-300 opacity-80 blur-[1px]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 0)',
                filter: 'drop-shadow(0 0 10px #ff9800)',
              }}
            />
            <div
              className="absolute bottom-2 left-4 w-20 h-20 rounded-full border-2 border-orange-400 opacity-75 blur-[1px]"
              style={{
                clipPath: 'polygon(0 50%, 100% 100%, 0 100%)',
                filter: 'drop-shadow(0 0 12px #ff5722)',
              }}
            />
          </div>

          {/* Sun Photosphere Main Body (Boiling Convection Plasma) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_50px_rgba(255,180,0,0.95),inset_0_0_40px_rgba(255,255,255,0.85)] border-2 border-amber-200"
            style={{
              background:
                'radial-gradient(circle at 38% 34%, #ffffff 0%, #fff59d 18%, #fbc02d 42%, #f57f17 68%, #d84315 92%, #bf360c 100%)',
            }}
          >
            {/* Plasma Granules Drifting Horizontally along X around the Vertical Y-Axis */}
            <div
              className="absolute inset-0 opacity-55 mix-blend-color-burn"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 30%, rgba(216, 67, 21, 0.6) 70%, rgba(191, 54, 12, 0.9) 100%)',
                animation: `celestial-spin-y ${fastSpinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            />

            {/* Embossed Golden SWID-SHRK Crest Spinning around the Vertical Y-Axis */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-90 mix-blend-screen"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Solar Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_12px_#ffffff] drop-shadow-[0_0_24px_#ffeb3b]"
              />
            </div>
          </div>
        </div>
      );

    case 'mercury':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Faint Solar Glare */}
          <div
            className="absolute -inset-4 rounded-full pointer-events-none opacity-40 blur-lg"
            style={{
              background:
                'radial-gradient(circle at 25% 25%, rgba(255, 235, 150, 0.5) 0%, transparent 60%)',
            }}
          />

          {/* Mercury Rocky Body with Silicate Mantle */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_25px_rgba(180,180,195,0.4),inset_-18px_-18px_40px_rgba(0,0,0,0.92)] border border-slate-500/50"
            style={{
              background:
                'radial-gradient(circle at 32% 30%, #e2e8f0 0%, #94a3b8 32%, #64748b 60%, #334155 82%, #0f172a 100%)',
            }}
          >
            {/* Cratered Mantle rotating around the vertical Y-axis */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* Caloris Basin Multiring Impact Feature */}
              <div
                className="absolute top-[28%] left-[24%] w-14 h-14 rounded-full border border-slate-300/40 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 10px rgba(15, 23, 42, 0.8), 0 0 6px rgba(255, 255, 255, 0.3)',
                }}
              >
                <div className="absolute inset-2 rounded-full border border-slate-400/30" />
                <div className="absolute inset-4 rounded-full bg-slate-900/40" />
              </div>

              {/* Smaller Craters across the Silicate Mantle */}
              <div className="absolute top-[60%] left-[38%] w-8 h-8 rounded-full border border-slate-400/30 shadow-[inset_0_0_6px_#0f172a]" />
              <div className="absolute top-[22%] right-[28%] w-6 h-6 rounded-full border border-slate-400/30 shadow-[inset_0_0_4px_#0f172a]" />
              <div className="absolute bottom-[22%] right-[32%] w-10 h-10 rounded-full border border-slate-500/40 shadow-[inset_0_0_8px_#0f172a]" />

              {/* Embedded Crest */}
              <div className="absolute inset-0 flex items-center justify-center p-4 opacity-50 mix-blend-overlay">
                <img
                  src={logoTransparent}
                  alt="SWID-SHRK Mercury Crest"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = logoFallback;
                  }}
                  className="w-[75%] h-[75%] object-contain rounded-full"
                />
              </div>
            </div>

            {/* Fixed Terminator Line (Sunward illumination fixed) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-85 z-20"
              style={{
                background:
                  'linear-gradient(135deg, transparent 40%, rgba(15, 23, 42, 0.6) 65%, rgba(2, 6, 23, 0.98) 90%)',
              }}
            />
          </div>
        </div>
      );

    case 'venus':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Supercritical Golden Atmosphere Glow */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-70 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 213, 79, 0.5) 0%, rgba(255, 160, 0, 0.3) 50%, transparent 75%)',
            }}
          />

          {/* Venus Cloud Sphere with Swirling Acid Decks */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(255,193,7,0.65),inset_-16px_-16px_36px_rgba(62,39,35,0.95)] border border-amber-300/40"
            style={{
              background:
                'radial-gradient(circle at 35% 32%, #fff9c4 0%, #ffe082 25%, #ffb74d 50%, #f57c00 75%, #5d4037 100%)',
            }}
          >
            {/* Retrograde Horizontal Drift along X around the vertical Y-axis */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255, 238, 88, 0.3) 20px, rgba(230, 81, 0, 0.25) 40px)',
                animation: `celestial-spin-y-reverse ${counterSpinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            />

            {/* Lightning Flicker Discharge */}
            <div className="absolute top-[35%] left-[42%] w-2 h-2 rounded-full bg-amber-100 animate-ping opacity-75" />
            <div className="absolute top-[65%] left-[28%] w-1.5 h-1.5 rounded-full bg-white animate-pulse opacity-85" />

            {/* Embedded Logo spinning around vertical Y-axis */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-60 mix-blend-color-dodge"
              style={{
                animation: `celestial-spin-y-reverse ${counterSpinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Venus Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[80%] h-[80%] object-contain rounded-full filter drop-shadow-[0_0_12px_#ffe082]"
              />
            </div>
          </div>
        </div>
      );

    case 'earth':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Luminous Atmospheric Rayleigh Scattering Rim (Cyan Corona) */}
          <div
            className={`absolute -inset-7 sm:-inset-10 rounded-full pointer-events-none transition-all duration-500 blur-xl ${
              isHovered || isWarping ? 'opacity-95 scale-110' : 'opacity-80 scale-100'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(0, 229, 255, 0.45) 0%, rgba(33, 150, 243, 0.35) 45%, rgba(0, 255, 65, 0.15) 65%, transparent 80%)',
            }}
          />

          {/* 3D Orbiting Moon (Luna) Revolving around Earth in Horizontal Orbit */}
          <div
            className="absolute inset-[-20%] pointer-events-none rounded-full flex items-center justify-center"
            style={{
              animation: `celestial-revolve ${moonOrbitDuration} linear infinite`,
              willChange: 'transform',
            }}
          >
            <div
              className="absolute w-5 h-5 rounded-full bg-slate-200 border border-white shadow-[0_0_10px_#ffffff]"
              style={{ transform: 'translateX(clamp(65px, 20vw, 85px))' }}
            >
              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-400/60" />
            </div>
          </div>

          {/* Earth Body (The Blue Marble) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_45px_rgba(0,184,255,0.85),inset_-18px_-18px_38px_rgba(3,10,30,0.95)] border-2 border-cyan-300/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #0284c7 0%, #0369a1 35%, #075985 65%, #0c4a6e 85%, #022c43 100%)',
            }}
          >
            {/* Seamless Continents translating horizontally along X around vertical Y-axis */}
            <div
              className="absolute inset-0 flex w-[200%] h-full pointer-events-none opacity-85"
              style={{
                animation: `surface-drift-x ${spinDuration} linear infinite`,
                willChange: 'transform',
              }}
            >
              {/* Hemispheric Continental Segment 1 */}
              <div className="w-1/2 h-full relative flex-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Eurasia & Africa */}
                  <path
                    d="M 28,22 Q 40,15 54,20 Q 65,24 62,35 Q 58,45 68,52 Q 74,62 65,72 Q 52,78 45,68 Q 38,62 32,68 Q 24,60 28,45 Q 22,32 28,22 Z"
                    fill="#16a34a"
                    opacity="0.85"
                  />
                  <path d="M 32,25 Q 42,20 50,26 Q 58,32 52,42 Q 44,48 38,40 Z" fill="#84cc16" opacity="0.9" />
                  <path d="M 40,40 Q 52,38 56,46 Q 50,54 42,50 Z" fill="#d97706" opacity="0.75" />
                  {/* Americas */}
                  <path
                    d="M 12,24 Q 18,20 16,36 Q 14,48 22,54 Q 24,68 18,78 Q 12,70 14,56 Q 8,42 12,24 Z"
                    fill="#15803d"
                    opacity="0.75"
                  />
                </svg>
              </div>

              {/* Hemispheric Continental Segment 2 (Seamless Repeat) */}
              <div className="w-1/2 h-full relative flex-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 28,22 Q 40,15 54,20 Q 65,24 62,35 Q 58,45 68,52 Q 74,62 65,72 Q 52,78 45,68 Q 38,62 32,68 Q 24,60 28,45 Q 22,32 28,22 Z"
                    fill="#16a34a"
                    opacity="0.85"
                  />
                  <path d="M 32,25 Q 42,20 50,26 Q 58,32 52,42 Q 44,48 38,40 Z" fill="#84cc16" opacity="0.9" />
                  <path d="M 40,40 Q 52,38 56,46 Q 50,54 42,50 Z" fill="#d97706" opacity="0.75" />
                  <path
                    d="M 12,24 Q 18,20 16,36 Q 14,48 22,54 Q 24,68 18,78 Q 12,70 14,56 Q 8,42 12,24 Z"
                    fill="#15803d"
                    opacity="0.75"
                  />
                </svg>
              </div>
            </div>

            {/* Dynamic Clouds drifting horizontally along X around vertical Y-axis */}
            <div
              className="absolute inset-0 flex w-[200%] h-full pointer-events-none opacity-65"
              style={{
                animation: `surface-drift-x ${fastSpinDuration} linear infinite`,
                willChange: 'transform',
              }}
            >
              <div
                className="w-1/2 h-full"
                style={{
                  background:
                    'radial-gradient(ellipse at 40% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 35%), radial-gradient(ellipse at 70% 65%, rgba(255, 255, 255, 0.7) 0%, transparent 30%), radial-gradient(ellipse at 25% 75%, rgba(255, 255, 255, 0.75) 0%, transparent 28%)',
                }}
              />
              <div
                className="w-1/2 h-full"
                style={{
                  background:
                    'radial-gradient(ellipse at 40% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 35%), radial-gradient(ellipse at 70% 65%, rgba(255, 255, 255, 0.7) 0%, transparent 30%), radial-gradient(ellipse at 25% 75%, rgba(255, 255, 255, 0.75) 0%, transparent 28%)',
                }}
              />
            </div>

            {/* Fixed Day/Night Terminator Shade */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(130deg, transparent 45%, rgba(2, 6, 23, 0.5) 68%, rgba(2, 6, 23, 0.95) 92%)',
              }}
            />

            {/* Embedded Crest spinning around vertical Y-axis */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-75 mix-blend-screen z-15"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Earth Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[84%] h-[84%] object-contain rounded-full filter drop-shadow-[0_0_14px_#00e5ff]"
              />
            </div>

            {/* Atmospheric Limb Sheen */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none z-20"
              style={{
                boxShadow:
                  'inset 0 0 20px 4px rgba(0, 229, 255, 0.8), inset 0 0 45px rgba(255, 255, 255, 0.35)',
              }}
            />
          </div>
        </div>
      );

    case 'mars':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Red Atmospheric Haze */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-65 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, rgba(185, 28, 28, 0.35) 50%, transparent 75%)',
            }}
          />

          {/* Mars Sphere (Iron Oxide Regolith) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(239,68,68,0.7),inset_-18px_-18px_36px_rgba(30,5,5,0.95)] border border-red-500/50"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #f87171 0%, #ef4444 28%, #dc2626 55%, #991b1b 80%, #450a0a 100%)',
            }}
          >
            {/* North Polar Dry Ice Cap (+Y Pole) & South Polar Cap (-Y Pole) */}
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-12 h-4 rounded-b-full bg-white shadow-[0_0_10px_#ffffff] z-20" />
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-t-full bg-white/90 shadow-[0_0_8px_#ffffff] z-20" />

            {/* Martian Crust & Syrtis Major drifting horizontally along X around vertical Y-axis */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* Dark Basalt Plains */}
              <div
                className="absolute top-[42%] left-[22%] w-24 h-12 rounded-full bg-red-950/70 blur-[2px] -rotate-12"
                style={{
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)',
                }}
              />
              <div className="absolute top-[55%] right-[25%] w-16 h-8 rounded-full bg-red-950/60 blur-[1.5px] rotate-6" />

              {/* Olympus Mons Caldera Volcano Peak */}
              <div className="absolute top-[32%] right-[34%] w-6 h-6 rounded-full border border-amber-300/40 bg-red-900/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-200/80" />
              </div>

              {/* Embedded Logo */}
              <div className="absolute inset-0 flex items-center justify-center p-3 opacity-60 mix-blend-color-dodge">
                <img
                  src={logoTransparent}
                  alt="SWID-SHRK Mars Crest"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = logoFallback;
                  }}
                  className="w-[80%] h-[80%] object-contain rounded-full filter drop-shadow-[0_0_10px_#fca5a5]"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'jupiter':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Auroral UV Glow */}
          <div
            className="absolute -inset-8 rounded-full pointer-events-none opacity-60 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(217, 119, 6, 0.45) 0%, rgba(180, 83, 9, 0.3) 50%, rgba(124, 58, 237, 0.2) 75%, transparent 85%)',
            }}
          />

          {/* Jupiter Banded Gaseous Surface */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_40px_rgba(217,119,6,0.7),inset_-20px_-20px_40px_rgba(20,10,5,0.95)] border border-amber-500/50"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #fef3c7 0%, #fde68a 25%, #d97706 60%, #92400e 85%, #451a03 100%)',
            }}
          >
            {/* Horizontal Atmospheric Belts drifting along X around vertical Y-axis */}
            <div
              className="absolute inset-0 pointer-events-none opacity-80"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  rgba(120, 53, 15, 0.85) 0px,
                  rgba(120, 53, 15, 0.85) 12px,
                  rgba(254, 243, 199, 0.7) 12px,
                  rgba(254, 243, 199, 0.7) 24px,
                  rgba(180, 83, 9, 0.85) 24px,
                  rgba(180, 83, 9, 0.85) 36px,
                  rgba(253, 230, 138, 0.7) 36px,
                  rgba(253, 230, 138, 0.7) 48px
                )`,
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            />

            {/* The Great Red Spot drifting horizontally along X around the vertical Y-axis */}
            <div
              className="absolute bottom-[30%] left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${fastSpinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <div
                className="w-12 h-8 rounded-[50%] bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 border-2 border-red-300/80 shadow-[0_0_14px_#dc2626] flex items-center justify-center"
                style={{ transform: 'translateX(35px)' }}
              >
                <div className="w-5 h-3 rounded-[50%] bg-amber-200/90" />
              </div>
            </div>

            {/* Polar Aurora Rings centered on top and bottom vertical Y-poles */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-violet-400/70 blur-[1px] shadow-[0_0_8px_#a855f7] z-20" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-violet-400/70 blur-[1px] shadow-[0_0_8px_#a855f7] z-20" />

            {/* Embedded Crest spinning around vertical Y-axis */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-55 mix-blend-screen"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Jupiter Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_12px_#fde68a]"
              />
            </div>
          </div>
        </div>
      );

    case 'saturn':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Majestic 3D Tilted Ring System Behind Planet (Back Half) */}
          <div
            className="absolute w-[185%] sm:w-[210%] h-[55%] pointer-events-none z-0"
            style={{
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, 
                transparent 52%, 
                rgba(217, 180, 120, 0.6) 53%, 
                rgba(245, 222, 179, 0.95) 64%, 
                rgba(20, 15, 10, 0.9) 65%, 
                rgba(20, 15, 10, 0.9) 67%, 
                rgba(235, 205, 150, 0.95) 68%, 
                rgba(210, 175, 120, 0.75) 80%, 
                transparent 84%)`,
              boxShadow: '0 0 25px rgba(245, 222, 179, 0.45)',
            }}
          />

          {/* Saturn Gas Giant Sphere spinning around vertical Y-axis */}
          <div
            className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(234,179,8,0.6),inset_-18px_-18px_36px_rgba(40,25,5,0.92)] border border-amber-200/50"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #fef08a 0%, #fde047 30%, #eab308 60%, #ca8a04 82%, #713f12 100%)',
            }}
          >
            {/* Butterscotch Latitudinal Belts drifting along X around vertical Y-axis */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  rgba(161, 98, 7, 0.45) 0px,
                  rgba(161, 98, 7, 0.45) 8px,
                  rgba(254, 240, 138, 0.4) 8px,
                  rgba(254, 240, 138, 0.4) 16px
                )`,
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            />

            {/* Hexagonal Storm on North Pole (+Y Pole) */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 border border-amber-100/60 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-amber-400/40 z-20" />

            {/* Embedded Logo */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-65 mix-blend-color-dodge"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Saturn Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[80%] h-[80%] object-contain rounded-full filter drop-shadow-[0_0_12px_#fef08a]"
              />
            </div>
          </div>

          {/* Majestic 3D Tilted Ring System in Front of Planet (Front Half) */}
          <div
            className="absolute w-[185%] sm:w-[210%] h-[55%] pointer-events-none z-20"
            style={{
              borderRadius: '50%',
              clipPath: 'polygon(0% 48%, 100% 48%, 100% 100%, 0% 100%)',
              background: `radial-gradient(ellipse at center, 
                transparent 52%, 
                rgba(217, 180, 120, 0.6) 53%, 
                rgba(245, 222, 179, 0.95) 64%, 
                rgba(20, 15, 10, 0.9) 65%, 
                rgba(20, 15, 10, 0.9) 67%, 
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
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Cold Methane Glow */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-65 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(103, 232, 249, 0.5) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 75%)',
            }}
          />

          {/* Uranus Ice Giant Body */}
          <div
            className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.7),inset_-18px_-18px_36px_rgba(8,51,68,0.95)] border border-cyan-200/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #cffafe 0%, #a5f3fc 28%, #22d3ee 55%, #0891b2 80%, #155e75 100%)',
            }}
          >
            {/* Cloud features drifting horizontally around the vertical Y axis */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.4) 0px,
                  rgba(255, 255, 255, 0.4) 15px,
                  transparent 15px,
                  transparent 30px
                )`,
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            />

            {/* Embedded Logo */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-65 mix-blend-screen"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Uranus Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_12px_#67e8f9]"
              />
            </div>
          </div>
        </div>
      );

    case 'neptune':
      return (
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {warpOverlay}
          {verticalYAxisMarker}

          {/* Deep Azure Glow */}
          <div
            className="absolute -inset-7 rounded-full pointer-events-none opacity-75 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(29, 78, 216, 0.4) 50%, rgba(30, 27, 75, 0.2) 75%, transparent 85%)',
            }}
          />

          {/* Neptune Sphere (Dynamic Atmosphere) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.85),inset_-18px_-18px_38px_rgba(15,23,42,0.98)] border border-blue-400/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #60a5fa 0%, #3b82f6 30%, #1d4ed8 60%, #1e40af 82%, #172554 100%)',
            }}
          >
            {/* Supersonic Cirrus Cloud Streaks drifting horizontally along X around the vertical Y-axis */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: `celestial-spin-y ${fastSpinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <div
                className="absolute top-[32%] left-[18%] w-20 h-2 rounded-full bg-white/90 blur-[0.6px] shadow-[0_0_8px_#ffffff]"
              />
              <div
                className="absolute top-[68%] right-[22%] w-16 h-2 rounded-full bg-cyan-200/90 blur-[0.6px] shadow-[0_0_8px_#67e8f9]"
              />
              <div
                className="absolute top-[44%] right-[28%] w-10 h-7 rounded-full bg-blue-950/80 border border-blue-300/40 shadow-[inset_0_0_8px_#020617]"
              />
            </div>

            {/* Embedded Logo */}
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-70 mix-blend-screen"
              style={{
                animation: `celestial-spin-y ${spinDuration} linear infinite`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <img
                src={logoTransparent}
                alt="SWID-SHRK Neptune Crest"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logoFallback;
                }}
                className="w-[82%] h-[82%] object-contain rounded-full filter drop-shadow-[0_0_14px_#3b82f6]"
              />
            </div>
          </div>
        </div>
      );

    case 'blackhole':
    default:
      return null;
  }
};
