import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    }
  },
};

export default function NexusCard() {
  return (
    <div className="relative min-h-screen bg-[#6B7A6B] overflow-hidden noise-overlay">
      <div className="w-full px-6 lg:px-12 py-24 lg:py-32">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* Left Column */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl lg:text-4xl font-semibold text-white leading-tight">
                Your Digital Portfolio
                <span className="scribble-underline relative inline-block mx-2">
                  Evolved
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 100 10"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <path d="M0 5 Q 50 10, 100 5" stroke="currentColor" fill="none" strokeWidth="2" />
                  </motion.svg>
                </span>. A new
                standard for professional art presentation and discoverability.
              </h2>
            </motion.div>

            {/* Nexus Card Preview */}
            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm origin-top-left"
                whileHover={{
                  scale: 1.02,
                  rotate: 2,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <img
                  src="/images/nexus-card.jpg"
                  alt="Nexus Card"
                  className="w-full aspect-[3/4] object-cover"
                />

                {/* Glare Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#9B8B73] rounded-full opacity-40 -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:pt-16">
            <motion.div variants={itemVariants}>
              <p className="body-large text-white/90">
                Comprehensive, shareable snapshot of your{' '}
                <span className="relative inline-block font-medium">
                  creative Identity
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9B8B73]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>. No
                more "find me on Insta". Add it your to your Wallet app and share
                with one click. Let your Nexus Card do the talking while you focus
                on creating.
              </p>
            </motion.div>

            {/* Stats or Features */}
            <motion.div
              className="grid grid-cols-2 gap-6 pt-8"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                }
              }}
            >
              {[
                { val: "1M+", label: "Artists Connected" },
                { val: "50K+", label: "Curators Worldwide" },
                { val: "120+", label: "Countries" },
                { val: "98%", label: "Satisfaction Rate" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="border-l-2 border-white/30 pl-4"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <p className="text-4xl font-bold text-white">{stat.val}</p>
                  <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p className="text-2xl lg:text-3xl font-semibold text-white/80">
            Nexus Card Users Are Creating the Connectory
          </p>
        </motion.div>
      </div>
    </div>
  );
}
