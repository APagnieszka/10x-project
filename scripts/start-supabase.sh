#!/bin/bash

# Supabase Start Script
# This script starts the Supabase local development environment

echo "Starting Supabase services..."
supabase start

echo "Checking Supabase status..."
supabase status

echo "Supabase started successfully!"