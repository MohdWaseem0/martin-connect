const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

function runCommand(command) {
  console.log(`Running: ${command}...`);
  try {
    const stdout = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`[SUCCESS]\n${stdout}`);
    return true;
  } catch (error) {
    console.error(`[FAILED] Command "${command}" failed.`);
    if (error.stdout) console.log(`Stdout:\n${error.stdout}`);
    if (error.stderr) console.error(`Stderr:\n${error.stderr}`);
    return false;
  }
}

async function validateDatabaseAccess() {
  console.log('====================================================');
  console.log('   POSTGRESQL PERMISSION & PRISMA VALIDATION        ');
  console.log('====================================================\n');

  console.log('Step 1: Checking Prisma Connection and Schema CREATE Privilege...');
  const prisma = new PrismaClient();
  
  try {
    // Check if we have CREATE privilege on schema
    const checkPriv = await prisma.$queryRawUnsafe(`
      SELECT 
        current_schema() as schema_name,
        has_schema_privilege(current_user, current_schema(), 'CREATE') as has_create_privilege;
    `);
    
    const schemaName = checkPriv[0].schema_name;
    const hasCreate = checkPriv[0].has_create_privilege;
    
    console.log(`Active Schema: "${schemaName}"`);
    console.log(`User has CREATE privilege on "${schemaName}": ${hasCreate ? 'YES' : 'NO'}`);
    
    if (!hasCreate) {
      console.error('\n[ERROR] Current user still does not have CREATE privilege on the schema.');
      console.error('Please run the scripts in db-repair.sql using "doadmin" user first.');
      process.exit(1);
    }

    // Attempt actual table creation, insert, select, and drop
    console.log('\nStep 2: Testing direct DDL and DML operations...');
    
    console.log('Creating temporary table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS _prisma_permission_check (
        id SERIAL PRIMARY KEY,
        test_val VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table created successfully.');

    console.log('Inserting test row...');
    await prisma.$executeRawUnsafe(`
      INSERT INTO _prisma_permission_check (test_val) VALUES ('validation_run');
    `);
    console.log('Row inserted successfully.');

    console.log('Reading test row...');
    const rows = await prisma.$queryRawUnsafe(`
      SELECT * FROM _prisma_permission_check;
    `);
    console.log('Read results:', rows);

    console.log('Dropping temporary table...');
    await prisma.$executeRawUnsafe(`
      DROP TABLE _prisma_permission_check;
    `);
    console.log('Table dropped successfully.');
    console.log('[DDL & DML VALIDATION PASSED]\n');

  } catch (error) {
    console.error('\n[DATABASE ACCESS TEST FAILED]');
    console.error('Error details:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  // Step 3: Run Prisma checks
  console.log('Step 3: Running Prisma schema validation...');
  const valSuccess = runCommand('npx prisma validate');
  if (!valSuccess) process.exit(1);

  console.log('Step 4: Generating Prisma client...');
  const genSuccess = runCommand('npx prisma generate');
  if (!genSuccess) process.exit(1);

  console.log('Step 5: Pushing Prisma schema to the database (prisma db push)...');
  const pushSuccess = runCommand('npx prisma db push');
  if (!pushSuccess) {
    console.error('\n[ERROR] Prisma db push failed.');
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('   VALIDATION COMPLETED: DATABASE IS PRODUCTION READY');
  console.log('====================================================');
  process.exit(0);
}

validateDatabaseAccess();
