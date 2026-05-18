'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  
  years: string[];
  activeYear: string;
  onYearChange: (year: string) => void;
  
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  years,
  activeYear,
  onYearChange,
  activeStatus,
  onStatusChange
}: FilterBarProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Tap handlers ensuring flawless touch response on mobile
  const buttonStyle = {
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    pointerEvents: 'auto',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties;

  const hasActiveAdvancedFilters = activeYear !== 'All' || activeStatus !== 'All';

  return (
    <div 
      className="space-y-4 mb-6 w-full relative"
      style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
    >
      {/* Category List Row with Floating Filter Button */}
      <div className="relative flex items-center w-full">
        {/* Horizontally scrollable category pills */}
        <div className="w-full overflow-x-auto hide-scrollbar flex gap-2 py-1.5 scroll-smooth pr-28">
          {categories.map((filter) => (
            <button
              key={filter}
              type="button"
              onPointerUp={(e) => {
                e.preventDefault();
                onCategoryChange(filter);
              }}
              onClick={() => onCategoryChange(filter)}
              style={buttonStyle}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer select-none whitespace-nowrap ${
                activeCategory === filter
                  ? 'bg-[#FCF7E5] text-[#121212]'
                  : 'bg-[#222222] border border-white/10 text-white active:bg-white/10 hover:bg-white/5'
              }`}
            >
              {filter === 'All' ? 'All' : filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Floating Gradient & Filter Button */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center pl-8 bg-gradient-to-l from-[#111111] via-[#111111]/80 to-transparent pointer-events-none z-20">
          <button
            type="button"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            style={buttonStyle}
            className={`pointer-events-auto px-4 py-2.5 min-h-[44px] rounded-full font-bold text-sm transition-all duration-200 cursor-pointer select-none flex items-center gap-2 border shadow-lg ${
              isFilterExpanded 
                ? 'bg-brand-yellow text-[#121212] border-brand-yellow' 
                : 'bg-[#222222] border-white/10 text-white hover:bg-[#2c2c2e]'
            }`}
          >
            <SlidersHorizontal size={14} className={isFilterExpanded ? 'text-[#121212]' : 'text-surface-400'} />
            <span>Filter</span>
            {hasActiveAdvancedFilters && (
              <span className={`w-2.5 h-2.5 rounded-full ${isFilterExpanded ? 'bg-[#121212]' : 'bg-brand-pink'} animate-pulse shrink-0`} />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Panel */}
      <AnimatePresence>
        {isFilterExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-[#222222]/30 border border-white/5 rounded-[32px] p-5 md:p-6 space-y-5 md:space-y-6 mt-1 shadow-inner">
              
              {/* Status Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 text-surface-500 font-bold text-xs uppercase tracking-wider min-w-[100px] shrink-0">
                  <CheckCircle2 size={14} className="text-brand-green" />
                  <span>Status</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Solved', 'Unsolved'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onPointerUp={(e) => {
                        e.preventDefault();
                        onStatusChange(status);
                      }}
                      onClick={() => onStatusChange(status)}
                      style={buttonStyle}
                      className={`px-4 py-2 min-h-[38px] rounded-full font-bold text-xs md:text-sm transition-colors cursor-pointer select-none ${
                        activeStatus === status
                          ? 'bg-brand-green text-[#121212]'
                          : 'bg-[#222222] border border-white/10 text-white active:bg-white/10 hover:bg-white/5'
                      }`}
                    >
                      {status === 'All' ? 'All Papers' : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Year Selector */}
              {years.length > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-surface-500 font-bold text-xs uppercase tracking-wider min-w-[100px] shrink-0">
                    <Calendar size={14} className="text-brand-pink" />
                    <span>Exam Year</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onPointerUp={(e) => {
                          e.preventDefault();
                          onYearChange(year);
                        }}
                        onClick={() => onYearChange(year)}
                        style={buttonStyle}
                        className={`px-4 py-2 min-h-[38px] rounded-full font-bold text-xs md:text-sm transition-colors cursor-pointer select-none ${
                          activeYear === year
                            ? 'bg-brand-pink text-[#121212]'
                            : 'bg-[#222222] border border-white/10 text-white active:bg-white/10 hover:bg-white/5'
                      }`}
                    >
                      {year === 'All' ? 'All Years' : year}
                    </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
