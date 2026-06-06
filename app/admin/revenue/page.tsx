'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  name: string;
  avatar?: string;
  tier: 'Enterprise Tier' | 'Growth Tier' | 'Seeker Prime';
  amount: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  invoiceUrl: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-9028',
    name: 'Swiggy',
    tier: 'Enterprise Tier',
    amount: 120000,
    date: 'Jun 04, 2026',
    status: 'Success',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-9027',
    name: 'Flipkart',
    tier: 'Enterprise Tier',
    amount: 120000,
    date: 'Jun 03, 2026',
    status: 'Success',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-9026',
    name: 'Aarav Sharma',
    tier: 'Seeker Prime',
    amount: 1499,
    date: 'Jun 03, 2026',
    status: 'Success',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-9025',
    name: 'Tata Consultancy Services',
    tier: 'Enterprise Tier',
    amount: 250000,
    date: 'Jun 02, 2026',
    status: 'Success',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-9024',
    name: 'Sneha Reddy',
    tier: 'Seeker Prime',
    amount: 1499,
    date: 'Jun 02, 2026',
    status: 'Success',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-9023',
    name: 'Zenith AI',
    tier: 'Growth Tier',
    amount: 45000,
    date: 'Jun 01, 2026',
    status: 'Pending',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-9022',
    name: 'Sarah Jenkins',
    tier: 'Seeker Prime',
    amount: 1499,
    date: 'May 31, 2026',
    status: 'Success',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-9021',
    name: 'Wipro',
    tier: 'Growth Tier',
    amount: 45000,
    date: 'May 28, 2026',
    status: 'Failed',
    invoiceUrl: '#'
  }
];

