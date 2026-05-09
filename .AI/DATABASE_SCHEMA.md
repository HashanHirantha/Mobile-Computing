# 🗄️ MediGuide — Database Schema

## Overview

The application uses **PostgreSQL** as the primary database, managed through **Sequelize ORM** with TypeScript models. Below is the complete schema for all tables, their columns, relationships, and constraints.

---

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  Users   │──1:N──│ Appointments │──N:1──│ Doctors  │
└────┬─────┘       └──────┬───────┘       └────┬─────┘
     │                    │                    │
     │1:N                 │                    │1:N
     ▼                    │                    ▼
┌────────────────┐        │           ┌────────────────┐
│ MedicalHistory │        │           │    Reviews     │
└────────────────┘        │           └────────────────┘
                          │                    ▲
     ┌────────────┐       │                    │N:1
     │ Symptoms   │──M:N──┤           ┌────────┴───────┐
     └────────────┘       │           │    Users       │
           │              │           └────────────────┘
           │M:N           │
           ▼              │
   ┌───────────────┐      │
   │DiseaseSymptom │      │
   │  (Junction)   │      │
   └───────┬───────┘      │
           │M:N           │
           ▼              │
     ┌──────────┐         │
     │ Diseases │         │
     └────┬─────┘         │
          │               │
          │1:N            │
          ▼               │
  ┌───────────────┐       │
  │DoctorSpecialty│       │
  │  (Junction)   │       │
  └───────┬───────┘       │
          │N:1            │
          ▼               │
     ┌──────────┐         │
     │ Doctors  │─────────┘
     └──────────┘
  
  ┌──────────────────┐
  │ DiagnosisHistory │──N:1── Users
  │                  │──N:1── Diseases
  └──────────────────┘
```

---

## Tables

### 1. `users`

Stores all registered users (patients & doctors).

| Column          | Type          | Constraints                        | Description                      |
| :-------------- | :------------ | :--------------------------------- | :------------------------------- |
| `id`            | `UUID`        | PK, DEFAULT uuid_generate_v4()    | Unique user identifier           |
| `email`         | `VARCHAR(255)`| UNIQUE, NOT NULL                   | User email address               |
| `password`      | `VARCHAR(255)`| NOT NULL                           | Hashed password (bcrypt)         |
| `first_name`    | `VARCHAR(100)`| NOT NULL                           | User first name                  |
| `last_name`     | `VARCHAR(100)`| NOT NULL                           | User last name                   |
| `phone`         | `VARCHAR(20)` | NULLABLE                           | Phone number                     |
| `date_of_birth` | `DATE`        | NULLABLE                           | Date of birth                    |
| `gender`        | `ENUM`        | ('male','female','other'), NULLABLE| Gender                           |
| `blood_group`   | `VARCHAR(5)`  | NULLABLE                           | Blood group (A+, B-, O+, etc.)   |
| `profile_image` | `VARCHAR(500)`| NULLABLE                           | Profile photo URL                |
| `role`          | `ENUM`        | ('patient','doctor','admin'), DEFAULT 'patient' | User role       |
| `is_active`     | `BOOLEAN`     | DEFAULT true                       | Account active status            |
| `created_at`    | `TIMESTAMP`   | DEFAULT NOW()                      | Account creation timestamp       |
| `updated_at`    | `TIMESTAMP`   | DEFAULT NOW()                      | Last update timestamp            |

**Indexes**: `email` (unique)

---

### 2. `symptoms`

Master list of all recognized symptoms.

| Column         | Type           | Constraints                     | Description                    |
| :------------- | :------------- | :------------------------------ | :----------------------------- |
| `id`           | `INTEGER`      | PK, AUTO_INCREMENT              | Symptom ID                     |
| `name`         | `VARCHAR(200)` | UNIQUE, NOT NULL                | Symptom name (e.g., "Headache")|
| `description`  | `TEXT`         | NULLABLE                        | Detailed description           |
| `body_part`    | `VARCHAR(100)` | NOT NULL                        | Body area (head, chest, etc.)  |
| `severity_level`| `ENUM`        | ('mild','moderate','severe'), DEFAULT 'moderate' | Default severity |
| `icon`         | `VARCHAR(50)`  | NULLABLE                        | Icon identifier for UI         |
| `is_emergency` | `BOOLEAN`      | DEFAULT false                   | Emergency symptom flag         |
| `created_at`   | `TIMESTAMP`    | DEFAULT NOW()                   | Record creation timestamp      |
| `updated_at`   | `TIMESTAMP`    | DEFAULT NOW()                   | Last update timestamp          |

**Indexes**: `name` (unique), `body_part`

---

### 3. `diseases`

Master list of diseases/conditions the system can predict.

| Column         | Type           | Constraints                     | Description                    |
| :------------- | :------------- | :------------------------------ | :----------------------------- |
| `id`           | `INTEGER`      | PK, AUTO_INCREMENT              | Disease ID                     |
| `name`         | `VARCHAR(200)` | UNIQUE, NOT NULL                | Disease name                   |
| `description`  | `TEXT`         | NOT NULL                        | Detailed description           |
| `specialty`    | `VARCHAR(100)` | NOT NULL                        | Related medical specialty      |
| `severity`     | `ENUM`         | ('low','medium','high','critical'), DEFAULT 'medium' | Severity level |
| `precautions`  | `TEXT[]`       | NULLABLE                        | Array of precautionary measures|
| `symptoms_required` | `INTEGER` | DEFAULT 2                       | Min symptoms to consider       |
| `is_chronic`   | `BOOLEAN`      | DEFAULT false                   | Whether condition is chronic   |
| `image_url`    | `VARCHAR(500)` | NULLABLE                        | Disease illustration URL       |
| `created_at`   | `TIMESTAMP`    | DEFAULT NOW()                   | Record creation timestamp      |
| `updated_at`   | `TIMESTAMP`    | DEFAULT NOW()                   | Last update timestamp          |

**Indexes**: `name` (unique), `specialty`

---

### 4. `disease_symptoms` (Junction Table)

Maps many-to-many relationship between diseases and symptoms with a weight (importance factor).

| Column        | Type      | Constraints                           | Description                     |
| :------------ | :-------- | :------------------------------------ | :------------------------------ |
| `id`          | `INTEGER` | PK, AUTO_INCREMENT                    | Record ID                       |
| `disease_id`  | `INTEGER` | FK → diseases.id, NOT NULL            | Related disease                 |
| `symptom_id`  | `INTEGER` | FK → symptoms.id, NOT NULL            | Related symptom                 |
| `weight`      | `FLOAT`   | DEFAULT 1.0, CHECK (0.0–5.0)         | Importance weight for prediction|
| `is_primary`  | `BOOLEAN` | DEFAULT false                         | Whether it's a primary symptom  |

**Indexes**: UNIQUE(`disease_id`, `symptom_id`)

---

### 5. `doctors`

Stores doctor/specialist profiles.

| Column             | Type           | Constraints                     | Description                    |
| :----------------- | :------------- | :------------------------------ | :----------------------------- |
| `id`               | `UUID`         | PK, DEFAULT uuid_generate_v4() | Doctor profile ID              |
| `user_id`          | `UUID`         | FK → users.id, UNIQUE, NOT NULL| Linked user account            |
| `registration_no`  | `VARCHAR(100)` | UNIQUE, NOT NULL                | Medical registration number    |
| `specialty`        | `VARCHAR(100)` | NOT NULL                        | Primary specialty              |
| `qualification`    | `VARCHAR(300)` | NOT NULL                        | Degrees & qualifications       |
| `experience_years` | `INTEGER`      | DEFAULT 0                       | Years of experience            |
| `hospital_name`    | `VARCHAR(300)` | NULLABLE                        | Hospital / clinic name         |
| `hospital_address` | `TEXT`         | NULLABLE                        | Full address                   |
| `latitude`         | `DECIMAL(10,8)`| NULLABLE                        | Location latitude              |
| `longitude`        | `DECIMAL(11,8)`| NULLABLE                        | Location longitude             |
| `consultation_fee` | `DECIMAL(10,2)`| DEFAULT 0.00                    | Consultation fee               |
| `available_days`   | `VARCHAR(100)` | NULLABLE                        | e.g., "Mon,Tue,Wed,Fri"       |
| `available_from`   | `TIME`         | NULLABLE                        | Start time (e.g., "09:00")     |
| `available_to`     | `TIME`         | NULLABLE                        | End time (e.g., "17:00")       |
| `average_rating`   | `DECIMAL(3,2)` | DEFAULT 0.00                    | Calculated average rating      |
| `total_reviews`    | `INTEGER`      | DEFAULT 0                       | Total review count             |
| `is_verified`      | `BOOLEAN`      | DEFAULT false                   | Admin verification status      |
| `bio`              | `TEXT`         | NULLABLE                        | Doctor bio / about             |
| `profile_image`    | `VARCHAR(500)` | NULLABLE                        | Professional photo URL         |
| `created_at`       | `TIMESTAMP`    | DEFAULT NOW()                   | Record creation timestamp      |
| `updated_at`       | `TIMESTAMP`    | DEFAULT NOW()                   | Last update timestamp          |

**Indexes**: `user_id` (unique), `specialty`, `registration_no` (unique), spatial index on (`latitude`, `longitude`)

---

### 6. `doctor_specialties` (Junction Table)

Maps diseases to doctor specialties (which specialist should be recommended for which disease).

| Column        | Type           | Constraints                        | Description                     |
| :------------ | :------------- | :--------------------------------- | :------------------------------ |
| `id`          | `INTEGER`      | PK, AUTO_INCREMENT                 | Record ID                       |
| `disease_id`  | `INTEGER`      | FK → diseases.id, NOT NULL         | Related disease                 |
| `specialty`   | `VARCHAR(100)` | NOT NULL                           | Doctor specialty name           |
| `priority`    | `INTEGER`      | DEFAULT 1                          | Recommendation priority (1=top) |

**Indexes**: UNIQUE(`disease_id`, `specialty`)

---

### 7. `appointments`

Tracks patient-doctor appointments.

| Column          | Type           | Constraints                             | Description                  |
| :-------------- | :------------- | :-------------------------------------- | :--------------------------- |
| `id`            | `UUID`         | PK, DEFAULT uuid_generate_v4()          | Appointment ID               |
| `patient_id`    | `UUID`         | FK → users.id, NOT NULL                 | Patient who booked           |
| `doctor_id`     | `UUID`         | FK → doctors.id, NOT NULL               | Booked doctor                |
| `disease_id`    | `INTEGER`      | FK → diseases.id, NULLABLE              | Predicted disease (if any)   |
| `appointment_date` | `DATE`      | NOT NULL                                | Appointment date             |
| `appointment_time` | `TIME`      | NOT NULL                                | Appointment time             |
| `status`        | `ENUM`         | ('pending','confirmed','completed','cancelled','no_show'), DEFAULT 'pending' | Booking status |
| `symptoms_text` | `TEXT`         | NULLABLE                                | Patient's symptom description|
| `notes`         | `TEXT`         | NULLABLE                                | Doctor/patient notes         |
| `cancellation_reason` | `TEXT`   | NULLABLE                                | Reason for cancellation      |
| `created_at`    | `TIMESTAMP`    | DEFAULT NOW()                           | Booking timestamp            |
| `updated_at`    | `TIMESTAMP`    | DEFAULT NOW()                           | Last update timestamp        |

**Indexes**: `patient_id`, `doctor_id`, `status`, `appointment_date`

---

### 8. `reviews`

Patient reviews for doctors.

| Column       | Type           | Constraints                          | Description                  |
| :----------- | :------------- | :----------------------------------- | :--------------------------- |
| `id`         | `INTEGER`      | PK, AUTO_INCREMENT                   | Review ID                    |
| `patient_id` | `UUID`         | FK → users.id, NOT NULL              | Reviewing patient            |
| `doctor_id`  | `UUID`         | FK → doctors.id, NOT NULL            | Reviewed doctor              |
| `appointment_id` | `UUID`     | FK → appointments.id, NULLABLE       | Related appointment          |
| `rating`     | `INTEGER`      | NOT NULL, CHECK (1–5)                | Star rating                  |
| `comment`    | `TEXT`         | NULLABLE                             | Written review               |
| `is_anonymous`| `BOOLEAN`     | DEFAULT false                        | Anonymous review flag        |
| `created_at` | `TIMESTAMP`    | DEFAULT NOW()                        | Review timestamp             |
| `updated_at` | `TIMESTAMP`    | DEFAULT NOW()                        | Last update timestamp        |

**Indexes**: UNIQUE(`patient_id`, `doctor_id`, `appointment_id`), `doctor_id`

---

### 9. `medical_history`

Patient's persistent medical records.

| Column        | Type           | Constraints                        | Description                  |
| :------------ | :------------- | :--------------------------------- | :--------------------------- |
| `id`          | `INTEGER`      | PK, AUTO_INCREMENT                 | Record ID                    |
| `user_id`     | `UUID`         | FK → users.id, NOT NULL            | Patient                      |
| `condition`   | `VARCHAR(300)` | NOT NULL                           | Medical condition name       |
| `diagnosed_date`| `DATE`       | NULLABLE                           | When diagnosed               |
| `status`      | `ENUM`         | ('active','resolved','managed'), DEFAULT 'active' | Condition status |
| `medications` | `TEXT[]`       | NULLABLE                           | Current medications          |
| `allergies`   | `TEXT[]`       | NULLABLE                           | Known allergies              |
| `notes`       | `TEXT`         | NULLABLE                           | Additional notes             |
| `created_at`  | `TIMESTAMP`    | DEFAULT NOW()                      | Record creation timestamp    |
| `updated_at`  | `TIMESTAMP`    | DEFAULT NOW()                      | Last update timestamp        |

**Indexes**: `user_id`

---

### 10. `diagnosis_history`

Logs of all symptom checks and predictions made by users.

| Column            | Type           | Constraints                        | Description                  |
| :---------------- | :------------- | :--------------------------------- | :--------------------------- |
| `id`              | `INTEGER`      | PK, AUTO_INCREMENT                 | Record ID                    |
| `user_id`         | `UUID`         | FK → users.id, NOT NULL            | Patient who checked          |
| `symptoms`        | `INTEGER[]`    | NOT NULL                           | Array of symptom IDs entered |
| `predicted_disease_id` | `INTEGER` | FK → diseases.id, NULLABLE        | Top predicted disease        |
| `confidence_score`| `DECIMAL(5,2)` | NOT NULL                           | Prediction confidence (%)    |
| `all_predictions` | `JSONB`       | NOT NULL                           | Full prediction results JSON |
| `feedback`        | `ENUM`         | ('helpful','not_helpful','incorrect'), NULLABLE | User feedback |
| `created_at`      | `TIMESTAMP`    | DEFAULT NOW()                      | Diagnosis timestamp          |

**Indexes**: `user_id`, `predicted_disease_id`, `created_at`

**`all_predictions` JSONB format:**
```json
[
  {
    "disease_id": 1,
    "disease_name": "Common Cold",
    "confidence": 85.5,
    "specialty": "General Medicine"
  },
  {
    "disease_id": 4,
    "disease_name": "Flu",
    "confidence": 72.3,
    "specialty": "General Medicine"
  }
]
```

---

## Relationships Summary

| Relationship                     | Type    | Description                                     |
| :------------------------------- | :------ | :---------------------------------------------- |
| `User` → `Appointments`         | 1:N     | A patient can have many appointments             |
| `User` → `MedicalHistory`       | 1:N     | A patient can have multiple medical records      |
| `User` → `DiagnosisHistory`     | 1:N     | A patient can run many symptom checks            |
| `User` → `Reviews`              | 1:N     | A patient can write many reviews                 |
| `User` → `Doctor`               | 1:1     | A doctor user has one doctor profile             |
| `Doctor` → `Appointments`       | 1:N     | A doctor can have many appointments              |
| `Doctor` → `Reviews`            | 1:N     | A doctor can receive many reviews                |
| `Disease` ↔ `Symptom`           | M:N     | Via `disease_symptoms` junction table            |
| `Disease` → `DoctorSpecialty`   | 1:N     | Each disease maps to one or more specialties     |
| `Disease` → `DiagnosisHistory`  | 1:N     | A disease can be predicted in many diagnoses     |

---

## Seed Data Requirements

### Symptoms (~50+ entries)
Categories: Head, Eyes, Ears/Nose/Throat, Chest, Abdomen, Skin, Musculoskeletal, Neurological, General

### Diseases (~30+ entries)
Common conditions: Common Cold, Flu, Migraine, Hypertension, Diabetes Type 2, Asthma, Allergic Rhinitis, Gastritis, UTI, Dengue, Malaria, COVID-19, Bronchitis, Pneumonia, Anemia, Thyroid Disorders, etc.

### Doctors (~15+ entries)
Specialties: General Medicine, Cardiology, Dermatology, Orthopedics, Neurology, ENT, Pulmonology, Gastroenterology, Endocrinology, Pediatrics, Ophthalmology, Psychiatry

---

## Sequelize Migration Commands

```bash
# Create database
npx sequelize-cli db:create

# Run all migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Seed data
npx sequelize-cli db:seed:all

# Undo seeds
npx sequelize-cli db:seed:undo:all
```
