'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFF] text-[#121b30] font-body-sm text-body-sm border-t border-outline-variant/15 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-xl px-lg py-xxl w-full max-w-container-max mx-auto">
        <div>
          <div className="mb-lg">
            <Logo light={false} size="md" />
          </div>
          <p className="text-outline-variant mb-md pr-md">
            The most decisive recruitment platform for high-growth enterprises in the Indian market. Connecting top talent using AI-driven matching pipelines.
          </p>
          <div className="flex gap-md">
            <span className="material-symbols-outlined text-outline-variant hover:text-[#121b30] cursor-pointer transition-colors">public</span>
            <span className="material-symbols-outlined text-outline-variant hover:text-[#121b30] cursor-pointer transition-colors">hub</span>
            <span className="material-symbols-outlined text-outline-variant hover:text-[#121b30] cursor-pointer transition-colors">rss_feed</span>
          </div>
        </div>
        <div>
          <h4 className="font-title-sm text-title-sm font-bold text-[#121b30] mb-lg">Job Seekers</h4>
          <ul className="flex flex-col gap-sm">
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/jobs">Browse Jobs</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/resources">Career Advice</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/dashboard/seeker/profile">Resume Builder</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/dashboard/seeker/interviews">Interview Prep</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-title-sm text-title-sm font-bold text-[#121b30] mb-lg">Employers</h4>
          <ul className="flex flex-col gap-sm">
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/dashboard/recruiter/jobs/new">Post a Job</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/dashboard/recruiter/resumes">Talent Sourcing</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/dashboard/recruiter/pipeline">ATS Integration</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/pricing">Pricing Plans</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-title-sm text-title-sm font-bold text-[#121b30] mb-lg">Company</h4>
          <ul className="flex flex-col gap-sm">
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/about">About Us</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/careers">Careers</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/terms">Terms of Service</Link></li>
            <li><Link className="text-outline-variant hover:text-[#121b30] transition-all" href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/10 py-lg px-lg max-w-container-max mx-auto flex justify-between items-center text-outline-variant">
        <span>© 2026 Martin Connect. Precise. Decisive. Industrial.</span>
        <div className="flex gap-lg">
          <Link className="hover:text-[#121b30] transition-colors" href="/privacy">Cookie Policy</Link>
          <Link className="hover:text-[#121b30] transition-colors" href="/help">Security</Link>
        </div>
      </div>
    </footer>
  );
}
