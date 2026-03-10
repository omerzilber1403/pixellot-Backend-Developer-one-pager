"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type PanelId = "messi" | "ronaldo" | "server";

type LineType =
  | "cmd"        // cyan   — user-typed command
  | "output"     // slate  — plain output
  | "error"      // red    — runtime errors
  | "success"    // green  — confirmed / OK
  | "info"       // indigo — section headers
  | "frame-in"   // violet — STOMP frame (box-drawing)
  | "frame-err"  // red    — STOMP ERROR frame
  | "sql";       // orange — Python SQL layer

type StepId = "boot" | "login" | "pubsub" | "summary" | "logout";

interface TerminalLine {
  type: LineType;
  text: string;
  complete: boolean;
}

interface StorySectionData {
  stepId:   StepId;
  badge:    string;
  headline: string;
  body:     React.ReactNode;
  btnLabel: string;
}

/* ─── Colour tokens ──────────────────────────────────────────────────────── */
const LINE_COLORS: Record<LineType, string> = {
  cmd:         "#22d3ee",
  output:      "#94a3b8",
  error:       "#f87171",
  success:     "#4ade80",
  info:        "#818cf8",
  "frame-in":  "#c084fc",
  "frame-err": "#f87171",
  sql:         "#fb923c",
};

/* ─── Timing constants ───────────────────────────────────────────────────── */
const CHAR_DELAY = 15;
const LINE_GAP   = 155;
const PROMPT     = "$ ";
const BORDER     = 47;

/* ─── Game data (Argentina vs France — 2022 World Cup Final) ─────────────── */
const AF_EVENTS = [
  { time: "0:00",  type: "kickoff",  team: null,       desc: "Argentina vs France — 2022 FIFA World Cup Final" },
  { time: "36:00", type: "goal!!!!", team: "Argentina", desc: "Di María fires Argentina ahead — 2:0!" },
  { time: "80:00", type: "goal!!!!", team: "France",    desc: "Mbappé converts penalty — 2:1" },
  { time: "81:00", type: "goal!!!!", team: "France",    desc: "Mbappé volleys in — 2:2. France level!" },
];

/* ─── Frame builders ─────────────────────────────────────────────────────── */
function buildFrame(frameType: string, headers: string[], body: string[]): string {
  const top = `┌─ ${frameType} ${"─".repeat(Math.max(0, BORDER - frameType.length - 2))}`;
  const bot = `└${"─".repeat(BORDER)}`;
  const hdr = headers.map(h => `│ ${h}`);
  const bdy = body.map(b => `│ ${b}`);
  return (body.length ? [top, ...hdr, "│", ...bdy, bot] : [top, ...hdr, bot]).join("\n");
}

function buildErrorFrame(message: string, details: string[]): string {
  const top = `╔═ ERROR ${"═".repeat(BORDER - 6)}`;
  const bot = `╚${"═".repeat(BORDER)}`;
  return [top, `║  message:  ${message}`, ...details.map(d => `║  ${d}`), bot].join("\n");
}

/* ─── Story sections ─────────────────────────────────────────────────────── */
type Lang = "en" | "he";

