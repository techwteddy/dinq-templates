'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminHeader } from '@/components/admin-header';

export default function AdminEventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    event_type: 'seminar',
    capacity: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleMediaSelect(e.dataTransfer.files[0]);
    }
  };

  const handleMediaSelect = (file: File) => {
    setMediaFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Failed to delete event');
      } else {
        alert('Event deleted successfully');
        fetchEvents();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting event');
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    const eventDateTime = event.event_date ? new Date(event.event_date) : new Date();
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: eventDateTime.toISOString().split('T')[0],
      event_time: eventDateTime.toTimeString().split(' ')[0].slice(0, 5),
      location: event.location || '',
      event_type: event.event_type || 'seminar',
      capacity: event.capacity ? event.capacity.toString() : '',
    });
    if (event.image_url) {
      setPreviewImage(event.image_url);
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      event_type: 'seminar',
      capacity: '',
    });
    setMediaFile(null);
    setPreviewImage(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to create events');
        setLoading(false);
        return;
      }

      let mediaUrl = previewImage;

      // Upload media if new file selected
      if (mediaFile) {
        const fileName = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const filePath = `uploads/events/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, mediaFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert('Failed to upload media');
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);

        mediaUrl = publicUrlData.publicUrl;
      }

      // Combine date and time
      const eventDateTime = formData.event_time 
        ? `${formData.event_date}T${formData.event_time}`
        : `${formData.event_date}T00:00`;

      // Update or Insert
      if (editingId) {
        const { error: updateError } = await supabase
          .from('events')
          .update({
            title: formData.title,
            description: formData.description,
            event_date: eventDateTime,
            location: formData.location,
            event_type: formData.event_type,
            capacity: formData.capacity ? parseInt(formData.capacity) : null,
            image_url: mediaUrl || previewImage,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (updateError) {
          console.error('Update error:', updateError);
          alert('Failed to update event: ' + updateError.message);
        } else {
          alert('Event updated successfully!');
          handleCancelEdit();
          fetchEvents();
        }
      } else {
        // Insert event into database
        const { error: insertError } = await supabase
          .from('events')
          .insert({
            title: formData.title,
            description: formData.description,
            event_date: eventDateTime,
            location: formData.location,
            event_type: formData.event_type,
            capacity: formData.capacity ? parseInt(formData.capacity) : null,
            image_url: mediaUrl,
            created_by: user.id,
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          alert('Failed to create event: ' + insertError.message);
        } else {
          alert('Event created successfully!');
          handleCancelEdit();
          fetchEvents();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminHeader 
        title="Events Management" 
        description="Create and manage school events and seminars"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            + Create Event
          </button>
        )}

        {showForm && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Event' : 'Create New Event'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
                    placeholder="Annual Seminar on Technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
                    placeholder="Main Auditorium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Event Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
                  >
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="lecture">Lecture</option>
                    <option value="examination">Examination</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
                  placeholder="Event description..."
                  rows={4}
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Image</label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                    dragActive
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleMediaSelect(e.target.files[0])}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    {previewImage ? (
                      <div className="space-y-4">
                        <img src={previewImage} alt="Preview" className="w-48 h-48 object-cover mx-auto rounded-lg" />
                        <p className="text-slate-400">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-slate-300 font-medium">Drag and drop your image here</p>
                        <p className="text-slate-500">or click to select from your computer</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Event' : 'Create Event')}
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

        {events.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Events ({events.length})</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    <p className="text-slate-400 text-sm">{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'No date'}</p>
                    <p className="text-slate-500 text-sm mt-2">{event.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No events created yet. Create your first event to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}
