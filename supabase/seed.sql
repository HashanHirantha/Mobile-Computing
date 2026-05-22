-- MediGuide Seed Data
-- Run: psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql
-- Or via Supabase Dashboard → SQL Editor

-- ─── Symptoms ────────────────────────────────────────────────
INSERT INTO public.symptoms (name, body_part, severity_level, is_emergency, description) VALUES
  ('Headache',              'head',           'moderate', false, 'Pain or discomfort in the head'),
  ('Migraine',              'head',           'severe',   false, 'Intense throbbing headache, often with nausea'),
  ('Dizziness',             'head',           'moderate', false, 'Feeling of unsteadiness or spinning'),
  ('Confusion',             'head',           'severe',   true,  'Difficulty thinking clearly'),
  ('Blurred Vision',        'eyes',           'moderate', false, 'Unclear or fuzzy vision'),
  ('Eye Redness',           'eyes',           'mild',     false, 'Red or pink appearance of the eyes'),
  ('Runny Nose',            'throat',         'mild',     false, 'Excess mucus draining from nasal passages'),
  ('Sore Throat',           'throat',         'mild',     false, 'Pain or irritation in the throat'),
  ('Difficulty Swallowing', 'throat',         'moderate', false, 'Pain or difficulty when swallowing'),
  ('Chest Pain',            'chest',          'severe',   true,  'Pain or discomfort in the chest area'),
  ('Shortness of Breath',   'chest',          'severe',   true,  'Difficulty breathing or feeling breathless'),
  ('Cough',                 'chest',          'mild',     false, 'Repeated clearing of airway'),
  ('Wheezing',              'chest',          'moderate', false, 'High-pitched whistling sound when breathing'),
  ('Heart Palpitations',    'chest',          'moderate', true,  'Feeling of rapid, fluttering or pounding heartbeat'),
  ('Nausea',                'abdomen',        'moderate', false, 'Feeling of sickness with urge to vomit'),
  ('Vomiting',              'abdomen',        'moderate', false, 'Forcible ejection of stomach contents'),
  ('Abdominal Pain',        'abdomen',        'moderate', false, 'Pain in the stomach area'),
  ('Diarrhea',              'abdomen',        'moderate', false, 'Loose, watery stools'),
  ('Constipation',          'abdomen',        'mild',     false, 'Difficulty passing stools'),
  ('Bloating',              'abdomen',        'mild',     false, 'Feeling of fullness or swelling in the abdomen'),
  ('Skin Rash',             'skin',           'mild',     false, 'Area of irritated or swollen skin'),
  ('Itching',               'skin',           'mild',     false, 'Uncomfortable sensation causing desire to scratch'),
  ('Hives',                 'skin',           'moderate', false, 'Raised, itchy welts on the skin'),
  ('Jaundice',              'skin',           'severe',   true,  'Yellowing of the skin and whites of eyes'),
  ('Joint Pain',            'musculoskeletal','moderate', false, 'Discomfort in any joint'),
  ('Back Pain',             'musculoskeletal','moderate', false, 'Pain in the back region'),
  ('Muscle Weakness',       'musculoskeletal','moderate', false, 'Reduced strength in one or more muscles'),
  ('Swelling',              'musculoskeletal','moderate', false, 'Increase in size due to fluid accumulation'),
  ('Fatigue',               'general',        'moderate', false, 'Extreme tiredness or lack of energy'),
  ('Fever',                 'general',        'moderate', false, 'Body temperature above normal range (>38°C)'),
  ('Chills',                'general',        'mild',     false, 'Feeling of coldness with shivering'),
  ('Sweating',              'general',        'mild',     false, 'Excessive perspiration'),
  ('Weight Loss',           'general',        'moderate', false, 'Unintentional decrease in body weight'),
  ('Appetite Loss',         'general',        'mild',     false, 'Reduced desire to eat'),
  ('Night Sweats',          'general',        'moderate', false, 'Excessive sweating during sleep'),
  ('Numbness',              'neurological',   'moderate', false, 'Loss of sensation in a body part'),
  ('Tingling',              'neurological',   'mild',     false, 'Pins-and-needles sensation'),
  ('Memory Problems',       'neurological',   'moderate', false, 'Difficulty remembering things'),
  ('Anxiety',               'neurological',   'moderate', false, 'Feeling of worry, nervousness, or unease'),
  ('Insomnia',              'neurological',   'moderate', false, 'Persistent problems falling or staying asleep'),
  ('Frequent Urination',    'abdomen',        'mild',     false, 'Needing to urinate more often than usual'),
  ('Burning Urination',     'abdomen',        'moderate', false, 'Pain or burning sensation during urination'),
  ('High Blood Pressure',   'chest',          'moderate', true,  'Blood pressure consistently above 140/90 mmHg'),
  ('Excessive Thirst',      'general',        'moderate', false, 'Feeling thirsty even after drinking'),
  ('Dry Mouth',             'throat',         'mild',     false, 'Lack of sufficient saliva in the mouth'),
  ('Pale Skin',             'skin',           'moderate', false, 'Abnormally light or white skin color'),
  ('Rapid Breathing',       'chest',          'severe',   true,  'Breathing faster than normal'),
  ('Loss of Smell',         'throat',         'mild',     false, 'Inability to detect odors'),
  ('Muscle Aches',          'musculoskeletal','moderate', false, 'General pain and soreness in muscles'),
  ('Ear Pain',              'throat',         'mild',     false, 'Pain in or around the ear')
