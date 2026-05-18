'use client';

import React from 'react';
import { motion } from 'framer-motion';
import HeroSearch from './HeroSearch';

export default function AnimatedHero() {
  return (
    <header className="mb-8 md:mb-12 pt-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center mb-10 md:mb-14 pt-8 md:pt-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(252,213,113,0.2)]"
        >
          <motion.span 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl md:text-4xl block"
          >
            👨‍🎓
          </motion.span>
        </motion.div>
        
        <h1 className="text-display-xl mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Hey, <span className="gradient-text">Student 👋</span>
        </h1>
        <p className="text-surface-400 text-lg md:text-xl max-w-lg mx-auto font-medium mb-10">
          Ready to ace your exams? Find all your past papers, organized perfectly for you.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex justify-center px-2"
        >
          <HeroSearch />
        </motion.div>
      </motion.div>
    </header>
  );
}
