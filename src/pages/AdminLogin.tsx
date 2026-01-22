import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  getAdminIdentity,
  getAdminIdentities,
  hasAdminIdentity,
  isAdminLoggedIn,
  isInitialAdminPassword,
  needsPasswordReset,
  setAdminSession,
  setNewAdminPassword,
  validateAdminCredentials,
} from '@/lib/adminAuth';

const passwordChecks = (value: string) => ({
  length: value.length >= 12,
  upper: /[A-Z]/.test(value),
  lower: /[a-z]/.test(value),
  number: /\d/.test(value),
  symbol: /[^A-Za-z0-9\s]/.test(value),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasAdmins) {
      setError('Admin credentials are not configured. Restart the app after setting .env.');
      return;
    }

    if (!validateAdminCredentials(identifier, password)) {
      setError('Invalid admin credentials.');
      return;
    }

    if (needsPasswordReset(identifier, password)) {
      setShowReset(true);
      toast({
        title: 'Password Reset Required',
        description: isInitialAdminPassword(identifier, password)
          ? 'Please set a new password to activate admin access.'
          : 'Your password expired. Please set a new password.',
        variant: 'destructive',
      });
      return;
    }

    setAdminSession(identifier);
    navigate('/admin');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const checks = passwordChecks(newPassword);
    if (!Object.values(checks).every(Boolean)) {
      setError('Password does not meet complexity requirements.');
      return;
    }

    setNewAdminPassword(identifier, newPassword);
    setAdminSession(identifier);
    toast({
      title: 'Password Updated',
      description: 'Admin password updated successfully.',
    });
    navigate('/admin');
  };

  const { username, email } = getAdminIdentity();
  const identities = getAdminIdentities();
  const hasAdmins = hasAdminIdentity();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Sign in with the admin credentials to manage the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showReset ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="identifier">Username or Email</Label>
                  <Input
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={identities.map((item) => item.username || item.email).filter(Boolean).join(' / ') || username || email || 'admin'}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full bg-find-red hover:bg-red-700">
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  Use 12+ characters with upper/lowercase, a number, and a symbol.
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full bg-find-red hover:bg-red-700">
                  Update Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
