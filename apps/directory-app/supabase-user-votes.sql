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

-- Drop existing user_votes table if it exists
DROP TABLE IF EXISTS user_votes CASCADE;

-- Create user_votes table to track individual user votes
CREATE TABLE IF NOT EXISTS user_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, review_id)
);

-- Enable RLS on user_votes table
ALTER TABLE user_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for user_votes table
-- Allow anyone to read votes (for vote counting)
CREATE POLICY "Anyone can read user votes" ON user_votes
    FOR SELECT USING (true);

-- Allow anyone to insert votes (for both authenticated and anonymous users)
CREATE POLICY "Anyone can insert user votes" ON user_votes
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update votes (for both authenticated and anonymous users)
CREATE POLICY "Anyone can update user votes" ON user_votes
    FOR UPDATE USING (true);

-- Allow anyone to delete votes (for both authenticated and anonymous users)
CREATE POLICY "Anyone can delete user votes" ON user_votes
    FOR DELETE USING (true);

-- Create trigger function to update review vote counts
CREATE OR REPLACE FUNCTION update_review_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment the appropriate count
    IF NEW.vote_type = 'like' THEN
      UPDATE reviews SET likes_count = likes_count + 1 WHERE id = NEW.review_id;
    ELSIF NEW.vote_type = 'dislike' THEN
      UPDATE reviews SET dislikes_count = dislikes_count + 1 WHERE id = NEW.review_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote type change
    IF OLD.vote_type = 'like' AND NEW.vote_type = 'dislike' THEN
      UPDATE reviews SET likes_count = likes_count - 1, dislikes_count = dislikes_count + 1 WHERE id = NEW.review_id;
    ELSIF OLD.vote_type = 'dislike' AND NEW.vote_type = 'like' THEN
      UPDATE reviews SET likes_count = likes_count + 1, dislikes_count = dislikes_count - 1 WHERE id = NEW.review_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement the appropriate count
    IF OLD.vote_type = 'like' THEN
      UPDATE reviews SET likes_count = likes_count - 1 WHERE id = OLD.review_id;
    ELSIF OLD.vote_type = 'dislike' THEN
      UPDATE reviews SET dislikes_count = dislikes_count - 1 WHERE id = OLD.review_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on user_votes table
DROP TRIGGER IF EXISTS trigger_update_review_vote_counts ON user_votes;
CREATE TRIGGER trigger_update_review_vote_counts
  AFTER INSERT OR UPDATE OR DELETE ON user_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_vote_counts(); 