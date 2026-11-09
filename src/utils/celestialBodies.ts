import {
  CelestialBodyKey,
  CelestialBodyInfo,
  PlanetaryOrbitTrailConfig,
  OrbitTrailSegment,
  CelestialMoonConfig,
} from '../types';

export const CELESTIAL_ORDER: CelestialBodyKey[] = [
  'blackhole',
  'sun',
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
];

export const CELESTIAL_BODIES: Record<CelestialBodyKey, CelestialBodyInfo> = {
  blackhole: {
    key: 'blackhole',
    name: 'Event Horizon (Sagittarius A*)',
    astronomicalSymbol: '🕳️',
    orderIndex: 0,
    classification: 'Supermassive Black Hole Event Horizon & Photon Sphere',
    distanceFromSun: 'Center of Milky Way (~26,000 ly)',
    orbitalPeriod: 'Static Kerr-Newman Geodesic',
    surfaceTemp: '1.4 × 10⁻¹⁴ K (Hawking Radiation)',
    diameter: 'Rs ≈ 24,000,000 km (Event Horizon Radius)',
    labDomain: 'Relativistic Spacetime Curvature & Extreme Continuum Mechanics',
    capability: {
      title: 'Relativistic Event Horizon & Gravitational Lensing',
      description:
        'Infinite spacetime curvature boundary where escape velocity equals the speed of light c, framed by the razor-sharp photon ring and relativistic Doppler-boosted accretion disk.',
      buttonText: 'Pulse Gravitational Wave Shockwave ⚡',
      badge: 'Supermassive Event Horizon',
    },
  },
  sun: {
    key: 'sun',
    name: 'The Sun (Sol)',
    astronomicalSymbol: '☉',
    orderIndex: 1,
    classification: 'G-Type Main-Sequence Yellow Dwarf',
    distanceFromSun: 'Center of Solar System (0.00 AU)',
    orbitalPeriod: 'Galactic Orbit: 230 Million Years',
    surfaceTemp: '5,778 K (Photosphere) / 1.5 × 10⁷ K (Core)',
    diameter: '1,392,700 km (109 × Earth)',
    labDomain: 'High-Temperature Aerothermodynamics & Extreme Thermal Shock',
    capability: {
      title: 'Solar Flare & Extreme Thermal Shockwave',
      description:
        'Simulates sudden thermal transients (>1200°C/s) and high-heat radiation fluxes matching atmospheric re-entry envelopes.',
      buttonText: 'Trigger Solar Thermal Flare 🔥',
      targetTab: 'research',
      badge: 'Central Star (Sol)',
    },
  },
  mercury: {
    key: 'mercury',
    name: 'Mercury',
    astronomicalSymbol: '☿',
    orderIndex: 2,
    classification: 'Dense Metallic Terrestrial Planet',
    distanceFromSun: '57.91 Million km (0.387 AU)',
    orbitalPeriod: '87.97 Earth Days (Fastest Orbit)',
    surfaceTemp: '-180°C (Night) to +430°C (Day)',
    diameter: '4,879 km (0.38 × Earth)',
    labDomain: 'Multiaxial Thermal Fatigue in Functionally Graded Cylinders',
    capability: {
      title: 'Caloris Basin Impact Shock Analysis',
      description:
        'Evaluates multiaxial thermal fatigue and cyclic stress concentrations under severe 600°C day-to-night temperature swings.',
      buttonText: 'Inspect Thermal Fatigue Models 📊',
      targetTab: 'research',
      badge: '1st Planet from Sun',
    },
  },
  venus: {
    key: 'venus',
    name: 'Venus',
    astronomicalSymbol: '♀',
    orderIndex: 3,
    classification: 'Supercritical Terrestrial Greenhouse Planet',
    distanceFromSun: '108.2 Million km (0.723 AU)',
    orbitalPeriod: '224.7 Earth Days (Retrograde Spin)',
    surfaceTemp: '465°C (Mean Surface Temp)',
    diameter: '12,104 km (0.95 × Earth)',
    labDomain: 'Supercritical High-Pressure Vessels & Thick-Walled Cylinders',
    capability: {
      title: 'Hyperbaric Thick-Walled Vessel Solver',
      description:
        'Calculates non-linear hoop and radial stresses under 92 bar supercritical CO₂ atmospheric collapse pressure using Lamé thick-shell theory.',
      buttonText: 'Inspect 92-Bar Autoclave Vessels 🛡️',
      targetTab: 'qa',
      badge: '2nd Planet from Sun',
    },
  },
  earth: {
    key: 'earth',
    name: 'Earth (The Blue Marble & Moon)',
    astronomicalSymbol: '♁',
    orderIndex: 4,
    classification: 'Habitable Biosphere & Engineering Research Hub',
    distanceFromSun: '149.6 Million km (1.000 AU)',
    orbitalPeriod: '365.25 Earth Days (1.00 Year)',
    surfaceTemp: '15°C Mean (-89°C to +57°C)',
    diameter: '12,742 km (Home of SWID-SHRK)',
    labDomain: 'Global Biomechanics & Advanced Metamaterials Research Hub',
    capability: {
      title: 'Explore Research Domains & Engineering Modules',
      description:
        'Explore the full spectrum of SWID-SHRK mechanical investigations: multiaxial fatigue, neural biomechanics, cellular metamaterials, and dynamic crashworthiness.',
      buttonText: 'Launch Research Hub ↗',
      targetTab: 'research',
      isExternalOrNewTab: true,
      badge: '3rd Planet • Research Hub',
    },
  },
  mars: {
    key: 'mars',
    name: 'Mars (The Red Planet)',
    astronomicalSymbol: '♂',
    orderIndex: 5,
    classification: 'Silicate Desert Terrestrial Planet',
    distanceFromSun: '227.9 Million km (1.524 AU)',
    orbitalPeriod: '687 Earth Days (1.88 Years)',
    surfaceTemp: '-63°C Mean (-140°C to +20°C)',
    diameter: '6,779 km (0.53 × Earth)',
    labDomain: 'Hypervelocity Meteoroid Shielding & Ballistic Drop-Tower Testing',
    capability: {
      title: 'Hypervelocity Ballistic Impact & Penetration Solver',
      description:
        'Simulates high-strain-rate crater formation and energy dissipation through cellular shielding using Split-Hopkinson Bar data.',
      buttonText: 'Open Split-Hopkinson & Drop Tower Lab 🎯',
      targetTab: 'gear',
      badge: '4th Planet from Sun',
    },
  },
  jupiter: {
    key: 'jupiter',
    name: 'Jupiter (The Gas Giant)',
    astronomicalSymbol: '♃',
    orderIndex: 6,
    classification: 'Jovian Gas Giant (Hydrogen / Helium)',
    distanceFromSun: '778.5 Million km (5.204 AU)',
    orbitalPeriod: '11.86 Earth Years',
    surfaceTemp: '-110°C (1 Bar Cloud Top)',
    diameter: '139,820 km (11.2 × Earth)',
    labDomain: 'High-Strain-Rate Non-Linear Dynamics & Abaqus Explicit Formulations',
    capability: {
      title: 'Great Red Spot Non-Linear Vortex & Abaqus Explicit Solver',
      description:
        'Deconstructs large-deformation shear bands and rotational velocity vortex fields using vectorized user subroutines (VUMAT).',
      buttonText: 'Open Abaqus Explicit Simulations 🌀',
      targetTab: 'abaqus',
      badge: '5th Planet from Sun',
    },
  },
  saturn: {
    key: 'saturn',
    name: 'Saturn (The Ringed Wonder)',
    astronomicalSymbol: '♄',
    orderIndex: 7,
    classification: 'Ringed Gas Giant (Cassini Division)',
    distanceFromSun: '1.434 Billion km (9.582 AU)',
    orbitalPeriod: '29.45 Earth Years',
    surfaceTemp: '-140°C (Cloud Deck)',
    diameter: '116,460 km (Ring Span: 282,000 km)',
    labDomain: '3D Strut AntiPrism Cellular Metamaterials & SEA Lattices',
    capability: {
      title: 'Ring Harmonic Resonance & Metamaterial Lattice Vibration',
      description:
        'Calculates Specific Energy Absorption (SEA) and modal harmonic bandgaps in 3D AntiPrism cellular metamaterials under cyclic resonant excitation.',
      buttonText: 'Inspect AntiPrism Cellular Metamaterials 🪐',
      targetTab: 'research',
      badge: '6th Planet from Sun',
    },
  },
  uranus: {
    key: 'uranus',
    name: 'Uranus (The Tilted Ice Giant)',
    astronomicalSymbol: '♅',
    orderIndex: 8,
    classification: 'Ice Giant (97.77° Extreme Axial Tilt)',
    distanceFromSun: '2.871 Billion km (19.191 AU)',
    orbitalPeriod: '84.02 Earth Years (Rolls on its Side)',
    surfaceTemp: '-195°C Mean (Coldest Atmosphere: -224°C)',
    diameter: '50,724 km (4.0 × Earth)',
    labDomain: 'Cryogenic Fracture Mechanics & Sub-Zero Cleavage Toughness',
    capability: {
      title: 'Cryogenic Fracture & Sub-Zero Toughness Analyzer',
      description:
        'Simulates ductile-to-brittle transition temperature (DBTT) and crack tip opening displacement (CTOD) at -196°C liquid nitrogen temperatures.',
      buttonText: 'Inspect Cryogenic Fracture Specs ❄️',
      targetTab: 'publications',
      badge: '7th Planet from Sun',
    },
  },
  neptune: {
    key: 'neptune',
    name: 'Neptune (The Deep Blue Wind Giant)',
    astronomicalSymbol: '♆',
    orderIndex: 9,
    classification: 'Dynamic Supersonic Ice Giant',
    distanceFromSun: '4.495 Billion km (30.07 AU)',
    orbitalPeriod: '164.8 Earth Years',
    surfaceTemp: '-200°C Mean (Supersonic Winds > 2,100 km/h)',
    diameter: '49,244 km (3.86 × Earth)',
    labDomain: 'Supersonic Fluid-Structure Interaction & Shockwave Flutter',
    capability: {
      title: 'Supersonic Shockwave & Aeroelastic Flutter Solver',
      description:
        'Analyzes shockwave-boundary layer interaction (SWBLI) and high-Mach dynamic pressure aeroelastic flutter across thin aerospace structures.',
      buttonText: 'Open Aerospace Publications & FSI Papers 🚀',
      targetTab: 'publications',
      badge: '8th Planet from Sun',
    },
  },
};

