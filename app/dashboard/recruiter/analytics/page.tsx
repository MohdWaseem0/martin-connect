'use client';

import React, { useMemo } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { motion } from 'framer-motion';

export default function HiringAnalyticsPage() {
  const { candidates, jobs } = useMartinConnect();

  // Metrics derived from active state
  const totalApplications = candidates.length;
  const shortlistingRate = useMemo(() => {
    if (totalApplications === 0) return 0;
    const shortlistedCount = candidates.filter((c) => c.stage === 'Shortlisted' || c.stage === 'Interview' || c.stage === 'Offer' || c.stage === 'Hired').length;
    return Math.round((shortlistedCount / totalApplications) * 100);
  }, [candidates, totalApplications]);

  const hiredCount = candidates.filter((c) => c.stage === 'Hired').length;

  // Group candidate counts for job performance table
  const jobPerformance = useMemo(() => {
    return jobs.map((job) => {
      // Mocked allocations based on job matching
      const relatedCandidates = candidates.filter(
        (c) =>
          c.title.toLowerCase().includes(job.title.toLowerCase().split(' ')[0]) ||
          job.skills.some((s) => c.skills.includes(s))
      );

      const countApplied = relatedCandidates.length;
      const countShortlisted = relatedCandidates.filter((c) => ['Shortlisted', 'Interview', 'Offer', 'Hired'].includes(c.stage)).length;
      const countInterviews = relatedCandidates.filter((c) => ['Interview', 'Offer', 'Hired'].includes(c.stage)).length;

      return {
        id: job.id,
        title: job.title,
        applied: countApplied || 4,
        shortlisted: countShortlisted || 1,
        interviews: countInterviews || 0,
        timeToFill: '18 Days',
        status: job.status || 'Active'
      };
    });
  }, [jobs, candidates]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E8EEF7] h-16 flex items-center justify-between px-lg sticky top-0 z-30 shadow-xs">
        <div className="relative w-80 hidden md:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search report variables..."
            className="pl-xl pr-md py-xs border border-[#E8EEF7] rounded-xl bg-[#f2f3ff] focus:outline-none focus:ring-1 focus:ring-primary text-xs w-full"
          />
        </div>

        <div className="flex gap-md ml-auto">
          <button
            onClick={() => alert('Exporting full recruitment metrics report as PDF... Finished!')}
            className="bg-white border border-[#E8EEF7] px-md py-sm rounded-lg font-bold text-xs text-primary flex items-center gap-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export PDF
          </button>
          <button
            onClick={() => alert('Sharing report via email link... Done!')}
            className="bg-primary-container text-white px-md py-sm rounded-lg font-bold text-xs flex items-center gap-sm hover:brightness-110 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share Report
          </button>
        </div>
      </header>

      {/* Analytics Content Area */}
      <div className="p-lg space-y-lg">
        {/* Title */}
        <div>
          <h2 className="font-headline-md text-headline-sm font-bold text-[#121b30]">Recruitment Sourcing Analytics</h2>
          <div className="flex items-center gap-xs text-[#737687] text-xs mt-1">
            <span className="material-symbols-outlined text-xs">calendar_today</span>
            <span>Real-time tracker • June 2026</span>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">
          {[
            { label: 'Total Applications', val: totalApplications, suffix: '+12%', green: true },
            { label: 'Shortlisting Rate', val: `${shortlistingRate}%`, suffix: 'Healthy', green: true },
            { label: 'Avg Days to Hire', val: '22 Days', suffix: '-3d', green: true },
            { label: 'Offer Acceptance', val: '87%', suffix: 'Stable', green: true },
            { label: 'Sourcing Cost', val: '₹12,400', suffix: 'Within budget', green: true }
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-white p-md rounded-2xl border border-[#E8EEF7] shadow-xs hover:border-l-4 hover:border-l-primary transition-all duration-300"
            >
              <p className="font-mono text-[9px] text-[#737687] uppercase tracking-wider font-bold">{kpi.label}</p>
              <div className="flex items-end gap-xs mt-md">
                <p className="font-display-md text-xl font-bold text-[#121b30]">{kpi.val}</p>
                <span className="text-emerald-600 font-bold text-[10px] mb-0.5">{kpi.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* Daily applications line graph */}
          <div className="lg:col-span-8 bg-white p-lg rounded-2xl border border-[#E8EEF7] shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-title-lg text-body-md font-bold text-[#121b30]">Daily Sourcing Statistics</h3>
              <div className="flex gap-md text-[10px] text-[#737687] font-bold">
                <div className="flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full"></span> This Month
                </div>
                <div className="flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 bg-[#c3c6d8] rounded-full"></span> Last Month
                </div>
              </div>
            </div>

            {/* SVG graph mockup */}
            <div className="h-60 relative flex items-end justify-between border-b border-[#E8EEF7] pb-1">
              <div className="absolute inset-0 flex flex-col justify-between py-2 text-[9px] text-[#737687] opacity-60 pointer-events-none">
                <div className="border-b border-[#E8EEF7]/50 w-full">250 applicants</div>
                <div className="border-b border-[#E8EEF7]/50 w-full">150 applicants</div>
                <div className="border-b border-[#E8EEF7]/50 w-full">50 applicants</div>
              </div>

              {/* Dynamic vertical bars represent days */}
              {[45, 60, 52, 78, 90, 110, 134, 150, 140, 185, 210, 195].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-xs h-full justify-end group">
                  <div
                    className="w-4/5 bg-primary-container rounded-t-sm group-hover:brightness-95 transition-all shadow-xs cursor-help"
                    style={{ height: `${(val / 250) * 100}%` }}
                    title={`Day ${idx + 1}: ${val} applications`}
                  ></div>
                  <span className="text-[9px] font-mono font-bold text-[#737687] mt-1">D{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel distribution chart */}
          <div className="lg:col-span-4 bg-white p-lg rounded-2xl border border-[#E8EEF7] shadow-xs space-y-md">
            <h3 className="font-title-lg text-body-md font-bold text-[#121b30]">Recruitment Success Funnel</h3>
            <div className="space-y-sm text-xs text-white font-bold">
              <div className="h-8 bg-[#081126] flex items-center justify-between px-md rounded-xl">
                <span>Applied</span>
                <span>{totalApplications}</span>
              </div>
              <div className="flex justify-center">
                <div className="h-8 bg-[#0F3FBF] flex items-center justify-between px-md rounded-xl w-[90%]">
                  <span>Screened</span>
                  <span>{candidates.filter((c) => ['Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired'].includes(c.stage)).length}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-8 bg-[#1E63F3] flex items-center justify-between px-md rounded-xl w-[80%]">
                  <span>Shortlisted</span>
                  <span>{candidates.filter((c) => ['Shortlisted', 'Interview', 'Offer', 'Hired'].includes(c.stage)).length}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-8 bg-[#476ae9] flex items-center justify-between px-md rounded-xl w-[70%]">
                  <span>Interviews</span>
                  <span>{candidates.filter((c) => ['Interview', 'Offer', 'Hired'].includes(c.stage)).length}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-8 bg-[#16A34A]/100 flex items-center justify-between px-md rounded-xl w-[60%]">
                  <span>Hired</span>
                  <span>{hiredCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job performance matrix table */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#E8EEF7] overflow-hidden">
          <div className="px-lg py-md border-b border-[#E8EEF7]">
            <h3 className="font-title-lg text-body-md font-bold text-[#121b30]">Job Post Sourcing Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F7F9FC] border-b border-[#E8EEF7]">
                <tr className="font-mono text-[9px] text-[#737687] uppercase tracking-wider">
                  <th className="px-lg py-sm">Job Title</th>
                  <th className="px-lg py-sm text-center">Applications</th>
                  <th className="px-lg py-sm text-center">Shortlisted</th>
                  <th className="px-lg py-sm text-center">Interviews</th>
                  <th className="px-lg py-sm">Avg Time-to-Fill</th>
                  <th className="px-lg py-sm">Moderation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EEF7]">
                {jobPerformance.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f2f3ff] transition-all">
                    <td className="px-lg py-md font-bold text-primary">{item.title}</td>
                    <td className="px-lg py-md text-center font-mono font-bold text-[#121b30]">{item.applied}</td>
                    <td className="px-lg py-md text-center font-mono font-bold text-[#121b30]">{item.shortlisted}</td>
                    <td className="px-lg py-md text-center font-mono font-bold text-[#121b30]">{item.interviews}</td>
                    <td className="px-lg py-md font-mono text-[#737687]">{item.timeToFill}</td>
                    <td className="px-lg py-md">
                      <span className="bg-[#DCFCE7] text-[#16A34A] text-[9px] font-bold px-sm py-[2px] rounded-full uppercase">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
