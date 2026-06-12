"use client";

import Link from "next/link";
import {
  Apple,
  BookOpen,
  Building2,
  HeartHandshake,
  PartyPopper,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import type { DonatePageContent } from "@/lib/data/site-content";
import { cn } from "@/lib/utils";

const whyIcons = [Apple, BookOpen, HeartHandshake, PartyPopper, Building2] as const;

export function DonatePageBody({ content }: { content: DonatePageContent }) {
  const { t } = useLocale();
  const d = t.donate;

  const whyPoints = d.whyPoints.map((item, i) => ({
    ...item,
    icon: whyIcons[i]!,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {d.kicker}
        </p>
        <h1 className="mt-2 text-keep-words font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {d.title}
        </h1>
        <p className="mt-3 whitespace-pre-line text-keep-words text-muted-foreground">{d.intro}</p>
      </header>

      <section
        className="mt-16 scroll-mt-24"
        id="why"
        aria-labelledby="why-heading"
      >
        <h2
          id="why-heading"
          className="font-heading text-2xl font-semibold text-foreground sm:text-3xl"
        >
          {d.whyHeading}
        </h2>
        <p className="mt-4 max-w-3xl whitespace-pre-line text-keep-words text-muted-foreground">{d.whyLead}</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyPoints.map(({ title, body, icon: Icon }, i) => (
            <li
              key={`why-${i}`}
              className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm ring-1 ring-foreground/5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mt-20 scroll-mt-24"
        id="use"
        aria-labelledby="use-heading"
      >
        <h2
          id="use-heading"
          className="font-heading text-2xl font-semibold text-foreground sm:text-3xl"
        >
          {d.useHeading}
        </h2>
        <p className="mt-4 max-w-2xl whitespace-pre-line text-keep-words text-sm text-muted-foreground">{d.useLead}</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.useOfFunds.map((row, i) => (
            <li
              key={`fund-${i}`}
              className="flex flex-col rounded-2xl border border-border/70 bg-gradient-to-b from-card to-muted/20 p-6 text-center ring-1 ring-foreground/5"
            >
              <span className="font-heading text-3xl font-semibold text-primary">
                {row.pct}
              </span>
              <span className="mt-2 font-medium text-foreground">{row.label}</span>
              <span className="mt-1 text-xs text-muted-foreground">{row.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mt-20 scroll-mt-24"
        id="ways"
        aria-labelledby="ways-heading"
      >
        <h2
          id="ways-heading"
          className="font-heading text-2xl font-semibold text-foreground sm:text-3xl"
        >
          {d.waysHeading}
        </h2>
        <p className="mt-4 max-w-3xl whitespace-pre-line text-keep-words text-muted-foreground">{content.waysIntro}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {d.bankTitle}
            </h3>
            <p className="mt-3 text-keep-words whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {content.bankInfo}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {d.externalTitle}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">{d.externalLead}</p>
            {content.externalUrl ? (
              <a
                href={content.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-6 inline-flex w-full justify-center sm:w-auto"
                )}
              >
                {content.externalLabel}
              </a>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">{d.noExternalLink}</p>
            )}
          </div>
        </div>
      </section>

      <section
        className="mt-20 scroll-mt-24"
        id="faq"
        aria-labelledby="faq-heading"
      >
        <h2
          id="faq-heading"
          className="font-heading text-2xl font-semibold text-foreground sm:text-3xl"
        >
          {d.faqHeading}
        </h2>
        <Accordion defaultValue={[]} className="mt-8 max-w-3xl">
          {d.faqs.map((item, i) => (
            <AccordionItem key={`faq-${i}`} value={`faq-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section
        className="mt-20 scroll-mt-24 rounded-2xl border border-border/70 bg-muted/25 p-8 sm:p-10"
        id="contact"
        aria-labelledby="contact-heading"
      >
        <h2
          id="contact-heading"
          className="font-heading text-2xl font-semibold text-foreground"
        >
          {d.contactHeading}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {content.contactNote}
        </p>
        <dl className="mt-6 space-y-2 text-sm">
          <div>
            <dt className="font-medium text-foreground">{d.emailLabel}</dt>
            <dd>
              <a
                className="text-primary underline-offset-4 hover:underline"
                href={`mailto:${content.contactEmail}`}
              >
                {content.contactEmail}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">{d.phoneLabel}</dt>
            <dd className="text-muted-foreground">{content.contactPhone}</dd>
          </div>
        </dl>
        <Link
          href="/news"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "mt-8 inline-flex"
          )}
        >
          {d.backToNews}
        </Link>
      </section>
    </div>
  );
}
