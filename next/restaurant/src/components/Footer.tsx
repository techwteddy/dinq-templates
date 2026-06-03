'use client';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { siteConfig } from '@/config/site';

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    setIsSubscribing(true);
    const subject = encodeURIComponent('Newsletter Subscription Request');
    const body = encodeURIComponent(`Please subscribe this email to your newsletter: ${email.trim()}`);
    window.location.href = `mailto:${siteConfig.emailContact}?subject=${subject}&body=${body}`;
    setEmail('');
    setIsSubscribing(false);
  };

  return (
    <footer className="bg-your-black text-white pt-12 pb-2">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Newsletter */}
          <div className="space-y-4">
            <div className="max-w-xs space-y-2">
              <p className="text-gray-300">Join our newsletter for the latest updates and exclusive offers.</p>
              <form onSubmit={handleNewsletterSubmit} className="mt-2">
                <div className="relative w-64">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                    className="w-full px-4 py-2 pr-12 bg-transparent border border-gray-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-your-orange disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-your-orange focus:outline-none disabled:opacity-50"
                  >
                    {isSubscribing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-your-orange" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-medium mb-4 text-your-orange">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/',         label: 'Home' },
                { href: '/menu',     label: 'Menu' },
                { href: '/catering', label: 'Catering' },
                { href: '/about',    label: 'About Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-300 hover:text-your-orange transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-medium mb-4 text-your-orange">Get in Touch</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <MapPin size={18} className="text-your-orange mr-2 flex-shrink-0" />
                <a href={siteConfig.mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-your-orange transition-colors">
                  {siteConfig.addressDisplay}
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-your-orange mr-2 flex-shrink-0" />
                <a href={`mailto:${siteConfig.emailContact}`} className="hover:text-your-orange transition-colors">
                  {siteConfig.emailContact}
                </a>
              </li>
              <li className="flex items-center">
                <Clock size={18} className="text-your-orange mr-2 flex-shrink-0" />
                <span>{siteConfig.hoursLine1}<br />{siteConfig.hoursLine2}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-display font-medium mb-4 text-your-orange">Follow Us</h3>
            <div className="flex space-x-4">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-your-orange transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href={siteConfig.social.facebook}  target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-your-orange transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href={siteConfig.social.x}         target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-your-orange transition-colors" aria-label="X"><XIcon size={20} /></a>
              <a href={siteConfig.social.youtube}   target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-your-orange transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="text-center mt-6 mb-2">
          <Link href="/" className="inline-block">
            <h2 className="flex items-center justify-center w-[85vw] mx-auto">
              <span className="font-samarkan text-[10vw] md:text-[12vw] text-your-orange leading-none">{siteConfig.brandWordPrimary} </span>
              <span className="font-display text-[6vw] md:text-[8vw] font-bold ml-2 tracking-tight text-white leading-none">{siteConfig.brandWordSecondary}</span>
            </h2>
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-1 pt-2 pb-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p className="mb-1 md:mb-0">
            Site by{' '}
            <a href="https://dinqdigital.com" target="_blank" rel="noopener noreferrer" className="text-your-orange hover:text-white transition-colors">
              Dinq Digital
            </a>
          </p>
          <p>© {currentYear} {siteConfig.businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
