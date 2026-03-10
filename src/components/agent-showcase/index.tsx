"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL =
  process.env.NEXT_PUBLIC_SALES_BOT_API || "http://localhost:8080";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId = "multicompany" | "routing" | "handoff" | "learning" | "forcepoint";

interface ChatMessage {
  id: number;
  role: "user" | "bot" | "system";
  content: string;
  executionPath?: string[];
  handoff?: boolean;
  isError?: boolean;
}

interface DemoCompanyMeta {
  domain: string;
  label: string;
  type: "B2C" | "B2B";
  id?: number;
}

interface StorySectionData {
  stepId: StepId;
  badge: string;
  headline: string;
  body: React.ReactNode;
  btnLabel: string;
  demoMessage: string;
  targetDomain?: string;
  btnLabel2?: string;
  demoMessage2?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_COMPANIES: DemoCompanyMeta[] = [
  { domain: "geula-surf.co.il", label: "מועדון גלישה אלמוג", type: "B2C" },
  { domain: "scaleit.co.il", label: "SCALE IT", type: "B2B" },
  { domain: "forcepoint.com", label: "Forcepoint", type: "B2B" },
];

// ─── Story Sections ───────────────────────────────────────────────────────────

function makeSections(isHe: boolean): StorySectionData[] {
  return [
    {
      stepId: "multicompany",
      badge: isHe ? "01 / ארכיטקטורה" : "01 / Architecture",
      headline: isHe ? "מנוע אחד, סביבות מרובות" : "One Engine, Infinite Environments",
      demoMessage: "ספר לי על השירותים שלך",
      targetDomain: "geula-surf.co.il",
      btnLabel: isHe ? "שאל על המוצרים ←" : "Ask About Products →",
      body: isHe ? (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>Company-as-Config:</strong>{" "}
            הזהות של כל חברה — קטלוג מוצרים, כאבי לקוח, Tone of Voice,
            הגדרת ICP וחוקי Handoff — נשמרת תחת שורת DB אחת כעמודות JSON.
            אין צורך לשנות שורת קוד אחת כדי להוסיף חברה חדשה.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              גרף Stateless, מסד נתונים Stateful:
            </strong>{" "}
            המופע (Instance) של LangGraph נוצר באופן דינמי בכל בקשה על בסיס
            נתוני ה-DB של החברה. הגרף לא שומר State בין סשנים, מה שמבטיח
            בידוד נתונים מוחלט.
          </p>
        </div>
      ) : (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>Company-as-Config:</strong>{" "}
            Every company&apos;s identity — products with prices, pain points,
            brand voice, ICP definition, handoff rules, and custom fields —
            lives in a single <code>Company</code> DB row as JSON columns. No
            code changes are needed to onboard a new company.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              Stateless Graph, Stateful DB:
            </strong>{" "}
            The LangGraph instance is generated dynamically per request using
            the company&apos;s DB config. The graph holds zero state between
            sessions, ensuring total data isolation and zero cross-contamination.
          </p>
        </div>
      ),
    },
    {
      stepId: "routing",
      badge: isHe ? "02 / ניתוב בגרף (Graph Routing)" : "02 / Graph Routing",
      headline: isHe ? "מסלולי B2B ו-B2C חכמים" : "Smart B2B & B2C Pathways",
      demoMessage: "מה העסק שלכם עושה?",
      targetDomain: "scaleit.co.il",
      btnLabel: isHe ? "החלפה למצב B2B ←" : "Switch to B2B →",
      body: isHe ? (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>First-Class Routing Node:</strong>{" "}
            לאחר בניית קונטקסט הלקוח, הגרף קורא את{" "}
            <code>company_data[&quot;business_type&quot;]</code> ומנתב לסוכן
            B2C או B2B. אלו לא תנאי If-Else בתוך צומת אחד — מדובר בשני
            צמתים נפרדים לחלוטין עם פרומפטים שונים.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>עולמות שונים, אותו API:</strong>{" "}
            משתמשי B2C מקבלים פרומפט חם וזורם (רמת גלישה, גודל קבוצה).
            משתמשי B2B מקבלים פרומפט ייעוצי ומקצועי (גודל חברה, CRM נוכחי,
            מקבל החלטות). לחצו כדי להחליף ל-SCALE IT ולראות את ההבדל.
          </p>
        </div>
      ) : (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              First-Class Routing Node:
            </strong>{" "}
            After building customer context, the graph evaluates{" "}
            <code>company_data[&quot;business_type&quot;]</code> and routes to
            either a B2C or B2B agent. These aren&apos;t conditional flags
            inside one node — they are two distinct graph nodes with separate
            system prompts.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              Different Worlds, Same API:
            </strong>{" "}
            B2C gets a warm, informal prompt (surfing level, group size,
            preferred date). B2B gets a professional consultant prompt (company
            size, current CRM, decision maker, timeline). Click to switch to
            SCALE IT and send the same question.
          </p>
        </div>
      ),
    },
    {
      stepId: "handoff",
      badge: isHe ? "03 / מנגנון העברה לנציג (Handoff Guard)" : "03 / Handoff Guard",
      headline: isHe ? "אסקלציה בשני שלבים" : "Two-Stage Escalation",
      demoMessage: "אני רוצה לדבר עם נציג אנושי",
      btnLabel: isHe ? "הפעלת מנגנון Handoff ←" : "Trigger Handoff →",
      body: isHe ? (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              שלב 1 — סינון מילות מפתח (Zero-Cost):
            </strong>{" "}
            בקשות מפורשות למענה אנושי (מנהל, נציג, תלונה) מפעילות העברה
            מיידית באפס עלות LLM. שאלות מכירה שגרתיות (מחיר, זמינות) מוחרגות
            במפורש כדי למנוע False Positives.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              שלב 2 — סיווג LLM בינארי:
            </strong>{" "}
            הודעות מורכבות יותר מפעילות קריאת LLM נקודתית וקלה (Single-shot)
            המכריעה ב-כן/לא האם נדרשת התערבות אנושית. שדה ה-
            <code>execution_path</code> בתגובה מראה בדיוק איזה שלב הופעל.
            שלחו הודעת דמו כדי לראות את שני השלבים בפעולה.
          </p>
        </div>
      ) : (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              Stage 1 — Zero-Cost Blocklist:
            </strong>{" "}
            Explicit requests for human help (&ldquo;manager&rdquo;,
            &ldquo;representative&rdquo;, &ldquo;complain&rdquo;) trigger an
            instant handoff, bypassing the LLM entirely. Standard sales
            questions (price, availability) are explicitly excluded to prevent
            false positives.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              Stage 2 — Binary LLM Classification:
            </strong>{" "}
            Ambiguous messages trigger a lightweight, single-shot LLM prompt
            asking Yes/No if human intervention is needed. The{" "}
            <code>execution_path</code> in each response shows exactly which
            stage fired. Send the demo message to see both stages in action.
          </p>
        </div>
      ),
    },
    {
      stepId: "learning",
      badge: isHe ? "04 / לולאת למידה" : "04 / Learning Loop",
      headline: isHe
        ? "הנדסת פרומפטים מבוססת-פידבק"
        : "Feedback-Driven Prompt Engineering",
      demoMessage: isHe ? "מה התמחור שלכם?" : "What are your pricing plans?",
      btnLabel: isHe ? "שאל שאלת תמחור ←" : "Ask a Pricing Question →",
      body: isHe ? (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>מפידבק לשינוי הפרומפט:</strong>{" "}
            משתמשים מדרגים את התשובות ב-1 עד 5 כוכבים. לפני הבקשה הבאה,
            המערכת מזהה נושאים חלשים (תמחור, טון) ומוסיפה אוטומטית הוראות
            דריסה (Overrides) מותאמות אישית בתחתית ה-System Prompt.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>ללא צורך באימון מחדש:</strong>{" "}
            דפוסים שליליים מצטברים ומשנים אוטומטית את התנהגות הבוט עבור אותה
            חברה — אך ורק באמצעות Prompt Engineering. היסטוריית השיחה מספקת
            ל-LLM קונטקסט מלא בכל פנייה.
          </p>
        </div>
      ) : (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>
              Feedback to Prompt Mutation:
            </strong>{" "}
            After each bot reply, users rate 1–5 stars. Before the next
            request, the system categorizes low-rated topics (pricing, tone,
            handoff) and dynamically appends tailored override instructions to
            the bottom of the system prompt.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>No Retraining Required:</strong>{" "}
            Negative patterns accumulate and instantly change the bot&apos;s
            behavior for that company — purely through prompt engineering. The
            full conversation history gives the LLM complete prior context on
            every turn.
          </p>
        </div>
      ),
    },
    {
      stepId: "forcepoint",
      badge: isHe ? "✦ לייב (Live): דמו Forcepoint" : "✦ Live: Forcepoint",
      headline: isHe ? "החברה שלכם. שורת DB אחת." : "Your Company. One DB Row.",
      demoMessage: isHe
        ? "הצוות שלנו מוצף בהתראות שגויות מכלי ה-DLP הנוכחי שלנו ואנחנו בוחנים חלופות — מה מייחד את Forcepoint?"
        : "Our security team is overwhelmed by DLP false positives from our current tool and we're evaluating alternatives — what makes Forcepoint different?",
      targetDomain: "forcepoint.com",
      btnLabel: isHe ? "דבר עם הבוט בעברית ←" : "Talk to the Forcepoint Bot →",
      btnLabel2: isHe
        ? undefined
        : "דבר עם הבוט בעברית →",
      demoMessage2: isHe
        ? undefined
        : "הצוות שלנו מוצף בהתראות שגויות מכלי ה-DLP הנוכחי שלנו ואנחנו בוחנים חלופות — מה מייחד את Forcepoint?",
      body: isHe ? (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>הנתונים כבר בפנים.</strong>{" "}
            קווי המוצרים של Forcepoint, ה-ICP והמיצוב התחרותי (מול Netskope,
            Zscaler, Purview, Symantec) נשאבו באמצעות{" "}
            <strong style={{ color: "#4cc7b8" }}>Antigravity</strong> והוזנו
            כמרחב עבודה עצמאי. זהו אותו תהליך אוטומטי (Zero-code) שעוברת
            כל חברה.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>נסו את זה עכשיו.</strong>{" "}
            שאלו על False Positives ב-DLP, סיכוני GenAI, תאימות ל-FedRAMP,
            או איך Forcepoint עומדת מול Netskope. לחצו על הכפתור כדי להתחיל
            שיחה מול הבוט.
          </p>
        </div>
      ) : (
        <div className="bot-body">
          <p>
            <strong style={{ color: "#cbd5e1" }}>Data Already Seeded.</strong>{" "}
            Forcepoint&apos;s product lines, ICP definition, objection playbook,
            and competitive positioning (Netskope, Zscaler, Purview, Symantec)
            were scraped from <code>forcepoint.com</code> via{" "}
            <strong style={{ color: "#4cc7b8" }}>Antigravity</strong> and
            loaded as a single DB workspace. This is the exact zero-code
            pipeline every new client goes through.
          </p>
          <p>
            <strong style={{ color: "#cbd5e1" }}>Test It Now.</strong>{" "}
            Ask about DLP false positives, GenAI data risks, FedRAMP
            compliance, or how Forcepoint stacks up against Netskope. Hit the
            button to start chatting with the configured Forcepoint bot.
          </p>
        </div>
      ),
    },
  ];
}

// ─── Scoped CSS ───────────────────────────────────────────────────────────────

const SCOPED_CSS = `
/* ── Layout ─────────────────────────────────────────────────── */
.bot-root  { font-family: system-ui, sans-serif; color: #e2e8f0; position: relative; overflow: visible; }
.bot-inner { max-width: 72rem; margin: 0 auto; padding: 5rem 1.5rem 6rem; position: relative; }

/* ── Header ─────────────────────────────────────────────────── */
.bot-header      { text-align: center; margin-bottom: 3.5rem; }
.bot-header-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border-radius: 9999px; border: 1px solid rgba(76,199,184,0.28);
  background: rgba(76,199,184,0.12); color: #4cc7b8;
  font-size: 0.72rem; font-family: monospace; font-weight: 600;
  padding: 0.3rem 0.9rem; margin-bottom: 1.2rem;
}
.bot-header-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #4cc7b8;
  animation: bot-pulse 2.4s ease-in-out infinite;
}
.bot-title     { font-size: clamp(1.75rem, 3.5vw, 2.5rem); font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
.bot-title-em  { color: #4cc7b8; }
.bot-subtitle  { font-size: 0.9rem; color: #94a3b8; max-width: 38rem; margin: 0 auto; line-height: 1.7; }
@keyframes bot-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

/* ── Mobile tabs ─────────────────────────────────────────────── */
.bot-tabs {
  display: grid; grid-template-columns: 1fr 1fr;
  border-radius: 0.75rem; overflow: hidden;
  border: 1px solid rgba(76,199,184,0.25); margin-bottom: 1.5rem;
}
.bot-tab           { padding: 0.625rem; font-family: monospace; font-size: 0.8rem; border: none; cursor: pointer; }
.bot-tab--active   { background: #4cc7b8; color: #063b58; font-weight: 700; }
.bot-tab--inactive { background: rgba(6,59,88,0.6); color: #94a3b8; }

/* ── Split pane ──────────────────────────────────────────────── */
.bot-split     { display: flex; gap: 2rem; align-items: flex-start; }
.bot-story     { flex: 0 0 48%; display: flex; flex-direction: column; gap: 1.75rem; }
.bot-demo-pane {
  flex: 1; position: sticky; top: 4.5rem;
  height: calc(100vh - 6rem);
  display: flex; flex-direction: column;
  border-radius: 1rem; overflow: hidden;
  border: 1px solid rgba(76,199,184,0.25);
  background: rgba(6,59,88,0.35);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
}

/* ── Story cards ─────────────────────────────────────────────── */
.bot-section {
  border-radius: 1rem; padding: 1.4rem 1.5rem;
  border: 1px solid rgba(76,199,184,0.10);
  background: rgba(6,59,88,0.25);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}
.bot-section--active {
  border-left: 3px solid #4cc7b8;
  border-color: rgba(76,199,184,0.38);
  background: rgba(6,59,88,0.40);
  box-shadow: 0 0 24px rgba(76,199,184,0.08), inset 0 0 18px rgba(251,146,60,0.03);
}
[dir="rtl"] .bot-section--active {
  border-left: unset;
  border-right: 3px solid #4cc7b8;
}
.bot-step-badge {
  display: inline-block; font-size: 0.63rem; font-family: monospace; font-weight: 700;
  padding: 0.18rem 0.55rem; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.04em;
  background: rgba(251,146,60,0.15); color: #fb923c; border: 1px solid rgba(251,146,60,0.28);
  margin-bottom: 0.75rem;
}
.bot-headline { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
.bot-body     { font-size: 0.84rem; color: #94a3b8; line-height: 1.8; display: flex; flex-direction: column; gap: 0.6rem; }
.bot-body p   { margin: 0; }
.bot-body code {
  font-family: ui-monospace, monospace; font-size: 0.78rem;
  padding: 0.1rem 0.35rem; border-radius: 4px;
  background: rgba(76,199,184,0.10); color: #4cc7b8;
}

/* ── Trigger button ──────────────────────────────────────────── */
.bot-trigger-btn {
  margin-top: 1rem; padding: 0.48rem 1.1rem; border-radius: 9999px;
  border: 1px solid #4cc7b8; background: transparent; color: #4cc7b8;
  font-size: 0.78rem; font-family: monospace; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
}
.bot-trigger-btn:hover:not(:disabled)  { background: #4cc7b8; color: #063b58; box-shadow: 0 4px 16px rgba(76,199,184,0.35); transform: translateY(-1px); }
.bot-trigger-btn:disabled              { opacity: 0.45; cursor: not-allowed; }
.bot-trigger-btn--active               { background: rgba(76,199,184,0.15); box-shadow: 0 0 0 1px #4cc7b8 inset; }

/* ── Chat panel header ───────────────────────────────────────── */
.bot-demo-header {
  flex: none; padding: 0.75rem 1rem;
  background: rgba(6,59,88,0.85);
  border-bottom: 1px solid rgba(76,199,184,0.15);
}
.bot-demo-header-row   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
.bot-demo-title        { font-size: 0.72rem; font-family: monospace; font-weight: 700; color: #4cc7b8; text-transform: uppercase; letter-spacing: 0.06em; }
.bot-status-row        { display: flex; align-items: center; gap: 0.4rem; font-size: 0.65rem; color: #475569; font-family: monospace; }
.bot-status-dot        { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.bot-company-tabs      { display: flex; gap: 0.45rem; flex-wrap: wrap; }
.bot-company-pill {
  border-radius: 9999px; border: 1px solid rgba(76,199,184,0.28);
  background: transparent; color: #94a3b8;
  font-size: 0.68rem; font-family: monospace; font-weight: 600;
  padding: 0.22rem 0.7rem; cursor: pointer; transition: all 0.2s ease;
}
.bot-company-pill:hover:not(.bot-company-pill--active) { border-color: #4cc7b8; color: #4cc7b8; }
.bot-company-pill--active { background: rgba(76,199,184,0.18); color: #4cc7b8; border-color: #4cc7b8; }
.bot-type-badge { font-size: 0.56rem; font-weight: 700; padding: 0.1rem 0.35rem; border-radius: 3px; margin-left: 0.3rem; }
.bot-type-b2c   { background: rgba(16,185,129,0.15); color: #34d399; }
.bot-type-b2b   { background: rgba(59,130,246,0.15); color: #60a5fa; }

/* ── Message area ────────────────────────────────────────────── */
.bot-messages {
  flex: 1; overflow-y: auto; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  min-height: 0;
}
.bot-msg           { display: flex; flex-direction: column; max-width: 82%; }
.bot-msg--user     { align-self: flex-end;   align-items: flex-end; }
.bot-msg--bot      { align-self: flex-start; }
.bot-msg--system   { align-self: center; max-width: 100%; }
.bot-bubble        { border-radius: 1rem; padding: 0.6rem 0.9rem; font-size: 0.82rem; line-height: 1.6; word-break: break-word; direction: rtl; text-align: right; }
.bot-bubble--user  { background: #4cc7b8; color: #063b58; border-radius: 1rem 1rem 0.25rem 1rem; font-weight: 500; }
.bot-bubble--bot   { background: rgba(6,59,88,0.75); color: #e2e8f0; border: 1px solid rgba(76,199,184,0.18); border-radius: 0.25rem 1rem 1rem 1rem; }
.bot-bubble--bot p            { margin: 0 0 0.45rem 0; line-height: 1.65; }
.bot-bubble--bot p:last-child { margin-bottom: 0; }
.bot-bubble--bot strong       { color: #4cc7b8; font-weight: 600; }
.bot-bubble--system {
  background: rgba(251,146,60,0.07); color: #fb923c; border: 1px solid rgba(251,146,60,0.2);
  font-size: 0.7rem; font-family: monospace; border-radius: 0.5rem; padding: 0.4rem 0.75rem;
}
.bot-meta          { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.3rem; flex-wrap: wrap; }
.bot-exec-path {
  font-size: 0.6rem; color: #475569; font-family: monospace;
  padding: 0.12rem 0.45rem; border-radius: 4px;
  background: rgba(6,59,88,0.6); border: 1px solid rgba(76,199,184,0.1);
}
.bot-handoff-badge {
  font-size: 0.6rem; font-weight: 700; color: #f87171;
  border: 1px solid rgba(248,113,113,0.3); background: rgba(248,113,113,0.08);
  border-radius: 4px; padding: 0.1rem 0.4rem;
}
.bot-typing-row    { display: flex; gap: 0.35rem; align-items: center; padding: 0.6rem 0.9rem; }
.bot-dot           { width: 0.38rem; height: 0.38rem; border-radius: 50%; background: #4cc7b8; animation: bot-bounce 1.1s ease-in-out infinite; }
.bot-dot:nth-child(2) { animation-delay: 0.18s; }
.bot-dot:nth-child(3) { animation-delay: 0.36s; }
@keyframes bot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

/* ── Input bar ───────────────────────────────────────────────── */
.bot-input-bar {
  flex: none; padding: 0.65rem 0.75rem;
  border-top: 1px solid rgba(76,199,184,0.15);
  background: rgba(4,19,30,0.85); display: flex; gap: 0.5rem; align-items: flex-end;
}
.bot-input {
  flex: 1; background: rgba(6,59,88,0.55); border: 1px solid rgba(76,199,184,0.22);
  border-radius: 0.6rem; color: #e2e8f0; font-size: 0.85rem;
  padding: 0.5rem 0.75rem; outline: none; resize: none;
  min-height: 38px; max-height: 100px; font-family: inherit; line-height: 1.5;
  direction: rtl; text-align: right;
}
.bot-input:focus        { border-color: rgba(76,199,184,0.55); }
.bot-input::placeholder { color: #475569; }
.bot-send {
  border-radius: 0.6rem; border: none; background: #4cc7b8; color: #063b58;
  font-weight: 700; font-size: 0.82rem; padding: 0.5rem 1rem; cursor: pointer;
  transition: all 0.2s; flex-shrink: 0; height: 38px;
}
.bot-send:hover:not(:disabled) { background: #38b2a4; box-shadow: 0 4px 14px rgba(76,199,184,0.4); }
.bot-send:disabled              { opacity: 0.45; cursor: not-allowed; }

/* ── Warmup loading state ────────────────────────────────────── */
.bot-warmup {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 1.5rem; padding: 2rem; text-align: center; min-height: 0;
}
.bot-warmup-ring {
  width: 48px; height: 48px; border-radius: 50%;
  border: 2px solid rgba(76,199,184,0.15); border-top-color: #4cc7b8;
  animation: bot-spin 0.85s linear infinite;
  box-shadow: 0 0 22px rgba(76,199,184,0.22);
  flex-shrink: 0;
}
@keyframes bot-spin { to { transform: rotate(360deg); } }
.bot-warmup-text {
  font-size: 0.8rem; color: #64748b; line-height: 1.75;
  max-width: 17rem; font-family: monospace;
}
.bot-warmup-text em { color: #4cc7b8; font-style: normal; font-weight: 600; }
.bot-warmup-bars { width: 100%; max-width: 14rem; display: flex; flex-direction: column; gap: 0.45rem; }
.bot-warmup-bar {
  height: 8px; border-radius: 9999px; background: rgba(76,199,184,0.10);
  animation: bot-shimmer 1.8s ease-in-out infinite;
}
.bot-warmup-bar:nth-child(2) { animation-delay: 0.25s; width: 78%; }
.bot-warmup-bar:nth-child(3) { animation-delay: 0.5s;  width: 55%; }
@keyframes bot-shimmer { 0%,100%{ opacity:0.4; } 50%{ opacity:1; } }

/* ── Timeout / offline state ─────────────────────────────────── */
.bot-offline {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 0.9rem; padding: 2rem; text-align: center;
}
.bot-offline-icon  { font-size: 2.25rem; opacity: 0.55; }
.bot-offline-title { font-size: 0.85rem; font-weight: 600; color: #64748b; font-family: monospace; }
.bot-offline-msg   { font-size: 0.72rem; color: #475569; font-family: monospace; max-width: 15rem; line-height: 1.65; }
.bot-retry-btn {
  margin-top: 0.25rem; padding: 0.45rem 1.2rem; border-radius: 9999px;
  border: 1px solid #4cc7b8; background: transparent; color: #4cc7b8;
  font-size: 0.78rem; font-family: monospace; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
}
.bot-retry-btn:hover { background: #4cc7b8; color: #063b58; box-shadow: 0 4px 16px rgba(76,199,184,0.35); }

/* ── Chat fade-in on backend ready ───────────────────────────── */
.bot-chat-reveal {
  display: flex; flex-direction: column; flex: 1; min-height: 0;
  animation: bot-fade-in 0.45s ease both;
}
@keyframes bot-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* ── Legacy checking class (kept for safety) ────────────────── */
.bot-checking { flex: 1; display: flex; align-items: center; justify-content: center; }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 767px) {
  .bot-split     { flex-direction: column; }
  .bot-demo-pane { position: static; height: 500px; }
}
@media (min-width: 768px) {
  .bot-tabs                     { display: none; }
  .bot-story, .bot-demo-pane    { display: flex !important; }
}
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />;
}

function StorySection({
  section,
  isActive,
  isSending,
  isHe,
  onTrigger,
  onTrigger2,
}: {
  section: StorySectionData;
  isActive: boolean;
  isSending: boolean;
  isHe: boolean;
  onTrigger: () => void;
  onTrigger2?: () => void;
}) {
  return (
    <div
      className={`bot-section${isActive ? " bot-section--active" : ""}`}
      dir={isHe ? "rtl" : undefined}
      style={{ fontFamily: isHe ? "var(--font-heebo)" : undefined }}
    >
      <div className="bot-step-badge">{section.badge}</div>
      <h3 className="bot-headline">{section.headline}</h3>
      {section.body}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          className={`bot-trigger-btn${isActive ? " bot-trigger-btn--active" : ""}`}
          onClick={onTrigger}
          disabled={isSending}
        >
          {section.btnLabel}
        </button>
        {section.btnLabel2 && onTrigger2 && (
          <button
            className="bot-trigger-btn"
            onClick={onTrigger2}
            disabled={isSending}
          >
            {section.btnLabel2}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AgentShowcase({ lang: langProp }: { lang?: "en" | "he" } = {}) {
  const [activeStep, setActiveStep] = useState<StepId | null>(null);
  const [activeTab, setActiveTab] = useState<"story" | "demo">("story");

  // Companies & selection
  const [companies, setCompanies] = useState<DemoCompanyMeta[]>(DEMO_COMPANIES);
  const [selectedDomain, setSelectedDomain] = useState("geula-surf.co.il");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable per-company session IDs (reset only on page refresh)
  const sessionIds = useRef<Record<string, string>>({});
  const getSessionId = (domain: string) => {
    if (!sessionIds.current[domain]) {
      sessionIds.current[domain] = `portfolio_${domain}_${Date.now()}`;
    }
    return sessionIds.current[domain];
  };

  const selectedCompany =
    companies.find((c) => c.domain === selectedDomain) ?? companies[0];

  // ── Language — driven by parent prop; localStorage as fallback + cross-tab sync ──
  const [lang, setLang] = useState<"en" | "he">(langProp ?? "en");
  // Sync whenever the parent re-renders with a new lang (same-tab Navbar switch)
  useEffect(() => { if (langProp !== undefined) setLang(langProp); }, [langProp]);
  useEffect(() => {
    if (langProp === undefined) {
      const saved = localStorage.getItem("portfolio-lang");
      if (saved === "en" || saved === "he") setLang(saved);
    }
    // Sync whenever the user switches language in a different tab
    const onStorage = (e: StorageEvent) => {
      if (e.key === "portfolio-lang" && (e.newValue === "en" || e.newValue === "he")) {
        setLang(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [langProp]);

  const isHe = lang === "he";

  // ── Backend warm-up: poll every 5 s for up to 60 s ───────────
  const startWarmup = useCallback(() => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    setBackendStatus("checking");
    const deadline = Date.now() + 60_000;

    const poll = async () => {
      try {
        const r = await fetch(`${API_URL}/health`, {
          signal: AbortSignal.timeout(4500),
        });
        if (r.ok) { setBackendStatus("online"); return; }
      } catch { /* still waking */ }

      if (Date.now() >= deadline) { setBackendStatus("offline"); return; }
      pollTimerRef.current = setTimeout(poll, 5_000);
    };

    poll();
  }, []);

  useEffect(() => {
    startWarmup();
    return () => { if (pollTimerRef.current) clearTimeout(pollTimerRef.current); };
  }, [startWarmup]);

  // ── Re-check every 30 s once online to detect server restart ─
  useEffect(() => {
    if (backendStatus !== "online") return;
    const iv = setInterval(async () => {
      try {
        const r = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(4000) });
        if (!r.ok) startWarmup();
      } catch { startWarmup(); }
    }, 30_000);
    return () => clearInterval(iv);
  }, [backendStatus, startWarmup]);

  // ── Fetch company IDs once backend is confirmed online ───────
  useEffect(() => {
    if (backendStatus !== "online") return;
    fetch(`${API_URL}/api/v1/admin/companies`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Array<{ id: number; domain: string }>) => {
        setCompanies((prev) =>
          prev.map((c) => {
            const match = list.find((x) => x.domain === c.domain);
            return match ? { ...c, id: match.id } : c;
          })
        );
      })
      .catch(() => {});
  }, [backendStatus]);

  // ── Auto-scroll messages (scroll container only, not the page) ──
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
  }, [messages, sending]);

  // ── Core: send message ───────────────────────────────────────
  // override lets handleTrigger pass a pre-resolved companyId+domain
  // so a company switch mid-render doesn't cause a stale-closure bug.
  const sendMessage = useCallback(
    async (
      text: string,
      override?: { companyId: number; domain: string }
    ) => {
      if (!text.trim() || sending) return;

      const companyId = override?.companyId ?? selectedCompany.id;
      const domain    = override?.domain    ?? selectedDomain;

      if (!companyId) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "system",
            content: "Backend not reachable — start the server to continue.",
          },
        ]);
        return;
      }

      const userMsg: ChatMessage = {
        id: Date.now(),
        role: "user",
        content: text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setSending(true);

      try {
        const resp = await fetch(`${API_URL}/api/v1/agent/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: companyId,
            user_id: "1",
            session_id: getSessionId(domain),
            message: text,
            channel: "demo",
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "bot",
              content: data.text,
              executionPath: data.execution_path,
              handoff: data.handoff,
            },
          ]);
        } else {
          throw new Error("non-ok");
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "bot",
            content: "שגיאה בחיבור לשרת — נסה שוב.",
            isError: true,
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sending, selectedCompany, selectedDomain]
  );

  // ── Switch company ───────────────────────────────────────────
  const switchCompany = useCallback(
    (domain: string) => {
      if (domain === selectedDomain) return;
      const next = companies.find((c) => c.domain === domain);
      if (!next) return;
      setSelectedDomain(domain);
      setMessages([
        {
          id: Date.now(),
          role: "system",
          content: `עוברים ל-${next.label} (${next.type}) — שיחה חדשה`,
        },
      ]);
    },
    [selectedDomain, companies]
  );

  // ── Story section trigger ────────────────────────────────────
  const handleTrigger = useCallback(
    (section: StorySectionData, messageOverride?: string) => {
      setActiveStep(section.stepId);
      // On mobile, flip to demo tab automatically
      if (activeTab === "story") setActiveTab("demo");

      // Resolve the target company NOW — before any state changes —
      // so the sendMessage call below gets the correct id even if
      // React hasn't re-rendered with the new selectedDomain yet.
      const targetDomain = section.targetDomain ?? selectedDomain;
      const targetCompany = companies.find((c) => c.domain === targetDomain);
      const override =
        targetCompany?.id
          ? { companyId: targetCompany.id, domain: targetDomain }
          : undefined;

      const switchDelay =
        section.targetDomain && section.targetDomain !== selectedDomain
          ? 450
          : 0;

      if (section.targetDomain && section.targetDomain !== selectedDomain) {
        switchCompany(section.targetDomain);
      }

      const msg = messageOverride ?? section.demoMessage;
      setTimeout(() => {
        sendMessage(msg, override);
      }, switchDelay + 200);
    },
    [activeTab, selectedDomain, companies, switchCompany, sendMessage]
  );

  const SECTIONS = makeSections(isHe);
  const storyVisible = activeTab === "story";
  const demoVisible = activeTab === "demo";

  return (
    <section id="salesbot" className="bot-root">
      <StyleInjector />

      <div className="bot-inner">
        {/* ── Section header ── */}
        <div
          className="bot-header"
          dir={isHe ? "rtl" : undefined}
          style={{ fontFamily: isHe ? "var(--font-heebo)" : undefined }}
        >
          <div className="bot-header-badge">
            <span className="bot-header-dot" />
            {isHe
              ? "LangGraph · Multi-Company · דמו חי ל-Forcepoint"
              : "LangGraph · Multi-Company · Forcepoint Live"}
          </div>
          <h2 className="bot-title">
            {isHe ? (
              <>
                סוכן מכירות AI —{" "}
                <span className="bot-title-em">Live Demo</span>
              </>
            ) : (
              <>
                AI Sales Agent —{" "}
                <span className="bot-title-em">Live Demo</span>
              </>
            )}
          </h2>
          <p className="bot-subtitle">
            {isHe ? (
              <>
                סוכן מכירות מבוסס LangGraph התומך במספר חברות במקביל, כולל
                ניתוב B2B/B2C, מנגנון Handoff (העברה לנציג) דו-שלבי, ולולאת
                למידה מבוססת-פידבק. הנתונים האמיתיים של Forcepoint מוזנים
                פנימה כסביבת עבודה פעילה — לחצו על כל אחד מהחלקים כדי לשלוח
                הודעת דמו ל-Backend האמיתי. נסו{" "}
                <strong style={{ color: "#4cc7b8" }}>בעברית</strong> או{" "}
                <strong style={{ color: "#4cc7b8" }}>באנגלית</strong> — הבוט
                מזהה את השפה אוטומטית.
              </>
            ) : (
              <>
                A LangGraph-powered multi-company sales agent with B2C/B2B
                routing, two-stage handoff detection, and a feedback-driven
                learning loop. Forcepoint&apos;s real product data is seeded as
                a live workspace — click any section to send a demo message to
                the real backend. Try it in{" "}
                <strong style={{ color: "#4cc7b8" }}>Hebrew</strong> or{" "}
                <strong style={{ color: "#4cc7b8" }}>English</strong> — the
                agent detects language automatically.
              </>
            )}
          </p>
        </div>

        {/* ── Mobile tabs ── */}
        <div className="bot-tabs">
          <button
            className={`bot-tab${storyVisible ? " bot-tab--active" : " bot-tab--inactive"}`}
            onClick={() => setActiveTab("story")}
          >
            {isHe ? "📖 סיפור הנדסי" : "📖 Engineering Story"}
          </button>
          <button
            className={`bot-tab${demoVisible ? " bot-tab--active" : " bot-tab--inactive"}`}
            onClick={() => setActiveTab("demo")}
          >
            {isHe ? "💬 דמו חי" : "💬 Live Demo"}
          </button>
        </div>

        {/* ── Split pane ── */}
        <div className="bot-split" dir={isHe ? "rtl" : undefined}>
          {/* Story sections */}
          <div
            className="bot-story"
            style={{ display: storyVisible ? undefined : "none" }}
          >
            {SECTIONS.map((s) => (
              <StorySection
                key={s.stepId}
                section={s}
                isActive={activeStep === s.stepId}
                isSending={sending}
                isHe={isHe}
                onTrigger={() => handleTrigger(s)}
                onTrigger2={
                  s.btnLabel2 && s.demoMessage2
                    ? () => handleTrigger(s, s.demoMessage2)
                    : undefined
                }
              />
            ))}
          </div>

          {/* Live chat demo */}
          <div
            className="bot-demo-pane"
            dir="ltr"
            style={{ display: demoVisible ? undefined : "none" }}
          >
            {/* Header: company selector + status */}
            <div className="bot-demo-header">
              <div className="bot-demo-header-row">
                <span className="bot-demo-title">Live Agent Demo</span>
                <span className="bot-status-row">
                  <span
                    className="bot-status-dot"
                    style={{
                      background:
                        backendStatus === "online"
                          ? "#4ade80"
                          : backendStatus === "offline"
                            ? "#f87171"
                            : "#fb923c",
                    }}
                  />
                  {backendStatus === "online"
                    ? "Backend online"
                    : backendStatus === "offline"
                      ? "Timed out"
                      : "Waking up…"}
                </span>
              </div>
              <div className="bot-company-tabs">
                {companies.map((c) => (
                  <button
                    key={c.domain}
                    className={`bot-company-pill${selectedDomain === c.domain ? " bot-company-pill--active" : ""}`}
                    onClick={() => switchCompany(c.domain)}
                  >
                    {c.label}
                    <span
                      className={`bot-type-badge ${c.type === "B2C" ? "bot-type-b2c" : "bot-type-b2b"}`}
                    >
                      {c.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body: waking up / timed out / chat */}
            {backendStatus === "checking" ? (
              <div className="bot-warmup">
                <div className="bot-warmup-ring" />
                <div className="bot-warmup-bars">
                  <div className="bot-warmup-bar" />
                  <div className="bot-warmup-bar" />
                  <div className="bot-warmup-bar" />
                </div>
                <p className="bot-warmup-text">
                  {isHe ? (
                    <>מעירים את שרתי ה-AI... <em>זה עשוי לקחת כמה שניות</em>, אבל ברגע שזה יעלה — זה יטוס 🚀</>
                  ) : (
                    <>Waking up the AI servers&hellip; <em>This might take a few seconds</em>, but it&apos;ll be lightning fast once it&apos;s ready!</>
                  )}
                </p>
              </div>
            ) : backendStatus === "offline" ? (
              <div className="bot-offline">
                <div className="bot-offline-icon">⏱️</div>
                <div className="bot-offline-title">
                  {isHe ? "השרת לא הגיב בזמן" : "Server didn't respond in time"}
                </div>
                <p className="bot-offline-msg">
                  {isHe
                    ? "ייתכן שהשרת עמוס. נסה שוב בעוד רגע."
                    : "The server might be under load — give it another try."}
                </p>
                <button className="bot-retry-btn" onClick={startWarmup}>
                  {isHe ? "נסה שוב ↺" : "Retry ↺"}
                </button>
              </div>
            ) : (
              <div className="bot-chat-reveal">
                {/* Messages */}
                <div className="bot-messages">
                  {messages.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#334155",
                        fontSize: "0.78rem",
                        marginTop: "2rem",
                        fontFamily: "monospace",
                        lineHeight: 1.7,
                      }}
                    >
                      {isHe ? (
                        <>לחצו על חלק מהסיפור כדי לשלוח הודעת דמו,<br />או הקלידו כאן לשיחה חופשית.</>
                      ) : (
                        <>Click a story section to send a demo message,<br />or type below to chat freely.</>
                      )}
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bot-msg bot-msg--${msg.role}`}
                    >
                      <div className={`bot-bubble bot-bubble--${msg.role}`}>
                        {msg.role === "bot" ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.role === "bot" && (
                        <div className="bot-meta">
                          {msg.executionPath &&
                            msg.executionPath.length > 0 && (
                              <span className="bot-exec-path">
                                {msg.executionPath.join(" → ")}
                              </span>
                            )}
                          {msg.handoff && (
                            <span className="bot-handoff-badge">
                              HANDOFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {sending && (
                    <div className="bot-msg bot-msg--bot">
                      <div className="bot-bubble bot-bubble--bot">
                        <div
                          className="bot-typing-row"
                          style={{ padding: 0, margin: "2px 0" }}
                        >
                          <div className="bot-dot" />
                          <div className="bot-dot" />
                          <div className="bot-dot" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="bot-input-bar">
                  <textarea
                    className="bot-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(inputValue);
                        setInputValue("");
                      }
                    }}
                    placeholder="כתוב הודעה… (Enter לשליחה)"
                    disabled={sending}
                    rows={1}
                  />
                  <button
                    className="bot-send"
                    onClick={() => {
                      sendMessage(inputValue);
                      setInputValue("");
                    }}
                    disabled={!inputValue.trim() || sending}
                  >
                    שלח
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
