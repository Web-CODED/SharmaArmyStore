# Supabase RLS Trigger Setup for User Registration

## Problem
When users register, they get the error:
```
new row violates row-level security policy for table "user_profiles"
```

This happens because the anonymous auth client can't insert into `user_profiles` due to RLS policies being too restrictive during signup.

## Solution Implemented

We've implemented a **Database Trigger** that automatically creates a user profile when a new auth user signs up. This bypasses the RLS policy issue entirely.

## Setup Instructions

### Option 1: Apply the Full Schema (Recommended for new databases)
1. Go to Supabase Dashboard → SQL Editor
2. Open a new query
3. Copy and paste the entire content from `supabase-schema.sql`
4. Run the SQL

### Option 2: Apply Just the Trigger (For existing databases)
1. Go to Supabase Dashboard → SQL Editor
2. Open a new query
3. Copy and paste the SQL below:

```sql
-- Trigger for auto-creating user_profiles when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, phone_number, gender, created_at, updated_at)
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'full_name', new.email),
      new.raw_user_meta_data->>'phone_number',
      new.raw_user_meta_data->>'gender',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to handle new signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

4. Click "Run"
5. You should see a success message

## How It Works

1. **User signs up** → Supabase Auth creates a new user in `auth.users`
2. **Trigger fires** → After user is created, the `on_auth_user_created` trigger runs
3. **Profile auto-created** → The `handle_new_user()` function inserts a record into `user_profiles`
4. **Profile populated** → `id`, `email`, `full_name`, `phone_number`, and `gender` are automatically filled from auth data

## Code Changes Made

### 1. `supabase-schema.sql`
- Added trigger function `handle_new_user()`
- Added trigger `on_auth_user_created`

### 2. `src/context/AuthContext.jsx`
- Updated `signUp()` to pass `full_name` in auth options
- Made profile creation non-blocking (won't fail signup if it errors)
- Added 500ms delay to allow trigger to execute before fetching profile

## Benefits

✅ **No RLS conflicts** - Profile is created by system, not user  
✅ **Automatic** - Users don't need to manually create profiles  
✅ **Fast** - Happens server-side in the database  
✅ **Reliable** - Guaranteed to work with every signup  
✅ **Backwards compatible** - Uses `ON CONFLICT DO NOTHING` to handle edge cases  

## Testing

1. Go to http://localhost:5173/register
2. Fill in the registration form
3. Submit
4. You should see a success message
5. Check Supabase Dashboard → Tables → `user_profiles` to verify the profile was created

## Troubleshooting

### If you still get RLS errors:
1. Verify the trigger was created:
   - Go to Supabase → Functions or PostgreSQL functions list
   - Look for `handle_new_user` function
   - Look for `on_auth_user_created` trigger

2. Check RLS policies on `user_profiles`:
   - Go to Supabase → Authentication → Policies
   - Verify the policy allows users to insert their own profile

3. Manually create a profile test:
   - In SQL Editor, try: 
   ```sql
   SELECT handle_new_user();
   ```

## Additional Notes

- The trigger uses `SECURITY DEFINER` to run with database owner permissions, bypassing RLS
- `ON CONFLICT (id) DO NOTHING` ensures duplicate inserts don't cause errors
- The `full_name` defaults to email if not provided in signup metadata
