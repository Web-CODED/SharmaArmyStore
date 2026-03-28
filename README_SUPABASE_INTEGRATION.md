# 🚀 Supabase Integration Guide - Complete Walkthrough

## What's Been Done ✅

Your **Sharma Army Store** now has enterprise-grade authentication and backend storage integrated with **Supabase**. Here's what's ready to go:

### Backend Infrastructure
- ✅ **User Authentication** - Email/Password signup & login
- ✅ **Customer Profiles** - Store user data (name, email, phone, DOB)
- ✅ **Order Management** - Save and track customer orders
- ✅ **Address Book** - Store multiple shipping addresses
- ✅ **Wishlist** - Save favorite products
- ✅ **Security** - Row Level Security (RLS) policies on all data
- ✅ **Session Management** - Automatic login persistence

### Code Changes Made
```
✅ src/config/supabase.js              - Supabase client
✅ src/context/AuthContext.jsx         - Auth state management
✅ src/lib/supabase-queries.js         - Database functions
✅ src/App.jsx                         - Added AuthProvider
✅ src/pages/LoginPage.jsx             - Supabase authentication
✅ src/pages/RegisterPage.jsx          - Account creation
✅ src/pages/ProfileDashboard.jsx      - User profile & data management
✅ src/components/Navigation.jsx       - Current user display
```

### Documentation Included
```
📖 SUPABASE_SETUP_GUIDE.md             - Detailed step-by-step setup
📖 SUPABASE_QUICK_START.md             - Quick reference guide
📖 IMPLEMENTATION_COMPLETE.md          - Implementation details
📖 supabase-schema.sql                 - Database schema file
📖 .env.example                        - Environment template
```

---

## 🎯 Quick Start (Only 3 Steps!)

### **STEP 1: Create Free Supabase Project** (5 minutes)

1. Go to **https://supabase.com**
2. Click **"Sign Up"** or **"Start Your Project"**
3. Sign in with Google/GitHub or email
4. Click **"New Project"**
5. Fill in:
   - **Project Name**: `Sharma Army Store` (or any name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users (e.g., India = Singapore)
6. Click **"Create new project"**
7. ☕ Wait 2-3 minutes for project creation

**You'll see this screen when ready:**
```
Project Status: Running
Database: Initializing...
```

---

### **STEP 2: Get Your API Credentials** (2 minutes)

Once your project is ready:

1. Go to **Settings** (⚙️ icon on left sidebar)
2. Click **"API"** 
3. You'll see:
   ```
   Project URL: https://xxxxxxxxxxxx.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Copy both of these values**

---

### **STEP 3: Add Credentials to Your Project** (2 minutes)

1. In your project folder, create a file named `.env.local`
2. Add these lines (replace with YOUR values):
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Save the file

**⚠️ Important**: Add `.env.local` to `.gitignore` so you don't accidentally share your credentials:
```
echo ".env.local" >> .gitignore
```

---

### **STEP 4: Create Database Schema** (3 minutes)

This creates all the tables needed to store customer data.

1. In Supabase project, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"** button
3. **Delete any default code**
4. Open the file `supabase-schema.sql` from your project folder
5. **Copy ALL the code** from that file
6. **Paste it** into the SQL Editor
7. Click **"Run"** button
8. Wait for it to complete ✅

**You should see:**
```
✓ user_profiles table
✓ user_addresses table
✓ orders table
✓ order_items table
✓ wishlist table
✓ activity_log table
✓ RLS Policies enabled
```

---

### **STEP 5: Test It!** (5 minutes)

1. Open terminal in your project folder
2. Run: `npm run dev`
3. Open http://localhost:3000 in your browser
4. Click **"Register"** at the top right
5. Create an account:
   - Email: `test@example.com`
   - Password: `Test123456` (must be 6+ chars)
6. Click **"Register"**
7. You should see your profile page ✅

**To verify data was saved:**

1. Go to your Supabase project
2. Click **"Table Editor"** (left sidebar)
3. Click **"user_profiles"** table
4. You should see your test user! 🎉

---

## 📱 How to Use in Your Code

### Display Current User

```jsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, profile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in first</p>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name || user?.email}</h1>
      <p>Email: {user?.email}</p>
      <p>Phone: {profile?.phone_number}</p>
    </div>
  );
}
```

### Save an Order

```jsx
import { addOrder } from '@/lib/supabase-queries';
import { useAuth } from '@/context/AuthContext';

function Checkout() {
  const { user } = useAuth();

  const placeOrder = async () => {
    const order = await addOrder(user.id, {
      items: cartItems,
      subtotal: 1000,
      tax: 180,
      total: 1180,
      status: 'pending',
      payment_method: 'card',
      order_number: 'ORD-' + Date.now()
    });
    
    console.log('Order saved with ID:', order.id);
  };

  return <button onClick={placeOrder}>Place Order</button>;
}
```

### Save Customer Address

```jsx
import { addAddress, getUserAddresses } from '@/lib/supabase-queries';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

function AddressBook() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadAddresses();
  }, [user?.id]);

  const loadAddresses = async () => {
    const allAddresses = await getUserAddresses(user.id);
    setAddresses(allAddresses);
  };

  const saveNewAddress = async () => {
    await addAddress(user.id, {
      type: 'home',
      full_name: 'Rajesh Kumar',
      phone_number: '9876543210',
      street_address: '123 Main Street',
      city: 'Delhi',
      state: 'Delhi',
      postal_code: '110001',
      country: 'India'
    });
    loadAddresses();
  };

  return (
    <div>
      <h2>My Addresses</h2>
      {addresses.map(addr => (
        <div key={addr.id}>
          <p>{addr.full_name}</p>
          <p>{addr.street_address}</p>
          <p>{addr.city}, {addr.state}</p>
        </div>
      ))}
      <button onClick={saveNewAddress}>Add New Address</button>
    </div>
  );
}
```

### Manage Wishlist

```jsx
import { addToWishlist, removeFromWishlist, getWishlist } from '@/lib/supabase-queries';

// Add product to favorites
await addToWishlist(userId, productId);

// Remove from favorites
await removeFromWishlist(userId, productId);

// Get all favorite products
const favorites = await getWishlist(userId);
```

---

## 🛠️ Available Functions

### **Authentication**
```javascript
import { useAuth } from '@/context/AuthContext';

const {
  user,              // Current logged-in user
  profile,           // User profile data
  isAuthenticated,   // true/false
  loading,           // Checking auth status
  signUp,            // (email, password, fullName)
  signIn,            // (email, password)
  signOut,           // () 
  updateProfile      // (updates)
} = useAuth();
```

### **Manage Orders**
```javascript
import { addOrder, getOrders, getOrderById } from '@/lib/supabase-queries';

// Create new order
const order = await addOrder(userId, {
  items: [...],
  total: 1500,
  status: 'pending',
  order_number: 'ORD-123'
});

// Get user's order history
const orders = await getOrders(userId);

// Get specific order details
const order = await getOrderById(orderId);
```

### **Manage Addresses**
```javascript
import { 
  addAddress, 
  getUserAddresses, 
  updateAddress, 
  deleteAddress 
} from '@/lib/supabase-queries';

// Add new address
const addr = await addAddress(userId, addressData);

// Get all addresses
const addresses = await getUserAddresses(userId);

// Update address
await updateAddress(addressId, { city: 'Mumbai' });

// Delete address
await deleteAddress(addressId);
```

---

## 📊 Your Database Tables

| Table | Stores What | Who Sees |
|-------|-----------|----------|
| `user_profiles` | Name, email, phone, DOB | Only that user |
| `user_addresses` | Shipping addresses | Only that user |
| `orders` | Order history & status | Only that user |
| `order_items` | Items in each order | Only that user |
| `wishlist` | Favorite products | Only that user |
| `activity_log` | User actions | Only that user |

All data is protected with **Row Level Security** - users can only access their own data!

---

## 🔐 Security Features

✅ **Row Level Security (RLS)** - Users see only their data  
✅ **Password Encryption** - Passwords securely hashed  
✅ **JWT Sessions** - Login tokens auto-managed  
✅ **HTTPS Encryption** - All data encrypted in transit  
✅ **Data Isolation** - No cross-user data access

**Never:**
- ❌ Commit `.env.local` to git
- ❌ Share your API keys
- ❌ Use service role key in frontend
- ❌ Trust only client-side validation

---

## 🧪 Testing Checklist

- [ ] Supabase project created
- [ ] `.env.local` file created with credentials
- [ ] SQL schema executed in Supabase
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] User data appears in `user_profiles` table
- [ ] Profile page shows user info
- [ ] Navigation bar shows "Hi, [Name]"
- [ ] Can logout

---

## 📚 File Reference

| File | What It Does |
|------|-------------|
| `src/config/supabase.js` | Initializes Supabase client - **DON'T EDIT** |
| `src/context/AuthContext.jsx` | Manages login/logout/user state - **DON'T CHANGE** |
| `src/lib/supabase-queries.js` | Database functions - **USE IN YOUR CODE** |
| `.env.local` | Your secret credentials - **KEEP PRIVATE** |
| `supabase-schema.sql` | Database tables - **RUN ONCE IN SUPABASE** |

---

## ⚠️ Common Issues & Solutions

### Issue: "VITE_SUPABASE_URL is required"
**Solution:**
```
1. Check .env.local exists in project root (not src/)
2. Verify both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are there
3. Restart dev server: npm run dev
4. Clear browser cache: Ctrl+Shift+Delete
```

### Issue: Can't login after registering
**Solution:**
```
1. Check Supabase → Authentication → Users (see if user exists)
2. Check email verification isn't required (Settings → Auth)
3. Try with different email/password
4. Check browser console for error message
```

### Issue: Data not saving to database
**Solution:**
```
1. Open browser DevTools: F12
2. Go to Console tab, check for errors
3. In Supabase, go to SQL Editor, run:
   SELECT * FROM user_profiles LIMIT 10;
4. If no data, check RLS policies are enabled
```

### Issue: See data in Supabase but not in app
**Solution:**
```
1. Check user is logged in: console.log(isAuthenticated)
2. Verify correct user_id being used
3. Check RLS policy allows SELECT
4. Look at Network tab in DevTools
```

---

## 🚀 Next Steps for Your App

1. **Update Checkout Page**
   - Use `addOrder()` to save orders to database
   - Store payment details with order

2. **Add Wishlist Feature**
   - Show heart icon on product cards
   - Use `addToWishlist()` and `removeFromWishlist()`

3. **Improve Address Management**
   - Let customers add/edit/delete addresses
   - Select default address for checkout

4. **Order Tracking**
   - Show order status (pending → shipped → delivered)
   - Update status in Supabase

5. **Email Notifications**
   - Setup email templates in Supabase
   - Send welcome email on signup
   - Send order confirmation email

6. **Payment Integration**
   - Connect Stripe or Razorpay
   - Save payment status in orders table

---

## 📖 Documentation Files

You have these detailed guides in your project:

1. **`SUPABASE_QUICK_START.md`** - Quick reference with examples
2. **`SUPABASE_SETUP_GUIDE.md`** - Detailed step-by-step walkthrough
3. **`IMPLEMENTATION_COMPLETE.md`** - Complete implementation details
4. **`supabase-schema.sql`** - Database structure

Read these for more details!

---

## 💡 Pro Tips

1. **Monitor Dashboard** - Watch real-time data in Supabase Tables
2. **Check Logs** - Troubleshoot in Supabase → Database → Logs
3. **Test RLS** - Verify users can't see others' data
4. **Use Console** - `console.log(user, profile)` to debug
5. **Check Network** - Browser DevTools → Network tab for API errors

---

## 🎉 You're Done!

Your app now has:
- ✅ Enterprise authentication
- ✅ Secure customer data storage
- ✅ Order management system
- ✅ Production-ready security

**Next: Start registering customers and watch the data appear in real-time!**

---

## 🤝 Need Help?

- Check the troubleshooting section above
- Read `SUPABASE_SETUP_GUIDE.md` for detailed steps
- Visit https://supabase.com/docs
- Check browser console for error messages
- Look at Supabase logs for database errors

---

**Happy coding! 🚀**

*Integration completed on: March 28, 2026*
