import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const activeJobs = await prisma.job.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    const pendingJobs = await prisma.job.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
    });

    // Format skills and requirements back into arrays for frontend compatibility
    const formatJob = (j: any) => ({
      ...j,
      skills: j.skills ? j.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      requirements: j.requirements ? j.requirements.split(';').map((s: string) => s.trim()).filter(Boolean) : [],
    });

    return NextResponse.json({
      jobs: activeJobs.map(formatJob),
      pendingJobs: pendingJobs.map(formatJob),
    });
  } catch (error: any) {
    console.error('Fetch jobs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const jobData = await request.json();
    const {
      title,
      company,
      location,
      salary,
      skills, // Array or comma-separated string
      logo,
      description,
      requirements, // Array or semicolon-separated string
      experienceRequired,
      type,
    } = jobData;

    if (!title || !company || !location || !salary) {
      return NextResponse.json(
        { error: 'Title, company, location, and salary are required' },
        { status: 400 }
      );
    }

    // Format fields
    const formattedSkills = Array.isArray(skills) ? skills.join(',') : (skills || '');
    const formattedRequirements = Array.isArray(requirements) ? requirements.join(';') : (requirements || '');
    
    // Auto-approve if user is admin
    const isApproved = session.user.role === 'admin';
    const jobId = `job-${Date.now()}`;

    const userCompany = session.user.companyName || company || 'Martin Connect Premium';
    const userCompanyId = session.user.companyId || 'company-employer-brand';

    let targetLogo = logo || 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=150&auto=format&fit=crop';
    if (userCompanyId) {
      const companyRecord = await prisma.company.findUnique({
        where: { id: userCompanyId },
      });
      if (companyRecord && companyRecord.logo) {
        targetLogo = companyRecord.logo;
      }
    }

    const newJob = await prisma.job.create({
      data: {
        id: jobId,
        title,
        company: userCompany,
        companyId: userCompanyId,
        location,
        salary,
        skills: formattedSkills,
        logo: targetLogo,
        status: 'Hiring',
        description: description || '',
        requirements: formattedRequirements,
        posted: 'Just now',
        experienceRequired: experienceRequired || '2-5 Years',
        type: type || 'Full-time',
        isApproved,
      },
    });

    return NextResponse.json({
      success: true,
      job: {
        ...newJob,
        skills: newJob.skills ? newJob.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        requirements: newJob.requirements ? newJob.requirements.split(';').map((s: string) => s.trim()).filter(Boolean) : [],
      },
    });
  } catch (error: any) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Moderation
export async function PUT(request: NextRequest) {
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

    if (!session || session.expiresAt < new Date() || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { jobId, approve } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    if (approve) {
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
          isApproved: true,
          posted: 'Approved recently',
        },
      });
      return NextResponse.json({ success: true, job: updatedJob });
    } else {
      await prisma.job.delete({
        where: { id: jobId },
      });
      return NextResponse.json({ success: true, message: 'Job rejected and deleted' });
    }
  } catch (error: any) {
    console.error('Job moderation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
