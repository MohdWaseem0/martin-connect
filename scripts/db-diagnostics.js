const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('====================================================');
  console.log('   POSTGRESQL DATABASE DIAGNOSTIC REPORT            ');
  console.log('====================================================\n');

  console.log('Connecting using DATABASE_URL environment variable...');
  
  const prisma = new PrismaClient({
    log: []
  });

  try {
    // 1. Current Session Context
    const sessionInfo = await prisma.$queryRawUnsafe(`
      SELECT 
        current_user as "currentUser", 
        session_user as "sessionUser", 
        current_database() as "currentDatabase", 
        current_schema() as "currentSchema",
        version() as "postgresVersion";
    `);
    console.log('--- SESSION INFORMATION ---');
    console.table(sessionInfo);

    // 2. Database Ownership
    const dbOwnership = await prisma.$queryRawUnsafe(`
      SELECT 
        d.datname as "databaseName", 
        pg_catalog.pg_get_userbyid(d.datdba) as "ownerName" 
      FROM pg_database d 
      WHERE d.datname = current_database();
    `);
    console.log('\n--- DATABASE OWNERSHIP ---');
    console.table(dbOwnership);

    // 3. Schema Ownership
    const schemaOwnership = await prisma.$queryRawUnsafe(`
      SELECT 
        nspname as "schemaName", 
        pg_catalog.pg_get_userbyid(nspowner) as "ownerName"
      FROM pg_namespace 
      WHERE nspname = 'public';
    `);
    console.log('\n--- SCHEMA OWNERSHIP (public) ---');
    console.table(schemaOwnership);

    // 4. Current User Privileges
    const userPrivileges = await prisma.$queryRawUnsafe(`
      SELECT 
        has_database_privilege(current_user, current_database(), 'CONNECT') as "hasConnectOnDB",
        has_database_privilege(current_user, current_database(), 'CREATE') as "hasCreateOnDB",
        has_schema_privilege(current_user, 'public', 'USAGE') as "hasUsageOnPublic",
        has_schema_privilege(current_user, 'public', 'CREATE') as "hasCreateOnPublic";
    `);
    console.log('\n--- CURRENT USER PRIVILEGES ---');
    console.table(userPrivileges);

    // 5. Role Memberships & Attributes
    const roleMemberships = await prisma.$queryRawUnsafe(`
      SELECT 
        r.rolname as "roleName", 
        r.rolsuper as "isSuperUser", 
        r.rolcreaterole as "canCreateRoles", 
        r.rolcreatedb as "canCreateDB", 
        r.rolcanlogin as "canLogin",
        ARRAY(
          SELECT b.rolname 
          FROM pg_catalog.pg_auth_members m 
          JOIN pg_catalog.pg_roles b ON (m.roleid = b.oid) 
          WHERE m.member = r.oid
        ) as "memberOf"
      FROM pg_catalog.pg_roles r 
      WHERE r.rolname = current_user;
    `);
    console.log('\n--- ROLE MEMBERSHIPS & ATTRIBUTES ---');
    console.table(roleMemberships);

    // 6. Default Privileges
    const defaultPrivs = await prisma.$queryRawUnsafe(`
      SELECT 
        defaclrole::regrole::text as "defRole", 
        defaclnamespace::regnamespace::text as "schemaName", 
        CASE defaclobjtype 
          WHEN 'r' THEN 'table/view' 
          WHEN 'S' THEN 'sequence' 
          WHEN 'f' THEN 'function' 
          WHEN 'T' THEN 'type' 
          ELSE defaclobjtype 
        END as "objectType", 
        defaclacl as "defaultPrivileges" 
      FROM pg_default_acl;
    `);
    console.log('\n--- DEFAULT PRIVILEGES IN THE CLUSTER ---');
    if (defaultPrivs.length > 0) {
      console.table(defaultPrivs);
    } else {
      console.log('No custom default privileges configured.');
    }

    // 7. Schema ACLs
    const schemaAcl = await prisma.$queryRawUnsafe(`
      SELECT 
        nspname as "schemaName", 
        nspacl::text as "acl" 
      FROM pg_namespace 
      WHERE nspname = 'public';
    `);
    console.log('\n--- SCHEMA Access Control Lists (ACLs) ---');
    console.log('Schema:', schemaAcl[0].schemaName);
    console.log('ACL (Raw):', schemaAcl[0].acl);

    console.log('\n====================================================');
    console.log('          DIAGNOSTIC REPORT COMPLETED               ');
    console.log('====================================================');

  } catch (error) {
    console.error('\n[DIAGNOSTICS RUN ERROR]', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
