# Fix Cart Foreign Key Constraint

## Problem
You're getting this error when trying to update or delete products:
```
update or delete on table "products" violates foreign key constraint "cart_product_id_fkey" on table "cart"
```

This happens because products that are in users' carts cannot be deleted or updated due to the foreign key constraint.

## Solution
Run the SQL migration in `fix_cart_foreign_key.sql` to update the foreign key constraint to use CASCADE behavior.

## How to Run

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/fix_cart_foreign_key.sql`
4. Paste and run the SQL script
5. You should see a success message

### Option 2: Supabase CLI
```bash
npx supabase db execute -f supabase/fix_cart_foreign_key.sql
```

## What This Does

The migration updates the foreign key constraint on the `cart` table to use **CASCADE** behavior:

- **ON DELETE CASCADE**: When a product is deleted, all cart items for that product are automatically deleted
- **ON UPDATE CASCADE**: When a product ID is updated, cart items automatically reference the new ID

## After Running

Once the migration is complete, you'll be able to:
- ✅ Delete products even if they're in shopping carts
- ✅ Update products without foreign key errors
- ✅ Cart items will automatically be cleaned up when products are deleted

## Verification

After running the migration, verify it worked:

```sql
-- Check the constraint
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='cart'
  AND kcu.column_name='product_id';
```

You should see:
- `delete_rule`: CASCADE
- `update_rule`: CASCADE

## Important Note

After running this migration, deleting a product will automatically remove it from all shopping carts. This is the expected behavior and keeps your database consistent.
