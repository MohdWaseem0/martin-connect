'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', portfolio: '', resumeName: '' });
  const [submitted, setSubmitted] = useState(false);

  const internalJobs = [
    {
      id: 'int-1',
      title: 'Senior Product Designer',
      department: 'Design',
      location: 'Mumbai (Hybrid)',
      type: 'Full-time',
      desc: 'Shape the next generation of our ATS and seeker assessment platforms. Collaborate directly with engineering and product leaders to research, construct, and launch sleek features.',
    },
    {
      id: 'int-2',
      title: 'Senior Frontend Engineer (Next.js)',
      department: 'Engineering',
      location: 'Bangalore (On-site)',
      type: 'Full-time',
      desc: 'Build high-performance, responsive React portals. Optimize load timelines, coordinate design system abstractions, and implement rich micro-interactions.',
    },
    {
      id: 'int-3',
      title: 'AI Engineering Specialist',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      desc: 'Optimize semantic matching modules, construct automated query pipelines, and maintain conversational AI interview chat systems.',
    },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSelectedJob(null);
      setSubmitted(false);
      setFormData({ name: '', email: '', portfolio: '', resumeName: '' });
      alert('Application submitted successfully!');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xxl">
        {/* Intro */}
        <section className="text-center mb-xl">
          <h1 className="font-display-md text-display-md text-on-surface mb-md">Join Our Team</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Build the infrastructure powering modern hiring across India. We are recruiting talented designers, engineers, and creators.
          </p>
        </section>

        {/* Listings */}
        <section className="max-w-4xl mx-auto space-y-lg mb-xxl w-full">
          <h2 className="font-title-lg text-title-lg text-on-surface border-b border-outline-variant/30 pb-sm mb-lg">
            Active Openings
          </h2>
          <div className="space-y-md">
            {internalJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-lg rounded-xl border border-outline-variant/40 soft-sharp-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-md hover:border-primary-container transition-all group"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-sm mb-xs">
                    <h3 className="font-title-md text-title-md font-bold group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <span className="font-mono-label text-[11px] bg-surface-container px-2 py-0.5 text-on-surface-variant rounded">
                      {job.department}
                    </span>
                  </div>
                  <p className="font-body-sm text-outline mb-md">
                    {job.location} • {job.type}
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
                    {job.desc}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJob(job.title)}
                  className="bg-primary-container text-white px-lg py-md rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all w-full md:w-auto cursor-pointer text-[14px]"
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Apply Modal Drawer */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex justify-end">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full max-w-[480px] bg-white h-full shadow-2xl p-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-outline-variant pb-sm mb-lg">
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface">Apply for Role</h3>
                      <p className="font-body-sm text-outline">{selectedJob}</p>
                    </div>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleApply} className="space-y-md">
                    <div>
                      <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Full Name</label>
                      <input
                        required
                        className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Email Address</label>
                      <input
                        required
                        className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Portfolio Link (Optional)</label>
                      <input
                        className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                        type="url"
                        placeholder="https://behance.net/john"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Resume Upload</label>
                      <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-lg text-center bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-outline text-[32px] mb-xs">upload_file</span>
                        <p className="font-body-md text-on-surface-variant mb-xs">
                          {formData.resumeName || 'Click to select or drop PDF'}
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          id="careers-file-picker"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files[0]) {
                              setFormData({ ...formData, resumeName: files[0].name });
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('careers-file-picker')?.click()}
                          className="text-primary font-bold hover:underline bg-transparent border-none text-[13px] cursor-pointer"
                        >
                          Select File
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitted}
                      className="w-full bg-primary-container text-white py-md font-bold hover:brightness-110 active:scale-95 transition-all text-[14px] mt-lg flex items-center justify-center gap-xs cursor-pointer"
                    >
                      {submitted ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          Submitting Application...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
