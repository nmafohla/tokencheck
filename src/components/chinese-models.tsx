const KIMI = [
  ["Plus", "$19 a month", "Annual equivalent $15. The base credit count is not published."],
  ["Pro", "$39 a month", "Sold as 2× the agent credits. Annual equivalent $31."],
  ["Max", "$99 a month", "Sold as 5× the agent credits. Annual equivalent $79."],
  ["Ultra", "$199 a month", "Sold as 10× the agent credits. Annual equivalent $159."],
];

export function ChineseModels() {
  return (
    <section className="mt-14">
      <h2 className="font-display text-3xl text-ink">Kimi and Qwen</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Moonshot and Alibaba were missing from the first sheet. Prices below are the
        international lists checked in November 2026. Neither publishes a work unit.
        Kimi still sells “2×”, “5×” and “10×” credits. There is no country tax line,
        because the stickers are in US dollars only.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-line bg-card p-5">
          <h3 className="font-display text-2xl text-ink">Kimi</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Moonshot. A free start exists. The pricing page does not say how many work
            units it includes. Paid plans, monthly billing:
          </p>
          <ul className="mt-4 space-y-3">
            {KIMI.map(([name, price, note]) => (
              <li key={name}>
                <p className="font-medium text-ink">
                  {name} · {price}
                </p>
                <p className="text-sm text-muted">{note}</p>
              </li>
            ))}
          </ul>
          <a
            href="https://www.kimi.ai"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-line px-4 text-sm font-medium text-ink"
          >
            Open Kimi
          </a>
        </article>
        <article className="rounded-2xl border border-line bg-card p-5">
          <h3 className="font-display text-2xl text-ink">Qwen Chat</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Alibaba’s international chat is free. No paid chat plan is published on that
            site. Limits are not given as work units. The separate Model Studio API is a
            metered developer bill, not a subscription you pick here.
          </p>
          <a
            href="https://chat.qwen.ai"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-line px-4 text-sm font-medium text-ink"
          >
            Open Qwen Chat
          </a>
        </article>
      </div>
    </section>
  );
}
