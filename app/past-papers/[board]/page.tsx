import React from 'react';
import { getBoardBySlug } from '@/actions/board';
import { getClassesByBoard } from '@/actions/paper';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, GraduationCap } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ board: string }> }) {
  const { board: boardSlug } = await params;
  const { data: board } = await getBoardBySlug(boardSlug);
  if (!board) return { title: 'Not Found' };
  
  const title = `${board.name} Past Papers 2026 | Solved Board Solutions`;
  const description = `Get free ${board.name} past papers for 2026 exams. Download Matric (9th & 10th Class) and Intermediate (11th & 12th Class / FSc / ICS) solved past papers, guess papers, and model solutions.`;
  
  return {
    title,
    description,
    keywords: [
      `${board.name} past papers`,
      `${board.name} past papers 2026`,
      `${board.name} solved solutions`,
      `${board.name} 9th class papers`,
      `${board.name} 10th class papers`,
      `${board.name} 11th class papers`,
      `${board.name} 12th class papers`,
      `${board.name} FSc solved papers`,
      'matric past papers 2026',
      'intermediate board papers 2026'
    ],
    alternates: {
      canonical: `/past-papers/${boardSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://sabaqpoint.com/past-papers/${boardSlug}`,
      type: 'website',
    }
  };
}

export default async function BoardClassesPage({ params }: { params: Promise<{ board: string }> }) {
  const { board: boardSlug } = await params;
  const { data: board, success: boardSuccess } = await getBoardBySlug(boardSlug);
  
  if (!boardSuccess || !board) {
    notFound();
  }

  const { data: classes } = await getClassesByBoard(board.$id);

  const breadcrumbs = [
    { name: 'Home', item: 'https://sabaqpoint.com' },
    { name: board.name, item: `https://sabaqpoint.com/past-papers/${boardSlug}` }
  ];

  // Color rotation for class cards
  const classColors = [
    'bg-brand-green text-[#121212]',
    'bg-brand-yellow text-[#121212]',
    'bg-brand-pink text-[#121212]',
    'bg-brand-light text-[#121212]',
  ];

  return (
    <div className="animate-page-in min-h-screen">
      {/* Flat Hero Banner */}
      <div className="relative pt-6 lg:pt-24 xl:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="relative z-10 max-w-3xl">
          <BreadcrumbJsonLd items={breadcrumbs} />

          {/* Breadcrumbs */}
          <nav className="breadcrumb-modern mb-6 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="text-white/60 hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-white font-semibold">{board.name}</span>
          </nav>

          <h1 className="text-display-lg font-black font-sans text-white mb-3 tracking-tight">{board.name}</h1>
          <p className="text-surface-500 font-bold text-lg max-w-lg">
            Select your class level to view available subjects and past papers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
          {classes && classes.length > 0 ? (
            classes.map((classLevel: string, i: number) => (
              <Link key={classLevel} href={`/past-papers/${boardSlug}/${classLevel}`}>
                <div className={`group rounded-[32px] p-6 ${classColors[i % classColors.length]} text-center flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer animate-page-in`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-14 h-14 rounded-full bg-[#121212]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap size={24} className="text-[#121212]" />
                  </div>
                  <h3
                    className="text-2xl font-black font-sans text-[#121212]"
                  >
                    Class {classLevel}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-surface-50 rounded-3xl border border-dashed border-surface-200">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-100 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-surface-400" />
              </div>
              <p className="text-surface-500 font-medium">No classes found for this board yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
