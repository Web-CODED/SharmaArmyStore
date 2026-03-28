# Supabase Authentication & Data Storage Integration - Quick Start

## 📋 What Has Been Done

Your project now has full Supabase integration ready to use:

### ✅ Installed
- `@supabase/supabase-js` - Supabase client library

### ✅ Created Files
1. **`src/config/supabase.js`** - Supabase client initialization
2. **`src/context/AuthContext.jsx`** - Authentication context & state management
3. **`src/lib/supabase-queries.js`** - Reusable database query functions
4. **`SUPABASE_SETUP_GUIDE.md`** - Detailed setup instructions
5. **`supabase-schema.sql`** - Database schema with RLS policies
6. **`.env.example`** - Environment variables template

### ✅ Updated Files
1. **`src/App.jsx`** - Added AuthProvider wrapper
2. **`src/pages/LoginPage.jsx`** - Now uses Supabase Auth
3. **`src/pages/RegisterPage.jsx`** - Now creates user accounts in Supabase
4. **`src/pages/ProfileDashboard.jsx`** - Enhanced with Supabase data management

## 🚀 Quick Start (5 Steps)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up → Create new project
3. Choose region closest to your users
4. Wait for project creation (2-3 mins)

### Step 2: Get Your Credentials
1. Click **Settings → API** in your Supabase project
2. Copy **Project URL** 
3. Copy **anon public** key

### Step 3: Setup Environment File
Create `.env.local` in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Razorpay for payment integration (future)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

⚠️ **Add to `.gitignore`:**
```
.env.local
.env
```

### Step 4: Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `supabase-schema.sql` from your project root
4. Paste and click **Run**

This creates:
- ✅ User profiles table
- ✅ Addresses table
- ✅ Orders table
- ✅ Wishlist table
- ✅ Security policies (RLS)

### Step 5: Test It!
1. Start dev server: `npm run dev`
2. Visit http://localhost:3000/register
3. Create account with email & password
4. Check Supabase dashboard → Table Editor → user_profiles
5. Your new user data should appear there! 🎉

### Test Payment Integration
1. Add items to cart and proceed to checkout
2. Select "Online Payment" option
3. Click "Place Order" - Razorpay payment gateway will open
4. Use test card details for testing (if using test key)
5. Payment success will redirect to order confirmation
6. Check order shows "PAID" status

## 📚 How to Use

### In Any React Component

```jsx
// Import the authentication hook
import { useAuth } from '@/context/AuthContext';

// Use it in your component
const MyComponent = () => {
  const { user, profile, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in first</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};
```

### Save Orders

```jsx
import { addOrder } from '@/lib/supabase-queries';
import { useAuth } from '@/context/AuthContext';

const Checkout = () => {
  const { user } = useAuth();

  const handlePlaceOrder = async () => {
    try {
      const order = await addOrder(user.id, {
        items: cartItems,
        subtotal: 1000,
        total: 1100,
        status: 'pending',
        payment_method: 'card',
        order_number: 'ORD-' + Date.now()
      });
      console.log('Order saved:', order.id);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return <button onClick={handlePlaceOrder}>Place Order</button>;
};
```

### Save Addresses

```jsx
import { addAddress, getUserAddresses } from '@/lib/supabase-queries';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const AddressManager = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    const userAddresses = await getUserAddresses(user.id);
    setAddresses(userAddresses);
  };

  const handleAddAddress = async (formData) => {
    await addAddress(user.id, {
      type: 'home',
      full_name: formData.name,
      phone_number: formData.phone,
      street_address: formData.street,
      city: formData.city,
      state: formData.state,
      postal_code: formData.zip,
      country: 'India'
    });
    loadAddresses();
  };

  return (
    <div>
      {addresses.map(addr => (
        <div key={addr.id}>
          <p>{addr.full_name}</p>
          <p>{addr.street_address}</p>
        </div>
      ))}
    </div>
  );
};
```

### Manage Wishlist

```jsx
import { addToWishlist, removeFromWishlist, getWishlist } from '@/lib/supabase-queries';

// Add to wishlist
await addToWishlist(user.id, productId);

// Remove from wishlist
await removeFromWishlist(user.id, productId);

// Get all wishlist items
const favorites = await getWishlist(user.id);
```

## 🔐 Authentication Features

### Available Methods
- ✅ Email/Password signup & login
- ✅ Automatic session management
- ✅ Row Level Security (RLS) for data privacy
- ✅ Optional: Social login (Google, GitHub)

### Protected Routes Example
```jsx
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

// Use in App.jsx
<Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
```

## 📊 Database Tables

### user_profiles
- **Stores**: User account info, phone, DOB, preferences
- **Secured by RLS**: Users see only their own profile

### user_addresses
- **Stores**: Shipping addresses, billing addresses
- **Secured by RLS**: Users see only their own addresses

### orders
- **Stores**: Order history, status, totals, payment info
- **Secured by RLS**: Users see only their own orders

### order_items
- **Stores**: Individual items in each order
- **Secured by RLS**: Users see only their order items

### wishlist
- **Stores**: Favorite products
- **Secured by RLS**: Users see only their wishlist

## 🔧 Next Steps

1. **Update Checkout Page** - Use `addOrder()` to save orders
2. **Add Wishlist UI** - Show favorites, use `addToWishlist()`
3. **Address Management** - Let users add/edit shipping addresses
4. **Order History** - Display user's past orders with tracking
5. **Email Notifications** - Configure Supabase email templates
6. **Payment Integration** - Connect Stripe/Razorpay with orders table
7. **Deploy** - Use environment variables on Vercel/Netlify

## 📞 Debugging

### Error: "VITE_SUPABASE_URL is undefined"
```
✓ Create .env.local in project root (not .env)
✓ Add both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
✓ Restart dev server after creating .env.local
```

### Error: "Row level security violated"
```
✓ User must be authenticated
✓ Check RLS policies were created (step 4 above)
✓ Verify user ID matches the data owner
```

### Data not appearing in dashboard?
```
✓ Check Authentication is enabled in Supabase
✓ Look in Table Editor → user_profiles for new users
✓ Verify .env.local has correct URL and key
```

## 🎯 What Each File Does

| File | Purpose |
|------|---------|
| `src/config/supabase.js` | Initializes Supabase client with your credentials |
| `src/context/AuthContext.jsx` | Manages auth state (user, profile, signUp, signIn, signOut) |
| `src/lib/supabase-queries.js` | Handy functions for CRUD operations on database |
| `SUPABASE_SETUP_GUIDE.md` | Detailed step-by-step setup guide |
| `supabase-schema.sql` | Database tables & security policies |

## 💡 Pro Tips

1. **Always check `isAuthenticated`** before accessing user data
2. **Use RLS policies** - Don't just trust client-side checks
3. **Test during checkout** - Try placing orders to ensure data saves
4. **Monitor Supabase dashboard** - Watch real-time changes
5. **Use TypeScript** (optional) - Add types for better DX

## 🚨 Security Reminders

✅ **DO:**
- Use Row Level Security (already enabled)
- Validate data on Supabase side
- Keep .env.local in .gitignore
- Use anon key (not service role)

❌ **DON'T:**
- Commit .env.local to git
- Use service role key in frontend
- Trust only client-side validation
- Expose API keys in code

## 📖 Learn More

- Supabase Docs: https://supabase.com/docs
- Auth Guide: https://supabase.com/docs/guides/auth
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security
- React Integration: https://supabase.com/docs/guides/auth/auth-with-react

---

**You're all set!** 🎉 Your app now has production-ready authentication and database storage. Start registering users and watch the data appear in Supabase!
