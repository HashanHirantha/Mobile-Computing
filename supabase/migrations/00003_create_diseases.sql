-- Migration: 00003_create_diseases

CREATE TABLE IF NOT EXISTS public.diseases (
  id                 SERIAL PRIMARY KEY,
  name               VARCHAR(200) UNIQUE NOT NULL,
  description        TEXT NOT NULL,
  specialty          VARCHAR(100) NOT NULL,
  severity           TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  precautions        TEXT[],
  symptoms_required  INTEGER NOT NULL DEFAULT 2,
  is_chronic         BOOLEAN NOT NULL DEFAULT false,
  image_url          TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diseases_specialty ON public.diseases(specialty);

CREATE TRIGGER set_diseases_updated_at
  BEFORE UPDATE ON public.diseases
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
