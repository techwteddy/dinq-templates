-- Change furnished from boolean to text with three options
ALTER TABLE listings
  ALTER COLUMN furnished TYPE text USING CASE WHEN furnished THEN 'fully_furnished' ELSE 'unfurnished' END,
  ALTER COLUMN furnished SET DEFAULT 'unfurnished';

-- Add check constraint
ALTER TABLE listings
  ADD CONSTRAINT listings_furnished_check CHECK (furnished IN ('unfurnished', 'semi_furnished', 'fully_furnished'));
