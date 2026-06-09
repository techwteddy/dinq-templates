import { useState } from 'react';
import VideoBackground from './VideoBackground';
import {
  ChevronDownIcon,
  UpArrowIcon,
  StarIcon,
  AISparkleIcon,
  AttachIcon,
  VoiceIcon,
  SearchIcon,
} from './icons';

function Badge() {
  return (
    <div className="flex items-center gap-0 rounded-full overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5"
        style={{ backgroundColor: '#0e1311', borderRadius: '9999px 0 0 9999px' }}
      >
        <StarIcon />
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#ffffff',
          }}
        >
          New
        </span>
      </div>
      <div
        className="flex items-center px-3 py-1.5"
        style={{ backgroundColor: '#f8f8f8', borderRadius: '0 9999px 9999px 0' }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#000000',
          }}
        >
          Discover what's possible
        </span>
      </div>
    </div>
  );
}

function SearchBox() {
  const [inputValue, setInputValue] = useState('');
  const maxChars = 3000;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '728px',
        height: '200px',
        borderRadius: '18px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(0,0,0,0.24)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: 'Schibsted Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              color: '#ffffff',
            }}
          >
            60/450 credits
          </span>
          <button
            style={{
              backgroundColor: 'rgba(90,225,76,0.89)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontFamily: 'Schibsted Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Upgrade
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <AISparkleIcon />
          <span
            style={{
              fontFamily: 'Schibsted Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              color: '#ffffff',
            }}
          >
            Powered by GPT-4o
          </span>
        </div>
      </div>

      {/* Main input area */}
      <div
        className="flex-1 flex items-center gap-3 px-4 py-3"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.slice(0, maxChars))}
          placeholder="Type question..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontFamily: 'Schibsted Grotesk, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            color: '#000000',
            backgroundColor: 'transparent',
          }}
          className="placeholder-[rgba(0,0,0,0.6)]"
        />
        <button
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <UpArrowIcon />
        </button>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {[
            { label: 'Attach', Icon: AttachIcon },
            { label: 'Voice', Icon: VoiceIcon },
            { label: 'Prompts', Icon: SearchIcon },
          ].map(({ label, Icon }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1.5 transition-opacity hover:opacity-70"
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Schibsted Grotesk, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
                color: '#ffffff',
              }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
        <span
          style={{
            fontFamily: 'Schibsted Grotesk, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {inputValue.length.toLocaleString()}/3,000
        </span>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav
      className="relative z-10 flex items-center justify-between w-full"
      style={{ paddingLeft: '120px', paddingRight: '120px', paddingTop: '16px', paddingBottom: '16px' }}
    >
      {/* Logo */}
      <span
        style={{
          fontFamily: 'Schibsted Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '24px',
          letterSpacing: '-1.44px',
          color: '#000000',
        }}
      >
        Logoipsum
      </span>

      {/* Menu items */}
      <div className="flex items-center gap-8">
        {['Platform', 'Projects', 'Community', 'Contact'].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              fontFamily: 'Schibsted Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              letterSpacing: '-0.2px',
              color: '#000000',
              textDecoration: 'none',
            }}
            className="hover:opacity-70 transition-opacity"
          >
            {item}
          </a>
        ))}
        <a
          href="#"
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          style={{
            fontFamily: 'Schibsted Grotesk, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            letterSpacing: '-0.2px',
            color: '#000000',
            textDecoration: 'none',
          }}
        >
          Features
          <ChevronDownIcon />
        </a>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          style={{
            width: '82px',
            height: '40px',
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: '8px',
            fontFamily: 'Schibsted Grotesk, sans-serif',
            fontWeight: 500,
            fontSize: '15px',
            color: '#000000',
            cursor: 'pointer',
          }}
          className="hover:bg-black/5 transition-colors"
        >
          Sign Up
        </button>
        <button
          style={{
            width: '101px',
            height: '40px',
            backgroundColor: '#000000',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Schibsted Grotesk, sans-serif',
            fontWeight: 500,
            fontSize: '15px',
            color: '#ffffff',
            cursor: 'pointer',
          }}
          className="hover:bg-gray-800 transition-colors"
        >
          Log In
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white">
      <VideoBackground />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col w-full min-h-screen">
        <Navbar />

        {/* Gap between nav and hero */}
        <div style={{ height: '60px' }} />

        {/* Hero content — moved up 50px */}
        <div
          className="flex flex-col items-center w-full"
          style={{ marginTop: '-50px' }}
        >
          <div
            className="flex flex-col items-center"
            style={{ gap: '34px' }}
          >
            <Badge />

            <div className="flex flex-col items-center" style={{ gap: '34px' }}>
              <h1
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 700,
                  fontSize: '80px',
                  letterSpacing: '-4.8px',
                  lineHeight: 1,
                  color: '#000000',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Transform Data Quickly
              </h1>

              <p
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 500,
                  fontSize: '20px',
                  letterSpacing: '-0.4px',
                  color: '#505050',
                  textAlign: 'center',
                  maxWidth: '736px',
                  width: '542px',
                  margin: 0,
                }}
              >
                Upload your information and get powerful insights right away. Work smarter and achieve goals effortlessly.
              </p>
            </div>
          </div>

          {/* Gap between header and search box */}
          <div style={{ height: '44px' }} />

          <SearchBox />
        </div>
      </div>
    </div>
  );
}
