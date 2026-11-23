import { useState } from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import type { Goal } from "@/lib/choose";
import { solveWeight, WEIGHTS, type Fear, type Load, type Weight } from "@/lib/weight";

const FEARS: { id: Fear; label: string }[] = [
  { id: "miss", label: "I don’t want to miss out" },
  { id: "failed", label: "A lower weight already failed" },
  { id: "huge", label: "The job is huge" },
];

const LOADS: { id: Load; label: string }[] = [
  { id: "one", label: "One thing in front of me" },
  { id: "few", label: "A few through the day" },
  { id: "all", label: "All day, several at once" },
];

const HEIGHT: Record<Weight, string> = {
  med: "46%",
  high: "64%",
  max: "84%",
  ultra: "100%",
};

export function WeightPage({ goal }: { goal?: Goal }) {
  const [fear, setFear] = useState<Fear | null>(null);
  const [load, setLoad] = useState<Load | null>(null);
  const solved = fear && load ? solveWeight(fear, load) : null;

  if (!goal) {
    return (
      <div>
        <h1 className="text-4xl text-ink">Start with the job.</h1>
        <Link to="/choose" className="btn-enter mt-6 inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold text-white">
          Say what you want
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="max-w-3xl text-4xl text-ink sm:text-5xl">Which weight, without the fear.</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Medium, High, Max and Ultra are how hard one reply tries. The plan with the same
        name is how many replies you bought. They are not the same switch. Most people
        leave the dial on Max so they don’t miss out. About 9 times in 10, Medium writes
        the same thing and the allowance lasts.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-hidden="true">
        {WEIGHTS.map((item) => {
          const on = solved?.weight === item.id;
          return (
            <div key={item.id} className="flex h-56 flex-col justify-end">
              <div
                className={clsx(
                  "rounded-t-2xl transition-all duration-500",
                  on ? "btn-enter" : "bg-[#f3f3f3]",
                )}
                style={{ height: HEIGHT[item.id] }}
              />
              <p className={clsx("mt-2 text-sm font-semibold", on ? "text-ink" : "text-muted")}>{item.label}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">Bar height is how much of the cap it spends, not how much better the answer is.</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {WEIGHTS.map((item) => (
          <li
            key={item.id}
            className={clsx(
              "rounded-2xl border p-4",
              solved?.weight === item.id ? "border-ink" : "border-line",
            )}
          >
            <p className="font-semibold text-ink">{item.label}</p>
            <p className="mt-1 text-sm text-ink">{item.dial}</p>
            <p className="mt-2 text-sm text-muted">{item.jobs}. {item.spend}.</p>
          </li>
        ))}
      </ul>

      <fieldset className="mt-10">
        <legend className="text-sm font-semibold text-ink">Why is it on Max?</legend>
        <div className="mt-3 flex flex-col gap-2">
          {FEARS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={fear === item.id}
              onClick={() => setFear(item.id)}
              className={clsx(
                "h-12 rounded-full border px-4 text-left text-sm font-medium",
                fear === item.id ? "border-ink bg-ink text-white" : "border-line text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">How much is running?</legend>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          {LOADS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={load === item.id}
              onClick={() => setLoad(item.id)}
              className={clsx(
                "h-12 flex-1 rounded-full border px-4 text-sm font-medium",
                load === item.id ? "border-ink bg-ink text-white" : "border-line text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      {solved && (
        <div className="welcome-rise mt-8 rounded-3xl border border-line p-6">
          <p className="text-xs font-semibold tracking-widest text-teal uppercase">
            {solved.overkill ? "Overkill" : "Set it here"}
          </p>
          <h2 className="mt-2 text-3xl text-ink">{WEIGHTS.find((item) => item.id === solved.weight)?.label}</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{solved.line}</p>
          <Link
            to="/result"
            search={{
              goal,
              weight: solved.weight,
              fear: fear ?? undefined,
              load: load ?? undefined,
            }}
            className="btn-enter mt-6 inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold text-white"
          >
            See the plan that fits
          </Link>
        </div>
      )}
    </div>
  );
}
