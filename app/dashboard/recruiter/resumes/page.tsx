'use client';

import React, { useState, useMemo } from 'react';
import { useMartinConnect, Candidate } from '@/context/MartinConnectContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeDatabasePage() {
  const { candidates, currentUser, unlockedCandidates, unlockCandidate } = useMartinConnect();

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('Senior React Developer');
  const [locationQuery, setLocationQuery] = useState('Mumbai, IN');
  const [experienceRange, setExperienceRange] = useState<number>(10);
  const [noticeImmediate, setNoticeImmediate] = useState(true);

  const credits = currentUser?.credits ?? 0;

  const handleUnlockCandidate = async (candId: string) => {
    if (unlockedCandidates.includes(candId)) return;
    await unlockCandidate(candId);
  };

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      const titleMatches =
        !searchQuery ||
        cand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const locMatches =
        !locationQuery ||
        cand.location.toLowerCase().includes(locationQuery.toLowerCase());

      // parse experience number
      const expYears = parseFloat(cand.experience) || 0;
      const expMatches = expYears <= experienceRange;

      const noticeMatches =
        !noticeImmediate ||
        cand.noticePeriod.toLowerCase().includes('immediate') ||
        cand.noticePeriod.toLowerCase().includes('15');

      return titleMatches && locMatches && expMatches && noticeMatches;
    });
  }, [candidates, searchQuery, locationQuery, experienceRange, noticeImmediate]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E8EEF7] h-16 flex items-center justify-between px-lg sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-md flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[#737687] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Global search for candidates, skills, or resumes..."
              className="w-full pl-xl pr-md py-xs bg-[#f2f3ff] border border-[#c3c6d8]/60 rounded-full text-xs focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </header>

      {/* Main Inner Layout Split */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* Left Filters Rail */}
        <aside className="w-full lg:w-[280px] bg-[#faf8ff] p-md border-r border-[#E8EEF7] flex flex-col gap-lg overflow-y-auto">
          {/* Saved Searches */}
          <div className="space-y-sm">
            <h3 className="font-bold text-xs text-[#121b30] flex justify-between items-center pb-xs border-b border-[#c3c6d8]/30">
              Saved Searches
              <span className="material-symbols-outlined text-primary text-[18px]">bookmark</span>
            </h3>
            <div className="space-y-xs">
              {[
                { title: 'Full Stack + Mumbai', date: '2d ago' },
                { title: 'React Native + Remote', date: '5d ago' },
                { title: 'DevOps + AWS + 8y Exp', date: '1w ago' }
              ].map((saved, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSearchQuery(saved.title.split(' + ')[0]);
                    setLocationQuery(saved.title.split(' + ')[1] || '');
                  }}
                  className="p-xs bg-white border border-[#c3c6d8]/40 rounded-xl cursor-pointer hover:border-primary transition-all text-xs"
                >
                  <p className="font-bold text-[#121b30] hover:text-primary">{saved.title}</p>
                  <p className="text-[10px] text-[#737687]">{saved.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Credits card */}
          <div className="bg-[#081126] p-md rounded-2xl text-white space-y-sm shadow-sm">
            <p className="font-mono text-[9px] text-[#c3c6d8] uppercase tracking-wider font-bold">Usage Credits</p>
            <div className="space-y-xs">
              <div className="flex justify-between text-xs">
                <span className="text-[#c3c6d8]">Monthly Quota</span>
                <span className="font-mono font-bold">100/mo</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(credits / 100) * 100}%` }}
                ></div>
              </div>
            </div>
            <h3 className="font-display-md text-xl font-bold leading-none text-white">
              {credits} <span className="text-[10px] font-normal text-[#c3c6d8]">CV unlocks remaining</span>
            </h3>
          </div>

          {/* Exp range */}
          <div className="space-y-sm">
            <div className="flex justify-between items-center text-xs">
              <h3 className="font-bold text-[#121b30]">Max Experience</h3>
              <span className="font-mono font-bold text-primary">{experienceRange} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={experienceRange}
              onChange={(e) => setExperienceRange(Number(e.target.value))}
              className="w-full h-1 bg-[#eaedff] rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-[#737687]">
              <span>1 Year</span>
              <span>15 Years+</span>
            </div>
          </div>

          {/* Notice Period checkbox */}
          <div className="space-y-xs">
            <h3 className="font-bold text-xs text-[#121b30]">Notice Period</h3>
            <div className="flex flex-col gap-xs text-xs">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input
                  type="checkbox"
                  checked={noticeImmediate}
                  onChange={(e) => setNoticeImmediate(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c3c6d8] text-primary focus:ring-primary"
                />
                <span className="group-hover:text-primary transition-colors">Immediate Joiner / 15 Days</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Sourcing Feed */}
        <div className="flex-1 p-lg overflow-y-auto space-y-md bg-[#F7F9FC]">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-[#121b30]">Talent Database Search</h2>
            <p className="text-xs text-[#737687] mt-0.5">
              Access high-performance developer profiles verified through preliminary technical assessments.
            </p>
          </div>

          {/* Search Inputs Row */}
          <div className="bg-white p-md rounded-2xl shadow-xs border border-[#E8EEF7] flex flex-col sm:flex-row gap-md items-stretch">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                person_search
              </span>
              <input
                type="text"
                placeholder="Skills, e.g. React, Node, DevOps"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8ff] border border-[#c3c6d8] rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737687] text-[18px]">
                location_on
              </span>
              <input
                type="text"
                placeholder="Location Query"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8ff] border border-[#c3c6d8] rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={() => alert(`Sourced ${filteredCandidates.length} candidate resumes`)}
              className="bg-primary-container text-white px-xl py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Succeed Search
            </button>
          </div>

          {/* Results Summary banner */}
          <div className="flex justify-between items-center px-1 text-[11px] text-[#737687] font-semibold uppercase tracking-wider">
            <span>Displaying {filteredCandidates.length} Candidates matched</span>
            <span>Sort by: Relevance</span>
          </div>

          {/* Candidate Profile Cards */}
          <div className="space-y-md">
            <AnimatePresence>
              {filteredCandidates.map((cand) => {
                const isUnlocked = unlockedCandidates.includes(cand.id);

                return (
                  <motion.div
                    key={cand.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-lg rounded-2xl border border-[#E8EEF7] shadow-xs flex flex-col sm:flex-row gap-lg hover:border-l-4 hover:border-l-primary-container transition-all relative overflow-hidden"
                  >
                    {/* Locked watermark overlay */}
                    {!isUnlocked && (
                      <span className="absolute top-3 right-3 bg-amber-50 text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[10px] fill-current">lock</span>
                        Locked Profile
                      </span>
                    )}

                    {/* Avatar/Initials */}
                    <div className="shrink-0 flex items-center">
                      {isUnlocked ? (
                        <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-slate-200 border-2 border-primary">
                          <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-[72px] h-[72px] rounded-full bg-[#f2f3ff] border border-[#c3c6d8] flex items-center justify-center text-[#2950ce] font-bold text-lg select-none">
                          {cand.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                    </div>

                    {/* Profile Information Block */}
                    <div className="flex-grow space-y-md min-w-0">
                      <div>
                        <h4 className={`font-bold text-[#121b30] text-sm ${!isUnlocked ? 'filter blur-xs select-none' : ''}`}>
                          {isUnlocked ? cand.name : 'Candidate Name'}
                        </h4>
                        <p className="text-xs font-semibold text-primary">{cand.title}</p>
                        <p className={`text-[10px] text-[#737687] mt-0.5 ${!isUnlocked ? 'filter blur-xs select-none' : ''}`}>
                          {isUnlocked ? `${cand.email} • ${cand.phone}` : 'unlocked_contact_info@example.com • +91 99999 XXXXX'}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-md text-xs text-[#737687] opacity-80">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                          {cand.location}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-primary">history</span>
                          {cand.experience} Exp
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
                          {isUnlocked ? '₹32.5 LPA' : '₹XX.X LPA'}
                        </span>
                      </div>

                      {/* Skills Cloud */}
                      <div className="flex flex-wrap gap-xs">
                        {cand.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-[#faf8ff] border border-[#c3c6d8]/20 px-2 py-0.5 rounded text-[10px] font-semibold text-[#424655]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-md pt-sm border-t border-[#c3c6d8]/10">
                        {isUnlocked ? (
                          <>
                            <button
                              onClick={() => alert(`Viewing full CV profile for ${cand.name}`)}
                              className="px-lg py-1.5 bg-primary-container text-white rounded-lg font-bold text-xs cursor-pointer hover:brightness-110 transition-all"
                            >
                              Open Full CV
                            </button>
                            <a
                              href={`mailto:${cand.email}`}
                              className="px-lg py-1.5 border border-primary text-primary rounded-lg font-bold text-xs cursor-pointer hover:bg-primary/5 transition-all text-center"
                            >
                              Message Candidate
                            </a>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUnlockCandidate(cand.id)}
                            className="px-xl py-2 bg-[#081126] text-white rounded-lg font-bold text-xs flex items-center gap-xs shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">key</span>
                            Unlock Contact (1 Credit)
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
