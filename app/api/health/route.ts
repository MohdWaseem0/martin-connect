import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Execute SELECT NOW() as a raw check
    const result: any = await prisma.$queryRawUnsafe('SELECT NOW();');
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbTime: result[0]?.now || null,
      environment: process.env.NODE_ENV,
    });
  } catch (error: any) {
    console.error('[Health Check API Error]:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message || 'Database connection error',
      },
      { status: 500 }
    );
  }
}
