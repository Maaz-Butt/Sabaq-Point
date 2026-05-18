import React from 'react';

export default function BoardClassesLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-6 lg:pt-24 xl:pt-28 pb-32 animate-pulse">
      {/* Header Skeleton */}
      <header className="mb-10 md:mb-14 pt-4 md:pt-8 max-w-3xl">
        {/* Breadcrumb pulse */}
        <div className="h-4 bg-[#222222] rounded-md w-48 mb-6" />
        {/* H1 Title pulse */}
        <div className="h-12 bg-[#222222] rounded-2xl w-72 md:w-96 mb-4" />
        {/* Description tagline pulse */}
        <div className="h-6 bg-[#222222] rounded-xl w-64 md:w-80" />
      </header>

      {/* Grid of Class Cards Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map((index) => (
          <div 
            key={index}
            className="rounded-[32px] p-6 bg-[#222222]/80 border border-white/5 text-center flex flex-col items-center gap-4 min-h-[140px]"
          >
            {/* Round Icon Placeholder */}
            <div className="w-14 h-14 rounded-full bg-[#111111]/80" />
            {/* Title Text Placeholder */}
            <div className="h-6 bg-[#111111]/80 rounded-lg w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
