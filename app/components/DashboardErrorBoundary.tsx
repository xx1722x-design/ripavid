'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { ErrorTrapBanner } from './ErrorTrapBanner';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[DashboardErrorBoundary] Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[DashboardErrorBoundary] Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
          <ErrorTrapBanner
            error={this.state.error}
            context="DashboardErrorBoundary"
          />
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">
              <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 mt-20">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">🚨</div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-red-300 mb-3">
                      Dashboard Error Boundary Triggered
                    </h1>
                    <p className="text-red-200 mb-4">
                      An unexpected error occurred while loading the dashboard. The error has been logged.
                    </p>
                    <div className="bg-red-950/50 rounded p-4 mb-4 text-red-100 text-sm font-mono overflow-x-auto max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {this.state.error?.message || 'Unknown error'}
                        {'\n\n'}
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href="/"
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all"
                      >
                        Return to Home
                      </a>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                      >
                        Reload Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
