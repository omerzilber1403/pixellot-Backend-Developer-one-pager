# Content Guide — Backend Developer Portfolio

## Role Context
This portfolio targets: **Backend Developer (Student)** at Pixellot Content team  
JD keywords: Python, Node.js, NestJS, REST APIs, ML integration, real-time systems,
production mindset, backend-to-AI pipeline

## Where Each Text Lives

### Hero Section (`src/components/sections/Hero.tsx`)
- **Badge:** `"Applying — Backend Developer (Student) @ Pixellot"`
- **FlipWords:** `["scalable", "real-time", "ML-powered", "production-grade", "event-driven"]`
- **Sentence:** `"I build ___ backends."`
- **Bio:** B.Sc. CS student with 3 years of hands-on IDF Navy software development. Specializes in backend logic, real-time systems, and integrating AI into functional pipelines.

### PixellotShowcase (`src/components/sections/PixellotShowcase.tsx`)
**Header:**
- Badge: "Backend-Ready Engineering"
- Title: "Built for Sports Production Backends"

**Card 1 — AgentCard (full width):**
- Badge: "Backend + AI Integration"
- Title: "Pixellot Knowledge & Sales Agent"
- CTA: "Try the Pixellot Bot ↓" → scrolls to #salesbot

**Card 2 — StompCard:**
- Badge: "Latency & Real-Time Systems"
- Title: "Real-Time Football Event Architecture"
- CTA: "Explore Live Case Study ↓" → scrolls to #spl

**Card 3 — UnityCard:**
- Badge: "C# · Unity · Object-Oriented Design"
- Title: "Naval Simulation System (IDF)"
- No CTA (just pills)

**AlignPanels (bottom strip):**
1. Code icon — "Node.js & Python Backend"
2. Brain icon — "Integrating AI into Production"
3. Shield icon — "End-to-End Ownership (IDF Navy)"

### JDAlignment (`src/components/sections/JDAlignment.tsx`)
Cards (const JD_CARDS array):
1. "Python & Node.js" — practical API/backend experience, ready for NestJS
2. "AI/ML API Integration" — LangGraph + LLM API integration
3. "Real-World Problem Solving" — IDF 3-year service, ownership culture

### Contact (`src/components/sections/Contact.tsx`)
- h2: "Let's build sports backends that scale."
- sub: "Open to the Backend Developer (Student) role at Pixellot."

### OWNER constants (`src/lib/data.ts`)
```typescript
export const OWNER = {
  name: "Omer Zilbershtein",
  role: "Backend Developer Student",
  targetCompany: "Pixellot",
  targetRole: "Backend Developer Student",
  // ...
}
```
