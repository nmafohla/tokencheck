const SCHOOLS = [
  {
    name: "Google",
    kicker: "Learn the tools",
    intro: "Free workshops and a longer certificate. Gemini is the app. These courses teach the work around it.",
    links: [
      {
        title: "Grow with Google: AI training",
        href: "https://grow.google/ai",
        note: "Free workshops, including Gemini for everyday work.",
      },
      {
        title: "Google AI Professional Certificate",
        href: "https://grow.google/ai-professional-control/",
        note: "Eight courses, from fundamentals to building a small app. No experience required.",
      },
      {
        title: "Gemini",
        href: "https://gemini.google.com",
        note: "The product the courses assume you can open.",
      },
    ],
  },
  {
    name: "Antigravity",
    kicker: "Google’s agent desk",
    intro:
      "Antigravity is where an agent plans and runs the job. It is free to install, with a quota. These are Google’s own lessons, not a third-party summary.",
    links: [
      {
        title: "Getting started",
        href: "https://codelabs.developers.google.com/getting-started-google-antigravity",
        note: "Official codelab. Install, agents, projects.",
      },
      {
        title: "Working remotely",
        href: "https://codelabs.developers.google.com/working-remotely-with-google-antigravity",
        note: "Official codelab. Remote control of your machine, and cloud agents.",
      },
      {
        title: "Antigravity docs",
        href: "https://antigravity.google/docs",
        note: "Product reference. Download is on antigravity.google.",
      },
    ],
  },
  {
    name: "Anthropic",
    kicker: "Claude Academy",
    intro: "Free courses from Anthropic. Start with Claude 101, then the fluency framework if you want a way to decide what to hand over.",
    links: [
      {
        title: "Claude 101",
        href: "https://academy.claude.com/products/claude/courses/claude-101",
        note: "13 lessons · about 2.5 hours. First chat through projects and tools.",
      },
      {
        title: "AI Fluency: framework and foundations",
        href: "https://academy.claude.com/products/claude/courses/ai-fluency-framework-and-foundations",
        note: "14 lessons · about 4 hours. Delegation, description, discernment, diligence.",
      },
      {
        title: "AI Fluency for builders",
        href: "https://academy.claude.com/products/claude/courses/ai-fluency-for-builders",
        note: "9 lessons · about 3 hours. From the problem to something shipped.",
      },
      {
        title: "All Claude courses",
        href: "https://academy.claude.com/products/claude/courses",
        note: "The full Academy catalogue, including students, educators, and small businesses.",
      },
    ],
  },
];

export function LearnPage() {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-teal uppercase">Learn</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">
        Academies, from the companies themselves.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        These are official courses, not reviews. Google for Gemini and general AI work.
        Antigravity for agents. Anthropic for Claude. None of them replace the missing
        work-unit meter. They teach you how to use the tools while that meter is still absent.
      </p>
      <div className="mt-10 space-y-12">
        {SCHOOLS.map((school) => (
          <section key={school.name}>
            <p className="text-xs font-medium tracking-widest text-teal uppercase">{school.kicker}</p>
            <h2 className="mt-2 font-display text-3xl text-ink">{school.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{school.intro}</p>
            <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card">
              {school.links.map((link) => (
                <li key={link.href} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-xl">
                    <p className="font-medium text-ink">{link.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{link.note}</p>
                  </div>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-line px-4 text-sm font-medium text-ink"
                  >
                    Open
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
