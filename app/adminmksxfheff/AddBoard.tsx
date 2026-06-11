'use client';

import React, { useRef, useState } from 'react';
import { createBoard } from '@/actions/board';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';

export default function AddBoard() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      const result = await createBoard(formData);
      if (result?.success) {
        formRef.current?.reset();
        setStatus({ type: 'success', message: 'Board created successfully!' });
      } else {
        setStatus({ type: 'error', message: result?.error || 'Failed to create board.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="bg-[#222222] border border-white/10 rounded-[32px] p-8">
      <h2
        style={{ fontFamily: 'var(--font-outfit)' }}
        className="text-lg font-semibold text-foreground mb-5 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
          <Plus size={16} className="text-white" />
        </div>
        Add New Board
      </h2>
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-label text-surface-500 mb-2 block text-xs">Board Name</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              name="name" 
              id="name" 
              required 
              className="input-modern flex-1" 
              placeholder="e.g., Punjab Board" 
            />
            <motion.button 
              type="submit" 
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary px-5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : 'Add'}
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
