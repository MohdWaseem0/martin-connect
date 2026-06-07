import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  _prismaShutdownRegistered?: boolean;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Guard against duplicate shutdown listeners (hot-reload in dev)
if (!globalForPrisma._prismaShutdownRegistered) {
  globalForPrisma._prismaShutdownRegistered = true;

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
}
