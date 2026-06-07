'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useMartinConnect, Candidate } from '@/context/MartinConnectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export default function ATSPipelinePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined animate-spin text-[36px] text-primary">progress_activity</span>
          <p className="font-title-sm text-outline font-bold mt-2">Loading Pipeline...</p>
        </div>
      </div>
    }>
      <ATSPipelineContent />
    </Suspense>
  );
}

function ATSPipelineContent() {
  const { candidates, moveCandidate, addCandidateNote } = useMartinConnect();
  const searchParams = useSearchParams();

  // Kanban Columns
  const columns: Candidate['stage'][] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired'];

  // Detail Drawer State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Selected candidate object
  const selectedCandidate = useMemo(() => {
    return candidates.find((c) => c.id === selectedCandidateId) || null;
  }, [candidates, selectedCandidateId]);

  // Filters/Searches
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [candidates, searchQuery]);

  // Group candidates by stage
  const columnsData = useMemo(() => {
    const groups: Record<Candidate['stage'], Candidate[]> = {
      Applied: [],
      Screening: [],
      Shortlisted: [],
      Interview: [],
      Offer: [],
      Hired: [],
    };
    filteredCandidates.forEach((c) => {
      if (groups[c.stage]) {
        groups[c.stage].push(c);
      } else {
        groups.Applied.push(c);
      }
    });
    return groups;
  }, [filteredCandidates]);

  // Handle Note Submission
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId || !newNoteContent.trim()) return;
    addCandidateNote(selectedCandidateId, newNoteContent.trim());
    setNewNoteContent('');
  };

  // Get color for columns
  const getColumnColor = (col: Candidate['stage']) => {
    if (col === 'Applied') return 'bg-slate-400';
    if (col === 'Screening') return 'bg-[#1E63F3]';
    if (col === 'Shortlisted') return 'bg-[#D97706]';
    if (col === 'Interview') return 'bg-purple-500';
    if (col === 'Offer') return 'bg-teal-500';
    return 'bg-[#16A34A]/100';
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E8EEF7] h-16 flex items-center justify-between px-lg sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-lg flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by candidate name, title, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f2f3ff] border border-[#c3c6d8]/55 rounded-xl focus:ring-1 focus:ring-primary text-xs outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button className="px-lg py-2 bg-primary-container text-white rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer">
            Export Pipeline
          </button>
        </div>
      </header>

      {/* Sub Filter bar */}
      <div className="px-lg py-md flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#faf8ff] border-b border-[#E8EEF7] gap-md">
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-[#121b30] flex items-center gap-xs">
            ATS Recruitment Pipeline
            <span className="text-[#737687] font-normal text-body-md">({filteredCandidates.length})</span>
          </h2>
        </div>
        <div className="flex items-center gap-xs">
          <span className="text-xs text-[#737687] font-semibold">Board View Mode:</span>
          <div className="bg-[#eaedff] p-1 rounded-lg flex border border-[#c3c6d8]/30">
            <button className="p-1.5 bg-white rounded shadow-xs text-primary cursor-pointer flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">view_column</span>
            </button>
            <button className="p-1.5 hover:bg-white/50 rounded text-[#737687] cursor-pointer flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto bg-[#F7F9FC] p-lg flex gap-md items-start custom-scrollbar">
        {columns.map((col) => {
          const list = columnsData[col] || [];
          return (
            <div key={col} className="min-w-[280px] max-w-[280px] flex flex-col max-h-[calc(100vh-220px)] bg-transparent">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-sm border-b border-[#c3c6d8]/30 mb-md">
                <div className="flex items-center gap-sm">
                  <div className={`w-1.5 h-5 rounded-full ${getColumnColor(col)}`}></div>
                  <span className="font-bold text-xs text-[#121b30] tracking-tight">{col}</span>
                  <span className="bg-[#eaedff] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#2950ce]">
                    {list.length}
                  </span>
                </div>
              </div>

              {/* Cards wrapper */}
              <div className="flex flex-col gap-md overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {list.length === 0 ? (
                  <div className="border border-dashed border-[#c3c6d8]/60 rounded-xl p-md text-center text-[11px] text-[#737687]">
                    No candidates in this stage
                  </div>
                ) : (
                  list.map((cand) => (
                    <motion.div
                      key={cand.id}
                      layoutId={cand.id}
                      onClick={() => setSelectedCandidateId(cand.id)}
                      className={`bg-white p-md rounded-2xl border border-[#E8EEF7] hover:shadow-md hover:border-l-4 hover:border-l-primary transition-all duration-200 cursor-pointer ${
                        selectedCandidateId === cand.id ? 'border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-xs">
                          {cand.matchScore >= 90 && (
                            <span className="bg-[#16A34A]/10 text-[#15803d] px-1.5 py-0.5 rounded text-[9px] font-bold">
                              {cand.matchScore}% Match
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#737687] font-mono">{cand.timeAgo}</span>
                      </div>

                      <div className="flex items-center gap-sm mb-md">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#121b30] truncate">{cand.name}</h4>
                          <p className="text-[11px] text-[#737687] truncate">{cand.title}</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-xs">
                        {cand.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="bg-[#faf8ff] border border-[#c3c6d8]/20 px-1.5 py-0.5 rounded text-[9px] text-[#424655]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-in Details Drawer */}
      <AnimatePresence>
        {selectedCandidateId && selectedCandidate && (
          <>
            {/* Drawer Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidateId(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-white z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-lg border-b border-[#E8EEF7] flex justify-between items-center bg-[#faf8ff]">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-[#121b30]">Applicant Details</h3>
                  <p className="text-xs text-[#737687] font-mono">ID: {selectedCandidate.id}</p>
                </div>
                <button
                  onClick={() => setSelectedCandidateId(null)}
                  className="p-2 hover:bg-[#eaedff] rounded-full transition-colors cursor-pointer text-[#424655]"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-lg space-y-lg custom-scrollbar">
                {/* Profile Brief */}
                <div className="flex items-center gap-md">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-primary">
                    <img src={selectedCandidate.avatar} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="font-title-lg text-title-lg font-bold text-[#121b30]">{selectedCandidate.name}</h2>
                    <p className="text-xs text-[#424655] font-semibold">{selectedCandidate.title}</p>
                    <p className="text-[11px] text-[#737687]">{selectedCandidate.email} • {selectedCandidate.phone}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-md pt-xs">
                  <div className="p-sm bg-[#faf8ff] border border-[#c3c6d8]/30 rounded-xl">
                    <p className="text-[9px] uppercase font-bold text-[#737687] mb-1">Experience</p>
                    <p className="font-bold text-xs text-[#121b30]">{selectedCandidate.experience}</p>
                  </div>
                  <div className="p-sm bg-[#faf8ff] border border-[#c3c6d8]/30 rounded-xl">
                    <p className="text-[9px] uppercase font-bold text-[#737687] mb-1">Notice Period</p>
                    <p className="font-bold text-xs text-[#121b30]">{selectedCandidate.noticePeriod}</p>
                  </div>
                  <div className="p-sm bg-[#faf8ff] border border-[#c3c6d8]/30 rounded-xl">
                    <p className="text-[9px] uppercase font-bold text-[#737687] mb-1">Education</p>
                    <p className="font-bold text-xs text-[#121b30] truncate">{selectedCandidate.education}</p>
                  </div>
                  <div className="p-sm bg-[#faf8ff] border border-[#c3c6d8]/30 rounded-xl">
                    <p className="text-[9px] uppercase font-bold text-[#737687] mb-1">Match Score</p>
                    <p className="font-bold text-xs text-emerald-600">{selectedCandidate.matchScore}% Rating</p>
                  </div>
                </div>

                {/* Candidate Skills List */}
                <div className="space-y-sm">
                  <h4 className="font-bold text-xs text-[#121b30]">Skills & Competencies</h4>
                  <div className="flex flex-wrap gap-xs">
                    {selectedCandidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-md py-sm bg-[#eaedff]/60 border border-[#c3c6d8]/40 rounded-lg text-xs font-semibold text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recruiter Notes Log */}
                <div className="space-y-sm">
                  <h4 className="font-bold text-xs text-[#121b30]">Recruiter Notes Log</h4>
                  
                  {/* Notes Feed list */}
                  <div className="space-y-sm max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedCandidate.notes.length === 0 ? (
                      <p className="text-xs text-[#737687] italic">No evaluation notes added yet.</p>
                    ) : (
                      selectedCandidate.notes.map((note, index) => (
                        <div key={index} className="p-md border border-[#c3c6d8]/20 bg-[#faf8ff] rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-[#737687]">
                            <span className="font-bold text-[#121b30]">{note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-[#424655] leading-relaxed">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add note input box */}
                  <form onSubmit={handleAddNote} className="flex gap-xs pt-xs">
                    <input
                      type="text"
                      placeholder="Add an assessment note..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="flex-1 bg-[#faf8ff] border border-[#c3c6d8] rounded-lg px-md py-sm text-xs focus:outline-none focus:border-primary-container"
                    />
                    <button
                      type="submit"
                      className="bg-primary-container text-white px-md rounded-lg font-bold text-xs cursor-pointer hover:brightness-110"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>

              {/* Drawer Pipeline Actions */}
              <div className="bg-[#faf8ff] border-t border-[#E8EEF7] p-md flex flex-wrap gap-xs items-center justify-between">
                <span className="text-[10px] font-bold text-[#737687] uppercase tracking-wider">Stage Action:</span>
                <div className="flex gap-xs w-full mt-1.5">
                  {selectedCandidate.stage !== 'Hired' && (
                    <button
                      onClick={() => {
                        const currentIndex = columns.indexOf(selectedCandidate.stage);
                        const nextStage = columns[currentIndex + 1];
                        if (nextStage) {
                          moveCandidate(selectedCandidate.id, nextStage);
                        }
                      }}
                      className="flex-1 py-sm bg-primary text-white rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer text-center"
                    >
                      Advance Pipeline
                    </button>
                  )}
                  {selectedCandidate.stage !== 'Applied' && (
                    <button
                      onClick={() => {
                        const currentIndex = columns.indexOf(selectedCandidate.stage);
                        const prevStage = columns[currentIndex - 1];
                        if (prevStage) {
                          moveCandidate(selectedCandidate.id, prevStage);
                        }
                      }}
                      className="flex-1 py-sm border border-[#c3c6d8] text-[#424655] rounded-lg font-bold text-xs hover:bg-[#eaedff]/30 transition-all cursor-pointer text-center"
                    >
                      Move Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reject this applicant?')) {
                        setSelectedCandidateId(null);
                        // mock rejection by archiving
                        alert('Candidate archived/rejected.');
                      }
                    }}
                    className="py-sm px-md border border-error text-error rounded-lg font-bold text-xs hover:bg-error/5 transition-all cursor-pointer text-center"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
