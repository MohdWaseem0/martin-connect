'use client';

import React, { useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function RoleSwitcher() {
  const { currentUser, switchRole } = useMartinConnect();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const roles: { id: 'seeker' | 'recruiter' | 'admin'; label: string; icon: string; color: string }[] = [
    { id: 'seeker', label: 'Job Seeker', icon: 'person', color: 'bg-primary text-white' },
    { id: 'recruiter', label: 'Recruiter', icon: 'work', color: 'bg-secondary text-white' },
    { id: 'admin', label: 'Administrator', icon: 'admin_panel_settings', color: 'bg-error text-white' },
  ];

  const current = roles.find((r) => r.id === currentUser.role) || roles[0];

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body-sm text-body-sm">
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-sm px-md py-sm bg-inverse-surface/90 text-white rounded-full shadow-2xl backdrop-blur-md border border-outline/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
          <span>Role: <strong className="capitalize">{currentUser.role}</strong></span>
          <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            expand_less
          </span>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: -8, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-sm w-48 bg-white border border-outline-variant/60 rounded-xl shadow-2xl p-sm flex flex-col gap-xs"
            >
              <div className="px-sm py-xs border-b border-outline-variant/30 text-outline text-[11px] font-bold uppercase tracking-wider">
                Switch Perspective
              </div>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    switchRole(role.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low transition-colors text-left cursor-pointer ${
                    currentUser.role === role.id ? 'bg-surface-container font-semibold text-primary' : 'text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[18px]">{role.icon}</span>
                    <span>{role.label}</span>
                  </div>
                  {currentUser.role === role.id && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
