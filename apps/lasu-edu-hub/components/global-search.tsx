'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Mock search results - in real app, query Supabase
    const mockResults = [
      { type: 'course', title: 'Introduction to Computer Science', url: '/enroll', icon: '📚' },
      { type: 'faculty', title: 'Dr. John Doe - Computer Science', url: '/faculty', icon: '👨‍🏫' },
      { type: 'event', title: 'Annual Seminar on Technology', url: '/events', icon: '📅' },
      { type: 'faq', title: 'How do I enroll in a course?', url: '/faq', icon: '❓' },
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setResults(mockResults);
  }, []);

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
      >
        🔍
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full mt-2 right-0 w-80 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-slate-700">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search courses, faculty, events..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {searchQuery.length < 2 ? (
                  <div className="p-4 text-center text-slate-400">
                    <p>Type to search...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">
                    <p>No results found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700">
                    {results.map((result, idx) => (
                      <Link key={idx} href={result.url}>
                        <div className="p-4 hover:bg-slate-800 transition cursor-pointer flex items-start gap-3">
                          <span className="text-lg">{result.icon}</span>
                          <div>
                            <p className="text-white font-medium">{result.title}</p>
                            <p className="text-slate-400 text-xs capitalize">{result.type}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
