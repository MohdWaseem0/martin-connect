'use client';

import React, { useEffect } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useMartinConnect();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login');
      } else {
        // Gated access based on role
        if (currentUser.role === 'seeker' && pathname.startsWith('/dashboard/recruiter')) {
          router.push('/dashboard/seeker');
        } else if (currentUser.role === 'recruiter' && pathname.startsWith('/dashboard/seeker')) {
          router.push('/dashboard/recruiter');
        }
      }
    }
  }, [currentUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined animate-spin text-[36px] text-primary">progress_activity</span>
          <p className="font-title-sm text-outline font-bold mt-2">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Prevent flash of unauthorized content before redirect
  if (currentUser.role === 'seeker' && pathname.startsWith('/dashboard/recruiter')) {
    return null;
  }
  if (currentUser.role === 'recruiter' && pathname.startsWith('/dashboard/seeker')) {
    return null;
  }

  return <>{children}</>;
}
