import { createFileRoute } from "@tanstack/react-router";
import { ResultPage } from "@/components/result-page";
import { SiteFrame } from "@/components/site-frame";
import { isGoal } from "@/lib/choose";
import { isFear, isLoad, isWeight } from "@/lib/weight";

export const Route = createFileRoute("/result")({
  validateSearch: (search: Record<string, unknown>) => ({
    goal: isGoal(search.goal) ? search.goal : undefined,
    weight: isWeight(search.weight) ? search.weight : undefined,
    fear: isFear(search.fear) ? search.fear : undefined,
    load: isLoad(search.load) ? search.load : undefined,
  }),
  component: ResultRoute,
});

function ResultRoute() {
  const search = Route.useSearch();
  return (
    <SiteFrame active="result">
      <ResultPage goal={search.goal} weight={search.weight} fear={search.fear} load={search.load} />
    </SiteFrame>
  );
}
