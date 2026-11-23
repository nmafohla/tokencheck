import { PLANS, countryByCode, webPrice, type CountryCode } from "@/data/plans";
import type { Goal } from "@/lib/choose";

type ModelId = "claude" | "chatgpt" | "kimi" | "perplexity";

const WINNER: Record<Goal, ModelId> = {
  proof: "claude",
  write: "claude",
  research: "perplexity",
  host: "kimi",
  code: "claude",
  agent: "chatgpt",
  learn: "perplexity",
  try: "chatgpt",
};

const PAID: Record<Goal, boolean> = {
  proof: true,
  write: true,
  research: true,
  host: true,
  code: true,
  agent: true,
  learn: false,
  try: false,
};

function usdBill(amount: number, country: CountryCode) {
  const meta = countryByCode(country);
  if (country === "US" || !meta.addOn) return `$${amount}`;
  const taxed = Math.round(amount * (1 + meta.addOn) * 100) / 100;
  return `$${Number.isInteger(taxed) ? taxed : taxed.toFixed(2)} with tax`;
}

export function goalFromText(text: string): Goal | null {
  const t = text.toLowerCase();
  if (/\b(proof|proofread|proofreading|edit|spelling|grammar)\b/.test(t)) return "proof";
  if (/\b(research|source|sources|cite|citation)\b/.test(t)) return "research";
  if (/\b(host|hosting|deploy|website|site)\b/.test(t)) return "host";
  if (/\b(code|coding|bug|program|developer|script)\b/.test(t)) return "code";
  if (/\b(agent|automate|automation|bot)\b/.test(t)) return "agent";
  if (/\b(learn|course|study|teach)\b/.test(t)) return "learn";
  if (/\b(free|try|trial)\b/.test(t)) return "try";
  if (/\b(write|writing|draft|essay)\b/.test(t)) return "write";
  return null;
}

export function pricePlace(country: CountryCode) {
  return countryByCode(country);
}

export function pricePick(goal: Goal, country: CountryCode) {
  const spaces = modelSpaces(goal, country);
  const lead = spaces.find((item) => item.recommended) ?? spaces[0];
  const other = spaces.find((item) => item !== lead) ?? spaces[1];
  return {
    place: countryByCode(country),
    main: { provider: lead.model, name: lead.plan, free: lead.price === "Free" },
    other: { provider: other.model, name: other.plan },
    mainPrice: lead.price,
    otherPrice: other.price,
    why: lead.better,
  };
}


const BETTER: Record<ModelId, Record<Goal, string>> = {
  claude: {
    proof: "Better at reading a document and marking what is wrong.",
    write: "Better at a long piece of new writing.",
    research: "Fine at a draft, weaker when you need the sources listed.",
    host: "Can help you write the site. Hosting is not the thing it is built for.",
    code: "Better when you code and stay in the loop.",
    agent: "Claude Code is strong. The wider agent tools are not its edge.",
    learn: "A clean place to practise writing.",
    try: "A clean free chat, with a tight cap.",
  },
  chatgpt: {
    proof: "Can proofread, and also make a picture of the point.",
    write: "Better when the writing also needs images or search.",
    research: "Search is there. The citations are less the point than Perplexity.",
    host: "Can build the pages with you. You still host them somewhere else.",
    code: "Better if you already live in Codex.",
    agent: "Better when the agent should use images, search and the wider tools.",
    learn: "Useful if you want pictures while you learn.",
    try: "The widest free door: chat, images and search.",
  },
  kimi: {
    proof: "Not the first choice for a careful edit.",
    write: "A lower price, not a better editor.",
    research: "Has deep research on the paid plan. Sources are not its reputation.",
    host: "Better here. The paid plan includes putting a site on the web.",
    code: "A cheaper way into a coding plan.",
    agent: "Agent tools without paying for a Max plan.",
    learn: "A free start, with less teaching material around it.",
    try: "A free start beside the bigger names.",
  },
  perplexity: {
    proof: "It will find sources. It is not an editor.",
    write: "Better for the facts inside the writing than for the prose.",
    research: "Better when the job is a question that needs sources.",
    host: "It will research the stack. It will not host the site.",
    code: "Useful for looking up the error. Not where you write the app.",
    agent: "Computer can run tasks. It is still a research product first.",
    learn: "Better when learning means reading sourced answers.",
    try: "A free search, with very few of the stronger answers.",
  },
};

