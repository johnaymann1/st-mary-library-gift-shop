# 🎁 St. Mary Library Gift Shop

A modern, full-featured e-commerce platform built with Next.js 15, Supabase, and TypeScript. Features a beautiful bilingual (English/Arabic) interface, complete admin panel, and seamless checkout experience.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing**: Browse products by category with advanced search and filters
- **Shopping Cart**: Real-time cart management with quantity updates
- **Bilingual Support**: Full English and Arabic language support
- **User Authentication**: Secure login via email/password or Google OAuth
- **Order Tracking**: Visual order status timeline from payment to delivery
- **Saved Addresses**: Store multiple delivery addresses for quick checkout
- **Payment Options**: Cash on delivery or InstaPay with proof upload
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)

### 👨‍💼 Admin Features
- **Dashboard**: Overview of orders, products, and revenue
- **Product Management**: Create, edit, delete products with image upload
- **Category Management**: Organize products into categories
- **Order Management**: 
  - View all orders with filters by status
  - Update order status (pending → processing → delivery → completed)
  - Approve/reject InstaPay payment proofs
  - Cancel orders with reason notes
- **Inventory Control**: Mark products as in-stock or out-of-stock
- **Role-Based Access**: Secure admin-only routes

### 🔒 Security & Performance
- **Row Level Security (RLS)**: Supabase RLS policies protect user data
- **Server Actions**: Secure server-side data mutations
- **Image Optimization**: Next.js Image component for optimized images
- **Type Safety**: Full TypeScript with Zod validation
- **Error Boundaries**: Graceful error handling throughout the app
- **Loading States**: Skeleton loaders for better UX

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Supabase real-time subscriptions

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **Storage**: Supabase Storage (images)
- **Email**: Resend API (transactional emails)
- **ORM**: Supabase Client SDK

### DevOps
- **Deployment**: Vercel (recommended)
- **Version Control**: Git
- **Code Quality**: ESLint + TypeScript strict mode

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: 18.x or later ([Download](https://nodejs.org/))
- **npm**: 9.x or later (comes with Node.js)
- **Supabase Account**: [Sign up free](https://supabase.com)
- **Resend Account**: [Sign up](https://resend.com) (optional, for emails)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/johnaymann1/st-mary-library-gift-shop.git
cd st-mary-library-gift-shop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase (from https://app.supabase.com/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Resend (from https://resend.com/api-keys)
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=admin@yourdomain.com

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

See detailed instructions in [`supabase/README.md`](./supabase/README.md)

**Quick setup:**

1. Go to your Supabase project dashboard
2. Open SQL Editor
3. Run migrations in order:
   - `schema.sql` (core tables)
   - `storage_policy.sql` (file storage)
   - `triggers.sql` (auto-create user profiles)
   - `user_addresses.sql` (saved addresses)
   - `setup_checkout_complete.sql` (checkout function)

### 5. Create Storage Buckets

In Supabase Dashboard → Storage, create these **public** buckets:
- `categories`
- `products`
- `payment-proofs`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── admin/               # Admin panel
│   │   ├── actions/             # Server actions
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout flow
│   │   ├── orders/              # Order history & details
│   │   ├── product/             # Product details
│   │   ├── search/              # Search & filters
│   │   └── error.tsx            # Global error boundary
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Base UI components
│   │   ├── emails/              # Email templates
│   │   └── navbar/              # Navigation components
│   │
│   ├── lib/                     # Utilities
│   │   ├── validation.ts        # Zod schemas
│   │   ├── resend.ts            # Email client
│   │   └── utils.ts             # Helper functions
│   │
│   ├── types/                   # TypeScript types
│   ├── utils/supabase/          # Supabase clients
│   ├── config/                  # App configuration
│   └── context/                 # React contexts
│
├── supabase/                    # Database migrations
├── public/                      # Static assets
└── .env.example                 # Environment template
```

## 🎨 Key Features Implementation

### Authentication Flow
```typescript
// Login with email/password
await loginWithEmail(email, password)

// Login with Google OAuth
await loginWithGoogle()

// Protected routes (middleware.ts)
if (!user && isProtectedRoute) redirect('/login')
```

### Shopping Cart
```typescript
// Add to cart (creates cart_items row)
await addToCart(productId, quantity)

// Cart persists in Supabase, syncs across devices
const { cart } = useCart()
```

### Checkout Process
```typescript
// 1. Select delivery method (delivery / pickup)
// 2. Enter address & phone (if delivery)
// 3. Choose payment (cash / instapay)
// 4. Upload proof (if instapay)
// 5. Place order (RPC function handles atomically)
await placeOrder(formData)
```

### Order Status Timeline
```typescript
// Visual tracking: Pending → Processing → Delivery → Completed
<OrderStatusTimeline 
  status={order.status}
  createdAt={order.created_at}
  updatedAt={order.updated_at}
/>
```

## 🔐 Admin Access

### Creating an Admin User

1. Sign up normally at `/register`
2. In Supabase Dashboard, run:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

3. Access admin panel at `/admin`

### Admin Permissions

Admin users can:
- ✅ View dashboard with stats
- ✅ Manage products (CRUD)
- ✅ Manage categories (CRUD)
- ✅ View and update orders
- ✅ Approve/reject payment proofs
- ✅ Upload images to storage

## 📧 Email Configuration

The app sends transactional emails via [Resend](https://resend.com):

- **Order Confirmation**: Sent to customer after checkout
- **Admin Notification**: Sent to admin on new order

### Email Templates

Located in `src/components/emails/`:
- `OrderReceipt.tsx` - Customer order confirmation
- `WelcomeEmail.tsx` - Welcome email on signup

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)

4. Deploy!

### Important Post-Deployment Steps

- ✅ Update `NEXT_PUBLIC_BASE_URL` to your production domain
- ✅ Add your domain to Supabase Auth → URL Configuration
- ✅ Test checkout flow with real payment proof upload
- ✅ Verify email delivery (check Resend dashboard)
- ✅ Monitor Supabase logs for RLS policy issues

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npm run build

# Test production build locally
npm run build && npm start
```

## 📊 Database Schema

### Main Tables

- **users**: User profiles (extends auth.users)
- **categories**: Product categories
- **products**: Product catalog
- **cart_items**: Shopping cart (per user)
- **orders**: Customer orders
- **order_items**: Order line items
- **user_addresses**: Saved delivery addresses

### Key Relationships

```sql
products.category_id → categories.id
cart_items.user_id → users.id
orders.user_id → users.id
order_items.order_id → orders.id
```

## 🐛 Troubleshooting

### Build Errors

**Error**: `Module not found: Can't resolve '@/components/...'`
- **Fix**: Check `tsconfig.json` has correct `paths` mapping

**Error**: `Hydration mismatch`
- **Fix**: Ensure server/client components are properly marked with `'use client'`

### Database Issues

**Error**: `permission denied for table ...`
- **Fix**: Check RLS policies in Supabase Dashboard → Authentication → Policies

**Error**: `function place_order does not exist`
- **Fix**: Run `supabase/setup_checkout_complete.sql`

### Image Upload Fails

- **Fix**: Verify storage buckets are **public** in Supabase
- **Fix**: Check storage policies allow authenticated uploads

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For questions or support:
- Open an issue on GitHub
- Email: support@stmarylibrary.com

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ by John Ayman**

