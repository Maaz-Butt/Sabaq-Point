import React from 'react';
import { getBoards } from '@/actions/board';
import { getCategories } from '@/actions/paper';
import AddBoard from './AddBoard';
import AddPaper from './AddPaper';
import { Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard - SabaqPoint',
};

export default async function AdminPage() {
  const { data: boards } = await getBoards();
  const { data: categories } = await getCategories();

  return (
    <div className="animate-page-in">
      {/* Admin Header */}
      <div className="relative pt-6 lg:pt-24 xl:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow shadow-[0_0_15px_rgba(252,213,113,0.1)]">
              <Shield size={20} />
            </div>
            <span className="bg-[#222222] border border-white/10 px-4 py-1.5 rounded-full text-surface-500 font-bold text-xs uppercase tracking-wider">
              Admin Control
            </span>
          </div>
          <h1 className="text-display-lg font-black font-sans text-white mb-3 tracking-tight">Dashboard</h1>
          <p className="text-surface-500 font-bold text-lg">Manage boards and past papers efficiently.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <AddBoard />
          </div>
          <div className="lg:col-span-2">
            <AddPaper 
              boards={boards || []} 
              existingCategories={categories || []} 
              storageBucketId={process.env.APPWRITE_STORAGE_BUCKET_ID || ''}
              appwriteEndpoint={process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ''}
              appwriteProjectId={process.env.NEXT_PUBLIC_APPWRITE_PROJECT || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
