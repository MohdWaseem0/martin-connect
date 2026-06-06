import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const verifiedCompanies = await prisma.company.findMany({
      where: { isApproved: true },
      orderBy: { name: 'asc' },
    });

    const pendingCompanies = await prisma.company.findMany({
      where: { isApproved: false },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      companies: verifiedCompanies,
      pendingCompanies,
    });
  } catch (error: any) {
    console.error('Fetch companies error:', error);
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

    const { companyId, approve, action } = await request.json();

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    if (action === 'verify') {
      const updated = await prisma.company.update({
        where: { id: companyId },
        data: {
          verified: true,
          isApproved: true,
        },
      });
      return NextResponse.json({ success: true, company: updated });
    } else if (action === 'reject' || approve === false) {
      await prisma.company.delete({
        where: { id: companyId },
      });
      return NextResponse.json({ success: true, message: 'Company rejected and deleted' });
    } else {
      // Approve company verification
      const updated = await prisma.company.update({
        where: { id: companyId },
        data: {
          isApproved: true,
          verified: true,
        },
      });
      return NextResponse.json({ success: true, company: updated });
    }
  } catch (error: any) {
    console.error('Company verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
