import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Ruler, Phone, Mail, Heart, Share2, MapIcon } from 'lucide-react';
import { getImageUrl } from '@/lib/imageStore';
import { getAdminHomes } from '@/lib/adminStore';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const [property, setProperty] = useState<any | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isMissing, setIsMissing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const parsed = (await getAdminHomes()) as any[];
        const match = parsed.find((item: any) => String(item.id) === String(id) && item.active);
        if (!match) {
          setIsMissing(true);
          return;
        }
        setProperty(match);
        const keys = match.imageKeys?.length ? match.imageKeys : match.images || [match.image];
        const urls = await Promise.all((keys || []).map((key: string) => getImageUrl(key)));
        setImageUrls(urls.filter(Boolean) as string[]);
      } catch {
        setIsMissing(true);
      }
    })();
  }, [id]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isMissing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
            <p className="text-gray-600 mb-6">This listing is no longer available.</p>
            <Button onClick={() => navigate('/homes')} className="bg-find-red hover:bg-red-700 text-white">
              Back to Homes
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-find-red"></div>
      </div>
    );
  }

  const images = imageUrls.length ? imageUrls : property.images?.length ? property.images : [property.image];
  const features = property.features?.length ? property.features : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => navigate('/homes')}
          >
            ← Back to Properties
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <Card className="border-0 shadow-lg mb-6 overflow-hidden">
                <div className="relative h-96 bg-gray-200">
                  <img
                    src={images[currentImageIndex]}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-find-red">{property.status}</Badge>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 hover:bg-gray-100 shadow-lg"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 hover:bg-gray-100 shadow-lg"
                      >
                        →
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Property Info */}
              <Card className="border-0 shadow-lg mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                      <div className="flex items-center text-gray-600">
                        <MapPin size={20} className="mr-2 text-find-red" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-find-red">
                        MWK {property.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {property.listing_type === 'sale'
                          ? 'For Sale'
                          : property.listing_type === 'airbnb'
                          ? 'Airbnb'
                          : 'For Rent'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 mb-4">
                    <div className="text-center">
                      <Bed size={24} className="mx-auto mb-2 text-gray-500" />
                      <p className="font-semibold text-gray-900">{property.beds}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                    <div className="text-center">
                      <Bath size={24} className="mx-auto mb-2 text-gray-500" />
                      <p className="font-semibold text-gray-900">{property.baths}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                    <div className="text-center">
                      <Ruler size={24} className="mx-auto mb-2 text-gray-500" />
                      <p className="font-semibold text-gray-900">{property.sqft}</p>
                      <p className="text-sm text-gray-600">sqft</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{property.description}</p>

                  <h3 className="text-lg font-bold text-gray-900 mb-4">Features</h3>
                  {features.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-find-red rounded-full mr-3"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-6">No features listed for this property.</p>
                  )}
                </CardContent>
              </Card>

              {/* Map Section */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapIcon className="w-5 h-5 mr-2 text-find-red" />
                    Location Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Google Maps Integration Coming Soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              {/* Action Buttons */}
              <Card className="border-0 shadow-lg mb-6">
                <CardContent className="p-6 space-y-3">
                  <Button
                    className="w-full bg-find-red hover:bg-red-700 text-white h-12 text-base"
                  >
                    Schedule Viewing
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base"
                  >
                    <Phone size={18} className="mr-2" />
                    Call Agent
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base"
                  >
                    <Mail size={18} className="mr-2" />
                    Email Agent
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart
                      size={18}
                      className={`mr-2 ${isSaved ? 'fill-find-red text-find-red' : ''}`}
                    />
                    {isSaved ? 'Saved' : 'Save Property'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base"
                  >
                    <Share2 size={18} className="mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>

              {/* Agent Card */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Agent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-find-red/10 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-find-red">
                        {(property.agent_name || 'A')[0]}
                        {(property.agent_name || 'A')[1] || ''}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{property.agent_name}</p>
                      <p className="text-sm text-gray-600">Property Agent</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <a href={`tel:${property.agent_phone}`} className="flex items-center text-find-red hover:text-red-700">
                      <Phone size={18} className="mr-3" />
                      <span className="text-sm">{property.agent_phone}</span>
                    </a>
                    <a href={`mailto:${property.agent_email}`} className="flex items-center text-find-red hover:text-red-700">
                      <Mail size={18} className="mr-3" />
                      <span className="text-sm">{property.agent_email}</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
