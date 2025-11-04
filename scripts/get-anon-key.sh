#!/bin/bash

# Get Supabase Anon Key Script
# This script retrieves the Supabase anon key using 'supabase status -o env'

ANON_KEY=$(supabase status -o env 2>/dev/null | grep ANON_KEY | cut -d'=' -f2 | tr -d '"')

if [ -z "$ANON_KEY" ]; then
  echo "Error: Could not retrieve SUPABASE_ANON_KEY. Make sure Supabase is running." >&2
  exit 1
fi

echo "$ANON_KEY"