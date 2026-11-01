'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/app/context/AuthContext';
import { ErrorTrapBanner } from '@/app/components/ErrorTrapBanner';
import { DashboardErrorBoundary } from '@/app/components/DashboardErrorBoundary';
import RRRTipBanner from '@/app/components/RRRTipBanner';
import RRRTrickModal from '@/app/components/RRRTrickModal';
import QuickTagsSection from '@/app/components/QuickTagsSection';
import Footer from '@/app/components/Footer';

const UserDashboard = dynamic(
  () => import('@/app/components/UserDashboard'),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

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
  const authContext = useAuth();
  const user = authContext?.user || null;
  const isAuthenticated = authContext?.isAuthenticated || false;
  const isGuest = authContext?.isGuest || true;
  const logout = authContext?.logout || (() => Promise.resolve());

  const [language] = useState('en');
  const [initialUrl, setInitialUrl] = useState('');
  const [contentError, setContentError] = useState<Error | null>(null);
  const [showRRRModal, setShowRRRModal] = useState(false);
  const [showDailyLimitBanner, setShowDailyLimitBanner] = useState(false);
  const [guestDownloadCount, setGuestDownloadCount] = useState(0);

  // Extract URL parameters safely using client-side method
  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        console.warn('[Dashboard] window is not defined');
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
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
          let id = decodeURIComponent(videoId);

          // Extract video ID from complex URLs (e.g., ?v=ID&list=...&start_radio=...)
          // Handle cases like: "QX9UUxvGJQ4&list=PLxxx" -> extract just "QX9UUxvGJQ4"
          if (id.includes('&')) {
            id = id.split('&')[0];
          }

          // Validate video ID format (11 characters, alphanumeric + _ - )
          if (/^[a-zA-Z0-9_-]{11}$/.test(id.trim())) {
            setInitialUrl(`https://www.youtube.com/watch?v=${id.trim()}`);
          } else {
            console.warn('[Dashboard] Invalid video ID format:', id);
          }
        } catch (decodeError) {
          console.error('[Dashboard] Error decoding video ID:', decodeError);
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('[Dashboard] Error in parameter extraction:', err);
      setContentError(err);
    }
  }, []);

  // Fetch guest download count on mount (for non-authenticated users)
  useEffect(() => {
    if (isGuest) {
      fetch('/api/guest-downloads/count')
        .then((res) => res.json())
        .then((data) => setGuestDownloadCount(data.count || 0))
        .catch((err) => {
          console.warn('[Dashboard] Failed to fetch guest download count:', err);
          setGuestDownloadCount(0);
        });
    }
  }, [isGuest]);

  try {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex flex-col">
        <ErrorTrapBanner error={contentError} context="DashboardContent" />

        {/* RRR Tip Banner */}
        <div className="px-4 py-1 sm:py-2">
          <RRRTipBanner onClick={() => setShowRRRModal(true)} language={language} />
        </div>

        {/* Header with User Info */}
        <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {(() => {
                  try {
                    if (!user) return '👤';
                    const firstChar = (user.name || user.email || '')[0];
                    return firstChar || '👤';
                  } catch {
                    return '👤';
                  }
                })()}
              </div>
              <div>
                <h2 className="text-white font-semibold">
                  {user?.name || user?.email || 'Guest User'}
                </h2>
                <p className="text-xs text-zinc-400">
                  {user?.tier === 'pro' ? '✨ Pro User' : '📦 Free User'}
                  {isGuest ? ' (Not Signed In)' : ''}
                </p>
              </div>
            </div>

            {isAuthenticated && (
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
            )}
          </div>
        </div>

        {/* Guest Download Counter (for non-authenticated users) */}
        {isGuest && (
          <div className="px-4 py-3">
            <div className="max-w-6xl mx-auto inline-flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <span className="text-xs sm:text-sm text-cyan-300 font-semibold">
                Free Downloads Today: {guestDownloadCount}/3 used
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="py-4 sm:py-6 flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <UserDashboard
              language={language}
              initialUrl={initialUrl}
              autoSubmit={!!initialUrl}
              onError={(err: Error) => {
                console.error('[Dashboard] UserDashboard error:', err);
                setContentError(err);
              }}
              onShowDailyLimitBanner={() => {
                setShowDailyLimitBanner(true);
                fetch('/api/guest-downloads/count')
                  .then((res) => res.json())
                  .then((data) => setGuestDownloadCount(data.count || 3))
                  .catch(() => setGuestDownloadCount(3));
              }}
            />
          </Suspense>
        </div>

        {/* Quick Tags Section for SEO */}
        <QuickTagsSection />

        {/* Footer */}
        <Footer language={language} />

        {/* RRR Trick Modal */}
        <RRRTrickModal isOpen={showRRRModal} onClose={() => setShowRRRModal(false)} language={language} />

        {/* Daily Limit Banner */}
        {showDailyLimitBanner && isGuest && (
          <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4 bg-gradient-to-r from-amber-900/40 to-red-900/40 border-t border-amber-400 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-grow">
                <p className="text-sm sm:text-base text-amber-200 font-semibold mb-2">
                  You have used all 3 free downloads for today.
                </p>
                <p className="text-xs sm:text-sm text-amber-100/80">
                  Sign in to enjoy unlimited downloads up to 720p/HD!
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <a
                  href="/auth/signup"
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all text-center"
                >
                  Sign Up Free
                </a>
                <a
                  href="/auth/login"
                  className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-200 font-semibold text-xs sm:text-sm rounded-lg transition-all border border-white/20 text-center"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (fatalError) {
    const err = fatalError instanceof Error ? fatalError : new Error(String(fatalError));
    console.error('[Dashboard] Fatal render error:', err);
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
        <ErrorTrapBanner error={err} context="DashboardContent Fatal" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 mt-20">
              <h2 className="text-2xl font-bold text-red-300 mb-4">Dashboard Render Error</h2>
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
  return (
    <DashboardErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <DashboardContent />
      </Suspense>
    </DashboardErrorBoundary>
  );
}
