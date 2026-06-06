'use client';

import React, { useEffect } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useMartinConnect();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login');
      } else if (currentUser.role !== 'admin') {
        // Redirect non-admins to their respective portals
        if (currentUser.role === 'recruiter') {
          router.push('/dashboard/recruiter');
        } else {
          router.push('/dashboard/seeker');
        }
      }
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined animate-spin text-[36px] text-primary">progress_activity</span>
          <p className="font-title-sm text-outline font-bold mt-2">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
