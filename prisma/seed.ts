import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper to parse a CSV line, respecting double quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Map titles to skills
function extractSkills(title: string): string[] {
  const skillsSet = new Set<string>();
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('react') || titleLower.includes('frontend') || titleLower.includes('sde') || titleLower.includes('engineer') || titleLower.includes('developer')) {
    skillsSet.add('React');
    skillsSet.add('TypeScript');
    skillsSet.add('JavaScript');
  }
  if (titleLower.includes('java') || titleLower.includes('backend') || titleLower.includes('system engineer')) {
    skillsSet.add('Java');
    skillsSet.add('Spring Boot');
    skillsSet.add('SQL');
  }
  if (titleLower.includes('security') || titleLower.includes('consultant')) {
    skillsSet.add('Cyber Security');
    skillsSet.add('Penetration Testing');
    skillsSet.add('Firewalls');
  }
  if (titleLower.includes('innov') || titleLower.includes('transform') || titleLower.includes('lead') || titleLower.includes('partner')) {
    skillsSet.add('System Architecture');
    skillsSet.add('Agile');
    skillsSet.add('Cloud Computing');
  }
  if (titleLower.includes('architect')) {
    skillsSet.add('System Architecture');
    skillsSet.add('Microservices');
    skillsSet.add('AWS');
  }
  if (titleLower.includes('devops') || titleLower.includes('kubernetes') || titleLower.includes('docker')) {
    skillsSet.add('Docker');
    skillsSet.add('Kubernetes');
    skillsSet.add('CI/CD');
    skillsSet.add('Terraform');
  }
  if (titleLower.includes('design') || titleLower.includes('ux') || titleLower.includes('ui')) {
    skillsSet.add('Figma');
    skillsSet.add('UI/UX Design');
    skillsSet.add('Prototyping');
  }
  if (titleLower.includes('data') || titleLower.includes('analytics') || titleLower.includes('science')) {
    skillsSet.add('Python');
    skillsSet.add('Pandas');
    skillsSet.add('SQL');
  }
  if (titleLower.includes('sales') || titleLower.includes('operations') || titleLower.includes('management') || titleLower.includes('hr')) {
    skillsSet.add('Jira');
    skillsSet.add('Agile');
    skillsSet.add('Project Management');
  }
  
  // Default fallback skills if none matched
  if (skillsSet.size === 0) {
    skillsSet.add('Agile');
    skillsSet.add('SQL');
    skillsSet.add('JavaScript');
  }
  
  return Array.from(skillsSet);
}

// Map title to experience range
function getExperience(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('vice president') || titleLower.includes('vp') || titleLower.includes('head') || titleLower.includes('partner')) {
    return '12+ Years';
  }
  if (titleLower.includes('lead') || titleLower.includes('architect') || titleLower.includes('manager') || titleLower.includes('delivery')) {
    return '8-12 Years';
  }
  if (titleLower.includes('senior') || titleLower.includes('consultant')) {
    return '5-8 Years';
  }
  return '2-5 Years';
}

const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop'
];

const stages = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired'];
const noticePeriods = ['Immediate', '15 Days', '30 Days', '90 Days'];

