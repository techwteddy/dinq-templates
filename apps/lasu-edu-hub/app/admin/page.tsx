'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navigation } from '@/components/navigation';
import { SupabaseStatus } from '@/components/supabase-status';
import { FileUpload } from '@/components/file-upload';
import {
  getCourses, getResources, getNews,
  Course, Resource, NewsItem,
  addCourse, updateCourse, deleteCourse,
  addResource, updateResource, deleteResource,
  addNews, updateNews, deleteNews,
} from '@/lib/storage';

type Tab = 'courses' | 'resources' | 'news';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Course form
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});

  // Resource form
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({});

  // News form
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user?.user_metadata?.role !== 'admin') {
        router.push('/admin/login');
        return;
      }
      loadData();
    };

    checkAuth();
  }, [router, supabase.auth]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, resourcesData, newsData] = await Promise.all([
        getCourses(),
        getResources(),
        getNews(),
      ]);
      setCourses(coursesData);
      setResources(resourcesData);
      setNews(newsData);
    } catch (error) {
      console.error('[v0] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // COURSES
  const handleAddCourse = async () => {
    if (!courseForm.title || !courseForm.code || !courseForm.department) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      let result;
      if (editingId) {
        result = await updateCourse(editingId, courseForm as Partial<Course>);
      } else {
        result = await addCourse({
          title: courseForm.title,
          code: courseForm.code,
          department: courseForm.department,
          description: courseForm.description || '',
        } as Omit<Course, 'id' | 'created_at' | 'updated_at'>);
      }

      if (!result) {
        alert('Failed to save course. Please check the console for details and ensure Supabase is properly configured.');
        return;
      }

      setCourseForm({});
      setEditingId(null);
      await loadData();
      alert('Course saved successfully!');
    } catch (error) {
      console.error('[v0] Error saving course:', error);
      alert('Error saving course: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditCourse = (course: Course) => {
    setCourseForm(course);
    setEditingId(course.id);
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Are you sure you want to delete this course? Associated resources will also be deleted.')) {
      try {
        setSaving(true);
        const result = await deleteCourse(id);
        if (!result) {
          alert('Failed to delete course. Please check the console for details and ensure Supabase is properly configured.');
          return;
        }
        await loadData();
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('[v0] Error deleting course:', error);
        alert('Error deleting course: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setSaving(false);
      }
    }
  };

  // RESOURCES
  const handleAddResource = async () => {
    if (!resourceForm.title || !resourceForm.course_id || !resourceForm.type) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      let result;
      if (editingId) {
        result = await updateResource(editingId, resourceForm as Partial<Resource>);
      } else {
        result = await addResource({
          title: resourceForm.title,
          course_id: resourceForm.course_id,
          type: resourceForm.type as 'pdf' | 'video' | 'document' | 'link',
          url: resourceForm.url || '',
          description: resourceForm.description || '',
        } as Omit<Resource, 'id' | 'created_at' | 'updated_at'>);
      }

      if (!result) {
        alert('Failed to save resource. Please check the console for details and ensure Supabase is properly configured.');
        return;
      }

      setResourceForm({});
      setEditingId(null);
      await loadData();
      alert('Resource saved successfully!');
    } catch (error) {
      console.error('[v0] Error saving resource:', error);
      alert('Error saving resource: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setResourceForm(resource);
    setEditingId(resource.id);
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        setSaving(true);
        const result = await deleteResource(id);
        if (!result) {
          alert('Failed to delete resource. Please check the console for details and ensure Supabase is properly configured.');
          return;
        }
        await loadData();
        alert('Resource deleted successfully!');
      } catch (error) {
        console.error('[v0] Error deleting resource:', error);
        alert('Error deleting resource: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setSaving(false);
      }
    }
  };

  // NEWS
  const handleAddNews = async () => {
    if (!newsForm.title || !newsForm.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      let result;
      if (editingId) {
        result = await updateNews(editingId, newsForm as Partial<NewsItem>);
      } else {
        result = await addNews({
          title: newsForm.title,
          content: newsForm.content,
          date: newsForm.date || new Date().toISOString().split('T')[0],
          author: newsForm.author || 'Admin',
        } as Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>);
      }

      if (!result) {
        alert('Failed to save news. Please check the console for details and ensure Supabase is properly configured.');
        return;
      }

      setNewsForm({});
      setEditingId(null);
      await loadData();
      alert('News saved successfully!');
    } catch (error) {
      console.error('[v0] Error saving news:', error);
      alert('Error saving news: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setNewsForm(newsItem);
    setEditingId(newsItem.id);
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      try {
        setSaving(true);
        const result = await deleteNews(id);
        if (!result) {
          alert('Failed to delete news. Please check the console for details and ensure Supabase is properly configured.');
          return;
        }
        await loadData();
        alert('News deleted successfully!');
      } catch (error) {
        console.error('[v0] Error deleting news:', error);
        alert('Error deleting news: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setCourseForm({});
    setResourceForm({});
    setNewsForm({});
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-foreground/60">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SupabaseStatus />
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-lg opacity-90">Manage courses, resources, and news</p>
        </div>
      </section>

      {/* Admin Panel */}
      <section className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'courses'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
            >
              Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'resources'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
            >
              Resources ({resources.length})
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'news'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
            >
              News ({news.length})
            </button>
          </div>

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Form */}
              <div className="bg-card border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingId ? 'Edit Course' : 'Add New Course'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Course Title"
                    value={courseForm.title || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Course Code"
                    value={courseForm.code || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={courseForm.department || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={courseForm.description || ''}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddCourse}
                    disabled={saving}
                    className="btn-primary disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Course' : 'Add Course'}
                  </button>
                  {editingId && (
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-card border border-slate-700 rounded-lg p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{course.code}</h3>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-foreground/60">{course.department}</p>
                      <p className="text-sm text-foreground/80 mt-1">{course.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCourse(course)}
                        disabled={saving}
                        className="btn-secondary text-sm disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={saving}
                        className="bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm hover:opacity-80 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESOURCES TAB */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              {/* Form */}
              <div className="bg-card border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingId ? 'Edit Resource' : 'Add New Resource'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Resource Title"
                    value={resourceForm.title || ''}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select
                    value={resourceForm.course_id || ''}
                    onChange={(e) => setResourceForm({ ...resourceForm, course_id: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={resourceForm.type || ''}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Type</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="link">Link</option>
                    <option value="file">File Upload</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="URL or upload file below"
                    value={resourceForm.url || ''}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* File Upload Section */}
                {resourceForm.course_id && (
                  <div className="mb-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-3">Upload File</h3>
                    <FileUpload
                      courseId={resourceForm.course_id}
                      onUploadSuccess={(url, fileName, fileSize) => {
                        setResourceForm({
                          ...resourceForm,
                          url,
                          file_name: fileName,
                          file_size: fileSize,
                        });
                      }}
                      onUploadError={(error) => {
                        alert(`Upload error: ${error}`);
                      }}
                    />
                    {resourceForm.file_name && (
                      <div className="mt-3 text-sm">
                        <p className="text-foreground/80">
                          <strong>File:</strong> {resourceForm.file_name}
                        </p>
                        <p className="text-foreground/60">
                          Size: {resourceForm.file_size ? `${(resourceForm.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  placeholder="Description"
                  value={resourceForm.description || ''}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddResource}
                    disabled={saving}
                    className="btn-primary disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Resource' : 'Add Resource'}
                  </button>
                  {editingId && (
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {resources.map((resource) => {
                  const course = courses.find((c) => c.id === resource.course_id);
                  return (
                    <div
                      key={resource.id}
                      className="bg-card border border-slate-700 rounded-lg p-4 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-primary">{resource.title}</p>
                        <p className="text-sm text-foreground/60">
                          {course?.code} - {course?.title} • <span className="capitalize">{resource.type}</span>
                        </p>
                        <p className="text-sm text-foreground/80 mt-1">{resource.description}</p>
                        <p className="text-xs text-foreground/60 mt-1 break-all">URL: {resource.url}</p>
                        {resource.file_name && (
                          <p className="text-xs text-foreground/60 mt-1">
                            📁 {resource.file_name} {resource.file_size ? `(${(resource.file_size / 1024 / 1024).toFixed(2)} MB)` : ''}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditResource(resource)}
                          disabled={saving}
                          className="btn-secondary text-sm disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          disabled={saving}
                          className="bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm hover:opacity-80 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NEWS TAB */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              {/* Form */}
              <div className="bg-card border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingId ? 'Edit News' : 'Add New News'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="News Title"
                    value={newsForm.title || ''}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="date"
                    value={newsForm.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <textarea
                  placeholder="News Content"
                  value={newsForm.content || ''}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  rows={6}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddNews}
                    disabled={saving}
                    className="btn-primary disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update News' : 'Add News'}
                  </button>
                  {editingId && (
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {news.map((newsItem) => (
                  <div
                    key={newsItem.id}
                    className="bg-card border border-slate-700 rounded-lg p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-primary">{newsItem.title}</p>
                      <p className="text-sm text-foreground/60">
                        �� {new Date(newsItem.date).toLocaleDateString()} | ✍️ {newsItem.author}
                      </p>
                      <p className="text-sm text-foreground/80 mt-2">{newsItem.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNews(newsItem)}
                        disabled={saving}
                        className="btn-secondary text-sm disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(newsItem.id)}
                        disabled={saving}
                        className="bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm hover:opacity-80 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="opacity-80">
            &copy; 2024 LASU STE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
