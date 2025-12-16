import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const MeetOurTeam = () => {
  const teamMembers = [
    {
      name: "Travor Bobby",
      role: "Marketing Director",
      bio: "Skilled in promoting our platform and engaging with the student community.",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      twitter: "#",
      github: "#",
      email: "travor@find.mw"
    },{
      name: "Emmanuel Mhango",
      role: "CTO, Graphic Designer",
      bio: "Passionate about creating intuitive user experiences and visually appealing designs.",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      twitter: "#",
      github: "#",
      email: "emmanuelmhango@find.mw"
    },
    {
      name: "Victor Balawe",
      role: "Lead Backend Developer",
      bio: "Expert in building robust and scalable backend systems to power seamless applications.",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      twitter: "#",
      github: "#",
      email: "balawevictor@find.mw"
    },
    
    {
      name: "Jabulan Cyber",
      role: "Software Engineer",
      bio: "Building reliable and efficient software solutions to meet user needs.",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      twitter: "#",
      github: "#",
      email: "jabulancyber@find.mw"
    },
    {
      name: "Joel Ndege",
      role: "Cybersecurity Specialist",
      bio: "Protecting our platform and users with top-notch security measures.",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      twitter: "#",
      github: "#",
      email: "Joelndege@find.mw"
    },
    {
      name: "This position is needed anyway",
      role: "Customer Success Lead",
      bio: "Ensuring every student has a great experience using our platform.",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      twitter: "#",
      github: "#",
      email: "@find.mw"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-white relative h-screen bg-cover bg-center"
        style ={ {
              backgroundImage: `url('team.jpg')`,
        }}>
            {/*Dark Overlay*/}
            <div className="absolute inset-0 bg-black opacity-70" z-0></div>

            {/*Hero section content*/}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full font-inter">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">Meet Our Team</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
            The passionate individuals behind FIND, working to transform student life in Malawi.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-find-red mb-6">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated professionals who are committed to making FIND the best
              platform for Malawian students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>

                  <div className="flex justify-center space-x-3">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-find-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for
            education and technology. Help us build the future of student services in Malawi.
          </p>
          <Button size="lg" className="bg-find-red hover:bg-red-700">
            View Open Positions
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MeetOurTeam;