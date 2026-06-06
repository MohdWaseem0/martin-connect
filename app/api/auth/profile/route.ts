import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

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

    const updates = await request.json();
    const { name, title, location, experience, skills, phone, education } = updates;

    // Build update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (experience !== undefined) updateData.experience = experience;
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills) ? skills.join(',') : skills;
    }
    if (phone !== undefined) updateData.phone = phone;
    if (education !== undefined) updateData.education = education;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    const { passwordHash: _, ...userProfile } = updatedUser;
    return NextResponse.json({ success: true, user: userProfile });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
