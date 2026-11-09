import React, { useState } from 'react';
import { CelestialBodyKey, CelestialMoonConfig } from '../types';
import { useCelestial } from '../context/CelestialContext';
import {
  calculateMoonPosition,
  calculateMoonTrailSegments,
  getMoonsForPlanet,
} from '../utils/celestialBodies';

interface CelestialOrbitingMoonsProps {
  planetKey: CelestialBodyKey;
  elapsedTime?: number;
  scale?: number;
  showOrbits?: boolean;
  showLabels?: boolean;
  isParentActive?: boolean;
  className?: string;
}

export const CelestialOrbitingMoons: React.FC<CelestialOrbitingMoonsProps> = ({
  planetKey,
  elapsedTime,
  scale = 1.0,
  showOrbits = true,
  showLabels = false,
  isParentActive = false,
  className = '',
}) => {
  const {
    elapsedOrbitalTime,
    orbitAnimationSpeed,
    moonsVisible,
    fadingTrailsVisible,
  } = useCelestial();

  const [hoveredMoonId, setHoveredMoonId] = useState<string | null>(null);

  if (!moonsVisible) return null;

  const moons = getMoonsForPlanet(planetKey);
  if (!moons || moons.length === 0) return null;

  const timeToUse = elapsedTime !== undefined ? elapsedTime : elapsedOrbitalTime;

  return (
    <g className={`celestial-moons-system pointer-events-auto ${className}`}>
      {moons.map((moon: CelestialMoonConfig) => {
        const isHovered = hoveredMoonId === moon.id;
        const pos = calculateMoonPosition(moon, timeToUse, orbitAnimationSpeed);
        const trailSegments = (moon.hasTrail !== false && fadingTrailsVisible)
          ? calculateMoonTrailSegments(moon, pos.angleRad, isParentActive ? 65 : 45, 8)
          : [];

        // Apparent 3D perspective sizing & opacity
        const depthMultiplier = pos.isForeground ? 1.15 : 0.85;
        const depthOpacity = pos.isForeground ? 1.0 : 0.65;
        const moonRadius = moon.radius * scale * depthMultiplier;

        const effectiveX = pos.x * scale;
        const effectiveY = pos.y * scale;

        return (
          <g
            key={moon.id}
            className="cursor-pointer group/moon"
            onMouseEnter={() => setHoveredMoonId(moon.id)}
            onMouseLeave={() => setHoveredMoonId(null)}
          >
            {/* 1. Local Elliptical Orbit Track for this Satellite */}
            {showOrbits && (
              <ellipse
                cx="0"
                cy="0"
                rx={moon.semiMajorAxis * scale}
                ry={moon.semiMinorAxis * scale}
                transform={`rotate(${moon.inclinationDeg})`}
                fill="none"
                stroke={isHovered ? moon.glowColor : moon.color}
                strokeWidth={isHovered ? 1.2 : 0.75}
                strokeDasharray={isHovered ? 'none' : '2 3'}
                strokeOpacity={isHovered ? 0.75 : isParentActive ? 0.45 : 0.22}
                className="transition-all duration-300 pointer-events-none"
              />
            )}

            {/* 2. Faint Fading SVG Motion Wake behind the Moon's revolution */}
            {trailSegments.length > 0 && (
              <g className="pointer-events-none">
                {trailSegments.map((seg, sIdx) => (
                  <line
                    key={`moon-trail-${moon.id}-${sIdx}`}
                    x1={seg.x1 * scale}
                    y1={seg.y1 * scale}
                    x2={seg.x2 * scale}
                    y2={seg.y2 * scale}
                    stroke={moon.glowColor || moon.color}
                    strokeWidth={Math.max(0.6, seg.width * scale * 0.75)}
                    strokeOpacity={seg.alpha * depthOpacity * (isHovered ? 0.9 : 0.6)}
                    strokeLinecap="round"
                  />
                ))}
              </g>
            )}

            {/* 3. The Orbiting Moon Bead */}
            <g transform={`translate(${effectiveX}, ${effectiveY})`}>
              {/* Outer Glow Halo */}
              <circle
                r={moonRadius * 2.4}
                fill={moon.glowColor || moon.color}
                opacity={(isHovered ? 0.8 : isParentActive ? 0.5 : 0.3) * depthOpacity}
                filter="url(#orbitTrailGlow)"
                className="transition-opacity duration-200"
              />

              {/* Core Satellite Body */}
              <circle
                r={moonRadius}
                fill={moon.color}
                stroke={isHovered ? '#ffffff' : moon.glowColor}
                strokeWidth={0.65}
                opacity={depthOpacity}
                className="transition-transform duration-200"
              />

              {/* Ping Ring on Hover */}
              {isHovered && (
                <circle
                  r={moonRadius * 2.8}
                  fill="none"
                  stroke={moon.glowColor}
                  strokeWidth={0.8}
                  className="animate-ping opacity-80"
                />
              )}

              {/* Interactive Tooltip Badge for Satellite */}
              {(isHovered || showLabels) && (
                <g
                  transform="translate(8, -8)"
                  className="transition-all duration-200 pointer-events-none z-50 select-none"
                >
                  <rect
                    x="-3"
                    y="-10"
                    width={moon.name.length * 5.5 + 14}
                    height="16"
                    rx="3"
                    className="fill-black/95 stroke-zinc-700/90"
                    strokeWidth="0.8"
                  />
                  <text
                    x="4"
                    y="1"
                    fill={moon.color}
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.04em"
                  >
                    {moon.name}
                  </text>
                </g>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
};
