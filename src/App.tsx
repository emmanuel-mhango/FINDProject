import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { isAdminLoggedIn } from "./lib/adminAuth";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Homes from "./pages/Homes";
import PropertyDetails from "./pages/PropertyDetails";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import AboutUs from "./pages/AboutUs";
import MeetOurTeam from "./pages/MeetOurTeam";
import FAQ from "./pages/FAQ";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import TaxiBooking from "./pages/TaxiBooking";
import Jobs from "./pages/Jobs";
import Roommates from "./pages/Roommates";
import Auth from "./pages/Auth";
import AIAssistant from "./components/AIAssistant";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          localStorage.setItem('userData', JSON.stringify(session.user));
        } else {
          localStorage.removeItem('userData');
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Index />} />
            
            {/* FIND Homes - Active Feature */}
            <Route path="/homes" element={<Homes />} />
            <Route path="/homes/:id" element={<PropertyDetails />} />

            {/* FIND Taxi */}
            <Route path="/taxi" element={<TaxiBooking />} />

            {/* FIND Jobs */}
            <Route path="/jobs" element={<Jobs />} />

            {/* FIND Roommates */}
            <Route path="/roommates" element={<Roommates />} />
            
            {/* User Routes */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Company Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/team" element={<MeetOurTeam />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/contact" element={<Contact />} />

            {/* Authentication Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<Welcome />} />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* Catch-all 404 Route - MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {!isAdminLoggedIn() && <AIAssistant />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