export const PLANETARY_ORBIT_TRAILS: Record<CelestialBodyKey, PlanetaryOrbitTrailConfig> = {
  blackhole: {
    key: 'blackhole',
    name: 'Event Horizon & Accretion Trajectory',
    semiMajorAxis: 84,
    semiMinorAxis: 50,
    eccentricity: 0.804,
    inclinationDeg: -16,
    strokeColor: '#f59e0b',
    glowColor: '#ff6d00',
    orbitalPeriodSec: 18,
    initialPhaseDeg: 45,
    focalDistance: 67.5,
    trailLengthDeg: 80,
    trailWidth: 2.8,
  },
  sun: {
    key: 'sun',
    name: 'Solar Coronal Boundary',
    semiMajorAxis: 96,
    semiMinorAxis: 62,
    eccentricity: 0.763,
    inclinationDeg: -10,
    strokeColor: '#f59e0b',
    glowColor: '#ffd700',
    orbitalPeriodSec: 22,
    initialPhaseDeg: 90,
    focalDistance: 73.3,
    trailLengthDeg: 75,
    trailWidth: 2.6,
  },
  mercury: {
    key: 'mercury',
    name: "Mercury's Precessing Orbit",
    semiMajorAxis: 124,
    semiMinorAxis: 78,
    eccentricity: 0.778,
    inclinationDeg: 7.0,
    strokeColor: '#94a3b8',
    glowColor: '#e2e8f0',
    orbitalPeriodSec: 15,
    initialPhaseDeg: 120,
    focalDistance: 96.4,
    trailLengthDeg: 90,
    trailWidth: 2.0,
  },
  venus: {
    key: 'venus',
    name: "Venus's Greenhouse Orbit",
    semiMajorAxis: 156,
    semiMinorAxis: 100,
    eccentricity: 0.768,
    inclinationDeg: 3.4,
    strokeColor: '#fbbf24',
    glowColor: '#f59e0b',
    orbitalPeriodSec: 24,
    initialPhaseDeg: 30,
    focalDistance: 119.8,
    trailLengthDeg: 80,
    trailWidth: 2.2,
  },
  earth: {
    key: 'earth',
    name: "Earth's Biosphere Orbit",
    semiMajorAxis: 194,
    semiMinorAxis: 124,
    eccentricity: 0.769,
    inclinationDeg: 0.0,
    strokeColor: '#38bdf8',
    glowColor: '#00e5ff',
    orbitalPeriodSec: 34,
    initialPhaseDeg: 215,
    focalDistance: 149.2,
    trailLengthDeg: 78,
    trailWidth: 2.4,
  },
  mars: {
    key: 'mars',
    name: "Mars's Eccentric Orbit",
    semiMajorAxis: 236,
    semiMinorAxis: 150,
    eccentricity: 0.772,
    inclinationDeg: 1.85,
    strokeColor: '#f87171',
    glowColor: '#ef4444',
    orbitalPeriodSec: 48,
    initialPhaseDeg: 320,
    focalDistance: 182.2,
    trailLengthDeg: 70,
    trailWidth: 2.0,
  },
  jupiter: {
    key: 'jupiter',
    name: "Jupiter's Jovian Orbit",
    semiMajorAxis: 284,
    semiMinorAxis: 180,
    eccentricity: 0.774,
    inclinationDeg: 1.3,
    strokeColor: '#fb923c',
    glowColor: '#f97316',
    orbitalPeriodSec: 68,
    initialPhaseDeg: 145,
    focalDistance: 219.7,
    trailLengthDeg: 65,
    trailWidth: 3.2,
  },
  saturn: {
    key: 'saturn',
    name: "Saturn's Ringed Orbit",
    semiMajorAxis: 338,
    semiMinorAxis: 214,
    eccentricity: 0.774,
    inclinationDeg: 2.48,
    strokeColor: '#fde047',
    glowColor: '#eab308',
    orbitalPeriodSec: 92,
    initialPhaseDeg: 275,
    focalDistance: 261.7,
    trailLengthDeg: 62,
    trailWidth: 3.0,
  },
  uranus: {
    key: 'uranus',
    name: "Uranus's Tilted Ice Orbit",
    semiMajorAxis: 392,
    semiMinorAxis: 248,
    eccentricity: 0.774,
    inclinationDeg: 0.77,
    strokeColor: '#2dd4bf',
    glowColor: '#14b8a6',
    orbitalPeriodSec: 120,
    initialPhaseDeg: 70,
    focalDistance: 303.4,
    trailLengthDeg: 55,
    trailWidth: 2.5,
  },
  neptune: {
    key: 'neptune',
    name: "Neptune's Supersonic Orbit",
    semiMajorAxis: 448,
    semiMinorAxis: 282,
    eccentricity: 0.777,
    inclinationDeg: 1.77,
    strokeColor: '#60a5fa',
    glowColor: '#3b82f6',
    orbitalPeriodSec: 155,
    initialPhaseDeg: 185,
    focalDistance: 348.1,
    trailLengthDeg: 52,
    trailWidth: 2.5,
  },
};

