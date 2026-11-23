import { createFileRoute } from "@tanstack/react-router";
import { PurposePage } from "@/components/purpose-page";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/purpose")({
  component: PurposeRoute,
});

function PurposeRoute() {
  return (
    <SiteFrame active="purpose">
      <PurposePage />
    </SiteFrame>
  );
}
