import React, { createContext, useContext, useState } from 'react';

interface Symptom {
  id: number;
  name: string;
  body_part: string;
  severity_level: string;
  is_emergency: boolean;
}

interface Prediction {
  disease_id: number;
  disease_name: string;
  confidence: number;
  specialty: string;
}

interface HealthContextValue {
  selectedSymptoms: number[];
  predictions: Prediction[];
  setSelectedSymptoms: (ids: number[]) => void;
  setPredictions: (predictions: Prediction[]) => void;
  clearSession: () => void;
}

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const clearSession = () => {
    setSelectedSymptoms([]);
    setPredictions([]);
  };

  return (
    <HealthContext.Provider value={{ selectedSymptoms, predictions, setSelectedSymptoms, setPredictions, clearSession }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealthContext() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error('useHealthContext must be used within HealthProvider');
  return ctx;
}
