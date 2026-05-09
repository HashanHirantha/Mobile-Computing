# 🏥 MediGuide — Disease & Doctor Recommendation App

## Project Overview

**MediGuide** is a mobile healthcare application that helps users identify potential diseases based on their symptoms and recommends suitable doctors/specialists nearby. The app uses a symptom-based prediction engine to suggest possible conditions and then matches users with verified healthcare professionals based on specialty, location, ratings, and availability.

> ⚠️ **Disclaimer**: This app is a **decision-support tool** and does NOT replace professional medical diagnosis. Users should always consult a licensed healthcare provider for medical advice.

---

## Tech Stack

| Layer              | Technology                                      |
| :----------------- | :---------------------------------------------- |
| **Mobile Frontend** | React Native (Expo SDK 54) + TypeScript         |
| **Backend API**     | Node.js + Express.js + TypeScript               |
| **Database**        | PostgreSQL (via Sequelize ORM)                  |
| **Authentication**  | JWT (JSON Web Tokens) + bcrypt                  |
| **State Management**| React Context API + AsyncStorage                |
| **Navigation**      | React Navigation v6 (Stack + Bottom Tabs)       |
| **HTTP Client**     | Axios                                           |
| **Styling**         | React Native StyleSheet + Custom Theme System   |
| **Push Notifications** | Expo Notifications                           |
| **Maps/Location**   | React Native Maps + Expo Location               |
| **Image Handling**  | Expo Image Picker                               |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  MOBILE APP (React Native)           │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────┐  │
│  │  Auth      │  │ Symptom   │  │ Doctor          │  │
│  │  Screens   │  │ Checker   │  │ Recommendation  │  │
│  └─────┬─────┘  └─────┬─────┘  └───────┬─────────┘  │
│        │              │                 │            │
│        └──────────────┼─────────────────┘            │
│                       │                              │
│              ┌────────▼────────┐                     │
│              │  API Service    │                     │
│              │  (Axios)        │                     │
│              └────────┬────────┘                     │
└───────────────────────┼─────────────────────────────┘
                        │  HTTPS / REST
