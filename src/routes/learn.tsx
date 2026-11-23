import { createFileRoute } from "@tanstack/react-router";
import { LearnPage } from "@/components/learn-page";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/learn")({
  component: LearnRoute,
});

function LearnRoute() {
  return (
    <SiteFrame active="learn">
      <LearnPage />
    </SiteFrame>
  );
}
