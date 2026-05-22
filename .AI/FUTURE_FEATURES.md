# 🚀 MediGuide — Future Features & Development Roadmap

## Overview

This document tracks all planned features, enhancements, and technical improvements for the MediGuide Disease & Doctor Recommendation app. Features are organized by development phase and priority.

> **Architecture**: The app uses **Supabase** as its backend (PostgreSQL, Auth, Storage, Edge Functions, Realtime). There is **no custom Express.js backend** — the React Native (Expo) frontend communicates directly with Supabase.

---

## Phase 1 — MVP (Core Features) ✅ TODO

> **Goal**: Build a working symptom checker with disease prediction and doctor listing using Supabase.

### 1.1 Supabase Project Setup
- [ ] Create Supabase project and configure environment
- [ ] Set up `supabase/` directory with CLI config (`config.toml`)
- [ ] Create all SQL migration files for tables
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Write and apply RLS policies
- [ ] Create database trigger for `profiles` table on auth signup
- [ ] Seed symptoms, diseases, disease-symptom mappings, and doctor data
- [ ] Generate TypeScript types (`supabase gen types typescript`)
- [ ] Initialize Supabase JS client in Frontend (`lib/supabase.ts`)

### 1.2 Authentication & User Management (Supabase Auth)
- [ ] User registration with email & password via `supabase.auth.signUp()`
- [ ] Login with `supabase.auth.signInWithPassword()`
- [ ] Auth state listener with `supabase.auth.onAuthStateChange()`
- [ ] Session persistence via AsyncStorage adapter
- [ ] Protected navigation (redirect unauthenticated users to login)
- [ ] User profile CRUD via `profiles` table (name, age, gender, blood group)
- [ ] Password reset via `supabase.auth.resetPasswordForEmail()`
- [ ] Auto-refresh token handling (built-in to Supabase client)

### 1.3 Symptom Checker
- [ ] Symptom database seeding (50+ symptoms in `supabase/seed.sql`)
- [ ] Fetch symptoms via `supabase.from('symptoms').select('*')`
- [ ] Symptom search with `ilike` or Supabase full-text search
- [ ] Multi-select symptom picker UI
- [ ] Body-part category filter via `supabase.from('symptoms').select('*').eq('body_part', part)`
- [ ] Severity level selector per symptom (mild/moderate/severe)
- [ ] Duration input per symptom

### 1.4 Disease Prediction Engine
- [ ] Rule-based prediction algorithm using weighted symptom matching
- [ ] Implement prediction as a Supabase Edge Function (`predict-disease`)
- [ ] Confidence score calculation per predicted disease
- [ ] Top 3 disease predictions display
- [ ] Disease detail screen (description, precautions, severity)
- [ ] Emergency alert for critical symptom combinations
- [ ] Disease database seeding (30+ diseases with symptom mappings)
- [ ] Save diagnosis results to `diagnosis_history` table

### 1.5 Doctor Listing & Recommendation
- [ ] Doctor database seeding (15+ doctors across specialties)
- [ ] Specialty-based doctor filtering from prediction results
- [ ] Doctor profile cards (name, specialty, hospital, rating, fee)
- [ ] Doctor detail screen with full profile
- [ ] Location-based sorting (nearest doctors via coordinate math)

### 1.6 Appointment Booking
- [ ] Date & time slot selection UI
- [ ] Booking creation via `supabase.from('appointments').insert({ ... })`
- [ ] Booking confirmation screen
- [ ] My Bookings list with status filters
- [ ] Cancel appointment via `supabase.from('appointments').update({ status: 'cancelled' })`
- [ ] Realtime appointment status updates via Supabase Realtime subscriptions

---

## Phase 2 — Enhanced Experience 🔜

> **Goal**: Add rich user experience features, doctor-side portal, and review system.

### 2.1 Doctor Dashboard (Doctor Role)
- [ ] Doctor registration flow (separate from patient)
- [ ] Doctor profile editor (specialty, qualifications, hospital, fees)
- [ ] Availability schedule management (days & hours)
- [ ] Incoming appointment requests view (realtime via Supabase)
- [ ] Accept / Reject / Reschedule appointments
- [ ] Patient symptom summary view before appointment

