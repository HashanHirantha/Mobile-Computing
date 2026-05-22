import { Database } from './database.types';

// ─── Table Row Types ─────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Symptom = Database['public']['Tables']['symptoms']['Row'];
export type Disease = Database['public']['Tables']['diseases']['Row'];
export type DiseaseSymptom = Database['public']['Tables']['disease_symptoms']['Row'];
export type Doctor = Database['public']['Tables']['doctors']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type MedicalHistory = Database['public']['Tables']['medical_history']['Row'];
export type DiagnosisHistory = Database['public']['Tables']['diagnosis_history']['Row'];
export type DoctorSpecialty = Database['public']['Tables']['doctor_specialties']['Row'];

// ─── Extended/Joined Types ───────────────────────────────────

export type DoctorWithProfile = Doctor & {
  profiles: Pick<Profile, 'first_name' | 'last_name' | 'profile_image'> | null;
};

export type AppointmentWithDoctor = Appointment & {
  doctors: (Pick<Doctor, 'specialty' | 'consultation_fee' | 'hospital_name'> & {
    profiles: Pick<Profile, 'first_name' | 'last_name' | 'profile_image'> | null;
  }) | null;
};

export type ReviewWithProfile = Review & {
  profiles: Pick<Profile, 'first_name' | 'last_name'> | null;
};

export type DiagnosisWithDisease = DiagnosisHistory & {
  diseases: Pick<Disease, 'name' | 'specialty' | 'severity'> | null;
};

// ─── Prediction Types ────────────────────────────────────────

export interface Prediction {
  disease_id: number;
  disease_name: string;
  confidence: number;
  specialty: string;
}

// ─── User Role ───────────────────────────────────────────────
export type UserRole = 'patient' | 'doctor' | 'admin';

// ─── Appointment Status ──────────────────────────────────────
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

// ─── Severity ────────────────────────────────────────────────
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type SeverityLevel = 'mild' | 'moderate' | 'severe';
