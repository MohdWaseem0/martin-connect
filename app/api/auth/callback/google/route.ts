import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const savedState = cookieStore.get('oauth_state')?.value;

  // Clear state cookie
  cookieStore.delete('oauth_state');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 });
  }

  if (!state || state !== savedState) {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
  }

  try {
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Google client credentials are not configured');
      return NextResponse.json({ error: 'OAuth credentials error' }, { status: 500 });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 400 });
    }

    const { access_token } = await tokenResponse.json();

    // Fetch user details from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user info from Google' }, { status: 400 });
    }

    const googleUser = await userResponse.json();
    const email = googleUser.email;
    const name = googleUser.name || googleUser.given_name || 'Google User';

    if (!email) {
      return NextResponse.json({ error: 'Email not provided by Google' }, { status: 400 });
    }

    // Find user in the database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, redirect to the social setup page to choose their role
    if (!user) {
      cookieStore.set('temp_social_user', JSON.stringify({ email, name }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 900, // 15 minutes
        path: '/',
      });
      return NextResponse.redirect(new URL('/signup/social-setup', request.url));
    }

    // Create a new session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        id: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Set HTTP-Only cookie
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    // Redirect the user to their corresponding dashboard
    const dashboardPath = user.role === 'admin'
      ? '/admin'
      : user.role === 'recruiter'
      ? '/dashboard/recruiter'
      : '/dashboard/seeker';

    return NextResponse.redirect(new URL(dashboardPath, request.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