/**
 * Calculates current Cartesian coordinates (x, y) on the rotated ellipse
 * given the orbit config, time elapsed in seconds, and speed multiplier.
 */
export function calculateOrbitPosition(
  orbit: PlanetaryOrbitTrailConfig,
  timeSeconds: number,
  speedMultiplier = 1
): { x: number; y: number; angleRad: number } {
  // Angular frequency omega = 2 * PI / orbitalPeriodSec
  const omega = (2 * Math.PI) / orbit.orbitalPeriodSec;
  const currentAngleRad =
    ((orbit.initialPhaseDeg * Math.PI) / 180 + omega * timeSeconds * speedMultiplier) %
    (2 * Math.PI);

  // Position on unrotated ellipse centered at (0, 0)
  const unrotatedX = orbit.semiMajorAxis * Math.cos(currentAngleRad);
  const unrotatedY = orbit.semiMinorAxis * Math.sin(currentAngleRad);

  // Rotate by inclinationDeg
  const tiltRad = (orbit.inclinationDeg * Math.PI) / 180;
  const cosT = Math.cos(tiltRad);
  const sinT = Math.sin(tiltRad);

  const x = unrotatedX * cosT - unrotatedY * sinT;
  const y = unrotatedX * sinT + unrotatedY * cosT;

  return { x, y, angleRad: currentAngleRad };
}

