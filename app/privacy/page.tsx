'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-[800px] mx-auto px-lg py-xxl">
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-lg font-bold border-b border-outline-variant pb-xs">
          Privacy Policy
        </h1>
        <p className="font-body-sm text-outline mb-xl">Last Updated: June 04, 2026</p>

        <div className="prose text-on-surface-variant font-body-md leading-relaxed space-y-lg">
          <section className="space-y-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">1. Information Collection</h2>
            <p>
              We collect user-submitted details including name, contact credentials, resume PDFs, and corporate branding information. We also log platform activity data to calculate candidate match scores.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">2. How We Disclose Data</h2>
            <p>
              Candidate profiles (excluding direct contact tokens if restricted) are shared with verified hiring recruiters. Recruiter job posts are listed publically. We do not sell user data to third-party marketing entities.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">3. Security Audits</h2>
            <p>
              We implement industry-standard database encryption, HTTPS tunnels, and access controls to secure candidate dossiers and recruiter logs against unauthorized breaches.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
