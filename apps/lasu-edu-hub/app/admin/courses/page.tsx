'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminHeader } from '@/components/admin-header';

export default function AdminCoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    credits: '3',
    faculty_id: '',
    semester: '',
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Failed to delete course');
      } else {
        alert('Course deleted successfully');
        fetchCourses();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting course');
    }
  };

  const handleEdit = (course: any) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      code: course.code,
      description: course.description || '',
      credits: course.credits ? course.credits.toString() : '3',
      faculty_id: course.faculty_id || '',
      semester: course.semester || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      code: '',
      description: '',
      credits: '3',
      faculty_id: '',
      semester: '',
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to create courses');
        setLoading(false);
        return;
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from('courses')
          .update({
            title: formData.title,
            code: formData.code,
            description: formData.description,
            credits: parseInt(formData.credits),
            faculty_id: formData.faculty_id || null,
            semester: formData.semester,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (updateError) {
          console.error('Update error:', updateError);
          alert('Failed to update course: ' + updateError.message);
        } else {
          alert('Course updated successfully!');
          handleCancelEdit();
          fetchCourses();
        }
      } else {
        const { error: insertError } = await supabase
          .from('courses')
          .insert([
            {
              title: formData.title,
              code: formData.code,
              description: formData.description,
              credits: parseInt(formData.credits),
              faculty_id: formData.faculty_id || null,
              semester: formData.semester,
              created_by: user.id,
            },
          ]);

        if (insertError) {
          console.error('Insert error:', insertError);
          alert('Failed to create course: ' + insertError.message);
        } else {
          alert('Course created successfully!');
          handleCancelEdit();
          fetchCourses();
        }
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Fetch faculty error:', error);
      } else {
        setFaculty(data || []);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFaculty();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminHeader 
        title="Courses Management" 
        description="Create and manage academic courses"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            + Add Course
          </button>
        )}
        {showForm && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none transition"
                    placeholder="Introduction to Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none transition"
                    placeholder="CS101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Credits</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none transition"
                    min="1"
                    max="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Faculty</label>
                  <select
                    value={formData.faculty_id}
                    onChange={(e) => setFormData({...formData, faculty_id: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none transition"
                  >
                    <option value="">Select Faculty Member</option>
                    {faculty.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none transition"
                  >
                    <option value="">Select Semester</option>
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none transition"
                  placeholder="Course description..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add Course
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Course' : 'Create Course')}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Courses</h2>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-slate-400 text-lg">No courses created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-900 border border-slate-700 rounded-lg p-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <p className="text-slate-400 text-sm">{course.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(course)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
