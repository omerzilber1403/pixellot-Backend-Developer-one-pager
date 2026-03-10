"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowingStarsProps {
  className?: string;
  starCount?: number;
  glowColor?: string;
}

export function GlowingStarsBackground({
  className,
  starCount = 80,
  glowColor = "#6366f1",
}: GlowingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(false); // start false — DataPrivacy is below fold

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Re-initialise gradients after resize (positions are re-randomised)
      initStars();
    };

    type Star = {
      x: number; y: number;
      r: number;
      opacity: number;
      glowRadius: number;
      pulseDuration: number;
      pulseOffset: number;
      // Pre-baked gradient at full opacity — alpha controlled via globalAlpha
      gradient: CanvasGradient;
    };

    let stars: Star[] = [];

    const initStars = () => {
      // Pre-compute gradient objects at fixed positions. Star positions are
      // random-but-fixed, so we only need to recreate gradients on resize.
      // This eliminates 60+ CanvasGradient allocations per animation frame.
      stars = Array.from({ length: starCount }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const glowRadius = Math.random() * 4 + 2;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        gradient.addColorStop(0, "rgba(99,102,241,0.4)");
        gradient.addColorStop(1, "transparent");

        return {
          x, y,
          r: Math.random() * 1.2 + 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          glowRadius,
          pulseDuration: Math.random() * 3000 + 2000,
          pulseOffset: Math.random() * Math.PI * 2,
          gradient,
        };
      });
    };

    initStars();
    resize();
    window.addEventListener("resize", resize);

    // Only draw when the section is in the viewport
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { rootMargin: "100px" }
    );
    observer.observe(canvas);

    let frame: number;
    let startTime = Date.now();

    const draw = () => {
      // Skip all GPU work when off-screen — critical: DataPrivacy is below
      // the fold and this section was burning main-thread time even while
      // the user hadn't scrolled anywhere near it.
      if (!visibleRef.current) {
        frame = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      for (const star of stars) {
        const pulse = Math.sin(
          (elapsed / star.pulseDuration) * Math.PI * 2 + star.pulseOffset
        );
        const alpha = star.opacity + pulse * 0.2;

        // Use globalAlpha instead of baking alpha into each gradient per frame.
        // The gradient was pre-computed at init — zero allocations per frame.
        ctx.globalAlpha = alpha;

        // Outer glow (pre-baked gradient)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = star.gradient;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(248,250,252,1)";
        ctx.fill();
      }

      ctx.globalAlpha = 1; // restore default

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [starCount, glowColor]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
    />
  );
}
