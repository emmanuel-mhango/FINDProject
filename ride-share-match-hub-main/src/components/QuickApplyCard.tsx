
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const QuickApplyCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [showQualificationsDialog, setShowQualificationsDialog] = useState(false);
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApplyNow = () => {
    if (!jobTitle || !location) {
      toast({
        title: "Error",
        description: "Please enter both job title and location",
        variant: "destructive",
      });
      return;
    }
    
    setSearching(true);
    
    // Simulate job search with timeout
    setTimeout(() => {
      setSearching(false);
      setShowQualificationsDialog(true);
    }, 1500);
  };
  
  const handleSubmitQualifications = () => {
    if (!education || !skills) {
      toast({
        title: "Error",
        description: "Please enter your education and skills",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate application submission
    setTimeout(() => {
      setSubmitting(false);
      setShowQualificationsDialog(false);
      
      // Clear form
      setJobTitle('');
      setLocation('');
      setEducation('');
      setExperience('');
      setSkills('');
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully. We'll be in touch soon!",
        duration: 5000,
      });
      
      // Navigate to jobs page after successful application
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    }, 2000);
  };

  return (
    <>
      <Card className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all">
        <h3 className="text-xl font-bold mb-6">Quick Apply</h3>
        <div className="space-y-4">
          <Input 
            placeholder="Job Title" 
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Input 
            placeholder="Your Location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button 
            className="action-button w-full"
            onClick={handleApplyNow}
            disabled={searching}
          >
            {searching ? "Searching Jobs..." : "Apply Now"}
          </Button>
        </div>
      </Card>
      
      {/* Qualifications Dialog */}
      <Dialog open={showQualificationsDialog} onOpenChange={setShowQualificationsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Job Application</DialogTitle>
            <DialogDescription>
              Please provide your qualifications for <strong>{jobTitle}</strong> in {location}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              <Select onValueChange={setEducation} value={education}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your highest education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School Diploma</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD or Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select onValueChange={setExperience} value={experience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills</Label>
              <Textarea 
                id="skills"
                placeholder="List your skills relevant to this position"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowQualificationsDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitQualifications}
              disabled={submitting}
              className="action-button"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickApplyCard;
