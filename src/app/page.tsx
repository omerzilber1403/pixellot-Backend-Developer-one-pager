"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { PixellotShowcase } from "@/components/sections/PixellotShowcase";
import dynamic from "next/dynamic";
import { Experience } from "@/components/sections/Experience";
import { JDAlignment } from "@/components/sections/JDAlignment";
import { Contact } from "@/components/sections/Contact";

// Lazy-load heavy interactive sections
const PixellotAgent = dynamic(
  () => import("@/components/sections/PixellotAgent").then((m) => m.PixellotAgent),
  { ssr: false }
);
const SPLCaseStudy = dynamic(() => import("@/components/spl-case-study"), { ssr: false });

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PixellotShowcase />

      {/* AI Agent demo section */}
      <section id="salesbot" className="py-24 px-4">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 text-xs font-mono uppercase tracking-widest"
            style={{ background: "rgba(0,230,118,0.07)", borderColor: "rgba(0,230,118,0.22)", color: "#00E676" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00E676" }} />
            Live AI Demo
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">I Built This For You</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A FastAPI + LangGraph agent grounded in Pixellot&apos;s product data.
            Degrades gracefully to offline demo mode if the backend is sleeping.
          </p>
        </div>
        <PixellotAgent defaultLang="en" />
      </section>

      <SPLCaseStudy lang="en" />
      <Experience />
      <JDAlignment />
      <Contact />
    </main>
  );
}
