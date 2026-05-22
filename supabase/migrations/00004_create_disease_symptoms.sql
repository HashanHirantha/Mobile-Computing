-- Migration: 00004_create_disease_symptoms

CREATE TABLE IF NOT EXISTS public.disease_symptoms (
  id          SERIAL PRIMARY KEY,
  disease_id  INTEGER NOT NULL REFERENCES public.diseases(id) ON DELETE CASCADE,
  symptom_id  INTEGER NOT NULL REFERENCES public.symptoms(id) ON DELETE CASCADE,
  weight      REAL NOT NULL DEFAULT 1.0 CHECK (weight >= 0.0 AND weight <= 5.0),
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(disease_id, symptom_id)
);

CREATE INDEX IF NOT EXISTS idx_ds_disease_id ON public.disease_symptoms(disease_id);
CREATE INDEX IF NOT EXISTS idx_ds_symptom_id ON public.disease_symptoms(symptom_id);
