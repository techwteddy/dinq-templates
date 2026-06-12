"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useLocale } from "@/components/i18n/locale-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { editorialEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-full px-3 py-1.5 text-lg font-normal transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground/75 hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { t } = useLocale();

  const navItems = useMemo(
    () =>
      [
        { href: "/", label: t.nav.intro },
        { href: "/news", label: t.nav.news },
        { href: "/donate", label: t.nav.donate },
      ] as const,
    [t]
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
      initial={reduceMotion ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: editorialEase }}
    >
      <div className="mx-auto flex h-[110px] max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 flex-col leading-tight">
          <span className="font-heading text-[1.625rem] font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary/90">
            어린이 둥지
          </span>
          <span className="text-keep-words text-[1.2rem] font-normal tracking-[0.12em] text-muted-foreground">
            Ninho das Crianças
          </span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex"
          aria-label={t.nav.ariaMainNav}
        >
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
          <Link
            href="/donate"
            className={cn(
              buttonVariants({ size: "default" }),
              "ml-4 shrink-0 text-base shadow-glow-sm transition-[box-shadow,transform] hover:shadow-glow"
            )}
          >
            {t.nav.donateCta}
          </Link>
          <LanguageToggle className="ml-2 shrink-0" />
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link
            href="/donate"
            className={cn(
              buttonVariants({ size: "default" }),
              "text-base shadow-glow-sm"
            )}
          >
            {t.nav.donateMobile}
          </Link>
          <LanguageToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={{
              duration: reduceMotion ? 0.15 : 0.35,
              ease: editorialEase,
            }}
          >
            <div className="overflow-hidden px-4 py-5">
              <nav className="flex flex-col gap-4" aria-label={t.nav.ariaMobileNav}>
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
