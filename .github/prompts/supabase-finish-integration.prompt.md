---
mode: agent

# Supabase Finish Integration

To complete the Supabase integration, follow these steps:

1. Obtain the Supabase URL and anon key using the appropriate command based on your CLI version.

2. Create or update the .env file with the following variables:
   - SUPABASE_URL: [URL from supabase status]
   - SUPABASE_KEY: [anon key from supabase status]

Important notes:
- From Supabase CLI version 2.48.x, use `supabase status -o env` to get the anon key.
- For earlier versions, you can use `supabase start` to view the configuration values.

Ensure the .env file is properly configured before running the application.
---