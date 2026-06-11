"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [menuMap, setMenuMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;

    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (orderError || !orderData) {
        setError("Order not found");
        setLoading(false);
        return;
      }

      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("id, quantity, item_price, menu_item_id")
        .eq("order_id", orderData.id);

      if (itemsError) {
        setError("Failed to load order items");
        setLoading(false);
        return;
      }

      const menuIds = [...new Set(orderItems.map((i) => i.menu_item_id))];

      const { data: menuItems, error: menuError } = await supabase
        .from("menu_items")
        .select("id, name, image_url")
        .in("id", menuIds);

      if (menuError) {
        setError("Failed to load menu items");
        setLoading(false);
        return;
      }

      const map = {};
      menuItems.forEach((m) => (map[m.id] = m));

      setOrder(orderData);
      setItems(orderItems);
      setMenuMap(map);
      setLoading(false);
    };

    loadOrder();
  }, [orderNumber]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.item_price * i.quantity, 0);
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const qrValue = `ORDER:${order.order_number}`;

  return (
    <>
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 pb-6">
        <Card className="w-full max-w-xl rounded-3xl shadow-xl">
          <CardHeader className="text-center space-y-3">
            <CheckCircle2 className="h-16 w-16 mx-auto text-orange-500" />
            <CardTitle className="text-3xl font-bold">
              Order Confirmed!
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your order #{order.order_number} has been placed successfully.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-2xl bg-muted/40 p-4 space-y-3">
              <h3 className="text-center font-semibold">Order Details</h3>

              {items.map((item) => {
                const menu = menuMap[item.menu_item_id];
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border bg-muted shrink-0">
                      {menu?.image_url && (
                        <Image
                          src={menu.image_url}
                          alt={menu.name ?? "Menu item"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 text-sm font-medium">
                      {menu?.name}
                    </div>

                    <div className="text-sm font-medium">
                      ${(item.item_price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full rounded-full bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowQR(true)}
            >
              Show to Cashier
            </Button>

            <Link
              href="/"
              className="block text-center text-sm text-muted-foreground hover:underline"
            >
              Return to Home
            </Link>
          </CardContent>
        </Card>
      </section>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-sm rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">Show to Cashier</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-2xl border bg-white p-4">
              <QRCodeSVG value={qrValue} size={180} />
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Please show this QR code or order number at the cashier.
            </p>

            <p className="font-semibold text-lg">Order #{order.order_number}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
