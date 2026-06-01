'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight, GripVertical, Trash2, Sliders, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import AlertModal from '@/components/ui/AlertModal';

export default function PastPapersPage() {
  const [recentPapers, setRecentPapers] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  const handleReorder = (newOrder: any[]) => {
    setRecentPapers(newOrder);
    localStorage.setItem('recentPapers', JSON.stringify(newOrder));
  };

  const handleDelete = (id: string) => {
    const updated = recentPapers.filter(paper => paper.id !== id);
    setRecentPapers(updated);
    localStorage.setItem('recentPapers', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setIsConfirmOpen(true);
  };

  const confirmClearAll = () => {
    setRecentPapers([]);
    localStorage.removeItem('recentPapers');
    setIsEditing(false);
    setIsConfirmOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-6 lg:pt-24 xl:pt-28 pb-32 lg:pb-16 animate-page-in animate-none">
      <header className="mb-10 md:mb-14 pt-4 md:pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-lg md:text-display-xl font-bold font-sans mb-2 text-white tracking-tight">
            Recently Visited
          </h1>
          <p className="text-surface-500 text-lg md:text-xl font-medium font-sans">
            Pick up right where you left off with your recent past papers.
          </p>
        </div>

        {recentPapers.length > 0 && (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <AnimatePresence>
              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={handleClearAll}
                  className="btn-secondary px-5 py-2 text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:text-red-300 font-bold rounded-full transition-all text-sm cursor-pointer"
                >
                  Clear All
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn-primary px-6 py-2.5 font-bold rounded-full transition-all text-sm flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.25)] ${
                isEditing 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/10' 
                  : 'bg-brand-yellow hover:scale-105 text-[#121212]'
              }`}
            >
              {isEditing ? (
                <>
                  <CheckCircle2 size={16} />
                  Done
                </>
              ) : (
                <>
                  <Sliders size={16} />
                  Manage List
                </>
              )}
            </button>
          </div>
        )}
      </header>

      {recentPapers.length > 0 ? (
        isEditing ? (
          <div className="max-w-2xl mx-auto w-full animate-page-in">
            <Reorder.Group 
              axis="y" 
              values={recentPapers} 
              onReorder={handleReorder}
              className="space-y-3"
            >
              {recentPapers.map((paper) => (
                <Reorder.Item 
                  key={paper.id} 
                  value={paper}
                  className="bg-[#222222] border border-white/10 rounded-[20px] p-4 flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing hover:bg-[#2a2a2a] transition-colors select-none group touch-none"
                  whileDrag={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(0,0,0,0.5)", borderColor: "rgba(253, 219, 105, 0.4)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Drag Handle */}
                    <div className="text-surface-500 group-hover:text-brand-yellow transition-colors cursor-grab">
                      <GripVertical size={20} />
                    </div>
                    
                    {/* Info */}
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold font-sans text-white truncate max-w-[200px] sm:max-w-[350px]">
                        {paper.title || 'Past Paper'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-surface-500 bg-black/30 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                          {paper.subject || 'Subject'}
                        </span>
                        {paper.year && (
                          <span className="text-[10px] font-bold text-brand-yellow bg-brand-yellow/5 border border-brand-yellow/10 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                            {paper.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent reorder trigger
                      handleDelete(paper.id);
                    }}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/10 text-surface-500 hover:text-red-400 flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <p className="text-center text-xs text-surface-500 font-bold mt-6 tracking-wide uppercase">
              Drag items to re-order them
            </p>
          </div>
        ) : (
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
        )
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
            <button className="mt-8 bg-brand-yellow text-[#121212] font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform cursor-pointer">
              Browse Boards
            </button>
          </Link>
        </div>
      )}

      <AlertModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmClearAll}
        title="Clear History?"
        message="Are you sure you want to clear your recently visited papers list? This action cannot be undone."
        type="danger"
        confirmText="Clear All"
        cancelText="Cancel"
      />
    </div>
  );
}
