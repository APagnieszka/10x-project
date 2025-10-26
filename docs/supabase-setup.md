# Supabase Configuration

This document describes how to configure and use Supabase in the 10x-project.

## Prerequisites

1. **Docker Desktop** - installed and running
2. **Supabase CLI** - installed via Homebrew: `brew install supabase/tap/supabase`

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
- `SUPABASE_URL` - Supabase API URL
- `SUPABASE_KEY` - anon key (public)

Example in Astro:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
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