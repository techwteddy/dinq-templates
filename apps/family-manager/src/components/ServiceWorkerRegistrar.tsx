"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed — non-critical
      });

      // Listen for navigation messages from SW (iOS fallback)
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "navigate" && event.data.url) {
          window.location.href = event.data.url;
        }
      });
    }
  }, []);

  return null;
}
