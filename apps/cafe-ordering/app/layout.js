import "./globals.css";
import Navbar from "@/components/Navbar";
import StoreToaster from "@/components/StoreToaster";
import ReactQueryProvider from "@/lib/react-query-provider";
import { CartHydrator } from "@/store/CartHydrator";

export const metadata = {
  title: {
    default: "Brew & Bite — Crafted Coffee & Bites",
    template: "%s | Brew & Bite",
  },
  description:
    "Order your favourite coffee and bites online. Quick, easy, and delicious. Pickup or delivery available.",
  keywords: ["coffee", "cafe", "food", "delivery", "brew", "bites", "online order"],
  openGraph: {
    title: "Brew & Bite — Crafted Coffee & Bites",
    description:
      "Order your favourite coffee and bites online. Quick, easy, and delicious.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <ReactQueryProvider>
          <Navbar />
          <main>{children}</main>
          <CartHydrator />
          <StoreToaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
