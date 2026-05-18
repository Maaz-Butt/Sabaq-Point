'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';

export default function PastPapersPage() {
  const [recentPapers, setRecentPapers] = useState<any[]>([]);

  useEffect(() => {
    // Read from localStorage
    const stored = localStorage.getItem('recentPapers');
    if (stored) {
      try {
        setRecentPapers(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-6 lg:pt-24 xl:pt-28 pb-32 lg:pb-16 animate-page-in">
      <header className="mb-10 md:mb-14 pt-4 md:pt-8">
        <h1 className="text-display-lg md:text-display-xl font-bold font-sans mb-2 text-white tracking-tight">
          Recently Visited
        </h1>
        <p className="text-surface-500 text-lg md:text-xl font-medium font-sans mb-8">
          Pick up right where you left off with your recent past papers.
        </p>
      </header>

      {recentPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {recentPapers.map((paper, index) => (
            <Link key={paper.id || index} href={`/past-papers/view/${paper.id}`}>
              <div className="bg-[#222222] border border-white/10 rounded-[24px] p-6 hover:-translate-y-1 hover:bg-[#2a2a2a] transition-all cursor-pointer group flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4 text-surface-500">
                  <Clock size={16} />
                  <span className="text-sm font-bold">Recent</span>
                </div>
                <h3 className="text-xl font-bold font-sans text-white mb-2 group-hover:text-brand-yellow transition-colors line-clamp-2">
                  {paper.title || 'Past Paper'}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between text-surface-500">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span className="text-sm font-bold">{paper.subject || 'Subject'}</span>
                  </div>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#222222] rounded-[32px] px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#121212] flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-surface-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No recent papers</h3>
          <p className="text-surface-500 font-bold max-w-md mx-auto">
            You haven't visited any past papers recently. Browse subjects to start your preparation.
          </p>
          <Link href="/#boards-section">
            <button className="mt-8 bg-brand-yellow text-[#121212] font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
              Browse Boards
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
