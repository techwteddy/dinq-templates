import { create } from "zustand";

export const useMenuFilterStore = create((set) => ({
  category: "drink",
  subCategory: "all",
  search: "",

  setCategory: (category) =>
    set({
      category,
      subCategory: "all",
      search: "",
    }),

  setSubCategory: (subCategory) => set({ subCategory }),

  setSearch: (search) => set({ search }),
}));
