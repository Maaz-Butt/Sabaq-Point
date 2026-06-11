'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Download, FileText, BookOpen, Layers, GraduationCap } from 'lucide-react';

interface Paper {
  title: string;
  pdfUrl?: string;
  board?: {
    name: string;
    slug: string;
  } | null;
  classLevel: string;
  subject: string;
  year: number;
}

interface PdfViewerProps {
  url: string;
  paper: Paper;
}

export default function PdfViewer({ url, paper }: PdfViewerProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUA = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth < 768; // Tailwind md breakpoint
      setIsMobile(isMobileUA || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // SSR fallback / loading state before client-side hydration determines device type
  if (isMobile === null) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#111111]" />
    );
  }

  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#111111] text-white animate-page-in">
        {/* Glow behind the icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-yellow/20 blur-xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-surface border border-white/10 flex items-center justify-center text-brand-yellow shadow-2xl">
            <FileText size={38} className="animate-pulse" />
          </div>
        </div>

        {/* Title & Badge */}
        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-brand-yellow/10 text-brand-yellow mb-3 border border-brand-yellow/20">
          PDF Document
        </span>
        <h3 className="text-xl md:text-2xl font-black mb-4 tracking-tight px-4 max-w-lg leading-tight">
          {paper.title}
        </h3>

        {/* Metadata Badges (Bento Chips style matching the homepage) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-sm px-4">
          {paper.board?.name && (
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink border border-brand-pink/20">
              {paper.board.name}
            </span>
          )}
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">
            Class {paper.classLevel}
          </span>
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-brand-light/10 text-brand-light border border-white/5">
            {paper.subject}
          </span>
          {paper.year && (
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-surface-elevated text-surface-500 border border-white/5">
              Year {paper.year}
            </span>
          )}
        </div>

        {/* Message */}
        <p className="text-sm text-surface-500 max-w-xs mb-8 leading-relaxed px-4">
          Since mobile browsers do not support embedding PDF files, please open or download the past paper below.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-xs px-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-4 rounded-full bg-brand-yellow text-[#121212] font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_25px_rgba(252,213,113,0.3)] flex items-center justify-center gap-2"
            style={{ touchAction: 'manipulation' }}
          >
            <ExternalLink size={16} />
            <span>Open Past Paper</span>
          </a>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full px-6 py-4 rounded-full bg-surface-elevated border border-white/10 text-white font-bold text-sm hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ touchAction: 'manipulation' }}
          >
            <Download size={15} />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    );
  }

  // Desktop view - standard PDF object with fallback
  return (
    <object
      data={`${url}#toolbar=0&navpanes=0&view=Fit`}
      type="application/pdf"
      className="w-full h-full border-0"
      title={paper.title}
    >
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-[#111111] text-white animate-page-in">
        <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow mb-4 shadow-[0_0_15px_rgba(252,213,113,0.1)]">
          <ExternalLink size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">Browser PDF Preview Blocked</h3>
        <p className="text-sm text-surface-500 max-w-md mb-6 leading-relaxed">
          Your browser or active security extensions blocked embedding the preview. Click the button below to view the solved past paper directly in a new tab.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full bg-brand-yellow text-[#121212] font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(252,213,113,0.25)]"
        >
          Open Past Paper
        </a>
      </div>
    </object>
  );
}
