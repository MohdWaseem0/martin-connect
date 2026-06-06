'use client';

import React, { use, useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoleSwitcher from '@/components/RoleSwitcher';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage(props: PageProps) {
  const router = useRouter();
  const { companies, jobs } = useMartinConnect();

  // Resolve params promise
  const params = use(props.params);
  const companyId = params.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'reviews' | 'salaries'>('overview');

  // Find company
  const company = companies.find((c) => c.id === companyId);

  if (!company) {
    return (
      <div className="min-h-screen bg-[#faf8ff] text-[#121b30] flex flex-col font-body-md">
        <Navbar />
        <main className="max-w-[1440px] w-full mx-auto px-lg py-xxl flex-1 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-outline-variant text-[56px] mb-md">warning</span>
          <h2 className="font-headline-sm text-headline-sm font-bold mb-xs">Company Profile Not Found</h2>
          <p className="text-[#424655] mb-md">The company profile you are trying to view does not exist or has been removed.</p>
          <button
            onClick={() => router.push('/companies')}
            className="bg-primary-container text-white px-lg py-sm rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Back to Companies Directory
          </button>
        </main>
        <Footer />
        <RoleSwitcher />
      </div>
    );
  }

  // Filter jobs posted by this company
  const companyJobs = jobs.filter((job) => job.companyId === company.id);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#121b30] flex flex-col font-body-md antialiased">
      <Navbar />

      {/* Hero Header Section */}
      <section className="bg-white border-b border-[#c3c6d8]/40">
        <div className="max-w-[1440px] w-full mx-auto px-lg pt-xl pb-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
            <div className="flex items-start md:items-center gap-lg">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#c3c6d8]/35 flex-shrink-0 bg-white p-2 shadow-xs">
                <img src={company.logo} alt={`${company.name} Logo`} className="w-full h-full object-contain" />
              </div>
              <div className="space-y-xs">
                <div className="flex items-center gap-sm">
                  <h1 className="font-headline-md text-headline-md font-bold text-[#121b30] leading-tight">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <span className="bg-[#16A34A]/10 text-[#15803d] border border-[#16A34A]/30/50 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[12px] fill-current">verified</span>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[#424655] font-body-lg flex flex-wrap items-center gap-sm text-[14px]">
                  <span className="font-semibold text-primary">{company.industry}</span>
                  <span className="w-1 h-1 bg-[#c3c6d8] rounded-full"></span>
                  <span>{company.location}</span>
                  <span className="w-1 h-1 bg-[#c3c6d8] rounded-full"></span>
                  <span>{company.size}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-md">
              <button
                onClick={() => alert(`Following ${company.name}!`)}
                className="px-xl py-sm border border-primary text-primary rounded-lg font-bold text-[14px] hover:bg-primary/5 transition-all cursor-pointer"
              >
                Follow
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className="px-xl py-sm bg-primary text-white rounded-lg font-bold text-[14px] shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                View {companyJobs.length} Open Jobs
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-lg mt-xl overflow-x-auto border-b border-[#c3c6d8]/20">
            {(['overview', 'jobs', 'reviews', 'salaries'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-sm px-xs font-semibold transition-all cursor-pointer capitalize text-[14px] ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-[#737687] hover:text-[#121b30]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-[1440px] w-full mx-auto px-lg py-xl flex flex-col lg:flex-row gap-gutter flex-1">
        {/* Left Column Content */}
        <div className="flex-1 lg:max-w-[760px] space-y-lg">
          {activeTab === 'overview' && (
            <div className="space-y-lg">
              {/* About Section */}
              <section className="bg-white p-lg rounded-2xl border border-[#c3c6d8]/20 shadow-xs border-l-4 border-l-primary-container">
                <h2 className="font-title-lg text-title-lg font-bold text-[#121b30] mb-md">About {company.name}</h2>
                <div className="space-y-md text-[#424655] leading-relaxed text-[14px]">
                  <p>{company.description}</p>
                  <p>
                    Founded in {company.founded}, we focus on engineering high-density technology solutions, fostering an environment where innovation is standard and transparent logic takes precedence.
                  </p>
                </div>
              </section>

              {/* Working Culture */}
              <section className="bg-white p-lg rounded-2xl border border-[#c3c6d8]/20 shadow-xs">
                <h2 className="font-title-lg text-title-lg font-bold text-[#121b30] mb-md">Working Culture</h2>
                <p className="text-[#424655] mb-lg text-[14px]">
                  We believe that professional growth, mutual accountability, and technological excellence are not just buzzwords. They are the cornerstones of our culture.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="flex gap-md p-md bg-[#faf8ff] rounded-xl border border-[#c3c6d8]/30">
                    <span className="material-symbols-outlined text-primary text-[28px]">groups</span>
                    <div>
                      <h4 className="font-title-sm text-body-md font-bold text-[#121b30] mb-xs">Customer Focus</h4>
                      <p className="text-xs text-[#737687]">Every line of code written starts with solving customer experience bottlenecks.</p>
                    </div>
                  </div>
                  <div className="flex gap-md p-md bg-[#faf8ff] rounded-xl border border-[#c3c6d8]/30">
                    <span className="material-symbols-outlined text-primary text-[28px]">visibility</span>
                    <div>
                      <h4 className="font-title-sm text-body-md font-bold text-[#121b30] mb-xs">Absolute Transparency</h4>
                      <p className="text-xs text-[#737687]">We share operational logs and roadmap strategies broadly with all team members.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Benefits & Perks */}
              <section className="space-y-md">
                <h2 className="font-title-lg text-title-lg font-bold text-[#121b30]">Benefits & Perks</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
                  {[
                    { icon: 'health_and_safety', title: 'Health Cover' },
                    { icon: 'monitoring', title: 'ESOPs Option' },
                    { icon: 'event_available', title: 'Flexible Leave' },
                    { icon: 'school', title: 'Learning Budget' },
                    { icon: 'corporate_fare', title: 'Modern Offices' },
                    { icon: 'restaurant', title: 'Catered Meals' }
                  ].map((benefit, i) => (
                    <div
                      key={i}
                      className="bg-white p-md rounded-2xl border border-[#c3c6d8]/20 hover:border-primary text-center space-y-sm transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-3xl text-[#2950ce]">{benefit.icon}</span>
                      <p className="font-title-sm text-xs font-bold text-[#121b30]">{benefit.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-md">
              <h2 className="font-title-lg text-title-lg font-bold text-[#121b30]">Open Positions at {company.name}</h2>
              {companyJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-xxl text-center border border-[#c3c6d8]/30 shadow-xs">
                  <span className="material-symbols-outlined text-outline-variant text-[48px] mb-md">work_outline</span>
                  <h3 className="font-title-lg text-title-lg font-bold mb-xs">No Active Openings</h3>
                  <p className="text-outline-variant font-body-md">
                    There are currently no active job postings for this company. Check back later or follow to receive notifications.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-md">
                  {companyJobs.map((companyJob) => (
                    <div
                      key={companyJob.id}
                      className="bg-white p-md rounded-2xl border border-[#c3c6d8]/20 shadow-xs hover:shadow-sm transition-all border-l-4 border-l-transparent hover:border-l-primary-container"
                    >
                      <div className="flex justify-between items-start mb-sm">
                        <Link href={`/jobs/${companyJob.id}`}>
                          <h4 className="font-title-sm text-body-md font-bold text-[#121b30] hover:text-primary transition-colors">
                            {companyJob.title}
                          </h4>
                        </Link>
                        <span className="bg-[#eaedff] text-[#2950ce] px-sm py-0.5 rounded text-xs font-mono font-semibold">
                          {companyJob.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-md text-xs text-[#737687] mb-md">
                        <span>{companyJob.location}</span>
                        <span>•</span>
                        <span>{companyJob.experienceRequired}</span>
                        <span>•</span>
                        <span className="text-primary font-semibold">{companyJob.salary}</span>
                      </div>
                      <div className="flex justify-end gap-xs pt-sm border-t border-[#c3c6d8]/10">
                        <Link
                          href={`/jobs/${companyJob.id}`}
                          className="bg-[#f2f3ff] text-primary hover:bg-[#e2e7ff] px-lg py-1.5 rounded-lg font-bold text-xs"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-md">
              <h2 className="font-title-lg text-title-lg font-bold text-[#121b30]">Employee Reviews</h2>
              <div className="space-y-sm">
                <div className="p-md bg-white rounded-2xl border border-[#c3c6d8]/30 shadow-xs">
                  <div className="flex justify-between items-center mb-xs">
                    <p className="font-title-sm text-body-md font-bold text-[#121b30]">Staff Software Engineer • Bengaluru</p>
                    <span className="text-amber-500 font-bold text-xs">★ 4.8</span>
                  </div>
                  <p className="text-xs text-[#424655] leading-relaxed">
                    "Excellent technology stack ownership, collaborative work circles, and competitive compensation ratios. Sometimes the pace can be rapid, but management handles scaling effectively."
                  </p>
                </div>
                <div className="p-md bg-white rounded-2xl border border-[#c3c6d8]/30 shadow-xs">
                  <div className="flex justify-between items-center mb-xs">
                    <p className="font-title-sm text-body-md font-bold text-[#121b30]">Associate Product Manager • Mumbai</p>
                    <span className="text-amber-500 font-bold text-xs">★ 4.2</span>
                  </div>
                  <p className="text-xs text-[#424655] leading-relaxed">
                    "Great career ladder design. Mentorship programs are active and very structured. The cross-functional teams communicate transparently."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salaries' && (
            <div className="bg-white p-lg rounded-2xl border border-[#c3c6d8]/20 shadow-xs space-y-md">
              <h2 className="font-title-lg text-title-lg font-bold text-[#121b30]">Salary Benchmarking</h2>
              <p className="text-xs text-[#737687]">Average self-reported annual CTC statistics for engineering and product roles.</p>
              <div className="space-y-md pt-sm">
                {[
                  { role: 'Software Engineer', range: '₹14L - 28L', avg: '₹21 LPA' },
                  { role: 'Senior SDE', range: '₹24L - 42L', avg: '₹33 LPA' },
                  { role: 'Product Manager', range: '₹20L - 38L', avg: '₹29 LPA' }
                ].map((sal, i) => (
                  <div key={i} className="space-y-xs">
                    <div className="flex justify-between text-xs font-semibold text-[#121b30]">
                      <span>{sal.role}</span>
                      <span>{sal.range}</span>
                    </div>
                    <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: i === 0 ? '55%' : i === 1 ? '78%' : '65%' }}></div>
                    </div>
                    <div className="text-right text-[10px] text-primary font-bold">Average: {sal.avg}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Insights Sidebar */}
        <aside className="w-full lg:w-[360px] space-y-lg">
          {/* Insights Card */}
          <section className="bg-white p-lg rounded-2xl border border-[#c3c6d8]/30 shadow-xs space-y-lg">
            <h3 className="font-title-md text-body-md font-bold text-[#121b30]">Company Insights</h3>
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-xs">
                    <span className="font-display-md text-[32px] font-bold text-primary">{company.rating || '4.2'}</span>
                    <span className="material-symbols-outlined text-primary text-[20px] fill-current">star</span>
                  </div>
                  <p className="text-[11px] text-[#737687]">Average Rating</p>
                </div>
                <div className="w-[1px] h-10 bg-[#c3c6d8]/50"></div>
                <div className="text-center flex-1">
                  <div className="font-display-md text-[32px] font-bold text-primary">92%</div>
                  <p className="text-[11px] text-[#737687]">CEO Approval</p>
                </div>
              </div>
              <div className="bg-[#faf8ff] p-md rounded-xl border border-[#c3c6d8]/30">
                <div className="flex justify-between items-center mb-xs text-xs font-semibold text-[#121b30]">
                  <span>Would Recommend</span>
                  <span className="text-primary font-bold">88%</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Social and Website Links */}
          <section className="bg-white p-lg rounded-2xl border border-[#c3c6d8]/30 shadow-xs space-y-md">
            <h3 className="font-title-md text-body-md font-bold text-[#121b30]">Socials & Resources</h3>
            <div className="flex flex-col gap-xs text-[13px]">
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-md p-sm rounded-lg hover:bg-[#faf8ff] transition-all text-[#424655] hover:text-[#121b30] font-semibold border border-transparent hover:border-[#c3c6d8]/30"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">language</span>
                <span>{company.website}</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-md p-sm rounded-lg hover:bg-[#faf8ff] transition-all text-[#424655] hover:text-[#121b30] font-semibold border border-transparent hover:border-[#c3c6d8]/30"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">hub</span>
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </section>

          {/* Key Facts */}
          <section className="bg-white p-lg rounded-2xl border border-[#c3c6d8]/30 shadow-xs space-y-sm text-xs">
            <h3 className="font-title-md text-body-md font-bold text-[#121b30] mb-md">Key Facts</h3>
            <div className="flex justify-between py-1.5 border-b border-[#c3c6d8]/15">
              <span className="text-[#737687]">Founded</span>
              <span className="font-bold text-[#121b30]">{company.founded}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#c3c6d8]/15">
              <span className="text-[#737687]">Industry</span>
              <span className="font-bold text-[#121b30]">{company.industry}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#c3c6d8]/15">
              <span className="text-[#737687]">Global Headcount</span>
              <span className="font-bold text-[#121b30]">{company.size}</span>
            </div>
          </section>
        </aside>
      </main>

      <Footer />
      <RoleSwitcher />
    </div>
  );
}
