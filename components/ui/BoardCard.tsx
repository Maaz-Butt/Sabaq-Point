'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';

interface BoardCardProps {
  board: {
    $id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  index?: number;
}

// Flat card styles based on the image's solid aesthetic
const cardStyles = [
  { class: 'card-glow-green' },
  { class: 'card-glow-yellow' },
  { class: 'card-glow-pink' },
  { class: 'card-glow-light' }
];

export default function BoardCard({ board, index = 0 }: BoardCardProps) {
  const style = cardStyles[index % cardStyles.length];

  return (
    <Link href={`/past-papers/${board.slug}`}>
      <div
        className={`card-interactive ${style.class} p-6 md:p-8 flex flex-col justify-between min-h-[200px] cursor-pointer group`}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl md:text-3xl font-bold font-outfit leading-tight pr-4 max-w-[80%]">
            {board.name}
          </h3>
          
          <div className="w-12 h-12 shrink-0 rounded-full bg-[#121212] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
            <ArrowUpRight size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} /> Explore Papers
          </div>
        </div>
      </div>
    </Link>
  );
}
