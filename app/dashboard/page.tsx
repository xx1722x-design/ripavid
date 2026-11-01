'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/app/context/AuthContext';

const UserDashboard = dynamic(() => import('@/app/components/UserDashboard'), {
  ssr: false,
});

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [language] = useState('en');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">Login Required</h1>
          <p className="text-zinc-400 mb-8">Please sign in to access your job history and dashboard.</p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Header with User Info */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || '👤'}
            </div>
            <div>
              <h2 className="text-white font-semibold">{user?.name || user?.email || 'User'}</h2>
              <p className="text-xs text-zinc-400">
                {user?.tier === 'pro' ? '✨ Pro User' : '📦 Free User'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg text-sm transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <UserDashboard language={language} />
      </div>
    </div>
  );
}
