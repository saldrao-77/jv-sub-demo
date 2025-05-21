-- Insert sample receipts
INSERT INTO receipts (user_id, job_id, card_id, date, vendor, amount, description, receipt_url, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 1, 1, '2025-05-20', 'Home Depot', 250.75, 'Bathroom tiles and grout', 'https://example.com/receipts/sample1.jpg', 'Submitted'),
  ('00000000-0000-0000-0000-000000000001', 1, 1, '2025-05-21', 'Home Depot', 125.30, 'Bathroom fixtures', 'https://example.com/receipts/sample2.jpg', 'Submitted'),
  ('00000000-0000-0000-0000-000000000001', 2, 2, '2025-05-15', 'Lowe''s', 750.00, 'Kitchen cabinets', 'https://example.com/receipts/sample3.jpg', 'Submitted'),
  ('00000000-0000-0000-0000-000000000001', 2, 2, '2025-05-16', 'Home Depot', 320.45, 'Kitchen countertop materials', 'https://example.com/receipts/sample4.jpg', 'Submitted'),
  ('00000000-0000-0000-0000-000000000001', 3, 3, '2025-05-19', 'Ace Hardware', 85.20, 'Deck screws and hardware', 'https://example.com/receipts/sample5.jpg', 'Submitted')
ON CONFLICT DO NOTHING;
