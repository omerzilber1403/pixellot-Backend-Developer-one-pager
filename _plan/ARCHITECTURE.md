# Architecture & File Map

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`, `@theme inline`)
- **Animations:** Framer Motion 12
- **Icons:** lucide-react 0.577
- **UI Components:** Aceternity UI (adapted, vendored into `src/components/ui/`)
- **Fonts:** Space Grotesk (headings) + Inter (body) + Geist Mono (code)

## Design Tokens (globals.css + @theme)
| Token | Value |
|---|---|
| `--color-accent` / `text-accent` | `#00E676` neon green |
| `--color-accent-hover` | `#00c853` |
| `--color-bg` / `bg-bg` | `#020617` dark navy |
| `--color-surface` | `#0f172a` |
| `--color-border-col` | `#1e293b` |
| `--color-text-primary` / `text-text-primary` | `#f8fafc` |
| `--color-text-secondary` / `text-text-secondary` | `#94a3b8` |
| `--color-text-muted` / `text-text-muted` | `#475569` |

Glassmorphism system: `--glass-bg`, `--glass-border`, `--glass-shadow`, `--glass-blur`  
Fixed orb background: `.orb-field` with 4 animated green radial gradient orbs in `layout.tsx`

## File Structure
```
src/
├── app/
│   ├── globals.css          ← Design tokens, orb animations, scrollbar, selection styles
│   ├── layout.tsx           ← Fonts, metadata, orb-field background layer
│   ├── page.tsx             ← Section assembly (Navbar + 6 sections)
│   └── api/terminal/[scenario]/route.ts  ← SPL case study terminal API
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx       ← Sticky glass navbar, scroll-aware opacity
│   ├── sections/
│   │   ├── Hero.tsx         ← FlipWords tagline, sparkles name, CTA buttons
│   │   ├── PixellotShowcase.tsx  ← 3 project cards + AlignPanel strip
│   │   ├── PixellotAgent.tsx    ← Live AI chat (lazy-loaded, ssr:false)
│   │   ├── Experience.tsx   ← CardSpotlight cards from CV data
│   │   ├── JDAlignment.tsx  ← 3 JD-fit cards with GlowingStars background
│   │   └── Contact.tsx      ← AuroraBackground + social links
│   ├── spl-case-study/
│   │   └── index.tsx        ← Interactive SPL terminal case study
│   ├── agent-showcase/
│   │   └── index.tsx        ← (legacy, not used in current page.tsx)
│   └── ui/                  ← All Aceternity UI components (vendored)
│
├── data/
│   ├── portfolio.ts         ← CV data: WorkExperience + EducationExperience
│   └── terminal-scenarios.ts ← SPL terminal scenarios
├── lib/
│   ├── data.ts              ← OWNER, NAV_LINKS constants
│   └── utils.ts             ← cn() utility
└── types/
    └── index.ts             ← WorkExperience, EducationExperience, NavLink types
```

## Page Section Order (page.tsx)
1. `<Navbar />` — sticky glass top nav
2. `<Hero />` — full screen, BackgroundBeams + FlipWords + Sparkles
3. `<PixellotShowcase />` — 3 project cards + 3 alignment panels (id="projects")
4. `<section id="salesbot">` — header + `<PixellotAgent />` live demo
5. `<SPLCaseStudy />` — interactive terminal (id="spl")
6. `<Experience />` — CV cards (id="skills")
7. `<JDAlignment />` — 3 JD-fit cards (id="security")
8. `<Contact />` — AuroraBackground footer (id="contact")

## Nav Links → Section IDs
| Nav label | href | Section id |
|---|---|---|
| Projects | #projects | PixellotShowcase section |
| Experience | #skills | Experience section |
| Pixellot Fit | #security | JDAlignment section |
| Contact | #contact | Contact section |

## Environment Variables
```
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000   # local dev
NEXT_PUBLIC_AGENT_API_URL=https://your-render-url.onrender.com  # production
```
