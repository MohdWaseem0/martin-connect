'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface ManagementUser {
  id: string;
  name: string;
  email: string;
  role: 'Seeker' | 'Recruiter' | 'Admin';
  status: 'Active' | 'Suspended';
  joinedDate: string;
  location: string;
  lastActive: string;
  avatar: string;
}

const INITIAL_USERS: ManagementUser[] = [
  {
    id: 'user-1',
    name: 'Rohan Kapoor',
    email: 'rohan.kapoor@martinconnect.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: 'Jan 12, 2024',
    location: 'Mumbai, IN',
    lastActive: 'Just now',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-Lss7ID71JKvl--u83cUntSTj4ygMraFQuMi0K0eK6z5RKCWCUozv6XH-64oHZHnv2omwuu85NoXSZS7ywfGEv1vBeNtJYirE3Hf9e2VL-2CEYPewLGJnpAlMR82MY_j7xZiZHHPQQgTsHz-F8fWvBSuZiIS5P56ZRe45bDer5M3Bkj9eP0HI-A9LWuCXndqrmBzfgKo-oOQUNqLwsIR1TdMR3IIUl-Ti9fQrz0Ao-KdsBnkgZJyIuSDgpqLvIoe6kK11ptkMCEA'
  },
  {
    id: 'user-2',
    name: 'Martin Luther',
    email: 'martin.luther@martinconnect.com',
    role: 'Recruiter',
    status: 'Active',
    joinedDate: 'Mar 08, 2024',
    location: 'Bangalore, IN',
    lastActive: '5 mins ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8MNgzKs6S1J681kgdVwoAhoLJE9oPXrk9yU7RnzouzSzbeyTT_eQ_obnEzyzhG5EJShbyRUtVC_dpnhm6c12PoQPbkBFDdob7YItA84te37HUEaZkyY2XaWM-clxLo--KnhY51PVJsdnSc7jnpUrrGNMNDeTPHmoOMj_AVmn9YbzrRCDG1ZYW44fG60211AasswxlXOQRi0A3fLVELuMteHfKnII9I6uGqCFgfXZnzLK4RAzQyj6baj6JvWgbVNJGCefLvLHMUgo'
  },
  {
    id: 'user-3',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'Seeker',
    status: 'Active',
    joinedDate: 'Aug 19, 2025',
    location: 'Mumbai, IN',
    lastActive: '12 mins ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6NpkFX25Lfry_WJ06MQ05_x2b0szFAsMRd9EJy7IIF8Ds5fSyOETsQabNmL2DKtu1UZj_kEFwY6vHBFu3isgYzcHRyFW4GX5cS6UB11dn3nYkOH8CBMI30IpL-JryJJC5Ifbv0fZz716502PP8xd9klb7CQ9Muqmsr1SqfHazqmX1s6nMaHkc4UcrBWAS8acgHMuM0uh4H9VdbPex78RCyquoUS9_7kWWYgCxAjQhHgz_J2hpKnJPfbKPovAEFiHARVrY3ztYLwk'
  },
  {
    id: 'user-4',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    role: 'Seeker',
    status: 'Active',
    joinedDate: 'Sep 02, 2025',
    location: 'Pune, IN',
    lastActive: '2h ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZzNNTv7xj-W631Gpt3bmKsngn5NJwSheqPmMiI3TyYbvuxqzRqcRlwmplOarzN8nXMIPzU7NOIJ-AvPlaBYKP2PF30GkwPxQtZWqQsbbFehK6ng7MogiU3yu4LofgYbthrisoWNJbQaON2h7t8mxRFSf-NhrMRmwU6BUjl_dFmocKcI20lFKJwRkBZvGi9KlbmmXZnslGYvfxGtzjr64_JxLeOohAvlfNccAztzp1MtZqpFeMvDFyH8Vfx7EHs5rGMWwWM5VrYtE'
  },
  {
    id: 'user-5',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'Seeker',
    status: 'Active',
    joinedDate: 'Oct 29, 2025',
    location: 'Remote',
    lastActive: '1 day ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC6V9vzGziQNwpAUbYOuRBeI2azOxSGHgvJcVRD6WLHFIRsvARpMtqIkIKeMU8OVUK7IJ7ybv2SrlRR_kSSezbghyjv88duKlWSbT8ty15od57LGs3cLQfOQO6MGpICnTW7qGuSiR6R_F1gdPwDZMIELY2Qwoa31IgoSJF_2JPK7VLuW1yfT7qJTy7NyFQ0fXAty4aZSEffEQfCEQ82PVjGJ04Cq3EnCuS6j0fDc7UKuv801TY24CPbbMLkwrVIzhKLaklCvoqUR0'
  },
  {
    id: 'user-6',
    name: 'Spammy Bot',
    email: 'scammer420@spambox.com',
    role: 'Seeker',
    status: 'Suspended',
    joinedDate: 'Nov 01, 2025',
    location: 'Varanasi, IN',
    lastActive: '3 days ago',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
  },
  {
    id: 'user-7',
    name: 'Sneha Reddy',
    email: 'sneha@zensar.com',
    role: 'Recruiter',
    status: 'Active',
    joinedDate: 'Nov 12, 2024',
    location: 'Hyderabad, IN',
    lastActive: '3h ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC1N0K7CQSpRAvwSVkDew3_WcWQXmcL0AGgv_4bvfcbBPIKyfWaWqG1rPoiXhJYnqsa9_iVgpIFv6mtHtGwZWOB-GzHnG9CjBmFIlelm4gg2pkiYtbJXgE-jEEgzvz_mXlc_7hVFWXrOGeEqm_niffAQsTxyRq_YBfOXIdEWdj0q-u7C4ShSDoY4XFhGqriAj5Ygdk0t8sgjqWJGXWnX9OUI2GkqjEwaNICpAZpr13TMtIzgsa9eQMB5Dcy6hGjbVETw9_T7477fI'
  },
  {
    id: 'user-8',
    name: 'Bad Employer Inc',
    email: 'fakejobs@scamposts.org',
    role: 'Recruiter',
    status: 'Suspended',
    joinedDate: 'Dec 05, 2024',
    location: 'Delhi, IN',
    lastActive: '1 week ago',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop'
  }
];

