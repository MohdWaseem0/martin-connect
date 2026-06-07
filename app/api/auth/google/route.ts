import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

    const state = crypto.randomBytes(16).toString('hex');

    // Set the state in a cookie for validation in callback
    const cookieStore = await cookies();
    cookieStore.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is not configured in environment variables');
      return NextResponse.json({ error: 'OAuth configuration error' }, { status: 500 });
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
        access_type: 'offline',
        prompt: 'consent'
      }).toString();

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Initiate Google OAuth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
