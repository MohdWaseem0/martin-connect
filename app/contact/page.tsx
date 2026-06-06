'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Employer Sourcing', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'Employer Sourcing', message: '' });
      alert('Message received! Our team will contact you within 24 business hours.');
    }, 1500);
  };

  const offices = [
    { city: 'Mumbai HQ', address: '402 Empire Tower, Bandra Kurla Complex, Mumbai, MH - 400051', tel: '+91 22 5555 1024' },
    { city: 'Bangalore Node', address: '88 Tech Park, Indiranagar, Bangalore, KA - 560038', tel: '+91 80 5555 4048' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xxl grid grid-cols-1 md:grid-cols-2 gap-xl items-start">
        {/* Contact Info */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-xl"
        >
          <div>
            <h1 className="font-display-md text-display-md text-on-surface mb-md">Contact Our Team</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-md">
              Need assistance with corporate ATS integration, pricing customization, or resolving account issues? We are ready to assist.
            </p>
          </div>

          <div className="space-y-lg">
            <h3 className="font-title-md text-title-md text-on-surface font-bold">Office Locations</h3>
            <div className="grid grid-cols-1 gap-md">
              {offices.map((office) => (
                <div key={office.city} className="bg-white p-md rounded-xl border border-outline-variant/40 shadow-sm">
                  <h4 className="font-title-sm text-title-sm font-bold text-primary mb-xs">{office.city}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-xs leading-relaxed">{office.address}</p>
                  <p className="font-mono-label text-[12px] text-outline font-medium">Tel: {office.tel}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-lg rounded-xl border border-outline-variant/60 shadow-xl w-full"
        >
          <h2 className="font-title-lg text-title-lg text-on-surface mb-lg font-bold border-b border-outline-variant/20 pb-xs">
            Send Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-md">
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
              <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Subject</label>
              <select
                className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md bg-white"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="Employer Sourcing">Employer Sourcing & Demo</option>
                <option value="Billing">Billing & Subscription Plans</option>
                <option value="Technical Support">Technical Support Helpdesk</option>
                <option value="Partnership">Corporate Partnership Options</option>
              </select>
            </div>
            <div>
              <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Message</label>
              <textarea
                required
                rows={5}
                className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md resize-none"
                placeholder="Describe your inquiry in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                  Sending Message...
                </>
              ) : (
                'Submit Message'
              )}
            </button>
          </form>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
