'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Signup() {
  const router = useRouter();
  const { signup } = useMartinConnect();
  
  const [role, setRole] = useState<'seeker' | 'recruiter'>('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signup(name, email, password, role, companyName);
    setLoading(false);

    if (res.success) {
      if (role === 'recruiter') {
        router.push('/dashboard/recruiter');
      } else {
        router.push('/dashboard/seeker');
      }
      alert('Account registered successfully! Welcome to your workspace.');
    } else {
      alert(res.error || 'Registration failed');
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
            <h2 className="font-title-lg text-title-lg text-on-surface mb-xs font-bold">Create Account</h2>
            <p className="font-body-sm text-outline mb-lg">Choose your role and register your credentials.</p>

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
                <label className="block font-body-sm font-semibold text-on-surface mb-sm">Work Email</label>
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                />
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

              <div>
                <label className="block font-body-sm font-semibold text-on-surface mb-sm">Password</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                />
                <p className="text-[11px] text-outline mt-xs">Password must be at least 8 characters long.</p>
              </div>

              <div className="text-[12px] text-on-surface-variant leading-relaxed">
                By registering, you agree to our{' '}
                <Link className="text-primary font-semibold hover:underline" href="/terms">
                  Terms
                </Link>{' '}
                and{' '}
                <Link className="text-primary font-semibold hover:underline" href="/privacy">
                  Privacy Policy
                </Link>
                .
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-white font-title-sm py-sm rounded-lg hover:brightness-110 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-xs cursor-pointer text-[14px] font-bold"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Registering Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          <div className="bg-surface-container-low px-xl py-md border-t border-outline-variant/60 flex justify-center text-[13px]">
            <p className="font-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link className="text-primary-container font-bold hover:underline" href="/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
