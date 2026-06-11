'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Download, Loader2, FileText } from 'lucide-react';

interface Paper {
  title: string;
  pdfUrl?: string;
  richContent?: string;
  board?: {
    name: string;
    slug: string;
  } | null;
  classLevel: string;
  subject: string;
  year: number;
}

interface DocumentViewerProps {
  url: string;
  isImage: boolean;
  paper: Paper;
}

export default function DocumentViewer({ url, isImage, paper }: DocumentViewerProps) {
  const hasFile = Boolean(url);
  const hasRichContent = Boolean(paper.richContent?.trim());

  const [isLoading, setIsLoading] = useState(hasFile);
  const [showTimeoutHint, setShowTimeoutHint] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasFile) return;

    // Auto-dismiss loader for PDF embeds after 3s
    if (!isImage) {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }

    // Slow-loading hint shown after 8 seconds
    const hintTimer = setTimeout(() => {
      setShowTimeoutHint(true);
    }, 8000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(hintTimer);
    };
  }, [isImage, hasFile]);

  // Handle cached image loading
  useEffect(() => {
    if (isImage && imgRef.current?.complete) {
      setIsLoading(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isImage]);

  const handleResourceLoad = () => {
    setIsLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // ── Text-only paper (no file at all) ──────────────────────────────────────
  if (!hasFile && hasRichContent) {
    return (
      <div className="w-full h-full overflow-y-auto bg-[#111111]">
        <div className="max-w-3xl mx-auto px-5 py-10 sm:px-8 sm:py-14">
          {/* Paper header */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow">
                <FileText size={14} />
              </div>
              <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                {paper.subject} · {paper.classLevel} · {paper.year}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {paper.title}
            </h1>
            {paper.board?.name && (
              <p className="text-sm text-surface-500 mt-1 font-medium">{paper.board.name}</p>
            )}
          </div>

          {/* Rich text content */}
          <div
            className="rich-content-view"
            dangerouslySetInnerHTML={{ __html: paper.richContent! }}
          />
        </div>

        {/* Scoped prose styles for the reader */}
        <style>{`
          .rich-content-view {
            color: rgba(255,255,255,0.85);
            font-size: 1rem;
            line-height: 1.75;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .rich-content-view b,
          .rich-content-view strong {
            font-weight: 700;
            color: #fff;
          }
          .rich-content-view i,
          .rich-content-view em {
            font-style: italic;
            color: rgba(255,255,255,0.75);
          }
          .rich-content-view u {
            text-decoration: underline;
            text-decoration-color: rgba(252,213,113,0.5);
          }
          .rich-content-view ul {
            list-style: disc;
            padding-left: 1.6em;
            margin: 0.6em 0;
          }
          .rich-content-view ol {
            list-style: decimal;
            padding-left: 1.6em;
            margin: 0.6em 0;
          }
          .rich-content-view li {
            margin: 0.35em 0;
            color: rgba(255,255,255,0.82);
          }
          .rich-content-view hr {
            border: none;
            border-top: 1px solid rgba(255,255,255,0.12);
            margin: 1.5em 0;
          }
          .rich-content-view p,
          .rich-content-view div {
            margin: 0.4em 0;
          }
        `}</style>
      </div>
    );
  }

  // ── File viewer (PDF or Image) with optional rich text below ─────────────
  return (
    <div className="relative w-full h-full bg-[#111111] flex flex-col">

      {/* ── Beautiful Loading Spinner Overlay ── */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center p-6 bg-[#111111] text-white transition-opacity duration-300">
          <div className="relative mb-6">
            {/* Glowing effect ring */}
            <div className="absolute inset-0 bg-brand-yellow/15 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-brand-yellow shadow-2xl">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <h4 className="text-lg font-bold tracking-tight mb-1.5">
            {isImage ? 'Loading Past Paper Image...' : 'Preparing Solved Past Paper...'}
          </h4>
          <p className="text-xs text-surface-500 max-w-xs leading-relaxed">
            Please wait while we render the file preview.
          </p>

          {/* Slow loading hint with action buttons */}
          {showTimeoutHint && (
            <div className="mt-8 px-4 py-3 rounded-2xl bg-surface border border-white/5 max-w-xs animate-page-in shadow-xl">
              <p className="text-xs text-surface-500 mb-2.5">
                Taking longer than expected? The file might be large or your connection is slow.
              </p>
              <div className="flex gap-2 justify-center">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-brand-yellow text-[#121212] font-extrabold text-[11px] transition-all active:scale-95 shadow-sm"
                >
                  Open PDF
                </a>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3.5 py-1.5 rounded-full bg-[#1c1c1e] text-white border border-white/10 font-bold text-[11px] transition-all active:scale-95"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── File Renderer ── */}
      <div className={hasRichContent ? 'flex-shrink-0' : 'flex-1'} style={hasRichContent ? { height: '60vh' } : { height: '100%' }}>
        {isImage ? (
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={url}
              alt={paper.title}
              onLoad={handleResourceLoad}
              onError={handleResourceLoad}
              className={`max-w-full max-h-full object-contain select-none shadow-2xl rounded-lg border border-white/5 transition-opacity duration-500 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ display: 'block' }}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <iframe
              src={`${url}#toolbar=0&navpanes=0&view=Fit`}
              className={`w-full h-full border-0 transition-opacity duration-700 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              title={paper.title}
              onLoad={handleResourceLoad}
              onError={handleResourceLoad}
              allow="fullscreen"
            />
          </div>
        )}
      </div>

      {/* ── Rich text appended below the file (when both exist) ── */}
      {hasRichContent && (
        <div className="flex-1 overflow-y-auto border-t border-white/10 bg-[#0e0e0e]">
          <div className="max-w-3xl mx-auto px-5 py-8 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mb-4 flex items-center gap-2">
              <FileText size={12} /> Additional Notes
            </p>
            <div
              className="rich-content-view"
              dangerouslySetInnerHTML={{ __html: paper.richContent! }}
            />
          </div>

          <style>{`
            .rich-content-view {
              color: rgba(255,255,255,0.85);
              font-size: 0.95rem;
              line-height: 1.75;
            }
            .rich-content-view b, .rich-content-view strong { font-weight: 700; color: #fff; }
            .rich-content-view i, .rich-content-view em { font-style: italic; }
            .rich-content-view u { text-decoration: underline; text-decoration-color: rgba(252,213,113,0.5); }
            .rich-content-view ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
            .rich-content-view ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
            .rich-content-view li { margin: 0.3em 0; }
            .rich-content-view hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.2em 0; }
            .rich-content-view p, .rich-content-view div { margin: 0.35em 0; }
          `}</style>
        </div>
      )}
    </div>
  );
}
