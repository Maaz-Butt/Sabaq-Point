import React from 'react';
import Link from 'next/link';
import { getBoards } from '@/actions/board';
import BoardCard from '@/components/ui/BoardCard';
import HeroSearch from '@/components/ui/HeroSearch';
import { Sparkles, BookOpen, TrendingUp, ArrowUpRight } from 'lucide-react';
import { span } from 'framer-motion/client';

export default async function Home() {
  const { data: boards, success } = await getBoards();

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-6 lg:pt-36 xl:pt-40 pb-32 lg:pb-16">
      
      {/* Clean Flat Header */}
      <header className="mb-10 md:mb-14 pt-4 md:-mt-10 md:pt-14 relative z-10 w-full block">
        <div className="flex items-center gap-3.5 mb-2">
          <img 
            src="/logo.jpg" 
            alt="SabaqPoint Logo" 
            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white/10 shadow-lg lg:hidden shrink-0"
          />
          <h1 className="text-display-lg md:text-display-xl font-bold font-sans text-white tracking-tight">
            Sabaq <span className='text-brand-yellow'>Point</span>
          </h1>
        </div>
        <p className="text-surface-500 text-lg md:text-xl font-medium font-sans mb-8">
          Matric &amp; Intermediate Board Exam Preparation 2026 | Solved Past Papers &amp; Solutions
        </p>
        <div className="w-full max-w-3xl">
          <HeroSearch />
        </div>
      </header>

      {/* Main Flat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        
        {/* Highlight Flat Card */}
        <div className="bg-brand-yellow text-[#121212] rounded-[32px] p-6 md:p-10 lg:col-span-2 flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-10">
            <div className="inline-flex items-center gap-2 bg-[#121212]/10 px-4 py-2 rounded-full font-bold text-sm">
              <Sparkles size={16} /> Editor's Choice
            </div>
            <div className="w-12 h-12 rounded-full bg-[#121212] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
               <ArrowUpRight size={24} strokeWidth={2.5} className="text-brand-yellow" />
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 font-outfit leading-tight tracking-tight">
              Master Your <br /> 2026 Exams
            </h2>
            <p className="font-bold text-[#121212]/70 text-lg mb-8 max-w-md">
              Unlock the ultimate collection of verified past papers and step-by-step solved solutions for Class 9, 10, 11, and 12.
            </p>
            
            <div className="flex gap-3">
              <Link 
                href="#boards-section" 
                className="bg-[#121212] text-brand-yellow px-4 py-2 rounded-full font-bold text-sm cursor-pointer hover:scale-105 transition-transform"
              >
                All Boards
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Flat Cards */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-6 lg:col-span-1">
          <div className="bg-brand-green text-[#121212] rounded-[32px] p-6 md:p-8 flex flex-col justify-between flex-1 hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 bg-[#121212]/10 rounded-full flex items-center justify-center mb-6 self-end group-hover:scale-110 transition-transform">
                <ArrowUpRight size={24} strokeWidth={2.5} className="text-[#121212]" />
             </div>
             <div>
               <h3 className="text-4xl md:text-5xl font-black mb-2 font-outfit">1000+</h3>
               <p className="font-bold text-[#121212]/70 text-sm md:text-base">Past Papers Available</p>
             </div>
          </div>

          <div className="bg-brand-pink text-[#121212] rounded-[32px] p-6 md:p-8 flex flex-col justify-between flex-1 hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 bg-[#121212]/10 rounded-full flex items-center justify-center mb-6 self-end group-hover:scale-110 transition-transform">
                <ArrowUpRight size={24} strokeWidth={2.5} className="text-[#121212]" />
             </div>
             <div>
               <h3 className="text-4xl md:text-5xl font-black mb-2 font-outfit">10K+</h3>
               <p className="font-bold text-[#121212]/70 text-sm md:text-base">Active Students</p>
             </div>
          </div>
        </div>
      </div>



      {/* Boards Section */}
      <section id="boards-section" className="mb-10 md:mb-20 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black font-outfit text-white mb-2">Choose Your Board</h2>
            <p className="text-surface-500 font-bold">Select a board to start exploring past papers</p>
          </div>
        </div>

        {success && boards && boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {boards
              .filter((board: any) => !board.name.toLowerCase().includes('test'))
              .map((board: any, i: number) => (
              <BoardCard key={board.$id} board={board} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface rounded-[32px] px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#121212] flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-surface-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No boards found</h3>
            <p className="text-surface-500 font-bold">No boards available right now.</p>
          </div>
        )}
      </section>

    </div>
  );
}