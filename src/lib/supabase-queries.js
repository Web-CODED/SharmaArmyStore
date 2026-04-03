import supabase from '@/utils/supabase';

// Orders
export const addOrder = async (userId, orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        ...orderData,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};

// User Addresses
export const addAddress = async (userId, addressData) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .insert([
      {
        user_id: userId,
        ...addressData,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserAddresses = async (userId) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateAddress = async (addressId, updates) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAddress = async (addressId) => {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId);

  if (error) throw error;
};

// User Preferences
export const updatePreferences = async (userId, preferences) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ preferences })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Wishlist
export const addToWishlist = async (userId, productId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .insert([
      {
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWishlist = async (userId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const removeFromWishlist = async (userId, productId) => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
};

// Debug & Verification Functions
/**
 * Verify that a user's profile data is properly saved
 * Returns the profile data if it exists, null otherwise
 */
export const verifyUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, phone_number, gender, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile verification error:', error);
      return null;
    }

    console.log('✅ User profile found:', data);
    return data;
  } catch (err) {
    console.error('Error verifying profile:', err);
    return null;
  }
};

/**
 * Get user's auth metadata to verify data was stored correctly
 * Only works if you're logged in as that user
 */
export const getUserAuthMetadata = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('Could not fetch auth user:', error);
      return null;
    }

    const metadata = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      phone_number: user.user_metadata?.phone_number,
      gender: user.user_metadata?.gender,
    };

    console.log('📋 Auth user metadata:', metadata);
    return metadata;
  } catch (err) {
    console.error('Error getting auth metadata:', err);
    return null;
  }
};

/**
 * Manually create/update user profile from auth metadata
 * Useful for fixing profiles that weren't created by trigger
 */
export const syncProfileFromAuth = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Could not get current user');
    }

    const { data, error: upsertError } = await supabase
      .from('user_profiles')
      .upsert([
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          phone_number: user.user_metadata?.phone_number,
          gender: user.user_metadata?.gender,
          updated_at: new Date().toISOString(),
        },
      ], {
        onConflict: 'id'
      })
      .select()
      .single();

    if (upsertError) {
      throw upsertError;
    }

    console.log('✅ Profile synced from auth:', data);
    return data;
  } catch (err) {
    console.error('Error syncing profile:', err);
    throw err;
  }
};
