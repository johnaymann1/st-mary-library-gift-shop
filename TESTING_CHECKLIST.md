# Testing Checklist

## 🛍️ Customer Testing

### Account & Authentication
- [ ] Register new account
- [ ] Login with email and password
- [ ] Logout
- [ ] Forgot password (request reset)
- [ ] Reset password via email link
- [ ] Complete profile after registration
- [ ] Edit profile (name, email, phone)
- [ ] Save delivery addresses
- [ ] Set default address

### Product Browsing
- [ ] View homepage with featured products
- [ ] Browse products by category
- [ ] Search products by name
- [ ] Filter products by price range
- [ ] Filter products by stock status
- [ ] Sort products: Newest, Price Low-High, Price High-Low, Name A-Z
- [ ] **Verify sale prices show correctly**
- [ ] **Verify sorting works with sale prices (products with sales sort by sale price)**
- [ ] View product details page
- [ ] View product images

### Shopping Cart
- [ ] Add product to cart (logged in)
- [ ] Add product to cart (guest - stores locally)
- [ ] Update product quantity in cart
- [ ] Remove product from cart
- [ ] **Verify sale prices display in cart**
- [ ] **Verify sale prices disappear correctly when expired**
- [ ] Cart persists after login
- [ ] Guest cart merges with user cart on login
- [ ] View cart total with delivery fee

### Checkout
- [ ] Proceed to checkout
- [ ] Select delivery type: Delivery or Pickup
- [ ] Enter delivery address (or select saved address)
- [ ] Enter phone number
- [ ] Choose payment method: Cash or InstaPay
- [ ] **Upload payment proof for InstaPay orders**
- [ ] Complete order successfully
- [ ] Receive order confirmation
- [ ] **Verify order starts as "Processing" for Cash**
- [ ] **Verify order starts as "Pending Payment" for InstaPay**

### Order Management
- [ ] View order history
- [ ] View order details
- [ ] Track order status
- [ ] Cancel pending order
- [ ] Download order receipt
- [ ] View payment proof (InstaPay orders)

---

## 👨‍💼 Admin Testing

### Authentication
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] Verify non-admin cannot access admin pages

### Products Management
- [ ] View all products
- [ ] Create new product
- [ ] Edit product details
- [ ] **Add sale price to product**
- [ ] **Set sale end date**
- [ ] **Remove sale from product**
- [ ] Upload product image
- [ ] Mark product as active/inactive
- [ ] Mark product in stock/out of stock
- [ ] Delete product
- [ ] Search products
- [ ] Filter products by category
- [ ] Filter products by status

### Categories Management
- [ ] View all categories
- [ ] Create new category (English & Arabic names)
- [ ] Edit category
- [ ] Upload category image
- [ ] Mark category as active/inactive
- [ ] Delete category
- [ ] Verify products update when category deleted

### Orders Management
- [ ] View all orders
- [ ] Filter orders by status (All, Pending Payment, Processing, etc.)
- [ ] **Search orders by: Name, Email, Phone, Order ID**
- [ ] View order details
- [ ] Update order status
- [ ] **View payment proof for InstaPay orders (any status)**
- [ ] **Verify payment (Approve/Reject) for Pending Payment orders**
- [ ] **View payment proof for already verified orders (read-only)**
- [ ] Cancel order
- [ ] Track order timeline
- [ ] Export order data

### Store Settings
- [ ] Update store name
- [ ] Update contact information (phone, email, address)
- [ ] Update social media links
- [ ] Update delivery fee
- [ ] Update free delivery threshold
- [ ] Enable/disable InstaPay
- [ ] Update InstaPay phone number
- [ ] Change active theme
- [ ] Upload hero image
- [ ] Update working hours
- [ ] Update currency settings

---

## 🎯 Feature-Specific Testing

### Sale Price System
- [ ] **Create product with sale price**
- [ ] **Set sale end date**
- [ ] **Verify sale badge shows on product card**
- [ ] **Verify strikethrough price shows**
- [ ] **Verify sale price used in cart subtotal**
- [ ] **Verify sale price used in order total**
- [ ] **Verify sorting by price uses sale price when active**
- [ ] **Verify price filters use sale price when active**
- [ ] **Verify sale expires on correct date**
- [ ] **Verify sale without end date stays active**

### Payment Verification
- [ ] **Customer uploads InstaPay screenshot**
- [ ] **Admin receives notification of pending payment**
- [ ] **Admin views payment proof in Orders Management**
- [ ] **Admin approves payment → order moves to Processing**
- [ ] **Admin rejects payment → order cancelled**
- [ ] **Admin can view payment proof after verification**
- [ ] **Verify button shows for Pending Payment**
- [ ] **View button shows for verified orders**

### Search & Filtering
- [ ] **Search products by English name**
- [ ] **Search products by Arabic name**
- [ ] **Search orders by customer name**
- [ ] **Search orders by email**
- [ ] **Search orders by phone**
- [ ] **Search orders by order ID**
- [ ] **Combine search with status filter**
- [ ] **Combine search with category filter**

### Responsive Design
- [ ] Test on mobile (iPhone/Android)
- [ ] Test on tablet (iPad)
- [ ] Test on desktop
- [ ] Test dark mode on all devices
- [ ] Test light mode on all devices

### Edge Cases
- [ ] Add product to cart when out of stock
- [ ] Checkout with empty cart
- [ ] Upload invalid file as payment proof (not image)
- [ ] Upload oversized payment proof (>5MB)
- [ ] Complete order without delivery address (delivery type)
- [ ] Access admin pages as regular user
- [ ] View expired sale products
- [ ] Sort products with mixed sale/regular prices

---

## ✅ Testing Status Indicators

When testing, mark each item as:
- ✅ **Pass** - Feature works correctly
- ❌ **Fail** - Feature has issues
- ⚠️ **Partial** - Feature works but has minor issues
- ⏭️ **Skip** - Not applicable or not tested yet

---

## 📝 Notes Section

Use this space to document any bugs, issues, or observations during testing:

```
Date: ___________
Tester: ___________

Issues Found:
1. 
2. 
3. 

Suggestions:
1. 
2. 
3. 
```
