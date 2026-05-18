import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AdSlotProps {
  variant?: 'header' | 'in-feed' | 'anchor';
  className?: string;
}

export default function AdSlot({ variant = 'in-feed', className }: AdSlotProps) {
  // In a real implementation, you would use next/script to load AdSense script globally,
  // and then render the ins element here. For now, it's a styled placeholder.

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-surface-50/60 border border-dashed border-surface-200 overflow-hidden relative",
        {
          'w-full h-[90px] my-6 rounded-2xl': variant === 'header',
          'w-full sm:w-[300px] h-[250px] mx-auto my-8 rounded-3xl': variant === 'in-feed',
          'fixed bottom-0 left-0 w-full h-[60px] z-40 glass border-t border-surface-200/50': variant === 'anchor',
        },
        className
      )}
    >
      <span className="text-xs font-semibold tracking-widest text-surface-300 uppercase">
        Advertisement
      </span>
      {/* 
        <ins className="adsbygoogle"
            style={{display: 'block'}}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script> 
      */}
    </div>
  );
}
