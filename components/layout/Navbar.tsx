'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, BookOpen, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleSync = () => {
      const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      setTheme(currentTheme);
    };
    window.addEventListener('theme-change', handleSync);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('theme-change', handleSync);
    };
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
    window.dispatchEvent(new Event('theme-change'));
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: BookOpen, label: 'Papers', href: '/past-papers' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Hide navbar on the full-screen viewer — it has its own floating action bar
  if (pathname?.startsWith('/past-papers/view')) return null;

  return (
    <>
      {/* Top Header - Hidden on md or smaller */}
      <header className="hidden lg:flex fixed top-0 inset-x-0 z-50 justify-center px-4 py-4 md:py-6 pointer-events-none">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`pointer-events-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5 rounded-full transition-all duration-300 w-full max-w-screen-xl mx-auto ${
            scrolled 
              ? 'bg-surface shadow-xl border border-border-subtle' 
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link href="/" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center gap-2.5 group shrink-0">
            <img 
              src="/logo.jpg" 
              alt="SabaqPoint Logo" 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-outfit text-lg md:text-xl font-bold tracking-tight text-foreground hidden sm:block">
              Sabaq<span className="text-brand-yellow">Point</span>
            </span>
          </Link>

          {/* Desktop Links - Hidden on Mobile/Tablet */}
          <div className="hidden lg:flex items-center gap-3">
            <nav className="flex items-center gap-1 bg-surface-elevated rounded-full p-1 border border-border-subtle shadow-inner">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="relative px-5 py-2 rounded-full text-sm font-bold transition-colors group">
                    <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-[#121212]' : 'text-surface-500 hover:text-foreground'}`}>
                      <item.icon size={16} className={isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 transition-opacity'} />
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-desktop"
                        className="absolute inset-0 bg-brand-yellow rounded-full z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {mounted && (
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-surface-500 hover:text-foreground cursor-pointer transition-all active:scale-95 shadow-md"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} className="text-brand-yellow" /> : <Moon size={18} className="text-brand-yellow" />}
              </button>
            )}
          </div>

        </motion.div>
      </header>

      {/* Mobile/Tablet Bottom Navigation - Hidden on Desktop */}
      <div className="lg:hidden fixed bottom-6 inset-x-0 z-[999] flex justify-center px-4">
        <nav className="flex items-center gap-2 bg-surface border border-border-subtle rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="relative group">
                <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-colors ${isActive ? 'text-[#121212]' : 'text-surface-500 hover:text-foreground'}`}>
                  <item.icon size={isActive ? 22 : 20} className="transition-all" />
                </div>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-mobile"
                    className="absolute inset-0 bg-brand-yellow rounded-full z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          {/* {mounted && (
            <button
              onClick={toggleTheme}
              className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full text-surface-500 hover:text-white cursor-pointer transition-colors active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={22} className="text-brand-yellow" /> : <Moon size={22} className="text-brand-yellow" />}
            </button>
          )} */}
        </nav>
      </div>
    </>
  );
}
