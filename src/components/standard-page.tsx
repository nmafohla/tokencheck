import { Link } from "@tanstack/react-router";
import { Steps } from "@/components/steps";
import type { CountryCode } from "@/data/plans";
import type { Goal } from "@/lib/choose";
import { goalFromText, pricePick } from "@/lib/price-pick";

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

export function StandardPage({
  goal,
  country,
  text,
}: {
  goal?: Goal;
  country?: CountryCode;
  text?: string;
}) {
  if (!goal || !country) {
    return (
      <div>
        <h1 className="text-4xl text-ink">Tell us the job first.</h1>
        <Link
          to="/choose"
          className="btn-enter mt-6 inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold text-white"
        >
          Pick or type it
        </Link>
      </div>
    );
  }

  const asked = text?.trim() ? text.trim() : GOAL_LABEL[goal];
  const used = (text?.trim() ? goalFromText(text) : goal) ?? goal;
  const pick = pricePick(used, country);

  return (
    <div>
      <Steps current={2} />
      <p className="mt-6 text-sm text-muted">
        {pick.place.name}. {pick.place.taxLabel}.
      </p>
      <h1 className="mt-2 max-w-3xl text-4xl text-ink sm:text-5xl">The normal price for this.</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        You asked: {asked}. {pick.why}
      </p>

      <article className="mt-8 max-w-xl rounded-3xl border border-line p-6">
        <p className="text-xs font-semibold tracking-widest text-teal uppercase">{pick.main.provider}</p>
        <h2 className="mt-2 text-3xl text-ink">
          {pick.main.provider === "Anthropic" ? "Claude" : pick.main.provider} {pick.main.name}
        </h2>
        <p className="mt-4 text-4xl text-ink">{pick.mainPrice}</p>
        <p className="mt-2 text-sm text-muted">Current web price. Tax is included when this country adds it.</p>
        <a
          href={pick.main.provider === "OpenAI" ? "https://chatgpt.com" : "https://claude.ai"}
          target="_blank"
          rel="noreferrer"
          className="btn-enter mt-6 inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold text-white"
        >
          Open this plan
        </a>
      </article>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
        The other normal plan is {pick.other.provider === "OpenAI" ? "ChatGPT" : "Claude"} {pick.other.name},{" "}
        {pick.otherPrice}. Same kind of work, the other company.{" "}
        <Link to="/plans" className="text-teal underline">
          All current prices
        </Link>
        .
      </p>
    </div>
  );
}
