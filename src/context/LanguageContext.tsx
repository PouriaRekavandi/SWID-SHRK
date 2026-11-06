import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppLanguage, LOCALIZATION } from '../data/localization';

interface LanguageContextType {
  language: AppLanguage;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: typeof LOCALIZATION;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        if (urlLang === 'fa' || urlLang === 'en') {
          return urlLang;
        }
        const saved = localStorage.getItem('swid_app_language');
        if (saved === 'fa' || saved === 'en') {
          return saved;
        }
      } catch {
        // ignore
      }
    }
    return 'en';
  });

  const isRTL = language === 'fa';
  const dir = isRTL ? 'rtl' : 'ltr';

  // Apply to documentElement for global CSS & accessibility
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (isRTL) {
        document.documentElement.classList.add('rtl-layout');
      } else {
        document.documentElement.classList.remove('rtl-layout');
      }
    }
    try {
      localStorage.setItem('swid_app_language', language);
    } catch {
      // ignore
    }
  }, [language, dir, isRTL]);

  const setLanguage = useCallback((newLang: AppLanguage) => {
    setLanguageState(newLang);
    try {
      const url = new URL(window.location.href);
      if (newLang === 'fa') {
        url.searchParams.set('lang', 'fa');
      } else {
        url.searchParams.delete('lang');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        dir,
        setLanguage,
        toggleLanguage,
        t: LOCALIZATION,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
