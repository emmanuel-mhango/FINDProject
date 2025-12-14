
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, UserRound, School, Search, MessageCircle, Info, Phone } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { malawianRoommates } from '@/data/roommateData';
import { malawianUniversities } from '@/data/universities';


const Roommates = () => {
  const { toast } = useToast();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get user data from stored user data if available
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const { university, gender } = JSON.parse(userData);
      if (university) {
        setSelectedSchool(university);
      }
      if (gender) {
        setSelectedGender(gender);
      }
    }
  }, []);
  
  // Find matching roommates
  const findRoommates = () => {
    if (!selectedSchool) {
      toast({
        title: "School required",
        description: "Please select your school",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedGender) {
      toast({
        title: "Gender required",
        description: "Please select your gender",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedProgram) {
      toast({
        title: "Program required",
        description: "Please select your program of study",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const allRoommates = malawianRoommates[selectedSchool as keyof typeof malawianRoommates] || [];
      
      // Find roommates with matching gender and program
      const matchingRoommates = allRoommates.filter(roommate => {
        // Match by gender (same gender)
        const genderMatch = roommate.gender === selectedGender;
        
        // Match by program (same or similar program)
        const programMatch = roommate.program.toLowerCase().includes(selectedProgram.toLowerCase()) ||
                            selectedProgram.toLowerCase().includes(roommate.program.toLowerCase());
        
        return genderMatch && programMatch;
      });
      
      setMatches(matchingRoommates);
      setHasSearched(true);
      setLoading(false);
      
      toast({
        title: "Roommate search complete",
        description: `Found ${matchingRoommates.length} potential roommates`,
      });
    }, 1500);
  };
  
  const requestRoommate = (roommateId: number) => {
    toast({
      title: "Request sent",
      description: "Your roommate request has been sent. You'll be notified when they respond.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-find-red text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Roommate</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Connect with fellow students who share your academic interests and lifestyle
          </p>
        </div>
      </div>
      
      <AuthGuard message="Please sign in to access roommate matching">
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Find Roommate</CardTitle>
                <CardDescription>
                  Enter your details to find compatible roommates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">School</label>
                  <Select onValueChange={setSelectedSchool} value={selectedSchool}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg max-h-60">
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Public Universities</div>
                      {malawianUniversities
                        .filter(uni => uni.type === "Public")
                        .map((university) => (
                          <SelectItem key={university.value} value={university.value}>
                            {university.label}
                          </SelectItem>
                        ))}
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">Private Universities</div>
                      {malawianUniversities
                        .filter(uni => uni.type === "Private")
                        .map((university) => (
                          <SelectItem key={university.value} value={university.value}>
                            {university.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <Select onValueChange={setSelectedGender} value={selectedGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Program of Study</label>
                  <Input 
                    placeholder="e.g., Computer Science, Business, Medicine" 
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll match you with students in similar programs
                  </p>
                </div>
                
                <Button 
                  onClick={findRoommates}
                  className="w-full mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                      Searching...
                    </span>
                  ) : (
                    <>
                      <Search size={18} className="mr-2" />
                      Find Matches
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Why Use Roommate Matching?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <School size={16} className="text-green-600" />
                  </div>
                  <p>Match with students in the same program for shared academic interests</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Home size={16} className="text-blue-600" />
                  </div>
                  <p>Find compatible living arrangements based on preferences</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-3">
                    <Info size={16} className="text-amber-600" />
                  </div>
                  <p>All users are verified students for your safety</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Panel */}
          <div className="md:col-span-2">
            {!hasSearched ? (
              <div className="h-full flex items-center justify-center p-10 text-center">
                <div>
                  <Home size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Find Your Perfect Roommate</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Select your school and enter your registration number to find compatible roommates
                  </p>
                </div>
              </div>
            ) : matches.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Potential Roommates ({matches.length})</h2>
                <div className="space-y-4">
                  {matches.map((roommate) => (
                    <Card key={roommate.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                              <UserRound className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">{roommate.name}</h3>
                              <p className="text-sm text-gray-500">{roommate.gender} • {roommate.program}, Year {roommate.year}</p>
                              <p className="text-xs text-gray-400">{roommate.regNumber}</p>
                              <div className="flex items-center mt-1">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                <p className="text-xs text-gray-400">{roommate.phone}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 md:mt-0">
                            <div className="flex gap-2 mr-4">
                              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Program Match
                              </div>
                              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Gender Match
                              </div>
                            </div>
                            <Button size="sm" onClick={() => requestRoommate(roommate.id)}>
                              <MessageCircle size={16} className="mr-1" />
                              Request
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-10 text-center">
                <div>
                  <Home size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Matches Found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-4">
                    We couldn't find any roommates matching your program. Try a different school or registration number.
                  </p>
                  <Button onClick={() => setHasSearched(false)}>Try Again</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </AuthGuard>
      <Footer />
    </div>
  );
};

export default Roommates;
