import React from 'react';
import { getPaperById } from '@/actions/paper';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import RecentPaperTracker from './RecentPaperTracker';
import DocumentViewer from './DocumentViewer';

export async function generateMetadata({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  const { data: paper } = await getPaperById(paperId);
  if (!paper) return { title: 'Not Found' };
  
  const title = `${paper.title} Solved Past Paper 2026 | ${paper.board?.name || ''} Board`;
  const description = `Download PDF or view online solved past paper: ${paper.title} for ${paper.board?.name || ''} Board. Step-by-step solutions for Matric & Intermediate 2026 exam preparation.`;
  
  return {
    title,
    description,
    keywords: [
      `${paper.title}`,
      `${paper.title} solved`,
      `${paper.title} pdf`,
      `${paper.board?.name || ''} past papers 2026`,
      'matric solved past papers',
      'inter solved past papers',
      'sabaqpoint solved papers'
    ],
    alternates: {
      canonical: `/past-papers/view/${paperId}`,
    },
    openGraph: {
      title,
      description,
      url: `https://sabaqpoint.com/past-papers/view/${paperId}`,
      type: 'article',
    }
  };
}

export default async function ViewPaperPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  const { data: paper, success } = await getPaperById(paperId);

  if (!success || !paper) notFound();

  const url: string = paper.pdfUrl || '';
  const hasFile = Boolean(url);

  // High-IQ content-type detection using server-side HEAD request (handles Appwrite extensionless URLs perfectly)
  // Skip entirely for text-only papers (no pdfUrl)
  let isImage = false;
  if (hasFile) {
    try {
      // Timeout of 2 seconds to keep the request snappy
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      
      const headRes = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal
      });
      clearTimeout(id);
      
      const contentType = headRes.headers.get('content-type') || '';
      isImage = contentType.startsWith('image/');
    } catch (e) {
      console.warn('Fallback to regex for content-type detection:', e);
      isImage = /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(url);
    }
  }

  return (
    /*
     * z-[9999] ensures this full-screen overlay renders above the footer
     * (which is later in the DOM and would otherwise paint on top at z:auto)
     */
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: '#111111' }}>
      <RecentPaperTracker paper={paper} />

      {/* Viewer */}
      <main className="flex-1 overflow-hidden relative">
        <DocumentViewer url={url} isImage={isImage} paper={paper} />

        {/* ── Floating action bar ── */}
        <div className="absolute bottom-5 inset-x-0 flex justify-center px-4 pointer-events-none">
          <div
            className="flex items-center gap-1.5 sm:gap-2 bg-[#1c1c1e]/95 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 shadow-2xl pointer-events-auto"
            style={{ WebkitBackdropFilter: 'blur(12px)' } as React.CSSProperties}
          >
            {/* Back */}
            <Link
              href={`/past-papers/${paper.board?.slug}/${paper.classLevel}/${encodeURIComponent(paper.subject.toLowerCase())}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-surface-500 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all text-sm font-semibold"
              style={{ touchAction: 'manipulation' } as React.CSSProperties}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>

            {/* Only show file actions when there's an actual file */}
            {hasFile && (
              <>
                <div className="w-px h-5 bg-white/10" />

                {/* Open in new tab — primary fallback for iOS */}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-surface-500 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all text-sm font-semibold"
                  style={{ touchAction: 'manipulation' } as React.CSSProperties}
                >
                  <ExternalLink size={16} />
                  <span className="hidden sm:inline">Open</span>
                </a>

                {/* Download */}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-brand-yellow text-[#121212] font-bold text-sm transition-all hover:brightness-110 active:scale-95"
                  style={{ touchAction: 'manipulation' } as React.CSSProperties}
                >
                  <Download size={15} />
                  <span>Download</span>
                </a>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

