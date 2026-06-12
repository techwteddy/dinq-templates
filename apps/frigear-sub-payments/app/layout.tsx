import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { PropsWithChildren, Suspense } from "react";
import "styles/main.css";
import { Toaster } from "@/components/ui/Toasts/toaster";
import { getURL } from "@/utils/helpers";

const meta = {
  title: {
    template: "%s | Frigear",
    default: "Non-profit | Frigear",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  description:
    "Foreningen Frigear faciliterer, støtter, og driver frivillig non-profit projekter, med fokus på medlemsindflydelse og bæredygtighed.",
  cardImage: "/og.png",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  favicon: "/favicon.ico",
  url: getURL(),
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    generator: "Next.js",
    applicationName: "Frigear App",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: "/",
      languages: {
        "da-DK": "/da-DK",
        "de-DE": "/de-DE",
        "en-US": "/en-US",
      },
    },
    keywords: [
      "Foreningen Frigear, Frigear, Non-profit, Frivillige, Roskilde festival frivillig, bar, Arena scenen, Frigear Bar, Forening, Almennyttig, Frivillig-drevet, Frivillig-forening, Foreningsliv",
    ],
    authors: [{ name: "Morten Six", url: "https://block-folio.netlify.app/" }],
    creator: "Morten Six",
    publisher: "Frigear",
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: "website",
      siteName: "Frigear App",
    },
    twitter: {
      card: "summary_large_image",
      site: "https://frigear.nu/",
      creator: "Morten Six",
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="da">
      <body className="bg-black loading">
        <Navbar />
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        >
          {children}
        </main>
        <Footer />
        <Suspense>
          <Toaster />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
