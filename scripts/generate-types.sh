#!/bin/bash

# Generate Supabase Types Script
# This script generates TypeScript types from the local Supabase database schema

echo "Generating Supabase TypeScript types..."

supabase gen types typescript --local > src/db/database.types.ts

echo "Types generated successfully!"