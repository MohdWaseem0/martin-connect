'use client';

import React, { useState, useEffect } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { motion } from 'framer-motion';

export default function SeekerProfile() {
  const { currentUser, updateProfile } = useMartinConnect();
  
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  const [parsing, setParsing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setTitle(currentUser.title || '');
      setLocation(currentUser.location || '');
      setPhone(currentUser.phone || '');
      setEducation(currentUser.education || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    updateProfile({ name, title, location, phone, education });
    setTimeout(() => {
      setSaved(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !currentUser.skills.includes(newSkill.trim())) {
      updateProfile({ skills: [...currentUser.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateProfile({ skills: currentUser.skills.filter((s) => s !== skillToRemove) });
  };

  // Simulate AI parsing of PDF resume
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setParsing(true);
      setTimeout(() => {
        setParsing(false);
        updateProfile({
          resumeUploaded: true,
          resumeName: file.name,
          skills: Array.from(new Set([...currentUser.skills, 'Kubernetes', 'Docker', 'GraphQL', 'TypeScript'])),
        });
        alert('Resume parsed! Extracted skills and updated profile database.');
      }, 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-[72px] bg-white flex justify-between items-center px-lg border-b border-outline-variant/60 sticky top-0 z-40">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">My Profile</h2>
      </header>

      <div className="p-lg max-w-4xl mx-auto space-y-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-start">
          
          {/* Resume Upload Box (Left Column) */}
          <div className="bg-white p-lg rounded-xl border border-outline-variant/60 soft-sharp-shadow text-center space-y-md">
            <h3 className="font-title-sm font-bold text-on-surface border-b pb-xs mb-sm">Resume Parser</h3>
            
            {parsing ? (
              <div className="py-xl flex flex-col items-center justify-center space-y-sm">
                <span className="material-symbols-outlined animate-spin text-[36px] text-primary">progress_activity</span>
                <p className="font-title-sm text-primary font-bold">AI Analyzing Profile...</p>
                <p className="text-body-sm text-outline">Extracting experience, skills, and titles.</p>
              </div>
            ) : currentUser.resumeUploaded ? (
              <div className="p-md bg-green-50/50 border border-green-200 rounded-lg flex flex-col items-center">
                <span className="material-symbols-outlined text-success-green text-[36px] mb-xs">verified</span>
                <p className="font-title-sm font-bold text-success-green">Resume Uploaded</p>
                <p className="text-body-sm text-outline-variant/80 font-mono-label mt-sm truncate max-w-xs">{currentUser.resumeName}</p>
                
                <input type="file" id="resume-reupload" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                <button
                  onClick={() => document.getElementById('resume-reupload')?.click()}
                  className="mt-md text-[12px] text-primary font-bold hover:underline cursor-pointer bg-transparent border-none"
                >
                  Upload New Resume
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-lg bg-surface-container-low flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-outline text-[36px] mb-xs">upload_file</span>
                <p className="text-body-sm text-outline font-semibold mb-sm">Upload PDF resume to parse profile details instantly.</p>
                
                <input type="file" id="resume-upload" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                <button
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  className="px-lg py-sm bg-primary text-white font-bold rounded hover:brightness-110 active:scale-95 transition-all text-body-sm cursor-pointer"
                >
                  Upload File
                </button>
              </div>
            )}
          </div>

          {/* Profile Editor Form (Right Column) */}
          <div className="md:col-span-2 bg-white p-lg rounded-xl border border-outline-variant/60 shadow-lg">
            <h3 className="font-title-lg text-title-lg font-bold border-b border-outline-variant/20 pb-sm mb-lg">Profile Details</h3>
            
            <form onSubmit={handleSave} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Professional Title</label>
                  <input
                    required
                    type="text"
                    className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Location</label>
                  <input
                    required
                    type="text"
                    className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 99999 88888"
                    className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Education Details</label>
                <input
                  type="text"
                  placeholder="Degree, University"
                  className="w-full p-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={saved}
                className="bg-primary-container text-white px-xl py-md rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer text-[14px]"
              >
                {saved ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </form>

            {/* Skills Tags Manager */}
            <div className="mt-xl pt-xl border-t border-outline-variant/30">
              <h4 className="font-title-sm font-bold mb-sm">My Core Skills</h4>
              <div className="flex flex-wrap gap-xs mb-md">
                {currentUser.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-surface-container px-md py-xs rounded-full text-on-surface-variant font-body-sm font-semibold flex items-center gap-xs text-[12px]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-outline hover:text-error cursor-pointer border-none bg-transparent"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-sm max-w-sm">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Next.js)"
                  className="flex-1 p-sm border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-lg bg-secondary text-white font-bold rounded-lg hover:brightness-110 cursor-pointer text-body-sm active:scale-95 transition-transform"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