async function main() {
  console.log('Starting seeding...');

  // 1. Clean Database
  await prisma.candidateNote.deleteMany();
  await prisma.candidateUnlock.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Default Users (for each role)
  // Passwords will be plain text hashed, for test simple: we can hash it using bcryptjs or just store hashed.
  // We'll use bcryptjs here.
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@martinconnect.com',
      passwordHash,
      name: 'Admin Platform Overseer',
      title: 'Super Administrator',
      location: 'Delhi, IN',
      experience: '10 Years',
      skills: 'System Administration, Security, Management',
      role: 'admin',
      credits: 9999
    }
  });

  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@martinconnect.com',
      passwordHash,
      name: 'Martin Luther',
      title: 'Head Recruiter',
      location: 'Mumbai, IN',
      experience: '7 Years',
      skills: 'Talent Sourcing, Interviewing, Brand Strategy',
      role: 'recruiter',
      credits: 42
    }
  });

  const seeker = await prisma.user.create({
    data: {
      email: 'seeker@example.com',
      passwordHash,
      name: 'Aarav Sharma',
      title: 'Frontend Engineer',
      location: 'Mumbai, IN',
      experience: '3 Years',
      skills: 'React, Next.js, Tailwind CSS, TypeScript',
      role: 'seeker',
      credits: 0,
      phone: '+91 95555 44433',
      education: 'Bachelor of Science in CS, Mumbai University',
      resumeUploaded: true,
      resumeName: 'Aarav_Sharma_Resume.pdf'
    }
  });

  console.log('Created default users.');

  // 3. Create Companies
  const companiesData = [
    {
      id: 'company-tcs',
      name: 'Tata Consultancy Services',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPiXbXtpmidJSSPLov8QcWSLSy8MOCb1PWvBAmiwS4IBmd4UT_Khq-C_CHaJXESI_mxsMQRqO8hb6JI-MHYcWywjvXMx7AyeDQV6pLuVSSyRc4FSozY2eWku19EDw0j3SZNitqFuuMkrOPEUl7PFebdPN4oorYdIB3BoeuzehuUrIpy-uQQbe7KkM_woiOdGM7JnMu7uphX5kG_nXaILb-knV_4pQr4N9jCgA7G-1vP_7ybawWxml1koIro90pE7HgffE60P3wRWQ',
      description: 'Tata Consultancy Services is an IT services, consulting and business solutions organization that has been partnering with many of the worlds largest businesses for the past 50 years.',
      industry: 'IT Services & Consulting',
      size: '500,000+ Employees',
      location: 'Mumbai, Maharashtra',
      verified: true,
      rating: 4.1,
      founded: '1968',
      website: 'www.tcs.com',
      jobsCount: 12
    },
    {
      id: 'company-flipkart',
      name: 'Flipkart',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOu0dmhdwDFQFEE2A4sTM_SLTyo6xWT4x849t7DqFO1NaYWwVh31xT3NQ7IobcKeMMCdAt-Mvx4OmwkbFIF4JtENnRB9c4V1q7h2dEHoC8ddlPVJi4x19y3exsU1vtA0eWdkhIlZ07Y0zW9IkCKU9xiXwLzCaIjSPWg_cJJjgCkz4hpLCubAtiL8jaYn1VZJ39DI9A7pcfa59AV8l8Rh5i9kcUviyXcbo1tY0nVbrKJGbMAGbESBgyAPdzx3UNKosWxkONTUvMf6U',
      description: 'Flipkart is Indias leading e-commerce marketplace with over 80 million products across 80+ categories. Founded in 2007, Flipkart has enabled millions of consumers and sellers to be part of Indias digital commerce revolution.',
      industry: 'E-commerce',
      size: '30,000+ Employees',
      location: 'Bangalore, Karnataka',
      verified: true,
      rating: 4.3,
      founded: '2007',
      website: 'www.flipkart.com',
      jobsCount: 8
    },
    {
      id: 'company-hdfc',
      name: 'HDFC Bank',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeinMWaqbHyMFYNppCnJEHXkfzBkXZaTVMyMD3tGK4E6ba-iogbAgdX-9O7Fb-FYpNDdKmAm1fRvqEwN8lFWMM0PAMtxSp66sEh1GlHoQSozD35_23pVSuRBqjrt4AS7nKG7KyQycL02Ia4wMCoB5tkY-sRz65kdIZ6mfLOscMzZ1RaSp-FsZ7Hs7JGaiNu4LdssZyInjyoYtPHXf5ZMdNRxF-e427qFJzgH8L9w2QfFZEuI1rjLIJRqAkrHvy5xujtjdv-mTvh7s',
      description: 'HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is the public sector banking heavyweight by asset size and Indias largest private sector bank.',
      industry: 'Banking & Financial Services',
      size: '150,000+ Employees',
      location: 'Mumbai, Maharashtra',
      verified: true,
      rating: 4.2,
      founded: '1994',
      website: 'www.hdfcbank.com',
      jobsCount: 6
    },
    {
      id: 'company-swiggy',
      name: 'Swiggy',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYu8pw6koVxkPg6lRe-yKJiUMVVX-ZnCC1LW6rIwVoptaAgk3UDap8WyQU3YM04nvfPZNxS04I5ANeldI1u-jJzAaUPNhK4xVMT7FcWlL980pPOBb3IziHTlu94hpYyfH0fD3UO1GDbnTz0vTZwoLChMZzzqmXUb136_mkOYdsIGQyG_ZCF4zr-Amg0YbY8CALwdHGQhwm1G0yRYEmt3FZ8J3O6hs74Cw4CfXX3pT4b8MAj8qzYO7J-CS10QTEQDQfT7LH_E4fBpw',
      description: 'Swiggy is Indias leading on-demand convenience platform, delivering food, groceries (via Instamart), and packages across 500+ Indian cities.',
      industry: 'On-demand Delivery & Logistics',
      size: '10,000+ Employees',
      location: 'Bangalore, Karnataka',
      verified: true,
      rating: 4.0,
      founded: '2014',
      website: 'www.swiggy.com',
      jobsCount: 4
    }
  ];

  for (const c of companiesData) {
    await prisma.company.create({ data: c });
  }

  console.log('Created default companies.');

  // 4. Create Jobs
  const jobsData = [
    {
      id: 'job-1',
      title: 'Senior SDE',
      company: 'Tata Consultancy Services',
      companyId: 'company-tcs',
      location: 'Mumbai',
      salary: '₹24L - 42L',
      skills: 'Java,React,K8s',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPiXbXtpmidJSSPLov8QcWSLSy8MOCb1PWvBAmiwS4IBmd4UT_Khq-C_CHaJXESI_mxsMQRqO8hb6JI-MHYcWywjvXMx7AyeDQV6pLuVSSyRc4FSozY2eWku19EDw0j3SZNitqFuuMkrOPEUl7PFebdPN4oorYdIB3BoeuzehuUrIpy-uQQbe7KkM_woiOdGM7JnMu7uphX5kG_nXaILb-knV_4pQr4N9jCgA7G-1vP_7ybawWxml1koIro90pE7HgffE60P3wRWQ',
      status: 'Hiring',
      type: 'Full-time',
      experienceRequired: '5-8 Years',
      description: 'We are seeking a Senior Software Development Engineer with a deep expertise in high-concurrency systems, Java Spring Boot backends, and modular frontends built on React. You will own architecture modules and guide a team of engineers.',
      requirements: '5+ years of production experience in backend development using Java/Spring Boot;Strong hands-on experience with modern Javascript frameworks, especially React and Next.js;Proven history of container orchestration, deployment on Kubernetes (K8s) and cloud structures (AWS/Azure);Strong problem-solving skills and clean coding disciplines.',
      posted: '2 days ago'
    },
    {
      id: 'job-2',
      title: 'Product Manager',
      company: 'Flipkart',
      companyId: 'company-flipkart',
      location: 'Bangalore (Remote)',
      salary: '₹35L - 55L',
      skills: 'SQL,Agile,E-com',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOu0dmhdwDFQFEE2A4sTM_SLTyo6xWT4x849t7DqFO1NaYWwVh31xT3NQ7IobcKeMMCdAt-Mvx4OmwkbFIF4JtENnRB9c4V1q7h2dEHoC8ddlPVJi4x19y3exsU1vtA0eWdkhIlZ07Y0zW9IkCKU9xiXwLzCaIjSPWg_cJJjgCkz4hpLCubAtiL8jaYn1VZJ39DI9A7pcfa59AV8l8Rh5i9kcUviyXcbo1tY0nVbrKJGbMAGbESBgyAPdzx3UNKosWxkONTUvMf6U',
      status: 'Hiring',
      type: 'Remote',
      experienceRequired: '4-7 Years',
      description: 'Flipkart is looking for an analytical Product Manager to steer core search and checkout flows. You will work alongside engineering, UX design, and business analysts to deliver high-converting user journeys.',
      requirements: '4+ years of product management experience, preferably in consumer internet or e-commerce;Expertise in writing detailed PRDs, working in agile environments, and translating analytics into features;Proficiency in SQL query design and product analysis systems;Excellent stakeholder management and communication skills.',
      posted: '5 days ago'
    },
    {
      id: 'job-3',
      title: 'Data Scientist',
      company: 'HDFC Bank',
      companyId: 'company-hdfc',
      location: 'Pune',
      salary: '₹28L - 50L',
      skills: 'Python,NLP,Finance',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeinMWaqbHyMFYNppCnJEHXkfzBkXZaTVMyMD3tGK4E6ba-iogbAgdX-9O7Fb-FYpNDdKmAm1fRvqEwN8lFWMM0PAMtxSp66sEh1GlHoQSozD35_23pVSuRBqjrt4AS7nKG7KyQycL02Ia4wMCoB5tkY-sRz65kdIZ6mfLOscMzZ1RaSp-FsZ7Hs7JGaiNu4LdssZyInjyoYtPHXf5ZMdNRxF-e427qFJzgH8L9w2QfFZEuI1rjLIJRqAkrHvy5xujtjdv-mTvh7s',
      status: 'Hiring',
      type: 'Full-time',
      experienceRequired: '3-6 Years',
      description: 'Join the Core Analytics group at HDFC Bank. You will design, build, and deploy machine learning models targeting transaction risk management, automated loan processing, and natural language query systems.',
      requirements: '3+ years of experience programming in Python and using data libraries (Pandas, Scikit-learn, PyTorch);Strong knowledge of NLP structures (transformers, LLMs, text classification);Prior banking or finance data experience is highly preferred;Degree in Statistics, Mathematics, Computer Science or equivalent quant fields.',
      posted: '3 days ago'
    }
  ];

  for (const j of jobsData) {
    await prisma.job.create({ data: j });
  }

  console.log('Created default jobs.');

  // 5. Parse and Seed Candidates from CSVs
  const projectRootDir = path.resolve(__dirname, '..');
  const tcsCsvPath = path.join(projectRootDir, 'Tata Consultancy Services.csv');
  const techMahindraCsvPath = path.join(projectRootDir, 'Tech Mahindra.csv');

  let candIdCounter = 1;

  // Function to process a single CSV file
  const processCsvFile = async (filePath: string, companyName: string, isTcs: boolean) => {
    if (!fs.existsSync(filePath)) {
      console.warn(`CSV file not found at path: ${filePath}`);
      return;
    }

    console.log(`Processing CSV file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length <= 1) return; // Only header or empty

    const header = parseCSVLine(lines[0]);
    console.log(`Header for ${companyName}:`, header);

    // Read remaining lines
    for (let i = 1; i < lines.length; i++) {
      const columns = parseCSVLine(lines[i]);
      if (columns.length < 5) continue; // Skip invalid lines

      const firstName = columns[0] || '';
      const lastName = columns[1] || '';
      const position = columns[2] || 'Software Professional';
      const company = columns[3] || companyName;
      const location = columns[4] || 'India';

      let email = '';
      let phone = '';

      if (isTcs) {
        // TCS columns: First Name (0), Last Name (1), Position (2), Company (3), Location (4)
        // Business Email1 (5), Business Email2 (6), Personal Email1 (7), Personal Email2 (8)
        // Mobile Phone1 (9), Mobile Phone2 (10)
        email = columns[5] || columns[7] || columns[6] || columns[8] || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        phone = columns[9] || columns[10] || columns[11] || '+91 99999 88888';
      } else {
        // Tech Mahindra columns: First Name (0), Last Name (1), Position (2), Company (3), Location (4)
        // Personal Email1 (5), Personal Email2 (6), Business Email1 (7), Business Email2 (8)
        // Mobile Phone1 (9), Mobile Phone2 (10)
        email = columns[7] || columns[5] || columns[8] || columns[6] || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        phone = columns[9] || columns[10] || columns[11] || '+91 99999 77777';
      }

      // Generate random ratings, experience, stage etc.
      const candId = `cand-imported-${candIdCounter++}`;
      const skills = extractSkills(position).join(',');
      const exp = getExperience(position);
      const stage = stages[i % stages.length];
      const notice = noticePeriods[i % noticePeriods.length];
      const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
      const matchScore = 80 + Math.floor(Math.random() * 20);
      const avatar = avatars[i % avatars.length];
      const timeAgo = `${i}d ago`;
      const education = isTcs ? 'B.Tech in Computer Science, IIT Madras' : 'B.E. in Electronics, Pune University';
      const salaryRange = `${10 + Math.floor(Math.random() * 10)}L - ${20 + Math.floor(Math.random() * 20)}L`;

      await prisma.candidate.create({
        data: {
          id: candId,
          name: `${firstName} ${lastName}`,
          title: position,
          skills,
          location,
          matchScore,
          stage,
          avatar,
          timeAgo,
          experience: exp,
          noticePeriod: notice,
          rating,
          email,
          phone,
          education,
          salary: `₹${salaryRange}`,
          resumeUrl: '#'
        }
      });
      console.log(`Seeded candidate: ${firstName} ${lastName} (${position})`);
    }
  };

  await processCsvFile(tcsCsvPath, 'Tata Consultancy Services', true);
  await processCsvFile(techMahindraCsvPath, 'Tech Mahindra', false);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
