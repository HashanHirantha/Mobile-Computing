import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null;
  profile_image: string | null;
  role: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, meta?: { firstName?: string; lastName?: string; phone?: string; dateOfBirth?: string; gender?: string; bloodGroup?: string; profileImageUri?: string; heightCm?: number; weightKg?: number; bmi?: number }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.log('Session retrieval error:', error.message);
        // If there's an error (e.g. invalid refresh token), we can clear the session
        supabase.auth.signOut();
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    }).catch((e) => {
      console.log('Session error:', e);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, meta?: { firstName?: string; lastName?: string; phone?: string; dateOfBirth?: string; gender?: string; bloodGroup?: string; profileImageUri?: string; heightCm?: number; weightKg?: number; bmi?: number }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error && data.user && meta) {
      let profile_image = null;

      if (meta.profileImageUri) {
        const ext = meta.profileImageUri.split('.').pop() ?? 'jpg';
        const filePath = `${data.user.id}/avatar.${ext}`;
        try {
          const response = await fetch(meta.profileImageUri);
          const blob = await response.blob();
          const { error: uploadError } = await supabase.storage.from('patients').upload(filePath, blob, {
            upsert: true,
            contentType: `image/${ext}`,
          });
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('patients').getPublicUrl(filePath);
            profile_image = urlData.publicUrl;
          }
        } catch (e) {
          console.error("Image upload failed", e);
        }
      }

      // Filter out undefined or empty string values to prevent DB constraints from failing
      const updateData: any = {};
      if (meta.firstName) updateData.first_name = meta.firstName;
      if (meta.lastName) updateData.last_name = meta.lastName;
      if (meta.phone) updateData.phone = meta.phone;
      if (meta.dateOfBirth) updateData.date_of_birth = meta.dateOfBirth;
      if (meta.gender) updateData.gender = meta.gender;
      if (meta.bloodGroup) updateData.blood_group = meta.bloodGroup;
      if (meta.heightCm) updateData.height_cm = meta.heightCm;
      if (meta.weightKg) updateData.weight_kg = meta.weightKg;
      if (meta.bmi) updateData.bmi = meta.bmi;
      if (profile_image) updateData.profile_image = profile_image;

      // Update profile with extra fields if any exist
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error("Profile update failed:", updateError);
        }
      }
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
