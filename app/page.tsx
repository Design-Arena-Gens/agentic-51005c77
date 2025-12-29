"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

const sportOptions = [
  "NFL",
  "NBA",
  "MLB",
  "NHL",
  "NCAA Football",
  "NCAA Basketball",
  "Soccer",
  "UFC",
  "Tennis",
  "eSports"
];

const voiceOptions = [
  { id: "pro", label: "Professional analyst" },
  { id: "sharp", label: "Sharp bettor" },
  { id: "math", label: "Quant-heavy" },
  { id: "casual", label: "Casual explanation" },
  { id: "hype", label: "High-energy hype" }
];

const focusOptions = [
  { id: "lineMovement", label: "Line movement" },
  { id: "matchups", label: "Matchup edges" },
  { id: "injuries", label: "Injuries & rest" },
  { id: "models", label: "Model projections" },
  { id: "trends", label: "Historical trends" },
  { id: "bankroll", label: "Bankroll strategy" },
  { id: "betTypes", label: "Alternative market ideas" }
];

const constraints = [
  "Reference sharp sportsbook odds only",
  "Quantify confidence with implied probability",
  "Flag if wager exceeds bankroll guidelines",
  "Highlight correlated markets to avoid",
  "Keep answer under 250 words"
];

export default function Page() {
  const [sport, setSport] = useState("NFL");
  const [event, setEvent] = useState("");
  const [matchup, setMatchup] = useState("");
  const [market, setMarket] = useState("Spread");
  const [bankroll, setBankroll] = useState("2.5");
  const [risk, setRisk] = useState("Balanced");
  const [voice, setVoice] = useState("pro");
  const [focus, setFocus] = useState<string[]>(["lineMovement", "matchups"]);
  const [note, setNote] = useState("");
  const [customConstraint, setCustomConstraint] = useState("");
  const [includeConstraints, setIncludeConstraints] = useState<string[]>([constraints[0]]);
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    const focusLabels = focus
      .map((id) => focusOptions.find((opt) => opt.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const voiceLabel = voiceOptions.find((opt) => opt.id === voice)?.label ?? "Professional analyst";

    const details: string[] = [
      `Sport: ${sport}`,
      event ? `Event: ${event}` : undefined,
      matchup ? `Matchup: ${matchup}` : undefined,
      `Primary market: ${market}`,
      `Bankroll exposure target: ${bankroll}% per wager`,
      `Risk tolerance: ${risk}`,
      focusLabels ? `Analytical focus: ${focusLabels}` : undefined
    ].filter(Boolean) as string[];

    const constraintList = [...includeConstraints];
    if (customConstraint.trim()) {
      constraintList.push(customConstraint.trim());
    }

    return [
      `You are a ${voiceLabel} crafting a high-leverage betting plan.`,
      "Study the upcoming opportunity and produce a sharp, disciplined prompt for an AI betting assistant.",
      "\nContext:",
      details.map((item) => `- ${item}`).join("\n"),
      note.trim() ? `\nExtra context: ${note.trim()}` : "",
      constraintList.length
        ? `\nConstraints:\n${constraintList.map((item) => `- ${item}`).join("\n")}`
        : "",
      "\nDeliverable:\n- One detailed system prompt ready for copy/paste\n- Include call-to-action for value hunting and risk checks\n- Close with bankroll reminder"
    ]
      .filter(Boolean)
      .join("\n");
  }, [sport, event, matchup, market, bankroll, risk, voice, focus, includeConstraints, customConstraint, note]);

  const toggleFocus = (id: string) => {
    setFocus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleConstraint = (value: string) => {
    setIncludeConstraints((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <main className="min-h-screen px-6 pb-24 pt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/6 via-white/4 to-white/6 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Betting Prompt Architect</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Define the market, exposure, and analytical angles. Get a polished system prompt to feed into your favorite betting agent without leaking bankroll discipline.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_minmax(280px,0.85fr)]">
          <div className="flex flex-col gap-6">
            <Card title="Market Blueprint">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sport" htmlFor="sport">
                  <select
                    id="sport"
                    value={sport}
                    onChange={(event) => setSport(event.target.value)}
                  >
                    {sportOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Primary market" htmlFor="market">
                  <input
                    id="market"
                    type="text"
                    value={market}
                    onChange={(event) => setMarket(event.target.value)}
                    placeholder="Spread, total, player prop"
                  />
                </Field>

                <Field label="Event name" htmlFor="event">
                  <input
                    id="event"
                    type="text"
                    value={event}
                    onChange={(event) => setEvent(event.target.value)}
                    placeholder="Championship Sunday, UFC 310, etc."
                  />
                </Field>

                <Field label="Matchup / participants" htmlFor="matchup">
                  <input
                    id="matchup"
                    type="text"
                    value={matchup}
                    onChange={(event) => setMatchup(event.target.value)}
                    placeholder="Bills @ Chiefs"
                  />
                </Field>

                <Field label="Exposure target (%)" htmlFor="bankroll">
                  <input
                    id="bankroll"
                    type="number"
                    min="0.25"
                    max="10"
                    step="0.25"
                    value={bankroll}
                    onChange={(event) => setBankroll(event.target.value)}
                  />
                </Field>

                <Field label="Risk posture" htmlFor="risk">
                  <select
                    id="risk"
                    value={risk}
                    onChange={(event) => setRisk(event.target.value)}
                  >
                    <option>Conservative</option>
                    <option>Balanced</option>
                    <option>Aggressive</option>
                    <option>High-variance</option>
                  </select>
                </Field>
              </div>
            </Card>

            <Card title="Focus toggles" subtitle="Dial in which edges the agent should surface first.">
              <div className="flex flex-wrap gap-2">
                {focusOptions.map((option) => {
                  const active = focus.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleFocus(option.id)}
                      className={clsx(
                        "rounded-full border px-4 py-2 text-sm transition",
                        active
                          ? "border-[var(--accent-strong)] bg-[var(--accent)]/20 text-[var(--accent-strong)] shadow-[var(--shadow-glow)]"
                          : "border-white/15 bg-white/5 text-[var(--text-muted)] hover:border-[var(--accent)]/60 hover:text-[var(--accent-strong)]"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Voice & nuance">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Narrative voice" htmlFor="voice">
                  <select
                    id="voice"
                    value={voice}
                    onChange={(event) => setVoice(event.target.value)}
                  >
                    {voiceOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Extra emphasis" htmlFor="note">
                  <input
                    id="note"
                    type="text"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="E.g. live betting angles, weather, market-making books"
                  />
                </Field>
              </div>
            </Card>

            <Card title="Guardrails" subtitle="Keep the agent disciplined by forcing bankroll-first constraints.">
              <div className="flex flex-wrap gap-2">
                {constraints.map((constraint) => {
                  const active = includeConstraints.includes(constraint);
                  return (
                    <button
                      key={constraint}
                      type="button"
                      onClick={() => toggleConstraint(constraint)}
                      className={clsx(
                        "rounded-2xl border px-4 py-2 text-xs font-medium uppercase tracking-wide transition",
                        active
                          ? "border-[var(--accent-strong)] bg-[var(--accent)]/15 text-[var(--accent-strong)] shadow-[var(--shadow-soft)]"
                          : "border-white/12 bg-white/3 text-[var(--text-muted)] hover:border-[var(--accent)]/50"
                      )}
                    >
                      {constraint}
                    </button>
                  );
                })}
              </div>
              <label className="mt-4 flex flex-col gap-2 text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Custom guardrail
                <textarea
                  value={customConstraint}
                  onChange={(event) => setCustomConstraint(event.target.value)}
                  placeholder="Add your own bankroll rule, shop command, or risk filter"
                  className="min-h-[120px] rounded-2xl border border-white/12 bg-white/5 p-3 text-sm text-[var(--text-primary)] shadow-inner"
                />
              </label>
            </Card>
          </div>

          <aside>
            <Card title="Final prompt" subtitle="Copy and feed directly into your betting agent.">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  Generated system prompt
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-full border border-[var(--accent-strong)] bg-[var(--accent)]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-strong)] shadow-[var(--shadow-glow)]"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <pre className="mt-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap rounded-3xl border border-white/10 bg-[var(--surface-strong)] p-6 text-sm leading-relaxed text-[#ebf4ff] shadow-[var(--shadow-soft)]">
{prompt}
              </pre>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]"
      htmlFor={htmlFor}
    >
      {label}
      <div className="rounded-2xl border border-white/12 bg-white/5 p-3 text-sm text-white shadow-inner">
        {children}
      </div>
    </label>
  );
}
