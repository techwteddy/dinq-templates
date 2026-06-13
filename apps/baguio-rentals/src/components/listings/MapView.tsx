"use client";

import { useEffect, useRef, useState } from "react";
import { BAGUIO_CENTER, DEFAULT_ZOOM } from "@/lib/utils/constants";

// Dynamic import wrapper - Leaflet requires window
export function MapView({
  latitude,
  longitude,
  interactive = false,
  onLocationSelect,
}: {
  latitude?: number | null;
  longitude?: number | null;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  onLocationSelectRef.current = onLocationSelect;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icon
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center: [number, number] = latitude && longitude
        ? [latitude, longitude]
        : [BAGUIO_CENTER.lat, BAGUIO_CENTER.lng];

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: true,
      }).setView(center, DEFAULT_ZOOM);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (latitude && longitude) {
        markerRef.current = L.marker([latitude, longitude]).addTo(map);
      }

      if (interactive) {
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(map);
          }

          onLocationSelectRef.current?.(lat, lng);
        });
      }

      mapInstanceRef.current = map;

      // Ask for user location if no coordinates are pre-set (new listing)
      if (interactive && !latitude && !longitude && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: userLat, longitude: userLng } = pos.coords;
            map.setView([userLat, userLng], DEFAULT_ZOOM, { animate: true });
          },
          () => {
            // Permission denied or error — stay on Baguio center
          }
        );
      }
    };

    initMap();

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
    // Only run on mount — coordinate updates handled by the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Update marker + pan when coordinates change (e.g. from address autocomplete)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !latitude || !longitude) return;

    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        markerRef.current = L.marker([latitude, longitude]).addTo(map);
      }
      map.setView([latitude, longitude], DEFAULT_ZOOM, { animate: true });
    };

    loadLeaflet();
  }, [latitude, longitude]);

  if (!mounted) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
        Loading map...
      </div>
    );
  }

  return <div ref={mapRef} className="relative z-0 h-[300px] rounded-lg" />;
}
