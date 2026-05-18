'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, BookOpen, Settings, PieChart, Sparkles, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              ? 'bg-[#121212] shadow-xl' 
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
            <span className="font-outfit text-lg md:text-xl font-bold tracking-tight text-white hidden sm:block">
              Sabaq<span className="text-brand-yellow">Point</span>
            </span>
          </Link>

          {/* Desktop Links - Hidden on Mobile/Tablet */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#121212] rounded-full p-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="relative px-5 py-2 rounded-full text-sm font-bold transition-colors group">
                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-[#121212]' : 'text-surface-500 hover:text-white'}`}>
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

        </motion.div>
      </header>

      {/* Mobile/Tablet Bottom Navigation - Hidden on Desktop */}
      <div className="lg:hidden fixed bottom-6 inset-x-0 z-[999] flex justify-center px-4">
        <nav className="flex items-center gap-2 bg-[#121212] border border-white/5 rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="relative group">
                <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-colors ${isActive ? 'text-[#121212]' : 'text-surface-500 hover:text-white'}`}>
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
        </nav>
      </div>
    </>
  );
}
