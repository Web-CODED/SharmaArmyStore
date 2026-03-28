import { supabase } from '@/config/supabase';

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
