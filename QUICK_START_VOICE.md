# Voice Recording Feature - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Groq API Key (2 minutes)
1. Visit: https://console.groq.com
2. Sign up (free)
3. Click "API Keys" → "Create API Key"
4. Copy the key

### Step 2: Configure Environment (30 seconds)
Add to `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Restart your dev server:
```bash
npm run dev
```

### Step 3: Database Migration (1 minute)
1. Open Supabase Dashboard → SQL Editor
2. Copy all content from `supabase-voice-migration.sql`
3. Paste and click "Run"
4. Wait for success message

### Step 4: Create Storage Bucket (1 minute)
1. Supabase Dashboard → Storage → "New Bucket"
2. Name: `voice-recordings`
3. Privacy: **Private**
4. Click "Create"

### Step 5: Set Storage Policies (1 minute)
In Supabase SQL Editor, run:

```sql
CREATE POLICY "Users can upload their own voice recordings"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'voice-recordings' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read their own voice recordings"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'voice-recordings' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own voice recordings"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'voice-recordings' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### Step 6: Test It! (30 seconds)
1. Go to http://localhost:3000/dashboard/voice
2. Click "New Voice Recording"
3. Allow microphone access
4. Record and save
5. Watch it transcribe and summarize! 🎉

## ✅ That's It!

You now have:
- ✅ Voice recording capability
- ✅ AI transcription (Groq Whisper)
- ✅ AI summarization (OpenAI)
- ✅ Calendar event detection
- ✅ Integrated credit system

## 📚 Need More Help?

- **Detailed Setup**: See `VOICE_FEATURE_SETUP.md`
- **Testing Guide**: See `SETUP_CHECKLIST.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **Troubleshooting**: See `VOICE_FEATURE_SETUP.md` → Troubleshooting section

## 🎯 What You Can Do Now

- Record voice notes up to 2 hours
- Get accurate transcriptions in seconds
- AI-generated summaries automatically
- Detect calendar events from speech
- View, play back, and delete recordings
- Copy transcriptions to clipboard
- Costs just 5 credits per recording

## 💡 Pro Tips

1. **Speak clearly** - Better transcription accuracy
2. **Mention dates/times** - For calendar event detection
3. **Keep recordings < 5 minutes** - Faster processing
4. **Use Chrome/Firefox** - Best browser support

## 🐛 Quick Troubleshooting

**"Microphone permission denied"**
→ Allow in browser settings

**"GROQ_API_KEY not set"**
→ Check `.env.local` and restart server

**"Insufficient credits"**
→ Buy credits or add manually in Supabase

**Full troubleshooting** in `VOICE_FEATURE_SETUP.md`

---

**Ready to record!** 🎤 Head to `/dashboard/voice` and start creating!
