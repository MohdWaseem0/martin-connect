const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { PrismaClient } = require('@prisma/client');

async function checkConnection() {
  console.log('Running startup database health check...');
  
  // Use the connection limit 1 for quick checkout during boot/build check
  const dbUrl = process.env.DATABASE_URL || '';
  const checkUrl = dbUrl.includes('connection_limit=') 
    ? dbUrl.replace(/connection_limit=\d+/, 'connection_limit=1') 
    : dbUrl;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: checkUrl,
      },
    },
  });

  try {
    const result = await prisma.$queryRawUnsafe('SELECT NOW();');
    console.log('[DATABASE HEALTH CHECK SUCCESSFUL]');
    console.log('PostgreSQL Server Time:', result[0].now);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[DATABASE HEALTH CHECK FAILED]');
    console.error('Could not connect to the PostgreSQL database.');
    console.error('Error details:', error.message || error);
    await prisma.$disconnect();
    process.exit(1); // Non-zero exit code fails deployment/boot
  }
}

checkConnection();