/**
 * Calculates (x, y) coordinates on the rotated ellipse given an angle in radians.
 */
export function calculateOrbitPointAtAngle(
  orbit: PlanetaryOrbitTrailConfig,
  angleRad: number
): { x: number; y: number } {
  const unrotatedX = orbit.semiMajorAxis * Math.cos(angleRad);
  const unrotatedY = orbit.semiMinorAxis * Math.sin(angleRad);

  const tiltRad = (orbit.inclinationDeg * Math.PI) / 180;
  const cosT = Math.cos(tiltRad);
  const sinT = Math.sin(tiltRad);

  return {
    x: unrotatedX * cosT - unrotatedY * sinT,
    y: unrotatedX * sinT + unrotatedY * cosT,
  };
}

/**
 * Calculates a sequence of fading segments trailing behind the moving planet.
 * The trail extends backwards from currentAngleRad by trailLengthDeg.
 * Returns segments with increasing opacity and width toward the leading planet head.
 */
export function calculateFadingTrailSegments(
  orbit: PlanetaryOrbitTrailConfig,
  currentAngleRad: number,
  trailLengthDeg = orbit.trailLengthDeg || 75,
  numSegments = 18,
  maxOpacity = 0.85,
  headWidth = orbit.trailWidth || 2.4
): OrbitTrailSegment[] {
  const trailLengthRad = (trailLengthDeg * Math.PI) / 180;
  const segments: OrbitTrailSegment[] = [];

  for (let i = 0; i < numSegments; i++) {
    const p1 = i / numSegments;
    const p2 = (i + 1) / numSegments;

    // Angle starts at tail (currentAngleRad - trailLengthRad) and reaches head (currentAngleRad)
    const angle1 = currentAngleRad - trailLengthRad * (1 - p1);
    const angle2 = currentAngleRad - trailLengthRad * (1 - p2);

    const pt1 = calculateOrbitPointAtAngle(orbit, angle1);
    const pt2 = calculateOrbitPointAtAngle(orbit, angle2);

    // Exponential fade for natural comet wake dissolution
    const alpha = Math.pow(p2, 1.8) * maxOpacity;
    const width = (0.2 + 0.8 * Math.pow(p2, 1.2)) * headWidth;

    segments.push({
      x1: pt1.x,
      y1: pt1.y,
      x2: pt2.x,
      y2: pt2.y,
      alpha: Math.max(0.01, alpha),
      width: Math.max(0.4, width),
      progress: p2,
    });
  }

  return segments;
}

