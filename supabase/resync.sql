-- RESYNC SCRIPT: Restores users from Auth to Public Table

-- 1. Insert missing users
INSERT INTO public.users (id, full_name, email, phone, role)
SELECT 
  id, 
  -- Try to get name from metadata, fallback to 'Restored User'
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'Restored User'),
  email, 
  -- Try to get phone from metadata (this is where your Google phone number is hiding!)
  COALESCE(raw_user_meta_data->>'phone', NULL),
  'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO UPDATE
SET
  -- If they exist but have missing info, update them
  email = EXCLUDED.email,
  phone = COALESCE(public.users.phone, EXCLUDED.phone);

-- 2. Show the result
SELECT count(*) as "Total Restored Users" FROM public.users;
