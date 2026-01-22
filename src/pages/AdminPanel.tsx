import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Briefcase,
  Building2,
  LogOut,
  Home,
  Car,
  Eye,
  Search,
  Bell,
  LayoutDashboard,
  UserCircle,
  Menu,
} from 'lucide-react';
import {
  clearAdminSession,
  getActiveAdmin,
  getPasswordDaysRemaining,
  getLastNoticeDate,
  isAdminLoggedIn,
  isPasswordExpired,
  setLastNoticeDate,
} from '@/lib/adminAuth';
import { deleteImages, saveImages } from '@/lib/imageStore';
import { getAdminHomes, setAdminHomes } from '@/lib/adminStore';

type AdminHome = {
  id: string;
  name: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images: string[];
  imageKeys: string[];
  status: 'Available' | 'Under Offer' | 'Sold';
  description: string;
  featured: boolean;
  active: boolean;
  listing_type: 'sale' | 'rent' | 'airbnb';
  created_at: number;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  features: string[];
};

type AdminDriver = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  location: string;
  active: boolean;
  created_at: number;
};

type AdminNotification = {
  id: string;
  message: string;
  created_at: number;
  read: boolean;
};

type AdminProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

const readLocalList = <T,>(key: string, fallback: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocalList = <T,>(key: string, list: T[]) => {
  localStorage.setItem(key, JSON.stringify(list));
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employers' | 'jobs' | 'homes' | 'taxis'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingHomeId, setEditingHomeId] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingEmployerId, setEditingEmployerId] = useState<string | null>(null);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: '',
    email: '',
    phone: '',
    role: 'System Administrator',
  });

  // Employer form state
  const [employers, setEmployers] = useState<any[]>([]);
  const [employerForm, setEmployerForm] = useState({
    company_name: '',
    company_description: '',
    company_website: '',
    contact_email: '',
    contact_phone: '',
    contact_person: '',
    industry: '',
    location: '',
  });

  // Job form state
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobForm, setJobForm] = useState({
    employer_id: '',
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'entry',
    job_category: '',
    salary_min: '',
    salary_max: '',
    application_deadline: '',
  });

  const [homes, setHomes] = useState<AdminHome[]>([]);
  const [homeForm, setHomeForm] = useState({
    name: '',
    location: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    image: '',
    images: [] as string[],
    status: 'Available',
    description: '',
    featured: false,
    active: true,
    listing_type: 'rent',
    agent_name: '',
    agent_phone: '',
    agent_email: '',
    features: '',
  });
  const [homeImagePreviews, setHomeImagePreviews] = useState<string[]>([]);
  const [homeImageInputKey, setHomeImageInputKey] = useState(0);

  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [driverForm, setDriverForm] = useState({
    name: '',
    phone: '',
    vehicle: '',
    plate: '',
    location: '',
    active: true,
  });

  const formatMoney = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (
      tab === 'dashboard' ||
      tab === 'employers' ||
      tab === 'jobs' ||
      tab === 'homes' ||
      tab === 'taxis'
    ) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const daysRemaining = getPasswordDaysRemaining();

  useEffect(() => {
    if (!isAdmin) return;
    if (daysRemaining <= 10) {
      const today = new Date().toISOString().slice(0, 10);
      if (getLastNoticeDate() !== today) {
        toast({
          title: 'Admin Password Expiring',
          description: `Your admin password expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}.`,
        });
        setLastNoticeDate(today);
      }
    }
  }, [daysRemaining, isAdmin, toast]);

  const checkAdminAccess = async () => {
    if (!isAdminLoggedIn() || isPasswordExpired()) {
      clearAdminSession();
      navigate('/admin-login');
      return;
    }

    setIsAdmin(true);
    loadAdminProfile();
    loadNotifications();
    fetchEmployers();
    fetchJobs();
    await loadHomes();
    loadDrivers();
    setIsLoading(false);
  };

  const loadAdminProfile = () => {
    const stored = localStorage.getItem('adminProfile');
    if (stored) {
      setAdminProfile(JSON.parse(stored));
      return;
    }
    const activeAdmin = getActiveAdmin();
    const name = activeAdmin?.username || import.meta.env.VITE_ADMIN_USERNAME || 'Administrator';
    const email = activeAdmin?.email || import.meta.env.VITE_ADMIN_EMAIL || '';
    setAdminProfile((prev) => ({ ...prev, name, email }));
  };

  const saveAdminProfile = () => {
    localStorage.setItem('adminProfile', JSON.stringify(adminProfile));
    toast({
      title: 'Profile Updated',
      description: 'Admin profile details have been saved.',
    });
  };

  const clearUserData = () => {
    const keysToClear = [
      'userData',
      'userDetails',
      'userFeedback',
      'userFeedbacks',
      'taxiBooking',
      'taxiBookings',
      'appliedJobs',
    ];
    keysToClear.forEach((key) => localStorage.removeItem(key));
    toast({
      title: 'User Data Cleared',
      description: 'All user accounts data has been removed from this device.',
    });
  };

  const loadNotifications = () => {
    setNotifications(readLocalList<AdminNotification>('adminNotifications', []));
  };

  const addNotification = (message: string) => {
    setNotifications((prev) => {
      const next = [
        { id: `notice_${Date.now()}`, message, created_at: Date.now(), read: false },
        ...prev,
      ];
      writeLocalList('adminNotifications', next);
      return next;
    });
  };

  const fetchEmployers = async () => {
    try {
      setEmployers(readLocalList<any>('adminEmployers', []));
    } catch {
      setEmployers([]);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobs(readLocalList<any>('adminJobs', []));
    } catch {
      setJobs([]);
    }
  };

  const loadHomes = async () => {
    const stored = await getAdminHomes();
    setHomes(stored as AdminHome[]);
  };

  const loadDrivers = () => {
    setDrivers(readLocalList<AdminDriver>('adminTaxiDrivers', []));
  };

  const handleAddEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nextEmployer = {
        id: editingEmployerId || `employer_${Date.now()}`,
        ...employerForm,
        created_at: editingEmployerId
          ? employers.find((item) => item.id === editingEmployerId)?.created_at || Date.now()
          : Date.now(),
      };

      const nextEmployers = editingEmployerId
        ? employers.map((item) => (item.id === editingEmployerId ? nextEmployer : item))
        : [nextEmployer, ...employers];
      writeLocalList('adminEmployers', nextEmployers);
      setEmployers(nextEmployers);
      addNotification(
        `${editingEmployerId ? 'Updated' : 'Added'} employer: ${nextEmployer.company_name} (${nextEmployer.contact_email})`
      );

      toast({
        title: 'Success',
        description: 'Employer added successfully',
      });

      setEmployerForm({
        company_name: '',
        company_description: '',
        company_website: '',
        contact_email: '',
        contact_phone: '',
        contact_person: '',
        industry: '',
        location: '',
      });
      setEditingEmployerId(null);

      fetchEmployers();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Unable to add employer',
        variant: 'destructive',
      });
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!jobForm.employer_id) {
        throw new Error('Please select an employer');
      }

      const employer = employers.find((item) => item.id === jobForm.employer_id);
      const nextJob = {
        id: editingJobId || `job_${Date.now()}`,
        employer_id: jobForm.employer_id,
        employer_name: employer?.company_name || 'Employer',
        employer_email: employer?.contact_email || '',
        title: jobForm.title,
        description: jobForm.description,
        requirements: jobForm.requirements,
        responsibilities: jobForm.responsibilities,
        location: jobForm.location,
        job_type: jobForm.job_type,
        experience_level: jobForm.experience_level,
        job_category: jobForm.job_category,
        salary_min: jobForm.salary_min ? parseFloat(jobForm.salary_min) : null,
        salary_max: jobForm.salary_max ? parseFloat(jobForm.salary_max) : null,
        application_deadline: jobForm.application_deadline || null,
        created_at: editingJobId
          ? jobs.find((item: any) => item.id === editingJobId)?.created_at || Date.now()
          : Date.now(),
      };

      const nextJobs = editingJobId
        ? jobs.map((item: any) => (item.id === editingJobId ? nextJob : item))
        : [nextJob, ...jobs];
      writeLocalList('adminJobs', nextJobs);
      setJobs(nextJobs);
      addNotification(
        `${editingJobId ? 'Updated' : 'Added'} job: ${nextJob.title} at ${nextJob.employer_name} (${nextJob.location})`
      );

      toast({
        title: 'Success',
        description: 'Job posting added successfully',
      });

        setJobForm({
          employer_id: '',
          title: '',
          description: '',
          requirements: '',
          responsibilities: '',
          location: '',
          job_type: 'full-time',
          experience_level: 'entry',
          job_category: '',
          salary_min: '',
          salary_max: '',
          application_deadline: '',
        });
      setEditingJobId(null);

      fetchJobs();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add job',
        variant: 'destructive',
      });
    }
  };

  const handleAddHome = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!homeForm.name || !homeForm.location || !homeForm.price) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in the required property fields',
        variant: 'destructive',
      });
      return;
    }

    if (!homeForm.images.length && !editingHomeId) {
      toast({
        title: 'Missing Images',
        description: 'Please add at least one property image.',
        variant: 'destructive',
      });
      return;
    }

    const existingHome = editingHomeId ? homes.find((item) => item.id === editingHomeId) : null;
    const homeId = editingHomeId || `home_${Date.now()}`;
    let imageKeys: string[] = existingHome?.imageKeys || [];

    if (homeForm.images.length) {
      try {
        imageKeys = await saveImages(homeId, homeForm.images);
      } catch (err: any) {
        toast({
          title: 'Save Failed',
          description: err?.message || 'Unable to store images. Please try smaller files.',
          variant: 'destructive',
        });
        return;
      }
    }

    const newHome: AdminHome = {
      id: homeId,
      name: homeForm.name,
      location: homeForm.location,
      price: Number(homeForm.price),
      beds: Number(homeForm.beds || 0),
      baths: Number(homeForm.baths || 0),
      sqft: Number(homeForm.sqft || 0),
      image: imageKeys[0] || existingHome?.image || '',
      images: imageKeys,
      imageKeys,
      status: homeForm.status as AdminHome['status'],
      description: homeForm.description,
      featured: homeForm.featured,
      active: homeForm.active,
      listing_type: homeForm.listing_type as AdminHome['listing_type'],
      created_at: existingHome?.created_at || Date.now(),
      agent_name: homeForm.agent_name,
      agent_phone: homeForm.agent_phone,
      agent_email: homeForm.agent_email,
      features: homeForm.features
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean),
    };

    try {
      const nextHomes = editingHomeId
        ? homes.map((item) => (item.id === homeId ? newHome : item))
        : [newHome, ...homes];
      await setAdminHomes(nextHomes);
      setHomes(nextHomes);
      addNotification(
        `${editingHomeId ? 'Updated' : 'Added'} home: ${newHome.name} in ${newHome.location} (MWK ${newHome.price.toLocaleString()}, ${newHome.listing_type})`
      );
    } catch (err: any) {
      if (homeForm.images.length) {
        await deleteImages(imageKeys);
      }
      toast({
        title: 'Save Failed',
        description: err?.message || 'Unable to save property data.',
        variant: 'destructive',
      });
      return;
    }
    setHomeForm({
      name: '',
      location: '',
      price: '',
      beds: '',
      baths: '',
      sqft: '',
      image: '',
      images: [],
      status: 'Available',
      description: '',
      featured: false,
      active: true,
      listing_type: 'rent',
      agent_name: '',
      agent_phone: '',
      agent_email: '',
      features: '',
    });
    setHomeImagePreviews([]);
    setHomeImageInputKey((prev) => prev + 1);
    setEditingHomeId(null);

    toast({
      title: 'Success',
      description: editingHomeId ? 'Property updated successfully' : 'Property added successfully',
    });
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();

    if (!driverForm.name || !driverForm.phone || !driverForm.vehicle) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in the required driver fields',
        variant: 'destructive',
      });
      return;
    }

    const nextDriver: AdminDriver = {
      id: editingDriverId || `driver_${Date.now()}`,
      name: driverForm.name,
      phone: driverForm.phone,
      vehicle: driverForm.vehicle,
      plate: driverForm.plate,
      location: driverForm.location,
      active: driverForm.active,
      created_at: editingDriverId
        ? drivers.find((item) => item.id === editingDriverId)?.created_at || Date.now()
        : Date.now(),
    };

    const nextDrivers = editingDriverId
      ? drivers.map((item) => (item.id === editingDriverId ? nextDriver : item))
      : [nextDriver, ...drivers];
    writeLocalList('adminTaxiDrivers', nextDrivers);
    setDrivers(nextDrivers);
    addNotification(
      `${editingDriverId ? 'Updated' : 'Added'} driver: ${nextDriver.name} (${nextDriver.vehicle}, ${nextDriver.phone})`
    );
    setDriverForm({
      name: '',
      phone: '',
      vehicle: '',
      plate: '',
      location: '',
      active: true,
    });
    setEditingDriverId(null);

    toast({
      title: 'Success',
      description: 'Driver added successfully',
    });
  };

  const handleLogout = async () => {
    clearAdminSession();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-find-red"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const homesTotal = homes.length;
  const homesActive = homes.filter((home) => home.active).length;
  const driversTotal = drivers.length;
  const driversActive = drivers.filter((driver) => driver.active).length;
  const bookings = readLocalList<any>('taxiBookings', []);
  const totalBookings = bookings.length;
  const recentBookings = bookings.slice(-7);
  const bookingSeries = (() => {
    const values = recentBookings.map((booking: any) => booking?.price || 0);
    const max = Math.max(1, ...values);
    return values.length ? values.map((value) => Math.round((value / max) * 100)) : Array(7).fill(10);
  })();

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchesSearch = (values: Array<string | number | null | undefined>) => {
    if (!normalizedSearch) return true;
    return values
      .filter((value) => value !== null && value !== undefined)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch));
  };

  const filteredEmployers = employers.filter((employer) =>
    matchesSearch([
      employer.company_name,
      employer.contact_email,
      employer.contact_phone,
      employer.contact_person,
      employer.industry,
      employer.location,
    ])
  );

  const filteredJobs = jobs.filter((job: any) =>
    matchesSearch([
      job.title,
      job.employer_name,
      job.location,
      job.job_type,
      job.experience_level,
      job.salary_min,
      job.salary_max,
    ])
  );

  const filteredHomes = homes.filter((home) =>
    matchesSearch([
      home.name,
      home.location,
      home.price,
      home.listing_type,
      home.status,
      home.agent_name,
      home.agent_phone,
      home.agent_email,
    ])
  );

  const filteredDrivers = drivers.filter((driver) =>
    matchesSearch([
      driver.name,
      driver.phone,
      driver.vehicle,
      driver.plate,
      driver.location,
    ])
  );

  const unreadNotifications = notifications.filter((notice) => !notice.read).length;


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <aside
          className={`lg:w-72 w-full border-b lg:border-b-0 lg:border-r border-gray-200 bg-white transition-[opacity,transform,width] duration-300 ease-in-out overflow-hidden ${
            isSidebarOpen
              ? 'opacity-100 translate-x-0 lg:w-72 w-full'
              : 'opacity-0 -translate-x-full lg:w-0 w-full pointer-events-none'
          }`}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <div className="p-6">
            <div className="text-2xl font-semibold text-gray-900">FIND Admin</div>
            <p className="text-xs text-gray-500 mt-1">System overview & control</p>
          </div>
          <div className="px-4 pb-6 space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-find-red hover:bg-red-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => navigate('/admin?tab=dashboard')}
            >
              <LayoutDashboard size={18} className="mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'homes' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'homes' ? 'bg-find-red hover:bg-red-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => navigate('/admin?tab=homes')}
            >
              <Home size={18} className="mr-2" />
              Homes
            </Button>
            <Button
              variant={activeTab === 'taxis' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'taxis' ? 'bg-find-red hover:bg-red-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => navigate('/admin?tab=taxis')}
            >
              <Car size={18} className="mr-2" />
              Taxis
            </Button>
            <Button
              variant={activeTab === 'jobs' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'jobs' ? 'bg-find-red hover:bg-red-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => navigate('/admin?tab=jobs')}
            >
              <Briefcase size={18} className="mr-2" />
              Jobs
            </Button>
            <Button
              variant={activeTab === 'employers' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'employers' ? 'bg-find-red hover:bg-red-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => navigate('/admin?tab=employers')}
            >
              <Building2 size={18} className="mr-2" />
              Employers
            </Button>
          </div>
          <div className="px-4 pb-6 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={() => navigate('/')}
            >
              <Eye size={18} className="mr-2" />
              Preview As User
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="p-2 text-gray-700 hover:bg-gray-100 -ml-2"
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  aria-label="Toggle admin menu"
                >
                  <Menu size={18} />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">
                    Password expires in {daysRemaining} day{daysRemaining === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 w-full md:w-80">
                  <Search size={16} className="text-gray-400" />
                  <input
                    className="bg-transparent text-sm text-gray-700 outline-none w-full"
                    placeholder="Search admin data"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:bg-gray-100 relative"
                    onClick={() => {
                      setShowNotifications((prev) => !prev);
                      if (unreadNotifications) {
                        const updated = notifications.map((notice) => ({ ...notice, read: true }));
                        writeLocalList('adminNotifications', updated);
                        setNotifications(updated);
                      }
                    }}
                    aria-label="Show notifications"
                  >
                    <Bell size={18} />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-find-red text-white text-[10px] rounded-full px-1.5 py-0.5">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">Notifications</p>
                        <p className="text-xs text-gray-500">Latest admin actions</p>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 && (
                          <p className="text-sm text-gray-500 px-4 py-6 text-center">No notifications yet</p>
                        )}
                        {notifications.map((notice) => (
                          <div key={notice.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                            <p className="text-sm text-gray-700">{notice.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notice.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  <UserCircle size={20} />
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Active Homes</p>
                  <p className="text-2xl font-bold">{homesActive}</p>
                  <p className="text-xs text-gray-500">Total: {homesTotal}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Active Drivers</p>
                  <p className="text-2xl font-bold">{driversActive}</p>
                  <p className="text-xs text-gray-500">Total: {driversTotal}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Taxi Bookings</p>
                  <p className="text-2xl font-bold">{totalBookings}</p>
                  <p className="text-xs text-gray-500">Latest 7 shown below</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">System Status</p>
                  <p className="text-2xl font-bold text-emerald-400">Online</p>
                  <p className="text-xs text-gray-500">Local admin storage</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Booking Value</CardTitle>
                  <CardDescription>Last 7 bookings (MWK)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-40">
                    {bookingSeries.map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-find-red/80 rounded-sm"
                        style={{ height: `${Math.max(10, height)}%` }}
                        title={`Booking ${index + 1}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Mix</CardTitle>
                  <CardDescription>Homes vs Drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Homes</span>
                        <span>{homesTotal}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-find-red"
                          style={{ width: `${Math.min(100, homesTotal * 10)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Drivers</span>
                        <span>{driversTotal}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-find-red/70"
                          style={{ width: `${Math.min(100, driversTotal * 10)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Update your admin contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin_name">Full Name</Label>
                    <Input
                      id="admin_name"
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                      placeholder="Admin Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_email">Email</Label>
                    <Input
                      id="admin_email"
                      type="email"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                      placeholder="admin@find.mw"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_phone">Phone</Label>
                    <Input
                      id="admin_phone"
                      value={adminProfile.phone}
                      onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                      placeholder="+265 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_role">Role</Label>
                    <Input
                      id="admin_role"
                      value={adminProfile.role}
                      onChange={(e) => setAdminProfile({ ...adminProfile, role: e.target.value })}
                      placeholder="System Administrator"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="bg-find-red hover:bg-red-700" onClick={saveAdminProfile}>
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Data Reset</CardTitle>
                <CardDescription>Clear all stored user accounts on this device</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-find-red hover:bg-red-700" onClick={clearUserData}>
                  Clear User Data
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Employers Tab */}
        {activeTab === 'employers' && (
          <div className="space-y-6">
            {/* Add Employer Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Employer</CardTitle>
                <CardDescription>Register a new employer and their company details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEmployer} className="space-y-4">
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={employerForm.company_name}
                      onChange={(e) => setEmployerForm({ ...employerForm, company_name: e.target.value })}
                      required
                      placeholder="e.g., Tech Innovations Ltd"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_description">Company Description</Label>
                    <Textarea
                      id="company_description"
                      value={employerForm.company_description}
                      onChange={(e) => setEmployerForm({ ...employerForm, company_description: e.target.value })}
                      placeholder="Brief description of the company"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_website">Company Website</Label>
                    <Input
                      id="company_website"
                      value={employerForm.company_website}
                      onChange={(e) => setEmployerForm({ ...employerForm, company_website: e.target.value })}
                      type="url"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      value={employerForm.contact_email}
                      onChange={(e) => setEmployerForm({ ...employerForm, contact_email: e.target.value })}
                      type="email"
                      required
                      placeholder="employer@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={employerForm.contact_phone}
                      onChange={(e) => setEmployerForm({ ...employerForm, contact_phone: e.target.value })}
                      placeholder="+265 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={employerForm.contact_person}
                      onChange={(e) => setEmployerForm({ ...employerForm, contact_person: e.target.value })}
                      placeholder="Name of HR contact"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={employerForm.industry}
                      onChange={(e) => setEmployerForm({ ...employerForm, industry: e.target.value })}
                      placeholder="e.g., Technology, Finance"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={employerForm.location}
                      onChange={(e) => setEmployerForm({ ...employerForm, location: e.target.value })}
                      placeholder="e.g., Lilongwe, Malawi"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-find-red hover:bg-red-700">
                    <Building2 size={18} className="mr-2" />
                    {editingEmployerId ? 'Update Employer' : 'Add Employer'}
                  </Button>
                  {editingEmployerId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setEditingEmployerId(null);
                        setEmployerForm({
                          company_name: '',
                          company_description: '',
                          company_website: '',
                          contact_email: '',
                          contact_phone: '',
                          contact_person: '',
                          industry: '',
                          location: '',
                        });
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Employers List */}
            <Card>
              <CardHeader>
                <CardTitle>Registered Employers ({employers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredEmployers.map((employer) => (
                    <div key={employer.id} className="border-l-4 border-find-red pl-4 py-2 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{employer.company_name}</h3>
                        <p className="text-sm text-gray-600">{employer.contact_email}</p>
                        <p className="text-xs text-gray-500">{employer.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingEmployerId(employer.id);
                            setEmployerForm({
                              company_name: employer.company_name || '',
                              company_description: employer.company_description || '',
                              company_website: employer.company_website || '',
                              contact_email: employer.contact_email || '',
                              contact_phone: employer.contact_phone || '',
                              contact_person: employer.contact_person || '',
                              industry: employer.industry || '',
                              location: employer.location || '',
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextEmployers = employers.filter((item) => item.id !== employer.id);
                            writeLocalList('adminEmployers', nextEmployers);
                            setEmployers(nextEmployers);
                            addNotification(`Removed employer: ${employer.company_name} (${employer.contact_email})`);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredEmployers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No employers registered yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Add Job Form */}
            <Card>
              <CardHeader>
                <CardTitle>Post New Job</CardTitle>
                <CardDescription>Create a new job posting for employers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddJob} className="space-y-4">
                  <div>
                    <Label htmlFor="employer_id">Select Employer *</Label>
                    <Select value={jobForm.employer_id} onValueChange={(value) => setJobForm({ ...jobForm, employer_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employer" />
                      </SelectTrigger>
                      <SelectContent>
                        {employers.map((employer) => (
                          <SelectItem key={employer.id} value={employer.id}>
                            {employer.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="job_title">Job Title *</Label>
                    <Input
                      id="job_title"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      required
                      placeholder="e.g., Senior Software Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_description">Job Description *</Label>
                    <Textarea
                      id="job_description"
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      required
                      placeholder="Detailed job description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                      placeholder="Required skills and qualifications"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsibilities">Responsibilities</Label>
                    <Textarea
                      id="responsibilities"
                      value={jobForm.responsibilities}
                      onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                      placeholder="Key responsibilities"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_location">Location *</Label>
                    <Input
                      id="job_location"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      required
                      placeholder="e.g., Lilongwe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_category">Job Category *</Label>
                    <Input
                      id="job_category"
                      value={jobForm.job_category}
                      onChange={(e) => setJobForm({ ...jobForm, job_category: e.target.value })}
                      required
                      placeholder="e.g., Technology, Finance"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="job_type">Job Type</Label>
                      <Select value={jobForm.job_type} onValueChange={(value) => setJobForm({ ...jobForm, job_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience_level">Experience Level</Label>
                      <Select value={jobForm.experience_level} onValueChange={(value) => setJobForm({ ...jobForm, experience_level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                    <Label htmlFor="salary_min">Min Salary</Label>
                    <Input
                      id="salary_min"
                      value={formatMoney(jobForm.salary_min)}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, salary_min: e.target.value.replace(/[^\d]/g, '') })
                      }
                      type="text"
                      inputMode="numeric"
                      placeholder="1000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Max Salary</Label>
                    <Input
                      id="salary_max"
                      value={formatMoney(jobForm.salary_max)}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, salary_max: e.target.value.replace(/[^\d]/g, '') })
                      }
                      type="text"
                      inputMode="numeric"
                      placeholder="1500000"
                    />
                  </div>
                  </div>
                  <div>
                    <Label htmlFor="application_deadline">Application Deadline</Label>
                    <Input
                      id="application_deadline"
                      value={jobForm.application_deadline}
                      onChange={(e) => setJobForm({ ...jobForm, application_deadline: e.target.value })}
                      type="date"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-find-red hover:bg-red-700">
                    <Briefcase size={18} className="mr-2" />
                    {editingJobId ? 'Update Job' : 'Post Job'}
                  </Button>
                  {editingJobId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setEditingJobId(null);
                        setJobForm({
                          employer_id: '',
                          title: '',
                          description: '',
                          requirements: '',
                          responsibilities: '',
                          location: '',
                          job_type: 'full-time',
                          experience_level: 'entry',
                          salary_min: '',
                          salary_max: '',
                          application_deadline: '',
                        });
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Jobs List */}
            <Card>
              <CardHeader>
                <CardTitle>Posted Jobs ({jobs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredJobs.map((job: any) => (
                    <div key={job.id} className="border-l-4 border-find-red pl-4 py-2 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.employer_name}</p>
                        <p className="text-xs text-gray-500">{job.location} - {job.job_type}</p>
                        {job.job_category && (
                          <p className="text-xs text-gray-500">Category: {job.job_category}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                        setEditingJobId(job.id);
                        setJobForm({
                          employer_id: job.employer_id,
                          title: job.title,
                          description: job.description,
                          requirements: job.requirements,
                          responsibilities: job.responsibilities,
                          location: job.location,
                          job_type: job.job_type,
                          experience_level: job.experience_level,
                          job_category: job.job_category || '',
                          salary_min: job.salary_min ? String(job.salary_min) : '',
                          salary_max: job.salary_max ? String(job.salary_max) : '',
                          application_deadline: job.application_deadline || '',
                        });
                      }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextJobs = jobs.filter((item: any) => item.id !== job.id);
                            writeLocalList('adminJobs', nextJobs);
                            setJobs(nextJobs);
                            addNotification(`Removed job: ${job.title} at ${job.employer_name}`);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
{filteredJobs.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No jobs posted yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'homes' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Property</CardTitle>
                <CardDescription>Only active properties appear in FIND Homes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddHome} className="space-y-4" noValidate>
                  <div>
                    <Label htmlFor="home_name">Property Name *</Label>
                    <Input
                      id="home_name"
                      value={homeForm.name}
                      onChange={(e) => setHomeForm({ ...homeForm, name: e.target.value })}
                      required
                      placeholder="Modern 3-Bedroom Apartment"
                    />
                  </div>
                  <div>
                    <Label htmlFor="home_location">Location *</Label>
                    <Input
                      id="home_location"
                      value={homeForm.location}
                      onChange={(e) => setHomeForm({ ...homeForm, location: e.target.value })}
                      required
                      placeholder="Lilongwe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                    <Label htmlFor="home_price">Price (MWK) *</Label>
                    <Input
                      id="home_price"
                      type="text"
                      inputMode="numeric"
                      value={homeForm.price ? Number(homeForm.price).toLocaleString() : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, '');
                        setHomeForm({ ...homeForm, price: raw });
                      }}
                      required
                      placeholder="45000000"
                    />
                    </div>
                    <div>
                  <Label htmlFor="home_status">Status</Label>
                  <Select value={homeForm.status} onValueChange={(value) => setHomeForm({ ...homeForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Under Offer">Under Offer</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="home_listing_type">Listing Type *</Label>
                <Select
                  value={homeForm.listing_type}
                  onValueChange={(value) =>
                    setHomeForm({ ...homeForm, listing_type: value as 'sale' | 'rent' | 'airbnb' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="home_beds">Beds</Label>
                      <Input
                        id="home_beds"
                        type="number"
                        value={homeForm.beds}
                        onChange={(e) => setHomeForm({ ...homeForm, beds: e.target.value })}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="home_baths">Baths</Label>
                      <Input
                        id="home_baths"
                        type="number"
                        value={homeForm.baths}
                        onChange={(e) => setHomeForm({ ...homeForm, baths: e.target.value })}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="home_sqft">Sqft</Label>
                      <Input
                        id="home_sqft"
                        type="number"
                        value={homeForm.sqft}
                        onChange={(e) => setHomeForm({ ...homeForm, sqft: e.target.value })}
                        placeholder="1500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="home_image">Property Images (max 10) *</Label>
                    <Input
                      key={homeImageInputKey}
                      id="home_image"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        const nextFiles = files.slice(0, 10);
                        Promise.all(
                          nextFiles.map(
                            (file) =>
                              new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(String(reader.result || ''));
                                reader.readAsDataURL(file);
                              })
                          )
                        ).then((results) => {
                          setHomeForm((prev) => ({
                            ...prev,
                            image: results[0] || '',
                            images: results,
                          }));
                          setHomeImagePreviews(results);
                        });
                      }}
                    />
                    {homeImagePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {homeImagePreviews.map((src, index) => (
                          <div key={index} className="relative">
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-md shadow"
                              onClick={() => {
                                const nextImages = homeImagePreviews.filter((_, i) => i !== index);
                                setHomeImagePreviews(nextImages);
                                setHomeForm((prev) => ({
                                  ...prev,
                                  images: nextImages,
                                  image: nextImages[0] || '',
                                }));
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="home_description">Description</Label>
                    <Textarea
                      id="home_description"
                      value={homeForm.description}
                      onChange={(e) => setHomeForm({ ...homeForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="home_features">Features (comma separated)</Label>
                    <Input
                      id="home_features"
                      value={homeForm.features}
                      onChange={(e) => setHomeForm({ ...homeForm, features: e.target.value })}
                      placeholder="Parking, Security, Water Tank"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="agent_name">Agent Name *</Label>
                      <Input
                        id="agent_name"
                        value={homeForm.agent_name}
                        onChange={(e) => setHomeForm({ ...homeForm, agent_name: e.target.value })}
                        required
                        placeholder="Jane Banda"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent_phone">Agent Phone *</Label>
                      <Input
                        id="agent_phone"
                        value={homeForm.agent_phone}
                        onChange={(e) => setHomeForm({ ...homeForm, agent_phone: e.target.value })}
                        required
                        placeholder="+265 1 234 567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent_email">Agent Email *</Label>
                      <Input
                        id="agent_email"
                        type="email"
                        value={homeForm.agent_email}
                        onChange={(e) => setHomeForm({ ...homeForm, agent_email: e.target.value })}
                        required
                        placeholder="agent@find.mw"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="home_featured"
                      type="checkbox"
                      checked={homeForm.featured}
                      onChange={(e) => setHomeForm({ ...homeForm, featured: e.target.checked })}
                    />
                    <Label htmlFor="home_featured">Featured</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="home_active"
                      type="checkbox"
                      checked={homeForm.active}
                      onChange={(e) => setHomeForm({ ...homeForm, active: e.target.checked })}
                    />
                    <Label htmlFor="home_active">Active (visible to users)</Label>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-find-red hover:bg-red-700"
                    onClick={handleAddHome}
                  >
                    <Home size={18} className="mr-2" />
                    Add Property
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Properties ({homes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredHomes.map((home) => (
                    <div key={home.id} className="border-l-4 border-find-red pl-4 py-2 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{home.name}</h3>
                        <p className="text-sm text-gray-600">{home.location}</p>
                        <p className="text-xs text-gray-500">
                          {home.active ? 'Active' : 'Dormant'} - MWK {home.price.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          (async () => {
                            await deleteImages(home.imageKeys || []);
                            const nextHomes = homes.filter((item) => item.id !== home.id);
                            await setAdminHomes(nextHomes);
                            setHomes(nextHomes);
                            addNotification(`Removed home: ${home.name} in ${home.location}`);
                          })();
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {filteredHomes.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No properties added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'taxis' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Taxi Driver</CardTitle>
                <CardDescription>Only active drivers appear during booking</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDriver} className="space-y-4">
                  <div>
                    <Label htmlFor="driver_name">Driver Name *</Label>
                    <Input
                      id="driver_name"
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                      required
                      placeholder="Driver Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_phone">Phone *</Label>
                    <Input
                      id="driver_phone"
                      value={driverForm.phone}
                      onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                      required
                      placeholder="+265 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_vehicle">Vehicle *</Label>
                    <Input
                      id="driver_vehicle"
                      value={driverForm.vehicle}
                      onChange={(e) => setDriverForm({ ...driverForm, vehicle: e.target.value })}
                      required
                      placeholder="Toyota Corolla"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_plate">Plate Number</Label>
                    <Input
                      id="driver_plate"
                      value={driverForm.plate}
                      onChange={(e) => setDriverForm({ ...driverForm, plate: e.target.value })}
                      placeholder="MW-1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_location">Location</Label>
                    <Input
                      id="driver_location"
                      value={driverForm.location}
                      onChange={(e) => setDriverForm({ ...driverForm, location: e.target.value })}
                      placeholder="Lilongwe"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="driver_active"
                      type="checkbox"
                      checked={driverForm.active}
                      onChange={(e) => setDriverForm({ ...driverForm, active: e.target.checked })}
                    />
                    <Label htmlFor="driver_active">Active (available for bookings)</Label>
                  </div>
                  <Button type="submit" className="w-full bg-find-red hover:bg-red-700">
                    <Car size={18} className="mr-2" />
                    Add Driver
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drivers ({drivers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredDrivers.map((driver) => (
                    <div key={driver.id} className="border-l-4 border-find-red pl-4 py-2">
                      <h3 className="font-semibold">{driver.name}</h3>
                      <p className="text-sm text-gray-600">{driver.phone} - {driver.vehicle}</p>
                      <p className="text-xs text-gray-500">
                        {driver.active ? 'Active' : 'Dormant'} {driver.location ? `- ${driver.location}` : ''}
                      </p>
                    </div>
                  ))}
                  {filteredDrivers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No drivers added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
