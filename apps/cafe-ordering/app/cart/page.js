"use client";

import { useState, useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import EmptyCart from "@/components/EmptyCart";
import { CartItem, SummaryRow } from "@/components/CartComponents";

export default function CartPage() {
  /* ── Hydration safe ── */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  /* ── Cart store ── */
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());

  const tax = +(totalPrice * 0.1).toFixed(2);
  const grandTotal = (totalPrice + tax).toFixed(2);

  /* ── Form state ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState("pickup");
  const [isRedirecting, setIsRedirecting] = useState(false);

  /* ── Order mutation ── */
  const { placeOrder, isLoading } = useCreateOrder({
    onSuccess: () => setIsRedirecting(true),
  });

  const handlePlaceOrder = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const phoneRegex = /^[\d\s\-+()]{7,15}$/;
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!phoneRegex.test(phone.trim())) {
      toast.error("Please enter a valid phone number");
      return;
    }

    placeOrder({
      customerName: name,
      phone,
      notes,
      orderType,
      items,
      subtotal: totalPrice,
      tax,
      total: grandTotal,
    });
  };

  /* ── Render ── */
  if (!mounted) return null;

  // Show full-page loader while redirecting (after cart is cleared)
  if (isRedirecting) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="animate-spin text-orange-500" />
        <p className="text-gray-500 text-sm">Redirecting to your order…</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-20">
        <EmptyCart />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pt-6 pb-14">
      <div className="grid gap-10 lg:grid-cols-3">
        {/* ── Left: cart items ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>
                Your Cart{" "}
                <span className="text-sm font-normal text-gray-400">
                  ({items.reduce((s, i) => s + i.quantity, 0)} item
                  {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Right: order details + summary ── */}
        <div className="space-y-6">
          {/* Order type */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-center">Order Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={orderType}
                onValueChange={setOrderType}
                className="flex justify-center gap-6"
              >
                <Label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="pickup" /> Pickup
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="delivery" /> Delivery
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Customer details */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name *"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number *"
              />
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special notes (optional)"
              />
            </CardContent>
          </Card>

          {/* Order summary */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SummaryRow
                label="Subtotal"
                value={`$${totalPrice.toFixed(2)}`}
              />
              <SummaryRow label="Tax (10%)" value={`$${tax.toFixed(2)}`} />
              <div className="flex justify-between font-semibold text-lg border-t pt-3">
                <span>Total</span>
                <span>${grandTotal}</span>
              </div>

              <Button
                disabled={isLoading || isRedirecting}
                onClick={handlePlaceOrder}
                className="w-full rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Placing order…
                  </span>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
