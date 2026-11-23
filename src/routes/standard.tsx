import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/standard")({
  beforeLoad: () => {
    throw redirect({ to: "/choose" });
  },
});
