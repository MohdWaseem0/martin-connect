-- ============================================================================
-- DIGITALOCEAN POSTGRESQL SCHEMA PERMISSION REPAIR SCRIPTS
-- ============================================================================
-- IMPORTANT: Run these commands logged in as the administrative user "doadmin"
-- and ensure you are connected to the target database "Martindevwaseem".
-- 
-- In psql, you can connect to the target database using:
-- \c Martindevwaseem
-- ============================================================================

--------------------------------------------------------------------------------
-- OPTION 1: GRANT EXPLICIT SCHEMA & DATABASE PRIVILEGES (Recommended)
-- Use this option to grant the user "Martin.dev.waseem" full privileges 
-- on the public schema and database while keeping doadmin as the owner.
--------------------------------------------------------------------------------

-- Connect to target database first
\c Martindevwaseem

-- 1. Grant database-level create privileges (allows creating schemas, extensions, etc.)
GRANT CREATE, CONNECT ON DATABASE "Martindevwaseem" TO "Martin.dev.waseem";

-- 2. Grant schema-level privileges on 'public'
GRANT USAGE, CREATE ON SCHEMA public TO "Martin.dev.waseem";
GRANT ALL PRIVILEGES ON SCHEMA public TO "Martin.dev.waseem";

-- 3. Grant schema-level privileges to all users (alternative for public schema)
GRANT ALL ON SCHEMA public TO public;

-- 4. Alter default privileges for future objects created in the public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "Martin.dev.waseem";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "Martin.dev.waseem";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "Martin.dev.waseem";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO "Martin.dev.waseem";

-- 5. Ensure privileges are applied to existing tables/sequences (if any exist)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "Martin.dev.waseem";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "Martin.dev.waseem";


--------------------------------------------------------------------------------
-- OPTION 2: CHANGE DATABASE AND SCHEMA OWNERSHIP (Complete Control)
-- Use this option to make "Martin.dev.waseem" the owner of the database 
-- and public schema. This gives the application user full administrator rights
-- within this specific database.
--------------------------------------------------------------------------------

-- Connect to target database first
\c Martindevwaseem

-- 1. Change ownership of the public schema
ALTER SCHEMA public OWNER TO "Martin.dev.waseem";

-- 2. Change ownership of the database
ALTER DATABASE "Martindevwaseem" OWNER TO "Martin.dev.waseem";


--------------------------------------------------------------------------------
-- OPTION 3: CREATE A DEDICATED SCHEMA (Alternative if public is locked)
-- Use this option if you want to bypass the public schema entirely.
-- Note: If you choose this option, you MUST update your DATABASE_URL in
-- .env and .env.local to append "?schema=app_schema" (e.g. schema=app_schema)
--------------------------------------------------------------------------------

-- Connect to target database first
\c Martindevwaseem

-- 1. Create a new custom schema
CREATE SCHEMA IF NOT EXISTS app_schema AUTHORIZATION "Martin.dev.waseem";

-- 2. Grant all privileges on it to the application user
GRANT ALL PRIVILEGES ON SCHEMA app_schema TO "Martin.dev.waseem";

-- 3. Configure default privileges inside this custom schema
ALTER DEFAULT PRIVILEGES IN SCHEMA app_schema GRANT ALL ON TABLES TO "Martin.dev.waseem";
ALTER DEFAULT PRIVILEGES IN SCHEMA app_schema GRANT ALL ON SEQUENCES TO "Martin.dev.waseem";
