-- Add sale features to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMP WITH TIME ZONE;

-- Add comments for clarity
COMMENT ON COLUMN products.sale_price IS 'Optional discounted price. If set, this is the active sale price';
COMMENT ON COLUMN products.sale_end_date IS 'Optional end date for the sale. If null, sale runs indefinitely until removed';

-- Create index for active sales queries
CREATE INDEX IF NOT EXISTS idx_products_active_sales 
ON products(sale_price, sale_end_date) 
WHERE sale_price IS NOT NULL;
