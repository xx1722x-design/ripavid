'use client';

import { useState } from 'react';

interface ErrorTrapBannerProps {
  error: Error | null;
  context?: string;
}

export function ErrorTrapBanner({ error, context }: ErrorTrapBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-900/95 border-b-2 border-red-500 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Error Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl mt-1">🚨</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-100 mb-1">
                Runtime Error Detected
              </h2>
              <p className="text-red-200 text-sm">
                {context && `[${context}] `}
                {error.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 bg-red-700 hover:bg-red-600 text-red-100 rounded text-sm font-medium transition-colors flex-shrink-0"
          >
            {isExpanded ? 'Hide' : 'Details'}
          </button>
        </div>

        {/* Expanded Stack Trace */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-red-700">
            <div className="bg-red-950/50 rounded p-3 text-red-100 text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-words">
                {error.stack || error.toString()}
              </pre>
            </div>
            <p className="text-red-300 text-xs mt-3">
              ℹ️ This error was caught by the error trap banner. Please report this issue to the development team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
