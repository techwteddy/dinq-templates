import { getProjects, getNews, getHeroSlides, getStats, getHomeContent } from "@/sanity/lib/queries";
import { createClient } from "@supabase/supabase-js";
import HomeClient from "./HomeClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    },
  }
);

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [projects, news, heroSlides, stats, homeContent, { data: donors }] = await Promise.all([
    getProjects(),
    getNews(),
    getHeroSlides(),
    getStats(),
    getHomeContent(),
    supabase.from("donors").select("project, amount").eq("status", "completed"),
  ]);

  const raisedByProject: Record<string, number> = {};
  for (const donor of donors || []) {
    if (!donor.project || donor.project === "general" || donor.project === "zakat") continue;
    raisedByProject[donor.project] = (raisedByProject[donor.project] || 0) + (donor.amount || 0);
  }
  for (const project of projects) {
    raisedByProject[project.id] = (raisedByProject[project.id] || 0) + (project.raised || 0);
  }

  return (
    <HomeClient
      projects={projects}
      news={news}
      heroSlides={heroSlides}
      stats={stats}
      homeContent={homeContent}
      raisedByProject={raisedByProject}
    />
  );
}