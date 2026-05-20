import React from 'react';
import { getBoardBySlug } from '@/actions/board';
import { getPapers, getCategories } from '@/actions/paper';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import PaperSection from '@/components/ui/PaperSection';
import AnimatedSection from '@/components/ui/AnimatedSection';

// Helper to capitalize subject nicely if it was URL encoded
function formatSubject(subject: string) {
  return decodeURIComponent(subject).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ board: string, class: string, subject: string }> }) {
  const { board: boardSlug, class: classParam, subject: subjectParam } = await params;
  const { data: board } = await getBoardBySlug(boardSlug);
  if (!board) return { title: 'Not Found' };
  
  const formattedSubject = formatSubject(subjectParam);
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
  const title = `${formattedSubject} ${classDisplayName} Past Papers 2026 | Solved ${board.name} Papers`;
  const description = `Get free ${formattedSubject} past papers 2026 for ${classDisplayName} of ${board.name}. View online or download PDF of fully solved board paper solutions.`;
  
  return {
    title,
    description,
    keywords: [
      `${formattedSubject} past papers 2026`,
      `${formattedSubject} class ${classLevel} papers`,
      `${board.name} ${formattedSubject} solved papers`,
      `${classDisplayName} ${formattedSubject} solutions`,
      'matric past papers 2026',
      'intermediate past papers 2026'
    ],
    alternates: {
      canonical: `/past-papers/${boardSlug}/${classParam}/${subjectParam}`,
    },
    openGraph: {
      title,
      description,
      url: `https://sabaqpoint.com/past-papers/${boardSlug}/${classParam}/${subjectParam}`,
      type: 'website',
    }
  };
}

export default async function SubjectPapersPage({ params }: { params: Promise<{ board: string, class: string, subject: string }> }) {
  const { board: boardSlug, class: classParam, subject: subjectParam } = await params;
  const { data: board, success: boardSuccess } = await getBoardBySlug(boardSlug);
  
  if (!boardSuccess || !board) {
    notFound();
  }

  const classLevel = decodeURIComponent(classParam);
  const formattedSubject = formatSubject(subjectParam);
  
  // Case-insensitive regex search for subject to be safe
  const { data: papers } = await getPapers({ 
    boardId: board.$id, 
    classLevel, 
    subject: formattedSubject
  });
  
  // Get unique categories for these specific papers
  const categories = Array.from(new Set<string>((papers || []).map((p: any) => p.category as string).filter(Boolean)));
  const allCategories: string[] = ['All', ...categories];

  const breadcrumbs = [
    { name: 'Home', item: 'https://sabaqpoint.com' },
    { name: board.name, item: `https://sabaqpoint.com/past-papers/${boardSlug}` },
    { name: `Class ${classLevel}`, item: `https://sabaqpoint.com/past-papers/${boardSlug}/${classParam}` },
    { name: formattedSubject, item: `https://sabaqpoint.com/past-papers/${boardSlug}/${classParam}/${subjectParam}` }
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
            <Link href={`/past-papers/${boardSlug}/${classParam}`} className="text-white/60 hover:text-white">Class {classLevel}</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-white font-semibold">{formattedSubject}</span>
          </nav>

          <h1 className="text-display-lg font-black font-sans text-white mb-3 tracking-tight">
            {formattedSubject} — Class {classLevel}
          </h1>
          <p className="text-surface-500 font-bold text-lg max-w-lg">
            Browse all available past papers for {formattedSubject} under {board.name}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 animate-page-in">
          <PaperSection papers={papers || []} categories={allCategories} />
        </div>
      </div>
    </div>
  );
}
