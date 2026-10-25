'use client';

import React from 'react';
import './PlatformSelector.css';

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
    <div className="w-full mb-8">
      {showLabel && (
        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-4 text-center">
          Select Platform
        </p>
      )}
      <div className="platform-selector-container">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelectPlatform(platform.id)}
            className={`platform-icon-button ${selectedPlatform === platform.id ? 'active' : ''}`}
            title={platform.name}
          >
            <span className="platform-icon">{platform.icon}</span>
            <span className="platform-label">{platform.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
