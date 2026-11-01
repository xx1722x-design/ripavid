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

          {/* Info Text */}
          <p className="text-xs text-gray-400 text-center mt-3">
            {extractStatus === 'processing'
              ? 'Processing your video... This may take up to 30 seconds.'
              : extractStatus === 'success' && translateStatus === 'idle'
              ? 'Subtitles extracted! Now translate to 21 languages for global distribution.'
              : translateStatus === 'processing'
              ? 'Translating subtitles to 21 languages... This may take 2-3 minutes.'
              : translateStatus === 'success'
              ? 'Translation complete! Download your files in all supported languages.'
              : extractStatus === 'error'
              ? 'Failed to extract subtitles. Please try again.'
              : 'AI-powered subtitle extraction and multi-language translation. Pro feature for global content distribution.'}
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
            <li>✓ Batch Download for Global Distribution</li>
            <li>Coming Soon: AI Dubbing & Cross-Platform Auto-Upload</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