ON CONFLICT (name) DO NOTHING;

-- ─── Diseases ────────────────────────────────────────────────
INSERT INTO public.diseases (name, description, specialty, severity, precautions, symptoms_required, is_chronic) VALUES
  ('Common Cold',
   'A viral infection of the upper respiratory tract caused by rhinoviruses.',
   'General Medicine', 'low',
   ARRAY['Rest', 'Stay hydrated', 'Use nasal decongestants', 'Avoid spreading to others'],
   2, false),

  ('Influenza (Flu)',
   'A contagious respiratory illness caused by influenza viruses affecting nose, throat, and lungs.',
   'General Medicine', 'medium',
   ARRAY['Get annual flu vaccine', 'Rest and stay hydrated', 'Antiviral medications if prescribed'],
   3, false),

  ('Migraine',
   'A neurological condition causing intense, debilitating headaches often with nausea and light sensitivity.',
   'Neurology', 'medium',
   ARRAY['Avoid triggers', 'Stay in a dark quiet room', 'Take prescribed medications early', 'Manage stress'],
   2, true),

  ('Hypertension',
   'High blood pressure — a condition where the force of blood against artery walls is too high.',
   'Cardiology', 'high',
   ARRAY['Reduce salt intake', 'Exercise regularly', 'Take medications as prescribed', 'Monitor BP daily', 'Avoid alcohol'],
   2, true),

  ('Diabetes Type 2',
   'A condition where blood sugar levels are too high due to insulin resistance.',
   'Endocrinology', 'high',
   ARRAY['Monitor blood sugar', 'Follow a low-carb diet', 'Exercise regularly', 'Take medications as prescribed'],
   2, true),

  ('Asthma',
   'A chronic condition where airways narrow and swell, producing extra mucus.',
   'Pulmonology', 'medium',
   ARRAY['Use prescribed inhaler', 'Avoid triggers', 'Monitor peak flow', 'Keep rescue inhaler available'],
   2, true),

  ('Allergic Rhinitis',
   'Inflammation of the nasal passages caused by allergens such as pollen, dust, or animal dander.',
   'ENT', 'low',
   ARRAY['Avoid allergens', 'Use antihistamines', 'Keep windows closed during high pollen', 'Use air purifiers'],
   2, false),

  ('Gastritis',
   'Inflammation of the stomach lining, often caused by H. pylori infection or NSAIDs use.',
   'Gastroenterology', 'medium',
   ARRAY['Avoid spicy food', 'Take prescribed antacids', 'Avoid NSAIDs', 'Eat smaller meals'],
   2, false),

  ('Urinary Tract Infection (UTI)',
   'An infection in any part of the urinary system — kidneys, bladder, ureters, or urethra.',
   'General Medicine', 'medium',
   ARRAY['Drink plenty of water', 'Complete the antibiotic course', 'Urinate after intercourse', 'Avoid irritants'],
   2, false),

  ('COVID-19',
   'A contagious respiratory illness caused by the SARS-CoV-2 coronavirus.',
   'Pulmonology', 'high',
   ARRAY['Isolate from others', 'Rest and stay hydrated', 'Monitor oxygen levels', 'Seek emergency care if breathing worsens'],
   3, false),

  ('Dengue Fever',
   'A mosquito-borne viral infection causing high fever, severe headache, and joint pain.',
   'General Medicine', 'high',
   ARRAY['Rest completely', 'Drink plenty of fluids', 'Monitor platelet count', 'Seek immediate care if bleeding occurs'],
   3, false),

  ('Anemia',
   'A condition where red blood cells or hemoglobin is lower than normal, reducing oxygen delivery.',
   'General Medicine', 'medium',
   ARRAY['Eat iron-rich foods', 'Take prescribed iron supplements', 'Get regular blood tests', 'Address underlying cause'],
   2, false),

  ('Bronchitis',
   'Inflammation of the bronchial tubes, usually caused by a viral infection.',
   'Pulmonology', 'medium',
   ARRAY['Rest', 'Stay hydrated', 'Use a humidifier', 'Avoid smoke and irritants'],
   2, false),

  ('Pneumonia',
   'An infection that inflames air sacs in one or both lungs, which may fill with fluid.',
   'Pulmonology', 'high',
   ARRAY['Complete antibiotic course', 'Rest and stay hydrated', 'Use prescribed medications', 'Follow up with doctor'],
   3, false),

  ('Thyroid Disorder',
   'Conditions affecting the thyroid gland function including hypothyroidism and hyperthyroidism.',
   'Endocrinology', 'medium',
   ARRAY['Take thyroid medication as prescribed', 'Regular TSH monitoring', 'Maintain a balanced diet'],
   2, true)

