-- Create separate admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table
CREATE POLICY "Admins can view their own data" ON public.admins 
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can update their own data" ON public.admins 
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Insert default admin (you can change these details)
INSERT INTO public.admins (email, full_name) 
VALUES ('admin@college.com', 'System Administrator');

-- Create function to authenticate admin
CREATE OR REPLACE FUNCTION public.authenticate_admin(admin_email TEXT)
RETURNS TABLE(admin_id UUID, email TEXT, full_name TEXT, is_active BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.email, a.full_name, a.is_active
  FROM public.admins a
  WHERE a.email = admin_email AND a.is_active = true;
END;
$$;

-- Create function to update admin last login
CREATE OR REPLACE FUNCTION public.update_admin_last_login(admin_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.admins 
  SET last_login = now() 
  WHERE email = admin_email;
END;
$$;

-- Create trigger for admin table timestamps
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update profiles table trigger to not automatically create admin profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Only create regular user profiles, not admin profiles
  IF NEW.email != 'admin@college.com' THEN
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create view for admin authentication (optional, for easier queries)
CREATE VIEW public.admin_auth_view AS
SELECT 
  id,
  email,
  full_name,
  is_active,
  last_login,
  created_at
FROM public.admins
WHERE is_active = true;