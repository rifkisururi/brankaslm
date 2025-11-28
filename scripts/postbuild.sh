#!/bin/bash
set -e

echo "🚀 Running post-build setup..."

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push --skip-generate --accept-data-loss || echo "⚠️  Schema push failed, might already exist"

# Run seeding
echo "🌱 Seeding database..."
npx tsx prisma/seed.ts || echo "⚠️  Seeding failed, might already be seeded"

echo "✅ Post-build setup completed!"
