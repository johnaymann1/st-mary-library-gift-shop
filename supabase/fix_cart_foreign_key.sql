-- Fix cart foreign key constraint to handle product deletion/updates
-- This migration updates the foreign key to CASCADE on delete/update
-- so when a product is deleted or updated, cart items are automatically handled

-- Drop the existing foreign key constraint
ALTER TABLE cart 
DROP CONSTRAINT IF EXISTS cart_product_id_fkey;

-- Add the new foreign key constraint with CASCADE
ALTER TABLE cart 
ADD CONSTRAINT cart_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- This ensures that:
-- 1. When a product is deleted, all cart items for that product are automatically deleted
-- 2. When a product ID is updated, cart items are automatically updated to reference the new ID
