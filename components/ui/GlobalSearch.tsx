'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Layers, GraduationCap, FileText } from 'lucide-react';
import { getBoards } from '@/actions/board';
import { getPapers } from '@/actions/paper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [boards, setBoards] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (boards.length === 0) {
        setLoading(true);
        Promise.all([
          getBoards(),
          getPapers({ limit: 1000 })
        ]).then(([boardsRes, papersRes]) => {
          if (boardsRes.success && boardsRes.data) {
            setBoards(boardsRes.data.filter((b: any) => !b.name.toLowerCase().includes('test')));
          }
          if (papersRes.success && papersRes.data) {
            setPapers(papersRes.data);
          }
          setLoading(false);
        }).catch(err => {
          console.error('Error loading suggestions:', err);
          setLoading(false);
        });
      }
    }
  }, [isOpen, boards.length]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  // Quick lookup map for board information
  const boardsMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    boards.forEach((b: any) => {
      map[b.$id] = b;
    });
    return map;
  }, [boards]);

  // Helper matching logic for class suggestions
  const matchClass = (classLevel: string, qStr: string) => {
    const normClass = classLevel.toLowerCase().trim();
    if (normClass.includes(qStr) || qStr.includes(normClass)) return true;
    const extractNum = (s: string) => s.match(/\d+/)?.[0] || '';
    const numClass = extractNum(normClass);
    const numQuery = extractNum(qStr);
    return numClass && numQuery && numClass === numQuery;
  };

  // Build top suggestions across all 4 categories in real time as the user types
  const suggestions = React.useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      // Default initial suggestions when search input is empty (show first 5 boards)
      return boards.slice(0, 5).map(b => ({
        type: 'board',
        id: b.$id,
        title: b.name,
        subtitle: 'Educational Board',
        url: `/past-papers/${b.slug}`
      }));
    }

    const items: any[] = [];

    // 1. Matches for Boards
    const matchedBoards = boards.filter((b: any) =>
      b.name.toLowerCase().includes(cleanQuery) ||
      b.slug.toLowerCase().includes(cleanQuery)
    );
    matchedBoards.slice(0, 3).forEach((b: any) => {
      items.push({
        type: 'board',
        id: `board-${b.$id}`,
        title: b.name,
        subtitle: 'Educational Board',
        url: `/past-papers/${b.slug}`
      });
    });

    // 2. Matches for Classes (unique boardId + classLevel combinations)
    const seenClasses = new Set<string>();
    const matchedClasses: any[] = [];
    papers.forEach((p: any) => {
      const board = boardsMap[p.boardId];
      if (!board) return;
      const key = `${p.boardId}-${p.classLevel}`;
      if (!seenClasses.has(key) && matchClass(p.classLevel, cleanQuery)) {
        seenClasses.add(key);
        matchedClasses.push({
          type: 'class',
          id: `class-${key}`,
          title: `Class ${p.classLevel}`,
          subtitle: `${board.name}`,
          url: `/past-papers/${board.slug}/${p.classLevel}`
        });
      }
    });
    items.push(...matchedClasses.slice(0, 3));

    // 3. Matches for Subjects (unique boardId + classLevel + subject combinations)
    const seenSubjects = new Set<string>();
    const matchedSubjects: any[] = [];
    papers.forEach((p: any) => {
      const board = boardsMap[p.boardId];
      if (!board) return;
      const key = `${p.boardId}-${p.classLevel}-${p.subject.toLowerCase()}`;
      if (!seenSubjects.has(key) && (p.subject.toLowerCase().includes(cleanQuery) || cleanQuery.includes(p.subject.toLowerCase()))) {
        seenSubjects.add(key);
        matchedSubjects.push({
          type: 'subject',
          id: `subject-${key}`,
          title: p.subject,
          subtitle: `Class ${p.classLevel} &bull; ${board.name}`,
          url: `/past-papers/${board.slug}/${p.classLevel}/${encodeURIComponent(p.subject.toLowerCase())}`
        });
      }
    });
    items.push(...matchedSubjects.slice(0, 3));

    // 4. Matches for Papers (titles/years)
    const matchedPapers = papers.filter((p: any) => 
      p.title.toLowerCase().includes(cleanQuery) ||
      p.year.toString().includes(cleanQuery)
    );
    matchedPapers.slice(0, 4).forEach((p: any) => {
      const board = boardsMap[p.boardId];
      items.push({
        type: 'paper',
        id: `paper-${p.$id}`,
        title: p.title,
        subtitle: `Class ${p.classLevel} &bull; ${board?.name || ''}`,
        url: `/past-papers/view/${p.$id}`
      });
    });

    return items;
  }, [query, boards, papers, boardsMap]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        aria-label="Open Global Search"
      >
        <Search size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6 bg-[#121212]/90 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#222222] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-page-in">
            <form onSubmit={handleSubmit} className="flex items-center px-6 py-4 border-b border-white/10 relative">
              <Search className="text-surface-500 w-6 h-6 mr-4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search boards, classes, subjects, papers..."
                className="flex-1 bg-transparent text-xl text-white outline-none placeholder:text-surface-500"
              />
              <button 
                type="submit"
                className="hidden"
                aria-label="Submit Search"
              />
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-surface-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8 text-surface-500 text-sm">
                  Loading suggestions...
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="px-4 py-2 text-xs font-black text-surface-400 uppercase tracking-widest">
                    Top Suggestions
                  </h3>
                  <div className="space-y-1">
                    {suggestions.map((item) => {
                      let Icon = BookOpen;
                      let iconColor = 'text-brand-yellow';
                      let badgeText = 'Board';
                      let badgeBg = 'bg-brand-yellow/10 text-brand-yellow';

                      if (item.type === 'class') {
                        Icon = Layers;
                        iconColor = 'text-brand-pink';
                        badgeText = 'Class';
                        badgeBg = 'bg-brand-pink/10 text-brand-pink';
                      } else if (item.type === 'subject') {
                        Icon = GraduationCap;
                        iconColor = 'text-brand-green';
                        badgeText = 'Subject';
                        badgeBg = 'bg-brand-green/10 text-brand-green';
                      } else if (item.type === 'paper') {
                        Icon = FileText;
                        iconColor = 'text-brand-light';
                        badgeText = 'Paper';
                        badgeBg = 'bg-brand-light/10 text-brand-light';
                      }

                      return (
                        <Link 
                          key={item.id} 
                          href={item.url}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors group cursor-pointer">
                            <div className={`w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}>
                              <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-bold text-base truncate group-hover:text-brand-yellow transition-colors">
                                {item.title}
                              </h4>
                              <p 
                                className="text-surface-500 text-sm truncate mt-0.5"
                                dangerouslySetInnerHTML={{ __html: item.subtitle }}
                              />
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${badgeBg} shrink-0`}>
                              {badgeText}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-surface-500">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
