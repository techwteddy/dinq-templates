'use client';

import { useState } from 'react';

interface AdminOnboardingFlowProps {
  onComplete: () => void;
}

export function AdminOnboardingFlow({ onComplete }: AdminOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to LASU Admin Portal',
      description: 'You now have access to manage all content for the LASU STESSA Hub',
      icon: '🎓',
    },
    {
      title: 'Manage Faculty',
      description: 'Add, edit, or remove faculty members with their courses, specializations, and contact information',
      icon: '👨‍🏫',
    },
    {
      title: 'Create Events',
      description: 'Schedule seminars, workshops, and lectures. Upload images and videos for each event',
      icon: '📅',
    },
    {
      title: 'Manage Courses',
      description: 'Create and manage courses, assign faculty members, set credits and semesters',
      icon: '📚',
    },
    {
      title: 'File Management',
      description: 'Upload and organize resources, materials, and media using drag-and-drop functionality',
      icon: '📁',
    },
    {
      title: 'We are LASU We are Great!',
      description: 'Your admin account is ready. Let\'s build an amazing learning experience together!',
      icon: '⭐',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('admin_onboarding_shown', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('admin_onboarding_shown', 'true');
    onComplete();
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 sm:p-12 border border-accent/20 shadow-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Step {currentStep + 1} of {steps.length}</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-center animate-fade-in-up">
          {/* Icon */}
          <div className="text-6xl drop-shadow-lg">{step.icon}</div>

          {/* Title and Description */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white text-balance">
              {step.title}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Features Grid for current step */}
          {currentStep === 0 && (
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-sm font-semibold text-accent">Multi-Admin Support</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-sm font-semibold text-accent">Secure Access</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-sm font-semibold text-accent">File Uploads</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-sm font-semibold text-accent">Real-time Updates</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 transition-all duration-300 text-sm"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-accent to-primary hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-accent' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
