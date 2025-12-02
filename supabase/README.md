# Supabase Database Setup

## Overview
This directory contains all SQL migration files needed to set up the St. Mary Library Gift Shop database.

## Prerequisites
- A Supabase project (create at https://supabase.com)
- Access to the SQL Editor in your Supabase dashboard

## Migration Order

**IMPORTANT:** Run these SQL files in the exact order listed below:

### 1. Core Schema Setup
```sql
-- File: schema.sql
-- Purpose: Creates all tables (users, products, categories, orders, etc.)
-- Run this FIRST
```

### 2. Storage Policies
```sql
-- File: storage_policy.sql
-- Purpose: Sets up storage buckets and RLS policies for images
-- Creates buckets: categories, products, payment-proofs
```

### 3. Database Triggers
```sql
-- File: triggers.sql
-- Purpose: Automatic user profile creation on signup
-- Updates stock on order placement
```

### 4. User Addresses
```sql
-- File: user_addresses.sql
-- Purpose: Creates saved addresses table for delivery
```

### 5. Checkout Function
```sql
-- File: setup_checkout_complete.sql
-- Purpose: Creates the place_order() RPC function
-- Handles atomic order creation and cart clearing
```

### 6. Product Refinements (Optional)
```sql
-- File: refine_products.sql
-- Purpose: Adds additional product fields if needed
```

### 7. Data Fixes (Run if needed)
```sql
-- File: fix_database.sql
-- Purpose: Repairs any data inconsistencies
```

```sql
-- File: fix_orders_columns.sql
-- Purpose: Updates order table columns
```

```sql
-- File: remove_customizable.sql
-- Purpose: Removes unused customization fields
```

```sql
-- File: resync.sql
-- Purpose: Re-syncs data if needed
```

```sql
-- File: add_product_images.sql
-- Purpose: Adds image URL fields to products
```

## Quick Setup Guide

### Step 1: Create Storage Buckets
1. Go to Storage in Supabase Dashboard
2. Create three public buckets:
   - `categories`
   - `products`
   - `payment-proofs`

### Step 2: Run Migrations
1. Open SQL Editor in Supabase Dashboard
2. Copy and paste contents of `schema.sql`
3. Run the query
4. Repeat for each file in order listed above

### Step 3: Verify Setup
Run this query to check all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- users
- categories
- products
- orders
- order_items
- user_addresses
- cart_items

### Step 4: Test RLS Policies
```sql
-- Test user can read their own data
SELECT * FROM users WHERE id = auth.uid();

-- Test user can read active products
SELECT * FROM products WHERE is_active = true;

-- Test user can only see their own orders
SELECT * FROM orders WHERE user_id = auth.uid();
```

## Row Level Security (RLS) Policies

### Users Table
- **SELECT**: Users can view their own profile
- **UPDATE**: Users can update their own profile
- **Admins**: Can view/edit all users

### Products Table
- **SELECT**: Everyone can view active products
- **INSERT/UPDATE/DELETE**: Admin only

### Categories Table
- **SELECT**: Everyone can view active categories
- **INSERT/UPDATE/DELETE**: Admin only

### Orders Table
- **SELECT**: Users can view their own orders, admins view all
- **INSERT**: Handled through RPC function
- **UPDATE**: Admin only (status changes)

### Cart Items Table
- **ALL**: Users can manage their own cart
- **Automatic cleanup**: Cleared on order placement

## Important Functions

### place_order(p_user_id, p_delivery_type, p_address, p_phone, p_delivery_date, p_payment_method, p_payment_proof_url)
- Creates order atomically
- Moves cart items to order_items
- Clears cart
- Returns order ID

### Example Usage:
```sql
SELECT place_order(
  'user-uuid-here',
  'delivery',
  '123 Main St, Cairo',
  '01012345678',
  NULL,
  'cash',
  NULL
);
```

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran `schema.sql` first
- Check table names are lowercase

### Error: "permission denied for table"
- RLS policies may not be set correctly
- Check user is authenticated
- Verify admin role in users table

### Error: "function place_order does not exist"
- Run `setup_checkout_complete.sql`
- Make sure function name matches exactly

### Orders not appearing
- Check RLS policies on orders table
- Verify user_id matches auth.uid()
- Check order status filter

## Data Seeding

To add sample data for testing:

### Add Categories
```sql
INSERT INTO categories (name_en, name_ar, image_url, is_active) VALUES
('Books', 'كتب', 'https://...', true),
('Stationery', 'أدوات مكتبية', 'https://...', true),
('Gifts', 'هدايا', 'https://...', true);
```

### Add Products
```sql
INSERT INTO products (name_en, name_ar, desc_en, desc_ar, price, category_id, image_url, in_stock, is_active) VALUES
('Notebook', 'دفتر', 'Premium notebook', 'دفتر فاخر', 50.00, 1, 'https://...', true, true),
('Pen Set', 'طقم أقلام', 'Quality pens', 'أقلام عالية الجودة', 75.00, 2, 'https://...', true, true);
```

### Create Admin User
```sql
-- After signup via app, update role:
UPDATE users SET role = 'admin' WHERE email = 'admin@yourdomain.com';
```

## Backup & Restore

### Backup
```bash
# Export schema
supabase db dump --file backup.sql

# Export data only
supabase db dump --data-only --file data.sql
```

### Restore
```bash
supabase db reset
psql -h db.your-project.supabase.co -U postgres -d postgres -f backup.sql
```

## Security Checklist

- [ ] All tables have RLS enabled
- [ ] Service role key is NEVER exposed to client
- [ ] Storage buckets have proper policies
- [ ] Admin checks are done on server-side
- [ ] place_order() function validates user ownership
- [ ] Sensitive data (payment proofs) are access-controlled

## Support

For issues with Supabase setup:
- Check Supabase logs in Dashboard
- Review RLS policies in Table Editor
- Test queries in SQL Editor
- Verify environment variables in app

## Migration History

| Date | File | Description |
|------|------|-------------|
| Initial | schema.sql | Core database structure |
| Initial | storage_policy.sql | Storage buckets setup |
| Initial | triggers.sql | Automatic user creation |
| Initial | user_addresses.sql | Saved addresses feature |
| Initial | setup_checkout_complete.sql | Checkout RPC function |
