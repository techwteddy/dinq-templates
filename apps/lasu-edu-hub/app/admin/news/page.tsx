'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/storage-utils';
import { AdminHeader } from '@/components/admin-header';

export default function AdminNewsPage() {
  const supabase = createClient();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    published: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImageSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
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

      let imageUrl = previewImage;
      if (imageFile && !previewImage?.includes('supabase')) {
        const fileName = `news-${Date.now()}-${imageFile.name}`;
        const { publicUrl, error: uploadError } = await uploadFile('uploads', `news/${fileName}`, imageFile);
        if (uploadError) {
          alert('Failed to upload image: ' + uploadError);
          setLoading(false);
          return;
        }
        imageUrl = publicUrl;
      }

      if (editingId) {
        const { error } = await supabase.from('news').update({
          title: formData.title,
          content: formData.content,
          author: formData.author,
          published: formData.published,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', editingId);
        if (error) alert('Failed to update news: ' + error.message);
        else alert('News updated successfully!');
      } else {
        const { error } = await supabase.from('news').insert({
          title: formData.title,
          content: formData.content,
          author: formData.author,
          published: formData.published,
          image_url: imageUrl,
          created_by: user.id,
        });
        if (error) alert('Failed to create news: ' + error.message);
        else alert('News created successfully!');
      }
      handleCancelEdit();
      fetchNews();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news article?')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) alert('Failed to delete');
      else {
        alert('News deleted successfully');
        fetchNews();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting news');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content || '',
      author: item.author || '',
      published: item.published || false,
    });
    if (item.image_url) setPreviewImage(item.image_url);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', author: '', published: false });
    setImageFile(null);
    setPreviewImage(null);
    setShowForm(false);
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (error) console.error('Fetch error:', error);
      else setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminHeader title="News Management" description="Create, edit, and manage news articles" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
            + Add News
          </button>
        )}

        {showForm && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit News Article' : 'Create New Article'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Author</label>
                  <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Content *</label>
                <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required rows={6} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
              </div>

              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-6 text-center transition ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}>
                <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageSelect(e.target.files[0])} className="hidden" id="image-input" />
                <label htmlFor="image-input" className="cursor-pointer">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <div className="text-slate-400">Drag image here or click to select</div>
                  )}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="published" className="text-slate-300">Publish immediately</label>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold disabled:opacity-50">
                  {loading ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
                </button>
                <button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No news articles yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4" />}
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-2">{item.content.substring(0, 100)}...</p>
                {item.author && <p className="text-slate-500 text-xs mt-2">By {item.author}</p>}
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
