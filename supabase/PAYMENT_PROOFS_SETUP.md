# Payment Proofs Storage Setup

## Overview
This guide will help you set up the `payment-proofs` storage bucket in Supabase for InstaPay payment verification.

## Prerequisites
- Access to your Supabase project dashboard
- Admin access to the database

## Step 1: Create the Storage Bucket

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New Bucket**
3. Configure the bucket:
   - **Name**: `payment-proofs`
   - **Public**: ❌ **NO** (Keep it private for security)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

## Step 2: Apply Storage Policies

1. Go to **SQL Editor**
2. Copy the payment-proofs policies from `storage_policy.sql` (lines starting with "-- 3. PAYMENT PROOFS BUCKET POLICIES")
3. Run the SQL

### What These Policies Do:

**Upload Policy** (`Auth Upload Payment Proofs`):
- ✅ Any authenticated user can upload payment proof images
- 🔒 Only during checkout for InstaPay orders

**Admin View Policy** (`Admin Access Payment Proofs`):
- ✅ Admins can view ALL payment proofs
- 🔑 Required for payment verification in Orders Management

**User View Policy** (`User Access Own Payment Proofs`):
- ✅ Users can view their own payment proofs
- ✅ Linked through orders table (only their orders)

## Step 3: Verify Setup

### Test Upload (as Customer)
1. Add items to cart
2. Go to checkout
3. Select **InstaPay** payment method
4. Upload a payment proof screenshot
5. Complete order
6. Check that image URL is saved in `orders.payment_proof_url`

### Test Admin View
1. Log in as admin
2. Go to **Orders Management** (`/admin/orders`)
3. Find an InstaPay order with `pending_payment` status
4. Click **Verify Payment**
5. You should see the payment proof image

## Troubleshooting

### Upload Fails
**Error**: "Image upload failed"
- ✅ Check bucket name is exactly `payment-proofs`
- ✅ Verify bucket exists in Storage
- ✅ Check file size is under 5MB
- ✅ Verify file type is JPG, PNG, or WebP

### Admin Can't See Payment Proofs
**Error**: "Unauthorized" or image doesn't load
- ✅ Apply the Admin Access policy from storage_policy.sql
- ✅ Verify user has `role = 'admin'` in users table
- ✅ Check RLS policies are enabled and correct

### User Can't See Their Own Payment Proof
- ✅ Apply the User Access policy
- ✅ Verify the payment_proof_url in orders table matches the file name
- ✅ Check the user is logged in

## Security Notes

🔒 **The bucket is PRIVATE** - only authorized users can access images:
- Customers can only see their own payment proofs
- Admins can see all payment proofs for verification
- Public cannot access any payment proofs

🚨 **Never make this bucket public** - payment proofs contain sensitive financial information.

## Flow Diagram

```
Customer Checkout (InstaPay)
    ↓
Upload Payment Proof Screenshot
    ↓
File saved to payment-proofs bucket
    ↓
URL saved to orders.payment_proof_url
    ↓
Order status: pending_payment
    ↓
Admin Reviews in Orders Management
    ↓
Admin Clicks "Verify Payment"
    ↓
Payment proof image loads in modal
    ↓
Admin Approves/Rejects
    ↓
Order status: processing/cancelled
```

## Related Files
- `/src/services/storage.ts` - `uploadPaymentProof()` function
- `/src/app/actions/checkout.ts` - Payment proof validation and upload
- `/src/app/actions/admin/orders.ts` - Payment verification actions
- `/supabase/storage_policy.sql` - Storage bucket policies
