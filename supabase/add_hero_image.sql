-- Add hero_image_url column to store_settings table
-- This allows admins to dynamically change the hero image from the settings page

DO $$ 
BEGIN
    -- Add hero_image_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'hero_image_url'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN hero_image_url TEXT DEFAULT '/hero-image.jpg';
        
        -- Set the default value for existing row
        UPDATE public.store_settings 
        SET hero_image_url = '/hero-image.jpg' 
        WHERE id = 1;
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'store_settings' 
  AND column_name = 'hero_image_url';
