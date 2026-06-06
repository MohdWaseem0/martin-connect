'use client';

import React, { useState, useMemo } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoleSwitcher from '@/components/RoleSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function JobsPage() {
  const { jobs, applyJob, currentUser } = useMartinConnect();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [maxSalary, setMaxSalary] = useState<number>(65); // LPA
  const [locationQuery, setLocationQuery] = useState('');
  const [workModes, setWorkModes] = useState<string[]>([]);
  const [selectedCompanySize, setSelectedCompanySize] = useState('Any Size');
  const [sortBy, setSortBy] = useState('Relevance');

  // Bookmarked Jobs state (local storage backed)
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mc_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleBookmark = (jobId: string) => {
    setSavedJobs((prev) => {
      const updated = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('mc_saved_jobs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearAllFilters = () => {
    setSelectedExperience([]);
    setMaxSalary(65);
    setLocationQuery('');
    setWorkModes([]);
    setSelectedCompanySize('Any Size');
    setSearchQuery('');
  };

  const handleExperienceChange = (exp: string) => {
    setSelectedExperience((prev) =>
      prev.includes(exp) ? prev.filter((item) => item !== exp) : [...prev, exp]
    );
  };

  const handleWorkModeToggle = (mode: string) => {
    setWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((item) => item !== mode) : [...prev, mode]
    );
  };

  // Helper to parse salary bounds
  const getSalaryNumeric = (salaryStr: string): number => {
    // E.g. "₹24L - 42L", "₹35L - 55L" or "₹22 - 35 LPA"
    // Match numbers in the string
    const matches = salaryStr.match(/\d+/g);
    if (!matches) return 0;
    // Get average or maximum
    const numbers = matches.map(Number);
    return Math.max(...numbers);
  };

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Keyword Search (title, company, skills)
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some((s) => s.toLowerCase().includes(query));

        // Location Search
        const matchesLocation =
          !locationQuery ||
          job.location.toLowerCase().includes(locationQuery.toLowerCase());

        // Experience Filter
        let matchesExperience = true;
        if (selectedExperience.length > 0) {
          matchesExperience = selectedExperience.some((exp) => {
            const range = job.experienceRequired.toLowerCase();
            if (exp === '0-1 Years') return range.includes('0-1') || range.includes('1-2') || range.includes('fresh');
            if (exp === '1-3 Years') return range.includes('1-3') || range.includes('2-4') || range.includes('2-3');
            if (exp === '3-6 Years') return range.includes('3-6') || range.includes('4-6') || range.includes('3-5') || range.includes('5-8') || range.includes('4-7');
            if (exp === '6+ Years') return range.includes('6+') || range.includes('8+') || range.includes('5-8') || range.includes('6-') || range.includes('8-');
            return false;
          });
        }

        // Work Mode Filter
        const matchesWorkMode =
          workModes.length === 0 ||
          workModes.some((mode) => {
            if (mode === 'Remote') return job.type.toLowerCase().includes('remote');
            if (mode === 'On-site') return job.type.toLowerCase().includes('full-time') && !job.type.toLowerCase().includes('remote');
            if (mode === 'Hybrid') return job.type.toLowerCase().includes('hybrid');
            return true;
          });

        // Salary Filter (check if job salary is within maxSalary)
        const jobMaxSalary = getSalaryNumeric(job.salary);
        const matchesSalary = jobMaxSalary <= maxSalary;

        return matchesQuery && matchesLocation && matchesExperience && matchesWorkMode && matchesSalary;
      })
      .sort((a, b) => {
        if (sortBy === 'Newest') {
          return b.posted.includes('day') ? 1 : -1;
        }
        if (sortBy === 'Salary: High to Low') {
          return getSalaryNumeric(b.salary) - getSalaryNumeric(a.salary);
        }
        // Default: Relevance (by id order)
        return 0;
      });
  }, [jobs, searchQuery, selectedExperience, maxSalary, locationQuery, workModes, sortBy]);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#121b30] flex flex-col font-body-md antialiased">
      <Navbar />

      <main className="max-w-[1440px] w-full mx-auto px-lg py-lg grid grid-cols-12 gap-gutter flex-1">
        {/* Left Filter Sidebar */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-[96px] bg-white rounded-2xl p-md shadow-sm border border-[#c3c6d8]/40 flex flex-col gap-lg max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center pb-xs border-b border-[#c3c6d8]/30">
              <h2 className="font-title-md text-title-md font-bold text-[#121b30] flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
                Filters
              </h2>
              <button
                onClick={clearAllFilters}
                className="text-primary text-body-sm font-semibold hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Experience */}
            <section className="space-y-xs">
              <label className="font-body-sm font-bold block text-outline-variant text-[11px] uppercase tracking-wider">
                Experience Required
              </label>
              <div className="flex flex-col gap-xs">
                {['0-1 Years', '1-3 Years', '3-6 Years', '6+ Years'].map((exp) => (
                  <label key={exp} className="flex items-center gap-sm font-body-md cursor-pointer group text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedExperience.includes(exp)}
                      onChange={() => handleExperienceChange(exp)}
                      className="rounded border-[#c3c6d8] text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className={`group-hover:text-primary transition-colors ${selectedExperience.includes(exp) ? 'text-primary font-bold' : ''}`}>
                      {exp}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Salary Range */}
            <section className="space-y-xs">
              <div className="flex justify-between items-center">
                <label className="font-body-sm font-bold block text-outline-variant text-[11px] uppercase tracking-wider">
                  Max Salary (LPA)
                </label>
                <span className="font-mono text-xs font-bold text-primary">₹{maxSalary} LPA</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={maxSalary}
                onChange={(e) => setMaxSalary(Number(e.target.value))}
                className="w-full h-1 bg-[#eaedff] rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-[#737687]">
                <span>₹10L</span>
                <span>₹80 LPA</span>
              </div>
            </section>

            {/* Location Query */}
            <section className="space-y-xs">
              <label className="font-body-sm font-bold block text-[#737687] text-[11px] uppercase tracking-wider">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bangalore"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#c3c6d8] py-xs pl-md pr-xl font-body-md text-[14px] focus:outline-none focus:border-primary-container"
                />
                <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-primary text-[18px]">
                  location_on
                </span>
              </div>
            </section>

            {/* Work Mode */}
            <section className="space-y-xs">
              <label className="font-body-sm font-bold block text-[#737687] text-[11px] uppercase tracking-wider">
                Work Mode
              </label>
              <div className="flex flex-wrap gap-xs">
                {['Remote', 'On-site', 'Hybrid'].map((mode) => {
                  const active = workModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      onClick={() => handleWorkModeToggle(mode)}
                      className={`px-sm py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-primary-container text-white border-primary-container'
                          : 'bg-[#f2f3ff] text-[#424655] border-[#c3c6d8]/50 hover:bg-[#e2e7ff]'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Company Size */}
            <section className="space-y-xs">
              <label className="font-body-sm font-bold block text-[#737687] text-[11px] uppercase tracking-wider">
                Company Size
              </label>
              <select
                value={selectedCompanySize}
                onChange={(e) => setSelectedCompanySize(e.target.value)}
                className="w-full rounded-xl border border-[#c3c6d8] py-xs px-md font-body-md text-[14px] focus:outline-none focus:border-primary-container"
              >
                <option value="Any Size">Any Size</option>
                <option value="1-50">1-50 (Startup)</option>
                <option value="51-200">51-200 (SME)</option>
                <option value="201-1000">201-1000 (Mid-Market)</option>
                <option value="1000+">1000+ (Enterprise)</option>
              </select>
            </section>
          </div>
        </aside>

        {/* Center Results */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-lg">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between sm:items-end pb-xs border-b border-[#c3c6d8]/30 gap-md">
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-[#121b30]">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Available
              </h1>
              <p className="font-body-md text-[#424655]">
                {searchQuery ? `Searching for "${searchQuery}"` : 'Browse curated high-performance roles'}
                {locationQuery ? ` in ${locationQuery}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-xs font-body-sm text-[#424655] self-start sm:self-auto text-[14px]">
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none bg-transparent font-bold text-[#121b30] focus:ring-0 p-0 cursor-pointer text-[14px]"
              >
                <option>Relevance</option>
                <option>Newest</option>
                <option>Salary: High to Low</option>
              </select>
            </div>
          </header>

          {/* Search bar inside content */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search job titles, keywords, skills, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#c3c6d8]/60 rounded-2xl py-md pl-xxl pr-md text-[#121b30] text-[15px] focus:outline-none focus:border-primary-container shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-md top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant hover:text-on-surface"
              >
                close
              </button>
            )}
          </div>

          {/* Job Cards */}
          <div className="flex flex-col gap-md">
            <AnimatePresence mode="popLayout">
              {filteredJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-xxl text-center border border-[#c3c6d8]/30 shadow-sm"
                >
                  <span className="material-symbols-outlined text-outline-variant text-[48px] mb-md">
                    search_off
                  </span>
                  <h3 className="font-title-lg text-title-lg font-bold mb-xs">No Jobs Found</h3>
                  <p className="text-outline-variant font-body-md mb-md">
                    We couldn't find any job posts matching your criteria. Try widening your search queries or resetting filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-primary-container text-white px-lg py-sm rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                filteredJobs.map((job, idx) => {
                  const isSaved = savedJobs.includes(job.id);
                  const isApplied = job.status === 'Applied';

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                      className="bg-white p-md rounded-2xl border border-[#c3c6d8]/20 shadow-sm hover:shadow-md transition-all duration-300 relative group border-l-4 border-l-transparent hover:border-l-primary-container"
                    >
                      {/* Badge tags */}
                      <div className="absolute top-md right-md flex gap-xs">
                        {idx === 0 && (
                          <span className="bg-[#EBF4FF] text-[#1E63F3] font-mono text-[10px] px-sm py-0.5 rounded-full uppercase font-bold tracking-tight">
                            Featured
                          </span>
                        )}
                        {idx === 1 && (
                          <span className="bg-[#f0fdf4] text-[#15803d] font-mono text-[10px] px-sm py-0.5 rounded-full uppercase font-bold tracking-tight">
                            Premium
                          </span>
                        )}
                      </div>

                      <div className="flex gap-md">
                        {/* Company Logo */}
                        <div className="w-16 h-16 rounded-xl bg-[#faf8ff] flex items-center justify-center border border-[#c3c6d8]/30 overflow-hidden shrink-0">
                          {job.logo ? (
                            <img src={job.logo} alt={`${job.company} Logo`} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-[32px] text-[#737687]">apartment</span>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/jobs/${job.id}`}>
                            <h3 className="font-title-md text-title-md font-bold text-[#121b30] hover:text-primary transition-colors truncate">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-sm mt-xs">
                            <span className="font-title-sm text-body-md font-bold text-[#424655] hover:underline">
                              <Link href={`/companies/${job.companyId}`}>
                                {job.company}
                              </Link>
                            </span>
                            <div className="flex items-center gap-xs text-[#2950ce]">
                              <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                              <span className="font-mono text-xs font-semibold">4.6</span>
                            </div>
                          </div>

                          {/* Quick details */}
                          <div className="flex flex-wrap gap-md mt-md text-[#424655] font-body-sm text-[13px]">
                            <div className="flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                              {job.location}
                            </div>
                            <div className="flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[16px] text-primary">work</span>
                              {job.experienceRequired}
                            </div>
                            <div className="flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
                              {job.salary}
                            </div>
                            <div className="flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                              {job.type}
                            </div>
                          </div>

                          {/* Skills tags */}
                          <div className="flex flex-wrap gap-xs mt-md">
                            {job.skills.map((skill) => (
                              <span
                                key={skill}
                                className="bg-[#eaedff]/60 text-[#2950ce] px-sm py-0.5 rounded-lg text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex justify-end gap-sm mt-md pt-md border-t border-[#c3c6d8]/10">
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className={`flex items-center gap-xs font-title-sm px-md py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            isSaved
                              ? 'text-error bg-error/5 hover:bg-error/10'
                              : 'text-outline-variant hover:text-error bg-transparent hover:bg-black/5'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'fill-current' : ''}`}>
                            bookmark
                          </span>
                          {isSaved ? 'Saved' : 'Save'}
                        </button>
                        
                        <Link href={`/jobs/${job.id}`} className="bg-[#eaedff] text-[#2950ce] hover:bg-[#dbe1ff] px-md py-1.5 rounded-lg font-bold text-xs flex items-center justify-center active:scale-95 transition-all">
                          Details
                        </Link>

                        <button
                          disabled={isApplied}
                          onClick={() => applyJob(job.id)}
                          className={`px-xl py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-[#16A34A]/100 text-white cursor-default'
                              : 'bg-primary-container text-white hover:brightness-110 active:scale-95'
                          }`}
                        >
                          {isApplied ? 'Applied' : 'Apply Now'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Rail Sidebar Widget Panel */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-[96px] flex flex-col gap-lg">
            {/* Resume Score Widget */}
            <div className="bg-white rounded-2xl p-md shadow-sm border border-[#c3c6d8]/30 text-center">
              <h3 className="font-title-sm text-title-sm font-bold text-[#121b30] mb-md">Resume ATS Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-md">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-[#eaedff]"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-primary-container"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="54"
                    stroke="currentColor"
                    strokeDasharray="339.29"
                    strokeDashoffset={currentUser?.resumeUploaded ? "84.82" : "254.46"} // 75% score or 25% if not uploaded
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display-md text-[32px] font-bold text-[#121b30] leading-none">
                    {currentUser?.resumeUploaded ? '75%' : '25%'}
                  </span>
                  <span className="font-body-sm text-[#737687]">
                    {currentUser?.resumeUploaded ? 'Good' : 'Incomplete'}
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-center text-[#424655] mb-md text-[13px]">
                {currentUser?.resumeUploaded
                  ? `"${currentUser.resumeName}" is parsed! Optimize keywords to increase match score by 15%.`
                  : 'Upload your resume to calculate a match score against companies.'}
              </p>
              <Link
                href="/dashboard/seeker/profile"
                className="w-full inline-block border border-primary text-primary py-sm rounded-lg font-bold text-xs hover:bg-primary/5 transition-all text-center"
              >
                {currentUser?.resumeUploaded ? 'Optimize Resume' : 'Upload Resume'}
              </Link>
            </div>

            {/* Set Job Alert */}
            <div className="bg-white rounded-2xl p-md shadow-sm border border-[#c3c6d8]/30">
              <div className="flex items-center gap-sm mb-xs text-primary">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                <h3 className="font-title-sm text-title-sm font-bold text-[#121b30]">Set Job Alert</h3>
              </div>
              <p className="font-body-sm text-[#424655] mb-md text-[13px]">
                Get notified instantly when new roles match your exact filtering selections.
              </p>
              <button className="w-full bg-inverse-surface text-white py-sm rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer">
                Activate Alert
              </button>
            </div>

            {/* Premium Upgrade */}
            <div
              className="relative overflow-hidden rounded-2xl p-md shadow-md border border-white/10 text-white flex flex-col"
              style={{ background: 'linear-gradient(135deg, #004bc9 0%, #2950ce 100%)' }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="bg-white/20 w-max px-sm py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-sm">
                  Exclusive Tier
                </div>
                <h3 className="font-headline-sm text-lg font-bold mb-xs">Martin Connect Premium</h3>
                <p className="font-body-sm text-white/80 mb-md text-[12px] leading-relaxed">
                  Get priority listing, direct access to recruiters, and salary benchmarking tools.
                </p>
                <Link
                  href="/pricing"
                  className="w-full block bg-white text-primary text-center py-sm rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
      <RoleSwitcher />
    </div>
  );
}
