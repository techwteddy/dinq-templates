'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

type Project = {
  title: string
  description: string
  technologies: string[]
  image: string
  link?: string
  github?: string
  featured?: boolean
}

const isImagePath = (src: string) => src.startsWith('/') || src.includes('.')

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selected, setSelected] = useState<Project | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  const projects: Project[] = [
    {
      title: 'Transportation Management System',
      description:
        'A streamlined Admin-Only Transportation Management System built with Next.js 14+ and Supabase. Features secure authentication, role-based access control (supervisor/admin), vehicle and driver management, reservation scheduling with availability checking, automated trip ticket generation, and comprehensive inventory tracking with low stock alerts.',
      technologies: ['Next.js 14+', 'TypeScript', 'Supabase', 'Tailwind CSS', 'PostgreSQL', 'Row Level Security'],
      image: '/Transportation.png',
      link: 'https://transpo-tms.vercel.app/login',
      github: 'https://github.com/1mRen/Transportation',
      featured: true,
    },
    {
      title: 'UCCP Merch Store',
      description:
        'A Next.js 14+ (App Router) merchandise ordering portal for the University Council. Students can browse products with video teasers, order by batch, and track their status. Admins have a full dashboard to manage orders, update statuses, and post rich-text announcements.',
      technologies: ['Next.js 14+', 'App Router', 'TypeScript', 'Tailwind CSS'],
      image: '/uccp-merch.png',
      link: 'https://www.uccp-merch.store/',
      featured: true,
    },
    {
      title: 'BoardingBuddy',
      description:
        'A mobile-first boarding house rental and management platform connecting tenants and landlords. Built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and powered by Supabase for authentication, database, and real-time features.',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Supabase'],
      image: '/boardingbuddy.png',
      link: 'https://boardingbuddy-finder-app.vercel.app/',
      featured: true,
    },
    {
      title: 'Transportation Service Management System',
      description:
        'A web-based system developed for Database Management Systems 2 (DBMS-2) subject. Streamlines the process of managing transportation service requests, schedules, and records. Features include service request tracking, admin dashboard, driver and vehicle management, and user authentication.',
      technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
      image: '🚌',
      link: '#',
      github: 'https://github.com/1mRen/Transportation_Service_Mangement_Website',
      featured: false,
    },
    {
      title: 'HomeHive',
      description:
        'A compliance project for EL-Net Subject built with ASP.NET MVC. A comprehensive web application for managing home subdivision amenities, status, and community resources. Features user management, CRUD operations, and administrative controls.',
      technologies: ['C#', 'ASP.NET MVC', '.NET', 'SQL', 'HTML', 'CSS', 'JavaScript'],
      image: '/HomeHive.png',
      link: '#',
      github: 'https://github.com/1mRen/Home_Subdiv_Web',
    },
    {
      title: 'User Management System',
      description:
        'A robust user management system designed to handle user authentication, authorization, and profile management. Features include user registration, login, role-based access control, and user administration capabilities.',
      technologies: ['JavaScript', 'Node.js', 'SQL', 'HTML', 'CSS'],
      image: '/user-management.png',
      link: '#',
      github: 'https://github.com/1mRen/user-management-system',
    },
    {
      title: 'Fabriqly',
      description:
        'A collaborative project featuring modern web development practices. Built with a focus on user experience and efficient functionality.',
      technologies: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
      image: '/fabriqly.png',
      link: '#',
      github: 'https://github.com/Fabriqly/Fabriqly',
    },
  ]

  return (
    <>
      <section id="projects" className="py-20 bg-white dark:bg-gray-900" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
              Projects
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onClick={() => setSelected(project)}
                className={`cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group ${
                  project.featured ? 'md:col-span-2 border-2 border-primary-500' : ''
                }`}
              >
                <div
                  className={
                    isImagePath(project.image)
                      ? `relative w-full overflow-hidden ${project.featured ? 'h-64 sm:h-72' : 'h-48'}`
                      : `h-48 flex items-center justify-center text-8xl bg-gradient-to-br from-primary-400 to-primary-600`
                  }
                >
                  {isImagePath(project.image) ? (
                    <>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 896px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-lg flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </span>
                      </div>
                    </>
                  ) : (
                    <span>{project.image}</span>
                  )}
                  {project.featured && (
                    <span className="absolute top-4 right-4 z-10 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-20 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image side */}
              <div className="lg:w-3/5 relative bg-gray-100 dark:bg-gray-800 flex-shrink-0" style={{ minHeight: '280px' }}>
                {isImagePath(selected.image) ? (
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-9xl bg-gradient-to-br from-primary-400 to-primary-600">
                    {selected.image}
                  </div>
                )}
                {selected.featured && (
                  <span className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Featured
                  </span>
                )}
              </div>

              {/* Details side */}
              <div className="lg:w-2/5 flex flex-col justify-between p-8 overflow-y-auto">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {selected.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    {selected.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selected.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {selected.link && selected.link !== '#' && (
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {selected.github && selected.github !== '#' && (
                    <a
                      href={selected.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Projects
