import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedItems } from "@/services/menuItems";

export function useFeaturedItems() {
  return useQuery({
    queryKey: ["featured-items"],
    queryFn: fetchFeaturedItems,
    staleTime: 1000 * 60 * 5, // 5 minutes — homepage data changes rarely
  });
}
