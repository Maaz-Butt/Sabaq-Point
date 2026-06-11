'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, Clock, HelpCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate api submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const faqs = [
    {
      q: "How fast do you respond to inquiries?",
      a: "Our typical response time is under 2 hours during normal operating hours. For weekends, we usually respond within 12-24 hours."
    },
    {
      q: "Can I request specific past papers?",
      a: "Absolutely! Please use this form, specify the board, class, and year in the message, and our team will try to upload it within 48 hours."
    },
    {
      q: "Are the solved solutions verified?",
      a: "Yes, all our past paper solutions are prepared by subject matter experts and double-checked for accuracy before publishing."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pt-7 lg:pt-26 xl:pt-36 pb-32">
      
      {/* Back to Home & Title */}
      <header className="mb-10 md:mb-14 relative z-10 w-full animate-page-in">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-surface-500 hover:text-foreground font-bold text-sm mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-display-lg md:text-display-xl font-bold font-sans mb-3 text-foreground tracking-tight">
          Get in <span className='text-brand-yellow'>Touch</span>
        </h1>
        <p className="text-surface-500 text-lg md:text-xl font-medium font-sans max-w-2xl">
          Have questions about papers, found an issue, or want to give feedback? Reach out to us.
        </p>
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-16 relative z-10">
        
        {/* Contact Form Box (Bento Cell 1 - Span 2) */}
        <div className="bg-surface border border-border-subtle rounded-[32px] p-6 md:p-10 lg:col-span-2 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-outfit">Send a Message</h2>
            </div>

            <AnimatePresence mode="wait">
              {!submitSuccess ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-surface-400 mb-2 uppercase tracking-wider">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-surface-elevated border border-border-subtle rounded-2xl px-5 py-4 text-foreground placeholder-surface-500 focus:outline-none focus:border-brand-yellow/50 transition-colors font-medium"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-surface-400 mb-2 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-surface-elevated border border-border-subtle rounded-2xl px-5 py-4 text-foreground placeholder-surface-500 focus:outline-none focus:border-brand-yellow/50 transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-surface-400 mb-2 uppercase tracking-wider">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Feedback / Request Paper / Business Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-surface-elevated border border-border-subtle rounded-2xl px-5 py-4 text-foreground placeholder-surface-500 focus:outline-none focus:border-brand-yellow/50 transition-colors font-medium"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-surface-400 mb-2 uppercase tracking-wider">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-surface-elevated border border-border-subtle rounded-2xl px-5 py-4 text-foreground placeholder-surface-500 focus:outline-none focus:border-brand-yellow/50 transition-colors font-medium resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-brand-yellow text-[#121212] px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 rounded-full border-2 border-[#121212] border-t-transparent animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center bg-surface-elevated border border-border-subtle rounded-3xl p-6"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mb-6">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 font-outfit">Message Sent Successfully!</h3>
                  <p className="text-surface-500 font-bold text-sm max-w-sm mb-6">
                    Thank you for reaching out. Our support ecosystem has received your ticket and will respond shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-brand-light text-[#121212] px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Grid (Bento Cell 2 & 3 - Stacked) */}
        <div className="flex flex-col gap-4 md:gap-6">
          
          {/* Card: Active Support (Brand Green) */}
          <div className="bg-brand-green text-[#121212] rounded-[32px] p-6 md:p-8 flex flex-col justify-between min-h-[220px] cursor-pointer hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div className="inline-flex items-center gap-2 bg-[#121212]/10 px-4 py-2 rounded-full font-bold text-xs">
                <Clock size={14} /> Response Time
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-3xl font-black mb-2 font-outfit tracking-tight">&lt; 2 Hours</h3>
              <p className="font-bold text-[#121212]/70 text-sm">
                Average reply time during business days. Support is currently online.
              </p>
            </div>
          </div>

          {/* Card: Ecosystem Email (Brand Pink) */}
          <div className="bg-brand-pink text-[#121212] rounded-[32px] p-6 md:p-8 flex flex-col justify-between min-h-[220px] cursor-pointer hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div className="inline-flex items-center gap-2 bg-[#121212]/10 px-4 py-2 rounded-full font-bold text-xs">
                <Mail size={14} /> Direct Email
              </div>
            </div>
            
            <div>
              <a 
                href="mailto:sabaqpoint.ecosystem@gmail.com" 
                className="text-xl md:text-2xl font-black mb-2 font-outfit break-all hover:underline leading-tight block tracking-tight"
              >
                sabaqpoint.ecosystem<br />@gmail.com
              </a>
              <p className="font-bold text-[#121212]/70 text-sm mt-2">
                For partnerships, enterprise features, or urgent general inquiries.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* FAQs Section */}
      <section className="mt-8 animate-page-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
            <HelpCircle size={20} />
          </div>
          <h2 className="text-3xl font-bold text-foreground font-outfit">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-surface-elevated/50 border border-border-subtle rounded-[28px] p-6 flex flex-col justify-between transition-colors duration-300">
              <div>
                <h4 className="text-lg font-bold text-foreground mb-3 font-outfit leading-snug">{faq.q}</h4>
                <p className="text-surface-500 font-semibold text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
