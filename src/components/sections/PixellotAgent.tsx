"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
} from "react";
import {
  Bot,
  Send,
  WifiOff,
  Wifi,
  Zap,
  ChevronDown,
} from "lucide-react";

// ── Config ────────────────────────────────────────────────────────────────────

const API_URL =
  process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:8000";

const HEALTH_TIMEOUT_MS = 4_000;
const TYPING_DELAY_MS = 900;
const MOCK_TYPING_DELAY_MS = 800;

// ── Types ─────────────────────────────────────────────────────────────────────

type AgentMode = "checking" | "online" | "offline";

interface ChatMessage {
  id: number;
  role: "user" | "bot" | "system";
  content: string;
  isHandoff?: boolean;
}

// ── Hebrew detection ──────────────────────────────────────────────────────────

const HEBREW_RE = /[\u0590-\u05FF\uFB1D-\uFB4F]/;
const isHebrew = (text: string) => HEBREW_RE.test(text);

// ── Mock response bank (offline mode) ────────────────────────────────────────

const MOCK_BANK: { keywords: string[]; response: string }[] = [
  {
    keywords: ["hello", "hi", "hey", "what is pixellot", "who are you", "shalom", "שלום", "מה זה"],
    response:
      "Hey! I'm the **Pixellot AI Assistant**. Pixellot is the world's leading AI-automated sports video production platform — used by **38,480+ venues** across **80+ countries**.\n\nWe help sports organizations film, stream, analyze, and monetize games with zero production staff required. Whether you're a high school, a professional league, or a national federation — there's a Pixellot solution built for you.\n\nWhat would you like to know?",
  },
  {
    keywords: ["air nxt", "air", "portable", "lightweight", "tripod"],
    response:
      "**Pixellot Air NXT** is our flagship portable AI camera — weighing under **2kg** with a **6-hour battery**, it's perfect for clubs, coaches, and academies.\n\nKey features:\n- Real-time AI game tracking — no operator needed\n- Full tactical panoramic view from the halfway line\n- Post-game footage instantly available in the cloud for tagging and analysis\n- In-app player analytics, heatmaps, and shot charts\n- Supports **Soccer, Basketball, Hockey, Baseball, Rugby,** and more\n\nUsed by **10,000+ clubs** globally. Setup takes minutes — mount on a tripod and walk away.",
  },
  {
    keywords: ["pixellot show", " show ", "fixed", "indoor", "ceiling", "rail"],
    response:
      "**Pixellot Show** is our set-and-forget fixed camera system for permanent venues.\n\nKey features:\n- Unmanned, fully automated sports tracking — zero operators\n- Works indoors and outdoors with auto light adjustment\n- 3G/4G supported — minimum 2 MB/s upload for live streaming\n- Automatic highlights and condensed game summaries\n- Embedded sponsorship graphics and ad overlays\n- One installation covers **multiple sports** across an entire season\n\nOver **30,000 Show systems** are deployed globally. Ideal for schools, clubs, and federations that want automated production without any daily overhead.",
  },
  {
    keywords: ["prime", "broadcast", "professional", "50fps", "60fps", "la liga", "serie a", "bundesliga"],
    response:
      "**Pixellot Prime** is our broadcast-grade system for professional and semi-professional clubs.\n\n- **Full HD at 50/60 FPS** — same output quality as traditional outside broadcast trucks\n- Supports both **manual and automatic** production modes\n- Multi-angle coverage with a single operator instead of a full outside broadcast crew\n- Used by clubs across **La Liga, Serie A, Bundesliga,** and Mexican professional leagues\n- Designed with direct input from **FC Barcelona** coaches and analysts\n\nPrime is for organizations where broadcast standards are non-negotiable.",
  },
  {
    keywords: ["doubleplay", "double play", "baseball", "softball", "batter", "pitcher"],
    response:
      "**Pixellot DoublePlay** is the world's first automated multi-camera solution built specifically for baseball.\n\n- AI automatically cuts between **batter and pitcher perspectives** simultaneously\n- Weatherproof and battery-operated — works at outdoor fields without stable power\n- Custom-built **4K dual-camera system**\n- No video operator needed at any point\n\nUsed by **MLB Draft League, Appalachian League, San Diego League,** and California All Star Village. Perfect for high school baseball programs and collegiate leagues that want broadcast-style coverage on a limited budget.",
  },
  {
    keywords: ["ott", "streaming platform", "white-label", "white label", "monetize", "channel", "subscription"],
    response:
      "**Pixellot OTT** is a complete white-label streaming platform — leagues and federations can launch their own branded channel in **under 48 hours**.\n\nFeatures:\n- Live streaming with clip and highlight tools\n- **8 built-in monetization models**: subscriptions, advertising, sponsorships, content syndication, live data/betting, coaching analytics, and e-commerce\n- Federation and league hierarchy support\n- Integrated player and team analytics\n- VAST ad support (preroll, midroll, banners, watermarks)\n\nCase study: **SuperSport Schools** achieved +200,000 unique subscribers and 3M+ views using Pixellot OTT.",
  },
  {
    keywords: ["highlight", "clip", "reel", "social media", "tiktok", "shorts", "reels", "automatic"],
    response:
      "**Pixellot Automatic Highlights** delivers AI-curated clips with zero manual editing.\n\n- Full game highlights available within **4 hours post-match**\n- Real-time short clips posted to social **during** the game — not just after\n- Automatic **vertical/portrait formats** (9:16) for TikTok, Reels, and YouTube Shorts\n- Customizable branded templates\n- Direct integration with **X (Twitter), Instagram, YouTube,** and media publisher APIs\n\nYour social team doesn't need to be at the game — the AI handles everything.",
  },
  {
    keywords: ["analytics", "vidswap", "advantage", "tactical", "heatmap", "coaching"],
    response:
      "**Pixellot Analytics (Advantage/VidSwap)** is the coaching and performance analysis platform.\n\n- Automatic **tagging and coding** of game events\n- Player and team heatmaps, shot charts, and pass maps\n- Clip library with filtering and sharing tools\n- Compatible with Pixellot Air NXT, Show, and Prime\n- Used by professional clubs, national federations, and college programs\n\nCoaches can access footage and analytics within minutes of the final whistle.",
  },
  {
    keywords: ["ai", "artificial intelligence", "algorithm", "tracking", "how does it work", "technology"],
    response:
      "Pixellot's **AI engine** does the job of an entire camera crew:\n\n- **Sport-specific algorithms** calibrated per discipline (soccer AI ≠ basketball AI)\n- **Patented pan-tilt-zoom engine** — replicates a professional camera operator in real time\n- **Ball and player auto-tracking** across the full field\n- **AI Director mode** — decides what to film, when to cut, and how to frame\n- Automatic light recognition and dynamic exposure adjustment\n- Highlight detection based on game events (goals, dunks, touchdowns)\n\nAll of this happens **on-device or in the cloud** — no crew, no latency, no manual work.",
  },
  {
    keywords: ["how many sports", "which sports", "what sports", "sport types", "soccer", "football", "basketball"],
    response:
      "Pixellot supports **19 sport types**, including:\n\n**Soccer / Football** • **Basketball** • Ice Hockey • Field Hockey • **Baseball** • Softball • American Football • Rugby • Lacrosse • Volleyball • Handball • Futsal • Netball • Beach Volleyball • Roller Hockey • Tennis • Wrestling • and more.\n\nEach sport has a dedicated AI model trained for that discipline's specific camera angles, speed, and ball behavior. Air NXT, Show, and Prime all support the full sport library.",
  },
  {
    keywords: ["high school", "school", "prep", "varsity", "student"],
    response:
      "Pixellot is one of the most widely adopted solutions for **high school sports** globally.\n\n- **Air NXT** is the go-to portable camera — no full-time tech staff needed\n- **Show** provides set-and-forget coverage for school gyms and fields\n- **DoublePlay** is purpose-built for high school baseball programs\n- Integrates with **NFHS Network** and **SportsEngine** — two of the largest high school sports platforms in the US\n- Multiple monetization options help schools generate revenue from their content\n\nPixellot covers everything from the Friday night varsity game to daily training sessions.",
  },
  {
    keywords: ["college", "university", "ncaa", "collegiate"],
    response:
      "For **college and university** sports, Pixellot offers end-to-end production without the overhead of a full broadcast crew.\n\n- **Show** and **Prime** fit permanent arena and stadium installations\n- **Air NXT** covers practice fields and secondary venues\n- OTT platform enables schools to launch their own branded streaming channel\n- Analytics/VidSwap integration for coaching staff and performance teams\n- Partners include **America East Conference** and multiple NCAA programs\n\nCollegiates get broadcast-quality output at a fraction of traditional media costs.",
  },
  {
    keywords: ["install", "setup", "installation", "set up", "how long", "mounting"],
    response:
      "Installation timelines depend on the product:\n\n- **Air NXT (portable):** Set up in minutes — mount on a tripod at the halfway line, calibrate once (~15–20 min on first use), and you're live\n- **Show (fixed):** Permanent ceiling or rail mount at midfield/midcourt elevation; the computer tower can be up to 100m away from the camera head\n- **Prime:** Professional installation recommended; fixed permanent mount\n- **DoublePlay:** Portable and battery-operated — deployable at venues without stable power or internet\n\nPixellot has local installation partners in 80+ countries. For enterprise deployments, a Pixellot team guides the full onboarding process.",
  },
  {
    keywords: ["demo", "trial", "get started", "see it in action", "book", "request"],
    response:
      "Absolutely! The best way to see Pixellot in action is to request a **live demo** directly with the team.\n\n- **Website:** pixellot.tv/contact\n- **Email:** sales@pixellot.tv\n\nYou can also explore product pages and customer case studies at **pixellot.tv** before the call. The sales team will match you with the right product (Air NXT, Show, Prime, OTT, etc.) based on your sport, venue, and goals.\n\nWould you like to know more about any specific product before reaching out?",
  },
  {
    keywords: ["price", "cost", "pricing", "how much", "מחיר", "עלות", "כמה עולה"],
    response:
      "Pixellot's pricing is customized based on your sport, venue type, number of cameras, and whether you need hardware, software, streaming, or the full analytics stack.\n\nFor an accurate quote tailored to your organization, I'd recommend contacting the sales team directly:\n- **Email:** sales@pixellot.tv\n- **Website:** pixellot.tv/contact\n\nThey'll put together a proposal that makes sense for your specific use case.",
  },
  {
    keywords: ["מה המוצרים", "אילו מוצרים", "ספר לי על", "תספר לי", "מה אתה יודע"],
    response:
      "שלום! אני עוזר ה-AI של Pixellot. הנה סקירה קצרה של המוצרים שלנו:\n\n- **Air NXT** — מצלמה ניידת ב-AI לקבוצות, אקדמיות ומאמנים. פחות מ-2 ק\"ג, 6 שעות סוללה\n- **Show** — מצלמה קבועה אוטומטית לאולמות ומגרשים. אפס צלמים נדרשים\n- **Prime** — איכות שידור מקצועית ב-50/60 FPS לליגות פרו\n- **DoublePlay** — פתרון בייסבול אוטומטי ייחודי עם שתי זוויות מצלמה\n- **OTT** — פלטפורמת סטרימינג white-label לליגות (מוכנה תוך 48 שעות)\n- **Highlights אוטומטיים** — קליפים ל-TikTok, Reels ו-YouTube ללא עריכה\n\nעל מה תרצה לשמוע יותר?",
  },
  {
    keywords: ["partner", "integration", "third party", "stats perform", "sportradar", "aws"],
    response:
      "Pixellot has a deep ecosystem of technology and distribution partners:\n\n**Tech partners:** AWS, Stats Perform, Sportradar, Genius Sports, SportsEngine, GameChanger, Sports Recruits, PlayOn\n\n**Broadcast/media:** IMG, Grupo Globo, Red Bull Media, FloSports, SuperSport, Dyn Media, NFHS Network, Levira, NEP\n\n**Clubs and federations:** UEFA, FIBA, MLB, KFA, Argentinian FA, Portuguese FA, Football Association of Ireland, FC Basel, Real Betis, Southampton FC, Maccabi Tel Aviv, and 50+ more\n\nPixellot integrates via RTMP, RTSP, SDI, NDI, API, and SDK — compatible with virtually any broadcast or analytics workflow.",
  },
];

