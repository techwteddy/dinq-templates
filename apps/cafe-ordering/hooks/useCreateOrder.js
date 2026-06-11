"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useCreateOrder({ onSuccess } = {}) {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const mutation = useMutation({
    mutationFn: async ({ customerName, phone, orderType, notes }) => {
      if (!items.length) {
        throw new Error("Your cart is empty");
      }

      // Prices and totals are recomputed server-side inside the create_order
      // RPC (a single atomic transaction). The client only sends item ids and
      // quantities — never prices — so they can't be tampered with in devtools.
      const { data: order, error } = await supabase
        .rpc("create_order", {
          p_customer_name: customerName,
          p_customer_phone: phone || null,
          p_type: orderType,
          p_notes: notes || null,
          p_items: items.map((item) => ({
            menu_item_id: item.id,
            quantity: item.quantity,
          })),
        })
        .single();

      if (error) throw error;

      return order;
    },

    onSuccess: (order) => {
      onSuccess?.(); // trigger isRedirecting before clearCart
      clearCart();
      toast.success(`Order ${order.order_number} placed successfully ☕`);
      router.push(`/order/success?order=${order.order_number}`);
    },

    onError: (error) => {
      toast.error(error?.message || "Something went wrong. Please try again.");
    },
  });

  return {
    placeOrder: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
