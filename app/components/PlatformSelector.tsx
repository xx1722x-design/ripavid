'use client';

import React from 'react';

export interface Platform {
  id: string;
  name: string;
  icon: string;
  label: string;
}

export const PLATFORMS: Platform[] = [
  { id: 'youtube', name: 'YouTube', icon: '▶️', label: 'YouTube' },
  { id: 'instagram', name: 'Instagram', icon: '📷', label: 'Instagram' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', label: 'TikTok' },
  { id: 'douyin', name: 'Douyin', icon: '🎬', label: 'Douyin' },
  { id: 'xiaohongshu', name: 'Xiaohongshu', icon: '❤️', label: 'Xiaohongshu' },
  { id: 'kuaishou', name: 'Kuaishou', icon: '⚡', label: 'Kuaishou' },
  { id: 'bilibili', name: 'Bilibili', icon: '🎮', label: 'Bilibili' },
  { id: 'weibo', name: 'Weibo', icon: '🐦', label: 'Weibo' },
  { id: 'baidu', name: 'Baidu', icon: '🔍', label: 'Baidu' },
  { id: 'pinduoduo', name: 'Pinduoduo', icon: '🛍️', label: 'Pinduoduo' },
];

interface PlatformSelectorProps {
  selectedPlatform?: string;
  onSelectPlatform: (platformId: string) => void;
  showLabel?: boolean;
}

export default function PlatformSelector({
  selectedPlatform,
  onSelectPlatform,
  showLabel = true,
}: PlatformSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {showLabel && (
        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-4 text-center">
          Select Platform
        </p>
      )}
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelectPlatform(platform.id)}
            className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 border ${
              selectedPlatform === platform.id
                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105'
                : 'bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-100 border-zinc-700 dark:border-zinc-700 light:border-gray-300 hover:border-cyan-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-700/50 light:hover:bg-gray-200'
            }`}
            title={platform.name}
          >
            <span className="text-2xl mb-1">{platform.icon}</span>
            <span className="text-xs font-medium text-zinc-200 dark:text-zinc-200 light:text-gray-700">
              {platform.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
