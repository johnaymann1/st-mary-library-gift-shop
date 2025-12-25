# RLS Policies Setup Guide

## Problem
Orders are not showing in the Admin Orders Management page because **Row Level Security (RLS)** is enabled on the database tables but **no policies were defined**. This blocks all access by default.

## Solution
Apply the RLS policies defined in `rls_policies.sql` to your Supabase database.

## How to Apply

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `rls_policies.sql`
4. Paste into a new query
5. Click **Run**

### Option 2: Supabase CLI
```bash
supabase db push
```

## What These Policies Do

### Orders Table
- ✅ **Users** can view/create/update their own orders
- ✅ **Admins** can view and update ALL orders (required for Orders Management)

### Order Items Table  
- ✅ **Users** can view/create items for their own orders
- ✅ **Admins** can view/manage all order items

### Products, Categories, Cart
- ✅ Public read access for active items
- ✅ Admin full control

## Verification

After applying, test:
1. Log in as **admin**
2. Go to **/admin/orders**
3. You should now see all orders (including InstaPay orders)
4. The "Verify Payment" button should work for `pending_payment` orders

## Security Notes

- RLS is **essential** for multi-tenant security
- Never disable RLS in production
- Policies ensure users only see their own data
- Admins have full access for management

## Troubleshooting

If orders still don't show:
1. Verify your user has `role = 'admin'` in the `users` table
2. Check browser console for errors
3. Verify RLS policies were applied: 
   - Go to **Table Editor** → **orders** → **Policies**
   - Should see "Admins can view all orders" policy

## Admin Authentication Fix

The file `src/app/actions/admin/orders.ts` has been updated to include proper admin authentication checks. All admin actions now verify:
1. User is logged in
2. User has admin role

This prevents unauthorized access to admin functions.
