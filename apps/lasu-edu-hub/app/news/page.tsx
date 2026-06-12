'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ModuleLoading } from '@/components/module-loading';
import { getNews, NewsItem } from '@/lib/storage';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNews(data);
      } catch (error) {
        console.error('[v0] Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(
    item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">News & Updates</h1>
          <p className="text-lg opacity-90">
            Latest announcements and departmental updates
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search news by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* News Items */}
          {loading ? (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
              <ModuleLoading moduleType="news" />
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="space-y-6">
              {filteredNews.map((item) => (
                <article key={item.id} className="resource-card">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h2 className="text-2xl font-bold text-primary flex-1">{item.title}</h2>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
                    <span>📅 {formatDate(item.date)}</span>
                    <span>✍️ {item.author}</span>
                  </div>

                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-foreground/60">
                {news.length === 0 ? 'No news available yet.' : 'No news matches your search.'}
              </p>
            </div>
          )}

          {/* Total Count */}
          <div className="mt-8 text-center text-foreground/60">
            <p>Showing {filteredNews.length} of {news.length} news items</p>
          </div>
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
