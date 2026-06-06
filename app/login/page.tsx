'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Login() {
  const router = useRouter();
  const { login } = useMartinConnect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // 3D Card tilt motion values
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(200);
    y.set(200);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.role === 'admin') {
        router.push('/admin');
      } else if (res.role === 'recruiter') {
        router.push('/dashboard/recruiter');
      } else {
        router.push('/dashboard/seeker');
      }
    } else {
      alert(res.error || 'Invalid credentials');
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

      <main className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-xl text-center">
          <Logo size="lg" />
        </div>

        {/* 3D Login Card */}
        <motion.div
          onMouseMove={handleMouse}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="w-full bg-white rounded-xl login-card-shadow border border-outline-variant/60 overflow-hidden"
        >
          <div className="p-xl">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-xs font-bold">Sign In</h2>
            <p className="font-body-sm text-outline mb-lg">Enter your workspace credentials to access dashboard.</p>

            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block font-body-sm font-semibold text-on-surface mb-sm">Work Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline/70"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-sm">
                  <label className="block font-body-sm font-semibold text-on-surface">Password</label>
                  <a href="#" className="font-body-sm font-bold text-primary-container hover:underline text-[12px]">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-sm pt-xs select-none">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer"
                />
                <label htmlFor="remember" className="font-body-sm text-on-surface-variant cursor-pointer text-[13px]">
                  Keep me signed in for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-white font-title-sm py-sm rounded-lg hover:brightness-110 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-xs cursor-pointer text-[14px] font-bold"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="relative my-xl">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/60"></div>
              </div>
              <div className="relative flex justify-center text-mono-label text-[11px]">
                <span className="bg-white px-md text-outline uppercase font-mono-label">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-md">
              <button
                onClick={async () => {
                  setLoading(true);
                  const res = await login('seeker@example.com', 'password123');
                  setLoading(false);
                  if (res.success) {
                    router.push('/dashboard/seeker');
                  } else {
                    alert(res.error || 'Login failed');
                  }
                }}
                className="flex items-center justify-center space-x-sm py-sm border border-outline-variant rounded-xl font-body-md text-on-surface hover:bg-surface-container-low transition-all active:scale-[0.98] cursor-pointer text-[13px]"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button
                onClick={async () => {
                  setLoading(true);
                  const res = await login('recruiter@martinconnect.com', 'password123');
                  setLoading(false);
                  if (res.success) {
                    router.push('/dashboard/recruiter');
                  } else {
                    alert(res.error || 'Login failed');
                  }
                }}
                className="flex items-center justify-center space-x-sm py-sm border border-outline-variant rounded-xl font-body-md text-on-surface hover:bg-surface-container-low transition-all active:scale-[0.98] cursor-pointer text-[13px]"
              >
                <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low px-xl py-md border-t border-outline-variant/60 flex justify-center text-[13px]">
            <p className="font-body-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link className="text-primary-container font-bold hover:underline" href="/signup">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer info */}
        <footer className="mt-xl text-center space-y-md w-full">
          <div className="flex items-center justify-center space-x-lg opacity-60">
            <div className="flex items-center space-x-xs text-outline text-[11px]">
              <span className="material-symbols-outlined !text-[16px]">verified_user</span>
              <span className="font-mono-label text-mono-label uppercase">SOC2 Certified</span>
            </div>
            <div className="flex items-center space-x-xs text-outline text-[11px]">
              <span className="material-symbols-outlined !text-[16px]">lock</span>
              <span className="font-mono-label text-mono-label uppercase">AES-256 Encrypted</span>
            </div>
          </div>
          <nav className="flex justify-center space-x-md font-body-sm text-outline text-[12px]">
            <Link className="hover:text-on-surface transition-colors" href="/privacy">Privacy Policy</Link>
            <span className="text-outline-variant/60">•</span>
            <Link className="hover:text-on-surface transition-colors" href="/terms">Terms of Service</Link>
          </nav>
          <p className="font-body-sm text-outline-variant/60 mt-sm text-[12px]">
            © 2026 Martin Connect Inc. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
