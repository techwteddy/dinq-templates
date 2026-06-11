'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiCheck, FiX, FiTrash2, FiRefreshCw, FiStar, FiMail, FiEye, FiLogOut } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin email
const ADMIN_EMAIL = 'vishalgkumar54@gmail.com';

interface Review {
  id: string;
  network_slug: string;
  network_name: string;
  user_name: string;
  overall_rating: number;
  ease_of_use: number;
  payment_speed: number;
  support_quality: number;
  review_text: string;
  screenshot_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  // Check if user is admin
  const checkAdminAuth = () => {
    const email = localStorage.getItem('adminEmail');
    if (email === ADMIN_EMAIL) {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const handleLogin = () => {
    if (adminEmail === ADMIN_EMAIL) {
      localStorage.setItem('adminEmail', adminEmail);
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      alert('Invalid admin email');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setShowLogin(true);
    setAdminEmail('');
  };

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reviews:', error);
    } else if (data) {
      setReviews(data as Review[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating review:', error);
      alert('Error updating review status');
    } else {
      fetchReviews();
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    } else {
      fetchReviews();
    }
  };

  const fetchContactMessages = async () => {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contact messages:', error);
    } else if (data) {
      setContactMessages(data as ContactMessage[]);
    }
    setLoadingMessages(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchContactMessages();
    }
  }, [isAuthenticated]);

  const deleteContactMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    } else {
      fetchContactMessages();
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin email"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
            <p className="text-gray-600">Moderate, approve, or reject user reviews</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setRefreshing(true); fetchReviews().then(() => setRefreshing(false)); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Reviews Management</h2>
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-full font-semibold border transition-all ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && (
                  <span className="ml-2 text-xs font-bold">({reviews.filter(r => r.status === f).length})</span>
                )}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center text-gray-500 py-20 text-lg">No reviews found for this filter.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Network</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-800">
                        <a
                          href={`/network/${review.network_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline hover:text-blue-900"
                        >
                          {review.network_name}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {review.user_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-bold text-yellow-500">
                          {review.overall_rating} <FiStar className="inline-block" />
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs">
                        <div className="truncate">{review.review_text}</div>
                        {review.screenshot_url && (
                          <a
                            href={review.screenshot_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FiEye /> View Screenshot
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          review.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : review.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {review.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateReviewStatus(review.id, 'approved')}
                                className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200 transition"
                                title="Approve"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={() => updateReviewStatus(review.id, 'rejected')}
                                className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                                title="Reject"
                              >
                                <FiX />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact Messages Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Contact Messages</h2>
          {loadingMessages ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : contactMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-lg">No contact messages found.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contactMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-800">{msg.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                        <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:underline">
                          <FiMail /> {msg.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{msg.subject}</td>
                      <td className="px-6 py-4 whitespace-pre-line text-gray-700 max-w-xs break-words">{msg.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteContactMessage(msg.id)}
                          className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 