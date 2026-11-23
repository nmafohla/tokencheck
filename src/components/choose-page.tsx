import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Coins } from "@/components/coins";
import { COUNTRIES, isCountryCode, type CountryCode } from "@/data/plans";
import type { Goal } from "@/lib/choose";
import { goalFromText, pricePick } from "@/lib/price-pick";

const COUNTRY_KEY = "tokencheck-country";

const GOALS: { id: Goal; label: string; hint: string }[] = [
  { id: "write", label: "Write and research", hint: "Drafts, briefs, long documents" },
  { id: "code", label: "Code with me", hint: "You stay in the loop" },
  { id: "agent", label: "Hand off a job", hint: "An agent runs the steps" },
  { id: "learn", label: "Learn the craft", hint: "Courses before a subscription" },
  { id: "try", label: "Just try it", hint: "No card yet" },
];

export function ChoosePage() {
  const [goal, setGoal] = useState<Goal>("write");
  const [text, setText] = useState("");
  const [country, setCountry] = useState<CountryCode>("GB");

  useEffect(() => {
    const saved = localStorage.getItem(COUNTRY_KEY);
    if (saved && isCountryCode(saved)) setCountry(saved);
  }, []);

  const used = (text.trim() ? goalFromText(text) : goal) ?? goal;
  const pick = pricePick(used, country);
  const asked = text.trim() || GOALS.find((item) => item.id === goal)?.label;

  return (
    <div>
      <Coins className="w-full max-w-md" />
      <h1 className="mt-6 max-w-3xl text-4xl text-ink sm:text-5xl">What do you need?</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Pick from the list, or type it in the box. The normal price for your country
        updates underneath.
      </p>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-ink">Pick one</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {GOALS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={goal === item.id && text.trim() === ""}
              onClick={() => {
                setGoal(item.id);
                setText("");
              }}
              className={clsx(
                "min-h-14 rounded-2xl border px-4 py-3 text-left",
                goal === item.id && text.trim() === ""
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink",
              )}
            >
              <span className="block text-sm font-medium">{item.label}</span>
              <span
                className={clsx(
                  "mt-0.5 block text-xs",
                  goal === item.id && text.trim() === "" ? "text-mist" : "text-muted",
                )}
              >
                {item.hint}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <label htmlFor="own-job" className="mt-6 block text-sm font-medium text-ink">
        Or type it below
      </label>
      <input
        id="own-job"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="A weekly report, a small app, help with homework…"
        className="mt-2 h-12 w-full max-w-xl rounded-xl border border-line bg-white px-3 text-base"
      />

      <label htmlFor="country" className="mt-6 block text-sm font-medium text-ink">
        Your country
      </label>
      <select
        id="country"
        value={country}
        onChange={(event) => {
          const next = event.target.value;
          if (!isCountryCode(next)) return;
          setCountry(next);
          localStorage.setItem(COUNTRY_KEY, next);
        }}
        className="mt-2 h-12 w-full max-w-xs rounded-xl border border-line bg-white px-3 text-base"
      >
        {COUNTRIES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>

      <article className="mt-8 max-w-xl rounded-3xl border border-line p-6">
        <p className="text-sm text-muted">
          {pick.place.name}. {pick.place.taxLabel}. You asked: {asked}.
        </p>
        <p className="mt-4 text-xs font-semibold tracking-widest text-teal uppercase">{pick.main.provider}</p>
        <h2 className="mt-2 text-3xl text-ink">
          {pick.main.provider === "Anthropic" ? "Claude" : pick.main.provider} {pick.main.name}
        </h2>
        <p className="mt-4 text-4xl text-ink">{pick.mainPrice}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{pick.why}</p>
        <a
          href={pick.main.provider === "OpenAI" ? "https://chatgpt.com" : "https://claude.ai"}
          target="_blank"
          rel="noreferrer"
          className="btn-enter mt-6 inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold text-white"
        >
          Open this plan
        </a>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Or {pick.other.provider === "OpenAI" ? "ChatGPT" : "Claude"} {pick.other.name}, {pick.otherPrice}.{" "}
          <Link to="/plans" className="text-teal underline">
            All current prices
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