function makeSections(isHe: boolean): StorySectionData[] {
  const S = "#cbd5e1";
  return [
    {
      stepId:   "boot",
      badge:    isHe ? "01 / ארכיטקטורה" : "01 / Architecture",
      headline: isHe ? "מחסנית תלת-שכבתית (A Three-Tier Stack)" : "A Three-Tier Stack",
      btnLabel: isHe ? "אתחול המערכת" : "Boot the System",
      body: isHe ? (
        <div className="spl-body">
          <p><strong style={{ color: S }}>שרת Java (שכבה עליונה):</strong>{" "}ממומש ב-Java, ותומך גם במודל <code>Thread-Per-Client (TPC)</code> — שבו כל חיבור מקבל תהליכון OS ייעודי שחוסם (Blocks) על קריאות Socket — וגם במודל <code>Reactor</code> א-סינכרוני, שבו לולאת Selector מנתבת אירועי I/O-readiness ל-Thread Pool מוגבל.</p>
          <p><strong style={{ color: S }}>גישור DB ב-Python (שכבת אמצע):</strong>{" "}שרת Python המשמש כגשר מעל Raw TCP בפורט <code>7778</code>, ומבצע שאילתות SQL מול מסד נתונים <code>SQLite</code>. מנהל רישום משתמשים, לוגי התחברויות, ושמירת לוגי אירועים — מה שמשאיר את שרת ה-Java במצב Stateless.</p>
          <p><strong style={{ color: S }}>קליינט C++ (שכבה תחתונה):</strong>{" "}ממומש ב-C++, ומשמש כממשק <code>STOMP 1.2</code> בצד הלקוח עבור הרשמה לערוצים, דיווח אירועים, ויצירת סיכומים.</p>
        </div>
      ) : (
        <div className="spl-body">
          <p><strong style={{ color: S }}>Java Server (top tier):</strong>{" "}Implemented in Java, supporting both <code>Thread-Per-Client (TPC)</code> — each connection owns a dedicated OS thread blocking on socket reads — and a non-blocking <code>Reactor</code> model, where a selector loop dispatches I/O-readiness events to a bounded thread pool.</p>
          <p><strong style={{ color: S }}>Python DB bridge (middle tier):</strong>{" "}A Python server bridging via raw TCP on port <code>7778</code>, executing SQL queries on a <code>SQLite</code> database. Handles user registration, login records, and persisted event logs — keeping the Java server stateless.</p>
          <p><strong style={{ color: S }}>C++ Client (bottom tier):</strong>{" "}Implemented in C++, acting as the client-side <code>STOMP 1.2</code> interface for channel subscription, event reporting, and summary generation.</p>
        </div>
      ),
    },
    {
      stepId:   "login",
      badge:    isHe ? "02 / מקביליות" : "02 / Concurrency",
      headline: isHe ? "מודל קליינט מבוסס שני תהליכונים (Two-Thread Client Model)" : "Two-Thread Client Model",
      btnLabel: isHe ? "חיבור קליינטים" : "Connect Clients",
      body: isHe ? (
        <div className="spl-body">
          <p><strong style={{ color: S }}>תהליכונים ייעודיים:</strong>{" "}הקליינט ב-C++ מריץ שני תהליכונים (Threads) מקבילים בעת ההתחברות כדי למנוע חסימה של ה-UI בזמן פעולות רשת (Network I/O) — תהליכון אחד לקלט ממשתמש, ותהליכון שני לזרם הנתונים מה-Socket.</p>
          <p><strong style={{ color: S }}>תהליכון המקלדת (Keyboard Thread):</strong>{" "}קורא פקודות בלעדית מ-<code>stdin</code> וכותב STOMP Frames יוצאים אל ה-Socket. תהליכון זה לעולם לא קורא מה-Socket — הבעלות (Ownership) מוגדרת באופן נוקשה.</p>
          <p><strong style={{ color: S }}>תהליכון ה-Socket (Socket Thread):</strong>{" "}מאזין בלעדית ל-Socket ומנתב Frames נכנסים ל-Handlers הרשומים. תהליכון זה מחזיק בבעלות על צד הקריאה (Read) של החיבור משלב הלוגין ועד ל-Teardown.</p>
        </div>
      ) : (
        <div className="spl-body">
          <p><strong style={{ color: S }}>Dedicated threads:</strong>{" "}The C++ client runs two concurrent threads at login to prevent UI blocking during network I/O — one for input, one for the live socket stream.</p>
          <p><strong style={{ color: S }}>Keyboard thread:</strong>{" "}Exclusively reads commands from <code>stdin</code> and writes outgoing STOMP frames to the socket. Never reads from the socket — ownership is strict.</p>
          <p><strong style={{ color: S }}>Socket thread:</strong>{" "}Exclusively listens on the socket and dispatches incoming frames to registered handlers. Owns the read side of the connection from login to teardown.</p>
        </div>
      ),
    },
    {
      stepId:   "pubsub",
      badge:    isHe ? "03 / פרוטוקול" : "03 / Protocol",
      headline: isHe ? "STOMP 1.2 מאפס (STOMP 1.2 from Scratch)" : "STOMP 1.2 from Scratch",
      btnLabel: isHe ? "הרשמה ודיווח" : "Subscribe & Report",
      body: isHe ? (
        <div className="spl-body">
          <p><strong style={{ color: S }}>מחזור חיים מלא:</strong>{" "}מימוש מלא של סט ה-Frames של STOMP — <code>CONNECT</code>, <code>SUBSCRIBE</code>, <code>SEND</code>, <code>MESSAGE</code>, <code>DISCONNECT</code>, <code>RECEIPT</code>, <code>ERROR</code> — גם בצד השרת וגם בצד הלקוח.</p>
          <p><strong style={{ color: S }}>מזהים מבוססי-לקוח (Client-generated IDs):</strong>{" "}מזהי הרשמות (Subscription IDs) ומזהי קבלות (Receipt IDs) מיוצרים בצורה ייחודית על ידי הלקוח ומנוהלים מקומית. השרת מהדהד אותם חזרה ב-<code>MESSAGE</code> ו-<code>RECEIPT</code> Frames לחיפוש O(1) בצד הלקוח.</p>
          <p><strong style={{ color: S }}>פענוח (Frame Parsing):</strong>{" "}קורא את זרם ה-Raw Socket, מפענח צמדי <code>header:value</code> שורה אחר שורה, ומחלץ את גוף ההודעה (Body) עד לתו מסיים המחרוזת (<code>\0</code>).</p>
        </div>
      ) : (
        <div className="spl-body">
          <p><strong style={{ color: S }}>Full lifecycle:</strong>{" "}Implements the complete STOMP frame set — <code>CONNECT</code>, <code>SUBSCRIBE</code>, <code>SEND</code>, <code>MESSAGE</code>, <code>DISCONNECT</code>, <code>RECEIPT</code>, <code>ERROR</code> — across both client and server.</p>
          <p><strong style={{ color: S }}>Client-generated IDs:</strong>{" "}Subscription IDs and receipt IDs are generated uniquely by the client and tracked locally. The server echoes them back in <code>MESSAGE</code> and <code>RECEIPT</code> frames for O(1) client-side lookup.</p>
          <p><strong style={{ color: S }}>Frame parsing:</strong>{" "}Reads the raw socket stream, parses <code>header:value</code> pairs line by line, and extracts the body until the null-char (<code>\0</code>) terminator.</p>
        </div>
      ),
    },
    {
      stepId:   "summary",
      badge:    isHe ? "04 / מבני נתונים" : "04 / Data Structures",
      headline: isHe ? "אגרגציה בצד הלקוח (Client-Side Aggregation)" : "Client-Side Aggregation",
      btnLabel: isHe ? "יצירת סיכום" : "Generate Summary",
      body: isHe ? (
        <div className="spl-body">
          <p><strong style={{ color: S }}>מעקב אירועים:</strong>{" "}מפענח קבצי אירועים ב-JSON ושומר את אירועי המשחק במבנה נתונים מסוג Nested Map, שבו המפתחות הם שם הערוץ והמשתמש המדווח. השרת רק שומר את ה-Frames הגולמיים — כל לוגיקת האגרגציה יושבת לחלוטין בצד הלקוח.</p>
          <p><strong style={{ color: S }}>סידור כרונולוגי:</strong>{" "}האירועים נשמרים ומודפסים לפי סדר התרחשותם. מיון משני על רשימת האירועים לפי שדה הזמן (<code>time</code>) מייצר את הפלט הסופי.</p>
          <p><strong style={{ color: S }}>סטטיסטיקות לקסיקוגרפיות:</strong>{" "}הסטטיסטיקות מחושבות מקומית ומודפסות בסדר לקסיקוגרפי לפי שם הסטטיסטיקה — מבנה הנתונים מבטיח את הסדר הזה ללא צורך בשלב מיון (Post-sort) נוסף.</p>
        </div>
      ) : (
        <div className="spl-body">
          <p><strong style={{ color: S }}>Event tracking:</strong>{" "}Parses JSON event files and stores game events in a nested map keyed by channel name and reporting user. The server only persists raw frames — all aggregation logic lives entirely on the client.</p>
          <p><strong style={{ color: S }}>Chronological ordering:</strong>{" "}Events are stored and printed ordered by occurrence time. A secondary sort on the event list by the <code>time</code> field produces the final output.</p>
          <p><strong style={{ color: S }}>Lexicographical stats:</strong>{" "}Stats are aggregated locally and printed in lexicographical order by stat name — the data structure guarantees order without a post-sort step.</p>
        </div>
      ),
    },
    {
      stepId:   "logout",
      badge:    isHe ? "05 / מחזור חיים" : "05 / Lifecycle",
      headline: isHe ? "כיבוי חינני (Graceful Shutdown)" : "Graceful Shutdown",
      btnLabel: isHe ? "התנתקות (Graceful Logout)" : "Graceful Logout",
      body: isHe ? (
        <div className="spl-body">
          <p><strong style={{ color: S }}>DISCONNECT Frame:</strong>{" "}הקליינט שולח DISCONNECT Frame הכולל Receipt ID ייחודי לפני הסגירה. סגירת ה-Socket ללא ה-Handshake הזה מסתכנת באובדן שקט של נתונים (Bytes) שעדיין ממתינים בתור ב-Kernel Send Buffer.</p>
          <p><strong style={{ color: S }}>אישור שרת (Server Acknowledgment):</strong>{" "}הקליינט ממתין באופן נוקשה ל-RECEIPT Frame התואם לפני קריאה ל-<code>close(sockfd)</code>. תהליכון המקלדת נחסם על Condition Variable עד שתהליכון ה-Socket מאותת שהקבלה אושרה.</p>
          <p><strong style={{ color: S }}>אפס אובדן הודעות (Zero Message Loss):</strong>{" "}לפי פרוטוקול STOMP 1.2 RFC, ה-RECEIPT הוא מצטבר (Cumulative) — הוא מאשר את כל ה-Frames שקדמו לו. לחיצת היד הזו מבטיחה שכל SEND שקדם ל-DISCONNECT עובד בהצלחה.</p>
        </div>
      ) : (
        <div className="spl-body">
          <p><strong style={{ color: S }}>DISCONNECT frame:</strong>{" "}Client sends a <code>DISCONNECT</code> frame with a unique receipt ID before closing. Closing the socket without this handshake risks silently dropping bytes still queued in the kernel send buffer.</p>
          <p><strong style={{ color: S }}>Server acknowledgment:</strong>{" "}Client strictly waits for the matching <code>RECEIPT</code> frame before calling <code>close(sockfd)</code>. The keyboard thread blocks on a condition variable until the socket thread signals receipt confirmed.</p>
          <p><strong style={{ color: S }}>Zero message loss:</strong>{" "}Per the STOMP 1.2 RFC, a <code>RECEIPT</code> is cumulative — it acknowledges all preceding frames. This handshake guarantees every <code>SEND</code> before the <code>DISCONNECT</code> was processed. No data is silently dropped.</p>
        </div>
      ),
    },
  ];
}

