export type Goal = "proof" | "write" | "research" | "host" | "code" | "agent" | "learn" | "try";
export type Pace = "light" | "steady" | "heavy";

export type Pick = {
  title: string;
  why: string;
  links: { label: string; href: string; note: string }[];
};

const CLAUDE = "https://claude.ai";
const CHATGPT = "https://chatgpt.com";
const KIMI = "https://www.kimi.ai";
const QWEN = "https://chat.qwen.ai";
const ANTIGRAVITY = "https://antigravity.google/download";
const ACADEMY = "https://academy.claude.com/products/claude/courses/claude-101";
const GROW = "https://grow.google/ai";

const GOALS: Goal[] = ["proof", "write", "research", "host", "code", "agent", "learn", "try"];
const PACES: Pace[] = ["light", "steady", "heavy"];

export function isGoal(value: unknown): value is Goal {
  return typeof value === "string" && GOALS.includes(value as Goal);
}

export function isPace(value: unknown): value is Pace {
  return typeof value === "string" && PACES.includes(value as Pace);
}

export function choose(goal: Goal, pace: Pace): Pick {
  if (goal === "learn") {
    return {
      title: "Don’t buy a plan yet. Learn the loop first.",
      why: "A course will teach you more than a week of guessing at tokens. Start with Claude 101 and Google’s free AI training, then come back and pick a free tier.",
      links: [
        { label: "Claude 101", href: ACADEMY, note: "Anthropic, free" },
        { label: "Grow with Google AI", href: GROW, note: "Google, free workshops" },
      ],
    };
  }

  if (goal === "try" || pace === "light") {
    if (goal === "code" || goal === "agent") {
      return {
        title: "Start free, in the tool you’ll actually open.",
        why: "Claude Free will run short coding chats, with a 5-hour cap and no Claude Code. Antigravity is free to install and gives a quota for an agent in the editor. Neither publishes how many work units that quota is.",
        links: [
          { label: "Claude Free", href: CLAUDE, note: "claude.ai" },
          { label: "Kimi", href: KIMI, note: "Kimi Code is on Plus, $19" },
          { label: "Qwen Chat", href: QWEN, note: "Free" },
        ],
      };
    }
    return {
      title: "Use a free tier until it gets in the way.",
      why: "For a few questions a week, Claude Free and ChatGPT Free are enough. Claude is the cleaner long-writing chat. ChatGPT Free adds images and search, and it may show ads. Gemini is the third free door.",
      links: [
        { label: "Claude Free", href: CLAUDE, note: "claude.ai" },
        { label: "ChatGPT Free", href: CHATGPT, note: "chatgpt.com" },
        { label: "Qwen Chat", href: QWEN, note: "Free. Alibaba" },
        { label: "Kimi", href: KIMI, note: "Free start. Moonshot" },
      ],
    };
  }

  if (goal === "agent" && pace === "heavy") {
    return {
      title: "Claude Max, and Antigravity if the agent lives in the editor.",
      why: "Max is 5× Pro, still on a 5-hour and weekly cap, at $100 before tax. Ultra is the step after that. Antigravity’s frontier models sit on a paid Google AI plan. None of them tell you the job in work units before you start.",
      links: [
        { label: "Claude", href: CLAUDE, note: "Max is on the account page" },
        { label: "Get Antigravity", href: ANTIGRAVITY, note: "Then check Google AI plans" },
      ],
    };
  }

  if (goal === "agent") {
    return {
      title: "Claude Pro for Claude Code, Antigravity if you want an agent in the editor.",
      why: "Pro is the first Claude plan with Claude Code. Antigravity is the Google agent desk: free to install, with a quota, and higher models on a paid Google plan. Compare the free quotas for a week before you pay.",
      links: [
        { label: "Claude Pro", href: CLAUDE, note: "From $20 before tax" },
        { label: "Kimi Pro", href: KIMI, note: "$39. Still sold as 2× credits" },
      ],
    };
  }

  if (goal === "code" && pace === "heavy") {
    return {
      title: "Claude Max if you code all day. ChatGPT Pro if you live in Codex.",
      why: "Max is 5× Pro at $100 a month before tax. ChatGPT Pro starts at $100 and drops the 5-hour Work and Codex limit, with weekly caps still on. Read the sheet before you pick — the plain work unit is missing on both.",
      links: [
        { label: "Claude", href: CLAUDE, note: "Max" },
        { label: "ChatGPT", href: CHATGPT, note: "Pro 100" },
      ],
    };
  }

  if (goal === "code") {
    return {
      title: "Claude Pro. ChatGPT Plus if you already work in ChatGPT.",
      why: "Pro is $20 before tax, or $17 a month if you pay the year in the US, and it includes Claude Code. Plus is $20 and includes Codex, with a roughly 5-hour window. Both still hide the work unit.",
      links: [
        { label: "Claude Pro", href: CLAUDE, note: "claude.ai" },
        { label: "ChatGPT Plus", href: CHATGPT, note: "chatgpt.com" },
        { label: "Kimi Plus", href: KIMI, note: "$19, includes Kimi Code" },
      ],
    };
  }

  if (pace === "heavy") {
    return {
      title: "Claude Max for long writing days. ChatGPT Pro if you want the heavier research tools.",
      why: "A full day of drafts will hit a Pro or Plus cap. Max multiplies Claude’s allowance by five and still resets every five hours and every week. Pro 100 is the ChatGPT step up, at $100 before tax.",
      links: [
        { label: "Claude", href: CLAUDE, note: "Max" },
        { label: "ChatGPT", href: CHATGPT, note: "Pro" },
      ],
    };
  }

  return {
    title: "Claude Pro or ChatGPT Plus. Same sticker, different shape.",
    why: "Both are about $20 before tax. Claude Pro is the better long-document writer and adds Claude Code. ChatGPT Plus is the broader daily tool: research, images, and Codex, and it may still limit you on a 5-hour window.",
    links: [
      { label: "Claude Pro", href: CLAUDE, note: "claude.ai" },
      { label: "ChatGPT Plus", href: CHATGPT, note: "chatgpt.com" },
    ],
  };
}
