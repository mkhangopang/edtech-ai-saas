# Supabase Setup for EdTech AI SaaS

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization, name your project
4. Set a strong database password (save it!)
5. Choose a region close to you
6. Click "Create new project"

## 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy these to your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key (keep secret!)

## 3. Run Database SQL

Go to SQL Editor in Supabase Dashboard and run this:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generations table
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  credits INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Generations policies
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
```

## 4. Set Up Storage Bucket

1. Go to Storage in Supabase Dashboard
2. Click "New Bucket"
3. Name it: `curricula`
4. Make it **Public** (so you can access PDF URLs)
5. Click "Create Bucket"

### Set Storage Policies

Click on the `curricula` bucket, go to Policies, and add:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload curricula"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'curricula' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read own curricula"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'curricula' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access (for generated URLs)
CREATE POLICY "Public can read curricula"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'curricula');
```

## 5. Configure Google OAuth (Optional)

1. Go to Authentication > Providers in Supabase
2. Enable Google provider
3. Get credentials from Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase
5. Click Save

## 6. Test Your Setup

Run this query to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see: `users`, `documents`, `generations`, `transactions`

## ✅ Setup Complete!

Your Supabase backend is ready. Make sure your `.env.local` has all the keys!
