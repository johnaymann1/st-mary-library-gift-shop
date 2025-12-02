-- Create store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    store_name TEXT NOT NULL DEFAULT 'St. Mary Gift Shop',
    description TEXT NOT NULL DEFAULT 'Discover a curated collection of books, stationery, and unique gifts',
    phone TEXT NOT NULL DEFAULT '+20 123 456 7890',
    support_email TEXT NOT NULL DEFAULT 'support@stmarylibrary.com',
    address TEXT NOT NULL DEFAULT 'St Mary Church Faggalah, Cairo, Egypt',
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    free_delivery_threshold DECIMAL(10, 2),
    currency_code TEXT NOT NULL DEFAULT 'EGP',
    currency_symbol TEXT NOT NULL DEFAULT 'EGP',
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Insert default settings if not exists
INSERT INTO public.store_settings (
    id,
    store_name,
    description,
    phone,
    support_email,
    address,
    delivery_fee,
    free_delivery_threshold,
    currency_code,
    currency_symbol
)
VALUES (
    1,
    'St. Mary Gift Shop',
    'Discover a curated collection of books, stationery, and unique gifts at St Mary Library. Find the perfect gift for every occasion, from educational materials to premium gift items.',
    '+20 123 456 7890',
    'support@stmarylibrary.com',
    'St Mary Church Faggalah, Cairo, Egypt',
    50.00,
    1000.00,
    'EGP',
    'EGP'
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

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
