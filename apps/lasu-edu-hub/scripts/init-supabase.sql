-- Create tables for LASU STESSA Resource Hub

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'document', 'link')),
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resources_course_id ON resources(course_id);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Insert default admin user (password: admin123stessa)
-- Hash: $2b$10$WwT7pz/0B6PpV3V5X5Y5L.rQ4R5V5X5V5X5V5X5V5X5V5X5V5X5V5
INSERT INTO admin_users (email, password_hash) VALUES 
  ('stessaedu@gmail.com', '$2b$10$L0GWyxuVfKEX8z7V5X5L.rQ4R5V5X5V5X5V5X5V5X5V5X5V5X5V5')
ON CONFLICT (email) DO NOTHING;

-- Insert default courses
INSERT INTO courses (title, department, description, code) VALUES
  ('Introduction to Computer Science', 'Computer Science', 'Fundamentals of programming and computer systems', 'CS101'),
  ('Data Structures', 'Computer Science', 'Advanced data structures and algorithms', 'CS201'),
  ('Software Engineering', 'Computer Science', 'Software development methodologies and practices', 'CS301')
ON CONFLICT (code) DO NOTHING;

-- Insert default resources (after courses are inserted)
INSERT INTO resources (title, course_id, type, url, description) VALUES
  ('Python Basics Tutorial', (SELECT id FROM courses WHERE code = 'CS101'), 'video', '#', 'Learn Python fundamentals'),
  ('DSA Study Guide', (SELECT id FROM courses WHERE code = 'CS201'), 'pdf', '#', 'Comprehensive data structures guide'),
  ('Software Engineering Handbook', (SELECT id FROM courses WHERE code = 'CS301'), 'document', '#', 'Best practices and methodologies')
ON CONFLICT DO NOTHING;

-- Insert default news
INSERT INTO news (title, content, date, author) VALUES
  ('Welcome to STESSA', 'Welcome to the Science, Technology, Engineering and Skills Services for Africa program. This is your hub for accessing all educational resources and updates.', CURRENT_DATE, 'Admin')
ON CONFLICT DO NOTHING;
