// World Cup Intelligence System — pre-recorded terminal scenarios
// Serves as the data layer for /api/terminal/[scenario]

export type LineType = "cmd" | "output" | "error" | "success" | "info";

export interface ScenarioStep {
  type: LineType;
  text: string;
}

export interface ScenarioData {
  id: string;
  label: string;
  description: string;
  steps: ScenarioStep[];
}

export const SCENARIO_DATA: ScenarioData[] = [
  /* ── 1. Init Stack ──────────────────────────────────────────────────────── */
  {
    id: "init-stack",
    label: "Init Stack",
    description: "Start Python SQL server (7778) + Java STOMP server (7777 TPC)",
    steps: [
      { type: "cmd",     text: "cd data && rm -f stomp_server.db" },
      { type: "success", text: "Removed stale database." },
      { type: "cmd",     text: "python3 sql_server.py 7778 &" },
      { type: "output",  text: "[STOMP_PYTHON_SQL_SERVER] Database initialized: stomp_server.db" },
      { type: "success", text: "[STOMP_PYTHON_SQL_SERVER] Server started on 127.0.0.1:7778" },
      { type: "cmd",     text: "cd ../server" },
      { type: "cmd",     text: "mvn exec:java -Dexec.mainClass=\"bgu.spl.net.impl.stomp.StompServer\" -Dexec.args=\"7777 tpc\"" },
      { type: "output",  text: "[INFO] Scanning for projects..." },
      { type: "output",  text: "[INFO] --- exec-maven-plugin:3.1.0:java (default-cli) ---" },
      { type: "output",  text: "[INFO] BUILD SUCCESS" },
      { type: "output",  text: "Server started" },
      { type: "success", text: "STOMP server online — port 7777  |  mode: TPC (thread-per-client)" },
    ],
  },

  /* ── 2. Match Session ───────────────────────────────────────────────────── */
  {
    id: "match-session",
    label: "Match Session",
    description: "Compile C++ client → login → subscribe → report 8 live events (Germany vs Japan)",
    steps: [
      { type: "cmd",    text: "cd client && make StompWCIClient" },
      { type: "output", text: "g++ -std=c++17 -pthread -o ./bin/StompWCIClient src/ConnectionHandler.cpp src/Frame.cpp src/event.cpp src/StompProtocol.cpp src/StompClient.cpp" },
      { type: "success",text: "Build complete: ./bin/StompWCIClient" },
      { type: "cmd",    text: "./bin/StompWCIClient" },
      { type: "output", text: "STOMP World Cup Intelligence Client v1.0" },
      { type: "cmd",    text: "login 127.0.0.1:7777 messi pass123" },
      { type: "success",text: "CONNECTED — user: messi  |  session-id: 4f8a2c" },
      { type: "cmd",    text: "join Germany_Japan" },
      { type: "output", text: "SUBSCRIBE /topic/Germany_Japan  id:sub-0" },
      { type: "success",text: "Subscribed to channel: Germany_Japan" },
      { type: "cmd",    text: "report client/data/events1.json" },
      { type: "output", text: "Parsing events1.json — Germany vs Japan — 8 events" },
      { type: "output", text: "  [ 0:00]  kickoff ..................... publishing" },
      { type: "output", text: "  [33:00]  goal!!!! .................... publishing  ← Germany 1:0" },
      { type: "output", text: "  [49:00]  Another goal!!!! ............. publishing  (VAR pending)" },
      { type: "output", text: "  [50:00]  No goal ...................... publishing  ← VAR overrules" },
      { type: "output", text: "  [51:00]  halftime .................... publishing  ← Germany 1:0" },
      { type: "output", text: "  [75:00]  goalgoalgoalgoalgoal!!! ..... publishing  ← Japan 1:1" },
      { type: "output", text: "  [83:00]  goalgoalgoalgoalgoal!!! ..... publishing  ← Japan 2:1" },
      { type: "output", text: "  [90:00]  final whistle ............... publishing" },
      { type: "success",text: "All 8 events published to Germany_Japan ✓" },
      { type: "cmd",    text: "summary Germany_Japan messi game_summary.txt" },
      { type: "success",text: "Summary written → game_summary.txt" },
      { type: "cmd",    text: "logout" },
      { type: "output", text: "DISCONNECT sent. Bye, messi." },
    ],
  },

  /* ── 3. Game Summary ────────────────────────────────────────────────────── */
  {
    id: "game-summary",
    label: "Game Summary",
    description: "Read the generated game summary file (actual match data)",
    steps: [
      { type: "cmd",    text: "cat game_summary.txt" },
      { type: "info",   text: "─────────────────────────────────────────────" },
      { type: "output", text: "Germany vs Japan" },
      { type: "output", text: "Game stats:" },
      { type: "output", text: "General stats:" },
      { type: "output", text: "  active: false" },
      { type: "output", text: "  before halftime: false" },
      { type: "output", text: "Germany stats:" },
      { type: "output", text: "  goals: 1" },
      { type: "output", text: "  possession: 51%" },
      { type: "output", text: "Japan stats:" },
      { type: "output", text: "  goals: 2" },
      { type: "output", text: "  possession: 49%" },
      { type: "output", text: "Game event reports:" },
      { type: "output", text: "  0 - kickoff:" },
      { type: "output", text: "    The game has started! What an exciting evening!" },
      { type: "output", text: "  1980 - goal!!!!:" },
      { type: "output", text: "    GOOOAAALLL!!! Germany lead!!! Gundogan slots it into the corner — Germany 1:0" },
      { type: "output", text: "  4500 - goalgoalgoalgoalgoal!!!:" },
      { type: "success",text: "    GOOOOAAAALLLL!!!!! Japan have parity!!! Doan smashes it in — 1:1" },
      { type: "output", text: "  4980 - goalgoalgoalgoalgoal!!!:" },
      { type: "success",text: "    GOOOOOOAAAAALLLL!!!! Asano from the tightest angle — Japan 2:1 !!!" },
      { type: "output", text: "  5400 - final whistle:" },
      { type: "output", text: "    Germany sit bottom of Group E. Japan top with one win from one." },
      { type: "info",   text: "─────────────────────────────────────────────" },
      { type: "success",text: "FINAL: Germany 1 — 2 Japan  (World Cup 2022, Group E)" },
    ],
  },
];

/** Lookup helper used by the API route */
export function getScenario(id: string): ScenarioData | undefined {
  return SCENARIO_DATA.find(s => s.id === id);
}
