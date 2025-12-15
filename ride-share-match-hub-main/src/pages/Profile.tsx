
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { User, UserRound, Briefcase, Home, Bell, Edit, Upload, Settings, LogOut, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfileEditor from '@/components/ProfileEditor';
import ResumeUploader from '@/components/ResumeUploader';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState<{fileData: string; fileName: string} | null>(() => {
    const savedResume = localStorage.getItem('userResume');
    return savedResume ? JSON.parse(savedResume) : null;
  });
  
  const [jobApplications, setJobApplications] = useState([
    { id: 1, title: 'Software Developer', company: 'Tech Solutions', status: 'In Review', appliedDate: '2025-05-08' },
    { id: 2, title: 'Data Analyst', company: 'Data Insights Ltd', status: 'Interview', appliedDate: '2025-05-05' },
  ]);
  
  const [currentRoommate, setCurrentRoommate] = useState({
    name: 'James Banda',
    school: 'UNIMA',
    program: 'Computer Science',
    year: '3',
    contactEmail: 'james.banda@student.unima.mw',
    phone: '+265 991 234 567'
  });

  useEffect(() => {
    if (!userData) {
      navigate('/signin');
      toast({
        title: "Not logged in",
        description: "Please sign in to view your profile",
        variant: "destructive",
      });
    }
    
    const appliedJobIds = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    if (appliedJobIds.length > 0) {
      const mockJobApplications = appliedJobIds.map((id: number) => {
        return {
          id,
          title: `Job Position ${id}`,
          company: `Company ${id}`,
          status: Math.random() > 0.5 ? 'In Review' : 'Application Received',
          appliedDate: new Date().toISOString().split('T')[0]
        };
      });
      
      setJobApplications(prevApps => {
        const existingIds = new Set(prevApps.map(app => app.id));
        const newApps = mockJobApplications.filter(app => !existingIds.has(app.id));
        return [...prevApps, ...newApps];
      });
    }
  }, [userData, navigate, toast]);

  const handleSaveProfile = (updatedData: any) => {
    localStorage.setItem('userData', JSON.stringify(updatedData));
    setUserData(updatedData);
    setIsEditing(false);
  };
  
  const handleResumeUpload = (fileData: string, fileName: string) => {
    if (!fileData || !fileName) {
      setResumeData(null);
      localStorage.removeItem('userResume');
      return;
    }
    
    const resumeInfo = { fileData, fileName };
    localStorage.setItem('userResume', JSON.stringify(resumeInfo));
    setResumeData(resumeInfo);
    
    toast({
      title: "Resume Uploaded",
      description: "Your resume has been saved to your profile",
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userResume');
    sessionStorage.removeItem('app_initialized');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };
  
  const calculateProfileCompletion = () => {
    if (!userData) return 0;
    
    let total = 0;
    let completed = 0;
    
    const fields = ['firstName', 'lastName', 'email', 'phone', 'nationalId', 'bio'];
    fields.forEach(field => {
      total++;
      if (userData[field]) completed++;
    });
    
    total++;
    if (userData.profilePicture) completed++;
    
    total++;
    if (resumeData) completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen flex flex-col mystical-gradient">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Modern Sidebar */}
          <div className="w-full lg:w-80">
            <Card className="glass-card border-0 overflow-hidden">
              {/* Profile Header with Gradient */}
              <div className="h-24 bg-gradient-to-br from-primary via-primary/80 to-accent relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-card shadow-elevated">
                      {userData.profilePicture ? (
                        <AvatarImage src={userData.profilePicture} alt={userData.firstName} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-secondary to-muted text-2xl font-bold">
                          {userData.firstName?.[0]}{userData.lastName?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Edit size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-16 pb-6 text-center">
                <h2 className="text-xl font-bold text-foreground">{userData.firstName} {userData.lastName}</h2>
                <p className="text-muted-foreground text-sm mt-1">{userData.email}</p>
                {userData.nationalId && (
                  <p className="text-xs text-muted-foreground/70 mt-1">ID: {userData.nationalId}</p>
                )}
                
                {/* Profile Completion */}
                <div className="mt-6 px-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="font-semibold text-primary">{calculateProfileCompletion()}%</span>
                  </div>
                  <Progress value={calculateProfileCompletion()} className="h-2 bg-secondary" />
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <div className="p-3 rounded-2xl bg-secondary/50">
                    <p className="text-2xl font-bold text-primary">{jobApplications.length}</p>
                    <p className="text-xs text-muted-foreground">Jobs</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-secondary/50">
                    <p className="text-2xl font-bold text-accent">{jobApplications.filter(j => j.status === 'Interview').length}</p>
                    <p className="text-xs text-muted-foreground">Interviews</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-secondary/50">
                    <p className="text-2xl font-bold text-foreground">5</p>
                    <p className="text-xs text-muted-foreground">Rides</p>
                  </div>
                </div>
              </CardContent>
              
              {/* Navigation */}
              <div className="px-4 pb-4 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl hover:bg-secondary/80 transition-colors"
                  onClick={() => navigate('/jobs')}
                >
                  <Briefcase size={18} className="mr-3 text-primary" />
                  Browse Jobs
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl hover:bg-secondary/80 transition-colors"
                  onClick={() => navigate('/roommates')}
                >
                  <Home size={18} className="mr-3 text-accent" />
                  Find Roommate
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  <Bell size={18} className="mr-3 text-muted-foreground" />
                  Notifications
                </Button>
                <div className="border-t border-border/50 my-2"></div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-3" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {isEditing ? (
              <ProfileEditor 
                userData={userData} 
                onSave={handleSaveProfile} 
                onCancel={() => setIsEditing(false)} 
              />
            ) : (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 p-1 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
                  <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Overview</TabsTrigger>
                  <TabsTrigger value="jobs" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Applications</TabsTrigger>
                  <TabsTrigger value="roommate" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Roommate</TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 animate-fade-in">
                  <Card className="glass-card border-0">
                    <CardHeader>
                      <CardTitle className="text-xl">Welcome back, {userData.firstName}!</CardTitle>
                      <CardDescription>Here's what's happening with your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/20">
                              <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold text-foreground">{jobApplications.length}</p>
                              <p className="text-sm text-muted-foreground">Active Applications</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-accent/20">
                              <Home className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold text-foreground">1</p>
                              <p className="text-sm text-muted-foreground">Roommate Match</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="jobs" className="animate-fade-in">
                  <Card className="glass-card border-0">
                    <CardHeader>
                      <CardTitle>Your Applications</CardTitle>
                      <CardDescription>Track the status of your job applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {jobApplications.length > 0 ? (
                          jobApplications.map((job) => (
                            <div key={job.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                                  <p className="text-sm text-muted-foreground">{job.company}</p>
                                  <p className="text-xs text-muted-foreground/70 mt-1">Applied: {job.appliedDate}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                    job.status === 'In Review' ? 'bg-amber-500/20 text-amber-600' :
                                    job.status === 'Interview' ? 'bg-emerald-500/20 text-emerald-600' :
                                    'bg-secondary text-muted-foreground'
                                  }`}>
                                    {job.status}
                                  </span>
                                  <Button variant="outline" size="sm" className="rounded-xl">View</Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Briefcase size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground mb-4">No applications yet</p>
                            <Button onClick={() => navigate('/jobs')} className="rounded-xl">
                              Browse Jobs
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="roommate" className="animate-fade-in">
                  <Card className="glass-card border-0">
                    <CardHeader>
                      <CardTitle>Your Roommate</CardTitle>
                      <CardDescription>Your current roommate match</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentRoommate ? (
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <Avatar className="h-20 w-20 border-2 border-accent/30">
                              <AvatarFallback className="bg-accent/20 text-accent text-xl font-bold">
                                {currentRoommate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-foreground">{currentRoommate.name}</h3>
                              <p className="text-muted-foreground">{currentRoommate.school} • {currentRoommate.program}</p>
                              <p className="text-sm text-muted-foreground/70">Year {currentRoommate.year}</p>
                              
                              <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail size={14} />
                                  {currentRoommate.contactEmail}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone size={14} />
                                  {currentRoommate.phone}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-6">
                            <Button className="rounded-xl flex-1 sm:flex-none">Message</Button>
                            <Button variant="outline" className="rounded-xl flex-1 sm:flex-none">Request Change</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Home size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                          <p className="text-muted-foreground mb-4">No roommate match yet</p>
                          <Button onClick={() => navigate('/roommates')} className="rounded-xl">
                            Find Roommate
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documents" className="animate-fade-in">
                  <div className="space-y-6">
                    <ResumeUploader 
                      onFileUploaded={(fileData, fileName) => handleResumeUpload(fileData, fileName)}
                      existingFileName={resumeData?.fileName}
                    />
                    
                    {resumeData && (
                      <Card className="glass-card border-0">
                        <CardHeader>
                          <CardTitle className="text-lg">Your Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-accent/20">
                                <Upload size={20} className="text-accent" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{resumeData.fileName}</p>
                                <p className="text-xs text-muted-foreground">Resume/CV • {new Date().toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-xl">View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
