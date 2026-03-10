import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omer-zilbershtein.vercel.app"),
  title: "Omer Zilbershtein — Backend Developer Student | Pixellot",
  description:
    "BGU CS student & IDF Navy backend developer applying for the Backend Developer Student role at Pixellot. FastAPI, Python, Node.js, ML integration into production services.",
  keywords: [
    "backend developer", "FastAPI", "Python", "Node.js", "NestJS",
    "Pixellot", "sports backend", "real-time systems", "Omer Zilbershtein",
    "ML integration", "microservices", "REST API", "production backend",
  ],
  authors: [{ name: "Omer Zilbershtein" }],
  openGraph: {
    title: "Omer Zilbershtein — Backend Developer Student | Pixellot",
    description: "IDF Navy backend veteran → sports production systems. FastAPI, STOMP real-time architecture, LangGraph ML integration, C# production backend.",
    url: "https://omer-zilbershtein.vercel.app",
    siteName: "Omer Zilbershtein Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Omer Zilbershtein — Backend Developer Student Portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omer Zilbershtein — Backend Developer Student | Pixellot",
    description: "Backend developer applying to Pixellot. FastAPI + ML integration, real-time pub/sub, IDF production systems.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} antialiased bg-bg text-text-primary overflow-x-hidden`}
      >
        {/* Fixed background orb layer — enables glassmorphism across all sections */}
        <div className="orb-field" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </div>
        {children}
      </body>
    </html>
  );
}
