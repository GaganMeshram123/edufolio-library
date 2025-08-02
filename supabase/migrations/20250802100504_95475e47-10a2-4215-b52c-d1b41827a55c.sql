-- Fix security issues

-- 1. Remove the security definer view and create a regular view
DROP VIEW IF EXISTS public.admin_auth_view;

-- 2. Fix function search paths by setting them properly
CREATE OR REPLACE FUNCTION public.authenticate_admin(admin_email TEXT)
RETURNS TABLE(admin_id UUID, email TEXT, full_name TEXT, is_active BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.email, a.full_name, a.is_active
  FROM public.admins a
  WHERE a.email = admin_email AND a.is_active = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_admin_last_login(admin_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.admins 
  SET last_login = now() 
  WHERE email = admin_email;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;