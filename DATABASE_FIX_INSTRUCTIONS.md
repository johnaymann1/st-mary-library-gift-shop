# 🔧 Database Fix Instructions

## ⚠️ CRITICAL: Run These Migrations First!

**You are seeing this error:**

```
new row for relation "orders" violates check constraint "orders_status_check"
```

**This means the database constraint is outdated and doesn't include the new statuses.**

You **MUST** run the migration scripts below to fix this!

---

## Problems Fixed

1. ❌ Error: `column "recipient_phone" of relation "orders" does not exist`
2. ❌ Payment label showed "Cash on Delivery" even for Store Pickup
3. ❌ Cash orders showed "Pending Payment" status (illogical)
4. ❌ Store Pickup orders showed "Out for Delivery" (doesn't make sense)

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

### 2. Add Smart Order Status Flow

Orders now have logical status transitions based on payment method and delivery type.

**To Fix: Run these migration scripts**

1. In Supabase SQL Editor, open a **New Query**
2. Copy and paste: `supabase/add_ready_for_pickup_status.sql`
3. Click **Run**
4. Then copy and paste: `supabase/setup_checkout_complete.sql`
5. Click **Run**

**New Status Logic:**

📦 **Cash Payment:**

- Skips "Pending Payment"
- Goes directly to "Processing"
- Flow: `processing` → `[ready_for_pickup/out_for_delivery]` → `completed`

💳 **InstaPay Payment:**

- Requires approval
- Flow: `pending_payment` → `processing` → `[ready_for_pickup/out_for_delivery]` → `completed`

🏪 **Store Pickup:**

- Uses "Ready for Pickup" status (purple badge)
- Flow: `processing` → `ready_for_pickup` → `completed`

🚚 **Home Delivery:**

- Uses "Out for Delivery" status
- Flow: `processing` → `out_for_delivery` → `completed`

### 3. Payment Label Fix (Already Deployed)

✅ The code now automatically shows:

- **Store Pickup**: "Cash Payment" (pay when you pick up)
- **Home Delivery**: "Cash on Delivery" (pay when you receive)

### 4. Admin Dashboard Improvements (Already Deployed)

✅ Status dropdown is context-aware:

- Only shows "Pending Payment" for InstaPay orders
- Shows "Ready for Pickup" for pickup orders
- Shows "Out for Delivery" for delivery orders

## Complete Migration Steps

Run these SQL scripts **in order**:

1. **Fix column names:** `supabase/fix_orders_phone_column.sql`
2. **Add new status:** `supabase/add_ready_for_pickup_status.sql`
3. **Update RPC function:** `supabase/setup_checkout_complete.sql`

## Testing

After running the migrations, test the checkout flow:

### Cash Payment + Store Pickup

1. Add items to cart
2. Go to checkout
3. Select "Store Pickup"
4. Select "Cash Payment"
5. Place order
6. ✅ Should start at "Processing" (not "Pending Payment")
7. Admin can move to "Ready for Pickup"

### Cash Payment + Home Delivery

1. Add items to cart
2. Go to checkout
3. Select "Home Delivery"
4. Select "Cash on Delivery"
5. Place order
6. ✅ Should start at "Processing"
7. Admin can move to "Out for Delivery"

### InstaPay + Any Delivery Type

1. Add items to cart
2. Go to checkout
3. Select delivery type
4. Select "InstaPay" and upload proof
5. Place order
6. ✅ Should start at "Pending Payment"
7. Admin approves → moves to "Processing"

## Valid Order Statuses

| Status             | Description                      | Used For                            |
| ------------------ | -------------------------------- | ----------------------------------- |
| `pending_payment`  | Waiting for payment confirmation | InstaPay orders only                |
| `processing`       | Order is being prepared          | All orders (initial state for cash) |
| `out_for_delivery` | On the way to customer           | Home delivery only                  |
| `ready_for_pickup` | Ready to be picked up            | Store pickup only                   |
| `completed`        | Order fulfilled                  | All orders                          |
| `cancelled`        | Order cancelled                  | All orders                          |

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
