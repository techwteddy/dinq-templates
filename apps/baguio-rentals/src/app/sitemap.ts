import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .neq("availability", "occupied");

  const listingEntries = (listings ?? []).map((listing) => ({
    url: `https://baguiorentals.com/listings/${listing.id}`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: "https://baguiorentals.com", lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: "https://baguiorentals.com/listings", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://baguiorentals.com/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://baguiorentals.com/terms", lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: "https://baguiorentals.com/privacy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    ...listingEntries,
  ];
}
