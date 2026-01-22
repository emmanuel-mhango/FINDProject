-- Create admin_users table FIRST (needed by policies)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '["manage_employers", "manage_jobs", "view_applications"]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employers table
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_description TEXT,
  company_website TEXT,
  company_logo TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_person TEXT,
  industry TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  salary_currency TEXT DEFAULT 'MWK',
  application_deadline DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- NOW enable RLS and create policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Admin users policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can view admin_users') THEN
    CREATE POLICY "Only admins can view admin_users" ON public.admin_users FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- Employers policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers are viewable by everyone') THEN
    CREATE POLICY "Employers are viewable by everyone" ON public.employers FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can create employers') THEN
    CREATE POLICY "Only admins can create employers" ON public.employers FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can update employers') THEN
    CREATE POLICY "Only admins can update employers" ON public.employers FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- Jobs policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Jobs are viewable by everyone') THEN
    CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can create jobs') THEN
    CREATE POLICY "Only admins can create jobs" ON public.jobs FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can update jobs') THEN
    CREATE POLICY "Only admins can update jobs" ON public.jobs FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- Resumes policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own resumes') THEN
    CREATE POLICY "Users can view their own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload their own resumes') THEN
    CREATE POLICY "Users can upload their own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own resumes') THEN
    CREATE POLICY "Users can update their own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Job applications policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own applications') THEN
    CREATE POLICY "Users can view their own applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own applications') THEN
    CREATE POLICY "Users can create their own applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all applications') THEN
    CREATE POLICY "Admins can view all applications" ON public.job_applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- Feedback policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Feedback is viewable by everyone') THEN
    CREATE POLICY "Feedback is viewable by everyone" ON public.feedback FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own feedback') THEN
    CREATE POLICY "Users can create their own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON public.jobs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Create triggers for timestamps (if not already exist)
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_employers_updated_at ON public.employers;
CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON public.employers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
