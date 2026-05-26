# 🏥 MediGuide — Disease & Doctor Recommendation App

## Project Overview

**MediGuide** is a mobile healthcare application that helps users identify potential diseases based on their symptoms and recommends suitable doctors/specialists nearby. The app uses a symptom-based prediction engine to suggest possible conditions and then matches users with verified healthcare professionals based on specialty, location, ratings, and availability.

> ⚠️ **Disclaimer**: This app is a **decision-support tool** and does NOT replace professional medical diagnosis. Users should always consult a licensed healthcare provider for medical advice.

---

## Tech Stack

| Layer               | Technology                                           |
| :------------------ | :--------------------------------------------------- |
| **Mobile Frontend** | React Native (Expo SDK 54) + TypeScript              |
| **Backend / BaaS**  | Supabase (PostgreSQL, Auth, Storage, Edge Functions)  |
| **Database**        | Supabase PostgreSQL (with Row Level Security)         |
| **Authentication**  | Supabase Auth (Email/Password, OAuth, Magic Links)    |
| **Realtime**        | Supabase Realtime (Postgres Changes subscriptions)    |
| **Storage**         | Supabase Storage (profile images, medical docs)       |
| **Edge Functions**  | Supabase Edge Functions (Deno/TypeScript)             |
| **State Management**| React Context API + AsyncStorage                     |
| **Navigation**      | Expo Router v6 (file-based routing, Stack + Bottom Tabs) |
| **HTTP Client**     | Supabase JS Client (`@supabase/supabase-js`)         |
| **Styling**         | React Native StyleSheet + Custom Theme System        |
| **Push Notifications** | Expo Notifications                                |
| **Maps/Location**   | React Native Maps + Expo Location                    |
| **Image Handling**  | Expo Image Picker + Supabase Storage                 |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  MOBILE APP (React Native / Expo)        │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────────┐  │
│  │  Auth      │  │ Symptom   │  │ Doctor              │  │
│  │  Screens   │  │ Checker   │  │ Recommendation      │  │
│  └─────┬─────┘  └─────┬─────┘  └───────┬─────────────┘  │
│        │              │                 │                │
│        └──────────────┼─────────────────┘                │
│                       │                                  │
│              ┌────────▼────────┐                         │
│              │  Supabase JS    │                         │
│              │  Client SDK     │                         │
│              └────────┬────────┘                         │
└───────────────────────┼─────────────────────────────────┘
                        │  HTTPS
