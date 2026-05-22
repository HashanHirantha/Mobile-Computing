-- Migration: 00007_create_appointments

CREATE TABLE IF NOT EXISTS public.appointments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id           UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  disease_id          INTEGER REFERENCES public.diseases(id) ON DELETE SET NULL,
  appointment_date    DATE NOT NULL,
  appointment_time    TIME NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  symptoms_text       TEXT,
  notes               TEXT,
  cancellation_reason TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id    ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id     ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status        ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date          ON public.appointments(appointment_date);

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
