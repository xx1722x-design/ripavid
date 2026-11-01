'use client';

import { useState } from 'react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
  onPublishSuccess?: (results: Record<string, any>) => void;
}

type Platform = 'youtube' | 'instagram' | 'tiktok' | 'xiaohongshu';

const PLATFORMS: Array<{ id: Platform; name: string; icon: string; color: string }> = [
  { id: 'youtube', name: 'YouTube Shorts', icon: '🎥', color: 'from-red-600 to-red-700' },
  { id: 'instagram', name: 'Instagram Reels', icon: '📱', color: 'from-pink-600 to-purple-600' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-slate-800' },
  { id: 'xiaohongshu', name: 'Xiaohongshu (小红书)', icon: '❤️', color: 'from-red-500 to-red-600' },
];

export default function PublishModal({
  isOpen,
  onClose,
  videoUrl,
  videoTitle,
  onPublishSuccess,
}: PublishModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set(['youtube', 'instagram', 'tiktok']));
  const [title, setTitle] = useState(videoTitle);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishingStatus, setPublishingStatus] = useState<Record<string, { status: string; url?: string; error?: string }>>({});

  const togglePlatform = (platform: Platform) => {
    const newSet = new Set(selectedPlatforms);
    if (newSet.has(platform)) {
      newSet.delete(platform);
    } else {
      newSet.add(platform);
    }
    setSelectedPlatforms(newSet);
  };

  const handlePublish = async () => {
    if (selectedPlatforms.size === 0) {
      setPublishError('Please select at least one platform');
      return;
    }

    try {
      setIsPublishing(true);
      setPublishError('');
      setPublishSuccess(false);

      // Call publishing API
      const response = await fetch('/api/publish-social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl,
          title,
          description: description || undefined,
          tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
          platforms: Array.from(selectedPlatforms),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to start publishing');
      }

      const data = await response.json();
      const processingId = data.processingId;

      if (!processingId) {
        throw new Error('No processing ID returned');
      }

      // Poll for publishing status
      let isComplete = false;
      let pollCount = 0;
      const maxPolls = 120; // Max 5 minutes

      while (!isComplete && pollCount < maxPolls) {
        await new Promise(resolve => setTimeout(resolve, 2500)); // Poll every 2.5 seconds
        pollCount++;

        try {
          const statusResponse = await fetch(`/api/publish-social?processingId=${processingId}`);

          if (statusResponse.ok) {
            const statusData = await statusResponse.json();

            if (statusData.processingId) {
              if (statusData.success || statusData.results) {
                isComplete = true;
                setPublishSuccess(true);
                setPublishingStatus(statusData.results || {});
                onPublishSuccess?.(statusData.results);

                // Close modal after 2 seconds on success
                setTimeout(() => {
                  onClose();
                }, 2000);
              }
            }
          }
        } catch (err) {
          console.error('Status check error:', err);
        }
      }

      if (!isComplete) {
        throw new Error('Publishing timeout. Please try again.');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Publishing error:', error);
      setPublishError(errorMsg);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            📤 Publish to Social Media
          </h2>
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {publishSuccess && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-300 font-semibold mb-2">✅ Publishing Successful!</p>
              <div className="space-y-1 text-sm text-green-300/80">
                {Object.entries(publishingStatus).map(([platform, result]) => (
                  <div key={platform} className="flex items-center gap-2">
                    <span>{result.status === 'success' ? '✓' : '✗'}</span>
                    <span className="capitalize">{platform}</span>
                    {result.url && (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        View →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {publishError && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-300 font-semibold">⚠️ {publishError}</p>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPublishing}
              placeholder="Enter video title"
              maxLength={100}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-zinc-500 mt-1">{title.length}/100</p>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPublishing}
              placeholder="Enter video description"
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-cyan-500 transition-colors disabled:opacity-50 resize-none"
            />
            <p className="text-xs text-zinc-500 mt-1">{description.length}/500</p>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Tags (comma-separated, Optional)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isPublishing}
              placeholder="e.g. #viral, #shorts, #trending"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-3">Select Platforms</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  disabled={isPublishing}
                  className={`p-4 rounded-lg border-2 transition-all text-left disabled:opacity-50 cursor-pointer ${
                    selectedPlatforms.has(platform.id)
                      ? 'border-cyan-500 bg-cyan-900/20'
                      : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.has(platform.id)}
                      onChange={() => {}}
                      disabled={isPublishing}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div>
                      <div className="text-lg">{platform.icon}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{platform.name}</div>
                      <div className="text-xs text-zinc-400">High-quality shorts</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              💡 Selected videos will be published to all checked platforms with the title, description, and tags you provided.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-700 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing || selectedPlatforms.size === 0}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white rounded-lg transition-all font-semibold flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Publish ({selectedPlatforms.size})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
