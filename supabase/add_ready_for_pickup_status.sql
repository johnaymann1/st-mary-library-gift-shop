-- Add ready_for_pickup status for store pickup orders
-- This migration adds the new status and ensures logical status flow

-- Step 1: Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Add the new constraint with ready_for_pickup
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending_payment', 'processing', 'out_for_delivery', 'ready_for_pickup', 'completed', 'cancelled'));

-- Step 3: Update any out_for_delivery status to ready_for_pickup for pickup orders
UPDATE orders 
SET status = 'ready_for_pickup'
WHERE delivery_type = 'pickup' AND status = 'out_for_delivery';

-- Verify the changes
DO $$ 
BEGIN
    RAISE NOTICE 'Status constraint updated successfully!';
    RAISE NOTICE 'Valid statuses: pending_payment, processing, out_for_delivery, ready_for_pickup, completed, cancelled';
END $$;