/**
 * Generates an SVG path 'd' string for the full trailing arc.
 */
export function generateFadingTrailSvgPath(
  orbit: PlanetaryOrbitTrailConfig,
  currentAngleRad: number,
  trailLengthDeg = orbit.trailLengthDeg || 75,
  numSamples = 24
): string {
  const trailLengthRad = (trailLengthDeg * Math.PI) / 180;
  let d = '';

  for (let i = 0; i <= numSamples; i++) {
    const progress = i / numSamples;
    const angle = currentAngleRad - trailLengthRad * (1 - progress);
    const pt = calculateOrbitPointAtAngle(orbit, angle);

    if (i === 0) {
      d += `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    } else {
      d += ` L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }
  }

  return d;
}

export function getNextCelestialBody(current: CelestialBodyKey): CelestialBodyKey {
  const currentIndex = CELESTIAL_ORDER.indexOf(current);
  if (currentIndex === -1 || currentIndex === CELESTIAL_ORDER.length - 1) {
    return CELESTIAL_ORDER[0];
  }
  return CELESTIAL_ORDER[currentIndex + 1];
}

export function getPrevCelestialBody(current: CelestialBodyKey): CelestialBodyKey {
  const currentIndex = CELESTIAL_ORDER.indexOf(current);
  if (currentIndex <= 0) {
    return CELESTIAL_ORDER[CELESTIAL_ORDER.length - 1];
  }
  return CELESTIAL_ORDER[currentIndex - 1];
}

