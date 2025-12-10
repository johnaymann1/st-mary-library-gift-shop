-- Make support_email optional in store_settings table
-- This allows admins to leave the support email field empty if not needed

DO $$ 
BEGIN
    -- Remove NOT NULL constraint from support_email if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'support_email' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.store_settings 
        ALTER COLUMN support_email DROP NOT NULL;
        
        RAISE NOTICE 'support_email column is now optional';
    ELSE
        RAISE NOTICE 'support_email column was already optional';
    END IF;
END $$;

-- Verify the change
SELECT column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'store_settings' 
  AND column_name = 'support_email';
