import type { WorkExperience, EducationExperience } from "@/types";

export const CV: {
  personal: {
    name: string; email: string; phone: string;
    linkedin: string; github: string; cvPdf: string;
  };
  profile: string;
  experience: (WorkExperience | EducationExperience)[];
} = {
  personal: {
    name: "Omer Zilbershtein",
    email: "omerzilber1403@gmail.com",
    phone: "+972-54-6970612",
    linkedin: "https://www.linkedin.com/in/omer-zilbershtein",
    github: "https://github.com/omerzilber1403",
    cvPdf: "/cv/Omer_Zilbershtein_CV.pdf",
  },
  profile:
    "Software Developer with IDF programmer experience, web development, applied AI, and real-time simulation. Full-stack developer building GenAI agents and simulators deployed in Navy training. Python + React specialist. BGU CS student, 4th semester.",
  experience: [
    {
      id: "freelance",
      role: "Freelance Web & AI Developer",
      organization: "Independent",
      period: "2023 – Present",
      icon: "Code" as const,
      accentColor: "#6366f1",
      metric: "3 production systems shipped",
      highlights: [
        "Production web systems: React, Node.js, WordPress",
        "GenAI sales assistant built on LangGraph multi-agent framework",
        "LLM API integration with React monitoring dashboard",
      ],
      stack: ["React", "Node.js", "LangGraph", "OpenAI API", "FastAPI", "WordPress"],
    } satisfies WorkExperience,
    {
      id: "idf",
      role: "Software Developer",
      organization: "Israeli Navy, IDF",
      period: "2020 – 2023",
      icon: "Shield" as const,
      accentColor: "#22d3ee",
      metric: "₪500,000/yr saved",
      highlights: [
        "Unity3D / C# simulators for naval cadet training — hundreds of cadets per year",
        "Scenario-based simulation + automated scoring engines",
        "Replaced external vendor — formal military recognition received",
      ],
      stack: ["Unity3D", "C#", "Python", "Simulation Engineering"],
    } satisfies WorkExperience,
    {
      id: "bgu",
      role: "B.Sc. Computer Science",
      organization: "Ben-Gurion University of the Negev",
      period: "2024 – 2027",
      icon: "GraduationCap" as const,
      accentColor: "#a78bfa",
      metric: "Data Science Specialization",
      highlights: [
        "Currently a CS student at Ben-Gurion University (4th semester), specializing in Data Science.",
        "Data Structures: 98 | Introduction to CS: 92",
        "Systems Programming (SPL): 87 | Probability: 93",
      ],
      specialization: "Data Science",
      topics: ["Multi-Threading Design", "Reactor Pattern", "Network Architecture", "SQL", "C++", "Java"],
    } satisfies EducationExperience,
  ],
};

export type { WorkExperience, EducationExperience };
