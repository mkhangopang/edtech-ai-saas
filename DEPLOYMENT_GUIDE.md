# 🚀 Complete Deployment Guide for EdTech AI SaaS

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Application URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup
Run the SQL migrations in Supabase:
1. `supabase-schema.sql`
2. `supabase-tables.sql`

### 3. Storage Setup
Create a storage bucket named `curricula` in Supabase Storage.

## ☁️ Vercel Deployment

### 1. Connect to GitHub
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Select the `edtech-ai-saas` repository

### 2. Configure Project Settings
During import, Vercel should auto-detect Next.js settings:
- Framework Preset: Next.js
- Root Directory: ./
- Build Command: `next build`
- Output Directory: .next

### 3. Add Environment Variables
In Vercel Project → Settings → Environment Variables, add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## 🔧 Post-Deployment Configuration

### 1. Supabase Authentication Settings
In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://your-vercel-url.vercel.app
```

**Redirect URLs:**
```
https://your-vercel-url.vercel.app/*
```

### 2. OAuth Callback URLs
If using Google authentication, add:
```
https://your-vercel-url.vercel.app/auth/callback
```

### 3. Storage RLS Policies
Ensure your `curricula` bucket has appropriate RLS policies:

```sql
-- Enable read access for all users on public files
CREATE POLICY "Public files are accessible by everyone."
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'curricula');

-- Enable insert access for authenticated users
CREATE POLICY "Authenticated users can upload files."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'curricula' AND auth.uid() = owner);

-- Enable update access for owners
CREATE POLICY "Owners can update their own files."
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'curricula' AND auth.uid() = owner);

-- Enable delete access for owners
CREATE POLICY "Owners can delete their own files."
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'curricula' AND auth.uid() = owner);
```

## 🧪 Testing Your Deployment

### 1. Basic Functionality
1. Visit your deployed URL
2. Sign up for a new account
3. Upload a PDF curriculum
4. Generate educational content (lesson plans, MCQs, etc.)

### 2. Authentication Flow
1. Log out and log back in
2. Verify session persistence
3. Test OAuth if configured

### 3. Credit System
1. Check initial credit balance (should be 10)
2. Generate content and verify credit deduction
3. Test credit replenishment

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use Vercel's environment variable management
- Rotate API keys periodically

### 2. Database Security
- Regularly review RLS policies
- Monitor database access logs
- Use strong passwords for Supabase

### 3. Application Security
- Keep dependencies updated
- Monitor for vulnerabilities
- Implement rate limiting for API endpoints

## 🆘 Troubleshooting Common Issues

### 1. Authentication Failures
- Verify Supabase URL Configuration settings
- Check that Redirect URLs include your domain
- Ensure environment variables are correctly set

### 2. PDF Upload Issues
- Check file size limits (10MB max)
- Verify storage bucket exists and permissions
- Confirm Supabase Storage RLS policies

### 3. AI Generation Failures
- Verify OpenAI API key is valid
- Check credit balance
- Review API rate limits

### 4. Build Errors
- Clear Vercel build cache
- Check for TypeScript/JavaScript errors
- Verify all dependencies are installed

## 📈 Monitoring and Maintenance

### 1. Performance Monitoring
- Use Vercel Analytics
- Monitor API response times
- Track user engagement metrics

### 2. Error Tracking
- Implement error logging
- Monitor Vercel deployment logs
- Set up alerts for critical failures

### 3. Updates and Maintenance
- Regularly update dependencies
- Test new versions in staging
- Backup database regularly

## 🎯 Success Metrics

After deployment, monitor:
1. Successful user registrations
2. PDF uploads and processing
3. AI content generation requests
4. Credit system utilization
5. User retention and engagement

Your EdTech AI SaaS app should now be successfully deployed and ready for use!