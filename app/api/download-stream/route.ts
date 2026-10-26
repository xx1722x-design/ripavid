import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const videoUrl = req.nextUrl.searchParams.get('url');
  if (!videoUrl || !/^https?:\/\//i.test(videoUrl)) {
    return NextResponse.json({ error: 'A valid url is required' }, { status: 400 });
  }
  const target = new URL('https://snagaclip.com/api/download');
  target.searchParams.set('url', videoUrl);

  const height = parseInt(req.nextUrl.searchParams.get('height') ?? '', 10);
  if (height > 0) target.searchParams.set('height', String(height));

  // Pass title to backend if provided (for proper filename)
  const title = req.nextUrl.searchParams.get('title');
  if (title && title.trim()) {
    target.searchParams.set('title', title);
  }

  const resolution = req.nextUrl.searchParams.get('resolution');
  if (resolution && resolution.trim()) {
    target.searchParams.set('resolution', resolution);
  }

  return NextResponse.redirect(target, 302);
}
