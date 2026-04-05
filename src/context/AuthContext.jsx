import React, { createContext, useContext,
  useEffect, useState } from 'react';
import supabase from '@/utils/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error(
    'useAuth must be used within AuthProvider'
  );
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('fetchUserProfile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(
      ({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      }
    );

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user || null);
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email, password
        });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      await fetchUserProfile(data.user.id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signUp = async (
    email, password, fullName,
    phoneNumber, gender
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            `${import.meta.env.VITE_SITE_URL}/auth/callback`,
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            gender
          }
        }
      });
      if (error) throw error;
      if (data.user && !data.session) {
        return {
          success: true,
          needsEmailVerification: true
        };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      localStorage.clear();
      window.location.replace('/');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user');
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
      return { success: true, profile: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading,
      signIn, signUp, signOut, updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
