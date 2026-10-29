import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  depth: number;
  hasSpike?: boolean;
}

interface GoldenThreadPoint {
  x: number;
  y: number;
  distance: number;
}

interface GoldenThread {
  angle: number;
  distance: number;
  initialDistance: number;
  speed: number;
  radialSpeed: number;
  length: number;
  history: GoldenThreadPoint[];
  width: number;
  color: string;
  glowColor: string;
  headColor: string;
  inclination: number;
  sparkPhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

interface BlackHoleHeroProps {
  className?: string;
  children?: React.ReactNode;
  mouseProximity?: number;
}

export const BlackHoleHero: React.FC<BlackHoleHeroProps> = ({
  className = '',
  children,
  mouseProximity = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const proximityRef = useRef(mouseProximity);

  useEffect(() => {
    proximityRef.current = mouseProximity;
  }, [mouseProximity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;
    let lastRenderTime = performance.now();

    // Smartphone & performance detection
    const isMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );

    // Clamp DPR to 1 on mobile to avoid 4x-9x retina pixel fill rate slowdown
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    // Pause rendering when scrolled out of view to free CPU & GPU completely
    const observer = new IntersectionObserver(
      ([entry]) => {
        const prevVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!prevVisible && isVisible) {
          lastRenderTime = performance.now();
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Star colors
    const starColors = [
      '#ffffff',
      '#e0f2fe',
      '#bae6fd',
      '#67e8f9',
      '#fef08a',
    ];

    // Responsive star count: 32 on mobile (fast), 140 on desktop (rich)
    const starsCount = isMobile ? 32 : Math.min(Math.floor((width * height) / 5200), 140);
    const stars: Star[] = Array.from({ length: starsCount }, (_, i) => {
      const depth = isMobile ? 0.5 : (0.2 + Math.random() * 0.8);
      const size = isMobile ? (0.8 + Math.random() * 0.8) : (0.6 + Math.random() * 1.4);
      const baseAlpha = 0.35 + Math.random() * 0.45;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: 0.8 + Math.random() * 2.0,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[i % starColors.length],
        depth,
        hasSpike: !isMobile && size > 1.6 && i % 4 === 0,
      };
    });

    // Infalling golden threads (accretion matter): 14 on mobile, 42 on desktop
    const threadsCount = isMobile ? 14 : 42;
    const goldenPalettes = [
      { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)', headColor: '#ffffff' },
      { color: '#fff9c4', glow: 'rgba(255, 245, 157, 0.7)', headColor: '#ffffff' },
      { color: '#ffe082', glow: 'rgba(255, 213, 79, 0.7)', headColor: '#fff8e1' },
      { color: '#ffca28', glow: 'rgba(255, 160, 0, 0.6)', headColor: '#ffe082' },
      { color: '#ffa000', glow: 'rgba(230, 81, 0, 0.5)', headColor: '#ffca28' },
    ];

    const goldenThreads: GoldenThread[] = Array.from({ length: threadsCount }, () => {
      const palette = goldenPalettes[Math.floor(Math.random() * goldenPalettes.length)];
      const dist = 120 + Math.random() * (isMobile ? 180 : 300);
      return {
        angle: Math.random() * Math.PI * 2,
        distance: dist,
        initialDistance: dist,
        speed: 0.014 + Math.random() * 0.02,
        radialSpeed: 0.3 + Math.random() * 0.5,
        length: isMobile ? 6 : (10 + Math.floor(Math.random() * 8)),
        history: [],
        width: isMobile ? 1.0 : (1.1 + Math.random() * 1.4),
        color: palette.color,
        glowColor: palette.glow,
        headColor: palette.headColor,
        inclination: (Math.random() - 0.5) * 0.12,
        sparkPhase: Math.random() * Math.PI * 2,
      };
    });

    // Shooting star
    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 60,
      speed: 12,
      angle: Math.PI / 4,
      alpha: 0,
      active: false,
    };

    let lastShootingStarTime = performance.now();
    let nextShootingStarDelay = isMobile ? 12000 : 6000;

    // Mouse parallax tracking (desktop only)
    const parallaxMouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      ease: 0.05,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      parallaxMouse.targetX = Math.max(-1, Math.min(1, normX));
      parallaxMouse.targetY = Math.max(-1, Math.min(1, normY));
    };

    const handleMouseLeave = () => {
      parallaxMouse.targetX = 0;
      parallaxMouse.targetY = 0;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    const render = (now: number) => {
      if (!isVisible) return; // Completely paused when scrolled off-screen!

      // Frame pacing: On mobile, limit to ~35-40 FPS to keep thermals cool and scrolling 60/120Hz
      const elapsed = now - lastRenderTime;
      if (isMobile && elapsed < 26) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastRenderTime = now;

      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Interpolate 3D parallax on desktop
      if (!isMobile) {
        parallaxMouse.currentX += (parallaxMouse.targetX - parallaxMouse.currentX) * parallaxMouse.ease;
        parallaxMouse.currentY += (parallaxMouse.targetY - parallaxMouse.currentY) * parallaxMouse.ease;
      }

      const centerX = width / 2;
      const blackHoleCenterY = Math.min(height * 0.34, 220);

      // 1. Deep Space Night Sky Void Gradient
      const spaceGlow = ctx.createRadialGradient(
        centerX,
        blackHoleCenterY,
        40,
        centerX,
        blackHoleCenterY,
        Math.max(width, height) * 0.8
      );
      spaceGlow.addColorStop(0, 'rgba(24, 12, 2, 0.95)');
      spaceGlow.addColorStop(0.3, 'rgba(10, 5, 4, 0.98)');
      spaceGlow.addColorStop(0.7, 'rgba(3, 4, 9, 1)');
      spaceGlow.addColorStop(1, 'rgba(1, 2, 5, 1)');

      ctx.fillStyle = spaceGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Cosmic Nebula Glow (Single lightweight gradient on mobile, 2 on desktop)
      if (!isMobile) {
        const nebulaGrad = ctx.createRadialGradient(
          centerX - 180,
          blackHoleCenterY - 60,
          20,
          centerX - 180,
          blackHoleCenterY - 60,
          300
        );
        nebulaGrad.addColorStop(0, 'rgba(255, 160, 20, 0.08)');
        nebulaGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Render Stars
      const maxParallax = isMobile ? 0 : 20;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        let starX = star.x - parallaxMouse.currentX * maxParallax * star.depth;
        let starY = star.y - parallaxMouse.currentY * (maxParallax * 0.6) * star.depth;

        if (starX < -10) starX += width + 20;
        if (starX > width + 10) starX -= width + 20;
        if (starY < -10) starY += height + 20;
        if (starY > height + 10) starY -= height + 20;

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.max(0.1, Math.min(1, star.baseAlpha + twinkle * 0.35));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point spike only on large desktop stars
        if (star.hasSpike && alpha > 0.65) {
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = alpha * 0.45;
          ctx.lineWidth = 0.5;
          const len = star.size * 3;
          ctx.beginPath();
          ctx.moveTo(starX - len, starY);
          ctx.lineTo(starX + len, starY);
          ctx.moveTo(starX, starY - len);
          ctx.lineTo(starX, starY + len);
          ctx.stroke();
        }
      }

      // 4. Shooting Star (Desktop or occasional mobile)
      if (!shootingStar.active && now - lastShootingStarTime > nextShootingStarDelay) {
        shootingStar.active = true;
        shootingStar.x = Math.random() * (width * 0.7);
        shootingStar.y = Math.random() * (height * 0.35);
        shootingStar.length = isMobile ? 40 : 75;
        shootingStar.alpha = 0.9;
        lastShootingStarTime = now;
        nextShootingStarDelay = isMobile ? 14000 : 7000;
      }

      if (shootingStar.active) {
        ctx.save();
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= isMobile ? 0.04 : 0.024;

        if (shootingStar.alpha <= 0 || shootingStar.x > width) {
          shootingStar.active = false;
        }
        ctx.restore();
      }

      // 5. Infalling Accretion Disk Threads
      ctx.save();
      const horizonRadius = Math.min(width * 0.25, 160);
      const prox = proximityRef.current || 0;

      // Additive blend creates warm incandescent golden sheen
      ctx.globalCompositeOperation = isMobile ? 'source-over' : 'lighter';

      const diskTilt = 0.36;
      const rot = -0.28;
      const cosRot = Math.cos(rot);
      const sinRot = Math.sin(rot);

      for (let i = 0; i < goldenThreads.length; i++) {
        const thread = goldenThreads[i];
        const distRatio = (horizonRadius * 2.0) / Math.max(thread.distance, horizonRadius * 0.75);
        const angVel = thread.speed * Math.pow(distRatio, 1.2) * (1 + prox * 0.3);
        thread.angle += angVel;

        const radPull = thread.radialSpeed * Math.pow(distRatio, 0.85) * (1 + prox * 0.35);
        thread.distance -= radPull;

        const rawX = Math.cos(thread.angle) * thread.distance;
        const rawY = Math.sin(thread.angle) * thread.distance * diskTilt;

        const px = centerX + (rawX * cosRot - rawY * sinRot);
        const py = blackHoleCenterY + (rawX * sinRot + rawY * cosRot);

        thread.history.push({ x: px, y: py, distance: thread.distance });
        if (thread.history.length > thread.length) {
          thread.history.shift();
        }

        const doppler = 0.7 + (Math.cos(thread.angle + Math.PI / 2) > 0 ? 0.4 : -0.15);
        const baseAlpha = Math.max(0.2, Math.min(0.9, doppler * 0.75));

        // Draw trail
        if (thread.history.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(thread.history[0].x, thread.history[0].y);
          for (let j = 1; j < thread.history.length; j++) {
            ctx.lineTo(thread.history[j].x, thread.history[j].y);
          }
          ctx.strokeStyle = thread.color;
          ctx.lineWidth = thread.width;
          ctx.globalAlpha = baseAlpha * 0.7;
          ctx.stroke();
        }

        // Head spark
        ctx.fillStyle = thread.headColor;
        ctx.globalAlpha = baseAlpha;
        ctx.beginPath();
        ctx.arc(px, py, thread.width * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Singularity boundary recycle
        if (thread.distance < horizonRadius * 0.78) {
          thread.distance = horizonRadius * 2.0 + Math.random() * (horizonRadius * 1.2);
          thread.angle = Math.random() * Math.PI * 2;
          thread.history = [];
        }
      }
      ctx.restore();

      // 6. Gravitational Lensing Halo Corona
      ctx.save();
      const photonGrad = ctx.createRadialGradient(
        centerX,
        blackHoleCenterY,
        horizonRadius * 0.9,
        centerX,
        blackHoleCenterY,
        horizonRadius * 1.45
      );
      photonGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      photonGrad.addColorStop(0.2, 'rgba(255, 215, 64, 0.5)');
      photonGrad.addColorStop(0.5, 'rgba(245, 124, 0, 0.25)');
      photonGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = photonGrad;
      ctx.beginPath();
      ctx.arc(centerX, blackHoleCenterY, horizonRadius * 1.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleVisibility = () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        const rect = container.getBoundingClientRect();
        isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (isVisible) {
          lastRenderTime = performance.now();
          animId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#020409] select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 50% 32%, rgba(255, 170, 40, 0.22) 0%, rgba(234, 88, 12, 0.1) 40%, transparent 75%)',
        }}
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
