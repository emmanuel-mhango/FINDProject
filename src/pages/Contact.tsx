import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="footer-background text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            We are here to help with FIND Homes, Taxi, and Jobs questions.
          </p>
        </div>
      </section>

      <section className="flex-1 py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-find-red" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="font-medium text-find-dark">+265 884 813 904</p>
                <p className="text-sm mt-2">Mon - Fri, 8:00 AM - 5:00 PM</p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-find-red" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="font-medium text-find-dark">emmanuelmhango25@gmail.com</p>
                <p className="text-sm mt-2">We respond within 24 hours.</p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-find-red" />
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="font-medium text-find-dark">+265 884 813 904</p>
                <p className="text-sm mt-2">Chat with us for quick support.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
