'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/storage-utils';
import { AdminHeader } from '@/components/admin-header';

export default function AdminResourcesPage() {
  const supabase = createClient();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    resource_type: 'pdf',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewFile(selectedFile.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in');
        setLoading(false);
        return;
      }

      let fileUrl = previewFile;
      if (file && !previewFile?.includes('supabase')) {
        const fileName = `resource-${Date.now()}-${file.name}`;
        const { publicUrl, error: uploadError } = await uploadFile('uploads', `resources/${fileName}`, file);
        if (uploadError) {
          alert('Failed to upload file: ' + uploadError);
          setLoading(false);
          return;
        }
        fileUrl = publicUrl;
      }

      if (editingId) {
        const { error } = await supabase.from('resources').update({
          title: formData.title,
          description: formData.description,
          course_id: formData.course_id || null,
          resource_type: formData.resource_type,
          file_url: fileUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', editingId);
        if (error) alert('Failed to update resource: ' + error.message);
        else alert('Resource updated successfully!');
      } else {
        const { error } = await supabase.from('resources').insert({
          title: formData.title,
          description: formData.description,
          course_id: formData.course_id || null,
          resource_type: formData.resource_type,
          file_url: fileUrl,
          created_by: user.id,
        });
        if (error) alert('Failed to create resource: ' + error.message);
        else alert('Resource created successfully!');
      }
      handleCancelEdit();
      fetchResources();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) alert('Failed to delete');
      else {
        alert('Resource deleted successfully');
        fetchResources();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting resource');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      course_id: item.course_id || '',
      resource_type: item.resource_type || 'pdf',
    });
    if (item.file_url) setPreviewFile(item.file_url);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', course_id: '', resource_type: 'pdf' });
    setFile(null);
    setPreviewFile(null);
    setShowForm(false);
  };

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (error) console.error('Fetch error:', error);
      else setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminHeader title="Resources Management" description="Create, edit, and manage course resources" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
            + Add Resource
          </button>
        )}

        {showForm && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Resource' : 'Create New Resource'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Resource Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Resource Type</label>
                  <select value={formData.resource_type} onChange={(e) => setFormData({...formData, resource_type: e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="link">Link</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
              </div>

              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-6 text-center transition ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}>
                <input type="file" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} className="hidden" id="file-input" />
                <label htmlFor="file-input" className="cursor-pointer">
                  {previewFile ? (
                    <div className="text-slate-300">Selected: {previewFile}</div>
                  ) : (
                    <div className="text-slate-400">Drag file here or click to select</div>
                  )}
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold disabled:opacity-50">
                  {loading ? 'Saving...' : editingId ? 'Update Resource' : 'Create Resource'}
                </button>
                <button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No resources yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <div className="bg-slate-800 h-32 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-slate-400 text-3xl">📄</span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-2">{item.description?.substring(0, 80)}...</p>
                <p className="text-slate-500 text-xs mt-2">Type: {item.resource_type}</p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleEdit(item)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
