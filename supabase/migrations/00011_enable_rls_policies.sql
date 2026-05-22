-- Migration: 00011_enable_rls_policies
-- Enables Row Level Security on all tables and creates access policies

-- ─── Enable RLS ─────────────────────────────────────────────
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_symptoms  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_history ENABLE ROW LEVEL SECURITY;

-- ─── profiles ────────────────────────────────────────────────
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow reading basic info for doctor discovery
CREATE POLICY "profiles_select_public_for_doctors" ON public.profiles
  FOR SELECT USING (
    role IN ('doctor', 'admin') OR auth.uid() = id
  );

-- ─── symptoms (public read for authenticated users) ──────────
CREATE POLICY "symptoms_select_authenticated" ON public.symptoms
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── diseases (public read for authenticated users) ──────────
CREATE POLICY "diseases_select_authenticated" ON public.diseases
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── disease_symptoms ────────────────────────────────────────
CREATE POLICY "disease_symptoms_select_authenticated" ON public.disease_symptoms
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── doctors ─────────────────────────────────────────────────
CREATE POLICY "doctors_select_all" ON public.doctors
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "doctors_insert_own" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "doctors_update_own" ON public.doctors
  FOR UPDATE USING (auth.uid() = user_id);

-- ─── doctor_specialties ──────────────────────────────────────
CREATE POLICY "doctor_specialties_select_authenticated" ON public.doctor_specialties
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── appointments ────────────────────────────────────────────
CREATE POLICY "appointments_select_patient" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "appointments_select_doctor" ON public.appointments
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = doctor_id)
  );

CREATE POLICY "appointments_insert_patient" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "appointments_update_patient" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "appointments_update_doctor" ON public.appointments
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = doctor_id)
  );

-- ─── reviews ─────────────────────────────────────────────────
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "reviews_insert_patient" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE USING (auth.uid() = patient_id);

-- ─── medical_history ─────────────────────────────────────────
CREATE POLICY "medical_history_select_own" ON public.medical_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "medical_history_insert_own" ON public.medical_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "medical_history_update_own" ON public.medical_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "medical_history_delete_own" ON public.medical_history
  FOR DELETE USING (auth.uid() = user_id);

-- ─── diagnosis_history ───────────────────────────────────────
CREATE POLICY "diagnosis_history_select_own" ON public.diagnosis_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "diagnosis_history_insert_own" ON public.diagnosis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
