import { createFileRoute } from "@tanstack/react-router";
import { ScentIndex } from "@/components/scent-index";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ScentIndex />;
}
