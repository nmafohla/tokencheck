export type Weight = "med" | "high" | "max" | "ultra";
export type Fear = "miss" | "failed" | "huge";
export type Load = "one" | "few" | "all";

export const WEIGHTS: {
  id: Weight;
  label: string;
  jobs: string;
  spend: string;
  dial: string;
}[] = [
  {
    id: "med",
    label: "Medium",
    jobs: "About 9 in 10 ordinary jobs",
    spend: "A small bite of the cap",
    dial: "A page, a bug, a reply, a brief.",
  },
  {
    id: "high",
    label: "High",
    jobs: "The long or careful ones",
    spend: "Noticeably more of the cap",
    dial: "Use it after Medium came back thin.",
  },
  {
    id: "max",
    label: "Max",
    jobs: "Almost the same words as Medium",
    spend: "Burns the window",
    dial: "Several hard jobs, or High already failed.",
  },
  {
    id: "ultra",
    label: "Ultra",
    jobs: "The last sliver Medium missed",
    spend: "The whole week, if you live here",
    dial: "You already hit Max. Not a starting point.",
  },
];

export function isWeight(value: unknown): value is Weight {
  return value === "med" || value === "high" || value === "max" || value === "ultra";
}

export function isFear(value: unknown): value is Fear {
  return value === "miss" || value === "failed" || value === "huge";
}

export function isLoad(value: unknown): value is Load {
  return value === "one" || value === "few" || value === "all";
}

export function solveWeight(fear: Fear, load: Load): { weight: Weight; overkill: boolean; line: string } {
  if (fear === "miss" && load === "one") {
    return {
      weight: "med",
      overkill: true,
      line: "Medium would have done the same thing. Max is the fear, not the job.",
    };
  }
  if (fear === "miss" && load === "few") {
    return {
      weight: "high",
      overkill: true,
      line: "High covers a day of normal work. Max does not make the answer better.",
    };
  }
  if (fear === "miss" && load === "all") {
    return {
      weight: "max",
      overkill: false,
      line: "The day is long enough for Max. Ultra waits until Max actually runs out.",
    };
  }
  if (fear === "failed" && load === "one") {
    return {
      weight: "high",
      overkill: false,
      line: "Medium missed it once. Step up to High for this job, then drop back.",
    };
  }
  if (fear === "failed" && load === "few") {
    return {
      weight: "max",
      overkill: false,
      line: "High already failed on a real day of work. Max is earned here.",
    };
  }
  if (fear === "huge" && load !== "all") {
    return {
      weight: "high",
      overkill: false,
      line: "A big job still starts on High. Max is for when that pass is not enough.",
    };
  }
  return {
    weight: "ultra",
    overkill: false,
    line: "Several huge jobs, all day, and a lower weight already failed. That is Ultra.",
  };
}

export function paceFor(weight: Weight): "light" | "steady" | "heavy" {
  return weight === "max" || weight === "ultra" ? "heavy" : "steady";
}
