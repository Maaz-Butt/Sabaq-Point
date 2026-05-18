'use client';

import { useEffect } from 'react';

export default function RecentPaperTracker({ paper }: { paper: any }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentPapers');
      let recentPapers = stored ? JSON.parse(stored) : [];
      
      const paperData = {
        id: paper.$id,
        title: paper.title,
        subject: paper.subject,
        timestamp: Date.now()
      };
      
      recentPapers = recentPapers.filter((p: any) => p.id !== paper.$id);
      recentPapers.unshift(paperData);
      
      if (recentPapers.length > 6) {
        recentPapers = recentPapers.slice(0, 6);
      }
      
      localStorage.setItem('recentPapers', JSON.stringify(recentPapers));
    } catch (e) {
      console.error('Failed to save recent paper', e);
    }
  }, [paper]);
  
  return null;
}
