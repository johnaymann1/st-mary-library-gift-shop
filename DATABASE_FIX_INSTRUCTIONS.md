# 🔧 Database Fix Instructions

## Problem Fixed

- ❌ Error: `column "recipient_phone" of relation "orders" does not exist`
- ❌ Payment label showed "Cash on Delivery" even for Store Pickup

## ✅ Solutions Applied

### 1. Database Column Fix

The database has outdated column names that don't match the application code.

**To Fix: Run the migration script in Supabase**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of: `supabase/fix_orders_phone_column.sql`
6. Click **Run** or press `Ctrl/Cmd + Enter`

You should see messages like:

```
Renamed recipient_phone to phone
Renamed scheduled_delivery_date to delivery_date
```

### 2. Update the Stored Procedure

After fixing the column names, update the `place_order` function:

1. In Supabase SQL Editor, open a **New Query**
2. Copy and paste the contents of: `supabase/setup_checkout_complete.sql`
3. Click **Run**

This will recreate the `place_order` function with the correct column names.

### 3. Payment Label Fix (Already Deployed)

✅ The code now automatically shows:

- **Store Pickup**: "Cash Payment" (pay when you pick up)
- **Home Delivery**: "Cash on Delivery" (pay when you receive)

## Testing

After running the migrations, test the checkout flow:

1. Add items to cart
2. Go to checkout
3. Try both delivery options:
   - **Store Pickup** → Should show "Cash Payment"
   - **Home Delivery** → Should show "Cash on Delivery"
4. Complete an order
5. Verify it appears in Orders page

## If You Still See Errors

If you still see the `recipient_phone` error after running the migration:

1. Check if the migration ran successfully in Supabase logs
2. Verify the column was renamed:
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'orders';
   ```
3. You should see `phone` (not `recipient_phone`)

## Need Help?

If the migration fails, share the error message and I'll help debug!
