import { NextRequest, NextResponse } from 'next/server';

/**
 * Normalize YouTube URL formats
 */
function normalizeYouTubeUrl(input: string): string {
  if (!input) return '';

  const trimmed = input.trim();

  // If it's just a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/watch?v=${trimmed}`;
  }

  // If it already has protocol
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
      }

      // Handle youtu.be
      if (hostname === 'youtu.be') {
        const videoId = url.pathname.slice(1);
        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      }

      return trimmed;
    } catch {
      return trimmed;
    }
  }

  // Add protocol if missing
  return `https://${trimmed}`;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams, hostname } = request.nextUrl;

  // Detect if the request is for /watch path (rrryoutube.com/watch?v=...)
  if (pathname === '/watch' || pathname === '/watch/') {
    const videoId = searchParams.get('v');

    if (videoId) {
      // Normalize to YouTube URL
      const youtubeUrl = normalizeYouTubeUrl(videoId);

      // Create URL with ?url parameter
      const redirectUrl = new URL('/', request.nextUrl.origin);
      redirectUrl.searchParams.set('url', youtubeUrl);

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle www subdomain normalization
  if (hostname?.startsWith('www.')) {
    const newUrl = new URL(request.nextUrl);
    newUrl.hostname = hostname.replace('www.', '');
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
