
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import MessageDialog from '@/components/MessageDialog';
import { supabase } from '@/integrations/supabase/client';
import { Chrome } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const baseUser = data.user;
        const pendingRaw = localStorage.getItem('pendingProfile');
        let mergedUser: any = baseUser
          ? {
              ...baseUser,
              email: baseUser.email,
              firstName: baseUser.user_metadata?.first_name || baseUser.user_metadata?.firstName,
              lastName: baseUser.user_metadata?.last_name || baseUser.user_metadata?.lastName,
              username: baseUser.user_metadata?.username,
            }
          : {};

        if (pendingRaw) {
          try {
            const pendingProfile = JSON.parse(pendingRaw);
            if (pendingProfile?.email === baseUser?.email) {
              mergedUser = {
                ...mergedUser,
                email: mergedUser.email || pendingProfile.email,
                firstName: mergedUser.firstName || pendingProfile.first_name || pendingProfile.firstName,
                lastName: mergedUser.lastName || pendingProfile.last_name || pendingProfile.lastName,
                username: mergedUser.username || pendingProfile.username,
              };
            }
          } catch (profileErr) {
            console.error('Profile merge error:', profileErr);
          }
        }

        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(mergedUser));
        if (pendingRaw && data.user?.id && data.user?.email) {
          try {
            const pendingProfile = JSON.parse(pendingRaw);
            if (pendingProfile?.email === data.user.email) {
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert([
                  {
                    user_id: data.user.id,
                    ...pendingProfile,
                  }
                ], { onConflict: 'user_id' });

              if (!profileError) {
                localStorage.removeItem('pendingProfile');
              } else {
                console.error('Profile creation error:', profileError);
              }
            }
          } catch (profileErr) {
            console.error('Profile creation error:', profileErr);
          }
        }

        setDialogConfig({
          title: 'Welcome Back!',
          description: 'You have signed in successfully. Redirecting to your profile...',
          onConfirm: () => {
            navigate('/profile');
          }
        });
        setDialogOpen(true);
      } catch (err: any) {
        setDialogConfig({
          title: 'Sign In Failed',
          description: err.message || 'Unable to sign in. Please check your credentials.',
          onConfirm: () => {}
        });
        setDialogOpen(true);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setDialogConfig({
        title: 'Sign In Failed',
        description: err.message || 'Unable to sign in with Google',
        onConfirm: () => {}
      });
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in to FIND</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <Button 
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Chrome size={18} />
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-find-red hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-find-red hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-find-red hover:underline">
                  Register here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
      
      <MessageDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        actionLabel="OK"
        onConfirm={dialogConfig.onConfirm}
      />
    </div>
  );
};

export default SignIn;
