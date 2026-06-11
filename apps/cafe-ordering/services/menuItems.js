import { supabase } from "@/lib/supabase";

export async function fetchMenuItems({ category, subCategory }) {
  let query = supabase.from("menu_items").select("*").eq("is_available", true);

  if (category) {
    query = query.eq("category", category);
  }

  if (subCategory) {
    query = query.eq("sub_category", subCategory);
  }

  const { data, error } = await query.order("created_at", {
    ascending: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Guard against a successful response that returns no data (e.g. network
  // proxy swallowed the body). Returning undefined here would cause TanStack
  // Query to cache undefined and silently break downstream consumers.
  if (data == null) {
    throw new Error("No data returned from menu_items — possible network issue.");
  }

  return data;
}

// Fetches first 4 available drink items for the homepage
export async function fetchFeaturedItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, price, image_url, category")
    .eq("is_available", true)
    .eq("category", "drink")
    .order("created_at", { ascending: true })
    .limit(4);

  if (error) throw new Error(error.message);

  if (data == null) {
    throw new Error("No data returned from menu_items — possible network issue.");
  }

  return data;
}
