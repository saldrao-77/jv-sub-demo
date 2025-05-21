-- Insert sample users (these would normally be created through auth signup)
-- This assumes you already have users in the auth.users table
INSERT INTO users (id, email, business_name)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo Construction Co.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (user_id, job_name, customer_name, property_address, deposit_amount, status, created_date)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Bathroom Renovation', 'Sarah Johnson', '123 Oak St, San Francisco, CA', 850, 'Deposit paid', '2025-05-15'),
  ('00000000-0000-0000-0000-000000000001', 'Kitchen Remodel', 'Michael Chen', '456 Pine Ave, Oakland, CA', 1200, 'Materials purchased', '2025-05-10'),
  ('00000000-0000-0000-0000-000000000001', 'Deck Construction', 'Robert Garcia', '789 Maple Dr, San Jose, CA', 750, 'Card issued', '2025-05-16'),
  ('00000000-0000-0000-0000-000000000001', 'Basement Finishing', 'Jennifer Lee', '321 Cedar Ln, Berkeley, CA', 1500, 'Deposit request sent', '2025-05-19')
ON CONFLICT DO NOTHING;

-- Insert sample cards
INSERT INTO cards (user_id, job_id, vendor, card_number, expiry_date, cvv, billing_zip, issued_date, initial_amount, remaining_amount, status, issued_to, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 1, 'Home Depot', '•••• •••• •••• 4589', '06/25', '123', '94105', '2025-05-19', 850, 850, 'active', 'John Smith', 'Contractor'),
  ('00000000-0000-0000-0000-000000000001', 2, 'Lowe''s, Home Depot', '•••• •••• •••• 7823', '06/25', '456', '94105', '2025-05-13', 1200, 450, 'active', 'Alex Wong', 'Foreman'),
  ('00000000-0000-0000-0000-000000000001', 3, 'Home Depot, Ace Hardware', '•••• •••• •••• 3456', '06/25', '789', '94105', '2025-05-19', 750, 750, 'active', 'Carlos Rodriguez', 'Carpenter')
ON CONFLICT DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (user_id, job_id, card_id, date, type, vendor, amount, status, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 1, NULL, '2025-05-18', 'Deposit', NULL, 850, 'Deposit paid', 'Initial deposit for bathroom renovation'),
  ('00000000-0000-0000-0000-000000000001', 2, NULL, '2025-05-12', 'Deposit', NULL, 1200, 'Deposit paid', 'Initial deposit for kitchen remodel'),
  ('00000000-0000-0000-0000-000000000001', 2, 2, '2025-05-13', 'Card Issued', 'Lowe''s, Home Depot', 1200, 'Card issued', 'Card issued to Alex Wong'),
  ('00000000-0000-0000-0000-000000000001', 2, 2, '2025-05-15', 'Purchase', 'Lowe''s', -750, 'Materials purchased', 'Kitchen cabinets and countertops'),
  ('00000000-0000-0000-0000-000000000001', 3, NULL, '2025-05-17', 'Deposit', NULL, 750, 'Deposit paid', 'Initial deposit for deck construction'),
  ('00000000-0000-0000-0000-000000000001', 3, 3, '2025-05-19', 'Card Issued', 'Home Depot, Ace Hardware', 750, 'Card issued', 'Card issued to Carlos Rodriguez'),
  ('00000000-0000-0000-0000-000000000001', 4, NULL, '2025-05-19', 'Request', NULL, 1500, 'Deposit request sent', 'Deposit request for basement finishing')
ON CONFLICT DO NOTHING;

-- Insert sample receipt
INSERT INTO transactions (user_id, job_id, card_id, date, type, vendor, amount, status, description, receipt_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 2, 2, '2025-05-15', 'Receipt', 'Lowe''s', 0, 'Receipt submitted', 'Receipt for kitchen cabinets', 'https://example.com/receipts/sample-receipt.jpg')
ON CONFLICT DO NOTHING;
