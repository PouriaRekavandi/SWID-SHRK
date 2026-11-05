import React, { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

type FontScale = 'sm' | 'md' | 'lg' | 'xl';

export const FontSizeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [scale, setScale] = useState<FontScale>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_font_scale') as FontScale;
        if (saved && ['sm', 'md', 'lg', 'xl'].includes(saved)) return saved;
      } catch {
        // fallback
      }
    }
    return 'lg'; // Default to comfortably larger font size
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
      root.classList.add(`font-scale-${scale}`);
      try {
        localStorage.setItem('swid_font_scale', scale);
      } catch {
        // ignore
      }
    }
  }, [scale]);

  const cycleScale = () => {
    setScale((prev) => {
      if (prev === 'sm') return 'md';
      if (prev === 'md') return 'lg';
      if (prev === 'lg') return 'xl';
      return 'sm';
    });
  };

  const getLabel = () => {
    switch (scale) {
      case 'sm':
        return 'Text: Normal';
      case 'md':
        return 'Text: Medium';
      case 'lg':
        return 'Text: Large';
      case 'xl':
        return 'Text: XL';
    }
  };

  return (
    <button
      type="button"
      onClick={cycleScale}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 border-zinc-700/60 hover:border-sky-400 dark:hover:text-[#00ff41] hover:text-sky-600 shadow-sm ${className}`}
      title={`Click to adjust text size (Current: ${getLabel()})`}
      aria-label="Adjust font size"
    >
      <Type className="w-3.5 h-3.5 text-[#00b8ff]" />
      <span className="hidden sm:inline">{getLabel()}</span>
      <span className="sm:hidden font-mono uppercase text-[10px]">A+</span>
    </button>
  );
};
