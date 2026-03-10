# Component Registry

All UI components must be sourced from Aceternity UI or 21st.dev community.
No homemade bare-bones components unless documented here with justification.

## Sourced Components

| Component File | Source | Section Used In | Notes |
|---|---|---|---|
| `background-beams.tsx` | Aceternity UI | Hero | Animated SVG beams, full-viewport dark bg |
| `text-generate-effect.tsx` | Aceternity UI | Hero (name) | Blur fade-in word-by-word reveal on load |
| `flip-words.tsx` | Aceternity UI | Hero (tagline) | Cycles 3 Forcepoint-aligned phrases at 3s interval |
| `sparkles.tsx` | Aceternity UI | Hero (name overlay) | Particle sparkle overlay effect |
| `infinite-moving-cards.tsx` | Aceternity UI | Skills | Repurposed as badge marquee (2 rows, opposite directions) |
| `card-spotlight.tsx` | Aceternity UI | Projects | Mouse-follow radial gradient — primary visual differentiator |
| `bento-grid.tsx` | Aceternity UI | Projects | 2-cell grid container for project cards |
| `glowing-stars.tsx` | Aceternity UI | DataPrivacy | Subdued star-field background |
| `aurora-background.tsx` | Aceternity UI | Contact/Footer | Color-shifting aurora as closing visual |

## Custom / Minimal Components (justified exceptions)

| Component File | Justification |
|---|---|
| `layout/Navbar.tsx` | A sticky thin nav bar; Aceternity has no suitable minimal variant; component is 30 lines |
| `ui/badge.tsx` | A single rounded pill; too simple to warrant a full library import |

## Source References

- Aceternity UI: https://ui.aceternity.com/components
- 21st.dev community: https://21st.dev/community/components

## Update Log

| Date | Change |
|---|---|
| 2025-03-04 | Initial registry created; 9 Aceternity components registered |
