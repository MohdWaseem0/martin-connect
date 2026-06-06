'use client';

import React, { useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SeekerApplications() {
  const { jobs } = useMartinConnect();
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Filter jobs applied by user
  const appliedJobs = jobs.filter((j) => j.status === 'Applied' || j.status === 'Under Review' || j.status === 'Interviewing' || j.status === 'Shortlisted');

  const appTimelines: Record<string, { stage: string; date: string; note: string }[]> = {
    'job-1': [
      { stage: 'Applied', date: 'June 02, 2026', note: 'Application submitted successfully.' },
      { stage: 'AI Screen Match', date: 'June 03, 2026', note: 'AI resume parsing alignment calculated at 94% match.' },
    ],
    'job-2': [
      { stage: 'Applied', date: 'May 30, 2026', note: 'Application submitted successfully.' },
      { stage: 'Under Review', date: 'May 31, 2026', note: 'Employer reviewed resume. Awaiting technical round scheduling.' },
    ],
    'job-3': [
      { stage: 'Applied', date: 'June 01, 2026', note: 'Application submitted successfully.' },
      { stage: 'Shortlisted', date: 'June 02, 2026', note: 'Shortlisted for Leadership round. Calendar schedule links pending.' },
    ]
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-[72px] bg-white flex justify-between items-center px-lg border-b border-outline-variant/60 sticky top-0 z-40">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Application Tracking</h2>
      </header>

      <div className="p-lg max-w-container-max mx-auto space-y-lg w-full">
        {/* Table list */}
        <div className="bg-white rounded-xl border border-outline-variant/60 soft-sharp-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low font-mono-label text-mono-label uppercase text-outline">
                <tr>
                  <th className="px-lg py-md">Company</th>
                  <th className="px-lg py-md">Role</th>
                  <th className="px-lg py-md">Compensation</th>
                  <th className="px-lg py-md">Status</th>
                  <th className="px-lg py-md text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-body-sm font-medium">
                {appliedJobs.length > 0 ? (
                  appliedJobs.map((app) => (
                    <tr key={app.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <img src={app.logo} className="w-8 h-8 rounded object-contain border bg-surface-container p-1" alt="" />
                          <span className="font-bold">{app.company}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md text-on-surface-variant">{app.title}</td>
                      <td className="px-lg py-md text-on-surface-variant font-mono-label">{app.salary}</td>
                      <td className="px-lg py-md">
                        <span
                          className={`px-sm py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'Applied'
                              ? 'bg-blue-50 text-[#1E63F3]'
                              : app.status === 'Under Review'
                              ? 'bg-amber-50 text-[#D97706]'
                              : app.status === 'Interviewing'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-green-50 text-[#16A34A]'
                          }`}
                        >
                          {app.status || 'Applied'}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-primary hover:underline font-bold cursor-pointer text-[13px]"
                        >
                          Track Progress
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-xl text-outline font-normal">
                      No active applications. Select open roles from the catalog to submit credentials.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Progress Detail Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-[460px] bg-white h-full shadow-2xl p-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-outline-variant pb-sm mb-lg">
                  <div className="flex items-center gap-sm">
                    <img src={selectedApp.logo} className="w-10 h-10 object-contain p-1 border bg-surface-container rounded" alt="" />
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface font-bold">{selectedApp.company}</h3>
                      <p className="font-body-sm text-outline">{selectedApp.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <h4 className="font-title-md font-bold mb-md">Application Timeline</h4>
                <div className="relative border-l border-outline-variant/60 pl-lg ml-md space-y-lg mt-md">
                  {/* Timeline entries */}
                  {(appTimelines[selectedApp.id] || [
                    { stage: 'Applied', date: 'Just now', note: 'Application registered on platform.' }
                  ]).map((t, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1 bg-primary text-white text-[12px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white font-bold shadow-sm">
                        <span className="material-symbols-outlined text-[10px]">check</span>
                      </span>
                      <div className="space-y-xs">
                        <div className="flex items-center justify-between text-body-sm font-bold">
                          <span className="text-on-surface">{t.stage}</span>
                          <span className="font-mono-label text-outline text-[11px]">{t.date}</span>
                        </div>
                        <p className="text-body-md text-on-surface-variant/80">{t.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-outline-variant pt-md flex justify-end gap-sm mt-lg">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-lg py-sm border border-outline text-outline hover:bg-surface-container-low rounded-lg font-bold cursor-pointer text-[13px]"
                >
                  Close Progress Tracker
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
