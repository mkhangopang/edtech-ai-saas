# EdTech AI SaaS - Simple Fix Script
Write-Host "=== Auto-Fix Tool ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean caches
Write-Host "Step 1: Cleaning caches..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "   Cleared .next" -ForegroundColor Green
}
Write-Host ""

# Step 2: Clean install
Write-Host "Step 2: Reinstalling dependencies..." -ForegroundColor Yellow
Write-Host "   This will take 1-2 minutes..." -ForegroundColor Gray
npm install --legacy-peer-deps
Write-Host ""

# Step 3: Check files
Write-Host "Step 3: Verifying files..." -ForegroundColor Yellow
if (Test-Path "lib/supabase.ts") { Write-Host "   OK - lib/supabase.ts" -ForegroundColor Green }
if (Test-Path "lib/types.ts") { Write-Host "   OK - lib/types.ts" -ForegroundColor Green }
if (Test-Path "lib/credits.ts") { Write-Host "   OK - lib/credits.ts" -ForegroundColor Green }
if (Test-Path "middleware.ts") { Write-Host "   OK - middleware.ts" -ForegroundColor Green }
Write-Host ""

# Step 4: Check env
Write-Host "Step 4: Checking environment..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   OK - .env.local exists" -ForegroundColor Green
} else {
    Write-Host "   ERROR - .env.local missing!" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host "Next: npm run dev" -ForegroundColor Cyan