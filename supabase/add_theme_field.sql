-- Add active_theme column to store_settings table for seasonal theme management
-- This allows admins to override automatic theme selection

DO $$ 
BEGIN
    -- Add active_theme column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'active_theme'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN active_theme TEXT NOT NULL DEFAULT 'default' 
        CHECK (active_theme IN ('default', 'christmas', 'easter', 'summer', 'halloween'));
        
        RAISE NOTICE 'Column active_theme added successfully';
    ELSE
        RAISE NOTICE 'Column active_theme already exists';
    END IF;
END $$;
