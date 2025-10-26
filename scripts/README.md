# Scripts Directory

This directory contains automation scripts for common development tasks.

## Available Scripts

### start-supabase.sh
A shell script that starts the Supabase local development environment.

**Usage:**
```bash
./scripts/start-supabase.sh
```

**What it does:**
1. Starts Supabase services with `supabase start`
2. Checks status with `supabase status`

**Note:** Requires Supabase CLI to be installed.

### stop-supabase.sh
A shell script that properly stops the Supabase local development environment while preserving schema changes and data.

**Usage:**
```bash
./scripts/stop-supabase.sh
```

**What it does:**
1. Generates schema diff with `supabase db diff -f my_schema`
2. Dumps local data to `supabase/seed.sql`
3. Stops Supabase services without backup

**Note:** Requires Supabase CLI to be installed.

### get-anon-key.sh
A shell script that retrieves the Supabase anon key from the local development environment.

**Usage:**
```bash
./scripts/get-anon-key.sh
```

**What it does:**
1. Runs `supabase status -o env` to get environment variables
2. Extracts and displays the SUPABASE_ANON_KEY value

**Note:** Requires Supabase CLI to be installed and local Supabase to be running.

### generate-types.sh
A shell script that generates TypeScript types from the local Supabase database schema.

**Usage:**
```bash
./scripts/generate-types.sh
```

**What it does:**
1. Runs `supabase gen types typescript --local` to generate types
2. Saves the generated types to `src/db/database.types.ts`

**Note:** Requires Supabase CLI to be installed and local Supabase to be running.
```