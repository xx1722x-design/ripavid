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

function getFormatLabel(format: Format): string {
  const extUpper = format.ext.toUpperCase();
  return format.quality ? `${extUpper} ${format.quality}` : extUpper;
}

export default function VideoResult({ title, formats, onClose }: VideoResultProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

      {/* Split Button with Dropdown */}
      <div className="relative inline-block w-full">
        <div className="flex gap-0">
          {/* Download Link (Left) - Direct HTML anchor tag */}
          {formats.length > 0 && (
            <a
              href={formats[0].url}
              target="_blank"
              rel="noopener noreferrer"
              download={`video.${formats[0].ext}`}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-l-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg active:scale-95 no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download ({formats[0].ext.toUpperCase()})
            </a>
          )}

          {/* Dropdown Toggle Button (Right) */}
          <button
            ref={buttonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 px-4 rounded-r-lg transition-all duration-200 flex items-center justify-center shadow-lg active:scale-95 border-l border-green-400/50"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-600 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <div className="max-h-64 overflow-y-auto">
              {formats.map((format, index) => (
                <a
                  key={index}
                  href={format.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`video.${format.ext}`}
                  className="w-full px-6 py-3 text-left hover:bg-zinc-700 transition-colors flex items-center justify-between group border-b border-zinc-700 last:border-b-0 no-underline"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <div>
                      <p className="text-white font-medium">{getFormatLabel(format)}</p>
                      <p className="text-xs text-zinc-400">{format.ext.toUpperCase()}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      Best
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Format List Summary */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
        <p className="text-xs text-zinc-500 mb-3">Available Formats:</p>
        <div className="flex flex-wrap gap-2">
          {formats.map((format, index) => (
            <span
              key={index}
              className="text-xs bg-zinc-700 text-zinc-200 px-3 py-1 rounded-full"
            >
              {getFormatLabel(format)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
