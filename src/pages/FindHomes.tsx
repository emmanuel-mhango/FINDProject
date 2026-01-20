import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  Compass,
  Home,
  MapPinned,
  Map,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const listings = [
  {
    id: "FH-001",
    title: "Modern 3-bedroom home",
    location: "Area 47, Lilongwe",
    price: "K95,000,000",
    status: "Available",
    summary: "Bright open-plan living with secure parking and a landscaped garden.",
  },
  {
    id: "FH-002",
    title: "Family home near schools",
    location: "Kanjedza, Blantyre",
    price: "K72,500,000",
    status: "Under Offer",
    summary: "Walking distance to markets, clinics, and a major bus route.",
  },
  {
    id: "FH-003",
    title: "Lakeside rental cottage",
    location: "Nkhata Bay",
    price: "K350,000 / month",
    status: "Rented",
    summary: "Two bedrooms with panoramic lake views and private deck.",
  },
  {
    id: "FH-004",
    title: "City center apartment",
    location: "Mzuzu City",
    price: "K68,000,000",
    status: "Sold",
    summary: "Secure building with backup power and water storage.",
  },
];

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-700",
  "Under Offer": "bg-amber-100 text-amber-700",
  Sold: "bg-gray-200 text-gray-700",
  Rented: "bg-blue-100 text-blue-700",
};

const FindHomes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative bg-find-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-sm uppercase tracking-widest text-gray-200">
              <Home className="h-4 w-4" />
              Find Homes
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Verified homes with professional valuation, photography, and trusted location data.
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              FIND Homes connects buyers, renters, and sellers with transparent pricing, professional media,
              and location clarity. Premium members unlock exact coordinates, Google Maps routes, and taxi
              cost estimates from any property to destinations across Malawi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="action-button" asChild>
                <Link to="/feedback">List your property</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/feedback">Request a valuation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-find-red" />
                  Property valuation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Market-driven pricing backed by comparable sales, location analysis, and condition reports.
                Valuation fees generate immediate income and build trust for both buyers and sellers.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-find-red" />
                  Photography & media
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Professional imagery, video walkthroughs, and staging guidance that boost inquiry rates and
                help listings stand out in competitive neighborhoods.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-find-red" />
                  Online listing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Detailed descriptions, pricing transparency, and verified location context with Google Maps
                and Google Earth integration.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Location intelligence built for confidence</h2>
              <p className="text-gray-600 mb-6">
                Every listing shows a verified neighborhood summary and general location. Premium members
                unlock exact coordinates, route directions, and Google Earth satellite views to evaluate
                access to schools, hospitals, markets, and transport hubs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Exact property coordinates",
                  "Google Maps driving routes",
                  "Google Earth neighborhood context",
                  "Taxi fare estimates to any destination",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <Card className="flex-1 border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-find-red" />
                  Google Maps & Earth integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <p>
                  We embed Google Maps and Google Earth views responsibly, giving clients accurate property
                  context while protecting seller privacy.
                </p>
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
                  <Compass className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Interactive maps appear here for premium members.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Latest listings</h2>
              <p className="text-gray-600">Status badges update automatically to keep buyers informed.</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link to="/taxi">
                Estimate taxi cost <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="border">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">{listing.id}</p>
                    <CardTitle className="text-xl">{listing.title}</CardTitle>
                    <p className="text-sm text-gray-500">{listing.location}</p>
                  </div>
                  <Badge className={statusStyles[listing.status] || "bg-gray-100 text-gray-600"}>
                    {listing.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p className="text-lg font-semibold text-find-dark">{listing.price}</p>
                  <p>{listing.summary}</p>
                  <p className="text-xs text-gray-500">
                    Premium members can view exact coordinates, directions, and commuting estimates.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border">
              <CardHeader>
                <CardTitle>How we update property status</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-3">
                <p>
                  Listings move from <strong>Available</strong> to <strong>Under Offer</strong>, and then to
                  <strong> Sold</strong> or <strong>Rented</strong> with clear visual badges.
                </p>
                <p>
                  Admin updates refresh listings in real time, keeping results trustworthy and preventing
                  unnecessary follow-ups.
                </p>
                <p>
                  Users who save or inquire about a property will receive automated email or WhatsApp alerts
                  when the status changes.
                </p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader>
                <CardTitle>Recently sold & success stories</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-3">
                <p>
                  Sold properties remain visible in a dedicated section to showcase market activity and build
                  seller confidence.
                </p>
                <p>
                  Search filters hide sold homes by default but allow buyers to explore past listings for
                  pricing guidance.
                </p>
                <p className="font-semibold text-find-dark">
                  This transparency proves FIND delivers results and protects users from stale listings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-find-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to list or buy with confidence?</h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-8">
            Contact the FIND Homes team for valuations, property photography, and premium listing support.
          </p>
          <Button className="action-button" asChild>
            <Link to="/feedback">Talk to our team</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FindHomes;