┌───────────────────────┼─────────────────────────────────┐
│            SUPABASE CLOUD PLATFORM                       │
│              ┌────────▼────────┐                         │
│              │  API Gateway    │                         │
│              │  (PostgREST +   │                         │
│              │   GoTrue Auth)  │                         │
│              └────────┬────────┘                         │
│     ┌─────────────────┼─────────────────┐                │
│     │                 │                 │                │
│  ┌──▼──────┐  ┌───────▼──────┐  ┌──────▼──────────┐     │
│  │ Auth    │  │  Edge        │  │  Realtime       │     │
│  │ (GoTrue)│  │  Functions   │  │  (WebSocket)    │     │
│  │         │  │  (Deno)      │  │                 │     │
│  └──┬──────┘  └───────┬──────┘  └──────┬──────────┘     │
│     │                 │                │                │
│     └─────────────────┼────────────────┘                │
│              ┌────────▼────────┐                         │
│              │  PostgreSQL     │                         │
│              │  (with RLS)     │                         │
│              └────────┬────────┘                         │
│              ┌────────▼────────┐                         │
│              │  Storage        │                         │
│              │  (S3-compatible)│                         │
│              └─────────────────┘                         │
└─────────────────────────────────────────────────────────┘
```

---

## Core Features

### Phase 1 — Foundation (MVP)

1. **User Authentication**
   - Register / Login (Email + Password) via Supabase Auth
   - Session management with Supabase `onAuthStateChange` listener
   - Profile management (name, age, gender, blood group, allergies) stored in `profiles` table
   - Password reset via Supabase Auth built-in email flow
   - OAuth social logins (Google, Apple) — optional

2. **Symptom Checker**
   - Searchable symptom list with autocomplete (Supabase `ilike` / full-text search)
   - Multi-select symptom input with body-part visual selector
   - Duration & severity input per symptom
   - Symptom history log

3. **Disease Prediction Engine**
   - Rule-based prediction algorithm mapping symptoms → diseases
   - Confidence score per predicted disease
   - Disease detail cards (description, precautions, severity level)
   - Emergency flag for critical conditions
   - Prediction logic runs as a Supabase Edge Function or client-side

4. **Doctor Recommendation**
   - Specialty-based doctor filtering from predicted disease
   - Doctor profiles (name, specialty, hospital, experience, rating)
   - Location-based sorting (nearest doctors) via PostGIS or coordinate math
   - Doctor availability / time-slot viewing

5. **Appointment Booking**
   - Select doctor → pick date/time → confirm booking
   - Booking history & status tracking (Pending / Confirmed / Completed / Cancelled)
   - Realtime booking status updates via Supabase Realtime subscriptions
   - In-app booking notifications

### Phase 2 — Enhanced Experience

6. **Health Profile & Medical History**
   - Persistent medical record (chronic conditions, medications, allergies)
   - Past diagnosis history within the app
   - Family medical history tracker

7. **Doctor Dashboard (Doctor Role)**
   - Doctor registration & profile management
   - View incoming appointment requests (realtime)
   - Accept / Reject / Reschedule bookings
   - Patient symptom summary view

8. **Ratings & Reviews**
   - Rate doctors after appointment completion
   - Written reviews with moderation
   - Average rating display on doctor cards

9. **Push Notifications**
   - Appointment reminders (via Supabase Edge Functions + Expo Push)
   - Health tips & alerts
   - Booking status updates

### Phase 3 — Advanced Features

10. **AI-Enhanced Prediction** (Future)
    - ML model integration (Random Forest / SVM) via Supabase Edge Function calling a Python microservice
    - NLP-based symptom input ("I have headache and fever")
    - Continuous model improvement from feedback

11. **Telemedicine / Video Consultation**
    - In-app video calling
    - Chat with doctor (Supabase Realtime)
    - Prescription sharing (Supabase Storage)

12. **Health Articles & Awareness**
    - Curated health articles by category
    - Disease awareness content
    - Preventive care tips

---

## Folder Structure

```
Mobile-Computing/
├── .AI/                          # AI-assisted development docs
│   ├── PROJECT_OVERVIEW.md       # This file
│   ├── DATABASE_SCHEMA.md        # Supabase tables, RLS policies & relationships
│   └── FUTURE_FEATURES.md       # Roadmap & feature backlog
│
├── Frontend/
│   ├── UI/                       # UI mockup images
│   ├── app/                      # Expo Router (file-based routing)
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── forgot-password.tsx
│   │   ├── (tabs)/
│   │   │   ├── home.tsx          # Dashboard with greeting, search, Disease Prediction & Book a Doctor cards, FAB
│   │   │   ├── check.tsx         # Full symptom checker with step progress, symptom chips, duration, AI prediction insights
│   │   │   ├── doctors.tsx       # Browse doctors
│   │   │   ├── history.tsx       # Past diagnoses & appointments
│   │   │   └── profile.tsx       # Settings screen (profile card, general settings, preferences, sign out)
│   │   ├── symptoms/
│   │   │   ├── select.tsx        # Symptom selection screen
│   │   │   └── results.tsx       # Disease prediction results
│   │   ├── doctors/
│   │   │   ├── [id].tsx          # Doctor detail screen
│   │   │   └── book.tsx          # Booking screen
│   │   ├── appointments/
│   │   │   ├── index.tsx         # All appointments
│   │   │   └── [id].tsx          # Appointment detail
│   │   └── _layout.tsx
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── SymptomCard.tsx
│   │   ├── DiseaseCard.tsx
│   │   ├── DoctorCard.tsx
│   │   ├── AppointmentCard.tsx
│   │   ├── BodySelector.tsx      # Interactive body-part picker
│   │   └── RatingStars.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Wraps Supabase Auth state
│   │   └── HealthContext.tsx
│   ├── lib/
│   │   └── supabase.ts           # Supabase client initialization
│   ├── services/
│   │   ├── authService.ts        # Supabase Auth wrappers
│   │   ├── symptomService.ts     # Symptom queries
│   │   ├── diseaseService.ts     # Disease queries & prediction
│   │   ├── doctorService.ts      # Doctor queries
│   │   ├── appointmentService.ts # Appointment CRUD
│   │   └── storageService.ts     # Supabase Storage wrappers
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSymptoms.ts
│   │   ├── useDoctors.ts
│   │   └── useRealtime.ts        # Supabase Realtime subscription hook
│   ├── types/
│   │   ├── database.types.ts     # Auto-generated Supabase DB types
│   │   └── index.ts              # App-level type definitions
│   ├── constants/
│   │   ├── theme.ts              # Colors, fonts, spacing
│   │   └── config.ts             # Supabase URL & anon key
│   ├── utils/
│   │   └── helpers.ts            # Utility functions
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/                     # Supabase local development config
│   ├── config.toml               # Supabase CLI project config
│   ├── migrations/               # SQL migration files
│   │   ├── 00001_create_profiles.sql
│   │   ├── 00002_create_symptoms.sql
│   │   ├── 00003_create_diseases.sql
│   │   ├── 00004_create_disease_symptoms.sql
│   │   ├── 00005_create_doctors.sql
│   │   ├── 00006_create_doctor_specialties.sql
│   │   ├── 00007_create_appointments.sql
│   │   ├── 00008_create_reviews.sql
│   │   ├── 00009_create_medical_history.sql
│   │   ├── 00010_create_diagnosis_history.sql
│   │   └── 00011_enable_rls_policies.sql
│   ├── seed.sql                  # Seed data (symptoms, diseases, doctors)
│   └── functions/                # Supabase Edge Functions
│       ├── predict-disease/
│       │   └── index.ts          # Disease prediction logic
│       └── send-notification/
│           └── index.ts          # Push notification dispatcher
│
└── README.md
```

---

## Supabase Client Data Access Patterns

> **Note**: With Supabase, the mobile app queries the database **directly** through the Supabase JS client using PostgREST. There is no separate Express.js backend. Row Level Security (RLS) policies enforce access control at the database level.

### Authentication (Supabase Auth)

| Operation                | Supabase Client Method                                     |
| :----------------------- | :--------------------------------------------------------- |
| Register new user        | `supabase.auth.signUp({ email, password })`                |
| Login                    | `supabase.auth.signInWithPassword({ email, password })`    |
| Forgot password          | `supabase.auth.resetPasswordForEmail(email)`               |
| Get current session      | `supabase.auth.getSession()`                               |
| Listen to auth changes   | `supabase.auth.onAuthStateChange(callback)`                |
| Logout                   | `supabase.auth.signOut()`                                  |
| OAuth login              | `supabase.auth.signInWithOAuth({ provider: 'google' })`   |

### Data Queries (PostgREST via Supabase Client)

| Operation                             | Supabase Client Call                                                       |
| :------------------------------------ | :------------------------------------------------------------------------- |
| List all symptoms                     | `supabase.from('symptoms').select('*')`                                    |
| Search symptoms                       | `supabase.from('symptoms').select('*').ilike('name', '%query%')`           |
| Symptoms by body part                 | `supabase.from('symptoms').select('*').eq('body_part', part)`              |
| Get disease details                   | `supabase.from('diseases').select('*').eq('id', id).single()`              |
| Get disease-symptom mappings          | `supabase.from('disease_symptoms').select('*, diseases(*), symptoms(*)')` |
| List doctors (with filters)           | `supabase.from('doctors').select('*, profiles(*)').eq('specialty', name)` |
| Get doctor detail                     | `supabase.from('doctors').select('*, profiles(*), reviews(*)').eq('id', id).single()` |
| Create appointment                    | `supabase.from('appointments').insert({ ... })`                           |
| Get user's appointments               | `supabase.from('appointments').select('*, doctors(*, profiles(*))').eq('patient_id', userId)` |
| Update appointment status             | `supabase.from('appointments').update({ status }).eq('id', id)`           |
| Get user profile                      | `supabase.from('profiles').select('*').eq('id', userId).single()`         |
| Update user profile                   | `supabase.from('profiles').update({ ... }).eq('id', userId)`              |
| Get medical history                   | `supabase.from('medical_history').select('*').eq('user_id', userId)`      |
| Add medical history                   | `supabase.from('medical_history').insert({ ... })`                        |
| Get diagnosis history                 | `supabase.from('diagnosis_history').select('*, diseases(*)').eq('user_id', userId)` |
| Submit review                         | `supabase.from('reviews').insert({ ... })`                                |
| Get doctor reviews                    | `supabase.from('reviews').select('*, profiles(first_name, last_name)').eq('doctor_id', doctorId)` |
| Upload profile image                  | `supabase.storage.from('avatars').upload(path, file)`                     |
| Get profile image URL                 | `supabase.storage.from('avatars').getPublicUrl(path)`                     |

### Edge Functions

| Function               | Endpoint                                 | Description                           |
| :---------------------- | :--------------------------------------- | :------------------------------------ |
| `predict-disease`       | `supabase.functions.invoke('predict-disease', { body: { symptom_ids } })` | Submit symptoms → get predictions |
| `send-notification`     | `supabase.functions.invoke('send-notification', { body: { ... } })`       | Dispatch push notifications       |

### Realtime Subscriptions

```typescript
// Subscribe to appointment status changes
supabase
  .channel('appointments')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'appointments',
    filter: `patient_id=eq.${userId}`,
  }, (payload) => {
    // Handle real-time update
  })
  .subscribe();