export function getCelestialBodyInfo(key: CelestialBodyKey): CelestialBodyInfo {
  const base = CELESTIAL_BODIES[key] || CELESTIAL_BODIES.blackhole;
  return {
    ...base,
    orbitTrail: PLANETARY_ORBIT_TRAILS[key],
  };
}

/**
 * Dynamic Moon / Satellite orbital configurations for each celestial body.
 * Each satellite has its own local semiMajorAxis, semiMinorAxis, inclinationDeg,
 * orbital period, color, and size, orbiting its parent planet.
 */
export const PLANETARY_MOONS: Record<CelestialBodyKey, CelestialMoonConfig[]> = {
  blackhole: [
    {
      id: 'isco_probe',
      name: 'ISCO Relativistic Probe',
      parentKey: 'blackhole',
      semiMajorAxis: 20,
      semiMinorAxis: 13,
      eccentricity: 0.76,
      inclinationDeg: -22,
      orbitalPeriodSec: 4.2,
      initialPhaseDeg: 45,
      radius: 1.5,
      color: '#ff6d00',
      glowColor: '#ff9100',
      hasTrail: true,
    },
  ],
  sun: [
    {
      id: 'parker_probe',
      name: 'Parker Solar Probe',
      parentKey: 'sun',
      semiMajorAxis: 22,
      semiMinorAxis: 14,
      eccentricity: 0.77,
      inclinationDeg: 12,
      orbitalPeriodSec: 5.5,
      initialPhaseDeg: 110,
      radius: 1.5,
      color: '#fef08a',
      glowColor: '#f59e0b',
      hasTrail: true,
    },
  ],
  mercury: [
    {
      id: 'bepicolombo',
      name: 'BepiColombo Orbiter',
      parentKey: 'mercury',
      semiMajorAxis: 15,
      semiMinorAxis: 10,
      eccentricity: 0.75,
      inclinationDeg: 18,
      orbitalPeriodSec: 3.8,
      initialPhaseDeg: 30,
      radius: 1.2,
      color: '#cbd5e1',
      glowColor: '#94a3b8',
      hasTrail: true,
    },
  ],
  venus: [
    {
      id: 'akatsuki',
      name: 'Akatsuki Atmospheric Orbiter',
      parentKey: 'venus',
      semiMajorAxis: 17,
      semiMinorAxis: 11,
      eccentricity: 0.76,
      inclinationDeg: -14,
      orbitalPeriodSec: 4.8,
      initialPhaseDeg: 195,
      radius: 1.3,
      color: '#fde68a',
      glowColor: '#f59e0b',
      hasTrail: true,
    },
  ],
  earth: [
    {
      id: 'luna',
      name: 'Luna (The Moon)',
      parentKey: 'earth',
      semiMajorAxis: 24,
      semiMinorAxis: 16,
      eccentricity: 0.75,
      inclinationDeg: 15,
      orbitalPeriodSec: 7.2,
      initialPhaseDeg: 60,
      radius: 2.4,
      color: '#e2e8f0',
      glowColor: '#38bdf8',
      hasTrail: true,
    },
    {
      id: 'iss',
      name: 'ISS (Orbital Station)',
      parentKey: 'earth',
      semiMajorAxis: 14,
      semiMinorAxis: 9,
      eccentricity: 0.77,
      inclinationDeg: -28,
      orbitalPeriodSec: 2.8,
      initialPhaseDeg: 180,
      radius: 1.1,
      color: '#00ff41',
      glowColor: '#00ff41',
      hasTrail: false,
    },
  ],
  mars: [
    {
      id: 'phobos',
      name: 'Phobos (Fear)',
      parentKey: 'mars',
      semiMajorAxis: 16,
      semiMinorAxis: 11,
      eccentricity: 0.73,
      inclinationDeg: 24,
      orbitalPeriodSec: 4.6,
      initialPhaseDeg: 75,
      radius: 1.5,
      color: '#fed7aa',
      glowColor: '#f97316',
      hasTrail: true,
    },
    {
      id: 'deimos',
      name: 'Deimos (Dread)',
      parentKey: 'mars',
      semiMajorAxis: 25,
      semiMinorAxis: 17,
      eccentricity: 0.74,
      inclinationDeg: -18,
      orbitalPeriodSec: 9.4,
      initialPhaseDeg: 220,
      radius: 1.2,
      color: '#fde047',
      glowColor: '#eab308',
      hasTrail: true,
    },
  ],
  jupiter: [
    {
      id: 'io',
      name: 'Io (Volcanic)',
      parentKey: 'jupiter',
      semiMajorAxis: 20,
      semiMinorAxis: 14,
      eccentricity: 0.71,
      inclinationDeg: 10,
      orbitalPeriodSec: 4.2,
      initialPhaseDeg: 15,
      radius: 1.8,
      color: '#fef08a',
      glowColor: '#eab308',
      hasTrail: true,
    },
    {
      id: 'europa',
      name: 'Europa (Subsurface Ocean)',
      parentKey: 'jupiter',
      semiMajorAxis: 28,
      semiMinorAxis: 19,
      eccentricity: 0.73,
      inclinationDeg: -14,
      orbitalPeriodSec: 7.0,
      initialPhaseDeg: 130,
      radius: 1.6,
      color: '#e0f2fe',
      glowColor: '#38bdf8',
      hasTrail: true,
    },
    {
      id: 'ganymede',
      name: 'Ganymede (Magnetic Giant)',
      parentKey: 'jupiter',
      semiMajorAxis: 37,
      semiMinorAxis: 24,
      eccentricity: 0.76,
      inclinationDeg: 19,
      orbitalPeriodSec: 11.5,
      initialPhaseDeg: 255,
      radius: 2.3,
      color: '#cbd5e1',
      glowColor: '#94a3b8',
      hasTrail: true,
    },
    {
      id: 'callisto',
      name: 'Callisto (Ancient Crust)',
      parentKey: 'jupiter',
      semiMajorAxis: 46,
      semiMinorAxis: 29,
      eccentricity: 0.78,
      inclinationDeg: -7,
      orbitalPeriodSec: 16.0,
      initialPhaseDeg: 170,
      radius: 2.0,
      color: '#94a3b8',
      glowColor: '#64748b',
      hasTrail: true,
    },
  ],
  saturn: [
    {
      id: 'titan',
      name: 'Titan (Methane Seas)',
      parentKey: 'saturn',
      semiMajorAxis: 32,
      semiMinorAxis: 21,
      eccentricity: 0.75,
      inclinationDeg: 26,
      orbitalPeriodSec: 9.8,
      initialPhaseDeg: 40,
      radius: 2.3,
      color: '#fde047',
      glowColor: '#ca8a04',
      hasTrail: true,
    },
    {
      id: 'enceladus',
      name: 'Enceladus (Ice Geysers)',
      parentKey: 'saturn',
      semiMajorAxis: 22,
      semiMinorAxis: 15,
      eccentricity: 0.73,
      inclinationDeg: 20,
      orbitalPeriodSec: 5.6,
      initialPhaseDeg: 210,
      radius: 1.4,
      color: '#ffffff',
      glowColor: '#bae6fd',
      hasTrail: true,
    },
    {
      id: 'mimas',
      name: 'Mimas (Impact Crater)',
      parentKey: 'saturn',
      semiMajorAxis: 17,
      semiMinorAxis: 11,
      eccentricity: 0.76,
      inclinationDeg: 16,
      orbitalPeriodSec: 3.8,
      initialPhaseDeg: 325,
      radius: 1.2,
      color: '#e2e8f0',
      glowColor: '#94a3b8',
      hasTrail: true,
    },
  ],
  uranus: [
    {
      id: 'titania',
      name: 'Titania (Fault Canyons)',
      parentKey: 'uranus',
      semiMajorAxis: 25,
      semiMinorAxis: 17,
      eccentricity: 0.73,
      inclinationDeg: 35,
      orbitalPeriodSec: 8.5,
      initialPhaseDeg: 80,
      radius: 1.8,
      color: '#99f6e4',
      glowColor: '#14b8a6',
      hasTrail: true,
    },
    {
      id: 'miranda',
      name: 'Miranda (Chevron Ridges)',
      parentKey: 'uranus',
      semiMajorAxis: 17,
      semiMinorAxis: 11,
      eccentricity: 0.76,
      inclinationDeg: -28,
      orbitalPeriodSec: 4.8,
      initialPhaseDeg: 240,
      radius: 1.3,
      color: '#ccfbf1',
      glowColor: '#2dd4bf',
      hasTrail: true,
    },
  ],
  neptune: [
    {
      id: 'triton',
      name: 'Triton (Retrograde Cryo)',
      parentKey: 'neptune',
      semiMajorAxis: 26,
      semiMinorAxis: 18,
      eccentricity: 0.72,
      inclinationDeg: 145,
      orbitalPeriodSec: 7.8,
      initialPhaseDeg: 160,
      radius: 2.1,
      color: '#93c5fd',
      glowColor: '#3b82f6',
      hasTrail: true,
    },
    {
      id: 'proteus',
      name: 'Proteus (Irregular)',
      parentKey: 'neptune',
      semiMajorAxis: 17,
      semiMinorAxis: 12,
      eccentricity: 0.71,
      inclinationDeg: 12,
      orbitalPeriodSec: 4.2,
      initialPhaseDeg: 20,
      radius: 1.2,
      color: '#bfdbfe',
      glowColor: '#60a5fa',
      hasTrail: true,
    },
  ],
};

