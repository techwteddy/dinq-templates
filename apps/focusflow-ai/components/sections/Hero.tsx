'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 px-6 pt-24 pb-20 text-white lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center rounded-full bg-brand-800/50 px-3 py-1 text-sm font-medium text-brand-200 ring-1 ring-inset ring-brand-700">
            🚀 Now in early access
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Focus smarter.
            <br />
            Achieve more.
          </h1>
          <p className="mt-6 text-lg leading-8 text-brand-100 max-w-2xl mx-auto">
            FocusFlow AI combines a focus timer, intelligent task manager, habit tracker, and
            daily AI insights — so you spend less time organizing and more time doing.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-brand-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 hover:bg-brand-400 active:scale-95 transition w-full sm:w-auto text-center"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="rounded-xl bg-white/10 px-8 py-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 active:scale-95 transition w-full sm:w-auto text-center"
            >
              See how it works
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 relative mx-auto max-w-sm sm:max-w-lg"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 shadow-2xl">
            <div className="rounded-xl bg-brand-900/60 p-6 text-left ring-1 ring-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-auto text-xs text-brand-300">FocusFlow v1.0</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                  <span className="text-sm">Deep Work Session</span>
                  <span className="text-sm font-mono text-brand-200">24:12</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3">
                  <span className="inline-block h-2 w-2 rounded-full bg-brand-400" />
                  <span className="text-sm">AI: You focus best between 9-11 AM. Schedule hard tasks then.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
