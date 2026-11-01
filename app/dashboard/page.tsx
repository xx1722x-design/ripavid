'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/app/context/AuthContext';
import { useSearchParams } from 'next/navigation';

const UserDashboard = dynamic(() => import('@/app/components/UserDashboard'), {
  ssr: false,
});

function DashboardContent() {
  const { user, isAuthenticated, isGuest, logout } = useAuth();
  const [language] = useState('en');
  const searchParams = useSearchParams();
  const [initialUrl, setInitialUrl] = useState('');

  useEffect(() => {
    // Extract video ID or URL from query parameters
    // Support both ?v= (video ID) and ?url= (full URL)
    try {
      const videoId = searchParams.get('v');
      const videoUrl = searchParams.get('url');

      if (videoUrl) {
        const decodedUrl = decodeURIComponent(videoUrl);
        if (typeof decodedUrl === 'string' && decodedUrl.trim().length > 0) {
          setInitialUrl(decodedUrl);
        }
      } else if (videoId) {
        // If only video ID is provided, normalize to YouTube URL
        const id = decodeURIComponent(videoId);
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
          setInitialUrl(`https://www.youtube.com/watch?v=${id}`);
        }
      }
    } catch (error) {
      console.error('Error parsing dashboard URL parameters:', error);
    }
  }, [searchParams]);

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
              <h2 className="text-white font-semibold">{user?.name || user?.email || 'Guest User'}</h2>
              <p className="text-xs text-zinc-400">
                {user?.tier === 'pro' ? '✨ Pro User' : '📦 Free User'} {isGuest && '(Not Signed In)'}
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg text-sm transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <UserDashboard language={language} initialUrl={initialUrl} autoSubmit={!!initialUrl} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-900/20 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-white text-lg font-semibold">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
