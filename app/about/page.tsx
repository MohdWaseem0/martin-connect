'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function About() {
  const stats = [
    { value: '2.4M+', label: 'Verified Professionals' },
    { value: '15,000+', label: 'Hiring Companies' },
    { value: '98%', label: 'AI Match Accuracy' },
    { value: '24hr', label: 'Average Response Time' },
  ];

  const values = [
    {
      title: 'Decisive Precision',
      desc: 'Our AI algorithms bypass matching noise to deliver only candidates who exactly fit the specified role parameters.',
      icon: 'target',
    },
    {
      title: 'Industrial Scaling',
      desc: 'Engineered to handle staffing spikes, massive applicant flows, and multi-tier organizational recruitment cycles.',
      icon: 'precision_manufacturing',
    },
    {
      title: 'Trust & Transparency',
      desc: 'All candidate credentials and corporate certifications undergo verification to ensure safe platform transactions.',
      icon: 'verified',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="bg-[#081126] text-white py-xxl px-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }}
            ></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10 py-xl">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-headline-lg text-headline-lg mb-md text-white font-bold leading-tight"
            >
              Precision Hiring at Scale
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-body-lg text-body-lg text-outline-variant max-w-2xl mx-auto leading-relaxed"
            >
              Martin Connect is the premier recruitment ecosystem for high-growth enterprise SaaS and industrial leaders in India.
            </motion.p>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-white border-b border-outline-variant/30 py-xl px-lg">
          <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-md"
              >
                <p className="text-[32px] md:text-[40px] font-bold text-primary leading-none mb-xs">{stat.value}</p>
                <p className="font-mono-label text-[11px] font-bold uppercase tracking-wider text-outline">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-container-max mx-auto px-lg py-xxl grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-md"
          >
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
              Our Mission: Eradicate Hiring friction.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Finding the perfect match shouldn't feel like searching for a needle in a haystack. We merge state-of-the-art LLM capabilities with rigorous workspace validation to ensure recruiters and candidates communicate with complete clarity.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant/80 leading-relaxed">
              Headquartered in Mumbai with nodes in Bangalore and Pune, we support India's most dynamic companies to scale their engineering, sales, and analytics pipelines efficiently.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface-container rounded-2xl p-xl border border-outline-variant/40 relative min-h-[300px] flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
            <h3 className="font-title-lg text-title-lg text-primary mb-sm">Martin Connect Ecosystem</h3>
            <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Unified seeker profiles & verification tags
              </li>
              <li className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Drag-and-drop recruiter ATS Kanban workflows
              </li>
              <li className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Superadmin dashboard job moderations
              </li>
              <li className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Real-time AI interviewing chat simulation
              </li>
            </ul>
          </motion.div>
        </section>

        {/* Corporate Values */}
        <section className="bg-surface-container-low py-xxl px-lg">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-sm text-headline-sm text-center mb-xl font-bold tracking-tight">
              Our Core Pillars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {values.map((val, idx) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white p-lg rounded-xl border border-outline-variant/40 soft-sharp-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary mb-md">
                    <span className="material-symbols-outlined">{val.icon}</span>
                  </div>
                  <h3 className="font-title-md text-title-md mb-xs font-bold text-on-surface">{val.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {val.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
