# Database Seeding Script

This script populates your Supabase database with sample data for testing and development.

## What it does:

1. **Clears existing data**: Removes all products and categories from the database
2. **Seeds categories**: Adds 8 sample categories with images
3. **Seeds products**: Adds 45+ sample products across all categories

## Setup:

You need the Supabase Service Role Key to run this script. Follow these steps:

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) in the sidebar
3. Go to **API** section
4. Find the **service_role** key (NOT the anon key)
5. Copy the service_role key
6. Add it to your `.env.local` file:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Running the script:

```bash
npm run seed
```

## Data included:

### Categories (8):

- Birthday Gifts
- Anniversary Gifts
- Flowers & Bouquets
- Chocolates & Sweets
- Luxury Items
- Books & Stationery
- Toys & Games
- Home Decor

### Products (45+):

- 4-6 products per category
- Realistic prices in Egyptian Pounds
- Arabic and English names/descriptions
- Stock quantities
- Product images (from Unsplash)

## ⚠️ Warning:

This script will **DELETE ALL** existing products and categories before inserting new data. Make sure you have backups if needed!

## Troubleshooting:

If you get permission errors, make sure:

1. You're using the **service_role** key (not the anon key)
2. The key is properly set in `.env.local`
3. Your Supabase project is active and accessible
