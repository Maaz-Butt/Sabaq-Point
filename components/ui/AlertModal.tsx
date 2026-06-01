'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // If defined, it behaves as a confirm modal; if omitted, it behaves as an alert modal
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: AlertModalProps) {
  // Theme styling based on type
  const theme = {
    danger: {
      bg: 'bg-red-500/10 border-red-500/20 text-red-400',
      btn: 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/10',
      icon: <XCircle className="w-8 h-8 text-red-400 animate-pulse" />,
    },
    warning: {
      bg: 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow',
      btn: 'bg-brand-yellow hover:scale-[1.02] text-[#121212] shadow-brand-yellow/10',
      icon: <AlertTriangle className="w-8 h-8 text-brand-yellow animate-bounce" style={{ animationDuration: '2s' }} />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      btn: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/10',
      icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      btn: 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/10',
      icon: <Info className="w-8 h-8 text-blue-400" />,
    },
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0c0c0c]/70 backdrop-blur-md"
          />

          {/* Modal content card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            className="relative w-full max-w-md bg-[#222222] border border-white/10 rounded-[32px] p-6 sm:p-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 flex flex-col items-center text-center animate-page-in"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-surface-500 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            >
              <X size={14} />
            </button>

            {/* Type Specific Icon Wrapper */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 border ${theme.bg}`}>
              {theme.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
              {title}
            </h2>

            {/* Message */}
            <p className="text-sm sm:text-base text-surface-500 font-bold max-w-sm mb-6 leading-relaxed">
              {message}
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3">
              {onConfirm && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:order-1 btn-secondary py-3 text-sm font-bold rounded-full border border-white/10 hover:bg-white/5 text-white transition-colors cursor-pointer"
                >
                  {cancelText}
                </button>
              )}
              
              <button
                type="button"
                onClick={() => {
                  if (onConfirm) {
                    onConfirm();
                  } else {
                    onClose();
                  }
                }}
                className={`w-full sm:order-2 py-3 text-sm font-black rounded-full transition-all cursor-pointer shadow-lg ${theme.btn}`}
              >
                {onConfirm ? confirmText : 'OK'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
