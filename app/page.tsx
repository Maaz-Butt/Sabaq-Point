import React from "react";
import Link from "next/link";
import { getBoards } from "@/actions/board";
import BoardCard from "@/components/ui/BoardCard";
import HeroSearch from "@/components/ui/HeroSearch";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export default async function Home() {
  const { data: boards, success } = await getBoards();

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-6 lg:pt-36 xl:pt-40 pb-32 lg:pb-16 animate-page-in">
      {/* Redesigned Bento Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch mb-4 md:mb-10">
        {/* Left Column: Title, Description, Search, Bullets */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="text-sm md:text-base font-bold uppercase tracking-wider mb-2">
            <span className="lg:hidden flex items-center justify-between w-full text-lg mb-4">
              <span className="flex items-center gap-2">
                <img
                  src="/logo.jpg"
                  className="w-12 h-12 rounded-xl object-cover"
                  alt="logo"
                />
                <span className="text-brand-yellow">Sabaq</span>Point
              </span>
              <ThemeToggle />
            </span>
            <span className="hidden lg:inline">
              Matric &amp; Intermediate Board Exam Preparation
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-outfit text-white tracking-tight leading-tight mb-4">
            Master Your <br className="hidden md:inline" />
            <span className="text-brand-yellow">2026</span> Exams
          </h1>
          <p className="text-surface-500 text-lg md:text-xl font-medium mb-8 max-w-xl leading-relaxed">
            Unlock the ultimate collection of verified past papers and
            step-by-step solved solutions for Class 9, 10, 11, and 12.
          </p>

          <div className="w-full max-w-2xl mb-8">
            <HeroSearch />
          </div>

          {/* Inline Bullet Features */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-surface-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand-yellow shrink-0" />
              <span>Verified Papers</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-brand-green shrink-0" />
              <span>Step-by-Step Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-brand-pink shrink-0" />
              <span>Updated for 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column: Highlight Bento Card */}
        <div className="lg:col-span-5 flex">
          <div className="bg-brand-yellow text-[#121212] rounded-[32px] p-6 md:p-10 flex flex-col justify-between w-full cursor-pointer hover:-translate-y-1 transition-all shadow-xl group">
            <div className="flex justify-between items-start mb-12">
              <div className="inline-flex items-center gap-2 bg-[#121212]/10 px-4 py-2 rounded-full font-bold text-sm">
                <Sparkles size={16} /> Editor's Choice
              </div>
              <div className="w-12 h-12 rounded-full bg-[#121212] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <ArrowUpRight
                  size={24}
                  strokeWidth={2.5}
                  className="text-brand-yellow"
                />
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 font-outfit leading-none tracking-tight">
                Master Your <br /> 2026 Exams
              </h2>
              <p className="font-bold text-[#121212]/70 text-base md:text-lg mb-8 max-w-sm leading-relaxed">
                Unlock the ultimate collection of verified past papers and
                step-by-step solved solutions for Class 9, 10, 11, and 12.
              </p>

              <div className="flex">
                <Link
                  href="#boards-section"
                  className="bg-[#121212] text-brand-yellow px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-md"
                >
                  All Boards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Colorful Stats Bento Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
        {/* Past Papers Tile */}
        <div className="bg-brand-green text-[#121212] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-transform shadow-md cursor-pointer select-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#121212]/10 flex items-center justify-center shrink-0">
            <BookOpen className="text-[#121212] w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit leading-none mb-0.5 sm:mb-1">
              1000+
            </h3>
            <p className="font-bold text-[#121212]/70 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">
              Past Papers
            </p>
          </div>
        </div>

        {/* Classes Tile */}
        <div className="bg-brand-pink text-[#121212] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-transform shadow-md cursor-pointer select-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#121212]/10 flex items-center justify-center shrink-0">
            <GraduationCap className="text-[#121212] w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit leading-none mb-0.5 sm:mb-1">
              4
            </h3>
            <p className="font-bold text-[#121212]/70 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">
              Classes (9-12)
            </p>
          </div>
        </div>

        {/* Exam Ready Tile */}
        <div className="col-span-2 md:col-span-1 bg-[#a3c7fc] text-[#121212] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 flex flex-row items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-transform shadow-md cursor-pointer select-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#121212]/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="text-[#121212] w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit leading-none mb-0.5 sm:mb-1">
              100%
            </h3>
            <p className="font-bold text-[#121212]/70 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">
              Exam Ready
            </p>
          </div>
        </div>
      </div>

      {/* Boards Section */}
      <section
        id="boards-section"
        className="mb-10 md:mb-20 pt-8 border-t border-border-subtle"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black font-outfit text-white mb-2">
              Choose Your Board
            </h2>
            <p className="text-surface-500 font-bold">
              Select a board to start exploring past papers
            </p>
          </div>
        </div>

        {/* ------------------------------ google drive link ------------------------------ */}
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-xl font-bold text-white mb-2 text-center max-w-4xl">
            Due to some issue we are not able to show the papers on our website
            for few days.
          </h1>
          <h2 className="text-lg font-bold text-white mb-2 text-center max-w-3xl">
            But don't worry we are working on it and will be back soon and till
            then you can keep your study going with our other resources.
          </h2>
          <p className="text-lg text-brand-yellow font-semibold mt-5">
          Google Drive Link: <a className="font-bold text-brand-green" href="https://drive.google.com/drive/folders/1YzOOlwAP450V0lsZpo6TKIUJ3oAzblNT?usp=drive_link">1st Year</a>
          </p>
          <p className="mt-5">
            Apologies for the inconvenience.</p>
        </div>
        {/* ------------------------------ google drive link end ------------------------------ */}

        {/* {success && boards && boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {boards
              .filter(
                (board: any) => !board.name.toLowerCase().includes("test"),
              )
              .map((board: any, i: number) => (
                <BoardCard key={board.$id} board={board} index={i} />
              ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface rounded-[32px] px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-elevated flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-surface-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No boards found
            </h3>
            <p className="text-surface-500 font-bold">
              No boards available right now.
            </p>
          </div>
        )} */}
      </section>
    </div>
  );
}
