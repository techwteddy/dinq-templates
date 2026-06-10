"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { blogs } from "#site/content";

type Blog = typeof blogs[0];

interface BlogCategoryAccordionProps {
  categories: {
    name: string;
    posts: Blog[];
  }[];
}

function SmallBlogCard({ blog }: { blog: Blog }) {
  return (
    <Link 
      href={blog.permalink}
      className="group block p-6 rounded-2xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-accent/40 dark:hover:border-accent/40 shadow-sm hover:shadow-lg transition-all backdrop-blur-md relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl transition-all group-hover:scale-150 group-hover:bg-primary/10 dark:group-hover:bg-primary/20" />
      <div className="relative z-10 flex-1 flex flex-col">
        <p className="text-xs text-primary font-semibold mb-3 tracking-wide uppercase">{new Date(blog.date).toLocaleDateString()}</p>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{blog.title}</h3>
        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 mt-auto">{blog.description}</p>
      </div>
    </Link>
  );
}

export function BlogCategoryAccordion({ categories }: BlogCategoryAccordionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    setActiveCategory(current => current === categoryName ? null : categoryName);
  };

  return (
    <div className="w-full flex flex-col gap-16 mt-24">
      {categories.map((category) => {
        const isInteractive = category.posts.length >= 4;
        const isExpanded = activeCategory === category.name;
        
        return (
          <div key={category.name} className="flex flex-col border-b border-black/5 dark:border-white/5 pb-16 last:border-b-0 relative">
            <div className="absolute -left-4 top-4 bottom-4 w-px bg-border z-0 hidden lg:block border-l border-dashed border-black/10 dark:border-white/10" />
            
            {isInteractive ? (
              <button 
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between w-full text-left group mb-8 focus:outline-none relative z-10"
              >
                <div className="flex items-center gap-4">
                  <div className="hidden lg:block absolute -left-5 h-2 w-2 rounded-full border border-background bg-primary shadow-sm transition-all group-hover:scale-150" />
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
                    {category.name} <span className="text-xl text-primary/60 ml-2 font-sans tracking-normal font-medium">({category.posts.length})</span>
                  </h2>
                </div>
                <div className={`p-3 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent ${isExpanded ? "rotate-180" : ""}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            ) : (
              <div className="mb-8 relative z-10 flex items-center gap-4">
                <div className="hidden lg:block absolute -left-5 h-2 w-2 rounded-full border border-background bg-foreground/30 shadow-sm" />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground/90">
                  {category.name} <span className="text-xl text-foreground/40 ml-2 font-sans tracking-normal font-medium">({category.posts.length})</span>
                </h2>
              </div>
            )}
            
            <div className="relative z-10 w-full overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                {!isExpanded ? (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {category.posts.slice(0, 3).map(post => (
                      <SmallBlogCard key={post.slug} blog={post} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {category.posts.map(post => (
                      <SmallBlogCard key={post.slug} blog={post} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
