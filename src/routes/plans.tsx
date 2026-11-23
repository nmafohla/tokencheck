import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/plans")({
  component: PlansRoute,
});

function PlansRoute() {
  return (
    <SiteFrame active="plans">
      <HomePage />
    </SiteFrame>
  );
}
