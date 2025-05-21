-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  job_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  property_address TEXT,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  status TEXT NOT NULL,
  created_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  vendor TEXT NOT NULL,
  card_number TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  cvv TEXT NOT NULL,
  billing_zip TEXT NOT NULL,
  issued_date DATE NOT NULL,
  initial_amount DECIMAL(10, 2) NOT NULL,
  remaining_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL,
  issued_to TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  vendor TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  receipt_url TEXT
);

-- Add receipt_url column to transactions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'transactions'
      AND column_name = 'receipt_url'
  ) THEN
      ALTER TABLE transactions ADD COLUMN receipt_url TEXT;
  END IF;
END $$;
