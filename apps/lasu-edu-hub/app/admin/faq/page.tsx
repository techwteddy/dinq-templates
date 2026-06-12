'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/storage-utils';
import { AdminHeader } from '@/components/admin-header';

export default function AdminFAQPage() {
  const supabase = createClient();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    display_order: 0,
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

      let fileUrl = null;
      if (file) {
        const fileName = `faq-${Date.now()}-${file.name}`;
        const { publicUrl, error: uploadError } = await uploadFile('uploads', `faqs/${fileName}`, file);
        if (uploadError) {
          alert('Failed to upload file: ' + uploadError);
          setLoading(false);
          return;
        }
        fileUrl = publicUrl;
      }

      if (editingId) {
        const { error } = await supabase.from('faqs').update({
          question: formData.question,
          answer: formData.answer,
          category: formData.category || null,
          display_order: formData.display_order,
          attachment_url: fileUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', editingId);
        if (error) alert('Failed to update FAQ: ' + error.message);
        else alert('FAQ updated successfully!');
      } else {
        const { error } = await supabase.from('faqs').insert({
          question: formData.question,
          answer: formData.answer,
          category: formData.category || null,
          display_order: formData.display_order,
          attachment_url: fileUrl,
          created_by: user.id,
        });
        if (error) alert('Failed to create FAQ: ' + error.message);
        else alert('FAQ created successfully!');
      }
      handleCancelEdit();
      fetchFAQs();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) alert('Failed to delete');
      else {
        alert('FAQ deleted successfully');
        fetchFAQs();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting FAQ');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer || '',
      category: item.category || '',
      display_order: item.display_order || 0,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '', category: '', display_order: 0 });
    setFile(null);
    setPreviewFile(null);
    setShowForm(false);
  };

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
      if (error) console.error('Fetch error:', error);
      else setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminHeader title="FAQ Management" description="Create, edit, and manage frequently asked questions" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
            + Add FAQ
          </button>
        )}

        {showForm && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit FAQ' : 'Create New FAQ'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Question *</label>
                <input type="text" value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="Enter the question" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Answer *</label>
                <textarea value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} required rows={6} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="Enter the answer" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="e.g., General, Technical" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Display Order</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
              </div>

              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-6 text-center transition ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}>
                <input type="file" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} className="hidden" id="file-input" />
                <label htmlFor="file-input" className="cursor-pointer">
                  {previewFile ? (
                    <div className="text-slate-300">Selected: {previewFile}</div>
                  ) : (
                    <div className="text-slate-400">Drag attachment here or click to select (optional)</div>
                  )}
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold disabled:opacity-50">
                  {loading ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
                </button>
                <button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {faqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No FAQs yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white">{item.question}</h3>
                <p className="text-slate-400 text-sm mt-2">{item.answer}</p>
                {item.category && <p className="text-slate-500 text-xs mt-2">Category: {item.category}</p>}
                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleEdit(item)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold">
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
