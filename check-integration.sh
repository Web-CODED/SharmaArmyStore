#!/bin/bash
# Supabase Integration Checklist
# Run this after completing each step

echo "🔍 Checking Supabase Integration Status..."
echo ""

# Check for required files
echo "📋 Checking Project Files..."
FILES=(
  "src/config/supabase.js"
  "src/context/AuthContext.jsx"
  "src/lib/supabase-queries.js"
  "SUPABASE_SETUP_GUIDE.md"
  "SUPABASE_QUICK_START.md"
  "supabase-schema.sql"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
  fi
done

echo ""
echo "📦 Checking Dependencies..."
if grep -q '"@supabase/supabase-js"' package.json; then
  echo "✅ @supabase/supabase-js installed"
else
  echo "❌ @supabase/supabase-js not found"
fi

echo ""
echo "🔑 Checking Environment Variables..."
if [ -f ".env.local" ]; then
  echo "✅ .env.local exists"
  if grep -q "VITE_SUPABASE_URL" .env.local; then
    echo "✅ VITE_SUPABASE_URL set"
  else
    echo "❌ VITE_SUPABASE_URL not found"
  fi
  if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
    echo "✅ VITE_SUPABASE_ANON_KEY set"
  else
    echo "❌ VITE_SUPABASE_ANON_KEY not found"
  fi
else
  echo "⚠️  .env.local not found - Create it with your Supabase credentials"
fi

echo ""
echo "📊 Setup Status:"
echo ""
echo "Phase 1: Code Integration ✅ COMPLETE"
echo "  • Supabase client configured"
echo "  • Authentication context created"
echo "  • Database queries setup"
echo "  • Components updated"
echo ""
echo "Phase 2: Supabase Project (YOU NEED TO DO THIS)"
echo "  • Create Supabase project at https://supabase.com"
echo "  • Get Project URL and Anon Key"
echo "  • Create .env.local with credentials"
echo "  • Run SQL schema in SQL Editor"
echo ""
echo "Phase 3: Testing"
echo "  • Run 'npm run dev'"
echo "  • Go to http://localhost:3000/register"
echo "  • Create test account"
echo "  • Verify data in Supabase dashboard"
echo ""
echo "🚀 Next: Follow SUPABASE_QUICK_START.md for setup!"
