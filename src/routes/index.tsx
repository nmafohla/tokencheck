import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";
import { WelcomePage } from "@/components/welcome-page";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <SiteFrame active="welcome">
      <WelcomePage />
    </SiteFrame>
  );
}
