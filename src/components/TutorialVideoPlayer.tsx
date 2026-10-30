import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VideoTutorial, VttCue, VttTrack } from '../types';
import { getVttTrackForVideo, downloadVttTrackFile } from '../data/tutorialSubtitles';
import {
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  Film,
  Maximize2,
  CheckCircle2,
  Sliders,
  Eye,
  Info,
  ExternalLink,
  Download,
  Subtitles,
  ChevronDown,
  ChevronUp,
  Search,
  Copy,
  Check,
  FileText,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';

interface TutorialVideoPlayerProps {
  video: VideoTutorial;
  trackLabel?: string;
  className?: string;
  onNotify?: (message: string) => void;
}

export const TutorialVideoPlayer: React.FC<TutorialVideoPlayerProps> = ({
  video,
  trackLabel = 'Antiprism Modeling',
  className = '',
  onNotify
}) => {
  // 5-second ambient intro states
  const [ambientIntroActive, setAmbientIntroActive] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [ambientIntroEnabled, setAmbientIntroEnabled] = useState<boolean>(false);

  // Subtitles / WebVTT States
  const activeVttTrack: VttTrack | undefined = useMemo(() => {
    return video.vttTrack || getVttTrackForVideo(video.id);
  }, [video.id, video.vttTrack]);

  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [subtitleDockMode, setSubtitleDockMode] = useState<'docked' | 'overlay'>('docked');
  const [viewportFit, setViewportFit] = useState<'full-fit' | 'cinema'>('full-fit');
  const [currentCueIndex, setCurrentCueIndex] = useState<number>(0);
  const [subtitleFontSize, setSubtitleFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!viewportRef.current) return;
    try {
      if (!document.fullscreenElement) {
        viewportRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  // Auto-cycle cues or sync with time
  const [autoFollow, setAutoFollow] = useState<boolean>(false);

  // Reset cue on video change
  useEffect(() => {
    setCurrentCueIndex(0);
    setTranscriptSearch('');
  }, [video.id]);

  // Optional ambient intro timer
  useEffect(() => {
    if (!ambientIntroActive) return;

    const startTime = performance.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const left = Math.max(0, (duration - elapsed) / 1000);
      setSecondsRemaining(parseFloat(left.toFixed(1)));

      if (elapsed >= duration) {
        setAmbientIntroActive(false);
        setSecondsRemaining(0);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [ambientIntroActive]);

  // Optional simulated auto-follow for cues
  useEffect(() => {
    if (!autoFollow || !activeVttTrack || !subtitlesEnabled) return;
    const cues = activeVttTrack.cues;
    if (!cues || cues.length === 0) return;

    const timer = setInterval(() => {
      setCurrentCueIndex((prev) => (prev + 1) % cues.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [autoFollow, activeVttTrack, subtitlesEnabled]);

  const handleTriggerAmbientIntro = () => {
    setAmbientIntroActive(true);
    setSecondsRemaining(5.0);
    if (onNotify) {
      onNotify(`Playing 5-second subtle ambient intro for Part ${video.part} (video stays fully visible)`);
    }
  };

  const handleStopIntro = () => {
    setAmbientIntroActive(false);
    setSecondsRemaining(0);
  };

  const toggleSubtitles = () => {
    const nextState = !subtitlesEnabled;
    setSubtitlesEnabled(nextState);
    if (onNotify) {
      onNotify(nextState ? 'WebVTT Subtitles: Enabled' : 'WebVTT Subtitles: Disabled');
    }
  };

  const handlePrevCue = () => {
    if (!activeVttTrack) return;
    setCurrentCueIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCue = () => {
    if (!activeVttTrack) return;
    setCurrentCueIndex((prev) => Math.min(activeVttTrack.cues.length - 1, prev + 1));
  };

  const handleSelectCue = (index: number) => {
    setCurrentCueIndex(index);
    if (!subtitlesEnabled) setSubtitlesEnabled(true);
  };

  const handleDownloadVtt = () => {
    if (!activeVttTrack) return;
    downloadVttTrackFile(activeVttTrack, `${video.id}-technical-subtitles.vtt`);
    if (onNotify) {
      onNotify(`Downloaded WebVTT subtitle track for ${video.title}`);
    }
  };

  const handleCopyTranscript = async () => {
    if (!activeVttTrack) return;
    const text = activeVttTrack.cues
      .map((c, i) => `[${c.startFormatted} --> ${c.endFormatted}] ${c.speaker ? `${c.speaker}: ` : ''}${c.text}`)
      .join('\n\n');
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedTranscript(true);
        setTimeout(() => setCopiedTranscript(false), 2500);
        if (onNotify) {
          onNotify('Copied full technical transcript with timestamps to clipboard');
        }
      }
    } catch {
      // ignore
    }
  };

  // Filter cues for transcript drawer
  const filteredCues = useMemo(() => {
    if (!activeVttTrack) return [];
    if (!transcriptSearch.trim()) return activeVttTrack.cues;
    const query = transcriptSearch.toLowerCase();
    return activeVttTrack.cues.filter((cue) =>
      cue.text.toLowerCase().includes(query) ||
      (cue.speaker && cue.speaker.toLowerCase().includes(query)) ||
      cue.startFormatted.includes(query)
    );
  }, [activeVttTrack, transcriptSearch]);

  const currentCue: VttCue | undefined = activeVttTrack?.cues[currentCueIndex];

  // Video embed URL
  const embedUrl = video.embedUrl || (video.driveId ? `https://drive.google.com/file/d/${video.driveId}/preview` : video.url);

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Video Viewport Container: Scaled for full fit without cutting off lower text */}
      <div
        ref={viewportRef}
        className={`relative w-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-[inset_0_0_40px_rgba(0,0,0,0.95),0_0_30px_rgba(0,184,255,0.12)] group transition-all duration-300 ${
          viewportFit === 'full-fit'
            ? 'min-h-[400px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[620px] xl:min-h-[680px] aspect-[16/10]'
            : 'aspect-video min-h-[340px] sm:min-h-[420px]'
        }`}
      >
        {/* Technical Corner Crosshairs HUD */}
        <div className="absolute top-2.5 left-3 z-10 pointer-events-none text-[9px] font-mono text-sky-400/80 flex items-center gap-1.5 drop-shadow-md">
          <span className="text-[#00ff41]">+</span>
          <span>SWID-SHRK // {trackLabel.toUpperCase().replace(/\s+/g, '-')} // PART-0{video.part}</span>
        </div>

        {/* Top Right HUD: Fullscreen Trigger & Fit Status */}
        <div className="absolute top-2.5 right-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1 rounded bg-black/70 hover:bg-black text-zinc-300 hover:text-white border border-zinc-700/80 transition-all cursor-pointer shadow-md"
            title="Expand Video to Native Fullscreen"
            aria-label="Toggle native fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
          </button>
          <span className="text-[9px] font-mono text-sky-400/80 drop-shadow-md pointer-events-none">+</span>
        </div>

        <div className="absolute bottom-2.5 left-3 z-10 pointer-events-none text-[9px] font-mono text-sky-400/80 flex items-center gap-1 drop-shadow-md">
          <span>+</span>
          <span className="text-zinc-400 hidden sm:inline">ABAQUS/CAE 2024 &bull; 1080p HD &bull; FULL FIT</span>
        </div>
        <div className="absolute bottom-2.5 right-3 z-10 pointer-events-none text-[9px] font-mono text-sky-400/80 flex items-center gap-1.5 drop-shadow-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>VTT-SYNC // {subtitleDockMode === 'docked' ? 'DOCKED' : 'OVERLAY'}</span>
          <span className="text-[#00ff41]">+</span>
        </div>

        {/* 5-Second Ambient Intro Badge (Corner only, non-blocking) */}
        {ambientIntroActive && (
          <div className="absolute top-8 right-3 z-20 pointer-events-none animate-fadeIn flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-black/80 border border-[#00ff41]/60 text-[#00ff41] text-[10px] font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,65,0.4)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff41]" />
              </span>
              <span className="font-bold tracking-wider">5s INTRO: {secondsRemaining.toFixed(1)}s</span>
            </div>
          </div>
        )}

        {/* Ambient Perimeter Glow (leaves center 100% visible) */}
        {ambientIntroActive && (
          <div
            className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 ease-out"
            style={{
              boxShadow: 'inset 0 0 50px rgba(0, 255, 65, 0.45), inset 0 0 100px rgba(0, 184, 255, 0.25)',
              opacity: secondsRemaining > 0 ? (secondsRemaining / 5.0) : 0,
            }}
            aria-hidden="true"
          />
        )}

        {/* Main Video IFrame */}
        <iframe
          key={`${video.id}-iframe`}
          src={embedUrl}
          title={video.title}
          className="w-full h-full border-0 rounded-xl bg-black"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="eager"
        />

        {/* Interactive WebVTT Subtitle Track Overlay (Only when in overlay mode) */}
        {subtitlesEnabled && currentCue && subtitleDockMode === 'overlay' && (
          <div
            role="region"
            aria-label="Closed Captions & Subtitles"
            aria-live="polite"
            className="absolute bottom-6 left-3 right-3 sm:left-8 sm:right-8 z-20 pointer-events-none flex flex-col items-center justify-center animate-fadeIn"
          >
            <div
              className={`max-w-2xl w-full p-2 sm:p-2.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-200 pointer-events-auto ${
                highContrast
                  ? 'bg-black text-white border-white/80 ring-2 ring-black'
                  : 'bg-black/90 text-zinc-100 border-[#00ff41]/50 shadow-[0_0_20px_rgba(0,0,0,0.85)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-zinc-800 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-sky-400">
                  <Subtitles className="w-3 h-3 text-[#00ff41]" />
                  <span className="font-bold text-[#00ff41]">{currentCue.speaker || 'SWID-SHRK Laboratory'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-amber-400 font-semibold">
                    {currentCue.startFormatted} &rarr; {currentCue.endFormatted}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSubtitleDockMode('docked')}
                    className="text-sky-400 hover:text-white cursor-pointer ml-1"
                    title="Dock subtitles below video so nothing is blocked"
                  >
                    Dock Below &darr;
                  </button>
                </div>
              </div>

              <p
                className={`font-sans leading-relaxed text-center font-medium drop-shadow-md select-text ${
                  subtitleFontSize === 'sm' ? 'text-xs sm:text-sm' : subtitleFontSize === 'lg' ? 'text-base sm:text-lg font-semibold' : 'text-sm sm:text-base'
                }`}
              >
                {currentCue.text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DOCKED SUBTITLE THEATER CONSOLE: Below video so presenter & slides remain 100% visible */}
      {subtitlesEnabled && currentCue && subtitleDockMode === 'docked' && (
        <div
          role="region"
          aria-label="Synchronized Technical Closed Captions"
          className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#080d15] via-[#09111c] to-[#070b12] border-2 border-[#00ff41]/40 shadow-[0_4px_20px_rgba(0,255,65,0.12)] font-mono space-y-2 animate-fadeIn"
        >
          {/* Header Row: Speaker, Time Range, Index, Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-[#00ff41] border border-emerald-500/40 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Subtitles className="w-3 h-3 text-[#00ff41]" />
                <span>{currentCue.speaker || 'Dr. Pouria Hejazi'}</span>
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 text-[11px] font-mono">
                {currentCue.startFormatted} &rarr; {currentCue.endFormatted}
              </span>
              <span className="text-zinc-600 hidden xs:inline">|</span>
              <span className="text-amber-400 font-bold text-[11px] hidden xs:inline">
                Cue {currentCueIndex + 1} of {activeVttTrack?.cues.length || 1}
              </span>
            </div>

            {/* Subtitle Cue Stepper Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevCue}
                disabled={currentCueIndex === 0}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 text-zinc-200 text-[11px] font-bold cursor-pointer transition-colors"
                title="Previous subtitle cue"
              >
                &larr; Prev Cue
              </button>
              <button
                type="button"
                onClick={handleNextCue}
                disabled={!activeVttTrack || currentCueIndex === activeVttTrack.cues.length - 1}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 text-zinc-200 text-[11px] font-bold cursor-pointer transition-colors"
                title="Next subtitle cue"
              >
                Next Cue &rarr;
              </button>
              <button
                type="button"
                onClick={() => setAutoFollow((prev) => !prev)}
                className={`px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                  autoFollow
                    ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41] font-bold shadow-xs'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
                title="Auto-advance through cues"
              >
                Auto-Cycle: {autoFollow ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={() => setSubtitleDockMode('overlay')}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sky-400 text-[11px] cursor-pointer"
                title="Switch to overlay mode on video"
              >
                Overlay Mode &uarr;
              </button>
            </div>
          </div>

          {/* Large, High-Legibility Subtitle Text */}
          <div className="py-1">
            <p
              className={`font-sans leading-relaxed text-zinc-100 select-text ${
                subtitleFontSize === 'sm'
                  ? 'text-xs sm:text-sm'
                  : subtitleFontSize === 'lg'
                  ? 'text-base sm:text-lg font-semibold'
                  : 'text-sm sm:text-base font-medium'
              }`}
            >
              {currentCue.text}
            </p>
          </div>
        </div>
      )}

      {/* Primary Video Toolbar: Subtitles [CC], Transcript, Settings & Direct Links */}
      <div className="p-3 rounded-xl dark:bg-[#080d14] bg-white border dark:border-zinc-800 border-slate-200 shadow-sm space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          {/* Left Group: CC Toggle, Dock Mode Toggle, Transcript Toggle, Settings */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Master Closed Captions / Subtitle Toggle */}
            <button
              type="button"
              onClick={toggleSubtitles}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${
                subtitlesEnabled
                  ? 'bg-emerald-500/20 text-[#00ff41] border-emerald-500/50 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
                  : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-400 text-slate-600 dark:border-zinc-700 border-slate-300 hover:dark:text-white'
              }`}
              title="Toggle WebVTT Subtitles (Closed Captions)"
            >
              <Subtitles className={`w-3.5 h-3.5 ${subtitlesEnabled ? 'text-[#00ff41]' : 'text-zinc-400'}`} />
              <span>CC: {subtitlesEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Subtitle Dock/Overlay Toggle */}
            {subtitlesEnabled && (
              <button
                type="button"
                onClick={() => setSubtitleDockMode((prev) => (prev === 'docked' ? 'overlay' : 'docked'))}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg dark:bg-zinc-900 bg-slate-100 hover:dark:bg-zinc-800 border dark:border-zinc-800 border-slate-300 dark:text-zinc-300 text-slate-700 transition-all cursor-pointer"
                title={subtitleDockMode === 'docked' ? 'Subtitles are docked below video. Click to float on video.' : 'Subtitles are floating on video. Click to dock below video.'}
              >
                <span>{subtitleDockMode === 'docked' ? '⇲ Docked Below' : '⇱ Floating on Video'}</span>
              </button>
            )}

            {/* Video Viewport Fit Toggle */}
            <button
              type="button"
              onClick={() => setViewportFit((prev) => (prev === 'full-fit' ? 'cinema' : 'full-fit'))}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                viewportFit === 'full-fit'
                  ? 'dark:bg-sky-950/60 bg-sky-100 text-sky-400 border-sky-500/50 font-bold'
                  : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-400 text-slate-600 dark:border-zinc-800 border-slate-300'
              }`}
              title={viewportFit === 'full-fit' ? 'Current: Full Fitted (Height expanded to prevent cropping). Click for 16:9.' : 'Current: 16:9. Click for Full Fit.'}
            >
              <span>Fit: {viewportFit === 'full-fit' ? 'Full Fit' : '16:9'}</span>
            </button>

            {/* Native Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg dark:bg-zinc-900 bg-slate-100 hover:dark:bg-zinc-800 hover:bg-slate-200 border dark:border-zinc-800 border-slate-300 dark:text-zinc-300 text-slate-700 transition-all cursor-pointer"
              title="Enter Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>

            {/* Interactive Transcript Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowTranscript((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer shadow-xs ${
                showTranscript
                  ? 'dark:bg-sky-950/60 bg-sky-100 dark:text-sky-300 text-sky-800 border-sky-400 font-bold'
                  : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 dark:border-zinc-800 border-slate-300 hover:border-sky-400'
              }`}
              title="Open full interactive searchable transcript with timestamps"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Interactive Transcript</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-sky-500/20 text-sky-400">
                {activeVttTrack?.cues.length || 0} Cues
              </span>
              {showTranscript ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Subtitle Appearance Settings Toggle */}
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg dark:bg-zinc-900 bg-slate-100 hover:dark:bg-zinc-800 hover:bg-slate-200 border dark:border-zinc-800 border-slate-300 dark:text-zinc-300 text-slate-700 transition-all cursor-pointer"
              title="Configure subtitle appearance (font size, contrast)"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">CC Settings</span>
            </button>
          </div>

          {/* Right Group: Download VTT & Drive Direct */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Download WebVTT File */}
            <button
              type="button"
              onClick={handleDownloadVtt}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg dark:bg-emerald-950/40 bg-emerald-50 hover:dark:bg-emerald-950/70 hover:bg-emerald-100 border dark:border-emerald-500/40 border-emerald-300 text-emerald-700 dark:text-[#00ff41] transition-all cursor-pointer shadow-xs font-semibold"
              title="Download standard .vtt WebVTT subtitle track file for this tutorial"
            >
              <Download className="w-3 h-3 text-[#00ff41]" />
              <span>Download .VTT</span>
            </button>

            {/* Google Drive HD View */}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg dark:bg-sky-950/40 bg-sky-50 dark:text-sky-300 text-sky-700 border dark:border-sky-500/30 border-sky-300 hover:border-sky-400 transition-all shadow-xs"
              title="Open video directly in Google Drive player"
            >
              <ExternalLink className="w-3 h-3 text-sky-400" />
              <span className="hidden xs:inline">Drive View</span>
            </a>
          </div>
        </div>

        {/* Subtitle Appearance Controls Drawer (Expanded on click) */}
        {showSettings && (
          <div className="p-3 rounded-lg dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 text-xs font-mono space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-zinc-400 text-[11px] uppercase tracking-wider pb-1 border-b dark:border-zinc-800 border-slate-200">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Sliders className="w-3.5 h-3.5" />
                <span>WebVTT Caption Appearance & Accessibility</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="hover:text-red-400 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {/* Font Size Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Subtitle Text Size
                </label>
                <div className="flex items-center gap-1">
                  {(['sm', 'base', 'lg'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSubtitleFontSize(size)}
                      className={`flex-1 py-1 px-2 rounded text-xs transition-colors cursor-pointer font-bold ${
                        subtitleFontSize === size
                          ? 'bg-[#00ff41] text-black shadow-xs'
                          : 'dark:bg-zinc-800 bg-slate-200 dark:text-zinc-300 text-slate-700'
                      }`}
                    >
                      {size === 'sm' ? 'Compact' : size === 'base' ? 'Standard' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast Mode */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Visual Contrast
                </label>
                <button
                  type="button"
                  onClick={() => setHighContrast((prev) => !prev)}
                  className={`w-full py-1 px-2.5 rounded text-xs transition-colors cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                    highContrast
                      ? 'bg-amber-400 text-black shadow-xs'
                      : 'dark:bg-zinc-800 bg-slate-200 dark:text-zinc-300 text-slate-700'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{highContrast ? 'High Contrast Solid Black' : 'Standard Translucent'}</span>
                </button>
              </div>

              {/* Track Language & Kind Indicator */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Track Format
                </label>
                <div className="py-1 px-2 rounded dark:bg-zinc-900 bg-slate-200 text-zinc-300 text-[11px] flex items-center justify-between">
                  <span className="text-[#00ff41]">W3C WebVTT (en)</span>
                  <span className="text-zinc-500 font-bold">UTF-8</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Interactive Transcript Box with Timestamps */}
        {showTranscript && activeVttTrack && (
          <div className="p-3.5 rounded-xl dark:bg-black/70 bg-slate-50 border dark:border-sky-500/30 border-sky-300 space-y-3 animate-fadeIn">
            {/* Header: Search + Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2.5 border-b dark:border-zinc-800 border-slate-200">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder="Search transcript for Abaqus commands, parameters, formulas..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-mono dark:bg-zinc-900 bg-white border dark:border-zinc-700 border-slate-300 focus:outline-none focus:border-sky-400 dark:text-zinc-100 text-slate-900 placeholder-zinc-500"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyTranscript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono dark:bg-zinc-800 bg-white hover:dark:bg-zinc-700 hover:bg-slate-100 border dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-700 transition-all cursor-pointer font-medium shadow-xs"
                  title="Copy full timestamped transcript to clipboard"
                >
                  {copiedTranscript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-sky-400" />}
                  <span>{copiedTranscript ? 'Copied!' : 'Copy Transcript'}</span>
                </button>

                <a
                  href={activeVttTrack.vttUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono dark:bg-zinc-800 bg-white hover:dark:bg-zinc-700 hover:bg-slate-100 border dark:border-zinc-700 border-slate-300 dark:text-zinc-300 text-slate-700 transition-all shadow-xs"
                  title="View raw WebVTT file in new tab"
                >
                  <span>Raw .VTT</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>

            {/* Timestamped Cue List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredCues.length === 0 ? (
                <div className="py-6 text-center text-xs font-mono text-zinc-500">
                  No transcript cues matched &ldquo;{transcriptSearch}&rdquo;.
                </div>
              ) : (
                filteredCues.map((cue, idx) => {
                  const isSelected = activeVttTrack.cues[currentCueIndex] === cue;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const originalIndex = activeVttTrack.cues.indexOf(cue);
                        if (originalIndex !== -1) handleSelectCue(originalIndex);
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col sm:flex-row items-start gap-2.5 ${
                        isSelected
                          ? 'dark:bg-emerald-950/30 bg-emerald-50 border-emerald-500/70 shadow-sm ring-1 ring-emerald-500/30'
                          : 'dark:bg-zinc-900/60 bg-white dark:border-zinc-800 border-slate-200 hover:border-sky-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold dark:bg-zinc-800 bg-slate-100 text-amber-500 border dark:border-zinc-700 border-slate-300">
                          {cue.startFormatted}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#00ff41] font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {cue.speaker && (
                          <span className="text-[10px] font-mono text-sky-400 font-bold block mb-0.5">
                            {cue.speaker}:
                          </span>
                        )}
                        <p className="text-xs font-sans leading-relaxed dark:text-zinc-200 text-slate-800">
                          {cue.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t dark:border-zinc-800 border-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff41]" />
                <span>Synchronized with Abaqus/CAE 2024 modeling procedures</span>
              </span>
              <span>Click any timestamp to view cue</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
