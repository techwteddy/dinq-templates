-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'file',
  url TEXT NOT NULL,
  description TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resources_course_id ON public.resources(course_id);
CREATE INDEX IF NOT EXISTS idx_news_date ON public.news(date DESC);
CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);

-- Enable RLS (Row Level Security) for public read access
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read for all users" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all users" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all users" ON public.news
  FOR SELECT USING (true);

-- Insert default data
INSERT INTO public.courses (title, department, description, code) VALUES
  ('Introduction to Computer Science', 'Computer Science', 'Fundamentals of programming and computer systems', 'CS101'),
  ('Data Structures', 'Computer Science', 'Advanced data structures and algorithms', 'CS201'),
  ('Software Engineering', 'Computer Science', 'Software development methodologies and practices', 'CS301')
ON CONFLICT (code) DO NOTHING;

-- Insert default resources
INSERT INTO public.resources (title, course_id, type, url, description) 
SELECT 
  'Python Basics Tutorial',
  id,
  'video',
  'https://example.com/python-basics',
  'Learn Python fundamentals'
FROM public.courses WHERE code = 'CS101'
ON CONFLICT DO NOTHING;

INSERT INTO public.resources (title, course_id, type, url, description) 
SELECT 
  'DSA Study Guide',
  id,
  'pdf',
  'https://example.com/dsa-guide',
  'Comprehensive data structures guide'
FROM public.courses WHERE code = 'CS201'
ON CONFLICT DO NOTHING;

INSERT INTO public.resources (title, course_id, type, url, description) 
SELECT 
  'Software Engineering Handbook',
  id,
  'document',
  'https://example.com/se-handbook',
  'Best practices and methodologies'
FROM public.courses WHERE code = 'CS301'
ON CONFLICT DO NOTHING;

-- Insert default news
INSERT INTO public.news (title, content, date, author) VALUES
  ('Welcome to STESSA', 'Welcome to the Science, Technology, Engineering and Skills Services for Africa program. This is your hub for accessing all educational resources and updates.', CURRENT_DATE, 'Admin')
ON CONFLICT DO NOTHING;
