#!/bin/bash

# Supabase Stop Script
# This script properly stops the Supabase local development environment
# while preserving schema changes and data

echo "Generating schema diff..."
supabase db diff -f my_schema

echo "Dumping local data..."
supabase db dump --local --data-only > supabase/seed.sql

echo "Stopping Supabase services..."
supabase stop --no-backup

echo "Supabase stopped successfully!"