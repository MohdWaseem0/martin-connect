'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

interface SocialSetupClientProps {
  initialEmail: string;
  initialName: string;
}

export default function SocialSetupClient({ initialEmail, initialName }: SocialSetupClientProps) {
  const router = useRouter();
  const [role, setRole] = useState<'seeker' | 'recruiter'>('seeker');
  const [name, setName] = useState(initialName);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/social-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, companyName }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        // Force fully reload page to refresh context
        window.location.href = role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/seeker';
      } else {
        setError(data.error || 'Failed to complete registration.');
      }
    } catch (err) {
      setLoading(false);
      setError('A network error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-surface-container min-h-screen flex items-center justify-center p-md font-body-md text-on-surface relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <main className="relative z-10 w-full max-w-[480px] flex flex-col items-center py-lg">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-xl text-center">
          <Logo size="lg" />
        </div>

        {/* Signup Card */}
        <div className="w-full bg-white rounded-xl login-card-shadow border border-outline-variant/60 overflow-hidden">
          <div className="p-xl">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-xs font-bold">Complete Registration</h2>
            <p className="font-body-sm text-outline mb-lg">
              Welcome, <strong className="text-on-surface">{initialName}</strong>! Please select your workspace role below to finish setup.
            </p>

            {error && (
              <div className="mb-md p-sm bg-error/10 border border-error/20 text-error rounded-lg text-body-sm flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Role Select Buttons */}
            <div className="grid grid-cols-2 gap-sm mb-lg bg-surface-container p-xs rounded-xl border border-outline-variant/30 select-none">
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`py-sm rounded-lg font-title-sm text-body-sm cursor-pointer transition-all flex items-center justify-center gap-xs ${
                  role === 'seeker' ? 'bg-white text-primary shadow-sm font-semibold' : 'text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-sm rounded-lg font-title-sm text-body-sm cursor-pointer transition-all flex items-center justify-center gap-xs ${
                  role === 'recruiter' ? 'bg-white text-primary shadow-sm font-semibold' : 'text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">work</span>
                Employer / HR
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block font-body-sm font-semibold text-on-surface mb-sm">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>

              <div>
                <label className="block font-body-sm font-semibold text-on-surface mb-sm">Email Address</label>
                <input
                  disabled
                  type="email"
                  value={initialEmail}
                  className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container text-outline font-body-md focus:outline-none cursor-not-allowed opacity-75"
                />
                <p className="text-[11px] text-outline mt-xs">Email is automatically verified via Google.</p>
              </div>

              {role === 'recruiter' && (
                <div>
                  <label className="block font-body-sm font-semibold text-on-surface mb-sm">Company Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Acme Corporation"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-white font-title-sm py-sm rounded-lg hover:brightness-110 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-xs cursor-pointer text-[14px] font-bold"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Completing Registration...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          </div>

          <div className="bg-surface-container-low px-xl py-md border-t border-outline-variant/60 flex justify-center text-[13px]">
            <p className="font-body-sm text-on-surface-variant">
              Want to use a different account?{' '}
              <Link className="text-primary-container font-bold hover:underline" href="/login">
                Cancel
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
