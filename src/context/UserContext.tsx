import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  membership_level: string;
  points: number;
  avatar_url: string | null;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  consumptionCount: number;
  stamps: number;
  addConsumption: () => void;
  redeemStamps: () => void;
  addPoints: (points: number) => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Default demo states for now (can map to profile points later)
  const [consumptionCount, setConsumptionCount] = useState(12);
  const [stamps, setStamps] = useState(4);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh local profile
      await fetchProfile(user.id);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const addConsumption = () => {
    setConsumptionCount(prev => prev + 1);
    setStamps(prev => prev + 1);
  };

  const redeemStamps = () => {
    setStamps(prev => Math.max(0, prev - 5));
  };

  const addPoints = (points: number) => {
    setStamps(prev => prev + points);
  };

  return (
    <UserContext.Provider value={{
      user, profile, loading,
      consumptionCount, stamps, addConsumption, redeemStamps, addPoints, signOut, updateProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};
