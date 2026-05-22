-- Migration: 00010_create_diagnosis_history

CREATE TABLE IF NOT EXISTS public.diagnosis_history (
  id                    SERIAL PRIMARY KEY,
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symptoms              INTEGER[] NOT NULL,
  predicted_disease_id  INTEGER REFERENCES public.diseases(id) ON DELETE SET NULL,
  confidence_score      NUMERIC(5, 2) NOT NULL,
  all_predictions       JSONB NOT NULL DEFAULT '[]',
  feedback              TEXT CHECK (feedback IN ('helpful', 'not_helpful', 'incorrect')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_history_user_id     ON public.diagnosis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_history_disease_id  ON public.diagnosis_history(predicted_disease_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_history_created_at  ON public.diagnosis_history(created_at);
