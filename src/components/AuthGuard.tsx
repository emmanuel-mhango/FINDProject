import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
  message?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  message = "Please sign in to access this feature" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setIsAuthenticated(!!data.session?.user);
      setIsLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Checking sign-in status...</CardTitle>
            <CardDescription>Please wait while we verify your session.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/auth" className="w-full">
              <Button className="w-full" variant="default">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/auth" className="w-full">
              <Button className="w-full" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
