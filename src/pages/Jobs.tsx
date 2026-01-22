
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Briefcase, Search, BookOpen, MapPin } from 'lucide-react';
import JobCard from '@/components/JobCard';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const readLocalList = <T,>(key: string, fallback: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const Jobs = () => {
  const { toast } = useToast();
  const [userQualifications, setUserQualifications] = useState<string[]>([]);
  const [inputQualification, setInputQualification] = useState("");
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [jobCategoryFilter, setJobCategoryFilter] = useState('all');

  useEffect(() => {
    const storedJobs = readLocalList<any>('adminJobs', []);
    const mappedJobs = storedJobs.map((job: any, index: number) => {
      const salaryMin = typeof job.salary_min === 'number' ? job.salary_min : null;
      const salaryMax = typeof job.salary_max === 'number' ? job.salary_max : null;
      const salaryRange =
        salaryMin && salaryMax
          ? `MWK ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`
          : salaryMin
            ? `MWK ${salaryMin.toLocaleString()}`
            : salaryMax
              ? `MWK ${salaryMax.toLocaleString()}`
              : 'Negotiable';
      const requirements = typeof job.requirements === 'string' ? job.requirements : '';
      const qualifications = requirements
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter(Boolean);

      return {
        id: job.id || `job_${index}`,
        title: job.title || 'Job Opportunity',
        company: job.employer_name || 'Employer',
        employer_email: job.employer_email || '',
        location: job.location || 'Malawi',
        type: job.job_type
          ? job.job_type
              .split('-')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join('-')
          : 'Full-time',
        category: job.job_category || 'General',
        salary: salaryRange,
        qualifications: qualifications.length ? qualifications : ['Open to applicants'],
        description: job.description || 'Job description coming soon.',
      };
    });
    setAllJobs(mappedJobs);
    setJobs(mappedJobs);
  }, []);

  // Filter jobs based on user qualifications
  useEffect(() => {
    if (userQualifications.length > 0) {
      const filteredJobs = allJobs.filter(job => {
        return job.qualifications.some(qual => 
          userQualifications.some(userQual => 
            userQual.toLowerCase().includes(qual.toLowerCase()) || 
            qual.toLowerCase().includes(userQual.toLowerCase())
          )
        );
      });
      
      setJobs(filteredJobs.length > 0 ? filteredJobs : allJobs);
    } else {
      setJobs(allJobs);
    }
  }, [userQualifications, allJobs]);

  // Handle search and filtering
  const handleSearch = () => {
    let filtered = [...allJobs];
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (userQualifications.length > 0) {
      filtered = filtered.filter(job => {
        return job.qualifications.some(qual => 
          userQualifications.some(userQual => 
            userQual.toLowerCase().includes(qual.toLowerCase()) || 
            qual.toLowerCase().includes(userQual.toLowerCase())
          )
        );
      });
    }
    
    setJobs(filtered);
    
    toast({
      title: "Search results",
      description: `Found ${filtered.length} matching jobs`,
    });
  };

  // Add a qualification
  const addQualification = () => {
    if (inputQualification && !userQualifications.includes(inputQualification)) {
      setUserQualifications([...userQualifications, inputQualification]);
      setInputQualification("");
    }
  };

  // Remove a qualification
  const removeQualification = (qual: string) => {
    setUserQualifications(userQualifications.filter(q => q !== qual));
  };

  const filteredJobs = jobs.filter((job) => {
    if (jobTypeFilter === 'all') return true;
    return job.type.toLowerCase().replace(/\s+/g, '-') === jobTypeFilter;
  }).filter((job) => {
    if (jobCategoryFilter === 'all') return true;
    return String(job.category || '').toLowerCase() === jobCategoryFilter;
  });

  const jobCategories = ['all', ...Array.from(new Set(allJobs.map((job) => String(job.category || 'General').toLowerCase())))];

  // Apply for a job
  const applyForJob = (job: any) => {
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) {
          toast({
            title: 'Not signed in',
            description: 'Please sign in to apply for jobs',
            variant: 'destructive'
          });
          return;
        }

        const storedUser = localStorage.getItem('userData')
          ? JSON.parse(localStorage.getItem('userData') || '{}')
          : {};
        const resumeFileName = storedUser.resume_file_name;
        const resumeUrl = storedUser.resume_url;
        if (!resumeFileName && !resumeUrl) {
          toast({
            title: 'Resume required',
            description: 'Please upload your resume in your profile before applying.',
            variant: 'destructive'
          });
          return;
        }

        const employerEmail = job.employer_email;
        if (!employerEmail) {
          toast({
            title: 'Missing employer email',
            description: 'The employer has not provided a contact email yet.',
            variant: 'destructive'
          });
          return;
        }

        const certifications = Array.isArray(storedUser.certifications) ? storedUser.certifications : [];
        const certNames = certifications.map((cert: any) => cert.name).filter(Boolean);
        const applicantName = storedUser.firstName && storedUser.lastName
          ? `${storedUser.firstName} ${storedUser.lastName}`
          : (user.email || 'Applicant');
        const applicantEmail = user.email || storedUser.email || '';
        const applicantPhone = storedUser.phone || '';

        const subject = `Job Application: ${job.title}`;
        const bodyLines = [
          `Hello ${job.company},`,
          '',
          `I am applying for the ${job.title} role.`,
          '',
          `Applicant: ${applicantName}`,
          `Email: ${applicantEmail}`,
          applicantPhone ? `Phone: ${applicantPhone}` : '',
          resumeFileName ? `Resume: ${resumeFileName}` : 'Resume: Uploaded on profile',
          certNames.length ? `Certifications: ${certNames.join(', ')}` : 'Certifications: None listed',
          '',
          'Please let me know if you need any additional information.',
        ].filter(Boolean);
        const mailto = `mailto:${encodeURIComponent(employerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
        window.location.href = mailto;

        const rawNotices = localStorage.getItem('adminNotifications');
        const notices = rawNotices ? JSON.parse(rawNotices) : [];
        notices.unshift({
          id: `notice_${Date.now()}`,
          message: `Job application sent: ${job.title} by ${applicantEmail}`,
          created_at: Date.now(),
          read: false,
        });
        localStorage.setItem('adminNotifications', JSON.stringify(notices));

        toast({
          title: 'Application submitted',
          description: 'Your job application has been received.',
        });
      } catch (err: any) {
        toast({
          title: 'Application failed',
          description: err.message || 'Unable to submit application',
          variant: 'destructive'
        });
      }
    })();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-find-red text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find My Job</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Job discovery is on the way. We are curating verified opportunities across Malawi.
          </p>
        </div>
      </div>
      
      <AuthGuard message="Please sign in to browse and apply for jobs">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <aside className="space-y-4">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle>Your Search</CardTitle>
                  <CardDescription>Find jobs by title, company, or location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="job_search">Search</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="job_search"
                        placeholder="Search jobs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="job_location">Location</Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="job_location"
                        placeholder="City or region"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSearch} className="w-full bg-find-red hover:bg-red-700">
                    Find Jobs
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle>Your Skills</CardTitle>
                  <CardDescription>Add skills to improve job matching</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a qualification"
                      value={inputQualification}
                      onChange={(e) => setInputQualification(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addQualification()}
                    />
                    <Button onClick={addQualification}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userQualifications.map((qual, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                        <BookOpen size={14} className="mr-1" />
                        <span>{qual}</span>
                        <button
                          onClick={() => removeQualification(qual)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-find-red to-red-700 text-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Find My Job</h2>
                    <p className="text-sm text-red-100 mt-1">Explore opportunities tailored for you.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center h-12 w-12 bg-white/20 rounded-2xl">
                    <Briefcase className="text-white" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white/15 rounded-2xl p-3">
                    <p className="text-xs uppercase tracking-wide text-red-100">Total Jobs</p>
                    <p className="text-lg font-semibold">{jobs.length}</p>
                  </div>
                  <div className="bg-white/15 rounded-2xl p-3">
                    <p className="text-xs uppercase tracking-wide text-red-100">Matches</p>
                    <p className="text-lg font-semibold">{userQualifications.length ? 'Personalized' : 'All jobs'}</p>
                  </div>
                </div>
              </div>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Suggested Jobs</CardTitle>
                    <CardDescription>Top picks for you right now</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(jobs.slice(0, 3)).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={() => applyForJob(job)}
                      qualifications={userQualifications}
                    />
                  ))}
                  {jobs.length === 0 && (
                    <div className="text-center py-8">
                      <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">No jobs added by the administrator yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Jobs</CardTitle>
                      <CardDescription>Fresh openings added by employers</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jobCategories.map((category) => (
                      <Button
                        key={category}
                        variant={jobCategoryFilter === category ? 'default' : 'outline'}
                        size="sm"
                        className={jobCategoryFilter === category ? 'bg-find-red hover:bg-red-700' : ''}
                        onClick={() => setJobCategoryFilter(category)}
                      >
                        {category === 'all' ? 'All Categories' : category.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'full-time', 'part-time', 'contract'].map((type) => (
                      <Button
                        key={type}
                        variant={jobTypeFilter === type ? 'default' : 'outline'}
                        size="sm"
                        className={jobTypeFilter === type ? 'bg-find-red hover:bg-red-700' : ''}
                        onClick={() => setJobTypeFilter(type)}
                      >
                        {type === 'all' ? 'All' : type.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onApply={() => applyForJob(job)}
                        qualifications={userQualifications}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Briefcase size={48} className="mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium mb-2">No matching jobs found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your filters or skills.</p>
                      <Button onClick={() => setJobs(allJobs)}>
                        View All Jobs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AuthGuard>
      <Footer />
    </div>
  );
};

export default Jobs;
