# 🧪 Testing the AI Lesson Planning SaaS Locally

## Prerequisites

1. **VS Code** installed
2. **Node.js** (v18 or higher) installed
3. **Git** installed
4. **Supabase Account** (free tier)
5. **OpenAI API Key**

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/mkhangopang/edtech-ai-saas.git
cd edtech-ai-saas

# Install dependencies
npm install
```

### 2. Environment Variables Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase (get from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (your API key)
OPENAI_API_KEY=your_openai_api_key

# App URL (for local development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL migrations to set up your Supabase database:

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-schema.sql` from this repository
3. Run `supabase-tables.sql` from this repository

### 4. Storage Setup

In Supabase Dashboard:
1. Go to Storage → Create Bucket
2. Name it `curricula`
3. Set it to Public

## Running the App Locally

### 1. Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### 2. Build for Production (Optional)

```bash
npm run build
npm start
```

## Testing Workflow

### Step 1: Sign Up/New User Flow

1. Visit http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create a new account
4. Verify you see the dashboard with:
   - Welcome message
   - Credit balance (should start with 10 free credits)
   - Upload section

### Step 2: PDF Upload Test

1. Click "Choose PDF File"
2. Upload any PDF (use our sample or any curriculum PDF)
3. Verify:
   - Upload success message
   - Redirect to `/dashboard/generate?docId=[ID]`
   - Document appears in "Recent Documents" list

### Step 3: AI Generation Tests

#### Test Lesson Plan Generation
1. Select "Lesson Plan" option
2. Choose 4 weeks (default)
3. Click "Generate Lesson Plan"
4. Verify:
   - Loading spinner appears
   - Content streams in real-time
   - Week-by-week breakdown
   - SLO tags with Bloom's Taxonomy
   - Credit balance decreases by 1

#### Test MCQ Generation
1. Select "MCQs" option
2. Click "Generate MCQs"
3. Verify:
   - 10 questions generated
   - 4 options each
   - Correct answers marked
   - Explanations provided
   - Bloom's Taxonomy levels tagged

#### Test SRQ Generation
1. Select "SRQs" option
2. Click "Generate SRQs"
3. Verify:
   - Short answer questions
   - Model answers provided
   - Scoring rubrics
   - SLO/Bloom's tagging

#### Test ERQ Generation
1. Select "ERQs" option
2. Click "Generate ERQs"
3. Verify:
   - Extended response questions
   - Detailed model responses
   - Comprehensive rubrics
   - SLO/Bloom's tagging

### Step 4: Credit System Test

1. Check initial credits (should be 10)
2. Generate content (1 credit per generation)
3. Verify credits decrease
4. When credits reach 0:
   - Generate button should be disabled
   - "Buy More Credits" button should appear

### Step 5: User Authentication Test

1. Logout and login again
2. Verify session persistence
3. Check that documents are still visible
4. Verify credit balance is maintained

## VS Code Debugging Tips

### 1. Use Built-in Terminal
- Ctrl+` to open terminal
- Run commands directly in VS Code

### 2. File Navigation
- Use Ctrl+P to quickly open files
- Navigate components: `app/dashboard/page.tsx`
- API routes: `app/api/generate/route.ts`

### 3. Debugging Tools
- Set breakpoints in TypeScript files
- Use Console.log for debugging
- Check Network tab in browser DevTools

### 4. Hot Reloading
- Changes automatically refresh in browser
- No need to restart server for most changes

## Common Issues and Solutions

### Issue 1: Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Issue 2: Environment Variables Not Loading
- Ensure `.env.local` is in root directory
- Restart development server
- Check for typos in variable names

### Issue 3: Supabase Connection Failed
- Verify Supabase URL and keys in `.env.local`
- Check Supabase project settings
- Ensure database tables exist

### Issue 4: AI Generation Not Working
- Verify OpenAI API key is valid
- Check credit balance
- Look at browser console for errors

## Testing Checklist

- [ ] User can sign up and log in
- [ ] PDF upload works (10MB limit)
- [ ] Redirect to generate page after upload
- [ ] Lesson plan generation with SLO tagging
- [ ] MCQ generation with Bloom's Taxonomy
- [ ] SRQ/ERQ generation with rubrics
- [ ] Credit system deducts correctly
- [ ] Copy to clipboard functionality
- [ ] Responsive design on mobile
- [ ] Error handling for invalid files
- [ ] Session persistence after refresh

## Performance Testing

1. **Load Time**: Page should load within 2 seconds
2. **AI Generation**: Should complete within 30 seconds
3. **Responsiveness**: UI should remain responsive during generation
4. **Mobile**: Test on different screen sizes

## Security Testing

1. **File Upload**: Only accepts PDF files
2. **Authentication**: Protected routes work correctly
3. **Data Privacy**: User data isolated
4. **API Keys**: Not exposed to frontend

This guide ensures comprehensive testing of all app features locally in VS Code!