import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Doctor {
  id: string;
  specialty: string;
  experience_years: number;
  hospital_name: string | null;
  consultation_fee: number;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  available_days: string | null;
  bio: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
  };
}

/**
 * Hook for fetching doctors from Supabase.
 */
export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async (specialty?: string) => {
    setLoading(true);
    let query = supabase
      .from('doctors')
      .select('*, profiles(first_name, last_name, profile_image)')
      .eq('is_verified', true)
      .order('average_rating', { ascending: false });

    if (specialty) {
      query = query.ilike('specialty', specialty);
    }

    const { data, error: fetchError } = await query;
    if (fetchError) setError(fetchError.message);
    else setDoctors(data ?? []);
    setLoading(false);
  };

  const fetchDoctorById = async (id: string) => {
    const { data, error: fetchError } = await supabase
      .from('doctors')
      .select('*, profiles(first_name, last_name, profile_image, email, phone)')
      .eq('id', id)
      .single();
    if (fetchError) return { data: null, error: fetchError.message };
    return { data, error: null };
  };

  return { doctors, loading, error, fetchDoctors, fetchDoctorById };
}
