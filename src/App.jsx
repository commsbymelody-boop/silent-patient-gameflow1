import React, { useEffect, useMemo, useState } from "react";

/* ---------------- Utilities ---------------- */
const fmt = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};
const P = (label) =>
  `https://placehold.co/960x540?text=${encodeURIComponent(label)}`;

/* ---------------- Data ---------------- */
const PHASES = [
  // 0 — Landing
  {
    id: 0,
    title: "The Silent Patient",
    body:
      "by Alex Michaelides\n\nAbout the Author — Alex Michaelides is a bestselling British Cypriot author and screenwriter.\nNo-Spoiler Summary — A psychological thriller about Alicia Berenson and Theo Faber.",
  },
  // 1
  {
    id: 1,
    title: "Phase 1: Public Narrative & Official Records",
    body: "Select a file to review.",
    evidences: [
      { id: "news", title: "News Article", images: [P("NEWS-ARTICLE")], caption: "Report on Gabriel Berenson’s death." },
      { id: "police", title: "Police Report", images: [P("POLICE-REPORT")], caption: "Official incident report." },
      { id: "thread", title: "Public Thread", images: [P("PUBLIC-THREAD")], caption: "Online speculation." },
    ],
    puzzle: {
      id: "p1",
      title: "Puzzle — Hidden Keyword",
      prompt: "What is so fragile that saying its name breaks it?",
      answer: ["silence"],
      type: "input",
    },
  },
  // 2
  {
    id: 2,
    title: "Phase 2: Internal Accounts & First Contact",
    body: "Select a file to review.",
    evidences: [
      { id: "anon1", title: "Anonymous Entry (MorpheusMind)", images: [P("ANON-ENTRY-1")], caption: "Unsigned note about Alicia & The Grove." },
      { id: "s1", title: "Session Report #1", images: [P("SESSION-1"), P("SESSION-1-2")], caption: "Initial contact & goals." },
      { id: "c1", title: "Case Report #1", images: [P("CASE-1"), P("CASE-1-2"), P("CASE-1-3")], caption: "Staff boundaries & operations." },
    ],
    autoContinueTo: 3,
    transitionText: "Opening interviews and diary records.",
  },
  // 3
  {
    id: 3,
    title: "Phase 3: Interviews & Diary Records",
    body: "Select a file to review.",
    evidences: [
      { id: "d1", title: "Diary #1 (July 22–26)", images: [P("DIARY-1")], caption: "Personal entries; emotional state." },
      { id: "max", title: "Case File #1: Max", images: [P("CASEFILE-1"), P("CASEFILE-1-2")], caption: "Brother-in-law interview." },
      { id: "paul", title: "Case File #2: Paul", images: [P("CASEFILE-2"), P("CASEFILE-2-2")], caption: "Reluctant interview attempt." },
      { id: "jf", title: "Case File #3: Jean-Felix", images: [P("CASEFILE-3"), P("CASEFILE-3-2")], caption: "Accounts of Alicia’s work." },
      { id: "anon2", title: "Anonymous Entry", images: [P("ANON-ENTRY-2")], caption: "Infidelity & surveillance." },
    ],
    puzzle: {
      id: "p3",
      title: "Puzzle — Logic Riddle",
      prompt:
        "I am a three-digit number.\nMy tens digit is five more than my ones digit.\nMy hundreds digit is eight less than my tens digit.\nWhat number am I?",
      answer: ["194"],
      type: "input",
    },
  },
  // 4
  {
    id: 4,
    title: "Phase 4: New Responses & Observation",
    body: "Select a file to review.",
    evidences: [
      { id: "s2", title: "Session Report #2", images: [P("SESSION-2"), P("SESSION-2-2")], caption: "Nonverbal painting response." },
      { id: "case2", title: "Case Report #2", images: [P("CASE-2")], caption: "Neighbor Barbie mentions a photo." },
      { id: "photo", title: "Photograph of Alleged Stalker", images: [P("EVIDENCE-2")], caption: "Alicia’s photograph." },
    ],
    puzzle: {
      id: "p4",
      title: "Puzzle — Anagram",
      prompt: "Unscramble the letters: THRUT",
      answer: ["truth"],
      type: "input",
    },
  },
  // 5
  {
    id: 5,
    title: "Phase 5: Major Breakthroughs",
    body: "Select a file to review.",
    evidences: [
      { id: "s3", title: "Session Report #3", images: [P("SESSION-3")], caption: "Alicia gives Theo her diary." },
      { id: "d2", title: "Diary #2 (4 pages)", images: [P("DIARY-2"), P("DIARY-2-2"), P("DIARY-2-3"), P("DIARY-2-4")], caption: "Build-up to the event." },
      { id: "s4", title: "Session Report #4", images: [P("SESSION-4")], caption: "Alicia speaks." },
      { id: "s5", title: "Session Report #5", images: [P("SESSION-5")], caption: "Dialogue continues." },
      { id: "s6", title: "Session Report #6", images: [P("SESSION-6")], caption: "Dialogue continues." },
      { id: "s7", title: "Session Report #7", images: [P("SESSION-7")], caption: "Dialogue continues." },
      { id: "s8", title: "Session Report #8", images: [P("SESSION-8")], caption: "Dialogue concludes." },
    ],
    puzzle: {
      id: "p5",
      title: "Puzzle — Sequence",
      prompt: "2, 6, 12, 20, 30, _ ?",
      answer: ["42"],
      type: "input",
    },
  },
  // 6
  {
    id: 6,
    title: "Phase 6: Contradictions & Reclassification",
    body: "Select a file to review.",
    evidences: [
      { id: "ex1", title: "Exhibit #1", images: [P("EXHIBIT-1")], caption: "Denial of stalker." },
      { id: "ex2", title: "Exhibit #2", images: [P("EXHIBIT-2")], caption: "Overdose → homicide reclassification." },
      { id: "ex3", title: "Exhibit #3", images: [P("EXHIBIT-3")], caption: "Inconsistent movement logs." },
      { id: "anon3", title: "Anonymous Entry #3", images: [P("ANON-ENTRY-3")], caption: "Admits stalking spouse." },
    ],
    puzzle: {
      id: "p6",
      title: "Puzzle — Morse",
      prompt: "Decode: — —. ..- .. .-.. -",
      answer: ["guilt"],
      type: "input",
    },
  },
  // 7
  {
    id: 7,
    title: "Phase 7: Grand Reveal & Verdict",
    evidences: [
      { id: "anon4", title: "Anonymous Entry #4", images: [P("ANON-ENTRY-4")], caption: "Entering Alicia’s home." },
      { id: "last", title: "Last Diary (4 pages)", images: [P("LAST-DIARY"), P("LAST-DIARY-2"), P("LAST-DIARY-3"), P("LAST-DIARY-4")], caption: "Final confession." },
    ],
    puzzle: {
      id: "p7",
      title: "Puzzle — Identity Check",
      prompt: "Who fits this: Psychotherapist, The Grove, cheating spouse?",
      options: ["Alicia", "Theo", "Jean-Felix", "Max"],
      answer: ["theo", "theo faber", "theo."],
      type: "mcq",
    },
  },
];

