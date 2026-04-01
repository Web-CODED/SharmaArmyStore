# 🔧 Registration Flow Fix - User Profile Data Persistence

## Problem Identified 🔍

Users were being created in Supabase auth successfully, but their **full name**, **phone number**, and **gender** were not being saved to the `user_profiles` table, leaving it empty.

### Root Causes
1. **Race Condition**: The client-side profile insert was happening too quickly after auth signup, before the auth user was fully committed to the database
2. **Silent Failures**: Profile creation errors were being caught and logged as warnings, allowing the registration to appear successful even when profile data wasn't saved
3. **Improper Error Handling**: No fallback mechanism existed to ensure profile creation

---

## Solution Implemented ✅

### 1. **Enhanced AuthContext (`src/context/AuthContext.jsx`)**

The `signUp()` function now:
- ✅ Waits up to 2 seconds for the database trigger to create the profile
- ✅ Retries checking every 200ms if the profile exists
- ✅ Falls back to manual profile creation if the trigger fails
- ✅ Properly handles and throws errors instead of silently failing
- ✅ Verifies all data (full_name, phone_number, gender) is present

**Key Changes:**
```javascript
// Old: Silent failure with warning
if (profileError) {
  console.warn('Profile creation note:', profileError.message);
}

// New: Proper error handling with retry and fallback
while (!profileCreated && attempts < maxAttempts) {
  // Check if profile exists
  // Retry if not found
  // Fallback to manual insert if trigger fails
}
```

### 2. **Added Debug & Verification Functions (`src/lib/supabase-queries.js`)**

New helper functions to verify profile data:
- `verifyUserProfile()` - Check if user profile exists with all data
- `getUserAuthMetadata()` - Verify metadata stored in auth
- `syncProfileFromAuth()` - Manually sync profile from auth data

---

## Testing the Fix 🧪

### Before Registration:

1. Open your browser console (F12 → Console tab)
2. You can now see detailed logs about profile creation:
   ```
   ✅ User profile found: {full_name: "John Doe", phone_number: "9876543210", gender: "male", ...}
   ```

### Step-by-Step Test:

1. **Register a new account:**
   - Go to http://localhost:3000/register
   - Fill in:
     - Full Name: `John Doe`
     - Email: `john@example.com`
     - Phone: `9876543210`
     - Gender: `Male`
     - Password: `TestPass123`

2. **Verify in Supabase:**
   - Go to Supabase Dashboard
   - Click "SQL Editor"
   - Run this query:
     ```sql
     SELECT id, email, full_name, phone_number, gender FROM user_profiles LIMIT 10;
     ```
   - You should see the new user with all data populated

3. **Check Console Logs:**
   - User profile verification happens automatically
   - Look for: `✅ User profile found:` message

---

## Database Setup Requirements 📋

**IMPORTANT**: Make sure these have been run in your Supabase project:

### 1. **Run the Schema Script**
```sql
-- Copy entire contents of supabase-schema.sql
-- Paste into Supabase SQL Editor
-- Click "Run"
```

This creates:
- `user_profiles` table
- `user_addresses` table
- `orders` table
- RLS policies
- **Database trigger** (`on_auth_user_created`)

### 2. **Verify the Trigger Exists**
Go to Supabase SQL Editor and run:
```sql
-- Check if trigger exists
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Should return one row with:
-- trigger_name: on_auth_user_created
-- event_manipulation: INSERT
-- action_timing: AFTER
```

### 3. **Check Trigger Function**
```sql
-- View the trigger function
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
```

Should show the function reads from `raw_user_meta_data` to extract phone_number and gender.

---

## Troubleshooting 🐛

### Issue: Profile still not being created

**Check 1: Verify RLS Policy**
```sql
-- User should be able to insert their own profile
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles' 
AND policyname LIKE '%insert%';
```

**Check 2: Verify Trigger is Active**
```sql
-- Manually test trigger by viewing recent profiles
SELECT id, email, full_name, phone_number, gender, created_at 
FROM user_profiles 
ORDER BY created_at DESC LIMIT 5;
```