/* ─── Scoped CSS ─────────────────────────────────────────────────────────── */
const SCOPED_CSS = `
/* ── Root ──────────────────────────────────────────────────────────────── */
.spl-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #e2e8f0;
  position: relative;
  overflow: visible;
}
.spl-bg-orb {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 75% 65% at 50% 50%,
    rgba(6,59,88,0.22) 0%, transparent 70%);
  z-index: 0;
}

/* ── Inner wrapper ──────────────────────────────────────────────────────── */
.spl-inner {
  position: relative; z-index: 1;
  max-width: 72rem; margin: 0 auto;
  padding: 5rem 1.5rem 6rem;
}

/* ── Section header ─────────────────────────────────────────────────────── */
.spl-header { text-align: center; margin-bottom: 3.5rem; }
.spl-header-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border-radius: 9999px; border: 1px solid rgba(76,199,184,0.28);
  padding: 0.375rem 1rem; font-size: 0.7rem; font-family: monospace;
  font-weight: 600; letter-spacing: 0.04em; margin-bottom: 1.25rem;
  background: rgba(76,199,184,0.12); color: #4cc7b8; cursor: default;
}
.spl-header-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #4cc7b8;
  animation: spl-pulse 2s infinite;
}
@keyframes spl-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.spl-title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700; color: #ffffff; line-height: 1.15; margin-bottom: 0.75rem;
}
.spl-title-em { color: #4cc7b8; }
.spl-subtitle {
  font-size: 0.9rem; color: #94a3b8; max-width: 38rem;
  margin: 0 auto; line-height: 1.75;
}

/* ── Mobile tab switcher ─────────────────────────────────────────────────── */
.spl-tabs {
  display: grid; grid-template-columns: 1fr 1fr;
  border-radius: 0.75rem; overflow: hidden;
  border: 1px solid rgba(76,199,184,0.25); margin-bottom: 1.5rem;
}
.spl-tab {
  padding: 0.625rem 1rem; font-size: 0.8rem; font-weight: 600;
  font-family: monospace; letter-spacing: 0.03em;
  border: none; cursor: pointer; transition: all 0.2s ease; text-align: center;
}
.spl-tab--active   { background: #4cc7b8; color: #063b58; }
.spl-tab--inactive { background: rgba(6,59,88,0.6); color: #94a3b8; }

/* ── Split layout ───────────────────────────────────────────────────────── */
.spl-split {
  display: flex; gap: 2rem; align-items: flex-start;
}

/* ── Left: story pane ───────────────────────────────────────────────────── */
.spl-story {
  flex: 0 0 48%;
  display: flex; flex-direction: column; gap: 1.5rem;
}

/* ── Right: sticky terminal pane ────────────────────────────────────────── */
.spl-terminal {
  flex: 1;
  position: sticky; top: 4.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  height: calc(100vh - 6rem); overflow: hidden;
}

/* ── Story section card ─────────────────────────────────────────────────── */
.spl-section {
  border-radius: 1rem; padding: 1.5rem;
  border: 1px solid rgba(76,199,184,0.10);
  background: rgba(6,59,88,0.25);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
}
.spl-section--active {
  border-left: 2px solid #4cc7b8;
  border-color: rgba(76,199,184,0.38);
  background: rgba(6,59,88,0.38);
  box-shadow: 0 0 24px rgba(76,199,184,0.08), inset 0 0 18px rgba(251,146,60,0.04);
}

/* ── Step badge ─────────────────────────────────────────────────────────── */
.spl-step-badge {
  display: inline-block; margin-bottom: 0.75rem;
  font-size: 0.65rem; font-family: monospace; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 0.2rem 0.6rem; border-radius: 9999px;
  background: rgba(251,146,60,0.15); color: #fb923c;
  border: 1px solid rgba(251,146,60,0.28);
}

/* ── Section headline ───────────────────────────────────────────────────── */
.spl-headline {
  font-size: 1.05rem; font-weight: 700; color: #ffffff;
  margin: 0 0 0.75rem; line-height: 1.35;
}

/* ── Prose body ─────────────────────────────────────────────────────────── */
.spl-body {
  font-size: 0.84rem; color: #94a3b8; line-height: 1.8;
  display: flex; flex-direction: column; gap: 0.65rem;
  margin-bottom: 1.25rem;
}
.spl-body p { margin: 0; }
.spl-body em { color: #cbd5e1; font-style: italic; }
.spl-body code {
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.77rem; padding: 0.1rem 0.35rem;
  border-radius: 4px; background: rgba(76,199,184,0.10); color: #4cc7b8;
}

/* ── Trigger button ─────────────────────────────────────────────────────── */
.spl-trigger-btn {
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.45rem 1.1rem; border-radius: 9999px;
  border: 1px solid #4cc7b8; background: transparent; color: #4cc7b8;
  font-size: 0.78rem; font-family: monospace; font-weight: 600;
  cursor: pointer; transition: all 0.22s ease; letter-spacing: 0.03em;
}
.spl-trigger-btn:hover {
  background: #4cc7b8; color: #063b58;
  box-shadow: 0 4px 16px rgba(76,199,184,0.35);
  transform: translateY(-1px);
}
.spl-trigger-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.spl-trigger-btn--active  { background: rgba(76,199,184,0.15); box-shadow: 0 0 0 1px #4cc7b8 inset; }
.spl-trigger-arrow { font-size: 0.85rem; transition: transform 0.2s ease; }
.spl-trigger-btn:hover .spl-trigger-arrow { transform: translateX(3px); }
[dir="rtl"] .spl-trigger-btn:hover .spl-trigger-arrow { transform: translateX(-3px); }

/* ── Terminal panel ─────────────────────────────────────────────────────── */
.spl-panel {
  flex: 1; display: flex; flex-direction: column; min-height: 0;
  border-radius: 0.75rem; overflow: hidden;
  border: 1px solid rgba(76,199,184,0.25);
  background: rgba(6,59,88,0.55);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
}

/* ── Panel chrome (window header) ───────────────────────────────────────── */
.spl-panel-chrome {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.75rem; flex-shrink: 0;
  background: rgba(6,59,88,0.80);
  border-bottom: 1px solid rgba(76,199,184,0.15);
}
.spl-panel-dot  { width: 0.6rem; height: 0.6rem; border-radius: 50%; flex-shrink: 0; }
.spl-panel-title {
  margin-left: 0.5rem; font-size: 0.7rem; font-family: monospace;
  font-weight: 600; color: #4cc7b8;
}
.spl-panel-sub {
  font-size: 0.7rem; font-family: monospace; color: #475569;
}

/* ── Panel output area ──────────────────────────────────────────────────── */
.spl-panel-output {
  flex: 1; min-height: 0;
  overflow-y: auto; padding: 0.75rem 0.75rem 1.1rem;
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.68rem; line-height: 1.55;
  background: rgba(4,19,30,1);
}
.spl-line {
  display: flex; align-items: flex-start; min-height: 1.1rem;
}
.spl-line-text { word-break: break-all; white-space: pre-wrap; }
.spl-cursor {
  display: inline-block; width: 0.375rem; height: 0.875rem;
  margin-left: 1px; background: #22d3ee; flex-shrink: 0; margin-top: 1px;
  animation: spl-blink 1s step-end infinite;
}
@keyframes spl-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* ── STOMP frame blocks ─────────────────────────────────────────────────── */
.spl-frame {
  color: #c084fc;
  background: rgba(192,132,252,0.07);
  border-left: 2px solid #c084fc;
  border-radius: 0 4px 4px 0;
  padding: 4px 8px; margin: 3px 0;
  font-family: inherit; font-size: 0.65rem; line-height: 1.55;
  white-space: pre; overflow-x: auto;
}
.spl-frame--err {
  color: #f87171;
  background: rgba(248,113,113,0.07);
  border-left-color: #f87171;
}

/* ── Legend ─────────────────────────────────────────────────────────────── */
.spl-legend { display: flex; flex-wrap: wrap; gap: 0.75rem; padding: 0.125rem 0; }
.spl-legend-item {
  display: flex; align-items: center; gap: 0.375rem;
  font-size: 0.68rem; font-family: monospace; color: #475569;
}
.spl-legend-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; flex-shrink: 0; }

/* ── Project context cards ──────────────────────────────────────────────── */
.spl-context {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem; margin-bottom: 2.5rem;
}
.spl-context-card {
  border-radius: 0.75rem; padding: 1rem 1.1rem;
  border: 1px solid rgba(76,199,184,0.14);
  background: rgba(6,59,88,0.28);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.spl-context-card-label {
  font-size: 0.6rem; font-family: monospace; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #4cc7b8; margin-bottom: 0.45rem;
}
.spl-context-card-body {
  font-size: 0.8rem; color: #94a3b8; line-height: 1.7;
}
.spl-context-card-body strong { color: #cbd5e1; font-weight: 600; }
@media (max-width: 767px) { .spl-context { grid-template-columns: 1fr; } }

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .spl-split     { flex-direction: column; }
  .spl-story     { flex: none; width: 100%; }
  .spl-terminal  { position: static; height: auto; overflow: visible; }
  .spl-panel     { flex: none; }
  .spl-panel-output { max-height: 220px; min-height: 90px; }
}
@media (min-width: 768px) {
  .spl-tabs      { display: none; }
  .spl-story,
  .spl-terminal  { display: flex !important; }
}
`;

