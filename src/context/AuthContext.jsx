import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/utils/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user || null);

      if (event === 'SIGNED_OUT') {
        setProfile(null);
        if (mounted) setLoading(false);
        return;
      }

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }

      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          await createUserProfile(userId);
          return;
        } else {
          console.error('Error fetching profile:', error);
          return;
        }
      }

      const { data: authUserResponse } = await supabase.auth.getUser();
      const authUser = authUserResponse?.user;

      const patch = {};
      if (authUser) {
        const metadata = authUser.user_metadata || {};

        if (!data.full_name || data.full_name === authUser.email) {
          if (metadata.full_name) patch.full_name = metadata.full_name;
        }
        if (!data.phone_number && metadata.phone_number) {
          patch.phone_number = metadata.phone_number;
        }
        if (!data.gender && metadata.gender) {
          patch.gender = metadata.gender;
        }
      }

      if (Object.keys(patch).length > 0) {
        const { data: updatedData, error: updateError } = await supabase
          .from('user_profiles')
          .update(patch)
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('Error patching incomplete profile:', updateError);
        } else {
          setProfile(updatedData);
          return;
        }
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw userError;

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
            phone_number: user.user_metadata?.phone_number,
            gender: user.user_metadata?.gender,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error('Error creating user profile:', err);
    }
  };

  const signUp = async (email, password, fullName, phoneNumber, gender) => {
    try {
      setError(null);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${import.meta.env.VITE_SITE_URL}/auth/callback`,
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            gender: gender,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        setUser(authData.user);

        const session = authData.session || null;
        const needsEmailVerification = !session;

        if (needsEmailVerification) {
          return {
            success: true,
            user: authData.user,
            needsEmailVerification: true,
          };
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 15;

        while (!profileCreated && attempts < maxAttempts) {
          attempts++;
          try {
            const { data: existingProfile, error: fetchError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', authData.user.id)
              .single();

            if (fetchError?.code === 'PGRST116') {
              await new Promise((resolve) => setTimeout(resolve, 200));
              continue;
            }

            if (existingProfile) {
              profileCreated = true;
              await fetchUserProfile(authData.user.id);
              break;
            }
          } catch (err) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            continue;
          }
        }

        if (!profileCreated) {
          const { data: sessionData } = await supabase.auth.getSession();
          const activeUserId = sessionData?.session?.user?.id;

          if (activeUserId === authData.user.id) {
            try {
              const { data: insertedProfile, error: insertError } = await supabase
                .from('user_profiles')
                .insert([
                  {
                    id: authData.user.id,
                    email,
                    full_name: fullName,
                    phone_number: phoneNumber,
                    gender: gender,
                  },
                ])
                .select()
                .single();

              if (insertError) {
                throw new Error(
                  `Failed to create user profile: ${insertError.message}`
                );
              }

              await fetchUserProfile(authData.user.id);
            } catch (err) {
              throw err;
            }
          }
        } else {
          const { data: currentProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (
            currentProfile &&
            (!currentProfile.phone_number || !currentProfile.gender)
          ) {
            await supabase
              .from('user_profiles')
              .update({
                phone_number: phoneNumber,
                gender: gender,
              })
              .eq('id', authData.user.id);

            await fetchUserProfile(authData.user.id);
          }
        }
      }

      return { success: true, user: authData.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      setSession(data.session);
      await fetchUserProfile(data.user.id);

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);

      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);

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
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    error,
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
