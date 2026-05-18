import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact Us | SabaqPoint - Past Papers & Solutions Support',
  description: 'Have questions, found a bug, or want to request a specific Matric or Intermediate solved past paper for the 2026 exams? Contact our support team today.',
  keywords: [
    'contact sabaqpoint',
    'request solved papers',
    'solved past papers help',
    'exam preparation feedback'
  ],
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
