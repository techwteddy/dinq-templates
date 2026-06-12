import { Building } from "lucide-react";
import GoogleMap from "./GoogleMap";

const EN_CONFIGURATION = {
  "locations": [
    {
      "title": "Municipal Non-Profit Enterprise 'Center for Medical Rehabilitation and Palliative Care for Children' of the Zhytomyr Oblast Council",
      "address1": "8 Korabelna St",
      "address2": "Zhytomyr, Zhytomyr Oblast, Ukraine",
      "coords": { "lat": 50.2826796, "lng": 28.5945396 },
      "placeId": "ChIJVVWlvUNlLEcRuhSopj_XWj4"
    }
  ],
  "mapOptions": { 
    "center": { "lat": 50.2826796, "lng": 28.5945396 }, 
    "fullscreenControl": false, 
    "mapTypeControl": false, 
    "streetViewControl": true, 
    "zoom": 16, 
    "zoomControl": true, 
    "maxZoom": 20, 
    "mapId": "DEMO_MAP_ID" 
  },
  "mapsApiKey": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  "capabilities": { "input": false, "autocomplete": false, "directions": false, "distanceMatrix": false, "details": false, "actions": false }
};

export default function LocationEn() {
  return (
    <section className="py-24 bg-transparent transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-8 border border-blue-200 dark:border-blue-800 shadow-inner transition-colors">
                    <Building size={32} />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">We are located in Zhytomyr</h2>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4 transition-colors">
                  Our center is not just a medical facility; it's a cozy space adapted to the needs of children. You can easily find us on the map and get directions.
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 transition-colors">Zhytomyr, 8 Korabelna St.</p>
            </div>
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 group transition-colors">
                <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-sm font-semibold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-slate-900 dark:text-white">
                  Click "View larger map" to open the app
                </div>
                <GoogleMap config={EN_CONFIGURATION} />
            </div>
        </div>
    </section>
  );
}