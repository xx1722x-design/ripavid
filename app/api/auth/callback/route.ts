import { NextRequest, NextResponse } from 'next/server';
import { jwtSign } from '@/lib/jwt';
import { getUserByGoogleId, createUser } from '@/lib/users';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google user info');
  }

  return response.json();
}

async function exchangeCodeForToken(code: string, redirectUri: string): Promise<GoogleTokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    // Verify CSRF token
    const storedState = request.cookies.get('oauth_state')?.value;
    if (state !== storedState) {
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    // Get the current request's protocol and host for accurate redirect_uri
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'www.ripavid.com';
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    console.log(`[OAuth] Callback received, exchanging code with redirect_uri: ${redirectUri}`);

    // Exchange code for token
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokenData.access_token);

    // Check if user already exists
    let user = await getUserByGoogleId(userInfo.id);

    // If user doesn't exist, create a new one
    if (!user) {
      user = await createUser(userInfo.email, userInfo.id, userInfo.name, userInfo.picture);
    }

    // Generate JWT token
    const token = jwtSign({
      uid: user.uid,
      email: user.email,
      googleId: user.googleId,
    });

    // Create response with redirect to home
    const response = NextResponse.redirect(new URL('/', request.url));

    // Set auth token in httpOnly cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Clear oauth state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
}
