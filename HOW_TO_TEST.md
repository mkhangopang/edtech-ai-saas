# How to Test the AI Lesson Planning SaaS

## Step-by-Step Testing Instructions

1. **Visit the Live App:**
   https://edtech-ai-saas-2745n4tuj-muhammad-khan-s-projects-0b0b82e6.vercel.app

2. **Sign Up or Log In:**
   Create a new account or use existing credentials

3. **Upload the Sample Curriculum:**
   - Navigate to your dashboard
   - Click "Choose PDF File"
   - Upload the SAMPLE_CURRICULUM.pdf file (instructions below)

4. **Generate Educational Content:**
   After upload, you'll be redirected to the generation page where you can:
   - Select "Lesson Plan" and choose 4 weeks
   - Select "MCQs" to generate multiple choice questions
   - Select "SRQs" for short response questions
   - Select "ERQs" for extended response questions

5. **Verify Features:**
   - AI content should stream in real-time
   - Look for SLO tags with Bloom's Taxonomy levels
   - Credits should decrease by 1 per generation

## Creating a Test PDF

Since GitHub doesn't support PDF uploads, here's how to create the test PDF:

1. Open the `SAMPLE_CURRICULUM.txt` file in this repository
2. Copy all the content
3. Paste it into a Google Doc or Word document
4. Format it nicely (optional)
5. Export/Download as PDF
6. Upload this PDF to test the AI generation

## What to Expect from Each Generation Type

### Lesson Plans:
- Week-by-week breakdown (1-16 weeks selectable)
- Learning objectives with SLO tagging
- Activities and teaching strategies
- Assessment methods
- Resources needed

### MCQs (Multiple Choice Questions):
- 10 curriculum-based questions
- 4 options each (A, B, C, D)
- Correct answers marked
- Explanations for each answer
- Bloom's Taxonomy level tagged

### SRQs (Short Response Questions):
- Short answer questions
- Model answers provided
- Scoring rubrics
- SLO and Bloom's Taxonomy tagging

### ERQs (Extended Response Questions):
- Long-form essay questions
- Detailed model responses
- Comprehensive scoring rubrics
- SLO and Bloom's Taxonomy tagging

## Troubleshooting

If you encounter any issues:

1. **No Generate Button Visible:**
   - Ensure you've uploaded a PDF
   - Check URL has ?docId=[ID] parameter
   - Refresh the page

2. **Generation Fails:**
   - Verify you have credits (1 credit per generation)
   - Check OpenAI API key is configured in Vercel
   - Ensure document was parsed correctly

3. **Blank Output:**
   - Wait a moment - AI generation can take 10-30 seconds
   - Check browser console for errors
   - Try regenerating

## Environment Variables Required in Vercel

Make sure these are set in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL` = your Vercel deployment URL
