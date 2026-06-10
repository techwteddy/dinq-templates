import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentSection: string;
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Nexus Card', href: '#nexus' },
  { label: 'Community Board', href: '#community' },
  { label: 'Pricing', href: '#join' },
  { label: 'FAQ', href: '#about' },
];

export default function Navigation({ currentSection }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#9B8B73]/95 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex flex-col">
            <span className="text-white font-semibold text-lg tracking-wide">
              FLOW.ART
            </span>
            <span className="text-white/60 text-xs">
              Nexus of Curators and Artists
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-white ${
                  currentSection === link.href.replace('#', '')
                    ? 'text-white'
                    : 'text-white/70'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Login
            </a>
            <a
              href="#join"
              className="text-sm font-medium text-white hover:opacity-80 transition-opacity"
            >
              Join
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'max-h-96 mt-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-4 pb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/70 hover:text-white transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-6 pt-4 border-t border-white/20">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Login
              </a>
              <a href="#join" className="text-white font-medium">
                Join
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