ON CONFLICT (name) DO NOTHING;

-- ─── Disease-Symptom Mappings ─────────────────────────────────
-- Common Cold
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Runny Nose' THEN 4.0
    WHEN 'Sore Throat' THEN 3.5
    WHEN 'Cough' THEN 3.0
    WHEN 'Fever' THEN 2.5
    WHEN 'Fatigue' THEN 2.0
    WHEN 'Headache' THEN 1.5
  END AS weight,
  s.name IN ('Runny Nose', 'Sore Throat') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Common Cold'
  AND s.name IN ('Runny Nose', 'Sore Throat', 'Cough', 'Fever', 'Fatigue', 'Headache')
ON CONFLICT DO NOTHING;

-- Influenza
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Fever' THEN 4.5
    WHEN 'Muscle Aches' THEN 4.0
    WHEN 'Fatigue' THEN 3.5
    WHEN 'Cough' THEN 3.0
    WHEN 'Headache' THEN 2.5
    WHEN 'Chills' THEN 2.5
    WHEN 'Sore Throat' THEN 2.0
  END AS weight,
  s.name IN ('Fever', 'Muscle Aches') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Influenza (Flu)'
  AND s.name IN ('Fever', 'Muscle Aches', 'Fatigue', 'Cough', 'Headache', 'Chills', 'Sore Throat')
ON CONFLICT DO NOTHING;

-- COVID-19
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Fever' THEN 4.0
    WHEN 'Cough' THEN 4.0
    WHEN 'Shortness of Breath' THEN 4.5
    WHEN 'Loss of Smell' THEN 4.5
    WHEN 'Fatigue' THEN 3.0
    WHEN 'Muscle Aches' THEN 2.5
    WHEN 'Headache' THEN 2.0
    WHEN 'Sore Throat' THEN 2.0
  END AS weight,
  s.name IN ('Loss of Smell', 'Shortness of Breath') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'COVID-19'
  AND s.name IN ('Fever', 'Cough', 'Shortness of Breath', 'Loss of Smell', 'Fatigue', 'Muscle Aches', 'Headache', 'Sore Throat')
ON CONFLICT DO NOTHING;

-- Migraine
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Headache' THEN 5.0
    WHEN 'Nausea' THEN 3.5
    WHEN 'Blurred Vision' THEN 3.0
    WHEN 'Vomiting' THEN 2.5
    WHEN 'Dizziness' THEN 2.0
  END AS weight,
  s.name IN ('Headache') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Migraine'
  AND s.name IN ('Headache', 'Nausea', 'Blurred Vision', 'Vomiting', 'Dizziness')
ON CONFLICT DO NOTHING;

-- Hypertension
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'High Blood Pressure' THEN 5.0
    WHEN 'Headache' THEN 3.0
    WHEN 'Dizziness' THEN 3.0
    WHEN 'Heart Palpitations' THEN 2.5
    WHEN 'Shortness of Breath' THEN 2.0
  END AS weight,
  s.name IN ('High Blood Pressure') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Hypertension'
  AND s.name IN ('High Blood Pressure', 'Headache', 'Dizziness', 'Heart Palpitations', 'Shortness of Breath')
ON CONFLICT DO NOTHING;

-- Diabetes Type 2
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Excessive Thirst' THEN 4.5
    WHEN 'Frequent Urination' THEN 4.5
    WHEN 'Fatigue' THEN 3.0
    WHEN 'Blurred Vision' THEN 3.0
    WHEN 'Weight Loss' THEN 2.5
    WHEN 'Numbness' THEN 2.0
  END AS weight,
  s.name IN ('Excessive Thirst', 'Frequent Urination') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Diabetes Type 2'
  AND s.name IN ('Excessive Thirst', 'Frequent Urination', 'Fatigue', 'Blurred Vision', 'Weight Loss', 'Numbness')
