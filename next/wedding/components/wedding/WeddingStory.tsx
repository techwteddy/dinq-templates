'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import useSound from 'use-sound';

// Import scene components
import Scene1Envelope from './scenes/Scene1Envelope';
import Scene2Blessing from './scenes/Scene2Blessing';
import Scene3DateTheme from './scenes/Scene3DateTheme';
import Scene6DressCode from './scenes/Scene6DressCode';
import Scene7Scripture from './scenes/Scene8Scripture';
import Scene9Extras from './scenes/Scene10Extras';
import Scene10RSVP from './scenes/Scene11RSVP';

const scenes = [
  Scene1Envelope,
  Scene2Blessing,
  Scene3DateTheme,
  Scene6DressCode,
  Scene7Scripture,
  Scene9Extras,
  Scene10RSVP,
];

// Scenes that should not auto-advance (0-indexed)
const noAutoAdvanceScenes = [0, 6]; // Scene1Envelope and Scene10RSVP

interface WeddingStoryProps {
  onComplete?: () => void;
}

export default function WeddingStory({ onComplete }: WeddingStoryProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number>(0);
  const lastInteractionRef = useRef<number>(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAudioError, setIsAudioError] = useState(false);

  // Background music - add your wedding music file to public/audio/
  const [play, { stop, pause, sound }] = useSound('/audio/wedding-music.mp3', {
    loop: true,
    volume: 0.3,
    preload: true, // Preload the audio file
    onload: () => {
      console.log('Wedding music loaded successfully');
      setIsAudioLoaded(true);
      setIsAudioError(false);
    },
    onloaderror: (error: any) => {
      console.log('Could not load wedding music. Please add wedding-music.mp3 to public/audio/', error);
      setIsAudioLoaded(false);
      setIsAudioError(true);
    }
  });

  const nextScene = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentScene, onComplete]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || noAutoAdvanceScenes.includes(currentScene)) return;

    const timer = setTimeout(() => {
      nextScene();
    }, 30000); // 30 seconds per scene

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying, nextScene]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || noAutoAdvanceScenes.includes(currentScene)) {
      // For non-auto-advance scenes, set progress to 0 and don't animate
      setProgress(0);
      return;
    }

    setProgress(0);
    const startTime = Date.now();
    const duration = 30000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        progressRef.current = setTimeout(updateProgress, 50);
      }
    };

    updateProgress();

    return () => {
      if (progressRef.current) {
        clearTimeout(progressRef.current);
      }
    };
  }, [currentScene, isPlaying]);

  // Audio control - only play when audio is loaded
  useEffect(() => {
    if (!isAudioLoaded || isAudioError) {
      console.log('Audio not ready yet, waiting...', { isAudioLoaded, isAudioError });
      return;
    }

    if (!isMuted && isPlaying) {
      console.log('Starting music playback');
      play();
    } else {
      console.log('Pausing music playback');
      pause();
    }

    return () => {
      // Cleanup on component unmount
      if (sound) {
        stop();
      }
    };
  }, [isMuted, isPlaying, isAudioLoaded, isAudioError, play, pause, sound, stop]);

  // Auto-start music when loaded (if not muted)
  useEffect(() => {
    if (isAudioLoaded && !isMuted && isPlaying) {
      console.log('Audio loaded, auto-starting music');
      play();
    }
  }, [isAudioLoaded, isMuted, isPlaying, play]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (sound) {
        stop();
      }
    };
  }, [sound, stop]);


  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  const goToScene = (index: number) => {
    setCurrentScene(index);
  };

  const restart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Touch handlers for navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const touchDuration = now - touchStartRef.current;
    const touch = e.changedTouches[0];
    
    if (!touch) return; // Safety check
    
    // Prevent double triggering within 500ms
    if (now - lastInteractionRef.current < 500) {
      console.log('Interaction too soon, ignoring');
      return;
    }
    
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    const tapX = touch.clientX;

    // Quick tap detection (less than 300ms)
    if (touchDuration < 300) {
      console.log('Tap detected at:', tapX, 'Screen width:', screenWidth);
      lastInteractionRef.current = now;
      
      if (tapX < screenWidth / 2) {
        console.log('Previous scene');
        prevScene(); // Left half - previous
      } else {
        console.log('Next scene');
        nextScene(); // Right half - next
      }
    }
  };

  // Click handlers for desktop
  const handleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    
    // Prevent double triggering within 500ms
    if (now - lastInteractionRef.current < 500) {
      console.log('Click too soon, ignoring');
      return;
    }
    
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    const clickX = e.clientX;
    
    lastInteractionRef.current = now;
    
    if (clickX < screenWidth / 2) {
      prevScene(); // Left half - previous
    } else {
      nextScene(); // Right half - next
    }
  };

  // Swipe handlers with debouncing
  const handleSwipeLeft = () => {
    const now = Date.now();
    if (now - lastInteractionRef.current < 500) {
      console.log('Swipe left too soon, ignoring');
      return;
    }
    lastInteractionRef.current = now;
    console.log('Swipe left detected');
    nextScene();
  };

  const handleSwipeRight = () => {
    const now = Date.now();
    if (now - lastInteractionRef.current < 500) {
      console.log('Swipe right too soon, ignoring');
      return;
    }
    lastInteractionRef.current = now;
    console.log('Swipe right detected');
    prevScene();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventScrollOnSwipe: true,
    trackMouse: false, // Disable mouse tracking to prevent conflicts
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });

  const CurrentSceneComponent = scenes[currentScene];

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      {...swipeHandlers}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
        {scenes.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToScene(index);
            }}
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentScene ? '100%' : 
                       index === currentScene ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Audio control */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        title={
          !isAudioLoaded && !isAudioError ? "Loading music..." :
          isAudioError ? "Music failed to load" :
          isMuted ? "Unmute music" : "Mute music"
        }
      >
        {!isAudioLoaded && !isAudioError ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : isAudioError ? (
          <VolumeX size={20} className="text-red-400" />
        ) : isMuted ? (
          <VolumeX size={20} />
        ) : (
          <Volume2 size={20} />
        )}
      </button>

      {/* Restart button (shown on last scene) */}
      {currentScene === scenes.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            restart();
          }}
          className="absolute top-4 right-16 z-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      )}

      {/* Scene content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          <CurrentSceneComponent 
            onNext={nextScene}
            onPrev={prevScene}
            isActive={true}
          />
        </motion.div>
      </AnimatePresence>


      {/* Navigation hints */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 text-white/70 text-sm text-center">
        <p className="font-body">Tap sides to navigate • Swipe to change scenes</p>
      </div>
    </div>
  );
}
