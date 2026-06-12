'use client';

import { motion } from 'framer-motion';
import { Timer, ListChecks, Flame, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'Focus Timer',
    description: 'Pomodoro-style sessions with break reminders and streak tracking.',
    icon: Timer,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Smart Tasks',
    description: 'AI categorizes and prioritizes tasks so you always know what matters next.',
    icon: ListChecks,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Habit Streaks',
    description: 'Build atomic habits with daily check-ins and visual streak heatmaps.',
    icon: Flame,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'Daily Insights',
    description: 'Personalized AI suggestions based on your productivity patterns.',
    icon: Sparkles,
    color: 'bg-accent-50 text-accent-600',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
            Everything you need to stay in flow
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Four powerful tools. One simple app. Designed for deep work and daily momentum.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 hover:shadow-md transition"
            >
              <div className={`inline-flex rounded-lg p-3 ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
