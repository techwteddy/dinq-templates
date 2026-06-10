import { ArrowUpRight } from 'lucide-react';

const footerLinks = [
  { label: 'Brand Kit', href: '#' },
  { label: 'Buy Gift Card', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#9B8B73] border-t border-white/10">
      <div className="w-full px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Copyright */}
          <div>
            <p className="text-white/60 text-sm">
              2026 &copy; FLOW.ART
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1 group"
              >
                {link.label}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Credits */}
          <div>
            <p className="text-white/60 text-sm flex items-center gap-2">
              Digital product development by{' '}
              <a
                href="#"
                className="text-white hover:underline flex items-center gap-1"
              >
                Vide Infra
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
