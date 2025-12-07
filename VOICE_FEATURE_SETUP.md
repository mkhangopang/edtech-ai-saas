# Voice Recording Feature - Setup Guide

## Overview

The Voice Recording feature allows users to:
- Record voice notes directly in the browser
- Get AI transcriptions using Groq Whisper (free tier)
- Generate AI summaries with OpenAI
- Extract calendar events automatically from speech
- Manage recordings with playback and transcription views

## Prerequisites

Before setting up the voice recording feature, ensure you have:
1. Completed the main EdTech AI SaaS setup (see README.md)
2. Supabase project set up and running
3. OpenAI API key (already required for existing features)
4. Groq API key (new requirement - free tier available)

## Step-by-Step Setup

### 1. Get Groq API Key

1. Visit https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it for environment variables)

**Groq Free Tier:**
- Generous free tier with high audio transcription limits
- Uses OpenAI's Whisper model (whisper-large-v3)
- Fast processing times
- No credit card required for free tier

### 2. Database Migration

Run the database migration to create required tables:

1. Open your Supabase Dashboard
2. Navigate to SQL Editor
3. Open the file `supabase-voice-migration.sql`
4. Copy and paste the entire SQL script
5. Click "Run" to execute

This will create:
- `voice_recordings` table
- `calendar_events` table
- Row Level Security (RLS) policies
- Database indexes
- `deduct_voice_credits()` function

**Verify Migration:**
```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('voice_recordings', 'calendar_events');

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('voice_recordings', 'calendar_events');
```

### 3. Supabase Storage Setup

Create the voice-recordings storage bucket:

1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Bucket name: `voice-recordings`
4. Set to **Private** (not public)
5. Click "Create Bucket"

**Configure Storage Policies:**

See `SUPABASE_STORAGE_SETUP.md` for detailed policy setup instructions.

Quick setup via SQL:

```sql
-- Policy 1: Allow users to upload their own files
CREATE POLICY "Users can upload their own voice recordings"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'voice-recordings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow users to read their own files
CREATE POLICY "Users can read their own voice recordings"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'voice-recordings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Allow users to delete their own files
CREATE POLICY "Users can delete their own voice recordings"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'voice-recordings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 4. Environment Variables

Add the following to your `.env.local` file:

```env
# Groq API for voice transcription
GROQ_API_KEY=your_groq_api_key_here
```

Your existing `.env.local` should already have:
- `OPENAI_API_KEY` (for summarization)
- Supabase credentials
- Stripe credentials

**Example `.env.local`:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (existing)
OPENAI_API_KEY=sk-...

# Groq (new for voice)
GROQ_API_KEY=gsk_...

# Stripe (existing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Install Dependencies

No additional dependencies needed! The voice recording feature uses:
- Existing `openai` package (for Groq SDK compatibility)
- Browser MediaRecorder API (built-in)
- Existing Supabase packages

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000/dashboard/voice to test the feature

## Feature Usage

### Recording Workflow

1. **Navigate to Voice Notes**
   - From dashboard, click "Voice Notes" in navigation
   - Or visit `/dashboard/voice`

2. **Create Recording**
   - Click "New Voice Recording" button
   - Allow microphone permissions when prompted
   - Click red microphone button to start recording
   - Pause/Resume as needed
   - Click "Stop & Save" when done

3. **Processing**
   - Audio uploads to Supabase Storage
   - Groq Whisper transcribes the audio
   - OpenAI generates summary and extracts events
   - 5 credits are deducted after successful processing

4. **View Results**
   - View AI-generated summary
   - Read full transcription
   - See detected calendar events

### Credit System

- **Cost per recording:** 5 credits
- **Minimum credits required:** 5 credits
- **Free tier:** Users start with 10 credits (2 free recordings)
- **Failed processing:** No credits deducted
- **Re-processing:** 2 credits (not yet implemented)

### Supported Audio Formats

The browser MediaRecorder API produces:
- **WebM** (Chrome, Firefox, Edge)
- **MP4** (Safari)
- **Max file size:** 50 MB
- **Max duration:** 2 hours (recommended)

## Browser Compatibility

### Fully Supported:
- ✅ Chrome 49+
- ✅ Firefox 25+
- ✅ Edge 79+
- ✅ Safari 14.1+
- ✅ Opera 36+

### Not Supported:
- ❌ Internet Explorer (any version)
- ❌ Older mobile browsers

**Feature Detection:**
The app automatically detects if the browser supports recording and shows appropriate messages.

## Troubleshooting

### Common Issues

**1. Microphone Permission Denied**
- **Problem:** User denies microphone access
- **Solution:** User must manually enable in browser settings
- **Chrome:** Settings → Privacy & Security → Site Settings → Microphone
- **Firefox:** Page Info → Permissions → Use Microphone

**2. GROQ_API_KEY Not Set**
- **Error:** "GROQ_API_KEY is not defined"
- **Solution:** Add `GROQ_API_KEY=your_key` to `.env.local`
- **Restart:** Restart dev server after adding env variable

**3. Upload Fails - File Too Large**
- **Problem:** Audio file exceeds 50MB
- **Solution:** Record shorter segments
- **Tip:** ~1 MB per minute at 128kbps

**4. Transcription Returns Empty**
- **Problem:** No speech detected in recording
- **Solution:** Ensure audio is clear and speech is audible
- **No Charge:** Credits not deducted for empty transcriptions

**5. Storage Policy Error**
- **Error:** "new row violates row-level security policy"
- **Solution:** Verify storage policies are set up correctly
- **Check:** See SUPABASE_STORAGE_SETUP.md

**6. Credits Not Deducted**
- **Problem:** RPC function error
- **Solution:** Verify `deduct_voice_credits` function exists
- **Check:** Run migration SQL again if needed

### Debug Mode

Enable detailed logging in API routes:

```typescript
// In route.ts files, console.error statements are already included
// Check browser console and terminal for detailed errors
```

### Testing Groq API Connection

Create a test script:

```javascript
// test-groq.js
const { OpenAI } = require('openai');

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});

