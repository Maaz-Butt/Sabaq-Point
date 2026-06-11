import React from 'react';
import { getBoardBySlug } from '@/actions/board';
import { getSubjectsByBoardAndClass } from '@/actions/paper';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Book } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ board: string, class: string }> }) {
  const { board: boardSlug, class: classParam } = await params;
  const { data: board } = await getBoardBySlug(boardSlug);
  if (!board) return { title: 'Not Found' };
  
  const classLevel = decodeURIComponent(classParam);
  
  const getClassDisplayName = (cls: string) => {
    const clean = cls.trim().toLowerCase();
    if (clean === '9') return '9th Class (Matric Part 1)';
    if (clean === '10') return '10th Class (Matric Part 2)';
    if (clean === '11') return '11th Class (1st Year FSc/ICS)';
    if (clean === '12') return '12th Class (2nd Year FSc/ICS)';
    return `Class ${cls}`;
  };
  
  const classDisplayName = getClassDisplayName(classLevel);
  const title = `${classDisplayName} Past Papers 2026 - ${board.name} | Solved Solutions`;
  const description = `Download fully solved and unsolved 2026 past papers for ${classDisplayName} under ${board.name} Board. Find subjects, model papers, guess papers, and key study resources.`;
  
  return {
    title,
    description,
    keywords: [
      `${board.name} class ${classLevel} past papers`,
      `${classDisplayName} past papers 2026`,
      `solved board papers class ${classLevel}`,
      `${board.name} class ${classLevel} solved papers`,
      'matric past papers 2026',
      'intermediate board papers 2026',
      'solved exams 2026'
    ],
    alternates: {
      canonical: `/past-papers/${boardSlug}/${classParam}`,
    },
    openGraph: {
      title,
      description,
      url: `https://sabaqpoint.com/past-papers/${boardSlug}/${classParam}`,
      type: 'website',
    }
  };
}

export default async function BoardClassSubjectsPage({ params }: { params: Promise<{ board: string, class: string }> }) {
  const { board: boardSlug, class: classParam } = await params;
  const { data: board, success: boardSuccess } = await getBoardBySlug(boardSlug);
  
  if (!boardSuccess || !board) {
    notFound();
  }

  const classLevel = decodeURIComponent(classParam);
  const { data: subjects } = await getSubjectsByBoardAndClass(board.$id, classLevel);

  const breadcrumbs = [
    { name: 'Home', item: 'https://sabaqpoint.com' },
    { name: board.name, item: `https://sabaqpoint.com/past-papers/${boardSlug}` },
    { name: `Class ${classLevel}`, item: `https://sabaqpoint.com/past-papers/${boardSlug}/${classParam}` }
  ];

  const subjectColors = [
    'bg-surface text-foreground border border-border-subtle',
  ];

  return (
    <div className="animate-page-in min-h-screen">
      {/* Flat Hero Banner */}
      <div className="relative pt-6 lg:pt-24 xl:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="relative z-10 max-w-3xl">
          <BreadcrumbJsonLd items={breadcrumbs} />

          <nav className="breadcrumb-modern mb-6 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="text-white/60 hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <Link href={`/past-papers/${boardSlug}`} className="text-white/60 hover:text-white">{board.name}</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-white font-semibold">Class {classLevel}</span>
          </nav>

          <h1 className="text-display-lg font-black font-sans text-white mb-3 tracking-tight">
            Class {classLevel} Subjects
          </h1>
          <p className="text-surface-500 font-bold text-lg">{board.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {subjects && subjects.length > 0 ? (
            subjects.map((subject: string, i: number) => {
              const color = subjectColors[i % subjectColors.length];
              return (
                <Link key={subject} href={`/past-papers/${boardSlug}/${classParam}/${encodeURIComponent(subject.toLowerCase())}`}>
                  <div className={`group rounded-[24px] p-5 ${color} flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer hover:bg-surface-elevated/40 animate-page-in`} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className={`w-11 h-11 rounded-full bg-surface-elevated flex items-center justify-center text-brand-yellow  shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Book size={18} />
                    </div>
                    <h3
                      className="text-lg font-bold font-sans text-foreground group-hover:text-brand-yellow transition-colors"
                    >
                      {subject}
                    </h3>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-surface-50 rounded-3xl border border-dashed border-surface-200">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-100 flex items-center justify-center">
                <Book className="h-7 w-7 text-surface-400" />
              </div>
              <p className="text-surface-500 font-medium">No subjects found for this class.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