const POST_GAME = [
  { id: "pg1", title: "Case Closed", text: "You’ve reviewed all evidence and reached a verdict." },
  { id: "pg2", title: "Book Plot Explanation", text: "(Add your spoiler-safe summary.)" },
  { id: "pg3", title: "Lesson Learned", text: "Reflections on silence, trauma, and obsession." },
  { id: "pg4", title: "My Book & I", text: "Small photo + caption." },
  { id: "pg5", title: "Game Over — Thank you for playing.", text: "" },
];

/* ---------------- Reusable UI (inline styles) ---------------- */
const S = {
  page: (bg) => ({
  minHeight: "100vh",
  background: bg
   ? "#f6f7fb url(\"" + bg + "\") center/cover no-repeat fixed"
   : "#f6f7fb",
}),

  container: { maxWidth: 1040, margin: "0 auto", padding: 16 },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(255,255,255,0.95)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    backdropFilter: "blur(6px)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    gap: 12,
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid2Auto: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  btn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #999",
    background: "#fff",
    color: "#111",
    cursor: "pointer",
  },
  placeholderBox: {
    height: 0,
    paddingBottom: "56.25%",
    background: "#eef0f3",
    borderRadius: 10,
    marginBottom: 8,
  },
};

/* ---------------- Lightbox ---------------- */
function Lightbox({ open, onClose, evidence }) {
  const [i, setI] = useState(0);
  useEffect(() => { if (open) setI(0); }, [open]);
  if (!open || !evidence) return null;
  const prev = i > 0, next = i < evidence.images.length - 1;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div style={{ ...S.card, maxWidth: 900, width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>{evidence.title}</div>
          <button style={S.btnGhost} onClick={onClose}>Close</button>
        </div>
        <img src={evidence.images[i]} alt={evidence.title} style={{ width: "100%", borderRadius: 10 }} />
        <p style={{ fontSize: 14, color: "#333" }}>{evidence.caption}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <button style={{ ...S.btnGhost, opacity: prev ? 1 : 0.4 }} disabled={!prev} onClick={() => setI((v) => Math.max(0, v - 1))}>Prev</button>
          <div style={{ fontSize: 12, color: "#666" }}>{i + 1} / {evidence.images.length}</div>
          <button style={{ ...S.btnGhost, opacity: next ? 1 : 0.4 }} disabled={!next} onClick={() => setI((v) => Math.min(evidence.images.length - 1, v + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Puzzle ---------------- */
function Puzzle({ puzzle, onDone }) {
  const [input, setInput] = useState("");
  const [sel, setSel] = useState("");
  const [state, setState] = useState("idle");
  if (!puzzle) return null;

  const ok =
    puzzle.type === "mcq"
      ? (puzzle.answer || []).some(
          (a) => a.trim().toLowerCase() === sel.trim().toLowerCase()
        )
      : (puzzle.answer || []).some(
          (a) => a.trim().toLowerCase() === input.trim().toLowerCase()
        );

  const submit = () => {
    const good = ok;
    setState(good ? "correct" : "wrong");
    if (good) onDone("correct");
  };
  const skip = () => {
    setState("skipped");
    onDone("skip");
  };

  return (
    <div style={S.card}>
      <div style={{ fontWeight: 700 }}>{puzzle.title}</div>
      <p style={{ whiteSpace: "pre-wrap" }}>{puzzle.prompt}</p>

      {puzzle.type === "mcq" ? (
        <div style={{ display: "grid", gap: 8 }}>
          {(puzzle.options || []).map((o) => (
            <label key={o} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name={puzzle.id} value={o} onChange={() => setSel(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #bbb" }}
        />
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button style={S.btn} onClick={submit}>Submit</button>
        <button style={S.btnGhost} onClick={skip}>Skip</button>
      </div>

      {state === "correct" && <div style={{ color: "#1a7f37", marginTop: 6 }}>Answer accepted. Proceeding…</div>}
      {state === "skipped" && <div style={{ color: "#333", marginTop: 6 }}>Skipped. Continuing…</div>}
      {state === "wrong" && <div style={{ color: "#c00", marginTop: 6 }}>Incorrect. Try again or Skip.</div>}
    </div>
  );
}

/* ---------------- Main App ---------------- */
export default function App() {
  const TOTAL = 7;
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(48 * 60);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbEvidence, setLbEvidence] = useState(null);
  const [post, setPost] = useState(0);

  const current = useMemo(() => PHASES.find((p) => p.id === phase), [phase]);

  // timer
  useEffect(() => {
    if (!started || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, seconds]);

  // time up → post game
  useEffect(() => {
    if (started && seconds <= 0) {
      setPhase(TOTAL + 1);
      setPost(0);
    }
  }, [seconds, started]);

  const start = () => { setStarted(true); setPhase(1); };
  const proceed = () => { if (phase < TOTAL) setPhase((p) => p + 1); else { setPhase(TOTAL + 1); setPost(0); } };
  const onPuzzle = (status) => { if (status === "correct" || status === "skip") setTimeout(proceed, 600); };
  const openEv = (e) => { setLbEvidence(e); setLbOpen(true); };

  const bgUrl = "/assets/background.jfif"; // put your file here; otherwise page uses plain color
  const pageStyle = S.page(bgUrl);

  return (
    <div style={pageStyle}>
      {/* Top bar */}
      <div style={S.header}>
        <div style={S.headerRow}>
          <div style={{ fontWeight: 700 }}>⏱ {fmt(seconds)}</div>
          {phase > 0 && <div>Phase {Math.min(phase, TOTAL)} / {TOTAL}</div>}
          <div style={{ opacity: 0.8 }}>Book Review • Detective Mode</div>
        </div>
      </div>

      <div style={S.container}>
        {/* Landing */}
        {phase === 0 && (
          <div style={S.grid2}>
            <div style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "3/4" }}>
              cover.jpg
            </div>
            <div style={S.card}>
              <h1 style={{ marginTop: 0 }}>{PHASES[0].title}</h1>
              <p><b>by Alex Michaelides</b></p>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{PHASES[0].body}</pre>
              <button style={S.btn} onClick={start}>Start Investigation</button>
            </div>
          </div>
        )}

        {/* Post-game */}
        {phase === TOTAL + 1 && (
          <div style={S.card}>
            <h2 style={{ marginTop: 0 }}>{POST_GAME[post]?.title}</h2>
            <p>{POST_GAME[post]?.text}</p>
            {post < POST_GAME.length - 1 && (
              <button style={S.btn} onClick={() => setPost((i) => i + 1)}>Continue</button>
            )}
          </div>
        )}

        {/* Phases 1..7 */}
        {phase > 0 && phase <= TOTAL && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={S.card}>
              <h2 style={{ marginTop: 0 }}>{current?.title}</h2>
              {current?.body && <p>{current.body}</p>}
            </div>

            {/* Evidence grid */}
            {current?.evidences?.length ? (
              <div style={S.card}>
                <div style={S.grid2Auto}>
                  {current.evidences.map((e) => (
                    <button
                      key={e.id}
                      style={{ ...S.card, textAlign: "left", cursor: "pointer" }}
                      onClick={() => openEv(e)}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{e.title}</div>
                      <div style={S.placeholderBox} />
                      <div style={{ fontSize: 14, color: "#333" }}>{e.caption}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Puzzle or auto-continue */}
            {current?.puzzle ? (
              <Puzzle puzzle={current.puzzle} onDone={onPuzzle} />
            ) : current?.autoContinueTo ? (
              <div style={S.card}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Proceed</div>
                <p>{current.transitionText || "Proceeding."}</p>
                <button style={S.btn} onClick={() => setPhase(current.autoContinueTo)}>Continue</button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Evidence Lightbox */}
      <Lightbox open={lbOpen} onClose={() => setLbOpen(false)} evidence={lbEvidence} />
    </div>
  );
}
