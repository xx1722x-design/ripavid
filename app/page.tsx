'use client';

import { useState } from 'react';
import UrlForm from './components/UrlForm';
import VideoResult from './components/VideoResult';

interface Format {
  quality: string;
  ext: string;
  url: string;
}

interface VideoData {
  title: string;
  formats: Format[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoData | null>(null);
  const [error, setError] = useState('');

  const handleRipVideo = async (url: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://snagaclip.com';
      const response = await fetch(`${apiUrl}/api/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data: VideoData = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rip video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 md:pt-32">
        {/* Logo / Branding */}
        <div className="mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">
            ⚡
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            RipAVid
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Rip Any Video
            </span>
            {' '}
            <span className="text-white">Instantly</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-2">
            Download videos from Douyin, Xiaohongshu, and more in seconds
          </p>
          <p className="text-sm sm:text-base text-zinc-500">
            Fast, simple, and free. No sign-up required.
          </p>
        </div>

        {/* URL Input Form */}
        <UrlForm onSubmit={handleRipVideo} isLoading={isLoading} />

        {/* API Error Display */}
        {error && (
          <div className="w-full max-w-2xl mx-auto bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg flex items-start gap-3 mt-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-200 hover:text-red-100 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Video Result */}
        {result && (
          <VideoResult
            title={result.title}
            formats={result.formats}
            onClose={() => setResult(null)}
          />
        )}

        {/* Features */}
        {!result && (
          <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-zinc-400">Download videos in seconds, not minutes</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Completely Free</h3>
              <p className="text-sm text-zinc-400">No hidden fees, no premium plans</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">No Sign-up</h3>
              <p className="text-sm text-zinc-400">Start downloading immediately</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-12 pb-8 text-center text-zinc-500 text-sm">
          <p>Built with ⚡ for speed and simplicity</p>
        </div>
      </main>
    </div>
  );
}
