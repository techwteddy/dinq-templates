-- Add likes_count and dislikes_count columns to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes_count INTEGER DEFAULT 0;

-- Update existing reviews to have default values
UPDATE reviews 
SET likes_count = 0, dislikes_count = 0 
WHERE likes_count IS NULL OR dislikes_count IS NULL;

-- Add constraints to ensure non-negative values
ALTER TABLE reviews 
ADD CONSTRAINT reviews_likes_count_non_negative CHECK (likes_count >= 0),
ADD CONSTRAINT reviews_dislikes_count_non_negative CHECK (dislikes_count >= 0); 