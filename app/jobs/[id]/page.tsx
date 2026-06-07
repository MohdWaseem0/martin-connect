'use client';

import React, { use, useState, useEffect } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage(props: PageProps) {
  const router = useRouter();
  const { jobs, applyJob } = useMartinConnect();

  // Resolve params promise
  const params = use(props.params);
  const jobId = params.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'company' | 'reviews' | 'salaries'>('overview');
  const [isSaved, setIsSaved] = useState(false);

  // Find current job
  const job = jobs.find((j) => j.id === jobId);

  // Bookmarks check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mc_saved_jobs');
      if (saved) {
        try {
          const ids = JSON.parse(saved);
          setIsSaved(ids.includes(jobId));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [jobId]);

  const toggleBookmark = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mc_saved_jobs');
      let ids = saved ? JSON.parse(saved) : [];
      if (ids.includes(jobId)) {
        ids = ids.filter((id: string) => id !== jobId);
        setIsSaved(false);
      } else {
        ids.push(jobId);
        setIsSaved(true);
      }
      localStorage.setItem('mc_saved_jobs', JSON.stringify(ids));
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-[#faf8ff] text-[#121b30] flex flex-col font-body-md">
        <Navbar />
        <main className="max-w-[1440px] w-full mx-auto px-lg py-xxl flex-1 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-outline-variant text-[56px] mb-md">warning</span>
          <h2 className="font-headline-sm text-headline-sm font-bold mb-xs">Job Post Not Found</h2>
          <p className="text-[#424655] mb-md">The job post you are trying to view does not exist or has been deleted.</p>
          <button
            onClick={() => router.push('/jobs')}
            className="bg-primary-container text-white px-lg py-sm rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Back to Job Directory
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const isApplied = job.status === 'Applied';

  // Get similar jobs (different from this one, but sharing some skills or location)
  const similarJobs = jobs
    .filter((j) => j.id !== job.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#121b30] flex flex-col font-body-md antialiased">
      <Navbar />

      <main className="max-w-[1440px] w-full mx-auto px-lg py-xl flex flex-col lg:flex-row gap-gutter flex-1">
        {/* Main Content Area */}
        <div className="flex-1 lg:max-w-[760px] space-y-lg">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-xs text-[#424655] text-xs">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#737687] truncate max-w-xs">{job.title}</span>
          </nav>

          {/* Job Header Card */}
          <div className="bg-white border border-[#c3c6d8]/30 rounded-2xl p-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-md mb-md">
              <div className="flex items-start gap-md">
                <div className="w-16 h-16 rounded-xl border border-[#c3c6d8]/30 flex items-center justify-center bg-white overflow-hidden p-xs shrink-0 shadow-xs">
                  {job.logo ? (
                    <img src={job.logo} alt={`${job.company} Logo`} className="w-full h-full object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-[32px] text-[#737687]">apartment</span>
                  )}
                </div>
                <div>
                  <h1 className="font-headline-sm text-headline-sm font-bold text-[#121b30] leading-tight mb-xs">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-sm">
                    <span className="font-title-sm text-body-md font-bold text-[#424655]">
                      {job.company}
                    </span>
                    <div className="flex items-center bg-[#eaedff] px-1.5 py-0.5 rounded text-xs text-[#2950ce] font-semibold gap-xs">
                      <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                      <span>4.6</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="material-symbols-outlined text-[#737687] hover:text-primary transition-colors p-sm bg-[#f2f3ff] hover:bg-[#e2e7ff] rounded-full cursor-pointer self-end sm:self-start"
              >
                share
              </button>
            </div>

            <div className="flex flex-wrap gap-sm">
              <span className="flex items-center gap-xs px-md py-xs bg-[#f2f3ff] rounded-full text-xs font-semibold text-[#121b30]">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                {job.location}
              </span>
              <span className="flex items-center gap-xs px-md py-xs bg-[#f2f3ff] rounded-full text-xs font-semibold text-[#121b30]">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                {job.type}
              </span>
              <span className="flex items-center gap-xs px-md py-xs bg-[#f2f3ff] rounded-full text-xs font-semibold text-[#121b30]">
                <span className="material-symbols-outlined text-[16px] text-primary">work_history</span>
                {job.experienceRequired}
              </span>
              <span className="flex items-center gap-xs px-md py-xs bg-[#f2f3ff] rounded-full text-xs font-semibold text-[#121b30]">
                <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
                {job.salary}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#c3c6d8]/30 gap-lg">
            {(['overview', 'company', 'reviews', 'salaries'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-title-md text-title-md py-md border-b-2 transition-all cursor-pointer capitalize text-[15px] font-semibold ${
                  activeTab === tab
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-[#737687] hover:text-[#121b30]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Content */}
          <div className="bg-white border border-[#c3c6d8]/20 rounded-2xl p-lg shadow-sm min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="space-y-lg">
                <section>
                  <h2 className="font-title-lg text-title-lg font-bold text-[#121b30] mb-sm">Job Description</h2>
                  <p className="text-[#424655] leading-relaxed text-[15px]">
                    {job.description || `We are looking for an ambitious engineering professional to join the team. You will be core to building out scalable business flows, working on technical architecture and translating mocks into reliable user features. You will own software delivery modules and help raise code quality limits.`}
                  </p>
                </section>

                <section>
                  <h2 className="font-title-lg text-title-lg font-bold text-[#121b30] mb-sm font-semibold">Key Requirements</h2>
                  <ul className="space-y-sm">
                    {job.requirements && job.requirements.length > 0 ? (
                      job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-sm">
                          <span className="material-symbols-outlined text-[#16A34A] mt-[2px] text-[18px]">
                            check_circle
                          </span>
                          <span className="text-[#424655] text-[14px] leading-relaxed">{req}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-sm">
                          <span className="material-symbols-outlined text-[#16A34A] mt-[2px] text-[18px]">check_circle</span>
                          <span className="text-[#424655] text-[14px]">Proven software implementation experience in production.</span>
                        </li>
                        <li className="flex items-start gap-sm">
                          <span className="material-symbols-outlined text-[#16A34A] mt-[2px] text-[18px]">check_circle</span>
                          <span className="text-[#424655] text-[14px]">Deep comfort with modern frameworks and version control systems.</span>
                        </li>
                        <li className="flex items-start gap-sm">
                          <span className="material-symbols-outlined text-[#16A34A] mt-[2px] text-[18px]">check_circle</span>
                          <span className="text-[#424655] text-[14px]">Strong clean code principles and collaborative communication capability.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="font-title-lg text-title-lg font-bold text-[#121b30] mb-sm">Required Skills</h2>
                  <div className="flex flex-wrap gap-xs">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-md py-sm bg-[#f2f3ff] border border-[#c3c6d8]/40 rounded-lg text-xs font-semibold text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="font-title-lg text-title-lg font-bold text-[#121b30] mb-sm">Perks & Benefits</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <div className="flex gap-md p-md bg-[#faf8ff] border border-[#c3c6d8]/30 rounded-xl">
                      <span className="material-symbols-outlined text-primary text-[32px]">health_and_safety</span>
                      <div>
                        <p className="font-title-sm text-title-sm font-semibold text-[#121b30]">Medical Cover</p>
                        <p className="text-xs text-[#737687]">Premium health cover for self & immediate family dependents.</p>
                      </div>
                    </div>
                    <div className="flex gap-md p-md bg-[#faf8ff] border border-[#c3c6d8]/30 rounded-xl">
                      <span className="material-symbols-outlined text-primary text-[32px]">laptop_mac</span>
                      <div>
                        <p className="font-title-sm text-title-sm font-semibold text-[#121b30]">MacBook Pro Setup</p>
                        <p className="text-xs text-[#737687]">High performance workstation setup with external monitor budget.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-md">
                <h3 className="font-title-lg text-title-lg font-bold text-[#121b30]">{job.company}</h3>
                <p className="text-[#424655] leading-relaxed text-[14px]">
                  {job.company} is an industrial leader specializing in cloud services, logistics and high-density technology solutions. Known for scale, standard-raising products, and hiring top caliber talent.
                </p>
                <div className="grid grid-cols-2 gap-md pt-md">
                  <div className="bg-[#faf8ff] p-md rounded-xl border border-[#c3c6d8]/35 text-center">
                    <p className="text-xs text-[#737687] uppercase font-bold tracking-wider mb-1">HQ Location</p>
                    <p className="font-title-sm font-semibold text-[#121b30] text-[15px]">{job.location.split('(')[0]}</p>
                  </div>
                  <div className="bg-[#faf8ff] p-md rounded-xl border border-[#c3c6d8]/35 text-center">
                    <p className="text-xs text-[#737687] uppercase font-bold tracking-wider mb-1">Hiring Status</p>
                    <p className="font-title-sm font-semibold text-[#121b30] text-[15px]">Active</p>
                  </div>
                </div>
                <div className="pt-md text-center">
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="text-primary hover:underline text-body-sm font-bold"
                  >
                    View Company Profile & Reviews →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-md">
                <h3 className="font-title-lg text-title-lg font-bold text-[#121b30]">Employee Feedback</h3>
                <div className="space-y-sm">
                  <div className="p-md bg-[#faf8ff] rounded-xl border border-[#c3c6d8]/30">
                    <div className="flex justify-between items-center mb-xs">
                      <p className="font-title-sm font-bold text-[14px]">Senior SDE • Bangalore HQ</p>
                      <span className="text-[#2950ce] font-mono text-xs font-bold">★ 5.0</span>
                    </div>
                    <p className="text-xs text-[#737687] mb-xs">"Incredible engineering ownership, top shelf talent pool, and very strong compensation models. Heavy workload occasionally but highly rewarding."</p>
                  </div>
                  <div className="p-md bg-[#faf8ff] rounded-xl border border-[#c3c6d8]/30">
                    <div className="flex justify-between items-center mb-xs">
                      <p className="font-title-sm font-bold text-[14px]">Product Designer • Remote</p>
                      <span className="text-[#2950ce] font-mono text-xs font-bold">★ 4.0</span>
                    </div>
                    <p className="text-xs text-[#737687] mb-xs">"Great focus on design system alignment. Flexible remote choices make life easy."</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'salaries' && (
              <div className="space-y-md">
                <h3 className="font-title-lg text-title-lg font-bold text-[#121b30]">Compensation Benchmarking</h3>
                <p className="text-xs text-[#737687]">Based on self-reported salaries for similar experience brackets in this location.</p>
                <div className="space-y-xs pt-md">
                  <div className="flex justify-between text-xs text-[#424655]">
                    <span>Lower Range</span>
                    <span className="font-bold">₹15 LPA</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-3 rounded-full overflow-hidden relative">
                    <div className="absolute left-[30%] right-[10%] bg-primary h-full rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-[#424655]">
                    <span className="text-primary font-bold">Average: {job.salary}</span>
                    <span>High Range: ₹70+ LPA</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Panel */}
        <aside className="w-full lg:w-[360px] space-y-lg">
          {/* Action Card */}
          <div className="bg-white border border-[#c3c6d8]/30 rounded-2xl p-lg shadow-sm flex flex-col gap-sm">
            <button
              disabled={isApplied}
              onClick={() => applyJob(job.id)}
              className={`w-full py-md rounded-xl font-bold text-[15px] shadow-xs cursor-pointer active:scale-95 transition-all text-center ${
                isApplied
                  ? 'bg-[#16A34A]/100 text-white cursor-default'
                  : 'bg-primary-container text-white hover:brightness-110'
              }`}
            >
              {isApplied ? 'Application Sent' : 'Apply Now'}
            </button>

            <button
              onClick={toggleBookmark}
              className={`w-full py-md rounded-xl font-bold text-[15px] border cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-xs ${
                isSaved
                  ? 'border-error text-error bg-error/5 hover:bg-error/10'
                  : 'border-[#c3c6d8] text-[#424655] bg-transparent hover:bg-[#f2f3ff]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'fill-current' : ''}`}>
                bookmark
              </span>
              {isSaved ? 'Remove Bookmark' : 'Save Job Posting'}
            </button>

            <div className="mt-md pt-md border-t border-[#c3c6d8]/30">
              <p className="font-body-sm font-bold text-[#737687] text-[10px] uppercase tracking-wider mb-sm">
                Recruiter contact
              </p>
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c3c6d8] shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuyQz2zGLKJU3x0_EHo_RWszzoMVp6HlE7h1KsHC_BRss8Mfq0-5_fYb9DCZM7eMdlZXTXjIH-5OU5ckbveYQ1xRunl04qUwHs1yLH8KWxKapAKvEGbtSakues7U3vhU2J0rciGfrXlKQRxaIhh2suqmrnCiYGdB6L8fv8GSY3AzjzXngZrT7ORACQ4V4VDu4cgqYho3Daoc_qa4f0cc0pRp8oNcT1_9f7TimBWb3ZxlfTsemRYpmZLANGVt95DNXWhm31rMVOOX4"
                    alt="Neha Gupta profile"
                  />
                </div>
                <div>
                  <p className="font-title-sm text-body-sm font-bold text-[#121b30]">Neha Gupta</p>
                  <p className="text-[11px] text-[#737687]">Senior Talent Acquisition</p>
                </div>
                <a
                  href="mailto:neha.gupta@company.com"
                  className="ml-auto material-symbols-outlined text-primary hover:bg-[#faf8ff] p-2 rounded-full border border-[#c3c6d8]/40 transition-colors cursor-pointer text-[18px]"
                >
                  mail
                </a>
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="space-y-md">
            <h3 className="font-title-lg text-title-lg font-bold text-[#121b30]">Similar Openings</h3>
            <div className="space-y-sm">
              {similarJobs.map((simJob) => (
                <div
                  key={simJob.id}
                  onClick={() => router.push(`/jobs/${simJob.id}`)}
                  className="bg-white border border-[#c3c6d8]/20 hover:border-primary-container rounded-2xl p-md shadow-xs hover:shadow-sm cursor-pointer transition-all border-l-2 border-l-transparent hover:border-l-primary-container"
                >
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 rounded border border-[#c3c6d8]/30 flex items-center justify-center bg-white p-xs overflow-hidden shrink-0">
                      {simJob.logo ? (
                        <img src={simJob.logo} alt={simJob.company} className="w-full h-full object-contain" />
                      ) : (
                        <span className="material-symbols-outlined text-outline">apartment</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-title-sm text-body-sm font-bold text-[#121b30] truncate hover:text-primary transition-colors">
                        {simJob.title}
                      </h4>
                      <p className="text-xs text-[#737687] truncate">
                        {simJob.company} • {simJob.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-xs border-t border-[#c3c6d8]/10 text-xs">
                    <span className="font-mono text-primary font-bold">{simJob.salary}</span>
                    <span className="text-[#737687]">{simJob.posted}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/jobs"
              className="w-full inline-block py-sm text-center font-bold text-xs text-primary hover:bg-primary/5 rounded-xl border border-primary/20 transition-all"
            >
              Browse All Jobs
            </Link>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
