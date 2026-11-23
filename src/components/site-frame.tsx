import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

export function SiteFrame({
  active,
  children,
}: {
  active: "welcome" | "purpose" | "start" | "weight" | "result" | "standard" | "plans" | "learn" | "petition";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <header>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
            <Mark />
            tokencheck
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm font-medium" aria-label="Site">
            <Link
              to="/petition"
              className={clsx(
                "ml-1 inline-flex h-10 items-center rounded-full border px-4",
                active === "petition" ? "border-ink bg-ink text-white" : "border-line text-ink",
              )}
            >
              Petition
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10">{children}</main>
      <footer>
        <p className="mx-auto max-w-6xl px-5 py-8 text-sm leading-relaxed text-muted sm:px-8">
          TokenCheck is an independent proposal, built by{" "}
          <a href="https://hakili.co.zw" className="text-teal underline">
            Hakili
          </a>
          . It is not affiliated with Anthropic, OpenAI, Google, Moonshot or Alibaba.
          Prices and tax rules move. Figures here are a dated sheet, not a quote.
        </p>
      </footer>
    </div>
  );
}

function Mark() {
  return (
    <span className="relative h-7 w-8 shrink-0" aria-hidden="true">
      <span className="absolute top-0 left-0 h-4 w-4 rounded-full bg-[#ef7a45]" />
      <span className="absolute top-2.5 left-2 h-4 w-4 rounded-full bg-[#1f9d62]" />
      <span className="absolute top-0.5 left-4 h-4 w-4 rounded-full bg-[#3b6fe0]" />
    </span>
  );
}
