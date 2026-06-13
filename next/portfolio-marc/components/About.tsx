'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      className="py-20 bg-white dark:bg-gray-900"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
            About
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-sm mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg transform rotate-6"></div>
              <div className="relative bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden w-full aspect-[3/4]">
                <Image
                  src="/profile.jpg"
                  alt="Marc Lawrence Magadan"
                  fill
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 384px"
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              I am an IT Graduate at the University of Cebu and an aspiring software developer
              with a passion for creating efficient and innovative solutions. My journey in
              technology has been driven by a strong problem-solving mindset and a dedication
              to continuous learning.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              With professional experience in tech support and system monitoring, I have developed
              expertise in troubleshooting, automation, and process improvement. I specialize in
              creating automation tools that enhance operational efficiency and have hands-on
              experience with various programming languages and frameworks including Python, Java,
              C#, TypeScript, JavaScript, and Next.js.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              My work focuses on building practical solutions that solve real-world problems,
              from e-commerce platforms to transportation management systems. I am committed to
              developing my skills further and contributing to meaningful projects that make a
              positive impact.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  Experience
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tech Support & Automation
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  Projects
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  3+ Featured Projects
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About


