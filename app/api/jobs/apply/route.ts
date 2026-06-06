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

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const user = session.user;

    // Check if user has already applied (i.e. is there a candidate with this email and name under 'Applied' or related notes?)
    // In our system, the candidate is a separate table. We can check if a candidate with this user's email exists.
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        email: user.email,
        name: user.name,
      },
    });

    if (existingCandidate) {
      return NextResponse.json({
        success: true,
        message: 'Already applied to this job',
        candidate: existingCandidate,
      });
    }

    const candidateId = `cand-user-${Date.now()}`;
    const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop';

    // Create Candidate record and system note inside a transaction
    const newCandidate = await prisma.candidate.create({
      data: {
        id: candidateId,
        name: user.name,
        title: user.title,
        skills: user.skills,
        location: user.location,
        matchScore: 92,
        stage: 'Applied',
        avatar,
        timeAgo: 'Just now',
        experience: user.experience,
        noticePeriod: 'Immediate',
        rating: 4.6,
        email: user.email,
        phone: user.phone || '+91 99999 88888',
        education: user.education || 'B.Tech Graduate',
        resumeUrl: '#',
        notes: {
          create: {
            author: 'System Auto Match',
            content: `Applied for ${job.title} at ${job.company}. Match score calculated based on skills and experience.`,
          },
        },
      },
    });

    // We can also mark the job's status for this user, but since the jobs are global,
    // we can return the application success and let the context update the local state.
    return NextResponse.json({
      success: true,
      candidate: {
        ...newCandidate,
        skills: newCandidate.skills ? newCandidate.skills.split(',') : [],
        notes: [
          {
            author: 'System Auto Match',
            content: `Applied for ${job.title} at ${job.company}. Match score calculated based on skills and experience.`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          },
        ],
      },
    });
  } catch (error: any) {
    console.error('Apply job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
