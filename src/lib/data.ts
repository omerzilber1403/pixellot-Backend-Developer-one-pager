import type { NavLink } from "@/types";

export const OWNER = {
  name: "Omer Zilbershtein",
  role: "Backend Developer Student",
  email: "omerzilber1403@gmail.com",
  phone: "+972-54-6970612",
  github: "https://github.com/omerzilber1403",
  linkedin: "https://www.linkedin.com/in/omer-zilbershtein",
  cvPdf: "/cv/Omer_Zilbershtein_CV.pdf",
  targetCompany: "Pixellot",
  targetRole: "Backend Developer Student",
} as const;

export const HERO_TAGLINES = [
  "I build AI pipelines that detect real events.",
  "I ship spatial tracking systems, fast.",
  "I translate research into production code.",
  "I apply an engineering-first research mindset.",
];

export const DATA_PRIVACY_POINTS = [
  "API keys stored in .env files and excluded via .gitignore — never committed to source control",
  "All AI agent testing uses fully synthetic data — no real user PII is ever processed or stored",
  "Security and correctness are not afterthoughts — every component is built with rigorous testing and clear failure boundaries",
];

export const NAV_LINKS: NavLink[] = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#skills" },
  { label: "Pixellot Fit", href: "#security" },
  { label: "Contact", href: "#contact" },
];
