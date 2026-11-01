import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Get client IP address
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';

    // Dynamically import to avoid initialization errors
    const { getGuestDownloadCount } = await import('@/lib/supabase');
    const { count, error } = await getGuestDownloadCount(ip);

    if (error) {
      console.warn('[Guest Downloads] Error getting count:', error);
      // Return 0 if error (allow downloads if we can't check)
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error('[Guest Downloads] Endpoint error:', error);
    // Return 0 if Supabase not configured (graceful fallback)
    return NextResponse.json({ count: 0 });
  }
}
