import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems } from "@/services/menuItems";
import { useMenuFilterStore } from "@/hooks/useMenuFilterStore";
import { useMemo } from "react";

export function useMenuItems() {
  const { category, subCategory, search } = useMenuFilterStore();

  const query = useQuery({
    queryKey: ["menu-items", category, subCategory],
    queryFn: () =>
      fetchMenuItems({
        category,
        subCategory: subCategory === "all" ? null : subCategory,
      }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Client-side search filter — avoids a Supabase round-trip on every keystroke
  const filtered = useMemo(() => {
    if (!query.data) return [];
    if (!search?.trim()) return query.data;

    const term = search.trim().toLowerCase();
    return query.data.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)),
    );
  }, [query.data, search]);

  return {
    ...query,
    data: filtered,
  };
}
