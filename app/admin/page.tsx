'use client';

import React, { useMemo } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminOverviewDashboard() {
  const router = useRouter();
  const { pendingCompanies, pendingJobs, jobs, companies } = useMartinConnect();

  // Compute live metrics
  const totalPending = pendingCompanies.length + pendingJobs.length;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 px-lg sticky top-0 z-40 bg-white border-b border-[#E8EEF7] shadow-xs">
        <div className="flex items-center gap-lg flex-1">
          <div className="relative w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737687]/65 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search administration configs, logs..."
              className="w-full pl-10 pr-md py-2.5 bg-[#f2f3ff] border border-[#c3c6d8]/65 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-lg ml-auto">
          <div className="flex gap-md">
            <button className="w-10 h-10 flex items-center justify-center text-[#737687] hover:text-primary rounded-full hover:bg-slate-100">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-[#737687] hover:text-primary rounded-full hover:bg-slate-100">
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
          </div>
          <div className="flex items-center gap-md pl-lg border-l border-outline-variant">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-xs">
                <p className="font-bold text-xs text-[#121b30]">Rohan Kapoor</p>
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-bold rounded">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-[#737687]">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden bg-slate-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Lss7ID71JKvl--u83cUntSTj4ygMraFQuMi0K0eK6z5RKCWCUozv6XH-64oHZHnv2omwuu85NoXSZS7ywfGEv1vBeNtJYirE3Hf9e2VL-2CEYPewLGJnpAlMR82MY_j7xZiZHHPQQgTsHz-F8fWvBSuZiIS5P56ZRe45bDer5M3Bkj9eP0HI-A9LWuCXndqrmBzfgKo-oOQUNqLwsIR1TdMR3IIUl-Ti9fQrz0Ao-KdsBnkgZJyIuSDgpqLvIoe6kK11ptkMCEA"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <div className="p-lg space-y-lg">
        {/* KPI Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-md">
          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs hover:-translate-y-0.5 transition-all">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-2">Total Users</p>
            <h3 className="text-xl font-bold text-[#121b30]">2.4M+</h3>
            <div className="flex items-center gap-xs mt-3 text-emerald-600 font-bold text-[9px]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>12% growth</span>
            </div>
          </div>

          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs hover:-translate-y-0.5 transition-all">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-2">Active Companies</p>
            <h3 className="text-xl font-bold text-[#121b30]">{companies.length + 48000}</h3>
            <div className="flex items-center gap-xs mt-3 text-emerald-600 font-bold text-[9px]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>8% growth</span>
            </div>
          </div>

          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs hover:-translate-y-0.5 transition-all">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-2">Live Jobs</p>
            <h3 className="text-xl font-bold text-[#121b30]">{jobs.length + 3200000}</h3>
            <div className="flex items-center gap-xs mt-3 text-primary font-bold text-[9px]">
              <span className="material-symbols-outlined text-[14px]">sync</span>
              <span>Real-time</span>
            </div>
          </div>

          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs hover:-translate-y-0.5 transition-all">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-2">Platform MRR</p>
            <h3 className="text-xl font-bold text-[#121b30]">₹1.84 Cr</h3>
            <div className="flex items-center gap-xs mt-3 text-emerald-600 font-bold text-[9px]">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+6% vs LY</span>
            </div>
          </div>

          <div className={`p-md rounded-2xl border shadow-xs hover:-translate-y-0.5 transition-all ${
            totalPending > 0 ? 'bg-red-50/50 border-red-200' : 'bg-white border-outline-variant'
          }`}>
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-2">Pending Moderation</p>
            <h3 className={`text-xl font-bold ${totalPending > 0 ? 'text-error' : 'text-[#121b30]'}`}>
              {totalPending}
            </h3>
            <div className="flex items-center gap-xs mt-3 text-[#737687] font-semibold text-[9px]">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Avg 4h queue wait</span>
            </div>
          </div>

          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs hover:-translate-y-0.5 transition-all">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-2">Critical Tickets</p>
            <h3 className="text-xl font-bold text-[#121b30]">8</h3>
            <div className="flex items-center gap-xs mt-3 text-[#D97706] font-bold text-[9px]">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>Active alerts</span>
            </div>
          </div>
        </section>

        {/* Charts & Split Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* User Registration Line Chart */}
          <div className="lg:col-span-2 bg-white p-lg rounded-2xl border border-outline-variant shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-md">
              <div>
                <h2 className="font-bold text-body-md text-[#121b30]">User Registration Growth</h2>
                <p className="text-[11px] text-[#737687]">Daily platform activity metrics</p>
              </div>
            </div>

            {/* Area Chart Vector */}
            <div className="h-60 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                <path
                  d="M0,180 C100,170 150,140 200,145 C300,155 350,110 400,105 C500,100 550,60 600,65 C700,75 750,20 800,25 L800,200 L0,200 Z"
                  fill="rgba(30, 99, 243, 0.08)"
                />
                <path
                  d="M0,180 C100,170 150,140 200,145 C300,155 350,110 400,105 C500,100 550,60 600,65 C700,75 750,20 800,25"
                  fill="none"
                  stroke="#1E63F3"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="800" cy="25" r="4" fill="white" stroke="#1E63F3" strokeWidth="3" />
              </svg>
              <div className="absolute -bottom-6 w-full flex justify-between text-[9px] font-bold text-[#737687] uppercase">
                <span>01 Oct</span>
                <span>07 Oct</span>
                <span>14 Oct</span>
                <span>21 Oct</span>
                <span>28 Oct</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Revenue Split */}
          <div className="bg-white p-lg rounded-2xl border border-outline-variant shadow-xs space-y-md">
            <h2 className="font-bold text-body-md text-[#121b30]">Revenue Split (By Plan)</h2>
            <div className="space-y-lg text-xs font-semibold text-[#121b30]">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">corporate_fare</span>
                    <span>Enterprise Tier</span>
                  </div>
                  <span className="text-primary font-bold">₹84L (46%)</span>
                </div>
                <div className="w-full h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[46%] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-purple-600 text-[18px]">rocket_launch</span>
                    <span>Growth Tier</span>
                  </div>
                  <span className="text-purple-600 font-bold">₹62L (34%)</span>
                </div>
                <div className="w-full h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full w-[34%] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">person</span>
                    <span>Seeker Prime</span>
                  </div>
                  <span className="text-emerald-600 font-bold">₹38L (20%)</span>
                </div>
                <div className="w-full h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                  <div className="bg-[#16A34A]/100 h-full w-[20%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Queues & Logs */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Company verification list preview */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
            <div className="px-lg py-md border-b border-[#E8EEF7] flex justify-between items-center">
              <h2 className="font-bold text-body-md text-[#121b30]">Moderation Queue Preview</h2>
              <Link
                href="/admin/moderation"
                className="text-primary font-bold text-xs hover:underline"
              >
                Go to Moderation Panel
              </Link>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F7F9FC]">
                  <tr className="font-mono text-[9px] text-[#737687] uppercase tracking-wider">
                    <th className="px-lg py-sm">Company Name</th>
                    <th className="px-lg py-sm">HQ Location</th>
                    <th className="px-lg py-sm">Industry Sector</th>
                    <th className="px-lg py-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EEF7]">
                  {pendingCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-lg py-md text-center text-[#737687] italic">
                        Verification queue is empty! All companies verified.
                      </td>
                    </tr>
                  ) : (
                    pendingCompanies.slice(0, 3).map((comp) => (
                      <tr key={comp.id} className="hover:bg-[#f2f3ff] transition-all">
                        <td className="px-lg py-md font-bold text-[#121b30]">{comp.name}</td>
                        <td className="px-lg py-md text-[#424655]">{comp.location}</td>
                        <td className="px-lg py-md text-[#424655]">{comp.industry}</td>
                        <td className="px-lg py-md">
                          <Link
                            href="/admin/moderation"
                            className="bg-primary text-white px-lg py-1 rounded font-bold text-[10px] hover:brightness-110 active:scale-95 transition-all inline-block"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time event log */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-outline-variant shadow-xs p-md flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-body-md text-[#121b30]">Real-time Event Logs</h2>
              <p className="text-[10px] text-[#737687] font-semibold mb-md">Live platform logs stream</p>
            </div>
            
            <div className="space-y-sm text-xs max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              <div className="flex gap-sm">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">person_add</span>
                <div>
                  <p className="text-[#424655]"><span className="font-bold text-[#121b30]">500+ Seekers</span> registered in the last hour.</p>
                  <p className="text-[9px] text-[#737687]">Just now</p>
                </div>
              </div>
              <div className="flex gap-sm">
                <span className="material-symbols-outlined text-emerald-600 text-[16px] mt-0.5">payments</span>
                <div>
                  <p className="text-[#424655]"><span className="font-bold text-[#121b30]">Swiggy</span> renewed Enterprise Subscription.</p>
                  <p className="text-[9px] text-[#737687]">12 mins ago</p>
                </div>
              </div>
              <div className="flex gap-sm">
                <span className="material-symbols-outlined text-error text-[16px] mt-0.5">warning</span>
                <div>
                  <p className="text-[#424655]"><span className="font-bold text-error">Anomaly flagged:</span> Job Post #pjob-1 matches duplicate signatures.</p>
                  <p className="text-[9px] text-[#737687]">24 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Platform Status Footer */}
      <footer className="mt-auto px-lg py-md border-t border-outline-variant bg-white flex justify-between items-center text-[10px] font-bold text-[#737687] uppercase tracking-wider shadow-xs">
        <div className="flex gap-md">
          <div className="flex items-center gap-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]/100 animate-pulse"></span>
            <span>99.98% Platform Uptime</span>
          </div>
          <span className="hidden sm:inline">• AWS AP-SOUTH-1 PROD</span>
        </div>
        <span>v4.2.1-stable</span>
      </footer>
    </div>
  );
}
