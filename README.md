# 🎁 St. Mary Library Gift Shop

> **A Beautiful Online Gift Shop** - Your one-stop destination for finding and ordering the perfect gifts for any occasion!

---

## 📖 What Is This?

**St. Mary Library Gift Shop** is a modern online store where customers can:

- **Browse beautiful gifts** organized by categories (birthdays, anniversaries, flowers, etc.)
- **Add items to cart** and checkout with ease
- **Track their orders** from payment to delivery
- **Save delivery addresses** for faster future orders
- **Pay with cash on delivery or InstaPay**

The store also has a **complete admin dashboard** where store owners can:

- **Manage products** (add, edit, delete)
- **Organize categories**
- **Process orders** and update their status
- **Approve payment proofs** from customers
- **View sales statistics**

---

## ✨ What Makes This Special?

### 🌍 **Bilingual Support**

- All products show names and descriptions in both languages
- Perfect for serving diverse customers

### 🎨 **Beautiful Design**

- **Modern, clean interface** that looks professional
- **Fully responsive** - works perfectly on phones, tablets, and computers
- **Dark/Light mode** for comfortable viewing anytime
- **Seasonal themes** - automatically decorates for Christmas! 🎄

### 🛡️ **Secure & Reliable**

- **User accounts** with secure login (email/password or Google)
- **Protected data** - each user only sees their own orders and cart
- **Safe payments** - cash on delivery or InstaPay with proof upload
- **Role-based access** - admin features are locked to store owners only

### 🚀 **Fast & Smooth**

- **Lightning-fast page loads** (optimized for performance)
- **Real-time cart updates** - changes sync instantly across devices
- **Smart image optimization** - pictures load quickly without losing quality
- **Skeleton loading screens** - no blank white pages while waiting

---

## 🎯 Key Features Explained

### For Customers 🛍️

#### 1. **Browse Products**

- View all products organized by category
- Search for specific items
- See beautiful product images, descriptions, and prices
- Check if items are in stock

#### 2. **Shopping Cart**

- Add items with desired quantities
- Update quantities or remove items anytime
- Cart saves automatically - come back later and it's still there!
- See total price before checkout

#### 3. **Easy Checkout**

