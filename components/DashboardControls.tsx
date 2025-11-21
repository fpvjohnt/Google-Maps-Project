import React, { useState } from 'react';
import { Car, Fuel, Utensils, Search, Navigation2 } from 'lucide-react';
import { QueryType } from '../types';

interface DashboardControlsProps {
  onQuery: (type: QueryType, prompt: string, destination?: string) => void;
  isLoading: boolean;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({ onQuery, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [customQuery, setCustomQuery] = useState('');

  const handleTrafficClick = () => {
    const prompt = destination 
      ? `Check for traffic accidents, delays, and road closures on the route to ${destination}. Provide an estimated travel time based on current conditions.` 
      : `What are the current traffic conditions, including accidents or heavy congestion on major freeways and streets in my immediate vicinity?`;
    
    onQuery(QueryType.TRAFFIC, prompt, destination);
  };

  const handleGasClick = () => {
    onQuery(QueryType.GAS, "Find the nearest gas stations with good ratings and current prices if available.");
  };

  const handleFoodClick = () => {
    onQuery(QueryType.FOOD, "Find the highly-rated restaurants and eateries in the immediate area.");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    onQuery(QueryType.CUSTOM, customQuery);
    setCustomQuery('');
  };

  return (
    <div className="w-full bg-slate-800/50 rounded-2xl border border-slate-700 p-4 md:p-6 shadow-xl mb-8">
      
      {/* Destination Input for Traffic */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Trip Destination (Optional for ETA)
        </label>
        <div className="relative">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Downtown, SFO Airport, 123 Main St..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-all"
          />
          <Navigation2 className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleTrafficClick}
          disabled={isLoading}
          className="group relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-900/40 to-slate-900 border border-red-900/50 hover:border-red-500/50 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="bg-red-500/20 p-3 rounded-full mb-3 group-hover:bg-red-500/30 transition-colors">
            <Car className="w-6 h-6 text-red-400" />
          </div>
          <span className="font-semibold text-slate-200">Traffic & Accidents</span>
          <span className="text-xs text-slate-400 mt-1">With ETA Estimate</span>
        </button>

        <button
          onClick={handleGasClick}
          disabled={isLoading}
          className="group relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-900/50 hover:border-amber-500/50 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="bg-amber-500/20 p-3 rounded-full mb-3 group-hover:bg-amber-500/30 transition-colors">
            <Fuel className="w-6 h-6 text-amber-400" />
          </div>
          <span className="font-semibold text-slate-200">Gas Stations</span>
          <span className="text-xs text-slate-400 mt-1">Nearest & Rated</span>
        </button>

        <button
          onClick={handleFoodClick}
          disabled={isLoading}
          className="group relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-900/50 hover:border-emerald-500/50 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="bg-emerald-500/20 p-3 rounded-full mb-3 group-hover:bg-emerald-500/30 transition-colors">
            <Utensils className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-semibold text-slate-200">Restaurants</span>
          <span className="text-xs text-slate-400 mt-1">Top Local Spots</span>
        </button>
      </div>

      {/* Custom Query */}
      <form onSubmit={handleCustomSubmit} className="relative">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder="Ask anything else about the area..."
          disabled={isLoading}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-all disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={isLoading || !customQuery.trim()}
          className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors disabled:opacity-0"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};