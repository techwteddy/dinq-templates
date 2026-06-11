// store/cartStore.js
import { create } from "zustand";

const STORAGE_KEY = "brew-bite-cart";

export const useCartStore = create((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);

    const updated = existing
      ? items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      : [...items, { ...product, quantity: 1 }];

    set({ items: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  decreaseItem: (id) => {
    const items = get().items;
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const updated =
      item.quantity === 1
        ? items.filter((i) => i.id !== id)
        : items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
          );

    set({ items: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  // Removes an item entirely regardless of quantity
  removeItem: (id) => {
    const updated = get().items.filter((i) => i.id !== id);
    set({ items: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  clearCart: () => {
    set({ items: [] });
    localStorage.removeItem(STORAGE_KEY);
  },

  getItemQty: (id) => get().items.find((i) => i.id === id)?.quantity || 0,

  totalPrice: () => get().items.reduce((t, i) => t + i.price * i.quantity, 0),
}));