function mockReply(message: string): string {
  const q = message.toLowerCase();
  for (const entry of MOCK_BANK) {
    if (entry.keywords.some((kw) => q.includes(kw))) {
      return entry.response;
    }
  }
  return (
    "Great question! I'm Pixellot's AI assistant, running in offline demo mode right now.\n\n" +
    "Pixellot is the world's leading AI-automated sports video platform — used by 38,480+ venues across 80+ countries, covering 19 sport types.\n\n" +
    "Try asking me about **Air NXT**, **Pixellot Show**, **Prime**, **DoublePlay**, **OTT**, **pricing**, or **how the AI works**!"
  );
}

// ── Minimal Markdown renderer ─────────────────────────────────────────────────

function MdLine({ text }: { text: string }) {
  // Render **bold**, then links — nothing else
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function MdContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key} className="mt-1 mb-1 space-y-0.5 pl-4 list-none">
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-1.5 items-start">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#00E676] shrink-0 inline-block" />
            <span>
              <MdLine text={item} />
            </span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, idx) => {
    const stripped = line.replace(/^[-•]\s*/, "");
    if (line.match(/^[-•]\s/)) {
      listItems.push(stripped);
    } else {
      flushList(`list-${idx}`);
      if (line.trim() === "") {
        elements.push(<div key={`br-${idx}`} className="h-1.5" />);
      } else {
        elements.push(
          <p key={`p-${idx}`} className="leading-relaxed">
            <MdLine text={line} />
          </p>
        );
      }
    }
  });
  flushList("list-final");

  return <>{elements}</>;
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#00E676]"
          style={{
            animation: `pxl-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Suggestion chips ──────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  "What is Pixellot Air NXT?",
  "How does the AI work?",
  "Which sports are supported?",
  "Tell me about Pixellot OTT",
  "Show me pricing options",
];

// ── Main component ────────────────────────────────────────────────────────────

interface PixellotAgentProps {
  defaultLang?: "en" | "he";
}

export function PixellotAgent({ defaultLang = "en" }: PixellotAgentProps) {
  const [mode, setMode] = useState<AgentMode>("checking");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [chipsVisible, setChipsVisible] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const msgIdRef = useRef(0);

  const nextId = () => ++msgIdRef.current;

  // ── Health probe ────────────────────────────────────────────────────────────

  const checkHealth = useCallback(async () => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), HEALTH_TIMEOUT_MS);
      const res = await fetch(`${API_URL}/health`, { signal: ctrl.signal });
      clearTimeout(timer);
      setMode(res.ok ? "online" : "offline");
    } catch {
      setMode("offline");
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // ── Welcome message (after mode resolves) ──────────────────────────────────

  useEffect(() => {
    if (mode === "checking") return;
    setMessages([
      {
        id: nextId(),
        role: "bot",
        content:
          mode === "online"
            ? "Hey! I'm the **Pixellot AI Assistant**. Ask me about our cameras, AI technology, supported sports, or how to get started. What would you like to know?"
            : "Hey! I'm the **Pixellot AI Assistant** (running in demo mode). Ask me anything about Pixellot's products, AI, sports coverage, or how to get a demo!",
      },
    ]);
  }, [mode]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!lastMsgRef.current || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const msgTop = lastMsgRef.current.offsetTop;
    container.scrollTo({ top: msgTop - 8, behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // ── Send message ────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      setChipsVisible(false);
      setInput("");
      setIsSending(true);

      const userMsg: ChatMessage = { id: nextId(), role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);

      // Typing indicator
      const typingId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: typingId, role: "bot", content: "__typing__" },
      ]);

      const history = messages
        .filter((m) => m.role !== "system" && m.content !== "__typing__")
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

      if (mode === "offline" || mode === "checking") {
        await new Promise((r) => setTimeout(r, MOCK_TYPING_DELAY_MS));
        const reply = mockReply(trimmed);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === typingId ? { ...m, content: reply } : m
          )
        );
        setIsSending(false);
        return;
      }

      // Online mode
      try {
        const res = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            session_id: sessionId,
            history,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setMessages((prev) =>
          prev.map((m) =>
            m.id === typingId
              ? { ...m, content: data.response, isHandoff: data.should_handoff }
              : m
          )
        );
      } catch {
        // Backend dropped mid-session — gracefully fall back to mock
        setMode("offline");
        await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));
        const reply = mockReply(trimmed);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === typingId ? { ...m, content: reply } : m
          )
        );
      } finally {
        setIsSending(false);
      }
    },
    [isSending, messages, mode, sessionId]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const rtl = messages.some(
    (m) => m.role === "user" && isHebrew(m.content)
  );

  return (
    <>
      {/* Bounce keyframes */}
      <style>{`
        @keyframes pxl-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes pxl-pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,230,118,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(0,230,118,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,230,118,0); }
        }
      `}</style>

      <div className="w-full max-w-2xl mx-auto px-4">

        {/* ── Chat window ─────────────────────────────────────────────────── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10,15,26,0.85)",
            border: "1px solid rgba(0,230,118,0.18)",
            boxShadow:
              "0 0 0 1px rgba(0,230,118,0.06), 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
          }}
          dir={rtl ? "rtl" : "ltr"}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: "rgba(0,230,118,0.1)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(0,230,118,0.12)",
                  animation:
                    mode === "online"
                      ? "pxl-pulse-ring 2.5s cubic-bezier(0.455,0.03,0.515,0.955) infinite"
                      : undefined,
                }}
              >
                <Bot size={14} className="text-[#00E676]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-none">
                  Pixellot AI
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                  Sports Technology Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {mode === "checking" && (
                <span className="text-[10px] text-slate-500">Connecting…</span>
              )}
              {mode === "online" && (
                <>
                  <Wifi size={11} className="text-[#00E676]" />
                  <span className="text-[10px] text-[#00E676] font-medium">Live</span>
                </>
              )}
              {mode === "offline" && (
                <>
                  <WifiOff size={11} className="text-amber-400" />
                  <span className="text-[10px] text-amber-400 font-medium">Demo mode</span>
                </>
              )}
              <div
                className={`w-1.5 h-1.5 rounded-full ml-0.5 ${
                  mode === "online"
                    ? "bg-[#00E676]"
                    : mode === "offline"
                    ? "bg-amber-400"
                    : "bg-slate-600"
                }`}
              />
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-y-auto px-4 py-4 space-y-3"
            style={{ height: "520px" }}
          >
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              if (msg.role === "system") {
                return (
                  <div key={msg.id} ref={isLast ? lastMsgRef : undefined} className="text-center">
                    <span className="text-[10px] text-slate-600 bg-slate-800/50 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              const isUser = msg.role === "user";
              const isTyping = msg.content === "__typing__";

              return (
                <div
                  key={msg.id}
                  ref={isLast ? lastMsgRef : undefined}
                  className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                      style={{ background: "rgba(0,230,118,0.12)" }}
                    >
                      <Bot size={11} className="text-[#00E676]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] text-sm rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? "rounded-br-sm text-white"
                        : "rounded-bl-sm text-slate-200"
                    }`}
                    style={
                      isUser
                        ? {
                            background: "rgba(0,230,118,0.18)",
                            border: "1px solid rgba(0,230,118,0.25)",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }
                    }
                  >
                    {isTyping ? (
                      <TypingDots />
                    ) : isUser ? (
                      <p className="leading-relaxed">{msg.content}</p>
                    ) : (
                      <MdContent content={msg.content} />
                    )}

                    {msg.isHandoff && (
                      <div
                        className="mt-2 pt-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#00E676]"
                        style={{ borderTop: "1px solid rgba(0,230,118,0.15)" }}
                      >
                        <Zap size={9} />
                        Routed to Sales Team
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              className="absolute right-4 bottom-20 w-7 h-7 rounded-full flex items-center justify-center text-[#00E676] transition-opacity hover:opacity-80"
              style={{
                background: "rgba(0,230,118,0.12)",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
            >
              <ChevronDown size={14} />
            </button>
          )}

          {/* Suggestion chips */}
          {chipsVisible && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="text-[11px] px-2.5 py-1 rounded-full text-slate-300 transition-colors hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div
            className="px-4 py-3 flex items-end gap-2.5"
            style={{ borderTop: "1px solid rgba(0,230,118,0.1)" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about cameras, AI, sports, pricing…"
              rows={1}
              disabled={isSending}
              className="flex-1 resize-none text-sm text-white placeholder-slate-600 bg-transparent outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: "96px", overflowY: "auto" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isSending}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{ background: "#00E676" }}
            >
              <Send size={13} className="text-black" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Offline notice */}
        {mode === "offline" && (
          <p className="mt-2 text-center text-[11px] text-amber-500/70">
            Running in demo mode — responses are pre-loaded. Start the FastAPI backend for live AI.
          </p>
        )}
      </div>
    </>
  );
}
