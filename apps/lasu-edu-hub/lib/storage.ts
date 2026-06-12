import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = !!(supabaseUrl && supabaseKey);

console.log('[v0] Supabase URL:', supabaseUrl ? '✓ Set' : '✗ NOT SET');
console.log('[v0] Supabase Key:', supabaseKey ? '✓ Set' : '✗ NOT SET');

if (!isConfigured) {
  console.warn('[v0] ⚠️ Supabase not configured. Using fallback data.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export const isSupabaseConfigured = isConfigured;

export interface Course {
  id: string;
  title: string;
  department: string;
  description: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

export interface Resource {
  id: string;
  title: string;
  course_id: string;
  type: string;
  url: string;
  description: string;
  file_name?: string;
  file_size?: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  created_at?: string;
  updated_at?: string;
}

const FALLBACK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    department: 'Computer Science',
    description: 'Fundamentals of programming and computer systems',
    code: 'CS101',
  },
  {
    id: '2',
    title: 'Data Structures',
    department: 'Computer Science',
    description: 'Advanced data structures and algorithms',
    code: 'CS201',
  },
  {
    id: '3',
    title: 'Software Engineering',
    department: 'Computer Science',
    description: 'Software development methodologies and practices',
    code: 'CS301',
  },
];

const FALLBACK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Python Basics Tutorial',
    course_id: '1',
    type: 'video',
    url: 'https://example.com/python',
    description: 'Learn Python fundamentals',
  },
  {
    id: '2',
    title: 'DSA Study Guide',
    course_id: '2',
    type: 'pdf',
    url: 'https://example.com/dsa',
    description: 'Comprehensive data structures guide',
  },
  {
    id: '3',
    title: 'Software Engineering Handbook',
    course_id: '3',
    type: 'document',
    url: 'https://example.com/se',
    description: 'Best practices and methodologies',
  },
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Welcome to STESSA',
    content: 'Welcome to the Science, Technology, Engineering and Skills Services for Africa program. This is your hub for accessing all educational resources and updates.',
    date: new Date().toISOString().split('T')[0],
    author: 'Admin',
  },
];

export const initializeStorage = () => {
  console.log('[v0] Storage initialized');
};

export const uploadResourceFile = async (
  file: File,
  courseId: string
): Promise<{ url: string; fileName: string; fileSize: number } | null> => {
  try {
    const timestamp = Date.now();
    const fileName = `${courseId}/${timestamp}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('uploads')  // ← fixed bucket name (your bucket is 'uploads', not 'resources')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    return {
      url: publicUrlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error) {
    console.error('[v0] Upload error:', error);
    return null;
  }
};

export const deleteResourceFile = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('uploads')  // ← fixed bucket name
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[v0] Delete file error:', error);
    return false;
  }
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    if (!isSupabaseConfigured) return FALLBACK_COURSES;

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') return FALLBACK_COURSES;
      throw error;
    }

    return (data as Course[]) || [];
  } catch (error) {
    console.error('[v0] Error fetching courses:', error);
    return FALLBACK_COURSES;
  }
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Course | undefined;
  } catch (error) {
    console.error('[v0] Error fetching course:', error);
    return undefined;
  }
};

export const addCourse = async (
  course: Omit<Course, 'id' | 'created_at' | 'updated_at'>
): Promise<Course | null> => {
  try {
    const { error } = await supabase
      .from('courses')
      .insert(course);

    if (error) throw error;
    return course as Course;
  } catch (error) {
    console.error('[v0] Error adding course:', error);
    return null;
  }
};

export const updateCourse = async (
  id: string,
  updates: Partial<Course>
): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Course;
  } catch (error) {
    console.error('[v0] Error updating course:', error);
    return null;
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    // Delete associated resources first
    const { error: resourceError } = await supabase.from('resources').delete().eq('course_id', id);
    if (resourceError) {
      console.error('[v0] Error deleting course resources:', {
        code: resourceError.code,
        message: resourceError.message,
        status: (resourceError as any).status,
      });
      throw resourceError;
    }

    // Then delete the course
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      console.error('[v0] Error deleting course:', {
        code: error.code,
        message: error.message,
        status: (error as any).status,
      });
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('[v0] Failed to delete course:', error?.message || 'Unknown error');
    return false;
  }
};

export const getResources = async (): Promise<Resource[]> => {
  try {
    if (!isSupabaseConfigured) return FALLBACK_RESOURCES;

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') return FALLBACK_RESOURCES;
      throw error;
    }

    return (data as Resource[]) || [];
  } catch (error) {
    console.error('[v0] Error fetching resources:', error);
    return FALLBACK_RESOURCES;
  }
};

export const getResourcesByCourse = async (
  courseId: string
): Promise<Resource[]> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Resource[]) || [];
  } catch (error) {
    console.error('[v0] Error fetching resources by course:', error);
    return [];
  }
};

export const addResource = async (
  resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>
): Promise<Resource | null> => {
  try {
    const { error } = await supabase
      .from('resources')
      .insert(resource);

    if (error) throw error;
    return resource as Resource;
  } catch (error) {
    console.error('[v0] Error adding resource:', error);
    return null;
  }
};

export const updateResource = async (
  id: string,
  updates: Partial<Resource>
): Promise<Resource | null> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Resource;
  } catch (error) {
    console.error('[v0] Error updating resource:', error);
    return null;
  }
};

export const deleteResource = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) {
      console.error('[v0] Error deleting resource:', {
        code: error.code,
        message: error.message,
        status: (error as any).status,
      });
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('[v0] Failed to delete resource:', error?.message || 'Unknown error');
    return false;
  }
};

export const deleteResourcesByCourse = async (
  courseId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('resources').delete().eq('course_id', courseId);
    if (error) {
      console.error('[v0] Error deleting resources by course:', {
        code: error.code,
        message: error.message,
        status: (error as any).status,
      });
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('[v0] Failed to delete resources by course:', error?.message || 'Unknown error');
    return false;
  }
};

export const getNews = async (): Promise<NewsItem[]> => {
  try {
    if (!isSupabaseConfigured) return FALLBACK_NEWS;

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') return FALLBACK_NEWS;
      throw error;
    }

    return (data as NewsItem[]) || [];
  } catch (error) {
    console.error('[v0] Error fetching news:', error);
    return FALLBACK_NEWS;
  }
};

export const addNews = async (
  news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>
): Promise<NewsItem | null> => {
  try {
    const { error } = await supabase
      .from('news')
      .insert(news);

    if (error) throw error;
    return news as NewsItem;
  } catch (error) {
    console.error('[v0] Error adding news:', error);
    return null;
  }
};

export const updateNews = async (
  id: string,
  updates: Partial<NewsItem>
): Promise<NewsItem | null> => {
  try {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as NewsItem;
  } catch (error) {
    console.error('[v0] Error updating news:', error);
    return null;
  }
};

export const deleteNews = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      console.error('[v0] Error deleting news:', {
        code: error.code,
        message: error.message,
        status: (error as any).status,
      });
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('[v0] Failed to delete news:', error?.message || 'Unknown error');
    return false;
  }
};

