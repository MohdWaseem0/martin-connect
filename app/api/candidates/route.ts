import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    let userId: string | null = null;
    let unlockedCandidates: string[] = [];

    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { id: sessionToken },
      });
      if (session && session.expiresAt > new Date()) {
        userId = session.userId;
      }
    }

    if (userId) {
      const unlocks = await prisma.candidateUnlock.findMany({
        where: { userId },
        select: { candidateId: true },
      });
      unlockedCandidates = unlocks.map((u) => u.candidateId);
    }

    const candidates = await prisma.candidate.findMany({
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format fields like skills into arrays for frontend compatibility
    const formattedCandidates = candidates.map((c) => ({
      ...c,
      skills: c.skills ? c.skills.split(',') : [],
      notes: c.notes.map((n) => ({
        author: n.author,
        content: n.content,
        date: n.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      })),
    }));

    return NextResponse.json({
      candidates: formattedCandidates,
      unlockedCandidates,
    });
  } catch (error: any) {
    console.error('Fetch candidates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const { candidateId, stage } = await request.json();

    if (!candidateId || !stage) {
      return NextResponse.json(
        { error: 'Candidate ID and stage are required' },
        { status: 400 }
      );
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: { stage },
    });

    return NextResponse.json({ success: true, candidate: updatedCandidate });
  } catch (error: any) {
    console.error('Update candidate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
