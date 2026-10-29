'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RRRTrickModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RRRTrickModal({ isOpen, onClose }: RRRTrickModalProps) {
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    if (isOpen && !isTriggered) {
      const timer = setTimeout(() => {
        setIsTriggered(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isTriggered]);

  const handleReset = () => {
    setIsTriggered(false);
  };

  const triggerTrick = () => {
    if (isTriggered) return;
    setIsTriggered(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-zinc-700 bg-zinc-900/95">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">
              ⚡
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Experience the "rrr" Magic
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8">
          {/* Intro text */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
              Experience the{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                "rrr"
              </span>{' '}
              Magic
            </h3>
            <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto">
              Watch how typing{' '}
              <span className="bg-cyan-950 text-cyan-300 font-bold px-1.5 py-0.5 rounded">
                rrr
              </span>{' '}
              right before{' '}
              <span className="text-white font-mono font-semibold">youtube.com</span> (or use{' '}
              <span className="text-cyan-300 font-mono font-semibold">rrryoutube.com</span>
              ) instantly launches{' '}
              <span className="text-cyan-400 font-semibold">ripavid.com</span>.
            </p>
          </div>

          {/* Browser Window Simulator */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl mb-6">
            {/* Browser Header */}
            <div className="bg-zinc-700/50 px-4 py-3 flex items-center justify-between border-b border-zinc-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              {/* URL Bar */}
              <div className="flex-1 mx-4 bg-black/30 border border-zinc-600 rounded-lg px-4 py-1.5 flex items-center gap-2 text-xs sm:text-sm font-mono">
                <span className="text-emerald-400">🔒</span>
                <span className="text-zinc-400">https://</span>
                <span
                  className={`font-bold transition-all duration-500 inline-block ${
                    isTriggered ? 'text-cyan-400 scale-125' : 'text-zinc-500 scale-100'
                  }`}
                >
                  rrr
                </span>
                <span className="text-white">youtube.com/watch?v=dQw4w9WgXcQ</span>
              </div>

              <div className="text-zinc-400 text-xs flex items-center gap-3">
                <span>🔄</span>
                <span>🔖</span>
              </div>
            </div>

            {/* Browser Content */}
            <div className="p-6 sm:p-8 bg-black/20 min-h-[300px] flex flex-col items-center justify-center relative">
              {/* YouTube State */}
              <div
                className={`w-full flex flex-col items-center transition-all duration-500 ${
                  isTriggered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ pointerEvents: isTriggered ? 'none' : 'auto' }}
              >
                <div className="w-full max-w-md bg-black/40 rounded-xl p-4 border border-zinc-700 shadow-lg mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                      ▶
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">YouTube Video Player</h4>
                      <p className="text-[10px] text-gray-300">
                        Watching Rick Astley - Never Gonna Give You Up
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-40 bg-gray-900 rounded-lg flex items-center justify-center relative border border-zinc-600">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition">
                      ▶
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white">
                      03:32
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-100 flex items-center gap-1">
                  <span>Want to download this instantly?</span>
                  <span className="text-cyan-400 font-medium">
                    Just add <b className="underline">rrr</b> in front!
                  </span>
                </p>
              </div>

              {/* RipAVid State */}
              <div
                className={`absolute inset-0 p-6 sm:p-8 flex flex-col items-center justify-center transition-all duration-500 ${
                  isTriggered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ pointerEvents: isTriggered ? 'auto' : 'none' }}
              >
                <div className="w-full max-w-md bg-zinc-800 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        ⚡
                      </div>
                      <span className="font-bold text-white text-sm">RipAVid Instant Downloader</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                      ✓ Video Detected
                    </span>
                  </div>

                  {/* Video Info */}
                  <div className="bg-black/30 rounded-xl p-3 mb-4 flex items-center gap-3 border border-zinc-700">
                    <div className="w-16 h-12 bg-cyan-950 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-xs border border-cyan-500/20">
                      1080P
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-white truncate">
                        Never Gonna Give You Up - Rick Astley
                      </h5>
                      <p className="text-[10px] text-gray-300">youtube.com • Ready in 1 second</p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2">
                    <span>⬇️</span>
                    <span>Download MP4 (1080p)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isTriggered ? (
              <button
                onClick={triggerTrick}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/30 transition transform hover:-translate-y-0.5 text-sm flex items-center gap-2"
              >
                <span>✨</span>
                <span>Simulate "rrr" Trick</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/30 transition transform hover:-translate-y-0.5 text-sm flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>Reset Demo</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/10 transition text-sm"
                >
                  Got it! Close
                </button>
              </>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <p className="text-xs sm:text-sm text-white text-center">
              <strong>💡 Pro Tip:</strong> You can use this trick on any video platform! Just add "rrr" before the domain
              name or visit <strong>rrryoutube.com</strong> directly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
