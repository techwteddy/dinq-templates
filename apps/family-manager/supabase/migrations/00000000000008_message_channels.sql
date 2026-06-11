-- Add channel column to family_messages (family = visible to all, parents = parents only)
ALTER TABLE family_messages ADD COLUMN IF NOT EXISTS channel text NOT NULL DEFAULT 'family';
