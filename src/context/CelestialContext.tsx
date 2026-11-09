import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  CelestialBodyKey,
  CelestialBodyInfo,
  PlanetaryOrbitTrailConfig,
  OrbitTrailSegment,
  CelestialMoonConfig,
  TabKey,
} from '../types';
import {
  CELESTIAL_ORDER,
  CELESTIAL_BODIES,
  PLANETARY_ORBIT_TRAILS,
  PLANETARY_MOONS,
  calculateOrbitPosition,
  calculateFadingTrailSegments,
  generateFadingTrailSvgPath,
  getMoonsForPlanet,
  calculateMoonPosition,
  getNextCelestialBody,
  getPrevCelestialBody,
  getCelestialBodyInfo,
} from '../utils/celestialBodies';

interface CelestialContextType {
  activeBodyKey: CelestialBodyKey;
  activeInfo: CelestialBodyInfo;
  isTransitioning: boolean;
  flareActive: boolean;
  notification: string | null;
  genesisCount: number;
  orbitTrailsVisible: boolean;
  fadingTrailsVisible: boolean;
  moonsVisible: boolean;
  orbitAnimationSpeed: number;
  trailLengthMultiplier: number;
  focusedOrbitOnly: boolean;
  elapsedOrbitalTime: number;
  orbitalTrails: PlanetaryOrbitTrailConfig[];
  setCelestialBody: (key: CelestialBodyKey) => void;
  advanceToNextBody: () => CelestialBodyKey;
  stepToPrevBody: () => CelestialBodyKey;
  triggerSingularityGenesis: () => void;
  setNotification: (msg: string | null) => void;
  handleEarthClick: (onSelectTab?: (tab: TabKey) => void) => void;
  executeCapability: (onSelectTab?: (tab: TabKey) => void) => void;
  toggleOrbitTrails: () => void;
  setOrbitTrailsVisible: (visible: boolean) => void;
  toggleFadingTrails: () => void;
  setFadingTrailsVisible: (visible: boolean) => void;
  toggleMoons: () => void;
  setMoonsVisible: (visible: boolean) => void;
  starfieldVisible: boolean;
  lensingVisible: boolean;
  graphicsMode: 'high' | 'eco';
  toggleStarfield: () => void;
  setStarfieldVisible: (visible: boolean) => void;
  toggleLensing: () => void;
  setLensingVisible: (visible: boolean) => void;
  toggleMasterGraphics: () => void;
  setGraphicsMode: (mode: 'high' | 'eco') => void;
  setOrbitAnimationSpeed: (speed: number) => void;
  setTrailLengthMultiplier: (multiplier: number) => void;
  toggleFocusedOrbitOnly: () => void;
  getPlanetPosition: (key: CelestialBodyKey, customTime?: number) => { x: number; y: number; angleRad: number };
  getPlanetTrailSegments: (key: CelestialBodyKey, customTime?: number, customTrailLengthDeg?: number) => OrbitTrailSegment[];
  getPlanetTrailPath: (key: CelestialBodyKey, customTime?: number, customTrailLengthDeg?: number) => string;
  getPlanetMoons: (planetKey: CelestialBodyKey) => CelestialMoonConfig[];
}

const CelestialContext = createContext<CelestialContextType | undefined>(undefined);

