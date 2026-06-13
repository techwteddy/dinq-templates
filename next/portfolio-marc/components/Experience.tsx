'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Experience = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const experiences = [
    {
      title: 'Tech Support',
      company: 'Tech Support',
      period: 'Present',
      location: 'Cebu City, Philippines',
      responsibilities: [
        'Monitored sell sites, bank site orders (via automation and admin), and failed billings on an hourly/daily basis',
        'Fixed failed forwarding emails and verified storefront integrity daily',
        'Monitored for failed automation runs and verified domains for downtime',
        'Set up stores and fixed automation errors',
        'Created new automations for process improvement',
        'Updated technical guides and MasterList sheets',
      ],
    },
    {
      title: 'Office Assistant',
      company: 'University of Cebu - Transportation Dept',
      period: 'Aug 2022 – Dec 2024',
      location: 'Cebu City, Philippines',
      responsibilities: [
        'Organized files and schedules for transportation department',
        'Handled staff inquiries and provided administrative support',
        'Managed inventory and record keeping',
        'Assisted with daily operations and coordination',
      ],
    },
  ]

  return (
    <section
      id="experience"
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
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-primary-500"></div>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-900 p-6 border-l-4 border-primary-500 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-1">
                    {exp.company}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{exp.location}</p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">{exp.period}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Key Responsibilities:
                </p>
                <ul className="space-y-2">
                  {exp.responsibilities.map((responsibility, i) => (
                    <li
                      key={i}
                      className="text-gray-600 dark:text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-primary-500 mt-1">•</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience




