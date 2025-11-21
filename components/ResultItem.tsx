import React from 'react';
import { Map, ExternalLink, Clock, Car, Fuel, Utensils, Search } from 'lucide-react';
import { AIResponse, QueryType, MapSource } from '../types';

interface ResultItemProps {
  item: AIResponse;
}

const getIconForType = (type: QueryType) => {
  switch (type) {
    case QueryType.TRAFFIC: return <Car className="w-5 h-5 text-red-400" />;
    case QueryType.GAS: return <Fuel className="w-5 h-5 text-amber-400" />;
    case QueryType.FOOD: return <Utensils className="w-5 h-5 text-emerald-400" />;
    default: return <Search className="w-5 h-5 text-blue-400" />;
  }
};

const getTitleForType = (type: QueryType) => {
  switch (type) {
    case QueryType.TRAFFIC: return "Traffic & Road Conditions";
    case QueryType.GAS: return "Nearby Fuel Stations";
    case QueryType.FOOD: return "Local Dining";
    default: return "Search Result";
  }
};

export const ResultItem: React.FC<ResultItemProps> = ({ item }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg animate-fade-in-up">
      {/* Card Header */}
      <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
            {getIconForType(item.type)}
          </div>
          <div>
            <h3 className="font-bold text-slate-200">{getTitleForType(item.type)}</h3>
            <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-md opacity-70">
              "{item.query}"
            </p>
          </div>
        </div>
        <div className="flex items-center text-xs text-slate-500 gap-1">
          <Clock className="w-3 h-3" />
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
            {item.text}
          </p>
        </div>

        {/* Sources / Grounding Data */}
        {item.sources.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Map className="w-4 h-4" />
              Locations Found
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-all group"
                >
                  <span className="text-sm text-blue-400 font-medium truncate pr-2 group-hover:text-blue-300">
                    {source.title}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};