-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Allow service role to insert data
CREATE POLICY "Service role can insert data" 
  ON users FOR INSERT 
  WITH CHECK (true);
