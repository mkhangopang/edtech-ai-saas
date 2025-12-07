# Test Script for EdTech AI SaaS App

## Local Development Environment
- URL: http://localhost:3000
- Status: ✅ Running

## Production Environment (Vercel)
- URL: https://edtech-ai-saas-2gvb7lwoq-muhammad-khan-s-projects-0b0b82e6.vercel.app
- Status: ✅ Deployed

## How to Test Both Environments

### 1. Local Development Testing
1. Open your browser and navigate to http://localhost:3000
2. Sign up for a new account
3. Upload a PDF curriculum
4. Generate educational content:
   - Lesson Plans
   - MCQs
   - SRQs
   - ERQs
5. Verify credit system works correctly

### 2. Production Testing
1. Open your browser and navigate to https://edtech-ai-saas-rf9in8pcs-muhammad-khan-s-projects-0b0b82e6.vercel.app
2. Sign up for a new account (separate from local)
3. Upload a PDF curriculum
4. Generate educational content:
   - Lesson Plans
   - MCQs
   - SRQs
   - ERQs
5. Verify credit system works correctly

## Expected Results

Both environments should behave identically with:
- ✅ User authentication working
- ✅ PDF upload functionality
- ✅ Auto-redirect to generation page after upload
- ✅ AI content generation with SLO tagging
- ✅ Bloom's Taxonomy classification
- ✅ Credit system deduction
- ✅ Copy to clipboard functionality

## Troubleshooting

If you encounter issues:

1. **Local Environment Issues:**
   - Check that all environment variables are set in .env.local
   - Verify Supabase project settings
   - Ensure OpenAI API key is valid

2. **Production Environment Issues:**
   - Check Vercel environment variables
   - Verify Supabase authentication settings
   - Confirm Supabase redirect URLs include the Vercel domain

Both environments are now ready for comprehensive testing!