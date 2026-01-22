import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { User, UserRound, Home, Bell, Edit, LogOut, Award, TrendingUp, MapPin, Calendar, Star, Clock, FileText, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageDialog from '@/components/MessageDialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ProfileEditor from '@/components/ProfileEditor';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

const Profile = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{ name: string; url: string } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [savedProperties, setSavedProperties] = useState([
    { id: 1, name: 'Modern 3-Bedroom Apartment', location: 'Lilongwe', price: 'MWK 45,000,000', status: 'Available', savedDate: '2025-05-08' },
    { id: 2, name: 'Spacious Family Home', location: 'Blantyre', price: 'MWK 65,000,000', status: 'Under Offer', savedDate: '2025-05-05' },
  ]);

  useEffect(() => {
    if (!userData) {
      setDialogOpen(true);
      const timer = setTimeout(() => {
        navigate('/signin');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (!userData) return;
    const pendingRaw = localStorage.getItem('pendingProfile');
    if (!pendingRaw) return;
    try {
      const pendingProfile = JSON.parse(pendingRaw);
      if (pendingProfile?.email && pendingProfile.email !== userData.email) {
        return;
      }
      const mergedUser = {
        ...userData,
        email: userData.email || pendingProfile.email,
        firstName: userData.firstName || pendingProfile.first_name || pendingProfile.firstName,
        lastName: userData.lastName || pendingProfile.last_name || pendingProfile.lastName,
        username: userData.username || pendingProfile.username,
      };
      localStorage.setItem('userData', JSON.stringify(mergedUser));
      setUserData(mergedUser);
    } catch (err) {
      console.error('Profile merge error:', err);
    }
  }, [userData]);

  const handleSaveProfile = (updatedData: any) => {
    localStorage.setItem('userData', JSON.stringify(updatedData));
    setUserData(updatedData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  const calculateProfileCompletion = () => {
    if (!userData) return 0;

    let total = 0;
    let completed = 0;

    const fields = ['firstName', 'lastName', 'email', 'phone', 'bio'];
    fields.forEach(field => {
      total++;
      if (userData[field]) completed++;
    });

    total++;
    if (userData.profilePicture) completed++;

    return Math.round((completed / total) * 100);
  };

  const resumeDocument = userData?.resume_url
    ? {
        name: userData.resume_file_name || 'Resume',
        type: 'Resume / CV',
        url: userData.resume_url,
      }
    : null;

  const certificationDocuments = Array.isArray(userData?.certifications)
    ? userData.certifications
    : [];

  const documents = [
    ...(resumeDocument ? [resumeDocument] : []),
    ...certificationDocuments.map((cert: any) => ({
      name: cert.name || 'Certification',
      type: 'Certification',
      url: cert.data,
    })),
  ];

  const handleViewCertificate = (doc: { name: string; url: string }) => {
    setSelectedCertificate(doc);
    setCertificateOpen(true);
  };

  const ComingSoonBadge = () => (
    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1 ml-2">
      <Clock size={12} /> Coming Soon
    </Badge>
  );

  if (!userData) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-white relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop')`,
        }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full font-inter">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">My Profile</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
            Manage your account, saved properties, and access FIND services.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 -mt-16 relative z-20">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-find-red to-red-600 p-1 mb-4">
                    {userData.profilePicture ? (
                      <Avatar className="h-full w-full">
                        <AvatarImage src={userData.profilePicture} alt={userData.firstName} />
                        <AvatarFallback className="bg-white">
                          <UserRound size={64} className="text-find-red" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-full w-full bg-white flex items-center justify-center rounded-full">
                        <UserRound size={64} className="text-find-red" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{userData.firstName} {userData.lastName}</h2>
                  <p className="text-gray-600 mb-4">{userData.email}</p>

                  {/* Profile Completion */}
                  <div className="w-full mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-bold text-find-red">{calculateProfileCompletion()}%</span>
                    </div>
                    <Progress value={calculateProfileCompletion()} className="h-2" />
                  </div>

                  {!isEditing && (
                    <Button
                      className="bg-find-red hover:bg-red-700 text-white"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit size={16} className="mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start hover:bg-gray-50" onClick={() => navigate('/profile')}>
                    <User size={18} className="mr-3" />
                    My Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gray-50" onClick={() => navigate('/homes')}>
                    <Home size={18} className="mr-3" />
                    FIND Homes
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gray-50 opacity-50 cursor-not-allowed" disabled>
                    <MapPin size={18} className="mr-3" />
                    FIND Taxi
                    <ComingSoonBadge />
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gray-50 opacity-50 cursor-not-allowed" disabled>
                    <Briefcase size={18} className="mr-3" />
                    FIND Jobs
                    <ComingSoonBadge />
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gray-50 opacity-50 cursor-not-allowed" disabled>
                    <Users size={18} className="mr-3" />
                    FIND Roommate
                    <ComingSoonBadge />
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                    <Bell size={18} className="mr-3" />
                    Notifications
                  </Button>

                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} className="mr-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {isEditing ? (
              <ProfileEditor
                userData={userData}
                onSave={handleSaveProfile}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 bg-white shadow-sm">
                  <TabsTrigger value="overview" className="px-6">Overview</TabsTrigger>
                  <TabsTrigger value="homes" className="px-6">FIND Homes</TabsTrigger>
                  <TabsTrigger value="settings" className="px-6">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Welcome Card */}
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-find-red/10 p-3 rounded-full">
                          <Star className="w-6 h-6 text-find-red" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Welcome back, {userData.firstName}!</h3>
                          <p className="text-gray-600">Discover your perfect home on FIND Homes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                          <Home className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{savedProperties.length}</p>
                        <p className="text-sm text-gray-600">Saved Properties</p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {savedProperties.filter(p => p.status === 'Available').length} Available
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                          <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{calculateProfileCompletion()}%</p>
                        <p className="text-sm text-gray-600">Profile Complete</p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            Complete your profile
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Documents */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-find-red" />
                        Documents
                      </CardTitle>
                      <CardDescription>Resume and certifications saved on your profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {documents.length > 0 ? (
                        <div className="space-y-3">
                          {documents.map((doc: any, index: number) => (
                            <div
                              key={`${doc.name}-${index}`}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-200 rounded-xl p-4 bg-white"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-find-red" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{doc.name}</p>
                                  <p className="text-xs text-gray-500">{doc.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.type === 'Certification' ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewCertificate({ name: doc.name, url: doc.url })}
                                  >
                                    View
                                  </Button>
                                ) : (
                                  <Button asChild variant="outline" size="sm">
                                    <a href={doc.url} target="_blank" rel="noreferrer">
                                      View
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Upload your resume or certifications to see them here.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Coming Soon Services */}
                  <Card className="border-0 shadow-lg border-l-4 border-l-yellow-400">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                        Upcoming Services
                      </CardTitle>
                      <CardDescription>More FIND services coming soon</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center mb-2">
                            <MapPin className="w-5 h-5 text-yellow-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">FIND Taxi</h4>
                          </div>
                          <p className="text-sm text-gray-600">Book reliable taxi services and calculate transport costs</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center mb-2">
                            <Briefcase className="w-5 h-5 text-yellow-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">FIND Jobs</h4>
                          </div>
                          <p className="text-sm text-gray-600">Discover job opportunities and connect with employers</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center mb-2">
                            <Users className="w-5 h-5 text-yellow-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">FIND Roommate</h4>
                          </div>
                          <p className="text-sm text-gray-600">Find compatible roommates and perfect accommodation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-find-red" />
                        Your Activity
                      </CardTitle>
                      <CardDescription>Your recent interactions on FIND</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {savedProperties.length > 0 ? (
                          savedProperties.slice(0, 3).map((property) => (
                            <div key={property.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Home className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{property.name}</p>
                                <p className="text-sm text-gray-600">{property.location} - {property.price}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant={property.status === 'Available' ? 'default' : 'secondary'} className="text-xs">
                                  {property.status}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">{property.savedDate}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No saved properties yet</p>
                            <Button size="sm" onClick={() => navigate('/homes')} className="bg-find-red hover:bg-red-700">
                              Browse Properties
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="homes">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Home className="w-5 h-5 mr-2 text-find-red" />
                        Your Saved Properties
                      </CardTitle>
                      <CardDescription>Properties you've saved for later viewing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-200">
                            <TableHead className="font-semibold text-gray-900">Property Name</TableHead>
                            <TableHead className="font-semibold text-gray-900">Location</TableHead>
                            <TableHead className="font-semibold text-gray-900">Price</TableHead>
                            <TableHead className="font-semibold text-gray-900">Status</TableHead>
                            <TableHead className="font-semibold text-gray-900">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {savedProperties.length > 0 ? (
                            savedProperties.map((property) => (
                              <TableRow key={property.id} className="border-gray-100 hover:bg-gray-50">
                                <TableCell className="font-medium text-gray-900">{property.name}</TableCell>
                                <TableCell className="text-gray-700">{property.location}</TableCell>
                                <TableCell className="text-gray-700 font-semibold">{property.price}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={property.status === 'Available' ? 'default' : 'secondary'}
                                    className={property.status === 'Available' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                                  >
                                    {property.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" className="hover:bg-find-red hover:text-white hover:border-find-red">
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-12">
                                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
                                <p className="text-gray-500 mb-6">Start exploring properties and save your favorites</p>
                                <Button onClick={() => navigate('/homes')} className="bg-find-red hover:bg-red-700">
                                  Explore Properties
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                        <p className="text-gray-600">{userData.email}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Member Since</h4>
                        <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <MessageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Not Logged In"
        description="Please sign in to view your profile. Redirecting to sign in page..."
        actionLabel="OK"
        onConfirm={() => navigate('/signin')}
      />

      <AlertDialog open={certificateOpen} onOpenChange={setCertificateOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedCertificate?.name || 'Certificate'}</AlertDialogTitle>
          </AlertDialogHeader>
          {selectedCertificate?.url ? (
            <div className="mt-2">
              <iframe
                src={selectedCertificate.url}
                title={selectedCertificate.name}
                className="w-full h-[70vh] rounded-md border border-gray-200"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600">Certificate preview not available.</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            {selectedCertificate?.url && (
              <AlertDialogAction asChild className="bg-find-red hover:bg-red-700">
                <a href={selectedCertificate.url} target="_blank" rel="noreferrer">
                  Open in new tab
                </a>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
