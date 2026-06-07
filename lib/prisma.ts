import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Structured logging for queries in development
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  prisma.$on('query', (e: any) => {
    console.log(`[Database Query] ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
  });
}

// Graceful shutdown listeners to close connections cleanly on SIGTERM/SIGINT
const handleShutdown = async () => {
  console.log('Received shutdown signal. Disconnecting Prisma Client...');
  try {
    await prisma.$disconnect();
    console.log('Prisma Client disconnected successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during Prisma Client disconnection:', err);
    process.exit(1);
  }
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
