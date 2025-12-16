
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./integrations/supabase/client";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Roommates from "./pages/Roommates";
import TaxiBooking from "./pages/TaxiBooking";
import Auth from "./pages/Auth";
import AboutUs from "./pages/AboutUs";
import MeetOurTeam from "./pages/MeetOurTeam";
import FAQ from "./pages/FAQ";
import Feedback from "./pages/Feedback";
import AIAssistant from "./components/AIAssistant";
import { useEffect } from "react";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Index />} />  
          <Route path="/taxi" element={<TaxiBooking />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/team" element={<MeetOurTeam />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
