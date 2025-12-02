-- Drop the 'is_customizable' column from products table
ALTER TABLE public.products DROP COLUMN IF EXISTS is_customizable;
