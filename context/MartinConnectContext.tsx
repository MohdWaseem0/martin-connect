'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface CandidateNote {
  author: string;
  date: string;
  content: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  location: string;
  matchScore: number;
  stage: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired';
  avatar: string;
  timeAgo: string;
  experience: string;
  noticePeriod: string;
  notes: CandidateNote[];
  rating: number;
  email: string;
  phone: string;
  education: string;
  resumeUrl: string;
  salary?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  salary: string;
  skills: string[];
  logo: string;
  status?: 'Applied' | 'Under Review' | 'Hiring' | 'Closed' | 'Interviewing' | 'Shortlisted';
  description: string;
  requirements: string[];
  posted: string;
  experienceRequired: string;
  type: string; // Full-time, Remote, etc.
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  verified: boolean;
  rating: number;
  founded: string;
  website: string;
  jobsCount: number;
  bannerImage?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  location: string;
  experience: string;
  skills: string[];
  role: 'seeker' | 'recruiter' | 'admin';
  phone?: string;
  education?: string;
  resumeUploaded?: boolean;
  resumeName?: string;
  credits?: number;
  companyName?: string;
  companyId?: string;
}

interface MartinConnectContextProps {
  jobs: Job[];
  candidates: Candidate[];
  companies: Company[];
  currentUser: UserProfile | null;
  pendingJobs: Job[];
  pendingCompanies: Company[];
  loading: boolean;
  addJob: (job: Omit<Job, 'id' | 'companyId' | 'posted'>) => Promise<boolean>;
  applyJob: (jobId: string) => Promise<boolean>;
  moveCandidate: (candidateId: string, stage: Candidate['stage']) => Promise<boolean>;
  addCandidateNote: (candidateId: string, content: string) => Promise<boolean>;
  unlockCandidate: (candidateId: string) => Promise<boolean>;
  verifyCompany: (companyId: string) => Promise<boolean>;
  rejectCompany: (companyId: string) => Promise<boolean>;
  moderateJob: (jobId: string, approve: boolean) => Promise<boolean>;
  switchRole: (role: UserProfile['role']) => Promise<boolean>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  signup: (name: string, email: string, password: string, role: string, companyName?: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  logout: () => Promise<boolean>;
  unlockedCandidates: string[];
  refetchData: () => Promise<void>;
}

const MartinConnectContext = createContext<MartinConnectContextProps | undefined>(undefined);

export function MartinConnectProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [unlockedCandidates, setUnlockedCandidates] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch jobs and companies (accessible to guests too)
  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setPendingJobs(data.pendingJobs || []);
      }
      
      const compRes = await fetch('/api/companies');
      if (compRes.ok) {
        const data = await compRes.json();
        setCompanies(data.companies || []);
        setPendingCompanies(data.pendingCompanies || []);
      }
    } catch (e) {
      console.error('Error fetching public data:', e);
    }
  };

  // Helper to fetch candidates and unlocks (requires login)
  const fetchPrivateData = async () => {
    try {
      const res = await fetch('/api/candidates');
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
        setUnlockedCandidates(data.unlockedCandidates || []);
      }
    } catch (e) {
      console.error('Error fetching candidates:', e);
    }
  };

  const refetchData = async () => {
    await fetchPublicData();
    if (currentUser) {
      await fetchPrivateData();
    }
  };

  // 1. Initial Authentication & Data Fetching
  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            // Convert skills comma-separated to array
            const formattedUser: UserProfile = {
              ...data.user,
              skills: data.user.skills ? data.user.skills.split(',') : [],
            };
            setCurrentUser(formattedUser);
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  // Fetch data when currentUser changes
  useEffect(() => {
    fetchPublicData();
    if (currentUser) {
      fetchPrivateData();
    } else {
      setCandidates([]);
      setUnlockedCandidates([]);
    }
  }, [currentUser]);


  // 2. Authentication Functions
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const formattedUser: UserProfile = {
          ...data.user,
          skills: data.user.skills ? data.user.skills.split(',') : [],
        };
        setCurrentUser(formattedUser);
        return { success: true, role: formattedUser.role };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (e) {
      console.error('Login request error:', e);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string, role: string, companyName?: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, companyName }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const formattedUser: UserProfile = {
          ...data.user,
          skills: data.user.skills ? data.user.skills.split(',') : [],
        };
        setCurrentUser(formattedUser);
        return { success: true, role: formattedUser.role };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (e) {
      console.error('Signup request error:', e);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'DELETE',
      });
      if (res.ok) {
        setCurrentUser(null);
        return true;
      }
    } catch (e) {
      console.error('Logout request error:', e);
    }
    return false;
  };


  // 3. Logic & CRUD Functions

  const addJob = async (newJobData: Omit<Job, 'id' | 'companyId' | 'posted'>) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJobData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.job) {
          if (currentUser?.role === 'admin') {
            setJobs((prev) => [data.job, ...prev]);
          } else {
            setPendingJobs((prev) => [data.job, ...prev]);
          }
          return true;
        }
      }
    } catch (e) {
      console.error('Add job error:', e);
    }
    return false;
  };

  const applyJob = async (jobId: string) => {
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Update local status of job to 'Applied'
          setJobs((prevJobs) =>
            prevJobs.map((job) => (job.id === jobId ? { ...job, status: 'Applied' } : job))
          );
          if (data.candidate) {
            setCandidates((prev) => [data.candidate, ...prev]);
          }
          return true;
        }
      }
    } catch (e) {
      console.error('Apply job error:', e);
    }
    return false;
  };

  const moveCandidate = async (candidateId: string, stage: Candidate['stage']) => {
    try {
      const res = await fetch('/api/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, stage }),
      });
      if (res.ok) {
        setCandidates((prevCandidates) =>
          prevCandidates.map((cand) => (cand.id === candidateId ? { ...cand, stage } : cand))
        );
        return true;
      }
    } catch (e) {
      console.error('Move candidate error:', e);
    }
    return false;
  };

  const addCandidateNote = async (candidateId: string, content: string) => {
    try {
      const res = await fetch('/api/candidates/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, content }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.note) {
          setCandidates((prevCandidates) =>
            prevCandidates.map((cand) => {
              if (cand.id === candidateId) {
                return {
                  ...cand,
                  notes: [data.note, ...cand.notes],
                };
              }
              return cand;
            })
          );
          return true;
        }
      }
    } catch (e) {
      console.error('Add note error:', e);
    }
    return false;
  };

  const unlockCandidate = async (candidateId: string) => {
    try {
      const res = await fetch('/api/candidates/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUnlockedCandidates((prev) => [...prev, candidateId]);
        if (currentUser && data.creditsRemaining !== undefined) {
          setCurrentUser({
            ...currentUser,
            credits: data.creditsRemaining,
          });
        }
        return true;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) {
      console.error('Unlock candidate error:', e);
    }
    return false;
  };

  const verifyCompany = async (companyId: string) => {
    try {
      const res = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, action: 'verify' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.company) {
          setCompanies((prev) => [...prev, data.company]);
          setPendingCompanies((prev) => prev.filter((c) => c.id !== companyId));
          return true;
        }
      }
    } catch (e) {
      console.error('Verify company error:', e);
    }
    return false;
  };

  const rejectCompany = async (companyId: string) => {
    try {
      const res = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, action: 'reject' }),
      });
      if (res.ok) {
        setPendingCompanies((prev) => prev.filter((c) => c.id !== companyId));
        return true;
      }
    } catch (e) {
      console.error('Reject company error:', e);
    }
    return false;
  };

  const moderateJob = async (jobId: string, approve: boolean) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, approve }),
      });
      if (res.ok) {
        const data = await res.json();
        if (approve && data.success && data.job) {
          setJobs((prev) => [data.job, ...prev]);
        }
        setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
        return true;
      }
    } catch (e) {
      console.error('Moderate job error:', e);
    }
    return false;
  };

  const switchRole = async (role: UserProfile['role']) => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const formattedUser: UserProfile = {
            ...data.user,
            skills: data.user.skills ? data.user.skills.split(',') : [],
          };
          setCurrentUser(formattedUser);
          return true;
        }
      }
    } catch (e) {
      console.error('Switch role error:', e);
    }
    return false;
  };

  const updateProfile = async (profileUpdates: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileUpdates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const formattedUser: UserProfile = {
            ...data.user,
            skills: data.user.skills ? data.user.skills.split(',') : [],
          };
          setCurrentUser(formattedUser);
          return true;
        }
      }
    } catch (e) {
      console.error('Update profile error:', e);
    }
    return false;
  };

  return (
    <MartinConnectContext.Provider
      value={{
        jobs,
        candidates,
        companies,
        currentUser,
        pendingJobs,
        pendingCompanies,
        loading,
        addJob,
        applyJob,
        moveCandidate,
        addCandidateNote,
        unlockCandidate,
        verifyCompany,
        rejectCompany,
        moderateJob,
        switchRole,
        updateProfile,
        login,
        signup,
        logout,
        unlockedCandidates,
        refetchData,
      }}
    >
      {children}
    </MartinConnectContext.Provider>
  );
}

export function useMartinConnect() {
  const context = useContext(MartinConnectContext);
  if (context === undefined) {
    throw new Error('useMartinConnect must be used within a MartinConnectProvider');
  }
  return context;
}
