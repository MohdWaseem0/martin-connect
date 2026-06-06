'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { name: 'Job Seeker Help', icon: 'person', desc: 'Manage your profile, apply to listings, upload resumes, and prepare for interviews.' },
    { name: 'Employer Support', icon: 'work', desc: 'Post new listings, customize employer branding profiles, manage candidate pipelines.' },
    { name: 'Billing & Security', icon: 'payments', desc: 'Modify premium subscriptions, check invoice histories, toggle authentication scopes.' },
  ];

  const faqs = [
    { q: 'How do I upload or parse my resume?', a: 'Navigate to "My Profile" in the Job Seeker portal and click the "Upload Resume" button. Our parser will extract your experience details automatically.' },
    { q: 'Can I post listings anonymously?', a: 'No, all company profiles must undergo verification by platform administrators before job listings are approved for public directory visibility.' },
    { q: 'How does candidate matching score calculation work?', a: 'We calculate semantic alignment index scores by comparing candidate experience, skills, and profile parameters with recruiter job requirements.' },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketDesc('');
      alert('Support ticket created! Check email updates for response logs.');
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xxl">
        {/* Banner */}
        <section className="text-center mb-xl bg-surface-container p-xl rounded-2xl border border-outline-variant/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <h1 className="font-display-md text-display-md text-on-surface mb-md">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-full focus:outline-none focus:border-primary text-body-md shadow-sm"
              placeholder="Search help articles, FAQs..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Categories */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl w-full">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-lg rounded-xl border border-outline-variant/40 soft-sharp-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 bg-primary-container/10 text-primary rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <h3 className="font-title-sm text-title-sm font-bold text-on-surface mb-xs">{cat.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <button
                onClick={() => alert(`Redirecting to support documentation for: ${cat.name}`)}
                className="text-primary font-bold hover:underline text-[13px] flex items-center gap-xs mt-lg cursor-pointer bg-transparent border-none text-left"
              >
                Learn More <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </button>
            </motion.div>
          ))}
        </section>

        {/* FAQs list */}
        <section className="max-w-3xl mx-auto mb-xxl w-full">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg text-center">
            Frequently Solved Questions
          </h2>
          <div className="space-y-md bg-white p-lg rounded-xl border border-outline-variant/40 soft-sharp-shadow">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div key={idx} className="pb-md border-b border-outline-variant/20 last:border-0 last:pb-0">
                  <h4 className="font-title-sm text-title-sm font-bold text-on-surface mb-xs">{faq.q}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-outline py-md">No matching articles found.</p>
            )}
          </div>
        </section>

        {/* Create ticket form */}
        <section className="max-w-xl mx-auto w-full bg-white p-lg rounded-xl border border-outline-variant/60 shadow-xl">
          <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-lg border-b border-outline-variant/20 pb-xs">
            Submit Support Ticket
          </h2>
          <form onSubmit={handleTicketSubmit} className="space-y-md">
            <div>
              <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Issue Subject</label>
              <input
                required
                className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                placeholder="Brief summary of issue"
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Problem Description</label>
              <textarea
                required
                rows={4}
                className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md resize-none"
                placeholder="Provide details about what went wrong..."
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitted}
              className="w-full bg-primary-container text-white py-md font-bold hover:brightness-110 active:scale-95 transition-all text-[14px] flex items-center justify-center gap-xs cursor-pointer"
            >
              {submitted ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Submitting Ticket...
                </>
              ) : (
                'Submit Ticket'
              )}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
