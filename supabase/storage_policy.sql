-- 1. CATEGORIES BUCKET POLICIES

-- Drop existing policies to avoid errors
DROP POLICY IF EXISTS "Public Access Categories" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Categories" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Categories" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Categories" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public Access Categories"
ON storage.objects FOR SELECT
USING ( bucket_id = 'categories' );

-- Allow authenticated users to upload
CREATE POLICY "Auth Upload Categories"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'categories' );

-- Allow authenticated users to update
CREATE POLICY "Auth Update Categories"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'categories' );

-- Allow authenticated users to delete
CREATE POLICY "Auth Delete Categories"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'categories' );


-- 2. PRODUCTS BUCKET POLICIES

-- Drop existing policies to avoid errors
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Products" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Products" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Products" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public Access Products"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Allow authenticated users to upload
CREATE POLICY "Auth Upload Products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'products' );

-- Allow authenticated users to update
CREATE POLICY "Auth Update Products"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'products' );

-- Allow authenticated users to delete
CREATE POLICY "Auth Delete Products"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'products' );
