-- 1. Ensure Email Column Exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text;

-- 2. Force Phone to be Nullable (Crucial for Google Auth)
ALTER TABLE public.users ALTER COLUMN phone DROP NOT NULL;

-- 3. Re-create the Handle New User Function (Robust Version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', NULL),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. BACKFILL: Insert existing users who are missing from public.users
INSERT INTO public.users (id, full_name, email, phone, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'Existing User'),
  email, 
  COALESCE(raw_user_meta_data->>'phone', NULL),
  'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- 6. Check Results (Optional - just for output)
SELECT count(*) as "Total Users in Public Table" FROM public.users;
