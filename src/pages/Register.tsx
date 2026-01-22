import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import MessageDialog from '@/components/MessageDialog';
import PasswordValidator from '@/components/PasswordValidator';
import { supabase } from '@/integrations/supabase/client';
import { Chrome } from 'lucide-react';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    description: '',
    onConfirm: () => {}
  });
  
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const validatePassword = (password: string) => {
    const validations = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9\s]/.test(password)
    ];
    return validations.every(valid => valid);
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign-up error:', err);
      setDialogConfig({
        title: 'Sign-up Failed',
        description: err.message || 'Failed to sign up with Google',
        onConfirm: () => {}
      });
      setDialogOpen(true);
    }
  };

  const onSubmit = (data: RegisterFormValues) => {
    // Validate first name
    if (!data.firstName.trim()) {
      form.setError('firstName', { 
        message: "First name is required" 
      });
      return;
    }

    // Validate last name
    if (!data.lastName.trim()) {
      form.setError('lastName', { 
        message: "Last name is required" 
      });
      return;
    }

    if (!data.username.trim()) {
      form.setError('username', {
        message: "Username is required"
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { 
        message: "Passwords don't match" 
      });
      return;
    }
    
    if (!validatePassword(data.password)) {
      form.setError('password', { 
        message: "Password must meet all requirements" 
      });
      return;
    }
    
    setIsLoading(true);
    (async () => {
      try {
        // Register user with Supabase Auth
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              username: data.username,
            }
          }
        });

        if (error) throw error;

        const pendingProfile = {
          email: data.email,
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          full_name: `${data.firstName} ${data.lastName}`,
        };
        localStorage.setItem('pendingProfile', JSON.stringify(pendingProfile));

        if (authData.session?.user?.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([{
              user_id: authData.session.user.id,
              ...pendingProfile,
            }], { onConflict: 'user_id' });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          } else {
            localStorage.removeItem('pendingProfile');
          }
        }

        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(authData.user));

        setDialogConfig({
          title: 'Registration Successful!',
          description: 'Your account has been created. Please sign in now to continue.',
          onConfirm: () => {
            navigate('/signin');
          }
        });
        setDialogOpen(true);
      } catch (err: any) {
        setDialogConfig({
          title: 'Registration Failed',
          description: err.message || 'Unable to create account. Please try again.',
          onConfirm: () => {}
        });
        setDialogOpen(true);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to access FIND services
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <Button 
                  type="button"
                  onClick={handleGoogleSignUp}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mb-6"
                  disabled={isLoading}
                >
                  <Chrome size={18} />
                  Continue with Google
                </Button>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or with email</span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" type="text" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: 'Last name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" type="text" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  rules={{
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' },
                    maxLength: { value: 20, message: 'Username must be 20 characters or less' },
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+$/,
                      message: 'Username can only use letters, numbers, ".", "_" or "-"'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname" type="text" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          onChange={(e) => {
                            setPassword(e.target.value);
                            field.onChange(e);
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <PasswordValidator password={password} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{ required: 'Please confirm your password' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-find-red hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-find-red hover:underline font-semibold">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
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

export default Register;
