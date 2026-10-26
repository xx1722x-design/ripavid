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
  return NextResponse.redirect(target, 302);
}
