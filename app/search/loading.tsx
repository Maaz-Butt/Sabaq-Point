import React from 'react';

export default function SearchLoading() {
  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 lg:pt-24 xl:pt-28 pb-32 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 bg-[#222222] rounded-md w-32 mb-8" />

      {/* Header Skeleton */}
      <div className="mb-12">
        {/* Title */}
        <div className="h-12 bg-[#222222] rounded-2xl w-64 md:w-80 mb-4" />
        {/* Query Display Pulse */}
        <div className="h-14 bg-[#222222]/80 border border-white/5 rounded-2xl max-w-2xl w-full" />
      </div>

      {/* Match Sections Skeletons */}
      <div className="space-y-16">
        <div>
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#222222] shrink-0" />
            <div className="h-8 bg-[#222222] rounded-xl w-60" />
          </div>

          {/* Paper Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div 
                key={index}
                className="rounded-[32px] p-6 bg-[#222222]/80 border border-white/5 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-[#111111]/80 rounded-full w-14" />
                    <div className="h-6 bg-[#111111]/80 rounded-full w-20" />
                  </div>
                  <div className="h-4 bg-[#111111]/80 rounded w-40 mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-5 bg-[#111111]/80 rounded w-full" />
                    <div className="h-5 bg-[#111111]/80 rounded w-3/4" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <div className="h-10 bg-[#111111]/80 rounded-xl flex-1" />
                  <div className="h-10 bg-[#111111]/80 rounded-xl w-10 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
