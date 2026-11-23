import { Link } from "@tanstack/react-router";

export function PurposePage() {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-teal uppercase">TokenCheck</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">
        AI plans should be readable before you pay.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        This site asks Anthropic, OpenAI, Google, Moonshot and Alibaba to bill in one
        unit a person can picture: a finished page, an hour of coding, or one agent task.
        Not tokens. Not “5×” a plan whose size is never stated.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["01", "What you need", "Pick from the list, or type your own."],
          ["02", "The price", "It appears on the same page, for your country."],
          ["03", "Open it", "The company’s own page. No extra step."],
        ].map(([n, title, body]) => (
          <li key={n} className="rounded-2xl border border-line bg-card p-5">
            <p className="font-display text-teal">{n}</p>
            <h2 className="mt-2 font-display text-2xl text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/choose"
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-white"
        >
          Pick or type what you need
        </Link>
      </div>

      <section className="mt-14 max-w-2xl">
        <h2 className="font-display text-3xl text-ink">Built by Hakili</h2>
        <p className="mt-3 text-base leading-relaxed text-ink">
          TokenCheck is a proposal, not a product of the AI companies. The site was built
          by{" "}
          <a href="https://hakili.co.zw" className="text-teal underline">
            Hakili
          </a>
          , a studio in Zimbabwe that makes websites, apps and the software around them.
          If this page was useful, that link is how you find them.
        </p>
      </section>
    </div>
  );
}
