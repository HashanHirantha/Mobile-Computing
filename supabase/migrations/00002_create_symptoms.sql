-- Migration: 00002_create_symptoms

CREATE TABLE IF NOT EXISTS public.symptoms (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(200) UNIQUE NOT NULL,
  description    TEXT,
  body_part      VARCHAR(100) NOT NULL,
  severity_level TEXT NOT NULL DEFAULT 'moderate' CHECK (severity_level IN ('mild', 'moderate', 'severe')),
  icon           VARCHAR(50),
  is_emergency   BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_symptoms_body_part ON public.symptoms(body_part);

CREATE TRIGGER set_symptoms_updated_at
  BEFORE UPDATE ON public.symptoms
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
