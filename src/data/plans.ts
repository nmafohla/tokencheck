export const COUNTRIES = [
  {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    taxLabel: "No federal sales tax",
    addOn: null,
    taxDetail:
      "There is no national VAT. Some states tax digital subscriptions and some do not, so this sheet does not add one rate.",
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    taxLabel: "VAT 20%",
    addOn: 0.2,
    taxDetail:
      "VAT at 20% applies to digital services supplied to UK consumers. The separate 2% digital services tax is on some companies’ revenue from social media, search and marketplaces. It is not added to an AI chat subscription here.",
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    taxLabel: "GST 5%",
    addOn: 0.05,
    taxDetail:
      "Federal GST on digital services is 5%. Provinces can add HST, QST or PST, so a real bill is often higher than this floor.",
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    locale: "en-AU",
    taxLabel: "GST 10%",
    addOn: 0.1,
    taxDetail: "GST at 10% applies to digital services supplied to Australian consumers.",
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    locale: "de-DE",
    taxLabel: "VAT 19%",
    addOn: 0.19,
    taxDetail: "German VAT on digital services supplied to consumers is 19%.",
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
    locale: "fr-FR",
    taxLabel: "VAT 20%",
    addOn: 0.2,
    taxDetail:
      "French VAT on digital services supplied to consumers is 20%. France also has a 3% digital services tax on large companies’ advertising and marketplace revenue. That tax is not added to the subscription.",
  },
  {
    code: "IN",
    name: "India",
    currency: "INR",
    locale: "en-IN",
    taxLabel: "GST 18%",
    addOn: 0.18,
    taxDetail:
      "Online information and database access or retrieval services supplied to people in India carry GST at 18%.",
  },
  {
    code: "PH",
    name: "Philippines",
    currency: "PHP",
    locale: "en-PH",
    taxLabel: "VAT 12%",
    addOn: 0.12,
    taxDetail:
      "Digital services consumed in the Philippines are subject to 12% VAT, including services from providers based abroad. In force since 2 June 2025.",
  },
  {
    code: "ID",
    name: "Indonesia",
    currency: "IDR",
    locale: "id-ID",
    taxLabel: "VAT 11% effective",
    addOn: 0.11,
    taxDetail:
      "The statutory VAT rate is 12%. The effective rate used for many digital supplies is 11%, and that is the rate added here.",
  },
  {
    code: "PK",
    name: "Pakistan",
    currency: "PKR",
    locale: "en-PK",
    taxLabel: "No single national rate",
    addOn: null,
    taxDetail:
      "Provincial sales tax on services differs by province, and payments sent abroad can also face withholding. This sheet will not invent one national rate.",
  },
  {
    code: "BR",
    name: "Brazil",
    currency: "BRL",
    locale: "pt-BR",
    taxLabel: "Reform in progress",
    addOn: null,
    taxDetail:
      "Brazil is replacing several taxes with CBS and IBS. A combined rate near 26.5% is the destination, with obligations starting in 2026 and the old taxes phasing out through 2033. It is not yet one line on every receipt, so it is not added.",
  },
  {
    code: "JP",
    name: "Japan",
    currency: "JPY",
    locale: "ja-JP",
    taxLabel: "Consumption tax 10%",
    addOn: 0.1,
    taxDetail:
      "Consumption tax on digital services supplied to Japanese consumers is 10%. App stores have been collecting it on those sales.",
  },
  {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    locale: "en-NG",
    taxLabel: "VAT 7.5%",
    addOn: 0.075,
    taxDetail:
      "From 2026, non-resident digital suppliers are required to charge VAT at 7.5% on supplies to people in Nigeria.",
  },
  {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    locale: "en-ZA",
    taxLabel: "VAT 15%",
    addOn: 0.15,
    taxDetail:
      "Electronic services supplied by foreign firms to South African consumers carry VAT at 15%. The rate did not rise in 2025.",
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    currency: "USD",
    locale: "en-ZW",
    taxLabel: "Digital services tax 15.5%",
    addOn: 0.155,
    taxDetail:
      "From 1 January 2026, banks and other intermediaries withhold digital services tax when a person in Zimbabwe pays a foreign supplier. ZIMRA names artificial intelligence platforms. The rate is 15.5% of the payment if that supplier is not registered for Zimbabwe VAT, or a 3/23 fraction if it is. This sheet adds 15.5% once. The 2027 budget proposes to stop a second VAT charge on a payment that has already been withheld. That proposal is not law yet.",
  },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

export type PriceMap = Partial<Record<CountryCode, number>>;

export type CatalogPlan = {
  id: string;
  provider: "Anthropic" | "OpenAI";
  name: string;
  who: string;
  /** US monthly list. Null when the price is a quote or a custom label. */
  usdMonthly: number | null;
  annualNote: string | null;
  web: PriceMap;
  app: PriceMap;
  free?: boolean;
  /** Shown when there is no sticker to tax. */
  priceLabel?: string;
  allowance: string;
  resets: string;
};

const ZERO_DECIMAL = new Set(["JPY", "IDR"]);

export const PLANS: CatalogPlan[] = [
  {
    id: "claude-free",
    provider: "Anthropic",
    name: "Free",
    who: "One person",
    usdMonthly: 0,
    annualNote: null,
    web: {},
    app: {},
    free: true,
    allowance: "Limited chat, search, files and code. No Claude Code.",
    resets: "Every 5 hours, and a weekly cap",
  },
  {
    id: "claude-pro",
    provider: "Anthropic",
    name: "Pro",
    who: "One person",
    usdMonthly: 20,
    annualNote: "US annual price is $17 a month, paid as $200 upfront.",
    web: {
      US: 20,
      GB: 20,
      CA: 28,
      AU: 30,
      DE: 22,
      FR: 22,
      IN: 1999,
      PH: 1290,
      ID: 349000,
      PK: 4900,
      BR: 129.9,
      JP: 3000,
      NG: 2299,
      ZA: 399,
    },
    app: {
      US: 20,
      GB: 20,
      CA: 28,
      AU: 30,
      DE: 22,
      FR: 22,
      IN: 1999,
      PH: 1290,
      ID: 349000,
      PK: 4900,
      BR: 129.9,
      JP: 3000,
    },
    allowance: "At least 5× Free per session, plus Claude Code and projects. The base unit is not published.",
    resets: "Every 5 hours, and a weekly cap",
  },
  {
    id: "claude-max",
    provider: "Anthropic",
    name: "Max",
    who: "One person",
    usdMonthly: 100,
    annualNote: "Monthly only. Includes about $100 of API credits.",
    web: { US: 100, GB: 100, CA: 140, AU: 150, DE: 100, FR: 100 },
    app: {
      US: 124.99,
      GB: 119.99,
      CA: 179.99,
      AU: 199.99,
      DE: 149.99,
      FR: 149.99,
      ID: 1999000,
      PH: 7990,
      IN: 12900,
      PK: 34900,
      JP: 20000,
    },
    allowance: "5× Pro, every session and every week. Priority when traffic is high.",
    resets: "Every 5 hours, and a weekly cap",
  },
  {
    id: "claude-ultra",
    provider: "Anthropic",
    name: "Ultra",
    who: "One person",
    usdMonthly: 200,
    annualNote: "Monthly only. Includes about $200 of API credits.",
    web: { US: 200 },
    app: {},
    allowance: "10× Pro across the week. No 5-hour limit once the account is verified.",
    resets: "Weekly. The 5-hour cap is lifted for verified accounts",
  },
  {
    id: "claude-team-standard",
    provider: "Anthropic",
    name: "Team, standard seat",
    who: "Per seat",
    usdMonthly: 25,
    annualNote: "US annual price is $20 per seat a month. Teams of 2 to 150.",
    web: {},
    app: {},
    allowance: "More than Pro, plus admin, SSO and central billing. No training on your content by default.",
    resets: "Every 5 hours, and a weekly cap",
  },
  {
    id: "claude-team-premium",
    provider: "Anthropic",
    name: "Team, premium seat",
    who: "Per seat",
    usdMonthly: 125,
    annualNote: "US annual price is $100 per seat a month. About 5× a standard seat.",
    web: {},
    app: {},
    allowance: "About 5× a standard Team seat, for the heavy users on a team.",
    resets: "Every 5 hours, and a weekly cap",
  },
  {
    id: "claude-enterprise",
    provider: "Anthropic",
    name: "Enterprise",
    who: "Organisation",
    usdMonthly: null,
    annualNote: "US list is $20 per seat a month, billed annually, 20 seats minimum, plus usage at API rates.",
    web: {},
    app: {},
    priceLabel: "Seat fee + usage",
    allowance: "Spend limits, SCIM, audit logs and a compliance API. Usage is metered, not a fixed allowance.",
    resets: "Spend limits, not a published refill",
  },
  {
    id: "chatgpt-free",
    provider: "OpenAI",
    name: "Free",
    who: "One person",
    usdMonthly: 0,
    annualNote: null,
    web: {},
    app: {},
    free: true,
    allowance: "Everyday text chat. Tight limits on uploads, images, voice and deep research. May show ads.",
    resets: "Not published as one window",
  },
  {
    id: "chatgpt-go",
    provider: "OpenAI",
    name: "Go",
    who: "One person",
    usdMonthly: 8,
    annualNote: "Monthly only. The US price is described as indicative and can vary by market.",
    web: { US: 8, CA: 11 },
    app: { US: 8, GB: 6.99, CA: 12.99, AU: 13 },
    allowance: "Higher limits than Free on the everyday model. No advanced reasoning. May include ads.",
    resets: "Not published as one window",
  },
  {
    id: "chatgpt-plus",
    provider: "OpenAI",
    name: "Plus",
    who: "One person",
    usdMonthly: 20,
    annualNote: "Monthly only.",
    web: {
      US: 20,
      GB: 20,
      CA: 25,
      AU: 30,
      DE: 23,
      FR: 23,
      IN: 1999,
      PH: 1100,
      ID: 349000,
      PK: 4900,
      BR: 99.9,
      JP: 3000,
    },
    app: {
      US: 19.99,
      GB: 19.99,
      CA: 24.99,
      AU: 29.99,
      DE: 22.99,
      FR: 22.99,
      IN: 1999,
      PH: 999,
      ID: 349000,
      PK: 4900,
      BR: 99.9,
      JP: 3000,
    },
    allowance: "Full Work and Codex, deep research and an agent. No Pro reasoning. Limits still apply.",
    resets: "About 5 hours for Codex, plus weekly caps",
  },
  {
    id: "chatgpt-pro-100",
    provider: "OpenAI",
    name: "Pro 100",
    who: "One person",
    usdMonthly: 100,
    annualNote: "Monthly only. API credits roughly match the price.",
    web: { US: 100, CA: 136 },
    app: { US: 100, GB: 88.9, CA: 152.99, AU: 154.99 },
    allowance: "Pro reasoning. More images, research and memory. Less included usage than Pro 200.",
    resets: "No 5-hour Work or Codex limit. Weekly caps remain on some models",
  },
  {
    id: "chatgpt-pro-200",
    provider: "OpenAI",
    name: "Pro 200",
    who: "One person",
    usdMonthly: 200,
    annualNote: "Monthly only. Larger allowance than Pro 100.",
    web: { US: 200 },
    app: { US: 200, GB: 200, CA: 249, AU: 300 },
    allowance: "Same shape as Pro 100, with more included usage.",
    resets: "No 5-hour Work or Codex limit. Weekly caps remain on some models",
  },
  {
    id: "chatgpt-pro-500",
    provider: "OpenAI",
    name: "Pro 500",
    who: "One person",
    usdMonthly: 500,
    annualNote: "Monthly only. The only personal plan with Ultrafast.",
    web: { US: 500 },
    app: { US: 500, GB: 444.99, CA: 759.99, AU: 769.99 },
    allowance: "The largest personal allowance, including Ultrafast.",
    resets: "No 5-hour Work or Codex limit. Weekly caps remain on some models",
  },
  {
    id: "chatgpt-business-standard",
    provider: "OpenAI",
    name: "Business, standard seat",
    who: "Per seat",
    usdMonthly: 25,
    annualNote: "US annual price is $20 per seat a month. Teams of 2 to 200.",
    web: {},
    app: {},
    allowance: "Work and Codex usage in the same band as Plus, with workspace admin.",
    resets: "About 5 hours, plus weekly caps",
  },
  {
    id: "chatgpt-business-premium",
    provider: "OpenAI",
    name: "Business, premium seat",
    who: "Per seat",
    usdMonthly: 125,
    annualNote: "US annual price is $100 per seat a month.",
    web: {},
    app: {},
    allowance: "More usage than a standard seat, and no 5-hour limit.",
    resets: "No 5-hour limit",
  },
  {
    id: "chatgpt-enterprise",
    provider: "OpenAI",
    name: "Enterprise",
    who: "Organisation",
    usdMonthly: null,
    annualNote: null,
    web: {},
    app: {},
    priceLabel: "On request",
    allowance: "Custom. Credit-based or token-based pricing, sold through the sales team.",
    resets: "Set in the contract",
  },
  {
    id: "chatgpt-edu",
    provider: "OpenAI",
    name: "Edu",
    who: "University",
    usdMonthly: null,
    annualNote: null,
    web: {},
    app: {},
    priceLabel: "On request",
    allowance: "Campus plan. Price is not on the public page.",
    resets: "Not published",
  },
  {
    id: "chatgpt-teachers",
    provider: "OpenAI",
    name: "ChatGPT for Teachers",
    who: "Verified US K–12 teacher",
    usdMonthly: 0,
    annualNote: "Free through June 2027 for verified US educators. Not a worldwide plan.",
    web: {},
    app: {},
    free: true,
    allowance: "A free teacher plan in the US, not a consumer subscription.",
    resets: "Not published",
  },
];

export const SHEET_NOTE =
  "US list prices checked in November 2026. Local stickers are only shown where a figure was published. Tax is the consumer charge in that country, added on web prices only.";

export function countryByCode(code: CountryCode) {
  const country = COUNTRIES.find((item) => item.code === code);
  if (!country) throw new Error(`Unknown country ${code}`);
  return country;
}

export function isCountryCode(value: string): value is CountryCode {
  return COUNTRIES.some((item) => item.code === value);
}

export type MoneyQuote = { amount: number; currency: string; locale: string };

export function formatMoney(quote: MoneyQuote): string {
  const fraction = ZERO_DECIMAL.has(quote.currency) || Number.isInteger(quote.amount) ? 0 : 2;
  const digits = ZERO_DECIMAL.has(quote.currency) ? 0 : fraction;
  try {
    return new Intl.NumberFormat(quote.locale, {
      style: "currency",
      currency: quote.currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(quote.amount);
  } catch {
    return new Intl.NumberFormat(quote.locale, {
      style: "currency",
      currency: quote.currency,
    }).format(quote.amount);
  }
}

function roundMoney(value: number, currency: string): number {
  if (ZERO_DECIMAL.has(currency)) return Math.round(value);
  return Math.round(value * 100) / 100;
}

export type PriceReadout = {
  listed: string;
  taxed: string | null;
  hint: string | null;
};

export function webPrice(plan: CatalogPlan, country: CountryCode, withTax: boolean): PriceReadout {
  const meta = countryByCode(country);
  if (plan.free) return { listed: "Free", taxed: null, hint: plan.annualNote };
  const local = plan.web[country];
  if (local != null) {
    return finish(local, meta.currency, meta.locale, meta.addOn, withTax, plan.annualNote);
  }
  if (plan.usdMonthly != null) {
    const hint =
      country === "US"
        ? plan.annualNote
        : [plan.annualNote, "US list price. A local sticker is not published."].filter(Boolean).join(" ");
    return finish(plan.usdMonthly, "USD", "en-US", meta.addOn, withTax, hint);
  }
  return { listed: plan.priceLabel ?? "Not published", taxed: null, hint: plan.annualNote };
}

export function appPrice(plan: CatalogPlan, country: CountryCode): PriceReadout {
  if (plan.free) return { listed: "Free", taxed: null, hint: null };
  const amount = plan.app[country];
  if (amount == null) {
    return { listed: "Not published", taxed: null, hint: null };
  }
  const meta = countryByCode(country);
  return {
    listed: formatMoney({ amount, currency: meta.currency, locale: meta.locale }),
    taxed: null,
    hint: "Not grossed up. Store prices are often tax-inclusive.",
  };
}

function finish(
  amount: number,
  currency: string,
  locale: string,
  addOn: number | null,
  withTax: boolean,
  hint: string | null,
): PriceReadout {
  const listed = formatMoney({ amount, currency, locale });
  if (!withTax || addOn == null) return { listed, taxed: null, hint };
  const taxedAmount = roundMoney(amount * (1 + addOn), currency);
  const taxed = formatMoney({ amount: taxedAmount, currency, locale });
  return { listed, taxed: `${taxed} with tax`, hint };
}
