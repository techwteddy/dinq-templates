"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <Card className="bg-white rounded-3xl shadow-sm">
      <CardContent className="py-16 flex flex-col items-center text-center gap-4">
        <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center">
          <ShoppingCart className="h-7 w-7 text-orange-500" />
        </div>

        <h2 className="text-xl font-semibold">Your cart is empty</h2>

        <p className="text-sm text-muted-foreground max-w-xs">
          Looks like you haven’t added anything yet. Browse the menu and pick
          something you love
        </p>

        <Button
          asChild
          className="mt-4 rounded-full bg-orange-500 hover:bg-orange-600 px-8"
        >
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
