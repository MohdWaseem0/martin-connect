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

    const { candidateId, content } = await request.json();

    if (!candidateId || !content) {
      return NextResponse.json(
        { error: 'Candidate ID and content are required' },
        { status: 400 }
      );
    }

    const newNote = await prisma.candidateNote.create({
      data: {
        candidateId,
        content,
        author: session.user.name,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      note: {
        author: newNote.author,
        content: newNote.content,
        date: newNote.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      },
    });
  } catch (error: any) {
    console.error('Add candidate note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
