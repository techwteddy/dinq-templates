import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import ThemeSwitch from "@/components/ui/theme-switch";
import Footer from "@/components/layout/footer";
import ActiveSectionContextProvider from "@/context/active-section-context";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sakia Labs",
  description:
    "Sakia Labs | Empowering people and businesses with robust and elegant solutions. ✨🚀",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-50 text-gray-950 relative pt-16 lg:pt-28 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeContextProvider>
            <ActiveSectionContextProvider>
              {/* Skip to content link for keyboard navigation */}
              <a href="#main-content" className="skip-to-content">
                Skip to main content
              </a>
              <Header />
              <MobileNav />
              {children}
              <Footer />

              <Toaster position="top-right" />
              <ThemeSwitch />
            </ActiveSectionContextProvider>
          </ThemeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
