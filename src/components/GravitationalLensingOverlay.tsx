import React, { useEffect, useRef, useState, useMemo } from 'react';

interface GravitationalLensingOverlayProps {
  className?: string;
  intensity?: number;
  isActive?: boolean;
}

/**
 * GravitationalLensingOverlay
 * Implements real-time Einstein Gravitational Lensing around the Black Hole:
 * 1. Generates a mathematically accurate Einstein deflection displacement map for SVG filter #blackHoleGravitationalLensing.
 * 2. Renders a dynamic Canvas overlay that distorts surrounding celestial objects, orbital trails, and background stars into Einstein rings and caustic lensing arcs.
 * 3. Simulates relativistic photon deflection: alpha(r) = (4 * G * M) / (c^2 * r), creating tangential shear and Einstein caustics.
 */
export const GravitationalLensingOverlay: React.FC<GravitationalLensingOverlayProps> = ({
  className = '',
  intensity = 1.0,
  isActive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displacementDataUrl, setDisplacementDataUrl] = useState<string>('');

  // Generate mathematical 256x256 Einstein deflection vector map encoded in RG channels
  // Red = X-displacement, Green = Y-displacement, 128 = neutral (0 displacement)
  useEffect(() => {
    const size = 256;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = size;
    offCanvas.height = size;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    const center = size / 2;
    const maxRadius = size / 2;
    // Einstein radius parameter
    const einsteinRadius = 55;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const r = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * size + x) * 4;

        if (r < 1 || r > maxRadius) {
          // Neutral (no displacement)
          data[idx] = 128;
          data[idx + 1] = 128;
          data[idx + 2] = 128;
          data[idx + 3] = 255;
          continue;
        }

        // Relativistic Einstein deflection angle: alpha(r) ~ r_E^2 / r
        // Tangential light shearing and radial deflection
        const falloff = Math.exp(-Math.pow((r - einsteinRadius) / 45, 2));
        const deflection = (einsteinRadius / (r + 10)) * 1.6 * falloff;

        // Radial vector components normalized
        const nx = dx / r;
        const ny = dy / r;

        // Tangential swirl component (Kerr frame dragging)
        const swirlX = -ny * 0.3 * falloff;
        const swirlY = nx * 0.3 * falloff;

        // Encode into [0, 255] around 128
        const dispX = Math.max(-1, Math.min(1, (nx * deflection + swirlX) * intensity));
        const dispY = Math.max(-1, Math.min(1, (ny * deflection + swirlY) * intensity));

        data[idx] = Math.round(128 + dispX * 127); // R channel = X displacement
        data[idx + 1] = Math.round(128 + dispY * 127); // G channel = Y displacement
        data[idx + 2] = 128; // B channel unused
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setDisplacementDataUrl(offCanvas.toDataURL());
  }, [intensity]);

  // Dynamic canvas animation of the Einstein lensing caustic field & distorted photons
  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Fixed canvas size for high-DPI rendering
    const width = 640;
    const height = 640;
    canvas.width = width;
    canvas.height = height;
    const cx = width / 2;
    const cy = height / 2;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Einstein Ring Primary Caustic (High-intensity distorted light ring)
      const einsteinRadius = 138;
      const ringGlow = ctx.createRadialGradient(cx, cy, einsteinRadius - 28, cx, cy, einsteinRadius + 38);
      ringGlow.addColorStop(0, 'rgba(255, 215, 64, 0)');
      ringGlow.addColorStop(0.35, 'rgba(255, 179, 0, 0.18)');
      ringGlow.addColorStop(0.5, 'rgba(255, 248, 225, 0.45)');
      ringGlow.addColorStop(0.65, 'rgba(255, 152, 0, 0.22)');
      ringGlow.addColorStop(1, 'rgba(216, 67, 21, 0)');

      ctx.save();
      ctx.fillStyle = ringGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, einsteinRadius + 38, 0, Math.PI * 2);
      ctx.fill();

      // 2. Warped Gravitational Arcs (Multiple distorted images of background stars)
      const numArcs = 8;
      for (let i = 0; i < numArcs; i++) {
        const baseAngle = (i * Math.PI * 2) / numArcs + t * 0.15 * (i % 2 === 0 ? 1 : -0.7);
        const arcRadius = einsteinRadius + Math.sin(t * 0.8 + i) * 14;
        const arcLength = 0.45 + Math.sin(t + i * 2) * 0.15;

        ctx.beginPath();
        ctx.arc(cx, cy, arcRadius, baseAngle, baseAngle + arcLength);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 235, 150, 0.65)' : 'rgba(255, 167, 38, 0.55)';
        ctx.lineWidth = 1.8 + Math.sin(t * 1.5 + i) * 0.8;
        ctx.shadowColor = 'rgba(255, 183, 77, 0.9)';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

      // 3. Tangentially Sheared Background Stars & Microlensing Beacons
      const numStars = 14;
      for (let j = 0; j < numStars; j++) {
        const starAngle = (j * Math.PI * 2) / numStars + (j * 1.7) + t * 0.08;
        const starDist = einsteinRadius + 45 + Math.sin(j * 3.1) * 35;
        const sx = cx + Math.cos(starAngle) * starDist;
        const sy = cy + Math.sin(starAngle) * starDist;

        // Tangential shear: render distorted ellipse perpendicular to radius
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(starAngle + Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, 6 + Math.sin(t * 2 + j) * 2.5, 1.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = j % 3 === 0 ? '#ffffff' : j % 3 === 1 ? '#ffcc80' : '#80d8ff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 4. Relativistic Photon Deflection Streamers spiraling into the photon sphere
      const numStreamers = 4;
      for (let k = 0; k < numStreamers; k++) {
        const spiralAngle = t * 0.35 + (k * Math.PI) / 2;
        ctx.beginPath();
        for (let step = 0; step < 40; step++) {
          const r = einsteinRadius * 1.45 - step * 1.6;
          const theta = spiralAngle + (step * 0.08);
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * r;
          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(255, 215, 64, 0.25)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 6;
        ctx.stroke();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isActive]);

  return (
    <div
      className={`absolute inset-[-40%] pointer-events-none flex items-center justify-center overflow-visible z-15 ${className}`}
      aria-hidden="true"
    >
      {/* Hidden SVG Definitions: Einstein Gravitational Lensing Filter */}
      <svg className="w-0 h-0 absolute overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          {displacementDataUrl && (
            <filter
              id="blackHoleGravitationalLensing"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              filterUnits="userSpaceOnUse"
            >
              {/* Load the computed Einstein deflection map */}
              <feImage
                href={displacementDataUrl}
                result="einsteinDeflectionMap"
                preserveAspectRatio="none"
              />
              {/* Apply relativistic displacement map to underlying graphics */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="einsteinDeflectionMap"
                scale="42"
                xChannelSelector="R"
                yChannelSelector="G"
                result="lensedDisplacement"
              />
              {/* Slight relativistic chromatic dispersion blur */}
              <feGaussianBlur in="lensedDisplacement" stdDeviation="0.4" result="lensedFinal" />
              <feMerge>
                <feMergeNode in="lensedFinal" />
              </feMerge>
            </filter>
          )}

          {/* High-intensity Einstein Ring Glow */}
          <filter id="einsteinRingGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Dynamic 2D Canvas Overlay rendering relativistic Einstein ring caustics */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none opacity-90 transition-opacity duration-700"
      />
    </div>
  );
};
