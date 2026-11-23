import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Coins } from "@/components/coins";
import { COUNTRIES, isCountryCode, type CountryCode } from "@/data/plans";
import type { Goal } from "@/lib/choose";
import { goalFromText, modelSpaces, pricePlace } from "@/lib/price-pick";

const COUNTRY_KEY = "tokencheck-country";

const GOALS: { id: Goal; label: string }[] = [
  { id: "proof", label: "Proofread a document" },
  { id: "write", label: "Write something new" },
  { id: "research", label: "Research a question" },
  { id: "host", label: "Build a website and host it" },
  { id: "code", label: "Code with me" },
  { id: "agent", label: "Hand a job to an agent" },
  { id: "learn", label: "Learn" },
  { id: "try", label: "Just try" },
];

export function WelcomePage() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [text, setText] = useState("");
  const [country, setCountry] = useState<CountryCode>("GB");

  useEffect(() => {
    const saved = localStorage.getItem(COUNTRY_KEY);
    if (saved && isCountryCode(saved)) setCountry(saved);
  }, []);

  const typed = text.trim();
  const fromText = typed ? goalFromText(typed) : null;
  const used = typed ? fromText : goal;
  const place = pricePlace(country);
  const spaces = modelSpaces(used, country);
  const lead = spaces.find((item) => item.recommended) ?? null;
  const asked = typed || GOALS.find((item) => item.id === goal)?.label;

  return (
    <div className="welcome-rise">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_minmax(0,28rem)]">
        <div>
          <h1 className="max-w-xl text-5xl text-ink sm:text-6xl">What should you pay?</h1>
          <p className="mt-4 max-w-md text-lg text-muted">Pick one, or type the job. The price is for your country.</p>
        </div>
        <Coins className="mx-auto w-full max-w-sm" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
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
              "h-11 rounded-full border px-4 text-sm font-medium",
              goal === item.id && text.trim() === ""
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Or type it. Build a website…"
          aria-label="Or type the job"
          className="h-12 w-full rounded-xl border border-line bg-white px-3 text-base sm:max-w-md"
        />
        <select
          aria-label="Your country"
          value={country}
          onChange={(event) => {
            const next = event.target.value;
            if (!isCountryCode(next)) return;
            setCountry(next);
            localStorage.setItem(COUNTRY_KEY, next);
          }}
          className="h-12 w-full rounded-xl border border-line bg-white px-3 text-base sm:w-56"
        >
          {COUNTRIES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {lead ? (
        <article className="mt-8 rounded-3xl border border-line p-6 sm:p-10">
          <p className="text-sm text-muted">
            {place.name}. {place.taxLabel}. {asked}.
          </p>
          <p className="mt-6 text-sm font-semibold tracking-widest text-teal uppercase">{lead.model}</p>
          <h2 className="mt-1 text-4xl text-ink sm:text-5xl">
            {lead.model} {lead.plan}
          </h2>
          <p className="mt-4 text-6xl text-ink sm:text-7xl">{lead.price}</p>
          <p className="mt-6 max-w-xl text-lg text-ink">{lead.better}</p>
          <p className="mt-2 max-w-xl text-base text-muted">{lead.more}</p>
          {lead.units ? (
            <p className="mt-4 text-base text-muted">
              {lead.units} work units {lead.window}. {lead.unitsNote}
            </p>
          ) : (
            <p className="mt-4 text-base text-muted">
              Work units {lead.window}. {lead.unitsNote}
            </p>
          )}
          <a
            href={lead.href}
            target="_blank"
            rel="noreferrer"
            className="btn-enter mt-8 inline-flex h-14 items-center rounded-full px-7 text-sm font-semibold text-white"
          >
            Open this plan
          </a>
        </article>
      ) : (
        <p className="mt-8 max-w-xl text-base text-muted">
          {typed
            ? "That one does not point at a single model. Read what each is better at."
            : "Nothing is selected yet. Claude is not the default."}
        </p>
      )}

      <h3 className="mt-12 text-2xl text-ink">Where each one is better</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {spaces.map((item) => (
          <article key={item.id} className="rounded-3xl border border-line p-5">
            <p className="text-sm font-semibold text-ink">
              {item.model} {item.plan}
            </p>
            <p className="mt-3 text-base text-ink">{item.better}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.more}</p>
            {item.units ? (
              <p className="mt-5 text-5xl text-ink">{item.units}</p>
            ) : (
              <p className="mt-5 text-sm font-medium text-muted">Work units not published</p>
            )}
            <p className="text-sm text-muted">{item.units ? `work units, ${item.window}` : item.window}</p>
            <p className="mt-3 text-lg text-ink">{item.price}</p>
            <p className="mt-2 text-sm text-muted">{item.unitsNote}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        <Link to="/plans" className="text-teal underline">
          Every current price
        </Link>
        {" · "}
        <Link to="/learn" className="text-teal underline">
          Courses
        </Link>
        {" · "}
        <Link to="/petition" className="text-teal underline">
          Sign the petition
        </Link>
        . Built by{" "}
        <a href="https://hakili.co.zw" className="text-teal underline">
          Hakili
        </a>
        .
      </p>
    </div>
  );
}
