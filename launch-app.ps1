# Launch EdTech AI SaaS App Locally
# Save this as launch-app.ps1 and run it in PowerShell

Write-Host "🚀 Launching EdTech AI SaaS App..." -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Navigate to project directory
Set-Location "c:\Users\MS GopanG\edtech-ai-saas"

# Check if node_modules exists, if not install dependencies
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create a .env.local file with your environment variables:" -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" -ForegroundColor Gray
    Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" -ForegroundColor Gray
    Write-Host "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key" -ForegroundColor Gray
    Write-Host "OPENAI_API_KEY=your_openai_api_key" -ForegroundColor Gray
    Write-Host "NEXT_PUBLIC_APP_URL=http://localhost:3000" -ForegroundColor Gray
    Write-Host ""
}

# Clear Next.js cache
Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue

# Start the development server
Write-Host "⚡ Starting development server..." -ForegroundColor Green
Write-Host "The app will be available at http://localhost:3000 (or 3001 if 3000 is in use)" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "===================================" -ForegroundColor Green

npm run dev