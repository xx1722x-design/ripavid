import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Determine the correct callback URL based on environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const isProduction = process.env.NODE_ENV === 'production';

  // For production, always use the frontend domain (ripavid.com)
  // For development, use the local API URL
  const baseUrl = isProduction ? 'https://www.ripavid.com' : apiUrl;
  const redirectUri = `${baseUrl}/api/auth/callback`;

  // Generate random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Store state in cookie (expires in 10 minutes)
  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=openid email profile` +
    `&state=${state}`
  );

  response.cookies.set({
    name: 'oauth_state',
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  });

  return response;
}
