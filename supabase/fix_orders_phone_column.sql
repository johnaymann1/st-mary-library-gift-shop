-- Fix orders table: rename recipient_phone to phone
-- This migration ensures the column name matches what the application expects

DO $$ 
BEGIN
    -- Check if recipient_phone exists and phone doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='orders' AND column_name='recipient_phone')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='orders' AND column_name='phone') THEN
        ALTER TABLE orders RENAME COLUMN recipient_phone TO phone;
        RAISE NOTICE 'Renamed recipient_phone to phone';
    -- If phone already exists and recipient_phone exists, drop recipient_phone
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='orders' AND column_name='phone')
          AND EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='orders' AND column_name='recipient_phone') THEN
        ALTER TABLE orders DROP COLUMN recipient_phone;
        RAISE NOTICE 'Dropped duplicate recipient_phone column';
    ELSE
        RAISE NOTICE 'Column structure already correct';
    END IF;
END $$;

-- Also rename scheduled_delivery_date to delivery_date if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='orders' AND column_name='scheduled_delivery_date')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='orders' AND column_name='delivery_date') THEN
        ALTER TABLE orders RENAME COLUMN scheduled_delivery_date TO delivery_date;
        RAISE NOTICE 'Renamed scheduled_delivery_date to delivery_date';
    END IF;
END $$;
