import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Get the current request's protocol and host for accurate redirect_uri
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'www.ripavid.com';

  // Build redirect_uri from the current request domain
  const redirectUri = `${protocol}://${host}/api/auth/callback`;

  console.log(`[OAuth] Initiating login with redirect_uri: ${redirectUri}`);

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
