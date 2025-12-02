-- Fix orders table columns to match the application usage

-- First, drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Update any invalid status values to valid ones before adding constraint
-- Map old/invalid statuses to valid ones
UPDATE orders 
SET status = CASE 
    WHEN status = 'payment_confirmation_pending' THEN 'pending_payment'
    WHEN status = 'wrapping' THEN 'processing'
    WHEN status NOT IN ('pending_payment', 'processing', 'out_for_delivery', 'completed', 'cancelled') 
        THEN 'pending_payment'
    ELSE status
END;

-- Add the updated constraint with correct status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending_payment', 'processing', 'out_for_delivery', 'completed', 'cancelled'));

-- Rename recipient_phone to phone for consistency (only if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='orders' AND column_name='recipient_phone') THEN
        ALTER TABLE orders RENAME COLUMN recipient_phone TO phone;
    END IF;
END $$;

-- Rename scheduled_delivery_date to delivery_date for consistency (only if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='orders' AND column_name='scheduled_delivery_date') THEN
        ALTER TABLE orders RENAME COLUMN scheduled_delivery_date TO delivery_date;
    END IF;
END $$;

-- Add delivery_address column if it doesn't exist (it should already exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='delivery_address') THEN
        ALTER TABLE orders ADD COLUMN delivery_address text;
    END IF;
END $$;
