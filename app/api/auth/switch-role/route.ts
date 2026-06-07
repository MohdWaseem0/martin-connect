import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionToken },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const { role } = await request.json();

    if (!role || !['seeker', 'recruiter', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Only update the role — preserve the user's actual name, email, and profile data
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        role,
      },
    });

    const { passwordHash: _, ...userProfile } = updatedUser;
    return NextResponse.json({ user: userProfile });
  } catch (error: any) {
    console.error('Switch role error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
