'use client';

import React, { useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const router = useRouter();
  const { addJob, currentUser } = useMartinConnect();

  // Step state
  const [step, setStep] = useState(1);

  // Form Field States
  const [title, setTitle] = useState('Full Stack Developer');
  const [category, setCategory] = useState('Engineering & Tech');
  const [department, setDepartment] = useState('Product Engineering');
  const [type, setType] = useState('Full-time');
  const [openings, setOpenings] = useState(3);
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [salaryMin, setSalaryMin] = useState('20L');
  const [salaryMax, setSalaryMax] = useState('32L');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [description, setDescription] = useState(
    "As a Full Stack Developer at Martin Connect, you will lead the development of our core recruitment engine. You'll work with React, Node.js, and PostgreSQL to build highly scalable systems that handle millions of candidate profiles."
  );

  // Step 2 Requirements list
  const [requirements, setRequirements] = useState<string[]>([
    'Proven experience as a Full Stack Developer in cloud production environments.',
    'Deep expertise with React, Node.js, and database structures (Postgres/Redis).',
    'Understanding of containerization orchestration (Docker, Kubernetes).'
  ]);
  const [newRequirement, setNewRequirement] = useState('');

  // Step 3 Preferences
  const [skills, setSkills] = useState<string[]>(['React.js', 'Node.js', 'PostgreSQL']);
  const [newSkill, setNewSkill] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('3-6 Years');

  const addRequirementItem = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirementItem = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const addSkillItem = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkillItem = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handlePublish = () => {
    // Call context to add the new job
    addJob({
      title,
      company: currentUser?.companyName || 'Martin Connect Premium', // dynamic company representation
      location,
      salary: `₹${salaryMin} - ${salaryMax} LPA`,
      skills,
      logo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=150&auto=format&fit=crop', // default logo placeholder
      description,
      requirements,
      experienceRequired,
      type: `${workMode} (${type})`
    });

    alert('Job Post published successfully and sent for platform moderation!');
    router.push('/dashboard/recruiter');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E8EEF7] h-16 flex items-center justify-between px-lg sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-md">
          <span className="font-headline-sm text-body-lg font-bold text-primary">Martin Connect</span>
          <div className="h-6 w-[1px] bg-[#c3c6d8]/50 mx-sm"></div>
          <nav className="flex items-center gap-md text-xs text-[#737687]">
            <span>Jobs</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Create New Post</span>
          </nav>
        </div>
      </header>

      {/* Main content body */}
      <main className="p-lg flex-1">
        {/* Progress Step Indicator */}
        <div className="max-w-[1100px] mx-auto mb-lg bg-white border border-[#E8EEF7] rounded-2xl p-md shadow-xs">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#eaedff] -z-10 -translate-y-1/2"></div>
            {[
              { num: 1, text: 'Job Details' },
              { num: 2, text: 'Requirements' },
              { num: 3, text: 'Preferences' },
              { num: 4, text: 'Review & Submit' }
            ].map((s) => {
              const active = step >= s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1 bg-white px-md relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                      active
                        ? 'bg-primary text-white border-primary shadow-xs ring-4 ring-primary/10'
                        : 'bg-white border-[#c3c6d8] text-[#737687]'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className={`text-[10px] font-bold ${active ? 'text-primary' : 'text-[#737687]'}`}>
                    {s.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form and Preview panel */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-12 gap-gutter items-start pb-xxl">
          {/* Left panel Form wizard */}
          <section className="col-span-12 lg:col-span-7 bg-white rounded-2xl shadow-sm p-lg border border-[#E8EEF7] space-y-md">
            {step === 1 && (
              <div className="space-y-md animate-fade-in">
                <h3 className="font-title-md text-body-md font-bold text-[#121b30] pb-sm border-b border-[#c3c6d8]/15">
                  Step 1: Job Description & Details
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                  />
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container cursor-pointer"
                    >
                      <option>Engineering & Tech</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Management</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container cursor-pointer"
                    >
                      <option>Product Engineering</option>
                      <option>Platform Tech</option>
                      <option>Growth Operations</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Work Mode</label>
                    <div className="flex bg-[#f2f3ff] p-0.5 rounded-xl border border-[#c3c6d8]/40">
                      {['On-site', 'Hybrid', 'Remote'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setWorkMode(m)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            workMode === m
                              ? 'bg-white shadow-sm text-primary'
                              : 'text-[#424655]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Employment Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container cursor-pointer"
                    >
                      <option>Full-time</option>
                      <option>Contract</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Open Positions</label>
                    <input
                      type="number"
                      value={openings}
                      onChange={(e) => setOpenings(Number(e.target.value))}
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Min Salary (Annual)</label>
                    <input
                      type="text"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="e.g. 15L"
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Max Salary (Annual)</label>
                    <input
                      type="text"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="e.g. 35L"
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container resize-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-md animate-fade-in">
                <h3 className="font-title-md text-body-md font-bold text-[#121b30] pb-sm border-b border-[#c3c6d8]/15">
                  Step 2: Key Responsibilities & Requirements
                </h3>

                <div className="space-y-sm">
                  <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Requirements Checklist</label>
                  <div className="space-y-xs">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-[#faf8ff] p-sm rounded-xl border border-[#c3c6d8]/20 text-xs">
                        <span className="text-[#424655]">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirementItem(idx)}
                          className="material-symbols-outlined text-error text-[18px] cursor-pointer hover:bg-error/5 p-1 rounded"
                        >
                          delete
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-sm pt-xs">
                    <input
                      type="text"
                      placeholder="Add another responsibility or requirement..."
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="flex-1 bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                    />
                    <button
                      type="button"
                      onClick={addRequirementItem}
                      className="bg-primary text-white px-md rounded-xl font-bold text-xs cursor-pointer hover:brightness-110"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-md animate-fade-in">
                <h3 className="font-title-md text-body-md font-bold text-[#121b30] pb-sm border-b border-[#c3c6d8]/15">
                  Step 3: Core Skill Preferences
                </h3>

                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Target Experience Bracket</label>
                    <select
                      value={experienceRequired}
                      onChange={(e) => setExperienceRequired(e.target.value)}
                      className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container cursor-pointer"
                    >
                      <option>0-1 Years</option>
                      <option>1-3 Years</option>
                      <option>3-6 Years</option>
                      <option>6+ Years</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-sm">
                  <label className="text-[10px] font-bold text-[#737687] uppercase tracking-wider block">Skills Tag Cloud</label>
                  <div className="flex flex-wrap gap-xs">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#eaedff]/60 border border-[#c3c6d8]/40 px-2 py-1 rounded-lg text-xs font-bold text-primary flex items-center gap-xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillItem(skill)}
                          className="material-symbols-outlined text-[14px] hover:text-error cursor-pointer"
                        >
                          close
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-sm pt-xs">
                    <input
                      type="text"
                      placeholder="Type a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                    />
                    <button
                      type="button"
                      onClick={addSkillItem}
                      className="bg-primary text-white px-md rounded-xl font-bold text-xs cursor-pointer hover:brightness-110"
                    >
                      Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-md animate-fade-in">
                <h3 className="font-title-md text-body-md font-bold text-[#121b30] pb-sm border-b border-[#c3c6d8]/15">
                  Step 4: Final Review & Publish
                </h3>

                <p className="text-xs text-[#737687] leading-relaxed">
                  Please review the details in the live preview sidebar. Once submitted, the job will be routed to the Martin Connect Platform Moderation Queue for verification before showing up publically.
                </p>

                <div className="bg-[#faf8ff] p-md rounded-xl border border-[#c3c6d8]/30 space-y-xs text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#737687]">Job Title</span>
                    <span className="font-bold text-[#121b30]">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737687]">Department</span>
                    <span className="font-bold text-[#121b30]">{department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737687]">Target Bracket</span>
                    <span className="font-bold text-[#121b30]">{experienceRequired}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737687]">Location / Mode</span>
                    <span className="font-bold text-[#121b30]">{location} ({workMode})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-md border-t border-[#E8EEF7] flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-lg py-sm border border-[#c3c6d8] text-[#424655] text-xs font-bold rounded-lg hover:bg-black/5 cursor-pointer"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-lg py-sm bg-primary text-white text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-xs"
                >
                  Next Step
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-xl py-sm bg-primary-container text-white text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Publish Job Posting
                </button>
              )}
            </div>
          </section>

          {/* Right panel: Live Preview sidebar */}
          <aside className="col-span-12 lg:col-span-5 sticky top-24 space-y-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[#737687] text-[10px] font-bold uppercase tracking-wider">Live Preview</span>
              <div className="flex items-center gap-xs text-[#16A34A] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span>Active synchronization</span>
              </div>
            </div>

            {/* Job Card preview frame */}
            <div className="bg-white rounded-2xl border border-[#c3c6d8]/40 p-lg shadow-sm border-l-4 border-l-primary space-y-md">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-bold text-white text-xs">
                  MC
                </div>
                <span className="px-sm py-0.5 bg-[#EBF4FF] text-[#1E63F3] text-[9px] font-bold rounded-full uppercase">
                  Drafting
                </span>
              </div>

              <div>
                <h3 className="font-title-lg text-[16px] font-bold text-[#121b30]">{title || 'Job Title'}</h3>
                <p className="text-[#424655] text-xs mt-0.5">
                  <span className="font-bold text-secondary">{currentUser?.companyName || 'Martin Connect Premium'}</span> • {location || 'Bengaluru'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-sm text-xs font-semibold">
                <div className="flex items-center gap-xs p-2 bg-[#faf8ff] rounded-xl border border-[#c3c6d8]/30">
                  <span className="material-symbols-outlined text-primary text-[16px]">schedule</span>
                  <span>{type}</span>
                </div>
                <div className="flex items-center gap-xs p-2 bg-[#faf8ff] rounded-xl border border-[#c3c6d8]/30">
                  <span className="material-symbols-outlined text-primary text-[16px]">apartment</span>
                  <span>{workMode}</span>
                </div>
                <div className="flex items-center gap-xs p-2 bg-[#faf8ff] rounded-xl border border-[#c3c6d8]/30 col-span-2">
                  <span className="material-symbols-outlined text-primary text-[16px]">payments</span>
                  <span>₹{salaryMin} - {salaryMax} LPA</span>
                </div>
              </div>

              <div className="pt-sm border-t border-[#c3c6d8]/15 space-y-xs text-xs">
                <div className="flex justify-between text-[#737687]">
                  <span>Experience Required</span>
                  <span className="font-bold text-[#121b30]">{experienceRequired}</span>
                </div>
                <div className="flex justify-between text-[#737687]">
                  <span>Target Openings</span>
                  <span className="font-bold text-[#121b30]">{openings} positions</span>
                </div>
              </div>

              <div className="p-sm bg-[#eaedff]/30 rounded-xl border border-[#c3c6d8]/20 text-[11px] text-[#424655] italic leading-relaxed line-clamp-3">
                {description || 'No description provided.'}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
