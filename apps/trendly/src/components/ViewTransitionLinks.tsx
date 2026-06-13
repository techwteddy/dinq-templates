"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Mounts once at the app root. Intercepts all <a> clicks on same-origin
 * URLs and routes them through document.startViewTransition(...) so
 * Next.js soft navigations animate via the View Transitions API.
 * Browsers without the API just navigate normally with no animation.
 */
export function ViewTransitionLinks() {
  const router = useRouter();

  useEffect(() => {
    const supports = typeof document !== "undefined" && "startViewTransition" in document;
    if (!supports) return;

    const onClick = (e: MouseEvent) => {
      // Respect modifier keys, middle-click, etc.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      if (!target) return;
      // Only intercept same-origin internal links.
      const href = target.getAttribute("href");
      if (!href) return;
      if (target.target && target.target !== "_self") return;
      if (target.hasAttribute("download")) return;
      if (href.startsWith("http") && !href.startsWith(window.location.origin)) return;
      if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;

      e.preventDefault();
      const url = new URL(target.href);
      const path = url.pathname + url.search;
      // @ts-expect-error - startViewTransition is not yet in TS lib types.
      document.startViewTransition(() => router.push(path));
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
