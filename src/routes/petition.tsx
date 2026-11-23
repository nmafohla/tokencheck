import { createFileRoute } from "@tanstack/react-router";
import { PetitionPanel } from "@/components/petition-panel";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/petition")({
  component: PetitionRoute,
});

function PetitionRoute() {
  return (
    <SiteFrame active="petition">
      <PetitionPanel />
    </SiteFrame>
  );
}
