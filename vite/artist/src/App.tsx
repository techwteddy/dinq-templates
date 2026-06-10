import { useEffect, useRef, useState } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import NexusCard from './sections/NexusCard';
import CommunityBoard from './sections/CommunityBoard';
import JoinUs from './sections/JoinUs';
import Footer from './sections/Footer';
import FloatingJoinButton from './components/FloatingJoinButton';

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'nexus', 'community', 'join'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen">
      <Navigation currentSection={currentSection} />
      
      <main className="relative">
        <section id="hero" className="relative">
          <Hero />
        </section>
        
        <section id="about" className="relative">
          <About />
        </section>
        
        <section id="nexus" className="relative">
          <NexusCard />
        </section>
        
        <section id="community" className="relative">
          <CommunityBoard />
        </section>
        
        <section id="join" className="relative">
          <JoinUs />
        </section>
        
        <Footer />
      </main>
      
      <FloatingJoinButton />
    </div>
  );
}

export default App;
