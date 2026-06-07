'use client';

import React, { useMemo, useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const { candidates, jobs, currentUser } = useMartinConnect();
  const [searchVal, setSearchVal] = useState('');

  // Funnel calculations
  const funnel = useMemo(() => {
    const counts = {
      Applied: candidates.filter((c) => c.stage === 'Applied').length,
      Screening: candidates.filter((c) => c.stage === 'Screening').length,
      Shortlisted: candidates.filter((c) => c.stage === 'Shortlisted').length,
      Interview: candidates.filter((c) => c.stage === 'Interview').length,
      Offer: candidates.filter((c) => c.stage === 'Offer').length,
      Hired: candidates.filter((c) => c.stage === 'Hired').length,
    };

    const total = candidates.length || 1;

    return {
      counts,
      percentages: {
        Applied: Math.round((counts.Applied / total) * 100),
        Screening: Math.round((counts.Screening / total) * 100),
        Shortlisted: Math.round((counts.Shortlisted / total) * 100),
        Interview: Math.round((counts.Interview / total) * 100),
        Offer: Math.round((counts.Offer / total) * 100),
        Hired: Math.round((counts.Hired / total) * 100),
      },
    };
  }, [candidates]);

  // Recruiter profile stats
  const activeJobs = jobs.filter((j) => j.status !== 'Closed');
  const hiredCount = candidates.filter((c) => c.stage === 'Hired').length;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header Section */}
      <header className="bg-white border-b border-[#E8EEF7] h-16 flex items-center justify-between px-lg sticky top-0 z-30 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchVal.trim()) {
              router.push(`/dashboard/recruiter/pipeline?search=${encodeURIComponent(searchVal.trim())}`);
            }
          }}
          className="relative w-80 sm:w-96 hidden md:block"
        >
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search candidates, jobs..."
            className="w-full pl-xl pr-md py-sm bg-[#f2f3ff] border border-[#c3c6d8]/55 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>

        <div className="flex items-center gap-md ml-auto">
          <div className="flex items-center gap-sm">
            <button className="relative p-xs text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="p-xs text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
          </div>
          <div className="flex items-center gap-md pl-lg border-l border-[#E8EEF7]">
            <div className="text-right hidden sm:block">
              <p className="font-title-sm text-xs font-bold text-[#121b30]">{currentUser?.name}</p>
              <p className="font-body-sm text-[10px] text-[#737687]">{currentUser?.title}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[13px] border-2 border-primary-container shrink-0 select-none">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'R'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-lg space-y-lg">
        {/* Greetings Panel */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-md">
          <div>
            <h2 className="font-headline-md text-headline-sm font-bold text-[#121b30]">
              Welcome back, {currentUser?.name?.split(' ')[0]} 👋
            </h2>
            <p className="font-body-lg text-body-md text-[#424655] mt-1">
              Here is your hiring pipeline overview for today.
            </p>
          </div>
          <div className="flex gap-md">
            <button
              onClick={() => alert('Generating full recruiter pipeline report... Done! CSV downloaded.')}
              className="px-lg py-sm border border-primary text-primary font-bold rounded-lg text-xs hover:bg-primary/5 transition-all cursor-pointer"
            >
              Generate Report
            </button>
            <button
              onClick={() => router.push('/dashboard/recruiter/jobs/new')}
              className="px-lg py-sm bg-primary-container text-white font-bold rounded-lg text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Post New Job
            </button>
          </div>
        </div>

        {/* KPI Stats Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div className="bg-white p-md rounded-2xl shadow-sm border border-[#E8EEF7] border-l-4 border-l-primary flex flex-col justify-between">
            <p className="font-mono text-[10px] text-[#737687] uppercase tracking-wider font-bold">Active Jobs</p>
            <div className="mt-md flex items-end justify-between">
              <h3 className="font-display-md text-[32px] font-bold text-[#121b30]">{activeJobs.length}</h3>
              <span className="text-primary font-bold text-xs">+1 posted recently</span>
            </div>
          </div>

          <div className="bg-white p-md rounded-2xl shadow-sm border border-[#E8EEF7] border-l-4 border-l-secondary flex flex-col justify-between">
            <p className="font-mono text-[10px] text-[#737687] uppercase tracking-wider font-bold">Total Applicants</p>
            <div className="mt-md flex items-end justify-between">
              <h3 className="font-display-md text-[32px] font-bold text-[#121b30]">{candidates.length}</h3>
              <span className="text-[#16A34A] font-bold text-xs">+15% vs last month</span>
            </div>
          </div>

          <div className="bg-white p-md rounded-2xl shadow-sm border border-[#E8EEF7] border-l-4 border-l-tertiary flex flex-col justify-between">
            <p className="font-mono text-[10px] text-[#737687] uppercase tracking-wider font-bold">Active Interviews</p>
            <div className="mt-md flex items-end justify-between">
              <h3 className="font-display-md text-[32px] font-bold text-[#121b30]">
                {candidates.filter((c) => c.stage === 'Interview').length}
              </h3>
              <span className="text-[#737687] text-xs">Today's schedule</span>
            </div>
          </div>

          <div className="bg-white p-md rounded-2xl shadow-sm border border-[#E8EEF7] border-l-4 border-l-[#0038b7] flex flex-col justify-between">
            <p className="font-mono text-[10px] text-[#737687] uppercase tracking-wider font-bold">Candidates Hired</p>
            <div className="mt-md flex items-end justify-between">
              <h3 className="font-display-md text-[32px] font-bold text-[#121b30]">{hiredCount}</h3>
              <span className="text-[#737687] text-xs">Goal for Q2: 12</span>
            </div>
          </div>
        </div>

        {/* Dynamic Funnel Progress Bar */}
        <section className="bg-white p-lg rounded-2xl shadow-sm border border-[#E8EEF7] space-y-md">
          <h4 className="font-title-lg text-body-md font-bold text-[#121b30]">Hiring Funnel Performance</h4>
          <div className="flex items-center w-full h-10 rounded-full overflow-hidden text-[10px] font-bold text-white shadow-xs">
            <div className="h-full bg-primary flex items-center justify-center min-w-[50px] transition-all" style={{ width: '40%' }}>
              APPLIED ({funnel.counts.Applied})
            </div>
            <div className="h-full bg-primary/80 flex items-center justify-center min-w-[50px] transition-all" style={{ width: '25%' }}>
              SCREENED ({funnel.counts.Screening})
            </div>
            <div className="h-full bg-primary/60 flex items-center justify-center min-w-[50px] transition-all" style={{ width: '15%' }}>
              SHORTLIST ({funnel.counts.Shortlisted})
            </div>
            <div className="h-full bg-primary/45 flex items-center justify-center min-w-[50px] transition-all text-[#121b30]" style={{ width: '12%' }}>
              INTERVIEWS ({funnel.counts.Interview})
            </div>
            <div className="h-full bg-[#16A34A]/100 flex items-center justify-center min-w-[40px] transition-all" style={{ width: '8%' }}>
              HIRED ({funnel.counts.Hired})
            </div>
          </div>
          <div className="grid grid-cols-5 text-center text-xs font-bold text-[#737687]">
            <span className="text-primary">40% applied</span>
            <span className="text-primary/80">25% screening</span>
            <span className="text-primary/60">15% shortlisted</span>
            <span className="text-primary/45">12% interviews</span>
            <span className="text-emerald-600">8% hired</span>
          </div>
        </section>

        {/* Main Split Grid */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Left Column: Applicants & Open Roles */}
          <div className="col-span-12 lg:col-span-8 space-y-lg">
            {/* Recent Applicants Cards */}
            <section className="space-y-sm">
              <div className="flex justify-between items-center">
                <h4 className="font-title-lg text-body-md font-bold text-[#121b30]">Recent Applicants</h4>
                <Link
                  href="/dashboard/recruiter/pipeline"
                  className="text-primary font-bold text-xs hover:underline"
                >
                  View ATS Board
                </Link>
              </div>

              <div className="flex gap-md overflow-x-auto pb-xs custom-scrollbar">
                {candidates.slice(0, 4).map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => router.push('/dashboard/recruiter/pipeline')}
                    className="min-w-[240px] bg-white p-md rounded-2xl shadow-xs border border-[#E8EEF7] hover:shadow-md hover:border-l-4 hover:border-l-primary transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between mb-sm">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                        <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="bg-[#EBF4FF] text-[#1E63F3] text-[9px] font-bold px-sm py-[2px] rounded-full uppercase">
                        {cand.stage}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-title-sm text-xs font-bold text-[#121b30]">{cand.name}</h5>
                      <p className="text-[11px] text-[#737687] truncate">{cand.title}</p>
                    </div>
                    <div className="mt-md pt-sm border-t border-[#E8EEF7] flex justify-between items-center text-[10px] text-[#737687]">
                      <span className="font-mono">{cand.timeAgo}</span>
                      <span className="material-symbols-outlined text-primary text-[18px]">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Active Jobs Table */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#E8EEF7] overflow-hidden">
              <div className="px-lg py-md border-b border-[#E8EEF7] flex justify-between items-center">
                <h4 className="font-title-lg text-body-md font-bold text-[#121b30]">Active Job Posts</h4>
                <Link
                  href="/jobs"
                  className="text-primary font-bold text-xs hover:underline"
                >
                  View Directory
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F7F9FC] border-b border-[#E8EEF7]">
                    <tr>
                      <th className="px-lg py-sm font-mono text-[9px] text-[#737687] uppercase tracking-wider">Job Title</th>
                      <th className="px-lg py-sm font-mono text-[9px] text-[#737687] uppercase tracking-wider">Location</th>
                      <th className="px-lg py-sm font-mono text-[9px] text-[#737687] uppercase tracking-wider">Salary</th>
                      <th className="px-lg py-sm font-mono text-[9px] text-[#737687] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EEF7]">
                    {jobs.slice(0, 4).map((j) => (
                      <tr
                        key={j.id}
                        onClick={() => router.push(`/jobs/${j.id}`)}
                        className="hover:bg-[#f2f3ff] transition-colors cursor-pointer"
                      >
                        <td className="px-lg py-md font-bold text-[#1e63f3]">{j.title}</td>
                        <td className="px-lg py-md text-[#424655]">{j.location}</td>
                        <td className="px-lg py-md font-mono text-[#424655]">{j.salary}</td>
                        <td className="px-lg py-md">
                          <span className="bg-[#DCFCE7] text-[#16A34A] text-[9px] font-bold px-sm py-[2px] rounded-full uppercase">
                            {j.status || 'Hiring'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Activity Feed & Sources */}
          <div className="col-span-12 lg:col-span-4 space-y-lg">
            {/* Team Activity Feed */}
            <section className="bg-white p-md rounded-2xl shadow-sm border border-[#E8EEF7] space-y-md">
              <h4 className="font-title-lg text-body-md font-bold text-[#121b30]">Team Activity Feed</h4>
              <div className="space-y-md">
                <div className="flex gap-md text-xs">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB51J9vFiSCPH68ojmpRStTdMbpDaJVLPqi0n7AnWtkJGCu16KjQ2w1RBwd0zaymWBjQLMYaVLE0qAvNDwjq9JFaYG6iMUmwtSwXyGHdO1Vuchw-0v5Jam5BjRTeox9KorZ4WXOGmsuD_E9hOKUeM9nSkfnagltQThOpV4mrbt03QCECjBg6CBrXvJN4iwfBs7EVW3NTS_O0s8uq7GvpLItIpfvrRzlrktWL8GCCHiIe9kczVP6bGJgQx2X_csKMsnzc9Ve2vKoJJM"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[#121b30]">
                      <span className="font-bold">Kavya S.</span> moved <span className="font-semibold text-primary">Sarah Jenkins</span> to Interview
                    </p>
                    <p className="text-[10px] text-[#737687]">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-md text-xs">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf4f6fE2CXcF7GKywsR1ZNfRUnNrV9uFJVR0FnqQ6Q4eToUEinDRRfXyG4yXNmwsCs6sTWdaoTAPfeY6--fPlOjPrl6YKfuketcyDnDRQ1Wz6yqipYsUCXzh0IvePTVCaGdg0n7Ao__cy0P-tf6U7Vj9b5RI8gdG4WfT_ilYn650Cxdd5ibVAgAiiXtsc4diDZcVRd4YbQZYzm_tDFrHaeW0VsTZvAdKF04bY3bfPyWNwILLKf3yMOeP6UUTUZi8eOofuXRZYabuI"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[#121b30]">
                      <span className="font-bold">Vikram R.</span> sent interview link to <span className="font-semibold text-primary">Arjun Mehta</span>
                    </p>
                    <p className="text-[10px] text-[#737687]">2 hours ago</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Candidate Sources Donut Chart */}
            <section className="bg-white p-md rounded-2xl shadow-sm border border-[#E8EEF7] space-y-md">
              <h4 className="font-title-lg text-body-md font-bold text-[#121b30]">Candidate Sources</h4>
              <div className="flex justify-center">
                {/* SVG Visual Donut */}
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="16" stroke="#eaedff" strokeWidth="4" />
                  {/* Segment 1: Martin Connect (50%) */}
                  <circle cx="18" cy="18" fill="transparent" r="16" stroke="#1e63f3" strokeDasharray="50 100" strokeDashoffset="25" strokeWidth="4" />
                  {/* Segment 2: LinkedIn (25%) */}
                  <circle cx="18" cy="18" fill="transparent" r="16" stroke="#2950ce" strokeDasharray="25 100" strokeDashoffset="-25" strokeWidth="4" />
                  {/* Segment 3: Referral (25%) */}
                  <circle cx="18" cy="18" fill="transparent" r="16" stroke="#476ae9" strokeDasharray="25 100" strokeDashoffset="-50" strokeWidth="4" />
                  <text x="18" y="20" textAnchor="middle" className="font-bold text-[5px] fill-[#121b30]">TOTAL</text>
                  <text x="18" y="24" textAnchor="middle" className="font-bold text-[3px] fill-[#737687]">{candidates.length}</text>
                </svg>
              </div>
              <div className="space-y-sm text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1e63f3]"></span>
                    <span className="text-[#737687]">Martin Connect App</span>
                  </div>
                  <span>50%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2950ce]"></span>
                    <span className="text-[#737687]">LinkedIn Imports</span>
                  </div>
                  <span>25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#476ae9]"></span>
                    <span className="text-[#737687]">Employee Referrals</span>
                  </div>
                  <span>25%</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
