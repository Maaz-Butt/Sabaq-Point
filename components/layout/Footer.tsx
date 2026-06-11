import React from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-auto pt-16 md:pt-20 pb-28 lg:pb-12 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="card-interactive bg-surface-elevated/50 backdrop-blur-xl border border-white/5 p-6 md:p-8 lg:p-12 shadow-2xl relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 relative z-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 md:mb-6 group">
              <img 
                src="/logo.jpg" 
                alt="SabaqPoint Logo" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-2xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-outfit text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
                Sabaq<span className="text-brand-yellow">Point</span>
              </span>
            </Link>
            <p className="text-surface-500 text-sm md:text-base leading-relaxed max-w-sm font-medium mb-4">
              Your go-to platform for past papers and solved solutions. 
              Ace your exams with our comprehensive, organized collection.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full text-xs font-bold text-surface-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse shrink-0" />
              <span>Sponsored by <span className="text-brand-yellow font-extrabold">RISERS ACADEMY</span></span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-label text-surface-400 mb-4 md:mb-6 font-bold">Navigate</h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'All Papers', href: '/past-papers' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base font-semibold text-surface-500 hover:text-brand-yellow transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-yellow/50 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-label text-surface-400 mb-4 md:mb-6 font-bold">Connect</h4>
            <div className="flex items-center gap-3">
              {[
                { icon: Mail, href: 'mailto:sabaqpoint.ecosystem@gmail.com', label: 'Email' },
                { icon: Globe, href: '/', label: 'Website' },
                { icon: Heart, href: '/contact', label: 'Support' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-surface-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20"
                >
                  <social.icon size={18} className="md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
