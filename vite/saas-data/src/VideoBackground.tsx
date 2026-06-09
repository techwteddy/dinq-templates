import { useEffect, useRef } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  function cancelFade() {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  }

  function fadeIn(video: HTMLVideoElement) {
    cancelFade();
    const startOpacity = video.style.opacity !== '' ? parseFloat(video.style.opacity) : 0;
    const startTime = performance.now();
    const duration = 250;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      video.style.opacity = String(startOpacity + (1 - startOpacity) * progress);
      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        fadeRafRef.current = null;
      }
    }

    fadeRafRef.current = requestAnimationFrame(step);
  }

  function fadeOut(video: HTMLVideoElement, onDone?: () => void) {
    cancelFade();
    const startOpacity = video.style.opacity !== '' ? parseFloat(video.style.opacity) : 1;
    const startTime = performance.now();
    const duration = 250;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      video.style.opacity = String(startOpacity * (1 - progress));
      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        fadeRafRef.current = null;
        onDone?.();
      }
    }

    fadeRafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';

    function handleTimeUpdate() {
      if (!video) return;
      const remaining = video.duration - video.currentTime;
      if (!fadingOutRef.current && remaining <= 0.55 && video.duration > 0) {
        fadingOutRef.current = true;
        fadeOut(video);
      }
    }

    function handleEnded() {
      if (!video) return;
      video.style.opacity = '0';
      fadingOutRef.current = false;
      cancelFade();
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => {
          fadeIn(video);
        });
      }, 100);
    }

    function handleCanPlay() {
      if (!video) return;
      video.play().then(() => {
        fadingOutRef.current = false;
        fadeIn(video);
      });
    }

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      cancelFade();
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          width: '115%',
          height: '115%',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: '0',
        }}
      />
    </div>
  );
}
