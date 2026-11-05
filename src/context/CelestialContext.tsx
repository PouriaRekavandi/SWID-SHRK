import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CelestialBodyKey, CelestialBodyInfo, TabKey } from '../types';
import {
  CELESTIAL_ORDER,
  CELESTIAL_BODIES,
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
  setCelestialBody: (key: CelestialBodyKey) => void;
  advanceToNextBody: () => CelestialBodyKey;
  stepToPrevBody: () => CelestialBodyKey;
  triggerSingularityGenesis: () => void;
  setNotification: (msg: string | null) => void;
  handleEarthClick: (onSelectTab?: (tab: TabKey) => void) => void;
  executeCapability: (onSelectTab?: (tab: TabKey) => void) => void;
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

  const activeInfo = getCelestialBodyInfo(activeBodyKey);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swid_celestial_active_body', activeBodyKey);
    } catch {
      // ignore
    }
  }, [activeBodyKey]);

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
   * Programmatically triggers handleSelectTab('analyzer') AND opens that view in a new browser tab.
   */
  const handleEarthClick = useCallback(
    (onSelectTab?: (tab: TabKey) => void) => {
      setNotification('🌍 Earth Active: Programmatically selected Analyzer & opened in new tab ↗');

      // 1. Programmatically trigger handleSelectTab('analyzer') in current view
      if (typeof onSelectTab === 'function') {
        try {
          onSelectTab('analyzer');
        } catch (err) {
          console.warn('onSelectTab error:', err);
        }
      }

      // 2. Open the analyzer view in a new browser tab
      try {
        const targetUrl = `${window.location.origin}${window.location.pathname}?tab=analyzer`;
        const newWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer');

        // Robust fallback for strict popup blocker environments: synthesize anchor click
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
        setCelestialBody,
        advanceToNextBody,
        stepToPrevBody,
        triggerSingularityGenesis,
        setNotification,
        handleEarthClick,
        executeCapability,
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
