-- Migration: 00008_create_reviews

CREATE TABLE IF NOT EXISTS public.reviews (
  id             SERIAL PRIMARY KEY,
  patient_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id      UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  rating         INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment        TEXT,
  is_anonymous   BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(patient_id, doctor_id, appointment_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_doctor_id ON public.reviews(doctor_id);

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Auto-update doctor average rating on review change
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_doctor_id UUID;
BEGIN
  target_doctor_id := COALESCE(NEW.doctor_id, OLD.doctor_id);

  UPDATE public.doctors
  SET
    average_rating = COALESCE(
      (SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE doctor_id = target_doctor_id),
      0.00
    ),
    total_reviews  = (SELECT COUNT(*) FROM public.reviews WHERE doctor_id = target_doctor_id),
    updated_at     = NOW()
  WHERE id = target_doctor_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_doctor_rating();
