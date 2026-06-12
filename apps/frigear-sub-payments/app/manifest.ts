import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Frigear",
    start_url: "https://frigear.nu/",
    short_name: "Frigear",
    display_override: ["fullscreen", "minimal-ui"],
    display: "standalone",
    background_color: "#1e1b4b",
    theme_color: "#4c1d95",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/FGR-SVG.svg",
        sizes: "512x512",
        type: "image/svg",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    description:
      "Foreningen Frigear faciliterer, støtter, og driver frivillig non-profit projekter, med fokus på medlemsindflydelse og bæredygtighed.",
  };
}
