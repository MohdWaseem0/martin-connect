'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SeekerInterviews() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'scheduled' | 'completed' | 'mock'>('scheduled');

  const scheduledCalls = [
    {
      company: 'Amazon',
      role: 'SDE-1 HR Round',
      date: 'Today',
      day: '15',
      time: '2:00 PM',
      interviewer: 'Priyanka Rao',
      interviewerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeSP3KZZjWYaJliZ-Ae552ydOfCF4lb9c9ZqAeaxUswPGzZWhGh1UJP29MT9U0V5h4q9bS51_Pdndk7DPGV9ZQgfeiY7ypO7ZZiUfk_50WaYhggx8tDd2FV23g-RcNrgd6pkP4faw3BIOC3uZJxClPiNPKL7hnXegg4UWpPHHwNa4LR92mSqYHQs_0J69Iw5GVSksn3KTwKmYSPkuXZfrzcQZpDnF4wrimEjEOBl2vUhPXlangd3FcdWXdpCHSVGVtfGiXpjNNuMQ',
      platform: 'AWS Chime',
      badge: 'Urgent',
      badgeColor: 'bg-[#FEF9EC] text-[#D97706]',
      borderLeft: 'border-[#D97706]',
    },
    {
      company: 'Flipkart',
      role: 'SDE-2 Technical Round 2',
      date: 'Thu',
      day: '16',
      time: '11:00 AM',
      interviewer: 'Rohit Sharma',
      interviewerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7eedPdOhd4CjMXTX320mL4jT4sRwMdytBgZ6-3K8-qMl8pzemrY6f3S0-jYcRgEmE-z42-Qb0eSVZhBi9ZWAFlv5qXph9A1mJXfSvwCPo6MCcV1oMydTzCOl1UuM2dptzTrW1grzMcPrHenagrGmIXu4qUah_BfhReDwdRB7pLTeMHNx9dKuqUg5rbHcjNPmlkNYf-akEUln0yO17VUAqNMrnjkK8cellZUBE1I0-9EwD_13nzLDwbcRbjbuRvFCYCr5MGkCcJos',
      platform: 'Hackerrank Pair',
      badge: 'In 2 Days',
      badgeColor: 'bg-[#EBF4FF] text-[#1E63F3]',
      borderLeft: 'border-[#1E63F3]',
      prepAction: true
    },
  ];

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8EEF7] px-lg py-md flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-xs text-outline font-body-sm text-body-sm mb-xs">
            <span>Portal</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Interviews</span>
          </nav>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">Interview Pipeline</h2>
        </div>
        <div className="flex items-center gap-sm">
          <button className="p-xs text-outline hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <section className="p-lg max-w-container-max mx-auto w-full">
        {/* Tab Selection */}
        <div className="flex items-center gap-xl border-b border-[#E8EEF7] mb-xl select-none">
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`pb-md px-xs font-title-sm text-title-sm border-b-2 transition-all cursor-pointer flex items-center gap-sm ${
              activeTab === 'scheduled' ? 'border-primary text-primary font-bold' : 'border-transparent text-outline-variant hover:text-on-surface'
            }`}
          >
            Scheduled <span className="bg-primary/10 text-primary px-sm py-[2px] rounded-full text-body-sm">2</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-md px-xs font-title-sm text-title-sm border-b-2 transition-all cursor-pointer flex items-center gap-sm ${
              activeTab === 'completed' ? 'border-primary text-primary font-bold' : 'border-transparent text-outline-variant hover:text-on-surface'
            }`}
          >
            Completed <span className="bg-surface-variant/50 text-outline px-sm py-[2px] rounded-full text-body-sm">3</span>
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`pb-md px-xs font-title-sm text-title-sm border-b-2 transition-all cursor-pointer flex items-center gap-sm ${
              activeTab === 'mock' ? 'border-primary text-primary font-bold' : 'border-transparent text-outline-variant hover:text-on-surface'
            }`}
          >
            AI Mock <span className="bg-tertiary-fixed text-on-tertiary-fixed px-sm py-[2px] rounded-full text-body-sm">78/100</span>
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'scheduled' && (
            <motion.div
              key="scheduled"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-gutter"
            >
              <div className="lg:col-span-8 flex flex-col gap-lg">
                {scheduledCalls.map((call, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl border-l-[4px] ${call.borderLeft} soft-sharp-shadow p-lg flex flex-col md:flex-row gap-lg group hover:border-[#1E63F3] transition-all`}
                  >
                    <div className="flex-shrink-0 flex flex-col items-center justify-center bg-surface-container w-24 h-24 rounded-xl">
                      <span className="font-mono-label text-mono-label text-primary uppercase font-bold text-[11px]">{call.date}</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">{call.day}</span>
                      <span className="font-body-sm text-body-sm text-outline font-medium">{call.time}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-sm">
                        <div>
                          <h3 className="font-title-md text-title-md text-on-surface font-bold">{call.company}</h3>
                          <p className="font-body-md text-body-md text-outline">{call.role}</p>
                        </div>
                        <span className={`${call.badgeColor} font-body-sm text-body-sm px-sm py-1 rounded-lg font-bold text-[11px]`}>
                          {call.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-md mb-lg">
                        <div className="flex items-center gap-sm">
                          <img className="w-6 h-6 rounded-full object-cover" src={call.interviewerAvatar} alt="" />
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold">{call.interviewer}</span>
                        </div>
                        <div className="h-4 w-px bg-outline-variant"></div>
                        <div className="flex items-center gap-xs text-outline font-body-sm">
                          <span className="material-symbols-outlined text-[18px]">videocam</span>
                          <span>{call.platform}</span>
                        </div>
                      </div>
                      <div className="flex gap-md">
                        {call.prepAction ? (
                          <button
                            onClick={() => router.push('/dashboard/seeker/interviews/test')}
                            className="border border-primary text-primary px-lg py-sm rounded-lg font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-sm cursor-pointer text-body-sm"
                          >
                            Prepare Assessment <span className="material-symbols-outlined text-[16px]">psychology</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Entering video meeting call on ${call.platform}`)}
                            className="bg-primary text-white px-lg py-sm rounded-lg font-bold hover:brightness-110 transition-all flex items-center gap-sm cursor-pointer text-body-sm"
                          >
                            Join Meeting <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>
                        )}
                        <button
                          onClick={() => alert('Rescheduling requests sent to recruiter')}
                          className="border border-outline-variant text-on-surface px-lg py-sm rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-body-sm"
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right panel */}
              <div className="lg:col-span-4 flex flex-col gap-lg">
                <div className="bg-white rounded-xl soft-sharp-shadow p-lg border border-[#E8EEF7]">
                  <h4 className="font-title-sm text-title-sm mb-lg font-bold text-on-surface">Daily Preparation</h4>
                  <div className="space-y-md">
                    <div>
                      <div className="flex justify-between text-body-sm mb-xs">
                        <span>LeetCode Challenges</span>
                        <span className="text-primary font-bold">85%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[85%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-body-sm mb-xs">
                        <span>System Design Sheets</span>
                        <span className="text-secondary font-bold">40%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-secondary h-full w-[40%]"></div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/seeker/interviews/test')}
                    className="w-full mt-lg py-sm bg-surface-container-high text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all cursor-pointer text-body-sm"
                  >
                    Resume Learning
                  </button>
                </div>

                {/* AI Coach Banner */}
                <div className="bg-inverse-surface text-white rounded-xl p-lg border border-outline-variant/30 relative overflow-hidden">
                  <div className="relative z-10 space-y-md">
                    <h4 className="font-title-sm text-title-sm font-bold">AI Coach: Martin</h4>
                    <p className="font-body-sm text-body-sm text-outline-variant leading-relaxed">
                      "Your next interview is Amazon. Practice the Generative AI mock chat session to score your leadership metrics."
                    </p>
                    <button
                      onClick={() => router.push('/dashboard/seeker/interviews/ai')}
                      className="bg-secondary text-white px-md py-1.5 rounded-lg font-bold text-body-sm flex items-center gap-xs cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                    >
                      Start Session <span className="material-symbols-outlined text-[16px]">bolt</span>
                    </button>
                  </div>
                  <div className="absolute -bottom-8 -right-8 opacity-15 transform rotate-12 select-none pointer-events-none">
                    <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-outline-variant/60 soft-sharp-shadow overflow-hidden w-full"
            >
              <table className="w-full text-left">
                <thead className="bg-[#F7F9FC] font-mono-label text-mono-label uppercase text-outline">
                  <tr>
                    <th className="px-lg py-md">Company</th>
                    <th className="px-lg py-md">Role</th>
                    <th className="px-lg py-md">Date</th>
                    <th className="px-lg py-md">Status</th>
                    <th className="px-lg py-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EEF7] text-body-sm font-medium">
                  <tr className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-lg py-md font-bold">Razorpay</td>
                    <td className="px-lg py-md text-outline">Full Stack Engineer</td>
                    <td className="px-lg py-md font-mono-label">12 Dec 2025</td>
                    <td className="px-lg py-md">
                      <span className="bg-[#DCFCE7] text-[#16A34A] px-sm py-1 rounded text-[11px] font-bold uppercase tracking-wider">Passed</span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <button onClick={() => alert('Razorpay feedback logs: Passed coding challenges, strong communication.')} className="text-primary hover:underline font-bold cursor-pointer bg-transparent border-none">
                        View Feedback
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-lg py-md font-bold">TCS</td>
                    <td className="px-lg py-md text-outline">Senior Java SDE</td>
                    <td className="px-lg py-md font-mono-label">28 Nov 2025</td>
                    <td className="px-lg py-md">
                      <span className="bg-[#FEF9EC] text-[#D97706] px-sm py-1 rounded text-[11px] font-bold uppercase tracking-wider">Reviewing</span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <button onClick={() => router.push('/dashboard/seeker/applications')} className="text-primary hover:underline font-bold cursor-pointer bg-transparent border-none">
                        Track Application
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'mock' && (
            <motion.div
              key="mock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-lg w-full"
            >
              {/* Score header */}
              <div className="bg-primary-container text-white rounded-xl p-lg flex flex-col md:flex-row items-center justify-between shadow-lg">
                <div className="flex items-center gap-lg">
                  <div className="w-20 h-20 rounded-full border-[6px] border-white/20 flex items-center justify-center relative font-bold text-headline-sm bg-white/5">
                    78
                  </div>
                  <div>
                    <h3 className="font-title-lg text-title-lg font-bold">AI Interview Readiness Index</h3>
                    <p className="text-white/80 font-body-md mt-1">You score in the top 15% of candidates matching SDE-2 listings this month.</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Expanding Detailed Competency Charts')}
                  className="mt-lg md:mt-0 bg-white text-primary px-lg py-sm rounded-lg font-bold hover:bg-surface-bright transition-all cursor-pointer text-body-sm"
                >
                  Competency Insights
                </button>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div className="bg-white rounded-xl border border-outline-variant p-lg soft-sharp-shadow hover:border-primary transition-all group flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-lg text-primary">
                      <span className="material-symbols-outlined">code</span>
                    </div>
                    <h4 className="font-title-sm text-title-sm font-bold text-on-surface mb-sm">Coding Challenge</h4>
                    <p className="font-body-md text-body-md text-outline leading-relaxed mb-lg">
                      Live interactive editor console matching technical tests. Practice structures and algorithms.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/seeker/interviews/test')}
                    className="w-full py-sm border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-bold transition-all cursor-pointer text-body-sm"
                  >
                    Start Quiz Assessment
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-outline-variant p-lg soft-sharp-shadow hover:border-secondary transition-all group flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center mb-lg text-secondary">
                      <span className="material-symbols-outlined">architecture</span>
                    </div>
                    <h4 className="font-title-sm text-title-sm font-bold text-on-surface mb-sm">System Design Mock</h4>
                    <p className="font-body-md text-body-md text-outline leading-relaxed mb-lg">
                      Design scalable web apps, select data models, and negotiate architectural tradeoffs.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/seeker/interviews/ai')}
                    className="w-full py-sm border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-lg font-bold transition-all cursor-pointer text-body-sm"
                  >
                    Start AI Coach Chat
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
