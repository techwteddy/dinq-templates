import Link from "next/link";
import { services, blogs, pages, caseStudies } from "#site/content";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  // Get all services to list them for bot crawlability
  const footerServices = [...services].sort((a, b) => (a.order || 99) - (b.order || 99));

  // Extract unique published blog categories
  const blogCategories = Array.from(
    new Set(blogs.filter(b => b.published && b.category !== "Uncategorized").map(b => b.category))
  ).sort();

  // Get standalone pages
  const legalPages = pages.filter(p => p.published);

  return (
    <footer className="w-full border-t border-border mt-20 bg-canvas/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        
        {/* Full-Width Solutions Row (Top Priority) */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Solutions Architecture</h4>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            {footerServices.map((service) => (
              <Link
                key={service.slug}
                href={service.permalink}
                className="group flex flex-col gap-1 py-2"
              >
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-accent transition-colors">
                  {service.title}
                </span>
                <span className="text-[10px] text-zinc-500 line-clamp-1">
                  {service.description}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

        {/* Main Navigation Grid (Secondary) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12">

          {/* Column 1: Brand & Philosophy */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Famous Sheamus<span className="text-accent">.</span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Fractional CTO services for high-growth SMBs. Decoupling revenue from headcount through agnostic automation.
            </p>
          </div>

          {/* Column 2: Proof of Work */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground/50">Proof of Work</h4>
            <ul className="space-y-2">
              {caseStudies.filter(cs => cs.published).map((cs) => (
                <li key={cs.slug}>
                  <Link
                    href={cs.permalink}
                    className="text-sm text-zinc-500 hover:text-accent transition-colors"
                  >
                    {cs.companyName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Automation Journal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground/50">Automation Journal</h4>
            <ul className="space-y-2">
              {blogCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/blog`}
                    className="text-sm text-zinc-500 hover:text-accent transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground/50">Company</h4>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground/50">Legal</h4>
            <ul className="space-y-2">
              {legalPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={page.permalink}
                    className="text-sm text-zinc-500 hover:text-accent transition-colors"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
            &copy; {new Date().getFullYear()} Famous Sheamus Consulting. Scale Revenue, Not Chaos.
          </p>
          <div className="flex space-x-6">
            {/* Social Links placeholder */}
          </div>
        </div>
      </div>
    </footer>
  );
}