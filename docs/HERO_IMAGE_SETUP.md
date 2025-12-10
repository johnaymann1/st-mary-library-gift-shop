# Hero Image Management Setup

## Overview
The hero image on the homepage can now be dynamically changed through the Admin Settings panel without requiring code deployments.

## Database Setup

Run this migration in your Supabase SQL Editor to add the hero image column:

```sql
-- File: supabase/add_hero_image.sql
-- This adds the hero_image_url column to store_settings table

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'hero_image_url'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN hero_image_url TEXT DEFAULT '/hero-image.jpg';
        
        UPDATE public.store_settings 
        SET hero_image_url = '/hero-image.jpg' 
        WHERE id = 1;
    END IF;
END $$;
```

## How to Use

1. **Login as Admin**: Navigate to `/login` and sign in with admin credentials

2. **Go to Settings**: Click on the Dashboard icon → Settings

3. **Upload Hero Image**:
   - Scroll to the "Hero Image" section at the top
   - Click "Choose Image" button
   - Select your new hero image (JPG, PNG, or WebP)
   - Preview appears immediately
   - Maximum file size: 5MB
   - Recommended size: 1920x1080px

4. **Save Changes**: Click "Save Changes" button at the bottom

5. **See Results**: The new hero image will appear on the homepage immediately after saving

## Technical Details

### Storage
- Images are uploaded to Supabase Storage bucket: `product-images/settings/`
- Files are named with timestamp: `hero-{timestamp}.{ext}`
- Public URLs are automatically generated and stored in database

### Validation
- **File Types**: JPG, JPEG, PNG, WebP only
- **Max Size**: 5MB
- **Error Handling**: Clear error messages for validation failures

### Performance
- Images are served from Supabase CDN
- Homepage uses Next.js Image optimization
- Priority loading for hero image (no LCP issues)

### Fallback
- If no custom image is uploaded, defaults to `/hero-image.jpg`
- Falls back to static config if database is unavailable

## Files Modified

```
src/
├── app/
│   ├── actions/admin.ts          # Image upload handling
│   ├── admin/settings/
│   │   └── settings-form.tsx     # Upload UI with preview
│   └── page.tsx                  # Uses dynamic hero image
├── utils/settings.ts             # Added hero_image_url type
supabase/
└── add_hero_image.sql           # Database migration
```

## Troubleshooting

### Image not appearing
1. Check Supabase Storage policies (should be public read)
2. Verify image was uploaded successfully in Supabase Dashboard
3. Check browser console for CORS or 404 errors

### Upload fails
1. Ensure file is under 5MB
2. Check file format (must be JPG, PNG, or WebP)
3. Verify admin permissions in database

### Old image still showing
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
2. Check if database was updated in Supabase Dashboard
3. Clear Next.js cache if in development

## Future Enhancements

Potential improvements:
- Add image cropping/editing tool
- Support for multiple hero images (carousel)
- A/B testing different hero images
- Mobile-specific hero images
- Lazy loading for off-screen images
