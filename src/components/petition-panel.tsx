import { useEffect, useState } from "react";
import {
  COUNTRIES,
  PLANS,
  appPrice,
  countryByCode,
  formatMoney,
  isCountryCode,
  webPrice,
  type CatalogPlan,
  type CountryCode,
} from "@/data/plans";
import { petitionOpen } from "@/lib/closes";
import { getPetitionCount, signPetition } from "@/lib/petition";

const SIGN_KEY = "tokencheck-sign-id";
const COUNTRY_KEY = "tokencheck-country";

function planById(id: string): CatalogPlan {
  const plan = PLANS.find((item) => item.id === id);
  if (!plan) throw new Error(id);
  return plan;
}

function roundMoney(value: number, currency: string) {
  if (currency === "JPY" || currency === "IDR") return Math.round(value);
  return Math.round(value * 100) / 100;
}

function eachUnit(plan: CatalogPlan, units: number, country: CountryCode) {
  const meta = countryByCode(country);
  const local = plan.web[country];
  const amount = local ?? plan.usdMonthly;
  if (amount == null || amount === 0) return null;
  const currency = local != null ? meta.currency : "USD";
  const locale = local != null ? meta.locale : "en-US";
  const gross = meta.addOn == null ? amount : roundMoney(amount * (1 + meta.addOn), currency);
  return formatMoney({ amount: roundMoney(gross / units, currency), currency, locale });
}

