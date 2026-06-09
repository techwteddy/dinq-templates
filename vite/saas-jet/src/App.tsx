import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = ['Start', 'Story', 'Rates', 'Benefits', 'FAQ'];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/30" />

        {/* Content wrapper */}
        <div className="relative h-full flex flex-col">

          {/* Navigation */}
          <nav className="w-full">
            <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
              <span className="text-2xl font-semibold text-gray-900 tracking-tight">SkyElite</span>

              {/* Desktop nav */}
              <ul className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-900 hover:text-gray-700 transition-colors text-sm font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-gray-900 p-1"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
              <div className="md:hidden mx-4 mt-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
                <ul className="flex flex-col py-2">
                  {navLinks.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="block px-6 py-3 text-gray-900 hover:text-gray-700 transition-colors text-sm font-medium hover:bg-gray-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>

          {/* Hero content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center -mt-80 px-4">
              {/* Label */}
              <p className="text-sm font-semibold text-gray-600 tracking-wider uppercase mb-4">
                Private Jets
              </p>

              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-500 leading-none tracking-tighter">
                  Premium.
                </h1>
                <h1
                  className="text-6xl md:text-7xl lg:text-8xl font-normal leading-none tracking-tighter"
                  style={{ color: '#202A36', marginTop: '-12px' }}
                >
                  Accessible.
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                Your dedication deserves recognition.
              </p>

              {/* CTAs */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href="#"
                  className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition-colors text-sm"
                >
                  Discover
                </a>
                <a
                  href="#"
                  className="px-4 py-2 rounded-full text-white font-medium transition-colors text-sm"
                  style={{ backgroundColor: '#202A36' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a2229')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#202A36')}
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
