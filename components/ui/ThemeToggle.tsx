'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (document.documentElement.classList.contains('light')) {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    
    // Dispatch custom event to sync with other theme toggles
    window.dispatchEvent(new Event('theme-change'));
  };

  // Sync theme state across multiple render locations
  useEffect(() => {
    const handleSync = () => {
      const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      setTheme(currentTheme);
    };
    window.addEventListener('theme-change', handleSync);
    return () => window.removeEventListener('theme-change', handleSync);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-surface-elevated/50 border border-white/5" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-surface-500 hover:text-foreground cursor-pointer transition-all active:scale-95 shadow-md"
      aria-label="Toggle Theme"
      style={{ touchAction: 'manipulation' }}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-brand-yellow" />
      ) : (
        <Moon size={18} className="text-brand-yellow" />
      )}
    </button>
  );
}
