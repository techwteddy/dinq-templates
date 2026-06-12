'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OnboardingProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: '👋',
      title: 'Welcome to LASU STESA',
      description: 'Science, Technology, Engineering and Skills Services for Africa',
      content: 'We are excited to have you join our educational community. This platform provides comprehensive resources for your academic journey.',
    },
    {
      icon: '📚',
      title: 'Access Courses & Resources',
      description: 'Learn at your own pace',
      content: 'Browse our extensive catalog of courses, tutorials, and learning materials from the Department of Science and Technology Education.',
    },
    {
      icon: '🎓',
      title: 'Stay Updated',
      description: 'Get the latest announcements',
      content: 'Receive important departmental updates, news, and opportunities to enhance your learning experience.',
    },
    {
      icon: '✨',
      title: 'We Are LASU We Are Great',
      description: 'Join the legacy of excellence',
      content: 'Be part of a prestigious institution committed to academic excellence, innovation, and leadership in science and technology education.',
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 animate-fade-in-up">
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden border-2 border-accent/20">
          {/* Content Area */}
          <div className="p-8 sm:p-12 text-center space-y-8 min-h-96 flex flex-col justify-center">
            {/* Icon */}
            <div className="text-7xl sm:text-8xl animate-bounce">{currentStep.icon}</div>

            {/* Title */}
            <div className="space-y-2 animate-fade-in-up">
              <h2 className="text-4xl sm:text-5xl font-bold text-primary">{currentStep.title}</h2>
              <p className="text-lg text-secondary font-semibold">{currentStep.description}</p>
            </div>

            {/* Description */}
            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl mx-auto animate-fade-in-up">
              {currentStep.content}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 py-4">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === step ? 'bg-accent w-8' : 'bg-primary/30 w-2 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  step === 0
                    ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>

            {/* Skip option */}
            {step < steps.length - 1 && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onComplete, 300);
                }}
                className="text-foreground/60 hover:text-foreground text-sm underline decoration-accent/30 hover:decoration-accent transition-colors"
              >
                Skip tutorial
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
