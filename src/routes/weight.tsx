import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";
import { WeightPage } from "@/components/weight-page";
import { isGoal } from "@/lib/choose";

export const Route = createFileRoute("/weight")({
  validateSearch: (search: Record<string, unknown>) => ({
    goal: isGoal(search.goal) ? search.goal : undefined,
  }),
  component: WeightRoute,
});

function WeightRoute() {
  const { goal } = Route.useSearch();
  return (
    <SiteFrame active="weight">
      <WeightPage goal={goal} />
    </SiteFrame>
  );
}
