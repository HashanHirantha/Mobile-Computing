-- Migration: 00006_create_doctor_specialties

CREATE TABLE IF NOT EXISTS public.doctor_specialties (
  id          SERIAL PRIMARY KEY,
  disease_id  INTEGER NOT NULL REFERENCES public.diseases(id) ON DELETE CASCADE,
  specialty   VARCHAR(100) NOT NULL,
  priority    INTEGER NOT NULL DEFAULT 1,
  UNIQUE(disease_id, specialty)
);

CREATE INDEX IF NOT EXISTS idx_doc_spec_disease_id ON public.doctor_specialties(disease_id);
