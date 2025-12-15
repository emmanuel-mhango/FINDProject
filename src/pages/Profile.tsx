
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { User, UserRound, Briefcase, Home, Bell, Edit, Upload, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfileEditor from '@/components/ProfileEditor';
import ResumeUploader from '@/components/ResumeUploader';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState(() => {
    // Get user data from localStorage if available
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
    contactEmail: 'james.banda@student.unima.mw'
  });

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!userData) {
      navigate('/signin');
      toast({
        title: "Not logged in",
        description: "Please sign in to view your profile",
        variant: "destructive",
      });
    }
    
    // Load applied jobs from localStorage
    const appliedJobIds = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    if (appliedJobIds.length > 0) {
      // In a real application, we would fetch job details by IDs from a backend
      // Here we're just simulating this with static data
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
    // Save updated profile to localStorage
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
    // Clear user data from localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('userResume');
    localStorage.removeItem('appliedJobs');
    localStorage.removeItem('taxiBookings');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Navigate to home page
    navigate('/');
  };
  
  const calculateProfileCompletion = () => {
    if (!userData) return 0;
    
    let total = 0;
    let completed = 0;
    
    // Basic info
    const fields = ['firstName', 'lastName', 'email', 'phone', 'nationalId', 'bio'];
    fields.forEach(field => {
      total++;
      if (userData[field]) completed++;
    });
    
    // Profile picture
    total++;
    if (userData.profilePicture) completed++;
    
    // Resume
    total++;
    if (resumeData) completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                    {userData.profilePicture ? (
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={userData.profilePicture} alt={userData.firstName} />
                        <AvatarFallback>
                          <UserRound size={48} className="text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <UserRound size={48} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{userData.firstName} {userData.lastName}</h2>
                  <p className="text-gray-500">{userData.email}</p>
                  <p className="text-sm mt-1">ID: {userData.nationalId}</p>
                  
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 flex items-center"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit size={16} className="mr-1" /> Edit Profile
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4 mt-6">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                    <User size={18} className="mr-2" />
                    My Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/jobs')}>
                    <Briefcase size={18} className="mr-2" />
                    Job Applications
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/roommates')}>
                    <Home size={18} className="mr-2" />
                    Roommate
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell size={18} className="mr-2" />
                    Notifications
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start" 
                      onClick={handleLogout}
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {isEditing ? (
              <ProfileEditor 
                userData={userData} 
                onSave={handleSaveProfile} 
                onCancel={() => setIsEditing(false)} 
              />
            ) : (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="jobs">Job Applications</TabsTrigger>
                  <TabsTrigger value="roommate">Roommate</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Overview</CardTitle>
                      <CardDescription>A summary of your activity on FIND</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Profile Completion</span>
                            <span className="text-sm font-medium">{calculateProfileCompletion()}%</span>
                          </div>
                          <Progress value={calculateProfileCompletion()} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-gray-500">Job Applications</p>
                              <p className="text-2xl font-bold">{jobApplications.length}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-gray-500">Interviews</p>
                              <p className="text-2xl font-bold">{jobApplications.filter(j => j.status === 'Interview').length}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-gray-500">Taxi Rides</p>
                              <p className="text-2xl font-bold">5</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="jobs">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Job Applications</CardTitle>
                      <CardDescription>Track the status of your applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Position</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {jobApplications.length > 0 ? (
                            jobApplications.map((job) => (
                              <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.title}</TableCell>
                                <TableCell>{job.company}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    job.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                                    job.status === 'Interview' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {job.status}
                                  </span>
                                </TableCell>
                                <TableCell>{job.appliedDate}</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">View Details</Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                You haven't applied to any jobs yet.
                                <div className="mt-2">
                                  <Button size="sm" onClick={() => navigate('/jobs')}>
                                    Browse Jobs
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="roommate">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Roommate</CardTitle>
                      <CardDescription>Information about your roommate match</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentRoommate ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserRound size={32} className="text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">{currentRoommate.name}</h3>
                              <p className="text-sm text-gray-500">{currentRoommate.school} • {currentRoommate.program}</p>
                              <p className="text-sm text-gray-500">Year {currentRoommate.year}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-200">
                            <h4 className="font-medium mb-2">Contact Information</h4>
                            <p className="text-sm">{currentRoommate.contactEmail}</p>
                          </div>
                          
                          <div className="pt-4 flex space-x-2">
                            <Button>Message</Button>
                            <Button variant="outline">Request Change</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">You don't have a roommate match yet.</p>
                          <Button onClick={() => navigate('/roommates')}>Find Roommate</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="space-y-6">
                    <ResumeUploader 
                      onFileUploaded={(fileData, fileName) => handleResumeUpload(fileData, fileName)}
                      existingFileName={resumeData?.fileName}
                    />
                    
                    {resumeData && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Your Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded mr-3">
                                  <Upload size={18} className="text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{resumeData.fileName}</p>
                                  <p className="text-xs text-gray-500">Resume/CV • {new Date().toLocaleDateString()}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
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
