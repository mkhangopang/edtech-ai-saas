# Test Script for AI Lesson Planning SaaS

This script will guide you through testing all features of the application.

## Prerequisites Check

1. [ ] Node.js installed (v18+)
2. [ ] Git installed
3. [ ] Supabase account
4. [ ] OpenAI API key
5. [ ] VS Code with integrated terminal

## Environment Setup

1. [ ] Create `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. [ ] Set up Supabase database:
   - Run `supabase-schema.sql` in Supabase SQL Editor
   - Run `supabase-tables.sql` in Supabase SQL Editor
   - Create `curricula` storage bucket

## Testing Steps

### 1. Start the Application
```bash
npm run dev
```
Open http://localhost:3000 in your browser

### 2. User Registration Test
- [ ] Click "Get Started"
- [ ] Fill registration form
- [ ] Verify email (if configured)
- [ ] Check dashboard loads correctly

### 3. PDF Upload Test
- [ ] Click "Choose PDF File"
- [ ] Select a curriculum PDF
- [ ] Verify upload success
- [ ] Confirm redirect to generate page

### 4. AI Generation Tests

#### Lesson Plan Generation
- [ ] Select "Lesson Plan" option
- [ ] Choose 4 weeks
- [ ] Click "Generate Lesson Plan"
- [ ] Verify content appears with SLO tags

#### MCQ Generation
- [ ] Select "MCQs" option
- [ ] Click "Generate MCQs"
- [ ] Verify 10 questions with answers

#### SRQ Generation
- [ ] Select "SRQs" option
- [ ] Click "Generate SRQs"
- [ ] Verify questions with model answers

#### ERQ Generation
- [ ] Select "ERQs" option
- [ ] Click "Generate ERQs"
- [ ] Verify extended questions with rubrics

### 5. Credit System Test
- [ ] Check initial credit balance
- [ ] Generate content (1 credit per generation)
- [ ] Verify credit deduction
- [ ] Test zero-credit behavior

### 6. Authentication Test
- [ ] Logout and login again
- [ ] Verify session persistence
- [ ] Check data integrity

## Success Criteria

All checkboxes above should be checked ✅

## Troubleshooting

If any step fails:
1. Check browser console for errors
2. Verify environment variables
3. Check Supabase database connections
4. Confirm OpenAI API key validity

## Completion

Once all tests pass, the application is ready for:
- [ ] Local development
- [ ] Production deployment
- [ ] User demonstrations
- [ ] Investor pitches