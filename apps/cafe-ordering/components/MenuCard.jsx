"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QtyButton } from "./QtyButton";

export default function MenuCard({ item }) {
  const addItem = useCartStore((s) => s.addItem);
  const decreaseItem = useCartStore((s) => s.decreaseItem);
  const qty = useCartStore((s) => s.getItemQty(item.id));

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 flex flex-col">
        {/* Image — next/image with proper sizing */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-100">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
              ☕
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm">{item.name}</h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">
          {item.description}
        </p>

        {/* Price + availability badge */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-sm">
            ${Number(item.price).toFixed(2)}
          </span>

          {item.is_available ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Available
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              Unavailable
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 space-y-2">
          {qty === 0 ? (
            <Button
              onClick={() => addItem(item)}
              disabled={!item.is_available}
              className="w-full rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              Add to Cart
            </Button>
          ) : (
            <>
              {/* Quantity controls */}
              <div className="flex items-center justify-center gap-3">
                <QtyButton onClick={() => decreaseItem(item.id)}>
                  <Minus size={14} />
                </QtyButton>

                <span className="w-6 text-center text-sm font-medium">
                  {qty}
                </span>

                <QtyButton onClick={() => addItem(item)}>
                  <Plus size={14} />
                </QtyButton>
              </div>

              {/* View cart — Link for client-side navigation */}
              <Button
                variant="outline"
                className="w-full rounded-full flex items-center gap-2"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart size={16} />
                  View Cart
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
