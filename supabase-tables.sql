-- Create curriculums table
CREATE TABLE curriculums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credits table
CREATE TABLE credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Policies for curriculums
CREATE POLICY "Users can view their own curriculums" ON curriculums
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own curriculums" ON curriculums
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own curriculums" ON curriculums
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for credits
CREATE POLICY "Users can view their own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to create credits row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.credits (user_id, credits_remaining)
  VALUES (NEW.id, 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create credits on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create storage bucket for curriculums
INSERT INTO storage.buckets (id, name, public)
VALUES ('curriculums', 'curriculums', false);

-- Storage policies
CREATE POLICY "Users can upload their own curriculums" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'curriculums' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own curriculums" ON storage.objects
  FOR SELECT USING (bucket_id = 'curriculums' AND auth.uid()::text = (storage.foldername(name))[1]);