### 2.2 Ratings & Reviews System
- [ ] Post-appointment review prompt
- [ ] 1-5 star rating with written review via `supabase.from('reviews').insert({ ... })`
- [ ] Anonymous review option
- [ ] Average rating auto-calculation via `update_doctor_rating()` trigger
- [ ] Review moderation (flag inappropriate content)

### 2.3 Medical History & Health Profile
- [ ] Chronic conditions tracker via `medical_history` table
- [ ] Current medications list
- [ ] Allergies management
- [ ] Family medical history
- [ ] Past diagnosis history from `diagnosis_history` table
- [ ] PDF export of medical history

### 2.4 Push Notifications
- [ ] Appointment reminders via Supabase Edge Function + Expo Push API
- [ ] Booking status change notifications (triggered by Supabase Realtime or Database Webhooks)
- [ ] Health tip of the day
- [ ] Emergency health alerts

### 2.5 File Storage & Image Handling
- [ ] Profile image upload to Supabase Storage (`avatars` bucket)
- [ ] Medical document upload to Supabase Storage (`medical-docs` bucket)
- [ ] Image compression before upload
- [ ] Storage RLS policies for private documents

### 2.6 UI/UX Enhancements
- [ ] Dark mode support
- [ ] Onboarding walkthrough screens
- [ ] Skeleton loading screens
- [ ] Pull-to-refresh on all lists
- [ ] Animated transitions between screens
- [ ] Haptic feedback on actions

---

## Phase 3 — Advanced & AI Features 🔮

> **Goal**: Integrate machine learning, telemedicine, and advanced healthcare features.

### 3.1 AI/ML-Powered Disease Prediction
- [ ] Train Random Forest / SVM model on medical datasets
- [ ] Deploy ML inference as a Python microservice (called from Supabase Edge Function)
- [ ] NLP symptom input ("I've had a headache and nausea for 2 days")
- [ ] Improved prediction accuracy with patient history context
- [ ] Feedback loop — user reports help retrain model
- [ ] Confidence calibration and multi-disease comorbidity detection

### 3.2 Telemedicine & Virtual Consultation
- [ ] In-app video calling (WebRTC / Twilio)
- [ ] Real-time chat between patient and doctor (Supabase Realtime)
- [ ] File/image sharing in chat (Supabase Storage)
- [ ] Digital prescription generation
- [ ] Consultation recording (with consent)

### 3.3 Health Articles & Content
- [ ] Curated health articles stored in Supabase (articles table)
- [ ] Preventive care tips & lifestyle recommendations
- [ ] Seasonal health alerts (flu season, dengue, etc.)
- [ ] Bookmarking articles
- [ ] Article search & categories

### 3.4 Interactive Symptom Input
- [ ] 3D human body model for symptom selection
- [ ] Voice-based symptom input
- [ ] Photo-based symptom input (skin conditions) — upload to Supabase Storage
- [ ] Symptom timeline visualization
- [ ] Related symptom suggestions ("Did you also experience...")

### 3.5 Maps & Navigation
- [ ] Google Maps integration for doctor locations
- [ ] Directions to hospital/clinic
- [ ] Nearby hospitals/pharmacies search
- [ ] Emergency services locator

---

## Phase 4 — Scale & Monetization 💰

> **Goal**: Prepare for production, add premium features, and admin tooling.

### 4.1 Admin Panel
- [ ] Use Supabase Dashboard for basic admin operations
- [ ] Build custom admin views with Supabase RLS admin policies
- [ ] User management (view, block, delete)
- [ ] Doctor verification & approval workflow
- [ ] Symptom & disease CRUD management
- [ ] Analytics via Supabase SQL queries and dashboards

### 4.2 Payment Integration
- [ ] Stripe / Razorpay integration for consultation fees
- [ ] Payment processing via Supabase Edge Functions
- [ ] In-app payment during booking
- [ ] Payment history & receipts
- [ ] Doctor payout management
- [ ] Refund processing for cancellations

### 4.3 Multi-language Support
- [ ] i18n framework integration (react-i18next)
- [ ] Sinhala language support
- [ ] Tamil language support
- [ ] Language switcher in settings

