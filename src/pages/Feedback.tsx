import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Star, Send, CheckCircle } from 'lucide-react';

const Feedback = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    rating: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Store feedback locally
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      existingFeedback.push({
        ...feedback,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback. We appreciate your input!",
      });
    }, 2000);
  };

  const resetForm = () => {
    setFeedback({
      name: '',
      email: '',
      category: '',
      subject: '',
      message: '',
      rating: ''
    });
    setRating('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your feedback has been submitted successfully. We appreciate you taking the time to help us improve FIND.
              </p>
              <Button onClick={resetForm} className="w-full">
                Submit Another Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-white relative h-screen bg-cover bg-center"
        style ={ {
              backgroundImage: `url('herobg.jpg')`,
        }}>
            {/*Dark Overlay*/}
            <div className="absolute inset-0 bg-black opacity-70" z-0></div>

            {/*Hero section content*/}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full font-inter">
          <MessageSquare className="w-16 h-16 mb-6 text-find-red" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">Share Your Feedback</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
            Help us improve FIND by sharing your thoughts and suggestions.
          </p>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">We Value Your Opinion</CardTitle>
                <CardDescription className="text-center">
                  Your feedback helps us make FIND better for all Malawian students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={feedback.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={feedback.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <RadioGroup
                      value={feedback.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="general" id="general" />
                        <Label htmlFor="general">General</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="taxi" id="taxi" />
                        <Label htmlFor="taxi">Taxi Service</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="jobs" id="jobs" />
                        <Label htmlFor="jobs">Job Portal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="roommates" id="roommates" />
                        <Label htmlFor="roommates">Roommate Matching</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technical" id="technical" />
                        <Label htmlFor="technical">Technical Issue</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your feedback"
                      value={feedback.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Overall Rating</Label>
                    <RadioGroup
                      value={rating}
                      onValueChange={(value) => {
                        setRating(value);
                        handleInputChange('rating', value);
                      }}
                      className="flex gap-2 mt-2"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="flex items-center space-x-1">
                          <RadioGroupItem value={star.toString()} id={`star-${star}`} />
                          <Label htmlFor={`star-${star}`} className="flex items-center cursor-pointer">
                            <Star className={`w-5 h-5 ${parseInt(rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="message">Your Feedback</Label>
                    <Textarea
                      id="message"
                      placeholder="Please share your detailed feedback, suggestions, or concerns..."
                      value={feedback.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-find-red hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-find-red mb-6">How We Use Your Feedback</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your feedback is crucial in helping us improve FIND. Here's how we use the information you provide:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-find-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Review & Analyze</h3>
                <p className="text-gray-600">
                  Our team carefully reviews all feedback to identify patterns and areas for improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-find-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Prioritize Changes</h3>
                <p className="text-gray-600">
                  We prioritize improvements based on frequency of feedback and potential impact on users.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-find-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Implement Updates</h3>
                <p className="text-gray-600">
                  Changes are implemented and tested before being rolled out to all users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Feedback;