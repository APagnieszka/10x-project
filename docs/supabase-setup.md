# Supabase Configuration

This document describes how to configure and use Supabase in the 10x-project.

## Prerequisites

1. **Docker Desktop** - installed and running
2. **Supabase CLI** - installed via Homebrew: `brew install supabase/tap/supabase`

## Connect to a hosted Supabase project (no local)

If you don't want to run Supabase locally, you can point the app directly at a hosted Supabase project.

Notes:

- This project reads `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_KEY` on both the client and server.
- If you already have a local `.env` with `http://localhost:54321`, you can either:
  - replace the values in `.env`, or
  - prefer `.env.local` (it has higher priority than `.env` in Astro/Vite).
- Use the **anon public key** (safe to expose to the browser). Do **not** use the service role key in this app.

1. Open Supabase Dashboard for your project.
2. Go to **Project Settings → API**.
3. Copy:
   - **Project URL** (looks like `https://<ref>.supabase.co`)
   - **anon public key**
4. Create your local env file from the template:

   ```bash
   cp .env.example .env.local
   ```

5. Fill in the variables in `.env.local`:
   - `PUBLIC_SUPABASE_URL` = Project URL
   - `PUBLIC_SUPABASE_KEY` = anon public key

6. (Recommended) Configure Auth URL settings in Supabase Dashboard:
   - Go to **Authentication → URL Configuration**
   - Set **Site URL** to your local dev URL (default): `http://localhost:4321`
   - Add **Redirect URLs** for local development, at minimum:
     - `http://localhost:4321/**`

   This helps with password reset links and any future OAuth flows.

That's it — you can run the app without `supabase start`.

## Initializing Supabase Project

To initialize Supabase in the project, run:

```bash
supabase init
```

This command will create a `supabase/` folder with configuration files:

- `config.toml` - main configuration
- `migrations/` - database migrations
- `seed.sql` - initial data

## Starting Local Supabase Environment

After initialization, start the local environment:

```bash
supabase start
```

This will start all Supabase services in Docker containers:

- PostgreSQL database
- Supabase API
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions
- Supabase Realtime

The environment will be available at:

- API: http://localhost:54321
- Dashboard: http://localhost:54323
- Database: postgresql://postgres:postgres@localhost:54322/postgres

## Stopping the Environment

To stop the local environment:

```bash
supabase stop
```

## Resetting the Environment

To reset all data and start fresh:

```bash
supabase stop
supabase start
```

## Database Migrations

Migrations are stored in the `supabase/migrations/` folder.

To create a new migration:

```bash
supabase migration new migration_name
```

To apply migrations:

```bash
supabase db push
```

## Seed Data

Initial data can be added to the `supabase/seed.sql` file.

## Database Connection in Code

In application code, use environment variables:

- `PUBLIC_SUPABASE_URL` - Supabase API URL
- `PUBLIC_SUPABASE_KEY` - anon public key

Example in Astro:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Useful Commands

- `supabase status` - check service status
- `supabase logs` - view logs
- `supabase db diff` - compare database schema with migrations
- `supabase gen types typescript` - generate TypeScript types for database

## Troubleshooting

- Make sure Docker is running
- Check ports - ensure 54321-54323 are available
- If you have container issues, try `supabase stop` and `supabase start`
