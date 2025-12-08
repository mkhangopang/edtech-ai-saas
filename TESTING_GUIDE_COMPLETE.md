# 🧪 Testing Guide: Local vs Production Environments

## 🚀 Environments Now Running

### 🏠 Local Development
- **URL:** http://localhost:3000
- **Status:** ✅ Running and ready
- **Process:** npm run dev

### ☁️ Production (Vercel)
- **Primary URL:** https://edtech-ai-saas.vercel.app
- **Status:** ✅ Deployed and accessible

## 🔍 Testing Checklist

### 1. Authentication Flow
- [ ] Sign up for new account (both environments)
- [ ] Log in with existing credentials
- [ ] Google OAuth (if configured)
- [ ] Password reset flow

### 2. PDF Upload Functionality
- [ ] Upload curriculum PDF (10MB limit)
- [ ] Verify file appears in document list
- [ ] Check auto-redirect to generation page

### 3. AI Content Generation
- [ ] Generate Lesson Plans (select weeks 1-16)
- [ ] Generate MCQs (Multiple Choice Questions)
- [ ] Generate SRQs (Short Response Questions)
- [ ] Generate ERQs (Extended Response Questions)

### 4. Educational Features
- [ ] SLO auto-tagging verification
- [ ] Bloom's Taxonomy classification
- [ ] Copy to clipboard functionality

### 5. Credit System
- [ ] Verify starting balance (10 credits)
- [ ] Check credit deduction after generation
- [ ] Purchase credits flow (test with Stripe)

### 6. User Experience
- [ ] Responsive design on different devices
- [ ] Loading states and error messages
- [ ] Navigation between pages

## 📋 Detailed Testing Steps

### Local Development Testing (http://localhost:3000)
1. Open browser and navigate to http://localhost:3000
2. Create new account or log in
3. Upload a curriculum PDF
4. Verify redirect to generation page
5. Generate different content types
6. Check credit balance changes

### Production Testing (https://edtech-ai-saas.vercel.app)
1. Open browser and navigate to https://edtech-ai-saas.vercel.app
2. Create new account (separate from local)
3. Upload a curriculum PDF
4. Verify same functionality as local
5. Generate content and compare quality
6. Check responsive design

## ✅ Expected Results

Both environments should provide identical functionality:
- Fast PDF processing
- Accurate AI-generated content
- Proper SLO tagging with Bloom's Taxonomy
- Smooth credit system operation
- Intuitive user interface

## 🆘 Troubleshooting

### If Local Issues Occur:
- Check .env.local file for correct variables
- Verify Supabase project settings
- Ensure OpenAI API key is active

### If Production Issues Occur:
- Check Vercel environment variables in project settings
- Verify Supabase authentication URLs include your production domain
- Confirm OpenAI API key is correctly set in Vercel environment variables
- Check Supabase RLS policies for storage bucket access

## 🎯 Success Criteria

- [ ] Both environments accessible
- [ ] Authentication working
- [ ] PDF upload successful
- [ ] AI generation producing quality content
- [ ] Credit system functioning
- [ ] Responsive design working

Happy testing!