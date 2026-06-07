import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tempUserCookie = cookieStore.get('temp_social_user')?.value;

    if (!tempUserCookie) {
      return NextResponse.json({ error: 'OAuth session expired. Please sign in again.' }, { status: 400 });
    }

    let userDetails: { email: string; name: string };
    try {
      userDetails = JSON.parse(tempUserCookie);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid OAuth payload.' }, { status: 400 });
    }

    const { email } = userDetails;
    const { name, role, companyName } = await request.json();

    if (!name || !role || !['seeker', 'recruiter'].includes(role)) {
      return NextResponse.json({ error: 'Name and a valid role are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    // Set defaults based on role
    let title = 'Software Engineer';
    let skills = 'React, Next.js, JavaScript';
    let credits = 0;

    if (role === 'recruiter') {
      title = 'Talent Acquisition Manager';
      skills = 'Sourcing, Recruitment';
      credits = 100;
    }

    // Setup company if recruiter
    let targetCompanyId = '';
    if (role === 'recruiter' && companyName) {
      targetCompanyId = 'company-' + companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await prisma.company.upsert({
        where: { id: targetCompanyId },
        update: {},
        create: {
          id: targetCompanyId,
          name: companyName,
          logo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=150&auto=format&fit=crop',
          description: `${companyName} is a growing enterprise.`,
          industry: 'Technology Solutions',
          size: '10-50 Employees',
          location: 'India',
          verified: false,
          rating: 0.0,
          founded: new Date().getFullYear().toString(),
          website: `www.${targetCompanyId}.com`,
          jobsCount: 0,
        },
      });
    }

    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        title,
        skills,
        credits,
        location: 'India',
        experience: '2 Years',
        companyId: targetCompanyId || null,
        companyName: companyName || null,
      },
    });

    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        id: sessionToken,
        userId: newUser.id,
        expiresAt,
      },
    });

    // Set HTTP-Only cookie for auth session
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    // Delete the temporary social user setup cookie
    cookieStore.delete('temp_social_user');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social signup completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
