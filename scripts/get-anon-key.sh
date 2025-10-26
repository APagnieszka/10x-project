#!/bin/bash

# Get Supabase Anon Key Script
# This script retrieves the Supabase anon key using 'supabase status -o env'

echo "Getting Supabase anon key..."

ANON_KEY=$(supabase status -o env | grep SUPABASE_ANON_KEY | cut -d'=' -f2)

echo "SUPABASE_ANON_KEY=$ANON_KEY"