export default function UserDirectory() {
  const [users, setUsers] = useState<ManagementUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Seeker' | 'Recruiter' | 'Admin' | 'Suspended'>('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Toggle user suspension
  const toggleSuspension = (id: string, name: string, currentStatus: ManagementUser['status']) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    showNotification(`User "${name}" has been ${newStatus.toLowerCase()}.`);
  };

  // Change user role
  const changeRole = (id: string, name: string, newRole: ManagementUser['role']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    showNotification(`User "${name}" role updated to ${newRole}.`);
  };

  // Memoized stats counts
  const stats = useMemo(() => {
    return {
      total: users.length,
      seekers: users.filter((u) => u.role === 'Seeker').length,
      recruiters: users.filter((u) => u.role === 'Recruiter').length,
      admins: users.filter((u) => u.role === 'Admin').length,
      suspended: users.filter((u) => u.status === 'Suspended').length
    };
  }, [users]);

  // Filtered users matching search query and active tab
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search Query filter
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Tab filter
      if (activeTab === 'All') return true;
      if (activeTab === 'Suspended') return user.status === 'Suspended';
      return user.role === activeTab;
    });
  }, [users, searchQuery, activeTab]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center h-16 px-lg sticky top-0 z-40 bg-white border-b border-[#E8EEF7] shadow-xs">
        <div className="flex items-center gap-xs">
          <Link href="/admin" className="text-[#737687] hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <h1 className="font-bold text-body-md text-[#121b30] pl-xs">User Management</h1>
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

      {/* Main Body */}
      <main className="p-lg flex-1 space-y-lg">
        {/* Toast Alert */}
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-[#081126] text-white border border-white/10 px-lg py-md rounded-xl shadow-lg flex items-center gap-md animate-fade-in text-xs font-bold">
            <span className="material-symbols-outlined text-primary-container text-[18px]">info</span>
            <p>{feedback}</p>
          </div>
        )}

        {/* Dashboard summary stats */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-md">
          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-1">Total Directory</p>
            <h3 className="text-xl font-bold text-[#121b30]">{stats.total}</h3>
            <p className="text-[10px] text-[#737687] mt-2">Active accounts</p>
          </div>

          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-1">Job Seekers</p>
            <h3 className="text-xl font-bold text-[#121b30]">{stats.seekers}</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-2">Resume databases</p>
          </div>

          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-1">Employers / Recs</p>
            <h3 className="text-xl font-bold text-[#121b30]">{stats.recruiters}</h3>
            <p className="text-[10px] text-purple-600 font-bold mt-2">Brand pipelines</p>
          </div>

          <div className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs">
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-1">Administrators</p>
            <h3 className="text-xl font-bold text-[#121b30]">{stats.admins}</h3>
            <p className="text-[10px] text-primary font-bold mt-2">System access</p>
          </div>

          <div className={`p-md rounded-2xl border shadow-xs ${stats.suspended > 0 ? 'bg-red-50/50 border-red-200' : 'bg-white border-outline-variant'}`}>
            <p className="text-[9px] font-bold text-[#737687] uppercase tracking-wider mb-1">Suspended</p>
            <h3 className={`text-xl font-bold ${stats.suspended > 0 ? 'text-error' : 'text-[#121b30]'}`}>{stats.suspended}</h3>
            <p className="text-[10px] text-error font-bold mt-2">Flagged accounts</p>
          </div>
        </section>

        {/* Directory Controls Bar */}
        <section className="bg-white p-md rounded-2xl border border-outline-variant shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-md">
          {/* Tabs */}
          <div className="flex flex-wrap gap-xs">
            {(['All', 'Seeker', 'Recruiter', 'Admin', 'Suspended'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-md py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-white text-[#737687] border-[#E8EEF7] hover:border-[#121b30]/15'
                  }`}
                >
                  {tab === 'Seeker' ? 'Job Seekers' : tab === 'Recruiter' ? 'Recruiters' : tab === 'Admin' ? 'Admins' : tab}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737687]/65 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or city..."
              className="w-full pl-9 pr-md py-2.5 bg-[#f2f3ff] border border-[#c3c6d8]/65 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </section>

        {/* Users Table Card */}
        <section className="bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F7F9FC]">
                <tr className="font-mono text-[9px] text-[#737687] uppercase tracking-wider border-b border-[#E8EEF7]">
                  <th className="px-lg py-sm">User Details</th>
                  <th className="px-lg py-sm">Security Level</th>
                  <th className="px-lg py-sm">Status Checked</th>
                  <th className="px-lg py-sm">Creation Info</th>
                  <th className="px-lg py-sm text-right">Moderator Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EEF7]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-lg py-xl text-center text-[#737687] italic">
                      No matching records found in user database directories.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#f2f3ff] transition-all">
                      <td className="px-lg py-md flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-slate-100 flex-shrink-0">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-[#121b30]">{user.name}</p>
                          <p className="text-[10px] text-[#737687] font-semibold">{user.email}</p>
                          <p className="text-[10px] text-[#424655] mt-0.5">{user.location}</p>
                        </div>
                      </td>

                      <td className="px-lg py-md">
                        <select
                          value={user.role}
                          onChange={(e) => changeRole(user.id, user.name, e.target.value as ManagementUser['role'])}
                          className="bg-[#f2f3ff] border border-[#c3c6d8]/65 text-xs font-bold text-[#121b30] rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                        >
                          <option value="Seeker">Job Seeker</option>
                          <option value="Recruiter">Recruiter</option>
                          <option value="Admin">Administrator</option>
                        </select>
                      </td>

                      <td className="px-lg py-md">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          user.status === 'Active'
                            ? 'bg-[#16A34A]/10 text-[#15803d] border border-[#16A34A]/30'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {user.status}
                        </span>
                      </td>

                      <td className="px-lg py-md">
                        <p className="text-[#121b30] font-semibold">{user.joinedDate}</p>
                        <p className="text-[10px] text-[#737687]">Active {user.lastActive}</p>
                      </td>

                      <td className="px-lg py-md text-right">
                        <button
                          onClick={() => toggleSuspension(user.id, user.name, user.status)}
                          disabled={user.role === 'Admin'}
                          className={`px-lg py-2 rounded-xl text-[10px] font-bold transition-all border ${
                            user.role === 'Admin'
                              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                              : user.status === 'Active'
                              ? 'border-error/30 text-error hover:bg-error/5 cursor-pointer'
                              : 'bg-[#16A34A]/100 text-white hover:brightness-110 active:scale-95 cursor-pointer border-transparent'
                          }`}
                        >
                          {user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
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
