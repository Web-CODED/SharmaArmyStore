import React, { 
  createContext, useContext, 
  useEffect, useState, useRef 
} from 'react';
import supabase from '@/utils/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const isFetchingProfile = useRef(false);

  const fetchUserProfile = async (userId) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingProfile.current) return;
    isFetchingProfile.current = true;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist — create it
          await createUserProfile(userId);
        } else {
          console.error('Error fetching profile:', error);
        }
        return;
      }

      setProfile(data);

    } catch (err) {
      console.error('fetchUserProfile error:', err);
    } finally {
      isFetchingProfile.current = false;
      setLoading(false);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: { session } } = 
        await supabase.auth.getSession();
      
      const authUser = session?.user;
      if (!authUser) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          id: userId,
          email: authUser.email,
          full_name: 
            authUser.user_metadata?.full_name || 
            authUser.email,
          phone_number: 
            authUser.user_metadata?.phone_number,
          gender: authUser.user_metadata?.gender,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('createUserProfile error:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = 
          await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('initAuth error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = 
      supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;

          setSession(session);
          setUser(session?.user || null);

          if (event === 'SIGNED_OUT') {
            setProfile(null);
            setLoading(false);
            return;
          }

          if (event === 'SIGNED_IN' && session?.user) {
            await fetchUserProfile(session.user.id);
            return;
          }

          if (event === 'TOKEN_REFRESHED') {
            // Don't refetch profile on token refresh
            setLoading(false);
            return;
          }

          if (!session) {
            setProfile(null);
            setLoading(false);
          }
        }
      );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (
    email, password, fullName, 
    phoneNumber, gender
  ) => {
    try {
      const { data: authData, error: authError } = 
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 
              `${import.meta.env.VITE_SITE_URL}/auth/callback`,
            data: {
              full_name: fullName,
              phone_number: phoneNumber,
              gender: gender,
            },
          },
        });

      if (authError) throw authError;

      if (authData.user && !authData.session) {
        return {
          success: true,
          user: authData.user,
          needsEmailVerification: true,
        };
      }

      return { success: true, user: authData.user };

    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      localStorage.removeItem('sharma-army-store-auth');

      const { data, error } = 
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      setUser(data.user);
      setSession(data.session);
      await fetchUserProfile(data.user.id);

      return { success: true, user: data.user };

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
      if (!user) throw new Error('No user logged in');

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

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
