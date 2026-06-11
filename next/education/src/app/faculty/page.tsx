'use client';

import { useState } from 'react';
import { authors } from 'content';
import { FacultyCard } from '@/components/faculty-card';
import { Button } from '@/components/ui/button';

export default function FacultyPage() {
  const [filter, setFilter] = useState('All');

  const filteredAuthors = authors.filter((author) => {
    if (filter === 'All') return true;
    return author.department === filter;
  });

  const departments = ['All', 'Computer Science', 'Business', 'Arts'];

  return (
    <div className="container py-8 md:py-12 lg:py-24">
      <div className="flex flex-col items-center gap-4 text-center md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-serif text-4xl leading-tight lg:text-5xl">
            Our Faculty
          </h1>
          <p className="max-w-[800px] text-xl text-muted-foreground">
            Meet the experts shaping the future dedicated to your success.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {departments.map((dept) => (
          <Button
            key={dept}
            variant={filter === dept ? 'default' : 'outline'}
            onClick={() => setFilter(dept)}
            className="rounded-full"
          >
            {dept}
          </Button>
        ))}
      </div>

      <hr className="my-8" />

      {filteredAuthors?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAuthors.map((instructor) => (
            <FacultyCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            No faculty members found in this department.
          </p>
        </div>
      )}
    </div>
  );
}
