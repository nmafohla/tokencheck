import clsx from "clsx";

const STEPS = ["What you need", "Your price"];

export function Steps({ current }: { current: 1 | 2 }) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Stages">
      {STEPS.map((label, index) => {
        const on = index + 1 === current;
        return (
          <li key={label}>
            <span
              className={clsx(
                "inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm",
                on ? "border-ink bg-ink text-white" : "border-line text-muted",
              )}
            >
              <span className={clsx("font-semibold", on ? "text-white" : "text-ink")}>{index + 1}</span>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
