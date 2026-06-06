'use client';

import React, { useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SeekerDashboard() {
  const router = useRouter();
  const { currentUser, jobs, applyJob, updateProfile } = useMartinConnect();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedCert, setAddedCert] = useState(false);

  // Stats calculations
  const appliedJobs = jobs.filter((j) => j.status === 'Applied' || j.status === 'Under Review' || j.status === 'Interviewing' || j.status === 'Shortlisted');
  const interviewsCount = jobs.filter((j) => j.status === 'Interviewing').length || 2; // Default mock interviews count
  const savedJobsCount = jobs.filter((j) => j.status === 'Hiring').length;

  const handleAddCertification = () => {
    if (!addedCert) {
      setAddedCert(true);
      updateProfile({ skills: [...(currentUser?.skills || []), 'Certifications (AWS / React)'] });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="h-[72px] bg-white flex justify-between items-center px-lg border-b border-outline-variant/60 sticky top-0 z-40">
        <div className="flex items-center gap-md">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Dashboard</h2>
          <form onSubmit={handleSearchSubmit} className="hidden md:flex bg-surface-container-low px-md py-sm rounded-full border border-outline-variant/30 w-80 items-center gap-sm">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="bg-transparent border-none focus:outline-none text-body-sm w-full"
              placeholder="Search jobs, skills, or companies..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="flex items-center gap-lg">
          <button className="p-sm rounded-full hover:bg-on-surface-variant/10 transition-colors relative cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute top-1 right-1 bg-error text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
          </button>
          <div className="flex items-center gap-md pl-md border-l border-outline-variant/30 cursor-pointer" onClick={() => router.push('/dashboard/seeker/profile')}>
            <div className="text-right hidden sm:block">
              <p className="font-title-sm text-on-surface">{currentUser?.name}</p>
              <p className="text-body-sm text-outline font-medium">{currentUser?.title}</p>
            </div>
            <img
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6NpkFX25Lfry_WJ06MQ05_x2b0szFAsMRd9EJy7IIF8Ds5fSyOETsQabNmL2DKtu1UZj_kEFwY6vHBFu3isgYzcHRyFW4GX5cS6UB11dn3nYkOH8CBMI30IpL-JryJJC5Ifbv0fZz716502PP8xd9klb7CQ9Muqmsr1SqfHazqmX1s6nMaHkc4UcrBWAS8acgHMuM0uh4H9VdbPex78RCyquoUS9_7kWWYgCxAjQhHgz_J2hpKnJPfbKPovAEFiHARVrY3ztYLwk"
            />
          </div>
        </div>
      </header>

      {/* Content Canvas */}
      <div className="p-lg max-w-container-max mx-auto space-y-lg w-full">
        {/* Greetings & Quick Stats */}
        <section className="space-y-md">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold">Good morning, {currentUser?.name?.split(' ')[0]} 👋</h3>
              <p className="text-body-lg text-outline">You have <span className="text-primary font-bold">{interviewsCount} upcoming interviews</span> scheduled this week.</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/seeker/interviews')}
              className="px-md py-sm bg-white border border-outline-variant text-primary hover:bg-surface-container rounded-lg font-bold text-body-sm flex items-center gap-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              View Schedule
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {/* Stat Card 1 */}
            <div className="bg-white p-md rounded-xl border border-outline-variant/60 soft-sharp-shadow card-accent-hover relative overflow-hidden">
              <div className="flex justify-between items-start mb-sm">
                <div className="p-sm bg-primary-container/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">description</span>
                </div>
              </div>
              <p className="font-display-md text-display-md leading-none font-bold">{appliedJobs.length}</p>
              <p className="text-body-sm text-outline font-medium">Applications <span className="text-primary-fixed-dim text-[10px] ml-1">ACTIVE</span></p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-md rounded-xl border border-outline-variant/60 soft-sharp-shadow card-accent-hover">
              <div className="flex justify-between items-start mb-sm">
                <div className="p-sm bg-tertiary-container/10 rounded-lg text-tertiary">
                  <span className="material-symbols-outlined">event_available</span>
                </div>
              </div>
              <p className="font-display-md text-display-md leading-none font-bold">{interviewsCount}</p>
              <p className="text-body-sm text-outline font-medium">Interviews <span className="text-tertiary text-[10px] ml-1 font-bold">SCHEDULED</span></p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-md rounded-xl border border-outline-variant/60 soft-sharp-shadow card-accent-hover">
              <div className="flex justify-between items-start mb-sm">
                <div className="p-sm bg-secondary-container/10 rounded-lg text-secondary">
                  <span className="material-symbols-outlined">bookmark</span>
                </div>
              </div>
              <p className="font-display-md text-display-md leading-none font-bold">{savedJobsCount}</p>
              <p className="text-body-sm text-outline font-medium">Open Jobs <span className="text-secondary text-[10px] ml-1 font-bold">MATCHING</span></p>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white p-md rounded-xl border border-outline-variant/60 soft-sharp-shadow card-accent-hover">
              <div className="flex justify-between items-start mb-sm">
                <div className="p-sm bg-surface-container-highest rounded-lg text-on-surface">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <span className="text-success-green text-body-sm font-bold flex items-center text-[12px] bg-green-50 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[16px] text-[#16A34A]">trending_up</span> 23%
                </span>
              </div>
              <p className="font-display-md text-display-md leading-none font-bold">1,248</p>
              <p className="text-body-sm text-outline font-medium">Profile Views <span className="text-outline text-[10px] ml-1 font-bold">THIS WEEK</span></p>
            </div>
          </div>
        </section>

        {/* Profile Completion & Alerts */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
          {/* Profile Completion Card */}
          <div className="lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant/60 soft-sharp-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-lg">
                <div>
                  <h4 className="font-title-md text-title-md font-bold">Profile Completion</h4>
                  <p className="font-body-sm text-outline">Complete your profile to increase match recommendations by 4x.</p>
                </div>
                <div className="text-right">
                  <span className="font-display-md text-primary leading-none font-bold">{addedCert ? '87%' : '72%'}</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full mb-xl overflow-hidden">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  animate={{ width: addedCert ? '87%' : '72%' }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
                <div className="flex items-center gap-sm font-body-sm font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Personal Info</span>
                </div>
                <div className="flex items-center gap-sm font-body-sm font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Experience</span>
                </div>
                <div className="flex items-center gap-sm font-body-sm font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Education</span>
                </div>
                <div className="flex items-center gap-sm font-body-sm font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Resume parsed</span>
                </div>
                <div className="flex items-center gap-sm font-body-sm font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Skills details</span>
                </div>
                {addedCert ? (
                  <div className="flex items-center gap-sm font-body-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Certifications</span>
                  </div>
                ) : (
                  <button
                    onClick={handleAddCertification}
                    className="flex items-center justify-between bg-surface-container-low px-sm py-1 rounded border border-dashed border-primary text-primary font-bold hover:bg-surface-container transition-all cursor-pointer text-[12px]"
                  >
                    <span>Certifications</span>
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Job Alerts panel */}
          <div className="lg:col-span-2 bg-inverse-surface p-lg rounded-xl soft-sharp-shadow text-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-md">
                <div>
                  <h4 className="font-title-md font-bold">Active Job Alerts</h4>
                  <p className="text-body-sm text-outline-variant">Real-time matching filters</p>
                </div>
                <span className="material-symbols-outlined text-secondary text-[24px]">notifications_active</span>
              </div>
              <div className="space-y-md">
                <div className="p-md bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-title-sm">Software Engineer</p>
                    <p className="text-body-sm text-outline-variant">Bengaluru, KA • Remote Friendly</p>
                  </div>
                  <div className="flex gap-sm">
                    <button className="p-xs hover:text-primary-container cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button className="p-xs hover:text-error cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => alert('New alert criteria modal expanded')}
              className="w-full py-md border border-dashed border-outline-variant hover:bg-white/5 rounded-lg text-body-sm font-bold flex items-center justify-center gap-sm transition-all cursor-pointer mt-md"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create New Alert
            </button>
          </div>
        </section>

        {/* Recommended Jobs */}
        <section className="space-y-md">
          <div className="flex justify-between items-center">
            <h4 className="font-title-lg text-title-lg font-bold">Recommended for You</h4>
            <Link href="/jobs" className="text-primary font-bold text-body-sm flex items-center gap-xs hover:underline">
              Explore all matches <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {jobs.filter((j) => j.status !== 'Applied').slice(0, 3).map((job) => (
              <div key={job.id} className="bg-white p-lg rounded-xl border border-outline-variant/60 soft-sharp-shadow card-accent-hover group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-md">
                    <img
                      className="w-12 h-12 object-contain bg-surface-container p-2 rounded-lg border border-outline-variant/30"
                      src={job.logo}
                      alt={job.company}
                    />
                    <span className="px-sm py-1 bg-primary/10 text-primary rounded-full text-[12px] font-bold">94% Match</span>
                  </div>
                  <h5 className="font-title-sm group-hover:text-primary transition-colors font-bold">{job.title}</h5>
                  <p className="text-body-sm text-outline font-medium mb-md">{job.company} • {job.location}</p>
                </div>
                <div className="flex items-center justify-between pt-md border-t border-outline-variant/20 mt-auto">
                  <span className="font-mono-label text-mono-label text-on-surface font-semibold">{job.salary}</span>
                  <button
                    onClick={() => applyJob(job.id)}
                    className="bg-primary text-white hover:brightness-110 px-md py-1.5 rounded font-bold text-body-sm cursor-pointer transition-all active:scale-95"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Row 4: Recent Apps & Interviews */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
          {/* Applications list table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-outline-variant/60 soft-sharp-shadow overflow-hidden">
            <div className="p-lg border-b border-outline-variant/40 flex justify-between items-center">
              <h4 className="font-title-md font-bold">Recent Applications</h4>
              <button onClick={() => router.push('/dashboard/seeker/applications')} className="text-primary font-bold hover:underline text-[13px] cursor-pointer">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low font-mono-label text-mono-label uppercase text-outline">
                  <tr>
                    <th className="px-lg py-md">Company</th>
                    <th className="px-lg py-md">Role</th>
                    <th className="px-lg py-md">Date</th>
                    <th className="px-lg py-md">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-body-sm font-medium">
                  {appliedJobs.length > 0 ? (
                    appliedJobs.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-lg py-md font-bold">{app.company}</td>
                        <td className="px-lg py-md text-on-surface-variant">{app.title}</td>
                        <td className="px-lg py-md font-mono-label text-outline text-[12px]">{app.posted || 'Recent'}</td>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-xl text-outline font-normal">
                        No active applications. Explore open jobs to apply!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Interviews pane */}
          <div className="bg-white rounded-xl border border-outline-variant/60 soft-sharp-shadow p-lg space-y-md flex flex-col justify-between">
            <div>
              <h4 className="font-title-md font-bold border-b border-outline-variant/20 pb-xs mb-md">Upcoming Interviews</h4>
              <div className="space-y-sm">
                <div className="p-md bg-surface-container-low rounded-lg border-l-4 border-secondary">
                  <div className="flex justify-between items-start mb-xs">
                    <p className="font-title-sm font-bold">Flipkart</p>
                    <span className="font-mono-label text-[10px] text-secondary bg-white px-2 py-0.5 rounded font-bold">TOMORROW</span>
                  </div>
                  <p className="text-body-sm text-on-surface font-semibold">Technical Round 1</p>
                  <p className="text-[11px] text-outline mt-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 10:30 AM - 11:30 AM
                  </p>
                </div>
                <div className="p-md bg-surface-container-low rounded-lg border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-xs">
                    <p className="font-title-sm font-bold">Amazon</p>
                    <span className="font-mono-label text-[10px] text-outline font-bold bg-white px-2 py-0.5 rounded">OCT 29</span>
                  </div>
                  <p className="text-body-sm text-on-surface font-semibold">HR Cultural Round</p>
                  <p className="text-[11px] text-outline mt-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 02:00 PM - 03:00 PM
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/seeker/interviews')}
              className="w-full text-center text-body-sm font-bold text-primary hover:underline pt-md cursor-pointer border-t border-outline-variant/20 mt-sm"
            >
              View All Appointments
            </button>
          </div>
        </section>

        {/* Profile Views line chart */}
        <section className="bg-white p-lg rounded-xl border border-outline-variant/60 soft-sharp-shadow">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h4 className="font-title-md font-bold">Profile Insights</h4>
              <p className="text-body-sm text-outline">Recruiter views traffic over the last 30 days.</p>
            </div>
            <div className="flex items-center gap-sm">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-body-sm font-medium">Views</span>
            </div>
          </div>

          {/* SVG line chart */}
          <div className="w-full h-64 relative bg-surface-container-low/30 rounded-lg p-md">
            <div className="absolute left-[70%] top-[15%] flex flex-col items-center">
              <div className="bg-inverse-surface text-on-primary text-[10px] px-2 py-1 rounded-full font-bold">Resume Updated</div>
              <div className="w-[1px] h-10 bg-inverse-surface border-dashed border"></div>
            </div>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <line stroke="#e2e7ff" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
              <line stroke="#e2e7ff" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100"></line>
              <line stroke="#e2e7ff" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
              <path d="M0,180 L50,175 L100,160 L150,170 L200,165 L250,140 L300,155 L350,160 L400,145 L450,130 L500,140 L550,120 L600,135 L650,110 L700,30 L750,80 L800,75 L850,90 L900,100 L950,95 L1000,105 L1000,200 L0,200 Z" fill="url(#chartGradient)" opacity="0.15"></path>
              <path d="M0,180 L50,175 L100,160 L150,170 L200,165 L250,140 L300,155 L350,160 L400,145 L450,130 L500,140 L550,120 L600,135 L650,110 L700,30 L750,80 L800,75 L850,90 L900,100 L950,95 L1000,105" fill="none" stroke="#1e63f3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1e63f3"></stop>
                  <stop offset="100%" stopColor="transparent"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between mt-sm text-outline font-mono-label text-[10px] uppercase">
              <span>30 Days Ago</span>
              <span>20 Days Ago</span>
              <span>10 Days Ago</span>
              <span>Today</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
