'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/database';

interface Coupon {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discountAmount: number;
}

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    appliedCoupon: Coupon | null;
    addItem: (product: Omit<CartItem, 'id' | 'customer_id'>) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    applyCoupon: (coupon: Coupon) => void;
    removeCoupon: () => void;
    getTotal: () => number;
    getItemCount: () => number;
    getShipping: () => number;
    getTax: () => number;
    getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            appliedCoupon: null,

            addItem: (product) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.product_id === product.product_id
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product_id === product.product_id
                                    ? { ...item, quantity: item.quantity + product.quantity }
                                    : item
                            ),
                        };
                    }

                    return {
                        items: [...state.items, product],
                    };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product_id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.product_id === productId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [], appliedCoupon: null });
            },

            applyCoupon: (coupon) => {
                set({ appliedCoupon: coupon });
            },

            removeCoupon: () => {
                set({ appliedCoupon: null });
            },

            getTotal: () => {
                const state = get();
                return state.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                const state = get();
                return state.items.reduce((count, item) => count + item.quantity, 0);
            },

            getShipping: () => {
                const total = get().getTotal();
                return total >= 499 ? 0 : 49;
            },

            getTax: () => {
                const subtotal = get().getTotal();
                return Math.round(subtotal * 0.18);
            },

            getGrandTotal: () => {
                const state = get();
                const subtotal = state.getTotal();
                const shipping = state.getShipping();
                const tax = state.getTax();
                const discount = state.appliedCoupon?.discountAmount || 0;
                return subtotal + shipping + tax - discount;
            },
        }),
        {
            name: 'healmitra-cart',
        }
    )
);
