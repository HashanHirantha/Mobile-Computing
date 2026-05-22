import { supabase } from '../lib/supabase';

/**
 * Fetch all symptoms, optionally filtered by body part.
 */
export async function getSymptoms(bodyPart?: string) {
  let query = supabase.from('symptoms').select('*').order('name');
  if (bodyPart && bodyPart !== 'All') {
    query = query.ilike('body_part', bodyPart);
  }
  return query;
}

/**
 * Search symptoms by name.
 */
export async function searchSymptoms(query: string) {
  return supabase
    .from('symptoms')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name');
}

/**
 * Get symptoms by body part.
 */
export async function getSymptomsByBodyPart(bodyPart: string) {
  return supabase
    .from('symptoms')
    .select('*')
    .ilike('body_part', bodyPart)
    .order('name');
}
