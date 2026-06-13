'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Education = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const education = [
    {
      degree: 'Bachelor of Science in Information Technology',
      institution: 'University of Cebu',
      location: 'Cebu City, Philippines',
      year: 'Present',
      certifications: [
        {
          name: 'CCNAv7: Switching, Routing, and Wireless Essentials',
          year: '2025',
        },
        {
          name: 'CCNAv7: Introduction to Networks',
          year: '2024',
        },
      ],
    },
  ]

  return (
    <section
      id="education"
      className="py-20 bg-white dark:bg-gray-900"
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
            Education
          </h2>
          <div className="w-24 h-1 bg-primary-500"></div>
        </motion.div>

        <div className="space-y-12">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="border-l-4 border-primary-500 pl-8"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    {edu.degree}
                  </h3>
                  <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-1">
                    {edu.institution}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{edu.location}</p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">{edu.year}</p>
                </div>
              </div>

              {edu.certifications && edu.certifications.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Certifications:
                  </p>
                  <div className="space-y-2">
                    {edu.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-primary-100 dark:bg-primary-900/30 rounded"
                      >
                        <span className="text-primary-700 dark:text-primary-300 text-sm font-medium">
                          {cert.name}
                        </span>
                        <span className="text-primary-600 dark:text-primary-400 text-xs">
                          {cert.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education

