# MediGuide 🏥

> A mobile healthcare app for symptom checking, disease prediction, and doctor recommendations — powered by **React Native (Expo)** + **Supabase**.

## ⚠️ Disclaimer

This application is a **decision-support tool only** and does NOT replace professional medical advice. Always consult a licensed healthcare provider.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile Frontend | React Native (Expo SDK 54) + TypeScript |
| Backend (BaaS) | Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime) |
| Database | Supabase PostgreSQL with Row Level Security |
| Authentication | Supabase Auth |
| State Management | React Context API + AsyncStorage |
| Navigation | Expo Router v4 |

---

## Project Structure

```
Mobile-Computing/
├── .AI/          # AI-assisted development documentation
├── Frontend/     # React Native Expo app
└── supabase/     # Supabase migrations, seed data, edge functions
```

See [`.AI/PROJECT_OVERVIEW.md`](.AI/PROJECT_OVERVIEW.md) for the full architecture.

---

## Getting Started

### 1. Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply all migrations
supabase db push

# Seed the database
# Paste contents of supabase/seed.sql into Supabase Dashboard → SQL Editor

# Generate TypeScript types
supabase gen types typescript --linked > Frontend/types/database.types.ts

# Deploy Edge Functions
supabase functions deploy predict-disease
supabase functions deploy send-notification
```

### 2. Configure Supabase Keys

Edit `Frontend/constants/config.ts`:

```typescript
export const SUPABASE_URL = 'https://your-project-ref.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

> Get these from: **Supabase Dashboard → Settings → API**

### 3. Run the App

```bash
cd Frontend
npm install
npx expo start
```

---

## Key Features

- 🩺 **Symptom Checker** — search and select from 50+ symptoms
- 🧬 **Disease Prediction** — weighted rule-based engine (+ Edge Function)
- 👨‍⚕️ **Doctor Discovery** — filter by specialty, rating, location
- 📅 **Appointment Booking** — date/time slot selection with realtime status
- 🔔 **Realtime Updates** — appointment status via Supabase Realtime
- 🔒 **Secure by Default** — Row Level Security on every table
- 📦 **Supabase Storage** — profile images in managed buckets

---

## Development Notes

- Never commit real Supabase credentials to source control — use `.env` or CI secrets
- Regenerate `Frontend/types/database.types.ts` after every schema change
- All schema changes must be in `supabase/migrations/` — never edit via Dashboard SQL Editor directly
- See `.AI/DATABASE_SCHEMA.md` for full table schemas and RLS policies
- See `.AI/FUTURE_FEATURES.md` for the development roadmap
