
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Briefcase, Search, BookOpen, MapPin, Building, Check } from 'lucide-react';
import JobCard from '@/components/JobCard';
import { useToast } from '@/components/ui/use-toast';

// Sample job data
const availableJobs = [
  {
    id: 1,
    title: "Software Developer",
    company: "Tech Innovations",
    location: "Lilongwe",
    type: "Full-time",
    salary: "K1,200,000 - K1,500,000",
    qualifications: ["Computer Science", "Programming", "JavaScript"],
    description: "Seeking an experienced software developer to join our team to build innovative solutions for our clients.",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Data Insights Ltd",
    location: "Blantyre",
    type: "Full-time",
    salary: "K900,000 - K1,200,000",
    qualifications: ["Statistics", "Data Analysis", "Excel"],
    description: "Looking for a detail-oriented data analyst to interpret complex data sets and provide business insights.",
  },
  {
    id: 3,
    title: "Marketing Assistant",
    company: "Creative Marketing Agency",
    location: "Mzuzu",
    type: "Part-time",
    salary: "K600,000 - K750,000",
    qualifications: ["Marketing", "Communication", "Social Media"],
    description: "Entry-level position for a creative individual to assist with marketing campaigns and social media management.",
  },
  {
    id: 4,
    title: "Financial Accountant",
    company: "Global Finance Group",
    location: "Lilongwe",
    type: "Full-time",
    salary: "K1,300,000 - K1,700,000",
    qualifications: ["Accounting", "Finance", "ACCA"],
    description: "Experienced accountant needed to manage financial reporting and analysis for our multinational clients.",
  },
  {
    id: 5,
    title: "Electrical Engineer",
    company: "Power Solutions",
    location: "Blantyre",
    type: "Contract",
    salary: "K1,500,000 - K1,900,000",
    qualifications: ["Electrical Engineering", "Circuit Design", "AutoCAD"],
    description: "Seeking a qualified electrical engineer to work on power distribution and renewable energy projects.",
  }
];

const Jobs = () => {
  const { toast } = useToast();
  const [userQualifications, setUserQualifications] = useState<string[]>([]);
  const [inputQualification, setInputQualification] = useState("");
  const [jobs, setJobs] = useState(availableJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  // Get user data if available
  const userData = localStorage.getItem('userData') ? 
    JSON.parse(localStorage.getItem('userData') || '{}') : null;

  // Filter jobs based on user qualifications
  useEffect(() => {
    if (userQualifications.length > 0) {
      const filteredJobs = availableJobs.filter(job => {
        return job.qualifications.some(qual => 
          userQualifications.some(userQual => 
            userQual.toLowerCase().includes(qual.toLowerCase()) || 
            qual.toLowerCase().includes(userQual.toLowerCase())
          )
        );
      });
      
      setJobs(filteredJobs.length > 0 ? filteredJobs : availableJobs);
    } else {
      setJobs(availableJobs);
    }
  }, [userQualifications]);

  // Handle search and filtering
  const handleSearch = () => {
    let filtered = [...availableJobs];
    
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

  // Apply for a job
  const applyForJob = (jobId: number) => {
    toast({
      title: "Application submitted",
      description: "Your job application has been received.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-find-red text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Discover opportunities that match your qualifications and career goals
          </p>
        </div>
      </div>
      
      <AuthGuard message="Please sign in to browse and apply for jobs">
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filters Panel */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Qualifications</CardTitle>
                <CardDescription>
                  Add your skills and qualifications to find matching jobs
                </CardDescription>
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
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {userQualifications.map((qual, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                      <BookOpen size={14} className="mr-1" />
                      <span>{qual}</span>
                      <button 
                        onClick={() => removeQualification(qual)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <p className="font-medium mb-2">Search</p>
                  <Input 
                    placeholder="Job title or keywords" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={18} className="text-gray-400" />
                    <Input 
                      placeholder="Location" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="w-full mt-2"
                  >
                    <Search size={18} className="mr-2" />
                    Find Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Job Listings */}
          <div className="md:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Available Jobs ({jobs.length})</h2>
              <div className="text-sm text-gray-500">
                Showing jobs matching your profile
              </div>
            </div>
            
            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={() => applyForJob(job.id)}
                    qualifications={userQualifications}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <Briefcase size={48} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">No matching jobs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or adding different qualifications.</p>
                  <Button onClick={() => setJobs(availableJobs)}>
                    View All Jobs
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </AuthGuard>
      <Footer />
    </div>
  );
};

export default Jobs;
