-- Cleanup old theme values and enforce new constraint
-- This migration removes old theme values (easter, summer, halloween) from the database
-- and ensures only 'default' and 'christmas' themes are allowed

DO $$ 
BEGIN
    -- Update any invalid theme values to 'default'
    UPDATE public.store_settings 
    SET active_theme = 'default' 
    WHERE active_theme NOT IN ('default', 'christmas');
    
    -- Drop existing constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'store_settings' 
        AND constraint_name LIKE '%active_theme%'
    ) THEN
        ALTER TABLE public.store_settings 
        DROP CONSTRAINT IF EXISTS store_settings_active_theme_check;
        RAISE NOTICE 'Old constraint dropped';
    END IF;
    
    -- Add new constraint with only 2 allowed themes
    ALTER TABLE public.store_settings 
    ADD CONSTRAINT store_settings_active_theme_check 
    CHECK (active_theme IN ('default', 'christmas'));
    
    RAISE NOTICE 'Theme cleanup completed - only default and christmas themes allowed';
END $$;
