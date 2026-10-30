import React, { useState } from 'react';
import { TabKey } from './types';
import { ProjectBanner } from './components/ProjectBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProfileSection } from './components/ProfileSection';
import { Team } from './components/Team';
import { ResearchSection } from './components/ResearchSection';
import { PublicationsSection } from './components/PublicationsSection';
import { ThesisRegistry } from './components/ThesisRegistry';
import { EquipmentSection } from './components/EquipmentSection';
import { ContactSection } from './components/ContactSection';
import { AIChatSection } from './components/AIChatSection';
import { EngineeringQAChatbox } from './components/EngineeringQAChatbox';
import { AbaqusGallery } from './components/AbaqusGallery';
import { Footer } from './components/Footer';
import { CosmicBackground } from './components/CosmicBackground';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { CheckCircle2, AlertCircle, Bot, Sparkles, MessageSquare } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Full-Fit Widescreen state (defaults to true for immersive monitor coverage)
  const [isFullFit, setIsFullFit] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('swid_layout_full_fit');
        if (saved !== null) return saved === 'true';
      } catch {
        // fallback
      }
    }
    return true; // Default to full-fitted wide screen layout
  });

  const toggleFullFit = () => {
    setIsFullFit((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('swid_layout_full_fit', String(next));
        } catch {
          // ignore
        }
      }
      showToast(next ? 'Layout Fit: Full Widescreen Active' : 'Layout Fit: Standard Boxed Active');
      return next;
    });
  };

  const containerClass = isFullFit
    ? 'w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 transition-all duration-300'
    : 'max-w-6xl mx-auto px-4 transition-all duration-300';

  // Guarantee that the website always opens from the very top on initial load
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if ('history' in window && 'scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        const resetScroll = () => {
          try {
            window.scrollTo(0, 0);
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
          } catch {
            // Ignore scroll restrictions
          }
        };

        resetScroll();
        const t1 = setTimeout(resetScroll, 30);
        const t2 = setTimeout(resetScroll, 120);
        const t3 = setTimeout(resetScroll, 300);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    } catch {
      // Ignore sandbox/iframe restrictions
    }
  }, []);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3800);
  };

  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen dark:bg-[#050505]/95 bg-[#f8fafc]/95 dark:text-[#e0e0e0] text-slate-900 flex flex-col font-mono selection:bg-[#00ff41]/20 selection:text-[#00ff41] transition-colors duration-200">
      {/* Interactive Global Dark Matter Particle Simulation Canvas Background */}
      <CosmicBackground />

      {/* Viewport Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00ff41] focus:text-black focus:font-bold focus:rounded-md shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Active Project Banner */}
      <ProjectBanner />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isFullFit={isFullFit}
        onToggleFullFit={toggleFullFit}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 focus:outline-none">
        {activeTab === 'home' && (
          <div className="space-y-16">
            <HeroSection onSelectTab={handleSelectTab} />

            <div className={`${containerClass} space-y-16`}>
              {/* Principal Researcher Card */}
              <ProfileSection />

              {/* Research Preview with Accordions and Video Player */}
              <ResearchSection onNotify={showToast} />

              {/* Lab Research Team */}
              <div className="pt-8 border-t dark:border-zinc-800 border-slate-200">
                <Team onNotify={showToast} onSelectTab={handleSelectTab} />
              </div>

              {/* Ask Dr. Pouria: Mechanical & Aerospace Engineering Q&A Chatbox */}
              <div className="pt-8 border-t dark:border-zinc-800 border-slate-200">
                <EngineeringQAChatbox onNotify={showToast} onSelectTab={handleSelectTab} />
              </div>

              {/* Integrated AI Assistant Section on Home */}
              <div className="pt-8 border-t dark:border-zinc-800 border-slate-200">
                <AIChatSection onNotify={showToast} onSelectTab={handleSelectTab} />
              </div>

              {/* Thesis Registry Overview */}
              <ThesisRegistry onNotify={showToast} />
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className={`${containerClass} py-12`}>
            <Team onNotify={showToast} onSelectTab={handleSelectTab} />
          </div>
        )}

        {activeTab === 'qa' && (
          <div className={`${containerClass} py-8`}>
            <EngineeringQAChatbox onNotify={showToast} onSelectTab={handleSelectTab} />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className={`${containerClass} py-8`}>
            <AIChatSection onNotify={showToast} onSelectTab={handleSelectTab} />
          </div>
        )}

        {activeTab === 'research' && (
          <div className={`${containerClass} py-12`}>
            <ResearchSection onNotify={showToast} />
          </div>
        )}

        {activeTab === 'publications' && (
          <div className={`${containerClass} py-12`}>
            <PublicationsSection onNotify={showToast} />
          </div>
        )}

        {activeTab === 'students' && (
          <div className={`${containerClass} py-12`}>
            <ThesisRegistry onNotify={showToast} />
          </div>
        )}

        {activeTab === 'gear' && (
          <div className={`${containerClass} py-12`}>
            <EquipmentSection />
          </div>
        )}

        {activeTab === 'abaqus' && (
          <div className={`${containerClass} py-12 space-y-8`}>
            <div>
              <div className="inline-block border-b-2 border-[#00b8ff] pb-1 mb-4">
                <h2 className="font-section-title text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider text-white flex items-center">
                  <span className="text-[#00ff41] font-mono mr-2 select-none">//</span>
                  <span>Abaqus FEA Simulations &amp; Gallery</span>
                </h2>
              </div>
              <p className="text-zinc-400 font-mono text-sm max-w-3xl leading-relaxed">
                Showcasing finite element analysis runs, dynamic explicit stress/strain contour fields, mesh formulations, and interactive lightbox telemetry.
              </p>
            </div>
            <AbaqusGallery onNotify={showToast} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={`${containerClass} py-12`}>
            <ContactSection onNotify={showToast} />
          </div>
        )}
      </main>

      {/* Floating AI Assistant Trigger Button */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => handleSelectTab('chat')}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full dark:bg-black/90 bg-white/95 text-slate-800 dark:text-white border-2 dark:border-[#00ff41] border-emerald-500 shadow-xl dark:shadow-[0_0_20px_rgba(0,255,65,0.4)] shadow-slate-400/40 hover:scale-105 active:scale-95 transition-all text-xs font-mono font-bold cursor-pointer group"
          title="Open Gemini AI Lab Assistant"
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center dark:bg-[#00ff41] bg-emerald-600 text-black">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">Ask Lab AI</span>
          <Sparkles className="w-3 h-3 text-[#00b8ff] animate-pulse" />
        </button>
      )}

      {/* Floating Scroll to Top Button (Appears past the Hero Section) */}
      <ScrollToTopButton threshold={450} hasBottomChatButton={activeTab !== 'chat'} />

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} isFullFit={isFullFit} />

      {/* Global Cyber Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg font-mono text-xs shadow-2xl transition-all duration-300 max-w-sm ${
            toast.isError
              ? 'bg-[#8d3038] text-white border border-[#ff4d5a]'
              : 'bg-[#00ff41] text-[#001407] border border-[#00ff41] font-bold shadow-[0_0_20px_rgba(0,255,65,0.4)]'
          }`}
        >
          {toast.isError ? (
            <AlertCircle className="w-4 h-4 flex-none" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-none" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
