import { notFound } from "next/navigation";
import Generator from "./Generator";

export type AppConfig = {
  id: string;
  name: string;
  icon: string;
  presets: { title: string; body: string }[];
};

const APPS: Record<string, AppConfig> = {
  shady: {
    id: "shady",
    name: "Shady",
    icon: "/icons/shady.png",
    presets: [
      { title: "johndoe_ started following you", body: "See all your new followers" },
      { title: "5 people unfollowed you today", body: "Open Shady to see who" },
      { title: "New follower alert 👀", body: "Someone is watching your profile" },
      { title: "Weekly report is ready", body: "You gained 12 followers this week" },
    ],
  },
};

export default async function AppPage({ params }: { params: Promise<{ app: string }> }) {
  const { app } = await params;
  const config = APPS[app];
  if (!config) notFound();
  return <Generator config={config} />;
}
