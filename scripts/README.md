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