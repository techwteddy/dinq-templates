-- Add invitees columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS invitees text[] DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS external_emails text[] DEFAULT '{}';
