import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Home, DollarSign, Bed, Bath, Ruler, Heart, Search } from 'lucide-react';
import { getImageUrl } from '@/lib/imageStore';
import { getAdminHomes } from '@/lib/adminStore';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  imageKeys?: string[];
  status: 'Available' | 'Under Offer' | 'Sold';
  description: string;
  featured?: boolean;
  active: boolean;
  listing_type: 'sale' | 'rent' | 'airbnb';
  created_at: number;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  features: string[];
}

const Homes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Available');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const parsed = (await getAdminHomes()) as Property[];
        const active = parsed.filter((property) => property.active);
        setProperties(active);
        active.forEach((property) => {
          const key = property.imageKeys?.[0] || property.image;
          if (!key) return;
          getImageUrl(key).then((url) => {
            if (url) {
              setImageUrls((prev) => ({ ...prev, [property.id]: url }));
            }
          });
        });
      } catch {
        setProperties([]);
      }
    })();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || property.status === filterStatus;
    const listingType = property.listing_type || 'rent';
    const matchesType = filterType === 'All' || listingType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return b.created_at - a.created_at;
    }
  });

  const toggleSave = (id: string) => {
    setSavedProperties(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden bg-gray-200 h-64">
        <img
          src={imageUrls[property.id] || property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge
          className={`absolute top-3 right-3 ${
            property.status === 'Available'
              ? 'bg-green-500 hover:bg-green-600'
              : property.status === 'Under Offer'
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {property.status}
        </Badge>
        <Badge className="absolute top-3 left-3 bg-find-red hover:bg-red-700">
          {property.listing_type === 'sale'
            ? 'For Sale'
            : property.listing_type === 'airbnb'
            ? 'Airbnb'
            : 'For Rent'}
        </Badge>
        {property.featured && (
          <Badge className="absolute top-12 left-3 bg-black/80 hover:bg-black">
            Featured
          </Badge>
        )}
        <button
          onClick={() => toggleSave(property.id)}
          className="absolute bottom-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
        >
          <Heart
            size={20}
            className={savedProperties.includes(property.id) ? 'fill-find-red text-find-red' : 'text-gray-400'}
          />
        </button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{property.name}</h3>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin size={16} className="mr-2 text-find-red" />
          <span className="text-sm">{property.location}</span>
        </div>

        <p className="text-2xl font-bold text-find-red mb-4">
          MWK {property.price.toLocaleString()}
        </p>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

        <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-200">
          <div className="text-center">
            <Bed size={18} className="mx-auto mb-1 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">{property.beds}</span>
            <p className="text-xs text-gray-600">Beds</p>
          </div>
          <div className="text-center">
            <Bath size={18} className="mx-auto mb-1 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">{property.baths}</span>
            <p className="text-xs text-gray-600">Baths</p>
          </div>
          <div className="text-center">
            <Ruler size={18} className="mx-auto mb-1 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">{property.sqft}</span>
            <p className="text-xs text-gray-600">sqft</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/homes/${property.id}`)}
            className="flex-1 bg-find-red hover:bg-red-700 text-white"
          >
            View Details
          </Button>
          <Button variant="outline" className="flex-1 hover:bg-gray-50">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-white relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=400&fit=crop')`,
        }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full">
          <h1 className="text-5xl font-bold mb-4">FIND Homes</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Discover your perfect home with detailed property information, professional photos, and exact locations
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white shadow-lg -mt-8 relative z-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Location or Property</label>
              <Input
                placeholder="Enter location or property name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Under Offer">Under Offer</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="All">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-find-red hover:bg-red-700 text-white h-10">
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Properties</h2>
              <p className="text-gray-600">{sortedProperties.length} properties found</p>
            </div>
            {savedProperties.length > 0 && (
              <Badge className="bg-find-red text-white">
                {savedProperties.length} Saved
              </Badge>
            )}
          </div>

          {sortedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties available</h3>
              <p className="text-gray-600 mb-6">
                Listings will appear once an administrator adds properties.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homes;