┌───────────────────────┼─────────────────────────────┐
│              BACKEND (Express.js)                    │
│              ┌────────▼────────┐                     │
│              │  API Gateway    │                     │
│              │  (Routes)       │                     │
│              └────────┬────────┘                     │
│     ┌─────────────────┼─────────────────┐            │
│     │                 │                 │            │
│  ┌──▼───┐  ┌─────────▼──────┐  ┌──────▼──────┐     │
│  │ Auth │  │  Disease       │  │  Doctor     │     │
│  │ Ctrl │  │  Prediction    │  │  Matching   │     │
│  │      │  │  Engine        │  │  Engine     │     │
│  └──┬───┘  └───────┬────────┘  └──────┬──────┘     │
│     │              │                   │            │
│     └──────────────┼───────────────────┘            │
│              ┌─────▼──────┐                         │
│              │ Sequelize  │                         │
│              │ ORM        │                         │
│              └─────┬──────┘                         │
│              ┌─────▼──────┐                         │
│              │ PostgreSQL │                         │
│              └────────────┘                         │
└─────────────────────────────────────────────────────┘
```

---

## Core Features

### Phase 1 — Foundation (MVP)

1. **User Authentication**
   - Register / Login (Email + Password)
   - JWT-based session management
   - Profile management (name, age, gender, blood group, allergies)
   - Password reset via email OTP

2. **Symptom Checker**
   - Searchable symptom list with autocomplete
   - Multi-select symptom input with body-part visual selector
   - Duration & severity input per symptom
   - Symptom history log

3. **Disease Prediction Engine**
   - Rule-based prediction algorithm mapping symptoms → diseases
   - Confidence score per predicted disease
   - Disease detail cards (description, precautions, severity level)
   - Emergency flag for critical conditions

4. **Doctor Recommendation**
   - Specialty-based doctor filtering from predicted disease
   - Doctor profiles (name, specialty, hospital, experience, rating)
   - Location-based sorting (nearest doctors)
   - Doctor availability / time-slot viewing

5. **Appointment Booking**
   - Select doctor → pick date/time → confirm booking
   - Booking history & status tracking (Pending / Confirmed / Completed / Cancelled)
   - In-app booking notifications

### Phase 2 — Enhanced Experience

6. **Health Profile & Medical History**
   - Persistent medical record (chronic conditions, medications, allergies)
   - Past diagnosis history within the app
   - Family medical history tracker

7. **Doctor Dashboard (Doctor Role)**
   - Doctor registration & profile management
   - View incoming appointment requests
   - Accept / Reject / Reschedule bookings
   - Patient symptom summary view

8. **Ratings & Reviews**
   - Rate doctors after appointment completion
   - Written reviews with moderation
   - Average rating display on doctor cards

9. **Push Notifications**
   - Appointment reminders
   - Health tips & alerts
   - Booking status updates

### Phase 3 — Advanced Features

10. **AI-Enhanced Prediction** (Future)
    - ML model integration (Random Forest / SVM) via Python microservice
    - NLP-based symptom input ("I have headache and fever")
    - Continuous model improvement from feedback

11. **Telemedicine / Video Consultation**
    - In-app video calling
    - Chat with doctor
    - Prescription sharing

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
│   ├── DATABASE_SCHEMA.md        # Database tables & relationships
│   └── FUTURE_FEATURES.md       # Roadmap & feature backlog
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts       # Sequelize DB connection config
│   │   │   └── environment.ts    # Environment variable loader
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── symptomController.ts
│   │   │   ├── diseaseController.ts
│   │   │   ├── doctorController.ts
│   │   │   ├── appointmentController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts  # JWT verification
│   │   │   ├── errorHandler.ts   # Global error handler
│   │   │   └── validate.ts       # Request validation
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Symptom.ts
│   │   │   ├── Disease.ts
│   │   │   ├── DiseaseSymptom.ts  # Junction table
│   │   │   ├── Doctor.ts
│   │   │   ├── DoctorSpecialty.ts
│   │   │   ├── Appointment.ts
│   │   │   ├── Review.ts
│   │   │   ├── MedicalHistory.ts
│   │   │   └── index.ts          # Model associations
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── symptomRoutes.ts
│   │   │   ├── diseaseRoutes.ts
│   │   │   ├── doctorRoutes.ts
│   │   │   ├── appointmentRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── services/
│   │   │   ├── predictionService.ts   # Disease prediction logic
│   │   │   └── recommendationService.ts # Doctor matching logic
│   │   ├── seeders/
│   │   │   ├── symptomSeeder.ts
│   │   │   ├── diseaseSeeder.ts
│   │   │   └── doctorSeeder.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── helpers.ts
│   │   └── app.ts                # Express app entry point
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── app/                      # Expo Router (file-based routing)
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── forgot-password.tsx
│   │   ├── (tabs)/
│   │   │   ├── home.tsx          # Dashboard / Quick actions
│   │   │   ├── check.tsx         # Symptom checker flow
│   │   │   ├── doctors.tsx       # Browse doctors
│   │   │   ├── history.tsx       # Past diagnoses & appointments
│   │   │   └── profile.tsx       # User profile & settings
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
│   │   ├── AuthContext.tsx
│   │   └── HealthContext.tsx
│   ├── services/
│   │   └── api.ts                # Axios instance + API calls
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSymptoms.ts
│   │   └── useDoctors.ts
│   ├── constants/
│   │   ├── theme.ts              # Colors, fonts, spacing
│   │   └── config.ts             # API base URL, keys
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint                | Description             | Auth |
| :----- | :---------------------- | :---------------------- | :--- |
| POST   | `/api/auth/register`    | Register new user       | ❌    |
| POST   | `/api/auth/login`       | Login & get JWT         | ❌    |
| POST   | `/api/auth/forgot-password` | Send OTP to email   | ❌    |
| POST   | `/api/auth/reset-password`  | Reset with OTP      | ❌    |
| GET    | `/api/auth/me`          | Get current user profile| ✅    |

### Symptoms
| Method | Endpoint                | Description                    | Auth |
| :----- | :---------------------- | :----------------------------- | :--- |
| GET    | `/api/symptoms`         | List all symptoms              | ✅    |
| GET    | `/api/symptoms/search?q=` | Search symptoms by keyword   | ✅    |
| GET    | `/api/symptoms/body-part/:part` | Get symptoms by body part | ✅   |

### Disease Prediction
| Method | Endpoint                     | Description                        | Auth |
| :----- | :--------------------------- | :--------------------------------- | :--- |
| POST   | `/api/predict`               | Submit symptoms → get predictions  | ✅    |
| GET    | `/api/diseases/:id`          | Get disease details                | ✅    |
| GET    | `/api/diseases/:id/precautions` | Get precaution tips             | ✅    |

### Doctors
| Method | Endpoint                          | Description                     | Auth |
| :----- | :-------------------------------- | :------------------------------ | :--- |
| GET    | `/api/doctors`                    | List all doctors (with filters) | ✅    |
| GET    | `/api/doctors/:id`                | Get doctor detail               | ✅    |
| GET    | `/api/doctors/specialty/:name`    | Get doctors by specialty        | ✅    |
| GET    | `/api/doctors/:id/availability`   | Get available time slots        | ✅    |
| GET    | `/api/doctors/:id/reviews`        | Get doctor reviews              | ✅    |
| POST   | `/api/doctors/:id/reviews`        | Submit a review                 | ✅    |

### Appointments
| Method | Endpoint                     | Description                | Auth |
| :----- | :--------------------------- | :------------------------- | :--- |
| POST   | `/api/appointments`          | Create new appointment     | ✅    |
| GET    | `/api/appointments`          | Get user's appointments    | ✅    |
| GET    | `/api/appointments/:id`      | Get appointment detail     | ✅    |
| PATCH  | `/api/appointments/:id`      | Update status              | ✅    |
| DELETE | `/api/appointments/:id`      | Cancel appointment         | ✅    |

### User Profile
| Method | Endpoint                     | Description                  | Auth |
| :----- | :--------------------------- | :--------------------------- | :--- |
| GET    | `/api/users/profile`         | Get full profile             | ✅    |
| PUT    | `/api/users/profile`         | Update profile               | ✅    |
| GET    | `/api/users/medical-history` | Get medical history          | ✅    |
| POST   | `/api/users/medical-history` | Add medical history entry    | ✅    |
| GET    | `/api/users/diagnosis-history` | Get past diagnoses         | ✅    |

---

## Environment Variables

### Backend `.env`
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mediguide_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend `constants/config.ts`
```typescript
export const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android emulator
// export const API_BASE_URL = 'http://localhost:5000/api'; // iOS simulator
```

---

## Development Setup

### Prerequisites
- Node.js v18+
- PostgreSQL 15+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for emulators)

### Backend Setup
```bash
cd Backend
npm install
# Create .env file with the variables above
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install
npx expo start
```

---

## User Roles

| Role       | Description                                        |
| :--------- | :------------------------------------------------- |
| **Patient** | Default role. Can check symptoms, view predictions, book doctors |
| **Doctor**  | Can manage profile, view/manage appointments, see patient summaries |
| **Admin**   | Can manage all users, doctors, symptoms, diseases (future) |

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

1. **Controller → Service → Model**: All business logic lives in services, controllers only handle req/res.
2. **JWT Auth Middleware**: Applied to all protected routes via `authMiddleware.ts`.
3. **Context Providers**: `AuthContext` wraps the app for auth state; `HealthContext` for symptom/prediction state.
4. **Error Handling**: Global error handler middleware catches all errors and returns standardized JSON responses.
5. **Input Validation**: Use `express-validator` for request body/params validation.
