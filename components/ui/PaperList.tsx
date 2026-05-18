'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';

interface Paper {
  $id: string;
  title: string;
  year: number;
  type: 'Solved' | 'Unsolved';
  pdfUrl: string;
}

interface PaperListProps {
  papers: Paper[];
}

export default function PaperList({ papers }: PaperListProps) {
  if (papers.length === 0) {
    return (
      <div className="py-16 text-center bg-surface-50 rounded-3xl border border-dashed border-surface-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 flex items-center justify-center">
          <FileText className="h-8 w-8 text-surface-400" />
        </div>
        <h3 className="text-display-md text-foreground mb-2" style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.25rem' }}>No papers found</h3>
        <p className="text-sm text-surface-500">Check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {papers.map((paper, i) => (
        <div
          key={paper.$id}
          className="card-interactive p-6 flex flex-col animate-page-in"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex justify-between items-start mb-5 relative z-10">
            <span className="chip chip-primary">
              {paper.year}
            </span>
            {paper.type === 'Solved' ? (
              <span className="chip chip-success">
                <CheckCircle size={12} /> Solved
              </span>
            ) : (
              <span className="chip chip-warning">
                <Clock size={12} /> Unsolved
              </span>
            )}
          </div>

          <h4
            style={{ fontFamily: 'var(--font-outfit)' }}
            className="text-base font-semibold text-foreground mb-1 flex-1 relative z-10"
          >
            {paper.title}
          </h4>

          <div className="mt-6 flex gap-3 relative z-10">
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
      ))}
    </div>
  );
}
