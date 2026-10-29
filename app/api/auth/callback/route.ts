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
  console.log('[OAuth] Fetching Google user info with access token...');
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`[OAuth] Failed to fetch Google user info. Status: ${response.status}, Body: ${errorData}`);
    throw new Error(`Failed to fetch Google user info: ${response.status}`);
  }

  const userInfo = await response.json();
  console.log(`[OAuth] Google user info retrieved. Email: ${userInfo.email}, ID: ${userInfo.id}`);
  return userInfo;
}

async function exchangeCodeForToken(code: string, redirectUri: string): Promise<GoogleTokenResponse> {
  console.log(`[OAuth] Exchanging authorization code for token. Redirect URI: ${redirectUri}`);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId) {
    console.error('[OAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
    throw new Error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
  }

  if (!clientSecret) {
    console.error('[OAuth] GOOGLE_CLIENT_SECRET is not set');
    throw new Error('Missing GOOGLE_CLIENT_SECRET');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`[OAuth] Token exchange failed. Status: ${response.status}, Body: ${errorData}`);
    throw new Error(`Failed to exchange code for token: ${response.status} - ${errorData}`);
  }

  const tokenData = await response.json();
  console.log('[OAuth] Token exchange successful. Received access_token.');
  return tokenData;
}

export async function GET(request: NextRequest) {
  try {
    console.log('[OAuth] ===== OAuth Callback Started =====');

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log(`[OAuth] Code received: ${code ? code.substring(0, 20) + '...' : 'MISSING'}`);
    console.log(`[OAuth] State received: ${state ? state.substring(0, 20) + '...' : 'MISSING'}`);

    if (!code) {
      console.error('[OAuth] Missing authorization code');
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    // Verify CSRF token
    const storedState = request.cookies.get('oauth_state')?.value;
    console.log(`[OAuth] Stored state: ${storedState ? storedState.substring(0, 20) + '...' : 'MISSING'}`);

    if (state !== storedState) {
      console.error('[OAuth] State mismatch - CSRF protection triggered');
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    console.log('[OAuth] CSRF verification passed');

    // Get the current request's protocol and host for accurate redirect_uri
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'www.ripavid.com';
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    console.log(`[OAuth] Callback received, exchanging code with redirect_uri: ${redirectUri}`);

    // Exchange code for token
    console.log('[OAuth] Step 1: Exchanging authorization code for access token...');
    const tokenData = await exchangeCodeForToken(code, redirectUri);
    console.log('[OAuth] Step 1: ✅ Token exchange completed');

    // Get user info from Google
    console.log('[OAuth] Step 2: Fetching user information from Google...');
    const userInfo = await getGoogleUserInfo(tokenData.access_token);
    console.log(`[OAuth] Step 2: ✅ User info retrieved (Email: ${userInfo.email})`);

    // Check if user already exists
    console.log(`[OAuth] Step 3: Checking if user exists in database (Google ID: ${userInfo.id})...`);
    let user = await getUserByGoogleId(userInfo.id);

    if (user) {
      console.log(`[OAuth] Step 3: ✅ User found in database. UID: ${user.uid}`);
    } else {
      console.log('[OAuth] Step 3: User not found. Creating new user...');
      user = await createUser(userInfo.email, userInfo.id, userInfo.name, userInfo.picture);
      console.log(`[OAuth] Step 3: ✅ New user created. UID: ${user.uid}`);
    }

    // Generate JWT token
    console.log('[OAuth] Step 4: Generating JWT token...');
    const token = jwtSign({
      uid: user.uid,
      email: user.email,
      googleId: user.googleId,
    });
    console.log('[OAuth] Step 4: ✅ JWT token generated successfully');

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

    console.log('[OAuth] ===== OAuth Callback Completed Successfully =====');
    return response;
  } catch (error) {
    console.error('[OAuth] ===== OAuth Callback FAILED =====');
    console.error('[OAuth] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[OAuth] Full error:', error);

    if (error instanceof Error && error.stack) {
      console.error('[OAuth] Stack trace:', error.stack);
    }

    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
}
