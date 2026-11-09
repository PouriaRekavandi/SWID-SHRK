import React, { useEffect, useRef } from 'react';

interface CelestialStarfieldCanvasProps {
  className?: string;
  starCount?: number;
  interactiveParallax?: boolean;
  showShootingStars?: boolean;
  blackHoleLensing?: boolean;
}

interface Star {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  z: number; // Depth 0.1 (near) to 1.0 (distant)
  baseRadius: number; // in pixels
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  secondaryTwinkleSpeed: number;
  color: string;
  glowColor: string;
  hasSpikes: boolean;
  vx: number; // drift velocity x
  vy: number; // drift velocity y
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  progress: number;
  maxProgress: number;
  opacity: number;
  color: string;
}

// Realistic stellar spectral colors based on stellar classification
const SPECTRAL_COLORS = [
  { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' }, // Class A (Diamond White)
  { color: '#e0f2fe', glow: 'rgba(186, 230, 253, 0.5)' }, // Class B (Pale Blue)
  { color: '#bae6fd', glow: 'rgba(56, 189, 248, 0.5)' },  // Class O (Electric Cyan-Blue)
  { color: '#fef08a', glow: 'rgba(253, 224, 71, 0.4)' },  // Class G (Sun-like Gold)
  { color: '#fed7aa', glow: 'rgba(251, 146, 60, 0.35)' }, // Class K (Soft Warm Amber)
  { color: '#e9d5ff', glow: 'rgba(192, 132, 252, 0.35)' }, // Exotic Deep-Space Violet
];

export const CelestialStarfieldCanvas: React.FC<CelestialStarfieldCanvasProps> = ({
  className = '',
  starCount = 220,
  interactiveParallax = true,
  showShootingStars = true,
  blackHoleLensing = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const nextShootingStarTimeRef = useRef<number>(performance.now() + 4000);

  // Initialize stars pool
  const initStars = (count: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      // Depth distribution: more distant stars (higher z) than foreground stars
      const z = Math.pow(Math.random(), 1.5) * 0.9 + 0.1; // 0.1 (close) to 1.0 (far)
      const spectral = SPECTRAL_COLORS[Math.floor(Math.random() * SPECTRAL_COLORS.length)];
      
      // Close stars have larger radius, distant stars are tiny pinpricks
      const isHeroStar = Math.random() < 0.06; // 6% prominent stars with diffraction
      const baseRadius = isHeroStar
        ? 1.8 + Math.random() * 1.0
        : (1.0 - z * 0.65) * 1.4 + 0.35; // 0.35px to 1.75px

      // Distant stars move slower, foreground stars move slightly faster
      const speedScale = (1.1 - z) * 0.00002;
      const angle = Math.PI * 0.25 + (Math.random() - 0.5) * 0.6; // gentle south-east drift

      stars.push({
        x: Math.random(),
        y: Math.random(),
        z,
        baseRadius,
        alpha: 0.3 + Math.random() * 0.7,
        baseAlpha: (1.1 - z * 0.5) * (0.4 + Math.random() * 0.5),
        twinkleSpeed: 0.8 + Math.random() * 2.8,
        twinklePhase: Math.random() * Math.PI * 2,
        secondaryTwinkleSpeed: 1.5 + Math.random() * 4.0,
        color: spectral.color,
        glowColor: spectral.glow,
        hasSpikes: isHeroStar && z < 0.45,
        vx: Math.cos(angle) * speedScale,
        vy: Math.sin(angle) * speedScale,
      });
    }
    return stars;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    starsRef.current = initStars(starCount);

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveParallax || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = normX * 18; // max 18px parallax offset
      mouseRef.current.targetY = normY * 18;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop
    const render = (now: number) => {
      const dt = Math.min(now - lastTimeRef.current, 100); // cap delta-time
      lastTimeRef.current = now;

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with full transparency so CSS backdrop gradients shine through
      ctx.clearRect(0, 0, width, height);

      const blackHoleCenterX = width * 0.5;
      const blackHoleCenterY = height * 0.38; // matches hero black hole placement
      const blackHoleRadius = 140 * dpr;

      // Draw and update stars
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Drift motion
        star.x += star.vx * dt;
        star.y += star.vy * dt;

        // Toroidal screen wrapping
        if (star.x < -0.05) star.x += 1.1;
        if (star.x > 1.05) star.x -= 1.1;
        if (star.y < -0.05) star.y += 1.1;
        if (star.y > 1.05) star.y -= 1.1;

        // Twinkle calculation: harmonic multi-frequency oscillation
        const timeSec = now * 0.001;
        const sineWave1 = Math.sin(timeSec * star.twinkleSpeed + star.twinklePhase);
        const sineWave2 = Math.cos(timeSec * star.secondaryTwinkleSpeed + star.twinklePhase * 1.5);
        const twinkleMod = 0.65 + 0.35 * (sineWave1 * 0.7 + sineWave2 * 0.3);
        const currentAlpha = Math.max(0.08, Math.min(1.0, star.baseAlpha * twinkleMod));

        // Parallax offset based on depth (closer stars move more with mouse)
        const parallaxFactor = (1.1 - star.z);
        const pxOffset = mouseRef.current.x * parallaxFactor * dpr;
        const pyOffset = mouseRef.current.y * parallaxFactor * dpr;

        let posX = star.x * width + pxOffset;
        let posY = star.y * height + pyOffset;

        // Gravitational lensing deflection near Black Hole
        if (blackHoleLensing) {
          const dx = posX - blackHoleCenterX;
          const dy = posY - blackHoleCenterY;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist < blackHoleRadius * 2.5 && dist > 1) {
            // Relativistic deflection angle: bend light around event horizon
            const deflectionFactor = Math.pow(blackHoleRadius / (dist + blackHoleRadius * 0.4), 1.6);
            const bend = Math.min(deflectionFactor * 24 * dpr, 50 * dpr);
            // Pushes light outward around the photon sphere
            posX += (dx / dist) * bend;
            posY += (dy / dist) * bend;
          }
        }

        const radius = star.baseRadius * dpr;

        // 1. Draw outer halo glow for prominent or closer stars
        if (star.z < 0.55 || star.hasSpikes) {
          const glowRadius = radius * (star.hasSpikes ? 5.5 : 3.5);
          const glowGrad = ctx.createRadialGradient(posX, posY, 0, posX, posY, glowRadius);
          glowGrad.addColorStop(0, star.glowColor);
          glowGrad.addColorStop(0.4, star.glowColor.replace(/[\d.]+\)$/, `${(currentAlpha * 0.25).toFixed(3)})`));
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(posX, posY, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Draw 4-point subtle diffraction spikes for hero stars
        if (star.hasSpikes && currentAlpha > 0.4) {
          ctx.strokeStyle = star.glowColor.replace(/[\d.]+\)$/, `${(currentAlpha * 0.45).toFixed(3)})`);
          ctx.lineWidth = Math.max(0.6 * dpr, 0.75);
          const spikeLen = radius * 4.2;

          ctx.beginPath();
          ctx.moveTo(posX - spikeLen, posY);
          ctx.lineTo(posX + spikeLen, posY);
          ctx.moveTo(posX, posY - spikeLen);
          ctx.lineTo(posX, posY + spikeLen);
          ctx.stroke();
        }

        // 3. Draw central star core
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(posX, posY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Handle shooting stars
      if (showShootingStars) {
        if (now > nextShootingStarTimeRef.current) {
          // Spawn new shooting star
          const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.5; // ~45 deg downward-right
          const length = (60 + Math.random() * 80) * dpr;
          const speed = (0.7 + Math.random() * 0.6) * dpr;
          const startX = Math.random() * (width * 0.85);
          const startY = Math.random() * (height * 0.4);

          shootingStarsRef.current.push({
            x: startX,
            y: startY,
            dx: Math.cos(angle),
            dy: Math.sin(angle),
            length,
            speed,
            progress: 0,
            maxProgress: 180 + Math.random() * 100,
            opacity: 0.7 + Math.random() * 0.3,
            color: Math.random() > 0.4 ? '#38bdf8' : '#ffffff',
          });

          // Schedule next shooting star (every 6 to 14 seconds)
          nextShootingStarTimeRef.current = now + 6000 + Math.random() * 8000;
        }

        // Draw and update shooting stars
        for (let s = shootingStarsRef.current.length - 1; s >= 0; s--) {
          const ss = shootingStarsRef.current[s];
          ss.progress += ss.speed * (dt / 16);

          const tailX = ss.x + ss.dx * (ss.progress - ss.length);
          const tailY = ss.y + ss.dy * (ss.progress - ss.length);
          const headX = ss.x + ss.dx * ss.progress;
          const headY = ss.y + ss.dy * ss.progress;

          const lifeRatio = ss.progress / ss.maxProgress;
          const currentFade = lifeRatio < 0.2
            ? (lifeRatio / 0.2)
            : Math.max(0, 1 - (lifeRatio - 0.2) / 0.8);

          if (currentFade > 0.01) {
            const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.7, ss.color === '#ffffff' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(56, 189, 248, 0.4)');
            grad.addColorStop(1, ss.color === '#ffffff' ? `rgba(255, 255, 255, ${(ss.opacity * currentFade).toFixed(2)})` : `rgba(56, 189, 248, ${(ss.opacity * currentFade).toFixed(2)})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2 * dpr;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(headX, headY);
            ctx.stroke();

            // Head starburst
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = ss.opacity * currentFade;
            ctx.beginPath();
            ctx.arc(headX, headY, 1.5 * dpr, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }

          if (ss.progress >= ss.maxProgress) {
            shootingStarsRef.current.splice(s, 1);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [starCount, interactiveParallax, showShootingStars, blackHoleLensing]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  );
};
