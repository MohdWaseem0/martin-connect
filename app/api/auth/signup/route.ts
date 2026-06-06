import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, companyName } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Set defaults based on role
    let title = 'Software Developer';
    let skills = 'React, Next.js';
    let credits = 0;

    if (role === 'recruiter') {
      title = 'Talent Acquisition Manager';
      skills = 'Sourcing, Recruitment';
      credits = 100;
    } else if (role === 'admin') {
      title = 'Administrator';
      skills = 'Management';
      credits = 9999;
    }

    // If recruiter has a company, we should check if that company exists. If not, create it!
    let targetCompanyId = '';
    if (role === 'recruiter' && companyName) {
      const formattedCompanyId = 'company-' + companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const company = await prisma.company.upsert({
        where: { id: formattedCompanyId },
        update: {},
        create: {
          id: formattedCompanyId,
          name: companyName,
          logo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=150&auto=format&fit=crop',
          description: `${companyName} is a growing enterprise.`,
          industry: 'Technology Solutions',
          size: '10-50 Employees',
          location: 'India',
          verified: false,
          rating: 0.0,
          founded: new Date().getFullYear().toString(),
          website: `www.${formattedCompanyId}.com`,
          jobsCount: 0,
        },
      });
      targetCompanyId = company.id;
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        title,
        skills,
        credits,
        location: 'India',
        experience: '2 Years',
      },
    });

    // Create session and log in immediately
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        id: sessionToken,
        userId: newUser.id,
        expiresAt,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    const { passwordHash: _, ...userProfile } = newUser;
    return NextResponse.json({ user: userProfile });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