/**
 * Calculates local (x, y) coordinates of a moon revolving around its parent planet
 */
export function calculateMoonPosition(
  moon: CelestialMoonConfig,
  timeSeconds: number,
  speedMultiplier = 1
): { x: number; y: number; angleRad: number; isForeground: boolean } {
  const omega = (2 * Math.PI) / moon.orbitalPeriodSec;
  const currentAngleRad =
    ((moon.initialPhaseDeg * Math.PI) / 180 + omega * timeSeconds * speedMultiplier) %
    (2 * Math.PI);

  const unrotatedX = moon.semiMajorAxis * Math.cos(currentAngleRad);
  const unrotatedY = moon.semiMinorAxis * Math.sin(currentAngleRad);

  const tiltRad = (moon.inclinationDeg * Math.PI) / 180;
  const cosT = Math.cos(tiltRad);
  const sinT = Math.sin(tiltRad);

  const x = unrotatedX * cosT - unrotatedY * sinT;
  const y = unrotatedX * sinT + unrotatedY * cosT;

  // Apparent 3D depth: foreground when sin(currentAngleRad) >= 0
  const isForeground = Math.sin(currentAngleRad) >= -0.2;

  return { x, y, angleRad: currentAngleRad, isForeground };
}

/**
 * Calculates fading trail segments for a moon around its parent
 */
