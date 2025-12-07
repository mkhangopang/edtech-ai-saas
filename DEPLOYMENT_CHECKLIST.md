# 📋 Vercel + Supabase Deployment Checklist

## ✅ 1. Supabase Settings

### 1.1. Project API Keys
- [x] NEXT_PUBLIC_SUPABASE_URL: Set in Vercel
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY: Set in Vercel
- [x] SUPABASE_SERVICE_ROLE_KEY: Set in Vercel (only for server-side)

### 1.2. Authentication Settings
- [x] Site URL: Updated to production URL
- [x] Redirect URLs: Updated to production URL
- [x] Auth Email Templates: Optional

### 1.3. OAuth Redirect URLs
- [x] Google OAuth: Added production callback URL

### 1.4. Storage / RLS Policies
- [x] curricula bucket exists
- [x] RLS policies configured

## ✅ 2. Vercel Settings

### 2.1. Environment Variables
- [x] NEXT_PUBLIC_SUPABASE_URL: Set
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY: Set
- [x] SUPABASE_SERVICE_ROLE_KEY: Set
- [x] OPENAI_API_KEY: Set
- [x] NEXT_PUBLIC_APP_URL: Set

### 2.2. GitHub Integration
- [x] Repo connected
- [x] Automatic deployments enabled

### 2.3. Build Settings
- [x] Framework Preset: Next.js
- [x] Install Command: npm install
- [x] Build Command: next build

### 2.4. Domains
- [x] Production URL: https://edtech-ai-saas-rf9in8pcs-muhammad-khan-s-projects-0b0b82e6.vercel.app
- [x] Custom domain (optional)

## ✅ 3. GitHub Repo Settings

### 3.1. Environment Variables Security
- [x] .gitignore contains .env*
- [x] No secrets committed to repo

### 3.2. GitHub → Vercel Connection
- [x] Correct repo installed
- [x] Vercel bot has permission
- [x] Webhooks enabled

## 🔧 Required Actions

### Completed Actions:
1. ✅ Updated Supabase Site URL to: https://edtech-ai-saas-rf9in8pcs-muhammad-khan-s-projects-0b0b82e6.vercel.app
2. ✅ Updated Supabase Redirect URLs to include production URLs
3. ✅ Added OAuth callback URL for Google authentication

### Optional Enhancements:
1. Set up custom domain
2. Customize Auth Email Templates
3. Enable branch protection
4. Set repo to private (recommended)