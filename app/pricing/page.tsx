'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<'recruiter' | 'seeker'>('recruiter');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Can I change my plan at any time?',
      a: 'Yes, you can upgrade or downgrade your plan at any point. If you upgrade, the new features will be available immediately and the price will be prorated.',
    },
    {
      q: 'What happens after my 14-day trial?',
      a: "Once your trial ends, you'll be automatically transitioned to the Growth plan. You can cancel at any time during the trial period to avoid being charged.",
    },
    {
      q: 'How does the "AI automated screening" work?',
      a: 'Our AI analyzes candidate resumes against your specific job description, scoring them on technical skills, experience, and cultural fit to prioritize the best candidates.',
    },
    {
      q: 'Is there a discount for annual billing?',
      a: 'We currently offer a 20% discount on all recruiter plans when billed annually. Contact our sales team for custom billing cycles.',
    },
    {
      q: 'Can I use Martin Connect for free?',
      a: 'Absolutely. Our Starter plan is free forever for small teams and independent recruiters who only need to manage a few active job listings.',
    },
    {
      q: 'Do you offer specialized support for Enterprise?',
      a: 'Yes, Enterprise clients get a dedicated account manager, technical onboarding assistance, and 24/7 priority support with a guaranteed response time.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="max-w-container-max mx-auto px-lg py-xxl w-full flex-grow">
        {/* Header Section */}
        <section className="text-center mb-xl">
          <h1 className="font-display-md text-display-md text-on-surface mb-md">Simple, Transparent Pricing</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Scalable solutions for independent recruiters and global enterprises. No hidden fees, just high-performance hiring.
          </p>
        </section>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-xl">
          <div className="bg-surface-container p-unit rounded-full flex gap-xs">
            <button
              onClick={() => setActiveTab('recruiter')}
              className={`px-xl py-sm rounded-full font-title-sm text-title-sm transition-all duration-300 cursor-pointer ${
                activeTab === 'recruiter' ? 'bg-secondary text-white' : 'text-outline hover:text-on-surface'
              }`}
            >
              For Recruiters
            </button>
            <button
              onClick={() => setActiveTab('seeker')}
              className={`px-xl py-sm rounded-full font-title-sm text-title-sm transition-all duration-300 cursor-pointer ${
                activeTab === 'seeker' ? 'bg-secondary text-white' : 'text-outline hover:text-on-surface'
              }`}
            >
              For Job Seekers
            </button>
          </div>
        </div>

        {/* Pricing Plans Wrapper */}
        <div className="relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'recruiter' ? (
              <motion.div
                key="recruiter"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl items-stretch"
              >
                {/* Recruiter - Starter */}
                <div className="bg-white border border-outline-variant rounded-xl p-lg soft-sharp-shadow hover:active-pill-border transition-all flex flex-col justify-between">
                  <div>
                    <div className="mb-xl">
                      <h3 className="font-title-lg text-title-lg mb-xs">Starter</h3>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-headline-md text-headline-md">₹0</span>
                        <span className="font-body-md text-body-md text-outline">/ month</span>
                      </div>
                    </div>
                    <ul className="space-y-md mb-xl">
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> 3 active jobs
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> 50 CV views
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> Basic analytics
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-md border border-primary text-primary font-bold hover:bg-primary-fixed transition-colors uppercase tracking-wider text-sm rounded-none cursor-pointer">
                    Start Free
                  </button>
                </div>

                {/* Recruiter - Growth (Featured) */}
                <div className="bg-white rounded-xl p-lg shadow-2xl relative border-2 border-primary flex flex-col justify-between transform md:scale-105 z-10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface-container-highest text-primary border border-primary px-lg py-1 rounded font-mono-label text-[11px] font-bold uppercase tracking-widest shadow-sm">
                    Most Popular
                  </div>
                  <div>
                    <div className="mb-xl pt-2">
                      <h3 className="font-title-lg text-title-lg mb-xs">Growth</h3>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-headline-md text-headline-md">₹4,999</span>
                        <span className="font-body-md text-body-md text-outline">/ month</span>
                      </div>
                    </div>
                    <ul className="space-y-md mb-xl">
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> 25 active jobs
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> Unlimited CV views
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> 3 Featured slots
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> ATS pipeline integration
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> Priority support
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-md bg-primary-container text-white font-bold shadow-md hover:brightness-110 transition-all uppercase tracking-wider text-sm rounded-none cursor-pointer">
                    Start 14-day Free Trial
                  </button>
                </div>

                {/* Recruiter - Enterprise */}
                <div className="bg-white border border-outline-variant rounded-xl p-lg soft-sharp-shadow hover:active-pill-border transition-all flex flex-col justify-between">
                  <div>
                    <div className="mb-xl">
                      <h3 className="font-title-lg text-title-lg mb-xs">Enterprise</h3>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-headline-md text-headline-md">Custom</span>
                      </div>
                    </div>
                    <ul className="space-y-md mb-xl">
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> Unlimited jobs
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> Dedicated account manager
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> AI automated screening
                      </li>
                      <li className="flex items-center gap-sm font-body-md text-body-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> SSO & Security compliance
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-md border border-inverse-surface text-inverse-surface font-bold hover:bg-surface-container transition-colors uppercase tracking-wider text-sm rounded-none cursor-pointer">
                    Contact Sales
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="seeker"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl items-stretch"
              >
                {/* Seeker - Free */}
                <div className="bg-white border border-outline-variant rounded-xl p-lg soft-sharp-shadow flex flex-col justify-between">
                  <div>
                    <div className="mb-md">
                      <h3 className="font-title-md text-title-md uppercase">Free</h3>
                      <p className="font-body-sm text-body-sm text-outline">Basic access</p>
                    </div>
                    <ul className="space-y-sm mb-lg">
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span> Profile building
                      </li>
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span> Job search
                      </li>
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span> Quick apply
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-sm border border-outline text-outline rounded font-bold cursor-pointer hover:bg-surface-container-low transition-colors">
                    Current Plan
                  </button>
                </div>

                {/* Seeker - Prime */}
                <div className="bg-white border border-secondary rounded-xl p-lg soft-sharp-shadow active-pill-border flex flex-col justify-between">
                  <div>
                    <div className="mb-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-title-md text-title-md text-secondary">PRIME</h3>
                        <span className="font-title-sm text-title-sm">₹499/mo</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-outline">Get noticed faster</p>
                    </div>
                    <ul className="space-y-sm mb-lg">
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span> Resume priority
                      </li>
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span> Profile boost
                      </li>
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span> Salary insights
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-sm bg-secondary text-white rounded font-bold cursor-pointer hover:brightness-110 transition-all">
                    Upgrade to Prime
                  </button>
                </div>

                {/* Seeker - Prime+ */}
                <div className="bg-inverse-surface border border-outline-variant rounded-xl p-lg shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="mb-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-title-md text-title-md text-white">PRIME+</h3>
                        <span className="font-title-sm text-title-sm text-white">₹999/mo</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-outline-variant">Ultimate career edge</p>
                    </div>
                    <ul className="space-y-sm mb-lg text-white">
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">check</span> All Prime benefits
                      </li>
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">check</span> AI career coaching
                      </li>
                      <li className="flex items-center gap-sm font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">check</span> Recruiter visibility
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-sm bg-primary-container text-white rounded font-bold cursor-pointer hover:brightness-110 transition-all">
                    Go Prime+
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logo Strip */}
        <section className="mb-xxl overflow-hidden mt-xl">
          <h4 className="text-center font-mono-label text-mono-label text-outline uppercase tracking-widest mb-lg">
            Trusted by Industry Leaders
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-xl opacity-60 grayscale hover:grayscale-0 transition-all select-none">
            <div className="h-12 w-32 flex items-center justify-center font-headline-sm text-headline-sm font-bold text-outline">GLOBAL-X</div>
            <div className="h-12 w-32 flex items-center justify-center font-headline-sm text-headline-sm font-bold text-outline">TECHNO</div>
            <div className="h-12 w-32 flex items-center justify-center font-headline-sm text-headline-sm font-bold text-outline">INNOVATE</div>
            <div className="h-12 w-32 flex items-center justify-center font-headline-sm text-headline-sm font-bold text-outline">NEXUS</div>
            <div className="h-12 w-32 flex items-center justify-center font-headline-sm text-headline-sm font-bold text-outline">CORE-IT</div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-xxl w-full">
          <h2 className="font-headline-md text-headline-md text-center mb-xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-md">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-outline-variant">
                <button
                  className="w-full py-lg flex justify-between items-center text-left hover:text-primary transition-colors cursor-pointer"
                  onClick={() => toggleFaq(idx)}
                >
                  <span className="font-title-md text-title-md font-bold text-on-surface">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="material-symbols-outlined text-outline"
                  >
                    expand_more
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-lg font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
