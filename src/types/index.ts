// Tipos para la aplicación de fitness tracking

export interface WeightEntry {
  id?: string;
  date: string;
  weight: number;
  bodyFat?: number;
  notes?: string;
}

export interface WorkoutEntry {
  id?: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  sets?: number;
  notes?: string;
}

export interface HabitEntry {
  id?: string;
  date: string;
  sleep: boolean;
  water: boolean;
  cardio: boolean;
  notes?: string;
}

export interface ProgressPhoto {
  id?: string;
  date: string;
  url: string;
  description?: string;
}

export interface DashboardData {
  currentWeight: number;
  currentBodyFat?: number;
  bmi: number;
  progressPercentage: number;
  targetWeight: number;
  oneRepMax: {
    bench: number;
    squat: number;
    deadlift: number;
  };
  personalRecords: {
    exercise: string;
    weight: number;
    reps: number;
    date: string;
  }[];
  habitsCompliance: number;
  recentPhotos: ProgressPhoto[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

