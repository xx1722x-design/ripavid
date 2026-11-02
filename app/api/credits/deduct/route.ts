import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from '@/lib/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Bypass Next.js caching

export async function POST(req: NextRequest) {
  try {
    const { amount, reason } = await req.json();

    if (!amount || !reason) {
      return NextResponse.json(
        { error: 'amount and reason are required' },
        { status: 400 }
      );
    }

    const token = req.cookies.get('auth_token')?.value;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '0.0.0.0';

    // Dynamically import to avoid Supabase initialization errors
    const { deductUserCredits } = await import('@/lib/supabase');

    // Authenticated user
    if (token) {
      try {
        const payload = jwtVerify(token);
        if (payload?.uid) {
          const result = await deductUserCredits(payload.uid, amount, reason);
          if (!result.success) {
            return NextResponse.json(
              { error: result.error, remainingCredits: result.remainingCredits },
              { status: 402 } // Payment Required
            );
          }
          return NextResponse.json({
            success: true,
            remainingCredits: result.remainingCredits,
            isGuest: false
          });
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
      }
    }

    // Guest user - deduct from IP-based credits using Service Role (RLS bypass)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('[Credits] Supabase Service Role Key not configured');
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    try {
      // Get current guest credits
      const { data: existingData, error: selectError } = await supabaseAdmin
        .from('guest_credits')
        .select('credits')
        .eq('ip_address', ipAddress)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('[Credits] Error fetching guest credits:', selectError);
        return NextResponse.json(
          { error: 'Database error', remainingCredits: 0 },
          { status: 402 }
        );
      }

      const currentCredits = existingData?.credits || 10;
      if (currentCredits < amount) {
        // Insufficient credits - trigger login/payment prompt
        return NextResponse.json(
          {
            error: 'Insufficient credits',
            remainingCredits: currentCredits,
            isGuest: true,
            shouldPromptLogin: true
          },
          { status: 402 } // Payment Required
        );
      }

      const newCredits = currentCredits - amount;

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabaseAdmin
          .from('guest_credits')
          .update({ credits: newCredits, last_used_at: new Date().toISOString() })
          .eq('ip_address', ipAddress);

        if (updateError) {
          console.error('[Credits] Error deducting guest credits:', updateError);
          return NextResponse.json(
            { error: 'Failed to deduct credits', remainingCredits: currentCredits },
            { status: 402 }
          );
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabaseAdmin
          .from('guest_credits')
          .insert([{
            ip_address: ipAddress,
            credits: newCredits,
            created_at: new Date().toISOString(),
            last_used_at: new Date().toISOString()
          }]);

        if (insertError) {
          console.error('[Credits] Error inserting guest credits:', insertError);
          return NextResponse.json(
            { error: 'Failed to create credit record', remainingCredits: 10 },
            { status: 402 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        remainingCredits: newCredits,
        isGuest: true
      });
    } catch (error) {
      console.error('[Credits] Guest deduction error:', error);
      return NextResponse.json(
        { error: 'Failed to deduct credits' },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error('Credits deduct endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to deduct credits' },
      { status: 500 }
    );
  }
}
