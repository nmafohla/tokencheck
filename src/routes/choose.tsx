import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/choose")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
