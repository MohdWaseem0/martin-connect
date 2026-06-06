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
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const { candidateId } = await request.json();

    if (!candidateId) {
      return NextResponse.json(
        { error: 'Candidate ID is required' },
        { status: 400 }
      );
    }

    // Check if already unlocked
    const existingUnlock = await prisma.candidateUnlock.findUnique({
      where: {
        candidateId_userId: {
          candidateId,
          userId: session.userId,
        },
      },
    });

    if (existingUnlock) {
      return NextResponse.json({
        success: true,
        message: 'Profile already unlocked',
        creditsRemaining: session.user.credits,
      });
    }

    // Check credits
    if (session.user.credits <= 0) {
      return NextResponse.json(
        { error: 'No CV unlock credits remaining. Upgrade your plan to get more credits!' },
        { status: 402 }
      );
    }

    // Deduct credit and create unlock record in transaction
    const [_, updatedUser] = await prisma.$transaction([
      prisma.candidateUnlock.create({
        data: {
          candidateId,
          userId: session.userId,
        },
      }),
      prisma.user.update({
        where: { id: session.userId },
        data: {
          credits: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Candidate unlocked successfully',
      creditsRemaining: updatedUser.credits,
    });
  } catch (error: any) {
    console.error('Unlock candidate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
