import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { GeoLocation } from '../types';

interface HeaderProps {
  location: GeoLocation | null;
  locationError: string | null;
}

export const Header: React.FC<HeaderProps> = ({ location, locationError }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 py-4 px-4 md:px-6 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-blue-500/20 shadow-lg">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">RoadCommand AI</h1>
            <p className="text-xs text-slate-400">Powered by Google Maps & Gemini</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
          <MapPin className={`w-4 h-4 ${location ? 'text-green-400' : 'text-red-400'}`} />
          <span className="text-sm font-medium text-slate-300">
            {locationError 
              ? "Location Unavailable" 
              : location 
                ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` 
                : "Locating..."}
          </span>
        </div>
      </div>
    </header>
  );
};