ON CONFLICT DO NOTHING;

-- Asthma
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Wheezing' THEN 5.0
    WHEN 'Shortness of Breath' THEN 4.5
    WHEN 'Cough' THEN 3.5
    WHEN 'Chest Pain' THEN 2.5
    WHEN 'Fatigue' THEN 1.5
  END AS weight,
  s.name IN ('Wheezing', 'Shortness of Breath') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Asthma'
  AND s.name IN ('Wheezing', 'Shortness of Breath', 'Cough', 'Chest Pain', 'Fatigue')
ON CONFLICT DO NOTHING;

-- UTI
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Burning Urination' THEN 5.0
    WHEN 'Frequent Urination' THEN 4.5
    WHEN 'Fever' THEN 2.5
    WHEN 'Abdominal Pain' THEN 2.0
  END AS weight,
  s.name IN ('Burning Urination', 'Frequent Urination') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Urinary Tract Infection (UTI)'
  AND s.name IN ('Burning Urination', 'Frequent Urination', 'Fever', 'Abdominal Pain')
ON CONFLICT DO NOTHING;

-- Dengue
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Fever' THEN 5.0
    WHEN 'Joint Pain' THEN 4.5
    WHEN 'Skin Rash' THEN 4.0
    WHEN 'Muscle Aches' THEN 3.5
    WHEN 'Headache' THEN 3.0
    WHEN 'Vomiting' THEN 2.0
    WHEN 'Fatigue' THEN 2.0
  END AS weight,
  s.name IN ('Fever', 'Joint Pain', 'Skin Rash') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Dengue Fever'
  AND s.name IN ('Fever', 'Joint Pain', 'Skin Rash', 'Muscle Aches', 'Headache', 'Vomiting', 'Fatigue')
ON CONFLICT DO NOTHING;

-- Anemia
INSERT INTO public.disease_symptoms (disease_id, symptom_id, weight, is_primary)
SELECT d.id, s.id,
  CASE s.name
    WHEN 'Fatigue' THEN 4.5
    WHEN 'Pale Skin' THEN 4.5
    WHEN 'Shortness of Breath' THEN 3.5
    WHEN 'Dizziness' THEN 3.0
    WHEN 'Headache' THEN 2.0
    WHEN 'Appetite Loss' THEN 1.5
  END AS weight,
  s.name IN ('Fatigue', 'Pale Skin') AS is_primary
FROM public.diseases d, public.symptoms s
WHERE d.name = 'Anemia'
  AND s.name IN ('Fatigue', 'Pale Skin', 'Shortness of Breath', 'Dizziness', 'Headache', 'Appetite Loss')
ON CONFLICT DO NOTHING;

-- ─── Doctor Specialties (disease → specialty mapping) ─────────
INSERT INTO public.doctor_specialties (disease_id, specialty, priority)
SELECT d.id, unnest.specialty, unnest.priority
FROM public.diseases d,
LATERAL (VALUES
  ('Common Cold',               'General Medicine',   1),
  ('Influenza (Flu)',           'General Medicine',   1),
  ('COVID-19',                  'Pulmonology',        1),
  ('COVID-19',                  'General Medicine',   2),
  ('Migraine',                  'Neurology',          1),
  ('Migraine',                  'General Medicine',   2),
  ('Hypertension',              'Cardiology',         1),
  ('Hypertension',              'General Medicine',   2),
  ('Diabetes Type 2',           'Endocrinology',      1),
  ('Diabetes Type 2',           'General Medicine',   2),
  ('Asthma',                    'Pulmonology',        1),
  ('Asthma',                    'General Medicine',   2),
  ('Allergic Rhinitis',         'ENT',                1),
  ('Gastritis',                 'Gastroenterology',   1),
  ('Gastritis',                 'General Medicine',   2),
  ('Urinary Tract Infection (UTI)', 'General Medicine', 1),
  ('Dengue Fever',              'General Medicine',   1),
  ('Anemia',                    'General Medicine',   1),
  ('Bronchitis',                'Pulmonology',        1),
  ('Pneumonia',                 'Pulmonology',        1),
  ('Thyroid Disorder',          'Endocrinology',      1)
) AS unnest(disease_name, specialty, priority)
WHERE d.name = unnest.disease_name
ON CONFLICT DO NOTHING;
