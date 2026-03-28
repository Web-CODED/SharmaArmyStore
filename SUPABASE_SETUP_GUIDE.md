# Supabase Integration Guide for Sharma Army Store

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: Sharma Army Store
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Wait for project to be created (2-3 minutes)

## Step 2: Get Your API Keys

1. Go to **Settings → API**
2. Under **Project API Keys**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

## Step 3: Setup Environment Variables

1. Create `.env.local` file in your project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Never commit this to git!** Add to `.gitignore`:

```
.env.local
.env
```

## Step 4: Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire schema from `supabase-schema.sql` file
4. Click **Run**

This will create:
- `user_profiles` - User account data
- `user_addresses` - Shipping addresses
- `orders` - Customer orders
- `wishlist` - Product favorites
- Row Level Security (RLS) policies for data protection

## Step 5: Configure Authentication

### Email/Password Auth (Enabled by Default)
1. Go to **Authentication → Providers**
2. Email auth should be enabled
3. Go to **Settings → Auth**
4. Ensure "Enable signup" is ON
5. Optional: Configure Email Templates for welcome emails

### Social Login (Optional)
1. Go to **Authentication → Providers**
2. Enable Google/GitHub if desired
3. Add your OAuth app credentials

## Step 6: Setup Row Level Security (RLS)

RLS is already configured in the SQL schema. It ensures:
- Users can only see their own profile
- Users can only see their own orders/addresses
- Users can only manage their own wishlist

## Step 7: Test the Integration

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/register
3. Create a test account
4. Verify data appears in Supabase dashboard

## Project Structure

```
src/
├── config/
│   └── supabase.js           # Supabase client initialization
├── context/
│   └── AuthContext.jsx        # Auth state & functions
├── lib/
│   └── supabase-queries.js    # Database queries
└── pages/
    ├── LoginPage.jsx          # Updated with Supabase
    ├── RegisterPage.jsx       # Updated with Supabase
    └── ProfileDashboard.jsx   # (needs update for user data display)
```

## API Functions Available

### Authentication
- `signUp(email, password, fullName)` - Create new account
- `signIn(email, password)` - Login to account
- `signOut()` - Logout

### User Data
- `updateProfile(updates)` - Update user profile
- `getUserAddresses(userId)` - Get all saved addresses
- `addAddress(userId, addressData)` - Save new address
- `updateAddress(addressId, updates)` - Update address
- `deleteAddress(addressId)` - Remove address

### Orders
- `addOrder(userId, orderData)` - Create order
- `getOrders(userId)` - Get user's order history
- `getOrderById(orderId)` - Get specific order

### Wishlist
- `addToWishlist(userId, productId)` - Add to favorites
- `getWishlist(userId)` - Get user's wishlist
- `removeFromWishlist(userId, productId)` - Remove from favorites

## Usage Examples

### In a React Component

```jsx
import { useAuth } from '@/context/AuthContext';
import { addOrder, getOrders } from '@/lib/supabase-queries';

const MyComponent = () => {
  const { user, profile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  const handlePlaceOrder = async () => {
    try {
      const order = await addOrder(user.id, {
        items: cartItems,
        total: 1000,
        status: 'pending'
      });
      console.log('Order created:', order);
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  return (
    <div>
      <h1>Welcome, {profile?.full_name}</h1>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};
```

### Protect Routes (Optional)

```jsx
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

// In App.jsx
<Route path="/profile" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />
```

## Next Steps

1. **Update ProfileDashboard.jsx** - Display user data, manage addresses
2. **Update Checkout.jsx** - Save orders to database
3. **Add Order History** - Show user's past orders
4. **Email Notifications** - Configure welcome/order emails in Supabase
5. **Deploy** - Use environment variables in Vercel/Netlify

## Troubleshooting

### "VITE_SUPABASE_URL is undefined"
- Check `.env.local` file exists in root directory
- Restart dev server after adding `.env.local`
- Don't use `process.env`, use `import.meta.env`

### "Row level security" errors
- Check RLS policies in Supabase SQL Editor
- Ensure user is authenticated before querying

### "User not found" after signup
- Email confirmation may be required
- Check Supabase Settings → Auth → Email Templates

## Security Best Practices

1. **Never expose service role key** - Only use `anon public` key
2. **Use RLS policies** - Restrict data access at database level
3. **Validate on backend** - Don't trust client-side validation alone
4. **Use HTTPS only** - Supabase handles this automatically
5. **Rotate keys regularly** - Do this in production monthly

## Support

- Supabase Docs: https://supabase.com/docs
- Discord Community: https://discord.supabase.io
- GitHub Issues: https://github.com/supabase/supabase
