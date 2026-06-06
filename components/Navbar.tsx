'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useMartinConnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'recruiter') return '/dashboard/recruiter';
    return '/dashboard/seeker';
  };

  const navLinks = [
    { href: '/jobs', label: 'Jobs' },
    { href: '/companies', label: 'Companies' },
    { href: '/resources', label: 'Resources' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="bg-[#F8FAFF] text-[#121b30] font-title-md text-title-md border-b border-outline-variant/20 shadow-sm flex justify-between items-center w-full px-lg py-md h-[72px] sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-xl">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo light={false} size="sm" />
        </Link>
        <div className="hidden md:flex gap-lg items-center text-[15px]">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all pb-1 ${
                  isActive
                    ? 'text-white border-b-2 border-primary-container font-semibold'
                    : 'text-outline-variant hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {currentUser && (
            <Link
              href={getDashboardLink()}
              className={`transition-all pb-1 ${
                pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
                  ? 'text-white border-b-2 border-primary-container font-semibold'
                  : 'text-outline-variant hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Buttons / Actions */}
      <div className="hidden md:flex items-center gap-md">
        <span className="text-[12px] bg-white/10 px-md py-xs rounded-full font-mono text-outline-variant capitalize select-none">
          {currentUser ? `${currentUser.role} mode` : 'guest mode'}
        </span>
        {currentUser ? (
          <button
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="px-md py-sm text-[#121b30] hover:bg-[#081126]/5 rounded-lg transition-all active:scale-95 cursor-pointer text-[14px]"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="px-md py-sm text-[#121b30] hover:bg-[#081126]/5 rounded-lg transition-all active:scale-95 cursor-pointer text-[14px]"
          >
            Sign In
          </button>
        )}
        <button
          onClick={() => {
            if (currentUser?.role === 'recruiter') {
              router.push('/dashboard/recruiter/jobs/new');
            } else if (currentUser?.role === 'admin') {
              router.push('/admin/moderation');
            } else {
              router.push('/jobs');
            }
          }}
          className="bg-primary-container text-white px-lg py-sm rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer text-[14px]"
        >
          {currentUser?.role === 'recruiter' ? 'Post Job' : 'Search Jobs'}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-outline-variant hover:text-white rounded-lg transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[72px] left-0 w-full bg-[#081126] border-b border-outline-variant/20 shadow-2xl flex flex-col px-lg py-md md:hidden gap-md overflow-hidden z-40"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-outline-variant hover:text-white py-xs text-[16px]"
              >
                {link.label}
              </Link>
            ))}
            {currentUser && (
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="text-outline-variant hover:text-white py-xs text-[16px]"
              >
                Dashboard
              </Link>
            )}
            <div className="h-[1px] bg-white/10 w-full my-xs"></div>
            <div className="flex gap-md w-full">
              {currentUser ? (
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    router.push('/');
                  }}
                  className="flex-1 py-sm border border-outline-variant/30 text-white hover:bg-white/10 rounded-lg text-center font-semibold text-[14px]"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className="flex-1 py-sm border border-outline-variant/30 text-white hover:bg-white/10 rounded-lg text-center font-semibold text-[14px]"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser?.role === 'recruiter') {
                    router.push('/dashboard/recruiter/jobs/new');
                  } else {
                    router.push('/jobs');
                  }
                }}
                className="flex-1 py-sm bg-primary-container text-white rounded-lg text-center font-bold text-[14px]"
              >
                {currentUser?.role === 'recruiter' ? 'Post Job' : 'Search Jobs'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
