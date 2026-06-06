'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const categories = ['All', 'Interview Prep', 'Resume Tips', 'Industry Insights', 'Salary Guides'];

  const articles = [
    {
      id: 1,
      title: 'How to pass a senior frontend developer interview',
      category: 'Interview Prep',
      readTime: '6 min read',
      desc: 'Crack high-frequency questions on React performance optimization, virtual lists rendering, modular micro-frontends structure, and browser event cycles.',
      content: 'A comprehensive checklist for engineering interviews in modern tech environments. Learn how to structure explanations for React render cycles, virtual dom optimizations, memory leak detections, and complex layout builds. Prepare for code assessments and behavioral pipelines.',
    },
    {
      id: 2,
      title: 'Optimizing Kubernetes pipelines for CI/CD speed',
      category: 'Industry Insights',
      readTime: '8 min read',
      desc: 'Build Docker architectures that compile fast, caching build steps efficiently and decreasing production bundle delivery times on cloud systems.',
      content: 'Deep-dive into reducing pipeline bottlenecks. Explore multi-stage docker configurations, caching intermediate NPM artifacts, layer optimization, and scaling build nodes inside Kubernetes nodes. Includes sample action templates.',
    },
    {
      id: 3,
      title: 'Formatting CVs for Automated ATS Systems',
      category: 'Resume Tips',
      readTime: '4 min read',
      desc: 'Structure your resume with proper heading hierarchies, semantic metadata fields, and appropriate keywords to maximize AI matching metrics.',
      content: 'How recruiters and AI parsers digest your CV. Learn to use clear section markers (Experience, Education, Skills), plain PDF layouts without floating tables or images, and aligning job descriptions to target keyword mappings.',
    },
    {
      id: 4,
      title: '2026 Developer Salary Benchmarks in India',
      category: 'Salary Guides',
      readTime: '5 min read',
      desc: 'Analyze compensation trends for SDE-1, SDE-2, and SDE-3 levels across Bangalore, Mumbai, NCR and remote work options.',
      content: 'Latest salary data gathered across 500+ verified job listings. Understand current baseline compensation scales, equity/stock layouts, retention structures, and negotiation parameters for senior engineering candidates.',
    },
  ];

  // Filter logic
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || art.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xxl">
        {/* Header */}
        <section className="text-center mb-xl">
          <h1 className="font-display-md text-display-md text-on-surface mb-md">Career Resources Hub</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Expert guidebooks, resume blueprints, and interview preparation guides compiled by recruitment analysts.
          </p>
        </section>

        {/* Filter & Search Bar */}
        <section className="max-w-4xl mx-auto mb-xl space-y-md">
          {/* Search */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:outline-none focus:border-primary text-body-md shadow-sm"
              placeholder="Search articles, templates, or resources..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-xs py-1 select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-md py-xs rounded-full font-title-sm text-body-sm transition-colors border cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-white text-outline hover:text-on-surface border-outline-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Articles List */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-lg w-full">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((art) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedArticle(art)}
                className="bg-white p-lg rounded-xl border border-outline-variant/40 soft-sharp-shadow hover:border-primary-container hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-md text-[11px] font-bold text-outline">
                    <span className="font-mono-label bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-title-sm text-title-sm font-bold text-on-surface mb-xs hover:text-primary transition-colors">
                    {art.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-md">
                    {art.desc}
                  </p>
                </div>
                <span className="text-primary font-bold hover:underline text-[13px] flex items-center gap-xs mt-auto pt-sm border-t border-outline-variant/20">
                  Read Article <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                </span>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-xl text-outline text-body-md bg-white border border-outline-variant/30 rounded-xl">
              No matching resources found. Try another query.
            </div>
          )}
        </section>

        {/* Reading Overlay Drawer */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex justify-end">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full max-w-[560px] bg-white h-full shadow-2xl p-lg flex flex-col justify-between"
              >
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-xs">
                  <div className="flex justify-between items-center border-b border-outline-variant pb-sm mb-lg">
                    <div>
                      <span className="font-mono-label text-[11px] bg-primary-container/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                        {selectedArticle.category}
                      </span>
                      <p className="font-body-sm text-outline mt-1">{selectedArticle.readTime}</p>
                    </div>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <h2 className="font-title-lg text-title-lg text-on-surface mb-lg leading-snug">
                    {selectedArticle.title}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant font-medium leading-relaxed mb-lg border-l-4 border-primary pl-md bg-surface-container-low py-sm rounded-r-lg">
                    {selectedArticle.desc}
                  </p>

                  <div className="prose prose-sm text-on-surface-variant font-body-md leading-relaxed space-y-md">
                    <p>{selectedArticle.content}</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h3 className="font-title-sm text-title-sm text-on-surface mt-xl mb-xs font-bold">Core Guidelines</h3>
                    <ul className="list-disc pl-lg space-y-xs">
                      <li>Maintain clear structural consistency and hierarchical layout titles.</li>
                      <li>Use performance profiling benchmarks to identify render bottlenecks.</li>
                      <li>Incorporate automated testing suites before pushing to master nodes.</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-md flex justify-end gap-sm mt-lg">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-lg py-sm border border-outline text-outline hover:bg-surface-container-low rounded-lg font-bold cursor-pointer text-[13px]"
                  >
                    Close Reader
                  </button>
                  <button
                    onClick={() => {
                      alert('Resource file downloaded successfully!');
                    }}
                    className="px-lg py-sm bg-primary text-white rounded-lg font-bold hover:brightness-110 cursor-pointer text-[13px] flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download PDF
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
