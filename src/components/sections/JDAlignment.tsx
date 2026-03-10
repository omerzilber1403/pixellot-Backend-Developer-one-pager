"use client";
import { GlowingStarsBackground } from "@/components/ui/glowing-stars";
import { FadeIn } from "@/components/ui/fade-in";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Target } from "lucide-react";

const ACCENT = "#00E676";

const JD_CARDS = [
  {
    title: "Python & Node.js",
    body: "Solid practical experience with Node.js and Python from freelance projects. Familiar with RESTful APIs, databases, and writing clean, maintainable code. Ready to adapt quickly to NestJS.",
  },
  {
    title: "AI/ML API Integration",
    body: "Hands-on experience building LangGraph agents and integrating LLM APIs. I understand how to connect backend infrastructure to AI models to create functional, personalized content pipelines.",
  },
  {
    title: "Real-World Problem Solving",
    body: "3 years of elite IDF technological service. Accustomed to taking ownership of tasks, troubleshooting real-world data issues, and maintaining high engineering standards.",
  },
];

export function JDAlignment() {
  return (
    <section
      id="security"
      className="relative py-24 overflow-hidden"
    >
      <GlowingStarsBackground starCount={60} className="opacity-40" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div
            className="rounded-3xl border p-10"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(255,255,255,0.08)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Icon + header */}
            <div className="flex justify-center mb-6">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl border"
                style={{
                  background: `${ACCENT}14`,
                  backdropFilter: "blur(12px)",
                  borderColor: `${ACCENT}33`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <Target className="w-7 h-7" style={{ color: ACCENT }} />
              </div>
            </div>

            <FadeIn delay={0.1}>
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3 text-center">
                Pixellot Fit
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8 text-center">
                Why I Fit the Job Description
              </h2>
            </FadeIn>

            {/* 3 CardSpotlight cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {JD_CARDS.map((card, idx) => (
                <FadeIn key={card.title} delay={0.2 + idx * 0.1}>
                  <CardSpotlight
                    color={`${ACCENT}12`}
                    radius={250}
                    className="flex flex-col gap-3 h-full"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${ACCENT}18`, color: ACCENT }}
                    >
                      <span className="text-sm font-bold font-mono">{idx + 1}</span>
                    </div>
                    <h3 className="font-bold text-text-primary text-sm leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-text-secondary text-xs leading-relaxed flex-1">
                      {card.body}
                    </p>
                  </CardSpotlight>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
