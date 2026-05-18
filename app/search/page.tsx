import React from 'react';
import type { Metadata } from 'next';
import { getBoards } from '@/actions/board';
import { getPapers } from '@/actions/paper';
import BoardCard from '@/components/ui/BoardCard';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search as SearchIcon, 
  Frown, 
  BookOpen, 
  Layers, 
  GraduationCap, 
  FileText, 
  Download, 
  ArrowUpRight, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search Past Papers & Solved Solutions',
  description: 'Search across educational boards to find solved matric and intermediate past papers, subjects, classes, and study resources for the 2026 final exams.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.toLowerCase().trim() || '';

  // Fetch all boards and papers for global robust matching
  const [boardsRes, papersRes] = await Promise.all([
    getBoards(),
    getPapers({ limit: 5000 })
  ]);

  const boardsList = boardsRes.success && boardsRes.data ? boardsRes.data : [];
  const papersList = papersRes.success && papersRes.data ? papersRes.data : [];

  // Quick lookup map for board information
  const boardsMap: Record<string, any> = {};
  boardsList.forEach((b: any) => {
    boardsMap[b.$id] = b;
  });

  // 1. Filter matching boards
  const matchedBoards = query
    ? boardsList.filter((b: any) =>
        b.name.toLowerCase().includes(query) ||
        b.slug.toLowerCase().includes(query)
      )
    : [];

  // Helper matching logic for classes
  const matchClass = (classLevel: string, qStr: string) => {
    const normClass = classLevel.toLowerCase().trim();
    const normQuery = qStr.toLowerCase().trim();
    if (normClass.includes(normQuery) || normQuery.includes(normClass)) return true;
    
    const extractNum = (s: string) => s.match(/\d+/)?.[0] || '';
    const numClass = extractNum(normClass);
    const numQuery = extractNum(normQuery);
    return numClass && numQuery && numClass === numQuery;
  };

  // 2. Extract and filter matching Classes (unique boardId + classLevel combinations)
  const allClassCombos: any[] = [];
  const seenClassKeys = new Set<string>();
  
  papersList.forEach((p: any) => {
    const board = boardsMap[p.boardId];
    if (!board) return;
    const key = `${p.boardId}-${p.classLevel}`;
    if (!seenClassKeys.has(key)) {
      seenClassKeys.add(key);
      allClassCombos.push({
        boardId: p.boardId,
        boardName: board.name,
        boardSlug: board.slug,
        classLevel: p.classLevel,
      });
    }
  });

  const matchedClasses = query
    ? allClassCombos.filter((c: any) => matchClass(c.classLevel, query))
    : [];

  // 3. Extract and filter matching Subjects (unique boardId + classLevel + subject combinations)
  const allSubjectCombos: any[] = [];
  const seenSubjectKeys = new Set<string>();
  
  papersList.forEach((p: any) => {
    const board = boardsMap[p.boardId];
    if (!board) return;
    const key = `${p.boardId}-${p.classLevel}-${p.subject.toLowerCase()}`;
    if (!seenSubjectKeys.has(key)) {
      seenSubjectKeys.add(key);
      allSubjectCombos.push({
        boardId: p.boardId,
        boardName: board.name,
        boardSlug: board.slug,
        classLevel: p.classLevel,
        subject: p.subject,
      });
    }
  });

  const matchedSubjects = query
    ? allSubjectCombos.filter((s: any) =>
        s.subject.toLowerCase().includes(query) ||
        query.includes(s.subject.toLowerCase())
      )
    : [];

  // 4. Filter matching papers (title, subject, class, board)
  const matchedPapers = query
    ? papersList.filter((p: any) => {
        const board = boardsMap[p.boardId];
        const boardName = board?.name || '';
        return (
          p.title.toLowerCase().includes(query) ||
          p.subject.toLowerCase().includes(query) ||
          p.classLevel.toLowerCase().includes(query) ||
          boardName.toLowerCase().includes(query)
        );
      })
    : [];

  const totalResults = matchedBoards.length + matchedClasses.length + matchedSubjects.length + matchedPapers.length;

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 lg:pt-24 xl:pt-28 pb-32">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-surface-500 hover:text-white transition-colors mb-8 font-medium"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <div className="mb-12">
        <h1 className="text-display-lg font-black font-sans text-white mb-4">
          Search Results
        </h1>
        <div className="flex flex-wrap items-center gap-3 bg-surface-elevated/50 border border-white/10 rounded-2xl px-6 py-4 max-w-2xl backdrop-blur-md">
          <SearchIcon className="text-brand-yellow shrink-0" size={24} />
          <span className="text-lg text-white font-semibold">
            &ldquo;{q || 'Everything'}&rdquo;
          </span>
          <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-white/80 font-bold ml-auto">
            {totalResults} matches found
          </span>
        </div>
      </div>

      {totalResults > 0 ? (
        <div className="space-y-16">
          {/* A. MATCHED PAPERS & FILES */}
          {matchedPapers.length > 0 && (
            <section className="animate-page-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit text-white">Papers &amp; Solved Solutions</h2>
                <span className="text-sm bg-surface-100 px-2.5 py-0.5 rounded-full text-surface-500 font-bold">
                  {matchedPapers.length}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchedPapers.map((paper: any, i: number) => {
                  const board = boardsMap[paper.boardId];
                  return (
                    <div
                      key={paper.$id}
                      className="card-interactive p-6 flex flex-col justify-between animate-page-in"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="chip chip-primary text-xs px-2.5 py-1">
                            {paper.year}
                          </span>
                          {paper.type === 'Solved' ? (
                            <span className="chip chip-success text-xs px-2.5 py-1">
                              <CheckCircle size={10} /> Solved
                            </span>
                          ) : (
                            <span className="chip chip-warning text-xs px-2.5 py-1">
                              <Clock size={10} /> Unsolved
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-white/50 font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5">
                          <span>{board?.name || 'Board'}</span>
                          <span>&bull;</span>
                          <span>Class {paper.classLevel}</span>
                        </div>

                        <h4
                          style={{ fontFamily: 'var(--font-outfit)' }}
                          className="text-base font-semibold text-foreground mb-4 line-clamp-2"
                        >
                          {paper.title}
                        </h4>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Link
                          href={`/past-papers/view/${paper.$id}`}
                          className="btn-primary flex-1 text-sm py-2.5"
                        >
                          View Online
                          <ArrowUpRight size={14} />
                        </Link>
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex items-center justify-center bg-surface-100 hover:bg-surface-200 text-surface-600 p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                          title="Download PDF directly"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* B. MATCHED SUBJECTS */}
          {matchedSubjects.length > 0 && (
            <section className="animate-page-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit text-white">Subjects</h2>
                <span className="text-sm bg-surface-100 px-2.5 py-0.5 rounded-full text-surface-500 font-bold">
                  {matchedSubjects.length}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchedSubjects.map((sub: any, i: number) => (
                  <Link 
                    key={`${sub.boardSlug}-${sub.classLevel}-${sub.subject}`} 
                    href={`/past-papers/${sub.boardSlug}/${sub.classLevel}/${encodeURIComponent(sub.subject.toLowerCase())}`}
                  >
                    <div className="card-interactive bg-[#222222] border border-white/5 hover:border-brand-green/30 p-6 flex flex-col justify-between min-h-[140px] cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs bg-brand-green/10 text-brand-green font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Subject
                          </span>
                          <h3 className="text-xl font-bold font-outfit text-white mt-3 group-hover:text-brand-green transition-colors">
                            {sub.subject}
                          </h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                      <div className="text-xs text-white/50 font-bold mt-4 uppercase">
                        {sub.boardName} &bull; Class {sub.classLevel}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* C. MATCHED CLASSES */}
          {matchedClasses.length > 0 && (
            <section className="animate-page-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                  <Layers size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit text-white">Classes</h2>
                <span className="text-sm bg-surface-100 px-2.5 py-0.5 rounded-full text-surface-500 font-bold">
                  {matchedClasses.length}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchedClasses.map((cls: any, i: number) => (
                  <Link 
                    key={`${cls.boardSlug}-${cls.classLevel}`} 
                    href={`/past-papers/${cls.boardSlug}/${cls.classLevel}`}
                  >
                    <div className="card-interactive bg-[#222222] border border-white/5 hover:border-brand-pink/30 p-6 flex flex-col justify-between min-h-[140px] cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs bg-brand-pink/10 text-brand-pink font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Class Level
                          </span>
                          <h3 className="text-xl font-bold font-outfit text-white mt-3 group-hover:text-brand-pink transition-colors">
                            Class {cls.classLevel}
                          </h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                      <div className="text-xs text-white/50 font-bold mt-4 uppercase">
                        {cls.boardName}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* D. MATCHED BOARDS */}
          {matchedBoards.length > 0 && (
            <section className="animate-page-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-light/10 flex items-center justify-center text-brand-light">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit text-white">Educational Boards</h2>
                <span className="text-sm bg-surface-100 px-2.5 py-0.5 rounded-full text-surface-500 font-bold">
                  {matchedBoards.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedBoards.map((board: any, i: number) => (
                  <BoardCard key={board.$id} board={board} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-elevated rounded-[24px] md:rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-md px-4 mt-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
            <Frown className="h-8 w-8 md:h-10 md:w-10 text-brand-pink" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No matching results found</h3>
          <p className="text-surface-400 font-medium text-base md:text-lg mb-8 max-w-md mx-auto">
            We couldn&rsquo;t find any papers, classes, subjects, or boards matching &ldquo;{q}&rdquo;. Try searching for something else like &ldquo;physics&rdquo;, &ldquo;class 9&rdquo;, or &ldquo;solved&rdquo;.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all border border-white/5 hover:border-white/20"
          >
            Clear Search
          </Link>
        </div>
      )}
    </div>
  );
}
