import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from '@/lib/jwt';
import { getUserById } from '@/lib/users';

// Explicitly use Node.js runtime (required for JWT verification and file access)
export const runtime = 'nodejs';

// Helper function to validate tier and get download permission
async function validateDownloadPermission(req: NextRequest, height: number) {
  try {
    const videoUrl = req.nextUrl.searchParams.get('url');
    if (!videoUrl || !/^https?:\/\//i.test(videoUrl)) {
      return {
        allowed: false,
        status: 400,
        error: 'A valid URL is required',
      };
    }

    // Tier validation: Only allow 720p and below for free users
    if (height > 720) {
      const token = req.cookies.get('auth_token')?.value;
      let userTier = 'free';

      if (token) {
        try {
          const payload = jwtVerify(token);
          if (payload) {
            const user = await getUserById(payload.uid);
            if (user) {
              userTier = user.tier;
            }
          }
        } catch (tokenError) {
          console.error('Token verification error:', tokenError);
          // Continue with free tier if token is invalid
        }
      }

      // Reject if user is not Pro and requested height > 720p
      if (userTier !== 'pro') {
        return {
          allowed: false,
          status: 403,
          error: 'Upgrade to Pro Pass to download 1080p and higher quality',
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      allowed: false,
      status: 500,
      error: 'Server error during validation',
    };
  }
}

export async function HEAD(req: NextRequest) {
  try {
    const height = parseInt(req.nextUrl.searchParams.get('height') ?? '0', 10);
    const validation = await validateDownloadPermission(req, height);

    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    // HEAD request just checks permissions, returns 200 OK
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('HEAD request error:', error);
    return NextResponse.json(
      { error: 'Failed to verify download permissions' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const videoUrl = req.nextUrl.searchParams.get('url');
    const height = parseInt(req.nextUrl.searchParams.get('height') ?? '0', 10);

    // Validate permission
    const validation = await validateDownloadPermission(req, height);
    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const target = new URL('https://snagaclip.com/api/download');
    target.searchParams.set('url', videoUrl!);

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
  } catch (error) {
    console.error('Download request error:', error);
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
}
