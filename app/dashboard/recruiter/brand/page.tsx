'use client';

import React, { useState } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import { motion } from 'framer-motion';

export default function EmployerBrandHubPage() {
  const { companies, currentUser } = useMartinConnect();

  // Recruiter manages the first company or creates their own
  const myCompany = companies[0] || {
    id: 'company-employer-brand',
    name: 'Martin Connect Premium',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPiXbXtpmidJSSPLov8QcWSLSy8MOCb1PWvBAmiwS4IBmd4UT_Khq-C_CHaJXESI_mxsMQRqO8hb6JI-MHYcWywjvXMx7AyeDQV6pLuVSSyRc4FSozY2eWku19EDw0j3SZNitqFuuMkrOPEUl7PFebdPN4oorYdIB3BoeuzehuUrIpy-uQQbe7KkM_woiOdGM7JnMu7uphX5kG_nXaILb-knV_4pQr4N9jCgA7G-1vP_7ybawWxml1koIro90pE7HgffE60P3wRWQ',
    description: 'The industrial standard in high-performance recruitment. Precise. Decisive. Professional.',
    industry: 'Recruitment Technology & Consulting',
    size: '50-200 Employees',
    location: 'Bangalore, IN',
    verified: true,
    rating: 4.8,
    founded: '2023',
    website: 'www.martinconnect.com',
    jobsCount: 12,
  };

  // Form states
  const [name, setName] = useState(myCompany.name);
  const [industry, setIndustry] = useState(myCompany.industry);
  const [size, setSize] = useState(myCompany.size);
  const [location, setLocation] = useState(myCompany.location);
  const [description, setDescription] = useState(myCompany.description);
  const [website, setWebsite] = useState(myCompany.website);
  const [value1, setValue1] = useState('Customer-First');
  const [value2, setValue2] = useState('Absolute Transparency');
  const [value3, setValue3] = useState('High Ownership');

  const [toastMessage, setToastMessage] = useState('');

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving changes
    setToastMessage('Employer Branding Profile updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E8EEF7] h-16 flex items-center justify-between px-lg sticky top-0 z-30 shadow-xs">
        <h2 className="font-headline-sm text-headline-sm font-bold text-[#121b30] flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary text-[24px]">hub</span>
          Employer Branding Hub
        </h2>
        <div className="text-right text-xs text-[#737687]">
          <span>Editing profile for </span>
          <span className="font-bold text-[#121b30]">{name}</span>
        </div>
      </header>

      {/* Main split dashboard panel */}
      <div className="p-lg grid grid-cols-12 gap-gutter">
        {/* Left column: Brand Settings Form */}
        <form onSubmit={handleSaveBrand} className="col-span-12 lg:col-span-6 bg-white p-lg rounded-2xl border border-[#c3c6d8]/30 shadow-xs space-y-md">
          <h3 className="font-title-md text-body-md font-bold text-[#121b30] pb-sm border-b border-[#c3c6d8]/15 flex items-center justify-between">
            Brand Profile Customizer
            {toastMessage && (
              <span className="text-xs bg-[#16A34A]/10 text-[#15803d] px-2 py-0.5 rounded font-bold">
                {toastMessage}
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-[#737687] tracking-wider block">Company Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-[#737687] tracking-wider block">Industry Vertical</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-[#737687] tracking-wider block">Company Headcount</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-[#737687] tracking-wider block">Headquarters</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-bold text-[#737687] tracking-wider block">Company Website URL</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-bold text-[#737687] tracking-wider block">Spotlight Tagline & Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1 pt-xs">
            <label className="text-[11px] uppercase font-bold text-[#737687] tracking-wider block">Company Values / Principles</label>
            <div className="space-y-xs">
              <input
                type="text"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Value 1"
                className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
              />
              <input
                type="text"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Value 2"
                className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
              />
              <input
                type="text"
                value={value3}
                onChange={(e) => setValue3(e.target.value)}
                placeholder="Value 3"
                className="w-full bg-[#faf8ff] border border-[#c3c6d8] rounded-xl px-md py-sm text-xs focus:outline-none focus:border-primary-container"
              />
            </div>
          </div>

          <div className="pt-md border-t border-[#c3c6d8]/15 flex justify-end gap-sm">
            <button
              type="button"
              onClick={() => {
                setName(myCompany.name);
                setIndustry(myCompany.industry);
                setSize(myCompany.size);
                setLocation(myCompany.location);
                setDescription(myCompany.description);
                setWebsite(myCompany.website);
              }}
              className="px-lg py-sm border border-[#c3c6d8] text-[#424655] text-xs rounded-lg hover:bg-black/5 cursor-pointer font-bold"
            >
              Reset Inputs
            </button>
            <button
              type="submit"
              className="px-lg py-sm bg-primary-container text-white text-xs rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer font-bold"
            >
              Publish Changes
            </button>
          </div>
        </form>

        {/* Right column: Live Spotlight Preview */}
        <div className="col-span-12 lg:col-span-6 space-y-md">
          <div className="bg-[#081126] text-white rounded-2xl shadow-md border border-[#c3c6d8]/15 overflow-hidden flex flex-col justify-between min-h-[480px]">
            {/* Banner preview */}
            <div className="relative h-44 bg-slate-800 flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtcC8-wYUJ0gV7Xu1ME86xZxT4ZPtJZ8Go8UvG1Hpwa_tyjcvJsrwqxPXj8JETotnIT_SoxYzVAKodSVwq-cVzrjamCLMfeTzoNndj0WUjbKXtLijHhEO0PGnWtAEDM3mfFg8ENGUMpS-LFJqUgMRB0BtBEJBA0l2GpTPeRKdlEW4ybwRl9QcG_OmzCG2uWsq0pNPIUgugYbMkyjZUzB6mvIQFM_r6Yx7JS1_g5I1bPYjzfViT3hXIOAF98nSxrrfmyH2sP1EsdNE"
                alt="Banner mockup"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081126] to-transparent"></div>
              
              {/* Floating logo */}
              <div className="absolute -bottom-6 left-md w-16 h-16 rounded-xl bg-white border border-[#c3c6d8]/30 flex items-center justify-center p-xs overflow-hidden shadow-md">
                <img src={myCompany.logo} alt="Company Logo preview" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Profile body preview */}
            <div className="p-lg pt-10 space-y-md flex-1 flex flex-col justify-between">
              <div className="space-y-xs">
                <span className="font-mono text-[#1e63f3] text-[9px] font-bold uppercase tracking-widest bg-[#1e63f3]/15 px-2 py-0.5 rounded-full">
                  LIVE TALENT PREVIEW
                </span>
                <div className="flex items-center gap-xs">
                  <h1 className="font-headline-sm text-headline-sm font-bold text-white tracking-tight">{name}</h1>
                  <span className="bg-[#16A34A]/100/20 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[10px] fill-current">verified</span>
                    Verified
                  </span>
                </div>
                <p className="text-[12px] text-[#c3c6d8] flex items-center gap-sm">
                  <span className="font-semibold text-primary">{industry}</span>
                  <span className="w-1 h-1 bg-[#c3c6d8]/50 rounded-full"></span>
                  <span>{location}</span>
                  <span className="w-1 h-1 bg-[#c3c6d8]/50 rounded-full"></span>
                  <span>{size}</span>
                </p>
              </div>

              <div className="text-[13px] text-[#c3c6d8]/90 leading-relaxed max-w-xl">
                {description || 'Provide a brief summary of what your company does, your culture, and who you are recruiting.'}
              </div>

              {/* Values previews */}
              <div className="grid grid-cols-3 gap-sm pt-md border-t border-white/10">
                <div className="text-center p-sm bg-white/5 rounded-xl border border-white/5">
                  <span className="material-symbols-outlined text-[#1e63f3] text-[20px] mb-1">bolt</span>
                  <p className="text-[10px] font-bold text-white truncate">{value1 || 'Customer First'}</p>
                </div>
                <div className="text-center p-sm bg-white/5 rounded-xl border border-white/5">
                  <span className="material-symbols-outlined text-[#1e63f3] text-[20px] mb-1">visibility</span>
                  <p className="text-[10px] font-bold text-white truncate">{value2 || 'Transparency'}</p>
                </div>
                <div className="text-center p-sm bg-white/5 rounded-xl border border-white/5">
                  <span className="material-symbols-outlined text-[#1e63f3] text-[20px] mb-1">rocket_launch</span>
                  <p className="text-[10px] font-bold text-white truncate">{value3 || 'Ownership'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
