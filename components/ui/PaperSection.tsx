'use client';

import React, { useState, useMemo } from 'react';
import FilterBar from './FilterBar';
import PaperList from './PaperList';

interface PaperSectionProps {
  papers: any[];
  categories: string[];
}

export default function PaperSection({ papers, categories }: PaperSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');

  // Derive unique years dynamically from fetched papers
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(papers.map(p => p.year).filter(Boolean)));
    return ['All', ...years.sort((a, b) => b - a).map(String)];
  }, [papers]);

  // Combine filters for category, year, and solved status
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchCategory = activeCategory === 'All' || paper.category === activeCategory;
      const matchYear = activeYear === 'All' || String(paper.year) === activeYear;
      const matchStatus = activeStatus === 'All' || paper.type.toLowerCase() === activeStatus.toLowerCase();
      return matchCategory && matchYear && matchStatus;
    });
  }, [papers, activeCategory, activeYear, activeStatus]);

  return (
    <div className="space-y-8" style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-display-md text-foreground">Available Papers</h2>
          <p className="text-surface-500 text-sm mt-1">{filteredPapers.length} papers found</p>
        </div>
      </div>

      <FilterBar 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        years={availableYears}
        activeYear={activeYear}
        onYearChange={setActiveYear}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />
      <PaperList papers={filteredPapers} />
    </div>
  );
}
