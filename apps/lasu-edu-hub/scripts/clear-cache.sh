#!/bin/bash
# Clear Next.js and build caches
rm -rf .next
rm -rf .turbopack
rm -rf node_modules/.cache
rm -rf dist
echo "Cache cleared successfully"
