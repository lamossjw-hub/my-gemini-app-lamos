
import React from 'react';
import { GenerationResult } from '../types';

interface Props {
  results: GenerationResult[];
}

const ResultGrid: React.FC<Props> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {results.map((result) => (
        <div 
          key={result.id} 
          className="bg-[#1a1d24] rounded-2xl overflow-hidden shadow-2xl border border-[#2d3139] aspect-square group relative"
        >
          {result.isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/20">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest animate-pulse">Processing</p>
            </div>
          ) : result.error ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/10 p-6 text-center">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-2xl mb-2"></i>
              <p className="text-red-400 text-sm font-medium">{result.error}</p>
            </div>
          ) : result.url ? (
            <div className="w-full h-full relative overflow-hidden">
              <img 
                src={result.url} 
                alt="Generated result" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a 
                  href={result.url} 
                  download={`gen-${result.id}.png`}
                  className="bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-indigo-50 transition-colors shadow-2xl"
                  title="Tải xuống"
                >
                  <i className="fa-solid fa-download text-lg"></i>
                </a>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ResultGrid;
