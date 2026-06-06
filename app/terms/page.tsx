'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-[800px] mx-auto px-lg py-xxl">
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-lg font-bold border-b border-outline-variant pb-xs">
          Terms of Service
        </h1>
        <p className="font-body-sm text-outline mb-xl">Last Updated: June 04, 2026</p>

        <div className="prose text-on-surface-variant font-body-md leading-relaxed space-y-lg">
          <section className="space-y-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Martin Connect recruitment platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from accessing or utilizing our platform interfaces.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">2. User Account Integrity</h2>
            <p>
              All registered job seekers and recruiters are required to maintain account credential confidentiality. You represent that all details submitted during registration (including candidate skills or company verifications) are accurate and validated.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">3. Acceptable Platform Conduct</h2>
            <p>
              Recruiters may only post genuine hiring listings. Creating spam, fake vacancies, or seeking payment from candidates is strictly prohibited and constitutes grounds for immediate account suspension without refund.
            </p>
          </section>

          <section className="space-y-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">4. Limitation of Liability</h2>
            <p>
              Martin Connect acts as a matching facilitator. We are not liable for candidate interview outcomes, employment contract disputes, or recruiter vetting accuracies.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
