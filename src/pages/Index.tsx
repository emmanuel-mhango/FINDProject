import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OurServices from '@/components/OurServices';
import LiveStats from '@/components/LiveStats';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight, MapPin, Zap, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;
  const isLoggedIn = !!user;
  const displayName =
    user?.user_metadata?.first_name ||
    user?.firstName ||
    (user?.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0] : '') ||
    (user?.fullName ? user.fullName.split(' ')[0] : '') ||
    (user?.email ? user.email.split('@')[0] : '');

  const scrollToServices = () => {
    const servicesSection = document.getElementById('our-services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reviews data - combine fake reviews with real user feedback
  const fakeReviews = [
    {
      id: 1,
      name: "Grace Banda",
      university: "University of Malawi",
      rating: 5,
      review: "FIND made finding a roommate so easy! I connected with someone who shares my study habits and we became great friends. The platform is intuitive and safe.",
      avatar: "/api/placeholder/60/60",
      service: "Roommate Matching"
    },
    {
      id: 2,
      name: "Michael Phiri",
      university: "Mzuzu University",
      rating: 5,
      review: "As a student, getting around was always a challenge. FIND's taxi booking saved me so much time and money. The drivers are verified and the app is reliable.",
      avatar: "/api/placeholder/60/60",
      service: "Taxi Booking"
    },
    {
      id: 3,
      name: "Sarah Nkhoma",
      university: "Lilongwe University of Agriculture",
      rating: 5,
      review: "I landed my dream job through FIND! The job search feature is amazing with detailed listings and easy application process. Highly recommend to all students!",
      avatar: "/api/placeholder/60/60",
      service: "Job Search"
    },
    {
      id: 4,
      name: "David Kumwenda",
      university: "Malawi University of Science and Technology",
      rating: 5,
      review: "The AI assistant is incredibly helpful! It guided me through booking a taxi during a busy period and even helped with job search tips. Outstanding service!",
      avatar: "/api/placeholder/60/60",
      service: "AI Assistant"
    },
    {
      id: 5,
      name: "Mary Chibambo",
      university: "Catholic University of Malawi",
      rating: 5,
      review: "FIND has everything a student needs in one place. From transportation to career opportunities, it's become my go-to platform. The interface is beautiful too!",
      avatar: "/api/placeholder/60/60",
      service: "Overall Experience"
    },
    {
      id: 6,
      name: "James Lungu",
      university: "University of Malawi - The Polytechnic",
      rating: 5,
      review: "The verification process gives me peace of mind when using FIND. I feel safe booking taxis and connecting with potential roommates. Great work!",
      avatar: "/api/placeholder/60/60",
      service: "Safety & Security"
    }
  ];

  // Load real user feedback from localStorage
  const [realFeedbacks, setRealFeedbacks] = useState<any[]>(() => {
    const savedFeedbacks = localStorage.getItem('userFeedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : [];
  });

  // Combine fake reviews with real feedback
  const reviews = [
    ...realFeedbacks.map(feedback => ({
      id: feedback.id,
      name: feedback.userName,
      university: feedback.university,
      rating: feedback.rating,
      review: feedback.feedback,
      avatar: feedback.avatar,
      service: "User Feedback"
    })),
    ...fakeReviews
  ];

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate reviews every 5 seconds (pause on hover)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length, isPaused]);

  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentReviewIndex];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section text-white relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url('city.jpg')`,
        }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Hero section content */}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full font-inter">
          {isLoggedIn ? (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">
                Welcome back, {displayName || 'there'}!
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
                Ready to explore homes or book your next taxi ride?
              </p>
              <Button 
                className="action-button text-lg px-8 py-6 hover-scale" 
                size="lg"
                onClick={scrollToServices}
              >
                Our services
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">Find Everything On a click</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
                Your all-in-one solution for finding homes, booking taxis, and exploring jobs and roommates.
              </p>
              <Button 
                className="action-button text-lg px-8 py-6 hover-scale" 
                size="lg"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </section>
      
      {/* Our Services */}
      <OurServices />

      {/* Live Stats */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <LiveStats />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FIND?</h2>
            <p className="text-xl text-gray-600">All-in-one platform for your lifestyle needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-find-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Accurate Locations</h3>
                <p className="text-gray-600">Google Maps integration for precise property locations and directions</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-find-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Fast & Easy</h3>
                <p className="text-gray-600">Quick search and filter options to find exactly what you need</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-find-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Transparent Pricing</h3>
                <p className="text-gray-600">Accurate valuations and no hidden costs or surprises</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-find-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer service to help you anytime</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Users Say About FIND</h2>
              <p className="text-xl text-gray-600">Real feedback from our community</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {currentReview && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Avatar className="w-16 h-16 mr-4">
                        <AvatarImage src={currentReview.avatar} alt={currentReview.name} />
                        <AvatarFallback>{currentReview.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{currentReview.name}</h3>
                        <p className="text-gray-600">{currentReview.university}</p>
                      </div>
                    </div>

                    <div className="flex mb-4">
                      {[...Array(currentReview.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-700 text-lg mb-6 italic">"{currentReview.review}"</p>

                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800">{currentReview.service}</Badge>
                      <div className="flex gap-2">
                        <button
                          onClick={prevReview}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          onMouseEnter={() => setIsPaused(true)}
                          onMouseLeave={() => setIsPaused(false)}
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <button
                          onClick={nextReview}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          onMouseEnter={() => setIsPaused(true)}
                          onMouseLeave={() => setIsPaused(false)}
                        >
                          <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
