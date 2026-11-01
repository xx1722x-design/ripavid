'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getUserHistory, deleteHistoryEntry, type JobHistory } from '@/lib/supabase';
import { translations } from '../locales';

interface UserDashboardProps {
  language?: string;
}

export default function UserDashboard({ language = 'en' }: UserDashboardProps) {
  const { user, isAuthenticated } = useAuth();
  const t = translations[language as keyof typeof translations] || translations['en'];

  const [history, setHistory] = useState<JobHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'extract_subtitles' | 'translate_subtitles' | 'curate_highlights' | 'render_short'>('all');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Fetch user history on mount
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      loadHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.uid]);

  const loadHistory = async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      const { data, error } = await getUserHistory(user.uid);

      if (error) {
        console.error('Error loading history:', error);
      } else {
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
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

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-300 mb-2">Login Required</h2>
          <p className="text-blue-400">Please sign in to view your job history.</p>
        </div>
      </div>
    );
  }

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
      {isLoading ? (
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
}
