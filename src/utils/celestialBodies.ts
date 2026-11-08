import { CelestialBodyKey, CelestialBodyInfo, PlanetaryOrbitTrailConfig } from '../types';

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
    name: 'Singularity (Sagittarius A*)',
    astronomicalSymbol: '🕳️',
    orderIndex: 0,
    classification: 'Supermassive Black Hole Singularity',
    distanceFromSun: 'Center of Milky Way (~26,000 ly)',
    orbitalPeriod: 'Static Kerr-Newman Geodesic',
    surfaceTemp: '1.4 × 10⁻¹⁴ K (Hawking Radiation)',
    diameter: 'Rs ≈ 24,000,000 km',
    labDomain: 'SWID-SHRK Origin Crest & Relativistic Continuum Mechanics',
    capability: {
      title: 'Cosmic Singularity Re-Forging',
      description:
        'Collapses local spacetime geodesics into infinite curvature, pulsing gravitational shockwaves and re-synthesizing the SWID-SHRK crest emblem.',
      buttonText: 'Re-Forge from Singularity ⚡',
      badge: 'Relativistic Singularity',
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
