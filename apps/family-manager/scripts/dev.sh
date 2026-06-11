#!/usr/bin/env bash
set -e

echo "Starting local Supabase..."
supabase start

echo ""
echo "Supabase is running. Starting Next.js dev server..."
exec npx next dev
