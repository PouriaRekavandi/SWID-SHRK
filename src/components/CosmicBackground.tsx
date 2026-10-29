import React, { useEffect, useRef, useState } from 'react';

interface CosmicBackgroundProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  // Track theme changes dynamically
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isHidden = false;
    let isScrolling = false;
    let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastRenderTime = performance.now();

    // Check device capabilities
    const isMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );

    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Clamp DPR to 1 on mobile to eliminate fullscreen buffer memory pressure
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    // Mouse coordinates (desktop only)
    const mouse = {
      targetX: -1000,
      targetY: -1000,
      currentX: -1000,
      currentY: -1000,
      active: false,
      radius: isMobile ? 120 : 200,
    };

    const getThemeColors = () => {
      const dark = document.documentElement.classList.contains('dark');
      if (dark) {
        return {
          nodes: [
            'rgba(0, 184, 255, ',
            'rgba(0, 255, 65, ',
            'rgba(168, 85, 247, ',
            'rgba(56, 189, 248, ',
          ],
          filament: 'rgba(0, 184, 255, ',
          mouseFilament: 'rgba(0, 255, 65, ',
          mouseAura: 'rgba(0, 184, 255, ',
          particleBase: [
            'rgba(0, 255, 65, ',
            'rgba(0, 184, 255, ',
            'rgba(255, 255, 255, ',
          ],
        };
      } else {
        return {
          nodes: [
            'rgba(2, 132, 199, ',
            'rgba(5, 150, 105, ',
            'rgba(124, 58, 237, ',
          ],
          filament: 'rgba(2, 132, 199, ',
          mouseFilament: 'rgba(5, 150, 105, ',
          mouseAura: 'rgba(2, 132, 199, ',
          particleBase: [
            'rgba(5, 150, 105, ',
            'rgba(2, 132, 199, ',
          ],
        };
      }
    };

    let nodes: Node[] = [];
    let particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initCosmicWeb();
    };

    const initCosmicWeb = () => {
      const colors = getThemeColors();
      // On mobile: 8 gentle floating nodes, 16 particles (zero O(N^2) filaments)
      // On desktop: 36 nodes, 45 particles
      const nodeCount = isMobile ? 8 : 36;
      const particleCount = isMobile ? 14 : 45;

      nodes = [];
      particles = [];

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
          vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
          radius: isMobile ? (1.2 + Math.random() * 1.5) : (1.5 + Math.random() * 2.2),
          color: colors.nodes[i % colors.nodes.length],
        });
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(spawnParticle(colors));
      }
    };

    const spawnParticle = (colors: ReturnType<typeof getThemeColors>): Particle => {
      const maxLife = 140 + Math.random() * 200;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.55),
        vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.55),
        size: isMobile ? (0.6 + Math.random() * 1.2) : (0.8 + Math.random() * 1.6),
        alpha: 0,
        maxAlpha: 0.2 + Math.random() * 0.45,
        life: Math.random() * maxLife,
        maxLife,
        color: colors.particleBase[Math.floor(Math.random() * colors.particleBase.length)],
      };
    };

    // Mouse tracking on desktop only (touch screens don't have hover coordinates)
    const handlePointerMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      if (mouse.currentX === -1000) {
        mouse.currentX = e.clientX;
        mouse.currentY = e.clientY;
      }
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Scroll throttle: when the user scrolls on mobile, pause canvas rendering for buttery 60/120fps scrolling!
    const handleScroll = () => {
      if (!isMobile) return;
      isScrolling = true;
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (!isMobile) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      document.addEventListener('mouseleave', handlePointerLeave);
    }
    window.addEventListener('resize', resize, { passive: true });

    resize();

    const handleVisibilityChange = () => {
      isHidden = document.hidden;
      if (!isHidden) {
        lastRenderTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Main animation loop
    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (isHidden || prefersReducedMotion || width <= 0 || height <= 0) return;

      // During active scroll on mobile, skip rendering to give 100% CPU/GPU to scrolling thread!
      if (isMobile && isScrolling) return;

      // Pacing on mobile
      const elapsed = now - lastRenderTime;
      if (isMobile && elapsed < 33) return; // Cap mobile background to ~30 FPS
      lastRenderTime = now;

      const dt = Math.min(Math.max(0.1, elapsed / 16.66 || 1), 2.0);
      const colors = getThemeColors();

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation on desktop
      if (!isMobile && mouse.targetX !== -1000) {
        mouse.currentX += (mouse.targetX - mouse.currentX) * 0.1;
        mouse.currentY += (mouse.targetY - mouse.currentY) * 0.1;
      }

      // 1. Mouse Gravitational Halo (Desktop only)
      if (!isMobile && mouse.active && mouse.currentX > 0) {
        ctx.fillStyle = `${colors.mouseFilament}0.6)`;
        ctx.beginPath();
        ctx.arc(mouse.currentX, mouse.currentY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Nodes: Update & Draw
      const connectionDist = isMobile ? 0 : 110;
      const connectionDistSq = connectionDist * connectionDist;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx * dt;
        node.y += node.vy * dt;

        if (node.x < 5) { node.x = 5; node.vx *= -1; }
        else if (node.x > width - 5) { node.x = width - 5; node.vx *= -1; }
        if (node.y < 5) { node.y = 5; node.vy *= -1; }
        else if (node.y > height - 5) { node.y = height - 5; node.vy *= -1; }

        ctx.fillStyle = `${node.color}0.6)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect filaments to neighboring nodes (Desktop only to prevent mobile O(N^2) lag)
        if (!isMobile) {
          for (let j = i + 1; j < nodes.length; j++) {
            const neighbor = nodes[j];
            const dx = neighbor.x - node.x;
            const dy = neighbor.y - node.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionDistSq) {
              const alpha = (1 - Math.sqrt(distSq) / connectionDist) * 0.18;
              ctx.strokeStyle = `${colors.filament}${alpha})`;
              ctx.lineWidth = 0.65;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(neighbor.x, neighbor.y);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Ambient Micro-Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life += dt;

        if (p.life < 25) {
          p.alpha = (p.life / 25) * p.maxAlpha;
        } else if (p.life > p.maxLife - 25) {
          p.alpha = ((p.maxLife - p.life) / 25) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (
          p.life >= p.maxLife ||
          p.x < -10 || p.x > width + 10 ||
          p.y < -10 || p.y > height + 10
        ) {
          particles[i] = spawnParticle(colors);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (!isMobile) {
        window.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('mouseleave', handlePointerLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
      style={{
        contain: 'strict',
      }}
    />
  );
};
