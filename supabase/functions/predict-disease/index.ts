import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictRequest {
  symptom_ids: number[];
}

interface Prediction {
  disease_id: number;
  disease_name: string;
  confidence: number;
  specialty: string;
  severity: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { symptom_ids }: PredictRequest = await req.json();

    if (!symptom_ids || symptom_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'symptom_ids is required and cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch disease-symptom mappings for given symptoms
    const { data: mappings, error: mappingError } = await supabase
      .from('disease_symptoms')
      .select('disease_id, weight, is_primary, diseases(id, name, specialty, severity, symptoms_required)')
      .in('symptom_id', symptom_ids);

    if (mappingError) throw mappingError;

    // Calculate weighted scores per disease
    const scores: Record<number, {
      name: string;
      specialty: string;
      severity: string;
      score: number;
      matchCount: number;
      required: number;
    }> = {};

    for (const m of mappings ?? []) {
      const disease = (m as any).diseases;
      if (!disease) continue;
      const id = m.disease_id;
      if (!scores[id]) {
        scores[id] = {
          name: disease.name,
          specialty: disease.specialty,
          severity: disease.severity,
          score: 0,
          matchCount: 0,
          required: disease.symptoms_required ?? 1,
        };
      }
      const weight = m.weight * (m.is_primary ? 1.5 : 1.0);
      scores[id].score += weight;
      scores[id].matchCount += 1;
    }

    // Normalise scores and filter by minimum symptom count
    const maxPossibleScore = symptom_ids.length * 5 * 1.5;
    const predictions: Prediction[] = Object.entries(scores)
      .filter(([, v]) => v.matchCount >= v.required)
      .map(([id, v]) => ({
        disease_id: Number(id),
        disease_name: v.name,
        specialty: v.specialty,
        severity: v.severity,
        confidence: Math.min(
          Math.round((v.score / maxPossibleScore) * 100),
          99
        ),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    return new Response(
      JSON.stringify({ predictions }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
