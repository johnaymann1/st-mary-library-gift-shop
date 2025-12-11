-- Add enhanced store settings columns
-- Run this migration to add working hours, delivery time, multiple phones, and instapay settings

DO $$ 
BEGIN
    -- Add working_hours column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'working_hours'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN working_hours TEXT DEFAULT 'Sunday - Thursday: 9:00 AM - 9:00 PM';
    END IF;

    -- Add delivery_time_days column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'delivery_time_days'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN delivery_time_days TEXT DEFAULT '1-3 business days';
    END IF;

    -- Add phone_2 column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'phone_2'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN phone_2 TEXT;
    END IF;

    -- Add phone_3 column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'phone_3'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN phone_3 TEXT;
    END IF;

    -- Add instapay_enabled column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'instapay_enabled'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN instapay_enabled BOOLEAN DEFAULT true;
    END IF;

    -- Add instapay_phone column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'instapay_phone'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN instapay_phone TEXT DEFAULT '01000000000';
    END IF;

    -- Remove support_email column if it exists (as requested)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'support_email'
    ) THEN
        ALTER TABLE public.store_settings 
        DROP COLUMN support_email;
    END IF;

END $$;

-- Update existing record with default values
UPDATE public.store_settings
SET 
    working_hours = COALESCE(working_hours, 'Sunday - Thursday: 9:00 AM - 9:00 PM'),
    delivery_time_days = COALESCE(delivery_time_days, '1-3 business days'),
    instapay_enabled = COALESCE(instapay_enabled, true),
    instapay_phone = COALESCE(instapay_phone, '01000000000')
WHERE id = 1;