### 4.4 Accessibility
- [ ] Screen reader support (VoiceOver / TalkBack)
- [ ] Font size adjustments
- [ ] High contrast mode
- [ ] Reduced motion mode

### 4.5 Performance & DevOps
- [ ] Supabase connection pooling (PgBouncer built-in)
- [ ] Image optimization via Supabase Storage transforms
- [ ] Edge Function monitoring and logging
- [ ] CI/CD pipeline (GitHub Actions + Supabase CLI)
- [ ] Automated testing (Jest + React Native Testing Library)
- [ ] Error tracking (Sentry)
- [ ] Supabase database backups and Point-in-Time Recovery

---

## Technical Debt & Improvements

| Item                                    | Priority | Description                                               |
| :-------------------------------------- | :------- | :-------------------------------------------------------- |
| RLS policy audit                        | High     | Review all RLS policies for data leaks and edge cases     |
| TypeScript types sync                   | High     | Auto-generate DB types on every migration via CI          |
| Input validation                        | High     | Validate inputs client-side and in Edge Functions         |
| Error handling standardization          | High     | Consistent error handling for Supabase `{ data, error }` responses |
| Database indexing                       | Medium   | Optimize queries with proper indexes (check query plans)  |
| TypeScript strict mode                  | Medium   | Enable `strict: true` in tsconfig                         |
| Logging                                 | Medium   | Structured logging in Edge Functions                      |
| Security audit                          | High     | Review RLS policies, Storage policies, Edge Function auth |
| Test coverage                           | Medium   | Aim for 80%+ coverage on services and hooks               |
| Environment config                      | Low      | Validate Supabase URL/key with `zod` at startup           |
| Code documentation                     | Low      | JSDoc comments on all public functions                     |
| Supabase migrations versioning          | Medium   | Keep all schema changes in migration files, never edit via Dashboard SQL Editor |

---

## Data Sources for Seed Data

| Resource                              | URL / Description                                           |
| :------------------------------------ | :--------------------------------------------------------- |
| Disease-Symptom Dataset (Kaggle)     | Kaggle datasets for disease-symptom mappings                |
| WHO ICD-11 Classification            | International Classification of Diseases                    |
| Mayo Clinic Symptom Checker          | Reference for symptom-disease relationships                 |
| NHS Health A-Z                       | Disease descriptions and precautions                        |
| Sri Lanka Medical Council            | Doctor registration & specialty data (if localizing)        |

---

## Development Priority Order

```
Phase 1 (MVP)
├── 1.1 Supabase Setup ────────── Week 1
├── 1.2 Auth (Supabase Auth) ──── Week 1-2
├── 1.3 Symptom Checker ──────── Week 2-3
├── 1.4 Disease Prediction ────── Week 3-4
├── 1.5 Doctor Recommendation ─── Week 4-5
└── 1.6 Appointment Booking ───── Week 5-6

Phase 2 (Enhanced)
├── 2.1 Doctor Dashboard ──────── Week 7-8
├── 2.2 Reviews System ────────── Week 8-9
├── 2.3 Medical History ────────── Week 9-10
├── 2.4 Notifications ─────────── Week 10-11
├── 2.5 Storage & Images ──────── Week 11
└── 2.6 UI Polish ─────────────── Week 11-12

Phase 3 (Advanced) ───────────── Week 13+
Phase 4 (Scale) ──────────────── Week 17+
```

---

## Notes

- All medical information in the app must include a **disclaimer** that this is not a substitute for professional medical advice.
- Disease prediction confidence below **50%** should recommend visiting a **General Practitioner**.
- Emergency symptoms (chest pain, difficulty breathing, severe bleeding) should trigger an **immediate emergency alert** with local emergency numbers.
- User medical data must be protected by **Supabase RLS policies** and **transmitted over HTTPS** only (Supabase enforces HTTPS by default).
- **Never expose the Supabase `service_role` key** in the mobile app. Only use the `anon` key client-side. Use `service_role` only in Edge Functions or server-side scripts.
- Keep all database schema changes in **migration files** (`supabase/migrations/`). Avoid making schema changes directly in the Supabase Dashboard SQL Editor to prevent drift.
