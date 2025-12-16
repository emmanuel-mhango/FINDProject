import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "What is FIND?",
      answer: "FIND is Malawi's premier student platform that connects students with transportation, job opportunities, and compatible roommates. We provide a comprehensive solution for all student needs in one convenient place."
    },
    {
      question: "How do I book a taxi?",
      answer: "To book a taxi, simply sign in to your account, navigate to the taxi booking section, select your pickup and destination locations, choose the number of passengers, and complete the booking. You'll receive a confirmation with your booking details."
    },
    {
      question: "Is taxi booking available in all Malawian cities?",
      answer: "Currently, our taxi booking service is available in major Malawian cities including Lilongwe, Blantyre, Zomba, and Mzuzu. We're continuously expanding our coverage to serve more locations."
    },
    {
      question: "How do I find a roommate?",
      answer: "Use our roommate matching feature by creating a profile and specifying your preferences. Our algorithm will match you with compatible roommates based on your academic interests, lifestyle, and location preferences."
    },
    {
      question: "What types of jobs are available on FIND?",
      answer: "We feature a wide range of opportunities including internships, part-time jobs, graduate positions, and freelance work. Jobs are posted by verified employers and startups across various industries."
    },
    {
      question: "How do I apply for jobs?",
      answer: "To apply for jobs, create a profile with your resume and qualifications. Browse available positions and submit your application directly through our platform. You'll receive updates on your application status."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we take privacy and security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent, and we comply with Malawian data protection regulations."
    },
    {
      question: "Can I edit my profile after creating it?",
      answer: "Absolutely! You can edit your profile at any time by visiting your profile page and clicking the 'Edit Profile' button. You can update your personal information, preferences, and upload a new resume."
    },
    {
      question: "What payment methods are accepted for taxi bookings?",
      answer: "We accept cash payments directly to drivers, as well as mobile money payments through Airtel Money and TNM Mpamba. Card payments are also available for verified users."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team through the contact form on our website, by emailing support@find.mw, or by calling our helpline at +265 123 456 789. We're here to help Monday through Friday, 8 AM to 6 PM CAT."
    },
    {
      question: "Can I cancel or modify my taxi booking?",
      answer: "Yes, you can cancel or modify your booking up to 2 hours before the scheduled pickup time. Contact our support team or use the booking management feature in your profile."
    },
    {
      question: "Are there any fees for using FIND?",
      answer: "Basic account creation and profile setup is completely free. Job applications and roommate matching are also free. A small service fee applies to taxi bookings to cover platform and payment processing costs."
    },
    {
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, click 'Forgot Password' on the sign-in page. Enter your email address, and we'll send you a secure link to reset your password."
    },
    {
      question: "Can international students use FIND?",
      answer: "Yes! FIND welcomes all students studying in Malawi, including international students. Our platform supports multiple languages and is designed to serve the entire student community."
    },
    {
      question: "How do I leave feedback or report an issue?",
      answer: "We value your feedback! Use the feedback form in your profile or contact our support team. Your input helps us improve our services and better serve the student community."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-white relative h-screen bg-cover bg-center"
        style ={ {
              backgroundImage: `url('FAQ.jpg')`,
        }}>
            {/*Dark Overlay*/}
            <div className="absolute inset-0 bg-black opacity-60" z-0></div>

            {/*Hero section content*/}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full font-inter">
          <HelpCircle className="w-16 h-16 mb-6 text-find-red" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
            Find answers to common questions about using FIND.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="font-semibold text-lg">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse all FAQs.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-find-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-6 text-find-red" />
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-find-red hover:bg-red-700">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-find-dark">
              Live Chat
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;