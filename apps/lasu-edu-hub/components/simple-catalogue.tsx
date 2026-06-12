'use client';

import Link from 'next/link';

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const services: ServiceItem[] = [
  {
    icon: '📚',
    title: 'Academics',
    description: 'Explore our full curriculum across departments including Biology Education, Chemistry, Computer Science, Educational Technology, Mathematics, and Physics Education.',
    href: '/academics',
  },
  {
    icon: '📖',
    title: 'Resources',
    description: 'Access a curated collection of educational materials: lecture notes, videos, research papers, laboratory guides, past exams, and textbooks.',
    href: '/resources',
  },
  {
    icon: '📰',
    title: 'News',
    description: 'Stay informed with official announcements, event schedules, seminars, examination timetables, and departmental updates.',
    href: '/news',
  },
];

export function SimpleCatalogue() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover the core offerings of STE Hub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group relative p-8 rounded-lg bg-gradient-to-br from-white to-accent/5 border-2 border-accent/20 hover:border-accent hover:shadow-xl transition-all duration-300"
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 w-1 h-12 bg-accent rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-foreground/70 mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform">
                Learn More →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
