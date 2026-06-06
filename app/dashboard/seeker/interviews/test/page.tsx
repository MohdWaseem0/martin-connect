'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: number;
  q: string;
  options: string[];
  correct: number;
}

export default function SeekerTestAssessment() {
  const router = useRouter();
  const { updateProfile } = useMartinConnect();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quiz: QuizQuestion[] = [
    {
      id: 1,
      q: 'Which Next.js App Router feature allows dynamic route parameters matching like /jobs/[id]?',
      options: [
        'Dynamic Segment Parameters',
        'Middleware Request Interceptors',
        'React Server Components Routing',
        'Incremental Static Regeneration'
      ],
      correct: 0,
    },
    {
      id: 2,
      q: 'How does React 19 handle DOM ref forwarding on custom elements?',
      options: [
        'By utilizing the legacy forwardRef API wraps',
        'By automatically reading ref properties as standard component props',
        'By requesting custom useImperativeHandle callbacks',
        'React 19 does not allow DOM ref forwarding directly'
      ],
      correct: 1,
    },
    {
      id: 3,
      q: 'Which CSS property is required to enable hardware-accelerated animations on layers?',
      options: [
        'z-index overrides',
        'will-change properties',
        'transform-style preserve-3d',
        'transition-duration delays'
      ],
      correct: 1,
    },
    {
      id: 4,
      q: 'In Tailwind CSS v4, how are custom colors and spacings injected into the utility compile list?',
      options: [
        'Via tailwind.config.ts exports configuration',
        'Via inline style declarations on HTML elements',
        'Via @theme directives declared in CSS stylesheets',
        'v4 does not allow custom token injections'
      ],
      correct: 2,
    }
  ];

  const handleNext = () => {
    if (selectedOpt === null) {
      alert('Please select an option to proceed.');
      return;
    }

    // Check correct answer
    if (selectedOpt === quiz[currentIdx].correct) {
      setScore((prev) => prev + 1);
    }

    if (currentIdx < quiz.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      // Finished
      setQuizFinished(true);
      
      // Update user profile skills to include technical screening clearance badge
      updateProfile({
        skills: ['Passed Technical Assessment (90th percentile)']
      });
    }
  };

  const handleFinishQuiz = () => {
    router.push('/dashboard/seeker/interviews');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto">
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8EEF7] px-lg py-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-xs cursor-pointer" onClick={() => router.push('/dashboard/seeker/interviews')}>
          <span className="material-symbols-outlined text-[20px] text-primary">arrow_back</span>
          <h2 className="font-headline-sm text-[20px] font-bold text-[#081126]">Technical Assessment Console</h2>
        </div>
        <span className="font-mono-label text-[11px] bg-primary/10 text-primary px-3 py-1 rounded font-bold uppercase tracking-wider">
          Phase 5 Screening
        </span>
      </header>

      <main className="flex-grow flex items-center justify-center p-lg bg-surface-container-low/40">
        <div className="w-full max-w-2xl bg-white rounded-xl border border-outline-variant/60 shadow-2xl p-lg">
          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-lg"
              >
                {/* Question tracker */}
                <div className="flex justify-between items-center text-body-sm font-bold border-b border-outline-variant/20 pb-sm mb-lg">
                  <span className="text-primary uppercase tracking-wider font-mono-label text-[11px]">
                    Question {currentIdx + 1} of {quiz.length}
                  </span>
                  <span className="text-outline">Active Timer: 4:00 mins</span>
                </div>

                {/* Question */}
                <h2 className="font-title-lg text-title-lg font-bold text-on-surface leading-snug">
                  {quiz[currentIdx].q}
                </h2>

                {/* Options */}
                <div className="space-y-sm py-md select-none">
                  {quiz[currentIdx].options.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedOpt(idx)}
                      className={`p-md border rounded-xl flex items-center gap-md cursor-pointer transition-all hover:bg-surface-container-low ${
                        selectedOpt === idx
                          ? 'border-primary bg-primary/5 text-primary font-semibold ring-2 ring-primary/10'
                          : 'border-outline-variant/70 bg-white text-on-surface-variant'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono-label text-[11px] font-bold ${
                        selectedOpt === idx ? 'bg-primary text-white border-primary' : 'bg-surface-container text-outline border-outline-variant'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-body-md leading-relaxed">{opt}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="border-t border-outline-variant/20 pt-md flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-xl py-md bg-primary-container text-white rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-xs text-[14px]"
                  >
                    <span>{currentIdx === quiz.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-xl space-y-lg"
              >
                <div className="w-16 h-16 bg-success-green/10 text-success-green rounded-full flex items-center justify-center mx-auto mb-lg">
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Assessment Completed</h2>
                
                <div className="p-lg bg-surface-container-low rounded-xl border border-outline-variant/40 max-w-sm mx-auto shadow-inner">
                  <p className="font-body-md text-outline font-bold uppercase tracking-wider text-[11px]">Final Score</p>
                  <p className="font-display-md text-display-md font-bold text-primary my-sm">
                    {score} / {quiz.length}
                  </p>
                  <p className="font-body-sm text-on-surface-variant font-semibold">
                    {score >= 3 ? 'Excellent! You passed the Phase 5 technical screen.' : 'Assessment logged. Re-evaluations available in 30 days.'}
                  </p>
                </div>

                <p className="text-body-md text-outline max-w-md mx-auto leading-relaxed">
                  Your score and skills matching profile have been updated. Recruiting partners looking for these tags will see verified flags on your applications.
                </p>

                <button
                  onClick={handleFinishQuiz}
                  className="px-xl py-md bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all cursor-pointer text-body-sm"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
