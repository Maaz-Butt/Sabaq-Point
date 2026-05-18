'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, BookOpen, Layers, GraduationCap, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBoards } from '@/actions/board';
import { getPapers } from '@/actions/paper';
import Link from 'next/link';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number; maxH: number } | null>(null);

  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only render portal after hydration
  useEffect(() => setMounted(true), []);

  const updateDropdownPosition = useCallback(() => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    // Use visualViewport height when available (accounts for mobile soft keyboard)
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const dropdownTop = rect.bottom + 8;
    // Ensure the dropdown has space; clamp max-height so it never hides behind keyboard
    const maxH = Math.max(120, viewportHeight - dropdownTop - 16);
    setDropdownRect({
      top: dropdownTop,
      left: rect.left,
      width: rect.width,
      maxH,
    });
  }, []);

  useEffect(() => {
    if (isOpen && boards.length === 0) {
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
  }, [isOpen, boards.length]);

  useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    const vv = window.visualViewport;
    window.addEventListener('resize', updateDropdownPosition, { passive: true });
    window.addEventListener('scroll', updateDropdownPosition, { passive: true });
    // visualViewport fires when the soft keyboard opens/closes on mobile
    vv?.addEventListener('resize', updateDropdownPosition);
    vv?.addEventListener('scroll', updateDropdownPosition);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition);
      vv?.removeEventListener('resize', updateDropdownPosition);
      vv?.removeEventListener('scroll', updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    function handleOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      const insideWrapper = wrapperRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideWrapper && !insideDropdown) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
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

  const dropdown = isOpen && dropdownRect && (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: dropdownRect.top,
        left: dropdownRect.left,
        width: dropdownRect.width,
        zIndex: 99999,
      }}
      className="bg-[#222222] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl animate-page-in"
    >
      <div
        className="overflow-y-auto p-2"
        style={{ maxHeight: dropdownRect.maxH }}
      >
        {loading ? (
          <div className="p-4 text-center text-surface-500 text-sm">Loading suggestions...</div>
        ) : suggestions.length > 0 ? (
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
                  style={{ touchAction: 'manipulation' }}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className={`w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center ${iconColor} shrink-0`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                      <p 
                        className="text-surface-500 text-xs truncate mt-0.5"
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
        ) : (
          <div className="p-4 text-center text-surface-500 text-sm">
            No results found matching &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div ref={wrapperRef} className="relative w-full group max-w-2xl">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              updateDropdownPosition();
            }}
            onFocus={() => {
              setIsOpen(true);
              // Scroll the input into view after a short delay to let the
              // keyboard finish animating in, then recalculate dropdown position
              setTimeout(() => {
                inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                updateDropdownPosition();
              }, 300);
            }}
            style={{ touchAction: 'manipulation', fontSize: '16px' /* prevents iOS auto-zoom */ }}
            className="relative w-full pl-12 md:pl-14 pr-5 py-4 md:py-5 rounded-[24px] bg-[#222222] text-base md:text-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all placeholder:text-surface-500 shadow-xl border border-white/5"
            placeholder="Search boards, subjects, papers..."
            id="hero-search"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-brand-yellow transition-colors z-10 p-2 rounded-full flex items-center justify-center"
            aria-label="Search"
            style={{ touchAction: 'manipulation' }}
          >
            <Search size={20} className="md:w-6 md:h-6" />
          </button>
        </form>
      </div>

      {/* Render dropdown in a portal at body level — never clipped by parent overflow */}
      {mounted && dropdown && createPortal(dropdown, document.body)}
    </>
  );
}
