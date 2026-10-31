'use client';

import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="bg-red-900/20 border-2 border-red-500/50 text-red-200 px-6 py-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-3">Something went wrong</h2>
              <p className="text-sm mb-4">
                An unexpected error occurred while loading the page. Please try refreshing.
              </p>
              <details className="text-xs text-red-300 bg-red-950/20 p-3 rounded mt-4 max-h-40 overflow-y-auto">
                <summary className="cursor-pointer font-semibold mb-2">Error details</summary>
                <pre className="whitespace-pre-wrap break-words text-red-200">
                  {this.state.error?.toString()}
                </pre>
              </details>
              <button
                onClick={() => window.location.reload()}
                className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