export default function AdminRevenueDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [filterTier, setFilterTier] = useState<'All' | 'Enterprise Tier' | 'Growth Tier' | 'Seeker Prime'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Success' | 'Pending' | 'Failed'>('All');
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Revenue pricing adjustments simulator state
  const [priceEnterprise, setPriceEnterprise] = useState(120000);
  const [priceGrowth, setPriceGrowth] = useState(45000);
  const [priceSeeker, setPriceSeeker] = useState(1499);

  // Subscribers
  const countEnterprise = 70;
  const countGrowth = 138;
  const countSeeker = 2530;

  // Compute live simulated MRR
  const simulatedMRR = useMemo(() => {
    const enterpriseYield = countEnterprise * priceEnterprise;
    const growthYield = countGrowth * priceGrowth;
    const seekerYield = countSeeker * priceSeeker;
    return enterpriseYield + growthYield + seekerYield;
  }, [priceEnterprise, priceGrowth, priceSeeker]);

  // Filtered transactions list
  const filteredTxns = useMemo(() => {
    return transactions.filter((txn) => {
      const matchTier = filterTier === 'All' || txn.tier === filterTier;
      const matchStatus = filterStatus === 'All' || txn.status === filterStatus;
      return matchTier && matchStatus;
    });
  }, [transactions, filterTier, filterStatus]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setFeedback('Transaction statements exported as CSV successfully!');
      setTimeout(() => setFeedback(null), 3000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center h-16 px-lg sticky top-0 z-40 bg-white border-b border-[#E8EEF7] shadow-xs">
        <div className="flex items-center gap-xs">
          <Link href="/admin" className="text-[#737687] hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <h1 className="font-bold text-body-md text-[#121b30] pl-xs">Revenue & Subscriptions</h1>
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

      {/* Main Container */}
      <main className="p-lg flex-1 space-y-lg">
        {/* Toast Alert */}
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-[#081126] text-white border border-white/10 px-lg py-md rounded-xl shadow-lg flex items-center gap-md animate-fade-in text-xs font-bold">
            <span className="material-symbols-outlined text-primary-container text-[18px]">payments</span>
            <p>{feedback}</p>
          </div>
        )}

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Main Yield summary */}
          <div className="lg:col-span-2 bg-[#081126] text-white p-lg rounded-2xl border border-white/10 shadow-md flex flex-col justify-between">
            <div className="space-y-sm">
              <span className="px-2 py-0.5 bg-[#16A34A]/100/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/30">
                LIVE FINANCIAL AUDIT
              </span>
              <p className="text-xs text-outline-variant/80">Platform Monthly Recurring Revenue (MRR)</p>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                ₹{(simulatedMRR / 10000000).toFixed(2)} Cr
                <span className="text-xs text-outline-variant/60 font-semibold ml-2">Simulated yield based on dials</span>
              </h2>
            </div>

            {/* Micro Area chart */}
            <div className="h-28 w-full pt-md relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                <path
                  d="M0,90 C50,85 100,70 150,75 C200,80 250,50 300,45 C350,40 400,20 450,22 C480,24 490,10 500,5 L500,100 L0,100 Z"
                  fill="rgba(16, 185, 129, 0.1)"
                />
                <path
                  d="M0,90 C50,85 100,70 150,75 C200,80 250,50 300,45 C350,40 400,20 450,22 C480,24 490,10 500,5"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="500" cy="5" r="3" fill="white" stroke="#10B981" strokeWidth="2" />
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between text-[8px] font-bold text-outline-variant/60">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun (Live)</span>
              </div>
            </div>
          </div>

          {/* Pricing Adjustments dials */}
          <div className="bg-white p-lg rounded-2xl border border-outline-variant shadow-xs space-y-md">
            <div>
              <h3 className="font-bold text-body-md text-[#121b30]">Yield Simulator</h3>
              <p className="text-[10px] text-[#737687] font-semibold">Slide to forecast price changes on MRR</p>
            </div>

            <div className="space-y-sm text-xs font-semibold text-[#121b30]">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Enterprise Tier</span>
                  <span className="font-bold text-primary">₹{(priceEnterprise / 1000).toFixed(0)}k/mo</span>
                </div>
                <input
                  type="range"
                  min="80000"
                  max="200000"
                  step="5000"
                  value={priceEnterprise}
                  onChange={(e) => setPriceEnterprise(Number(e.target.value))}
                  className="w-full h-1 bg-[#f2f3ff] rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Growth Tier</span>
                  <span className="font-bold text-purple-600">₹{(priceGrowth / 1000).toFixed(0)}k/mo</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="80000"
                  step="2000"
                  value={priceGrowth}
                  onChange={(e) => setPriceGrowth(Number(e.target.value))}
                  className="w-full h-1 bg-[#f2f3ff] rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Seeker Prime</span>
                  <span className="font-bold text-emerald-600">₹{priceSeeker}/mo</span>
                </div>
                <input
                  type="range"
                  min="499"
                  max="2999"
                  step="100"
                  value={priceSeeker}
                  onChange={(e) => setPriceSeeker(Number(e.target.value))}
                  className="w-full h-1 bg-[#f2f3ff] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tier Distribution Table */}
        <section className="bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
          <div className="px-lg py-md border-b border-[#E8EEF7]">
            <h3 className="font-bold text-body-md text-[#121b30]">Subscription Tiers & Distribution</h3>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F7F9FC]">
                <tr className="font-mono text-[9px] text-[#737687] uppercase tracking-wider">
                  <th className="px-lg py-sm">Plan Tier</th>
                  <th className="px-lg py-sm">Base Price</th>
                  <th className="px-lg py-sm">Active Accounts</th>
                  <th className="px-lg py-sm">Renewal Cycle</th>
                  <th className="px-lg py-sm text-right">Yield (Monthly)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EEF7] font-semibold text-[#121b30]">
                <tr className="hover:bg-[#f2f3ff] transition-all">
                  <td className="px-lg py-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">corporate_fare</span>
                    <span>Enterprise Tier</span>
                  </td>
                  <td className="px-lg py-md text-[#424655]">₹{priceEnterprise.toLocaleString('en-IN')}/mo</td>
                  <td className="px-lg py-md text-[#424655]">{countEnterprise} companies</td>
                  <td className="px-lg py-md text-emerald-600 font-bold">Monthly Auto-charge</td>
                  <td className="px-lg py-md text-right text-primary font-bold">₹{(countEnterprise * priceEnterprise).toLocaleString('en-IN')}</td>
                </tr>

                <tr className="hover:bg-[#f2f3ff] transition-all">
                  <td className="px-lg py-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-purple-600 text-[18px]">rocket_launch</span>
                    <span>Growth Tier</span>
                  </td>
                  <td className="px-lg py-md text-[#424655]">₹{priceGrowth.toLocaleString('en-IN')}/mo</td>
                  <td className="px-lg py-md text-[#424655]">{countGrowth} companies</td>
                  <td className="px-lg py-md text-emerald-600 font-bold">Monthly Auto-charge</td>
                  <td className="px-lg py-md text-right text-purple-600 font-bold">₹{(countGrowth * priceGrowth).toLocaleString('en-IN')}</td>
                </tr>

                <tr className="hover:bg-[#f2f3ff] transition-all">
                  <td className="px-lg py-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[#16A34A] text-[18px]">person</span>
                    <span>Seeker Prime</span>
                  </td>
                  <td className="px-lg py-md text-[#424655]">₹{priceSeeker.toLocaleString('en-IN')}/mo</td>
                  <td className="px-lg py-md text-[#424655]">{countSeeker} members</td>
                  <td className="px-lg py-md text-emerald-600 font-bold">Recurring Credit</td>
                  <td className="px-lg py-md text-right text-emerald-600 font-bold">₹{(countSeeker * priceSeeker).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Transaction History directory layout */}
        <section className="bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
          <div className="px-lg py-md border-b border-[#E8EEF7] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-md">
            <div>
              <h3 className="font-bold text-body-md text-[#121b30]">Transaction Audit Ledger</h3>
              <p className="text-[10px] text-[#737687] font-semibold">Detailed invoices for current billing cycle</p>
            </div>

            <div className="flex flex-wrap items-center gap-sm">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as any)}
                className="bg-[#f2f3ff] border border-[#c3c6d8]/65 text-[11px] font-bold text-[#121b30] rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="All">All Plans</option>
                <option value="Enterprise Tier">Enterprise Tier</option>
                <option value="Growth Tier">Growth Tier</option>
                <option value="Seeker Prime">Seeker Prime</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-[#f2f3ff] border border-[#c3c6d8]/65 text-[11px] font-bold text-[#121b30] rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>

              <button
                onClick={handleExport}
                disabled={exporting}
                className="bg-primary hover:brightness-110 active:scale-95 text-white px-md py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F7F9FC]">
                <tr className="font-mono text-[9px] text-[#737687] uppercase tracking-wider border-b border-[#E8EEF7]">
                  <th className="px-lg py-sm">Receipt ID</th>
                  <th className="px-lg py-sm">Account Name</th>
                  <th className="px-lg py-sm">Subscription Tier</th>
                  <th className="px-lg py-sm">Billing Date</th>
                  <th className="px-lg py-sm">Amount Paid</th>
                  <th className="px-lg py-sm">Payment Status</th>
                  <th className="px-lg py-sm text-right">Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EEF7]">
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-lg py-xl text-center text-[#737687] italic">
                      No transactions match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredTxns.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#f2f3ff] transition-all font-semibold">
                      <td className="px-lg py-md text-[#424655] font-mono">{txn.id}</td>
                      <td className="px-lg py-md text-[#121b30]">{txn.name}</td>
                      <td className="px-lg py-md">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          txn.tier === 'Enterprise Tier'
                            ? 'bg-primary/10 text-primary'
                            : txn.tier === 'Growth Tier'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-[#16A34A]/10 text-[#15803d]'
                        }`}>
                          {txn.tier}
                        </span>
                      </td>
                      <td className="px-lg py-md text-[#737687]">{txn.date}</td>
                      <td className="px-lg py-md text-[#121b30]">₹{txn.amount.toLocaleString('en-IN')}</td>
                      <td className="px-lg py-md">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          txn.status === 'Success'
                            ? 'bg-[#16A34A]/10 text-[#15803d] border border-[#16A34A]/30'
                            : txn.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <button className="text-primary hover:underline font-bold text-[10px]">
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
