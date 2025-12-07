# PowerShell Script to Launch EdTech AI SaaS App Locally

## Prerequisites Check
# Ensure you have:
# 1. Node.js (v18 or higher) installed
# 2. Git installed
# 3. VS Code installed
# 4. Environment variables configured in .env.local

## Step-by-Step Launch Commands

# 1. Navigate to project directory
cd "c:\Users\MS GopanG\edtech-ai-saas"

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server
npm run dev

# The app will be available at: http://localhost:3000 (or 3001 if 3000 is in use)

## Alternative: Open in VS Code and Run from Integrated Terminal

# 1. Open project in VS Code
code "c:\Users\MS GopanG\edtech-ai-saas"

# 2. In VS Code:
#    - Press Ctrl+` to open integrated terminal
#    - Run: npm run dev
#    - The app will launch and show the local URL

## Environment Variables Setup (.env.local)
# Create a .env.local file in the project root with:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# OPENAI_API_KEY=your_openai_api_key
# NEXT_PUBLIC_APP_URL=http://localhost:3000

## Troubleshooting Commands

# Check if port 3000 is in use
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# Kill process using port 3000 (if needed)
# Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Clear Next.js cache
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue

# Reinstall dependencies
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
npm install

# Check build
npm run build

# Run production build locally
npm start