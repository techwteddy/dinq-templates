"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  Code,
  Brain,
  Eye,
  BarChart3,
  School,
  Store,
  ExternalLink,
  Download,
  Moon,
  Sun,
  User,
  BookOpen,
  FolderOpen,
  Zap,
} from "lucide-react"

import portfolioData from "@/data/master.json"

interface TypingEffectProps {
  titles: string[]
}

interface NavigationButtonsProps {
  scrollToSection: (sectionId: string) => void
}

interface SocialLinksProps {
  personal: typeof portfolioData.personal
}

interface HeaderProps {
  theme: string
  toggleTheme: () => void
  scrollToTop: () => void
  personal: typeof portfolioData.personal
}

function TypingEffect({ titles }: TypingEffectProps) {
  const [currentTitle, setCurrentTitle] = useState("")
  const [titleIndex, setTitleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typingSpeed = isDeleting ? 30 : 80
    const pauseTime = isDeleting ? 500 : 2000

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < titles[titleIndex].length) {
        setCurrentTitle(titles[titleIndex].substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else if (isDeleting && charIndex > 0) {
        setCurrentTitle(titles[titleIndex].substring(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      } else if (!isDeleting && charIndex === titles[titleIndex].length) {
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false)
        setTitleIndex((titleIndex + 1) % titles.length)
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, titleIndex, titles])

  return (
    <motion.span className="text-primary glow-text" whileHover={{ scale: 1.05 }}>
      {currentTitle}
      <motion.span
        className="inline-block w-0.5 h-6 md:h-8 bg-primary ml-1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
      />
    </motion.span>
  )
}

function NavigationButtons({ scrollToSection }: NavigationButtonsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 mb-8 px-4 max-w-md sm:max-w-none mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3 sm:px-6 py-2 sm:py-3 hover-lift flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          onClick={() => scrollToSection("projects")}
        >
          <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Projects</span>
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          className="w-full border-primary text-primary hover:bg-primary hover:text-white hover-lift bg-transparent font-semibold px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          onClick={() => scrollToSection("education")}
        >
          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Education</span>
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          className="w-full border-accent text-accent hover:bg-accent hover:text-white hover-lift bg-transparent font-semibold px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          onClick={() => scrollToSection("experience")}
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Experience</span>
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white hover-lift bg-transparent font-semibold px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          onClick={() => scrollToSection("skills")}
        >
          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Skills</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}

function SocialLinks({ personal }: SocialLinksProps) {
  return (
    <motion.div
      className="flex justify-center gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <motion.a
        href={personal.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <Linkedin className="h-5 w-5" />
      </motion.a>
      <motion.a
        href={personal.github}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <Github className="h-5 w-5" />
      </motion.a>
      <motion.a
        href={`mailto:${personal.email}`}
        className="p-3 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <Mail className="h-5 w-5" />
      </motion.a>
    </motion.div>
  )
}

function Header({ theme, toggleTheme, scrollToTop, personal }: HeaderProps) {
  const resumeDownloadUrl =
    "https://drive.usercontent.google.com/u/0/uc?id=1CmJ-OefbDgvGbL9f-bp6vrVnpqtjvo4H&export=download"

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.button
          className="text-lg md:text-xl font-bold text-primary cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={scrollToTop}
        >
          <span className="block md:inline">{personal.name}</span>
          <span className="hidden md:inline text-sm font-normal text-muted-foreground ml-2">
            - Data Scientist | AI Engineer | Data Analyst
          </span>
          <span className="block md:hidden text-xs font-normal text-muted-foreground">
            Data Scientist | AI Engineer
          </span>
        </motion.button>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent flex items-center gap-2"
              asChild
            >
              <a href={resumeDownloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                <span>Resume</span>
              </a>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default function Portfolio() {
  // Theme state management
  const [theme, setTheme] = useState("dark")

  // Scroll animation setup
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Utility functions for navigation and theme
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    document.documentElement.classList.toggle("light")
  }

  // Icon mapping utility
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Briefcase,
      Brain,
      Github,
      School,
      BarChart3,
      Eye,
      Code,
      Store,
      GraduationCap,
    }
    return iconMap[iconName] || Briefcase
  }

  const resumeDownloadUrl =
    "https://drive.usercontent.google.com/u/0/uc?id=1CmJ-OefbDgvGbL9f-bp6vrVnpqtjvo4H&export=download"

  return (
    <div className={`min-h-screen wave-bg text-foreground ${theme}`}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Circuit board pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 31%, rgba(139, 92, 246, 0.1) 33%, transparent 34%),
                linear-gradient(-45deg, transparent 30%, rgba(236, 72, 153, 0.1) 31%, rgba(236, 72, 153, 0.1) 33%, transparent 34%)
              `,
              backgroundSize: "400px 400px, 300px 300px, 60px 60px, 60px 60px",
            }}
            animate={{
              backgroundPosition: [
                "0px 0px, 0px 0px, 0px 0px, 0px 0px",
                "400px 400px, -300px -300px, 60px 60px, -60px -60px",
              ],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        {/* Binary code rain effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/20 font-mono text-xs select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
              }}
              animate={{
                y: ["0vh", "110vh"],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 8,
                ease: "linear",
              }}
            >
              {Math.random() > 0.5 ? "1" : "0"}
            </motion.div>
          ))}
        </div>

        {/* Circuit board connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15">
          {[...Array(20)].map((_, i) => {
            const startX = Math.random() * 100
            const startY = Math.random() * 100
            const endX = Math.random() * 100
            const endY = Math.random() * 100

            return (
              <g key={i}>
                <motion.path
                  d={`M ${startX}% ${startY}% L ${(startX + endX) / 2}% ${startY}% L ${(startX + endX) / 2}% ${endY}% L ${endX}% ${endY}%`}
                  stroke="url(#circuitGradient)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0, 0.8, 0.8, 0],
                  }}
                  transition={{
                    duration: 6 + Math.random() * 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 6,
                    ease: "easeInOut",
                  }}
                />
                {/* Circuit nodes */}
                <motion.circle
                  cx={`${startX}%`}
                  cy={`${startY}%`}
                  r="2"
                  fill="currentColor"
                  className="text-primary"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 3,
                  }}
                />
                <motion.circle
                  cx={`${endX}%`}
                  cy={`${endY}%`}
                  r="2"
                  fill="currentColor"
                  className="text-accent"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 3,
                  }}
                />
              </g>
            )
          })}

          {/* Gradient definitions for circuit lines */}
          <defs>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating tech symbols */}
        <div className="absolute inset-0">
          {["⚡", "🔬", "🧠", "📊", "🤖", "💡"].map((symbol, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20 select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                x: [-10, 10, -10],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 12 + Math.random() * 6,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 12,
                ease: "easeInOut",
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "50px 50px"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>
      </div>

      {/* Header Component */}
      <Header theme={theme} toggleTheme={toggleTheme} scrollToTop={scrollToTop} personal={portfolioData.personal} />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
        <motion.div className="container mx-auto px-4 text-center relative z-10" style={{ y }}>
          <div className="max-w-4xl mx-auto">
            {/* Profile Photo - Reduced bounce and made slower */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 1.5,
                type: "spring",
                bounce: 0.3,
                damping: 15,
              }}
            >
              <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-2 hover-glow">
                <motion.img
                  src={portfolioData.personal.photo}
                  alt={`${portfolioData.personal.name}'s professional photo`}
                  className="w-full h-full object-cover rounded-full"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Main Title with Typing Effect */}
            <motion.h1
              className="text-xl md:text-3xl font-bold mb-6 font-sans tracking-wider"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Hey, I am <TypingEffect titles={portfolioData.personal.alternativeTitles} />
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-xl md:text-2xl mb-8 text-muted-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {portfolioData.personal.tagline.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={word === "intelligent" ? "text-accent" : word === "model" ? "text-primary" : ""}
                >
                  {word}{" "}
                </span>
              ))}
            </motion.p>

            {/* Navigation Buttons */}
            <NavigationButtons scrollToSection={scrollToSection} />

            {/* Social Links */}
            <SocialLinks personal={portfolioData.personal} />
          </div>
        </motion.div>
      </section>

      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="neon-border bg-card/80 backdrop-blur-sm mb-16">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                      {/* Animated Illustration */}
                      <motion.div
                        className="flex justify-center mb-6"
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{
                          duration: 6,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <img
                          src="/working-with-cat-new.png"
                          alt="Working with cat illustration"
                          className="w-64 h-64 object-contain"
                        />
                      </motion.div>

                      <p className="text-lg text-muted-foreground leading-relaxed">{portfolioData.personal.summary}</p>

                      <div className="flex gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button asChild className="bg-primary hover:bg-primary/90 hover-lift flex items-center gap-2">
                            <a href={`mailto:${portfolioData.personal.email}`}>
                              <Mail className="h-4 w-4" />
                              <span>Contact Me</span>
                            </a>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            asChild
                            className="border-primary text-primary hover:bg-primary hover:text-white hover-lift bg-transparent flex items-center gap-2"
                          >
                            <a href={resumeDownloadUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              <span>Download Resume</span>
                            </a>
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-4xl font-bold text-center mb-6 text-primary">
                        Why hire me for your next <span className="text-accent">AI project?</span>
                      </h2>

                      <div className="grid grid-cols-2 gap-6">
                        {portfolioData.stats.map((stat, index) => {
                          const IconComponent = getIconComponent(stat.icon)
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.5 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              whileHover={{ scale: 1.05, rotate: 2 }}
                            >
                              <Card className="neon-border bg-card/80 backdrop-blur-sm text-center hover-lift">
                                <CardContent className="p-6">
                                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                    <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                                  </motion.div>
                                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="education" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 text-primary"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              My Academic <span className="text-accent">Journey</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {portfolioData.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  className="perspective-1000"
                >
                  <Card className="neon-border bg-card/80 backdrop-blur-sm hover-lift h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="relative"
                          whileHover={{
                            scale: 1.15,
                            rotate: [0, -10, 10, 0],
                            transition: { duration: 0.4 },
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.img
                            src={edu.logo}
                            alt={`${edu.school} logo`}
                            className="w-12 h-12 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300"
                            onClick={() => window.open(edu.url, "_blank")}
                            whileHover={{
                              rotate: 360,
                              scale: 1.1,
                              transition: { duration: 0.6 },
                            }}
                          />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-accent text-accent">
                              {edu.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{edu.period}</span>
                          </div>
                          <CardTitle className="text-xl font-bold text-foreground mb-1">{edu.degree}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground mb-1">{edu.field}</CardDescription>
                          <p className="text-sm text-accent font-medium">
                            {edu.school}, {edu.location}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">Focus Areas:</h4>
                        <ul className="space-y-2">
                          {edu.focusAreas.map((area, areaIndex) => (
                            <motion.li
                              key={areaIndex}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: areaIndex * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <span className="text-primary mt-1 text-xs">•</span>
                              {area}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 text-primary"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Professional <span className="text-accent">Experience</span>
            </motion.h2>

            {/* Timeline line - hidden on mobile, visible on desktop */}
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-accent to-secondary h-full rounded-full"></div>
              {/* Mobile timeline line - positioned on left */}
              <div className="md:hidden absolute left-8 w-1 bg-gradient-to-b from-primary via-accent to-secondary h-full rounded-full"></div>

              <div className="space-y-12">
                {portfolioData.experience.map((work, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Timeline dot - centered on desktop, left-aligned on mobile */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10 shadow-lg"></div>

                    {/* Mobile layout - single column with date above card */}
                    <div className="md:hidden ml-16">
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <div className="inline-block">
                          <motion.div
                            className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)" }}
                          >
                            {work.period}
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} className="perspective-1000">
                        <Card className="neon-border bg-card/80 backdrop-blur-sm hover-lift h-full">
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <motion.div
                                className="relative overflow-hidden rounded-lg"
                                whileHover={{
                                  scale: 1.2,
                                  rotate: [0, -10, 10, 0],
                                  transition: { duration: 0.4 },
                                }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <img
                                  src={work.companyLogo || "/placeholder.svg"}
                                  alt={`${work.company} logo`}
                                  className="h-16 w-16 object-contain transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                                  onClick={() => window.open(work.companyUrl, "_blank")}
                                />
                              </motion.div>
                              <div className="flex-1">
                                <CardTitle className="text-xl font-bold text-foreground mb-1">{work.title}</CardTitle>
                                <p className="text-sm text-accent font-medium mb-3">
                                  {work.company}, {work.location}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {work.achievements.map((achievement, achievementIndex) => (
                                <motion.li
                                  key={achievementIndex}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: achievementIndex * 0.1 }}
                                  viewport={{ once: true }}
                                >
                                  <span className="text-primary mt-1 text-xs">•</span>
                                  {achievement}
                                </motion.li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Desktop layout - alternating sides */}
                    <div className="hidden md:block">
                      <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? "" : "md:grid-flow-col-dense"}`}
                      >
                        {/* Experience Card */}
                        <motion.div
                          className={`${index % 2 === 0 ? "md:pr-8" : "md:pl-8 md:col-start-2"}`}
                          whileHover={{ scale: 1.02, rotateY: index % 2 === 0 ? 5 : -5 }}
                          className="perspective-1000"
                        >
                          <Card className="neon-border bg-card/80 backdrop-blur-sm hover-lift h-full">
                            <CardHeader>
                              <div className="flex items-start gap-4">
                                <motion.div
                                  className="relative overflow-hidden rounded-lg"
                                  whileHover={{
                                    scale: 1.2,
                                    rotate: [0, -10, 10, 0],
                                    transition: { duration: 0.4 },
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <img
                                    src={work.companyLogo || "/placeholder.svg"}
                                    alt={`${work.company} logo`}
                                    className="h-16 w-16 object-contain transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                                    onClick={() => window.open(work.companyUrl, "_blank")}
                                  />
                                </motion.div>
                                <div className="flex-1">
                                  <CardTitle className="text-xl font-bold text-foreground mb-1">{work.title}</CardTitle>
                                  <p className="text-sm text-accent font-medium mb-3">
                                    {work.company}, {work.location}
                                  </p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {work.achievements.map((achievement, achievementIndex) => (
                                  <motion.li
                                    key={achievementIndex}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: achievementIndex * 0.1 }}
                                    viewport={{ once: true }}
                                  >
                                    <span className="text-primary mt-1 text-xs">•</span>
                                    {achievement}
                                  </motion.li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>

                        <motion.div
                          className={`${index % 2 === 0 ? "md:pl-8 md:text-left" : "md:pr-8 md:text-right md:col-start-1"} text-center md:text-inherit`}
                          initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <div className="inline-block">
                            <motion.div
                              className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-lg"
                              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)" }}
                            >
                              {work.period}
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 text-primary"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Featured <span className="text-accent">Projects</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {portfolioData.projects.map((project, index) => {
                const IconComponent = getIconComponent(project.icon)
                const githubUrls: { [key: string]: string } = {
                  "Bank Customer Churn Prediction": "https://github.com/dev-kanika/Customer_Churn_Prediction",
                  "Tweet Sentiment Analysis": "https://github.com/dev-kanika/Tweet-Sentiment-Analysis",
                  "CrashCal (Car Crash Cost Estimator)": "https://github.com/dev-kanika/CrashCal",
                  "Biomedical LLM Chatbot": "https://github.com/dev-kanika/llm-chatbot-multimodal-rag-bioasq",
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    className="perspective-1000"
                  >
                    <Card
                      className="neon-border bg-card/80 backdrop-blur-sm hover-lift group h-full cursor-pointer transition-all duration-300"
                      onClick={() => window.open(project.githubUrl, "_blank")}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="relative overflow-hidden rounded-lg"
                            whileHover={{
                              scale: 1.2,
                              rotate: [0, -10, 10, 0],
                              transition: { duration: 0.4 },
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img
                              src={project.logo || "/placeholder.svg"}
                              alt={`${project.title} logo`}
                              className="h-16 w-16 object-contain transition-all duration-300 group-hover:brightness-110"
                            />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl font-bold text-primary mb-2">{project.title}</CardTitle>
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                className="text-muted-foreground group-hover:text-primary transition-colors"
                              >
                                <Github className="h-5 w-5" />
                              </motion.div>
                            </div>
                            <CardDescription className="text-sm text-muted-foreground">
                              {project.period}
                            </CardDescription>
                            <div className="text-xs text-accent font-medium mt-1">{project.metrics}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                        {/* Confirming project technologies container is already correctly implemented */}
                        <div className="flex flex-wrap items-center gap-2 mt-4 list-none p-0 m-0">
                          {project.technologies?.map((tech, techIndex) => (
                            <motion.div
                              key={techIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                              viewport={{ once: true }}
                              whileHover={{ scale: 1.1 }}
                              className="inline-flex"
                            >
                              <Badge
                                variant="secondary"
                                className="inline-flex items-center text-xs px-3 py-1.5 bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30 transition-colors whitespace-nowrap rounded-full font-medium"
                              >
                                {tech}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 text-primary"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Tools <span className="text-accent">and Skills</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(portfolioData.skills).map(([category, skillList], categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="neon-border bg-card/80 backdrop-blur-sm hover-lift h-full">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-center text-primary">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {skillList.map((skill, skillIndex) => (
                        <motion.div
                          key={skillIndex}
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: skillIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <motion.span className="text-lg" whileHover={{ scale: 1.3, rotate: 10 }}>
                                {skill.icon}
                              </motion.span>
                              <span className="text-sm font-medium text-foreground">{skill.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div
                              className={`bg-gradient-to-r ${skill.color} h-2 rounded-full`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: skillIndex * 0.1 }}
                              viewport={{ once: true }}
                              whileHover={{
                                boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                                scale: 1.02,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="neon-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold mb-8 text-primary">
                  Let's Build Something <span className="text-accent">Amazing Together</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-12">
                  {
                    "Ready to transform your data into intelligent solutions?\nLet's connect and discuss your next AI project."
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover-lift flex items-center gap-2"
                    >
                      <a
                        href={`mailto:${portfolioData.personal.email}?subject=Let's Connect - AI Project Discussion&body=Hi Kanika,%0D%0A%0D%0AI'd love to discuss a potential AI project with you.%0D%0A%0D%0ABest regards`}
                      >
                        <Mail className="h-5 w-5" />
                        <span>GET IN TOUCH</span>
                      </a>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      asChild
                      size="lg"
                      className="border-primary text-primary hover:bg-primary hover:text-white hover-lift bg-transparent flex items-center gap-2"
                    >
                      <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                        <span>VIEW GITHUB</span>
                      </a>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      asChild
                      size="lg"
                      className="border-primary text-primary hover:bg-primary hover:text-white hover-lift bg-transparent flex items-center gap-2"
                    >
                      <a href={portfolioData.personal.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                        <span>CONNECT ON LINKEDIN</span>
                      </a>
                    </Button>
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
                  <motion.div className="flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }}>
                    <Mail className="h-4 w-4 text-accent" />
                    <span>{portfolioData.personal.email}</span>
                  </motion.div>
                  <motion.div className="flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }}>
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{portfolioData.personal.location}</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
