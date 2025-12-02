# Quick Reference Guide - St. Mary Library

## 🚀 Getting Started

### Development

```bash
npm run dev
# Opens at http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📂 Key Files Location

### Pages

- **Home:** `/src/app/page.tsx`
- **Login:** `/src/app/(auth)/login/page.tsx`
- **Register:** `/src/app/(auth)/register/page.tsx`
- **Cart:** `/src/app/cart/page.tsx`
- **Checkout:** `/src/app/checkout/page.tsx`
- **Account:** `/src/app/account/page.tsx`
- **Product Detail:** `/src/app/product/[id]/page.tsx`
- **Category:** `/src/app/category/[id]/page.tsx`

### Admin Pages

- **Dashboard:** `/src/app/admin/page.tsx`
- **Categories:** `/src/app/admin/categories/page.tsx`
- **Products:** `/src/app/admin/products/page.tsx`

### Server Actions

- **Auth:** `/src/app/actions/auth.ts`
- **Checkout:** `/src/app/actions/checkout.ts`
- **Cart:** `/src/app/actions/cart.ts`
- **Address:** `/src/app/actions/address.ts`
- **Admin:** `/src/app/actions/admin.ts`

### Components

- **Navbar:** `/src/components/Navbar.tsx`
- **Cart Context:** `/src/context/CartContext.tsx`
- **UI Components:** `/src/components/ui/` (Shadcn)

---

## 🗄️ Database Setup (Supabase)

### Required SQL Scripts (Run in order)

1. **Core Schema:** `supabase/schema.sql`
2. **Storage Policies:** `supabase/storage_policy.sql`
3. **Triggers:** `supabase/triggers.sql`
4. **Checkout System:** `supabase/setup_checkout_complete.sql`
5. **Address Management:** `supabase/user_addresses.sql`

### Database Tables

```
├── users (extended from auth.users)
├── categories
├── products
├── cart
├── orders
├── order_items
└── user_addresses
```

---

## 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🎨 Theme & Design

### Colors

- **Primary:** Rose (rose-600)
- **Secondary:** Pink (pink-600)
- **Neutral:** Gray (neutral-900)

### Key Tailwind Classes

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card: `bg-white rounded-xl shadow-lg border border-neutral-200`
- Button: `bg-gradient-to-r from-rose-600 to-pink-600`

---

## 🛒 Checkout Flow

### 4 Combinations

1. **Store Pickup + Cash**
   - No address/phone required
   - Status: "processing"
2. **Store Pickup + InstaPay**

   - No address/phone required
   - Payment proof required
   - Status: "payment_pending"

3. **Home Delivery + Cash**

   - Address & phone required
   - 50 EGP delivery fee
   - Status: "processing"

4. **Home Delivery + InstaPay**
   - Address & phone required
   - Payment proof required
   - 50 EGP delivery fee
   - Status: "payment_pending"

---

## 🧪 Testing Checklist

### Before Production

- [ ] All 4 checkout combinations work
- [ ] Address save/edit/delete works
- [ ] Image uploads work (products & payment proofs)
- [ ] Google OAuth works
- [ ] Mobile UI looks good
- [ ] Admin dashboard accessible
- [ ] Cart persists across sessions

### Test Accounts

Create test users with different roles:

- Regular user
- Admin user (set `is_admin` in users table)

---

## 🐛 Common Issues & Fixes

### Issue: "Navbar covers content"

**Fix:** Root layout has `pt-20` on body element

### Issue: "Checkout fails with 'invalid payment method'"

**Fix:** Ensure SQL uses 'cash' and 'instapay' (not 'cod')

### Issue: "Image upload fails"

**Fix:** Run `setup_checkout_complete.sql` to create storage bucket

### Issue: "Address doesn't save"

**Fix:** Run `user_addresses.sql` to create table

### Issue: "Build fails"

**Fix:** Run `npm run build` - should compile with 0 errors

---

## 📱 Mobile Optimization

### Key Features

- Icons hidden on mobile inputs (shown on desktop)
- Responsive grid layouts (1 col mobile, 2 col desktop)
- Touch-friendly button sizes (h-11, h-12)
- Proper spacing (gap-y-6 for mobile stacking)
- Fixed navbar with proper padding

---

## 🔧 Maintenance

### Regular Tasks

1. Update npm packages monthly
2. Monitor Supabase usage/limits
3. Check error logs in Supabase dashboard
4. Backup database regularly
5. Review and optimize images in storage

### Performance

- Images auto-optimized by Next.js
- Server components for better SEO
- Client components only where needed (cart, forms)

---

## 📊 Analytics (Optional)

### Add Google Analytics

1. Get GA4 tracking ID
2. Add to `layout.tsx`
3. Track key events:
   - Product views
   - Add to cart
   - Checkout started
   - Order completed

---

## 🚨 Emergency Procedures

### Site Down

1. Check Vercel/hosting status
2. Check Supabase status
3. Review recent deployments
4. Check environment variables

### Database Issues

1. Check RLS policies
2. Verify table structures
3. Check function definitions
4. Review recent migrations

### Build Failures

1. Run `npm run build` locally
2. Check TypeScript errors
3. Verify all imports
4. Check environment variables

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Shadcn UI:** https://ui.shadcn.com

---

## ✅ Production Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Vercel

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

**Last Updated:** November 29, 2025
