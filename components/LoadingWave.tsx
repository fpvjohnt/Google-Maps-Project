import React from 'react';

export const LoadingWave: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};