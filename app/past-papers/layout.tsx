import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Solved Past Papers 2026 - Matric & Intermediate (Class 9, 10, 11, 12)',
  description: 'Access the ultimate collection of verified Matric & Intermediate past papers for 2026. Find fully solved board papers, guess papers, and class-wise subjects for all boards.',
  keywords: [
    'matric past papers 2026',
    'intermediate past papers 2026',
    'solved board papers 2026',
    'class 9 past papers',
    'class 10 solved papers',
    '1st year chemistry guess papers',
    '2nd year physics past papers',
    'FSc solved solutions',
    'ICS computer science solved papers'
  ],
  alternates: {
    canonical: '/past-papers',
  },
};

export default function PastPapersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
