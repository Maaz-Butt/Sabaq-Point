import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-[#111111] px-4">
      <div className="relative flex items-center justify-center mb-8">
        {/* Multilayered Premium Neon Spinners */}
        <div 
          className="absolute w-24 h-24 rounded-full border-4 border-brand-yellow border-t-transparent animate-spin" 
          style={{ animationDuration: '1.2s' }}
        />
        <div 
          className="absolute w-18 h-18 rounded-full border-4 border-brand-green border-b-transparent animate-spin" 
          style={{ animationDuration: '0.9s', animationDirection: 'reverse' }}
        />
        <div 
          className="absolute w-12 h-12 rounded-full border-4 border-brand-pink border-l-transparent animate-spin" 
          style={{ animationDuration: '0.6s' }}
        />
        
        {/* Central glowing indicator */}
        <div className="w-6 h-6 rounded-full bg-[#222222] border border-white/10 flex items-center justify-center shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold font-sans text-white mb-2 tracking-tight">
        Sabaq <span className="text-brand-yellow">Point</span>
      </h2>
      <p className="text-sm font-semibold text-surface-500 max-w-xs text-center leading-relaxed">
        Preparing your study space...
      </p>
    </div>
  );
}
