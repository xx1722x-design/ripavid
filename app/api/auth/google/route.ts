import { NextRequest, NextResponse } from 'next/server';

// Explicitly use Node.js runtime
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Determine redirect_uri based on environment
  let redirectUri: string;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Production: Use hardcoded value to match Google Console exactly
    redirectUri = 'https://www.ripavid.com/api/auth/callback';
    console.log('[OAuth] Production environment - using hardcoded redirect_uri');
  } else {
    // Development: Use dynamic detection
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const rawHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';

    // Remove port from host if present (e.g., "localhost:3000" -> "localhost")
    const host = rawHost.split(':')[0] || rawHost;

    redirectUri = `${protocol}://${host}:3000/api/auth/callback`;
    console.log(`[OAuth] Development environment - using dynamic redirect_uri: ${redirectUri}`);
  }

  console.log(`[OAuth] Final redirect_uri for Google OAuth: ${redirectUri}`);

  // Generate random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  console.log(`[OAuth] Generated state: ${state.substring(0, 20)}...`);

  // Store state in cookie (expires in 10 minutes)
  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=openid email profile` +
    `&state=${state}`
  );

  // Set state cookie with flexible SameSite handling
  response.cookies.set({
    name: 'oauth_state',
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none', // Changed from 'lax' to 'none' to handle cross-site redirects from Google
    maxAge: 600, // 10 minutes
    path: '/',
  });

  console.log(`[OAuth] State cookie set: httpOnly=true, secure=${process.env.NODE_ENV === 'production'}, sameSite=none, path=/`);

  return response;
}
