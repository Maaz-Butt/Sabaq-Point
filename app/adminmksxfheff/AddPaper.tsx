'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPaper } from '@/actions/paper';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, FileUp, X, FileText, Type } from 'lucide-react';
import { Client, Storage, ID } from 'appwrite';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function AddPaper({ 
  boards, 
  existingCategories = [],
  storageBucketId,
  appwriteEndpoint,
  appwriteProjectId
}: { 
  boards: any[], 
  existingCategories?: string[],
  storageBucketId: string,
  appwriteEndpoint: string,
  appwriteProjectId: string
}) {
  interface UploadFileItem {
    id: string;
    file: File;
    title: string;
    previewUrl?: string;
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
    error?: string;
  }

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadFileItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [commonTitle, setCommonTitle] = useState('');
  const [contentMode, setContentMode] = useState<'file' | 'text'>('file');
  const [richContent, setRichContent] = useState('');

  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [currentUploadProgress, setCurrentUploadProgress] = useState(0);

  // Keep a ref of selected files to clean up previews on unmount
  const filesRef = useRef<UploadFileItem[]>([]);
  useEffect(() => {
    filesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach(item => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const handleCommonTitleChange = (newTitle: string) => {
    setCommonTitle(newTitle);
    if (selectedFiles.length === 1) {
      setSelectedFiles(prev =>
        prev.map(item => ({ ...item, title: newTitle }))
      );
    }
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(
      file => file.type === "application/pdf" || file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      setStatus({ type: 'error', message: 'Only PDF or Image files are allowed.' });
      return;
    }

    const newItems: UploadFileItem[] = validFiles.map(file => {
      let previewUrl: string | undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }
      // Extract file name without extension
      const title = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        title,
        previewUrl,
        progress: 0,
        status: 'idle',
      };
    });

    setSelectedFiles(prev => {
      const updated = [...prev, ...newItems];
      if (updated.length === 1) {
        if (commonTitle) {
          updated[0].title = commonTitle;
        } else {
          setCommonTitle(updated[0].title);
        }
      }
      return updated;
    });
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const target = prev.find(item => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const filtered = prev.filter(item => item.id !== id);
      if (filtered.length === 1) {
        setCommonTitle(filtered[0].title);
      } else if (filtered.length === 0) {
        setCommonTitle('');
      }
      return filtered;
    });
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setSelectedFiles(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, title: newTitle } : item));
      if (updated.length === 1) {
        setCommonTitle(newTitle);
      }
      return updated;
    });
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    const isTextMode = contentMode === 'text';
    const hasRichContent = richContent.replace(/<[^>]*>/g, '').trim().length > 0;

    if (isTextMode) {
      if (!hasRichContent) {
        setStatus({ type: 'error', message: 'Please write some content in the text editor.' });
        return;
      }
      // Text-only path: call server action directly (no Appwrite storage upload)
      setIsSubmitting(true);
      setStatus({ type: '', message: '' });
      setTotalUploadCount(1);
      setCurrentUploadIndex(1);
      setCurrentUploadProgress(50);

      try {
        const formData = new FormData(formElement);
        formData.set('richContent', richContent);
        formData.delete('paperFile');
        const result = await createPaper(formData);
        if (result?.success) {
          setCurrentUploadProgress(100);
          setStatus({ type: 'success', message: 'Content published successfully!' });
          setTimeout(() => {
            setRichContent('');
            formRef.current?.reset();
            setStatus({ type: '', message: '' });
            setCurrentUploadProgress(0);
          }, 2500);
        } else {
          throw new Error(result?.error || 'Failed to save content.');
        }
      } catch (error: any) {
        setStatus({ type: 'error', message: error?.message || 'Failed to save content.' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const filesToUpload = selectedFiles.filter(f => f.status === 'idle' || f.status === 'error');
    if (filesToUpload.length === 0) {
      setStatus({ type: 'error', message: 'Please select at least one paper file first.' });
      return;
    }

    // Check size limit (50MB) for all files
    const largeFiles = filesToUpload.filter(f => f.file.size > 50 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setStatus({ 
        type: 'error', 
        message: `Some files exceed the 50MB limit: ${largeFiles.map(f => f.file.name).join(', ')}` 
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const totalToUpload = filesToUpload.length;
    setTotalUploadCount(totalToUpload);
    let currentIdx = 0;

    // Initialize Appwrite Client & Storage
    const client = new Client()
      .setEndpoint(appwriteEndpoint)
      .setProject(appwriteProjectId);
    const storage = new Storage(client);

    let successCount = 0;
    let failCount = 0;

    for (const item of filesToUpload) {
      currentIdx++;
      setCurrentUploadIndex(currentIdx);
      setCurrentUploadProgress(0);

      // Update item status to uploading
      setSelectedFiles(prev =>
        prev.map(f => (f.id === item.id ? { ...f, status: 'uploading', progress: 0 } : f))
      );

      try {
        // 1. Upload to Appwrite with progress
        const uploadedFile = await storage.createFile(
          storageBucketId,
          ID.unique(),
          item.file,
          undefined,
          (progress: any) => {
            const percentage = Math.round(progress.progress);
            setCurrentUploadProgress(Math.min(99, percentage));
            setSelectedFiles(prev =>
              prev.map(f => (f.id === item.id ? { ...f, progress: Math.min(99, percentage) } : f))
            );
          }
        );

        // 2. Prepare Form Data for Server Action
        const formData = new FormData(formElement);
        formData.delete('paperFile'); // bypass body limit
        formData.set('paperFileId', uploadedFile.$id);
        formData.set('title', item.title); // set individual custom title
        formData.delete('richContent'); // no rich content in file mode

        // 3. Call Server Action
        const result = await createPaper(formData);
        
        if (result?.success) {
          successCount++;
          setCurrentUploadProgress(100);
          setSelectedFiles(prev =>
            prev.map(f => (f.id === item.id ? { ...f, status: 'success', progress: 100 } : f))
          );
        } else {
          // Cleanup uploaded file from storage if server action fails
          try {
            await storage.deleteFile(storageBucketId, uploadedFile.$id);
          } catch (delError) {
            console.error('Failed to cleanup uploaded file:', delError);
          }
          throw new Error(result?.error || 'Failed to add paper record.');
        }
      } catch (error: any) {
        failCount++;
        setCurrentUploadProgress(0);
        console.error(`Error uploading ${item.file.name}:`, error);
        setSelectedFiles(prev =>
          prev.map(f => (f.id === item.id ? { ...f, status: 'error', progress: 0, error: error?.message || 'Upload failed.' } : f))
        );
      }
    }

    setIsSubmitting(false);

    if (failCount === 0) {
      setStatus({ type: 'success', message: `All ${successCount} papers uploaded successfully!` });
      // Reset files after brief delay
      setTimeout(() => {
        setSelectedFiles(prev => {
          prev.forEach(item => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
          });
          return [];
        });
        setCommonTitle('');
        formRef.current?.reset();
        setStatus({ type: '', message: '' });
      }, 2500);
    } else if (successCount > 0) {
      setStatus({ 
        type: 'success', 
        message: `Successfully uploaded ${successCount} papers. ${failCount} failed. You can adjust titles/errors and try again.` 
      });
    } else {
      setStatus({ type: 'error', message: 'Failed to upload papers. Please review errors and try again.' });
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
            
            <h3 style={{ fontFamily: 'var(--font-outfit)' }} className="text-lg font-bold text-white mb-1">
              Uploading {currentUploadIndex} of {totalUploadCount}
            </h3>
            <p className="text-sm text-brand-yellow font-semibold max-w-[280px] mb-2 truncate">
              {selectedFiles.filter(f => f.status === 'uploading')[0]?.title || 'Processing...'}
            </p>
            <p className="text-xs text-surface-500 max-w-[280px] mb-6">
              Please wait while we upload and process your file. Do not navigate away.
            </p>

            <div className="w-full max-w-[280px] bg-surface-50/50 rounded-full h-2 overflow-hidden mb-2">
              <motion.div 
                className="bg-brand-yellow h-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentUploadProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-sm font-bold text-brand-yellow">{currentUploadProgress}%</span>
          </motion.div>
        )}
      </AnimatePresence>
      <h2
        style={{ fontFamily: 'var(--font-outfit)' }}
        className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-lg bg-secondary-500 flex items-center justify-center">
          <FileUp size={18} className="text-white" />
        </div>
        Add New Papers
      </h2>

      {/* Content Mode Switcher */}
      <div className="flex gap-2 mb-5 p-1 rounded-xl bg-black/30 border border-white/5">
        <button
          type="button"
          onClick={() => setContentMode('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            contentMode === 'file'
              ? 'bg-brand-yellow text-[#121212]'
              : 'text-surface-500 hover:text-white'
          }`}
        >
          <Upload size={14} />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setContentMode('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            contentMode === 'text'
              ? 'bg-brand-yellow text-[#121212]'
              : 'text-surface-500 hover:text-white'
          }`}
        >
          <Type size={14} />
          Write Text
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        {(contentMode === 'text' || selectedFiles.length <= 1) && (
          <div className="animate-page-in">
            <label htmlFor="title" className={labelClasses}>Paper Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={commonTitle}
              onChange={(e) => handleCommonTitleChange(e.target.value)}
              className={inputClasses}
              placeholder="e.g., FBISE Biology Class 10 Solved Paper 2026"
              required={contentMode === 'text' || selectedFiles.length === 1}
            />
          </div>
        )}

        {contentMode === 'file' && selectedFiles.length > 1 && (
          <div className="p-4 rounded-2xl bg-[#1c1c1e]/50 border border-white/5 text-sm text-surface-500 animate-page-in">
            Multiple files selected. Please customize the titles of each paper individually in the files list below.
          </div>
        )}

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

        {/* File upload area OR Rich text editor */}
        {contentMode === 'file' ? (
        <div>
          <label htmlFor="paperFile" className={labelClasses}>
            {selectedFiles.length > 0 ? "Add More Files (PDF or Image)" : "Upload Files (PDF or Image)"}
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf, image/*"
            name="paperFile"
            id="paperFile"
            multiple
            required={false}
            onChange={handleFileChange}
            className="sr-only"
          />

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] ${
              isDragActive 
                ? 'border-brand-yellow bg-brand-yellow/5 scale-[0.99]' 
                : 'border-white/10 bg-surface-50/30 hover:border-brand-yellow/50 hover:bg-surface-50/50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 text-surface-500 hover:text-brand-yellow transition-colors">
              <Upload size={18} />
            </div>
            <p className="text-sm font-medium text-white">
              Drag & drop {selectedFiles.length > 0 ? 'more ' : ''}files here, or <span className="text-brand-yellow underline">browse</span>
            </p>
            <p className="text-xs text-surface-500 mt-1">
              Supports multiple PDF or Image files up to 50MB each
            </p>
          </div>
        </div>
        ) : (
        <div>
          <label className={labelClasses}>Text Content</label>
          <RichTextEditor
            value={richContent}
            onChange={setRichContent}
            placeholder="Write your content here... Use the toolbar to add bold, italic, bullet lists, and more."
            disabled={isSubmitting}
          />
          <p className="text-[11px] text-surface-500 mt-1.5 pl-1">
            Supports bold, italic, underline, bullet & numbered lists.
          </p>
        </div>
        )}

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5 animate-page-in">
            <div className="flex items-center justify-between text-[10px] text-surface-500 font-bold px-1 uppercase tracking-wider">
              <span>Selected Files ({selectedFiles.length})</span>
              <button 
                type="button" 
                disabled={isSubmitting}
                onClick={() => {
                  selectedFiles.forEach(item => {
                    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                  });
                  setSelectedFiles([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-red-400 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {selectedFiles.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    item.status === 'success' 
                      ? 'border-emerald-500/30 bg-emerald-500/5' 
                      : item.status === 'error'
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Preview/Thumbnail */}
                  {item.previewUrl ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/25">
                      <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center flex-shrink-0 text-brand-yellow border border-brand-yellow/20">
                      <FileText size={18} />
                    </div>
                  )}

                  {/* Editable Title Input & Details */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTitleChange(item.id, e.target.value)}
                      disabled={isSubmitting || item.status === 'success'}
                      placeholder="Enter customized paper title..."
                      className="w-full bg-transparent border-b border-transparent hover:border-white/10 focus:border-brand-yellow text-sm font-semibold text-white focus:outline-none pb-0.5 transition-all truncate disabled:opacity-75"
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] text-surface-500 font-medium">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      {item.file.size > 5 * 1024 * 1024 && (
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                          ⚠️ Heavy (Loads slow on mobile)
                        </span>
                      )}
                      {item.error && (
                        <span className="text-[10px] text-red-400 font-semibold truncate max-w-[150px] sm:max-w-[250px]">
                          • {item.error}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action/Status Indicator */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {item.status === 'uploading' && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-brand-yellow/30 border-t-brand-yellow animate-spin" />
                        <span className="text-xs font-bold text-brand-yellow">{item.progress}%</span>
                      </div>
                    )}
                    {item.status === 'success' && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle size={14} />
                      </div>
                    )}
                    {item.status === 'error' && (
                      <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <AlertCircle size={14} />
                      </div>
                    )}
                    {item.status === 'idle' && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => removeFile(item.id)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/10 text-surface-500 hover:text-red-400 flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                status.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          type="submit" 
          disabled={isSubmitting || (contentMode === 'file' && selectedFiles.length === 0)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {contentMode === 'text' ? 'Publishing...' : 'Uploading...'}
            </div>
          ) : (
            <>
              {contentMode === 'text' ? <Type size={16} /> : <Upload size={16} />}
              {contentMode === 'text'
                ? 'Publish Text Content'
                : selectedFiles.length > 1 
                  ? `Upload ${selectedFiles.length} Papers` 
                  : selectedFiles.length === 1 
                    ? 'Upload 1 Paper' 
                    : 'Upload Papers'
              }
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
