import React from 'react';
import { CelestialBodyKey } from '../types';
import logoTransparent from '../assets/logo.jpg';
import logoFallback from '../assets/logo.jpg';

interface CelestialPlanetViewProps {
  bodyKey: CelestialBodyKey;
  isHovered?: boolean;
  flareActive?: boolean;
}

export const CelestialPlanetView: React.FC<CelestialPlanetViewProps> = ({
  bodyKey,
  isHovered = false,
  flareActive = false,
}) => {
  switch (bodyKey) {
    case 'sun':
      return (
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Intense Solar Corona Halo Glow */}
          <div
            className={`absolute -inset-10 sm:-inset-16 rounded-full pointer-events-none transition-all duration-700 blur-2xl ${
              isHovered || flareActive ? 'opacity-95 scale-110' : 'opacity-80 scale-100'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(255, 235, 59, 0.9) 0%, rgba(255, 152, 0, 0.75) 45%, rgba(244, 67, 54, 0.4) 70%, transparent 85%)',
            }}
          />

          {/* Dynamic Coronal Mass Ejection Loops (Prominence Arcs) */}
          <div className="absolute inset-[-14%] rounded-full pointer-events-none animate-solar-prominence">
            {/* Top-right loop */}
            <div
              className="absolute top-1 right-5 w-16 h-16 rounded-full border-2 border-amber-300 opacity-80 blur-[1px]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 0)',
                filter: 'drop-shadow(0 0 10px #ff9800)',
              }}
            />
            {/* Bottom-left loop */}
            <div
              className="absolute bottom-2 left-4 w-20 h-20 rounded-full border-2 border-orange-400 opacity-75 blur-[1px]"
              style={{
                clipPath: 'polygon(0 50%, 100% 100%, 0 100%)',
                filter: 'drop-shadow(0 0 12px #ff5722)',
              }}
            />
            {/* Left prominence arc */}
            <div
              className="absolute top-12 -left-3 w-14 h-14 rounded-full border-2 border-yellow-200 opacity-90 blur-[0.8px]"
              style={{
                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 50%)',
                filter: 'drop-shadow(0 0 8px #ffeb3b)',
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
            {/* Granulation & Solar Plasma Turbulence Layers */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-color-burn animate-[plasmaStream_24s_linear_infinite]"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 30%, rgba(216, 67, 21, 0.6) 70%, rgba(191, 54, 12, 0.9) 100%)',
              }}
            />

            {/* Embossed Golden SWID-SHRK Crest on the Sun */}
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-90 mix-blend-screen">
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
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Faint Solar Glare on Sunward Limb */}
          <div
            className="absolute -inset-4 rounded-full pointer-events-none opacity-40 blur-lg"
            style={{
              background:
                'radial-gradient(circle at 25% 25%, rgba(255, 235, 150, 0.5) 0%, transparent 60%)',
            }}
          />

          {/* Mercury Rocky Body with Caloris Basin Impact Craters */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_25px_rgba(180,180,195,0.4),inset_-18px_-18px_40px_rgba(0,0,0,0.92)] border border-slate-500/50"
            style={{
              background:
                'radial-gradient(circle at 32% 30%, #e2e8f0 0%, #94a3b8 32%, #64748b 60%, #334155 82%, #0f172a 100%)',
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

            {/* Terminator Line (Day/Night Contrast) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-85"
              style={{
                background:
                  'linear-gradient(135deg, transparent 40%, rgba(15, 23, 42, 0.6) 65%, rgba(2, 6, 23, 0.98) 90%)',
              }}
            />

            {/* Central Scientific Seal */}
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
        </div>
      );

    case 'venus':
      return (
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Dense Supercritical Golden Atmosphere Glow */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-70 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 213, 79, 0.5) 0%, rgba(255, 160, 0, 0.3) 50%, transparent 75%)',
            }}
          />

          {/* Venus Cloud Sphere with Swirling Sulfuric Acid Decks */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(255,193,7,0.65),inset_-16px_-16px_36px_rgba(62,39,35,0.95)] border border-amber-300/40"
            style={{
              background:
                'radial-gradient(circle at 35% 32%, #fff9c4 0%, #ffe082 25%, #ffb74d 50%, #f57c00 75%, #5d4037 100%)',
            }}
          >
            {/* Swirling Acid Cloud Wave Bands */}
            <div
              className="absolute inset-0 opacity-55 animate-[plasmaStream_18s_linear_infinite]"
              style={{
                background:
                  'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255, 238, 88, 0.3) 15px, rgba(230, 81, 0, 0.25) 30px)',
              }}
            />

            {/* Volcanic Lightning Flicker Discharge in Atmosphere */}
            <div className="absolute top-[35%] left-[42%] w-2 h-2 rounded-full bg-amber-100 animate-ping opacity-75" />
            <div className="absolute top-[65%] left-[28%] w-1.5 h-1.5 rounded-full bg-white animate-pulse opacity-85" />

            {/* Embedded Logo */}
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-60 mix-blend-color-dodge">
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
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Luminous Atmospheric Rayleigh Scattering Rim (Cyan Corona) */}
          <div
            className={`absolute -inset-7 sm:-inset-10 rounded-full pointer-events-none transition-all duration-500 blur-xl ${
              isHovered ? 'opacity-95 scale-110' : 'opacity-80 scale-100'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(0, 229, 255, 0.45) 0%, rgba(33, 150, 243, 0.35) 45%, rgba(0, 255, 65, 0.15) 65%, transparent 80%)',
            }}
          />

          {/* 3D Orbiting Moon (Luna) with Elliptical Orbit Track */}
          <div className="absolute inset-[-18%] pointer-events-none rounded-full flex items-center justify-center border border-cyan-400/25">
            <div className="absolute w-5 h-5 rounded-full bg-slate-200 border border-white shadow-[0_0_10px_#ffffff] animate-celestial-moon">
              {/* Moon Cratering texture */}
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
            {/* Continents (Topography Layer - Africa, Eurasia, Americas) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Eurasia / Africa Mass */}
              <path
                d="M 28,22 Q 40,15 54,20 Q 65,24 62,35 Q 58,45 68,52 Q 74,62 65,72 Q 52,78 45,68 Q 38,62 32,68 Q 24,60 28,45 Q 22,32 28,22 Z"
                fill="#16a34a"
                opacity="0.8"
              />
              <path
                d="M 32,25 Q 42,20 50,26 Q 58,32 52,42 Q 44,48 38,40 Z"
                fill="#84cc16"
                opacity="0.9"
              />
              {/* Saharan desert gold */}
              <path
                d="M 40,40 Q 52,38 56,46 Q 50,54 42,50 Z"
                fill="#d97706"
                opacity="0.75"
              />
              {/* Americas silhouette */}
              <path
                d="M 12,24 Q 18,20 16,36 Q 14,48 22,54 Q 24,68 18,78 Q 12,70 14,56 Q 8,42 12,24 Z"
                fill="#15803d"
                opacity="0.7"
              />
            </svg>

            {/* Dynamic Swirling Clouds & Cyclone Formations */}
            <div
              className="absolute inset-0 pointer-events-none opacity-65 animate-[plasmaStream_32s_linear_infinite]"
              style={{
                background:
                  'radial-gradient(ellipse at 40% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 35%), radial-gradient(ellipse at 70% 65%, rgba(255, 255, 255, 0.7) 0%, transparent 30%), radial-gradient(ellipse at 25% 75%, rgba(255, 255, 255, 0.75) 0%, transparent 28%)',
              }}
            />

            {/* Terminator Shade (Night Side) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(130deg, transparent 45%, rgba(2, 6, 23, 0.5) 68%, rgba(2, 6, 23, 0.95) 92%)',
              }}
            />

            {/* Embedded High-Tech Lab Crest */}
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-75 mix-blend-screen">
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
              className="absolute inset-0 rounded-full pointer-events-none"
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
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Salmon / Red Atmospheric Haze */}
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
            {/* North Polar Dry Ice Cap (Brilliant White CO2 Ice) */}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-6 rounded-b-full bg-white shadow-[0_0_12px_#ffffff]"
              style={{
                filter: 'drop-shadow(0 2px 6px rgba(255, 255, 255, 0.9))',
              }}
            />

            {/* Dark Basalt Plains (Syrtis Major & Valles Marineris) */}
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
      );

    case 'jupiter':
      return (
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Jovian Auroral Polar Rings & Magnetosphere Glow */}
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
            {/* Atmospheric Zones & Belts (Horizontal Turbulent Bands) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-75"
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
              }}
            />

            {/* The Great Red Spot (Iconic Cyclonic Vortex) */}
            <div
              className="absolute bottom-[30%] right-[22%] w-12 h-8 rounded-[50%] bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 border-2 border-red-300/80 shadow-[0_0_12px_#dc2626] animate-jupiter-vortex flex items-center justify-center"
            >
              <div className="w-5 h-3 rounded-[50%] bg-amber-200/90" />
            </div>

            {/* Polar Aurora Rings (UV Glow) */}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-violet-400/60 blur-[1px] shadow-[0_0_8px_#a855f7]"
            />
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-violet-400/60 blur-[1px] shadow-[0_0_8px_#a855f7]"
            />

            {/* Embedded Crest */}
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-55 mix-blend-screen">
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
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Majestic 3D Tilted Ring System Behind Planet (Back Half) */}
          <div
            className="absolute w-[185%] sm:w-[210%] h-[55%] pointer-events-none animate-saturn-rings z-0"
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

          {/* Saturn Gas Giant Sphere */}
          <div
            className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(234,179,8,0.6),inset_-18px_-18px_36px_rgba(40,25,5,0.92)] border border-amber-200/50"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #fef08a 0%, #fde047 30%, #eab308 60%, #ca8a04 82%, #713f12 100%)',
            }}
          >
            {/* Soft Butterscotch Latitudinal Cloud Belts */}
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
              }}
            />

            {/* Planet Shadow Cast onto the Ring Behind */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(115deg, transparent 55%, rgba(0, 0, 0, 0.6) 75%, rgba(0, 0, 0, 0.92) 95%)',
              }}
            />

            {/* Hexagonal North Pole Storm */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 border border-amber-100/60 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-amber-400/40" />

            {/* Embedded Logo */}
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-65 mix-blend-color-dodge">
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
            className="absolute w-[185%] sm:w-[210%] h-[55%] pointer-events-none animate-saturn-rings z-20"
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
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Pale Cyan / Aquamarine Cold Methane Glow */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none opacity-65 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(103, 232, 249, 0.5) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 75%)',
            }}
          />

          {/* Vertical Faint Ring System (98° Axial Tilt) */}
          <div
            className="absolute w-[45%] h-[180%] rounded-[50%] pointer-events-none border-2 border-cyan-300/40 opacity-70 -rotate-12 blur-[0.5px]"
            style={{
              boxShadow: '0 0 15px rgba(103, 232, 249, 0.5)',
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
            {/* Subtle Tilted Roll Cloud Features */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 rotate-90"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  rgba(255, 255, 255, 0.4) 0px,
                  rgba(255, 255, 255, 0.4) 15px,
                  transparent 15px,
                  transparent 30px
                )`,
              }}
            />

            {/* Embedded Logo */}
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-65 mix-blend-screen">
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
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible select-none animate-celestial-morph">
          {/* Deep Azure / Radiant Royal Blue Glow */}
          <div
            className="absolute -inset-7 rounded-full pointer-events-none opacity-75 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(29, 78, 216, 0.4) 50%, rgba(30, 27, 75, 0.2) 75%, transparent 85%)',
            }}
          />

          {/* Neptune Sphere (Dynamic Supersonic Atmosphere) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.85),inset_-18px_-18px_38px_rgba(15,23,42,0.98)] border border-blue-400/60"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #60a5fa 0%, #3b82f6 30%, #1d4ed8 60%, #1e40af 82%, #172554 100%)',
            }}
          >
            {/* Supersonic White Methane Cirrus Cloud Streaks ("Scooter") */}
            <div
              className="absolute top-[32%] left-[18%] w-20 h-2 rounded-full bg-white/90 blur-[0.6px] shadow-[0_0_8px_#ffffff] -rotate-6"
            />
            <div
              className="absolute top-[68%] right-[22%] w-16 h-2 rounded-full bg-cyan-200/90 blur-[0.6px] shadow-[0_0_8px_#67e8f9] rotate-3"
            />

            {/* Great Dark Spot (Supersonic Storm Vortex) */}
            <div
              className="absolute top-[44%] right-[28%] w-10 h-7 rounded-full bg-blue-950/80 border border-blue-300/40 shadow-[inset_0_0_8px_#020617]"
            />

            {/* Embedded Logo */}
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-70 mix-blend-screen">
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
      return null; // Handled directly in BlackHoleLogoCrest for the signature singularity
  }
};
