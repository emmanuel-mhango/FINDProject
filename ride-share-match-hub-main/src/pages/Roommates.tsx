import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Home, UserRound, School, Search, MessageCircle, Info, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { malawianRoommates } from '@/data/roommateData';
import { malawianUniversities } from '@/data/universities';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Roommates = () => {
  const { toast } = useToast();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState<any>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const { university, gender } = JSON.parse(userData);
      if (university) setSelectedSchool(university);
      if (gender) setSelectedGender(gender);
    }
  }, []);
  
  const findRoommates = () => {
    if (!selectedSchool) {
      toast({ title: "School required", description: "Please select your school", variant: "destructive" });
      return;
    }
    if (!selectedGender) {
      toast({ title: "Gender required", description: "Please select your gender", variant: "destructive" });
      return;
    }
    if (!selectedProgram) {
      toast({ title: "Program required", description: "Please select your program", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const allRoommates = malawianRoommates[selectedSchool as keyof typeof malawianRoommates] || [];
      const matchingRoommates = allRoommates.filter(roommate => {
        const genderMatch = roommate.gender === selectedGender;
        const programMatch = roommate.program.toLowerCase().includes(selectedProgram.toLowerCase()) ||
                            selectedProgram.toLowerCase().includes(roommate.program.toLowerCase());
        return genderMatch && programMatch;
      });
      
      setMatches(matchingRoommates);
      setHasSearched(true);
      setLoading(false);
      
      toast({
        title: "Search complete",
        description: `Found ${matchingRoommates.length} potential roommates`,
      });
    }, 1500);
  };
  
  const requestRoommate = (roommateId: number) => {
    toast({
      title: "Request sent",
      description: "Your roommate request has been sent.",
    });
  };
  
  const openContactDialog = (roommate: any) => {
    setSelectedRoommate(roommate);
    setContactDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col mystical-gradient">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent"></div>
        <div className="relative container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Find Your Roommate</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            Connect with fellow students who share your academic interests
          </p>
        </div>
      </div>
      
      <AuthGuard message="Please sign in to access roommate matching">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Find Roommate
                  </CardTitle>
                  <CardDescription>Enter your details to find compatible roommates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">School</label>
                    <Select onValueChange={setSelectedSchool} value={selectedSchool}>
                      <SelectTrigger className="rounded-xl bg-secondary/50">
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border shadow-lg rounded-xl max-h-60">
                        {malawianUniversities.map((university) => (
                          <SelectItem key={university.value} value={university.value}>
                            {university.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <Select onValueChange={setSelectedGender} value={selectedGender}>
                      <SelectTrigger className="rounded-xl bg-secondary/50">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border shadow-lg rounded-xl">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Program of Study</label>
                    <Input 
                      placeholder="e.g., Computer Science" 
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="rounded-xl bg-secondary/50"
                    />
                  </div>
                  
                  <Button 
                    onClick={findRoommates}
                    className="w-full mt-4 rounded-xl"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Find Matches"}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {!hasSearched ? (
                <div className="h-full flex items-center justify-center p-12 text-center">
                  <div>
                    <Home size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">Find Your Perfect Roommate</h3>
                    <p className="text-muted-foreground">Select your school and program to find matches</p>
                  </div>
                </div>
              ) : matches.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Potential Roommates ({matches.length})</h2>
                  {matches.map((roommate) => (
                    <Card key={roommate.id} className="glass-card border-0">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarFallback className="bg-primary/20">
                                {roommate.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{roommate.name}</h3>
                              <p className="text-sm text-muted-foreground">{roommate.program}, Year {roommate.year}</p>
                              <p className="text-xs text-muted-foreground">{roommate.phone}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => openContactDialog(roommate)}>
                              <Phone size={14} className="mr-1" /> Contact
                            </Button>
                            <Button size="sm" className="rounded-xl" onClick={() => requestRoommate(roommate.id)}>
                              <MessageCircle size={14} className="mr-1" /> Request
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 text-center">
                  <div>
                    <Home size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">No Matches Found</h3>
                    <Button onClick={() => setHasSearched(false)} className="rounded-xl">Try Again</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AuthGuard>
      
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="glass-card border-0 rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription>Reach out to {selectedRoommate?.name}</DialogDescription>
          </DialogHeader>
          {selectedRoommate && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Phone size={18} className="text-primary" />
                <span>{selectedRoommate.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Mail size={18} className="text-accent" />
                <span>{selectedRoommate.regNumber}@student.edu.mw</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)} className="rounded-xl">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Roommates;