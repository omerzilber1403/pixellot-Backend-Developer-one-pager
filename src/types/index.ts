export interface Project {
  id: string;
  title: string;
  tagline: string;
  metricBefore: string;
  metricAfter: string;
  metricLabel: string;
  description: string;
  fpAlignment: string;
  stack: string[];
  links: {
    github: string;
    demo?: string;
  };
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  icon: "Code" | "Shield" | "GraduationCap";
  accentColor: string;
  metric: string;
  highlights: string[];
  stack: string[];
}

export interface EducationExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  icon: "GraduationCap";
  accentColor: string;
  metric?: string;
  highlights: string[];
  certifications?: string[];
  description?: string;
  specialization?: string;
  topics?: string[];
}

export type ExperienceEntry = WorkExperience | EducationExperience;

