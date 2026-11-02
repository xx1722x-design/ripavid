import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from '@/lib/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Bypass Next.js caching

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '0.0.0.0';

    // Dynamically import to avoid Supabase initialization errors
    const { getUserCredits } = await import('@/lib/supabase');

    // Authenticated user
    if (token) {
      try {
        const payload = jwtVerify(token);
        if (payload?.uid) {
          const { credits, error } = await getUserCredits(payload.uid);
          if (error) {
            console.warn('Error fetching user credits:', error);
          }
          return NextResponse.json({ credits: credits || 30, isGuest: false });
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
      }
    }

    // Guest user - get IP-based credits using Service Role (RLS bypass)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('[Credits] Supabase Service Role Key not configured');
      return NextResponse.json({ credits: 10, isGuest: true });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    try {
      const { data, error } = await supabaseAdmin
        .from('guest_credits')
        .select('credits')
        .eq('ip_address', ipAddress)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[Credits] Error fetching guest credits:', error);
        return NextResponse.json({ credits: 10, isGuest: true });
      }

      return NextResponse.json({ credits: data?.credits || 10, isGuest: true });
    } catch (error) {
      console.error('[Credits] Balance fetch error:', error);
      return NextResponse.json({ credits: 10, isGuest: true });
    }
  } catch (error) {
    console.error('Credits balance endpoint error:', error);
    return NextResponse.json({ credits: 0, error: 'Failed to fetch credits' }, { status: 500 });
  }
}
