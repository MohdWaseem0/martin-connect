'use client';

import React, { useState, useMemo } from 'react';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CompaniesPage() {
  const { companies, jobs } = useMartinConnect();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedSize, setSelectedSize] = useState('Any Size');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [sortBy, setSortBy] = useState('Recommended');

  // Compute live open jobs count per company
  const companyJobsCount = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      counts[job.companyId] = (counts[job.companyId] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  // Industry tags mapped to the category chips
  const industries = ['All', 'IT & Software', 'BFSI', 'E-Commerce', 'Healthcare', 'Consulting', 'Startup'];

  // Filtered and Sorted Companies
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        // Keyword Search
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          company.name.toLowerCase().includes(query) ||
          company.description.toLowerCase().includes(query) ||
          company.industry.toLowerCase().includes(query);

        // Industry Filter
        const matchesIndustry =
          selectedIndustry === 'All' ||
          company.industry.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
          (selectedIndustry === 'IT & Software' && company.industry.toLowerCase().includes('it services'));

        // Location Filter
        const matchesLocation =
          selectedLocation === 'All Locations' ||
          company.location.toLowerCase().includes(selectedLocation.toLowerCase());

        // Size Filter
        const matchesSize =
          selectedSize === 'Any Size' ||
          (selectedSize === '1-50' && company.size.includes('50') && !company.size.includes('500')) ||
          (selectedSize === '51-200' && company.size.includes('200')) ||
          (selectedSize === '201-1000' && company.size.includes('1000') && !company.size.includes('150')) ||
          (selectedSize === '1000+' && (company.size.includes('100,000') || company.size.includes('30,000') || company.size.includes('500,000') || company.size.includes('150,000') || company.size.includes('500K+')));

        // Rating Filter
        let matchesRating = true;
        if (selectedRating !== 'All Ratings') {
          const ratingValue = parseFloat(selectedRating);
          matchesRating = company.rating >= ratingValue;
        }

        return matchesQuery && matchesIndustry && matchesLocation && matchesSize && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'Top Rated') {
          return b.rating - a.rating;
        }
        if (sortBy === 'Most Openings') {
          const openA = companyJobsCount[a.id] || 0;
          const openB = companyJobsCount[b.id] || 0;
          return openB - openA;
        }
        if (sortBy === 'Newest') {
          return parseInt(b.founded) - parseInt(a.founded);
        }
        // Default: Recommended
        return 0;
      });
  }, [companies, searchQuery, selectedIndustry, selectedLocation, selectedSize, selectedRating, sortBy, companyJobsCount]);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#121b30] flex flex-col font-body-md antialiased">
      <Navbar />

      <main className="max-w-[1440px] w-full mx-auto px-lg py-xl flex-1">
        {/* Header Section */}
        <section className="mb-xl">
          <h1 className="font-headline-lg text-headline-lg font-bold text-[#121b30] mb-xs">
            Explore Companies Hiring Now
          </h1>
          <p className="font-body-lg text-body-lg text-[#424655]">
            Discover the industry standard-bearers, start-ups, and corporate weights shaping the future.
          </p>
        </section>

        {/* Search Input Bar */}
        <section className="mb-lg relative max-w-xl">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search company names, keywords, or industries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#c3c6d8]/60 rounded-2xl py-md pl-xxl pr-md text-[#121b30] text-[15px] focus:outline-none focus:border-primary-container shadow-sm"
          />
        </section>

        {/* Industry Category Chips */}
        <section className="flex flex-wrap gap-xs mb-md">
          {industries.map((ind) => {
            const active = selectedIndustry === ind;
            return (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-lg py-sm rounded-full font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                  active
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-[#eaedff]/60 hover:bg-[#eaedff] text-[#424655]'
                }`}
              >
                {ind}
              </button>
            );
          })}
        </section>

        {/* Filter Dropdowns Row */}
        <section className="flex flex-wrap items-center gap-md pb-xl border-b border-[#c3c6d8]/30 mb-xl">
          <div className="flex flex-col gap-xs min-w-[140px]">
            <span className="font-body-sm font-bold text-[#424655] text-[11px] uppercase tracking-wider">Location</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white border border-[#c3c6d8] rounded-xl px-md py-xs text-xs font-semibold focus:outline-none focus:border-primary-container cursor-pointer"
            >
              <option value="All Locations">All Locations</option>
              <option value="Bangalore">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <div className="flex flex-col gap-xs min-w-[140px]">
            <span className="font-body-sm font-bold text-[#424655] text-[11px] uppercase tracking-wider">Company Size</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-white border border-[#c3c6d8] rounded-xl px-md py-xs text-xs font-semibold focus:outline-none focus:border-primary-container cursor-pointer"
            >
              <option value="Any Size">Any Size</option>
              <option value="1-50">1-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-1000">201-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div className="flex flex-col gap-xs min-w-[140px]">
            <span className="font-body-sm font-bold text-[#424655] text-[11px] uppercase tracking-wider">Min Rating</span>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="bg-white border border-[#c3c6d8] rounded-xl px-md py-xs text-xs font-semibold focus:outline-none focus:border-primary-container cursor-pointer"
            >
              <option value="All Ratings">All Ratings</option>
              <option value="4.5">4.5+ ★</option>
              <option value="4.0">4.0+ ★</option>
              <option value="3.5">3.5+ ★</option>
            </select>
          </div>

          <div className="sm:ml-auto flex flex-col gap-xs min-w-[140px]">
            <span className="font-body-sm font-bold text-[#424655] text-[11px] uppercase tracking-wider">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#c3c6d8] rounded-xl px-md py-xs text-xs font-semibold focus:outline-none focus:border-primary-container cursor-pointer"
            >
              <option value="Recommended">Recommended</option>
              <option value="Most Openings">Most Openings</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Newest">Newest</option>
            </select>
          </div>
        </section>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          <AnimatePresence>
            {filteredCompanies.map((company) => {
              const count = companyJobsCount[company.id] || 0;
              return (
                <motion.article
                  key={company.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-lg border border-[#c3c6d8]/30 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col group border-l-4 border-l-transparent hover:border-l-primary-container"
                >
                  <div className="flex justify-between items-start mb-md">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-14 h-14 rounded-lg object-contain bg-[#faf8ff] p-2 border border-[#c3c6d8]/20"
                    />
                    <div className="flex flex-col items-end gap-xs">
                      <span className="bg-[#eaedff] text-[#2950ce] px-sm py-0.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-tight">
                        {company.industry.split(' & ')[0]}
                      </span>
                      {company.verified && (
                        <span className="bg-[#16A34A]/10 text-[#15803d] border border-[#16A34A]/30/50 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[10px] fill-current">verified</span>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-title-sm text-title-sm font-bold text-[#121b30] mb-xs group-hover:text-primary transition-colors">
                    {company.name}
                  </h3>

                  <div className="flex items-center gap-sm mb-md text-xs text-[#737687]">
                    <span className="font-semibold">{company.size}</span>
                    <span className="w-1.5 h-1.5 bg-[#c3c6d8] rounded-full"></span>
                    <div className="flex items-center text-amber-500 font-bold gap-xs">
                      {company.rating > 0 ? (
                        <>
                          {company.rating}
                          <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                        </>
                      ) : (
                        'New'
                      )}
                    </div>
                  </div>

                  <p className="font-body-sm text-[#424655] line-clamp-2 mb-lg text-[13px] leading-relaxed">
                    {company.description}
                  </p>

                  <div className="mt-auto flex items-center gap-md pt-md border-t border-[#c3c6d8]/10">
                    <span className="flex-1 text-[#2950ce] bg-[#eaedff]/60 px-sm py-2 rounded-lg font-bold text-xs text-center">
                      {count} open roles
                    </span>
                    <Link
                      href={`/companies/${company.id}`}
                      className="flex-1 border border-primary text-primary px-lg py-2 rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-all text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
