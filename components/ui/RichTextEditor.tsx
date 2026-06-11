'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RemoveFormatting,
  Minus,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

interface ToolbarButton {
  icon: React.ReactNode;
  command: string;
  title: string;
  value?: string;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { icon: <Bold size={14} />, command: 'bold', title: 'Bold (Ctrl+B)' },
  { icon: <Italic size={14} />, command: 'italic', title: 'Italic (Ctrl+I)' },
  { icon: <Underline size={14} />, command: 'underline', title: 'Underline (Ctrl+U)' },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your content here...',
  minHeight = 280,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // Track whether the last change came from inside the editor (to avoid cursor jumping)
  const isInternalChange = useRef(false);

  // Sync value → DOM only on external changes
  useEffect(() => {
    const el = editorRef.current;
    if (!el || isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const execCmd = useCallback(
    (command: string, val?: string) => {
      if (disabled) return;
      editorRef.current?.focus();
      document.execCommand(command, false, val);
      const html = editorRef.current?.innerHTML ?? '';
      isInternalChange.current = true;
      onChange(html);
    },
    [disabled, onChange]
  );

  const handleInput = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    isInternalChange.current = true;
    onChange(html);
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        execCmd('bold');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        execCmd('italic');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        execCmd('underline');
      }
    },
    [execCmd]
  );

  const isActive = (command: string) => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  return (
    <div
      className={`rounded-2xl border border-white/10 overflow-hidden transition-all duration-200 ${
        disabled ? 'opacity-60 pointer-events-none' : 'focus-within:border-brand-yellow/50'
      }`}
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-[#1a1a1a] flex-wrap">
        {/* Formatting buttons */}
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.command}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault(); // keep focus in editor
              execCmd(btn.command, btn.value);
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-sm font-bold ${
              isActive(btn.command)
                ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30'
                : 'text-surface-500 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            {btn.icon}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Bullet list */}
        <button
          type="button"
          title="Bullet List"
          onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-surface-500 hover:text-white hover:bg-white/10 border border-transparent"
        >
          <List size={14} />
        </button>

        {/* Numbered list */}
        <button
          type="button"
          title="Numbered List"
          onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-surface-500 hover:text-white hover:bg-white/10 border border-transparent"
        >
          <ListOrdered size={14} />
        </button>

        {/* Horizontal rule */}
        <button
          type="button"
          title="Insert Horizontal Line"
          onMouseDown={(e) => { e.preventDefault(); execCmd('insertHorizontalRule'); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-surface-500 hover:text-white hover:bg-white/10 border border-transparent"
        >
          <Minus size={14} />
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          title="Clear Formatting"
          onMouseDown={(e) => { e.preventDefault(); execCmd('removeFormat'); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-surface-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent"
        >
          <RemoveFormatting size={14} />
        </button>

        <span className="ml-auto text-[10px] text-surface-500 hidden sm:block select-none">
          Ctrl+B · Ctrl+I · Ctrl+U
        </span>
      </div>

      {/* ── Editable Area ── */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className={`
            rich-editor-content
            px-4 py-3 text-sm text-white leading-relaxed outline-none
            focus:outline-none
          `}
        />
      </div>

      {/* Scoped styles for the editable area + placeholder */}
      <style>{`
        .rich-editor-content:empty::before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.25);
          pointer-events: none;
        }
        .rich-editor-content ul {
          list-style: disc;
          padding-left: 1.4em;
          margin: 0.4em 0;
        }
        .rich-editor-content ol {
          list-style: decimal;
          padding-left: 1.4em;
          margin: 0.4em 0;
        }
        .rich-editor-content li {
          margin: 0.2em 0;
        }
        .rich-editor-content b, .rich-editor-content strong {
          font-weight: 700;
        }
        .rich-editor-content i, .rich-editor-content em {
          font-style: italic;
        }
        .rich-editor-content u {
          text-decoration: underline;
        }
        .rich-editor-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.12);
          margin: 0.75em 0;
        }
        .rich-editor-content p {
          margin: 0.3em 0;
        }
        .rich-editor-content div {
          margin: 0.1em 0;
        }
      `}</style>
    </div>
  );
}
