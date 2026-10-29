/**
 * Convert various YouTube URL formats to standard YouTube URL
 * Supports:
 * - youtube.com/watch?v=ID
 * - youtu.be/ID
 * - youtube.com/shorts/ID
 * - just the video ID
 */
export function normalizeYouTubeUrl(input: string): string {
  if (!input) return '';

  const trimmed = input.trim();

  // If it's just a video ID (11 characters, alphanumeric with - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/watch?v=${trimmed}`;
  }

  // If it already starts with http or https, try to parse it
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const hostname = url.hostname.replace('www.', '');

      // Handle youtube.com
      if (hostname === 'youtube.com') {
        const videoId = url.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }

        // Handle shorts
        const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
        if (shortsMatch) {
          return `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
        }
      }

      // Handle youtu.be
      if (hostname === 'youtu.be') {
        const videoId = url.pathname.slice(1);
        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      }

      // If it's already a standard YouTube URL, return as is
      if (hostname === 'youtube.com' && url.searchParams.get('v')) {
        return trimmed;
      }

      return trimmed;
    } catch {
      // If URL parsing fails, return as is
      return trimmed;
    }
  }

  // If it doesn't start with http, assume it's a URL and add protocol
  return `https://${trimmed}`;
}
