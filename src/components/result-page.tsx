import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChineseModels } from "@/components/chinese-models";
import { PetitionPanel } from "@/components/petition-panel";
import { choose, type Goal } from "@/lib/choose";
import { paceFor, solveWeight, WEIGHTS, type Fear, type Load, type Weight } from "@/lib/weight";

const GOAL_LABEL: Record<Goal, string> = {
  proof: "Proofread a document",
  write: "Write",
  research: "Research",
  host: "Build a website and host it",
  code: "Code with me",
  agent: "Hand off a job",
  learn: "Learn",
  try: "Just try",
};

export function ResultPage({
  goal,
  weight,
  fear,
  load,
}: {
  goal?: Goal;
  weight?: Weight;
  fear?: Fear;
  load?: Load;
}) {
  const [phone, setPhone] = useState("");

  if (!goal || !weight) {
    return (
      <div>
        <h1 className="font-display text-4xl text-ink">No result yet.</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Answer what you want to do first. The result is built from that, not from a guess.
        </p>
        <Link
          to="/choose"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-paper"
        >
          Say what you want
        </Link>
      </div>
    );
  }

  const pace = paceFor(weight);
  const named = WEIGHTS.find((item) => item.id === weight)!;
  const solved = fear && load ? solveWeight(fear, load) : null;
  const pick = choose(goal, pace);
  const summary = [
    "TokenCheck result",
    "",
    `${GOAL_LABEL[goal]}. Weight: ${named.label}.`,
    named.dial,
    "",
    pick.title,
    pick.why,
    "",
    ...pick.links.map((link) => `${link.label}: ${link.href}`),
    "",
    "Kimi plans are in US dollars and still sold as 2×, 5× and 10× credits. Qwen Chat is free.",
    "https://www.kimi.ai",
    "https://chat.qwen.ai",
    "",
    "Built by Hakili: https://hakili.co.zw",
  ].join("\n");

  function openMail() {
    const body = `${summary}\n\n${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent("Your TokenCheck result")}&body=${encodeURIComponent(body)}`;
  }

  function openWhatsApp() {
    const digits = phone.replace(/\D/g, "");
    const text = encodeURIComponent(`${summary}\n\n${window.location.href}`);
    const url = digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <p className="mt-6 text-sm text-muted">{GOAL_LABEL[goal]}. Dial on {named.label}.</p>
      <h1 className="mt-2 max-w-3xl text-4xl text-ink sm:text-5xl">{named.label} for the reply. Then the plan.</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        {solved ? solved.line : `${named.dial} ${named.jobs}.`}
      </p>
      <p className="mt-6 text-xs font-semibold tracking-widest text-teal uppercase">The plan</p>
      <h2 className="mt-2 max-w-3xl text-3xl text-ink">{pick.title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{pick.why}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {pick.links.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-paper"
          >
            {link.label}
            <span className="ml-2 text-xs font-normal text-mist">{link.note}</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">
        These open the company’s own site. No affiliate code is attached.{" "}
        <Link to="/choose" className="text-teal underline">
          Change the question
        </Link>
        .
      </p>

      <ChineseModels />

      <section className="mt-14">
        <h2 className="font-display text-3xl text-ink">Keep this result</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Optional. Email opens your mail app with the result ready to send to yourself.
          WhatsApp opens a chat. Add a number with the country code if it should go to a
          specific person. TokenCheck does not store either.
        </p>
        <label htmlFor="wa-number" className="mt-4 block text-sm font-medium text-ink">
          WhatsApp number, if you want one
        </label>
        <input
          id="wa-number"
          inputMode="tel"
          autoComplete="tel"
          placeholder="2637…"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-2 h-12 w-full max-w-xs rounded-xl border border-line bg-card px-3 text-base"
        />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={openMail}
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-paper"
          >
            Email this result
          </button>
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-card px-5 text-sm font-medium text-ink"
          >
            Send on WhatsApp
          </button>
        </div>
      </section>

      <div className="mt-14">
        <PetitionPanel compact />
      </div>
    </div>
  );
}
