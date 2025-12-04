# EdTech AI SaaS - Simple Debugger
Write-Host "=== EdTech AI SaaS Debugger ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Node.js and npm:" -ForegroundColor Yellow
node --version
npm --version
Write-Host ""

# Check package.json
Write-Host "2. Package.json:" -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   OK - package.json exists" -ForegroundColor Green
} else {
    Write-Host "   ERROR - package.json missing!" -ForegroundColor Red
}
Write-Host ""

# Check .env.local
Write-Host "3. Environment Variables:" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   OK - .env.local exists" -ForegroundColor Green
    $env = Get-Content ".env.local" -Raw
    if ($env -like "*https://*supabase.co*") {
        Write-Host "   OK - Supabase URL found" -ForegroundColor Green
    } else {
        Write-Host "   ERROR - Supabase URL missing!" -ForegroundColor Red
    }
} else {
    Write-Host "   ERROR - .env.local missing!" -ForegroundColor Red
}
Write-Host ""

# Check folders
Write-Host "4. Folder Structure:" -ForegroundColor Yellow
$folders = @("app", "components", "lib", "pages", "public")
foreach ($f in $folders) {
    if (Test-Path $f) {
        Write-Host "   OK - $f/" -ForegroundColor Green
    } else {
        Write-Host "   ERROR - $f/ missing!" -ForegroundColor Red
    }
}
Write-Host ""

# Check lib files
Write-Host "5. Library Files:" -ForegroundColor Yellow
$files = @("lib/supabase.ts", "lib/types.ts", "lib/credits.ts", "middleware.ts")
foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Host "   OK - $f" -ForegroundColor Green
    } else {
        Write-Host "   ERROR - $f missing!" -ForegroundColor Red
    }
}
Write-Host ""

# Check node_modules
Write-Host "6. Dependencies:" -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   OK - node_modules exists" -ForegroundColor Green
} else {
    Write-Host "   ERROR - node_modules missing! Run: npm install --legacy-peer-deps" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "If you see any RED errors above, fix them first."
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Fix any errors shown above"
Write-Host "2. Run: npm install --legacy-peer-deps"
Write-Host "3. Run: npm run dev"
Write-Host ""