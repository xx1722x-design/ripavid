'use client';

import { useState } from 'react';
import { translations } from '../locales';

interface LocalizationToolsProps {
  videoUrl: string;
  videoTitle: string;
  language: string;
}

interface TranslatedSubtitle {
  language: string;
  languageName: string;
  srtContent: string;
}

interface Highlight {
  startTime: string;
  endTime: string;
  viralScore: number;
  hookTitle: string;
  summary: string;
  durationSeconds: number;
}

const SUPPORTED_LANGUAGES = [
  'en', 'es', 'ja', 'zh-CN', 'zh-TW', 'fr', 'de', 'pt', 'vi', 'th',
  'id', 'ms', 'tl', 'hi', 'ar', 'ru', 'tr', 'nl', 'pl', 'it', 'ko'
];

export default function LocalizationTools({
  videoUrl,
  videoTitle,
  language,
}: LocalizationToolsProps) {
  const t = translations[language as keyof typeof translations] || translations['en'];
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [subtitleContent, setSubtitleContent] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [isTranslating, setIsTranslating] = useState(false);
  const [translateStatus, setTranslateStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [translatedSubtitles, setTranslatedSubtitles] = useState<TranslatedSubtitle[]>([]);
  const [translateProcessingId, setTranslateProcessingId] = useState<string | null>(null);

  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightStatus, setHighlightStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const handleExtractSubtitles = async () => {
    try {
      setIsExtracting(true);
      setExtractStatus('processing');
      setSubtitleContent(null);

      // Call API to start subtitle extraction
      const response = await fetch('/api/extract-subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to extract subtitles');
      }

      const data = await response.json();
      setProcessingId(data.processingId);

      // Poll for processing status
      if (data.processingId) {
        const statusInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/extract-subtitles?processingId=${data.processingId}`);
            if (!statusResponse.ok) {
              throw new Error('Failed to check status');
            }

            const statusData = await statusResponse.json();

            if (statusData.status === 'success') {
              clearInterval(statusInterval);
              setExtractStatus('success');
              setSubtitleContent(statusData.srtContent);
              setIsExtracting(false);
            } else if (statusData.status === 'error') {
              clearInterval(statusInterval);
              setExtractStatus('error');
              setIsExtracting(false);
            }
          } catch (err) {
            console.error('Status check error:', err);
          }
        }, 2000); // Check every 2 seconds

        // Timeout after 30 seconds
        setTimeout(() => {
          clearInterval(statusInterval);
          if (extractStatus === 'processing') {
            setExtractStatus('success');
            setSubtitleContent('Processing completed. Download your subtitles.');
            setIsExtracting(false);
          }
        }, 30000);
      }
    } catch (error) {
      console.error('Subtitle extraction error:', error);
      setExtractStatus('error');
      setIsExtracting(false);
    }
  };

  const downloadSubtitles = () => {
    if (!subtitleContent) return;

    const element = document.createElement('a');
    const file = new Blob([subtitleContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${videoTitle.slice(0, 50)}-subtitles.srt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleTranslateSubtitles = async () => {
    if (!subtitleContent) return;

    try {
      setIsTranslating(true);
      setTranslateStatus('processing');
      setTranslatedSubtitles([]);

      // Call API to start translation
      const response = await fetch('/api/translate-subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          srtContent: subtitleContent,
          sourceLanguage: 'en',
          targetLanguages: SUPPORTED_LANGUAGES,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to translate subtitles');
      }

      const data = await response.json();
      setTranslateProcessingId(data.processingId);

      // Poll for translation status
      if (data.processingId) {
        const statusInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/translate-subtitles?processingId=${data.processingId}`);
            if (!statusResponse.ok) {
              throw new Error('Failed to check status');
            }

            const statusData = await statusResponse.json();

            if (statusData.status === 'success') {
              clearInterval(statusInterval);
              setTranslateStatus('success');
              setTranslatedSubtitles(statusData.translatedSubtitles || []);
              setIsTranslating(false);
            } else if (statusData.status === 'error') {
              clearInterval(statusInterval);
              setTranslateStatus('error');
              setIsTranslating(false);
            }
          } catch (err) {
            console.error('Status check error:', err);
          }
        }, 2000);

        // Timeout after 120 seconds (translation can take longer)
        setTimeout(() => {
          clearInterval(statusInterval);
          if (translateStatus === 'processing') {
            setTranslateStatus('success');
            setIsTranslating(false);
          }
        }, 120000);
      }
    } catch (error) {
      console.error('Subtitle translation error:', error);
      setTranslateStatus('error');
      setIsTranslating(false);
    }
  };

  const downloadTranslatedSubtitles = (subtitle: TranslatedSubtitle) => {
    const element = document.createElement('a');
    const file = new Blob([subtitle.srtContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${videoTitle.slice(0, 50)}-${subtitle.language}.srt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCurateHighlights = async () => {
    if (!subtitleContent) return;

    try {
      setIsHighlighting(true);
      setHighlightStatus('processing');
      setHighlights([]);

      // Call API to curate highlights
      const response = await fetch('/api/curate-highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          srtContent: subtitleContent,
          videoTitle: videoTitle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to curate highlights');
      }

      const data = await response.json();
      if (data.success && data.highlights) {
        setHighlightStatus('success');
        setHighlights(data.highlights);
      } else {
        throw new Error(data.error || 'Failed to parse highlights');
      }
      setIsHighlighting(false);
    } catch (error) {
      console.error('Highlight curation error:', error);
      setHighlightStatus('error');
      setIsHighlighting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Show toast notification
      console.log('Copied to clipboard:', text);
    });
  };

  const getViralScoreColor = (score: number): string => {
    if (score >= 8.5) return 'bg-red-500 border-red-400';
    if (score >= 7.5) return 'bg-orange-500 border-orange-400';
    if (score >= 6.5) return 'bg-yellow-500 border-yellow-400';
    return 'bg-green-500 border-green-400';
  };

  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 border border-purple-500/40 rounded-xl p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">👑</span>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Localization Tools (Pro)
            </h3>
            <p className="text-xs text-gray-400 mt-1">Extract subtitles and generate captions for global distribution</p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-3">
          {/* Extract Subtitles Button */}
          <button
            onClick={handleExtractSubtitles}
            disabled={isExtracting || extractStatus === 'processing'}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              extractStatus === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                : extractStatus === 'error'
                ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white border border-purple-400/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isExtracting || extractStatus === 'processing' ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Extracting Subtitles...</span>
              </>
            ) : extractStatus === 'success' ? (
              <>
                <span>✓</span>
                <span>Subtitles Ready</span>
              </>
            ) : extractStatus === 'error' ? (
              <>
                <span>✗</span>
                <span>Extraction Failed</span>
              </>
            ) : (
              <>
                <span>🎬</span>
                <span>Extract Subtitles (SRT)</span>
              </>
            )}
          </button>

          {/* Download Subtitles Button */}
          {extractStatus === 'success' && subtitleContent && (
            <button
              onClick={downloadSubtitles}
              className="w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50"
            >
              <span>⬇️</span>
              <span>Download Original SRT</span>
            </button>
          )}

          {/* Translate Subtitles Button */}
          {extractStatus === 'success' && subtitleContent && translateStatus !== 'success' && (
            <button
              onClick={handleTranslateSubtitles}
              disabled={isTranslating || translateStatus === 'processing'}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                translateStatus === 'error'
                  ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white border border-blue-400/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isTranslating || translateStatus === 'processing' ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Translating to 21 Languages...</span>
                </>
              ) : translateStatus === 'error' ? (
                <>
                  <span>✗</span>
                  <span>Translation Failed</span>
                </>
              ) : (
                <>
                  <span>🌍</span>
                  <span>Translate to 21 Languages</span>
                </>
              )}
            </button>
          )}

          {/* Translated Subtitles Downloads */}
          {translateStatus === 'success' && translatedSubtitles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-emerald-400 font-semibold">✓ Translations Complete - Download your files:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {translatedSubtitles.map((subtitle) => (
                  <button
                    key={subtitle.language}
                    onClick={() => downloadTranslatedSubtitles(subtitle)}
                    className="py-2 px-3 rounded-lg font-semibold text-xs bg-emerald-600/50 hover:bg-emerald-600 text-emerald-100 border border-emerald-400/50 transition-all flex flex-col items-center gap-1"
                  >
                    <span>⬇️</span>
                    <span>{subtitle.language.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Curate Viral Shorts Button */}
          {extractStatus === 'success' && subtitleContent && highlightStatus !== 'success' && (
            <button
              onClick={handleCurateHighlights}
              disabled={isHighlighting || highlightStatus === 'processing'}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                highlightStatus === 'error'
                  ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border border-orange-400/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isHighlighting || highlightStatus === 'processing' ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Analyzing Viral Hooks...</span>
                </>
              ) : highlightStatus === 'error' ? (
                <>
                  <span>✗</span>
                  <span>Curation Failed</span>
                </>
              ) : (
                <>
                  <span>🎬</span>
                  <span>Curate Viral Shorts (AI)</span>
                </>
              )}
            </button>
          )}

          {/* Highlights Grid */}
          {highlightStatus === 'success' && highlights.length > 0 && (
            <div className="space-y-3 mt-4">
              <p className="text-xs text-orange-400 font-semibold">✨ Viral Shorts Recommendations:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="bg-black/40 border border-orange-500/30 rounded-lg p-3 hover:bg-black/60 transition-all"
                  >
                    {/* Viral Score Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white border ${getViralScoreColor(highlight.viralScore)}`}>
                        🔥 {highlight.viralScore.toFixed(1)}/10
                      </div>
                      <span className="text-xs text-gray-400">{highlight.durationSeconds}s</span>
                    </div>

                    {/* Hook Title */}
                    <h4 className="text-sm font-bold text-orange-300 mb-2 line-clamp-2">
                      {highlight.hookTitle}
                    </h4>

                    {/* Summary */}
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {highlight.summary}
                    </p>

                    {/* Timestamps */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-black/50 rounded p-2">
                        <span className="text-xs text-gray-500">Start:</span>
                        <span className="text-xs font-mono text-cyan-300">{highlight.startTime}</span>
                        <button
                          onClick={() => copyToClipboard(highlight.startTime)}
                          className="ml-2 px-2 py-1 bg-cyan-600/50 hover:bg-cyan-600 rounded text-xs transition-colors"
                          title="Copy start time"
                        >
                          📋
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-black/50 rounded p-2">
                        <span className="text-xs text-gray-500">End:</span>
                        <span className="text-xs font-mono text-cyan-300">{highlight.endTime}</span>
                        <button
                          onClick={() => copyToClipboard(highlight.endTime)}
                          className="ml-2 px-2 py-1 bg-cyan-600/50 hover:bg-cyan-600 rounded text-xs transition-colors"
                          title="Copy end time"
                        >
                          📋
                        </button>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${highlight.startTime} --> ${highlight.endTime}`)}
                        className="w-full py-1.5 px-2 bg-orange-600/50 hover:bg-orange-600 rounded text-xs text-orange-100 transition-all font-semibold"
                      >
                        📋 Copy Timespan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Text */}
          <p className="text-xs text-gray-400 text-center mt-3">
            {extractStatus === 'processing'
              ? 'Processing your video... This may take up to 30 seconds.'
              : highlightStatus === 'processing'
              ? 'Analyzing video for viral hooks... This may take 30-60 seconds.'
              : highlightStatus === 'success'
              ? 'Viral shorts identified! Copy timestamps to create your clips.'
              : extractStatus === 'success' && translateStatus === 'idle' && highlightStatus === 'idle'
              ? 'Subtitles extracted! Translate to 21 languages or curate viral shorts.'
              : translateStatus === 'processing'
              ? 'Translating subtitles to 21 languages... This may take 2-3 minutes.'
              : translateStatus === 'success'
              ? 'Translation complete! Download your files in all supported languages.'
              : extractStatus === 'error'
              ? 'Failed to extract subtitles. Please try again.'
              : 'AI-powered subtitle extraction, translation, and viral clip curation. Pro feature for global content distribution.'}
          </p>
        </div>

        {/* Pro Feature Badge */}
        <div className="mt-4 p-3 bg-purple-950/50 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-300">
            <strong>✨ Pro Feature Suite:</strong>
          </p>
          <ul className="text-xs text-purple-300 mt-2 space-y-1 ml-4">
            <li>✓ AI Subtitle Extraction (SRT) from YouTube videos</li>
            <li>✓ 1-Click Multi-language Translation (21 languages)</li>
            <li>✓ AI Viral Shorts Curation (Timestamp Recommendations)</li>
            <li>✓ Batch Download for Global Distribution</li>
            <li>Coming Soon: AI Dubbing & Cross-Platform Auto-Upload</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