export function calculateMoonTrailSegments(
  moon: CelestialMoonConfig,
  currentAngleRad: number,
  trailLengthDeg = 55,
  numSegments = 8,
  maxOpacity = 0.75
): OrbitTrailSegment[] {
  const trailLengthRad = (trailLengthDeg * Math.PI) / 180;
  const segments: OrbitTrailSegment[] = [];

  const tiltRad = (moon.inclinationDeg * Math.PI) / 180;
  const cosT = Math.cos(tiltRad);
  const sinT = Math.sin(tiltRad);

  for (let i = 0; i < numSegments; i++) {
    const p1 = i / numSegments;
    const p2 = (i + 1) / numSegments;

    const angle1 = currentAngleRad - trailLengthRad * (1 - p1);
    const angle2 = currentAngleRad - trailLengthRad * (1 - p2);

    const uX1 = moon.semiMajorAxis * Math.cos(angle1);
    const uY1 = moon.semiMinorAxis * Math.sin(angle1);
    const x1 = uX1 * cosT - uY1 * sinT;
    const y1 = uX1 * sinT + uY1 * cosT;

    const uX2 = moon.semiMajorAxis * Math.cos(angle2);
    const uY2 = moon.semiMinorAxis * Math.sin(angle2);
    const x2 = uX2 * cosT - uY2 * sinT;
    const y2 = uX2 * sinT + uY2 * cosT;

    const alpha = Math.pow(p2, 1.8) * maxOpacity;
    const width = (0.2 + 0.8 * p2) * 1.4;

    segments.push({
      x1,
      y1,
      x2,
      y2,
      alpha: Math.max(0.01, alpha),
      width: Math.max(0.4, width),
      progress: p2,
    });
  }

  return segments;
}

export function getMoonsForPlanet(planetKey: CelestialBodyKey): CelestialMoonConfig[] {
  return PLANETARY_MOONS[planetKey] || [];
}

