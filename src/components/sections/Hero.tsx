"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Sparkles } from "@/components/ui/sparkles";
import { FadeIn } from "@/components/ui/fade-in";
import { OWNER } from "@/lib/data";
import { Github, Linkedin, ArrowDown, Download } from "lucide-react";

const HERO_ROTATING_WORDS = ["scalable", "real-time", "ML-powered", "production-grade", "event-driven"];

const GLASS_BTN = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderColor: "rgba(255, 255, 255, 0.1)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <BackgroundBeams className="z-0 opacity-30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex flex-col items-center min-h-[calc(100vh-6rem)] justify-center">

          <div className="flex flex-col justify-center items-center text-center">

            {/* Pulsing badge */}
            <FadeIn delay={0}>
              <div
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-mono uppercase tracking-widest w-fit"
                style={{
                  background: "rgba(0, 230, 118, 0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(0, 230, 118, 0.25)",
                  color: "#00E676",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#00E676" }}
                />
                Applying — Backend Developer (Student) @ Pixellot
              </div>
            </FadeIn>

            {/* Name with sparkles */}
            <Sparkles particleColor="#00E676" particleDensity={50} className="block mb-2">
              <TextGenerateEffect
                words={OWNER.name}
                filter={true}
                duration={0.6}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-text-primary leading-none"
              />
            </Sparkles>

            {/* FlipWords tagline */}
            <FadeIn delay={0.15}>
              <div className="mt-5 text-2xl sm:text-3xl font-bold text-text-secondary leading-snug">
                I build{" "}
                <FlipWords
                  words={HERO_ROTATING_WORDS}
                  duration={3000}
                  className="font-bold text-[#00E676]"
                />
                {" "}backends.
              </div>
            </FadeIn>

            {/* Bio blurb */}
            <FadeIn delay={0.25}>
              <p className="mt-4 text-text-secondary text-base leading-relaxed max-w-lg">
                B.Sc. CS student with 3 years of hands-on software development in the IDF Navy.
                I specialize in backend logic, real-time systems, and integrating AI into functional pipelines.
                I enjoy taking a product requirement (PRD) and turning it into a stable, production-ready service.
                Looking to bring my Python and Node.js experience to the Pixellot Content team.
              </p>
            </FadeIn>

            {/* CTA row */}
            <FadeIn delay={0.35}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#projects"
                  className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: "#00E676", color: "#020617" }}
                >
                  View My Projects <ArrowDown className="w-4 h-4" />
                </a>

                <a
                  href={OWNER.cvPdf}
                  download
                  className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                  style={GLASS_BTN}
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>

                <a
                  href={OWNER.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                  style={GLASS_BTN}
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>

                <a
                  href={OWNER.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                  style={GLASS_BTN}
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </FadeIn>

          </div>
        </div>
      </div>
    </section>
  );
}
