'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 bg-brand-950">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-display">
            Ready to reclaim your focus?
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Join thousands using FocusFlow to do deep work, build habits, and finish what matters.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-brand-500 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-brand-400 active:scale-95 transition w-full sm:w-auto"
            >
              Start for Free
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-white/10 px-8 py-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 active:scale-95 transition w-full sm:w-auto"
            >
              Sign in with Google
            </Link>
          </div>
          <p className="mt-4 text-xs text-brand-300">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
