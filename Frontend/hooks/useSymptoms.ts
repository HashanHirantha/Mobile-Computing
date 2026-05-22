import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Symptom {
  id: number;
  name: string;
  body_part: string;
  severity_level: string;
  is_emergency: boolean;
  description: string | null;
  icon: string | null;
}

/**
 * Hook for fetching and searching symptoms from Supabase.
 */
export function useSymptoms(bodyPart?: string) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSymptoms();
  }, [bodyPart]);

  const fetchSymptoms = async () => {
    setLoading(true);
    let query = supabase.from('symptoms').select('*').order('name');
    if (bodyPart && bodyPart !== 'All') {
      query = query.ilike('body_part', bodyPart);
    }
    const { data, error: fetchError } = await query;
    if (fetchError) setError(fetchError.message);
    else setSymptoms(data ?? []);
    setLoading(false);
  };

  const searchSymptoms = async (query: string) => {
    if (!query.trim()) {
      fetchSymptoms();
      return;
    }
    setLoading(true);
    const { data, error: searchError } = await supabase
      .from('symptoms')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name');
    if (searchError) setError(searchError.message);
    else setSymptoms(data ?? []);
    setLoading(false);
  };

  return { symptoms, loading, error, fetchSymptoms, searchSymptoms };
}
