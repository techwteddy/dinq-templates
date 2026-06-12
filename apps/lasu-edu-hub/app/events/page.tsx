'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Navigation } from '@/components/navigation';
import { PremiumFooter } from '@/components/premium-footer';
import Image from 'next/image';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [selectedType, setSelectedType] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        if (eventsData) {
          setEvents(eventsData);
          filterEvents(eventsData, selectedStatus, selectedType);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [supabase]);

  const filterEvents = (allEvents: any[], status: string, type: string) => {
    let filtered = allEvents;

    if (status !== 'all') {
      filtered = filtered.filter(e => e.status === status);
    }

    if (type !== 'all') {
      filtered = filtered.filter(e => e.event_type === type);
    }

    setFilteredEvents(filtered);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    filterEvents(events, status, selectedType);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    filterEvents(events, selectedStatus, type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-accent/20 animate-pulse">
              <svg className="w-12 h-12 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-foreground/60">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 animate-fade-in-up">
            Departmental Events & Seminars
          </h1>
          <p className="text-xl text-foreground/70 animate-fade-in-up">
            Stay updated with upcoming seminars, workshops, and academic events
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-primary mb-3">Event Status</label>
              <div className="flex gap-2 flex-wrap">
                {['all', 'upcoming', 'ongoing', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      selectedStatus === status
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-primary mb-3">Event Type</label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-accent/20 focus:border-accent outline-none transition"
              >
                <option value="all">All Types</option>
                <option value="seminar">Seminar</option>
                <option value="workshop">Workshop</option>
                <option value="lecture">Lecture</option>
                <option value="examination">Examination</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event: any, index: number) => (
                <div
                  key={event.id}
                  className="group rounded-2xl bg-white border-2 border-accent/20 overflow-hidden hover:border-accent hover:shadow-2xl transition-all duration-300 hover:scale-105 transform animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Event Image */}
                  {event.image_url && (
                    <div className="relative h-48 bg-gradient-to-br from-accent/20 to-secondary/20 overflow-hidden">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent text-accent-foreground">
                          {event.event_type}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                      {event.description || 'No description available'}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <span>📅</span>
                        <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.capacity && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <span>👥</span>
                          <span>{event.attendees_count || 0} / {event.capacity} attendees</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-all transform hover:scale-105 active:scale-95">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-accent/5 rounded-2xl border-2 border-accent/20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-2xl font-bold text-primary mb-2">No events found</p>
              <p className="text-foreground/70">Check back later for upcoming events</p>
            </div>
          )}
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
}
