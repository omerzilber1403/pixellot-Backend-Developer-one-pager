"use client";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn("relative overflow-hidden bg-bg", className)}
    >
      {/* Aurora animated layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(34,211,238,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 20% 30%, rgba(99,102,241,0.1) 0%, transparent 50%)
          `,
          animation: "aurora 8s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 30% 100%, rgba(99,102,241,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 70% 90%, rgba(34,211,238,0.08) 0%, transparent 50%)
          `,
          animation: "aurora 8s ease-in-out infinite alternate-reverse",
          animationDelay: "-4s",
        }}
      />

      {showRadialGradient && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, transparent 40%, #0a0a0f 100%)",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style>{`
        @keyframes aurora {
          0% { transform: translateX(-5%) translateY(-3%) scale(1); }
          33% { transform: translateX(3%) translateY(2%) scale(1.05); }
          66% { transform: translateX(-2%) translateY(4%) scale(0.98); }
          100% { transform: translateX(5%) translateY(-2%) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
