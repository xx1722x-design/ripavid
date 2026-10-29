'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function WatchPageContent() {
  const router = useRouter();

  useEffect(() => {
    // The middleware should handle this redirect
    // But as a fallback, redirect to home if this page is somehow reached
    router.push('/');
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="text-center">
        <div className="inline-block p-4 bg-blue-900/20 rounded-full mb-4">
          <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-white text-lg font-semibold">Loading video...</p>
        <p className="text-zinc-400 text-sm mt-2">Preparing your download experience</p>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-900/20 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <WatchPageContent />
    </Suspense>
  );
}
