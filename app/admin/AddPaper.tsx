'use client';

import React, { useRef, useState } from 'react';
import { createPaper } from '@/actions/paper';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, FileUp } from 'lucide-react';

export default function AddPaper({ boards, existingCategories = [] }: { boards: any[], existingCategories?: string[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      const result = await createPaper(formData);
      if (result?.success) {
        formRef.current?.reset();
        setStatus({ type: 'success', message: 'Paper added successfully!' });
      } else {
        setStatus({ type: 'error', message: result?.error || 'Failed to add paper.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 3000);
    }
  };

  const inputClasses = "input-modern";
  const labelClasses = "text-label text-surface-500 mb-2 block text-xs";

  return (
    <div className="bg-[#222222] border border-white/10 rounded-[32px] p-8">
      <h2
        style={{ fontFamily: 'var(--font-outfit)' }}
        className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-lg bg-secondary-500 flex items-center justify-center">
          <FileUp size={18} className="text-white" />
        </div>
        Add New Paper
      </h2>

      <form ref={formRef} action={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className={labelClasses}>Paper Title</label>
          <input type="text" name="title" id="title" required className={inputClasses} placeholder="e.g., Physics 10th Class 2023" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="boardId" className={labelClasses}>Board</label>
            <select name="boardId" id="boardId" required className={inputClasses} style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239a9083' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}>
              <option value="">Select Board</option>
              {boards?.map((board: any) => (
                <option key={board.$id} value={board.$id}>{board.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="classLevel" className={labelClasses}>Class</label>
            <input type="text" name="classLevel" id="classLevel" required className={inputClasses} placeholder="e.g., 10th or O Level" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="subject" className={labelClasses}>Subject</label>
            <input type="text" name="subject" id="subject" required className={inputClasses} placeholder="e.g., Physics" />
          </div>
          <div>
            <label htmlFor="year" className={labelClasses}>Year</label>
            <input type="number" name="year" id="year" required min="2000" max={new Date().getFullYear()} className={inputClasses} placeholder="2024" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className={labelClasses}>Type</label>
            <select name="type" id="type" required className={inputClasses} style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239a9083' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
            </select>
          </div>
          <div>
            <label htmlFor="group" className={labelClasses}>Group (Optional)</label>
            <input type="text" name="group" id="group" className={inputClasses} placeholder="e.g., Group 1" />
          </div>
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className={labelClasses}>Category</label>
          <input 
            type="text" 
            name="category" 
            id="category" 
            list="category-suggestions" 
            className={inputClasses} 
            placeholder="e.g., past-papers, additional, importants" 
            required
          />
          <datalist id="category-suggestions">
            {['past-papers', 'additional', 'importants', ...existingCategories.filter(c => !['past-papers', 'additional', 'importants'].includes(c))].map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        {/* File upload area */}
        <div>
          <label htmlFor="paperFile" className={labelClasses}>Upload File (PDF or Image)</label>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf, image/*"
              name="paperFile"
              id="paperFile"
              required
              className="input-modern file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 file:transition-colors file:cursor-pointer cursor-pointer"
            />
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

        <motion.button 
          type="submit" 
          disabled={isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              Uploading...
            </div>
          ) : (
            <>
              <Upload size={16} />
              Upload Paper
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
