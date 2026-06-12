"use client";

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface GoogleMapProps {
  config?: any; // Keeping for compatibility, but we'll use position from it
  lang?: 'uk' | 'en';
}

export default function GoogleMap({ config, lang = 'uk' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      // @ts-ignore
      const { Map } = await google.maps.importLibrary("maps");
      // @ts-ignore
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const position = config?.locations?.[0]?.coords || { lat: 50.2826796, lng: 28.5945396 };
      const title = config?.locations?.[0]?.title || (lang === 'en' ? 'Sails of Life' : 'Вітрила Життя');

      const map = new Map(mapRef.current as HTMLElement, {
        zoom: config?.mapOptions?.zoom || 15,
        center: { lat: 50.2842, lng: 28.5948 },
        mapId: 'DEMO_MAP_ID', // Використовуємо DEMO_MAP_ID для Advanced Markers
        disableDefaultUI: false,
        clickableIcons: true,
        scrollwheel: true,
      });

      // Функція для створення кастомних HTML маркерів
      const createCustomMarker = (pos: { lat: number, lng: number }, label: string, bgClass: string, icon: string) => {
        const container = document.createElement("div");
        container.className = "flex flex-col items-center group cursor-pointer select-none transition-all duration-300 hover:scale-110";
        
        container.innerHTML = `
          <div class="flex items-center gap-1.5 ${bgClass} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white dark:border-slate-900 whitespace-nowrap">
            <span>${icon}</span>
            <span>${label}</span>
          </div>
          <div class="w-2 h-2 ${bgClass} rotate-45 -mt-[5px] border-r border-b border-white dark:border-slate-900"></div>
        `;

        new AdvancedMarkerElement({
          map,
          position: pos,
          title: label,
          content: container,
        });
      };

      const isEn = lang === 'en';

      const locations = [
        {
          pos: position,
          label: isEn ? "Rehabilitation Center" : "Центр реабілітації",
          bg: "bg-blue-600",
          icon: "🏥"
        },
        {
          pos: { lat: 50.28217908775604, lng: 28.595706627974252 },
          label: isEn ? "Minibus #33 Stop" : "Зупинка маршрутки №33",
          bg: "bg-emerald-600",
          icon: "🚌"
        },
        {
          pos: { lat: 50.28618238635432, lng: 28.594564358516763 },
          label: isEn ? "Trolleybus Stop (Terminus)" : "Зупинка тролейбусів (Кінцева)",
          bg: "bg-purple-600",
          icon: "🚎"
        }
      ];

      locations.forEach(loc => {
        createCustomMarker(loc.pos, loc.label, loc.bg, loc.icon);
      });
    };

    // Перевіряємо чи завантажився скрипт
    if (typeof window !== 'undefined' && (window as any).google) {
      initMap();
    } else {
      // Якщо скрипт ще не завантажився, чекаємо події від Script компонента
      window.addEventListener('google-maps-loaded', initMap);
    }

    return () => window.removeEventListener('google-maps-loaded', initMap);
  }, [config]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker&v=beta`}
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('google-maps-loaded'));
        }}
      />
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[300px] rounded-3xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800"
      />
    </>
  );
}
