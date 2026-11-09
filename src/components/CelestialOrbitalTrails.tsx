import React, { useState } from 'react';
import { useCelestial } from '../context/CelestialContext';
import { CelestialBodyKey } from '../types';
import { Eye, EyeOff, Zap, Sliders, Sparkles, CircleDot } from 'lucide-react';
import { CelestialOrbitingMoons } from './CelestialOrbitingMoons';

interface CelestialOrbitalTrailsProps {
  className?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
}

export const CelestialOrbitalTrails: React.FC<CelestialOrbitalTrailsProps> = ({
  className = '',
  showControls = false,
}) => {
  const {
    activeBodyKey,
    orbitalTrails,
    orbitTrailsVisible,
    fadingTrailsVisible,
    moonsVisible,
    orbitAnimationSpeed,
    trailLengthMultiplier,
    focusedOrbitOnly,
    elapsedOrbitalTime,
    setCelestialBody,
    toggleOrbitTrails,
    toggleFadingTrails,
    toggleMoons,
    setOrbitAnimationSpeed,
    setTrailLengthMultiplier,
    toggleFocusedOrbitOnly,
    getPlanetPosition,
    getPlanetTrailSegments,
  } = useCelestial();

  const [hoveredBodyKey, setHoveredBodyKey] = useState<CelestialBodyKey | null>(null);

  if (!orbitTrailsVisible) {
    return null;
  }

  // Filter which trails to render based on focusedOrbitOnly
  const visibleTrails = focusedOrbitOnly
    ? orbitalTrails.filter((t) => t.key === activeBodyKey)
    : orbitalTrails;

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible select-none ${className}`}
      aria-hidden="true"
    >
      {/* Dynamic SVG Layer for Persistent Glowing Ellipses & Fading Motion Trails */}
      <svg
        className="w-full h-full absolute inset-0 overflow-visible"
        viewBox="-480 -320 960 640"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Deep Luminous Bloom Filter */}
          <filter id="orbitTrailGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense Active Orbit Beacon Filter */}
          <filter id="orbitBeaconGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients for each celestial body */}
          {orbitalTrails.map((trail) => (
            <radialGradient
              key={`grad-${trail.key}`}
              id={`beacon-grad-${trail.key}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor={trail.glowColor} stopOpacity="0.9" />
              <stop offset="80%" stopColor={trail.strokeColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor={trail.glowColor} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* ========================================================================= */}
        {/* RENDER ORBIT TRACKS & FAINT FADING MOTION TRAILS BEHIND MOVING PLANETS   */}
        {/* ========================================================================= */}
        <g
          className="transition-opacity duration-500"
          filter={activeBodyKey === 'blackhole' ? 'url(#blackHoleGravitationalLensing)' : undefined}
        >
          {visibleTrails.map((trail) => {
            const isActive = trail.key === activeBodyKey;
            const isHovered = trail.key === hoveredBodyKey;
            const pos = getPlanetPosition(trail.key, elapsedOrbitalTime);

            // Opacity & Stroke Width math for high-fidelity Keplerian look
            const baseOpacity = isActive ? 0.95 : isHovered ? 0.75 : 0.28;
            const strokeWidth = isActive ? 2.4 : isHovered ? 1.8 : 1.1;

            // Generate fading trail segments trailing behind the moving planet
            const trailSegments = fadingTrailsVisible
              ? getPlanetTrailSegments(trail.key, elapsedOrbitalTime)
              : [];

            return (
              <g
                key={trail.key}
                className="pointer-events-auto cursor-pointer group/orbit"
                onClick={(e) => {
                  e.stopPropagation();
                  setCelestialBody(trail.key);
                }}
                onMouseEnter={() => setHoveredBodyKey(trail.key)}
                onMouseLeave={() => setHoveredBodyKey(null)}
              >
                {/* 1. Underlying Deep Ambient Elliptical Glow */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={trail.semiMajorAxis}
                  ry={trail.semiMinorAxis}
                  transform={`rotate(${trail.inclinationDeg})`}
                  fill="none"
                  stroke={trail.glowColor}
                  strokeWidth={strokeWidth + 4}
                  opacity={isActive ? 0.45 : isHovered ? 0.35 : 0.12}
                  filter="url(#orbitTrailGlow)"
                  className="transition-all duration-300"
                />

                {/* 2. Persistent Crisp Core Elliptical Path */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={trail.semiMajorAxis}
                  ry={trail.semiMinorAxis}
                  transform={`rotate(${trail.inclinationDeg})`}
                  fill="none"
                  stroke={isActive ? trail.glowColor : trail.strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isActive ? 'none' : '4 3'}
                  opacity={baseOpacity}
                  className="transition-all duration-300"
                />

                {/* 3. Faint, Fading SVG Path Behind Planet Movement (Orbital Motion Trail) */}
                {fadingTrailsVisible && trailSegments.length > 0 && (
                  <g className="pointer-events-none">
                    {/* 3a. Diffuse Ambient Luminous Bloom Trail */}
                    <g filter="url(#orbitTrailGlow)">
                      {trailSegments.map((seg, sIdx) => (
                        <line
                          key={`wake-glow-${trail.key}-${sIdx}`}
                          x1={seg.x1}
                          y1={seg.y1}
                          x2={seg.x2}
                          y2={seg.y2}
                          stroke={trail.glowColor}
                          strokeWidth={seg.width * (isActive ? 3.2 : 2.4)}
                          strokeOpacity={seg.alpha * (isActive ? 0.65 : isHovered ? 0.45 : 0.22)}
                          strokeLinecap="round"
                        />
                      ))}
                    </g>

                    {/* 3b. Crisp High-Resolution Core Fading Arc Ribbon */}
                    <g>
                      {trailSegments.map((seg, sIdx) => (
                        <line
                          key={`wake-core-${trail.key}-${sIdx}`}
                          x1={seg.x1}
                          y1={seg.y1}
                          x2={seg.x2}
                          y2={seg.y2}
                          stroke={isActive ? '#ffffff' : trail.glowColor}
                          strokeWidth={seg.width * (isActive ? 1.4 : 1.1)}
                          strokeOpacity={seg.alpha * (isActive ? 0.95 : isHovered ? 0.8 : 0.55)}
                          strokeLinecap="round"
                        />
                      ))}
                    </g>

                    {/* 3c. Luminous Micro-Stardust Sparks trailing in the planet's wake */}
                    {(isActive || isHovered) && (
                      <g filter="url(#orbitTrailGlow)">
                        {[4, 9, 14].map((segIdx) => {
                          const seg = trailSegments[segIdx];
                          if (!seg) return null;
                          return (
                            <circle
                              key={`stardust-${trail.key}-${segIdx}`}
                              cx={seg.x2}
                              cy={seg.y2}
                              r={isActive ? 1.8 : 1.2}
                              fill="#ffffff"
                              opacity={seg.alpha * 0.9}
                            />
                          );
                        })}
                      </g>
                    )}
                  </g>
                )}

                {/* 4. Active Orbit Pulsing Traveling Photon Wave */}
                {isActive && (
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={trail.semiMajorAxis}
                    ry={trail.semiMinorAxis}
                    transform={`rotate(${trail.inclinationDeg})`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={1.8}
                    strokeDasharray="28 140"
                    strokeDashoffset={-elapsedOrbitalTime * 70}
                    opacity={0.85}
                    filter="url(#orbitTrailGlow)"
                  />
                )}

                {/* 5. Revolving Planet Node on the Elliptical Trail */}
                <g transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* Orbiting Moons / Satellites revolving around this planet */}
                  {moonsVisible && (
                    <CelestialOrbitingMoons
                      planetKey={trail.key}
                      elapsedTime={elapsedOrbitalTime}
                      scale={isActive ? 1.25 : 1.0}
                      showOrbits={isActive || isHovered}
                      isParentActive={isActive}
                    />
                  )}

                  {/* Outer Pulsing Halo */}
                  <circle
                    r={isActive ? 12 : isHovered ? 9 : 6}
                    fill={`url(#beacon-grad-${trail.key})`}
                    filter="url(#orbitBeaconGlow)"
                    opacity={isActive ? 0.95 : 0.65}
                    className="transition-all duration-300"
                  />

                  {/* Core Planet Bead */}
                  <circle
                    r={isActive ? 5.5 : isHovered ? 4.5 : 3}
                    fill={isActive ? '#ffffff' : trail.glowColor}
                    stroke={trail.strokeColor}
                    strokeWidth={1}
                    className="transition-all duration-200"
                  />

                  {/* Active Planet Core Ping */}
                  {isActive && (
                    <circle
                      r={7}
                      fill="none"
                      stroke={trail.glowColor}
                      strokeWidth={1.5}
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Minimal Orbit Node Label when Hovered or Active */}
                  {(isActive || isHovered) && (
                    <g
                      transform="translate(10, -10)"
                      className="transition-all duration-200 pointer-events-none"
                    >
                      <rect
                        x="-4"
                        y="-12"
                        width={trail.name.length * 6.5 + 16}
                        height="18"
                        rx="4"
                        className="fill-black/90 stroke-zinc-700/80"
                        strokeWidth="1"
                      />
                      <text
                        x="4"
                        y="1"
                        fill={trail.glowColor}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        letterSpacing="0.05em"
                      >
                        {trail.name.split(' ')[0]}
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Discrete Quick Controls Floating Overlay in Corner */}
      {showControls && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 pointer-events-auto">
          {/* Fading Motion Trails Toggle */}
          <button
            onClick={toggleFadingTrails}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer backdrop-blur-md border ${
              fadingTrailsVisible
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                : 'bg-black/75 border-zinc-700/80 text-zinc-400 hover:text-white'
            }`}
            title={fadingTrailsVisible ? 'Disable Faint Fading Orbital Trails' : 'Enable Faint Fading Orbital Trails'}
          >
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>Trail: {fadingTrailsVisible ? 'ON' : 'OFF'}</span>
          </button>

          {/* Trail Length Multiplier (Cycles: 1x -> 1.5x -> 2x -> 0.6x) */}
          {fadingTrailsVisible && (
            <button
              onClick={() => {
                const multipliers = [1.0, 1.5, 2.0, 0.6];
                const nextIdx = (multipliers.indexOf(trailLengthMultiplier) + 1) % multipliers.length;
                setTrailLengthMultiplier(multipliers[nextIdx]);
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 border border-zinc-700/80 text-zinc-300 hover:text-cyan-300 transition-colors cursor-pointer backdrop-blur-md"
              title="Cycle Trail Length Multiplier"
            >
              <span>{trailLengthMultiplier}x L</span>
            </button>
          )}

          {/* Orbiting Moons Toggle */}
          <button
            onClick={toggleMoons}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer backdrop-blur-md border ${
              moonsVisible
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                : 'bg-black/75 border-zinc-700/80 text-zinc-400 hover:text-white'
            }`}
            title={moonsVisible ? 'Disable Dynamic Orbiting Moons' : 'Enable Dynamic Orbiting Moons'}
          >
            <CircleDot className="w-2.5 h-2.5 text-amber-400" />
            <span>Moons: {moonsVisible ? 'ON' : 'OFF'}</span>
          </button>

          {/* Focused vs All Orbits Toggle */}
          <button
            onClick={toggleFocusedOrbitOnly}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer backdrop-blur-md border ${
              focusedOrbitOnly
                ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                : 'bg-black/75 border-zinc-700/80 text-zinc-300 hover:text-white'
            }`}
            title={focusedOrbitOnly ? 'Show All 10 Planetary Orbit Trails' : 'Focus Only on Active Planet Orbit Trail'}
          >
            {focusedOrbitOnly ? 'Orbit: Focused' : 'Orbits: All'}
          </button>

          {/* Speed Selector (Cycles: 0.5x -> 1.0x -> 2.0x) */}
          <button
            onClick={() => {
              const speeds = [0.5, 1.0, 2.0];
              const nextIdx = (speeds.indexOf(orbitAnimationSpeed) + 1) % speeds.length;
              setOrbitAnimationSpeed(speeds[nextIdx]);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 border border-zinc-700/80 text-zinc-300 hover:text-[#00ff41] transition-colors cursor-pointer backdrop-blur-md"
            title="Cycle Orbital Speed"
          >
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            <span>{orbitAnimationSpeed}x</span>
          </button>

          {/* Hide Trails Toggle */}
          <button
            onClick={toggleOrbitTrails}
            className="p-1 rounded text-[10px] font-mono font-bold bg-black/75 border border-zinc-700/80 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer backdrop-blur-md"
            title="Hide Orbital Trails"
            aria-label="Hide Orbital Trails"
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
