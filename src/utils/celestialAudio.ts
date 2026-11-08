import { CelestialBodyKey } from '../types';

/**
 * Web Audio API Cosmic Sound Synthesizer
 * Synthesizes zero-dependency, real-time procedural audio effects for celestial body
 * rotation acceleration, orbital alignment, and the sensation of entering into a new cosmic world.
 */

// Dedicated harmonic frequencies (Hz) for each celestial body
const CELESTIAL_HARMONICS: Record<CelestialBodyKey, number[]> = {
  blackhole: [43.65, 65.41, 92.5, 130.81], // Deep gravitational singularity & event horizon drone
  sun: [185.0, 277.18, 369.99, 554.37], // Radiant high-heat solar photosphere & prominence resonance
  mercury: [293.66, 440.0, 587.33, 880.0], // Swift metallic silicate chime
  venus: [233.08, 349.23, 466.16, 698.46], // Supercritical dense greenhouse atmospheric resonance
  earth: [261.63, 329.63, 392.0, 523.25, 659.25], // Pure blue marble ocean & Rayleigh atmosphere major triad
  mars: [220.0, 329.63, 440.0, 659.25], // Iron oxide rust desert harmonic chime
  jupiter: [110.0, 220.0, 329.63, 493.88, 659.25], // Colossal Jovian magnetosphere & storm hum
  saturn: [196.0, 293.66, 392.0, 493.88, 739.99, 987.77], // Shimmering crystalline ice-ring harmonics
  uranus: [207.65, 311.13, 415.3, 622.25], // Aquamarine tilted ice giant cryogenic chime
  neptune: [174.61, 261.63, 349.23, 523.25, 698.46], // Deep abyssal cobalt supersonic ocean sweep
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (err) {
    console.warn('Web Audio API unavailable in this environment:', err);
    return null;
  }
}

/**
 * Synthesizes a cosmic hyperspace warp transit sound when a celestial body accelerates or is entered.
 * Combines:
 * 1. Sub-bass dimensional drop (singularity bass plunge)
 * 2. Hyperspace whoosh filter sweep (bandpassed noise transient)
 * 3. Body-specific celestial harmonic chord with shimmer overtone
 *
 * @param bodyKey The target celestial body
 * @param speedMultiplier Current rotation velocity multiplier (1.0 to 26.0+)
 */
export function playCosmicWarpSound(bodyKey: CelestialBodyKey, speedMultiplier: number = 1.0): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const speed = Math.max(1, speedMultiplier);
    // As rotation speeds up, the warp transit tightens and pitch shifts higher
    const duration = Math.max(0.45, Math.min(1.5, 1.35 / Math.sqrt(speed * 0.75)));
    const pitchShift = Math.pow(1.08, Math.min(speed, 12) - 1);

    // Master bus for this sound
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    // 1. Sub-Bass Singularity Drop
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = bodyKey === 'blackhole' ? 'sawtooth' : 'sine';

    const startBassFreq = (bodyKey === 'blackhole' ? 85 : 125) * pitchShift;
    const endBassFreq = (bodyKey === 'blackhole' ? 28 : 38) * Math.max(0.7, pitchShift * 0.85);

    bassOsc.frequency.setValueAtTime(startBassFreq, now);
    bassOsc.frequency.exponentialRampToValueAtTime(endBassFreq, now + duration * 0.85);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.4, now + 0.04);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.9);

    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start(now);
    bassOsc.stop(now + duration);

    // 2. Hyperspace Whoosh (Procedural Noise Bandpass Sweep)
    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      // White noise with slight pink roll-off
      noiseData[i] = (Math.random() * 2 - 1) * 0.8;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.Q.setValueAtTime(4.5, now);

    const startFilterFreq = 220;
    const peakFilterFreq = Math.min(6500, 1400 * Math.sqrt(speed));
    noiseFilter.frequency.setValueAtTime(startFilterFreq, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(peakFilterFreq, now + duration * 0.4);
    noiseFilter.frequency.exponentialRampToValueAtTime(320, now + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.22, now + 0.06);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start(now);
    noiseSource.stop(now + duration);

    // 3. Celestial Harmonic Chord Swell
    const harmonics = CELESTIAL_HARMONICS[bodyKey] || [261.63, 329.63, 392.0];
    const chordGain = ctx.createGain();
    chordGain.gain.setValueAtTime(0.001, now);
    chordGain.gain.linearRampToValueAtTime(0.18 / Math.sqrt(harmonics.length), now + 0.08);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.95);
    chordGain.connect(masterGain);

    harmonics.forEach((baseFreq, idx) => {
      const osc = ctx.createOscillator();
      // Black hole uses darker sawtooth/square, planets use pure sine/triangle
      osc.type = bodyKey === 'blackhole' ? 'triangle' : idx % 2 === 0 ? 'sine' : 'triangle';

      const targetFreq = baseFreq * pitchShift;
      // Frequency sweep introduces the "entering a dimensional portal" warp sensation
      osc.frequency.setValueAtTime(targetFreq * 0.88, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.05, now + duration * 0.35);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + duration);

      osc.connect(chordGain);
      osc.start(now);
      osc.stop(now + duration);
    });
  } catch (err) {
    console.warn('Audio synthesis playback error:', err);
  }
}

/**
 * Resets sound: Plays a subtle cosmic crystalline alignment chime
 */
export function playResetSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    masterGain.connect(ctx.destination);

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      osc.connect(masterGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + 0.6);
    });
  } catch {
    // Ignore
  }
}
