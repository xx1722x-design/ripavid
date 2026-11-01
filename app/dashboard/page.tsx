'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/app/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { ErrorTrapBanner } from '@/app/components/ErrorTrapBanner';

const UserDashboard = dynamic(() => import('@/app/components/UserDashboard'), {
  ssr: false,
});

const LoadingFallback = () => (
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
);

function DashboardContent() {
  const { user, isAuthenticated, isGuest, logout } = useAuth();
  const [language] = useState('en');
  const searchParams = useSearchParams();
  const [initialUrl, setInitialUrl] = useState('');
  const [contentError, setContentError] = useState<Error | null>(null);

  // Safely handle useSearchParams with comprehensive error catching
  useEffect(() => {
    try {
      if (!searchParams) {
        console.warn('[Dashboard] searchParams is null or undefined');
        return;
      }

      const videoId = searchParams.get('v');
      const videoUrl = searchParams.get('url');

      if (videoUrl) {
        try {
          const decodedUrl = decodeURIComponent(videoUrl);
          if (typeof decodedUrl === 'string' && decodedUrl.trim().length > 0) {
            setInitialUrl(decodedUrl);
          }
        } catch (decodeError) {
          console.error('[Dashboard] Error decoding URL parameter:', decodeError);
        }
      } else if (videoId) {
        try {
          const id = decodeURIComponent(videoId);
          if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
            setInitialUrl(`https://www.youtube.com/watch?v=${id}`);
          }
        } catch (decodeError) {
          console.error('[Dashboard] Error decoding video ID:', decodeError);
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('[Dashboard] Fatal error in useEffect:', err);
      setContentError(err);
    }
  }, [searchParams]);

  // Render content with comprehensive error handling
  try {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
        <ErrorTrapBanner error={contentError} context="DashboardContent" />

        {/* Header with User Info - Defensive rendering */}
        <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm mt-16">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {(() => {
                  try {
                    if (!user) return '👤';
                    if (user.name && user.name.length > 0) return user.name.charAt(0);
                    if (user.email && user.email.length > 0) return user.email.charAt(0);
                    return '👤';
                  } catch {
                    return '👤';
                  }
                })()}
              </div>
              <div>
                <h2 className="text-white font-semibold">
                  {(() => {
                    try {
                      return user?.name || user?.email || 'Guest User';
                    } catch {
                      return 'User';
                    }
                  })()}
                </h2>
                <p className="text-xs text-zinc-400">
                  {(() => {
                    try {
                      const tierDisplay = user?.tier === 'pro' ? '✨ Pro User' : '📦 Free User';
                      const guestDisplay = isGuest ? ' (Not Signed In)' : '';
                      return tierDisplay + guestDisplay;
                    } catch {
                      return 'User';
                    }
                  })()}
                </p>
              </div>
            </div>

            {(() => {
              try {
                if (isAuthenticated) {
                  return (
                    <button
                      onClick={() => {
                        try {
                          logout();
                        } catch (logoutError) {
                          const err = logoutError instanceof Error ? logoutError : new Error(String(logoutError));
                          console.error('[Dashboard] Logout error:', err);
                          setContentError(err);
                        }
                      }}
                      className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg text-sm transition-all"
                    >
                      Logout
                    </button>
                  );
                }
                return null;
              } catch {
                return null;
              }
            })()}
          </div>
        </div>

        {/* Main Content - Defensive rendering */}
        <div className="py-12">
          {(() => {
            try {
              return (
                <UserDashboard
                  language={language}
                  initialUrl={initialUrl}
                  autoSubmit={!!initialUrl}
                  onError={(err: Error) => {
                    console.error('[Dashboard] UserDashboard error:', err);
                    setContentError(err);
                  }}
                />
              );
            } catch (renderError) {
              const err = renderError instanceof Error ? renderError : new Error(String(renderError));
              console.error('[Dashboard] Error rendering UserDashboard:', err);
              setContentError(err);
              return (
                <div className="w-full max-w-4xl mx-auto px-4 py-12">
                  <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-300 mb-2">Failed to Load Dashboard</h2>
                    <p className="text-red-200">{err.message}</p>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  } catch (fatalError) {
    const err = fatalError instanceof Error ? fatalError : new Error(String(fatalError));
    console.error('[Dashboard] Fatal render error:', err);
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
        <ErrorTrapBanner error={err} context="DashboardContent Fatal" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 text-center mt-16">
              <h2 className="text-2xl font-bold text-red-300 mb-4">Critical Dashboard Error</h2>
              <p className="text-red-200 mb-4">{err.message}</p>
              <a href="/" className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default function DashboardPage() {
  const [initialLoadError, setInitialLoadError] = useState<Error | null>(null);

  try {
    return (
      <>
        <ErrorTrapBanner error={initialLoadError} context="DashboardPage" />
        <Suspense fallback={<LoadingFallback />}>
          <DashboardContent />
        </Suspense>
      </>
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[DashboardPage] Fatal error:', err);
    setInitialLoadError(err);
    return (
      <>
        <ErrorTrapBanner error={err} context="DashboardPage Fatal" />
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-red-300 mb-4">Dashboard Error</h2>
              <p className="text-red-200 mb-4">{err.message}</p>
              <a href="/" className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }
}
