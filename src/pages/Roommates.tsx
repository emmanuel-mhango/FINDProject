<<<<<<< HEAD
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
import { malawianRoommates } from '@/data/roommateData';
import { malawianUniversities } from '@/data/universities';
import { useToast } from '@/components/ui/use-toast';


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
      alert("Please select your school");
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

=======
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";

const Roommates = () => {
>>>>>>> 1b3c63b92c39c8d5afacdc8bccc31dbfcc8a362e
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-find-red text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find My Roommate</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Roommate matching is coming soon. We are building trusted student profiles and campus support.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        <Card className="border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-find-red" />
              Coming soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <p>
              FIND Roommates will help students connect with safe, compatible roommates based on university,
              lifestyle, and study preferences.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              We are finalizing matching tools and safety verification.
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Roommates;
