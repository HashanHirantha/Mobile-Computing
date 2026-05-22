-- Migration: 00009_create_medical_history

CREATE TABLE IF NOT EXISTS public.medical_history (
  id              SERIAL PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  condition       VARCHAR(300) NOT NULL,
  diagnosed_date  DATE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'managed')),
  medications     TEXT[],
  allergies       TEXT[],
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medical_history_user_id ON public.medical_history(user_id);

CREATE TRIGGER set_medical_history_updated_at
  BEFORE UPDATE ON public.medical_history
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
