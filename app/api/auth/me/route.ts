import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session if found
      if (session) {
        await prisma.session.delete({ where: { id: sessionToken } });
      }
      // Clear cookie
      cookieStore.delete('session_token');
      return NextResponse.json({ authenticated: false, user: null });
    }

    const { passwordHash: _, ...userProfile } = session.user;
    return NextResponse.json({ authenticated: true, user: userProfile });
  } catch (error: any) {
    console.error('Session get error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (sessionToken) {
      // Delete from db
      await prisma.session.deleteMany({
        where: { id: sessionToken },
      });
    }

    // Clear cookie
    cookieStore.delete('session_token');

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
