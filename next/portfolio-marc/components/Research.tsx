'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Research = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const publications = [
    {
      title: 'Machine Learning Applications in Distributed Systems',
      authors: 'Your Name, Professor Name, et al.',
      venue: 'Harvard Computer Science Review',
      year: '2024',
      type: 'Journal Article',
      description: 'Explored novel approaches to applying machine learning techniques in distributed computing environments.',
      link: '#',
    },
    {
      title: 'Optimizing Neural Network Architectures for Edge Computing',
      authors: 'Your Name, Collaborator Name',
      venue: 'ACM Conference on Computing Systems',
      year: '2023',
      type: 'Conference Paper',
      description: 'Presented research on developing efficient neural network architectures optimized for edge device deployment.',
      link: '#',
    },
  ]

  const projects = [
    {
      title: 'AI-Powered Research Assistant',
      advisor: 'Professor Name',
      institution: 'Harvard University',
      period: 'Fall 2023 - Present',
      description: 'Developing an intelligent research assistant using large language models to help researchers navigate academic literature and generate insights.',
      technologies: ['Python', 'LangChain', 'Flowise', 'React'],
    },
    {
      title: 'Distributed Computing Framework',
      advisor: 'Professor Name',
      institution: 'Harvard University',
      period: 'Spring 2023',
      description: 'Designed and implemented a scalable distributed computing framework for processing large-scale data analytics workloads.',
      technologies: ['Go', 'Kubernetes', 'Docker', 'Apache Kafka'],
    },
  ]

  return (
    <section
      id="research"
      className="py-20 bg-gray-50 dark:bg-gray-800"
      ref={ref}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
            Research & Publications
          </h2>
          <div className="w-24 h-1 bg-primary-500"></div>
        </motion.div>

        {/* Publications */}
        <div className="mb-16">
          <h3 className="text-2xl font-serif font-bold mb-8 text-gray-900 dark:text-white">
            Publications
          </h3>
          <div className="space-y-8">
            {publications.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-900 p-6 border-l-4 border-primary-500 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                  <h4 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
                    {pub.title}
                  </h4>
                  <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {pub.year}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2 italic">
                  {pub.authors}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-semibold">{pub.venue}</span> • {pub.type}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {pub.description}
                </p>
                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm flex items-center gap-2"
                  >
                    Read Paper
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Research Projects */}
        <div>
          <h3 className="text-2xl font-serif font-bold mb-8 text-gray-900 dark:text-white">
            Research Projects
          </h3>
          <div className="space-y-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: (publications.length + index) * 0.2 }}
                className="bg-white dark:bg-gray-900 p-6 border-l-4 border-primary-500 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                  <h4 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.period}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <span className="font-semibold">Advisor:</span> {project.advisor} • {project.institution}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Research