```

---

## Environment Variables / Configuration

### Supabase Project Config (`Frontend/constants/config.ts`)

```typescript
export const SUPABASE_URL = 'https://your-project-ref.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Supabase Client Init (`Frontend/lib/supabase.ts`)

```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';
import type { Database } from '../types/database.types';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Supabase Edge Function Environment (set via Supabase Dashboard or CLI)

```env
# Set via: supabase secrets set KEY=VALUE
EXPO_PUSH_ACCESS_TOKEN=your_expo_push_token
```

---

## Development Setup

### Prerequisites
- Node.js v18+
- Supabase CLI (`npm install -g supabase`)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for emulators)
- Supabase account & project (https://supabase.com)

### Supabase Setup

```bash
# Login to Supabase CLI
supabase login

# Link to your remote project
supabase link --project-ref your-project-ref

# Run migrations against remote database
supabase db push

# Or run locally with Docker
supabase start

# Seed the database
psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql

# Generate TypeScript types from your database schema
supabase gen types typescript --linked > Frontend/types/database.types.ts

# Deploy Edge Functions
supabase functions deploy predict-disease
supabase functions deploy send-notification
```

### Frontend Setup

```bash
cd Frontend
npm install
npx expo start
```

---

## User Roles

| Role        | Description                                                              |
| :---------- | :----------------------------------------------------------------------- |
| **Patient** | Default role. Can check symptoms, view predictions, book doctors          |
| **Doctor**  | Can manage profile, view/manage appointments, see patient summaries       |
| **Admin**   | Can manage all users, doctors, symptoms, diseases (via Supabase Dashboard or admin RLS policies) |

> **Role enforcement**: User roles are stored in the `profiles.role` column and enforced via Supabase RLS policies. The `auth.uid()` function maps authenticated users to their profile row. Admin operations can also be done directly in the Supabase Dashboard.

---

## Design System

### Color Palette
| Token            | Value       | Usage                    |
| :--------------- | :---------- | :----------------------- |
| `primary`        | `#4A90D9`   | Primary actions, headers |
| `primaryDark`    | `#2E6DB4`   | Active/pressed states    |
| `secondary`      | `#34C759`   | Success, health positive |
| `accent`         | `#FF6B6B`   | Alerts, emergency flags  |
| `background`     | `#F5F7FA`   | Screen backgrounds       |
| `surface`        | `#FFFFFF`   | Card surfaces            |
| `textPrimary`    | `#1A1A2E`   | Headings, body text      |
| `textSecondary`  | `#6B7280`   | Captions, hints          |
| `border`         | `#E5E7EB`   | Dividers, card borders   |

