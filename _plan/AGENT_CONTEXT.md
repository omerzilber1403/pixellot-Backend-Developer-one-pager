# LLM Agent Context — Backend Developer Portfolio

## What Was Built and When
This project was built in March 2026. The Forcepoint OnePager (a separate project for a
different job application) was refactored into this standalone Pixellot-focused portfolio.
The old Forcepoint commit history was wiped and this is now a clean repo.

## Key Design Decisions

### 1. Shared UX/UI with sibling AI Scientist portfolio
Identical component structure, design tokens, animations. Only content differs.
If you change design in one portfolio, sync to the other at:
`C:/Users/omerz/Documents/projectsz/Pixellot submission/`

### 2. Section ID conventions (don't change these)
| id | Who uses it |
|---|---|
| `#salesbot` | AgentCard "Try the Bot" button scrolls here |
| `#spl` | StompCard "Explore Live Case Study" button scrolls here |
| `#projects` | Navbar "Projects" link |
| `#skills` | Navbar "Experience" link |
| `#security` | Navbar "Pixellot Fit" link |
| `#contact` | Navbar "Contact" link |

### 3. PixellotAgent component behavior
- File: `src/components/sections/PixellotAgent.tsx`
- Lazy-loaded with `dynamic(..., { ssr: false })`
- Health probe (4s timeout) → switches to mock mode on failure
- `lastMsgRef` + `container.scrollTo({ top: msgTop - 8 })` → scrolls to TOP of new message
- `block:"nearest"` on all scrollIntoView calls → prevents outer page scroll
- Chips: hidden after first user message via `setChipsVisible(false)`
- Prop: `defaultLang="en"`

### 4. FlipWords — common gotcha
The `FlipWords` component does NOT accept a `style` prop. Use `className` only.

### 5. JDAlignment naming
The section heading says "Pixellot Fit" (not "JD Fit") and section id is "security" (historical).
The Navbar link label is "Pixellot Fit". Do not rename the section id.

### 6. Known files to ignore
- `ux-ui/` directory — design color palette + component reference docs (useful context)
- `netlify.toml` — alternative deployment config for Netlify

## Common Commands
```bash
npm run dev              # dev server on default port 3000
npm run dev -- --port 3001  # dev on port 3001
npm run build            # production build
```

## Companion Backend
FastAPI + LangGraph backend:
`C:/Users/omerz/Documents/projectsz/ForcePoint submission/pixellot-agent-backend/`
- `app.py` — FastAPI + /health + /chat
- `agent/graph.py` — LangGraph 4 nodes: analyzer, knowledge_retriever, generator, handoff_guard
- `agent/kb.py` — keyword-intent KB retrieval
- `render.yaml` — Render.com deploy config
