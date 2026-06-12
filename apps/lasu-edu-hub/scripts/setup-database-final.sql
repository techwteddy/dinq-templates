-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample courses (if code doesn't exist)
INSERT INTO courses (title, department, description, code)
SELECT 'Introduction to Computer Science', 'Computer Science', 'Fundamentals of programming and computer systems', 'CS101'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE code = 'CS101');

INSERT INTO courses (title, department, description, code)
SELECT 'Data Structures', 'Computer Science', 'Advanced data structures and algorithms', 'CS201'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE code = 'CS201');

INSERT INTO courses (title, department, description, code)
SELECT 'Software Engineering', 'Computer Science', 'Software development methodologies and practices', 'CS301'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE code = 'CS301');

-- Insert sample resources for CS101
INSERT INTO resources (title, course_id, type, url, description)
SELECT 'Python Basics Tutorial', courses.id, 'video', 'https://example.com/python', 'Learn Python fundamentals'
FROM courses WHERE courses.code = 'CS101'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Python Basics Tutorial');

-- Insert sample resources for CS201
INSERT INTO resources (title, course_id, type, url, description)
SELECT 'DSA Study Guide', courses.id, 'pdf', 'https://example.com/dsa', 'Comprehensive data structures guide'
FROM courses WHERE courses.code = 'CS201'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'DSA Study Guide');

-- Insert sample resources for CS301
INSERT INTO resources (title, course_id, type, url, description)
SELECT 'Software Engineering Handbook', courses.id, 'document', 'https://example.com/se', 'Best practices and methodologies'
FROM courses WHERE courses.code = 'CS301'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Software Engineering Handbook');

-- Insert sample news
INSERT INTO news (title, content, date, author)
SELECT 'Welcome to STESSA', 'Welcome to the Science, Technology, Engineering and Skills Services for Africa program. This is your hub for accessing all educational resources and updates.', CURRENT_DATE, 'Admin'
WHERE NOT EXISTS (SELECT 1 FROM news WHERE title = 'Welcome to STESSA');
