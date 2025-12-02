-- Add realistic product images using placeholder service
-- Books Category Images
UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Book'
WHERE name_en ILIKE '%book%' AND category_id IN (SELECT id FROM categories WHERE name_en ILIKE '%book%')
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Novel'
WHERE name_en ILIKE '%novel%' 
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Journal'
WHERE name_en ILIKE '%journal%' OR name_en ILIKE '%notebook%'
AND (image_url IS NULL OR image_url = '');

-- Stationery Category Images
UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Pen'
WHERE name_en ILIKE '%pen%' AND category_id IN (SELECT id FROM categories WHERE name_en ILIKE '%stationery%')
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Pencil'
WHERE name_en ILIKE '%pencil%'
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Marker'
WHERE name_en ILIKE '%marker%' OR name_en ILIKE '%highlighter%'
AND (image_url IS NULL OR image_url = '');

-- Gift Items
UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Gift'
WHERE name_en ILIKE '%gift%' AND category_id IN (SELECT id FROM categories WHERE name_en ILIKE '%gift%')
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Present'
WHERE name_en ILIKE '%present%' OR name_en ILIKE '%box%'
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Wrap'
WHERE name_en ILIKE '%wrap%'
AND (image_url IS NULL OR image_url = '');

-- Art Supplies
UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Paint'
WHERE name_en ILIKE '%paint%' OR name_en ILIKE '%color%'
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Paper'
WHERE name_en ILIKE '%paper%'
AND (image_url IS NULL OR image_url = '');

-- Planners & Organizers
UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Planner'
WHERE name_en ILIKE '%planner%' OR name_en ILIKE '%organizer%'
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Calendar'
WHERE name_en ILIKE '%calendar%'
AND (image_url IS NULL OR image_url = '');

-- Office Supplies
UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Folder'
WHERE name_en ILIKE '%folder%' OR name_en ILIKE '%binder%'
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Clips'
WHERE name_en ILIKE '%clip%' OR name_en ILIKE '%stapler%'
AND (image_url IS NULL OR image_url = '');

-- Cards & Decorative Items
UPDATE products 
SET image_url = 'https://placehold.co/800x800/ec4899/white?text=Card'
WHERE name_en ILIKE '%card%' OR name_en ILIKE '%greeting%'
AND (image_url IS NULL OR image_url = '');

UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Sticker'
WHERE name_en ILIKE '%sticker%' OR name_en ILIKE '%decoration%'
AND (image_url IS NULL OR image_url = '');

-- Default fallback for remaining products without images
UPDATE products 
SET image_url = 'https://placehold.co/800x800/f43f5e/white?text=Product'
WHERE image_url IS NULL OR image_url = '';

-- Verify update
SELECT 
    COUNT(*) as total_products,
    COUNT(image_url) as products_with_images,
    COUNT(*) - COUNT(image_url) as products_without_images
FROM products;