/* ─── StyleInjector ──────────────────────────────────────────────────────── */
function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />;
}

/* ─── TerminalPanel ──────────────────────────────────────────────────────── */
function TerminalPanel({
  title, subtitle, lines, bottomRef, maxHeight,
}: {
  title:     string;
  subtitle:  string;
  lines:     TerminalLine[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  maxHeight?: string;
}) {
  return (
    <div className="spl-panel">
      <div className="spl-panel-chrome">
        <span className="spl-panel-dot" style={{ background: "#ff5f57" }} />
        <span className="spl-panel-dot" style={{ background: "#febc2e" }} />
        <span className="spl-panel-dot" style={{ background: "#28c840" }} />
        <span className="spl-panel-title">{title}</span>
        <span className="spl-panel-sub">{subtitle}</span>
      </div>
      <div className="spl-panel-output" style={maxHeight ? { maxHeight } : undefined}>
        {lines.map((line, idx) => {
          const isFrame = line.type === "frame-in" || line.type === "frame-err";
          if (isFrame) {
            return (
              <pre
                key={idx}
                className={`spl-frame${line.type === "frame-err" ? " spl-frame--err" : ""}`}
              >
                {line.text}
              </pre>
            );
          }
          return (
            <div key={idx} className="spl-line">
              <span
                className="spl-line-text"
                style={{ color: LINE_COLORS[line.type] }}
              >
                {line.text}
              </span>
              {idx === lines.length - 1 && !line.complete && (
                <span className="spl-cursor" />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ─── StorySection ───────────────────────────────────────────────────────── */
function StorySection({
  section, isActive, isPlaying, onTrigger, isHe = false,
}: {
  section:   StorySectionData;
  isActive:  boolean;
  isPlaying: boolean;
  onTrigger: () => void;
  isHe?:     boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className={`spl-section${isActive ? " spl-section--active" : ""}`}
    >
      <span className="spl-step-badge">{section.badge}</span>
      <h3 className="spl-headline">{section.headline}</h3>
      {section.body}
      <button
        className={`spl-trigger-btn${isActive ? " spl-trigger-btn--active" : ""}`}
        onClick={onTrigger}
        disabled={isPlaying && !isActive}
        title={isPlaying && !isActive ? "Wait for current scenario to finish" : undefined}
      >
        <span>▶</span>
        {section.btnLabel}
        <span className="spl-trigger-arrow">{isHe ? "←" : "→"}</span>
      </button>
    </div>
  );
}

/* ─── SPLCaseStudy ───────────────────────────────────────────────────────── */
export default function SPLCaseStudy({ lang = "en" }: { lang?: Lang }) {
  const isHe = lang === "he";
  const welcome = (who: string): TerminalLine[] => [
    { type: "info",   text: `StompWCIClient — ${who}`, complete: true },
    { type: "output", text: "Click a button on the left to run a scenario ↑", complete: true },
  ];
  const welcomeServer = (): TerminalLine[] => [
    { type: "info",   text: "Java Reactor :7777  |  Python SQL :7778", complete: true },
    { type: "output", text: "Click a button on the left to run a scenario ↑", complete: true },
  ];

  const [activeStep,    setActiveStep]    = useState<StepId | null>(null);
  const [messiLines,    setMessiLines]    = useState<TerminalLine[]>(welcome("messi"));
  const [ronaldoLines,  setRonaldoLines]  = useState<TerminalLine[]>(welcome("ronaldo"));
  const [serverLines,   setServerLines]   = useState<TerminalLine[]>(welcomeServer());
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [activeTab,     setActiveTab]     = useState<"story" | "demo">("story");
  const SECTIONS = makeSections(isHe);

  const messiBot   = useRef<HTMLDivElement>(null);
  const ronaldoBot = useRef<HTMLDivElement>(null);
  const serverBot  = useRef<HTMLDivElement>(null);
  const tosRef     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const eventsRef  = useRef<typeof AF_EVENTS>([]);

  useEffect(() => { const p = messiBot.current?.parentElement;   if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight; }); }, [messiLines]);
  useEffect(() => { const p = ronaldoBot.current?.parentElement; if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight; }); }, [ronaldoLines]);
  useEffect(() => { const p = serverBot.current?.parentElement;  if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight; }); }, [serverLines]);
  useEffect(() => () => { tosRef.current.forEach(clearTimeout); }, []);

  /* ── Playback engine ────────────────────────────────────────────────────── */
  function playScenario(id: StepId) {
    tosRef.current.forEach(clearTimeout);
    tosRef.current = [];
    eventsRef.current = [];
    setIsPlaying(true);
    setActiveStep(id);

    setMessiLines([{  type: "info", text: "bash — messi@stomp-client",               complete: true }]);
    setRonaldoLines([{ type: "info", text: "bash — ronaldo@stomp-client",             complete: true }]);
    setServerLines([{  type: "info", text: "Java Reactor :7777  |  Python SQL :7778", complete: true }]);

    const tos = tosRef.current;
    const T: Record<PanelId, number> = { messi: 200, ronaldo: 200, server: 200 };
    const set: Record<PanelId, React.Dispatch<React.SetStateAction<TerminalLine[]>>> = {
      messi:   setMessiLines,
      ronaldo: setRonaldoLines,
      server:  setServerLines,
    };

    function ln(panel: PanelId, type: LineType, text: string, extra = 0) {
      T[panel] += extra;
      const d = T[panel];
      tos.push(setTimeout(() => {
        set[panel](prev => [...prev, { type, text, complete: true }]);
      }, d));
      T[panel] += LINE_GAP;
    }

    function cmd(panel: PanelId, text: string, extra = 0) {
      T[panel] += extra;
      const t0   = T[panel];
      const full = PROMPT + text;
      tos.push(setTimeout(() => {
        set[panel](prev => [...prev, { type: "cmd", text: "", complete: false }]);
      }, t0));
      for (let c = 1; c <= full.length; c++) {
        const partial = full.slice(0, c);
        const done    = c === full.length;
        tos.push(setTimeout(() => {
          set[panel](prev => {
            const copy = [...prev];
            copy[copy.length - 1] = { type: "cmd", text: partial, complete: done };
            return copy;
          });
        }, t0 + c * CHAR_DELAY));
      }
      T[panel] = t0 + full.length * CHAR_DELAY + LINE_GAP;
    }

    function atLeast(panel: PanelId, t: number) { T[panel] = Math.max(T[panel], t); }

    /* ── Scenario 1: Boot ─────────────────────────────────────────────────── */
    if (id === "boot") {
      ln("server", "info",    "=== SPL STOMP System Start Sequence ===");
      cmd("server", "rm -f stomp_server.db", 100);
      ln("server", "success", "[Python] Stale database removed.");
      cmd("server", "python3 sql_server.py 7778 &", 80);
      ln("server", "output",  "[Python SQL :7778] Initialising schema: stomp_server.db");
      ln("server", "success", "[Python SQL :7778] Listening on port 7778 — Ready ✓");
      cmd("server", "mvn exec:java -Dexec.mainClass=\"bgu.spl.net.impl.stomp.StompServer\" -Dexec.args=\"7777 reactor\"", 200);
      ln("server", "output",  "[INFO] Scanning for projects...");
      ln("server", "output",  "[INFO] --- exec-maven-plugin:3.1.0:java (default-cli) ---");
      ln("server", "output",  "[INFO] BUILD SUCCESS");
      ln("server", "info",    "[Reactor] STOMP server up — port 7777  |  mode: REACTOR");
      ln("server", "success", "[Reactor] Thread pool ready. Awaiting connections...");
      ln("messi",  "output",  "(server is up — ready to connect)");
      ln("ronaldo","output",  "(server is up — ready to connect)");
    }

    /* ── Scenario 2: Login ────────────────────────────────────────────────── */
    if (id === "login") {
      ln("server", "info", "[Reactor] Selector loop active — accepting connections...");

      cmd("messi", "login 127.0.0.1:7777 messi pass123");
      const messiRefT = T.messi;

      const messiConnectFrame = buildFrame("SEND → CONNECT", [
        "accept-version:1.2",
        "host:stomp.cs.bgu.ac.il",
        "login:messi",
        "passcode:pass123",
      ], []);
      ln("messi", "frame-in", messiConnectFrame);

      cmd("ronaldo", "login 127.0.0.1:7777 ronaldo pass12", 200);
      const ronaldoRefT = T.ronaldo;

      const ronaldoConnectFrame = buildFrame("SEND → CONNECT", [
        "accept-version:1.2",
        "host:stomp.cs.bgu.ac.il",
        "login:ronaldo",
        "passcode:pass12",
      ], []);
      ln("ronaldo", "frame-in", ronaldoConnectFrame);

      atLeast("server", messiRefT - 100);
      ln("server", "info",    "[Reactor] New connection → Thread-1 assigned to: messi");
      ln("server", "info",    "[Thread-1] CONNECT messi ......... AUTH OK ✓");

      atLeast("messi", T.server);
      const messiConnectedFrame = buildFrame("RECV ← CONNECTED", [
        "version:1.2",
        "session:sess-messi-4f8a2c",
      ], []);
      ln("messi", "frame-in",  messiConnectedFrame);
      ln("messi", "success",   "Login successful — user: messi  |  session: 4f8a2c");

      atLeast("server", ronaldoRefT - 80);
      ln("server", "info",    "[Reactor] New connection → Thread-2 assigned to: ronaldo");
      ln("server", "info",    "[Thread-2] CONNECT ronaldo ....... AUTH OK ✓");

      atLeast("ronaldo", T.server);
      const ronaldoConnectedFrame = buildFrame("RECV ← CONNECTED", [
        "version:1.2",
        "session:sess-ronaldo-9d3b1a",
      ], []);
      ln("ronaldo", "frame-in",  ronaldoConnectedFrame);
      ln("ronaldo", "success",   "Login successful — user: ronaldo  |  session: 9d3b1a");
    }

    /* ── Scenario 3: Pub/Sub ──────────────────────────────────────────────── */
    if (id === "pubsub") {
      ln("messi",   "success", "CONNECTED — user: messi   |  session: 4f8a2c");
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  session: 9d3b1a");
      ln("server",  "info",    "[Thread-1] Client: messi   — authenticated ✓");
      ln("server",  "info",    "[Thread-2] Client: ronaldo — authenticated ✓");

      cmd("messi",   "join argentina_france", 150);
      const messiSubFrame = buildFrame("SEND → SUBSCRIBE", [
        "destination:/argentina_france",
        "id:sub-0",
        "receipt:r-001",
      ], []);
      ln("messi", "frame-in", messiSubFrame);

      cmd("ronaldo", "join argentina_france", 300);
      const ronaldoSubFrame = buildFrame("SEND → SUBSCRIBE", [
        "destination:/argentina_france",
        "id:sub-0",
        "receipt:r-001",
      ], []);
      ln("ronaldo", "frame-in", ronaldoSubFrame);

      const subEnd = Math.max(T.messi, T.ronaldo) + 100;
      atLeast("server",  subEnd);
      atLeast("messi",   subEnd);
      atLeast("ronaldo", subEnd);

      ln("server",  "info",    "[Thread-1] SUBSCRIBE /argentina_france  id:sub-0 (messi)");
      ln("server",  "info",    "[Thread-2] SUBSCRIBE /argentina_france  id:sub-0 (ronaldo)");
      ln("messi",   "success", "Joined channel: argentina_france ✓");
      ln("ronaldo", "success", "Joined channel: argentina_france ✓");

      cmd("messi", "report data/argentina_france_events.json", 300);
      ln("messi", "output", `Parsing argentina_france_events.json — ${AF_EVENTS.length} events`);

      const eventMeta = [
        { hdr: ["event_name:kickoff",  "time:0",    "active:true", "before_halftime:true"], body: ["description: Argentina vs France — 2022 FIFA World Cup Final"] },
        { hdr: ["event_name:goal!!!!", "time:2160", "team_a goals:2", "team_b goals:0"],    body: ["description: Di María fires Argentina ahead — 2:0!"] },
        { hdr: ["event_name:goal!!!!", "time:4800", "team_a goals:2", "team_b goals:1"],    body: ["description: Mbappé converts penalty — 2:1"] },
        { hdr: ["event_name:goal!!!!", "time:4860", "team_a goals:2", "team_b goals:2"],    body: ["description: Mbappé volleys in — 2:2. France level!"] },
      ];

      for (let i = 0; i < AF_EVENTS.length; i++) {
        const ev  = AF_EVENTS[i];
        const pad = ".".repeat(Math.max(2, 22 - ev.time.length - ev.type.length));
        ln("messi", "output", `  [${ev.time}]  ${ev.type} ${pad} publishing`);

        const publishedAt = T.messi - LINE_GAP;
        atLeast("server", publishedAt + 60);

        const sendFrame = buildFrame("SEND → server", [
          "destination:/argentina_france",
          `user:messi`,
          ...eventMeta[i].hdr,
        ], eventMeta[i].body);
        ln("server", "info",  `[Thread-1] SEND /argentina_france  event:${ev.type}`);
        ln("server", "frame-in", sendFrame);
        ln("server", "sql",   `[Python SQL :7778] INSERT INTO events row ${i + 1} — channel:argentina_france`);

        const storedAt = T.server - LINE_GAP;
        tos.push(setTimeout(() => { eventsRef.current.push(ev); }, storedAt));

        atLeast("ronaldo", T.server + 100);
        const msgFrame = buildFrame("RECV ← MESSAGE", [
          "subscription:sub-0",
          `message-id:msg-${String(i + 1).padStart(3, "0")}`,
          "destination:/argentina_france",
          ...eventMeta[i].hdr,
        ], eventMeta[i].body);
        ln("ronaldo", "frame-in", msgFrame);
      }

      atLeast("messi", Math.max(T.messi, T.server));
      ln("server", "sql",     "[Python SQL :7778] Committed. 4 rows — argentina_france");
      ln("server", "success", "[Reactor] Broadcast complete — 1 subscriber (ronaldo) notified ✓");
      atLeast("messi", T.server - LINE_GAP);
      ln("messi",  "success", `All ${AF_EVENTS.length} events published to argentina_france ✓`);
    }

    /* ── Scenario 4: Summary ──────────────────────────────────────────────── */
    if (id === "summary") {
      ln("messi",   "success", "CONNECTED — user: messi   |  subscribed: argentina_france");
      ln("ronaldo", "success", "CONNECTED — user: ronaldo |  subscribed: argentina_france");

      cmd("ronaldo", "summary argentina_france messi file.txt", 400);
      ln("ronaldo", "output", "Requesting summary from server...");

      atLeast("server", T.ronaldo - LINE_GAP - 80);
      ln("server", "info",    "[Thread-2] SUMMARY request — channel:argentina_france  user:messi");
      ln("server", "sql",     "[Python SQL :7778] SELECT * FROM events WHERE channel='argentina_france' AND user='messi'");
      const evSrc = eventsRef.current.length > 0 ? eventsRef.current : AF_EVENTS;
      ln("server", "sql",     `[Python SQL :7778] Fetched ${evSrc.length} rows — computing stats...`);
      ln("server", "success", "[Thread-2] SUMMARY payload → dispatching to ronaldo");

      atLeast("ronaldo", T.server + 100);
      const summaryLines: { type: LineType; text: string }[] = [
        { type: "info",    text: "─────────────────────────────────────────────────" },
        { type: "output",  text: "Argentina vs France" },
        { type: "info",    text: "General stats:" },
        { type: "output",  text: "  active:          true" },
        { type: "output",  text: "  before_halftime: 1 event" },
        { type: "output",  text: "  total_goals:     4  (ARG 3, FRA 3 — penalties)" },
        { type: "info",    text: "Argentina stats:" },
        { type: "output",  text: "  goals_scored:    3  (Messi ×2 pen, Di María ×1)" },
        { type: "output",  text: "  possession:      55%" },
        { type: "info",    text: "France stats:" },
        { type: "output",  text: "  goals_scored:    3  (Mbappé ×3)" },
        { type: "output",  text: "  possession:      45%" },
        { type: "info",    text: "Game event reports (reporter: messi):" },
        { type: "output",  text: "  0:00   kickoff  — Argentina vs France — 2022 FIFA World Cup Final" },
        { type: "output",  text: "  36:00  goal!!!! — Di María fires Argentina ahead — 2:0!" },
        { type: "output",  text: "  80:00  goal!!!! — Mbappé converts penalty — 2:1" },
        { type: "output",  text: "  81:00  goal!!!! — Mbappé volleys in — 2:2. France level!" },
        { type: "info",    text: "─────────────────────────────────────────────────" },
        { type: "success", text: "FINAL (AET): Argentina 3 — 3 France  |  ARG win on penalties ✓" },
      ];
      for (const sl of summaryLines) {
        ln("ronaldo", sl.type, sl.text);
      }
      ln("ronaldo", "success", "Summary written → file.txt ✓");
    }

    /* ── Scenario 5: Logout ───────────────────────────────────────────────── */
    if (id === "logout") {
      ln("messi",  "success", "CONNECTED — user: messi");
      ln("ronaldo","success", "CONNECTED — user: ronaldo");
      ln("server", "info",   "[Thread-1] messi   — active connection");
      ln("server", "info",   "[Thread-2] ronaldo — active connection");

      cmd("messi", "logout");
      const messiDisconFrame = buildFrame("SEND → DISCONNECT", [
        "receipt:r-113",
      ], []);
      ln("messi", "frame-in", messiDisconFrame);
      ln("messi", "output",   "[Keyboard thread] DISCONNECT sent — cv.wait() blocking...");

      atLeast("server", T.messi - LINE_GAP - 80);
      ln("server", "info",    "[Thread-1] DISCONNECT messi → dispatching RECEIPT:r-113");

      atLeast("messi", T.server);
      const messiReceiptFrame = buildFrame("RECV ← RECEIPT", [
        "receipt-id:r-113",
      ], []);
      ln("messi", "frame-in", messiReceiptFrame);
      ln("messi", "success",  "RECEIPT received — receipt-id: r-113");
      ln("messi", "output",   "[Socket thread]   receiptReceived = true → cv.notify_one()");
      ln("messi", "output",   "[Keyboard thread] CV unblocked → close(sockfd)");
      ln("messi", "output",   "[Socket thread]   recv() = 0 (EOF) → thread exiting");
      ln("messi", "success",  "Socket closed. Both threads joined cleanly. ✓");

      cmd("ronaldo", "logout", 200);
      const ronaldoDisconFrame = buildFrame("SEND → DISCONNECT", [
        "receipt:r-114",
      ], []);
      ln("ronaldo", "frame-in", ronaldoDisconFrame);
      ln("ronaldo", "output",   "[Keyboard thread] DISCONNECT sent — cv.wait() blocking...");

      atLeast("server", T.ronaldo - LINE_GAP - 80);
      ln("server", "info",    "[Thread-2] DISCONNECT ronaldo → dispatching RECEIPT:r-114");
      ln("server", "output",  "[Reactor] All clients disconnected — selector loop idle.");

      atLeast("ronaldo", T.server);
      const ronaldoReceiptFrame = buildFrame("RECV ← RECEIPT", [
        "receipt-id:r-114",
      ], []);
      ln("ronaldo", "frame-in", ronaldoReceiptFrame);
      ln("ronaldo", "success",  "RECEIPT received — receipt-id: r-114");
      ln("ronaldo", "output",   "[Socket thread]   receiptReceived = true → cv.notify_one()");
      ln("ronaldo", "output",   "[Keyboard thread] CV unblocked → close(sockfd)");
      ln("ronaldo", "output",   "[Socket thread]   recv() = 0 (EOF) → thread exiting");
      ln("ronaldo", "success",  "Socket closed. Both threads joined cleanly. ✓");
    }

    const maxT = Math.max(T.messi, T.ronaldo, T.server) + 400;
    tos.push(setTimeout(() => setIsPlaying(false), maxT));
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */
  const storyVisible  = activeTab === "story";
  const demoVisible   = activeTab === "demo";

  return (
    <section id="spl" className="spl-root">
      <StyleInjector />
      <div aria-hidden className="spl-bg-orb" />

      <div className="spl-inner">
        {/* Section header */}
        <div className="spl-header">
          <span className="spl-header-badge">
            <span className="spl-header-dot" />
            {isHe ? "BGU SPL Systems Programming — אפליקציית דיווחי מונדיאל 2022" : "BGU SPL Systems Programming — World Cup 2022 Informer"}
          </span>
          <h2 className="spl-title">
            {isHe ? <>מערכת STOMP <span className="spl-title-em">מבוזרת</span> (Distributed STOMP System)</> : <>A <span className="spl-title-em">Distributed</span> STOMP System</>}
          </h2>
          <p className="spl-subtitle">
            {isHe
              ? "שרת Java מבוסס Reactor · גישור ל-SQLite ב-Python · קליינט C++ מרובה תהליכונים (Multithreaded) · פרוטוקול STOMP 1.2 מותאם אישית מעל TCP. חמש החלטות הנדסיות שעיצבו את המימוש — לחצו על הכפתורים כדי לראות את תעבורת הפרוטוקול בלייב."
              : "Java Reactor server · Python SQLite bridge · C++ multithreaded client · Custom STOMP 1.2 protocol over TCP. Five engineering decisions that shaped the implementation — click any button to watch the live protocol exchange."}
          </p>
          <p className="spl-subtitle" style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem" }}>
            {isHe ? "* הדמו מכיל סימולציה — האינטראקציות משקפות את זרימת הפרוטוקול האמיתית." : "Simulated demo — interactions reflect the real protocol flow."}
          </p>
        </div>

        {/* Project context */}
        <div className="spl-context" dir={isHe ? "rtl" : undefined}>
          <div className="spl-context-card">
            <div className="spl-context-card-label">{isHe ? "מה המערכת עושה?" : "What it does"}</div>
            <div className="spl-context-card-body">
              {isHe ? (<>מערכת <strong>Pub/Sub בזמן אמת</strong> לאירועי משחקי כדורגל. כתבים מעלים קבצי JSON של אירועי משחק לערוץ ייעודי (למשל: <code style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4cc7b8" }}>argentina_france</code>). כל קליינט שמנוי לערוץ מקבל באופן מיידי MESSAGE frame על כל אירוע — שערים, בעיטות פתיחה, חילופים — ברגע שהם מפורסמים.</>) : (<>A <strong>real-time pub/sub event system</strong> for football matches. Reporters upload game event JSON files to a named channel (e.g. <code style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4cc7b8" }}>argentina_france</code>). Every subscribed client instantly receives a MESSAGE frame per event — scores, kickoffs, substitutions — as they are published.</>)}
            </div>
          </div>
          <div className="spl-context-card">
            <div className="spl-context-card-label">{isHe ? "מי משתמש בזה?" : "Who uses it"}</div>
            <div className="spl-context-card-body">
              {isHe ? (<>שני סוגי משתמשים (Roles) חולקים את אותו השרת. <strong>כתב (Reporter)</strong> מתחבר, נרשם לערוץ, ומעלה קובץ אירועים. <strong>מנוי (Subscriber)</strong> מתחבר ונרשם כדי לקבל עדכונים בלייב. כל קליינט יכול לקרוא לפקודת <code style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4cc7b8" }}>summary</code> כדי לקבל נתונים סטטיסטיים מרוכזים עבור כל כתב, בכל ערוץ.</>) : (<>Two user roles share the same server. A <strong>reporter</strong> connects, subscribes to a channel, and uploads an event file. A <strong>subscriber</strong> connects and subscribes to receive live updates. Any client can call <code style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4cc7b8" }}> summary</code> to get aggregated stats for any reporter on any channel.</>)}
            </div>
          </div>
          <div className="spl-context-card">
            <div className="spl-context-card-label">{isHe ? "למה STOMP?" : "Why STOMP"}</div>
            <div className="spl-context-card-body">
              {isHe ? (<>פרוטוקול STOMP 1.2 מספק <strong>ארכיטקטורת Pub/Sub מבוססת-ערוצים מעל TCP גולמי</strong> עם פורמט Frames טקסטואלי סטנדרטי — CONNECT, SUBSCRIBE, SEND, MESSAGE, DISCONNECT. מנגנון לחיצת-יד ה-<strong>RECEIPT</strong> מבטיח שכל ה-Frames עובדו במלואם לפני שהקליינט מתנתק, מה שמאפשר Teardown נקי ואמין ללא Polling ברמת האפליקציה.</>) : (<>STOMP 1.2 provides <strong>channel-based pub/sub over raw TCP</strong> with a standardized text frame format — CONNECT, SUBSCRIBE, SEND, MESSAGE, DISCONNECT. Its <strong>RECEIPT handshake</strong> guarantees all frames are processed before a client disconnects, making clean teardown reliable without application-level polling.</>)}
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="spl-tabs">
          <button
            className={`spl-tab${activeTab === "story" ? " spl-tab--active" : " spl-tab--inactive"}`}
            onClick={() => setActiveTab("story")}
          >
            {isHe ? "📖 סיפור הנדסי" : "📖 Engineering Story"}
          </button>
          <button
            className={`spl-tab${activeTab === "demo" ? " spl-tab--active" : " spl-tab--inactive"}`}
            onClick={() => setActiveTab("demo")}
          >
            {isHe ? "⚡ טרמינל חי" : "⚡ Live Terminal"}
          </button>
        </div>

        {/* Split pane */}
        <div className="spl-split" dir={isHe ? "rtl" : undefined}>
          {/* Story panel — right in RTL, left in LTR */}
          <div
            className="spl-story"
            style={{ display: storyVisible ? undefined : "none" }}
          >
            {SECTIONS.map(section => (
              <StorySection
                key={section.stepId}
                section={section}
                isActive={activeStep === section.stepId}
                isPlaying={isPlaying}
                onTrigger={() => playScenario(section.stepId)}
                isHe={isHe}
              />
            ))}
          </div>

          {/* Terminal panel — left in RTL; keep dir=ltr so code stays L→R */}
          <div
            className="spl-terminal"
            dir="ltr"
            style={{ display: demoVisible ? undefined : "none" }}
          >
            <TerminalPanel
              title="bash — messi"
              subtitle="@stomp-client  [keyboard-thread + socket-thread]"
              lines={messiLines}
              bottomRef={messiBot}
            />
            <TerminalPanel
              title="bash — ronaldo"
              subtitle="@stomp-client  [keyboard-thread + socket-thread]"
              lines={ronaldoLines}
              bottomRef={ronaldoBot}
            />
            <TerminalPanel
              title="bash — StompServer"
              subtitle=":7777 (JavaReactor)  |  Python SQL :7778"
              lines={serverLines}
              bottomRef={serverBot}
            />

            {/* Legend removed */}
          </div>
        </div>
      </div>
    </section>
  );
}
