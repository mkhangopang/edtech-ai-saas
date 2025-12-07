-- Voice Recording and Calendar Integration Migration
-- Run this in your Supabase SQL Editor

-- =====================================================
-- Table: voice_recordings
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  audio_file_path TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  transcription_text TEXT,
  summary_text TEXT,
  detected_events JSONB,
  calendar_sync_status TEXT DEFAULT 'pending' CHECK (calendar_sync_status IN ('pending', 'synced', 'failed')),
  credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table: calendar_events
-- =====================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID NOT NULL REFERENCES voice_recordings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  google_event_id TEXT,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_start TIMESTAMP WITH TIME ZONE NOT NULL,
  event_end TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'synced', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_voice_recordings_user_id ON voice_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_recordings_created_at ON voice_recordings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_recordings_user_created ON voice_recordings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_events_recording_id ON calendar_events(recording_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on voice_recordings
ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own recordings
CREATE POLICY "Users can view their own voice recordings"
  ON voice_recordings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own recordings
CREATE POLICY "Users can insert their own voice recordings"
  ON voice_recordings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own recordings
CREATE POLICY "Users can update their own voice recordings"
  ON voice_recordings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own recordings
CREATE POLICY "Users can delete their own voice recordings"
  ON voice_recordings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on calendar_events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own calendar events
CREATE POLICY "Users can view their own calendar events"
  ON calendar_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own calendar events
CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own calendar events
CREATE POLICY "Users can update their own calendar events"
  ON calendar_events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own calendar events
CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Function: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on voice_recordings
CREATE TRIGGER update_voice_recordings_updated_at
  BEFORE UPDATE ON voice_recordings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function: Deduct credits atomically
-- =====================================================
CREATE OR REPLACE FUNCTION deduct_voice_credits(
  p_user_id UUID,
  p_credits INTEGER,
  p_recording_id UUID
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, message TEXT) AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Lock the user row for update
  SELECT credits INTO v_current_credits
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  -- Check if user has enough credits
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'User not found';
    RETURN;
  END IF;

  IF v_current_credits < p_credits THEN
    RETURN QUERY SELECT FALSE, v_current_credits, 'Insufficient credits';
    RETURN;
  END IF;

  -- Deduct credits
  v_new_balance := v_current_credits - p_credits;
  
  UPDATE users
  SET credits = v_new_balance
  WHERE id = p_user_id;

  -- Update recording with credits used
  UPDATE voice_recordings
  SET credits_used = p_credits
  WHERE id = p_recording_id;

  RETURN QUERY SELECT TRUE, v_new_balance, 'Credits deducted successfully';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Voice recording migration completed successfully!';
  RAISE NOTICE 'Tables created: voice_recordings, calendar_events';
  RAISE NOTICE 'RLS policies applied';
  RAISE NOTICE 'Indexes created for performance';
  RAISE NOTICE 'Functions created: deduct_voice_credits';
END $$;
