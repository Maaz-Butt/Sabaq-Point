'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Download, Loader2 } from 'lucide-react';

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

interface DocumentViewerProps {
  url: string;
  isImage: boolean;
  paper: Paper;
}

export default function DocumentViewer({ url, isImage, paper }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeoutHint, setShowTimeoutHint] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-dismiss loader for PDF embeds after 3s since iframe/object
    // onLoad events are unreliable — the browser streams and renders in the
    // background and rarely fires onLoad at the right moment.
    if (!isImage) {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }

    // Separate slow-loading hint shown after 8 seconds (only visible if still loading)
    const hintTimer = setTimeout(() => {
      setShowTimeoutHint(true);
    }, 8000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(hintTimer);
    };
  }, [isImage]);

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

  return (
    <div className="relative w-full h-full bg-[#111111]">

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

      {/* ── Document Renderers ── */}
      {isImage ? (
        /* Image Viewer: Fit image to screen */
        <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={url}
            alt={paper.title}
            onLoad={handleResourceLoad}
            onError={handleResourceLoad}
            className={`max-w-full max-h-[calc(100vh-110px)] object-contain select-none shadow-2xl rounded-lg border border-white/5 transition-opacity duration-500 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ display: 'block' }}
          />
        </div>
      ) : (
        /*
         * PDF Viewer: Use a direct <iframe> with the actual Appwrite URL for all devices.
         *
         * Why NOT Google Docs Viewer:
         *   - Google's servers must download your file first → massive relay delay
         *   - Often times out on larger files and returns blank page
         *   - The file loads instantly in new tab (direct) but hangs via Google relay
         *
         * Why iframe with direct URL:
         *   - Chrome on Android, Firefox, and Desktop all natively embed PDFs
         *   - Safari iOS will show a scrollable PDF viewer
         *   - The URL is fetched directly from Appwrite — same speed as "Open in new tab"
         */
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
  );
}
