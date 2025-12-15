
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, MapPin, Clock, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface JobProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    qualifications: string[];
    description: string;
  };
  onApply: () => void;
  qualifications?: string[];
}

const JobCard = ({ job, onApply, qualifications = [] }: JobProps) => {
  const { toast } = useToast();
  const [hasApplied, setHasApplied] = useState(false);
  
  // Check if user has already applied for this job
  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setHasApplied(appliedJobs.includes(job.id));
  }, [job.id]);
  
  // Calculate match percentage based on user qualifications
  const calculateMatchPercentage = () => {
    if (!qualifications.length) return 0;
    
    let matchCount = 0;
    job.qualifications.forEach(jobQual => {
      qualifications.forEach(userQual => {
        if (jobQual.toLowerCase().includes(userQual.toLowerCase()) || 
            userQual.toLowerCase().includes(jobQual.toLowerCase())) {
          matchCount++;
          return;
        }
      });
    });
    
    return Math.min(100, Math.round((matchCount / job.qualifications.length) * 100));
  };
  
  const matchPercentage = calculateMatchPercentage();
  
  const handleApply = () => {
    if (hasApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this position",
        variant: "destructive",
      });
      return;
    }
    
    // Update applied jobs in localStorage
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    appliedJobs.push(job.id);
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
    
    setHasApplied(true);
    onApply();
    
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted",
    });
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="mt-1 bg-gray-100 p-3 rounded-md">
                <Briefcase className="h-6 w-6 text-find-red" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{job.title}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Building size={14} className="mr-1" />
                  <span className="text-sm">{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-sm">{job.location}</span>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span className="text-sm">{job.type}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600 text-sm">{job.description}</p>
            </div>
            
            <div className="mt-4">
              <p className="font-medium mb-1 text-sm">Required Qualifications:</p>
              <div className="flex flex-wrap gap-2">
                {job.qualifications.map((qual, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-2 py-1 rounded-full ${
                      qualifications.some(q => 
                        q.toLowerCase().includes(qual.toLowerCase()) || 
                        qual.toLowerCase().includes(q.toLowerCase())
                      ) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {qualifications.some(q => 
                      q.toLowerCase().includes(qual.toLowerCase()) || 
                      qual.toLowerCase().includes(q.toLowerCase())
                    ) && <Check size={12} className="inline mr-1" />}
                    {qual}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 md:text-right flex flex-col items-start md:items-end">
            <div className="mb-3">
              <span className="font-bold text-lg">{job.salary}</span>
              <p className="text-gray-500 text-xs">per month</p>
            </div>
            
            {qualifications.length > 0 && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm mb-3">
                <span className={matchPercentage > 70 ? 'text-green-600' : 'text-amber-600'}>
                  {matchPercentage}% match
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-gray-50 flex justify-end">
        <Button 
          onClick={handleApply} 
          disabled={hasApplied}
          className={hasApplied ? "bg-green-600" : ""}
        >
          {hasApplied ? "Applied ✓" : "Apply Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