export function usePetitionCount() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPetitionCount()
      .then((result) => {
        if (!cancelled) setCount(result.count);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { count, error, setCount };
}

export function PetitionPanel({ compact = false }: { compact?: boolean }) {
  const { count, error, setCount } = usePetitionCount();
  const [signed, setSigned] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [closed, setClosed] = useState(!petitionOpen());
  const [country, setCountry] = useState<CountryCode>("GB");

  useEffect(() => {
    setSigned(Boolean(localStorage.getItem(SIGN_KEY)));
    const saved = localStorage.getItem(COUNTRY_KEY);
    if (saved && isCountryCode(saved)) setCountry(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(COUNTRY_KEY, country);
  }, [country]);

  async function sign() {
    const existing = localStorage.getItem(SIGN_KEY);
    if (existing) {
      setSigned(true);
      return;
    }
    setPending(true);
    setFailed(false);
    try {
      const id = crypto.randomUUID();
      const result = await signPetition({ data: { id } });
      if (result.closed) {
        setClosed(true);
        return;
      }
      localStorage.setItem(SIGN_KEY, id);
      setSigned(true);
      setCount(result.count);
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  const meta = countryByCode(country);
  const pro = planById("claude-pro");
  const max = planById("claude-max");
  const ultra = planById("claude-ultra");
  const proWeb = webPrice(pro, country, true);
  const proApp = appPrice(pro, country);
  const maxWeb = webPrice(max, country, true);
  const maxApp = appPrice(max, country);
  const ultraWeb = webPrice(ultra, country, true);
  const ultraApp = appPrice(ultra, country);
  const proEach = eachUnit(pro, 20, country);
  const maxEach = eachUnit(max, 100, country);
  const ultraEach = eachUnit(ultra, 200, country);

  const bills = [
    {
      name: "Free",
      units: "4",
      window: "every 5 hours",
      price: "Free",
      today: "“Limited.” No number.",
      detail: "The base they have never printed. The other plans are multiples of this 4.",
    },
    {
      name: "Pro",
      units: "20",
      window: "every 5 hours",
      price: proWeb.taxed ?? proWeb.listed,
      today: "Sold today as “at least 5× Free.”",
      detail: `5 × 4 = 20. Web ${proWeb.listed}. App Store ${proApp.listed}.${proEach ? ` Each included unit ${proEach}.` : ""}${pro.web[country] == null ? " No local web price, so this is the US list plus this country’s tax." : ""}`,
    },
    {
      name: "Max",
      units: "100",
      window: "every 5 hours",
      price: maxWeb.taxed ?? maxWeb.listed,
      today: "Sold today as “5× Pro.”",
      detail: `5 × 20 = 100. Web ${maxWeb.listed}. App Store ${maxApp.listed}.${maxEach ? ` Each included unit ${maxEach}.` : ""}${max.web[country] == null ? " No local web price, so this is the US list plus this country’s tax." : ""}`,
    },
    {
      name: "Ultra",
      units: "200",
      window: "a week, no 5-hour cap",
      price: ultraWeb.taxed ?? ultraWeb.listed,
      today: "Sold today as “10× Pro across the week.”",
      detail: `10 × 20 = 200 for the week. Web ${ultraWeb.listed}. App Store ${ultraApp.listed}.${ultraEach ? ` Each included unit ${ultraEach}.` : ""}${ultra.web[country] == null ? " No local web price, so this is the US list plus this country’s tax." : ""}`,
    },
  ];

  const chatgpt = [
    ["chatgpt-free", "window not published", "“Tight limits.” No number.", "Same work unit as Claude. No count is published, so none is copied from Claude."],
    ["chatgpt-go", "window not published", "“Higher than Free.” No number.", "Higher than Free is not a count."],
    ["chatgpt-plus", "about every 5 hours for Codex", "“Limits still apply.”", "A 5-hour clock is named. The number of work units is not."],
    ["chatgpt-pro-100", "no 5-hour cap, weekly cap remains", "“Less usage than Pro 200.”", "Named against another plan, still with no count."],
    ["chatgpt-pro-200", "no 5-hour cap, weekly cap remains", "“More usage than Pro 100.”", "The price is double Pro 100. The usage is not published as double."],
    ["chatgpt-pro-500", "no 5-hour cap, weekly cap remains", "“The largest personal allowance.”", "Largest is not a number of work units."],
  ].map(([id, window, today, sum]) => {
    const plan = planById(id);
    const web = webPrice(plan, country, true);
    const app = appPrice(plan, country);
    const fallback =
      !plan.free && plan.web[country] == null && plan.usdMonthly != null
        ? " No local web price, so this is the US list plus this country’s tax."
        : "";
    return {
      name: plan.name,
      units: "—",
      window,
      price: plan.free ? "Free" : (web.taxed ?? web.listed),
      today,
      detail: plan.free
        ? sum
        : `${sum} Web ${web.listed}. App Store ${app.listed}.${fallback}`,
    };
  });

  return (
    <div>
      {!compact && (
        <>
      <p className="text-xs font-medium tracking-widest text-teal uppercase">Open letter</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
        Publish one sheet. Every plan. Every country.
      </h1>
      <article className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-ink">
        <p>To Anthropic, OpenAI, and every company that sells an AI subscription:</p>
        <p>
          Publish one sheet for every plan. The web price and the app-store price, in the
          buyer’s currency. A plain allowance, not only “5×” another plan whose unit you
          never state. When that allowance resets. What the fee includes. The tax a person
          in that country actually pays — VAT, GST, or a withholding tax such as Zimbabwe’s
          digital services tax — and whether the sticker already includes it. And the date
          you last checked the figures.
        </p>
        <p>
          Stop selling a plan as “5×” another plan. Bill every plan the same way: one work
          unit, a count of those units, when they refill, and a price with the tax already
          in. The examples below are that bill. The money is what they charge today. The
          counts are their own multiples, written out.
        </p>
        <p>Adopt this bill.</p>
      </article>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-ink">The bill, after the standard</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-base leading-relaxed text-ink">
            1 work unit is one finished page, or one hour of coding with you, or one agent
            task you named. Pick a country. The counts stay put. Only the price and the
            tax change. Claude prints multiples, so those become numbers. ChatGPT does not,
            so its count stays blank rather than copied from Claude.
          </p>
          <div className="w-full sm:w-72">
            <label htmlFor="petition-country" className="mb-2 block text-sm font-medium">
              Country
            </label>
            <select
              id="petition-country"
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
        <p className="mt-3 text-sm text-muted">
          {meta.name}. {meta.taxLabel}. Tax is added on the web price only.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
          {bills.map((bill) => (
            <article key={bill.name} className="rounded-2xl border border-line bg-card p-5">
              <p className="text-xs font-medium tracking-widest text-teal uppercase">Claude · {meta.name}</p>
              <h3 className="mt-2 font-display text-2xl text-ink">{bill.name}</h3>
              <p className="mt-4 font-display text-5xl tabular-nums text-ink">{bill.units}</p>
              <p className="text-sm text-muted">work units {bill.window}</p>
              <p className="mt-4 text-lg font-medium text-ink">{bill.price}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted line-through decoration-copper">
                {bill.today}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{bill.detail}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-10 font-display text-2xl text-ink">ChatGPT, same country, same unit</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {chatgpt.map((bill) => (
            <article key={bill.name} className="rounded-2xl border border-line bg-card p-5">
              <p className="text-xs font-medium tracking-widest text-teal uppercase">ChatGPT · {meta.name}</p>
              <h3 className="mt-2 font-display text-2xl text-ink">{bill.name}</h3>
              <p className="mt-4 font-display text-5xl tabular-nums text-ink">{bill.units}</p>
              <p className="text-sm text-muted">work units, {bill.window}</p>
              <p className="mt-4 text-lg font-medium text-ink">{bill.price}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted line-through decoration-copper">
                {bill.today}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{bill.detail}</p>
            </article>
          ))}
        </div>

        <article className="mt-4 rounded-2xl bg-ink p-5 text-paper">
          <p className="text-xs font-medium tracking-widest text-teal uppercase">One job, on that Pro bill</p>
          <p className="mt-3 font-display text-2xl">“Rewrite this page.”</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Before it runs: about 1 work unit. 19 of 20 left. Refills in 3 hours. Included,
            so £0. After: 1 work unit, Claude Pro, included. No token count. No “5×”.
          </p>
        </article>
      </section>
        </>
      )}

      {compact && (
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-ink">Sign it, if you agree</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The petition closes on 1 January 2027. After that the count stays, and new
            signatures stop.
          </p>
        </div>
      )}

      <div className="mt-8 max-w-xl rounded-2xl bg-ink p-6 text-paper">
        <p className="font-display text-4xl tabular-nums">
          {count == null ? "—" : count.toLocaleString("en-GB")}
        </p>
        <p className="mt-1 text-sm text-mist">
          {closed
            ? "Signing closed on 1 January 2027"
            : count === 1
              ? "person has signed. Closes 1 January 2027"
              : "people have signed. Closes 1 January 2027"}
        </p>
        <button
          type="button"
          onClick={sign}
          disabled={signed || pending || closed}
          className="mt-5 h-12 w-full rounded-full bg-paper px-5 text-sm font-medium text-ink disabled:opacity-70 sm:w-auto"
        >
          {closed ? "Closed" : signed ? "You signed" : pending ? "Signing…" : "Sign the petition"}
        </button>
        <p className="mt-4 text-sm leading-relaxed text-mist">
          No name and no email. A random id stays in this browser so you are counted once.
          This does not message the companies.
        </p>
        {(failed || error) && (
          <p className="mt-3 text-sm text-copper-soft">The count could not be reached. Try again.</p>
        )}
      </div>
    </div>
  );
}
