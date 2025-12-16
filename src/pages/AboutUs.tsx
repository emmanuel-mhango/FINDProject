import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Heart, Award, Mail, Phone, MapPin } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-white relative h-screen bg-cover bg-center"
        style ={ {
              backgroundImage: `url('about.jpg')`,
        }}>
            {/*Dark Overlay*/}
            <div className="absolute inset-0 bg-black opacity-70" z-0></div>

            {/*Hero section content*/}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full font-inter">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">About FIND</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
            Connecting students across Malawi with opportunities, transportation, and meaningful connections.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-find-red mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To empower Malawian students by providing a comprehensive platform that simplifies
              their daily challenges and connects them with opportunities for growth and success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Target className="w-12 h-12 mx-auto mb-4 text-find-red" />
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  To be the leading digital platform that transforms student life in Malawi,
                  making education and career development accessible to all.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 mx-auto mb-4 text-find-red" />
                <h3 className="text-xl font-bold mb-3">Our Values</h3>
                <p className="text-gray-600">
                  Integrity, innovation, inclusivity, and excellence in everything we do
                  to serve the Malawian student community.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 mx-auto mb-4 text-find-red" />
                <h3 className="text-xl font-bold mb-3">Our Impact</h3>
                <p className="text-gray-600">
                  Over 10,000 students connected, 5,000+ successful job placements,
                  and countless meaningful roommate connections made.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-find-red mb-8">Our Story</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg text-gray-700 mb-6">
                FIND was born from the real challenges faced by Malawian students. Our founders,
                themselves former students, experienced firsthand the difficulties of finding reliable
                transportation, suitable accommodation, and meaningful career opportunities.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                What started as a simple idea in 2023 has grown into Malawi's most comprehensive
                student platform. We understand the unique needs of students in our communities
                and are committed to providing solutions that make a real difference.
              </p>
              <p className="text-lg text-gray-700">
                Today, FIND continues to evolve, incorporating feedback from our users and adapting
                to the changing needs of Malawian students. Our commitment remains the same:
                to empower every student with the tools and connections they need to succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-find-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about FIND? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-find-red" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-300">info@find.mw</p>
            </div>

            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4 text-find-red" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-300">+265 884 813 904</p>
            </div>

            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-find-red" />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-300">Blantyre, Malawi</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;