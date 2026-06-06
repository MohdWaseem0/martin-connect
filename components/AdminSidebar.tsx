'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Logo from '@/components/Logo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingJobs, pendingCompanies } = useMartinConnect();

  const pendingCount = pendingJobs.length + pendingCompanies.length;

  const links = [
    { href: '/admin', label: 'Admin Overview', icon: 'dashboard' },
    { href: '/admin/moderation', label: 'Moderation Queue', icon: 'gavel', count: pendingCount },
    { href: '/admin/users', label: 'User Directory', icon: 'people' },
    { href: '/admin/revenue', label: 'Revenue & Subs', icon: 'payments' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#081126] border-r border-outline-variant/15 flex flex-col py-lg z-50">
      <div className="px-lg mb-xl">
        <Link href="/">
          <Logo light size="sm" />
        </Link>
        <p className="font-body-sm text-body-sm text-outline-variant/70 mt-2">Platform Admin</p>
      </div>

      <nav className="flex-1 space-y-xs">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-lg py-sm transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'text-white border-l-4 border-primary-container bg-primary-container/10 font-semibold'
                  : 'text-outline-variant hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-md">{link.icon}</span>
                <span className="font-title-sm text-title-sm">{link.label}</span>
              </div>
              {link.count !== undefined && link.count > 0 && (
                <span className="font-mono-label text-[11px] bg-error text-white px-2 py-0.5 rounded-full font-bold">
                  {link.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-md space-y-xs text-[13px]">
        <Link
          href="/help"
          className="flex items-center px-lg py-sm text-outline-variant hover:text-white hover:bg-white/5 transition-colors duration-200"
        >
          <span className="material-symbols-outlined mr-md">help_outline</span>
          <span className="font-title-sm text-title-sm">Platform Health</span>
        </Link>
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center px-lg py-sm text-outline-variant hover:text-white hover:bg-white/5 transition-colors duration-200 text-left cursor-pointer"
        >
          <span className="material-symbols-outlined mr-md">logout</span>
          <span className="font-title-sm text-title-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
