-- Update the user's profile role to admin since they exist in the admins table
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'meshram@gmail.com';