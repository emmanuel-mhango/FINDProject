import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";

const Roommates = () => {
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