const MORE: Record<ModelId, string> = {
  claude:
    "Pro is the normal paid plan. The 20 work units are Anthropic’s own “5× Free” written out, on a 5-hour window. Max and Ultra cost more and, on an ordinary day, do the same job.",
  chatgpt:
    "Plus is the normal paid plan, about the same sticker as Claude Pro. A work-unit count is not published, so this card does not invent one. Pro 100 and above are for people who already hit the cap.",
  kimi:
    "Plus is $19 a month in the US and includes Kimi Code plus website deployment. Credits are still sold as 2×, 5× and 10×. No local tax line is published, so a taxed figure here is the US list plus this country’s rate.",
  perplexity:
    "Pro is $20 a month in the US, or $200 for the year. Max is $200 and is more than a normal week of questions. No work-unit count is published. The free plan allows very few of the stronger searches.",
};

export function modelSpaces(goal: Goal | null, country: CountryCode) {
  const winner = goal ? WINNER[goal] : null;
  const freeTier = goal === "learn" || goal === "try";
  const claudePlan = PLANS.find((plan) => plan.id === (freeTier ? "claude-free" : "claude-pro"))!;
  const gptPlan = PLANS.find((plan) => plan.id === (freeTier ? "chatgpt-free" : "chatgpt-plus"))!;
  const claudeWeb = webPrice(claudePlan, country, true);
  const gptWeb = webPrice(gptPlan, country, true);
  const showPaidKimi = !freeTier;
  const showPaidPplx = goal === "research";
  const line = (id: ModelId) => (goal ? BETTER[id][goal] : GENERAL[id]);

  return [
    {
      id: "claude" as const,
      model: "Claude",
      plan: claudePlan.name,
      price: claudePlan.free ? "Free" : (claudeWeb.taxed ?? claudeWeb.listed),
      units: claudePlan.free ? "4" : "20",
      window: "every 5 hours",
      unitsNote: "Anthropic’s own multiple, written as a count.",
      better: line("claude"),
      more: MORE.claude,
      href: "https://claude.ai",
      recommended: winner === "claude",
    },
    {
      id: "chatgpt" as const,
      model: "ChatGPT",
      plan: gptPlan.name,
      price: gptPlan.free ? "Free" : (gptWeb.taxed ?? gptWeb.listed),
      units: null as string | null,
      window: "a count is not published",
      unitsNote: "Same space as Claude. OpenAI has not filled the number.",
      better: line("chatgpt"),
      more: MORE.chatgpt,
      href: "https://chatgpt.com",
      recommended: winner === "chatgpt",
    },
    {
      id: "kimi" as const,
      model: "Kimi",
      plan: showPaidKimi ? "Plus" : "Free",
      price: showPaidKimi ? usdBill(19, country) : "Free",
      units: null as string | null,
      window: "sold as credit multiples, not a count",
      unitsNote: showPaidKimi ? "USD list." : "A free start.",
      better: line("kimi"),
      more: MORE.kimi,
      href: "https://www.kimi.ai",
      recommended: winner === "kimi",
    },
    {
      id: "perplexity" as const,
      model: "Perplexity",
      plan: showPaidPplx ? "Pro" : "Free",
      price: showPaidPplx ? usdBill(20, country) : "Free",
      units: null as string | null,
      window: "a count is not published",
      unitsNote: showPaidPplx ? "USD list. Pro, not Max." : "Limited stronger searches.",
      better: line("perplexity"),
      more: MORE.perplexity,
      href: "https://www.perplexity.ai",
      recommended: winner === "perplexity",
    },
  ];
}

const GENERAL: Record<ModelId, string> = {
  claude: "Strongest at long writing and at coding with you.",
  chatgpt: "Widest everyday set: images, search and an agent.",
  kimi: "Lower price, and the paid plan can put a site on the web.",
  perplexity: "The one to open when the job needs sources.",
};