- Choose delivery method:
  - **Delivery to your address** (we'll bring it to you!)
  - **Pickup from store** (you collect it)
- Save multiple delivery addresses for future orders
- Select payment method:
  - **Cash on Delivery** (pay when you receive)
  - **InstaPay** (upload payment proof)

#### 4. **Order Tracking**

- Visual timeline showing order progress:
  - 📝 **Pending Payment** - Order received, waiting for payment confirmation
  - ⚙️ **Processing** - We're preparing your order
  - 🚚 **Out for Delivery** - On the way to you!
  - ✅ **Completed** - Delivered successfully
- Email confirmations at each step
- View full order history anytime

#### 5. **User Account**

- Secure login with email/password or Google account
- Edit profile information
- Manage saved addresses
- View all past orders

---

### For Store Owners 👨‍💼

#### 1. **Admin Dashboard**

- **At-a-glance statistics**:
  - Total products in catalog
  - Active products currently selling
  - Out of stock items needing restock
  - Number of categories
- Quick access buttons to all management areas

#### 2. **Product Management**

- **Add New Products**:
  - Upload product image
  - Enter name in English and Arabic
  - Set price
  - Write description in both languages
  - Assign to category
  - Mark as in stock/out of stock
- **Edit Existing Products**: Update any detail anytime
- **Delete Products**: Remove discontinued items
- **Search & Filter**: Find products quickly in large catalogs

#### 3. **Category Organization**

- Create categories (e.g., "Birthday Gifts", "Flowers", "Chocolates")
- Upload category images for beautiful browsing
- Edit or delete categories as needed
- Activate/deactivate categories without deleting

#### 4. **Order Management**

- **View All Orders** with filters by status
- **Update Order Status**:
  - Mark as "Processing" when preparing
  - Mark as "Out for Delivery" when shipped
  - Mark as "Completed" when delivered
- **Review Payment Proofs**:
  - View uploaded InstaPay receipts
  - Approve or reject payments
- **Cancel Orders**:
  - Cancel with reason note
  - Notifies customer automatically

#### 5. **Store Settings**

- **Hero Banner**: Upload main homepage image
- **Store Information**: Name, tagline, about us
- **Contact Details**: Phone, email, WhatsApp
- **Delivery Settings**: Delivery fee, free delivery threshold
- **Payment Methods**: Enable/disable cash or InstaPay
- **Social Media**: Add Facebook, Instagram links
- **Theme Selection**: Choose seasonal themes (Christmas, Default)

---

## 🛠️ Technology Behind The Scenes

### What Powers This Store?

| Component          | Technology            | What It Does                                    |
| ------------------ | --------------------- | ----------------------------------------------- |
| **Frontend**       | Next.js 16 + React 19 | Creates the beautiful user interface            |
| **Styling**        | Tailwind CSS          | Makes everything look pretty and modern         |
| **Database**       | Supabase (PostgreSQL) | Stores all products, orders, user data securely |
| **Authentication** | Supabase Auth         | Handles secure user login and accounts          |
| **File Storage**   | Supabase Storage      | Stores product images and payment proofs        |
| **Email Service**  | Resend                | Sends order confirmations and notifications     |
| **Hosting**        | Vercel                | Makes the site available 24/7 worldwide         |
| **Language**       | TypeScript            | Ensures code quality and catches errors early   |

### Why These Technologies?

- **Next.js**: Industry-leading framework used by companies like Netflix and TikTok
- **Supabase**: Open-source alternative to Firebase, fully scalable
- **Vercel**: Automatic deployments, global CDN, 99.99% uptime
- **TypeScript**: Prevents bugs before they happen
- **Tailwind CSS**: Rapid development with consistent design

---

## 📊 Database Structure

The store uses 8 main database tables to organize everything:

### 1. **Users** 👤

Stores customer and admin account information

- Full name, email, phone
- Role (customer or admin)
- Created date

### 2. **Categories** 📁

Organizes products into groups

- Name in English and Arabic
- Category image
- Active/inactive status

### 3. **Products** 🎁

The actual items for sale

- Name and description (bilingual)
- Price, stock quantity
- Product image
- Link to category
- Active/inactive status

### 4. **Cart Items** 🛒

Temporary storage of customer selections

- Which user's cart
- Which product
- How many items
- Automatic cleanup when ordered

### 5. **Orders** 📦

Customer purchase records

- Order total and delivery fee
- Delivery/pickup selection
- Delivery address and phone
- Payment method (cash/InstaPay)
- Current status (pending → processing → delivery → completed)
- Payment proof (if InstaPay)

### 6. **Order Items** 📋

Individual items within each order

- Which order
- Which product
- Quantity and price at time of order
- Custom text (if applicable)

### 7. **User Addresses** 🏠

Saved delivery locations

- Street address
- City, area, building details
- Floor, apartment number
- Additional notes
- Set as default address option

### 8. **Store Settings** ⚙️

Global store configuration

- Store name and tagline
- Contact information
- Delivery fee and thresholds
- Hero banner image
- Active theme (Christmas/Default)
- About us text

---

## 🚀 Setting Up The Store

### Prerequisites (What You Need)

1. **A Computer** with internet connection
2. **Node.js** installed ([Download here](https://nodejs.org/) - get version 18 or newer)
3. **A Supabase Account** ([Sign up free](https://supabase.com))
4. **(Optional) Resend Account** for sending emails ([Sign up](https://resend.com))

### Step-by-Step Setup Guide

#### Step 1: Get The Code

1. Download the project files (or clone from GitHub)
2. Open Terminal (Mac) or Command Prompt (Windows)
3. Navigate to the project folder:
   ```bash
   cd path/to/st-mary-library-gift-shop
   ```

#### Step 2: Install Dependencies

Run this command to download all required packages:

```bash
npm install
```

This installs ~50 packages needed for the store to work. Takes 2-3 minutes.

#### Step 3: Configure Environment Variables

1. Find the file named `.env.example`
2. Copy it and rename the copy to `.env.local`
3. Open `.env.local` and fill in these values:

```env
# Get these from Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your_long_key_here

# Get this from Resend Dashboard → API Keys (optional)
RESEND_API_KEY=re_123456789

# Your admin email for notifications
ADMIN_EMAIL=admin@yourdomain.com

# Website URL (use http://localhost:3000 for local testing)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### Step 4: Set Up Database

1. **Go to Supabase Dashboard** → Your Project → SQL Editor

2. **Run these SQL files in order** (copy and paste each file's content):

   - `supabase/schema.sql` - Creates all database tables
   - `supabase/triggers.sql` - Auto-creates user profiles on signup
   - `supabase/storage_policy.sql` - Allows image uploads
   - `supabase/user_addresses.sql` - Adds saved addresses feature
   - `supabase/store_settings.sql` - Creates settings table

3. **Create Storage Buckets** (Supabase Dashboard → Storage):

   - Click "New Bucket"
   - Create these **PUBLIC** buckets:
     - `categories` (for category images)
     - `products` (for product images)
     - `payment-proofs` (for InstaPay receipts)

4. **Create First Store Settings Row**:
   ```sql
   INSERT INTO store_settings (
     store_name_en,
     store_name_ar,
     tagline_en,
     tagline_ar,
     delivery_fee
   ) VALUES (
     'St. Mary Library Gift Shop',
     'محل هدايا مكتبة سانت ماري',
     'Perfect gifts for every occasion',
     'هدايا مثالية لكل مناسبة',
     50
   );
   ```

#### Step 5: Run The Store Locally

Start the development server:

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

🎉 **Your store is now running!**

---

## 👨‍💼 Creating Your First Admin Account

1. **Sign up normally** at `/register` with your email
2. **Go to Supabase Dashboard** → Table Editor → `users` table
3. **Find your user row** and change:
   - `role` column from `customer` to `admin`
4. **Log out and log back in**
5. **Access admin panel** at `/admin`

You're now the store owner! 🎊

---

## 🎨 Customizing Your Store

### Changing Store Branding

1. Go to `/admin/settings`
2. Update:
   - Store name and tagline (English + Arabic)
   - Contact information (phone, email, WhatsApp)
   - About Us section
   - Social media links (Facebook, Instagram)

### Adding Products

1. Go to `/admin/products`
2. Click "Add New Product"
3. Fill in:
   - Product name (English + Arabic)
   - Description (English + Arabic)
   - Price in EGP
   - Upload product image
   - Select category
   - Set stock quantity
   - Mark as active
4. Click "Save Product"

### Creating Categories

1. Go to `/admin/categories`
2. Click "Add Category"
3. Enter:
   - Category name (English + Arabic)
   - Upload category image
4. Mark as active
5. Save!

### Changing Hero Banner

1. Go to `/admin/settings`
2. Scroll to "Hero Image" section
3. Click "Upload New Image"
4. Select a beautiful banner image (recommended: 1920x600px)
5. Save settings

### Seasonal Themes

1. Go to `/admin/settings`
2. Find "Theme Selection"
3. Choose:
   - **Default**: Clean, modern look
   - **Christmas**: Festive decorations with snowfall ❄️
4. Save and see your store transform!

---

## 📱 How Customers Use The Store

### Shopping Journey:

1. **Browse Products**

   - Visit homepage to see featured categories
   - Click category to view all products in that group
   - Use search bar to find specific items

2. **Add to Cart**

   - Click product for details
   - Choose quantity
   - Click "Add to Cart"
   - Cart icon shows item count

3. **Checkout**

   - Click cart icon
   - Review items and quantities
   - Click "Proceed to Checkout"
   - Choose delivery or pickup
   - Enter/select delivery address
   - Select payment method:
     - **Cash on Delivery**: Pay when you receive
     - **InstaPay**: Upload payment proof
   - Click "Place Order"

4. **Track Order**
   - Receive email confirmation
   - Go to "My Orders" to see status
   - Visual timeline shows progress:
     - ⏳ Pending Payment
     - ⚙️ Processing
     - 🚚 Out for Delivery
     - ✅ Completed

---

## 📦 Processing Orders (Admin Guide)

### Daily Order Management:

1. **Log into Admin Dashboard** (`/admin`)

2. **Go to Orders Section** (`/admin/orders`)

3. **Review New Orders**:

   - Filter by "Pending Payment"
   - Check payment method:
     - **Cash on Delivery**: Approve immediately → change status to "Processing"
     - **InstaPay**: View uploaded proof → Approve/Reject

4. **Update Order Status**:

   - **Processing**: When preparing the order
   - **Out for Delivery**: When handed to courier
   - **Completed**: After successful delivery
   - **Cancelled**: If customer requests cancellation

5. **Customer Gets Notified**: Email sent automatically on status change

---

## 🚢 Deploying Your Store Online

### Option 1: Vercel (Recommended - Easiest)

1. **Push code to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com)**:

   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

3. **Wait 2-3 minutes** - Your store is now live! 🌐

4. **Update Supabase**:

   - Go to Supabase → Authentication → URL Configuration
   - Add your Vercel domain (e.g., `https://yourstore.vercel.app`)

5. **Update Environment Variable**:
   - In Vercel → Settings → Environment Variables
   - Change `NEXT_PUBLIC_BASE_URL` to your Vercel URL

### Option 2: Other Platforms

The store can also be deployed to:

- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean**: More control, requires server management
- **AWS/Azure**: Enterprise-level hosting

---

## 🔧 Troubleshooting Common Issues

### "Can't log in" Problem

**Solution**:

1. Check email is confirmed (Supabase sends confirmation email)
2. Try "Forgot Password" to reset
3. Verify Supabase project is active

### "Images not uploading" Problem

**Solution**:

1. Check storage buckets are **public** in Supabase
2. Verify bucket names are correct: `categories`, `products`, `payment-proofs`
3. Check file size (max 5MB recommended)

### "Page not loading" Problem

**Solution**:

1. Clear browser cache
2. Check internet connection
3. Verify Supabase project is not paused (free tier pauses after 7 days inactivity)

### "Admin panel not accessible" Problem

**Solution**:

1. Verify your user role is set to `admin` in database
2. Log out and log back in
3. Check browser console for errors (F12)

### "Emails not sending" Problem

**Solution**:

1. Verify `RESEND_API_KEY` is correct in environment variables
2. Check Resend dashboard for error logs
3. Ensure sending domain is verified in Resend

---

## 📈 Store Management Best Practices

### 1. **Product Management**

- ✅ Use high-quality images (min 800x800px)
- ✅ Write detailed descriptions in both languages
- ✅ Update stock quantities regularly
- ✅ Mark seasonal items as inactive when out of season
- ✅ Use consistent pricing (e.g., round to nearest 10 EGP)

### 2. **Order Processing**

- ✅ Check orders daily (morning and evening)
- ✅ Respond to InstaPay proofs within 24 hours
- ✅ Update order status as soon as changes happen
- ✅ Contact customers if there's any issue (out of stock, delay)
- ✅ Archive completed orders monthly for easier browsing

### 3. **Customer Service**

- ✅ Reply to customer emails promptly
- ✅ Keep WhatsApp number active during business hours
- ✅ Update "About Us" with accurate store hours
- ✅ Post new arrivals regularly
- ✅ Share social media updates about promotions

### 4. **Performance Monitoring**

- ✅ Check Vercel Analytics monthly
- ✅ Review popular products (add similar items)
- ✅ Monitor page load speeds
- ✅ Test checkout process weekly
- ✅ Backup database monthly (Supabase has auto-backups)

---

## 🎯 Advanced Features

### Current Capabilities

✅ **Multi-language Support** (English/Arabic)  
✅ **Google OAuth Login**  
✅ **Real-time Cart Sync**  
✅ **Image Upload & Optimization**  
✅ **Email Notifications**  
✅ **Responsive Design**  
✅ **Dark/Light Mode**  
✅ **Seasonal Themes**  
✅ **Order Tracking**  
✅ **Saved Addresses**  
✅ **Payment Proof Upload**  
✅ **Admin Dashboard**  
✅ **Product Search**  
✅ **Category Filtering**  
✅ **Performance Optimized** (React Suspense Streaming)

### Future Enhancements (Ideas)

💡 **Wishlist Feature** - Save favorites for later  
💡 **Product Reviews** - Customer ratings and comments  
💡 **Discount Coupons** - Promotional codes  
💡 **SMS Notifications** - Order updates via text  
💡 **Multi-currency Support** - Accept USD, EUR  
💡 **Gift Wrapping Option** - Add gift wrap service  
💡 **Advanced Analytics** - Sales reports, charts  
💡 **Inventory Alerts** - Notify when stock is low  
💡 **Customer Chat** - Live chat support  
💡 **Mobile App** - Native iOS/Android apps

---

## 📞 Support & Contact

### Need Help?

- **Technical Issues**: Create an issue on GitHub
- **General Questions**: Email support@stmarylibrary.com
- **Custom Development**: Hire the developer

### Resources

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Guide**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

You are free to:

- ✅ Use commercially
- ✅ Modify as needed
- ✅ Distribute copies
- ✅ Private use

Just keep the license notice in the code.

---

## 🙏 Credits & Acknowledgments

**Built With Love By**: John Ayman

**Technologies Used**:

- Next.js - React Framework
- Supabase - Database & Auth
- Tailwind CSS - Styling
- Vercel - Hosting
- Resend - Email Service
- Lucide Icons - Beautiful icons
- Radix UI - Accessible components

**Special Thanks To**:

- The Next.js team for an amazing framework
- Supabase for open-source backend tools
- The React community for endless learning resources

---

## 🎉 What You've Built

You now have a **professional, production-ready e-commerce platform** that includes:

- 🛍️ **Complete shopping experience** for customers
- 👨‍💼 **Powerful admin tools** for store management
- 🔒 **Enterprise-level security** with RLS and authentication
- 🚀 **Blazing-fast performance** with server-side rendering
- 🌍 **Bilingual interface** serving diverse audiences
- 📱 **Mobile-first design** that works everywhere
- 💳 **Multiple payment options** for customer convenience
- 📧 **Automated email notifications** for order updates
- 📊 **Analytics-ready** with Vercel Speed Insights
- 🎨 **Customizable themes** for seasonal branding

**This is not just a demo - it's a real business tool ready to generate revenue!** 💰

---

**Happy Selling! 🎊**

Made with ❤️ for St. Mary Library
