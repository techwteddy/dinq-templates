"use client";

import { useMenuFilterStore } from "@/hooks/useMenuFilterStore";
import clsx from "clsx";

/* =====================
   Main Component
===================== */
export default function CategoryFilters() {
  const { category, setCategory } = useMenuFilterStore();

  const categories = [
    { id: "drink", label: "Drink" },
    { id: "food", label: "Food" },
  ];

  return (
    <div className="space-y-2">
      {/* Main Categories */}
      <div className="flex justify-center">
        <div className="flex bg-white p-1 rounded-full shadow-sm">
          {categories.map((cat) => (
            <MainFilterButton
              key={cat.id}
              active={category === cat.id}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </MainFilterButton>
          ))}
        </div>
      </div>

      {/* Sub Categories */}
      <SubCategoryFilters />
    </div>
  );
}

/* =====================
   Sub Categories
===================== */
function SubCategoryFilters() {
  const { category, subCategory, setSubCategory } = useMenuFilterStore();

  const subCategoriesMap = {
    drink: [
      { id: "all", label: "All" },
      { id: "coffee", label: "Coffee" },
      { id: "non-coffee", label: "Non Coffee" },
    ],
    food: [
      { id: "all", label: "All" },
      { id: "bakery", label: "Bakery" },
      { id: "dessert", label: "Dessert" },
    ],
  };

  const subCategories = subCategoriesMap[category] || [];

  return (
    <div className="flex justify-center flex-wrap gap-2">
      {subCategories.map((sub) => (
        <SubFilterButton
          key={sub.id}
          active={subCategory === sub.id}
          onClick={() => setSubCategory(sub.id)}
        >
          {sub.label}
        </SubFilterButton>
      ))}
    </div>
  );
}

/* =====================
   Buttons
===================== */
function MainFilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        // flex-1 + min-w means the pill always fills evenly regardless of
        // how many categories exist — no more magic padding numbers
        "flex-1 min-w-[7rem] py-2 px-6 rounded-full text-sm font-semibold transition-all",
        active
          ? "bg-orange-500 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100",
      )}
    >
      {children}
    </button>
  );
}

function SubFilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-1.5 rounded-full text-sm transition-all border",
        active
          ? "bg-orange-500 text-white border-orange-500"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100",
      )}
    >
      {children}
    </button>
  );
}
