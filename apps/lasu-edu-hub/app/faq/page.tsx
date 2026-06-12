'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const faqCategories = [
  { id: 'enrollment', label: 'Enrollment', icon: '📝' },
  { id: 'courses', label: 'Courses', icon: '📚' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'resources', label: 'Resources', icon: '📁' },
  { id: 'technical', label: 'Technical', icon: '💻' },
  { id: 'other', label: 'Other', icon: '❓' }
];

export default function FAQPage() {
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState('enrollment');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'enrollment'
  });

  const [faqs] = useState([
    {
      id: '1',
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, go to the Enrollment section in your dashboard, browse available courses, and click the Enroll button. Your enrollment will be processed immediately.',
      category: 'enrollment'
    },
    {
      id: '2',
      question: 'What is the maximum course load?',
      answer: 'Students can enroll in a maximum of 6 courses per semester. Please contact your academic advisor if you need an exception.',
      category: 'enrollment'
    },
    {
      id: '3',
      question: 'How do I download course materials?',
      answer: 'Course materials are available in the Resources section. Click on any course to view and download all available materials.',
      category: 'resources'
    },
    {
      id: '4',
      question: 'Are there refunds for late drops?',
      answer: 'Course drops submitted before the deadline receive full refunds. Late drops may be subject to a 50% refund. Check the academic calendar for specific dates.',
      category: 'courses'
    }
  ]);

  const filteredFAQs = faqs.filter(faq => faq.category === selectedCategory);

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save to Supabase
    console.log('New FAQ:', newFAQ);
    setNewFAQ({ question: '', answer: '', category: 'enrollment' });
    setShowForm(false);
    alert('FAQ added successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
              <p className="text-slate-400 mt-1">Find answers to common questions</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                + Add FAQ
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admin Form */}
        {showForm && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add New FAQ</h2>
            
            <form onSubmit={handleAddFAQ} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Question *</label>
                <input
                  type="text"
                  required
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:outline-none transition"
                  placeholder="Enter the question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Answer *</label>
                <textarea
                  required
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:outline-none transition"
                  placeholder="Enter the answer..."
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ({...newFAQ, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:outline-none transition"
                >
                  {faqCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add FAQ
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-xl">
              <p className="text-slate-400 text-lg">No FAQs in this category yet</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition"
              >
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition"
                >
                  <h3 className="text-lg font-semibold text-white text-left">{faq.question}</h3>
                  <span className={`text-2xl transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {expandedId === faq.id && (
                  <div className="px-6 pb-4 border-t border-slate-700">
                    <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
