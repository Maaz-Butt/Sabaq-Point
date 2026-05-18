import React from 'react';

export default function SubjectPapersLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-6 lg:pt-24 xl:pt-28 pb-32 animate-pulse">
      {/* Header Skeleton */}
      <header className="mb-10 md:mb-14 pt-4 md:pt-8 max-w-3xl">
        {/* Breadcrumbs */}
        <div className="h-4 bg-[#222222] rounded-md w-80 mb-6" />
        {/* H1 Title */}
        <div className="h-12 bg-[#222222] rounded-2xl w-96 md:w-[550px] mb-4" />
        {/* Tagline */}
        <div className="h-6 bg-[#222222] rounded-xl w-80" />
      </header>

      {/* Filter Category Tabs Skeleton */}
      <div className="flex gap-2.5 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3].map((index) => (
          <div key={index} className="h-10 bg-[#222222]/80 rounded-full w-24 shrink-0" />
        ))}
      </div>

      {/* Grid of Solved Paper Card Skeletons */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div 
            key={index}
            className="rounded-[32px] p-6 bg-[#222222]/80 border border-white/5 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              {/* Year chip and Solved/Unsolved chip */}
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-[#111111]/80 rounded-full w-14" />
                <div className="h-6 bg-[#111111]/80 rounded-full w-20" />
              </div>

              {/* Class/Board meta text */}
              <div className="h-4 bg-[#111111]/80 rounded w-40 mb-3" />

              {/* Paper Title */}
              <div className="space-y-2 mb-4">
                <div className="h-5 bg-[#111111]/80 rounded w-full" />
                <div className="h-5 bg-[#111111]/80 rounded w-3/4" />
              </div>
            </div>

            {/* View/Download Actions */}
            <div className="mt-4 flex gap-3">
              <div className="h-10 bg-[#111111]/80 rounded-xl flex-1" />
              <div className="h-10 bg-[#111111]/80 rounded-xl w-10 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