async function test() {
  const models = await groq.models.list();
  console.log('Available models:', models.data.map(m => m.id));
}

test();
```

Run: `node test-groq.js`

## API Endpoints

### POST /api/voice/upload
- **Purpose:** Upload audio file
- **Auth:** Required
- **Body:** multipart/form-data with audio blob
- **Response:** `{ recording_id, file_path, status }`

### POST /api/voice/process
- **Purpose:** Transcribe and summarize
- **Auth:** Required
- **Body:** `{ recording_id }`
- **Response:** `{ transcription, summary, detected_events, credits_used }`

### GET /api/voice/recordings
- **Purpose:** List user recordings
- **Auth:** Required
- **Query Params:** page, limit, status, sort
- **Response:** `{ recordings[], total, page, pages }`

### DELETE /api/voice/recordings/[id]
- **Purpose:** Delete recording
- **Auth:** Required
- **Response:** `{ success, message }`

### POST /api/voice/calendar-sync
- **Purpose:** Sync events to calendar (placeholder)
- **Auth:** Required
- **Body:** `{ recording_id, event_ids[] }`
- **Note:** Full Google Calendar OAuth not yet implemented

## Performance Optimization

### Recommended Settings:
- **Bitrate:** 128 kbps (automatic in MediaRecorder)
- **File Size:** ~1 MB per minute
- **Processing Time:** 
  - Transcription: 10-30 seconds per minute of audio
  - Summarization: 5-15 seconds

### Browser Performance:
- Recording uses minimal CPU
- Audio stored in memory until stopped
- Upload via chunks for large files (not yet implemented)

## Security Considerations

### Data Privacy:
- All audio files stored in private Supabase bucket
- Row-level security enforces user isolation
- Signed URLs expire after 1 hour
- Transcriptions encrypted at rest

### API Keys:
- Never expose GROQ_API_KEY or OPENAI_API_KEY to frontend
- All AI processing happens server-side
- Rate limiting recommended in production

## Future Enhancements

Planned features (not yet implemented):
- [ ] Full Google Calendar OAuth integration
- [ ] Speaker diarization
- [ ] Timestamped transcriptions
- [ ] Multi-language support
- [ ] Export to PDF/Word
- [ ] Collaborative sharing
- [ ] Real-time transcription

## Support

For issues or questions:
1. Check this setup guide
2. Review `SUPABASE_STORAGE_SETUP.md`
3. Check browser console for errors
4. Verify all environment variables are set
5. Ensure database migration completed successfully

## Credits

Voice recording powered by:
- **Groq Whisper** - Speech-to-text transcription
- **OpenAI GPT-4o-mini** - Summarization and event extraction
- **Browser MediaRecorder API** - Audio capture
- **Supabase** - Storage and database
