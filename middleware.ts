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

  // Handle /shorts/:id redirects (already handled by next.config.ts)
  // This middleware ensures the video ID is properly passed to dashboard

  // Detect if the request is for /watch path (rrryoutube.com/watch?v=...)
  // rrryoutube.com, www.rrryoutube.com에서 들어오는 모든 /watch 요청을 처리
  if (pathname === '/watch' || pathname === '/watch/') {
    const videoId = searchParams.get('v');

    if (videoId) {
      // Normalize to YouTube URL
      const youtubeUrl = normalizeYouTubeUrl(videoId);

      // 명시적으로 ripavid.com으로 리다이렉트 (무한 루프 방지)
      const redirectUrl = new URL('/', 'https://www.ripavid.com');
      redirectUrl.searchParams.set('url', youtubeUrl);

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
