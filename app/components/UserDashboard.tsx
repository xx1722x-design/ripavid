'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getUserHistory, deleteHistoryEntry, type JobHistory } from '@/lib/supabase';
import { translations } from '../locales';
import UrlForm from './UrlForm';
import VideoResult from './VideoResult';

interface UserDashboardProps {
  language?: string;
  initialUrl?: string;
  autoSubmit?: boolean;
  onError?: (error: Error) => void;
}

interface Format {
  quality?: string;
  resolution?: string;
  ext: string;
  url: string;
  isPremium?: boolean;
  filesize?: number;
}

interface VideoData {
  title: string;
  thumbnail?: string;
  duration?: number;
  formats: {
    free: Format[];
    premium: Format[];
  };
}

export default function UserDashboard({ language = 'en', initialUrl = '', autoSubmit = false, onError }: UserDashboardProps) {
  let user = null;
  let isAuthenticated = false;

  try {
    const authContext = useAuth();
    user = authContext?.user || null;
    isAuthenticated = authContext?.isAuthenticated || false;
  } catch (authError) {
    console.error('[UserDashboard] Error getting auth context:', authError);
    if (onError && authError instanceof Error) {
      onError(authError);
    }
  }

  const t = (() => {
    try {
      const lang = (language && typeof language === 'string') ? language : 'en';
      return translations[lang as keyof typeof translations] || translations['en'];
    } catch {
      return translations['en'];
    }
  })();

  // For guest users - new processing
  const [processingLoading, setProcessingLoading] = useState(false);
  const [result, setResult] = useState<VideoData | null>(null);
  const [processingError, setProcessingError] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

  // For authenticated users - history
  const [history, setHistory] = useState<JobHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'extract_subtitles' | 'translate_subtitles' | 'curate_highlights' | 'render_short'>('all');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Fetch user history on mount
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      loadHistory();
    } else {
      setHistoryLoading(false);
    }
  }, [isAuthenticated, user?.uid]);

  // Auto-submit initial URL if provided
  useEffect(() => {
    if (initialUrl && !hasAutoSubmitted && autoSubmit) {
      try {
        setHasAutoSubmitted(true);
        // Delay auto-submit by 100ms to match spec
        const timer = setTimeout(() => {
          handleRipVideo(initialUrl);
        }, 100);
        return () => clearTimeout(timer);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to process initial URL';
        setProcessingError(errorMsg);
      }
    }
  }, [initialUrl, autoSubmit, hasAutoSubmitted]);

  const loadHistory = async () => {
    if (!user?.uid) return;

    try {
      setHistoryLoading(true);
      const { data, error } = await getUserHistory(user.uid);

      if (error) {
        console.error('Error loading history:', error);
      } else {
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRipVideo = async (url: string) => {
    try {
      if (!url || typeof url !== 'string') {
        setProcessingError('Invalid URL provided.');
        return;
      }

      const trimmedUrl = url.trim();
      if (trimmedUrl.length === 0) {
        setProcessingError('Please enter a valid URL.');
        return;
      }

      setProcessingLoading(true);
      setProcessingError('');
      setResult(null);
      setOriginalUrl(trimmedUrl);

      try {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: trimmedUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data: VideoData = await response.json();
        setResult(data);
        console.log('Video extracted successfully:', data);
      } catch (err) {
        setProcessingError(err instanceof Error ? err.message : 'Failed to extract video. Please try again.');
        console.error('Download error:', err);
      } finally {
        setProcessingLoading(false);
      }
    } catch (outerErr) {
      setProcessingError('An unexpected error occurred. Please try again.');
      console.error('Unexpected error in handleRipVideo:', outerErr);
      setProcessingLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string | undefined) => {
    if (!entryId) return;

    try {
      setDeletingIds(prev => new Set(prev).add(entryId));
      const { success, error } = await deleteHistoryEntry(entryId);

      if (success) {
        setHistory(prev => prev.filter(item => item.id !== entryId));
      } else {
        console.error('Failed to delete entry:', error);
      }
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(entryId);
        return newSet;
      });
    }
  };

  const getJobTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      extract_subtitles: 'Extract Subtitles',
      translate_subtitles: 'Multi-Language Translation',
      curate_highlights: 'Viral Highlights',
      render_short: 'Short Clip Rendering',
    };
    return labels[type] || type;
  };

  const getJobTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      extract_subtitles: '🎬',
      translate_subtitles: '🌍',
      curate_highlights: '✨',
      render_short: '🎥',
    };
    return icons[type] || '📋';
  };

  const getJobTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      extract_subtitles: 'from-purple-500 to-pink-500',
      translate_subtitles: 'from-blue-500 to-cyan-500',
      curate_highlights: 'from-orange-500 to-red-500',
      render_short: 'from-indigo-500 to-purple-500',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const filteredHistory = filterType === 'all' ? history : history.filter(item => item.job_type === filterType);

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Guest user mode - show processing form only
  if (!isAuthenticated) {
    try {
      return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Guest Mode Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Quick Processing
          </h1>
          <p className="text-zinc-400">Process videos without sign-up • Free tier features available</p>
        </div>

        {/* Processing Form */}
        <div className="mb-8">
          <UrlForm
            onSubmit={handleRipVideo}
            isLoading={processingLoading}
            language={language}
            onError={(errorMessage) => setProcessingError(errorMessage)}
          />
        </div>

        {/* Error Display */}
        {processingError && (
          <div className="w-full max-w-2xl mx-auto bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg flex items-start gap-3 mb-8">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm mt-1">{processingError}</p>
            </div>
            <button
              onClick={() => setProcessingError('')}
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
            thumbnail={result.thumbnail}
            duration={result.duration}
            formats={result.formats as any}
            onClose={() => setResult(null)}
            language={language}
            originalUrl={originalUrl}
            onError={(errorMessage) => setProcessingError(errorMessage)}
          />
        )}
      </div>
    );
    } catch (guestError) {
      const err = guestError instanceof Error ? guestError : new Error(String(guestError));
      console.error('[UserDashboard] Guest mode render error:', err);
      if (onError) onError(err);
      return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8">
            <h2 className="text-xl font-bold text-red-300 mb-2">⚠️ Error Loading Guest Mode</h2>
            <p className="text-red-200 text-sm mb-4">{err.message}</p>
            <a href="/" className="inline-block px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition-all text-sm">
              Return to Home
            </a>
          </div>
        </div>
      );
    }
  }

  // Authenticated user mode - show history + processing form
  try {
    return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
          Job History
        </h1>
        <p className="text-zinc-400">Manage all your processing results in one place</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterType === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          All ({history.length})
        </button>
        <button
          onClick={() => setFilterType('extract_subtitles')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterType === 'extract_subtitles'
              ? 'bg-purple-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          🎬 Subtitles ({history.filter(h => h.job_type === 'extract_subtitles').length})
        </button>
        <button
          onClick={() => setFilterType('translate_subtitles')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterType === 'translate_subtitles'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          🌍 Translation ({history.filter(h => h.job_type === 'translate_subtitles').length})
        </button>
        <button
          onClick={() => setFilterType('curate_highlights')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterType === 'curate_highlights'
              ? 'bg-orange-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          ✨ Highlights ({history.filter(h => h.job_type === 'curate_highlights').length})
        </button>
        <button
          onClick={() => setFilterType('render_short')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterType === 'render_short'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          🎥 Rendering ({history.filter(h => h.job_type === 'render_short').length})
        </button>
      </div>

      {/* History List */}
      {historyLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block mb-4">⏳</div>
          <p className="text-zinc-400">Loading history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-400 text-lg mb-2">No job history yet</p>
          <p className="text-zinc-500">Your processing jobs will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl`}>{getJobTypeIcon(item.job_type)}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {getJobTypeLabel(item.job_type)}
                      </h3>
                      <p className="text-sm text-zinc-400">{item.video_title || item.video_url}</p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="ml-11 space-y-2">
                    {item.job_type === 'translate_subtitles' && item.data?.translatedLanguages && (
                      <p className="text-xs text-blue-400">
                        📝 Languages: {item.data.translatedLanguages.join(', ')}
                      </p>
                    )}
                    {item.job_type === 'curate_highlights' && item.data?.highlights && (
                      <p className="text-xs text-orange-400">
                        ✨ Highlights: {item.data.highlights.length} found
                      </p>
                    )}
                    {item.job_type === 'render_short' && item.data?.clipUrl && (
                      <p className="text-xs text-indigo-400">
                        ✓ Rendering complete ({item.data?.startTime} ~ {item.data?.endTime})
                      </p>
                    )}
                    <p className="text-xs text-zinc-500">
                      📅 {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Download/View Button */}
                  {item.job_type === 'extract_subtitles' && item.data?.subtitles && (
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([item.data.subtitles as string], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${item.video_title.slice(0, 30)}-subtitles.srt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="px-3 py-2 bg-purple-600/50 hover:bg-purple-600 rounded text-xs text-purple-100 transition-all"
                    >
                      ⬇️ SRT
                    </button>
                  )}

                  {item.job_type === 'render_short' && item.data?.clipUrl && (
                    <a
                      href={item.data.clipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-indigo-600/50 hover:bg-indigo-600 rounded text-xs text-indigo-100 transition-all"
                    >
                      🎬 Watch
                    </a>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteEntry(item.id)}
                    disabled={deletingIds.has(item.id || '')}
                    className="px-3 py-2 bg-red-600/30 hover:bg-red-600/50 disabled:opacity-50 rounded text-xs text-red-300 transition-all"
                  >
                    {deletingIds.has(item.id || '') ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    );
  } catch (authError) {
    const err = authError instanceof Error ? authError : new Error(String(authError));
    console.error('[UserDashboard] Authenticated mode render error:', err);
    if (onError) onError(err);
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8">
          <h2 className="text-xl font-bold text-red-300 mb-2">⚠️ Error Loading Dashboard</h2>
          <p className="text-red-200 text-sm mb-4">{err.message}</p>
          <a href="/" className="inline-block px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition-all text-sm">
            Return to Home
          </a>
        </div>
      </div>
    );
  }
}
