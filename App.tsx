import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { DashboardControls } from './components/DashboardControls';
import { ResultItem } from './components/ResultItem';
import { LoadingWave } from './components/LoadingWave';
import { queryGeminiWithMaps } from './services/gemini';
import { GeoLocation, AIResponse, QueryType, LoadingState } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [history, setHistory] = useState<AIResponse[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isActive: false, message: '' });
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initial Location Fetch
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Permission denied or unavailable.");
          // Default fallback: San Francisco (just to keep UI functional if blocked, but ideally we need real loc)
          // Keeping null to enforce error state in UI is better practice for this app type.
        }
      );
    } else {
      setLocationError("Geolocation not supported.");
    }
  }, []);

  const handleQuery = async (type: QueryType, prompt: string, destination?: string) => {
    if (!location) {
      alert("We need your location to find nearby info. Please enable geolocation.");
      return;
    }

    setLoadingState({ 
      isActive: true, 
      message: type === QueryType.TRAFFIC ? "Scanning road conditions..." : "Searching nearby..." 
    });

    try {
      const { text, sources } = await queryGeminiWithMaps(prompt, location);

      const newResponse: AIResponse = {
        id: Date.now().toString(),
        type,
        text,
        sources,
        timestamp: Date.now(),
        query: prompt
      };

      setHistory(prev => [newResponse, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data. Please check your API key or connection.");
    } finally {
      setLoadingState({ isActive: false, message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative">
      <Header location={location} locationError={locationError} />

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        
        {/* Hero / Welcome */}
        {history.length === 0 && !loadingState.isActive && (
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
              What's on the road ahead?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Get real-time insights on traffic, accidents, gas prices, and local food using advanced AI with Google Maps data.
            </p>
          </div>
        )}

        <DashboardControls onQuery={handleQuery} isLoading={loadingState.isActive} />

        {/* Error State Display */}
        {locationError && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-8 flex items-center gap-3 text-red-200">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p>{locationError} Please enable location permissions to use this app.</p>
          </div>
        )}

        <div className="space-y-6">
          {loadingState.isActive && (
            <LoadingWave message={loadingState.message} />
          )}

          {history.map((item) => (
            <ResultItem key={item.id} item={item} />
          ))}
        </div>

        <div ref={bottomRef} />
      </main>
    </div>
  );
};

export default App;