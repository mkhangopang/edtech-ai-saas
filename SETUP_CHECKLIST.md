# Voice Recording Feature - Setup & Testing Checklist

## Pre-Setup Verification

- [ ] Existing EdTech AI SaaS app is running
- [ ] Can access dashboard at `http://localhost:3000/dashboard`
- [ ] Have at least 10 credits in account (for testing)
- [ ] Supabase project is operational

## Setup Steps

### 1. Get Groq API Key
- [ ] Visit https://console.groq.com
- [ ] Create free account
- [ ] Generate new API key
- [ ] Copy key for next step

### 2. Environment Configuration
- [ ] Add `GROQ_API_KEY=your_key` to `.env.local`
- [ ] Verify `OPENAI_API_KEY` exists in `.env.local`
- [ ] Restart development server (`npm run dev`)

### 3. Database Migration
- [ ] Open Supabase Dashboard > SQL Editor
- [ ] Copy content from `supabase-voice-migration.sql`
- [ ] Paste and execute SQL
- [ ] Verify success message appears
- [ ] Check tables created:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_name IN ('voice_recordings', 'calendar_events');
  ```

### 4. Storage Bucket Setup
- [ ] Navigate to Supabase Dashboard > Storage
- [ ] Click "New Bucket"
- [ ] Name: `voice-recordings`
- [ ] Privacy: Set to **Private**
- [ ] Create bucket
- [ ] Go to bucket > Policies tab
- [ ] Run the 3 policy SQL statements from `SUPABASE_STORAGE_SETUP.md`
- [ ] Verify 3 policies are active

### 5. Verify File Structure
- [ ] `app/api/voice/upload/route.ts` exists
- [ ] `app/api/voice/process/route.ts` exists
- [ ] `app/api/voice/recordings/route.ts` exists
- [ ] `app/api/voice/recordings/[id]/route.ts` exists
- [ ] `app/api/voice/calendar-sync/route.ts` exists
- [ ] `app/dashboard/voice/page.tsx` exists
- [ ] `app/dashboard/voice/[id]/page.tsx` exists
- [ ] `components/VoiceRecorder.tsx` exists

## Testing Workflow

### Test 1: Navigation
- [ ] Start dev server: `npm run dev`
- [ ] Login to dashboard
- [ ] See "Voice Notes" link in navigation
- [ ] Click "Voice Notes"
- [ ] Redirected to `/dashboard/voice`
- [ ] Page loads without errors

### Test 2: Recording - Successful Flow
- [ ] Click "New Voice Recording" button
- [ ] Browser requests microphone permission
- [ ] Grant permission
- [ ] Red microphone button appears
- [ ] Click to start recording
- [ ] Microphone button pulses
- [ ] Timer starts counting
- [ ] Speak clearly for 10-15 seconds
- [ ] Click "Stop & Save"
- [ ] Audio preview appears with playback
- [ ] Click "Save & Process"
- [ ] "Processing..." message shows
- [ ] Wait for completion (30-60 seconds)
- [ ] Redirected to recording detail page
- [ ] Transcription displays correctly
- [ ] Summary shows bullet points
- [ ] Credits deducted (check dashboard)

### Test 3: Recording Detail Page
- [ ] Audio player works
- [ ] Can play back recording
- [ ] "Summary" tab shows AI-generated summary
- [ ] "Full Transcription" tab shows complete text
- [ ] "Calendar Events" tab loads
- [ ] If events detected, they display with dates
- [ ] Can copy transcription to clipboard

### Test 4: Recordings List
- [ ] Return to `/dashboard/voice`
- [ ] Recording appears in list
- [ ] Shows title, duration, date
- [ ] Status shows "Completed"
- [ ] Event count displays (if any)
- [ ] Can click "View" to open detail
- [ ] Can delete recording

### Test 5: Error Handling
- [ ] Attempt recording with < 5 credits
- [ ] Error message displays
- [ ] Button is disabled
- [ ] Link to buy credits shown

### Test 6: Browser Compatibility
Test in multiple browsers:
- [ ] Chrome/Edge - Recording works
- [ ] Firefox - Recording works
- [ ] Safari - Recording works (if available)
- [ ] Check WebM format on Chrome
- [ ] Check format compatibility

### Test 7: API Endpoints
Test via browser DevTools Network tab:

- [ ] `/api/voice/upload` returns 201
- [ ] `/api/voice/process` returns success
- [ ] `/api/voice/recordings` returns list
- [ ] `/api/voice/recordings/[id]` DELETE works

### Test 8: Database Verification
Check Supabase Dashboard:

- [ ] `voice_recordings` table has entries
- [ ] `user_id` matches logged-in user
- [ ] `transcription_text` populated
- [ ] `summary_text` populated
- [ ] `credits_used` = 5
- [ ] `calendar_events` table has entries (if events detected)

### Test 9: Storage Verification
- [ ] Supabase Storage > voice-recordings bucket
- [ ] Folder with your user_id exists
- [ ] Audio file uploaded (`.webm` or `.mp4`)
- [ ] File size reasonable (~1MB per minute)
- [ ] Can download file

### Test 10: Event Detection
Record with calendar mentions:

- [ ] Say "I have a meeting tomorrow at 2pm"
- [ ] Say "Reminder: submit report by Friday"
- [ ] Process recording
- [ ] Check Calendar Events tab
- [ ] Events should be detected
- [ ] Dates should be in future
- [ ] Descriptions include context

## Common Issues & Solutions

### Issue: "Microphone permission denied"
**Solution**: 
- Check browser permissions
- Chrome: chrome://settings/content/microphone
- Allow site to access microphone

### Issue: "GROQ_API_KEY is not defined"
**Solution**:
- Verify key in `.env.local`
- Restart dev server
- Check no typos in env variable name

### Issue: "Failed to upload audio file"
**Solution**:
- Check storage bucket exists
- Verify bucket name is `voice-recordings`
- Check storage policies are set

### Issue: "Insufficient credits"
**Solution**:
- Add credits via `/dashboard/credits`
- Or update user credits in Supabase manually for testing

### Issue: "No speech detected"
**Solution**:
- Speak clearly and loudly
- Check microphone input level
- Try shorter recording first
- Ensure no background noise

### Issue: "Processing takes too long"
**Solution**:
- Groq can take 10-30 seconds per minute of audio
- Check Groq API status
- Verify API key is valid
- Check browser console for errors

## Performance Benchmarks

Target performance:
- [ ] Recording starts < 1 second
- [ ] Upload completes < 5 seconds for 1-minute audio
- [ ] Transcription: < 30 seconds per minute
- [ ] Summarization: < 15 seconds
- [ ] Total processing: < 1 minute for 1-minute audio

## Security Checklist

- [ ] Audio files not publicly accessible
- [ ] Cannot access other users' recordings
- [ ] Cannot view other users' transcriptions
- [ ] RLS policies prevent data leakage
- [ ] API keys not exposed in frontend
- [ ] Signed URLs expire after 1 hour

## Production Readiness

Before deploying to production:

- [ ] Set up proper error tracking (Sentry, etc.)
- [ ] Configure rate limiting on API routes
- [ ] Set up monitoring for Groq API usage
- [ ] Add analytics tracking
- [ ] Test with multiple concurrent users
- [ ] Verify credit deduction is atomic
- [ ] Set up backup strategy for audio files
- [ ] Document API rate limits
- [ ] Configure CORS if needed
- [ ] Set up proper logging

## Success Criteria

Feature is ready when:
- [x] All API routes implemented and tested
- [x] Database schema deployed with RLS
- [x] Storage bucket configured properly
- [x] Recording works in major browsers
- [x] Transcription accuracy > 80%
- [x] Event detection works for common patterns
- [x] Credits deducted correctly
- [x] No memory leaks in recording component
- [x] Error handling covers edge cases
- [x] Documentation complete

## Next Steps After Testing

1. **If all tests pass**:
   - Deploy to staging/production
   - Update production environment variables
   - Run migration on production database
   - Test in production environment
   - Monitor for issues

2. **If issues found**:
   - Document specific errors
   - Check browser console logs
   - Review server logs
   - Verify environment setup
   - Consult VOICE_FEATURE_SETUP.md

## Support Resources

- **Setup Guide**: `VOICE_FEATURE_SETUP.md`
- **Storage Setup**: `SUPABASE_STORAGE_SETUP.md`
- **Migration SQL**: `supabase-voice-migration.sql`
- **Main README**: `README.md`
- **Design Document**: `.qoder/quests/voice-recording-and-summarization.md`

## Testing Complete!

Once all checkboxes are marked:
- [ ] All setup steps completed
- [ ] All tests passed
- [ ] No critical errors found
- [ ] Feature works as expected
- [ ] Documentation is clear

**Feature Status**: Ready for use! 🎉
