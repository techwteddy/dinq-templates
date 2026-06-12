'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Navigation } from '@/components/navigation';
import { PremiumFooter } from '@/components/premium-footer';
import Image from 'next/image';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const { data: facultyData } = await supabase
          .from('faculty')
          .select('*')
          .order('name', { ascending: true });

        if (facultyData) {
          setFaculty(facultyData);
          setFilteredFaculty(facultyData);

          // Extract unique departments
          const depts = Array.from(new Set(facultyData
            .map((f: any) => f.department)
            .filter(Boolean)
          )) as string[];
          setDepartments(depts);
        }
      } catch (error) {
        console.error('Error loading faculty:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFaculty();
  }, [supabase]);

  // Filter faculty based on search and department
  useEffect(() => {
    let filtered = faculty;

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(f => f.department === selectedDepartment);
    }

    setFilteredFaculty(filtered);
  }, [searchTerm, selectedDepartment, faculty]);

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
            <p className="text-foreground/60">Loading faculty directory...</p>
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
            Faculty Directory
          </h1>
          <p className="text-xl text-foreground/70 animate-fade-in-up">
            Meet our experienced lecturers and faculty members
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, specialization, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-accent/20 focus:border-accent outline-none transition"
                />
              </div>
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-accent/20 focus:border-accent outline-none transition"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaculty.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaculty.map((member: any, index: number) => (
                <div
                  key={member.id}
                  className="group rounded-2xl bg-white border-2 border-accent/20 overflow-hidden hover:border-accent hover:shadow-2xl transition-all duration-300 hover:scale-105 transform animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Faculty Image */}
                  <div className="relative h-64 bg-gradient-to-br from-accent/20 to-secondary/20 overflow-hidden flex items-center justify-center">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-6xl">👨‍🏫</div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Name */}
                    <h3 className="text-2xl font-bold text-primary mb-1">
                      {member.name}
                    </h3>

                    {/* Title/Specialization */}
                    {member.specialization && (
                      <p className="text-sm font-semibold text-accent mb-4">
                        {member.specialization}
                      </p>
                    )}

                    {/* Department */}
                    {member.department && (
                      <p className="text-xs text-foreground/60 mb-4 bg-accent/10 inline-block px-3 py-1 rounded-full">
                        {member.department}
                      </p>
                    )}

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                        {member.bio}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 text-sm border-t border-accent/20 pt-4">
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-accent">✉️</span>
                          <a href={`mailto:${member.email}`} className="text-accent hover:underline">
                            {member.email}
                          </a>
                        </div>
                      )}

                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-accent">📞</span>
                          <a href={`tel:${member.phone}`} className="text-accent hover:underline">
                            {member.phone}
                          </a>
                        </div>
                      )}

                      {member.office_location && (
                        <div className="flex items-center gap-2">
                          <span className="text-accent">🏢</span>
                          <span className="text-foreground/70">{member.office_location}</span>
                        </div>
                      )}

                      {member.office_hours && (
                        <div className="flex items-center gap-2">
                          <span className="text-accent">🕐</span>
                          <span className="text-foreground/70">{member.office_hours}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Button */}
                    <button className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-all transform hover:scale-105 active:scale-95">
                      Send Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-accent/5 rounded-2xl border-2 border-accent/20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-2xl font-bold text-primary mb-2">No faculty found</p>
              <p className="text-foreground/70">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
}