export const CelestialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBodyKey, setActiveBodyKeyState] = useState<CelestialBodyKey>(() => {
    if (typeof window !== 'undefined') {
      try {
        // First check URL query parameter ?celestial=
        const params = new URLSearchParams(window.location.search);
        const queryKey = params.get('celestial') as CelestialBodyKey;
        if (queryKey && CELESTIAL_ORDER.includes(queryKey)) {
          return queryKey;
        }
        // Then check localStorage
        const saved = localStorage.getItem('swid_celestial_active_body') as CelestialBodyKey;
        if (saved && CELESTIAL_ORDER.includes(saved)) {
          return saved;
        }
      } catch {
        // ignore
      }
    }
    return 'blackhole';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flareActive, setFlareActive] = useState(false);
  const [genesisCount, setGenesisCount] = useState(0);
  const [notification, setNotificationState] = useState<string | null>(null);

  // Persistent Glowing Elliptical Trails state
  const [orbitTrailsVisible, setOrbitTrailsVisibleState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_orbit_trails_visible');
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  // Faint Fading Orbital Trail behind Moving Planets
  const [fadingTrailsVisible, setFadingTrailsVisibleState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_fading_trails_visible');
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  // Dynamic Orbiting Moons / Satellites state
  const [moonsVisible, setMoonsVisibleState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_moons_visible');
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const [trailLengthMultiplier, setTrailLengthMultiplierState] = useState<number>(1.0);
  const [orbitAnimationSpeed, setOrbitAnimationSpeedState] = useState<number>(1.0);
  const [focusedOrbitOnly, setFocusedOrbitOnly] = useState<boolean>(false);
  const [elapsedOrbitalTime, setElapsedOrbitalTime] = useState<number>(0);

  const activeInfo = getCelestialBodyInfo(activeBodyKey);
  const orbitalTrails = CELESTIAL_ORDER.map((k) => PLANETARY_ORBIT_TRAILS[k]);

  // Sync activeBodyKey with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swid_celestial_active_body', activeBodyKey);
    } catch {
      // ignore
    }
  }, [activeBodyKey]);

  // Sync orbitTrailsVisible with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swid_orbit_trails_visible', String(orbitTrailsVisible));
    } catch {
      // ignore
    }
  }, [orbitTrailsVisible]);

  // Sync fadingTrailsVisible with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swid_fading_trails_visible', String(fadingTrailsVisible));
    } catch {
      // ignore
    }
  }, [fadingTrailsVisible]);

  // Sync moonsVisible with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swid_moons_visible', String(moonsVisible));
    } catch {
      // ignore
    }
  }, [moonsVisible]);

  // Starfield Canvas Particles State
  const [starfieldVisible, setStarfieldVisibleState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_starfield_visible');
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  // Gravitational Lensing Distortion Filter State
  const [lensingVisible, setLensingVisibleState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_lensing_visible');
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  // Master Graphics Performance Mode: 'high' (all effects active) vs 'eco' (lightweight)
  const [graphicsMode, setGraphicsModeState] = useState<'high' | 'eco'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_graphics_mode') as 'high' | 'eco';
        return saved === 'eco' ? 'eco' : 'high';
      } catch {
        return 'high';
      }
    }
    return 'high';
  });

  useEffect(() => {
    try {
      localStorage.setItem('swid_starfield_visible', String(starfieldVisible));
    } catch {
      // ignore
    }
  }, [starfieldVisible]);

  useEffect(() => {
    try {
      localStorage.setItem('swid_lensing_visible', String(lensingVisible));
    } catch {
      // ignore
    }
  }, [lensingVisible]);

  useEffect(() => {
    try {
      localStorage.setItem('swid_graphics_mode', graphicsMode);
    } catch {
      // ignore
    }
  }, [graphicsMode]);

  // High-precision smooth animation loop for orbital motion along ellipses
  const lastTimeRef = useRef<number>(performance.now());
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Advance orbital elapsed time proportional to orbitAnimationSpeed
      setElapsedOrbitalTime((prev) => prev + deltaSec * orbitAnimationSpeed);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [orbitAnimationSpeed]);

  const toggleOrbitTrails = useCallback(() => {
    setOrbitTrailsVisibleState((prev) => {
      const next = !prev;
      setNotificationState(next ? '🌌 Elliptical Orbit Paths Illuminated' : 'Orbit Paths Minimized');
      return next;
    });
  }, []);

  const setOrbitTrailsVisible = useCallback((visible: boolean) => {
    setOrbitTrailsVisibleState(visible);
  }, []);

  const toggleFadingTrails = useCallback(() => {
    setFadingTrailsVisibleState((prev) => {
      const next = !prev;
      setNotificationState(next ? '✨ Fading Planetary Motion Trails Active' : 'Fading Motion Trails Hidden');
      return next;
    });
  }, []);

  const setFadingTrailsVisible = useCallback((visible: boolean) => {
    setFadingTrailsVisibleState(visible);
  }, []);

  const toggleMoons = useCallback(() => {
    setMoonsVisibleState((prev) => {
      const next = !prev;
      setNotificationState(next ? '🛰️ Orbiting Planetary Moons & Satellites Active' : 'Orbiting Moons Hidden');
      return next;
    });
  }, []);

  const setMoonsVisible = useCallback((visible: boolean) => {
    setMoonsVisibleState(visible);
  }, []);

  const toggleStarfield = useCallback(() => {
    setStarfieldVisibleState((prev) => {
      const next = !prev;
      setNotificationState(next ? '⭐ Twinkling Starfield Active' : 'Starfield Canvas Suspended (Eco)');
      return next;
    });
  }, []);

  const setStarfieldVisible = useCallback((visible: boolean) => {
    setStarfieldVisibleState(visible);
  }, []);

  const toggleLensing = useCallback(() => {
    setLensingVisibleState((prev) => {
      const next = !prev;
      setNotificationState(next ? '🌀 Gravitational Lensing Shader Active' : 'Lensing Shader Suspended');
      return next;
    });
  }, []);

  const setLensingVisible = useCallback((visible: boolean) => {
    setLensingVisibleState(visible);
  }, []);

  const setGraphicsMode = useCallback((mode: 'high' | 'eco') => {
    setGraphicsModeState(mode);
    if (mode === 'eco') {
      setOrbitTrailsVisibleState(false);
      setFadingTrailsVisibleState(false);
      setMoonsVisibleState(false);
      setStarfieldVisibleState(false);
      setLensingVisibleState(false);
      setNotificationState('🌱 Graphics Eco Mode Engaged: High-FPS Minimal GPU load');
    } else {
      setOrbitTrailsVisibleState(true);
      setFadingTrailsVisibleState(true);
      setMoonsVisibleState(true);
      setStarfieldVisibleState(true);
      setLensingVisibleState(true);
      setNotificationState('🚀 Graphics Ultra Mode Active: Full Cosmic VFX & Canvas Shaders');
    }
  }, []);

  const toggleMasterGraphics = useCallback(() => {
    setGraphicsModeState((prev) => {
      const next = prev === 'high' ? 'eco' : 'high';
      if (next === 'eco') {
        setOrbitTrailsVisibleState(false);
        setFadingTrailsVisibleState(false);
        setMoonsVisibleState(false);
        setStarfieldVisibleState(false);
        setLensingVisibleState(false);
        setNotificationState('🌱 Graphics Eco Mode Engaged (Minimal GPU Load)');
      } else {
        setOrbitTrailsVisibleState(true);
        setFadingTrailsVisibleState(true);
        setMoonsVisibleState(true);
        setStarfieldVisibleState(true);
        setLensingVisibleState(true);
        setNotificationState('🚀 Graphics Ultra Mode: All Celestial VFX Active');
      }
      return next;
    });
  }, []);

  const getPlanetMoons = useCallback((planetKey: CelestialBodyKey) => {
    return getMoonsForPlanet(planetKey);
  }, []);

  const setTrailLengthMultiplier = useCallback((multiplier: number) => {
    setTrailLengthMultiplierState(multiplier);
    setNotificationState(`Planetary Motion Trail Length: ${multiplier}x`);
  }, []);

  const setOrbitAnimationSpeed = useCallback((speed: number) => {
    setOrbitAnimationSpeedState(speed);
    setNotificationState(`Orbital Clock Adjusted: ${speed}x Speed`);
  }, []);

  const toggleFocusedOrbitOnly = useCallback(() => {
    setFocusedOrbitOnly((prev) => {
      const next = !prev;
      setNotificationState(next ? 'Focused on Active Planet Orbit Trail' : 'All Solar System Orbit Trails Active');
      return next;
    });
  }, []);

  const getPlanetPosition = useCallback(
    (key: CelestialBodyKey, customTime?: number) => {
      const orbit = PLANETARY_ORBIT_TRAILS[key];
      const timeToUse = customTime !== undefined ? customTime : elapsedOrbitalTime;
      return calculateOrbitPosition(orbit, timeToUse, orbitAnimationSpeed);
    },
    [elapsedOrbitalTime, orbitAnimationSpeed]
  );

  /**
   * Calculates dynamic fading path segments trailing behind the moving planet
   */
  const getPlanetTrailSegments = useCallback(
    (key: CelestialBodyKey, customTime?: number, customTrailLengthDeg?: number) => {
      const orbit = PLANETARY_ORBIT_TRAILS[key];
      const timeToUse = customTime !== undefined ? customTime : elapsedOrbitalTime;
      const { angleRad } = calculateOrbitPosition(orbit, timeToUse, orbitAnimationSpeed);
      const effectiveLength = (customTrailLengthDeg || orbit.trailLengthDeg || 75) * trailLengthMultiplier;
      return calculateFadingTrailSegments(orbit, angleRad, effectiveLength);
    },
    [elapsedOrbitalTime, orbitAnimationSpeed, trailLengthMultiplier]
  );

  /**
   * Generates a continuous SVG path string for the fading trailing arc
   */
  const getPlanetTrailPath = useCallback(
    (key: CelestialBodyKey, customTime?: number, customTrailLengthDeg?: number) => {
      const orbit = PLANETARY_ORBIT_TRAILS[key];
      const timeToUse = customTime !== undefined ? customTime : elapsedOrbitalTime;
      const { angleRad } = calculateOrbitPosition(orbit, timeToUse, orbitAnimationSpeed);
      const effectiveLength = (customTrailLengthDeg || orbit.trailLengthDeg || 75) * trailLengthMultiplier;
      return generateFadingTrailSvgPath(orbit, angleRad, effectiveLength);
    },
    [elapsedOrbitalTime, orbitAnimationSpeed, trailLengthMultiplier]
  );

  const setNotification = useCallback((msg: string | null) => {
    setNotificationState(msg);
    if (msg) {
      setTimeout(() => {
        setNotificationState((curr) => (curr === msg ? null : curr));
      }, 4200);
    }
  }, []);

  const setCelestialBody = useCallback(
    (key: CelestialBodyKey) => {
      if (key === activeBodyKey) return;
      setIsTransitioning(true);
      setActiveBodyKeyState(key);
      setTimeout(() => setIsTransitioning(false), 550);
      setNotification(`Orbit aligned with: ${getCelestialBodyInfo(key).name}`);
    },
    [activeBodyKey, setNotification]
  );

  const advanceToNextBody = useCallback((): CelestialBodyKey => {
    const next = getNextCelestialBody(activeBodyKey);
    setIsTransitioning(true);
    setActiveBodyKeyState(next);
    setTimeout(() => setIsTransitioning(false), 550);
    setNotification(`Transitioned orbit to: ${getCelestialBodyInfo(next).name}`);
    return next;
  }, [activeBodyKey, setNotification]);

  const stepToPrevBody = useCallback((): CelestialBodyKey => {
    const prev = getPrevCelestialBody(activeBodyKey);
    setIsTransitioning(true);
    setActiveBodyKeyState(prev);
    setTimeout(() => setIsTransitioning(false), 550);
    setNotification(`Transitioned orbit to: ${getCelestialBodyInfo(prev).name}`);
    return prev;
  }, [activeBodyKey, setNotification]);

  const triggerSingularityGenesis = useCallback(() => {
    setGenesisCount((prev) => prev + 1);
    setNotification('⚡ Singularity Re-Forged: Spacetime particles collapsed & re-materialized!');
  }, [setNotification]);

  /**
   * Dedicated Earth Click Handler:
   * Programmatically triggers handleSelectTab('research') AND opens that view in a new browser tab.
   */
  const handleEarthClick = useCallback(
    (onSelectTab?: (tab: TabKey) => void) => {
      setNotification('🌍 Earth Active: Programmatically selected Research Hub & opened in new tab ↗');

      if (typeof onSelectTab === 'function') {
        try {
          onSelectTab('research');
        } catch (err) {
          console.warn('onSelectTab error:', err);
        }
      }

      try {
        const targetUrl = `${window.location.origin}${window.location.pathname}?tab=research`;
        const newWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer');

        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          const anchor = document.createElement('a');
          anchor.href = targetUrl;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }
      } catch (err) {
        console.warn('New tab window.open handled:', err);
      }
    },
    [setNotification]
  );

  /**
   * Executes the active celestial body's capability.
   */
  const executeCapability = useCallback(
    (onSelectTab?: (tab: TabKey) => void) => {
      if (activeBodyKey === 'blackhole') {
        triggerSingularityGenesis();
        return;
      }

      if (activeBodyKey === 'earth') {
        handleEarthClick(onSelectTab);
        return;
      }

      if (activeBodyKey === 'sun') {
        setFlareActive(true);
        setTimeout(() => setFlareActive(false), 2200);
        setNotification('🔥 Solar Flare Blast triggered! Radiant thermal flux transient simulated.');
        if (activeInfo.capability.targetTab && onSelectTab) {
          setTimeout(() => onSelectTab(activeInfo.capability.targetTab!), 600);
        }
        return;
      }

      // Other celestial bodies
      if (activeInfo.capability.targetTab && onSelectTab) {
        onSelectTab(activeInfo.capability.targetTab);
        setNotification(`Aligned with ${activeInfo.name} research: ${activeInfo.labDomain}`);
      } else {
        setNotification(`Activated ${activeInfo.name} capability: ${activeInfo.capability.title}`);
      }
    },
    [activeBodyKey, activeInfo, handleEarthClick, triggerSingularityGenesis, setNotification]
  );

  return (
    <CelestialContext.Provider
      value={{
        activeBodyKey,
        activeInfo,
        isTransitioning,
        flareActive,
        notification,
        genesisCount,
        orbitTrailsVisible,
        fadingTrailsVisible,
        moonsVisible,
        orbitAnimationSpeed,
        trailLengthMultiplier,
        focusedOrbitOnly,
        elapsedOrbitalTime,
        orbitalTrails,
        setCelestialBody,
        advanceToNextBody,
        stepToPrevBody,
        triggerSingularityGenesis,
        setNotification,
        handleEarthClick,
        executeCapability,
        toggleOrbitTrails,
        setOrbitTrailsVisible,
        toggleFadingTrails,
        setFadingTrailsVisible,
        toggleMoons,
        setMoonsVisible,
        starfieldVisible,
        lensingVisible,
        graphicsMode,
        toggleStarfield,
        setStarfieldVisible,
        toggleLensing,
        setLensingVisible,
        toggleMasterGraphics,
        setGraphicsMode,
        setOrbitAnimationSpeed,
        setTrailLengthMultiplier,
        toggleFocusedOrbitOnly,
        getPlanetPosition,
        getPlanetTrailSegments,
        getPlanetTrailPath,
        getPlanetMoons,
      }}
    >
      {children}
    </CelestialContext.Provider>
  );
};

export const useCelestial = (): CelestialContextType => {
  const context = useContext(CelestialContext);
  if (!context) {
    throw new Error('useCelestial must be used within a CelestialProvider');
  }
  return context;
};
