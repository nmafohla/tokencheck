import { useEffect, useState } from "react";
import { ChineseModels } from "@/components/chinese-models";
import clsx from "clsx";
import {
  COUNTRIES,
  PLANS,
  SHEET_NOTE,
  appPrice,
  countryByCode,
  isCountryCode,
  webPrice,
  type CatalogPlan,
  type CountryCode,
} from "@/data/plans";

const STORAGE_KEY = "tokencheck-country";
const TAX_KEY = "tokencheck-tax";

export function HomePage() {
  const [country, setCountry] = useState<CountryCode>("GB");
  const [withTax, setWithTax] = useState(true);
  const [provider, setProvider] = useState<"All" | "Anthropic" | "OpenAI">("All");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isCountryCode(saved)) setCountry(saved);
    const tax = localStorage.getItem(TAX_KEY);
    if (tax === "off") setWithTax(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, country);
  }, [country]);

  useEffect(() => {
    localStorage.setItem(TAX_KEY, withTax ? "on" : "off");
  }, [withTax]);

  const meta = countryByCode(country);
  const visible = PLANS.filter((plan) => provider === "All" || plan.provider === provider);

  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-teal uppercase">The sheet</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">
        Every Claude and ChatGPT plan, with the tax.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Blank cells are unpublished, not guesses. A plain work unit is missing on all of
        them. Web prices can include the country’s tax. App Store prices are left as listed.
      </p>

      <section id="plans" className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl text-ink">Claude and ChatGPT</h2>
          </div>
          <div className="w-full sm:w-72">
            <label htmlFor="country" className="mb-2 block text-sm font-medium">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(event) => {
                const next = event.target.value;
                if (isCountryCode(next)) setCountry(next);
              }}
              className="h-12 w-full rounded-xl border border-line bg-card px-3 text-base"
            >
              {COUNTRIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-teal-soft p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-teal">{meta.name}</p>
              <p className="mt-1 font-display text-2xl text-ink">{meta.taxLabel}</p>
            </div>
            <label className="flex h-11 items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={withTax && meta.addOn != null}
                disabled={meta.addOn == null}
                onChange={(event) => setWithTax(event.target.checked)}
                className="size-4 accent-teal"
              />
              Add tax on web prices
            </label>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">{meta.taxDetail}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Web totals add the rate on top of the listed price. If a provider already
            included tax, that overstates the bill. App Store prices are left as listed.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Provider">
          {(["All", "Anthropic", "OpenAI"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={provider === item}
              onClick={() => setProvider(item)}
              className={clsx(
                "h-11 rounded-full border px-4 text-sm font-medium",
                provider === item ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink",
              )}
            >
              {item === "Anthropic" ? "Claude" : item === "OpenAI" ? "ChatGPT" : item}
            </button>
          ))}
        </div>

        <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card">
          {visible.map((plan) => (
            <PlanRow key={plan.id} plan={plan} country={country} withTax={withTax} />
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">{SHEET_NOTE}</p>
      </section>
      <ChineseModels />
    </div>
  );
}

function PlanRow({
  plan,
  country,
  withTax,
}: {
  plan: CatalogPlan;
  country: CountryCode;
  withTax: boolean;
}) {
  const web = webPrice(plan, country, withTax);
  const app = appPrice(plan, country);
  return (
    <article className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-ink">
          <span className="block font-sans text-xs font-medium tracking-widest text-muted uppercase">
            {plan.provider === "Anthropic" ? "Claude" : "ChatGPT"}
          </span>
          <span className="mt-1 block font-display text-2xl">{plan.name}</span>
        </h3>
        <p className="text-sm text-muted">{plan.who}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <PriceBlock label="Web" listed={web.listed} taxed={web.taxed} hint={web.hint} />
        <PriceBlock label="App Store" listed={app.listed} taxed={null} hint={app.hint} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink">{plan.allowance}</p>
      <p className="mt-1 text-sm text-muted">Resets: {plan.resets}</p>
      <p className="mt-1 text-sm text-copper">Plain work unit: not published</p>
    </article>
  );
}

function PriceBlock({
  label,
  listed,
  taxed,
  hint,
}: {
  label: string;
  listed: string;
  taxed: string | null;
  hint: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">{label}</p>
      <p className="mt-1 font-medium break-words text-ink tabular-nums">{listed}</p>
      {taxed && <p className="text-sm break-words text-teal tabular-nums">{taxed}</p>}
      {hint && <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
