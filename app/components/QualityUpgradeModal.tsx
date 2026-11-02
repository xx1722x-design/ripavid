'use client';

import { useRouter } from 'next/navigation';

interface QualityUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onUpgrade?: () => void;
}

export default function QualityUpgradeModal({ isOpen, onClose, onContinue, onUpgrade }: QualityUpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-br from-zinc-950 to-zinc-900 border-2 border-violet-500/60 rounded-2xl shadow-2xl shadow-violet-500/30 max-w-md w-full p-8"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade Quality Available</h2>
          <p className="text-sm text-zinc-400">
            This video is available in <strong className="text-violet-300">1080p</strong> HD
          </p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Free Tier */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
            <div className="text-sm font-bold text-zinc-300 mb-3">Free Plan</div>
            <div className="text-2xl font-bold text-cyan-300 mb-3">720p</div>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>✓ Compressed</li>
              <li>✓ Smaller file</li>
              <li>✗ Blurry on large screens</li>
            </ul>
          </div>

          {/* Starter Tier */}
          <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-500/50 rounded-lg p-4">
            <div className="text-sm font-bold text-violet-300 mb-3">Starter Plan</div>
            <div className="text-2xl font-bold text-violet-200 mb-3">1080p</div>
            <ul className="text-xs text-zinc-300 space-y-1">
              <li>✓ Crystal clear</li>
              <li>✓ Full HD</li>
              <li>✓ Best quality</li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onUpgrade?.();
              router.push('/pricing?plan=starter');
            }}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Upgrade to Starter ($4.99/mo)
          </button>
          <button
            onClick={onContinue}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Download 720p
          </button>
          <button
            onClick={onClose}
            className="w-full text-zinc-400 hover:text-zinc-300 font-semibold py-2 transition-colors"
          >
            Cancel
          </button>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
