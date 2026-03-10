"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export function BackgroundBeams({ className }: { className?: string }) {
  const beamsRef = useRef<SVGSVGElement>(null);

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        className
      )}
    >
      <svg
        ref={beamsRef}
        className="pointer-events-none absolute h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="beam-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0" />
          </radialGradient>
          <filter id="beam-blur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Central glow — single filter pass */}
        <ellipse
          cx="400"
          cy="400"
          rx="300"
          ry="200"
          fill="url(#beam-center)"
          filter="url(#beam-blur)"
        />

        {/* All beam lines share one group-level filter pass instead of 20
            individual filter operations. Visual result is identical for
            decorative lines; render cost drops from O(n) to O(1) filter ops. */}
        <g filter="url(#beam-blur)">
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const rad = (angle * Math.PI) / 180;
            const x2 = Math.round((400 + Math.cos(rad) * 600) * 1000) / 1000;
            const y2 = Math.round((400 + Math.sin(rad) * 600) * 1000) / 1000;
            return (
              <line
                key={i}
                x1="400"
                y1="400"
                x2={x2}
                y2={y2}
                stroke="#6366f1"
                strokeWidth="0.5"
                strokeOpacity={0.06 + (i % 3) * 0.03}
              />
            );
          })}

          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8 + 22.5;
            const rad = (angle * Math.PI) / 180;
            const x2 = Math.round((400 + Math.cos(rad) * 500) * 1000) / 1000;
            const y2 = Math.round((400 + Math.sin(rad) * 500) * 1000) / 1000;
            return (
              <line
                key={`cyan-${i}`}
                x1="400"
                y1="400"
                x2={x2}
                y2={y2}
                stroke="#22d3ee"
                strokeWidth="0.3"
                strokeOpacity={0.04}
              />
            );
          })}
        </g>
      </svg>

      {/* Animated pulsing core */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
