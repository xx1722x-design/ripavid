'use client';

import Link from 'next/link';

interface QuickTag {
  label: string;
  slug: string;
}

const QUICK_TAGS: QuickTag[] = [
  { label: 'YouTube MP4', slug: 'youtube-mp4-downloader' },
  { label: 'YouTube Shorts', slug: 'youtube-shorts-downloader' },
  { label: 'TikTok Downloader', slug: 'tiktok-downloader' },
  { label: 'Instagram Reels', slug: 'instagram-reels-downloader' },
  { label: 'Instagram Stories', slug: 'instagram-stories-downloader' },
  { label: 'Facebook Videos', slug: 'facebook-video-downloader' },
  { label: 'Twitch Clips', slug: 'twitch-clips-downloader' },
  { label: 'Twitter/X Videos', slug: 'twitter-video-downloader' },
  { label: 'MP4 Converter', slug: 'mp4-converter' },
  { label: 'Audio Extractor', slug: 'audio-extractor' },
  { label: 'Subtitle Extractor', slug: 'subtitle-extractor' },
  { label: 'Video Compiler', slug: 'video-compiler' },
];

export default function QuickTagsSection() {
  return (
    <div className="w-full bg-gradient-to-b from-transparent via-zinc-950/20 to-black border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Popular Formats & Platforms
          </h3>
          <p className="text-sm text-zinc-400">
            Download videos from your favorite platforms instantly
          </p>
        </div>

        {/* Quick Tags Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {QUICK_TAGS.map((tag) => (
            <Link
              key={tag.slug}
              href={`/?search=${encodeURIComponent(tag.label)}`}
              className="group relative overflow-hidden"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 border border-cyan-500/10 group-hover:border-cyan-500/30 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/10" />

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-cyan-500/5 rounded-lg" />
              </div>

              {/* Content */}
              <div className="relative px-4 py-3 flex items-center justify-center text-center">
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-cyan-300 transition-colors duration-300">
                  {tag.label}
                </span>
              </div>

              {/* Subtle Border Glow on Hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(34, 211, 238, 0.05), 0 0 20px rgba(34, 211, 238, 0.05)'
                }}
              />
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            💡 All downloads are fast, secure, and free
          </p>
        </div>
      </div>
    </div>
  );
}
