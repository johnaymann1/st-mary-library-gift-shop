-- 1. Add 'in_stock' column, defaulting to true
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock boolean DEFAULT true;

-- 2. (Optional) Backfill data: If stock > 0, set in_stock = true, else false
UPDATE public.products SET in_stock = (stock_quantity > 0);

-- 3. Drop the old 'stock_quantity' column
ALTER TABLE public.products DROP COLUMN IF EXISTS stock_quantity;
