import React from 'react';

export default function BoardClassSubjectsLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-6 lg:pt-24 xl:pt-28 pb-32 animate-pulse">
      {/* Header Skeleton */}
      <header className="mb-10 md:mb-14 pt-4 md:pt-8 max-w-3xl">
        {/* Breadcrumbs */}
        <div className="h-4 bg-[#222222] rounded-md w-64 mb-6" />
        {/* H1 Title */}
        <div className="h-12 bg-[#222222] rounded-2xl w-80 md:w-[450px] mb-4" />
        {/* Subtitle */}
        <div className="h-6 bg-[#222222] rounded-xl w-32" />
      </header>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div 
            key={index}
            className="rounded-[24px] p-5 bg-[#222222]/80 border border-white/5 flex items-center gap-4 min-h-[80px]"
          >
            {/* Small Round Icon Placeholder */}
            <div className="w-11 h-11 rounded-full bg-[#111111]/80 shrink-0" />
            {/* Subject Title Placeholder */}
            <div className="h-5 bg-[#111111]/80 rounded-lg w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
