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

  // Detect if coming from rrr domain or rrr prefix
  const isRrrDomain = hostname.includes('rrryoutube') ||
                      hostname.includes('rrr.') ||
                      hostname.includes('rrr-');

  // Handle /shorts/:id redirects (already handled by next.config.ts)
  // This middleware ensures the video ID is properly passed to dashboard

  // Detect if the request is for /watch path (rrryoutube.com/watch?v=...)
  // rrryoutube.com, www.rrryoutube.com, 또는 rrr 프리픽스 도메인에서 들어오는 /watch 요청 처리
  if (pathname === '/watch' || pathname === '/watch/') {
    const videoId = searchParams.get('v');

    if (videoId) {
      // Normalize to YouTube URL
      const youtubeUrl = normalizeYouTubeUrl(videoId);

      // ripavid.com으로 리다이렉트하면서 URL 파라미터 전달
      const redirectUrl = new URL('/', 'https://www.ripavid.com');
      redirectUrl.searchParams.set('url', youtubeUrl);

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle requests from rrr domains pointing to root path (e.g., rrryoutube.com/)
  // Extract video ID from query parameters
  if (isRrrDomain && (pathname === '/' || pathname === '')) {
    const videoId = searchParams.get('v');
    const videoUrl = searchParams.get('url');

    if (videoId || videoUrl) {
      const redirectUrl = new URL('/', 'https://www.ripavid.com');

      if (videoUrl) {
        // Full URL provided
        redirectUrl.searchParams.set('url', videoUrl);
      } else if (videoId) {
        // Video ID only - normalize it
        const youtubeUrl = normalizeYouTubeUrl(videoId);
        redirectUrl.searchParams.set('url', youtubeUrl);
      }

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle /dashboard with video ID parameter
  // Allow both ?v= (video ID) and ?url= (full URL) parameters to pass through
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    const videoId = searchParams.get('v');
    const videoUrl = searchParams.get('url');

    if (videoId || videoUrl) {
      // Let the request pass through - dashboard will handle the parameters
      // and auto-submit to the processing function
      const response = NextResponse.next();
      // Preserve the original query parameters
      return response;
    }
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
