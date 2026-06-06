'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMartinConnect } from '@/context/MartinConnectContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { jobs, applyJob } = useMartinConnect();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  // Handle hero search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`);
  };

  // Get active hiring jobs to display (first 3 items)
  const featuredJobs = jobs.slice(0, 6);

  const categories = [
    { label: 'IT', count: '450+ Active Jobs', icon: 'terminal' },
    { label: 'Finance', count: '210+ Active Jobs', icon: 'account_balance' },
    { label: 'Healthcare', count: '180+ Active Jobs', icon: 'medical_services' },
    { label: 'Sales', count: '320+ Active Jobs', icon: 'trending_up' },
    { label: 'Data', count: '120+ Active Jobs', icon: 'data_usage' },
    { label: 'HR', count: '85+ Active Jobs', icon: 'badge' },
    { label: 'Engineering', count: '290+ Active Jobs', icon: 'construction' },
    { label: 'Operations', count: '150+ Active Jobs', icon: 'precision_manufacturing' },
  ];

  const partners = [
    { name: 'TCS', id: 'company-tcs' },
    { name: 'Infosys', id: 'company-infosys' },
    { name: 'Wipro', id: 'company-wipro' },
    { name: 'Flipkart', id: 'company-flipkart' },
    { name: 'Swiggy', id: 'company-swiggy' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="hero-gradient min-h-[520px] flex flex-col justify-center items-center text-center px-lg py-xxl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl z-10"
        >
          <h1 className="font-headline-lg text-headline-lg text-white mb-md leading-tight">
            Find Your Next Great Hire.
          </h1>
          <p className="font-body-lg text-body-lg text-outline-variant mb-xl opacity-90">
            Connect with 2.4 million+ verified professionals across India using our enterprise-grade AI matching.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-full p-sm flex flex-col md:flex-row items-center gap-sm shadow-2xl w-full max-w-3xl mx-auto border border-outline-variant/30"
          >
            <div className="flex-1 flex items-center px-md gap-sm w-full">
              <span className="material-symbols-outlined text-outline">search</span>
              <input
                className="w-full bg-transparent border-none focus:outline-none text-on-surface placeholder:text-outline py-md text-[14px]"
                placeholder="Job title, skills, or company"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-outline-variant/60"></div>
            <div className="flex-1 flex items-center px-md gap-sm w-full">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <input
                className="w-full bg-transparent border-none focus:outline-none text-on-surface placeholder:text-outline py-md text-[14px]"
                placeholder="Location or Remote"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-primary-container text-white px-xl py-md rounded-full font-bold hover:shadow-lg hover:brightness-110 transition-all w-full md:w-auto active:scale-95 cursor-pointer text-[14px]"
            >
              Search Jobs
            </button>
          </form>
        </motion.div>
      </header>

      {/* Categories Grid */}
      <section className="max-w-container-max mx-auto px-lg py-xxl w-full">
        <div className="flex justify-between items-end mb-xl">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Explore Categories</h2>
            <p className="font-body-md text-on-surface-variant">Find opportunities across specialized industrial sectors</p>
          </div>
          <Link
            href="/jobs"
            className="text-primary font-bold hover:underline flex items-center gap-xs text-[15px]"
          >
            View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/jobs?category=${encodeURIComponent(cat.label)}`)}
              className="bg-white p-lg rounded-xl border border-outline-variant/50 soft-sharp-shadow card-accent-hover transition-all cursor-pointer group hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-container group-hover:text-white transition-colors text-primary">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <h3 className="font-title-sm text-title-sm mb-xs group-hover:text-primary transition-colors">{cat.label}</h3>
              <p className="font-body-sm text-on-surface-variant">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-surface-container-low py-xxl w-full">
        <div className="max-w-container-max mx-auto px-lg">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Featured Opportunities</h2>
              <p className="font-body-md text-on-surface-variant">Handpicked high-impact roles for you</p>
            </div>
            <button
              onClick={() => router.push('/jobs')}
              className="bg-secondary-fixed text-on-secondary-fixed px-lg py-sm rounded-lg font-bold hover:brightness-95 transition-all text-[13px] cursor-pointer"
            >
              Latest Jobs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {featuredJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-lg rounded-xl border border-outline-variant/50 soft-sharp-shadow card-accent-hover transition-all group hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-md">
                    <img
                      alt={`${job.company} logo`}
                      className="w-12 h-12 rounded-lg object-contain bg-surface-container p-2 border border-outline-variant/20"
                      src={job.logo}
                    />
                    {job.status && (
                      <span
                        className={`font-mono-label text-body-sm px-sm py-1 rounded text-[11px] ${
                          job.status === 'Applied'
                            ? 'bg-[#EBF4FF] text-[#1E63F3]'
                            : job.status === 'Under Review'
                            ? 'bg-[#FEF9EC] text-[#D97706]'
                            : 'bg-[#DCFCE7] text-[#16A34A]'
                        }`}
                      >
                        {job.status}
                      </span>
                    )}
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <h3 className="font-title-sm text-title-sm mb-xs group-hover:text-primary transition-colors cursor-pointer">
                      {job.title}
                    </h3>
                  </Link>
                  <p className="font-body-md text-on-surface-variant mb-md">
                    {job.company} • {job.location}
                  </p>
                  <div className="flex flex-wrap gap-xs mb-lg">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-surface-container px-sm py-xs rounded text-on-surface-variant font-body-sm text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-md border-t border-outline-variant/30 mt-auto">
                  <span className="font-title-sm text-primary">{job.salary}</span>
                  {job.status === 'Applied' ? (
                    <span className="text-outline text-[13px] font-semibold flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px] text-success-green">check_circle</span>
                      Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => applyJob(job.id)}
                      className="text-primary font-bold hover:underline cursor-pointer text-[14px]"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Employers Grid */}
      <section className="max-w-container-max mx-auto px-lg py-xxl w-full">
        <div className="text-center mb-xl">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Top Employers Hiring Now</h2>
          <p className="font-body-md text-on-surface-variant">Join India's most respected organizations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-xl items-center justify-items-center opacity-65">
          {partners.map((partner) => (
            <div
              key={partner.name}
              onClick={() => router.push(`/companies/${partner.id}`)}
              className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer border border-outline-variant/30 rounded-lg bg-white shadow-sm hover:border-primary-container"
            >
              <span className="font-bold text-title-md text-on-surface">{partner.name}</span>
            </div>
          ))}
          <div className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 border border-outline-variant/30 rounded-lg bg-white shadow-sm">
            <span className="font-bold text-title-md text-on-surface">Amazon</span>
          </div>
          <div className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 border border-outline-variant/30 rounded-lg bg-white shadow-sm">
            <span className="font-bold text-title-md text-on-surface">Google</span>
          </div>
          <div className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 border border-outline-variant/30 rounded-lg bg-white shadow-sm">
            <span className="font-bold text-title-md text-on-surface">Microsoft</span>
          </div>
          <div className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 border border-outline-variant/30 rounded-lg bg-white shadow-sm">
            <span className="font-bold text-title-md text-on-surface">HCL Tech</span>
          </div>
          <div className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 border border-outline-variant/30 rounded-lg bg-white shadow-sm">
            <span className="font-bold text-title-md text-on-surface">Cognizant</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