### Typography
- **Headings**: Inter Bold (24–32px)
- **Body**: Inter Regular (14–16px)
- **Captions**: Inter Medium (12px)

---

## Key Development Patterns

1. **Direct DB Queries + RLS**: The app queries Supabase directly using the JS client. RLS policies enforce authorization — no custom backend middleware needed.
2. **Supabase Auth Integration**: `AuthContext` wraps the app with `onAuthStateChange` listener. Auth state automatically manages session tokens, refresh, and persistence via AsyncStorage. The `on_auth_user_created` trigger auto-creates a profile row on signup (see [DATABASE_SCHEMA.md](file:///e:/Mobile-Computing/.AI/DATABASE_SCHEMA.md) for details).
3. **Idempotent Triggers**: All `CREATE TRIGGER` statements are preceded by `DROP TRIGGER IF EXISTS` to prevent "already exists" errors when migrations are re-run.
4. **Service Layer**: Each domain (symptoms, doctors, appointments) has a dedicated service file that wraps Supabase client calls, keeping components clean.
5. **TypeScript Types from DB**: Run `supabase gen types typescript` to auto-generate type-safe database types. All service functions use these types.
6. **Edge Functions for Business Logic**: Complex logic (disease prediction, notification dispatch) lives in Supabase Edge Functions (Deno/TypeScript), keeping the client lightweight.
7. **Realtime for Live Updates**: Appointment status changes and doctor-patient chat use Supabase Realtime Postgres Changes subscriptions.
8. **Storage for Files**: Profile images and medical documents are stored in Supabase Storage buckets with appropriate access policies.
9. **Error Handling**: Supabase client returns `{ data, error }` — all service functions check and throw/handle errors consistently.
10. **Context Providers**: `AuthContext` for auth state; `HealthContext` for symptom/prediction state.
