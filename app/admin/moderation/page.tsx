'use client';

import React, { useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Link from 'next/link';

export default function ModerationConsole() {
  const {
    pendingCompanies,
    pendingJobs,
    verifyCompany,
    rejectCompany,
    moderateJob
  } = useMartinConnect();

  const [activeTab, setActiveTab] = useState<'companies' | 'jobs'>('companies');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'info' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const handleVerifyCompany = (id: string, name: string) => {
    verifyCompany(id);
    showFeedback(`Company "${name}" has been successfully verified!`);
  };

  const handleRejectCompany = (id: string, name: string) => {
    rejectCompany(id);
    showFeedback(`Company "${name}" verification request declined.`, 'info');
  };

  const handleApproveJob = (id: string, title: string) => {
    moderateJob(id, true);
    showFeedback(`Job post "${title}" approved and published to job board!`);
  };

  const handleRejectJob = (id: string, title: string) => {
    moderateJob(id, false);
    showFeedback(`Job post "${title}" rejected and deleted.`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 px-lg sticky top-0 z-40 bg-white border-b border-[#E8EEF7] shadow-xs">
        <div className="flex items-center gap-xs">
          <Link href="/admin" className="text-[#737687] hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <h1 className="font-bold text-body-md text-[#121b30] pl-xs">Moderation Console</h1>
        </div>

        <div className="flex items-center gap-lg ml-auto">
          <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden bg-slate-200">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Lss7ID71JKvl--u83cUntSTj4ygMraFQuMi0K0eK6z5RKCWCUozv6XH-64oHZHnv2omwuu85NoXSZS7ywfGEv1vBeNtJYirE3Hf9e2VL-2CEYPewLGJnpAlMR82MY_j7xZiZHHPQQgTsHz-F8fWvBSuZiIS5P56ZRe45bDer5M3Bkj9eP0HI-A9LWuCXndqrmBzfgKo-oOQUNqLwsIR1TdMR3IIUl-Ti9fQrz0Ao-KdsBnkgZJyIuSDgpqLvIoe6kK11ptkMCEA"
              alt="Admin Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Content body */}
      <main className="p-lg flex-1 space-y-lg">
        {/* Floating feedback toast alert */}
        {feedbackMsg && (
          <div className={`fixed top-4 right-4 z-50 px-lg py-md rounded-xl shadow-lg flex items-center gap-md border animate-fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-[#16A34A]/10 border-[#16A34A]/30 text-[#15803d]'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {feedbackMsg.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <p className="text-xs font-bold">{feedbackMsg.text}</p>
          </div>
        )}

        {/* Section Intro Card */}
        <section className="bg-gradient-to-r from-[#0d1e3d] to-[#081126] text-white p-lg rounded-2xl border border-white/10 shadow-md">
          <div className="max-w-2xl">
            <span className="px-2 py-0.5 bg-primary-container/20 text-primary-container text-[10px] font-bold uppercase tracking-wider rounded border border-primary-container/30">
              Trust & Safety Operations
            </span>
            <h2 className="text-2xl font-bold mt-sm mb-xs">Verification Queue</h2>
            <p className="text-xs text-outline-variant/80 leading-relaxed">
              Review and moderate incoming submissions on Martin Connect. Ensuring business entities and recruitment campaigns conform to global platform criteria avoids spam listings.
            </p>
          </div>
        </section>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E8EEF7]">
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-xs px-lg py-3.5 border-b-2 font-bold text-xs cursor-pointer transition-all ${
              activeTab === 'companies'
                ? 'border-primary text-primary'
                : 'border-transparent text-[#737687] hover:text-[#121b30]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
            <span>Pending Companies</span>
            <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold ml-1 ${
              pendingCompanies.length > 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-[#737687]'
            }`}>
              {pendingCompanies.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-xs px-lg py-3.5 border-b-2 font-bold text-xs cursor-pointer transition-all ${
              activeTab === 'jobs'
                ? 'border-primary text-primary'
                : 'border-transparent text-[#737687] hover:text-[#121b30]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">work</span>
            <span>Pending Job Listings</span>
            <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold ml-1 ${
              pendingJobs.length > 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-[#737687]'
            }`}>
              {pendingJobs.length}
            </span>
          </button>
        </div>

        {/* Panel List container */}
        <div className="space-y-md">
          {activeTab === 'companies' && (
            <div className="space-y-md">
              {pendingCompanies.length === 0 ? (
                <div className="bg-white border border-[#E8EEF7] p-xl rounded-2xl text-center space-y-md flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">verified</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-body-md text-[#121b30]">All Companies Verified</h3>
                    <p className="text-xs text-[#737687] mt-1 max-w-sm">No business entities are currently waiting for security and compliance verification.</p>
                  </div>
                </div>
              ) : (
                pendingCompanies.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white border border-outline-variant p-lg rounded-2xl shadow-xs hover:border-[#1E63F3]/30 transition-all flex flex-col md:flex-row gap-lg justify-between items-start md:items-center"
                  >
                    <div className="flex gap-md items-start flex-1">
                      <div className="w-16 h-16 rounded-xl border border-outline-variant flex-shrink-0 bg-slate-50 flex items-center justify-center p-xs overflow-hidden">
                        <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-xs">
                        <div className="flex flex-wrap gap-xs items-center">
                          <h3 className="font-bold text-title-md text-[#121b30]">{comp.name}</h3>
                          <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[8px] font-bold rounded">
                            UNVERIFIED SIGN-UP
                          </span>
                        </div>
                        <p className="text-xs text-[#424655] font-semibold">{comp.industry} • {comp.size}</p>
                        <p className="text-xs text-[#737687] line-clamp-2 max-w-2xl">{comp.description}</p>
                        
                        <div className="flex flex-wrap gap-sm text-[11px] font-semibold text-[#737687] pt-2">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {comp.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                            Founded {comp.founded}
                          </span>
                          <span>•</span>
                          <a href={`https://${comp.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">language</span>
                            {comp.website}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-md w-full md:w-auto border-t md:border-t-0 pt-md md:pt-0 border-[#E8EEF7]">
                      <button
                        onClick={() => handleRejectCompany(comp.id, comp.name)}
                        className="flex-1 md:flex-none border border-error/30 text-error hover:bg-error/5 px-lg py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerifyCompany(comp.id, comp.name)}
                        className="flex-1 md:flex-none bg-primary hover:brightness-110 active:scale-95 text-white px-lg py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Verify & Approve</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-md">
              {pendingJobs.length === 0 ? (
                <div className="bg-white border border-[#E8EEF7] p-xl rounded-2xl text-center space-y-md flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">work</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-body-md text-[#121b30]">All Job Posts Moderated</h3>
                    <p className="text-xs text-[#737687] mt-1 max-w-sm">No recruitment campaigns are currently queued for listing approval.</p>
                  </div>
                </div>
              ) : (
                pendingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-outline-variant p-lg rounded-2xl shadow-xs hover:border-[#1E63F3]/30 transition-all flex flex-col gap-md"
                  >
                    <div className="flex gap-md items-start justify-between">
                      <div className="flex gap-md items-start">
                        <div className="w-12 h-12 rounded-xl border border-outline-variant bg-slate-50 flex items-center justify-center p-xs overflow-hidden">
                          <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h3 className="font-bold text-title-md text-[#121b30]">{job.title}</h3>
                          <p className="text-xs text-[#424655] font-semibold">{job.company} • {job.location}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-slate-100 text-[#424655] text-[9px] font-bold rounded">
                              {job.type}
                            </span>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded">
                              {job.experienceRequired}
                            </span>
                            <span className="px-2 py-0.5 bg-[#16A34A]/10 text-[#15803d] text-[9px] font-bold rounded font-mono">
                              {job.salary}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-sm">
                        <button
                          onClick={() => handleRejectJob(job.id, job.title)}
                          className="border border-error/30 text-error hover:bg-error/5 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                          title="Reject post"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                        <button
                          onClick={() => handleApproveJob(job.id, job.title)}
                          className="bg-[#16A34A] hover:bg-[#15803d] text-white w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-xs"
                          title="Approve post"
                        >
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-[#E8EEF7] pt-md space-y-sm">
                      <div>
                        <h4 className="text-xs font-bold text-[#121b30]">Description</h4>
                        <p className="text-xs text-[#737687] leading-relaxed mt-1">{job.description}</p>
                      </div>

                      {job.requirements && job.requirements.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-[#121b30]">Requirements Checklist</h4>
                          <ul className="list-disc pl-md text-xs text-[#737687] mt-1 space-y-0.5">
                            {job.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-xs pt-1">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-[#f2f3ff] text-primary text-[10px] font-bold rounded-lg border border-[#c3c6d8]/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
