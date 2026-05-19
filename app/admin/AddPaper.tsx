'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPaper } from '@/actions/paper';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, FileUp, X, FileText } from 'lucide-react';

export default function AddPaper({ boards, existingCategories = [] }: { boards: any[], existingCategories?: string[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setImagePreviewUrl(null);
      return;
    }
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [selectedFile]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setSelectedFile(file);
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      } else {
        setStatus({ type: 'error', message: 'Only PDF or Image files are allowed.' });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const step = Math.max(1, Math.floor((95 - prev) * 0.15));
        return prev + step;
      });
    }, 150);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Please select a paper file first.' });
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File is too large. Maximum size allowed is 50MB.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    const progressInterval = simulateProgress();
    
    try {
      const formData = new FormData(e.currentTarget);
      // Explicitly set the file to ensure mobile browsers (like iOS Safari) don't omit it
      formData.set('paperFile', selectedFile);

      const result = await createPaper(formData);
      if (result?.success) {
        formRef.current?.reset();
        setSelectedFile(null);
        setUploadProgress(100);
        setStatus({ type: 'success', message: 'Paper added successfully!' });
      } else {
        setStatus({ type: 'error', message: result?.error || 'Failed to add paper.' });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setStatus({ 
        type: 'error', 
        message: error?.message || 'An unexpected error occurred during upload. Please check your network connection.' 
      });
    } finally {
      clearInterval(progressInterval);
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus({ type: '', message: '' });
        setUploadProgress(0);
      }, 3000);
    }
  };

  const inputClasses = "input-modern";
  const labelClasses = "text-label text-surface-500 mb-2 block text-xs";

  return (
    <div className="bg-[#222222] border border-white/10 rounded-[32px] p-8 relative overflow-hidden">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#111111]/90 backdrop-blur-md rounded-[32px] flex flex-col items-center justify-center p-6 z-50 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-yellow/10 flex items-center justify-center mb-4 relative">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} 
                className="w-12 h-12 border-4 border-brand-yellow/20 border-t-brand-yellow rounded-full" 
              />
              <FileUp size={24} className="text-brand-yellow absolute" />
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-outfit)' }} className="text-lg font-bold text-white mb-2">
              Uploading Paper
            </h3>
            <p className="text-sm text-surface-500 max-w-[280px] mb-6">
              Please wait while we upload and process your file. Do not navigate away.
            </p>

            <div className="w-full max-w-[280px] bg-surface-50/50 rounded-full h-2 overflow-hidden mb-2">
              <motion.div 
                className="bg-brand-yellow h-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-sm font-bold text-brand-yellow">{uploadProgress}%</span>
          </motion.div>
        )}
      </AnimatePresence>
      <h2
        style={{ fontFamily: 'var(--font-outfit)' }}
        className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-lg bg-secondary-500 flex items-center justify-center">
          <FileUp size={18} className="text-white" />
        </div>
        Add New Paper
      </h2>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
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
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf, image/*"
            name="paperFile"
            id="paperFile"
            required
            onChange={handleFileChange}
            className="sr-only"
          />

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] ${
              isDragActive 
                ? 'border-brand-yellow bg-brand-yellow/5 scale-[0.99]' 
                : selectedFile 
                  ? 'border-emerald-500/30 bg-emerald-500/5' 
                  : 'border-white/10 bg-surface-50/30 hover:border-brand-yellow/50 hover:bg-surface-50/50'
            }`}
          >
            {selectedFile ? (
              <div className="w-full flex items-center justify-between gap-4 animate-page-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 min-w-0">
                  {imagePreviewUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/25">
                      <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-brand-yellow/10 flex items-center justify-center flex-shrink-0 text-brand-yellow border border-brand-yellow/20">
                      <FileText size={20} />
                    </div>
                  )}
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-[280px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/10 text-surface-500 hover:text-red-400 flex items-center justify-center transition-colors border border-white/10"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 text-surface-500 hover:text-brand-yellow transition-colors">
                  <Upload size={18} />
                </div>
                <p className="text-sm font-medium text-white">
                  Drag & drop file here, or <span className="text-brand-yellow underline">browse</span>
                </p>
                <p className="text-xs text-surface-500 mt-1">
                  Supports PDF or Image files up to 50MB
                </p>
              </>
            )}
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
