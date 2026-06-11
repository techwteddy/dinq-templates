import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import LeftSidebarAds from "@/components/LeftSidebarAds";
import RightSidebarAds from "@/components/RightSidebarAds";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AffinSight - Your Trusted Source for Affiliate Network Information",
  description: "Discover the best affiliate networks, offers, and programs. Compare features, commission rates, and find the perfect partner for your affiliate marketing strategy.",
  keywords: "affiliate networks, affiliate marketing, affiliate programs, affiliate offers, commission rates",
  authors: [{ name: "AffinSight" }],
  creator: "AffinSight",
  publisher: "AffinSight",
  robots: "index, follow",
  openGraph: {
    title: "AffinSight - Your Trusted Source for Affiliate Network Information",
    description: "Discover the best affiliate networks, offers, and programs. Compare features, commission rates, and find the perfect partner for your affiliate marketing strategy.",
    url: "https://www.affinsight.com",
    siteName: "AffinSight",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AffinSight - Your Trusted Source for Affiliate Network Information",
    description: "Discover the best affiliate networks, offers, and programs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        {/* Top Navigation */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
          <Navigation />
        </div>
        {/* Top Banner Ad Space */}
        <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <div className="max-w-screen-2xl mx-auto px-4 py-3">
            <div className="bg-white rounded-lg border border-amber-200 p-4 text-center text-amber-600 font-medium">
              🎯 Top Banner Advertisement Space
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-screen-2xl mx-auto min-h-[calc(100vh-56px)] pt-4 gap-4 px-2 md:px-6">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
