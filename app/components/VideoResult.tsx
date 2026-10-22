'use client';

import { useState, useRef, useEffect } from 'react';

interface Format {
  quality: string;
  ext: string;
  url: string;
}

interface VideoResultProps {
  title: string;
  formats: Format[];
  onClose: () => void;
}

interface PremiumFormat {
  id: string;
  label: string;
  quality: string;
  isPro: boolean;
}

const PREMIUM_OPTIONS: PremiumFormat[] = [
  { id: 'free-360p', label: '360P (MP4)', quality: '360P', isPro: false },
  { id: 'free-720p', label: '720P (MP4)', quality: '720P', isPro: false },
  { id: 'pro-1080p', label: '1080P (MP4) + Audio', quality: '1080P', isPro: true },
  { id: 'pro-4k', label: '4K (MP4) + Audio', quality: '4K', isPro: true },
  { id: 'pro-mp3', label: 'MP3 (Audio Only)', quality: 'MP3', isPro: true },
];

function getFormatLabel(format: Format): string {
  const extUpper = format.ext.toUpperCase();
  return format.quality ? `${extUpper} ${format.quality}` : extUpper;
}

export default function VideoResult({ title, formats, onClose }: VideoResultProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPremium, setSelectedPremium] = useState<PremiumFormat | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);


  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-zinc-900 dark:from-zinc-900 light:from-gray-50 to-black dark:to-black light:to-white border border-zinc-700 dark:border-zinc-700 light:border-gray-200 rounded-xl p-8 mt-8 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-2 break-words">
            {title || 'Video Ready'}
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">{formats.length} format{formats.length !== 1 ? 's' : ''} available</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-zinc-400 dark:text-zinc-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Premium Resolution Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {PREMIUM_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              if (option.isPro) {
                setSelectedPremium(option);
                setShowPremiumModal(true);
              } else if (formats.length > 0) {
                const videoUrl = formats[0]?.url;
                if (videoUrl) {
                  const finalUrl = videoUrl.replace('http://', 'https://');
                  window.open(finalUrl, '_blank', 'noopener,noreferrer');
                }
              }
            }}
            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
              option.isPro
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border border-amber-400/50'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white border border-green-400/50'
            }`}
          >
            {option.isPro && <span className="text-lg">👑</span>}
            <span className="text-sm">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Available Formats from Backend */}
      {formats.length > 0 && (
        <div className="mb-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <p className="text-sm font-semibold text-white mb-3">📥 Available Formats:</p>
          <div className="flex flex-wrap gap-2">
            {formats.map((format, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const videoUrl = format?.url;
                  if (videoUrl) {
                    const finalUrl = videoUrl.replace('http://', 'https://');
                    window.open(finalUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 group"
              >
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {getFormatLabel(format)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Premium Feature Modal */}
      {showPremiumModal && selectedPremium && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-amber-500/30 rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center">
              <span className="text-5xl mb-4 inline-block">👑</span>
              <h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2>
              <p className="text-zinc-400 mb-6">
                <span className="text-amber-300 font-semibold">{selectedPremium.label}</span> requires heavy server processing.
              </p>
              <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-zinc-300 mb-3">
                  ⚡ Why is this premium?
                </p>
                <ul className="text-xs text-zinc-400 space-y-2 text-left">
                  <li>• High-quality video + audio merging with FFmpeg</li>
                  <li>• Significant CPU & bandwidth consumption</li>
                  <li>• Real-time processing on our servers</li>
                </ul>
              </div>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                🚀 Premium Subscription Coming Soon!
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full mt-3 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
