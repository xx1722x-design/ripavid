import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from '@/lib/jwt';
import { getUserById } from '@/lib/users';

export async function GET(req: NextRequest) {
  const videoUrl = req.nextUrl.searchParams.get('url');
  if (!videoUrl || !/^https?:\/\//i.test(videoUrl)) {
    return NextResponse.json({ error: 'A valid url is required' }, { status: 400 });
  }

  const height = parseInt(req.nextUrl.searchParams.get('height') ?? '', 10);

  // Tier validation: Only allow 720p and below for free users
  if (height > 720) {
    const token = req.cookies.get('auth_token')?.value;
    let userTier = 'free';

    if (token) {
      const payload = jwtVerify(token);
      if (payload) {
        const user = await getUserById(payload.uid);
        if (user) {
          userTier = user.tier;
        }
      }
    }

    // Reject if user is not Pro and requested height > 720p
    if (userTier !== 'pro') {
      return NextResponse.json(
        { error: 'Upgrade to Pro Pass to download 1080p and higher quality' },
        { status: 403 }
      );
    }
  }

  const target = new URL('https://snagaclip.com/api/download');
  target.searchParams.set('url', videoUrl);

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