**Check 3: Console Logs**
When registering, check browser console (F12) for:
- `"Trigger did not create profile, creating manually..."` → Trigger failed, fallback used
- Any error messages about `INSERT` failures

### Issue: User metadata not being saved

In browser console, after logging in, run:
```javascript
// Check what metadata was stored in auth
const { data } = await supabase.auth.getUser();
console.log('Auth metadata:', data.user.user_metadata);
```

Should show:
```javascript
{
  full_name: "John Doe",
  phone_number: "9876543210",
  gender: "male"
}
```

---

## Debugging Functions 🔍

### Test Profile Creation Manually:

1. Go to any page and open console (F12)
2. Run these commands:

```javascript
// Import the functions
import { verifyUserProfile, getUserAuthMetadata, syncProfileFromAuth } 
  from '@/lib/supabase-queries';

// Check current user's auth metadata
await getUserAuthMetadata();
// > 📋 Auth user metadata: {full_name: "...", phone_number: "...", ...}

// Verify profile exists
await verifyUserProfile(currentUserId);
// > ✅ User profile found: {...}

// Force sync profile from auth (fixes missing data)
await syncProfileFromAuth();
// > ✅ Profile synced from auth: {...}
```

---

## What Data is Now Being Saved? 📊

When a user registers, the following data is now properly saved:

| Field | Source | Saved In |
|-------|--------|----------|
| ID | Auth User ID | `user_profiles.id` |
| Email | Registration Email | `user_profiles.email` |
| Full Name | Registration Form | `user_profiles.full_name` |
| Phone Number | Registration Form | `user_profiles.phone_number` |
| Gender | Registration Form | `user_profiles.gender` |
| Created At | Timestamp | `user_profiles.created_at` |
| Updated At | Timestamp | `user_profiles.updated_at` |

---

## How It Works Now 🔄

```
User Clicks "Register"
  ↓
Form validates data
  ↓
AuthContext.signUp() called with:
  - email, password, fullName, phoneNumber, gender
  ↓
Supabase Auth creates user with metadata:
  ↓
Database trigger fires immediately:
  - Reads from auth.users.raw_user_meta_data
  - Inserts into user_profiles
  ↓
Client-side code checks for profile (every 200ms):
  ↓
If profile found → Fetch and display ✅
If after 2s still not found → Manual fallback insert ✅
  ↓
Profile data available in:
  - AuthContext.profile
  - user_profiles table
  - Supabase dashboard
```

---

## RLS Policies Verification ✅

The following RLS policies are now enforced:

```sql
-- Users can view their own profile
SELECT auth.uid() = id

-- Users can update their own profile
UPDATE auth.uid() = id

-- Users can insert their own profile
INSERT WITH CHECK auth.uid() = id
```

This means:
- ✅ Users can only see their own profile
- ✅ Users can only update their own profile
- ✅ Users can only create their own profile during signup

---

## Summary of Changes 📝

| File | Changes |
|------|---------|
| `src/context/AuthContext.jsx` | Enhanced signUp() with retry logic, proper error handling, and fallback profile creation |
| `src/lib/supabase-queries.js` | Added debug functions: verifyUserProfile(), getUserAuthMetadata(), syncProfileFromAuth() |
| Database Schema | Already includes trigger (verify with troubleshooting section) |

---

## Next Steps 🚀

1. ✅ Apply all the code changes from this fix
2. ✅ Verify database trigger is set up (see Database Setup section)
3. ✅ Test registration with a new account
4. ✅ Check Supabase dashboard to confirm data is saved
5. ✅ If issues persist, run troubleshooting commands above

---

## Support 💡

If profile data is still not being saved after this fix:

1. Check browser console for error messages
2. Run the debug functions listed in "Debugging Functions" section
3. Verify trigger exists: `SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
4. Check RLS policies are correct (see Troubleshooting section)

**Remember**: Always check the browser console for logs when testing registration!
