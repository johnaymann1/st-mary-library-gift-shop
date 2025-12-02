-- Migrate existing store_settings table to add new columns
-- Run this if you already have a store_settings table

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add support_email column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'support_email'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN support_email TEXT NOT NULL DEFAULT 'support@stmarylibrary.com';
    END IF;

    -- Add description column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN description TEXT NOT NULL DEFAULT 'Discover a curated collection of books, stationery, and unique gifts';
    END IF;

    -- Add free_delivery_threshold column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'free_delivery_threshold'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN free_delivery_threshold DECIMAL(10, 2);
    END IF;

    -- Add currency_code column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'currency_code'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'EGP';
    END IF;

    -- Add currency_symbol column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'currency_symbol'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN currency_symbol TEXT NOT NULL DEFAULT 'EGP';
    END IF;

    -- Add facebook_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'facebook_url'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN facebook_url TEXT;
    END IF;

    -- Add instagram_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'instagram_url'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN instagram_url TEXT;
    END IF;

    -- Add twitter_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'twitter_url'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN twitter_url TEXT;
    END IF;

    -- Add linkedin_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'linkedin_url'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN linkedin_url TEXT;
    END IF;
END $$;

-- Update existing row with better defaults if values are null or default
UPDATE public.store_settings
SET 
    description = COALESCE(description, 'Discover a curated collection of books, stationery, and unique gifts at St Mary Library. Find the perfect gift for every occasion, from educational materials to premium gift items.'),
    support_email = COALESCE(support_email, 'support@stmarylibrary.com'),
    free_delivery_threshold = COALESCE(free_delivery_threshold, 1000.00),
    currency_code = COALESCE(currency_code, 'EGP'),
    currency_symbol = COALESCE(currency_symbol, 'EGP')
WHERE id = 1;

-- Enable RLS if not already enabled
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Allow admins to update store settings" ON public.store_settings;

-- Allow everyone to read settings
CREATE POLICY "Allow public read access to store settings"
ON public.store_settings
FOR SELECT
TO public
USING (true);

-- Only admins can update settings
CREATE POLICY "Allow admins to update store settings"
ON public.store_settings
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_store_settings_updated_at ON public.store_settings;
CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON public.store_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
