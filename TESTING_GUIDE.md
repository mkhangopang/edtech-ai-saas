# AI Lesson Planning SaaS - Quick Test Guide

## Current Live URL (Old Deployment):
https://edtech-ai-saas-f1xjlkj9z-muhammad-khan-s-projects-0b0b82e6.vercel.app

## New Deployment URL (Updating):
https://edtech-ai-saas-2745n4tuj-muhammad-khan-s-projects-0b0b82e6.vercel.app

## Steps to Test:

1. **Sign Up/Login**
   - Visit the URL
   - Create a new account or log in

2. **Upload Curriculum**
   - Click "Choose PDF File"
   - Upload any PDF curriculum (sample provided in repo)

3. **Generate Educational Content**
   - After upload, you should be redirected to /dashboard/generate
   - Select content type:
     * Lesson Plan (choose # of weeks)
     * MCQs (Multiple Choice Questions)
     * SRQs (Short Response Questions)
     * ERQs (Extended Response Questions)
   - Click "Generate [Content Type]"

4. **Verify Features**
   - AI-generated content should stream in real-time
   - SLO tags with Bloom's Taxonomy should appear
   - Credits should decrease by 1 per generation

## Troubleshooting:

If you don't see the generate button:
1. Make sure you've uploaded a PDF
2. Check that you're redirected to /dashboard/generate?docId=[ID]
3. Ensure environment variables are set in Vercel

## Environment Variables Required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY
- NEXT_PUBLIC_APP_URL
