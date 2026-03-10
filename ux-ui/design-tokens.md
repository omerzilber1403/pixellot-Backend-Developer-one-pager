# Design Tokens

## Colors

| Token Name | Hex | Tailwind class | Usage |
|---|---|---|---|
| `--color-bg` | `#0a0a0f` | `bg-bg` | Page background |
| `--color-surface` | `#12121a` | `bg-surface` | Card backgrounds |
| `--color-border` | `#1e1e2e` | `border-border-col` | Dividers, card borders |
| `--color-accent` | `#6366f1` | `text-accent`, `bg-accent` | Primary CTAs, highlights |
| `--color-cyan` | `#22d3ee` | `text-cyan-col` | Metric numbers, secondary highlights |
| `--color-text-primary` | `#f8fafc` | `text-text-primary` | Headlines, body copy |
| `--color-text-secondary` | `#94a3b8` | `text-text-secondary` | Subtitles, labels |
| `--color-text-muted` | `#475569` | `text-text-muted` | Metadata, timestamps |

## Typography

| Role | Family | Weight | Size (mobile / desktop) |
|---|---|---|---|
| Display — Hero name | Geist Sans | 900 | 3.5rem / 5rem |
| Heading — Section | Geist Sans | 700 | 2rem / 2.5rem |
| Subheading | Geist Sans | 600 | 1.25rem / 1.5rem |
| Body | Geist Sans | 400 | 1rem / 1.125rem |
| Code / Mono | Geist Mono | 400 | 0.875rem |
| Badge text | Geist Mono | 500 | 0.75rem |
| Label / Caps | Geist Sans | 500 | 0.75rem, tracking-widest uppercase |

## Spacing Scale (multiples of 8px)

| Token | Value | Use case |
|---|---|---|
| Section padding y | `py-24` (96px) | All major sections |
| Card padding | `p-8` (32px) | Project cards |
| Section max-width | `max-w-6xl mx-auto px-4` | Content container |
| Badge horizontal padding | `px-4 py-1.5` | Skill badges |
| Gap — badge row | `gap-2` | Skill pill clusters |

## Breakpoints

| Name | px | Notes |
|---|---|---|
| Mobile | 375px | Default (mobile-first) |
| Tablet | `md` — 768px | Cards shift to 2-col |
| Desktop | `lg` — 1280px | Full layout |

## Shadows and Effects

- **Card hover glow:** `box-shadow: 0 0 30px rgba(99, 102, 241, 0.15)`
- **Badge border:** `border: 1px solid rgba(99, 102, 241, 0.3)`
- **Section dividers:** `border-top: 1px solid #1e1e2e`
- **Text selection:** `background: #6366f1; color: #fff`

## Animation Durations

| Motion | Duration | Easing |
|---|---|---|
| Page load fade-in | 800ms | `easeOut` |
| Card spotlight | 0ms (real-time mouse) | linear |
| Flip Words transition | 300ms per word | `easeInOut` |
| Infinite marquee | 25s loop | linear |
| Aurora background | 8s loop | linear |
